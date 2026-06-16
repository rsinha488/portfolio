"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";

interface TimelineItem {
    _id: string;
    year: string;
    title: string;
    company: string;
    description: string;
    type: "experience" | "education";
    order: number;
}

type FormData = Omit<TimelineItem, "_id">;

function TimelineForm({
    initialData,
    onSuccess,
}: {
    initialData?: TimelineItem | null;
    onSuccess: () => void;
}) {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
        defaultValues: initialData ?? {
            year: "",
            title: "",
            company: "",
            description: "",
            type: "experience",
            order: 0,
        },
    });

    const onSubmit = async (data: FormData) => {
        if (initialData) {
            await api.put(`/timeline/${initialData._id}`, data);
        } else {
            await api.post("/timeline", data);
        }
        onSuccess();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <Label>Year</Label>
                    <Input placeholder="2024" {...register("year", { required: true })} />
                    {errors.year && <p className="text-xs text-red-500">Required</p>}
                </div>
                <div className="space-y-1">
                    <Label>Type</Label>
                    <select
                        {...register("type", { required: true })}
                        className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                    >
                        <option value="experience">Experience</option>
                        <option value="education">Education</option>
                    </select>
                </div>
            </div>

            <div className="space-y-1">
                <Label>Title</Label>
                <Input placeholder="Senior Developer" {...register("title", { required: true })} />
                {errors.title && <p className="text-xs text-red-500">Required</p>}
            </div>

            <div className="space-y-1">
                <Label>Company / Institution</Label>
                <Input placeholder="TechCorp" {...register("company", { required: true })} />
                {errors.company && <p className="text-xs text-red-500">Required</p>}
            </div>

            <div className="space-y-1">
                <Label>Description</Label>
                <Textarea
                    placeholder="What did you do here?"
                    rows={3}
                    {...register("description", { required: true })}
                />
                {errors.description && <p className="text-xs text-red-500">Required</p>}
            </div>

            <div className="space-y-1">
                <Label>Display Order</Label>
                <Input
                    type="number"
                    placeholder="1"
                    {...register("order", { valueAsNumber: true })}
                />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : initialData ? "Update Entry" : "Add Entry"}
            </Button>
        </form>
    );
}

export default function TimelinePage() {
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<TimelineItem | null>(null);

    const { data: timeline, isLoading } = useQuery({
        queryKey: ["timeline"],
        queryFn: async () => {
            const res = await api.get("/timeline");
            return res.data as TimelineItem[];
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/timeline/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["timeline"] });
        },
    });

    const handleDelete = (id: string) => {
        if (!confirm("Delete this entry?")) return;
        deleteMutation.mutate(id);
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Professional Journey</h2>
                <Dialog open={open} onOpenChange={(val) => { setOpen(val); if (!val) setEditing(null); }}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Add Entry
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[520px]">
                        <DialogHeader>
                            <DialogTitle>{editing ? "Edit Entry" : "Add New Entry"}</DialogTitle>
                        </DialogHeader>
                        <TimelineForm
                            initialData={editing}
                            onSuccess={() => {
                                setOpen(false);
                                setEditing(null);
                                queryClient.invalidateQueries({ queryKey: ["timeline"] });
                            }}
                        />
                    </DialogContent>
                </Dialog>
            </div>

            {/* List */}
            <div className="space-y-4">
                {timeline?.length === 0 && (
                    <p className="text-gray-500 text-center py-12">No entries yet. Add your first milestone!</p>
                )}
                {timeline?.map((item) => (
                    <Card key={item._id}>
                        <CardHeader className="pb-2">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <Badge variant={item.type === "education" ? "secondary" : "default"}>
                                        {item.type}
                                    </Badge>
                                    <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                                        {item.year}
                                    </span>
                                </div>
                                <div className="flex gap-2 shrink-0">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => { setEditing(item); setOpen(true); }}
                                    >
                                        <Pencil className="h-4 w-4 mr-1" /> Edit
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleDelete(item._id)}
                                    >
                                        <Trash className="h-4 w-4 mr-1" /> Delete
                                    </Button>
                                </div>
                            </div>
                            <CardTitle className="text-lg">{item.title}</CardTitle>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{item.company}</p>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-600 dark:text-gray-300">{item.description}</p>
                            <p className="text-xs text-gray-400 mt-2">Order: {item.order}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

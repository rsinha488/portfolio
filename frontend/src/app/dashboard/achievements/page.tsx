"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";

interface Achievement {
    _id: string;
    text: string;
    order: number;
}

function AchievementForm({ initialData, onSuccess }: { initialData?: Achievement | null; onSuccess: () => void }) {
    const { register, handleSubmit, formState: { isSubmitting } } = useForm({
        defaultValues: { text: initialData?.text ?? "", order: initialData?.order ?? 0 },
    });

    const onSubmit = async (data: any) => {
        const payload = { ...data, order: Number(data.order) };
        try {
            if (initialData) {
                await api.put(`/achievements/${initialData._id}`, payload);
            } else {
                await api.post("/achievements", payload);
            }
            onSuccess();
        } catch (err: any) {
            alert(err.response?.data?.message || "Failed to save achievement");
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
                <Label htmlFor="text">Achievement Description</Label>
                <Textarea 
                    id="text"
                    placeholder="Describe the achievement..."
                    rows={4}
                    {...register("text", { required: true, minLength: 5 })}
                />
            </div>
            <div className="space-y-1">
                <Label htmlFor="order">Display Order</Label>
                <Input id="order" type="number" {...register("order")} />
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : initialData ? "Update Achievement" : "Create Achievement"}
            </Button>
        </form>
    );
}

export default function AchievementsPage() {
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Achievement | null>(null);
    const queryClient = useQueryClient();

    const { data: achievements, isLoading } = useQuery({
        queryKey: ["achievements"],
        queryFn: async () => (await api.get("/achievements")).data as Achievement[],
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => api.delete(`/achievements/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["achievements"] });
        },
        onError: (err: any) => {
            alert(err.response?.data?.message || "Failed to delete achievement");
        }
    });

    if (isLoading) return <div className="p-8">Loading achievements...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Key Achievements</h2>
                <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setEditing(null); }}>
                    <DialogTrigger asChild>
                        <Button><Plus className="mr-2 h-4 w-4" /> Add Achievement</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[480px]">
                        <DialogHeader>
                            <DialogTitle>{editing ? "Edit Achievement" : "Add Achievement"}</DialogTitle>
                        </DialogHeader>
                        <AchievementForm initialData={editing} onSuccess={() => {
                            setOpen(false); setEditing(null);
                            queryClient.invalidateQueries({ queryKey: ["achievements"] });
                        }} />
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                {achievements?.map((achievement) => (
                    <Card key={achievement._id} className="bg-card text-card-foreground border-border">
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">Display Order: {achievement.order}</span>
                                <div className="flex gap-1">
                                    <Button variant="outline" size="sm" onClick={() => { setEditing(achievement); setOpen(true); }}>
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button variant="destructive" size="sm" onClick={() => {
                                        if (confirm("Are you sure you want to delete this achievement?")) {
                                            deleteMutation.mutate(achievement._id);
                                        }
                                    }}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed font-medium">
                                {achievement.text}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

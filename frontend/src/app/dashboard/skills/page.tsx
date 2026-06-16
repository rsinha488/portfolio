"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { Badge } from "@/components/ui/badge";

interface Skill {
    _id: string;
    category: string;
    items: string[];
    order: number;
}

function SkillForm({ initialData, onSuccess }: { initialData?: Skill | null; onSuccess: () => void }) {
    const [itemInput, setItemInput] = useState("");
    const [items, setItems] = useState<string[]>(initialData?.items ?? []);
    const { register, handleSubmit, formState: { isSubmitting } } = useForm({
        defaultValues: { category: initialData?.category ?? "", order: initialData?.order ?? 0 },
    });

    const addItem = () => {
        const val = itemInput.trim();
        if (val && !items.includes(val)) setItems([...items, val]);
        setItemInput("");
    };

    const removeItem = (item: string) => setItems(items.filter((i) => i !== item));

    const onSubmit = async (data: any) => {
        const payload = { ...data, items, order: Number(data.order) };
        if (initialData) {
            await api.put(`/skills/${initialData._id}`, payload);
        } else {
            await api.post("/skills", payload);
        }
        onSuccess();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <Label>Category</Label>
                    <Input placeholder="Frontend" {...register("category", { required: true })} />
                </div>
                <div className="space-y-1">
                    <Label>Display Order</Label>
                    <Input type="number" {...register("order")} />
                </div>
            </div>
            <div className="space-y-2">
                <Label>Skills</Label>
                <div className="flex gap-2">
                    <Input
                        placeholder="e.g. React"
                        value={itemInput}
                        onChange={(e) => setItemInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addItem(); } }}
                    />
                    <Button type="button" variant="outline" onClick={addItem}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2 min-h-[36px] p-2 border rounded-md">
                    {items.map((item) => (
                        <Badge key={item} variant="secondary" className="gap-1">
                            {item}
                            <X className="h-3 w-3 cursor-pointer" onClick={() => removeItem(item)} />
                        </Badge>
                    ))}
                </div>
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting || items.length === 0}>
                {isSubmitting ? "Saving..." : initialData ? "Update" : "Create"}
            </Button>
        </form>
    );
}

export default function SkillsPage() {
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Skill | null>(null);
    const queryClient = useQueryClient();

    const { data: skills, isLoading } = useQuery({
        queryKey: ["skills-admin"],
        queryFn: async () => (await api.get("/skills")).data as Skill[],
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => api.delete(`/skills/${id}`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["skills-admin"] }),
    });

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Skills</h2>
                <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setEditing(null); }}>
                    <DialogTrigger asChild>
                        <Button><Plus className="mr-2 h-4 w-4" /> Add Category</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[480px]">
                        <DialogHeader>
                            <DialogTitle>{editing ? "Edit Skill Category" : "Add Skill Category"}</DialogTitle>
                        </DialogHeader>
                        <SkillForm initialData={editing} onSuccess={() => {
                            setOpen(false); setEditing(null);
                            queryClient.invalidateQueries({ queryKey: ["skills-admin"] });
                        }} />
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {skills?.map((skill) => (
                    <Card key={skill._id}>
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg text-blue-600 dark:text-blue-400">{skill.category}</CardTitle>
                                <div className="flex gap-1">
                                    <Button variant="outline" size="sm" onClick={() => { setEditing(skill); setOpen(true); }}>
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button variant="destructive" size="sm" onClick={() => {
                                        if (confirm("Delete this category?")) deleteMutation.mutate(skill._id);
                                    }}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {skill.items.map((item) => (
                                    <Badge key={item} variant="secondary">{item}</Badge>
                                ))}
                            </div>
                            <p className="text-xs text-gray-400 mt-2">Order: {skill.order}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

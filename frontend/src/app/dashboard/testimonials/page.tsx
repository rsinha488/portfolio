"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { useAuth } from "@/context/AuthContext";

interface Testimonial {
    _id: string;
    name: string;
    role: string;
    company: string;
    content: string;
    rating: number;
    featured: boolean;
}

type FormData = Omit<Testimonial, "_id">;

function TestimonialForm({ initialData, onSuccess }: { initialData?: Testimonial | null; onSuccess: () => void }) {
    const { register, handleSubmit, formState: { isSubmitting } } = useForm<FormData>({
        defaultValues: initialData ?? { name: "", role: "", company: "", content: "", rating: 5, featured: true },
    });

    const onSubmit = async (data: FormData) => {
        if (initialData) {
            await api.put(`/testimonials/${initialData._id}`, data);
        } else {
            await api.post("/testimonials", data);
        }
        onSuccess();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
                <Label>Name</Label>
                <Input placeholder="John Doe" {...register("name", { required: true })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <Label>Role</Label>
                    <Input placeholder="CEO" {...register("role", { required: true })} />
                </div>
                <div className="space-y-1">
                    <Label>Company</Label>
                    <Input placeholder="Acme Inc" {...register("company")} />
                </div>
            </div>
            <div className="space-y-1">
                <Label>Testimonial</Label>
                <Textarea placeholder="What they said..." rows={3} {...register("content", { required: true })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <Label>Rating (1-5)</Label>
                    <Input type="number" min="1" max="5" {...register("rating", { valueAsNumber: true })} />
                </div>
                <div className="flex items-center gap-2 pt-6">
                    <input type="checkbox" id="featured" {...register("featured")} />
                    <Label htmlFor="featured">Featured on site</Label>
                </div>
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : initialData ? "Update" : "Create"}
            </Button>
        </form>
    );
}

export default function TestimonialsPage() {
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Testimonial | null>(null);
    const { user } = useAuth();
    const isAdmin = user?.role === "admin";
    const queryClient = useQueryClient();

    const { data: testimonials, isLoading } = useQuery({
        queryKey: ["testimonials-admin"],
        queryFn: async () => (await api.get("/testimonials/all")).data as Testimonial[],
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => api.delete(`/testimonials/${id}`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["testimonials-admin"] }),
    });

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Testimonials</h2>
                <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setEditing(null); }}>
                    {isAdmin && (
                        <DialogTrigger asChild>
                            <Button><Plus className="mr-2 h-4 w-4" /> Add Testimonial</Button>
                        </DialogTrigger>
                    )}
                    <DialogContent className="sm:max-w-[520px]">
                        <DialogHeader>
                            <DialogTitle>{editing ? "Edit Testimonial" : "Add Testimonial"}</DialogTitle>
                        </DialogHeader>
                        <TestimonialForm initialData={editing} onSuccess={() => {
                            setOpen(false); setEditing(null);
                            queryClient.invalidateQueries({ queryKey: ["testimonials-admin"] });
                        }} />
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {testimonials?.map((item) => (
                    <Card key={item._id}>
                        <CardHeader className="pb-2">
                            <div className="flex items-start justify-between">
                                <CardTitle className="text-lg">{item.name}</CardTitle>
                                <div className="flex gap-1 shrink-0">
                                    {isAdmin && (
                                        <>
                                            <Button variant="outline" size="sm" onClick={() => { setEditing(item); setOpen(true); }}>
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button variant="destructive" size="sm" onClick={() => {
                                                if (confirm("Delete?")) deleteMutation.mutate(item._id);
                                            }}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                            <p className="text-sm text-gray-500">{item.role}{item.company ? ` @ ${item.company}` : ""}</p>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-600 dark:text-gray-300 italic line-clamp-3">"{item.content}"</p>
                            <div className="mt-2 flex items-center justify-between">
                                <div className="flex gap-0.5">
                                    {Array.from({ length: item.rating }).map((_, i) => (
                                        <span key={i} className="text-yellow-400 text-sm">★</span>
                                    ))}
                                </div>
                                {item.featured && <span className="text-xs text-green-500">Featured</span>}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

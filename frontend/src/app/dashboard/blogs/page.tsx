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

interface Blog {
    _id: string;
    title: string;
    excerpt: string;
    content: string;
    published: boolean;
    createdAt: string;
    slug: string;
}

type FormData = { title: string; excerpt: string; content: string; published: boolean };

function BlogForm({ initialData, onSuccess }: { initialData?: Blog | null; onSuccess: () => void }) {
    const { register, handleSubmit, formState: { isSubmitting } } = useForm<FormData>({
        defaultValues: initialData ?? { title: "", excerpt: "", content: "", published: true },
    });

    const onSubmit = async (data: FormData) => {
        if (initialData) {
            await api.put(`/blogs/${initialData._id}`, data);
        } else {
            await api.post("/blogs", data);
        }
        onSuccess();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
                <Label>Title</Label>
                <Input placeholder="Blog title" {...register("title", { required: true })} />
            </div>
            <div className="space-y-1">
                <Label>Excerpt</Label>
                <Textarea placeholder="Short summary" rows={2} {...register("excerpt", { required: true })} />
            </div>
            <div className="space-y-1">
                <Label>Content (Markdown supported)</Label>
                <Textarea placeholder="Full content" className="min-h-[200px]" {...register("content", { required: true })} />
            </div>
            <div className="flex items-center gap-2">
                <input type="checkbox" id="published" {...register("published")} />
                <Label htmlFor="published">Published</Label>
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : initialData ? "Update" : "Publish"}
            </Button>
        </form>
    );
}

export default function BlogsPage() {
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Blog | null>(null);
    const { user } = useAuth();
    const isAdmin = user?.role === "admin";
    const queryClient = useQueryClient();

    const { data: blogs, isLoading } = useQuery({
        queryKey: ["blogs-admin"],
        queryFn: async () => (await api.get("/blogs/all")).data as Blog[],
        enabled: !!user, // Wait for user to be loaded
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => api.delete(`/blogs/${id}`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["blogs-admin"] }),
    });

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Blogs</h2>
                <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setEditing(null); }}>
                    {isAdmin && (
                        <DialogTrigger asChild>
                            <Button><Plus className="mr-2 h-4 w-4" /> Write Blog</Button>
                        </DialogTrigger>
                    )}
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>{editing ? "Edit Blog" : "New Blog Post"}</DialogTitle>
                        </DialogHeader>
                        <BlogForm initialData={editing} onSuccess={() => {
                            setOpen(false); setEditing(null);
                            queryClient.invalidateQueries({ queryKey: ["blogs-admin"] });
                        }} />
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                {blogs?.map((blog) => (
                    <Card key={blog._id}>
                        <CardHeader className="pb-2">
                            <div className="flex items-start justify-between gap-2">
                                <CardTitle className="text-lg font-medium line-clamp-1">{blog.title}</CardTitle>
                                <div className="flex gap-1 shrink-0">
                                    {isAdmin && (
                                        <>
                                            <Button variant="outline" size="sm" onClick={() => { setEditing(blog); setOpen(true); }}>
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button variant="destructive" size="sm" onClick={() => {
                                                if (confirm("Delete this blog?")) deleteMutation.mutate(blog._id);
                                            }}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-500 line-clamp-2 mb-2">{blog.excerpt}</p>
                            <div className="flex justify-between items-center text-xs text-gray-400">
                                <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                                <span className={blog.published ? "text-green-500" : "text-yellow-500"}>
                                    {blog.published ? "Published" : "Draft"}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

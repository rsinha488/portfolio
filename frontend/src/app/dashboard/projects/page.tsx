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
import ProjectForm from "@/components/dashboard/project-form";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ProjectsPage() {
    const queryClient = useQueryClient();

    const [open, setOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<any | null>(null);

    /* =========================
       FETCH PROJECTS
    ========================= */
    const { data: projects, isLoading } = useQuery({
        queryKey: ["projects"],
        queryFn: async () => {
            const res = await api.get("/projects");
            return res.data;
        },
    });

    /* =========================
       DELETE PROJECT
    ========================= */
    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/projects/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["projects"] });
        },
    });

    const handleDelete = (id: string) => {
        if (!confirm("Are you sure you want to delete this project?")) return;
        deleteMutation.mutate(id);
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Projects</h2>

                <Dialog
                    open={open}
                    onOpenChange={(val) => {
                        setOpen(val);
                        if (!val) setEditingProject(null);
                    }}
                >
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Add Project
                        </Button>
                    </DialogTrigger>

                    <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>
                                {editingProject ? "Edit Project" : "Add New Project"}
                            </DialogTitle>
                        </DialogHeader>

                        <ProjectForm
                            initialData={editingProject}
                            onSuccess={() => {
                                setOpen(false);
                                setEditingProject(null);
                                queryClient.invalidateQueries({ queryKey: ["projects"] });
                            }}
                        />

                    </DialogContent>
                </Dialog>
            </div>

            {/* PROJECT LIST */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {projects?.map((project: any) => (
                    <Card key={project._id} className="relative">
                        <CardHeader className="space-y-2">
                            <div className="flex justify-between items-start">
                                <CardTitle>{project.title}</CardTitle>

                                {/* STATUS */}
                                {project.status === "working" && (
                                    <Badge variant="secondary">Currently Working</Badge>
                                )}
                            </div>
                        </CardHeader>

                        <CardContent>
                            {project.images?.[0]?.url && (
                                <img
                                    src={project.images[0].url}
                                    alt={project.title}
                                    className="w-full h-48 object-cover rounded-md mb-4"
                                />
                            )}

                            <p className="text-sm text-gray-500 line-clamp-3">
                                {project.description}
                            </p>

                            {/* TECH STACK */}
                            <div className="mt-4 flex flex-wrap gap-2">
                                {project.technologies?.map((tech: string) => (
                                    <span
                                        key={tech}
                                        className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-md text-xs"
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>

                            {/* ACTIONS */}
                            <div className="mt-4 flex justify-end gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        setEditingProject(project);
                                        setOpen(true);
                                    }}
                                >
                                    <Pencil className="h-4 w-4 mr-1" />
                                    Edit
                                </Button>

                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleDelete(project._id)}
                                >
                                    <Trash className="h-4 w-4 mr-1" />
                                    Delete
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

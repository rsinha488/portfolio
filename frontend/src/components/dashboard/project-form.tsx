"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ImageUpload from "@/components/ui/image-upload";
import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const formSchema = z.object({
    title: z.string().min(2),
    description: z.string().min(10),
    content: z.string().optional(),
    liveUrl: z.string().url().optional().or(z.literal("")),
    githubUrl: z.string().url().optional().or(z.literal("")),
    images: z.array(z.string()),
    technologies: z.string().min(1),
});

type UploadedImage = {
    url: string;
    public_id: string;
};

interface ProjectFormProps {
    initialData?: any;
    onSuccess?: () => void;
}

export default function ProjectForm({ initialData, onSuccess }: ProjectFormProps) {
    const queryClient = useQueryClient();
    const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
    const submittedRef = useRef(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData
            ? { ...initialData, technologies: initialData.technologies.join(", ") }
            : {
                title: "",
                description: "",
                content: "",
                liveUrl: "",
                githubUrl: "",
                images: [],
                technologies: "",
            },
    });

    /* ---------------- SUBMIT ---------------- */
    const mutation = useMutation({
        mutationFn: async (values: z.infer<typeof formSchema>) => {
            const payload = {
                ...values,
                technologies: values.technologies
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean),
            };

            initialData
                ? await api.put(`/projects/${initialData._id}`, payload)
                : await api.post("/projects", payload);
        },
        onSuccess: () => {
            submittedRef.current = true;
            queryClient.invalidateQueries({ queryKey: ["projects"] });
            setUploadedImages([]); // images now belong to project
            onSuccess?.();
        },
    });

    /* ---------------- IMAGE REMOVE ---------------- */
    const handleRemove = async (url: string) => {
        const image = uploadedImages.find((img) => img.url === url);
        if (image) {
            await api.delete("/upload", {
                data: { public_id: image.public_id },
            });
        }

        setUploadedImages((prev) => prev.filter((img) => img.url !== url));
        form.setValue(
            "images",
            form.getValues("images").filter((i) => i !== url)
        );
    };
    const extractPublicId = (url: string) => {
        const parts = url.split("/");
        const filename = parts[parts.length - 1];
        return filename.split(".")[0];
    };

    /* ---------------- CLEANUP ON CLOSE ---------------- */
    useEffect(() => {
        return () => {
            if (!submittedRef.current && uploadedImages.length > 0) {
                api.post("/upload/bulk-delete", {
                    public_ids: uploadedImages.map((img) => img.public_id),
                });
            }
        };
    }, [uploadedImages]);

    useEffect(() => {
        if (initialData) {
            form.reset({
                ...initialData,
                technologies: initialData.technologies.join(", "),
            });

            setUploadedImages(
                (initialData.images || []).map((url: string) => ({
                    url,
                    public_id: extractPublicId(url), // helper below
                }))
            );
        }
    }, [initialData]);


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit((v) => mutation.mutate(v))} className="space-y-8">
                <FormField
                    control={form.control}
                    name="images"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Images</FormLabel>
                            <FormControl>
                                <ImageUpload
                                    value={field.value}
                                    onUploaded={(img: UploadedImage) => {
                                        setUploadedImages((prev) => [...prev, img]);
                                        field.onChange([...field.value, img.url]);
                                    }}
                                    onRemove={handleRemove}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Input {...form.register("title")} placeholder="Project Title" />
                <Textarea {...form.register("description")} placeholder="Description" />
                <Input {...form.register("technologies")} placeholder="React, Node.js" />

                <Button type="submit" className="w-full">
                    {initialData ? "Save Changes" : "Create Project"}
                </Button>
            </form>
        </Form>
    );
}

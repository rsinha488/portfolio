"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";

interface Profile {
    name: string;
    title: string;
    bio: string;
    avatar: string;
    githubUrl: string;
    linkedinUrl: string;
    twitterUrl: string;
    resumeUrl: string;
    phone?: string;
    email?: string;
    location?: string;
}

export default function ProfilePage() {
    const { user } = useAuth();
    const isAdmin = user?.role === "admin";
    const queryClient = useQueryClient();

    const { data: profile, isLoading } = useQuery({
        queryKey: ["profile"],
        queryFn: async () => (await api.get("/profile")).data as Profile,
    });

    const { register, handleSubmit, reset } = useForm<Profile>();

    useEffect(() => {
        if (profile) reset(profile);
    }, [profile, reset]);

    const mutation = useMutation({
        mutationFn: async (data: Profile) => api.put("/profile", data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["profile"] });
            alert("Profile updated successfully!");
        },
        onError: (err: any) => {
            alert(err.response?.data?.message || "Failed to update profile");
        }
    });

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Hero & Profile Settings</h2>
            
            {!isAdmin && (
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-md text-amber-800 text-sm">
                    You are in read-only mode. Only the admin can save changes.
                </div>
            )}

            <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Main Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input id="name" {...register("name", { required: true })} disabled={!isAdmin} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="title">Professional Title</Label>
                                <Input id="title" {...register("title", { required: true })} disabled={!isAdmin} />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Contact Email</Label>
                                <Input id="email" {...register("email")} disabled={!isAdmin} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <Input id="location" {...register("location")} disabled={!isAdmin} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="bio">Hero Bio / Introduction</Label>
                            <Textarea id="bio" rows={4} {...register("bio", { required: true })} disabled={!isAdmin} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="avatar">Avatar URL</Label>
                            <Input id="avatar" {...register("avatar")} disabled={!isAdmin} />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Social & Links</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="githubUrl">GitHub URL</Label>
                                <Input id="githubUrl" {...register("githubUrl")} disabled={!isAdmin} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
                                <Input id="linkedinUrl" {...register("linkedinUrl")} disabled={!isAdmin} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="twitterUrl">Twitter URL</Label>
                                <Input id="twitterUrl" {...register("twitterUrl")} disabled={!isAdmin} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="resumeUrl">Resume URL</Label>
                                <Input id="resumeUrl" {...register("resumeUrl")} disabled={!isAdmin} />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {isAdmin && (
                    <div className="flex justify-end">
                        <Button type="submit" size="lg" disabled={mutation.isPending}>
                            {mutation.isPending ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                )}
            </form>
        </div>
    );
}

"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import api from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Mail, MapPin } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const formSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }).min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().min(1, { message: "Email is required" }).regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, { message: "Invalid email address" }),
    subject: z.string().min(1, { message: "Subject is required" }).min(5, { message: "Subject must be at least 5 characters" }),
    message: z.string().min(1, { message: "Message is required" }).min(10, { message: "Message must be at least 10 characters" }),
});

type FormValues = z.infer<typeof formSchema>;

function ContactInfo() {
    const { data: profile } = useQuery({
        queryKey: ["profile"],
        queryFn: async () => (await api.get("/profile")).data,
    });

    const email = profile?.email || "ruchi.developer@outlook.com";
    const location = profile?.location || "Noida, Uttar Pradesh, India";

    return (
        <Card>
            <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>
                    Feel free to reach out through any of these channels.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {email && (
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                            <Mail size={20} aria-hidden="true" />
                        </div>
                        <div>
                            <p className="font-medium text-gray-950 dark:text-white">Email</p>
                            <a href={`mailto:${email}`} className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{email}</a>
                        </div>
                    </div>
                )}
                {location && (
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                            <MapPin size={20} aria-hidden="true" />
                        </div>
                        <div>
                            <p className="font-medium text-gray-950 dark:text-white">Location</p>
                            <p className="text-gray-600 dark:text-gray-400">{location}</p>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export default function ContactSection() {
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
    });

    const onSubmit = async (data: FormValues) => {
        setLoading(true);
        try {
            await api.post("/contact", data);
            setSuccess(true);
            toast.success("Message sent successfully! I'll get back to you soon.", {
                description: "Your message has been delivered to my inbox.",
            });
            reset();
            setTimeout(() => setSuccess(false), 5000);
        } catch (error: any) {
            toast.error("Failed to send message. Please try again.", {
                description: error.response?.data?.message || "There was an error connecting to the server.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="py-24 bg-white dark:bg-gray-900 focus:outline-none" id="contact" tabIndex={-1}>
            <div className="container px-4 mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Get in Touch</h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        Have a project in mind? Let's talk.
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <ContactInfo />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle>Send a Message</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {success ? (
                                    <div role="status" aria-live="polite" className="p-4 bg-green-100 text-green-700 rounded-md text-center">
                                        Message sent successfully! I'll get back to you soon.
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label htmlFor="name" className="sr-only">Your Name</label>
                                                <Input 
                                                    id="name" 
                                                    placeholder="Name" 
                                                    {...register("name")} 
                                                    disabled={loading} 
                                                    aria-invalid={errors.name ? "true" : "false"} 
                                                    aria-describedby={errors.name ? "name-error" : undefined}
                                                    aria-required="true"
                                                />
                                                {errors.name && <p id="name-error" className="text-xs text-red-500" role="alert">{errors.name.message}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <label htmlFor="email" className="sr-only">Your Email</label>
                                                <Input 
                                                    id="email" 
                                                    placeholder="Email" 
                                                    {...register("email")} 
                                                    disabled={loading} 
                                                    aria-invalid={errors.email ? "true" : "false"} 
                                                    aria-describedby={errors.email ? "email-error" : undefined}
                                                    aria-required="true"
                                                />
                                                {errors.email && <p id="email-error" className="text-xs text-red-500" role="alert">{errors.email.message}</p>}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="subject" className="sr-only">Message Subject</label>
                                            <Input 
                                                id="subject" 
                                                placeholder="Subject" 
                                                {...register("subject")} 
                                                disabled={loading} 
                                                aria-invalid={errors.subject ? "true" : "false"} 
                                                aria-describedby={errors.subject ? "subject-error" : undefined}
                                                aria-required="true"
                                            />
                                            {errors.subject && <p id="subject-error" className="text-xs text-red-500" role="alert">{errors.subject.message}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="message" className="sr-only">Message Content</label>
                                            <Textarea 
                                                id="message" 
                                                placeholder="Message" 
                                                className="min-h-[120px]" 
                                                {...register("message")} 
                                                disabled={loading} 
                                                aria-invalid={errors.message ? "true" : "false"} 
                                                aria-describedby={errors.message ? "message-error" : undefined}
                                                aria-required="true"
                                            />
                                            {errors.message && <p id="message-error" className="text-xs text-red-500" role="alert">{errors.message.message}</p>}
                                        </div>
                                        <Button type="submit" className="w-full" disabled={loading}>
                                            {loading ? "Sending..." : "Send Message"}
                                        </Button>
                                    </form>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

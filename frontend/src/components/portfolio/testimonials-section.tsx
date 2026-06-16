"use client";

import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";

export default function TestimonialsSection() {
    const { data: testimonials, isLoading } = useQuery({
        queryKey: ["public-testimonials"],
        queryFn: async () => {
            const res = await api.get("/testimonials");
            return res.data;
        },
    });

    if (isLoading || !testimonials?.length) return null;

    return (
        <section className="py-24 bg-gray-50 dark:bg-gray-800">
            <div className="container px-4 mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Client Testimonials</h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        What people say about working with me.
                    </p>
                </motion.div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {testimonials.map((item: any, index: number) => (
                        <motion.div
                            key={item._id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="h-full relative">
                                <CardContent className="pt-12">
                                    <Quote className="absolute top-6 left-6 text-blue-100 dark:text-blue-900 w-12 h-12 -z-10" />
                                    <p className="text-gray-700 dark:text-gray-300 mb-6 italic relative z-10">
                                        "{item.content}"
                                    </p>
                                    <div className="flex items-center gap-4">
                                        {item.avatar ? (
                                            <img src={item.avatar} alt={item.name} className="w-10 h-10 rounded-full object-cover" />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                                {item.name[0]}
                                            </div>
                                        )}
                                        <div>
                                            <h4 className="font-bold text-gray-900 dark:text-white">{item.name}</h4>
                                            <p className="text-sm text-gray-500">{item.role} at {item.company}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

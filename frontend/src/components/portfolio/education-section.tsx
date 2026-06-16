"use client";

import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { GraduationCap, Award } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function EducationSection() {
    const { data: timeline, isLoading } = useQuery({
        queryKey: ["public-timeline"],
        queryFn: async () => {
            const res = await api.get("/timeline");
            return res.data;
        },
    });

    const education = timeline 
        ? timeline.filter((item: any) => item.type === "education").sort((a: any, b: any) => a.order - b.order)
        : [];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring" as const,
                stiffness: 100,
                damping: 15,
            },
        },
    };

    if (isLoading) {
        return (
            <section id="education" className="py-24 bg-gray-50 dark:bg-gray-800 border-t border-gray-100 dark:border-gray-800">
                <div className="container px-4 mx-auto">
                    <div className="text-center mb-16">
                        <Skeleton className="h-10 w-64 mx-auto mb-4" />
                        <Skeleton className="h-6 w-96 mx-auto" />
                    </div>
                    <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
                        {[1, 2].map((i) => (
                            <Skeleton key={i} className="h-44 w-full rounded-2xl" />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (education.length === 0) {
        return null;
    }

    return (
        <section id="education" className="py-24 bg-gray-50 dark:bg-gray-800 border-t border-gray-100 dark:border-gray-800">
            <div className="container px-4 mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4 text-gray-900 dark:text-white">Education</h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        Academic qualifications and academic performance benchmarks.
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto"
                >
                    {education.map((edu: any) => (
                        <motion.div
                            key={edu._id}
                            variants={itemVariants}
                            className="flex gap-5 bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 hover:border-blue-500/20 dark:hover:border-blue-500/20 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 group"
                        >
                            <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300">
                                <GraduationCap size={24} />
                            </div>
                            <div className="flex-1 space-y-2">
                                <div className="flex items-start justify-between flex-wrap gap-2">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                            {edu.title}
                                        </h3>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{edu.company}</p>
                                    </div>
                                    <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-semibold rounded-full">
                                        {edu.year}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                                    {edu.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}

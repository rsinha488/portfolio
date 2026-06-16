"use client";

import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Award, Zap, Shield, AppWindow, Cpu } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

function getAchievementIcon(text: string) {
    const lower = text.toLowerCase();
    if (lower.includes("latency") || lower.includes("reduction") || lower.includes("optimization")) {
        return <Zap size={28} className="text-amber-500" />;
    }
    if (lower.includes("saas") || lower.includes("architected") || lower.includes("multi-tenant")) {
        return <Cpu size={28} className="text-blue-500" />;
    }
    if (lower.includes("production") || lower.includes("gaming") || lower.includes("delivered")) {
        return <AppWindow size={28} className="text-cyan-500" />;
    }
    if (lower.includes("academic") || lower.includes("gpa") || lower.includes("performance")) {
        return <Shield size={28} className="text-purple-500" />;
    }
    return <Award size={28} className="text-blue-500" />;
}

const FALLBACK_ACHIEVEMENTS = [
    { _id: "ach-1", text: "25% reduction in API latency at Hestabit by implementing asynchronous processing and query optimization.", order: 1 },
    { _id: "ach-2", text: "Successfully architected a multi-tenant SaaS platform from scratch, enabling isolated, secure access for multiple enterprise clients.", order: 2 },
    { _id: "ach-3", text: "Delivered two full-stack production platforms at Chetu - a Supply Chain Management System and a real-time multiplayer gaming platform - across React.js, Next.js, and Node.js.", order: 3 },
    { _id: "ach-4", text: "Achieved consistently high academic performance - 8.86 GPA (MCA) and 9.14 GPA (BCA).", order: 4 }
];

export default function AchievementsSection() {
    const { data: achievements, isLoading } = useQuery({
        queryKey: ["achievements"],
        queryFn: async () => {
            const res = await api.get("/achievements");
            return res.data;
        },
    });

    const displayAchievements = achievements?.length ? achievements : FALLBACK_ACHIEVEMENTS;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
            },
        },
    };

    const cardVariants = {
        hidden: { y: 30, opacity: 0 },
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
            <section id="achievements" className="py-24 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
                <div className="container px-4 mx-auto">
                    <div className="text-center mb-16">
                        <Skeleton className="h-10 w-64 mx-auto mb-4" />
                        <Skeleton className="h-6 w-96 mx-auto" />
                    </div>
                    <div className="grid gap-8 md:grid-cols-2">
                        {[1, 2, 3, 4].map((i) => (
                            <Skeleton key={i} className="h-40 w-full rounded-2xl" />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (!displayAchievements || displayAchievements.length === 0) {
        return null;
    }

    return (
        <section id="achievements" className="py-24 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 dark:opacity-10 pointer-events-none" />
            <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 dark:opacity-10 pointer-events-none" />

            <div className="container relative z-10 px-4 mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4 text-gray-900 dark:text-white">Key Achievements</h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Highlights of direct business impact, architecture successes, and academic performance.
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid gap-6 md:grid-cols-2 max-w-5xl mx-auto"
                >
                    {displayAchievements.map((item: any) => (
                        <motion.div
                            key={item._id}
                            variants={cardVariants}
                            className="flex gap-5 bg-gray-50/50 dark:bg-gray-800/40 p-6 rounded-2xl border border-gray-100 dark:border-gray-800/80 hover:border-blue-500/20 dark:hover:border-blue-500/20 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-500 hover:-translate-y-1 group backdrop-blur-sm"
                        >
                            <div className="flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-xl bg-white dark:bg-gray-900 shadow-md group-hover:scale-110 transition-transform duration-300 border border-gray-50 dark:border-gray-800">
                                {getAchievementIcon(item.text)}
                            </div>
                            <div className="flex-1 flex items-center">
                                <p className="text-gray-700 dark:text-gray-300 font-medium text-md leading-relaxed">
                                    {item.text}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}

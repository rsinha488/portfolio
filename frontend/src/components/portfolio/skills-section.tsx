"use client";

import React from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

const FALLBACK_SKILLS = [
    { _id: "1", category: "Languages", items: ["JavaScript (ES6+)", "TypeScript", "HTML5", "CSS3"], order: 1 },
    { _id: "2", category: "Frontend", items: ["React.js", "Next.js", "Redux", "Redux Toolkit", "Redux-Saga", "Tailwind CSS"], order: 2 },
    { _id: "3", category: "Backend", items: ["Node.js", "Express.js", "RESTful API Design", "Event-Driven Architecture"], order: 3 },
    { _id: "4", category: "Databases", items: ["MongoDB", "Mongoose ODM"], order: 4 },
    { _id: "5", category: "System Design", items: ["Multi-Tenant Architecture", "RBAC", "Distributed Systems", "Microservices", "API Design"], order: 5 },
    { _id: "6", category: "Real-Time & AI", items: ["Socket.IO", "VAPI (Voice AI)", "Conversational AI Integration"], order: 6 },
    { _id: "7", category: "Cloud & DevOps", items: ["AWS S3", "Git", "GitHub", "Postman"], order: 7 },
    { _id: "8", category: "Performance Optimization", items: ["Memoization", "Lazy Loading", "Code Splitting", "Async Processing", "Query Optimization"], order: 8 }
];

export default function SkillsSection() {
    const { data: skills } = useQuery({
        queryKey: ["skills"],
        queryFn: async () => (await api.get("/skills")).data,
    });

    const displaySkills = skills?.length ? skills : FALLBACK_SKILLS;

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
                duration: 0.5,
            },
        },
    };

    return (
        <section id="skills" className="py-24 bg-gray-50 dark:bg-gray-800">
            <div className="container px-4 mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Technical Expertise</h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        A comprehensive toolset for building scalable solutions.
                    </p>
                </motion.div>

                <motion.ul 
                    key={displaySkills.length}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 list-none p-0"
                >
                    {displaySkills.map((category: any) => (
                        <motion.li
                            key={category._id}
                            variants={itemVariants}
                            className="group bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 dark:border-gray-800 hover:border-blue-500/30"
                        >
                            <h3 className="text-xs font-bold uppercase tracking-[0.2em] mb-6 text-gray-400 group-hover:text-blue-500 transition-colors">
                                {category.category}
                            </h3>
                            <ul className="flex flex-wrap gap-2.5 list-none p-0" aria-label={`Skills in ${category.category}`}>
                                {category.items.map((skill: string) => (
                                    <li
                                        key={skill}
                                        className="px-3 py-1.5 bg-gray-50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-transparent dark:border-gray-700/50 group-hover:border-blue-500/20 transition-colors"
                                    >
                                        {skill}
                                    </li>
                                ))}
                            </ul>
                        </motion.li>
                    ))}
                </motion.ul>
            </div>
        </section>
    );
}

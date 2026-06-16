"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Calendar, Building2, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface TimelineItem {
    _id: string;
    year: string;
    title: string;
    company: string;
    description: string;
    type: "experience" | "education";
}

const parseDescription = (desc: string): string[] => {
    if (!desc) return [];
    return desc
        .split(/(?<=\.)\s+/)
        .map(s => s.trim())
        .filter(s => s.length > 0);
};

const FALLBACK_TIMELINE = [
    {
        _id: "exp-1",
        year: "Oct 2025 - May 2026",
        title: "Software Engineer",
        company: "Hestabit Technologies",
        description: "Architected and developed a multi-tenant SaaS platform for AI voice agents, enabling automated campaign execution at scale. Designed a campaign orchestration engine supporting bulk calls, retry logic, scheduling, and real-time call tracking. Built a scalable Node.js and MongoDB backend handling agent workflows, session lifecycle management, and tenant-isolated data storage. Developed frontend dashboards using Next.js with server-side rendering for optimized performance and routing. Integrated VAPI for real-time conversational AI and dynamic voice agent configuration. Implemented event-driven architecture using Socket.IO for real-time monitoring of active calls. Designed RBAC and tenant isolation to enforce secure multi-user access. Reduced API latency by 25% by optimizing asynchronous processing.",
        type: "experience",
        order: 1
    },
    {
        _id: "exp-2",
        year: "Jul 2023 - Oct 2025",
        title: "Software Engineer",
        company: "Chetu India Pvt. Ltd",
        description: "Developed role-specific dashboards for a Supply Chain Management System using Next.js, supporting Admin, Warehouse Owner, Sales, and Buyer personas. Built a real-time multiplayer gaming platform Mega2 using React.js featuring timed selection, live ball-spins, and dynamic win/loss. Developed Node.js RESTful APIs handling inventory workflows, stock validation, transaction logic, and game session management. Implemented real-time stock shortage alerts and player chat using Socket.IO. Designed and enforced granular RBAC across both projects. Managed complex game state and countdown timer logic using Redux. Integrated Redux Toolkit and Axios. Optimized performance using memoization, lazy loading, and code splitting.",
        type: "experience",
        order: 2
    },
    {
        _id: "exp-3",
        year: "May 2021 - Jul 2023",
        title: "Software Developer",
        company: "Integrated Personnel Connecting Tech",
        description: "Developed and maintained RESTful APIs using Node.js and MongoDB for a Human Resource Management System (HRMS) platform. Built scalable backend modules for authentication, authorization, and employee lifecycle workflows. Developed a Next.js-based marketing and branding website for the HRMS platform, leveraging static site generation (SSG) for fast load times and improved search engine visibility. Integrated AWS S3 for secure, scalable file storage. Developed frontend modules using React.js and Redux-Saga for real-time data updates. Designed and maintained database schemas in MongoDB.",
        type: "experience",
        order: 3
    },
    {
        _id: "edu-1",
        year: "2018 - 2021",
        title: "Master of Computer Applications (MCA)",
        company: "Patliputra University",
        description: "Completed MCA specializing in software engineering and web application architectures with an academic score of 8.86 / 10 CGPA.",
        type: "education",
        order: 4
    },
    {
        _id: "edu-2",
        year: "2015 - 2018",
        title: "Bachelor of Computer Applications (BCA)",
        company: "Aryabhatta Knowledge University",
        description: "Completed BCA with a focus on core programming concepts, database management, and web development, achieving 9.14 / 10 CGPA.",
        type: "education",
        order: 5
    },
    {
        _id: "edu-3",
        year: "2013 - 2015",
        title: "Intermediate (PCMB)",
        company: "Kendriya Vidyalaya, Patna",
        description: "Completed Intermediate education specializing in PCMB (Physics, Chemistry, Mathematics, Biology) under CBSE Board with a score of 68.2%.",
        type: "education",
        order: 6
    },
    {
        _id: "edu-4",
        year: "2013",
        title: "Matriculation (10th)",
        company: "Kendriya Vidyalaya, Patna",
        description: "Completed Matriculation education under CBSE Board, achieving an academic score of 9.2 CGPA.",
        type: "education",
        order: 7
    }
];

export default function Timeline() {
    const [activeTab, setActiveTab] = useState(0);

    const { data: timeline, isLoading } = useQuery({
        queryKey: ["timeline"],
        queryFn: async () => {
            const res = await api.get("/timeline");
            return res.data;
        },
    });

    const displayTimeline = timeline?.length ? timeline : FALLBACK_TIMELINE;

    const experiences = useMemo(() => {
        return displayTimeline
            .filter((item: any) => item.type === "experience")
            .sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
    }, [displayTimeline]);

    const activeExp = experiences[activeTab] || null;
    const bulletPoints = useMemo(() => {
        return activeExp ? parseDescription(activeExp.description) : [];
    }, [activeExp]);

    if (isLoading) {
        return (
            <section id="experience" className="py-24 bg-slate-950 text-center">
                <div className="container px-4 mx-auto max-w-4xl">
                    <Skeleton className="h-10 w-64 mx-auto mb-6 bg-slate-800" />
                    <Skeleton className="h-4 w-96 mx-auto mb-16 bg-slate-800" />
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <Skeleton key={i} className="h-12 w-full bg-slate-800 rounded-lg" />
                            ))}
                        </div>
                        <div className="md:col-span-2">
                            <Skeleton className="h-64 w-full bg-slate-800 rounded-2xl" />
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="experience" className="relative py-24 bg-white dark:bg-slate-950 overflow-hidden border-t border-gray-100 dark:border-slate-900 transition-colors duration-500">
            {/* Background elements */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-10 dark:opacity-30" />
            <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
            <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

            <div className="container px-4 mx-auto max-w-5xl relative z-10">
                {/* Header */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-200 dark:to-purple-400">
                            Professional Journey
                        </h2>
                        <p className="text-md text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
                            A showcase of my career milestones, roles, and engineering contributions.
                        </p>
                    </motion.div>
                </div>

                {/* Dashboard layout */}
                <div className="grid md:grid-cols-10 gap-8 items-start">
                    {/* Left: Tab Menu */}
                    <div 
                        role="tablist"
                        aria-label="Professional Journey Experience Tabs"
                        className="md:col-span-3 flex md:flex-col overflow-x-auto md:overflow-x-visible pb-3 md:pb-0 scrollbar-none border-b md:border-b-0 border-slate-200 dark:border-slate-800/80 md:border-l border-slate-200 dark:border-slate-800/80 gap-1 pr-1"
                    >
                        {experiences.map((exp: TimelineItem, index: number) => {
                            const isActive = activeTab === index;
                            return (
                                <button
                                    key={exp._id}
                                    id={`tab-${exp._id}`}
                                    role="tab"
                                    aria-selected={isActive}
                                    aria-controls={`panel-${exp._id}`}
                                    onClick={() => setActiveTab(index)}
                                    className={`relative px-5 py-4 text-left transition-all duration-300 rounded-lg md:rounded-r-lg md:rounded-l-none outline-none flex flex-col items-start gap-1 shrink-0 ${
                                        isActive 
                                        ? "text-blue-600 dark:text-blue-400 bg-blue-500/5 font-extrabold" 
                                        : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-900/30"
                                    }`}
                                >
                                    {/* Left active line indicator for desktop */}
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeTabIndicator"
                                            className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-r hidden md:block"
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                    {/* Bottom active line indicator for mobile */}
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeTabIndicatorMobile"
                                            className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-t md:hidden"
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                    <span className="font-bold text-sm md:text-md tracking-wide">{exp.company}</span>
                                    <span className="text-[10px] font-semibold text-slate-500 group-hover:text-slate-400 uppercase tracking-wider">{exp.year}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Right: Tab Details Card */}
                    <div className="md:col-span-7">
                        <AnimatePresence mode="wait">
                            {activeExp && (
                                <motion.div
                                    key={activeExp._id}
                                    id={`panel-${activeExp._id}`}
                                    role="tabpanel"
                                    aria-labelledby={`tab-${activeExp._id}`}
                                    initial={{ opacity: 0, x: 15, y: 5 }}
                                    animate={{ opacity: 1, x: 0, y: 0 }}
                                    exit={{ opacity: 0, x: -15, y: 5 }}
                                    transition={{ duration: 0.35, ease: "easeOut" }}
                                    className="bg-slate-50/50 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-6 md:p-8 hover:border-blue-500/20 dark:hover:border-blue-500/30 hover:shadow-xl dark:hover:shadow-blue-500/5 transition-all duration-500"
                                >
                                    {/* Role Header */}
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                        <div>
                                            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
                                                {activeExp.title}
                                            </h3>
                                            <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 font-semibold mt-1">
                                                <Building2 size={14} />
                                                <span>{activeExp.company}</span>
                                            </div>
                                        </div>

                                        {/* Date Badge */}
                                        <div className="flex items-center gap-2 shrink-0 bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 px-3 py-1.5 rounded-full self-start md:self-center">
                                            <Calendar size={13} />
                                            <span className="text-xs font-bold uppercase tracking-wider">{activeExp.year}</span>
                                        </div>
                                    </div>

                                    {/* Bullet Achievements List */}
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800/50 pb-2">
                                            Key Contributions & Achievements
                                        </h4>
                                        <ul className="space-y-3.5">
                                            {bulletPoints.map((point, idx) => (
                                                <li key={idx} className="flex gap-3 items-start text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                                                    <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-md bg-blue-50 dark:bg-blue-950/40 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                                        <ChevronRight size={14} className="opacity-80" />
                                                    </div>
                                                    <span>{point}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    );
}

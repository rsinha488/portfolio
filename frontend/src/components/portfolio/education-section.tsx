"use client";

import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { GraduationCap, Award } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

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

export default function EducationSection() {
    const { data: timeline, isLoading } = useQuery({
        queryKey: ["timeline"],
        queryFn: async () => {
            const res = await api.get("/timeline");
            return res.data;
        },
    });

    const displayTimeline = timeline?.length ? timeline : FALLBACK_TIMELINE;

    const education = displayTimeline
        ? displayTimeline.filter((item: any) => item.type === "education").sort((a: any, b: any) => a.order - b.order)
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

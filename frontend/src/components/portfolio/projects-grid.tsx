"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
    ExternalLink, 
    Search, 
    Bot, 
    PhoneCall, 
    Globe, 
    Truck, 
    Users, 
    Gamepad2, 
    BarChart3, 
    Code2, 
    Sparkles 
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { useDebounce } from "@/hooks/useDebounce";
import { GithubIcon } from "./brand-icons";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const PROJECT_DETAILS_MAP: Record<string, string[]> = {
    "ai-powered-insurance-policy-assistant": [
        "Retrieval-Augmented Generation (RAG) assistant for enrolled insurance documents.",
        "Semantic search utilizing pgvector extension in PostgreSQL for document embeddings.",
        "Self-service chat assistant giving cited, verifiable answers directly from uploaded PDFs.",
        "Engineered with OpenAI API, Prompt Engineering, and custom Guardrails to prevent hallucinations.",
        "Interactive real-time communication interface built using Socket.IO."
    ],
    "ai-voice-agent-campaign-platform": [
        "End-to-end SaaS platform for configuring, running, and managing outbound calling campaigns.",
        "Integrated VAPI for high-performance conversational AI and voice agent workflows.",
        "Telephony orchestration using Twilio API with batch contact loading and tracking.",
        "Campaign scheduler built with cron jobs, supporting automatic retry logics and tenant-isolated operations.",
        "Real-time call tracking dashboard utilizing Socket.IO for active call monitoring."
    ],
    "hrms-branding-marketing-site-ipsl": [
        "Modern marketing and branding website designed specifically for the HRMS enterprise platform.",
        "Leveraged Next.js Static Site Generation (SSG) to achieve maximum performance and high SEO ranking.",
        "Constructed interactive showcase blocks, client inquiry funnels, and optimized responsive layouts.",
        "Smooth micro-interactions and transitions implemented using Framer Motion and Tailwind CSS."
    ],
    "scms-chetu-india-noida": [
        "Enterprise Supply Chain Management System featuring granular role-based dashboards.",
        "Supports diverse personas: Admin, Warehouse Owner, Sales, and Buyer, with strictly isolated access controls.",
        "Real-time stock level monitoring, procurement triggers, and inventory shortage warnings.",
        "State management and secure asynchronous communication handled via Redux Toolkit and Axios."
    ],
    "hrms-application-ipsl-mumbai": [
        "Full-stack human resources platform managing end-to-end employee lifecycles.",
        "Robust authentication, leave workflow approvals, and department hierarchy visualization.",
        "Configured secure document uploads and attachment management via AWS S3.",
        "State synchronization using Redux-Saga for real-time employee data processing."
    ],
    "real-time-gaming-mega-ball-games": [
        "High-performance multiplayer gaming platform 'Mega2' supporting live room events.",
        "Real-time countdown timer synchronization and live game updates using Socket.IO.",
        "Interactive room chat, real-time board states, and automated win/loss calculation.",
        "Managed game ticks and state updates using Redux, rendering at 60fps."
    ],
    "cyber-analytics-dashboard-chetu-india-noida": [
        "Analytical reporting dashboard displaying retailer performance metrics and engagement indicators.",
        "Fully responsive visualization charts utilizing Recharts/Chart.js.",
        "Data export capabilities (Excel, PDF) and multi-level data filters for custom reporting.",
        "Optimized MongoDB queries to compile and serve analytical summary aggregations under 100ms."
    ]
};

const getProjectTheme = (slug: string) => {
    switch (slug) {
        case "ai-powered-insurance-policy-assistant":
            return {
                gradient: "from-blue-600 to-indigo-600",
                icon: Bot,
                color: "text-blue-500",
                bgColor: "bg-blue-500/10",
                borderColor: "border-blue-500/20"
            };
        case "ai-voice-agent-campaign-platform":
            return {
                gradient: "from-violet-600 to-purple-600",
                icon: PhoneCall,
                color: "text-violet-500",
                bgColor: "bg-violet-500/10",
                borderColor: "border-violet-500/20"
            };
        case "hrms-branding-marketing-site-ipsl":
            return {
                gradient: "from-emerald-500 to-teal-600",
                icon: Globe,
                color: "text-emerald-500",
                bgColor: "bg-emerald-500/10",
                borderColor: "border-emerald-500/20"
            };
        case "scms-chetu-india-noida":
            return {
                gradient: "from-amber-500 to-orange-600",
                icon: Truck,
                color: "text-amber-500",
                bgColor: "bg-amber-500/10",
                borderColor: "border-amber-500/20"
            };
        case "hrms-application-ipsl-mumbai":
            return {
                gradient: "from-rose-500 to-pink-600",
                icon: Users,
                color: "text-rose-500",
                bgColor: "bg-rose-500/10",
                borderColor: "border-rose-500/20"
            };
        case "real-time-gaming-mega-ball-games":
            return {
                gradient: "from-red-500 to-rose-600",
                icon: Gamepad2,
                color: "text-red-500",
                bgColor: "bg-red-500/10",
                borderColor: "border-red-500/20"
            };
        case "cyber-analytics-dashboard-chetu-india-noida":
            return {
                gradient: "from-cyan-500 to-blue-600",
                icon: BarChart3,
                color: "text-cyan-500",
                bgColor: "bg-cyan-500/10",
                borderColor: "border-cyan-500/20"
            };
        default:
            return {
                gradient: "from-gray-600 to-slate-700",
                icon: Code2,
                color: "text-gray-500",
                bgColor: "bg-gray-500/10",
                borderColor: "border-gray-500/20"
            };
    }
};

const isPlaceholderImage = (url?: string) => {
    return !url || url.includes("ruchi-photo.jpg") || url.includes("placeholder");
};

const FALLBACK_PROJECTS = [
    {
        _id: "proj-1",
        title: "AI-Powered Insurance Policy Assistant",
        slug: "ai-powered-insurance-policy-assistant",
        description: "RAG-based self-service chat assistant where employees query their enrolled insurance policy documents and get cited answers.",
        technologies: ["Next.js", "Node.js", "Express", "PostgreSQL", "Prisma ORM", "pgvector", "OpenAI API", "Embeddings", "Semantic Search", "Prompt Engineering", "AI Guardrails", "Socket.IO", "Multi-tenant", "RBAC"],
        featured: true,
        order: 1,
        images: [{ url: "/ruchi-photo.jpg", alt: "AI-Powered Insurance Policy Assistant" }]
    },
    {
        _id: "proj-2",
        title: "AI Voice Agent & Campaign Platform",
        slug: "ai-voice-agent-campaign-platform",
        description: "SaaS platform for businesses to create AI voice agents, run outbound calling campaigns with batch processing, and collect structured feedback.",
        technologies: ["Next.js", "Node.js", "MongoDB", "VAPI", "Twilio", "Prompt Engineering", "Context Injection", "Cron Jobs", "Socket.IO", "Multi-tenant", "RBAC"],
        featured: true,
        order: 2,
        images: [{ url: "/ruchi-photo.jpg", alt: "AI Voice Agent & Campaign Platform" }]
    },
    {
        _id: "proj-3",
        title: "HRMS Branding and marketing Site",
        slug: "hrms-branding-marketing-site-ipsl",
        description: "Its a marketing and brandinding website for HRMS application",
        technologies: ["Next.js", "MongoDB", "Node.js", "React.js"],
        featured: true,
        order: 3,
        images: [{ url: "/ruchi-photo.jpg", alt: "HRMS Branding and Marketing Site" }]
    },
    {
        _id: "proj-4",
        title: "SCMS (Supply Chain Management System)",
        slug: "scms-chetu-india-noida",
        description: "Enterprise supply chain management platform supporting inventory operations, procurement workflows, supplier management, and role-based access control with optimized performance and scalable UI architecture.",
        technologies: ["React.js", "Next.js", "TypeScript", "Redux Toolkit", "Tailwind CSS", "Axios", "REST APIs", "Node.js", "MongoDB"],
        featured: true,
        order: 4,
        images: [{ url: "/ruchi-photo.jpg", alt: "SCMS Chetu India Noida" }]
    },
    {
        _id: "proj-5",
        title: "HRMS Application",
        slug: "hrms-application-ipsl-mumbai",
        description: "Full-stack HR management platform handling employee lifecycle operations, leave management, authentication, document storage, and administrative workflows.",
        technologies: ["React.js", "Next.js", "TypeScript", "Node.js", "Express.js", "MongoDB", "Redux Saga", "AWS S3", "REST APIs"],
        featured: false,
        order: 5,
        images: [{ url: "/ruchi-photo.jpg", alt: "HRMS Application IPSL Mumbai" }]
    },
    {
        _id: "proj-6",
        title: "Real-Time Gaming Platform (Mega Ball Games)",
        slug: "real-time-gaming-mega-ball-games",
        description: "Real-time event-driven platform supporting live game updates, synchronized user interactions, instant notifications, and high-frequency state updates.",
        technologies: ["React.js", "Next.js", "TypeScript", "Socket.IO", "Redux Toolkit", "Tailwind CSS", "Node.js", "REST APIs"],
        featured: false,
        order: 6,
        images: [{ url: "/ruchi-photo.jpg", alt: "Real-Time Gaming Mega Ball Games" }]
    },
    {
        _id: "proj-7",
        title: "Cyber Analytics Dashboard",
        slug: "cyber-analytics-dashboard-chetu-india-noida",
        description: "Analytics and reporting platform for monitoring social media performance, engagement trends, and retailer insights through interactive dashboards and visualization modules.",
        technologies: ["React.js", "Next.js", "TypeScript", "Redux Toolkit", "Tailwind CSS", "REST APIs", "Chart Libraries"],
        featured: false,
        order: 7,
        images: [{ url: "/ruchi-photo.jpg", alt: "Cyber Analytics Dashboard" }]
    }
];

export default function ProjectsGrid() {
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 300);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedProject, setSelectedProject] = useState<any | null>(null);

    const { data: projects, isLoading } = useQuery({
        queryKey: ["projects"],
        queryFn: async () => {
            const res = await api.get("/projects");
            return res.data;
        },
    });

    const displayProjects = projects?.length ? projects : FALLBACK_PROJECTS;

    const categories = useMemo(() => {
        if (!displayProjects) return ["All"];
        const cats = new Set<string>();
        displayProjects.forEach((p: any) => p.technologies?.forEach((t: string) => cats.add(t)));
        return ["All", ...Array.from(cats)].slice(0, 8); // Limit for UI cleanliness
    }, [displayProjects]);

    const filteredProjects = useMemo(() => {
        if (!displayProjects) return [];
        return displayProjects.filter((p: any) => {
            const matchesSearch = p.title.toLowerCase().includes(debouncedSearch.toLowerCase()) || 
                                 p.description.toLowerCase().includes(debouncedSearch.toLowerCase());
            const matchesCategory = selectedCategory === "All" || p.technologies?.includes(selectedCategory);
            return matchesSearch && matchesCategory;
        });
    }, [displayProjects, debouncedSearch, selectedCategory]);

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

    if (isLoading) return (
        <section id="projects" className="py-24 bg-gray-50 dark:bg-gray-800">
            <div className="container px-4 mx-auto">
                <div className="text-center mb-16">
                    <Skeleton className="h-10 w-64 mx-auto mb-4" />
                    <Skeleton className="h-6 w-96 mx-auto" />
                </div>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                        <Card key={i} className="h-[450px] flex flex-col overflow-hidden border-gray-100 dark:border-gray-800 animate-pulse">
                            <Skeleton className="h-48 w-full" />
                            <CardHeader className="pb-2">
                                <Skeleton className="h-8 w-3/4" />
                            </CardHeader>
                            <CardContent className="flex-1 space-y-4">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <div className="flex gap-2">
                                    <Skeleton className="h-6 w-16 rounded-full" />
                                    <Skeleton className="h-6 w-16 rounded-full" />
                                    <Skeleton className="h-6 w-16 rounded-full" />
                                </div>
                            </CardContent>
                            <CardFooter className="flex gap-3 border-t border-gray-50 dark:border-gray-800 p-4 pt-4">
                                <Skeleton className="h-9 flex-1" />
                                <Skeleton className="h-9 flex-1" />
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );

    return (
        <section id="projects" className="py-24 bg-gray-50 dark:bg-gray-800">
            <div className="container px-4 mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4 text-gray-900 dark:text-white">Featured Projects</h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                        A selection of my best work and experiments.
                    </p>

                    {/* Search and Filters */}
                    <div className="space-y-6 max-w-2xl mx-auto">
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} aria-hidden="true" />
                            <Input 
                                placeholder="Search by name or technology..." 
                                aria-label="Search projects by name or technology"
                                className="pl-10 h-11 border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm focus:ring-blue-500/20"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-wrap justify-center gap-2" role="group" aria-label="Project category filters">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    type="button"
                                    aria-pressed={selectedCategory === cat}
                                    className={`cursor-pointer px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-300 border focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none ${
                                        selectedCategory === cat 
                                        ? "bg-blue-600 text-white border-transparent shadow-lg shadow-blue-500/20 dark:bg-blue-500" 
                                        : "hover:border-blue-500/50 hover:text-blue-500 bg-transparent text-gray-500 border-gray-200 dark:border-gray-700"
                                    }`}
                                    onClick={() => setSelectedCategory(cat)}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </motion.div>

                <motion.ul 
                    key={filteredProjects?.length || 0}
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 list-none p-0"
                >
                    {filteredProjects?.map((project: any) => (
                        <motion.li
                            key={project._id}
                            variants={itemVariants}
                            layout
                        >
                            <Card 
                                className="h-full flex flex-col overflow-hidden border-gray-100 dark:border-gray-800 hover:border-blue-500/50 dark:hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-500 group cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none"
                                onClick={() => setSelectedProject(project)}
                                role="button"
                                tabIndex={0}
                                aria-haspopup="dialog"
                                aria-label={`Project: ${project.title}. Click to view details.`}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        const target = e.target as HTMLElement;
                                        if (!target.closest("button") && !target.closest("a")) {
                                            e.preventDefault();
                                            setSelectedProject(project);
                                        }
                                    }
                                }}
                            >
                                <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-800 border-b border-gray-50 dark:border-gray-800">
                                    {!isPlaceholderImage(project.images?.[0]?.url) ? (
                                        <>
                                            <Image
                                                src={project.images[0].url}
                                                alt={project.images[0].alt || `Screenshot of project: ${project.title}`}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                priority={filteredProjects.indexOf(project) < 3}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4">
                                                <p className="text-white text-xs font-medium">Click to view details</p>
                                            </div>
                                        </>
                                    ) : (
                                        (() => {
                                            const theme = getProjectTheme(project.slug);
                                            const ProjectIcon = theme.icon;
                                            return (
                                                <div className={`w-full h-full bg-gradient-to-br ${theme.gradient} flex flex-col items-center justify-center relative p-6 overflow-hidden`}>
                                                    <div className="absolute inset-0 bg-grid-white/[0.05] [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
                                                    <div className="absolute -top-12 -left-12 w-24 h-24 bg-white/10 rounded-full blur-xl" />
                                                    <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-white/15 rounded-full blur-2xl" />
                                                    
                                                    <ProjectIcon className="w-12 h-12 text-white/90 drop-shadow-md z-10 mb-3 group-hover:scale-110 transition-transform duration-500" aria-hidden="true" />
                                                    <span className="text-white/95 font-bold uppercase tracking-widest text-[9px] z-10 bg-white/10 px-3 py-1 rounded-full backdrop-blur-xs text-center max-w-[85%] truncate" title={project.title}>
                                                        {project.title}
                                                    </span>
                                                </div>
                                            );
                                        })()
                                    )}
                                </div>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-xl font-bold line-clamp-1 group-hover:text-blue-600 transition-colors">{project.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="flex-1 space-y-4">
                                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 leading-relaxed">
                                        {project.description}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {project.technologies?.map((tech: string) => (
                                            <span
                                                key={tech}
                                                className="px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider bg-gray-100 text-gray-600 rounded-full dark:bg-gray-800 dark:text-gray-400 border border-transparent dark:border-gray-700"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </CardContent>
                                <CardFooter className="flex gap-3 border-t border-gray-50 dark:border-gray-800 p-4 pt-4" onClick={(e) => e.stopPropagation()}>
                                    {project.liveUrl && (
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            className="flex-1 h-9 gap-2 shadow-sm hover:bg-blue-50 dark:hover:bg-blue-900/10" 
                                            asChild
                                            aria-label={`View live demo of ${project.title}`}
                                        >
                                            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                                                <ExternalLink size={14} aria-hidden="true" /> <span className="text-xs">Live Demo</span>
                                            </a>
                                        </Button>
                                    )}
                                    {project.githubUrl && (
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            className="flex-1 h-9 gap-2 text-gray-500 hover:text-gray-900 dark:hover:text-white" 
                                            asChild
                                            aria-label={`View source code of ${project.title} on GitHub`}
                                        >
                                            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                                                <GithubIcon size={14} className="opacity-70 group-hover:opacity-100 transition-opacity" /> <span className="text-xs">Code</span>
                                            </a>
                                        </Button>
                                    )}
                                </CardFooter>
                            </Card>
                        </motion.li>
                    ))}
                </motion.ul>
            </div>

            {/* Project Details Modal */}
            <Dialog open={selectedProject !== null} onOpenChange={(open) => !open && setSelectedProject(null)}>
                {selectedProject && (() => {
                    const theme = getProjectTheme(selectedProject.slug);
                    const ProjectIcon = theme.icon;
                    const points = selectedProject.points || PROJECT_DETAILS_MAP[selectedProject.slug] || [];
                    return (
                        <DialogContent className="w-screen max-w-none h-screen max-h-none translate-x-0 translate-y-0 top-0 left-0 rounded-none border-0 p-0 overflow-hidden bg-white dark:bg-gray-950 shadow-2xl">
                            <DialogHeader className="sr-only">
                                <DialogTitle>{selectedProject.title}</DialogTitle>
                                <DialogDescription>Details about {selectedProject.title}</DialogDescription>
                            </DialogHeader>
                            <div className="grid grid-cols-1 md:grid-cols-5 h-full max-h-screen overflow-y-auto md:overflow-hidden">
                                {/* Left Side: Image or Gradient banner */}
                                <div className="md:col-span-2 relative h-56 md:h-full overflow-hidden bg-gray-100 dark:bg-gray-900 border-r border-gray-50 dark:border-gray-900">
                                    {isPlaceholderImage(selectedProject.images?.[0]?.url) ? (
                                        <div className={`w-full h-full bg-gradient-to-br ${theme.gradient} flex flex-col items-center justify-center p-8 text-center relative`}>
                                            <div className="absolute inset-0 bg-grid-white/[0.05]" />
                                            <div className="absolute -top-10 -left-10 w-28 h-28 bg-white/10 rounded-full blur-2xl" />
                                            <div className="absolute -bottom-10 -right-10 w-36 h-36 bg-white/15 rounded-full blur-3xl" />
                                            
                                            <div className="p-5 bg-white/10 rounded-2xl backdrop-blur-md border border-white/25 shadow-xl mb-4 z-10">
                                                <ProjectIcon className="w-14 h-14 text-white drop-shadow-md" />
                                            </div>
                                            <span className="text-white/70 font-semibold uppercase tracking-[0.2em] text-[9px] z-10 mb-2">Featured Project</span>
                                            <h3 className="text-white text-lg font-bold px-4 z-10 drop-shadow-sm leading-snug">{selectedProject.title}</h3>
                                        </div>
                                    ) : (
                                        <Image
                                            src={selectedProject.images[0].url}
                                            alt={selectedProject.images[0].alt || selectedProject.title}
                                            fill
                                            className="object-cover"
                                        />
                                    )}
                                </div>

                                {/* Right Side: Details */}
                                <div className="md:col-span-3 p-6 md:p-12 flex flex-col justify-between overflow-y-auto md:h-full bg-white dark:bg-gray-950">
                                    <div>
                                        {/* Header */}
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className={`px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-md ${theme.bgColor} ${theme.color} border ${theme.borderColor}`}>
                                                {selectedProject.technologies?.[0] || "Web App"}
                                            </span>
                                            {selectedProject.featured && (
                                                <span className="px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-md bg-amber-500/10 text-amber-500 border border-amber-500/20">
                                                    ★ Featured
                                                </span>
                                            )}
                                        </div>

                                        <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-4 leading-tight">
                                            {selectedProject.title}
                                        </h3>

                                        {/* Description */}
                                        <div className="space-y-4">
                                            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed font-medium">
                                                {selectedProject.description}
                                            </p>

                                            {/* Detailed Points */}
                                            {points.length > 0 && (
                                                <div className="space-y-2.5 pt-2">
                                                    <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">Key Highlights & Features</h4>
                                                    <ul className="space-y-2">
                                                        {points.map((point: string, idx: number) => (
                                                            <li key={idx} className="flex gap-2.5 items-start text-xs text-gray-600 dark:text-gray-400">
                                                                <div className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center text-blue-500 dark:text-blue-400">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                                                                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                                                                    </svg>
                                                                </div>
                                                                <span className="leading-relaxed">{point}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Bottom Section: Tech Badges & CTA */}
                                    <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800 space-y-6">
                                        <div>
                                            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">Technologies Stack</h4>
                                            <div className="flex flex-wrap gap-1.5 max-h-[120px] overflow-y-auto pr-1">
                                                {selectedProject.technologies?.map((tech: string) => (
                                                    <span
                                                        key={tech}
                                                        className="px-2.5 py-1 text-[9px] uppercase font-bold tracking-wider bg-gray-50 text-gray-600 rounded-md dark:bg-gray-900 dark:text-gray-400 border border-gray-100 dark:border-gray-800"
                                                    >
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex gap-3" onClick={(e) => e.stopPropagation()}>
                                            {selectedProject.liveUrl && (
                                                <Button asChild className="flex-1 h-10 bg-blue-600 hover:bg-blue-700 text-white border-0 gap-2 text-xs font-semibold shadow-lg shadow-blue-500/10">
                                                    <a href={selectedProject.liveUrl} target="_blank" rel="noopener noreferrer">
                                                        <ExternalLink size={14} /> Live Demo
                                                    </a>
                                                </Button>
                                            )}
                                            {selectedProject.githubUrl && (
                                                <Button variant="outline" asChild className="flex-1 h-10 gap-2 border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 text-xs font-semibold">
                                                    <a href={selectedProject.githubUrl} target="_blank" rel="noopener noreferrer">
                                                        <GithubIcon size={14} /> Source Code
                                                    </a>
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </DialogContent>
                    );
                })()}
            </Dialog>
        </section>
    );
}

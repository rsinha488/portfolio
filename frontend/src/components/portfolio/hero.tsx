"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Mail, Phone, Download } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { GithubIcon, LinkedinIcon, TwitterIcon } from "./brand-icons";

const FALLBACK_PROFILE = {
    name: "Ruchi Sinha",
    title: "Full Stack Software Engineer",
    bio: "Full Stack Software Engineer with 5 years of experience building scalable, high-performance web applications using React.js, Next.js, Node.js, and MongoDB. Proven track record in designing and delivering multi-tenant SaaS platforms, RESTful APIs, and AI-integrated backend systems. Experienced with real-time communication (Socket.IO), event-driven architecture, and cloud services (AWS S3). Adept at implementing Role-Based Access Control (RBAC), microservices patterns, and frontend performance optimization. Seeking to leverage expertise in full-stack development and system design to drive product excellence.",
    avatar: "/ruchi-photo.jpg",
    phone: "",
    email: "ruchi.developer@outlook.com",
    githubUrl: "https://github.com/rsinha488",
    linkedinUrl: "https://linkedin.com/in/ruchi-developer",
    twitterUrl: "",
    resumeUrl: "",
    location: "Noida, Uttar Pradesh, India"
};

export default function Hero() {
    const { data: profile } = useQuery({
        queryKey: ["profile"],
        queryFn: async () => (await api.get("/profile")).data,
    });

    const displayProfile = profile || FALLBACK_PROFILE;
    const name = displayProfile.name;
    const title = displayProfile.title;
    const bio = displayProfile.bio;

    return (
        <section className="relative min-h-screen flex items-center justify-center bg-mesh-gradient overflow-hidden pt-24 pb-16">
            {/* Animated Background Blobs */}
            <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob dark:opacity-10" />
            <div className="absolute top-0 -right-4 w-72 h-72 bg-cyan-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000 dark:opacity-10" />
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000 dark:opacity-10" />

            <div className="container relative z-10 px-4 mx-auto">
                <div className="flex flex-col items-center text-center space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col items-center gap-4"
                    >
                        <span className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-600 rounded-full dark:bg-blue-900/30 dark:text-blue-400">
                            Available for hire
                        </span>

                        {(displayProfile.avatar || displayProfile.name) && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-xl ring-4 ring-blue-500/10 group mt-2"
                            >
                                <Image
                                    src={displayProfile.avatar || "/ruchi-photo.jpg"}
                                    alt={displayProfile.name || "Ruchi Sinha"}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    priority
                                />
                            </motion.div>
                        )}
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.15 }}
                        className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 dark:text-white max-w-4xl"
                    >
                        Hi, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">{name}</span>
                        <br />
                        <span className="text-3xl md:text-5xl font-semibold text-gray-700 dark:text-gray-300 mt-2 block">{title}</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl leading-relaxed"
                    >
                        {bio}
                    </motion.p>

                    {(displayProfile.email || displayProfile.phone) && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.25 }}
                            className="flex flex-wrap justify-center gap-6 text-sm text-gray-500 dark:text-gray-400 font-medium"
                        >
                            {displayProfile.email && (
                                <a href={`mailto:${displayProfile.email}`} className="flex items-center gap-2 hover:text-blue-600 transition-colors focus-visible:ring-2 focus-visible:ring-blue-600 rounded px-1">
                                    <Mail size={16} aria-hidden="true" />
                                    <span>{displayProfile.email}</span>
                                </a>
                            )}
                            {displayProfile.phone && (
                                <a href={`tel:${displayProfile.phone}`} className="flex items-center gap-2 hover:text-blue-600 transition-colors focus-visible:ring-2 focus-visible:ring-blue-600 rounded px-1">
                                    <Phone size={16} aria-hidden="true" />
                                    <span>{displayProfile.phone}</span>
                                </a>
                            )}
                        </motion.div>
                    )}

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="flex flex-wrap justify-center gap-4 pt-2"
                    >
                        <Button asChild size="lg" className="h-12 px-8 text-md gap-2 cursor-pointer shadow-lg shadow-blue-500/20 bg-blue-600 hover:bg-blue-700 text-white border-0">
                            <Link href="#projects">
                                View Projects <ArrowRight size={18} aria-hidden="true" />
                            </Link>
                        </Button>
                        <Button asChild size="lg" variant="outline" className="h-12 px-8 text-md gap-2 cursor-pointer border-gray-200 dark:border-gray-800 hover:bg-blue-50/50 dark:hover:bg-blue-950/20">
                            <a 
                                href={displayProfile.resumeUrl || "/Ruchi_Sinha_AI_FullStack_Engineer_2026.pdf"} 
                                download="Ruchi_Sinha_AI_FullStack_Engineer_2026.pdf"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Download size={18} aria-hidden="true" /> Download Resume
                            </a>
                        </Button>
                        <Button asChild size="lg" variant="outline" className="h-12 px-8 text-md cursor-pointer border-gray-200 dark:border-gray-800">
                            <Link href="#contact">
                                Contact Me
                            </Link>
                        </Button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="flex items-center gap-6 text-gray-500 dark:text-gray-400 pt-8"
                    >
                        {displayProfile.githubUrl && (
                            <Link
                                href={displayProfile.githubUrl}
                                className="hover:text-gray-900 dark:hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-blue-600 rounded-full p-1"
                                aria-label="Visit my GitHub profile"
                            >
                                <GithubIcon size={24} className="transition-transform group-hover:scale-110" />
                            </Link>
                        )}
                        {displayProfile.linkedinUrl && (
                            <Link
                                href={displayProfile.linkedinUrl}
                                className="hover:text-gray-900 dark:hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-blue-600 rounded-full p-1"
                                aria-label="Visit my LinkedIn profile"
                            >
                                <LinkedinIcon size={24} className="transition-transform group-hover:scale-110" />
                            </Link>
                        )}
                        {displayProfile.twitterUrl && (
                            <Link
                                href={displayProfile.twitterUrl}
                                className="hover:text-gray-900 dark:hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-blue-600 rounded-full p-1"
                                aria-label="Visit my Twitter profile"
                            >
                                <TwitterIcon size={24} className="transition-transform group-hover:scale-110" />
                            </Link>
                        )}
                    </motion.div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-400"
            >
                <span className="text-xs font-medium uppercase tracking-widest">Scroll</span>
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-1 h-8 bg-gradient-to-b from-blue-600 to-transparent rounded-full"
                />
            </motion.div>
        </section>
    );
}

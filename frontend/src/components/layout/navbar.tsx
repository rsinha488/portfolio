"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useSpring } from "framer-motion";
import { LayoutDashboard } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

export default function Navbar() {
    const { user, loading } = useAuth();
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="fixed top-0 left-0 right-0 z-50 border-b border-gray-100/50 dark:border-gray-800/50 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl transition-colors duration-500"
        >
            <motion.div
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 origin-left"
                style={{ scaleX }}
            />
            <div className="container px-4 mx-auto h-16 flex items-center justify-between">
                <Link href="/" className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-80 transition-opacity">
                    Ruchi Sinha
                </Link>

                <nav 
                    aria-label="Main navigation"
                    className="hidden md:flex items-center gap-6 text-[11px] uppercase font-bold tracking-widest text-gray-500 dark:text-gray-400"
                >
                    <Link href="#projects" className="hover:text-blue-600 transition-colors focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none rounded-sm">Projects</Link>
                    <Link href="#skills" className="hover:text-blue-600 transition-colors focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none rounded-sm">Skills</Link>
                    <Link href="#experience" className="hover:text-blue-600 transition-colors focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none rounded-sm">Experience</Link>
                    <Link href="#education" className="hover:text-blue-600 transition-colors focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none rounded-sm">Education</Link>
                    <Link href="#achievements" className="hover:text-blue-600 transition-colors focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none rounded-sm">Achievements</Link>
                    <Link href="#contact" className="hover:text-blue-600 transition-colors focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none rounded-sm">Contact</Link>
                </nav>

                <div className="flex items-center gap-3">
                    <ThemeToggle />
                    {!loading && user && (
                        <Link href="/dashboard">
                            <Button variant="default" size="sm" className="gap-2 cursor-pointer h-9 px-5 text-xs font-bold uppercase tracking-wider bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20" aria-label="Go to dashboard">
                                <LayoutDashboard size={14} aria-hidden="true" />
                                Dashboard
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        </motion.header>
    );
}

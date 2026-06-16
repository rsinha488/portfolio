"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useSpring } from "framer-motion";
import { LayoutDashboard } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import api from "@/lib/api";

export default function Navbar() {
    const { user, loading } = useAuth();
    const [activeSection, setActiveSection] = useState<string>("");

    useEffect(() => {
        const hasVisited = sessionStorage.getItem('portfolio_visited_session');
        if (!hasVisited) {
            const logVisit = async () => {
                try {
                    await api.post('/analytics/visit');
                    sessionStorage.setItem('portfolio_visited_session', 'true');
                } catch (err) {
                    console.error('Failed to log visit:', err);
                }
            };
            logVisit();
        }
    }, []);

    useEffect(() => {
        const sections = ["skills", "experience", "education", "projects", "achievements", "contact"];
        
        const observerOptions = {
            root: null,
            rootMargin: "-25% 0px -55% 0px", // Trigger when the section occupies the viewport center
            threshold: 0.05,
        };

        const observerCallback = (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        sections.forEach((id) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        const handleScroll = () => {
            if (window.scrollY < 50) {
                setActiveSection("");
            }
        };
        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
            observer.disconnect();
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

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
                    {[
                        { id: "skills", label: "Skills" },
                        { id: "experience", label: "Experience" },
                        { id: "education", label: "Education" },
                        { id: "projects", label: "Projects" },
                        { id: "achievements", label: "Achievements" },
                        { id: "contact", label: "Contact" },
                    ].map((item) => (
                        <Link
                            key={item.id}
                            href={`#${item.id}`}
                            className={`relative py-1 transition-colors focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none rounded-sm ${
                                activeSection === item.id 
                                    ? "text-blue-600 dark:text-blue-400 font-extrabold" 
                                    : "text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 font-bold"
                            }`}
                        >
                            {item.label}
                            {activeSection === item.id && (
                                <motion.span
                                    layoutId="activeNavSection"
                                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-600 to-cyan-500"
                                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                />
                            )}
                        </Link>
                    ))}
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

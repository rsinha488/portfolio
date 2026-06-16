"use client";

import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const FALLBACK_BLOGS = [
    {
        _id: "blog-1",
        title: "Building Multi-Tenant SaaS Platforms with Voice AI",
        excerpt: "An in-depth look at architecting scalable voice agent platforms using Next.js, Node.js, and VAPI integration.",
        createdAt: "2026-05-15T00:00:00.000Z",
        slug: "building-multi-tenant-saas-platforms-voice-ai",
        published: true
    },
    {
        _id: "blog-2",
        title: "Optimizing API Performance and Query Speeds in MERN Stack",
        excerpt: "Practical strategies to cut database latency by 25% using memoization, query optimization, and asynchronous processing.",
        createdAt: "2026-04-10T00:00:00.000Z",
        slug: "optimizing-api-performance-mern-stack",
        published: true
    }
];

export default function BlogSection() {
    const { data: blogs, isLoading } = useQuery({
        queryKey: ["blogs"],
        queryFn: async () => {
            const res = await api.get("/blogs");
            return res.data;
        },
    });

    const displayBlogs = blogs?.length ? blogs : FALLBACK_BLOGS;

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
        <section id="blog" className="py-24 bg-white dark:bg-gray-900">
            <div className="container px-4 mx-auto">
                <div className="text-center mb-16">
                    <Skeleton className="h-10 w-64 mx-auto mb-4" />
                    <Skeleton className="h-6 w-96 mx-auto" />
                </div>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                        <Card key={i} className="h-64 flex flex-col border-gray-100 dark:border-gray-800 animate-pulse">
                            <CardHeader className="pb-2">
                                <Skeleton className="h-8 w-3/4" />
                            </CardHeader>
                            <CardContent className="flex-1 space-y-4">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <div className="mt-4 pt-4 border-t flex justify-between items-center">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-4 w-20" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );

    if (!displayBlogs?.length) return null;

    return (
        <section id="blog" className="py-24 bg-white dark:bg-gray-900">
            <div className="container px-4 mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Latest Insights</h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        Thoughts on technology, design, and development.
                    </p>
                </motion.div>

                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
                >
                    {displayBlogs.map((blog: any) => (
                        <motion.div
                            key={blog._id}
                            variants={itemVariants}
                        >
                            <Card className="h-full flex flex-col hover:shadow-xl transition-all duration-300 border-gray-100 dark:border-gray-800">
                                <CardHeader>
                                    <CardTitle className="text-xl font-bold line-clamp-2 hover:text-blue-600 transition-colors uppercase tracking-tight">{blog.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="flex-1 flex flex-col">
                                    <p className="text-gray-600 dark:text-gray-400 line-clamp-3 mb-4 flex-1 leading-relaxed">
                                        {blog.excerpt}
                                    </p>
                                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50 dark:border-gray-800">
                                        <span className="text-xs font-semibold text-gray-400 tracking-wider">
                                            {new Date(blog.createdAt).toLocaleDateString(undefined, { 
                                                year: 'numeric', 
                                                month: 'short', 
                                                day: 'numeric' 
                                            })}
                                        </span>
                                        <Link 
                                            href={`/blog/${blog.slug}`} 
                                            className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-xs font-bold uppercase tracking-widest transition-colors group"
                                            aria-label={`Read more about: ${blog.title}`}
                                        >
                                            Read More 
                                            <ArrowRight size={14} aria-hidden="true" className="group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}

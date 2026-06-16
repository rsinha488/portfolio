"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Trash2, MailOpen, Mail, Search, Reply, Calendar, User, AtSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

interface Message {
    _id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    read: boolean;
    createdAt: string;
}

export default function MessagesPage() {
    const queryClient = useQueryClient();
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 300);
    const [filter, setFilter] = useState<"all" | "unread" | "read">("all");

    const { data: messages, isLoading } = useQuery({
        queryKey: ["messages"],
        queryFn: async () => (await api.get("/contact")).data as Message[],
    });

    const readMutation = useMutation({
        mutationFn: async (id: string) => api.put(`/contact/${id}/read`, {}),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["messages"] }),
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => api.delete(`/contact/${id}`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["messages"] }),
    });

    const filteredMessages = useMemo(() => {
        if (!messages) return [];
        return messages.filter((msg) => {
            const matchesSearch = 
                msg.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                msg.email.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                msg.subject.toLowerCase().includes(debouncedSearch.toLowerCase());
            
            const matchesFilter = 
                filter === "all" || 
                (filter === "unread" && !msg.read) || 
                (filter === "read" && msg.read);

            return matchesSearch && matchesFilter;
        });
    }, [messages, debouncedSearch, filter]);

    const unreadCount = messages?.filter((m) => !m.read).length ?? 0;

    const handleReply = (msg: Message) => {
        const mailto = `mailto:${msg.email}?subject=RE: ${msg.subject}&body=%0A%0A--- Original Message ---%0AFrom: ${msg.name}%0A"${msg.message}"`;
        globalThis.location.href = mailto;
    };

    if (isLoading) return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <Skeleton className="h-10 w-48" />
                <Skeleton className="h-10 w-32" />
            </div>
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-40 w-full rounded-xl" />
                ))}
            </div>
        </div>
    );

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <h2 className="text-3xl font-bold tracking-tight">Messages</h2>
                    <AnimatePresence>
                        {unreadCount > 0 && (
                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                            >
                                <Badge variant="destructive" className="animate-pulse">
                                    {unreadCount} New
                                </Badge>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                
                <div className="flex items-center gap-2">
                    <div className="relative group flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={16} />
                        <Input 
                            placeholder="Search inbox..." 
                            className="pl-9 h-10 border-gray-100 focus:ring-blue-500/20"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                        {(["all", "unread", "read"] as const).map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all capitalize ${
                                    filter === f 
                                    ? "bg-white dark:bg-gray-700 text-blue-600 shadow-sm" 
                                    : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
                                }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid gap-4">
                <AnimatePresence mode="popLayout">
                    {filteredMessages.length === 0 ? (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-20 bg-gray-50/50 dark:bg-gray-900/50 rounded-2xl border-2 border-dashed border-gray-100 dark:border-gray-800"
                        >
                            <Mail className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                            <p className="text-gray-500 font-medium">Your inbox is empty</p>
                            <p className="text-xs text-gray-400 mt-1">Try adjusting your filters or search terms</p>
                        </motion.div>
                    ) : (
                        filteredMessages.map((msg, index) => (
                            <motion.div
                                key={msg._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: index * 0.05 }}
                                layout
                            >
                                <Card className={`group transition-all duration-300 hover:shadow-lg ${msg.read ? "border-gray-100 dark:border-gray-800" : "border-l-4 border-l-blue-600 bg-blue-50/10 dark:bg-blue-900/5"}`}>
                                    <CardHeader className="pb-3 border-b border-gray-50 dark:border-gray-800">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="p-1.5 bg-gray-100 dark:bg-gray-800 rounded text-gray-500">
                                                        <User size={14} />
                                                    </span>
                                                    <CardTitle className="text-base font-bold">{msg.name}</CardTitle>
                                                    {!msg.read && <Badge variant="default" className="bg-blue-600 text-[10px] h-5">New Message</Badge>}
                                                </div>
                                                <div className="flex items-center gap-3 text-sm text-gray-500">
                                                    <span className="flex items-center gap-1"><AtSign size={13} /> {msg.email}</span>
                                                    <span className="flex items-center gap-1"><Calendar size={13} /> {new Date(msg.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {!msg.read && (
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon" 
                                                        className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                                        onClick={() => readMutation.mutate(msg._id)}
                                                        title="Mark as Read"
                                                    >
                                                        <MailOpen size={16} />
                                                    </Button>
                                                )}
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="h-8 w-8 text-gray-400 hover:text-blue-600"
                                                    onClick={() => handleReply(msg)}
                                                    title="Quick Reply"
                                                >
                                                    <Reply size={16} />
                                                </Button>
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="h-8 w-8 text-gray-400 hover:text-red-600"
                                                    onClick={() => {
                                                        if (confirm("Permanently delete this message?")) deleteMutation.mutate(msg._id);
                                                    }}
                                                    title="Delete Message"
                                                >
                                                    <Trash2 size={16} />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-4">
                                        {msg.subject && (
                                            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Subject: {msg.subject}</h4>
                                        )}
                                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                                            {msg.message}
                                        </p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { 
    FolderKanban, 
    FileText, 
    MessageSquare, 
    Star, 
    Code2, 
    Eye, 
    Activity, 
    ArrowUpRight,
    TrendingUp
} from "lucide-react";
import api from "@/lib/api";
import { motion } from "framer-motion";

interface DashboardStats {
    totalProjects: number;
    totalBlogs: number;
    totalTestimonials: number;
    totalMessages: number;
    totalSkills: number;
    totalViews: number;
}

interface ChartItem {
    date: string;
    views: number;
}

interface ActivityItem {
    id: string;
    type: "project" | "blog" | "message" | "testimonial";
    title: string;
    description: string;
    timestamp: string;
}

export default function DashboardPage() {
    const { user } = useAuth();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [chartData, setChartData] = useState<ChartItem[]>([]);
    const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await api.get("/analytics/stats");
                if (res.data.success) {
                    setStats(res.data.stats);
                    setChartData(res.data.chartData);
                    setRecentActivity(res.data.recentActivity);
                }
            } catch (err) {
                console.error("Error fetching dashboard statistics:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                    <p className="text-sm text-gray-500 font-medium animate-pulse">Loading dashboard statistics...</p>
                </div>
            </div>
        );
    }

    // Determine max views for SVG chart height scaling
    const maxViews = Math.max(...chartData.map(item => item.views), 5);

    // Activity icon map
    const getActivityIcon = (type: string) => {
        switch (type) {
            case "project":
                return <FolderKanban className="h-4 w-4 text-blue-600" />;
            case "blog":
                return <FileText className="h-4 w-4 text-emerald-600" />;
            case "message":
                return <MessageSquare className="h-4 w-4 text-purple-600" />;
            case "testimonial":
                return <Star className="h-4 w-4 text-amber-500" fill="currentColor" />;
            default:
                return <Activity className="h-4 w-4 text-gray-600" />;
        }
    };

    // Activity bg-color map
    const getActivityBg = (type: string) => {
        switch (type) {
            case "project": return "bg-blue-50 dark:bg-blue-950/30 border-blue-100 dark:border-blue-900/50";
            case "blog": return "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900/50";
            case "message": return "bg-purple-50 dark:bg-purple-950/30 border-purple-100 dark:border-purple-900/50";
            case "testimonial": return "bg-amber-50 dark:bg-amber-950/30 border-amber-100 dark:border-amber-900/50";
            default: return "bg-gray-50 dark:bg-gray-850 border-gray-100 dark:border-gray-800";
        }
    };

    // Format relative time helper
    const formatTime = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffMins < 1) return "Just now";
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays === 1) return "Yesterday";
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                        Overview
                    </h2>
                    <p className="text-sm text-gray-500">
                        Real-time analytics and portfolio content status.
                    </p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {/* Total Views Card */}
                <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-lg dark:hover:shadow-blue-950/20 border-border bg-card text-card-foreground">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                            Total Visits
                        </CardTitle>
                        <div className="rounded-lg bg-blue-50 dark:bg-blue-950/40 p-2 text-blue-600 dark:text-blue-400">
                            <Eye className="h-5 w-5" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                            {stats?.totalViews || 1}
                        </div>
                        <div className="mt-1 flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 font-medium">
                            <TrendingUp className="h-3 w-3" />
                            <span>Live unique session tracker</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Total Projects Card */}
                <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-lg dark:hover:shadow-emerald-950/20 border-border bg-card text-card-foreground">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                            Projects
                        </CardTitle>
                        <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/40 p-2 text-emerald-600 dark:text-emerald-400">
                            <FolderKanban className="h-5 w-5" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                            {stats?.totalProjects || 0}
                        </div>
                        <div className="mt-1 flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                            <ArrowUpRight className="h-3 w-3" />
                            <span>Displayed on portfolio</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Total Contact Messages */}
                <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-lg dark:hover:shadow-purple-950/20 border-border bg-card text-card-foreground">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                            Inquiries
                        </CardTitle>
                        <div className="rounded-lg bg-purple-50 dark:bg-purple-950/40 p-2 text-purple-600 dark:text-purple-400">
                            <MessageSquare className="h-5 w-5" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                            {stats?.totalMessages || 0}
                        </div>
                        <div className="mt-1 flex items-center gap-1 text-xs text-purple-600 dark:text-purple-400 font-medium">
                            <ArrowUpRight className="h-3 w-3" />
                            <span>Visitor contact submissions</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Total Blogs Card */}
                <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-lg dark:hover:shadow-teal-950/20 border-border bg-card text-card-foreground">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                            Blog Posts
                        </CardTitle>
                        <div className="rounded-lg bg-teal-50 dark:bg-teal-950/40 p-2 text-teal-600 dark:text-teal-400">
                            <FileText className="h-5 w-5" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                            {stats?.totalBlogs || 0}
                        </div>
                        <div className="mt-1 flex items-center gap-1 text-xs text-teal-600 dark:text-teal-400 font-medium">
                            <span>Articles written</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Testimonials Card */}
                <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-lg dark:hover:shadow-amber-950/20 border-border bg-card text-card-foreground">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                            Testimonials
                        </CardTitle>
                        <div className="rounded-lg bg-amber-50 dark:bg-amber-950/40 p-2 text-amber-500 dark:text-amber-400">
                            <Star className="h-5 w-5" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                            {stats?.totalTestimonials || 0}
                        </div>
                        <div className="mt-1 flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 font-medium">
                            <span>Client feedbacks</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Total Skills Card */}
                <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-lg dark:hover:shadow-rose-950/20 border-border bg-card text-card-foreground">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                            Skills
                        </CardTitle>
                        <div className="rounded-lg bg-rose-50 dark:bg-rose-950/40 p-2 text-rose-600 dark:text-rose-400">
                            <Code2 className="h-5 w-5" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                            {stats?.totalSkills || 0}
                        </div>
                        <div className="mt-1 flex items-center gap-1 text-xs text-rose-600 dark:text-rose-400 font-medium">
                            <span>Tech stack competencies</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Layout Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                {/* Visual Premium Analytics Chart */}
                <Card className="col-span-4 border-border bg-card text-card-foreground">
                    <CardHeader>
                        <CardTitle className="text-base font-bold flex items-center gap-2">
                            <span>Traffic Overview</span>
                            <span className="text-xs font-normal text-gray-400 dark:text-gray-500">(Last 7 Days)</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="h-[280px] flex flex-col justify-end">
                        {chartData.length === 0 ? (
                            <div className="h-full flex items-center justify-center text-gray-400">
                                No traffic data recorded.
                            </div>
                        ) : (
                            <div className="w-full flex-1 flex flex-col">
                                {/* The dynamic chart area */}
                                <div className="flex-1 flex items-end gap-3 px-2 border-b border-gray-100 dark:border-gray-800 pb-2 relative">
                                    {/* Grid Lines */}
                                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
                                        <div className="w-full border-t border-dashed border-gray-200 dark:border-gray-800 h-0" />
                                        <div className="w-full border-t border-dashed border-gray-200 dark:border-gray-800 h-0" />
                                        <div className="w-full border-t border-dashed border-gray-200 dark:border-gray-800 h-0" />
                                    </div>

                                    {chartData.map((item, idx) => {
                                        const heightPercent = (item.views / maxViews) * 100;
                                        return (
                                            <div 
                                                key={idx} 
                                                className="flex-1 flex flex-col items-center group relative h-full justify-end cursor-pointer"
                                                onMouseEnter={() => setHoveredBarIndex(idx)}
                                                onMouseLeave={() => setHoveredBarIndex(null)}
                                            >
                                                {/* Tooltip */}
                                                {hoveredBarIndex === idx && (
                                                    <div className="absolute -top-10 bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-md pointer-events-none z-10 font-bold whitespace-nowrap">
                                                        {item.views} {item.views === 1 ? 'visit' : 'visits'}
                                                    </div>
                                                )}

                                                {/* Bar */}
                                                <motion.div
                                                    initial={{ height: 0 }}
                                                    animate={{ height: `${Math.max(8, heightPercent)}%` }}
                                                    transition={{ duration: 0.6, delay: idx * 0.05, ease: "easeOut" }}
                                                    className={`w-full rounded-t-md bg-gradient-to-t from-blue-600 to-cyan-400 group-hover:from-blue-500 group-hover:to-cyan-300 transition-all duration-300 relative`}
                                                >
                                                    {/* Pulse effect for top bar on hover */}
                                                    <div className="absolute top-0 left-0 right-0 h-1 bg-white/30 rounded-t-md" />
                                                </motion.div>
                                            </div>
                                        );
                                    })}
                                </div>
                                {/* X-axis dates */}
                                <div className="flex gap-3 px-2 pt-2 text-[10px] text-gray-400 font-bold tracking-wider uppercase text-center justify-between">
                                    {chartData.map((item, idx) => (
                                        <div key={idx} className="flex-1 truncate">
                                            {item.date}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Live Activity Feed */}
                <Card className="col-span-3 border-border bg-card text-card-foreground">
                    <CardHeader>
                        <CardTitle className="text-base font-bold">Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {recentActivity.length === 0 ? (
                            <div className="h-[200px] flex items-center justify-center text-gray-400 text-sm">
                                No recent activity logged.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {recentActivity.map((activity) => (
                                    <div key={activity.id} className="flex items-start gap-3">
                                        <div className={`p-2 rounded-lg border ${getActivityBg(activity.type)} mt-0.5`}>
                                            {getActivityIcon(activity.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">
                                                {activity.title}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-0.5">
                                                {activity.description}
                                            </p>
                                            <span className="text-[10px] font-semibold tracking-wider text-gray-400 dark:text-gray-500 uppercase mt-1 inline-block">
                                                {formatTime(activity.timestamp)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

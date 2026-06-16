"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import {
    LayoutDashboard,
    FolderKanban,
    FileText,
    LogOut,
    Briefcase,
    MessageSquare,
    Star,
    Users,
    Code2,
    UserCircle,
} from "lucide-react";

const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/profile", label: "Hero & Profile", icon: UserCircle },
    { href: "/dashboard/projects", label: "Projects", icon: FolderKanban },
    { href: "/dashboard/timeline", label: "Journey", icon: Briefcase },
    { href: "/dashboard/skills", label: "Skills", icon: Code2 },
    { href: "/dashboard/blogs", label: "Blogs", icon: FileText },
    { href: "/dashboard/testimonials", label: "Testimonials", icon: Star },
    { href: "/dashboard/messages", label: "Messages", icon: MessageSquare },
    { href: "/dashboard/users", label: "Users", icon: Users },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { user, loading, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push('/login');
            } else if (user.role !== 'admin') {
                router.push('/');
            }
        }
    }, [user, loading, router]);

    if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
    if (!user || user.role !== 'admin') return null;

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            {/* Sidebar */}
            <aside 
                aria-label="Dashboard Sidebar"
                className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 hidden md:flex flex-col"
            >
                <div className="p-6 flex items-center justify-between border-b border-gray-100 dark:border-gray-700/50">
                    <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">Portfolio Admin</h1>
                    <ThemeToggle />
                </div>

                <nav 
                    aria-label="Dashboard navigation"
                    className="flex-1 px-4 py-6 space-y-1"
                >
                    {navItems.map(({ href, label, icon: Icon }) => (
                        <Link 
                            key={href} 
                            href={href}
                            aria-label={`Go to ${label}`}
                        >
                            <Button variant="ghost" className="w-full justify-start gap-2 cursor-pointer">
                                <Icon size={18} aria-hidden="true" />
                                {label}
                            </Button>
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3 mb-4">
                        {user.avatar && (
                            <img src={user.avatar} alt={`Profile picture of ${user.name}`} className="w-10 h-10 rounded-full" />
                        )}
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium truncate">{user.name}</p>
                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                    </div>
                    <Button 
                        variant="destructive" 
                        className="w-full gap-2 cursor-pointer" 
                        onClick={logout}
                        aria-label="Log out of administrator dashboard"
                    >
                        <LogOut size={18} aria-hidden="true" /> Logout
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Mobile Header */}
                <header className="h-16 md:hidden bg-white dark:bg-gray-850 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6 shrink-0">
                    <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">Portfolio Admin</span>
                    <ThemeToggle />
                </header>
                <main className="flex-1 overflow-y-auto p-8 bg-gray-50 dark:bg-gray-900/50">
                    {children}
                </main>
            </div>
        </div>
    );
}

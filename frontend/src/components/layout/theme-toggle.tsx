"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme, resolvedTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-500 rounded-full border border-transparent" disabled>
                <span className="sr-only">Toggle theme</span>
            </Button>
        );
    }

    const currentTheme = theme === "system" ? resolvedTheme : theme;

    return (
        <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-full border border-gray-200/50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800"
            onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
            aria-label={`Switch to ${currentTheme === "dark" ? "light" : "dark"} theme`}
        >
            {currentTheme === "dark" ? (
                <Sun size={16} />
            ) : (
                <Moon size={16} />
            )}
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
}

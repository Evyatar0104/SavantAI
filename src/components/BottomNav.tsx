"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Trophy, User, Crosshair } from "lucide-react";
import { cn } from "@/lib/utils";
import { m } from "framer-motion";

const NAV_ROUTES = ["/", "/tracks", "/practice", "/leaderboard", "/profile"];

const links = [
    { href: "/", label: "ראשי", icon: Home },
    { href: "/tracks", label: "מסלולים", icon: Compass },
    { href: "/practice", label: "תרגול", icon: Crosshair },
    { href: "/leaderboard", label: "דירוג", icon: Trophy },
    { href: "/profile", label: "פרופיל", icon: User },
];

export function BottomNav() {
    const pathname = usePathname();
    const isNavScreen = NAV_ROUTES.includes(pathname ?? "");

    if (!isNavScreen) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 px-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pointer-events-none flex justify-center">
            <m.nav
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", damping: 28, stiffness: 260, delay: 0.1 }}
                className="pointer-events-auto w-full max-w-sm rounded-[24px] px-2 py-2 flex justify-between items-center bg-zinc-950 border border-white/10 stacked-shadow relative overflow-hidden"
            >
                {/* Subtle shine effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />

                {links.map((link) => {
                    const isActive = pathname === link.href;
                    const Icon = link.icon;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            prefetch={true}
                            className="relative flex flex-col items-center justify-center w-16 h-14 rounded-full group outline-none"
                        >
                            {isActive && (
                                <m.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-black/5 dark:bg-white/10 rounded-full"
                                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                />
                            )}
                            <m.div
                                whileTap={{ scale: 0.85 }}
                                className={cn(
                                    "relative z-10 flex flex-col items-center justify-center space-y-1 transition-colors duration-300",
                                    isActive
                                        ? "text-blue-600 dark:text-blue-400"
                                        : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
                                )}
                            >
                                <Icon className="w-5 h-5 mb-[1px]" strokeWidth={isActive ? 2.5 : 2} />
                                <span className="text-[10px] font-medium tracking-wide leading-none">{link.label}</span>
                            </m.div>
                        </Link>
                    );
                })}
            </m.nav>
        </div>
    );
}

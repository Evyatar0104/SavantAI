"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Trophy, User, Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import { m } from "framer-motion";
import { useSavantStore } from "@/store/useSavantStore";

export function Sidebar() {
    const pathname = usePathname();
    const isLessonPage = pathname?.startsWith("/lesson");
    const xp = useSavantStore(state => state.xp);
    const streak = useSavantStore(state => state.streak);

    if (isLessonPage) return null;

    const links = [
        { href: "/", label: "ראשי", icon: Home },
        { href: "/tracks", label: "מסלולים", icon: Compass },
        { href: "/leaderboard", label: "דירוג עולמי", icon: Trophy },
        { href: "/profile", label: "פרופיל", icon: User },
    ];

    const getLevelInfo = (totalXp: number) => {
        const level = Math.floor(Math.sqrt(totalXp / 100)) + 1;
        const currentLevelXp = Math.pow(level - 1, 2) * 100;
        const nextLevelXp = Math.pow(level, 2) * 100;
        const progress = ((totalXp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100;
        return { level, currentLevelXp, nextLevelXp, progress: Math.min(Math.max(progress, 0), 100) };
    };

    const { level, nextLevelXp, progress } = getLevelInfo(xp);

    return (
        <aside className="hidden md:flex flex-col w-80 min-w-[320px] max-w-[320px] shrink-0 h-[100dvh] border-l border-black/5 dark:border-white/5 sticky top-0 right-0 glass-panel px-6 py-10 z-40 text-foreground">
            {/* Top User Profile */}
            <div className="px-2 mb-10">
                <m.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-between items-center mb-6 bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 rounded-3xl p-3 pr-4 shadow-sm"
                >
                    <div className="flex items-center space-x-3 space-x-reverse">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-2xl shadow-inner shrink-0 relative">
                            <div className="absolute inset-0 rounded-full border border-white/20"></div>
                            🧑‍🎓
                        </div>
                        <div className="leading-tight">
                            <p className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-0.5">ברוך שובך</p>
                            <p className="text-lg font-black tracking-tight">לומד/ת</p>
                        </div>
                    </div>
                    {/* Stats Badges */}
                    <div className="flex gap-2">
                        <div className="flex flex-col items-center justify-center bg-orange-500/10 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 rounded-2xl w-12 h-12 shadow-inner border border-orange-500/20" title="מד סטריק">
                            <Flame className="w-4 h-4 mb-0.5" />
                            <span className="text-sm font-black leading-none">{streak}</span>
                        </div>
                        <div className="flex flex-col items-center justify-center bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-2xl w-12 h-12 shadow-inner border border-emerald-500/20">
                            <span className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-[-2px]">Lvl</span>
                            <span className="text-lg font-black leading-none">{level}</span>
                        </div>
                    </div>
                </m.div>

                {/* XP and Level Bar */}
                <div className="rounded-[20px] px-2">
                    <div className="flex justify-between items-end mb-2.5">
                        <span className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                            התקדמות לרמה {level + 1}
                        </span>
                        <span className="text-xs font-bold font-mono text-foreground/80 bg-foreground/5 px-2 py-0.5 rounded-md">{xp} / {nextLevelXp} XP</span>
                    </div>
                    <div className="h-3 w-full bg-black/5 dark:bg-white/5 shadow-inner border border-black/5 dark:border-white/5 rounded-full overflow-hidden p-[2px]">
                        <m.div
                            className="h-full bg-gradient-to-l from-blue-400 to-indigo-600 rounded-full relative overflow-hidden"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                        >
                            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.3)_50%,transparent_100%)] w-full h-full" style={{ backgroundSize: '200% 100%' }}></div>
                        </m.div>
                    </div>
                </div>
            </div>

            <nav className="flex-1 space-y-2.5 px-1 mt-4">
                {links.map((link) => {
                    const isActive = pathname === link.href;
                    const Icon = link.icon;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="block relative outline-none group"
                        >
                            {isActive && (
                                <m.div
                                    layoutId="activeSidebarTab"
                                    className="absolute inset-0 bg-blue-50 dark:bg-white/10 rounded-2xl border border-blue-100 dark:border-white/5 shadow-sm"
                                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                />
                            )}
                            <div
                                className={cn(
                                    "relative z-10 flex items-center px-4 py-3.5 rounded-2xl transition-all duration-300",
                                    isActive
                                        ? "text-blue-600 dark:text-blue-400 font-extrabold"
                                        : "text-zinc-500 hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 font-semibold"
                                )}
                            >
                                <Icon className={cn("w-5 h-5 ml-4 mb-[1px] transition-transform duration-300", isActive ? "scale-110 drop-shadow-md" : "group-hover:scale-110")} strokeWidth={isActive ? 2.5 : 2} />
                                <span className="tracking-wide text-[15px]">{link.label}</span>
                            </div>
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Savant Logo */}
            <div className="mt-auto px-4 pt-8 pb-6 border-t border-black/5 dark:border-white/5">
                <div className="flex flex-row items-center justify-center opacity-95 hover:opacity-100 transition-all cursor-pointer group space-x-3 space-x-reverse h-auto">
                    <m.div
                        whileHover={{ rotate: 8, scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        className="w-10 h-10 flex items-center justify-center transition-all duration-300 shrink-0 drop-shadow-[0_0_15px_rgba(59,130,246,0.2)]"
                    >
                        <img src="/assets/savant-logo.png" alt="Savant Logo" className="w-full h-full object-contain" />
                    </m.div>
                    <h1 className="text-3xl font-black tracking-tighter text-foreground transition-all group-hover:text-blue-500 leading-none">Savant</h1>
                </div>
            </div>
        </aside>
    );
}

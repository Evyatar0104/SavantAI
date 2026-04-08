"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Home, Compass, Trophy, User, Crosshair, GraduationCap, Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import { m } from "framer-motion";
import { useSavantStore } from "@/store/useSavantStore";
import { MODEL_THEMES, getLevelInfo } from "@/lib/userTheme";

export function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const isHiddenPage =
        pathname?.startsWith("/lesson") ||
        pathname === "/quiz" ||
        pathname?.includes("/practice/builder/") ||
        pathname?.startsWith("/paths/") ||
        (pathname?.startsWith("/courses/") ?? false);

    const userName = useSavantStore(state => state.userName);
    const userColor = useSavantStore(state => state.userColor);
    const primaryModel = useSavantStore(state => state.primaryModel);
    const profileTitle = useSavantStore(state => state.profileTitle);
    
    const name = userName || "לומד/ת";
    const xp = useSavantStore(state => state.xp);
    const streak = useSavantStore(state => state.streak);

    if (isHiddenPage) return null;

    const { level, progress, xpToNext } = getLevelInfo(xp);
    const theme = MODEL_THEMES[primaryModel || "default"] || MODEL_THEMES.default;
    const activeUserColor = userColor || theme.primary;
    const titlePill = profileTitle || "מתחיל/ה";

    const navItems = [
        { section: "primary", href: "/",           label: "ראשי",       icon: Home    },
        { section: "primary", href: "/courses",     label: "למידה",      icon: GraduationCap },
        { section: "primary", href: "/practice",    label: "תרגול",      icon: Crosshair },
        { section: "secondary", href: "/leaderboard", label: "דירוג עולמי", icon: Trophy  },
        { section: "secondary", href: "/profile",     label: "פרופיל",     icon: User    },
    ];

    const shortcuts = [
        { emoji: "📖", label: "המשך ללמוד", onClick: () => router.push("/courses/how-llms-work") },
        { emoji: "🎯", label: "האפיון שלי",  onClick: () => router.push("/quiz")                  },
    ];

    const firstLetter = (userName ? userName.charAt(0) : "ל").toUpperCase();

    return (
        <aside
            className="hidden md:flex flex-col w-80 min-w-[320px] max-w-[320px] shrink-0 h-[100dvh] border-l border-white/[0.06] sticky top-0 right-0 z-40 text-foreground overflow-y-auto bg-transparent rtl"
            style={{ direction: "rtl" }}
        >
            {/* ── USER CARD ─────────────────────────── */}
            <div 
                className="m-3 rounded-[24px] p-[1px] relative overflow-hidden cursor-pointer group shadow-xl"
                style={{ 
                    background: `linear-gradient(135deg, ${activeUserColor}40, ${theme.secondary}20)`,
                }}
                onClick={() => router.push("/profile")}
            >
                <div className="glass-panel rounded-[23px] p-4 relative overflow-hidden">
                    {/* Background mesh gradient */}
                    <div className="absolute inset-0 opacity-20 pointer-events-none" 
                         style={{ 
                            background: `radial-gradient(circle at 20% 30%, ${activeUserColor}, transparent 70%), 
                                         radial-gradient(circle at 80% 70%, ${theme.secondary}, transparent 70%)`,
                            filter: "blur(30px)"
                         }} 
                    />

                    <div className="relative z-10 flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            {/* Squarcle Avatar */}
                            <div className="relative shrink-0">
                                <div 
                                    className="w-12 h-12 squarcle bg-gradient-to-br p-[1.5px] shadow-lg transition-transform group-hover:scale-105 duration-500 relative"
                                    style={{ backgroundImage: `linear-gradient(135deg, ${activeUserColor}, ${theme.secondary})` }}
                                >
                                    <div className="w-full h-full squarcle bg-zinc-950 flex items-center justify-center">
                                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-br"
                                              style={{ backgroundImage: `linear-gradient(135deg, ${activeUserColor}, ${theme.secondary})` }}>
                                            {firstLetter}
                                        </span>
                                    </div>
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white text-black flex items-center justify-center font-black text-[9px] shadow-xl border-2 border-zinc-950">
                                    {level}
                                </div>
                            </div>

                            <div className="flex flex-col min-w-0">
                                <span className="text-sm font-bold text-white truncate leading-tight">{name}</span>
                                <div className="flex items-center gap-1.5 mt-1">
                                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-white/10 text-white/90 border border-white/10 backdrop-blur-md">
                                        {titlePill}
                                    </span>
                                    <div className="flex items-center gap-1 text-[9px] text-emerald-400 font-bold">
                                        <Flame size={10} fill="currentColor" />
                                        {streak}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Progress section */}
                        <div className="space-y-1.5">
                            <div className="flex justify-between items-end text-[9px] font-bold">
                                <span className="text-white/40">התקדמות</span>
                                <span className="text-white/80">{xpToNext} XP לרמה הבאה</span>
                            </div>
                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-[1px]">
                                <m.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    className="h-full rounded-full relative"
                                    style={{ background: `linear-gradient(to left, ${activeUserColor}, ${theme.secondary})` }}
                                >
                                    <div className="absolute inset-0 bg-white/20 mix-blend-overlay animate-[shimmer_2s_infinite]" />
                                </m.div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── NAV ITEMS ─────────────────────────── */}
            <nav className="flex flex-col mt-3">
                {navItems.filter(i => i.section === "primary").map((link) => {
                    const isActive = pathname === link.href || (link.href === "/tracks" && pathname?.startsWith("/tracks"));
                    const Icon = link.icon;
                    return (
                        <Link key={link.href} href={link.href} prefetch={true} className="outline-none m-[2px_8px]">
                            <div className={cn(
                                "flex items-center gap-2.5 cursor-pointer transition-all duration-150 p-[10px_16px] rounded-xl",
                                isActive
                                    ? "text-foreground font-medium bg-white/[0.05]"
                                    : "text-zinc-400 hover:text-foreground hover:bg-white/[0.04]"
                            )}>
                                <Icon className="w-[18px] h-[18px] shrink-0" strokeWidth={isActive ? 2.5 : 2} />
                                <span className={cn("text-sm", isActive ? "font-medium" : "font-normal")}>{link.label}</span>
                            </div>
                        </Link>
                    );
                })}

                {/* 20px gap instead of divider */}
                <div className="h-5" />

                {navItems.filter(i => i.section === "secondary").map((link) => {
                    const isActive = pathname === link.href;
                    const Icon = link.icon;
                    return (
                        <Link key={link.href} href={link.href} prefetch={true} className="outline-none m-[2px_8px]">
                            <div className={cn(
                                "flex items-center gap-2.5 cursor-pointer transition-all duration-150 p-[10px_16px] rounded-xl",
                                isActive
                                    ? "text-foreground font-medium bg-white/[0.05]"
                                    : "text-zinc-400 hover:text-foreground hover:bg-white/[0.04]"
                            )}>
                                <Icon className="w-4 h-4 shrink-0" strokeWidth={isActive ? 2.5 : 2} />
                                <span className={cn("text-[13px]", isActive ? "font-medium" : "font-normal")}>{link.label}</span>
                            </div>
                        </Link>
                    );
                })}
            </nav>

            {/* ── SHORTCUTS ─────────────────────────── */}
            <div className="mt-auto pb-20">
                <p className="text-[10px] opacity-40 uppercase tracking-wider px-4 mb-1.5">
                    קיצורי דרך
                </p>
                {shortcuts.map((s) => (
                    <button
                        key={s.label}
                        onClick={s.onClick}
                        className="w-[calc(100%-16px)] mx-2 text-right flex items-center gap-3 transition-all duration-150 opacity-60 hover:opacity-100 hover:bg-white/[0.05] p-2 rounded-lg cursor-pointer bg-transparent border-none text-inherit"
                    >
                        <span className="text-sm">{s.emoji}</span>
                        <span className="text-[12px]">{s.label}</span>
                    </button>
                ))}
            </div>

            {/* ── LOGO — absolute bottom ─────────────── */}
            <div className="absolute bottom-0 left-0 right-0 pb-5 flex justify-center items-center">
                <div 
                    onClick={() => router.push("/")}
                    className="flex flex-row items-center justify-center opacity-80 hover:opacity-100 transition-all cursor-pointer group gap-3"
                >
                    <m.div
                        whileHover={{ rotate: 8, scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        className="w-9 h-9 flex items-center justify-center shrink-0"
                    >
                        <Image src="/assets/savant-logo.png" alt="Savant Logo" width={36} height={36} className="w-full h-full object-contain" priority />
                    </m.div>
                    <h1 className="text-2xl font-black tracking-tighter text-foreground group-hover:text-blue-500 transition-colors leading-none">
                        Savant
                    </h1>
                </div>
            </div>
        </aside>
    );
}


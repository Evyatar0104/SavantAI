"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Home, Compass, Trophy, User, Crosshair } from "lucide-react";
import { cn } from "@/lib/utils";
import { m } from "framer-motion";
import { useSavantStore } from "@/store/useSavantStore";

export function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const isHiddenPage =
        pathname?.startsWith("/lesson") ||
        pathname === "/quiz" ||
        pathname?.includes("/practice/builder/") ||
        (pathname?.startsWith("/courses/") ?? false);

    const userName = useSavantStore(state => state.userName);
    const name = userName || "לומד/ת";
    const xp = useSavantStore(state => state.xp);
    const streak = useSavantStore(state => state.streak);

    if (isHiddenPage) return null;

    const navItems = [
        { section: "primary", href: "/",           label: "ראשי",       icon: Home    },
        { section: "primary", href: "/tracks",      label: "מסלולים",    icon: Compass },
        { section: "primary", href: "/practice",    label: "תרגול",      icon: Crosshair },
        { section: "secondary", href: "/leaderboard", label: "דירוג עולמי", icon: Trophy  },
        { section: "secondary", href: "/profile",     label: "פרופיל",     icon: User    },
    ];

    const shortcuts = [
        { emoji: "📖", label: "המשך ללמוד", onClick: () => router.push("/courses/how-llms-work") },
        { emoji: "🎯", label: "האפיון שלי",  onClick: () => router.push("/quiz")                  },
    ];

    const level = Math.floor(xp / 100) + 1;
    const progressPercent = Math.max(xp % 100, 0);
    const firstLetter = (userName ? userName.charAt(0) : "ל").toUpperCase();

    return (
        <aside
            className="hidden md:flex flex-col w-80 min-w-[320px] max-w-[320px] shrink-0 h-[100dvh] border-l border-white/[0.06] sticky top-0 right-0 z-40 text-foreground overflow-y-auto bg-transparent rtl"
            style={{ direction: "rtl" }}
        >
            {/* ── USER CARD ─────────────────────────── */}
            <div className="m-3 rounded-2xl bg-white/[0.07] border border-white/[0.12] backdrop-blur-md p-3.5">
                {/* Row 1 — Avatar + name + level */}
                <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-[38px] h-[38px] rounded-full bg-gradient-to-br from-[#534AB7] to-[#818CF8] flex items-center justify-center text-sm font-semibold text-white shrink-0">
                        {firstLetter}
                    </div>
                    <div className="flex flex-col leading-tight">
                        <span className="text-[13px] font-medium text-white">{name}</span>
                        <span className="inline-block text-[10px] bg-[#534AB7]/30 text-[#A78BFA] px-1.5 py-0.5 rounded-full mt-0.5">
                            רמה {level}
                        </span>
                    </div>
                </div>

                {/* Row 2 — XP bar */}
                <div className="mb-2.5">
                    <div className="flex justify-between mb-1">
                        <span className="text-[10px] opacity-50">התקדמות לרמה {level + 1}</span>
                        <span className="text-[10px] opacity-50">100 / {progressPercent} XP</span>
                    </div>
                    <div className="h-1 bg-white/10 rounded-full">
                        <div 
                            className="h-1 bg-gradient-to-r from-[#534AB7] to-[#818CF8] rounded-full transition-all duration-700 min-w-[4px]"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                </div>

                {/* Row 3 — Streak */}
                <div className="flex items-center gap-1.5 text-[11px] opacity-60">
                    <span>🔥</span>
                    <span>{streak} ימים ברצף</span>
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

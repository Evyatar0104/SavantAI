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
            className="hidden md:flex flex-col w-80 min-w-[320px] max-w-[320px] shrink-0 h-[100dvh] border-l border-white/[0.06] sticky top-0 right-0 z-40 text-foreground overflow-y-auto relative"
            style={{ direction: "rtl", background: "transparent" }}
        >
            {/* ── USER CARD ─────────────────────────── */}
            <div style={{
                margin: 12,
                borderRadius: 16,
                background: "rgba(255,255,255,0.07)",
                border: "0.5px solid rgba(255,255,255,0.12)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                padding: 14,
            }}>
                {/* Row 1 — Avatar + name + level */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <div style={{
                        width: 38, height: 38,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #534AB7, #818CF8)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 15,
                        fontWeight: 600,
                        color: "white",
                        flexShrink: 0,
                    }}>
                        {firstLetter}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", lineHeight: "tight" }}>
                        <span style={{ fontSize: 13, fontWeight: 500, color: "white" }}>{name}</span>
                        <span style={{
                            display: "inline-block",
                            fontSize: 10,
                            background: "rgba(83,74,183,0.3)",
                            color: "#A78BFA",
                            padding: "1px 7px",
                            borderRadius: 99,
                            marginTop: 3,
                        }}>
                            רמה {level}
                        </span>
                    </div>
                </div>

                {/* Row 2 — XP bar */}
                <div style={{ marginBottom: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                        <span style={{ fontSize: 10, opacity: 0.5 }}>התקדמות לרמה {level + 1}</span>
                        <span style={{ fontSize: 10, opacity: 0.5 }}>100 / {progressPercent} XP</span>
                    </div>
                    <div style={{ height: 4, background: "rgba(255,255,255,0.1)", borderRadius: 99 }}>
                        <div style={{
                            height: 4,
                            background: "linear-gradient(90deg, #534AB7, #818CF8)",
                            borderRadius: 99,
                            width: `${progressPercent}%`,
                            minWidth: 4,
                            transition: "width 0.6s ease",
                        }} />
                    </div>
                </div>

                {/* Row 3 — Streak */}
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, opacity: 0.6 }}>
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
                        <Link key={link.href} href={link.href} prefetch={true} className="outline-none" style={{ margin: "2px 8px" }}>
                            <div className={cn(
                                "flex items-center gap-[10px] cursor-pointer transition-all duration-150",
                                isActive
                                    ? "text-foreground font-medium bg-white/[0.05]"
                                    : "text-zinc-400 hover:text-foreground hover:bg-white/[0.04]"
                            )} style={{ padding: "10px 16px", borderRadius: 10 }}>
                                <Icon className="w-[18px] h-[18px] shrink-0" strokeWidth={isActive ? 2.5 : 2} />
                                <span style={{ fontSize: 14, fontWeight: isActive ? 500 : 400 }}>{link.label}</span>
                            </div>
                        </Link>
                    );
                })}

                {/* 20px gap instead of divider */}
                <div style={{ height: 20 }} />

                {navItems.filter(i => i.section === "secondary").map((link) => {
                    const isActive = pathname === link.href;
                    const Icon = link.icon;
                    return (
                        <Link key={link.href} href={link.href} prefetch={true} className="outline-none" style={{ margin: "2px 8px" }}>
                            <div className={cn(
                                "flex items-center gap-[10px] cursor-pointer transition-all duration-150",
                                isActive
                                    ? "text-foreground font-medium bg-white/[0.05]"
                                    : "text-zinc-400 hover:text-foreground hover:bg-white/[0.04]"
                            )} style={{ padding: "10px 16px", borderRadius: 10 }}>
                                <Icon className="w-[16px] h-[16px] shrink-0" strokeWidth={isActive ? 2.5 : 2} />
                                <span style={{ fontSize: 13, fontWeight: isActive ? 500 : 400 }}>{link.label}</span>
                            </div>
                        </Link>
                    );
                })}
            </nav>

            {/* ── SHORTCUTS ─────────────────────────── */}
            <div style={{ marginTop: "auto", paddingBottom: 80 }}>
                <p style={{
                    fontSize: 10,
                    opacity: 0.4,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    padding: "0 16px",
                    marginBottom: 6,
                }}>
                    קיצורי דרך
                </p>
                {shortcuts.map((s) => (
                    <button
                        key={s.label}
                        onClick={s.onClick}
                        className="w-full text-right flex items-center gap-3 transition-all duration-150 hover:opacity-100 hover:bg-white/[0.05]"
                        style={{
                            padding: "8px 16px",
                            fontSize: 12,
                            opacity: 0.6,
                            borderRadius: 8,
                            margin: "1px 8px",
                            width: "calc(100% - 16px)",
                            cursor: "pointer",
                            background: "transparent",
                            border: "none",
                            color: "inherit",
                        }}
                    >
                        <span style={{ fontSize: 14 }}>{s.emoji}</span>
                        <span>{s.label}</span>
                    </button>
                ))}
            </div>

            {/* ── LOGO — absolute bottom ─────────────── */}
            <div style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                paddingBottom: 20,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}>
                <div className="flex flex-row items-center justify-center opacity-80 hover:opacity-100 transition-all cursor-pointer group gap-3">
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

"use client";

import { useMemo } from "react";
import { m } from "framer-motion";
import { Clock, Zap, Sparkles, Filter } from "lucide-react";
import Image from "next/image";
import { PRACTICE_ITEMS, SKILL_TAG_LABELS } from "@/data/practice";
import type { PracticeItem, SkillTag } from "@/data/practice";

// ── Tool logos ───────────────────────────────────────
const TOOL_META: Record<PracticeItem["tool"], { label: string; logo: string | null }> = {
    claude: { label: "Claude", logo: "/assets/logos/claude.png" },
    chatgpt: { label: "ChatGPT", logo: "/assets/logos/chatgpt.png" },
    gemini: { label: "Gemini", logo: "/assets/logos/gemini.png" },
    any: { label: "כל מודל", logo: null },
};

// ── Difficulty dots ──────────────────────────────────
function DifficultyDots({ level }: { level: 1 | 2 | 3 }) {
    return (
        <div className="flex items-center gap-[3px]">
            {[1, 2, 3].map((i) => (
                <div
                    key={i}
                    style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: i <= level ? "#A78BFA" : "rgba(255,255,255,0.12)",
                        transition: "background 0.3s",
                    }}
                />
            ))}
        </div>
    );
}

// ── Filter pill (placeholder) ────────────────────────
function FilterPill({ label, icon }: { label: string; icon?: React.ReactNode }) {
    return (
        <button
            className="flex items-center gap-1.5 shrink-0 transition-all duration-200 hover:bg-white/[0.08] hover:border-white/20"
            style={{
                padding: "6px 14px",
                borderRadius: 99,
                border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.04)",
                color: "rgba(255,255,255,0.55)",
                fontSize: 12,
                fontWeight: 500,
                cursor: "pointer",
                whiteSpace: "nowrap",
            }}
        >
            {icon}
            <span>{label}</span>
        </button>
    );
}

// ── Practice card ────────────────────────────────────
function PracticeCard({ item, index }: { item: PracticeItem; index: number }) {
    const toolMeta = TOOL_META[item.tool];

    return (
        <m.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: index * 0.06, ease: "easeOut" }}
            style={{
                borderRadius: 16,
                border: "0.5px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.04)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                padding: "20px 22px",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Pinned indicator */}
            {item.isPinned && (
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        width: 0,
                        height: 0,
                        borderLeft: "28px solid transparent",
                        borderTop: "28px solid #534AB7",
                    }}
                />
            )}

            {/* Row 1: Type pill + Tool */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    {/* Type pill */}
                    <span
                        style={{
                            display: "inline-block",
                            fontSize: 10,
                            fontWeight: 600,
                            padding: "3px 10px",
                            borderRadius: 99,
                            letterSpacing: "0.02em",
                            background:
                                item.type === "project"
                                    ? "rgba(139,92,246,0.15)"
                                    : "rgba(255,255,255,0.06)",
                            color:
                                item.type === "project" ? "#C4B5FD" : "rgba(255,255,255,0.5)",
                        }}
                    >
                        {item.type === "drill" ? "תרגיל" : "פרויקט"}
                    </span>

                    {/* Difficulty */}
                    <DifficultyDots level={item.difficulty} />
                </div>

                {/* Tool badge */}
                <div className="flex items-center gap-1.5">
                    {toolMeta.logo ? (
                        <Image
                            src={toolMeta.logo}
                            alt={toolMeta.label}
                            width={16}
                            height={16}
                            style={{ borderRadius: 4, objectFit: "contain" }}
                            loading="lazy"
                        />
                    ) : (
                        <Sparkles className="w-3.5 h-3.5" style={{ color: "rgba(255,255,255,0.4)" }} />
                    )}
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", fontWeight: 500 }}>
                        {toolMeta.label}
                    </span>
                </div>
            </div>

            {/* Title */}
            <h3 style={{ fontSize: 17, fontWeight: 600, color: "white", marginBottom: 6, lineHeight: 1.4 }}>
                {item.title}
            </h3>

            {/* Description */}
            <p
                style={{
                    fontSize: 13,
                    color: "rgba(255,255,255,0.5)",
                    lineHeight: 1.65,
                    marginBottom: 14,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                }}
            >
                {item.description}
            </p>

            {/* Skill tags */}
            <div className="flex flex-wrap gap-1.5 mb-3">
                {item.skillTags.map((tag) => (
                    <span
                        key={tag}
                        style={{
                            fontSize: 10,
                            padding: "2px 8px",
                            borderRadius: 99,
                            background: "rgba(255,255,255,0.06)",
                            color: "rgba(255,255,255,0.4)",
                            fontWeight: 500,
                        }}
                    >
                        {SKILL_TAG_LABELS[tag]}
                    </span>
                ))}
            </div>

            {/* Bottom row: time + XP */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5" style={{ color: "rgba(255,255,255,0.35)", fontSize: 11 }}>
                    <Clock className="w-3.5 h-3.5" />
                    <span>{item.estimatedMinutes} דק׳</span>
                </div>

                <div
                    className="flex items-center gap-1"
                    style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#FCD34D",
                        background: "rgba(252,211,77,0.1)",
                        padding: "3px 10px",
                        borderRadius: 99,
                    }}
                >
                    <Zap className="w-3 h-3" />
                    <span>{item.xpReward} XP</span>
                </div>
            </div>
        </m.div>
    );
}

// ── Page ─────────────────────────────────────────────
export default function PracticePage() {
    const drills = useMemo(
        () =>
            PRACTICE_ITEMS.filter((i) => i.type === "drill").sort(
                (a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0)
            ),
        []
    );

    const projects = useMemo(
        () =>
            PRACTICE_ITEMS.filter((i) => i.type === "project").sort(
                (a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0)
            ),
        []
    );

    return (
        <div
            className="min-h-[100dvh] w-full pb-32 md:pb-12"
            dir="rtl"
            style={{ color: "white" }}
        >
            <div className="max-w-[720px] mx-auto px-5 md:px-6 pt-10 md:pt-16">
                {/* ── Hero ─────────────────────────────── */}
                <m.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="mb-8"
                >
                    <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8, letterSpacing: "-0.02em" }}>
                        זירת התרגול
                    </h1>
                    <p style={{ fontSize: 15, color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>
                        תרגילים ופרויקטים מעשיים לשדרוג כישורי ה-AI שלך.
                        <br />
                        תבחר משימה, תפתח את הכלי ותתחיל.
                    </p>
                </m.div>

                {/* ── Filter bar ───────────────────────── */}
                <m.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.1 }}
                    className="flex gap-2 overflow-x-auto no-scrollbar mb-10 pb-1"
                >
                    <FilterPill label="כל הכלים" icon={<Filter className="w-3 h-3" />} />
                    <FilterPill label="נושא" />
                    <FilterPill label="זמן" />
                    <FilterPill label="תרגיל" />
                    <FilterPill label="פרויקט" />
                </m.div>

                {/* ── Drills section ───────────────────── */}
                <m.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.15 }}
                    className="mb-12"
                >
                    <div className="flex items-center gap-2 mb-4">
                        <span style={{ fontSize: 18 }}>⚡</span>
                        <h2 style={{ fontSize: 18, fontWeight: 600 }}>תרגילים</h2>
                        <span
                            style={{
                                fontSize: 11,
                                color: "rgba(255,255,255,0.35)",
                                fontWeight: 500,
                                marginRight: 4,
                            }}
                        >
                            {drills.length} משימות
                        </span>
                    </div>

                    <div className="flex flex-col gap-3">
                        {drills.map((item, i) => (
                            <PracticeCard key={item.id} item={item} index={i} />
                        ))}
                    </div>
                </m.div>

                {/* ── Projects section ─────────────────── */}
                <m.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.25 }}
                >
                    <div className="flex items-center gap-2 mb-4">
                        <span style={{ fontSize: 18 }}>🚀</span>
                        <h2 style={{ fontSize: 18, fontWeight: 600 }}>פרויקטים</h2>
                        <span
                            style={{
                                fontSize: 11,
                                color: "rgba(255,255,255,0.35)",
                                fontWeight: 500,
                                marginRight: 4,
                            }}
                        >
                            {projects.length} משימות
                        </span>
                    </div>

                    <div className="flex flex-col gap-3">
                        {projects.map((item, i) => (
                            <PracticeCard key={item.id} item={item} index={i} />
                        ))}
                    </div>
                </m.div>
            </div>
        </div>
    );
}

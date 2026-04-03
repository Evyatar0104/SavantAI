"use client";

import { useMemo, useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import { Clock, Zap, Sparkles, Search } from "lucide-react";
import Image from "next/image";
import { PRACTICE_ITEMS } from "@/data/practice";
import type { PracticeItem } from "@/data/practice";
import { useSavantStore } from "@/store/useSavantStore";
import { PracticeDetailSheet } from "@/components/PracticeDetailSheet";

// ── Tool logos ───────────────────────────────────────
const TOOL_META: Record<PracticeItem["tool"], { label: string; logo: string | null }> = {
    Claude: { label: "Claude", logo: "/assets/logos/claude.png" },
    ChatGPT: { label: "ChatGPT", logo: "/assets/logos/chatgpt.png" },
    Gemini: { label: "Gemini", logo: "/assets/logos/gemini.png" },
    "כל מודל": { label: "כל מודל", logo: null },
};

type TypeFilter = "all" | "drill" | "project";
type ToolFilter = "all" | "Claude" | "ChatGPT" | "Gemini" | "כל מודל";

// ── Filter pill ──────────────────────────────────────
function FilterPill({
    label,
    active,
    onClick,
    logo,
}: {
    label: string;
    active: boolean;
    onClick: () => void;
    logo?: string | null;
}) {
    return (
        <button
            onClick={onClick}
            style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 14px",
                borderRadius: 99,
                border: active ? "1px solid rgba(83,74,183,0.8)" : "1px solid rgba(255,255,255,0.1)",
                background: active ? "rgba(83,74,183,0.2)" : "rgba(255,255,255,0.04)",
                color: active ? "#A78BFA" : "rgba(255,255,255,0.55)",
                fontSize: 12,
                fontWeight: active ? 600 : 500,
                cursor: "pointer",
                whiteSpace: "nowrap",
                flexShrink: 0,
                transition: "all 0.2s",
            }}
        >
            {logo && (
                <Image src={logo} alt={label} width={14} height={14} style={{ borderRadius: 3, objectFit: "contain" }} />
            )}
            <span>{label}</span>
        </button>
    );
}

// ── Practice card ────────────────────────────────────
function PracticeCard({
    item,
    index,
    isCompleted,
    onClick,
}: {
    item: PracticeItem;
    index: number;
    isCompleted: boolean;
    onClick: () => void;
}) {
    const toolMeta = TOOL_META[item.tool];

    return (
        <m.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: index * 0.05, ease: "easeOut" }}
            onClick={onClick}
            style={{
                borderRadius: 16,
                border: isCompleted
                    ? "0.5px solid rgba(83,74,183,0.3)"
                    : "0.5px solid rgba(255,255,255,0.08)",
                background: isCompleted
                    ? "rgba(83,74,183,0.08)"
                    : "rgba(255,255,255,0.04)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                padding: "20px 22px",
                position: "relative",
                overflow: "hidden",
                cursor: "pointer",
            }}
        >
            {/* Completed indicator */}
            {isCompleted && (
                <div style={{
                    position: "absolute", top: 12, left: 12,
                    width: 20, height: 20, borderRadius: "50%",
                    background: "#534AB7",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, color: "white", fontWeight: 700,
                }}>
                    ✓
                </div>
            )}

            {/* Pinned indicator */}
            {item.isPinned && (
                <div style={{
                    position: "absolute", top: 0, right: 0,
                    width: 0, height: 0,
                    borderLeft: "28px solid transparent",
                    borderTop: "28px solid #534AB7",
                }} />
            )}

            {/* Row 1: Type pill + Tool */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <span style={{
                        display: "inline-block", fontSize: 10, fontWeight: 600,
                        padding: "3px 10px", borderRadius: 99, letterSpacing: "0.02em",
                        background: item.type === "project" ? "rgba(139,92,246,0.15)" : "rgba(255,255,255,0.06)",
                        color: item.type === "project" ? "#C4B5FD" : "rgba(255,255,255,0.5)",
                    }}>
                        {item.type === "drill" ? "תרגיל" : "פרויקט"}
                    </span>
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
            <h3 style={{ fontSize: 17, fontWeight: 600, color: isCompleted ? "rgba(255,255,255,0.5)" : "white", marginBottom: 6, lineHeight: 1.4 }}>
                {item.title}
            </h3>

            {/* Description */}
            <p style={{
                fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.65, marginBottom: 14,
                display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
            }}>
                {item.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-3">
                {item.tags.map((tag) => (
                    <span key={tag} style={{
                        fontSize: 10, padding: "2px 8px", borderRadius: 99,
                        background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)", fontWeight: 500,
                    }}>
                        {tag}
                    </span>
                ))}
            </div>

            {/* Bottom row: time + XP */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5" style={{ color: "rgba(255,255,255,0.35)", fontSize: 11 }}>
                    <Clock className="w-3.5 h-3.5" />
                    <span>{item.timeMinutes} דק׳</span>
                </div>

                <div className="flex items-center gap-1" style={{
                    fontSize: 12, fontWeight: 700, color: "#FCD34D",
                    background: "rgba(252,211,77,0.1)", padding: "3px 10px", borderRadius: 99,
                }}>
                    <Zap className="w-3 h-3" />
                    <span>{item.xp} XP</span>
                </div>
            </div>
        </m.div>
    );
}

// ── Page ─────────────────────────────────────────────
export default function PracticePage() {
    const completedPractice = useSavantStore(s => s.completedPractice);
    const [selectedItem, setSelectedItem] = useState<PracticeItem | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
    const [toolFilter, setToolFilter] = useState<ToolFilter>("all");

    const filtered = useMemo(() => {
        return PRACTICE_ITEMS.filter((item) => {
            if (typeFilter !== "all" && item.type !== typeFilter) return false;
            if (toolFilter !== "all" && item.tool !== toolFilter) return false;
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                const inTitle = item.title.toLowerCase().includes(q);
                const inDesc = item.description.toLowerCase().includes(q);
                const inTags = item.tags.some((t) => t.toLowerCase().includes(q));
                if (!inTitle && !inDesc && !inTags) return false;
            }
            return true;
        });
    }, [typeFilter, toolFilter, searchQuery]);

    const drills = filtered.filter((i) => i.type === "drill").sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));
    const projects = filtered.filter((i) => i.type === "project").sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));

    const toolOptions: { value: ToolFilter; label: string; logo?: string | null }[] = [
        { value: "all", label: "כולם" },
        { value: "Claude", label: "Claude", logo: "/assets/logos/claude.png" },
        { value: "ChatGPT", label: "ChatGPT", logo: "/assets/logos/chatgpt.png" },
        { value: "Gemini", label: "Gemini", logo: "/assets/logos/gemini.png" },
        { value: "כל מודל", label: "כל מודל", logo: null },
    ];

    return (
        <div className="min-h-dvh w-full pb-32 md:pb-12" dir="rtl" style={{ color: "white" }}>
            <div className="max-w-[720px] mx-auto px-5 md:px-6 pt-10 md:pt-16">
                {/* Hero */}
                <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-6">
                    <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8, letterSpacing: "-0.02em" }}>
                        זירת התרגול
                    </h1>
                    <p style={{ fontSize: 15, color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>
                        תרגילים ופרויקטים מעשיים לשדרוג כישורי ה-AI שלך.
                        <br />
                        תבחר משימה, תפתח את הכלי ותתחיל.
                    </p>
                </m.div>

                {/* Search box */}
                <m.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.05 }}
                    className="relative mb-3"
                >
                    <Search
                        className="absolute top-1/2 -translate-y-1/2 right-3 w-4 h-4 pointer-events-none"
                        style={{ color: "rgba(255,255,255,0.3)" }}
                    />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="חפש תרגיל או פרויקט..."
                        dir="rtl"
                        style={{
                            width: "100%",
                            padding: "10px 40px 10px 14px",
                            borderRadius: 12,
                            border: "0.5px solid rgba(255,255,255,0.1)",
                            background: "rgba(255,255,255,0.04)",
                            color: "white",
                            fontSize: 14,
                            outline: "none",
                        }}
                    />
                </m.div>

                {/* Type filters */}
                <m.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.1 }}
                    className="flex gap-2 overflow-x-auto no-scrollbar mb-2 pb-1"
                >
                    <FilterPill label="הכל" active={typeFilter === "all"} onClick={() => setTypeFilter("all")} />
                    <FilterPill label="תרגיל" active={typeFilter === "drill"} onClick={() => setTypeFilter("drill")} />
                    <FilterPill label="פרויקט" active={typeFilter === "project"} onClick={() => setTypeFilter("project")} />
                </m.div>

                {/* Model filters */}
                <m.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.15 }}
                    className="flex gap-2 overflow-x-auto no-scrollbar mb-8 pb-1"
                >
                    {toolOptions.map((opt) => (
                        <FilterPill
                            key={opt.value}
                            label={opt.label}
                            active={toolFilter === opt.value}
                            onClick={() => setToolFilter(opt.value)}
                            logo={opt.logo}
                        />
                    ))}
                </m.div>

                {/* Drills section */}
                {drills.length > 0 && (
                    <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mb-12">
                        <div className="flex items-center gap-2 mb-4">
                            <span style={{ fontSize: 18 }}>⚡</span>
                            <h2 style={{ fontSize: 18, fontWeight: 600 }}>תרגילים</h2>
                            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", fontWeight: 500, marginRight: 4 }}>
                                {drills.length} משימות
                            </span>
                        </div>
                        <div className="flex flex-col gap-3">
                            {drills.map((item, i) => (
                                <PracticeCard
                                    key={item.id}
                                    item={item}
                                    index={i}
                                    isCompleted={completedPractice.includes(item.id)}
                                    onClick={() => setSelectedItem(item)}
                                />
                            ))}
                        </div>
                    </m.div>
                )}

                {/* Projects section */}
                {projects.length > 0 && (
                    <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
                        <div className="flex items-center gap-2 mb-4">
                            <span style={{ fontSize: 18 }}>🚀</span>
                            <h2 style={{ fontSize: 18, fontWeight: 600 }}>פרויקטים</h2>
                            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", fontWeight: 500, marginRight: 4 }}>
                                {projects.length} משימות
                            </span>
                        </div>
                        <div className="flex flex-col gap-3">
                            {projects.map((item, i) => (
                                <PracticeCard
                                    key={item.id}
                                    item={item}
                                    index={i}
                                    isCompleted={completedPractice.includes(item.id)}
                                    onClick={() => setSelectedItem(item)}
                                />
                            ))}
                        </div>
                    </m.div>
                )}

                {/* Empty state */}
                {drills.length === 0 && projects.length === 0 && (
                    <m.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center py-20 text-center"
                    >
                        <p style={{ fontSize: 40, marginBottom: 12 }}>🔍</p>
                        <p style={{ fontSize: 16, color: "rgba(255,255,255,0.5)" }}>לא נמצאו תרגילים</p>
                        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", marginTop: 4 }}>נסה חיפוש אחר או הסר פילטרים</p>
                    </m.div>
                )}
            </div>

            {/* Detail sheet */}
            <AnimatePresence>
                {selectedItem && (
                    <PracticeDetailSheet
                        item={selectedItem}
                        onClose={() => setSelectedItem(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

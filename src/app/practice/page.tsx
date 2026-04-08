"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { m, AnimatePresence } from "framer-motion";
import { Clock, Zap, Sparkles, Search, LayoutGrid, List } from "lucide-react";
import Image from "next/image";
import { PRACTICE_ITEMS, type PracticeItem, type AIModelType } from "@/content";
import { useSavantStore } from "@/store/useSavantStore";

// ── Tool logos ───────────────────────────────────────
const TOOL_META: Record<string, { label: string; logo: string | null }> = {
    Claude: { label: "Claude", logo: "/assets/logos/claude.png" },
    ChatGPT: { label: "ChatGPT", logo: "/assets/logos/chatgpt.png" },
    Gemini: { label: "Gemini", logo: "/assets/logos/gemini.png" },
    "כל מודל": { label: "כל מודל", logo: null },
};

type TypeFilter = "drill" | "project";
type ToolFilter = "Claude" | "ChatGPT" | "Gemini" | "כל מודל";

// ── View Toggle ──────────────────────────────────────
function ViewToggle({ compact, setCompact }: { compact: boolean; setCompact: (v: boolean) => void }) {
    return (
        <div style={{
            display: "flex",
            background: "rgba(255,255,255,0.04)",
            padding: 4,
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.08)",
        }}>
            <button
                onClick={() => setCompact(false)}
                style={{
                    padding: "6px 10px",
                    borderRadius: 7,
                    background: !compact ? "rgba(83,74,183,0.3)" : "transparent",
                    color: !compact ? "white" : "rgba(255,255,255,0.4)",
                    transition: "all 0.2s",
                }}
            >
                <LayoutGrid className="w-4 h-4" />
            </button>
            <button
                onClick={() => setCompact(true)}
                style={{
                    padding: "6px 10px",
                    borderRadius: 7,
                    background: compact ? "rgba(83,74,183,0.3)" : "transparent",
                    color: compact ? "white" : "rgba(255,255,255,0.4)",
                    transition: "all 0.2s",
                }}
            >
                <List className="w-4 h-4" />
            </button>
        </div>
    );
}

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
        <m.button
            onClick={onClick}
            whileTap={{ scale: 0.95 }}
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
        </m.button>
    );
}

// ── Compact Practice Card ────────────────────────────
function CompactPracticeCard({
    item,
    isCompleted,
    onClick,
    activeTool,
}: {
    item: PracticeItem;
    isCompleted: boolean;
    onClick: () => void;
    activeTool?: ToolFilter | null;
}) {
    const toolToDisplay = activeTool || item.recommendedModel;
    const toolMeta = TOOL_META[toolToDisplay] || TOOL_META[item.recommendedModel] || TOOL_META["כל מודל"];

    return (
        <m.div
            layout
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            whileTap={{ scale: 0.99 }}
            onClick={onClick}
            style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: "12px 16px",
                borderRadius: 14,
                background: "rgba(255,255,255,0.03)",
                border: "0.5px solid rgba(255,255,255,0.06)",
                cursor: "pointer",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Model Logo */}
            <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: "rgba(255,255,255,0.05)",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
            }}>
                {toolMeta.logo ? (
                    <Image src={toolMeta.logo} alt={toolMeta.label} width={20} height={20} style={{ borderRadius: 4 }} />
                ) : (
                    <Sparkles className="w-4 h-4 opacity-40" />
                )}
            </div>

            {/* Content */}
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                    <h3 style={{ 
                        fontSize: 15, fontWeight: 600, color: "white", 
                        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" 
                    }}>
                        {item.title}
                    </h3>
                    {isCompleted && (
                        <div style={{
                            width: 14, height: 14, borderRadius: "50%",
                            background: "#534AB7", color: "white",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 8, fontWeight: 800,
                        }}>✓</div>
                    )}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ 
                        fontSize: 10, color: item.type === "project" ? "#C4B5FD" : "rgba(255,255,255,0.4)",
                        fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.02em"
                    }}>
                        {item.type === "drill" ? "תרגיל" : "פרויקט"}
                    </span>
                    <span style={{ fontSize: 10, color: "rgba(255,255,255,0.25)" }}>•</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "rgba(255,255,255,0.35)" }}>
                        <Clock className="w-3 h-3" />
                        <span>{item.timeMinutes} דק׳</span>
                    </div>
                </div>
            </div>

            {/* XP Badge */}
            <div style={{
                fontSize: 12, fontWeight: 700, color: "#FCD34D",
                background: "rgba(252,211,77,0.08)", padding: "4px 10px", borderRadius: 8,
                display: "flex", alignItems: "center", gap: 4,
            }}>
                <Zap className="w-3 h-3" />
                <span>{item.xp}</span>
            </div>
        </m.div>
    );
}

// ── Practice card ────────────────────────────────────
function PracticeCard({
    item,
    isCompleted,
    onClick,
    activeTool,
}: {
    item: PracticeItem;
    isCompleted: boolean;
    onClick: () => void;
    activeTool?: ToolFilter | null;
}) {
    // Determine which tool branding to show:
    // 1. If an active filter tool is supported, show that
    // 2. Otherwise show the recommended model
    const toolToDisplay = activeTool || item.recommendedModel;
    const toolMeta = TOOL_META[toolToDisplay] || TOOL_META[item.recommendedModel] || TOOL_META["כל מודל"];

    return (
        <m.div
            layout
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
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
                willChange: "transform",
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

            {/* Recommended Badge */}
            {!isCompleted && item.recommendedModel.toLowerCase() === useSavantStore.getState().primaryModel?.toLowerCase() && (
                <div 
                    className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-1 z-10"
                >
                    <Sparkles className="w-2.5 h-2.5 text-emerald-400" />
                    <span className="text-[9px] font-black uppercase tracking-tighter text-emerald-400">REC</span>
                </div>
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
    const router = useRouter();
    const completedPractice = useSavantStore(s => s.completedPractice);
    const isCompact = useSavantStore(s => s.isCompactView);
    const setIsCompact = useSavantStore(s => s.setCompactView);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTypes, setSelectedTypes] = useState<TypeFilter[]>([]);
    const [selectedTools, setSelectedTools] = useState<ToolFilter[]>([]);

    const isSearching = searchQuery.trim().length > 0;

    const primaryModel = useSavantStore(s => s.primaryModel);

    const practiceScrollPosition = useSavantStore(s => s.practiceScrollPosition);
    const setPracticeScrollPosition = useSavantStore(s => s.setPracticeScrollPosition);
    const hasHydrated = useSavantStore(s => s._hasHydrated);
    const [isRestored, setIsRestored] = useState(() => {
        if (typeof window !== 'undefined') {
            const pos = useSavantStore.getState().practiceScrollPosition || 0;
            return pos === 0;
        }
        return false;
    });

    // Scroll Restoration
    useEffect(() => {
        if (!hasHydrated || isRestored) return;

        const mainElement = document.querySelector('main');
        if (mainElement) {
            if (practiceScrollPosition > 0) {
                const restore = () => {
                    mainElement.scrollTo({ top: practiceScrollPosition });
                    setIsRestored(true);
                };

                restore();
                const timers = [
                    setTimeout(restore, 20),
                    setTimeout(restore, 100),
                    setTimeout(restore, 300),
                ];
                return () => timers.forEach(clearTimeout);
            } else {
                setTimeout(() => setIsRestored(true), 0);
            }
        }
    }, [hasHydrated, practiceScrollPosition, isRestored]);

    // Scroll Capture
    useEffect(() => {
        const mainElement = document.querySelector('main');
        if (!mainElement) return;

        let frameId: number;
        const handleScroll = () => {
            if (!isRestored) return;

            cancelAnimationFrame(frameId);
            frameId = requestAnimationFrame(() => {
                const currentPos = mainElement.scrollTop;
                if (currentPos > 0 || (currentPos === 0 && practiceScrollPosition < 100)) {
                    setPracticeScrollPosition(currentPos);
                }
            });
        };

        mainElement.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            mainElement.removeEventListener('scroll', handleScroll);
            cancelAnimationFrame(frameId);
        };
    }, [setPracticeScrollPosition, isRestored, practiceScrollPosition]);

    const filtered = useMemo(() => {
        const items = PRACTICE_ITEMS.filter((item: PracticeItem) => {
            // 1. Type Filter (Multi-select)
            if (selectedTypes.length > 0) {
                if (!selectedTypes.includes(item.type as TypeFilter)) return false;
            }
            
            // 2. Tool Filter (Multi-select)
            if (selectedTools.length > 0) {
                // If any selected tool is supported by the item
                const isCompatible = selectedTools.some(tool => 
                    item.recommendedModel === tool || 
                    item.compatibleModels.includes(tool as AIModelType) ||
                    item.recommendedModel === "כל מודל"
                );
                if (!isCompatible) return false;
            }
            
            // 3. Search Query
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                const inTitle = item.title.toLowerCase().includes(q);
                const inDesc = item.description.toLowerCase().includes(q);
                const inTags = item.tags.some((t: string) => t.toLowerCase().includes(q));
                const inModels = item.recommendedModel.toLowerCase().includes(q) || 
                               item.compatibleModels.some((m: string) => m.toLowerCase().includes(q));
                if (!inTitle && !inDesc && !inTags && !inModels) return false;
            }
            return true;
        });

        // Smart Relevancy Sorting
        return items.sort((a: PracticeItem, b: PracticeItem) => {
            // 1. Pinned always top
            if (a.isPinned && !b.isPinned) return -1;
            if (!a.isPinned && b.isPinned) return 1;

            // Use primary model for sorting if no specific tools are selected
            const targetModels = selectedTools.length > 0 ? selectedTools : (primaryModel ? [primaryModel as ToolFilter] : []);

            if (targetModels.length > 0) {
                const aMatches = targetModels.some(m => 
                    a.recommendedModel.toLowerCase() === m.toLowerCase() || 
                    a.recommendedModel === "כל מודל"
                );
                const bMatches = targetModels.some(m => 
                    b.recommendedModel.toLowerCase() === m.toLowerCase() || 
                    b.recommendedModel === "כל מודל"
                );
                
                if (aMatches && !bMatches) return -1;
                if (!aMatches && bMatches) return 1;
            }

            return 0;
        });
    }, [selectedTypes, selectedTools, searchQuery, primaryModel]);

    const drills = filtered.filter((i: PracticeItem) => i.type === "drill");
    const projects = filtered.filter((i: PracticeItem) => i.type === "project");

    const toolOptions: { value: ToolFilter; label: string; logo?: string | null }[] = [
        { value: "Claude", label: "Claude", logo: "/assets/logos/claude.png" },
        { value: "ChatGPT", label: "ChatGPT", logo: "/assets/logos/chatgpt.png" },
        { value: "Gemini", label: "Gemini", logo: "/assets/logos/gemini.png" },
    ];

    return (
        <div className="min-h-dvh w-full pb-32 md:pb-12" dir="rtl" style={{ color: "white" }}>
            <div className="max-w-[720px] mx-auto px-5 md:px-6 pt-10 md:pt-16">
                {/* Hero */}
                <m.div 
                    layout
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ 
                        opacity: isSearching ? 0.4 : 1, 
                        y: 0,
                        scale: isSearching ? 0.95 : 1,
                        marginBottom: isSearching ? 12 : 24
                    }} 
                    transition={{ duration: 0.4, ease: "easeInOut" }} 
                    className="origin-right"
                >
                    <h1 style={{ fontSize: isSearching ? 24 : 32, fontWeight: 700, marginBottom: 4, letterSpacing: "-0.02em", transition: "font-size 0.4s" }}>
                        זירת המשימות
                    </h1>
                    <AnimatePresence>
                        {!isSearching && (
                            <m.p 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                style={{ fontSize: 15, color: "rgba(255,255,255,0.5)", lineHeight: 1.6, overflow: "hidden" }}
                            >
                                ברוך הבא לסדנה. בחר משימה להתאצה וניכנס לעבודה.
                            </m.p>
                        )}
                    </AnimatePresence>
                </m.div>

                {/* Search box & View Toggle */}
                <m.div
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.05 }}
                    className="flex items-center gap-3 mb-3"
                >
                    <div className="relative flex-1">
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
                                border: isSearching ? "0.5px solid rgba(139,92,246,0.3)" : "0.5px solid rgba(255,255,255,0.1)",
                                background: isSearching ? "rgba(139,92,246,0.08)" : "rgba(255,255,255,0.04)",
                                color: "white",
                                fontSize: 14,
                                outline: "none",
                                transition: "all 0.3s",
                            }}
                        />
                    </div>
                    <ViewToggle compact={isCompact} setCompact={setIsCompact} />
                </m.div>

                {/* Type filters */}
                <m.div
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ 
                        opacity: 1, 
                        y: 0,
                        height: isSearching ? 0 : "auto",
                        marginBottom: isSearching ? 0 : 8,
                        overflow: "hidden"
                    }}
                    transition={{ duration: 0.35, delay: 0.1 }}
                    className="flex gap-2 overflow-x-auto no-scrollbar pb-1"
                >
                    <FilterPill 
                        label="הכל" 
                        active={selectedTypes.length === 0} 
                        onClick={() => setSelectedTypes([])} 
                    />
                    <FilterPill 
                        label="תרגול" 
                        active={selectedTypes.includes("drill")} 
                        onClick={() => setSelectedTypes(prev => 
                            prev.includes("drill") ? prev.filter(t => t !== "drill") : [...prev, "drill"]
                        )} 
                    />
                    <FilterPill 
                        label="פרויקט" 
                        active={selectedTypes.includes("project")} 
                        onClick={() => setSelectedTypes(prev => 
                            prev.includes("project") ? prev.filter(t => t !== "project") : [...prev, "project"]
                        )} 
                    />
                </m.div>

                {/* Model filters */}
                <m.div
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ 
                        opacity: 1, 
                        y: 0,
                        height: isSearching ? 0 : "auto",
                        marginBottom: isSearching ? 0 : 32,
                        overflow: "hidden"
                    }}
                    transition={{ duration: 0.35, delay: 0.15 }}
                    className="flex gap-2 overflow-x-auto no-scrollbar pb-1"
                >
                    <FilterPill 
                        label="כולם" 
                        active={selectedTools.length === 0} 
                        onClick={() => setSelectedTools([])} 
                    />
                    {toolOptions.map((opt) => (
                        <FilterPill
                            key={opt.value}
                            label={opt.label}
                            active={selectedTools.includes(opt.value)}
                            onClick={() => setSelectedTools(prev => 
                                prev.includes(opt.value) ? prev.filter(t => t !== opt.value) : [...prev, opt.value]
                            )}
                            logo={opt.logo}
                        />
                    ))}
                </m.div>

                {/* Drills section */}
                {drills.length > 0 && (
                    <m.div 
                        layout
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        transition={{ delay: 0.2 }} 
                        className="mb-12"
                    >
                        <m.div 
                            layout
                            animate={{ 
                                opacity: isSearching ? 0.7 : 1,
                                scale: isSearching ? 0.98 : 1
                            }}
                            className="flex items-center gap-2 mb-4 origin-right"
                        >
                            <span style={{ fontSize: isSearching ? 16 : 18 }}>⚡</span>
                            <h2 style={{ fontSize: isSearching ? 16 : 18, fontWeight: 600 }}>תרגילים</h2>
                            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", fontWeight: 500, marginRight: 4 }}>
                                {drills.length} משימות
                            </span>
                        </m.div>
                        <div className={isCompact ? "grid grid-cols-1 sm:grid-cols-2 gap-2" : "flex flex-col gap-3"}>
                            <AnimatePresence mode="popLayout" initial={false}>
                                {drills.map((item: PracticeItem) => (
                                    isCompact ? (
                                        <CompactPracticeCard
                                            key={item.id}
                                            item={item}
                                            activeTool={selectedTools.find(t => 
                                                item.recommendedModel === t || item.compatibleModels.includes(t as AIModelType)
                                            )}
                                            isCompleted={completedPractice.includes(item.id)}
                                            onClick={() => router.push(`/practice/builder/${item.id}?from=practice`)}
                                        />
                                    ) : (
                                        <PracticeCard
                                            key={item.id}
                                            item={item}
                                            activeTool={selectedTools.find(t => 
                                                item.recommendedModel === t || item.compatibleModels.includes(t as AIModelType)
                                            )}
                                            isCompleted={completedPractice.includes(item.id)}
                                            onClick={() => router.push(`/practice/builder/${item.id}?from=practice`)}
                                        />
                                    )
                                ))}
                            </AnimatePresence>
                        </div>
                    </m.div>
                )}

                {/* Projects section */}
                {projects.length > 0 && (
                    <m.div 
                        layout
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        transition={{ delay: 0.25 }}
                    >
                        <m.div 
                            layout
                            animate={{ 
                                opacity: isSearching ? 0.7 : 1,
                                scale: isSearching ? 0.98 : 1
                            }}
                            className="flex items-center gap-2 mb-4 origin-right"
                        >
                            <span style={{ fontSize: isSearching ? 16 : 18 }}>🚀</span>
                            <h2 style={{ fontSize: isSearching ? 16 : 18, fontWeight: 600 }}>פרויקטים</h2>
                            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", fontWeight: 500, marginRight: 4 }}>
                                {projects.length} משימות
                            </span>
                        </m.div>
                        <div className={isCompact ? "grid grid-cols-1 sm:grid-cols-2 gap-2" : "flex flex-col gap-3"}>
                            <AnimatePresence mode="popLayout" initial={false}>
                                {projects.map((item: PracticeItem) => (
                                    isCompact ? (
                                        <CompactPracticeCard
                                            key={item.id}
                                            item={item}
                                            activeTool={selectedTools.find(t => 
                                                item.recommendedModel === t || item.compatibleModels.includes(t as AIModelType)
                                            )}
                                            isCompleted={completedPractice.includes(item.id)}
                                            onClick={() => router.push(`/practice/builder/${item.id}?from=practice`)}
                                        />
                                    ) : (
                                        <PracticeCard
                                            key={item.id}
                                            item={item}
                                            activeTool={selectedTools.find(t => 
                                                item.recommendedModel === t || item.compatibleModels.includes(t as AIModelType)
                                            )}
                                            isCompleted={completedPractice.includes(item.id)}
                                            onClick={() => router.push(`/practice/builder/${item.id}?from=practice`)}
                                        />
                                    )
                                ))}
                            </AnimatePresence>
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

        </div>
    );
}


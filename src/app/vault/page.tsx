"use client";

import { useSavantStore } from "@/store/useSavantStore";
import { Badge, BADGES, isBadgeEarned, RARITY_COLORS } from "@/data/badges";
import { m, Variants, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { haptics } from "@/lib/haptics";
import { memo, useState } from "react";
import { LayoutGrid, List } from "lucide-react";

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

// ── Compact Badge Card ──────────────────────────────
const CompactBadgeCard = memo(({ badge, earned, onClick }: { badge: Badge, earned: boolean, onClick: () => void }) => {
    const tierColor = RARITY_COLORS[badge.rarity || "Common"];
    
    return (
        <m.div
            layout
            variants={itemVariants}
            whileTap={earned ? { scale: 0.98 } : undefined}
            onClick={onClick}
            style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 14px",
                borderRadius: 12,
                background: earned ? `${tierColor.main}` : "rgba(0,0,0,0.2)",
                border: earned ? `1px solid ${tierColor.border}` : "1px solid rgba(255,255,255,0.03)",
                boxShadow: earned ? `0 4px 12px ${tierColor.glow}` : "none",
                cursor: earned ? "pointer" : "default",
                opacity: earned ? 1 : 0.5,
            }}
        >
            <div style={{ 
                fontSize: 24, 
                filter: earned ? "none" : "grayscale(1) brightness(0.5)",
                flexShrink: 0
            }}>
                {badge.icon}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{ 
                    fontSize: 14, fontWeight: 600, color: "white",
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"
                }}>
                    {earned ? badge.name : "????"}
                </h3>
                {earned && (
                    <p style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {badge.description}
                    </p>
                )}
            </div>
            {earned && <div style={{ color: "#FCD34D", fontSize: 10 }}>★</div>}
        </m.div>
    );
});
CompactBadgeCard.displayName = "CompactBadgeCard";

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.08, delayChildren: 0.1 }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95, y: 10 },
    show: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: { type: "spring", stiffness: 300, damping: 24 }
    }
};

const VaultBadgeCard = memo(({ badge, earned, onClick }: { badge: Badge, earned: boolean, onClick: () => void }) => {
    const tierColor = RARITY_COLORS[badge.rarity || "Common"];
    
    return (
        <m.div
            variants={itemVariants}
            whileHover={earned ? { scale: 1.05, rotateY: 5, rotateX: 5 } : undefined}
            whileTap={earned ? { scale: 0.95 } : undefined}
            onClick={onClick}
            style={{
                aspectRatio: "3/4",
                borderRadius: 16,
                padding: "20px 16px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                cursor: earned ? "pointer" : "default",
                position: "relative",
                overflow: "hidden",
                transformStyle: "preserve-3d",
                perspective: 1000,
                border: earned 
                    ? `1px solid ${tierColor.border}` 
                    : "1px solid rgba(255,255,255,0.05)",
                background: earned
                    ? `linear-gradient(145deg, ${tierColor.main} 0%, rgba(255,255,255,0.02) 100%)`
                    : "rgba(0,0,0,0.4)",
                boxShadow: earned ? `0 8px 32px ${tierColor.glow}` : "none",
                backdropFilter: earned ? "blur(12px)" : "none",
            }}
        >
            {earned && (
                <div 
                    style={{
                        position: "absolute",
                        top: 0, left: 0, right: 0, bottom: 0,
                        background: "linear-gradient(125deg, transparent 30%, rgba(255,255,255,0.08) 50%, transparent 70%)",
                        backgroundSize: "200% 200%",
                        animation: "shimmer 3s infinite linear",
                        pointerEvents: "none"
                    }}
                />
            )}
            
            <div 
                className="text-5xl sm:text-6xl mb-4 drop-shadow-xl"
                style={{
                    filter: earned ? "none" : "grayscale(1) brightness(0.2) blur(1px)",
                    opacity: earned ? 1 : 0.4
                }}
            >
                {badge.icon}
            </div>
            <h3 
                className="text-[15px] sm:text-base font-semibold mb-1"
                style={{ color: earned ? "white" : "rgba(255,255,255,0.3)" }}
            >
                {earned ? badge.name : "????"}
            </h3>
            {earned && (
                <p className="text-[11px] sm:text-xs text-white/50 leading-tight">
                    {badge.description}
                </p>
            )}
        </m.div>
    );
});
VaultBadgeCard.displayName = "VaultBadgeCard";

export default function VaultPage() {
    const router = useRouter();
    // Using select pieces of state via a selector to avoid over-renders
    const state = useSavantStore();
    const [isCompact, setIsCompact] = useState(false);

    return (
        <div className="min-h-screen bg-[#0f0f1a] text-white px-4 sm:px-6 pt-8 sm:pt-12 pb-24" style={{ direction: "rtl" }}>
            <div className="max-w-2xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-semibold mb-2">הכספת</h1>
                        <p className="text-white/60 text-sm">אוסף ההישגים הייחודיים שלך.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <ViewToggle compact={isCompact} setCompact={setIsCompact} />
                        <button
                            onClick={() => router.push("/profile")}
                            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                <m.div 
                    layout
                    variants={containerVariants} 
                    initial="hidden" 
                    animate="show"
                    className={isCompact ? "flex flex-col gap-2" : "grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6"}
                >
                    <AnimatePresence mode="popLayout" initial={false}>
                        {BADGES.map((badge) => {
                            const earned = isBadgeEarned(badge.id, state);
                            
                            return isCompact ? (
                                <CompactBadgeCard
                                    key={badge.id}
                                    badge={badge}
                                    earned={earned}
                                    onClick={() => {
                                        if (earned) {
                                            haptics.tap();
                                            router.push(`/vault/${badge.id}?from=vault`);
                                        }
                                    }}
                                />
                            ) : (
                                <VaultBadgeCard
                                    key={badge.id}
                                    badge={badge}
                                    earned={earned}
                                    onClick={() => {
                                        if (earned) {
                                            haptics.tap();
                                            router.push(`/vault/${badge.id}?from=vault`);
                                        }
                                    }}
                                />
                            );
                        })}
                    </AnimatePresence>
                </m.div>
            </div>
            
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes shimmer {
                    0% { background-position: -100% -100%; }
                    100% { background-position: 200% 200%; }
                }
            `}} />
        </div>
    );
}
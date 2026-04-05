"use client";

import { useSavantStore } from "@/store/useSavantStore";
import { BADGES, isBadgeEarned } from "@/data/badges";
import { m, Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import { haptics } from "@/lib/haptics";
import { memo } from "react";

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

const VaultBadgeCard = memo(({ badge, earned, onClick }: { badge: any, earned: boolean, onClick: () => void }) => (
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
                ? "1px solid rgba(255,255,255,0.2)" 
                : "1px solid rgba(255,255,255,0.05)",
            background: earned
                ? "linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.02) 100%)"
                : "rgba(0,0,0,0.4)",
            boxShadow: earned ? "0 8px 32px rgba(0,0,0,0.2)" : "none",
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
));
VaultBadgeCard.displayName = "VaultBadgeCard";

export default function VaultPage() {
    const router = useRouter();
    // Using select pieces of state via a selector to avoid over-renders
    const state = useSavantStore();

    return (
        <div className="min-h-screen bg-[#0f0f1a] text-white px-4 sm:px-6 pt-8 sm:pt-12 pb-24" style={{ direction: "rtl" }}>
            <div className="max-w-2xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-semibold mb-2">הכספת</h1>
                        <p className="text-white/60 text-sm">אוסף ההישגים הייחודיים שלך.</p>
                    </div>
                    <button
                        onClick={() => router.push("/profile")}
                        className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                    >
                        ✕
                    </button>
                </div>

                <m.div 
                    variants={containerVariants} 
                    initial="hidden" 
                    animate="show"
                    className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6"
                >
                    {BADGES.map((badge) => {
                        const earned = isBadgeEarned(badge.id, state);
                        
                        return (
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
            
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes shimmer {
                    0% { background-position: -100% -100%; }
                    100% { background-position: 200% 200%; }
                }
            `}} />
        </div>
    );
}
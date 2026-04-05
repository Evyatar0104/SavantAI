"use client";

import { useSavantStore } from "@/store/useSavantStore";
import { BADGES } from "@/data/badges";
import { m, AnimatePresence } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import { haptics } from "@/lib/haptics";
import { X, Sparkles, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";

export function VaultToast() {
    const router = useRouter();
    const pathname = usePathname();
    const { unlockedVaultCard, clearUnlockedVaultCard } = useSavantStore();
    const [visibleCard, setVisibleCard] = useState<string | null>(null);

    // Sync state and trigger haptics when a new card is unlocked
    useEffect(() => {
        if (unlockedVaultCard && unlockedVaultCard !== visibleCard) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setVisibleCard(unlockedVaultCard);
            haptics.success();
            // Automatically clear from store so it doesn't persist across sessions, but keep visible in local state until dismissed
            clearUnlockedVaultCard();
        }
    }, [unlockedVaultCard, visibleCard, clearUnlockedVaultCard]);

    // Hide if navigating to the vault or profile
    useEffect(() => {
        if (pathname?.includes("/vault") || pathname === "/profile") {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setVisibleCard(null);
        }
    }, [pathname]);

    const badge = visibleCard ? BADGES.find(b => b.id === visibleCard) : null;
    const isVisible = !!badge;

    const handleView = (e: React.MouseEvent) => {
        e.stopPropagation();
        haptics.tap();
        setVisibleCard(null);
        router.push(`/vault/${visibleCard}?from=profile`);
    };

    const handleDismiss = (e: React.MouseEvent) => {
        e.stopPropagation();
        haptics.tap();
        setVisibleCard(null);
    };

    return (
        <div className="fixed top-24 left-4 right-4 md:left-auto md:right-8 z-[110] pointer-events-none" dir="rtl">
            <AnimatePresence mode="popLayout">
                {isVisible && (
                    <m.div
                        layout
                        initial={{ opacity: 0, scale: 0.8, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: -20, transition: { duration: 0.2 } }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        style={{
                            background: "linear-gradient(145deg, rgba(83,74,183,0.95) 0%, rgba(30,27,75,0.95) 100%)",
                            backdropFilter: "blur(24px)",
                            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(139,92,246,0.3) inset",
                            borderRadius: 24,
                            width: "100%",
                            maxWidth: 340,
                            marginLeft: 'auto',
                        }}
                        className="pointer-events-auto overflow-hidden cursor-pointer"
                        onClick={handleView}
                    >
                        {/* Glow effect */}
                        <div className="absolute -top-20 -left-20 w-40 h-40 bg-purple-500/30 blur-[40px] rounded-full pointer-events-none" />

                        <div className="relative p-5 flex flex-col gap-4">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2 text-purple-300">
                                    <Sparkles className="w-4 h-4" />
                                    <span className="text-xs font-bold uppercase tracking-widest">
                                        הישג חדש הושג!
                                    </span>
                                </div>
                                <button
                                    onClick={handleDismiss}
                                    className="p-1.5 bg-white/5 hover:bg-white/10 rounded-full transition-all text-white/60 hover:text-white border border-white/10"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="text-4xl drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]">
                                    {badge?.icon}
                                </div>
                                <div className="flex flex-col">
                                    <h3 className="text-lg font-bold text-white leading-tight">
                                        {badge?.name}
                                    </h3>
                                    <span className="text-sm text-purple-200">
                                        {badge?.description}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={handleView}
                                className="w-full mt-2 bg-white/10 hover:bg-white/20 text-white text-sm font-bold py-3 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 border border-white/10"
                            >
                                <span>צפה באוסף</span>
                                <ArrowLeft className="w-4 h-4" />
                            </button>
                        </div>
                    </m.div>
                )}
            </AnimatePresence>
        </div>
    );
}

"use client";

import { useState, useEffect } from "react";
import { useSavantStore } from "@/store/useSavantStore";
import { PRACTICE_ITEMS } from "@/data/practice";
import { m, AnimatePresence } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import { haptics } from "@/lib/haptics";
import { X, Crosshair, Trash2, ArrowLeft } from "lucide-react";

export function ResumeToast() {
    const router = useRouter();
    const pathname = usePathname();
    const { activePracticeId, resetBuilder } = useSavantStore();
    const [isExpanded, setIsExpanded] = useState(false);

    // Auto-collapse when activePracticeId changes or on page change
    useEffect(() => {
        const timer = setTimeout(() => setIsExpanded(false), 0);
        return () => clearTimeout(timer);
    }, [pathname, activePracticeId]);

    const item = PRACTICE_ITEMS.find((p) => p.id === activePracticeId);

    // Determine overall visibility
    const isVisible = !!activePracticeId && !!item && !pathname?.includes("/practice/builder/");

    const handleResume = (e: React.MouseEvent) => {
        e.stopPropagation();
        haptics.tap();
        router.push(`/practice/builder/${activePracticeId}?from=practice`);
    };

    const handleReset = (e: React.MouseEvent) => {
        e.stopPropagation();
        haptics.tap();
        resetBuilder();
    };

    const toggleExpand = (e: React.MouseEvent) => {
        e.stopPropagation();
        haptics.tap();
        setIsExpanded(!isExpanded);
    };

    return (
        <div className="fixed top-6 left-4 right-4 md:left-auto md:right-8 z-100 pointer-events-none" dir="rtl">
            <AnimatePresence mode="popLayout" initial={false}>
                {isVisible && (
                    <m.div
                        layout
                        initial={{ opacity: 0, scale: 0.9, y: 16 }}
                        animate={{ 
                            opacity: 1, 
                            scale: 1, 
                            y: 0,
                            // Anchors: when collapsed, it's just a button. We want it right-aligned.
                            // However, we used fixed layout for the div above.
                            borderRadius: isExpanded ? 24 : 100,
                            // Ensure it remains top-right-ish when collapsed
                        }}
                        exit={{ opacity: 0, scale: 0.9, y: 16 }}
                        transition={{
                            layout: { type: "spring", stiffness: 450, damping: 35, mass: 1 },
                            opacity: { duration: 0.2 }
                        }}
                        style={{
                            background: isExpanded ? "rgba(10, 10, 12, 0.98)" : "rgb(37, 99, 235)",
                            backdropFilter: isExpanded ? "blur(32px) saturate(180%)" : "none",
                            boxShadow: isExpanded 
                                ? "0 24px 64px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.1)" 
                                : "0 12px 32px rgba(37, 99, 235, 0.5)",
                            border: "1px solid rgba(255, 255, 255, 0.2)",
                            // Alignment trick for the container while layout transitions
                            marginLeft: isExpanded ? 0 : 'auto',
                            width: isExpanded ? '100%' : 56,
                            maxWidth: isExpanded ? '100%' : 56,
                        }}
                        onClick={!isExpanded ? toggleExpand : undefined}
                        className={`pointer-events-auto relative overflow-hidden shadow-2xl ${!isExpanded ? 'cursor-pointer h-14' : 'h-auto'}`}
                    >
                        {/* Glow effect */}
                        <AnimatePresence>
                            {isExpanded && (
                                <m.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute -top-32 -left-32 w-80 h-80 bg-blue-600/10 blur-[80px] rounded-full pointer-events-none"
                                />
                            )}
                        </AnimatePresence>

                        <div className="relative w-full h-full flex flex-col md:flex-row items-center">
                            {/* Collapsed content */}
                            <AnimatePresence mode="wait">
                                {!isExpanded ? (
                                    <m.div
                                        key="collapsed"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="h-14 w-14 flex items-center justify-center shrink-0"
                                    >
                                        <m.div
                                            animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0, 0.4] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                            className="absolute inset-0 bg-white rounded-full pointer-events-none"
                                        />
                                        <Crosshair className="w-5 h-5 text-white" />
                                    </m.div>
                                ) : (
                                    <m.div
                                        key="expanded"
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 8 }}
                                        transition={{ duration: 0.15, delay: 0.05 }}
                                        className="w-full p-4 md:p-5 flex flex-col md:flex-row items-center justify-between gap-5"
                                    >
                                        {/* Project Info */}
                                        <div className="flex flex-col min-w-0 flex-1 w-full text-right md:text-right">
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-1 opacity-80">
                                                המשך פרויקט
                                            </span>
                                            <h3 className="text-base md:text-lg font-bold text-white leading-snug whitespace-normal break-words">
                                                {item?.title}
                                            </h3>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
                                            <div className="flex items-center gap-2 flex-1 md:flex-none">
                                                <button
                                                    onClick={handleReset}
                                                    className="flex-1 md:flex-none p-3.5 bg-red-500/10 hover:bg-red-500/20 rounded-full transition-all text-red-400 border border-red-500/20 active:scale-90"
                                                    title="מחק"
                                                >
                                                    <Trash2 className="w-5 h-5 mx-auto" />
                                                </button>
                                                <button
                                                    onClick={toggleExpand}
                                                    className="flex-1 md:flex-none p-3.5 bg-white/5 hover:bg-white/10 rounded-full transition-all text-white/60 hover:text-white border border-white/10 active:scale-90"
                                                    title="מזער"
                                                >
                                                    <X className="w-5 h-5 mx-auto" />
                                                </button>
                                            </div>
                                            <button
                                                onClick={handleResume}
                                                className="flex-2 md:flex-none bg-blue-600 hover:bg-blue-500 text-white text-[15px] font-black px-10 py-3.5 rounded-2xl transition-all active:scale-95 shadow-xl shadow-blue-600/30 flex items-center justify-center gap-3 h-12"
                                            >
                                                <span>המשך לעבוד</span>
                                                <ArrowLeft className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </m.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </m.div>
                )}
            </AnimatePresence>
        </div>
    );
}

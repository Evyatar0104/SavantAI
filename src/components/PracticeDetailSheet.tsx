"use client";

import { useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Clock, Zap, X } from "lucide-react";
import { useSavantStore } from "@/store/useSavantStore";
import { haptics } from "@/lib/haptics";
import type { PracticeItem } from "@/data/practice";

interface Props {
    item: PracticeItem;
    onClose: () => void;
}

const TOOL_LOGO: Record<string, string | null> = {
    Claude: "/assets/logos/claude.png",
    ChatGPT: "/assets/logos/chatgpt.png",
    Gemini: "/assets/logos/gemini.png",
    "כל מודל": null,
};

export function PracticeDetailSheet({ item, onClose }: Props) {
    const completedPractice = useSavantStore(s => s.completedPractice);
    const completePracticeItem = useSavantStore(s => s.completePracticeItem);
    const [showToast, setShowToast] = useState(false);
    const [showCelebration, setShowCelebration] = useState(false);

    const isCompleted = completedPractice.includes(item.id);
    const logo = TOOL_LOGO[item.tool];

    const handleComplete = () => {
        haptics.tap();
        if (isCompleted) {
            setShowToast(true);
            setTimeout(() => setShowToast(false), 2500);
            setTimeout(onClose, 2600);
            return;
        }
        completePracticeItem(item.id, item.xp);
        haptics.complete();
        setShowCelebration(true);
        setTimeout(() => {
            setShowCelebration(false);
            onClose();
        }, 1800);
    };

    return (
        <AnimatePresence>
            {/* Backdrop */}
            <m.div
                key="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 z-[400] bg-black/60 backdrop-blur-sm"
            />

            {/* Sheet */}
            <m.div
                key="sheet"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", stiffness: 320, damping: 32 }}
                className="fixed bottom-0 left-0 right-0 z-[401] flex flex-col"
                style={{
                    maxHeight: "90dvh",
                    borderRadius: "24px 24px 0 0",
                    background: "rgba(15,15,25,0.98)",
                    border: "0.5px solid rgba(255,255,255,0.1)",
                    borderBottom: "none",
                }}
                dir="rtl"
            >
                {/* Drag handle */}
                <div className="flex justify-center pt-3 pb-1 shrink-0">
                    <div style={{ width: 40, height: 4, borderRadius: 99, background: "rgba(255,255,255,0.15)" }} />
                </div>

                {/* Scrollable content */}
                <div className="overflow-y-auto flex-1 px-5 pb-4 no-scrollbar">
                    {/* Type + tool badges */}
                    <div className="flex items-center gap-2 mb-4 mt-2">
                        <span style={{
                            fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 99,
                            background: item.type === "project" ? "rgba(139,92,246,0.2)" : "rgba(255,255,255,0.08)",
                            color: item.type === "project" ? "#C4B5FD" : "rgba(255,255,255,0.6)",
                        }}>
                            {item.type === "drill" ? "תרגיל" : "פרויקט"}
                        </span>

                        <div className="flex items-center gap-1.5" style={{
                            fontSize: 11, fontWeight: 500, padding: "3px 10px", borderRadius: 99,
                            background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.55)",
                        }}>
                            {logo ? (
                                <Image src={logo} alt={item.tool} width={14} height={14} style={{ borderRadius: 3, objectFit: "contain" }} />
                            ) : null}
                            <span>{item.tool}</span>
                        </div>
                    </div>

                    {/* Title */}
                    <h2 style={{ fontSize: 24, fontWeight: 700, color: "white", marginBottom: 12, lineHeight: 1.3 }}>
                        {item.title}
                    </h2>

                    {/* Time + XP row */}
                    <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center gap-1.5" style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>
                            <Clock className="w-3.5 h-3.5" />
                            <span>{item.timeMinutes} דקות</span>
                        </div>
                        <div className="flex items-center gap-1" style={{
                            fontSize: 13, fontWeight: 700, color: "#FCD34D",
                            background: "rgba(252,211,77,0.1)", padding: "3px 10px", borderRadius: 99,
                        }}>
                            <Zap className="w-3 h-3" />
                            <span>{item.xp} XP</span>
                        </div>
                    </div>

                    {/* Description */}
                    <p style={{ fontSize: 15, color: "rgba(255,255,255,0.65)", lineHeight: 1.7, marginBottom: 16 }}>
                        {item.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-5">
                        {item.tags.map((tag) => (
                            <span key={tag} style={{
                                fontSize: 11, padding: "3px 10px", borderRadius: 99,
                                background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)", fontWeight: 500,
                            }}>
                                {tag}
                            </span>
                        ))}
                    </div>

                    <div style={{ height: 1, background: "rgba(255,255,255,0.08)", marginBottom: 20 }} />

                    {/* Steps header */}
                    <p style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.5)", letterSpacing: "0.05em", marginBottom: 16 }}>
                        איך עושים את זה
                    </p>

                    {/* Numbered steps */}
                    <ol className="flex flex-col gap-4 mb-6">
                        {item.steps.map((step, i) => (
                            <li key={i} className="flex gap-3">
                                <div style={{
                                    width: 24, height: 24, borderRadius: "50%", flexShrink: 0, marginTop: 2,
                                    background: "rgba(83,74,183,0.25)", border: "1px solid rgba(83,74,183,0.4)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: 11, fontWeight: 700, color: "#A78BFA",
                                }}>
                                    {i + 1}
                                </div>
                                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.75)", lineHeight: 1.7 }}>
                                    {step}
                                </p>
                            </li>
                        ))}
                    </ol>

                    <div style={{ height: 1, background: "rgba(255,255,255,0.08)", marginBottom: 20 }} />
                </div>

                {/* CTA button */}
                <div className="shrink-0 px-5 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] pt-2">
                    <m.button
                        whileTap={{ scale: 0.97 }}
                        onClick={handleComplete}
                        className="w-full py-4 rounded-2xl font-bold text-base"
                        style={{
                            background: isCompleted ? "rgba(255,255,255,0.08)" : "#534AB7",
                            color: isCompleted ? "rgba(255,255,255,0.5)" : "white",
                            border: isCompleted ? "1px solid rgba(255,255,255,0.1)" : "none",
                        }}
                    >
                        {isCompleted ? "✓ הושלם" : "סיימתי"}
                    </m.button>
                </div>

                {/* Toast */}
                <AnimatePresence>
                    {showToast && (
                        <m.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="absolute bottom-24 right-5 left-5 flex justify-center"
                        >
                            <div style={{
                                background: "rgba(30,30,50,0.95)", border: "1px solid rgba(255,255,255,0.1)",
                                borderRadius: 12, padding: "10px 20px", fontSize: 14, color: "white", fontWeight: 500,
                            }}>
                                כבר השלמת את זה 💪
                            </div>
                        </m.div>
                    )}
                </AnimatePresence>

                {/* Celebration overlay */}
                <AnimatePresence>
                    {showCelebration && (
                        <m.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 flex flex-col items-center justify-center rounded-t-3xl"
                            style={{ background: "rgba(15,15,25,0.97)", zIndex: 10 }}
                        >
                            <m.div
                                initial={{ scale: 0 }}
                                animate={{ scale: [0, 1.3, 1] }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                                style={{ fontSize: 64, marginBottom: 16 }}
                            >
                                🎉
                            </m.div>
                            <p style={{ fontSize: 22, fontWeight: 700, color: "white", marginBottom: 8 }}>כל הכבוד!</p>
                            <div className="flex items-center gap-1" style={{ color: "#FCD34D", fontWeight: 700, fontSize: 18 }}>
                                <Zap className="w-5 h-5" />
                                <span>+{item.xp} XP</span>
                            </div>
                        </m.div>
                    )}
                </AnimatePresence>
            </m.div>
        </AnimatePresence>
    );
}

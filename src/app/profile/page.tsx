"use client";

import { useSavantStore } from "@/store/useSavantStore";
import Image from "next/image";
import { m, Variants, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.08, delayChildren: 0.05 }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 12 },
    show: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 280, damping: 22 }
    }
};

const MODEL_ACCENT: Record<string, { color: string; bg: string; label: string }> = {
    claude:  { color: "#EF6C00", bg: "#EF6C0010", label: "Claude"  },
    chatgpt: { color: "#10A37F", bg: "#10A37F10", label: "ChatGPT" },
    gemini:  { color: "#4285F4", bg: "#4285F410", label: "Gemini"  },
};

export default function Profile() {
    const router = useRouter();

    // Store
    const xp                 = useSavantStore(s => s.xp);
    const streak             = useSavantStore(s => s.streak);
    const completedLessons   = useSavantStore(s => s.completedLessons);
    const completedCourses   = useSavantStore(s => s.completedCourses);
    const primaryModel       = useSavantStore(s => s.primaryModel);
    const primaryModelReason = useSavantStore(s => s.primaryModelReason);
    const profileTitle       = useSavantStore(s => s.profileTitle);
    const quizCompleted      = useSavantStore(s => s.quizCompleted);
    const resetPreferences   = useSavantStore(s => s.resetPreferences);
    const userName           = useSavantStore(s => s.userName);
    const setUserName        = useSavantStore(s => s.setUserName);

    const [isEditingName, setIsEditingName]         = useState(false);
    const [nameInput, setNameInput]                 = useState("");
    const [showResetModal, setShowResetModal] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const displayName = userName || "לומד/ת";
    const firstLetter = (userName ? userName.charAt(0) : "ל").toUpperCase();
    const titlePill   = profileTitle || "מתחיל/ה";

    // Enter edit mode
    const startEdit = () => {
        setNameInput(userName || "");
        setIsEditingName(true);
    };

    // Focus input when edit mode opens
    useEffect(() => {
        if (isEditingName) inputRef.current?.focus();
    }, [isEditingName]);

    const confirmEdit = () => {
        const trimmed = nameInput.trim();
        if (trimmed) setUserName(trimmed);
        setIsEditingName(false);
    };

    const cancelEdit = () => setIsEditingName(false);

    const confirmReset = () => {
        resetPreferences();
        router.push("/quiz");
    };

    const badges = [
        {
            id: "first-lesson",
            name: "צעד ראשון",
            description: "השלמת שיעור ראשון",
            icon: "🎯",
            earned: completedLessons.length >= 1,
        },
        {
            id: "three-lessons",
            name: "מתחמם",
            description: "השלמת 3 שיעורים",
            icon: "🔥",
            earned: completedLessons.length >= 3,
        },
        {
            id: "first-course",
            name: "בוגר קורס",
            description: "השלמת קורס שלם",
            icon: "🎓",
            earned: completedCourses.length >= 1,
        },
        {
            id: "streak-3",
            name: "עקשן",
            description: "3 ימים ברצף",
            icon: "⚡",
            earned: streak >= 3,
        },
        {
            id: "quiz-done",
            name: "מאופיין",
            description: "השלמת את האפיון",
            icon: "🧬",
            earned: quizCompleted === true,
            special: true,
        },
        {
            id: "six-lessons",
            name: "רציני",
            description: "השלמת 6 שיעורים",
            icon: "💎",
            earned: completedLessons.length >= 6,
        }
    ];

    const modelAccent = primaryModel ? (MODEL_ACCENT[primaryModel] ?? MODEL_ACCENT.claude) : null;

    return (
        <div
            className="mx-auto px-6 pt-10 pb-20"
            style={{ direction: "rtl", maxWidth: 640 }}
        >
            {/* ── HEADER ─────────────────────────────── */}
            <m.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex items-center gap-6 mb-8"
            >
                {/* Avatar with gradient ring */}
                <div className="relative w-16 h-16 sm:w-[72px] sm:h-[72px] shrink-0">
                    <div style={{
                        position: "absolute",
                        inset: 0,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #534AB7, #818CF8, #C084FC)",
                        padding: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}>
                        <div
                            className="text-2xl sm:text-3xl font-medium text-[#818CF8]"
                            style={{
                                width: "100%",
                                height: "100%",
                                borderRadius: "50%",
                                background: "#0f0f1a",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            {firstLetter}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-1 leading-tight">
                    {/* Name row — display or edit */}
                    {isEditingName ? (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={confirmEdit}
                                style={{
                                    width: 28, height: 28,
                                    borderRadius: "50%",
                                    background: "#534AB7",
                                    color: "white",
                                    fontSize: 14,
                                    border: "none",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexShrink: 0,
                                }}
                                onMouseEnter={e => (e.currentTarget.style.background = "#4338CA")}
                                onMouseLeave={e => (e.currentTarget.style.background = "#534AB7")}
                            >✓</button>
                            <button
                                onClick={cancelEdit}
                                style={{
                                    width: 28, height: 28,
                                    borderRadius: "50%",
                                    background: "rgba(255,255,255,0.06)",
                                    border: "0.5px solid rgba(255,255,255,0.15)",
                                    color: "#a1a1aa",
                                    fontSize: 14,
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexShrink: 0,
                                }}
                            >✕</button>
                            <input
                                ref={inputRef}
                                value={nameInput}
                                onChange={e => setNameInput(e.target.value)}
                                onKeyDown={e => {
                                    if (e.key === "Enter") confirmEdit();
                                    if (e.key === "Escape") cancelEdit();
                                }}
                                dir="rtl"
                                style={{
                                    fontSize: 30,
                                    fontWeight: 500,
                                    background: "transparent",
                                    border: "none",
                                    borderBottom: "2px solid #534AB7",
                                    borderRadius: 0,
                                    color: "inherit",
                                    outline: "none",
                                    padding: "0 0 2px 0",
                                    minWidth: 150,
                                    maxWidth: 250,
                                    direction: "rtl",
                                }}
                                placeholder="שם..."
                            />
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                             <h1 className="text-2xl sm:text-[30px] font-medium m-0 leading-none text-white whitespace-nowrap overflow-hidden text-ellipsis">
                                 {displayName}
                             </h1>
                            <button
                                onClick={startEdit}
                                title="ערוך שם"
                                style={{
                                    width: 24, height: 24,
                                    borderRadius: "50%",
                                    background: "rgba(255,255,255,0.05)",
                                    border: "0.5px solid rgba(255,255,255,0.12)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    cursor: "pointer",
                                    fontSize: 11,
                                    color: "#71717a",
                                    transition: "background 0.15s",
                                    flexShrink: 0,
                                }}
                                onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
                                onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
                            >✏️</button>
                        </div>
                    )}

                     {/* Profile title pill */}
                    <div className="mt-1">
                        <span className="inline-block bg-gradient-to-br from-[#534AB7] to-[#7C3AED] text-white text-[13px] sm:text-sm font-semibold px-3 py-1 sm:px-4 sm:py-1.5 rounded-full shadow-[0_0_12px_#534AB740]">
                            {titlePill}
                        </span>
                    </div>

                    <div className="flex items-center gap-[5px] text-[11px] sm:text-[12px] text-white/50 mt-1">
                        <div className="w-[5px] h-[5px] sm:w-[6px] sm:h-[6px] rounded-full bg-[#22c55e]" />
                        פעיל/ה עכשיו
                    </div>
                </div>
            </m.div>

            <m.div variants={containerVariants} initial="hidden" animate="show">

                {/* ── STATS ─────────────────────────────── */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                    <m.div variants={itemVariants} whileHover={{ scale: 1.03, y: -2 }} transition={{ type: "spring", stiffness: 300, damping: 20 }} style={{
                        background: "linear-gradient(145deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)",
                        border: "1px solid rgba(255,255,255,0.15)",
                        borderTop: "4px solid #818CF8",
                        borderRadius: 20,
                        textAlign: "right",
                        minHeight: "auto",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        backdropFilter: "blur(12px)",
                    }} className="p-4 sm:p-5 sm:min-h-[110px]">
                        <div className="text-2xl sm:text-3xl font-semibold text-[#818CF8] leading-none">{completedLessons.length}</div>
                        <div className="text-[11px] sm:text-[13px] text-white/70 mt-1.5 sm:mt-2 font-medium">שיעורים הושלמו</div>
                    </m.div>

                    <m.div variants={itemVariants} whileHover={{ scale: 1.03, y: -2 }} transition={{ type: "spring", stiffness: 300, damping: 20 }} style={{
                        background: "linear-gradient(145deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)",
                        border: "1px solid rgba(255,255,255,0.15)",
                        borderTop: "4px solid #F59E0B",
                        borderRadius: 20,
                        textAlign: "right",
                        minHeight: "auto",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        backdropFilter: "blur(12px)",
                    }} className="p-4 sm:p-5 sm:min-h-[110px]">
                        <div className="text-2xl sm:text-3xl font-semibold text-[#F59E0B] leading-none">{xp}</div>
                        <div className="text-[11px] sm:text-[13px] text-white/70 mt-1.5 sm:mt-2 font-medium">נקודות XP</div>
                    </m.div>

                    <m.div variants={itemVariants} whileHover={{ scale: 1.03, y: -2 }} transition={{ type: "spring", stiffness: 300, damping: 20 }} style={{
                        background: "linear-gradient(145deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)",
                        border: "1px solid rgba(255,255,255,0.15)",
                        borderTop: "4px solid #EF4444",
                        borderRadius: 20,
                        textAlign: "right",
                        minHeight: "auto",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        backdropFilter: "blur(12px)",
                    }} className="p-4 sm:p-5 sm:min-h-[110px]">
                        <div className="text-2xl sm:text-3xl font-semibold text-[#EF4444] leading-none">{streak}</div>
                        <div className="text-[11px] sm:text-[13px] text-white/70 mt-1.5 sm:mt-2 font-medium">רצף נוכחי</div>
                    </m.div>
                </div>

                {/* ── RECOMMENDED MODEL ─────────────────── */}
                {primaryModel && modelAccent && (
                    <m.div variants={itemVariants} whileHover={{ scale: 1.02, y: -2 }} transition={{ type: "spring", stiffness: 300, damping: 20 }} style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 18,
                        border: "1px solid rgba(255,255,255,0.15)",
                        borderRight: `4px solid ${modelAccent.color}`,
                        borderRadius: 20,
                        background: "linear-gradient(145deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)",
                        backdropFilter: "blur(12px)",
                        padding: "20px 24px",
                        marginBottom: 20,
                    }}>
                        <Image
                            src={`/assets/logos/${primaryModel === "chatgpt" ? "openai" : primaryModel}.svg`}
                            alt={primaryModel}
                            width={48}
                            height={48}
                            className="w-10 h-10 sm:w-12 sm:h-12 object-contain shrink-0"
                            loading="lazy"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = `/assets/logos/${primaryModel === "chatgpt" ? "openai" : primaryModel}.png`;
                            }}
                        />
                        <div className="flex flex-col">
                            <span className="text-[11px] sm:text-[12px] text-zinc-400 uppercase leading-none mb-1 sm:mb-1.5 font-medium">הכלי המומלץ שלך</span>
                            <span className="text-base sm:text-lg font-semibold leading-tight text-white">{modelAccent.label}</span>
                            {primaryModelReason && (
                                <span className="text-xs sm:text-sm text-zinc-300 mt-1">
                                    {primaryModelReason}
                                </span>
                            )}
                        </div>
                        <div style={{ marginRight: "auto", flexShrink: 0, paddingLeft: 4 }}>
                            <button
                                onClick={() => setShowResetModal(true)}
                                style={{ fontSize: 14, color: "#818CF8", background: "transparent", border: "none", padding: 0, cursor: "pointer", fontWeight: 500 }}
                            >
                                שנה ←
                            </button>
                        </div>
                    </m.div>
                )}

                {/* ── BADGES ────────────────────────────── */}
                <m.div variants={itemVariants} className="mb-6">
                    <h2 className="text-lg font-medium mb-3.5 text-white">הישגים</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {badges.map((badge) => {
                            const isSpecialEarned = badge.special && badge.earned;
                            return (
                                <m.div
                                    key={badge.id}
                                    whileHover={{ scale: 1.03, y: -2 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                    style={{
                                        width: "100%",
                                        borderRadius: 20,
                                        minHeight: 96,
                                        border: isSpecialEarned
                                            ? "1px solid rgba(139,92,246,0.5)"
                                            : badge.earned
                                                ? "1px solid rgba(255,255,255,0.2)"
                                                : "1px solid rgba(255,255,255,0.08)",
                                        background: isSpecialEarned
                                            ? "linear-gradient(145deg, rgba(83,74,183,0.4) 0%, rgba(83,74,183,0.15) 100%)"
                                            : badge.earned
                                                ? "linear-gradient(145deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)"
                                                : "linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)",
                                         padding: "16px 20px",
                                         display: "flex",
                                         alignItems: "center",
                                         gap: 16,
                                         opacity: badge.earned ? 1 : 0.6,
                                         backdropFilter: "blur(12px)",
                                         WebkitBackdropFilter: "blur(12px)",
                                         cursor: "default",
                                     }}
                                 >
                                     <div className="text-3xl sm:text-[34px] leading-none shrink-0" style={{
                                         filter: badge.earned ? "none" : "grayscale(1) brightness(0.7)",
                                     }}>
                                         {badge.icon}
                                     </div>
                                     <div className="flex flex-col overflow-hidden">
                                         <span className="text-base font-semibold whitespace-nowrap overflow-hidden text-ellipsis" style={{
                                             color: isSpecialEarned ? "#A78BFA" : "white",
                                         }}>
                                             {badge.name}
                                         </span>
                                         <span className="text-[12px] sm:text-[13px] text-white/60 leading-normal mt-0.5 sm:mt-1">
                                             {badge.description}
                                         </span>
                                     </div>
                                 </m.div>
                            );
                        })}
                    </div>
                    <div style={{ textAlign: "center", marginTop: 16 }}>
                        <span style={{ fontSize: 13, color: "#a1a1aa", fontWeight: 500 }}>עוד הישגים יתווספו בקרוב</span>
                    </div>
                </m.div>



            </m.div>

            <AnimatePresence>
                {showResetModal && (
                    <m.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center px-4"
                        style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)" }}
                    >
                        <m.div
                            initial={{ scale: 0.9, opacity: 0, y: 10 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 10 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            style={{
                                width: "100%",
                                maxWidth: 400,
                                background: "linear-gradient(145deg, rgba(30,30,40,0.9) 0%, rgba(20,20,30,0.95) 100%)",
                                border: "1px solid rgba(255,255,255,0.1)",
                                borderRadius: 24,
                                padding: "32px 24px",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                textAlign: "center",
                                direction: "rtl",
                                boxShadow: "0 24px 48px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05) inset"
                            }}
                        >
                            <div style={{
                                width: 56, height: 56,
                                borderRadius: "50%",
                                background: "rgba(239,68,68,0.15)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: 24, color: "#EF4444", marginBottom: 16
                            }}>
                                ⚠️
                            </div>
                            <h3 style={{ fontSize: 20, fontWeight: 600, color: "white", marginBottom: 8 }}>
                                איפוס העדפות האפיון
                            </h3>
                            <p style={{ fontSize: 14, color: "#a1a1aa", lineHeight: 1.5, marginBottom: 24 }}>
                                פעולה זו תאפס את נתוני האפיון וההמלצות שיצרנו עבורך, אבל 
                                <strong style={{ color: "#818CF8", fontWeight: 500 }}> לא תמחק </strong> 
                                את ההתקדמות, ה-XP וההישגים שצברת.
                            </p>
                            <div className="flex items-center gap-3 w-full">
                                <button
                                    onClick={() => setShowResetModal(false)}
                                    className="flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all"
                                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "white", cursor: "pointer" }}
                                    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
                                    onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                                >
                                    ביטול
                                </button>
                                <button
                                    onClick={confirmReset}
                                    className="flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all"
                                    style={{ background: "#EF4444", border: "1px solid #DC2626", color: "white", cursor: "pointer" }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.background = "#DC2626";
                                        e.currentTarget.style.boxShadow = "0 8px 16px rgba(239, 68, 68, 0.2)";
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.background = "#EF4444";
                                        e.currentTarget.style.boxShadow = "none";
                                    }}
                                >
                                    אשר איפוס
                                </button>
                            </div>
                        </m.div>
                    </m.div>
                )}
            </AnimatePresence>
        </div>
    );
}

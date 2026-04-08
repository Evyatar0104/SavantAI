"use client";

import { useSavantStore } from "@/store/useSavantStore";
import Image from "next/image";
import { m, Variants, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect, memo, useMemo } from "react";
import { BADGES, isBadgeEarned, type RarityTier, RARITY_COLORS } from "@/content/badges";
import { haptics } from "@/lib/haptics";
import { cn } from "@/lib/utils";
import { Sparkles, Flame, ChevronLeft, Edit2, Check, X, Info, BookOpen, Palette, Medal, Trophy } from "lucide-react";
import { learningPaths } from "@/data/learningPaths";
import { MODEL_THEMES, getLevelInfo } from "@/lib/userTheme";
import { AchievementCard } from "@/components/AchievementCard";
import { BadgeCard } from "@/components/BadgeCard";

const RARITY_ORDER: RarityTier[] = ["Legendary", "Epic", "Super Rare", "Rare", "Common"];

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.08, delayChildren: 0.1 }
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

const USER_COLORS = [
    { label: "אינדיגו", value: "#6366F1" },
    { label: "טורקיז", value: "#14B8A6" },
    { label: "ורוד", value: "#EC4899" },
    { label: "כתום", value: "#F97316" },
    { label: "זהב", value: "#F59E0B" },
    { label: "סגול", value: "#A855F7" },
    { label: "אמרלד", value: "#10B981" },
    { label: "רויאל", value: "#3B82F6" },
];

export default function Profile() {
    const router = useRouter();
    
    // Atomic selectors
    const xp                 = useSavantStore(s => s.xp);
    const streak             = useSavantStore(s => s.streak);
    const completedLessons   = useSavantStore(s => s.completedLessons);
    const primaryModel       = useSavantStore(s => s.primaryModel);
    const primaryModelReason = useSavantStore(s => s.primaryModelReason);
    const profileTitle       = useSavantStore(s => s.profileTitle);
    const resetPreferences   = useSavantStore(s => s.resetPreferences);
    const userName           = useSavantStore(s => s.userName);
    const userColor          = useSavantStore(s => s.userColor);
    const setUserName        = useSavantStore(s => s.setUserName);
    const setUserColor       = useSavantStore(s => s.setUserColor);
    const experienceLevel    = useSavantStore(s => s.experienceLevel);
    const quizCompleted      = useSavantStore(s => s.quizCompleted);
    
    const state = useSavantStore();

    const [isEditingName, setIsEditingName]         = useState(false);
    const [nameInput, setNameInput]                 = useState("");
    const [showResetModal, setShowResetModal]       = useState(false);
    const [showColorPicker, setShowColorPicker]     = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const displayName = userName || "לומד/ת";
    const firstLetter = (userName ? userName.charAt(0) : "ל").toUpperCase();
    const titlePill   = profileTitle || "מתחיל/ה";

    const { level, progress, xpToNext } = useMemo(() => getLevelInfo(xp), [xp]);
    const theme = MODEL_THEMES[primaryModel || "default"] || MODEL_THEMES.default;
    const activeUserColor = userColor || theme.primary;

    // Combine and group all cards by rarity
    const groupedCards = useMemo(() => {
        const allItems: { type: 'achievement' | 'badge', data: any, rarity: RarityTier }[] = [
            ...learningPaths.map(p => ({ type: 'achievement' as const, data: p, rarity: p.rarity as RarityTier })),
            ...BADGES.map(b => ({ type: 'badge' as const, data: b, rarity: b.rarity as RarityTier }))
        ];

        const groups: Record<RarityTier, typeof allItems> = {
            Legendary: [],
            Epic: [],
            "Super Rare": [],
            Rare: [],
            Common: []
        };

        allItems.forEach(item => {
            groups[item.rarity].push(item);
        });

        return groups;
    }, []);

    // Enter edit mode
    const startEdit = () => {
        setNameInput(userName || "");
        setIsEditingName(true);
        haptics.impact("medium");
    };

    // Focus input when edit mode opens
    useEffect(() => {
        if (isEditingName) inputRef.current?.focus();
    }, [isEditingName]);

    const confirmEdit = () => {
        const trimmed = nameInput.trim();
        if (trimmed) setUserName(trimmed);
        setIsEditingName(false);
        haptics.notification("success");
    };

    const cancelEdit = () => {
        setIsEditingName(false);
        haptics.impact("light");
    };

    const confirmReset = () => {
        resetPreferences();
        router.push("/quiz");
    };

    const pickColor = (color: string) => {
        setUserColor(color);
        setShowColorPicker(false);
        haptics.impact("medium");
    };

    return (
        <div
            className="mx-auto px-5 pt-8 pb-32"
            style={{ direction: "rtl", maxWidth: 640 }}
        >
            <m.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="space-y-8"
            >
                {/* ── HERO PROFILE CARD ─────────────────────────────── */}
                <m.div 
                    variants={itemVariants}
                    className="relative overflow-hidden rounded-[32px] p-1 shadow-2xl"
                    style={{ 
                        background: `linear-gradient(135deg, ${activeUserColor}40, ${theme.secondary}20)`,
                    }}
                >
                    <div className="glass-panel rounded-[30px] p-6 md:p-8 overflow-hidden relative">
                        {/* Background mesh gradient */}
                        <div className="absolute inset-0 opacity-25 pointer-events-none" 
                             style={{ 
                                background: `radial-gradient(circle at 20% 30%, ${activeUserColor}, transparent 70%), 
                                             radial-gradient(circle at 80% 70%, ${theme.secondary}, transparent 70%)`,
                                filter: "blur(50px)"
                             }} 
                        />

                        <div className="relative z-10 flex flex-col gap-6">
                            {/* Top row: Avatar, Name, Level */}
                            <div className="flex items-center gap-5">
                                {/* Squarcle Avatar */}
                                <div className="relative shrink-0 group">
                                    <m.div 
                                        onClick={() => setShowColorPicker(!showColorPicker)}
                                        className="w-20 h-20 md:w-24 md:h-24 squarcle bg-gradient-to-br p-[2px] shadow-lg transition-transform group-hover:scale-105 duration-500 cursor-pointer relative"
                                        style={{ backgroundImage: `linear-gradient(135deg, ${activeUserColor}, ${theme.secondary})` }}
                                    >
                                        <div className="w-full h-full squarcle bg-zinc-950 flex items-center justify-center">
                                            <span className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-br"
                                                  style={{ backgroundImage: `linear-gradient(135deg, ${activeUserColor}, ${theme.secondary})` }}>
                                                {firstLetter}
                                            </span>
                                        </div>
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 squarcle">
                                            <Palette size={20} className="text-white" />
                                        </div>
                                    </m.div>
                                    <m.div 
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.5, type: "spring" }}
                                        className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-black text-xs shadow-xl border-2 border-zinc-950"
                                    >
                                        {level}
                                    </m.div>
                                </div>

                                <div className="flex flex-col flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        {isEditingName ? (
                                            <div className="flex items-center gap-2 w-full">
                                                <input
                                                    ref={inputRef}
                                                    value={nameInput}
                                                    onChange={e => setNameInput(e.target.value)}
                                                    onKeyDown={e => {
                                                        if (e.key === "Enter") confirmEdit();
                                                        if (e.key === "Escape") cancelEdit();
                                                    }}
                                                    className="bg-white/5 border-b-2 border-white/20 text-xl md:text-2xl font-bold text-white outline-none px-1 py-0.5 w-full max-w-[200px]"
                                                    placeholder="השם שלך..."
                                                />
                                                <button onClick={confirmEdit} className="p-1.5 rounded-full bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors">
                                                    <Check size={18} />
                                                </button>
                                                <button onClick={cancelEdit} className="p-1.5 rounded-full bg-white/5 text-zinc-400 hover:bg-white/10 transition-colors">
                                                    <X size={18} />
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <h1 className="text-2xl md:text-3xl font-bold text-white truncate leading-tight">
                                                    {displayName}
                                                </h1>
                                                <button onClick={startEdit} className="p-1.5 rounded-full text-zinc-500 hover:text-white hover:bg-white/10 transition-all opacity-0 group-hover:opacity-100 md:opacity-100">
                                                    <Edit2 size={16} />
                                                </button>
                                            </>
                                        )}
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/10 text-white/90 border border-white/10 backdrop-blur-md">
                                            {titlePill}
                                        </span>
                                        {experienceLevel && (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 backdrop-blur-md">
                                                {experienceLevel === "beginner" ? "מתחיל" : "מתקדם"}
                                            </span>
                                        )}
                                        <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium mr-auto">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                            פעיל/ה עכשיו
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Progress bar section */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-end text-xs font-bold">
                                    <span className="text-white/60">רמה {level}</span>
                                    <span className="text-white/90">{xpToNext} XP לרמה הבאה</span>
                                    <span className="text-white/60">רמה {level + 1}</span>
                                </div>
                                <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-[1px]">
                                    <m.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progress}%` }}
                                        transition={{ duration: 1, ease: "easeOut" }}
                                        className="h-full rounded-full relative"
                                        style={{ background: `linear-gradient(to left, ${activeUserColor}, ${theme.secondary})` }}
                                    >
                                        <div className="absolute inset-0 bg-white/20 mix-blend-overlay animate-[shimmer_2s_infinite]" />
                                    </m.div>
                                </div>
                            </div>
                        </div>

                        {/* Color Picker Overlay */}
                        <AnimatePresence>
                            {showColorPicker && (
                                <m.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute inset-x-0 bottom-0 top-0 z-20 glass-panel p-6 flex flex-col items-center justify-center gap-4 bg-zinc-950/90"
                                >
                                    <button onClick={() => setShowColorPicker(false)} className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white">
                                        <X size={20} />
                                    </button>
                                    <h3 className="text-white font-bold mb-2">בחר את הצבע שלך</h3>
                                    <div className="grid grid-cols-4 gap-4">
                                        {USER_COLORS.map(c => (
                                            <button
                                                key={c.value}
                                                onClick={() => pickColor(c.value)}
                                                className="w-10 h-10 rounded-full border-2 border-white/10 transition-transform active:scale-90"
                                                style={{ 
                                                    backgroundColor: c.value,
                                                    boxShadow: userColor === c.value ? `0 0 15px ${c.value}` : 'none',
                                                    borderColor: userColor === c.value ? 'white' : 'transparent'
                                                }}
                                            />
                                        ))}
                                    </div>
                                </m.div>
                            )}
                        </AnimatePresence>
                    </div>
                </m.div>

                {/* ── STATS DASHBOARD ─────────────────────────────── */}
                <div className="grid grid-cols-3 gap-3 md:gap-4">
                    {[
                        { label: "שיעורים", value: completedLessons.length, icon: BookOpen, color: "#818CF8", glow: "rgba(129, 140, 248, 0.6)" },
                        { label: "נקודות XP", value: xp, icon: Sparkles, color: "#F59E0B", glow: "rgba(245, 158, 11, 0.6)" },
                        { label: "רצף ימים", value: streak, icon: Flame, color: "#EF4444", glow: "rgba(239, 68, 68, 0.6)" }
                    ].map((stat, idx) => (
                        <m.div 
                            key={stat.label}
                            variants={itemVariants}
                            whileHover={{ y: -6, scale: 1.02 }}
                            className="glass-panel rounded-[28px] p-4 md:p-5 flex flex-col items-center text-center relative overflow-hidden group cursor-default border-white/5"
                        >
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                                 style={{ background: `radial-gradient(circle at 50% 100%, ${stat.glow}, transparent 80%)` }} />
                            
                            <div className="w-12 h-12 flex items-center justify-center mb-3 transition-all duration-500 group-hover:scale-115 relative">
                                {/* Intense Bloom Background */}
                                <div className="absolute inset-0 blur-xl transition-all duration-500 opacity-20 group-hover:opacity-60 scale-75 group-hover:scale-110" style={{ backgroundColor: stat.color }} />
                                
                                <stat.icon 
                                    size={28} 
                                    className="relative z-10 transition-transform duration-500 group-hover:rotate-6" 
                                    style={{ 
                                        color: stat.color,
                                        filter: `drop-shadow(0 0 12px ${stat.color}80) drop-shadow(0 0 2px ${stat.color})`
                                    }} 
                                />
                            </div>
                            
                            <div className="text-xl md:text-2xl font-black text-white leading-none mb-1 group-hover:scale-105 transition-transform tracking-tight">
                                {stat.value}
                            </div>
                            <div className="text-[10px] md:text-xs font-bold text-zinc-500 uppercase tracking-wider group-hover:text-zinc-300 transition-colors">
                                {stat.label}
                            </div>
                        </m.div>
                    ))}
                </div>

                {/* ── CARD COLLECTION ───────────────────── */}
                <m.div variants={itemVariants} className="space-y-12">
                    <div className="flex items-center justify-between px-1">
                        <h2 className="text-lg font-bold text-white flex items-center gap-3">
                            <BookOpen size={18} className="text-indigo-400" />
                            אוסף הקלפים וההישגים
                        </h2>
                        <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                            {state.achievements.length + state.badges.length} / {learningPaths.length + BADGES.length} קלפים
                        </div>
                    </div>
                    
                    {RARITY_ORDER.map(rarity => {
                        const items = groupedCards[rarity];
                        if (items.length === 0) return null;
                        const tierColor = RARITY_COLORS[rarity];

                        return (
                            <div key={rarity} className="space-y-6">
                                {/* Rarity Divider Header */}
                                <div className="flex items-center gap-4 px-1">
                                    <div 
                                        className="h-px flex-1" 
                                        style={{ background: `linear-gradient(to left, ${tierColor.border}, transparent)` }} 
                                    />
                                    <h3 
                                        className="text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2"
                                        style={{ color: tierColor.border.replace('0.4', '1').replace('0.5', '1').replace('0.6', '1') }}
                                    >
                                        <Trophy size={12} />
                                        {rarity === "Super Rare" ? "SUPER RARE" : rarity}
                                    </h3>
                                    <div 
                                        className="h-px flex-1" 
                                        style={{ background: `linear-gradient(to right, ${tierColor.border}, transparent)` }} 
                                    />
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
                                    {items.map(item => {
                                        if (item.type === 'achievement') {
                                            const earned = state.achievements.includes(item.data.id);
                                            return (
                                                <AchievementCard 
                                                    key={item.data.id}
                                                    path={item.data}
                                                    earned={earned}
                                                    onClick={() => {
                                                        if (earned) haptics.tap();
                                                    }}
                                                />
                                            );
                                        } else {
                                            const earned = isBadgeEarned(item.data.id, state);
                                            return (
                                                <BadgeCard
                                                    key={item.data.id}
                                                    badge={item.data}
                                                    earned={earned}
                                                    onClick={() => {
                                                        if (earned) {
                                                            haptics.tap();
                                                            router.push(`/vault/${item.data.id}?from=profile`);
                                                        }
                                                    }}
                                                />
                                            );
                                        }
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </m.div>
            </m.div>

            {/* Reset Modal - Standard Savant Styling */}
            <AnimatePresence>
                {showResetModal && (
                    <m.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center px-4 backdrop-blur-sm"
                        style={{ background: "rgba(0,0,0,0.85)" }}
                    >
                        <m.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="w-full max-w-sm glass-panel rounded-[32px] p-8 text-center relative overflow-hidden shadow-[0_32px_64px_rgba(0,0,0,0.5)]"
                        >
                            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent" />
                            
                            <div className="w-16 h-16 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-6">
                                <Info size={32} />
                            </div>
                            
                            <h3 className="text-xl font-bold text-white mb-3">
                                איפוס העדפות האפיון
                            </h3>
                            
                            <p className="text-sm text-zinc-400 leading-relaxed mb-8">
                                פעולה זו תאפס את נתוני האפיון וההמלצות שיצרנו עבורך. ה-XP והקלפים שלך <span className="text-white font-bold">לא יימחקו</span>.
                            </p>
                            
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={confirmReset}
                                    className="w-full py-4 rounded-2xl bg-red-500 text-white font-black text-sm transition-all hover:bg-red-600 shadow-xl shadow-red-500/20 active:scale-95"
                                >
                                    אשר איפוס
                                </button>
                                <button
                                    onClick={() => setShowResetModal(false)}
                                    className="w-full py-4 rounded-2xl bg-white/5 text-zinc-400 font-bold text-sm transition-all hover:bg-white/10 active:scale-95"
                                >
                                    ביטול
                                </button>
                            </div>
                        </m.div>
                    </m.div>
                )}
            </AnimatePresence>
        </div>
    );
}

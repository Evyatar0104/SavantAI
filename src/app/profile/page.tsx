"use client";

import { useSavantStore } from "@/store/useSavantStore";
import Image from "next/image";
import { m, Variants, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect, useMemo } from "react";
import { BADGES, isBadgeEarned, type RarityTier, RARITY_COLORS, type Badge } from "@/content/badges";
import { haptics } from "@/lib/haptics";
import { cn } from "@/lib/utils";
import { Sparkles, Flame, Edit2, Check, X, Info, BookOpen, Palette, Trophy, Zap, Rocket } from "lucide-react";
import { learningPaths, type LearningPath } from "@/data/learningPaths";
import { MODEL_THEMES, getLevelInfo, QUIZ_MODEL_NAMES, QUIZ_MODEL_THEME, TOOL_LOGOS, TOOL_EMOJIS } from "@/lib/userTheme";
import { AchievementCard } from "@/components/AchievementCard";
import { BadgeCard } from "@/components/BadgeCard";
import { generateModelCards } from "@/lib/quizScoring";

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
    const completedCourses   = useSavantStore(s => s.completedCourses);
    const primaryModel       = useSavantStore(s => s.primaryModel);
    const userName           = useSavantStore(s => s.userName);
    const userColor          = useSavantStore(s => s.userColor);
    const setUserName        = useSavantStore(s => s.setUserName);
    const setUserColor       = useSavantStore(s => s.setUserColor);
    const quizCompleted      = useSavantStore(s => s.quizCompleted);
    const secondaryModel     = useSavantStore(s => s.secondaryModel);
    const specialistTools    = useSavantStore(s => s.specialistTools);
    const profileTitle       = useSavantStore(s => s.profileTitle);
    const achievements       = useSavantStore(s => s.achievements);
    const badges             = useSavantStore(s => s.badges);
    const resetPreferences   = useSavantStore(s => s.resetPreferences);

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
        const allItems: { type: 'achievement' | 'badge', data: Badge | LearningPath, rarity: RarityTier }[] = [
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
                                        {(() => {
                                            const getLevelTitle = (lvl: number) => {
                                                if (lvl < 5) return "מתחיל";
                                                if (lvl < 10) return "מלומד";
                                                if (lvl < 20) return "מומחה";
                                                if (lvl < 30) return "מקצוען";
                                                return "סוואנט";
                                            };
                                            const lTitle = getLevelTitle(level);
                                            const isSavant = level >= 30;

                                            return (
                                                <span className={cn(
                                                    "inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter backdrop-blur-md transition-all duration-500 border",
                                                    isSavant 
                                                        ? "bg-gradient-to-r from-[#6366F1] via-[#A855F7] to-[#EC4899] text-white border-white/40 shadow-[0_0_20px_rgba(168,85,247,0.4)] ring-1 ring-white/20" 
                                                        : "bg-indigo-500/20 text-indigo-300 border-indigo-500/20"
                                                )}>
                                                    {isSavant && (
                                                        <div className="w-4 h-4 ml-1.5 relative flex items-center justify-center">
                                                            <div className="absolute inset-0 bg-white rounded-full blur-[4px] opacity-50 animate-pulse" />
                                                            <Image src="/assets/savant-logo.png" alt="Savant" width={14} height={14} className="relative z-10" />
                                                        </div>
                                                    )}
                                                    {lTitle}
                                                </span>
                                            );
                                        })()}
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
                    ].map((stat) => (
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
                
                {/* ── MY AI STACK ─────────────────────────────── */}
                {quizCompleted && primaryModel && (
                    <m.div variants={itemVariants} className="space-y-6">
                        <div className="flex items-center justify-between px-1">
                            <h2 className="text-lg font-bold text-white flex items-center gap-3">
                                <Zap size={18} className="text-amber-400" />
                                הסטאק הטכנולוגי שלי
                            </h2>
                            <button 
                                onClick={() => setShowResetModal(true)}
                                className="text-[10px] font-black text-zinc-500 hover:text-white uppercase tracking-widest transition-colors"
                            >
                                אפיון מחדש
                            </button>
                        </div>

                        {(() => {
                            const modelCards = generateModelCards({
                                primaryModel: primaryModel,
                                secondaryModel: secondaryModel!,
                                profileTitle: profileTitle || "משתמש כללי",
                            });
                            
                            const primary = modelCards[0];
                            const secondary = modelCards[1];
                            const theme = QUIZ_MODEL_THEME[primary.model];
                            const secTheme = QUIZ_MODEL_THEME[secondary.model];

                            return (
                                <div className="space-y-4">
                                    {/* Primary Model Card */}
                                    <div className={`w-full rounded-[32px] bg-gradient-to-br ${theme.gradient} p-6 md:p-8 relative overflow-hidden shadow-2xl border border-white/10`} dir="rtl">
                                        <m.div
                                            animate={{ x: [0, 20, -10, 0], y: [0, -15, 10, 0], scale: [1, 1.2, 0.9, 1] }}
                                            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                                            className="absolute top-[-30px] right-[-30px] w-[140px] h-[140px] rounded-full pointer-events-none opacity-50"
                                            style={{ background: `radial-gradient(circle, ${theme.orbColors[0]} 0%, transparent 70%)`, filter: "blur(30px)" }}
                                        />

                                        <div className="flex items-center relative z-10 mb-6">
                                            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-3 ml-4 shadow-xl">
                                                <Image 
                                                    src={`/assets/logos/${primary.model}.png`} 
                                                    alt={primary.model} 
                                                    width={56} 
                                                    height={56} 
                                                    className="w-full h-full object-contain"
                                                />
                                            </div>
                                            <div>
                                                <h3 className="text-xl md:text-2xl font-bold text-white">{QUIZ_MODEL_NAMES[primary.model]}</h3>
                                                <div className="text-[10px] md:text-xs font-black tracking-wide" style={{ color: theme.accentColor }}>{theme.tagline}</div>
                                            </div>
                                        </div>

                                        <p className="mb-6 text-sm leading-relaxed text-zinc-300 relative z-10">
                                            {primary.profileExplanation}
                                        </p>

                                        <div className="flex flex-wrap gap-2 relative z-10">
                                            {primary.pros.map((pro, i) => (
                                                <div key={i} className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-medium text-white/90">
                                                    <div className="w-1 h-1 rounded-full bg-emerald-500" />
                                                    {pro}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Secondary Model */}
                                        <div className="rounded-[24px] p-5 relative overflow-hidden bg-white/[0.03] backdrop-blur-xl border border-white/10 shadow-xl" dir="rtl">
                                            <div className="flex items-center mb-4">
                                                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 p-2 ml-3">
                                                    <Image 
                                                        src={`/assets/logos/${secondary.model}.png`} 
                                                        alt={secondary.model} 
                                                        width={32} 
                                                        height={32} 
                                                        className="w-full h-full object-contain"
                                                    />
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-bold text-white">{QUIZ_MODEL_NAMES[secondary.model]}</h4>
                                                    <div className="text-[9px] font-bold" style={{ color: secTheme.accentColor }}>כלי משלים</div>
                                                </div>
                                            </div>
                                            <p className="text-[11px] leading-relaxed text-zinc-400">
                                                {secondary.profileExplanation.split('.')[0] + '.'}
                                            </p>
                                        </div>

                                        {/* Specialist Tools */}
                                        {specialistTools && specialistTools.length > 0 && (
                                            <div className="rounded-[24px] p-5 relative overflow-hidden bg-white/[0.03] backdrop-blur-xl border border-white/10 shadow-xl" dir="rtl">
                                                <div className="flex items-center mb-4">
                                                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center ml-3">
                                                        <Rocket size={20} className="text-purple-400" />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-bold text-white">ארגז כלים</h4>
                                                        <div className="text-[9px] font-bold text-purple-400">כלים מומלצים</div>
                                                    </div>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {specialistTools.slice(0, 4).map(tool => {
                                                        const logo = TOOL_LOGOS[tool];
                                                        const emoji = TOOL_EMOJIS[tool];
                                                        return (
                                                            <div key={tool} className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/5 border border-white/5 text-[10px] font-bold text-zinc-300">
                                                                {logo ? (
                                                                    <Image src={logo} alt={tool} width={14} height={14} className="w-3.5 h-3.5 object-contain" />
                                                                ) : emoji ? (
                                                                    <span>{emoji}</span>
                                                                ) : null}
                                                                {tool}
                                                            </div>
                                                        );
                                                    })}
                                                    {specialistTools.length > 4 && (
                                                        <div className="text-[10px] font-bold text-zinc-600 self-center">
                                                            +{specialistTools.length - 4} נוספים
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })()}
                    </m.div>
                )}

                {/* ── CARD COLLECTION ───────────────────── */}
                <m.div variants={itemVariants} className="space-y-12">
                    <div className="flex items-center justify-between px-1">
                        <h2 className="text-lg font-bold text-white flex items-center gap-3">
                            <BookOpen size={18} className="text-indigo-400" />
                            אוסף הקלפים וההישגים
                        </h2>
                        <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                            {achievements.length + badges.length} / {learningPaths.length + BADGES.length} קלפים
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
                                            const earned = achievements.includes(item.data.id);
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
                                            const earned = isBadgeEarned(item.data.id, { 
                                                badges, 
                                                completedLessons, 
                                                completedCourses, 
                                                streak, 
                                                quizCompleted 
                                            });
                                            return (
                                                <BadgeCard
                                                    key={item.data.id}
                                                    badge={item.data as Badge}
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

"use client";

import { useSavantStore } from "@/store/useSavantStore";
import Image from "next/image";
import { m, Variants, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect, memo, useMemo } from "react";
import { type Badge, BADGES, isBadgeEarned, RARITY_COLORS } from "@/content";
import { haptics } from "@/lib/haptics";
import { cn } from "@/lib/utils";
import { Sparkles, Flame, ChevronLeft, Edit2, Check, X, Info, BookOpen, Palette } from "lucide-react";

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

const MODEL_THEMES: Record<string, { 
    primary: string; 
    secondary: string; 
    glow: string; 
    label: string;
    icon: string;
    description: string;
}> = {
    claude:  { 
        primary: "#EF6C00", 
        secondary: "#FF9800", 
        glow: "rgba(239, 108, 0, 0.4)", 
        label: "Claude",
        icon: "/assets/logos/claude.png",
        description: "המומחה לכתיבה יצירתית, ניתוח טקסטים מורכבים וחשיבה אנושית ומעמיקה."
    },
    chatgpt: { 
        primary: "#10A37F", 
        secondary: "#19C37D", 
        glow: "rgba(16, 163, 127, 0.4)", 
        label: "ChatGPT",
        icon: "/assets/logos/chatgpt.png",
        description: "הכלי הרב-תכליתי ביותר בעולם. מצטיין בפתרון בעיות, כתיבת קוד וניהול שיחות זורמות."
    },
    gemini:  { 
        primary: "#4285F4", 
        secondary: "#8AB4F8", 
        glow: "rgba(66, 133, 244, 0.4)", 
        label: "Gemini",
        icon: "/assets/logos/gemini.png",
        description: "העוזר החכם של גוגל. מחובר למידע בזמן אמת ומצטיין בעיבוד מידע רב-ערוצי (תמונות, וידאו וטקסט)."
    },
    default: {
        primary: "#6366F1",
        secondary: "#A855F7",
        glow: "rgba(99, 102, 241, 0.4)",
        label: "Savant",
        icon: "/assets/savant-logo.png",
        description: "המדריך האישי שלך לעולם הבינה המלאכותית."
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

// Map each rarity to a vivid shimmer highlight color (used for the blob glow)
const SHIMMER_COLOR: Record<string, string> = {
    Common:    "161, 161, 170",   // silver-zinc
    Rare:      "99, 179, 255",    // electric blue
    Epic:      "196, 132, 255",   // violet-purple
    Legendary: "251, 191, 36",    // amber-gold
};

// Level calculation constants
const XP_PER_LEVEL = 500;

const getLevelInfo = (xp: number) => {
    const level = Math.floor(xp / XP_PER_LEVEL) + 1;
    const currentLevelXp = xp % XP_PER_LEVEL;
    const progress = (currentLevelXp / XP_PER_LEVEL) * 100;
    const xpToNext = XP_PER_LEVEL - currentLevelXp;
    
    return { level, progress, xpToNext };
};

const BadgeCard = memo(({ badge, earned, onClick }: { badge: Badge, earned: boolean, onClick: () => void }) => {
    const tierColor = RARITY_COLORS[badge.rarity || "Common"];
    const shimmerRgb = SHIMMER_COLOR[badge.rarity || "Common"];

    return (
        <div
            onClick={onClick}
            style={{
                aspectRatio: "3/4",
                borderRadius: 20,
                overflow: "hidden",
                perspective: 1000,
                cursor: earned ? "pointer" : "default",
                willChange: "transform",
                transform: "translateZ(0)",
                border: earned
                    ? `1px solid ${tierColor.border}`
                    : "1px solid rgba(255,255,255,0.05)",
                boxShadow: earned ? `0 12px 32px -8px ${tierColor.glow}` : "none",
            }}
        >
            <m.div
                whileHover={earned ? { scale: 1.03, rotateY: 8, rotateX: 6 } : undefined}
                whileTap={earned ? { scale: 0.95 } : undefined}
                style={{
                    width: "100%",
                    height: "100%",
                    padding: "16px 12px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    position: "relative",
                    background: earned
                        ? `linear-gradient(145deg, ${tierColor.main} 0%, rgba(10,10,15,0.4) 100%)`
                        : "rgba(15,15,25,0.4)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                }}
            >
                {/* Atmospheric Glow */}
                {earned && (
                    <div
                        style={{
                            position: "absolute",
                            inset: 0,
                            background: `radial-gradient(ellipse 120% 80% at 50% -10%, ${tierColor.glow}, transparent 70%)`,
                            opacity: 0.45,
                            pointerEvents: "none",
                        }}
                    />
                )}

                {/* Colored shimmer blob */}
                {earned && (
                    <div
                        className="card-shimmer-blob"
                        style={{
                            position: "absolute",
                            width: "180%",
                            height: "180%",
                            top: "-40%",
                            left: "-40%",
                            background: `radial-gradient(ellipse 35% 25% at 50% 50%, rgba(${shimmerRgb},0.22), transparent 60%),
                                         radial-gradient(ellipse 70% 55% at 50% 50%, rgba(${shimmerRgb},0.07), transparent 80%)`,
                            pointerEvents: "none",
                            zIndex: 1,
                        }}
                    />
                )}

                <div
                    className="text-4xl sm:text-5xl mb-3 drop-shadow-xl relative z-10"
                    style={{
                        filter: earned ? "none" : "grayscale(1) brightness(0.2) blur(1px)",
                        opacity: earned ? 1 : 0.4
                    }}
                >
                    {earned ? badge.icon : "🔒"}
                </div>

                <h3
                    className="text-[13px] sm:text-sm font-bold mb-1.5 relative z-10 leading-tight"
                    style={{ color: earned ? "white" : "rgba(255,255,255,0.3)" }}
                >
                    {badge.name}
                </h3>

                <p
                    className="text-[10px] sm:text-[11px] leading-tight relative z-10 px-1"
                    style={{ color: earned ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.15)" }}
                >
                    {badge.description}
                </p>
            </m.div>
        </div>
    );
});
BadgeCard.displayName = "BadgeCard";

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

                {/* ── AI PARTNER SECTION ─────────────────── */}
                {!quizCompleted ? (
                    <m.div variants={itemVariants} className="space-y-4">
                        <div className="flex items-center justify-between px-1">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <Sparkles size={18} className="text-purple-400" />
                                התאמה אישית
                            </h2>
                        </div>

                        <m.div 
                            whileHover={{ scale: 1.01 }}
                            onClick={() => {
                                haptics.impact("medium");
                                router.push("/quiz");
                            }}
                            className="relative group rounded-[32px] overflow-hidden shadow-2xl cursor-pointer border border-white/5 hover:border-purple-500/30 transition-all duration-500"
                        >
                            <div className="absolute inset-0 transition-opacity duration-700 opacity-20 group-hover:opacity-40"
                                 style={{ 
                                    background: `linear-gradient(135deg, #A855F7 0%, #6366F1 100%)`,
                                    boxShadow: `inset 0 0 100px rgba(168, 85, 247, 0.4)`
                                 }} />
                            
                            <div className="glass-panel p-8 flex flex-col items-center text-center relative z-10 border-white/5">
                                <div className="w-20 h-20 rounded-[24px] bg-purple-500/10 flex items-center justify-center mb-6 border border-purple-500/20 shadow-lg group-hover:scale-110 transition-transform duration-500">
                                    <Sparkles className="w-10 h-10 text-purple-400" />
                                </div>
                                
                                <h3 className="text-2xl font-black text-white mb-2 tracking-tight">גלה את הסטאק שלך</h3>
                                <p className="text-sm text-zinc-400 leading-relaxed font-medium mb-6 max-w-sm">
                                    ענה על כמה שאלות קצרות ונתאים לך את כלי ה-AI המדויקים ביותר לצרכים שלך.
                                </p>
                                
                                <div className="w-full h-14 bg-white text-black font-black text-sm rounded-2xl flex items-center justify-center gap-2 group-hover:bg-zinc-200 transition-colors shadow-xl">
                                    התחל אפיון עכשיו
                                    <ChevronLeft size={18} className="rotate-180" />
                                </div>
                            </div>
                        </m.div>
                    </m.div>
                ) : primaryModel && (
                    <m.div variants={itemVariants} className="space-y-4">
                        <div className="flex items-center justify-between px-1">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <Sparkles size={18} className="text-indigo-400" />
                                השותף שלך לבינה מלאכותית
                            </h2>
                            <button
                                onClick={() => {
                                    haptics.impact("light");
                                    setShowResetModal(true);
                                }}
                                className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
                            >
                                התאמה מחדש
                                <ChevronLeft size={14} />
                            </button>
                        </div>

                        <m.div 
                            whileHover={{ scale: 1.01 }}
                            className="relative group rounded-[32px] overflow-hidden shadow-2xl"
                        >
                            <div className="absolute inset-0 transition-opacity duration-700 opacity-40 group-hover:opacity-60"
                                 style={{ 
                                    background: `linear-gradient(135deg, ${theme.primary}55 0%, ${theme.secondary}33 100%)`,
                                    boxShadow: `inset 0 0 100px ${theme.glow}`
                                 }} />
                            
                            <div className="glass-panel p-6 md:p-8 flex items-center gap-6 relative z-10 border-white/10">
                                <div className="relative shrink-0">
                                    <div className="absolute -inset-4 blur-3xl opacity-40 group-hover:opacity-80 transition-opacity duration-500" 
                                         style={{ backgroundColor: theme.primary }} />
                                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-zinc-950/60 backdrop-blur-2xl border border-white/10 flex items-center justify-center p-4 relative z-10 overflow-hidden shadow-2xl transition-all duration-700 group-hover:scale-105 group-hover:-rotate-3 group-hover:border-white/20">
                                        <Image
                                            src={theme.icon}
                                            alt={theme.label}
                                            width={80}
                                            height={80}
                                            className="w-full h-full object-contain drop-shadow-2xl"
                                            priority
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col flex-1">
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <span className="text-xs font-black text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/10">מומלץ עבורך</span>
                                        <div className="h-px flex-1 bg-white/10" />
                                    </div>
                                    <h3 className="text-2xl md:text-3xl font-black text-white mb-2 tracking-tight">
                                        {theme.label}
                                    </h3>
                                    <p className="text-sm text-zinc-200 leading-relaxed font-medium">
                                        {theme.description}
                                    </p>
                                    {primaryModelReason && (
                                        <p className="text-[11px] text-zinc-500 mt-3 italic bg-black/30 p-2.5 rounded-xl border border-white/5 backdrop-blur-sm">
                                            "{primaryModelReason}"
                                        </p>
                                    )}
                                </div>
                            </div>
                        </m.div>
                    </m.div>
                )}

                {/* ── THE VAULT DIRECT GRID ───────────────────── */}
                <m.div variants={itemVariants} className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <h2 className="text-lg font-bold text-white flex items-center gap-3">
                            <BookOpen size={18} className="text-indigo-400" />
                            אוסף קלפים
                            <span className="bg-indigo-500/20 text-indigo-400 text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider border border-indigo-500/20 shadow-lg">
                                BETA
                            </span>
                        </h2>
                        <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                            {state.badges.length} / {BADGES.length} קלפים
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
                        {BADGES.map((badge) => {
                            const earned = isBadgeEarned(badge.id, state);
                            
                            return (
                                <BadgeCard
                                    key={badge.id}
                                    badge={badge}
                                    earned={earned}
                                    onClick={() => {
                                        if (earned) {
                                            haptics.tap();
                                            router.push(`/vault/${badge.id}?from=profile`);
                                        }
                                    }}
                                />
                            );
                        })}
                    </div>
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

            <style jsx global>{`
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                
                @keyframes cardShimmerDrift {
                    0%   { transform: translate(-18%, -22%) rotate(0deg);   opacity: 0.7; }
                    25%  { transform: translate(18%, -14%) rotate(90deg);   opacity: 1;   }
                    50%  { transform: translate(14%, 18%)  rotate(180deg);  opacity: 0.75; }
                    75%  { transform: translate(-14%, 14%) rotate(270deg);  opacity: 1;   }
                    100% { transform: translate(-18%, -22%) rotate(360deg); opacity: 0.7; }
                }
                .card-shimmer-blob {
                    animation: cardShimmerDrift 7s infinite ease-in-out;
                }
            `}</style>
        </div>
    );
}


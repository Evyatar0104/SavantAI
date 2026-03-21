"use client";

import { useSavantStore } from "@/store/useSavantStore";
import { m, Variants } from "framer-motion";
import { Trophy, Flame, BookOpen, Lock, Activity } from "lucide-react";

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 260, damping: 20 }
    }
};

export default function Profile() {
    const xp = useSavantStore(state => state.xp);
    const streak = useSavantStore(state => state.streak);
    const completedLessons = useSavantStore(state => state.completedLessons);

    return (
        <div className="p-6 md:p-12 pt-16 md:pt-24 flex flex-col pb-32 max-w-6xl mx-auto w-full relative">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 right-0 w-[40%] h-[30%] bg-blue-500/10 dark:bg-blue-600/10 blur-[120px] pointer-events-none rounded-full" />
            <div className="absolute bottom-40 left-0 w-[40%] h-[30%] bg-indigo-500/10 dark:bg-indigo-600/10 blur-[120px] pointer-events-none rounded-full" />

            {/* Header Section */}
            <m.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="flex items-center space-x-6 md:space-x-10 space-x-reverse mb-16 relative z-10"
            >
                <div className="relative group">
                    <m.div
                        animate={{ scale: [1, 1.05, 1], rotate: [0, 5, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-indigo-600 blur-2xl opacity-40 group-hover:opacity-60 transition-opacity"
                    />
                    <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-700 flex items-center justify-center text-5xl md:text-6xl shadow-2xl ring-8 ring-white/10 border-4 border-white/20 transition-transform group-hover:scale-105 duration-500 overflow-hidden">
                        <div className="absolute inset-0 bg-white/10 mix-blend-overlay"></div>
                        <span className="drop-shadow-xl">🧑‍🎓</span>
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 rounded-full border-4 border-background flex items-center justify-center shadow-lg">
                        <div className="w-4 h-4 rounded-full bg-white animate-pulse"></div>
                    </div>
                </div>

                <div className="flex flex-col">
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground mb-2">לומד/ת</h1>
                    <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/20 rounded-full text-xs md:text-sm font-black uppercase tracking-widest flex items-center gap-2">
                            סקרנ/ית מתחיל/ה
                        </span>
                        <span className="text-zinc-400 dark:text-zinc-500 font-bold text-sm tracking-tight flex items-center gap-1.5">
                            <Activity className="w-4 h-4" /> פעיל/ה עכשיו
                        </span>
                    </div>
                </div>
            </m.div>

            {/* Stats Grid */}
            <m.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="relative z-10"
            >
                <div className="flex items-baseline justify-between mb-8">
                    <h2 className="text-2xl md:text-3xl font-black tracking-tight flex items-center gap-3">
                        סטטיסטיקה אישית
                        <div className="h-1 w-12 bg-gradient-to-r from-blue-500 to-transparent rounded-full opacity-50"></div>
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                    <m.div variants={itemVariants} className="glass-panel p-8 rounded-[40px] relative overflow-hidden group hover:-translate-y-2 transition-all duration-300">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 blur-3xl -mr-16 -mt-16 group-hover:bg-orange-500/20 transition-colors"></div>
                        <div className="text-orange-500 text-xs md:text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                            <div className="p-2 bg-orange-500/10 rounded-xl"><Flame className="w-5 h-5" /></div>
                            רצף ימים
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-6xl md:text-7xl font-black text-foreground tracking-tighter">{streak}</span>
                            <span className="text-zinc-500 font-bold text-lg">ימים</span>
                        </div>
                    </m.div>

                    <m.div variants={itemVariants} className="glass-panel p-8 rounded-[40px] relative overflow-hidden group hover:-translate-y-2 transition-all duration-300">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 blur-3xl -mr-16 -mt-16 group-hover:bg-yellow-500/20 transition-colors"></div>
                        <div className="text-yellow-500 text-xs md:text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                            <div className="p-2 bg-yellow-500/10 rounded-xl"><Trophy className="w-5 h-5" /></div>
                            סך הכל XP
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-6xl md:text-7xl font-black text-foreground tracking-tighter">{xp}</span>
                            <span className="text-zinc-500 font-bold text-lg">נקודות</span>
                        </div>
                    </m.div>

                    <m.div variants={itemVariants} className="glass-panel p-8 rounded-[40px] relative overflow-hidden group hover:-translate-y-2 transition-all duration-300 sm:col-span-2 lg:col-span-1">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl -mr-16 -mt-16 group-hover:bg-blue-500/20 transition-colors"></div>
                        <div className="text-blue-500 text-xs md:text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                            <div className="p-2 bg-blue-500/10 rounded-xl"><BookOpen className="w-5 h-5" /></div>
                            שיעורים
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-6xl md:text-7xl font-black text-foreground tracking-tighter">{completedLessons.length}</span>
                            <span className="text-zinc-500 font-bold text-lg">הושלמו</span>
                        </div>
                    </m.div>
                </div>

                {/* Badges Section */}
                <div className="mb-8">
                    <h2 className="text-2xl md:text-3xl font-black tracking-tight flex items-center gap-3">
                        תגי מומחיות
                        <div className="h-1 w-12 bg-gradient-to-r from-blue-500 to-transparent rounded-full opacity-50"></div>
                    </h2>
                </div>

                <m.div variants={itemVariants} className="glass-panel rounded-[40px] p-12 md:p-20 text-center relative overflow-hidden border-dashed border-2 border-zinc-200 dark:border-zinc-800 flex flex-col items-center justify-center bg-zinc-500/5 dark:bg-zinc-100/5 min-h-[300px] group">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-blue-500/5 pointer-events-none"></div>

                    <div className="w-24 h-24 md:w-28 md:h-28 rounded-3xl bg-zinc-200/30 dark:bg-zinc-800/30 flex items-center justify-center mb-8 backdrop-blur-xl relative transition-transform duration-700 group-hover:scale-110 group-hover:rotate-12 border border-white/10">
                        <div className="absolute inset-0 rounded-3xl bg-white/20 mix-blend-overlay"></div>
                        <Lock className="w-10 h-10 md:w-12 md:h-12 text-zinc-400 dark:text-zinc-600 drop-shadow-sm" />
                    </div>

                    <p className="font-extrabold tracking-tight text-xl md:text-2xl text-zinc-600 dark:text-zinc-300 max-w-sm">
                        השלם מסלול למידה מלא כדי לזכות בתג הראשון שלך!
                    </p>
                    <p className="mt-4 text-zinc-400 dark:text-zinc-500 font-bold tracking-tight">
                        התגים יוצגו בגאווה בפרופיל הציבורי שלך.
                    </p>
                </m.div>
            </m.div>
        </div>
    );
}


"use client";

import { useSavantStore } from "@/store/useSavantStore";
import { learningPaths } from "@/data/learningPaths";
import { m, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { AchievementCard } from "./AchievementCard";

export function PathCompletionModal() {
    const newlyCompletedPathId = useSavantStore(state => state.newlyCompletedPathId);
    const clearNewlyCompletedPath = useSavantStore(state => state.clearNewlyCompletedPath);
    
    const [path, setPath] = useState(learningPaths.find(p => p.id === newlyCompletedPathId));

    useEffect(() => {
        if (newlyCompletedPathId) {
            const p = learningPaths.find(p => p.id === newlyCompletedPathId);
            setPath(p);
            
            // Full screen celebratory confetti
            const duration = 5 * 1000;
            const animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 200 };

            const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

            const interval = setInterval(function() {
                const timeLeft = animationEnd - Date.now();

                if (timeLeft <= 0) {
                    return clearInterval(interval);
                }

                const particleCount = 50 * (timeLeft / duration);
                confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
                confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
            }, 250);
        }
    }, [newlyCompletedPathId]);

    if (!newlyCompletedPathId || !path) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-2xl p-6 rtl" dir="rtl">
                <m.div
                    initial={{ opacity: 0, scale: 0.8, y: 40 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 40 }}
                    className="w-full max-w-2xl relative"
                >
                    {/* Background Glow */}
                    <div 
                        className="absolute inset-0 blur-[120px] opacity-30 animate-pulse"
                        style={{ backgroundColor: path.color }}
                    />

                    <div className="glass-panel border border-white/20 rounded-[48px] p-10 md:p-16 text-center relative z-10 overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)]">
                        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                            <m.div 
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-white/5 to-transparent rounded-full"
                            />
                        </div>

                        <m.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", delay: 0.2 }}
                            className="flex justify-center mb-10"
                        >
                            <AchievementCard path={path} earned={true} size="lg" />
                        </m.div>

                        <m.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <h2 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tighter">הישג חדש נפתח!</h2>
                            <p className="text-xl md:text-2xl font-bold mb-10" style={{ color: path.color }}>
                                {path.nameHe} מומחה
                            </p>
                            
                            <p className="text-zinc-400 text-lg leading-relaxed mb-12 max-w-md mx-auto">
                                מזל טוב! השלמת את כל הקורסים במסלול זה. עכשיו יש לך את כל הכלים כדי לשלוט ב-AI בתור <span className="text-white font-bold">{path.nameHe}</span>.
                            </p>

                            <div className="flex flex-col gap-4">
                                <m.div 
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.8 }}
                                    className="bg-white/5 border border-white/10 rounded-2xl py-4 px-6 inline-flex items-center justify-center gap-3 mx-auto mb-4"
                                >
                                    <Sparkles className="text-yellow-500 w-6 h-6" />
                                    <span className="text-2xl font-black text-white">+500 XP בונוס מסלול</span>
                                </m.div>

                                <button
                                    onClick={clearNewlyCompletedPath}
                                    className="bg-white text-black py-5 px-12 rounded-full font-black text-xl shadow-2xl hover:bg-zinc-200 transition-all active:scale-95 flex items-center justify-center gap-3 mx-auto"
                                >
                                    מדהים, המשך ללמוד
                                    <ArrowLeft className="w-6 h-6 rotate-180" />
                                </button>
                            </div>
                        </m.div>
                    </div>
                </m.div>
            </div>
        </AnimatePresence>
    );
}

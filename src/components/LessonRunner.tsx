"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { m, AnimatePresence, useMotionValue, useMotionTemplate } from "framer-motion";
import { LESSONS } from "@/data/lessons";
import { useSavantStore } from "@/store/useSavantStore";
import { X, ArrowLeft, ArrowRight, Zap, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { LessonProvider, useLesson } from "@/context/LessonContext";
import { QuizEngine } from "@/components/QuizEngine";
import { HighlightedText } from "@/components/HighlightedText";
import { AnimatedGradient } from "@/components/AnimatedGradient";

interface Props {
    lessonId: string;
}

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
};

// IconPatternBackground and PatternGrid moved to shared component IconPatternBackground.tsx

// Extracted internal component to use context
function LessonContent({ lesson }: { lesson: any }) {
    const router = useRouter();
    const { currentPulse, maxPulses, nextPulse, prevPulse } = useLesson();

    const addXp = useSavantStore(state => state.addXp);
    const completeLesson = useSavantStore(state => state.completeLesson);
    const checkStreak = useSavantStore(state => state.checkStreak);
    const unlockAITrack = useSavantStore(state => state.unlockAITrack);

    const [step, setStep] = useState<"story" | "quiz" | "model-selector" | "summary">("story");
    const [earnedXp, setEarnedXp] = useState(0);
    const [correctCount, setCorrectCount] = useState(0);

    const handleSwipe = (direction: number) => {
        if (step !== "story") return;
        // direction > 0 means swiped left (so in RTL, go backwards)
        // direction < 0 means swiped right (so in RTL, go forwards)
        if (direction < 0) {
            if (currentPulse < maxPulses - 1) {
                nextPulse();
            } else {
                setStep("quiz");
            }
        } else if (direction > 0) {
            prevPulse();
        }
    };

    const handleQuizComplete = (finalXp: number, correct: number) => {
        let readingXp = 10; // Base reading XP
        setEarnedXp(finalXp + readingXp);
        setCorrectCount(correct);

        if (lesson.id === "ai-p0-07") {
            setStep("model-selector");
        } else {
            addXp(finalXp + readingXp);
            completeLesson(lesson.id);
            checkStreak();
            setStep("summary");
        }
    };

    const handleModelSelect = (trackId: string) => {
        unlockAITrack(trackId);
        
        // Grant XP and finish lesson 07
        addXp(earnedXp);
        completeLesson(lesson.id);
        checkStreak();
        
        setStep("summary");
    };

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (step !== "story") return;
        
        // Don't trigger if user is typing in an input (though there are none here right now)
        if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

        if (e.key === "ArrowLeft") {
            // In RTL, left arrow means go forward (next)
            handleSwipe(-1);
        } else if (e.key === "ArrowRight") {
            // In RTL, right arrow means go backward (prev)
            handleSwipe(1);
        } else if (e.key === " " || e.key === "Enter") {
            // Space or Enter proceed to next
            e.preventDefault();
            handleSwipe(-1);
        }
    }, [step, currentPulse, maxPulses, nextPulse]);

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleKeyDown]);

    const trackLessons = LESSONS.filter(l => l.trackId === lesson.trackId);
    const currentIndex = trackLessons.findIndex(l => l.id === lesson.id);
    const nextLesson = currentIndex !== -1 && currentIndex < trackLessons.length - 1 ? trackLessons[currentIndex + 1] : null;

    // High-end track themes
    const themes: Record<string, { accent: string; bg: string; shadow: string }> = {
        default: { accent: "#10b981", bg: "#0F1A14", shadow: "rgba(16, 185, 129, 0.3)" },
        ai:      { accent: "#00C48C", bg: "#0F1A14", shadow: "rgba(0, 196, 140, 0.3)" },
        ta:      { accent: "#E8845A", bg: "#1A0F0A", shadow: "rgba(232, 132, 90, 0.3)" },
        tb:      { accent: "#8B74E8", bg: "#0F0A1A", shadow: "rgba(139, 116, 232, 0.3)" },
        tc:      { accent: "#4A9EE8", bg: "#0A0F1A", shadow: "rgba(74, 158, 232, 0.3)" },
    };

    let activeTheme = themes.ai;
    if (lesson.id.startsWith("ai-ta-")) activeTheme = themes.ta;
    else if (lesson.id.startsWith("ai-tb-")) activeTheme = themes.tb;
    else if (lesson.id.startsWith("ai-tc-")) activeTheme = themes.tc;
    else if (lesson.trackId && themes[lesson.trackId]) activeTheme = themes[lesson.trackId];

    // Define the pulse content
    const pulses = [
        {
            type: "hook",
            content: (
                <div className="flex flex-col h-full relative overflow-hidden" style={{
                    background: `radial-gradient(circle at 50% 30%, ${activeTheme.bg} 0%, #050510 100%)`
                }}>
                    <AnimatedGradient color={activeTheme.accent} backgroundColor={activeTheme.bg} />
                    
                    <div className="flex-1 flex flex-col justify-center items-center px-8 md:px-12 text-center relative z-10 pt-16 md:pt-0">
                        
                        <m.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            className="max-w-xl mx-auto w-full mb-12"
                        >
                            <h2 className="text-[36px] md:text-5xl lg:text-6xl font-bold leading-[1.15] text-white balance break-words whitespace-pre-wrap tracking-tight drop-shadow-2xl">
                                {lesson.hook || lesson.description}
                            </h2>
                        </m.div>
                        
                        <m.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 2, delay: 0.6 }}
                            className="w-full max-w-[240px] mx-auto flex flex-col items-center"
                        >
                            <div className="h-px bg-white/20 w-full mb-6" />
                            <div className="text-zinc-300 font-bold text-xs md:text-sm uppercase tracking-[0.2em] opacity-90 drop-shadow-md">
                                שיעור {currentIndex + 1} &middot; {lesson.title}
                            </div>
                        </m.div>
                    </div>

                    <m.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="mt-auto pb-12 max-w-sm mx-auto w-full px-6 flex flex-col gap-6"
                    >
                        <m.button 
                            whileTap={{ scale: 0.96 }}
                            whileHover={{ y: -2, scale: 1.02 }}
                            onClick={() => handleSwipe(-1)} 
                            className="relative w-full py-5 rounded-full font-bold text-lg md:text-xl transition-all shadow-2xl overflow-hidden group"
                        >
                            {/* Liquid Glass Overlay */}
                            <div className="absolute inset-0 bg-white/5 backdrop-blur-2xl" />
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-white/5 opacity-40" />
                            <div className="absolute inset-px rounded-full border border-white/20 pointer-events-none" />
                            <div className="absolute -inset-[100%] bg-gradient-to-r from-transparent via-white/10 to-transparent rotate-[35deg] translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
                            
                            <span className="relative z-10" style={{ color: activeTheme.accent }}>
                                המשך
                            </span>
                        </m.button>
                        <div className="text-zinc-400 text-xs font-bold uppercase tracking-[0.1em] text-center drop-shadow-lg">
                            &larr; החלק להמשך
                        </div>
                    </m.div>
                </div>
            )
        },
        {
            type: "science-a",
            content: (
                <div className="flex flex-col h-full px-6 pt-8 md:pt-16 pb-4 overflow-y-auto no-scrollbar relative" style={{
                    background: `linear-gradient(to bottom, ${activeTheme.bg} 0%, #050510 100%)`
                }}>
                    <div className="flex-1 max-w-3xl mx-auto w-full flex flex-col pt-4">
                        <h2 className="text-sm md:text-base font-bold mb-4 uppercase tracking-[0.2em] font-sans" style={{ color: activeTheme.accent }}>המדע</h2>
                        
                        {lesson.tldr && (
                            <div className="rounded-2xl p-5 mb-8 relative border font-sans" style={{ backgroundColor: "#0F1A14", borderColor: `${activeTheme.accent}33` }}>
                                <div className="absolute top-4 right-4 text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: activeTheme.accent, color: "#fff" }}>בקצרה</div>
                                <h3 className="text-lg md:text-xl font-bold text-white mt-1 pr-14 leading-snug">{lesson.tldr}</h3>
                            </div>
                        )}

                        <div className="h-px w-full bg-white/10 mb-8" />
                        
                        <div className="text-zinc-300 leading-[1.8] font-serif tracking-wide relative max-w-[680px] mx-auto text-right w-full text-[17px] md:text-[18px]">
                            <HighlightedText text={lesson.scienceA || lesson.readContent || ""} />
                        </div>
                    </div>
                    <div className="mt-8 pt-4 pb-4 border-t border-white/10 md:pb-0 max-w-md mx-auto w-full md:mt-12 flex gap-3">
                        <m.button 
                            whileTap={{ scale: 0.95 }} 
                            onClick={() => prevPulse()} 
                            className="w-16 h-14 md:h-16 flex items-center justify-center rounded-2xl border transition-all"
                            style={{ 
                                backgroundColor: `${activeTheme.accent}05`, 
                                color: activeTheme.accent,
                                border: `1px solid ${activeTheme.accent}22`
                            }}
                        >
                            <ArrowRight className="w-6 h-6" />
                        </m.button>
                        <m.button 
                            whileTap={{ scale: 0.95 }} 
                            onClick={() => handleSwipe(-1)} 
                            className="flex-1 py-4 rounded-2xl font-bold text-lg md:text-xl border transition-all"
                            style={{ 
                                backgroundColor: `${activeTheme.accent}15`, 
                                color: activeTheme.accent,
                                border: `1px solid ${activeTheme.accent}44`
                            }}
                        >
                            המשך &larr;
                        </m.button>
                    </div>
                </div>
            )
        },
        {
            type: "science-b",
            content: (
                <div className="flex flex-col h-full px-6 pt-8 md:pt-16 pb-4 overflow-y-auto no-scrollbar relative" style={{
                    background: `linear-gradient(to bottom, ${activeTheme.bg} 0%, #050510 100%)`
                }}>
                    <div className="flex-1 max-w-3xl mx-auto w-full flex flex-col pt-4">
                        <h2 className="text-sm md:text-base font-bold mb-8 uppercase tracking-[0.2em] font-sans" style={{ color: activeTheme.accent }}>המדע — המשך</h2>
                        
                        <div className="text-zinc-300 leading-[1.8] font-serif tracking-wide relative max-w-[680px] mx-auto text-right w-full text-[17px] md:text-[18px]">
                            <HighlightedText text={lesson.scienceB || ""} />
                        </div>
                        
                        {lesson.pullQuote && (
                            <>
                                <div className="h-px w-full bg-white/10 my-8" />
                                <div className="rounded-2xl p-6 md:p-8 relative font-serif" style={{ backgroundColor: "#0F1A14" }}>
                                    <div className="absolute -top-4 right-4 text-7xl opacity-40 font-serif leading-none" style={{ color: activeTheme.accent }}>"</div>
                                    <h3 className="text-[18px] md:text-xl italic text-white leading-relaxed mt-2 relative z-10 font-medium">
                                        {lesson.pullQuote}
                                    </h3>
                                </div>
                            </>
                        )}
                    </div>
                    <div className="mt-8 pt-4 pb-4 border-t border-white/10 md:pb-0 max-w-md mx-auto w-full md:mt-12 flex gap-3">
                        <m.button 
                            whileTap={{ scale: 0.95 }} 
                            onClick={() => prevPulse()} 
                            className="w-16 h-14 md:h-16 flex items-center justify-center rounded-2xl border transition-all"
                            style={{ 
                                backgroundColor: `${activeTheme.accent}05`, 
                                color: activeTheme.accent,
                                border: `1px solid ${activeTheme.accent}22`
                            }}
                        >
                            <ArrowRight className="w-6 h-6" />
                        </m.button>
                        <m.button 
                            whileTap={{ scale: 0.95 }} 
                            onClick={() => handleSwipe(-1)} 
                            className="flex-1 py-4 rounded-2xl font-bold text-lg md:text-xl border transition-all"
                            style={{ 
                                backgroundColor: `${activeTheme.accent}15`, 
                                color: activeTheme.accent,
                                border: `1px solid ${activeTheme.accent}44`
                            }}
                        >
                            הבנתי &larr;
                        </m.button>
                    </div>
                </div>
            )
        },
        {
            type: "insight",
            content: (
                <div className="flex flex-col h-full relative overflow-hidden" style={{
                    background: `radial-gradient(circle at 50% 30%, ${activeTheme.bg} 0%, #050510 100%)`
                }}>
                    <AnimatedGradient color={activeTheme.accent} backgroundColor={activeTheme.bg} />
                    
                    <div className="flex-1 flex flex-col justify-center items-center px-8 md:px-12 text-center relative z-10 pt-16 md:pt-0">
                        
                        <m.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            className="max-w-2xl mx-auto w-full mb-12"
                        >
                            <h2 className="text-[32px] md:text-4xl lg:text-5xl font-bold leading-[1.15] text-white balance break-words whitespace-pre-wrap tracking-tight drop-shadow-2xl font-serif">
                                "{lesson.insight}"
                            </h2>
                        </m.div>
                        
                        {/* Tagline removed */}
                    </div>

                    <m.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="mt-auto pb-12 max-w-sm mx-auto w-full px-6 flex gap-4"
                    >
                        <m.button 
                            whileTap={{ scale: 0.96 }}
                            onClick={() => prevPulse()} 
                            className="w-20 h-[68px] rounded-full flex items-center justify-center relative overflow-hidden group shadow-2xl"
                        >
                             <div className="absolute inset-0 bg-white/5 backdrop-blur-2xl" />
                             <div className="absolute inset-px rounded-full border border-white/20 pointer-events-none" />
                             <ArrowRight className="relative z-10 w-6 h-6" style={{ color: activeTheme.accent }} />
                        </m.button>
                        <m.button 
                            whileTap={{ scale: 0.96 }}
                            whileHover={{ y: -2, scale: 1.02 }}
                            onClick={() => handleSwipe(-1)} 
                            className="relative flex-1 py-5 rounded-full font-bold text-lg md:text-xl transition-all shadow-2xl overflow-hidden group"
                        >
                            {/* Liquid Glass Overlay */}
                            <div className="absolute inset-0 bg-white/5 backdrop-blur-2xl" />
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-white/5 opacity-40" />
                            <div className="absolute inset-px rounded-full border border-white/20 pointer-events-none" />
                            <div className="absolute -inset-[100%] bg-gradient-to-r from-transparent via-white/10 to-transparent rotate-[35deg] translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
                            
                            <span className="relative z-10" style={{ color: activeTheme.accent }}>
                                למבחן
                            </span>
                        </m.button>
                    </m.div>
                </div>
            )
        }
    ];

    return (
        <div className="fixed inset-0 z-[200] bg-zinc-950 text-white flex flex-col overflow-hidden dark" dir="rtl">
            <div className="relative w-full h-[100dvh] overflow-hidden flex flex-col transition-all duration-500 ease-in-out">

                {/* Progress Indicators */}
                <div className="relative flex items-center justify-between p-4 px-6 z-50 w-full pt-[env(safe-area-inset-top)] mt-2 md:mt-4 md:px-10">
                    <div className="flex items-center gap-3">
                        <button onClick={() => router.back()} className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-md">
                            <X className="w-5 h-5 text-white" />
                        </button>
                        {(currentPulse > 0 || step === "quiz") && step !== "summary" && step !== "model-selector" && (
                            <m.button 
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                onClick={() => {
                                    if (step === "quiz") setStep("story");
                                    else prevPulse();
                                }} 
                                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-md"
                            >
                                <ArrowRight className="w-5 h-5 text-white" />
                            </m.button>
                        )}
                    </div>
                    <div className="flex space-x-1.5 flex-1 mx-6">
                        {[0, 1, 2, 3, 4].map((i) => {
                            const isAtOrPast = step === "story" ? currentPulse >= i : true;
                            const isPast = step === "story" ? currentPulse > i : i < 4;
                            
                            return (
                                <div
                                    key={i}
                                    className="h-1.5 flex-1 rounded-full transition-all duration-500"
                                    style={{
                                        backgroundColor: isAtOrPast ? activeTheme.accent : "rgba(255,255,255,0.1)",
                                        opacity: isPast ? 0.5 : 1
                                    }}
                                />
                            );
                        })}
                    </div>
                    <div className="w-10 text-xs font-bold text-zinc-500 text-center tracking-widest tabular-nums font-sans">
                        {step === "story" ? `${currentPulse + 1}/5` : "5/5"}
                    </div>
                </div>

                <div className="relative flex-1 w-full z-10 overflow-hidden">
                    <AnimatePresence initial={false} mode="wait">
                        {step === "story" && (
                            <m.div
                                key={`pulse-${currentPulse}`}
                                initial={{ opacity: 0, scale: 0.95, x: 50 }}
                                animate={{ opacity: 1, scale: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.95, x: -50 }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                drag="x"
                                dragConstraints={{ left: 0, right: 0 }}
                                dragDirectionLock
                                dragElastic={1}
                                onDragEnd={(e, { offset, velocity }) => {
                                    const swipe = swipePower(offset.x, velocity.x);
                                    if (swipe < -swipeConfidenceThreshold) {
                                        handleSwipe(-1); // swipe right
                                    } else if (swipe > swipeConfidenceThreshold) {
                                        handleSwipe(1); // swipe left
                                    }
                                }}
                                className="absolute inset-0 w-full h-full"
                            >
                                {pulses[currentPulse].content}
                            </m.div>
                        )}

                        {step === "quiz" && (
                            <m.div
                                key="quiz"
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                className="absolute inset-0 w-full h-full"
                            >
                                <QuizEngine 
                                    questions={lesson.questions} 
                                    onComplete={handleQuizComplete}
                                    accentColor={activeTheme.accent}
                                    icon={lesson.icon || "⚡"}
                                    backgroundColor={activeTheme.bg}
                                />
                            </m.div>
                        )}

                        {step === "model-selector" && (
                            <m.div
                                key="model-selector"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="absolute inset-0 p-6 flex flex-col justify-center items-center text-center pb-24 overflow-y-auto"
                            >
                                <m.h2 
                                    initial={{ y: -20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    className="text-3xl md:text-5xl font-bold mb-4 text-white"
                                >
                                    בחר את הנתיב שלך
                                </m.h2>
                                <m.p 
                                    initial={{ y: -20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.1 }}
                                    className="text-zinc-400 mb-8 md:mb-12 text-lg"
                                >
                                    השלמת את שלב היסודות. באיזה מודל תרצה להתמחות תחילה?
                                </m.p>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mx-auto">
                                    <m.button 
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        whileTap={{ scale: 0.95 }} 
                                        onClick={() => handleModelSelect("ta")} 
                                        className="p-8 rounded-[32px] bg-zinc-900/50 border border-white/10 hover:bg-zinc-800 hover:border-emerald-500 hover:-translate-y-2 hover:shadow-2xl transition-all flex flex-col items-center group"
                                    >
                                        <div className="w-20 h-20 rounded-[24px] bg-emerald-500/10 flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition-transform">🏛️</div>
                                        <h3 className="text-xl md:text-2xl font-bold text-white mb-2">Claude</h3>
                                        <p className="text-sm md:text-base text-zinc-400">חשיבה עמוקה רציפה</p>
                                    </m.button>
                                    <m.button 
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                        whileTap={{ scale: 0.95 }} 
                                        onClick={() => handleModelSelect("tb")} 
                                        className="p-8 rounded-[32px] bg-zinc-900/50 border border-white/10 hover:bg-zinc-800 hover:border-emerald-500 hover:-translate-y-2 hover:shadow-2xl transition-all flex flex-col items-center group"
                                    >
                                        <div className="w-20 h-20 rounded-[24px] bg-blue-500/10 flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition-transform">✨</div>
                                        <h3 className="text-xl md:text-2xl font-bold text-white mb-2">ChatGPT</h3>
                                        <p className="text-sm md:text-base text-zinc-400">הסביבה הגמישה ביותר</p>
                                    </m.button>
                                    <m.button 
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 }}
                                        whileTap={{ scale: 0.95 }} 
                                        onClick={() => handleModelSelect("tc")} 
                                        className="p-8 rounded-[32px] bg-zinc-900/50 border border-white/10 hover:bg-zinc-800 hover:border-emerald-500 hover:-translate-y-2 hover:shadow-2xl transition-all flex flex-col items-center group"
                                    >
                                        <div className="w-20 h-20 rounded-[24px] bg-purple-500/10 flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition-transform">🌌</div>
                                        <h3 className="text-xl md:text-2xl font-bold text-white mb-2">Gemini</h3>
                                        <p className="text-sm md:text-base text-zinc-400">יתרון 1M טוקנים רציף</p>
                                    </m.button>
                                </div>
                            </m.div>
                        )}

                        {step === "summary" && (
                            <m.div
                                key="summary"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="absolute inset-0 p-6 flex flex-col justify-center items-center text-center pb-24 overflow-y-auto"
                            >
                                <div className="max-w-xl mx-auto w-full flex flex-col items-center">
                                    <m.div
                                        initial={{ scale: 0.5, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
                                        className="w-32 h-32 md:w-40 md:h-40 rounded-[32px] bg-gradient-to-tr from-emerald-400 to-green-600 flex items-center justify-center mb-8 md:mb-10 shadow-[0_20px_40px_rgba(16,185,129,0.3)] rotate-3"
                                    >
                                        <Trophy className="w-16 h-16 md:w-20 md:h-20 text-white" />
                                    </m.div>
                                    <m.h2
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.3 }}
                                        className="text-4xl md:text-5xl font-bold mb-3 tracking-tight text-white"
                                    >
                                        השיעור הושלם!
                                    </m.h2>
                                    <m.p
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.4 }}
                                        className="text-zinc-400 mb-10 md:mb-12 text-lg md:text-xl font-medium"
                                    >
                                        המוח שלך נעשה חד יותר.
                                    </m.p>

                                    <m.div
                                        initial={{ y: 30, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.5 }}
                                        className="grid grid-cols-2 gap-4 md:gap-6 w-full mb-12"
                                    >
                                        <div className="bg-white/5 p-6 md:p-8 rounded-[24px] flex flex-col items-center justify-center border border-white/10">
                                            <div className="text-zinc-500 text-xs md:text-sm font-bold uppercase tracking-widest mb-2">XP שהושג</div>
                                            <div className="text-4xl md:text-5xl font-black text-emerald-500">+{earnedXp}</div>
                                        </div>
                                        <div className="bg-white/5 p-6 md:p-8 rounded-[24px] flex flex-col items-center justify-center border border-white/10">
                                            <div className="text-zinc-500 text-xs md:text-sm font-bold uppercase tracking-widest mb-2">דיוק</div>
                                            <div className="text-4xl md:text-5xl font-black text-white">
                                                {correctCount}/{lesson.questions.length}
                                            </div>
                                        </div>
                                    </m.div>

                                    <div className="mt-auto w-full pt-8 md:pt-12 space-y-4 max-w-md mx-auto">
                                        <m.button
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => {
                                                const text = `הרגע הפכתי למומחה ב-${lesson.title} ב-Savant! אני כבר עם הרבה נקודות. תעקפו אותי?`;
                                                if (navigator.share) {
                                                    navigator.share({ title: 'Savant', text });
                                                } else {
                                                    navigator.clipboard.writeText(text);
                                                    alert("הועתק ללוח!");
                                                }
                                            }}
                                            className="w-full py-4 rounded-2xl bg-zinc-800 text-white font-semibold text-lg md:text-xl hover:bg-zinc-700 transition-all"
                                        >
                                            שתף הישג 🏆
                                        </m.button>

                                        {nextLesson ? (
                                            <m.button
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => router.push(`/lesson/${nextLesson.id}`)}
                                                className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-lg md:text-xl shadow-[0_8px_32px_rgba(16,185,129,0.3)] transition-all"
                                            >
                                                לשיעור הבא
                                            </m.button>
                                        ) : (
                                            <m.button
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => router.push(`/tracks/${lesson.trackId}`)}
                                                className="w-full py-4 rounded-2xl bg-white text-black font-semibold text-lg md:text-xl transition-all"
                                            >
                                                חזור למסלול
                                            </m.button>
                                        )}
                                    </div>
                                </div>
                            </m.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Navigation Hint */}
                {step === "story" && currentPulse > 0 && (
                    <div className="absolute inset-y-0 right-0 w-16 z-20 flex items-center justify-center pointer-events-none opacity-0 md:opacity-100">
                        <ArrowRight className="text-white/20 w-8 h-8" />
                    </div>
                )}
                {step === "story" && currentPulse > 0 && (
                    <div className="absolute inset-y-0 left-0 w-16 z-20 flex items-center justify-center pointer-events-none opacity-0 md:opacity-100">
                        <ArrowLeft className="text-white/20 w-8 h-8" />
                    </div>
                )}
            </div>
        </div>
    );
}

export function LessonRunner({ lessonId }: Props) {
    const router = useRouter();
    const lesson = LESSONS.find((l) => l.id === lessonId);

    if (!lesson) {
        return (
            <div className="flex flex-col items-center justify-center p-6 min-h-[100dvh] bg-background">
                <h2 className="text-xl font-bold mb-4 text-white">השיעור לא נמצא</h2>
                <button className="px-4 py-2 bg-emerald-500 text-white rounded-full font-semibold" onClick={() => router.back()}>חזור</button>
            </div>
        );
    }

    return (
        <LessonProvider maxPulses={4}>
            <LessonContent lesson={lesson} />
        </LessonProvider>
    );
}

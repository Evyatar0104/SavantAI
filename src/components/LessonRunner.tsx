"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { m, AnimatePresence } from "framer-motion";
import { LESSON_INDEX, loadLessonById, type Lesson } from "@/content";
import { HighlightedText } from "@/components/HighlightedText";
import { LessonBackground } from "@/components/LessonBackground";
import { LessonProvider, useLesson } from "@/context/LessonContext";
import { useLessonPulses } from "@/hooks/useLessonPulses";
import { getIconTheme } from "@/lib/iconThemes";
import { haptics } from "@/lib/haptics";
import { useSavantStore } from "@/store/useSavantStore";
import { X, ArrowRight } from "lucide-react";

const LessonGraphic = dynamic(() => import("@/components/LessonGraphic"), { ssr: false });
const QuizEngine = dynamic(() => import("@/components/QuizEngine").then((module) => module.QuizEngine), { ssr: false });
const PracticalCall = dynamic(() => import("@/components/PracticalCall").then((module) => module.PracticalCall), { ssr: false });
const Confetti = dynamic(() => import("@/components/feedback/Confetti").then((module) => module.Confetti), { ssr: false });
const XPCounter = dynamic(() => import("@/components/feedback/XPCounter").then((module) => module.XPCounter), { ssr: false });
const BlockLessonRunner = dynamic(() => import("./BlockLessonRunner").then((module) => module.BlockLessonRunner), { ssr: false });

interface Props { lessonId: string; from?: string; }

// ── Main content ─────────────────────────────────────
function LessonContent({ lesson, from }: { lesson: Lesson; from?: string }) {
    const router = useRouter();
    const { maxPulses } = useLesson();

    const hasPracticalCall = !!lesson.practicalCall;
    
    const {
        currentPulse,
        step,
        setStep,
        readProgress,
        setPracticalCallDone,
        prevPulse,
        handleSwipe,
        handleReadScroll,
    } = useLessonPulses({
        maxPulses,
        hasPracticalCall,
        onQuizStart: () => haptics.tap(),
    });

    const exitLesson = () => {
        haptics.tap();
        if (from === 'course') router.push(`/courses/${lesson.courseId}`);
        else router.push('/');
    };

    const addXp = useSavantStore(s => s.addXp);
    const completeLesson = useSavantStore(s => s.completeLesson);
    const checkStreak = useSavantStore(s => s.checkStreak);

    const [earnedXp, setEarnedXp] = useState(0);
    const [showConfetti, setShowConfetti] = useState(false);
    const completedRef = useRef(false);
    const readContainerRef = useRef<HTMLDivElement>(null);

    // Derive theme from icon
    const theme = useMemo(() => getIconTheme(lesson.icon), [lesson.icon]);

    // Course lessons for "next lesson" nav
    const courseLessons = LESSON_INDEX.filter(l => l.courseId === lesson.courseId).sort((a, b) => a.order - b.order);
    const currentIndex = courseLessons.findIndex(l => l.id === lesson.id);
    const nextLesson = currentIndex !== -1 && currentIndex < courseLessons.length - 1 ? courseLessons[currentIndex + 1] : null;

    // Quiz complete
    const handleQuizComplete = (finalXp: number) => {
        const readingXp = 10;
        const total = finalXp + readingXp;
        setEarnedXp(total);

        if (!completedRef.current) {
            completedRef.current = true;
            addXp(total);
            completeLesson(lesson.id);
            checkStreak();
        }

        setStep("complete");
        setShowConfetti(true);
        haptics.complete();
        setTimeout(() => setShowConfetti(false), 3000);
    };

    const pulses = [
        // ─── PULSE 0: HOOK ───────────────────────────
        {
            type: "hook",
            content: (
                <div className="flex flex-col h-full relative overflow-hidden bg-transparent">
                    <div className="flex-1 flex flex-col justify-center items-center px-8 md:px-12 text-center relative z-10">
                        {/* Icon Container with glowing aura */}
                        <div className="relative mb-8 flex items-center justify-center">
                            {/* Glowing halo behind */}
                            <m.div
                                animate={{
                                    scale: [1, 1.15, 1],
                                    opacity: [0.25, 0.45, 0.25],
                                }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                className="absolute w-36 h-36 rounded-full blur-2xl z-0 pointer-events-none"
                                style={{ background: theme.accent, willChange: 'transform' }}
                            />

                            <m.div
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.6, ease: "backOut" }}
                                style={{ fontSize: 68, filter: `drop-shadow(0 0 15px ${theme.accent}40)` }}
                                className="relative z-10 flex items-center justify-center w-24 h-24 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md"
                            >
                                {lesson.icon?.startsWith("@") ? (
                                    <div className="w-16 h-16 relative">
                                        <Image 
                                            src={`/assets/logos/${lesson.icon.substring(1)}`} 
                                            alt="" 
                                            fill 
                                            className="object-contain"
                                        />
                                    </div>
                                ) : (
                                    lesson.icon || "⚡"
                                )}
                            </m.div>
                        </div>

                        {/* Hook text — line-by-line stagger with spring physics */}
                        <div className="max-w-xl mx-auto w-full mb-12">
                            {(lesson.hook || lesson.description || "").split("\n").filter(Boolean).map((line: string, i: number) => (
                                <m.h1
                                    key={i}
                                    initial={{ opacity: 0, y: 30, filter: "blur(4px)" }}
                                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                    transition={{ duration: 0.5, delay: 0.1 * i + 0.2, type: "spring", damping: 15 }}
                                    className="text-[34px] md:text-5xl font-extrabold leading-[1.25] text-white tracking-tight"
                                    style={{ willChange: 'transform' }}
                                >
                                    {line}
                                </m.h1>
                            ))}
                        </div>

                        {/* Metadata in glass pill badge */}
                        <m.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                            className="flex flex-col items-center gap-4"
                        >
                            <div style={{ width: 40, height: 3, borderRadius: 99, background: theme.accent }} />
                            <div className="px-4 py-2 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md shadow-sm">
                                <p style={{ fontSize: 13, opacity: 0.8 }} className="font-semibold text-white tracking-wide">
                                    שיעור {currentIndex + 1} &middot; {lesson.title}
                                </p>
                            </div>
                        </m.div>
                    </div>

                    {/* CTA with ripple halo underglow */}
                    <m.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.8 }}
                        className="pb-16 flex justify-center z-10"
                    >
                        <m.button
                            whileTap={{ scale: 0.96 }}
                            whileHover={{ scale: 1.04, boxShadow: `0 0 25px ${theme.accent}30` }}
                            onClick={() => { haptics.tap(); handleSwipe(-1); }}
                            className="rounded-full font-bold text-[16px] text-black bg-white overflow-hidden relative shadow-xl transition-all duration-300"
                            style={{ width: 220, height: 52, willChange: 'transform' }}
                        >
                            <m.div
                                animate={{ boxShadow: ["0 0 0 0 rgba(255,255,255,0.4)", "0 0 0 12px rgba(255,255,255,0)", "0 0 0 0 rgba(255,255,255,0.4)"] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
                                className="absolute inset-0 rounded-full"
                            />
                            <span className="relative z-10 flex items-center justify-center gap-2 h-full">
                                בואו נתחיל &larr;
                            </span>
                        </m.button>
                    </m.div>
                </div>
            )
        },
        // ─── PULSE 1: READING (scienceA + scienceB) ──
        {
            type: "reading",
            content: (
                <div className="flex flex-col h-full relative bg-transparent">
                    {/* Scroll progress bar with glow */}
                    <div className="absolute top-0 left-0 right-0 z-50 h-[4px] bg-white/5">
                        <div style={{
                            height: 4,
                            background: theme.accent,
                            width: `${readProgress * 100}%`,
                            transition: "width 0.15s linear",
                            borderRadius: "0 2px 2px 0",
                            boxShadow: `0 1px 8px ${theme.accent}`
                        }} />
                    </div>

                    <div
                        ref={readContainerRef}
                        onScroll={handleReadScroll}
                        className="flex-1 overflow-y-auto no-scrollbar pt-8 pb-36 px-6 md:px-8 relative z-10"
                    >
                        <div className="max-w-[680px] mx-auto w-full">
                            {/* TLDR Card - Premium Frosted Slab */}
                            {lesson.tldr && (
                                <m.div 
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, ease: "easeOut" }}
                                    className="backdrop-blur-xl border border-white/5 shadow-2xl relative overflow-hidden transition-all duration-300 hover:scale-[1.01]"
                                    style={{
                                        borderRadius: 20,
                                        borderRight: `4px solid ${theme.accent}`,
                                        background: `linear-gradient(135deg, ${theme.accent}12, rgba(255,255,255,0.02))`,
                                        padding: "20px 24px",
                                        marginBottom: 36,
                                    }}
                                >
                                    <div className="flex items-center mb-2.5">
                                        <span className="font-extrabold text-[11px] px-3 py-1 rounded-full uppercase tracking-wider select-none" style={{
                                            background: `${theme.accent}20`,
                                            color: theme.accent,
                                            border: `0.5px solid ${theme.accent}30`
                                        }}>בקצרה</span>
                                    </div>
                                    <p className="text-[16px] font-semibold leading-[1.8] text-white/95" dir="rtl">
                                        {lesson.tldr}
                                    </p>
                                </m.div>
                            )}

                            {/* Science A with premium font sizing */}
                            <div className="text-[17px] leading-[1.95] text-white/85 font-sans" dir="rtl">
                                <HighlightedText text={lesson.scienceA || lesson.readContent || ""} accentColor={theme.accent} />
                            </div>

                            {/* Lesson Graphic with high shadow */}
                            {lesson.image ? (
                                <m.div
                                    initial={{ opacity: 0, scale: 0.96 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                    className="my-12 flex justify-center"
                                >
                                    <Image
                                        src={lesson.image}
                                        alt={lesson.title}
                                        width={800}
                                        height={600}
                                        className="rounded-[24px] max-w-full h-auto border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.6)]"
                                        loading="lazy"
                                    />
                                </m.div>
                            ) : lesson.diagram ? (
                                <m.div
                                    initial={{ opacity: 0, y: 25 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4 }}
                                    className="my-12 w-full flex justify-center"
                                    dangerouslySetInnerHTML={{ __html: lesson.diagram }}
                                />
                            ) : (
                                <LessonGraphic lessonId={lesson.id} />
                            )}

                            {/* Visual Separator - Center Glow and Emoji Sphere */}
                            {lesson.scienceB && (
                                <div className="relative my-14 flex items-center justify-center">
                                    <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
                                    <div className="absolute w-2 h-2 rounded-full blur-[1px] pointer-events-none" style={{ background: theme.accent }} />
                                    <m.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                                        className="relative z-10 w-12 h-12 flex items-center justify-center rounded-full border border-white/10 backdrop-blur-md shadow-lg"
                                        style={{
                                            background: "rgba(10, 10, 20, 0.8)",
                                            boxShadow: `0 0 15px ${theme.accent}15`
                                        }}
                                    >
                                        <span className="text-xl select-none">{lesson.icon || "⚡"}</span>
                                    </m.div>
                                </div>
                            )}

                            {/* Science B */}
                            {lesson.scienceB && (
                                <div className="text-[17px] leading-[1.95] text-white/85 font-sans" dir="rtl">
                                    <HighlightedText text={lesson.scienceB} accentColor={theme.accent} />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Scroll Assist Hint */}
                    <AnimatePresence>
                    {readProgress < 0.15 && (
                        <m.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0, 0.8, 0], y: [0, 6, 0] }}
                            exit={{ opacity: 0, transition: { duration: 0.25 } }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute bottom-28 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none z-20"
                        >
                            <span className="text-xs text-zinc-500 mb-1">גלול לקריאה</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>
                        </m.div>
                    )}
                    </AnimatePresence>

                    {/* Navigation Bar - Frosted Bottom Sheet */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#03030b] via-[#03030b]/95 to-transparent pt-12 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] px-6 z-25">
                        <div className="max-w-md mx-auto flex gap-4">
                            <m.button
                                whileTap={{ scale: 0.95 }}
                                whileHover={{ scale: 1.05, backgroundColor: `${theme.accent}08` }}
                                onClick={() => prevPulse()}
                                className="w-14 h-14 flex items-center justify-center rounded-2xl transition-all duration-300 border backdrop-blur-md"
                                style={{ border: `1px solid ${theme.accent}20`, color: theme.accent, willChange: 'transform' }}
                            >
                                <ArrowRight className="w-5 h-5" />
                            </m.button>
                            <m.button
                                whileTap={{ scale: 0.95 }}
                                whileHover={{ scale: 1.02, boxShadow: `0 0 20px ${theme.accent}20` }}
                                onClick={() => handleSwipe(-1)}
                                className="flex-1 py-4 rounded-2xl font-bold text-lg transition-all duration-300 border backdrop-blur-md"
                                style={{ background: `${theme.accent}10`, color: theme.accent, border: `1px solid ${theme.accent}35`, willChange: 'transform' }}
                            >
                                המשך &larr;
                            </m.button>
                        </div>
                    </div>
                </div>
            )
        },

        // ─── PULSE 2: PULL QUOTE ─────────────────────
        {
            type: "pullquote",
            content: (
                <div className="flex flex-col h-full relative overflow-hidden bg-transparent">
                    {/* Decorative elegant background quote marks */}
                    <div 
                        className="absolute top-[10%] right-[8%] text-[260px] font-serif leading-none pointer-events-none select-none opacity-[0.07] z-0"
                        style={{ color: theme.accent, fontFamily: 'Georgia, serif' }}
                    >
                        &quot;
                    </div>

                    <div className="flex-1 flex flex-col justify-center items-center px-8 md:px-16 text-center relative z-10">
                        {/* Word-by-word animated quote with blur-in and rise staggered */}
                        <div 
                            className="w-full max-w-xl mx-auto px-4 font-serif leading-relaxed text-center" 
                            style={{ fontSize: "clamp(22px, 3.5vw, 30px)" }}
                            dir="rtl"
                        >
                            {(lesson.pullQuote || "").split(/\s+/).map((word: string, i: number) => (
                                <m.span
                                    key={i}
                                    initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
                                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                    transition={{ delay: i * 0.04, duration: 0.45, type: "spring", damping: 14 }}
                                    className="inline-block text-white/95 font-semibold"
                                    style={{ margin: "0 0.12em", willChange: 'transform' }}
                                >
                                    {word}
                                </m.span>
                            ))}
                        </div>

                        {/* Attribution */}
                        <m.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.6 }}
                            transition={{ delay: ((lesson.pullQuote || "").split(/\s+/).length * 0.04) + 0.3 }}
                            className="text-sm font-semibold tracking-wide text-zinc-300 mt-6"
                        >
                            — {lesson.title}
                        </m.p>
                    </div>

                    {/* Nav Bar with glass capsule styling */}
                    <div className="pb-[calc(2.5rem+env(safe-area-inset-bottom,0px))] flex justify-center gap-4 px-6 z-10">
                        <m.button
                            whileTap={{ scale: 0.96 }}
                            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.05)" }}
                            onClick={() => prevPulse()}
                            className="w-16 h-14 rounded-full flex items-center justify-center border border-white/10 backdrop-blur-md transition-all duration-300"
                            style={{ willChange: 'transform' }}
                        >
                            <ArrowRight className="w-5 h-5" style={{ color: theme.accent }} />
                        </m.button>
                        <m.button
                            whileTap={{ scale: 0.96 }}
                            whileHover={{ scale: 1.02, boxShadow: `0 0 20px ${theme.accent}30` }}
                            onClick={() => handleSwipe(-1)}
                            className="flex-1 max-w-xs py-4 rounded-full font-extrabold text-lg text-black bg-white transition-all duration-300 shadow-xl"
                            style={{ willChange: 'transform' }}
                        >
                            המשך &larr;
                        </m.button>
                    </div>
                </div>
            )
        },

        // ─── PULSE 3: INSIGHT ────────────────────────
        {
            type: "insight",
            content: (
                <div className="flex flex-col h-full relative overflow-hidden px-6 pt-8 md:pt-16 pb-4 bg-transparent">
                    <div className="flex-1 flex flex-col justify-center items-center relative z-10 w-full">
                        <m.div
                            initial={{ opacity: 0, y: 35, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.6, type: "spring", damping: 18 }}
                            className="relative overflow-hidden w-full max-w-[560px] rounded-[24px] border border-white/10 shadow-2xl backdrop-blur-xl px-8 py-10"
                            style={{
                                background: "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
                                boxShadow: `0 20px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1), 0 0 30px ${theme.accent}08`
                            }}
                        >
                            {/* Glowing trace borders */}
                            <div className="absolute top-0 right-0 w-16 h-[2px]" style={{ background: `linear-gradient(to left, ${theme.accent}, transparent)` }} />
                            <div className="absolute top-0 right-0 w-[2px] h-16" style={{ background: `linear-gradient(to bottom, ${theme.accent}, transparent)` }} />

                            {/* Internal pulsing glow source */}
                            <m.div
                                animate={{
                                    scale: [1, 1.25, 1],
                                    opacity: [0.1, 0.22, 0.1],
                                }}
                                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -top-24 -left-24 w-48 h-48 rounded-full blur-3xl pointer-events-none"
                                style={{ background: theme.accent }}
                            />

                            {/* Sweep glare effect */}
                            <m.div
                                animate={{ x: ["-100%", "200%"] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", repeatDelay: 3 }}
                                className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-white/5 to-transparent rotate-[25deg] pointer-events-none"
                            />

                            <div className="flex items-center gap-2 mb-6">
                                <span className="text-xl">💡</span>
                                <span className="font-extrabold tracking-widest text-[11px] uppercase" style={{ color: theme.accent }}>
                                    התובנה המרכזית
                                </span>
                            </div>

                            <p className="text-[20px] font-semibold leading-[1.8] text-white/95" dir="rtl">
                                {lesson.insight}
                            </p>
                        </m.div>
                    </div>

                    {/* Nav Bar with glass and capsule design */}
                    <div className="pb-[calc(2.5rem+env(safe-area-inset-bottom,0px))] max-w-sm mx-auto w-full flex gap-4 z-10">
                        <m.button
                            whileTap={{ scale: 0.96 }}
                            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.05)" }}
                            onClick={() => prevPulse()}
                            className="w-16 h-14 rounded-full flex items-center justify-center border border-white/10 backdrop-blur-md transition-all duration-300"
                            style={{ willChange: 'transform' }}
                        >
                            <ArrowRight className="w-5 h-5" style={{ color: theme.accent }} />
                        </m.button>
                        <m.button
                            whileTap={{ scale: 0.96 }}
                            whileHover={{ scale: 1.02, boxShadow: `0 0 20px ${theme.accent}30` }}
                            onClick={() => handleSwipe(-1)}
                            className="flex-1 py-4 rounded-full font-extrabold text-lg text-black bg-white transition-all duration-300 shadow-xl"
                            style={{ willChange: 'transform' }}
                        >
                            {hasPracticalCall ? "למשימה" : "למבחן"}
                        </m.button>
                    </div>
                </div>
            )
        },

        // ─── PULSE 4: PRACTICAL CALL (conditional) ───
        ...(hasPracticalCall && lesson.practicalCall ? [{
            type: "practical-call",
            content: (
                <PracticalCall
                    task={lesson.practicalCall.task}
                    goal={lesson.practicalCall.goal}
                    tool={lesson.practicalCall.tool}
                    accentColor={theme.accent}
                    courseCta={lesson.courseCta}
                    onDone={() => setPracticalCallDone(true)}
                    onBack={() => prevPulse()}
                    onNext={() => handleSwipe(-1)}
                />
            )
        }] : [])
    ];

    return (
        <div className="fixed inset-0 z-[200] bg-[#0d0f1a] text-white flex flex-col overflow-hidden dark" dir="rtl">
            {showConfetti && <Confetti color={theme.accent} />}

            <div className="relative w-full h-[100dvh] overflow-hidden flex flex-col">
                {/* Ambient Premium background element */}
                <LessonBackground accentColor={theme.accent} bgGlowColor={theme.bgGlow} />

                {/* Progress bar + controls */}
                <div className="relative flex items-center justify-between p-4 px-6 z-50 w-full pt-[env(safe-area-inset-top)] mt-2 md:mt-4 md:px-10">
                    <div className="flex items-center gap-3">
                        <button onClick={exitLesson} aria-label="יציאה מהשיעור" className="flex size-11 items-center justify-center rounded-2xl bg-white/10 hover:bg-white/20">
                            <X className="w-5 h-5 text-white" />
                        </button>
                        {(currentPulse > 0 || step === "quiz") && step !== "complete" && (
                            <m.button
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                onClick={() => {
                                    if (step === "quiz") setStep("story");
                                    else prevPulse();
                                }}
                                aria-label="חזרה לשלב הקודם"
                                className="flex size-11 items-center justify-center rounded-2xl bg-white/10 hover:bg-white/20"
                            >
                                <ArrowRight className="w-5 h-5 text-white" />
                            </m.button>
                        )}
                    </div>

                    {/* Segment progress */}
                    {step !== "complete" && (
                        <div className="flex gap-1.5 flex-1 mx-6">
                            {Array.from({ length: maxPulses + 1 }, (_, i) => {
                                const isCurrent = step === "story" ? currentPulse === i : (step === "quiz" && i === maxPulses);
                                const isPast = step === "story" ? currentPulse > i : i < maxPulses;
                                return (
                                    <div
                                        key={i}
                                        className="h-[6px] flex-1 rounded-full relative overflow-hidden backdrop-blur-xs border transition-all duration-500"
                                        style={{
                                            backgroundColor: isPast ? `${theme.accent}cc` : "rgba(255,255,255,0.06)",
                                            borderColor: isPast ? `${theme.accent}30` : isCurrent ? `${theme.accent}50` : "rgba(255,255,255,0.05)",
                                            boxShadow: isCurrent ? `0 0 12px ${theme.accent}30` : "none",
                                        }}
                                    >
                                        {isCurrent && (
                                            <m.div
                                                className="absolute inset-0 rounded-full"
                                                style={{ backgroundColor: theme.accent, willChange: 'transform' }}
                                                initial={{ x: "-100%" }}
                                                animate={{ x: "0%" }}
                                                transition={{ type: "spring", stiffness: 80, damping: 15 }}
                                            />
                                        )}
                                        {isCurrent && (
                                            <m.div
                                                className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none"
                                                animate={{ x: ["-100%", "200%"] }}
                                                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                            />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {step !== "complete" && (
                        <div className="w-10 text-xs font-bold text-zinc-500 text-center tracking-widest tabular-nums">
                            {step === "story" ? `${currentPulse + 1}/${maxPulses + 1}` : `${maxPulses + 1}/${maxPulses + 1}`}
                        </div>
                    )}
                </div>

                {/* Content area */}
                <div className="relative flex-1 w-full z-10 overflow-hidden">
                    <AnimatePresence initial={false} mode="wait">
                        {step === "story" && (
                            <m.div
                                key={`pulse-${currentPulse}`}
                                initial={{ opacity: 0, scale: 0.95, x: 50 }}
                                animate={{ opacity: 1, scale: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.95, x: -50 }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                className="absolute inset-0 w-full h-full"
                                style={{ willChange: 'transform' }}
                            >
                                {pulses[currentPulse]?.content}
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
                                    questions={lesson.questions || []}
                                    onComplete={handleQuizComplete}
                                    accentColor={theme.accent}
                                    icon={lesson.icon || "⚡"}
                                    backgroundColor="#0d0f1a"
                                />
                            </m.div>
                        )}

                        {/* ── COMPLETION SCREEN ──────────── */}
                        {step === "complete" && (
                            <m.div
                                key="complete"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="absolute inset-0 flex flex-col items-center justify-center px-6 pb-20 overflow-y-auto"
                                style={{
                                    background: `radial-gradient(ellipse 65% 55% at 50% 35%, ${theme.bgGlow}25, transparent 75%), #0d0f1a`
                                }}
                             >
                                <div className="max-w-md w-full flex flex-col items-center text-center my-auto">
                                    {/* Step 1: Icon floating badge in 3D */}
                                    <m.div
                                        initial={{ scale: 0, opacity: 0, rotateY: 180 }}
                                        animate={{ 
                                            scale: 1, 
                                            opacity: 1, 
                                            rotateY: 360,
                                            y: [0, -10, 0]
                                        }}
                                        transition={{ 
                                            scale: { type: "spring", damping: 15, stiffness: 100 },
                                            rotateY: { duration: 1.2, ease: "easeOut" },
                                            y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                                        }}
                                        style={{ 
                                            fontSize: 72, 
                                            marginBottom: 24, 
                                            filter: `drop-shadow(0 0 35px ${theme.accent}80)`,
                                            perspective: 1000,
                                            willChange: 'transform'
                                        }}
                                        className="flex items-center justify-center w-28 h-28 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md relative"
                                    >
                                        <m.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                                            className="absolute inset-0 rounded-full border border-dashed border-white/15 pointer-events-none"
                                            style={{ margin: -6 }}
                                        />
                                        
                                        {lesson.icon?.startsWith("@") ? (
                                            <div className="w-20 h-20 relative z-10">
                                                <Image 
                                                    src={`/assets/logos/${lesson.icon.substring(1)}`} 
                                                    alt="" 
                                                    fill 
                                                    className="object-contain"
                                                />
                                            </div>
                                        ) : (
                                            <span className="relative z-10 select-none">{lesson.icon || "⚡"}</span>
                                        )}
                                    </m.div>

                                    {/* Step 2: Title */}
                                    <m.h1
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.3 }}
                                        className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-2"
                                    >
                                        שיעור הושלם! 🎉
                                    </m.h1>

                                    {/* Step 3: XP Capsule */}
                                    <m.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.6, type: "spring", damping: 16 }}
                                        className="my-8 px-6 py-4 rounded-3xl backdrop-blur-xl border relative overflow-hidden"
                                        style={{
                                            background: "linear-gradient(135deg, rgba(251, 191, 36, 0.12) 0%, rgba(251, 191, 36, 0.02) 100%)",
                                            borderColor: "rgba(251, 191, 36, 0.25)",
                                            boxShadow: "0 15px 35px rgba(251, 191, 36, 0.08)"
                                        }}
                                    >
                                        <m.div
                                            animate={{ x: ["-100%", "200%"] }}
                                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", repeatDelay: 2.5 }}
                                            className="absolute top-0 bottom-0 w-1/3 bg-gradient-to-r from-transparent via-amber-400/20 to-transparent rotate-[30deg] pointer-events-none"
                                        />
                                        <div className="flex flex-col items-center">
                                            <div className="flex items-center gap-2">
                                                <span className="text-2xl select-none">🔥</span>
                                                <span style={{ fontSize: 46, fontWeight: 900, color: "#FBBF24" }} className="tracking-tight leading-none drop-shadow-[0_2px_12px_rgba(251,191,36,0.35)]">
                                                    <XPCounter target={earnedXp} />
                                                </span>
                                                <span className="text-xl font-bold text-amber-300 select-none">XP</span>
                                            </div>
                                            <p style={{ fontSize: 13, opacity: 0.75 }} className="text-amber-200/80 font-semibold mt-1.5">נוספו לחשבונך!</p>
                                        </div>
                                    </m.div>

                                    {/* Step 4: Pull quote */}
                                    {lesson.pullQuote && (
                                        <m.div
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 0.9 }}
                                            style={{
                                                maxWidth: 400,
                                                fontSize: 16,
                                                color: theme.accent,
                                                borderRight: `2px solid ${theme.accent}60`,
                                                paddingRight: 16,
                                                textAlign: "right",
                                                lineHeight: 1.75,
                                                marginBottom: 36,
                                            }}
                                            className="font-serif italic font-medium"
                                        >
                                            {lesson.pullQuote}
                                        </m.div>
                                    )}

                                    {/* Step 5: CTAs */}
                                    <m.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 1.2 }}
                                        className="w-full max-w-[320px] space-y-4"
                                    >
                                        {nextLesson ? (
                                            <m.button
                                                whileTap={{ scale: 0.96 }}
                                                whileHover={{ scale: 1.04, boxShadow: `0 0 25px ${theme.accent}40` }}
                                                onClick={() => { haptics.tap(); router.push(`/lesson/${nextLesson.id}?from=${from ?? 'home'}`); }}
                                                className="w-full py-4 rounded-full bg-white text-black font-extrabold text-[16px] shadow-2xl relative overflow-hidden transition-all duration-300"
                                                style={{ height: 54, willChange: 'transform' }}
                                            >
                                                <m.div
                                                    animate={{ x: ["-100%", "200%"] }}
                                                    transition={{ duration: 2.5, repeat: Infinity, ease: "linear", delay: 1 }}
                                                    className="absolute top-0 bottom-0 w-1/3 bg-gradient-to-r from-transparent via-black/[0.04] to-transparent rotate-[25deg] pointer-events-none"
                                                />
                                                <span className="relative z-10 flex items-center justify-center gap-2 h-full">
                                                    השיעור הבא &larr;
                                                </span>
                                            </m.button>
                                        ) : null}

                                        <m.button
                                            whileTap={{ scale: 0.96 }}
                                            whileHover={{ scale: 1.04, backgroundColor: "rgba(255,255,255,0.06)" }}
                                            onClick={exitLesson}
                                            className="w-full py-4 rounded-full font-bold text-[16px] border border-white/10 text-white backdrop-blur-md transition-all duration-300"
                                            style={{ height: 54, willChange: 'transform' }}
                                        >
                                            חזרה לקורס
                                        </m.button>

                                        <m.button
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => {
                                                haptics.tap();
                                                const text = `הרגע סיימתי שיעור ב-Savant! כבר עם ${earnedXp} נקודות XP חדשות.`;
                                                if (navigator.share) navigator.share({ title: "Savant", text });
                                                else { navigator.clipboard.writeText(text); }
                                            }}
                                            className="w-full py-2 text-xs font-semibold text-zinc-500 hover:text-zinc-300 transition-colors flex items-center justify-center gap-1.5"
                                        >
                                            שתף הישג 🏆
                                        </m.button>
                                    </m.div>
                                </div>
                            </m.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

// ── Wrapper ──────────────────────────────────────────
export function LessonRunner({ lessonId, from }: Props) {
    const router = useRouter();
    const [lesson, setLesson] = useState<Lesson | null | undefined>(undefined);
    const nextLessonData = useRef<Lesson | null>(null);

    useEffect(() => {
        loadLessonById(lessonId).then(loadedLesson => {
            setLesson(loadedLesson);
            
            // Preload next lesson data
            if (loadedLesson) {
                const courseLessons = LESSON_INDEX.filter(l => l.courseId === loadedLesson.courseId).sort((a, b) => a.order - b.order);
                const currentIndex = courseLessons.findIndex(l => l.id === loadedLesson.id);
                const next = currentIndex !== -1 && currentIndex < courseLessons.length - 1 ? courseLessons[currentIndex + 1] : null;
                
                if (next) {
                    loadLessonById(next.id).then(data => {
                        nextLessonData.current = data;
                    });
                }
            }
        });
    }, [lessonId]);

    if (lesson === undefined) {
        return (
            <div className="flex flex-col items-center justify-center p-6 min-h-[100dvh] bg-[#0d0f1a]">
                <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            </div>
        );
    }

    if (!lesson) {
        return (
            <div className="flex flex-col items-center justify-center p-6 min-h-[100dvh]">
                <h2 className="text-xl font-bold mb-4 text-white">השיעור לא נמצא</h2>
                <button className="px-4 py-2 bg-white text-black rounded-full font-semibold" onClick={() => router.push('/')}>חזור</button>
            </div>
        );
    }

    if (lesson.blocks && lesson.blocks.length > 0) {
        return <BlockLessonRunner lesson={lesson} from={from} />;
    }

    return (
        <LessonProvider maxPulses={lesson.practicalCall ? 5 : 4}>
            <LessonContent lesson={lesson} from={from} />
        </LessonProvider>
    );
}


"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { m, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { LESSON_INDEX, loadLessonById, COURSES, type Lesson } from "@/content";
import { useSavantStore } from "@/store/useSavantStore";
import { X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { LessonProvider, useLesson } from "@/context/LessonContext";
import LessonGraphic from "@/components/LessonGraphic";
import { QuizEngine } from "@/components/QuizEngine";
import { HighlightedText } from "@/components/HighlightedText";
import { PracticalCall } from "@/components/PracticalCall";
import { haptics } from "@/lib/haptics";
import { useLessonPulses } from "@/hooks/useLessonPulses";
import { Confetti } from "@/components/feedback/Confetti";
import { XPCounter } from "@/components/feedback/XPCounter";

// ── Icon → Theme map ─────────────────────────────────
const ICON_THEMES: Record<string, { bgGlow: string; accent: string }> = {
    "\u{1F9E0}": { bgGlow: "#7C3AED", accent: "#A78BFA" }, // 🧠
    "\u{1F5C2}\uFE0F": { bgGlow: "#1D4ED8", accent: "#60A5FA" }, // 🗂️
    "\u{1FA9F}": { bgGlow: "#0E7490", accent: "#22D3EE" }, // 🪟
    "\u{1F501}": { bgGlow: "#C2410C", accent: "#FB923C" }, // 🔁
    "\u26D3\uFE0F": { bgGlow: "#B45309", accent: "#FCD34D" }, // ⛓️
    "\u{1F3AD}": { bgGlow: "#991B1B", accent: "#FCA5A5" }, // 🎭
    "\u{1F3AF}": { bgGlow: "#0F766E", accent: "#2DD4BF" }, // 🎯
    "\u{1F4D0}": { bgGlow: "#3730A3", accent: "#818CF8" }, // 📐
    "\u{1F4AC}": { bgGlow: "#9D174D", accent: "#F9A8D4" }, // 💬
    "\u{1F52C}": { bgGlow: "#166534", accent: "#86EFAC" }, // 🔬
    "\u{1F4DA}": { bgGlow: "#92400E", accent: "#FDE68A" }, // 📚
    "\u{1F9EC}": { bgGlow: "#6B21A8", accent: "#C084FC" }, // 🧬
};
const DEFAULT_THEME = { bgGlow: "#064E3B", accent: "#34D399" };

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
        practicalCallDone,
        setPracticalCallDone,
        nextPulse,
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
        if (from === 'course') router.replace(`/courses/${lesson.courseId}`);
        else if (from === 'track') router.replace(`/courses`);
        else router.replace('/');
    };

    const addXp = useSavantStore(s => s.addXp);
    const completeLesson = useSavantStore(s => s.completeLesson);
    const checkStreak = useSavantStore(s => s.checkStreak);

    const [earnedXp, setEarnedXp] = useState(0);
    const [correctCount, setCorrectCount] = useState(0);
    const [showConfetti, setShowConfetti] = useState(false);
    const completedRef = useRef(false);
    const readContainerRef = useRef<HTMLDivElement>(null);

    // Derive theme from icon
    const theme = useMemo(() => {
        const icon = lesson.icon || "";
        return ICON_THEMES[icon] || DEFAULT_THEME;
    }, [lesson.icon]);

    // Course lessons for "next lesson" nav
    const courseLessons = LESSON_INDEX.filter(l => l.courseId === lesson.courseId).sort((a, b) => a.order - b.order);
    const currentIndex = courseLessons.findIndex(l => l.id === lesson.id);
    const nextLesson = currentIndex !== -1 && currentIndex < courseLessons.length - 1 ? courseLessons[currentIndex + 1] : null;

    // Quiz complete
    const handleQuizComplete = (finalXp: number, correct: number) => {
        const readingXp = 10;
        const total = finalXp + readingXp;
        setEarnedXp(total);
        setCorrectCount(correct);

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
                <div className="flex flex-col h-full relative overflow-hidden" style={{
                    background: `radial-gradient(ellipse 60% 50% at 50% 40%, ${theme.bgGlow}40, transparent 70%), #050510`
                }}>
                    <div className="flex-1 flex flex-col justify-center items-center px-8 md:px-12 text-center relative z-10">
                        {/* Icon */}
                        <m.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5, ease: "backOut" }}
                            style={{ fontSize: 64, marginBottom: 24, filter: `drop-shadow(0 0 20px ${theme.accent}60)` }}
                            className="flex items-center justify-center"
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

                        {/* Hook text — line-by-line stagger */}
                        <div className="max-w-xl mx-auto w-full mb-12">
                            {(lesson.hook || lesson.description || "").split("\n").filter(Boolean).map((line: string, i: number) => (
                                <m.h2
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: 0.15 * i + 0.3 }}
                                    className="text-[32px] md:text-5xl font-bold leading-[1.2] text-white tracking-tight"
                                >
                                    {line}
                                </m.h2>
                            ))}
                        </div>

                        {/* Metadata */}
                        <m.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                            className="flex flex-col items-center"
                        >
                            <div style={{ width: 40, height: 3, borderRadius: 99, background: theme.accent, marginBottom: 16 }} />
                            <p style={{ fontSize: 13, opacity: 0.6 }}>שיעור {currentIndex + 1} &middot; {lesson.title}</p>
                        </m.div>
                    </div>

                    {/* CTA */}
                    <m.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.8 }}
                        className="pb-12 flex justify-center"
                    >
                        <m.button
                            whileTap={{ scale: 0.96 }}
                            onClick={() => { haptics.tap(); handleSwipe(-1); }}
                            className="rounded-full font-medium text-[15px] text-black bg-white overflow-hidden relative"
                            style={{ width: 200, height: 48 }}
                        >
                            <m.div
                                animate={{ boxShadow: ["0 0 0 0 rgba(255,255,255,0.3)", "0 0 0 8px rgba(255,255,255,0)", "0 0 0 0 rgba(255,255,255,0.3)"] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
                                className="absolute inset-0 rounded-full"
                            />
                            <span className="relative z-10">המשך</span>
                        </m.button>
                    </m.div>
                </div>
            )
        },

        // ─── PULSE 1: READING (scienceA + scienceB) ──
        {
            type: "reading",
            content: (
                <div className="flex flex-col h-full relative" style={{ background: "#050510" }}>
                    {/* Scroll progress bar */}
                    <div className="absolute top-0 left-0 right-0 z-50 h-[3px] bg-white/5">
                        <div style={{
                            height: 3,
                            background: theme.accent,
                            width: `${readProgress * 100}%`,
                            transition: "width 0.1s linear",
                            borderRadius: "0 2px 2px 0",
                        }} />
                    </div>

                    <div
                        ref={readContainerRef}
                        onScroll={handleReadScroll}
                        className="flex-1 overflow-y-auto no-scrollbar pt-8 pb-32 px-6 md:px-8"
                    >
                        <div className="max-w-[680px] mx-auto w-full">
                            {/* TLDR Card */}
                            {lesson.tldr && (
                                <div style={{
                                    borderRadius: 16,
                                    border: `0.5px solid ${theme.accent}40`,
                                    borderRight: `3px solid ${theme.accent}`,
                                    background: `${theme.accent}10`,
                                    padding: "16px 20px",
                                    marginBottom: 32,
                                }}>
                                    <span style={{
                                        display: "inline-block",
                                        background: `${theme.accent}20`,
                                        color: theme.accent,
                                        fontSize: 11,
                                        fontWeight: 500,
                                        padding: "2px 8px",
                                        borderRadius: 99,
                                        marginBottom: 8,
                                    }}>בקצרה</span>
                                    <p style={{ fontSize: 15, fontWeight: 500, lineHeight: 1.7, color: "white" }}>
                                        {lesson.tldr}
                                    </p>
                                </div>
                            )}

                            {/* Science A */}
                            <div className="text-[16px] leading-[1.9]" style={{ color: "rgba(255,255,255,0.85)" }}>
                                <HighlightedText text={lesson.scienceA || lesson.readContent || ""} accentColor={theme.accent} />
                            </div>

                            {/* Lesson Graphic */}
                            {lesson.image ? (
                                <m.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                    className="my-10 flex justify-center"
                                >
                                    {/* LESSON_7_IMAGE */}
                                    <Image
                                        src={lesson.image}
                                        alt={lesson.title}
                                        width={800}
                                        height={600}
                                        className="rounded-2xl max-w-full h-auto border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                                        loading="lazy"
                                    />
                                </m.div>
                            ) : lesson.diagram ? (
                                <m.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4 }}
                                    className="my-10 w-full flex justify-center"
                                    dangerouslySetInnerHTML={{ __html: lesson.diagram }}
                                />
                            ) : (
                                <LessonGraphic lessonId={lesson.id} />
                            )}


                            {/* Visual separator */}
                            {lesson.scienceB && (
                                <div style={{ position: "relative", margin: "32px 0" }}>
                                    <hr style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.1)" }} />
                                    <span style={{
                                        position: "absolute",
                                        top: -11,
                                        left: "50%",
                                        transform: "translateX(-50%)",
                                        background: "#050510",
                                        padding: "0 12px",
                                        fontSize: 16,
                                    }}>
                                        {lesson.icon || "⚡"}
                                    </span>
                                </div>
                            )}

                            {/* Science B */}
                            {lesson.scienceB && (
                                <div className="text-[16px] leading-[1.9]" style={{ color: "rgba(255,255,255,0.85)" }}>
                                    <HighlightedText text={lesson.scienceB} accentColor={theme.accent} />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#050510] via-[#050510] to-transparent pt-10 pb-4 px-6">
                        <div className="max-w-md mx-auto flex gap-3">
                            <m.button
                                whileTap={{ scale: 0.95 }}
                                onClick={() => prevPulse()}
                                className="w-14 h-14 flex items-center justify-center rounded-2xl"
                                style={{ border: `1px solid ${theme.accent}22`, color: theme.accent }}
                            >
                                <ArrowRight className="w-5 h-5" />
                            </m.button>
                            <m.button
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleSwipe(-1)}
                                className="flex-1 py-4 rounded-2xl font-bold text-lg"
                                style={{ background: `${theme.accent}15`, color: theme.accent, border: `1px solid ${theme.accent}44` }}
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
                <div className="flex flex-col h-full relative overflow-hidden" style={{
                    background: `radial-gradient(ellipse 60% 50% at 50% 40%, ${theme.bgGlow}25, transparent 70%), #050510`
                }}>
                    <div className="flex-1 flex flex-col justify-center items-center px-8 md:px-12 text-center relative z-10">
                        {/* Decorative quote mark */}
                        <div style={{
                            position: "absolute",
                            top: "15%",
                            right: "10%",
                            fontSize: 120,
                            fontFamily: "serif",
                            color: `${theme.accent}15`,
                            lineHeight: 1,
                            pointerEvents: "none",
                        }}>&quot;</div>

                        {/* Word-by-word animated quote */}
                        <div className="w-full max-w-xl mx-auto px-4" style={{ fontSize: "clamp(20px, 3.5vw, 28px)", fontWeight: 500, lineHeight: 1.6 }}>
                            {(lesson.pullQuote || "").split(/\s+/).map((word: string, i: number) => (
                                <m.span
                                    key={i}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05, duration: 0.3 }}
                                    className="inline-block"
                                    style={{ margin: "0 0.12em" }}
                                >
                                    {word}
                                </m.span>
                            ))}
                        </div>

                        {/* Attribution */}
                        <m.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: ((lesson.pullQuote || "").split(/\s+/).length * 0.06) + 0.2 }}
                            style={{ fontSize: 13, opacity: 0.5, marginTop: 20 }}
                        >
                            — {lesson.title}
                        </m.p>
                    </div>

                    {/* Nav */}
                    <div className="pb-12 flex justify-center gap-4 px-6">
                        <m.button
                            whileTap={{ scale: 0.96 }}
                            onClick={() => prevPulse()}
                            className="w-16 h-14 rounded-full flex items-center justify-center"
                            style={{ border: `1px solid rgba(255,255,255,0.15)` }}
                        >
                            <ArrowRight className="w-5 h-5" style={{ color: theme.accent }} />
                        </m.button>
                        <m.button
                            whileTap={{ scale: 0.96 }}
                            onClick={() => handleSwipe(-1)}
                            className="flex-1 max-w-xs py-4 rounded-full font-bold text-lg bg-white text-black"
                        >
                            המשך
                        </m.button>
                    </div>
                </div>
            )
        },

        // ─── PULSE 3: INSIGHT ────────────────────────
        {
            type: "insight",
            content: (
                <div className="flex flex-col h-full relative overflow-hidden px-6 pt-8 md:pt-16 pb-4" style={{
                    background: "#050510"
                }}>
                    <div className="flex-1 flex flex-col justify-center items-center">
                        <m.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            style={{
                                maxWidth: 560,
                                width: "100%",
                                borderRadius: 20,
                                border: `0.5px solid ${theme.accent}30`,
                                background: "rgba(255,255,255,0.04)",
                                padding: "32px 28px",
                                position: "relative",
                                overflow: "hidden",
                            }}
                        >
                            {/* Corner accent */}
                            <div style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: 80,
                                height: 80,
                                background: `${theme.accent}15`,
                                borderRadius: "0 0 80px 0",
                            }} />

                            <p style={{ fontSize: 12, color: theme.accent, fontWeight: 500, letterSpacing: "0.05em", marginBottom: 20, position: "relative", zIndex: 1 }}>
                                💡 התובנה המרכזית
                            </p>
                            <p style={{ fontSize: 20, fontWeight: 500, lineHeight: 1.7, color: "white", position: "relative", zIndex: 1 }}>
                                {lesson.insight}
                            </p>
                        </m.div>
                    </div>

                    {/* Nav */}
                    <div className="pb-8 max-w-sm mx-auto w-full flex gap-4">
                        <m.button
                            whileTap={{ scale: 0.96 }}
                            onClick={() => prevPulse()}
                            className="w-16 h-14 rounded-full flex items-center justify-center"
                            style={{ border: `1px solid rgba(255,255,255,0.15)` }}
                        >
                            <ArrowRight className="w-5 h-5" style={{ color: theme.accent }} />
                        </m.button>
                        <m.button
                            whileTap={{ scale: 0.96 }}
                            onClick={() => handleSwipe(-1)}
                            className="flex-1 py-4 rounded-full font-bold text-lg bg-white text-black"
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

    // ── RENDER ───────────────────────────────────────

    return (
        <div className="fixed inset-0 z-[200] bg-[#050510] text-white flex flex-col overflow-hidden dark" dir="rtl">
            {showConfetti && <Confetti color={theme.accent} />}

            <div className="relative w-full h-[100dvh] overflow-hidden flex flex-col">
                {/* Progress bar + controls */}
                <div className="relative flex items-center justify-between p-4 px-6 z-50 w-full pt-[env(safe-area-inset-top)] mt-2 md:mt-4 md:px-10">
                    <div className="flex items-center gap-3">
                        <button onClick={exitLesson} className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-md">
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
                                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-md"
                            >
                                <ArrowRight className="w-5 h-5 text-white" />
                            </m.button>
                        )}
                    </div>

                    {/* Segment progress */}
                    {step !== "complete" && (
                        <div className="flex space-x-1.5 flex-1 mx-6">
                            {Array.from({ length: maxPulses + 1 }, (_, i) => {
                                const isAtOrPast = step === "story" ? currentPulse >= i : true;
                                const isPast = step === "story" ? currentPulse > i : i < maxPulses;
                                return (
                                    <div
                                        key={i}
                                        className="h-1.5 flex-1 rounded-full transition-all duration-500"
                                        style={{
                                            backgroundColor: isAtOrPast ? theme.accent : "rgba(255,255,255,0.1)",
                                            opacity: isPast ? 0.5 : 1
                                        }}
                                    />
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
                                drag="x"
                                dragConstraints={{ left: 0, right: 0 }}
                                dragDirectionLock
                                dragElastic={1}
                                onDragEnd={(e, { offset, velocity }) => {
                                    const swipe = Math.abs(offset.x) * velocity.x;
                                    if (swipe < -10000) handleSwipe(-1);
                                    else if (swipe > 10000) handleSwipe(1);
                                }}
                                className="absolute inset-0 w-full h-full"
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
                                    questions={lesson.questions}
                                    onComplete={handleQuizComplete}
                                    accentColor={theme.accent}
                                    icon={lesson.icon || "⚡"}
                                    backgroundColor="#050510"
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
                                    background: `radial-gradient(ellipse 60% 50% at 50% 40%, ${theme.bgGlow}30, transparent 70%), #050510`
                                }}
                            >
                                <div className="max-w-md w-full flex flex-col items-center text-center">
                                    {/* Step 1: Icon */}
                                    <m.div
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: [0, 1.2, 1], opacity: 1 }}
                                        transition={{ duration: 0.6, ease: "easeOut" }}
                                        style={{ fontSize: 72, marginBottom: 20, filter: `drop-shadow(0 0 30px ${theme.accent})` }}
                                        className="flex items-center justify-center"
                                    >
                                        {lesson.icon?.startsWith("@") ? (
                                            <div className="w-20 h-20 relative">
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

                                    {/* Step 2: Title */}
                                    <m.h2
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.3 }}
                                        style={{ fontSize: 28, fontWeight: 500, marginBottom: 4 }}
                                    >
                                        שיעור הושלם! 🎉
                                    </m.h2>

                                    {/* Step 3: XP */}
                                    <m.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.6 }}
                                        className="my-8"
                                    >
                                        <div style={{ fontSize: 48, fontWeight: 700, color: "#FCD34D" }}>
                                            <XPCounter target={earnedXp} />
                                        </div>
                                        <p style={{ fontSize: 13, opacity: 0.6, marginTop: 4 }}>XP נוספו לחשבונך</p>
                                    </m.div>

                                    {/* Step 4: Pull quote */}
                                    {lesson.pullQuote && (
                                        <m.div
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 1 }}
                                            style={{
                                                maxWidth: 400,
                                                fontSize: 16,
                                                fontStyle: "italic",
                                                color: theme.accent,
                                                borderRight: `2px solid ${theme.accent}`,
                                                paddingRight: 16,
                                                textAlign: "right",
                                                lineHeight: 1.7,
                                                marginBottom: 32,
                                            }}
                                        >
                                            {lesson.pullQuote}
                                        </m.div>
                                    )}

                                    {/* Step 5: CTAs */}
                                    <m.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 1.4 }}
                                        className="w-full max-w-[320px] space-y-3"
                                    >
                                        {nextLesson ? (
                                            <m.button
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => router.replace(`/lesson/${nextLesson.id}?from=${from ?? 'home'}`)}
                                                className="w-full py-4 rounded-full bg-white text-black font-medium text-base"
                                                style={{ height: 52 }}
                                            >
                                                השיעור הבא &larr;
                                            </m.button>
                                        ) : null}

                                        <m.button
                                            whileTap={{ scale: 0.95 }}
                                            onClick={exitLesson}
                                            className="w-full py-4 rounded-full font-medium text-base border border-white/20 text-white"
                                            style={{ height: 52 }}
                                        >
                                            חזרה לקורס
                                        </m.button>

                                        <m.button
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => {
                                                const text = `הרגע סיימתי שיעור ב-Savant! כבר עם ${earnedXp} נקודות XP חדשות.`;
                                                if (navigator.share) navigator.share({ title: "Savant", text });
                                                else { navigator.clipboard.writeText(text); }
                                            }}
                                            className="w-full py-3 text-sm text-zinc-400 hover:text-white transition-colors"
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
            <div className="flex flex-col items-center justify-center p-6 min-h-[100dvh] bg-[#050510]">
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

    return (
        <LessonProvider maxPulses={lesson.practicalCall ? 5 : 4}>
            <LessonContent lesson={lesson} from={from} />
        </LessonProvider>
    );
}


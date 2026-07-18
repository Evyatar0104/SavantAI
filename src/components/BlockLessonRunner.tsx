"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { m, AnimatePresence } from "framer-motion";
import { X, ArrowRight, ChevronRight, ChevronLeft, Check, Award, Sparkles, BookOpen } from "lucide-react";
import { LESSON_INDEX, type Lesson, type LessonBlock } from "@/content";
import { useSavantStore } from "@/store/useSavantStore";
import { haptics } from "@/lib/haptics";
import { Confetti } from "@/components/feedback/Confetti";
import { XPCounter } from "@/components/feedback/XPCounter";
import { LessonBackground } from "@/components/LessonBackground";
import { HighlightedText } from "@/components/HighlightedText";
import { getIconTheme } from "@/lib/iconThemes";

// Simulators
import { TokenizerVisualizer } from "@/components/simulators/TokenizerVisualizer";
import { TemperatureVisualizer } from "@/components/simulators/TemperatureVisualizer";
import { BadGoodSlider } from "@/components/simulators/BadGoodSlider";
import { PromptSandbox } from "@/components/simulators/PromptSandbox";

interface Props {
    lesson: Lesson;
    from?: string;
}


export function BlockLessonRunner({ lesson, from }: Props) {
    const router = useRouter();
    const blocks = useMemo(() => lesson.blocks || [], [lesson]);
    const [blockIndex, setBlockIndex] = useState(0);
    const [step, setStep] = useState<"runner" | "complete">("runner");
    
    // Rewards and completion
    const completeLesson = useSavantStore(s => s.completeLesson);
    const [earnedXp, setEarnedXp] = useState(0);
    const [showConfetti, setShowConfetti] = useState(false);
    const completedRef = useRef(false);

    // Assessment Block state
    const [selectedWrongOptions, setSelectedWrongOptions] = useState<number[]>([]);
    const [assessmentCorrectIndex, setAssessmentCorrectIndex] = useState<number | null>(null);

    // Derive theme
    const theme = useMemo(() => getIconTheme(lesson.icon), [lesson.icon]);

    // Next lesson navigation
    const courseLessons = useMemo(() => {
        return LESSON_INDEX.filter(l => l.courseId === lesson.courseId).sort((a, b) => a.order - b.order);
    }, [lesson.courseId]);

    const currentIndex = useMemo(() => {
        return courseLessons.findIndex(l => l.id === lesson.id);
    }, [courseLessons, lesson.id]);

    const nextLesson = useMemo(() => {
        return currentIndex !== -1 && currentIndex < courseLessons.length - 1 ? courseLessons[currentIndex + 1] : null;
    }, [currentIndex, courseLessons]);

    // Reset block-level states whenever the index changes
    useEffect(() => {
        setSelectedWrongOptions([]);
        setAssessmentCorrectIndex(null);
    }, [blockIndex]);

    const currentBlock = blocks[blockIndex];

    const exitLesson = () => {
        haptics.tap();
        if (from === 'course') router.replace(`/courses/${lesson.courseId}`);
        else if (from === 'track') router.replace(`/courses`);
        else router.replace('/');
    };

    const handleNext = () => {
        haptics.tap();
        if (blockIndex < blocks.length - 1) {
            setBlockIndex(prev => prev + 1);
        } else {
            // Last block completed! Trigger completion slide
            triggerCompletion();
        }
    };

    const handleBack = () => {
        haptics.tap();
        if (blockIndex > 0) {
            setBlockIndex(prev => prev - 1);
        }
    };

    const triggerCompletion = () => {
        if (completedRef.current) return;
        completedRef.current = true;

        const totalXp = 35; // Custom premium reward for block lessons
        setEarnedXp(totalXp);
        completeLesson(lesson.id);

        setStep("complete");
        setShowConfetti(true);
        haptics.complete();
        setTimeout(() => setShowConfetti(false), 3000);
    };

    // Assessment option selection logic
    const handleAssessmentSelect = (index: number, correctIndex: number) => {
        if (assessmentCorrectIndex !== null) return; // already solved

        if (index === correctIndex) {
            haptics.success();
            setAssessmentCorrectIndex(index);
        } else {
            haptics.error();
            if (!selectedWrongOptions.includes(index)) {
                setSelectedWrongOptions(prev => [...prev, index]);
            }
        }
    };

    // Dynamic verification lock: should "המשך" be active?
    const isBlockVerificationLocked = useMemo(() => {
        if (!currentBlock) return false;

        // Inline assessment MUST be answered correctly to proceed
        if (currentBlock.type === "inline-assessment") {
            return assessmentCorrectIndex === null;
        }

        return false;
    }, [currentBlock, assessmentCorrectIndex]);

    // Render single dynamic block
    const renderBlockContent = (block: LessonBlock) => {
        switch (block.type) {
            case "hook":
                return (
                    <div className="flex flex-col items-center justify-center text-center px-4 py-8 md:py-12 max-w-xl mx-auto h-full">
                        {/* Aura effect */}
                        <m.div
                            animate={{
                                scale: [1, 1.15, 1],
                                opacity: [0.25, 0.45, 0.25],
                            }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute w-48 h-48 rounded-full blur-3xl -z-10 pointer-events-none"
                            style={{ background: theme.accent }}
                        />

                        {/* Large icon with pulse halo */}
                        <m.div
                            initial={{ scale: 0.6, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 15 }}
                            className="w-24 h-24 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-center text-5xl mb-8 shadow-2xl relative"
                        >
                            {lesson.icon || "⚡"}
                        </m.div>

                        <m.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-4 tracking-tight"
                        >
                            {block.title || lesson.title}
                        </m.h2>

                        <m.h4
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 }}
                            className="text-lg md:text-xl font-bold text-indigo-400 mb-6 leading-relaxed"
                        >
                            {block.subtitle}
                        </m.h4>

                        <m.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-zinc-300 text-sm md:text-base leading-relaxed mb-10"
                        >
                            {block.description}
                        </m.p>

                        <m.button
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.45 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleNext}
                            className="px-8 py-3.5 rounded-full bg-white text-black font-extrabold text-base shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2"
                        >
                            {block.ctaLabel || "בואו נתחיל"} &larr;
                        </m.button>
                    </div>
                );

            case "content":
                return (
                    <div className="max-w-2xl mx-auto w-full px-4 py-6 md:py-10 space-y-6">
                        {block.title && (
                            <h3 className="text-2xl font-bold text-white tracking-tight border-r-4 border-indigo-500 pr-3.5 leading-none mb-6">
                                {block.title}
                            </h3>
                        )}

                        {/* Main Body */}
                        <div className="text-zinc-200 text-base md:text-lg leading-relaxed space-y-4">
                            <HighlightedText text={block.body} accentColor={theme.accent} />
                        </div>

                        {/* TLDR Card */}
                        {block.tldr && (
                            <m.div
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="backdrop-blur-xl border border-white/5 rounded-2xl p-5 shadow-2xl relative overflow-hidden transition-all duration-300 hover:scale-[1.01] mt-8"
                                style={{
                                    borderRight: `4px solid ${theme.accent}`,
                                    background: `linear-gradient(135deg, ${theme.accent}12, rgba(255,255,255,0.02))`,
                                }}
                            >
                                <span className="text-xs font-bold uppercase tracking-wider block mb-1.5" style={{ color: theme.accent }}>
                                    בשורה התחתונה (TL;DR)
                                </span>
                                <p className="text-zinc-300 text-sm md:text-base leading-relaxed">
                                    {block.tldr}
                                </p>
                            </m.div>
                        )}
                    </div>
                );

            case "tokenizer-sim":
                return (
                    <div className="max-w-3xl mx-auto w-full px-4 py-4 md:py-8">
                        <TokenizerVisualizer
                            defaultText={block.defaultText}
                            language={block.language}
                            explanation={block.explanation}
                        />
                    </div>
                );

            case "temp-sampler-sim":
                return (
                    <div className="max-w-3xl mx-auto w-full px-4 py-4 md:py-8">
                        <TemperatureVisualizer
                            prompt={block.prompt}
                            options={block.options}
                        />
                    </div>
                );

            case "bad-good-slider":
                return (
                    <div className="max-w-3xl mx-auto w-full px-4 py-4 md:py-8">
                        <BadGoodSlider
                            badPrompt={block.badPrompt}
                            goodPrompt={block.goodPrompt}
                            badOutput={block.badOutput}
                            goodOutput={block.goodOutput}
                            explanation={block.explanation}
                        />
                    </div>
                );

            case "prompt-sandbox":
                return (
                    <div className="max-w-3xl mx-auto w-full px-4 py-4 md:py-8">
                        <PromptSandbox
                            systemInstructions={block.systemInstructions}
                            variables={block.variables}
                            idealPromptStructure={block.idealPromptStructure}
                            sampleSuccessResponses={block.sampleSuccessResponses}
                        />
                    </div>
                );

            case "inline-assessment":
                return (
                    <div className="max-w-xl mx-auto w-full px-4 py-6 md:py-12">
                        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-6 backdrop-blur-md shadow-2xl relative overflow-hidden">
                            
                            {/* Quiz indicator */}
                            <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider mb-4">
                                <Sparkles className="w-4 h-4" />
                                <span>בחן את עצמך! (Quick Quiz)</span>
                            </div>

                            {/* Question text */}
                            <h3 className="text-lg md:text-xl font-bold text-white mb-6 leading-relaxed">
                                {block.question}
                            </h3>

                            {/* Options checklist */}
                            <div className="space-y-3">
                                {block.options.map((opt, i) => {
                                    const isCorrect = i === block.correctIndex;
                                    const isSelected = assessmentCorrectIndex === i;
                                    const isWrong = selectedWrongOptions.includes(i);

                                    return (
                                        <button
                                            key={i}
                                            disabled={assessmentCorrectIndex !== null}
                                            onClick={() => handleAssessmentSelect(i, block.correctIndex)}
                                            className={`w-full text-right px-5 py-4 rounded-xl border font-medium text-sm transition-all duration-300 flex items-center justify-between ${
                                                isSelected
                                                    ? "bg-emerald-950/40 border-emerald-500/50 text-emerald-200 shadow-md shadow-emerald-950/20"
                                                    : isWrong
                                                    ? "bg-rose-950/30 border-rose-500/30 text-rose-300 shadow-inner"
                                                    : "bg-zinc-900/40 hover:bg-zinc-900/80 border-zinc-800/80 hover:border-zinc-700 text-zinc-300"
                                            }`}
                                        >
                                            <span>{opt}</span>
                                            {isSelected && (
                                                <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                                                    <Check className="w-3.5 h-3.5 text-black stroke-[3px]" />
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Detailed explanation alert box */}
                            <AnimatePresence>
                                {assessmentCorrectIndex !== null && (
                                    <m.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        className="mt-6 p-4 border border-emerald-500/20 bg-emerald-950/20 rounded-xl text-xs leading-relaxed text-zinc-300"
                                    >
                                        <strong className="text-white block mb-1.5 font-bold">תשובה נכונה! 🎉</strong>
                                        {block.explanation}
                                    </m.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                );

            default:
                return (
                    <div className="text-center text-zinc-500 text-sm py-12">
                        בלוק לא מוכר: {(block as { type: string }).type}
                    </div>
                );
        }
    };

    return (
        <div className="fixed inset-0 z-[200] bg-[#0B0B0F] flex flex-col select-none overflow-hidden" dir="rtl">
            <LessonBackground accentColor={theme.accent} bgGlowColor={theme.bgGlow} />
            {showConfetti && <Confetti color={theme.accent} />}

            <AnimatePresence mode="wait">
                {step === "runner" ? (
                    <m.div
                        key="runner"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex-1 flex flex-col h-full relative"
                    >
                        {/* Upper unified Navigation tracker header */}
                        <div className="z-50 px-6 py-4 flex items-center justify-between border-b border-white/[0.04] bg-zinc-950/20 backdrop-blur-md">
                            
                            {/* Exit button */}
                            <button
                                onClick={exitLesson}
                                className="p-2 bg-white/5 border border-white/10 hover:bg-white/10 text-zinc-300 hover:text-white rounded-full transition-all duration-300"
                                title="צא מהשיעור"
                                aria-label="יציאה מהשיעור"
                            >
                                <X className="w-4 h-4" />
                            </button>

                            {/* Micro lesson title */}
                            <div className="text-center">
                                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">שיעור אינטראקטיבי</span>
                                <span className="text-sm font-extrabold text-white">{lesson.title}</span>
                            </div>

                            {/* Progress percentage label */}
                            <div className="font-mono text-xs font-bold text-zinc-400 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
                                {blockIndex + 1}/{blocks.length}
                            </div>
                        </div>

                        {/* Global Progress Track Line (peaking) */}
                        <div className="w-full h-1 bg-white/5 z-50">
                            <m.div
                                className="h-full rounded-l-md"
                                style={{ background: theme.accent }}
                                animate={{ width: `${((blockIndex + 1) / blocks.length) * 100}%` }}
                                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                            />
                        </div>

                        {/* Content Runner Panel */}
                        <div className="flex-1 overflow-y-auto no-scrollbar relative z-10">
                            <AnimatePresence mode="wait">
                                <m.div
                                    key={blockIndex}
                                    initial={{ opacity: 0, x: 30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -30 }}
                                    transition={{ duration: 0.35, ease: "easeInOut" }}
                                    className="h-full flex flex-col justify-center"
                                >
                                    {renderBlockContent(currentBlock)}
                                </m.div>
                            </AnimatePresence>
                        </div>

                        {/* Unified persistent CTA Drawer footer */}
                        {currentBlock.type !== "hook" && (
                            <div className="z-50 px-6 py-4 flex items-center justify-between border-t border-white/[0.04] bg-[#0E0E14] shadow-2xl">
                                {/* Back click */}
                                <button
                                    onClick={handleBack}
                                    disabled={blockIndex === 0}
                                    className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all duration-300 ${
                                        blockIndex === 0
                                            ? "border-zinc-800/40 text-zinc-700 cursor-not-allowed"
                                            : "border-zinc-800 hover:bg-zinc-900 text-zinc-300 hover:text-white"
                                    }`}
                                >
                                    <ChevronRight className="w-4 h-4" />
                                    חזרה
                                </button>

                                {/* Next CTA with verification state control */}
                                <m.button
                                    disabled={isBlockVerificationLocked}
                                    onClick={handleNext}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-full font-extrabold text-sm shadow-xl transition-all duration-300 ${
                                        isBlockVerificationLocked
                                            ? "bg-zinc-800 text-zinc-600 cursor-not-allowed"
                                            : "bg-white text-black hover:scale-105 active:scale-95"
                                    }`}
                                >
                                    {blockIndex === blocks.length - 1 ? (
                                        <>
                                            סיום וקבלת פרס
                                            <Award className="w-4 h-4 text-amber-500 animate-bounce" />
                                        </>
                                    ) : (
                                        <>
                                            המשך
                                            <ChevronLeft className="w-4 h-4" />
                                        </>
                                    )}
                                </m.button>
                            </div>
                        )}
                    </m.div>
                ) : (
                    /* Elegant Celebration Panel (XP awarded, custom streak check, matching legacy) */
                    <m.div
                        key="complete"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex-1 flex flex-col justify-center items-center px-6 md:px-8 text-center relative z-10"
                    >
                        {/* Glow halo badge */}
                        <div className="relative mb-6">
                            <m.div
                                animate={{ scale: [1, 1.12, 1], opacity: [0.2, 0.4, 0.2] }}
                                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute w-40 h-40 rounded-full blur-3xl"
                                style={{ background: theme.accent }}
                            />
                            <div className="relative z-10 w-24 h-24 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-center text-5xl">
                                🏆
                            </div>
                        </div>

                        <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-2">
                            השיעור הושלם בהצלחה! 🎉
                        </h2>
                        
                        {/* XP counters pill badge */}
                        <m.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.35, type: "spring", damping: 15 }}
                            className="my-8 px-6 py-4 rounded-3xl backdrop-blur-xl border border-amber-500/25 relative overflow-hidden"
                            style={{
                                background: "linear-gradient(135deg, rgba(251, 191, 36, 0.12) 0%, rgba(251, 191, 36, 0.02) 100%)",
                                boxShadow: "0 15px 35px rgba(251, 191, 36, 0.08)"
                            }}
                        >
                            <div className="flex flex-col items-center">
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl">🔥</span>
                                    <span style={{ fontSize: 46, fontWeight: 900, color: "#FBBF24" }} className="tracking-tight leading-none drop-shadow-[0_2px_12px_rgba(251,191,36,0.35)]">
                                        <XPCounter target={earnedXp} />
                                    </span>
                                    <span className="text-xl font-bold text-amber-300">XP</span>
                                </div>
                                <p className="text-xs text-amber-200/80 font-bold mt-1.5">התווספו למאזן הניקוד שלך!</p>
                            </div>
                        </m.div>

                        <div className="w-full max-w-[280px] space-y-4">
                            {nextLesson ? (
                                <button
                                    onClick={() => {
                                        haptics.tap();
                                        router.replace(`/lesson/${nextLesson.id}?from=${from ?? 'home'}`);
                                    }}
                                    className="w-full py-4 rounded-full bg-white text-black font-extrabold text-[15px] shadow-2xl relative overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95"
                                >
                                    השיעור הבא &larr;
                                </button>
                            ) : null}

                            <button
                                onClick={exitLesson}
                                className="w-full py-4 rounded-full font-bold text-[15px] border border-white/10 text-white backdrop-blur-md transition-all duration-300 hover:bg-white/5 active:scale-95"
                            >
                                חזרה לקורס
                            </button>
                        </div>
                    </m.div>
                )}
            </AnimatePresence>
        </div>
    );
}

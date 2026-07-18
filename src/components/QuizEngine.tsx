"use client";

import { useState, useEffect, useCallback } from "react";
import { m, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Zap, Shield, Flame, Timer } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLesson } from "@/context/LessonContext";
import { haptics } from "@/lib/haptics";

interface Question {
    id: string;
    text: string;
    options: string[];
    correctIndex: number;
    explanation: string;
}

interface Props {
    questions: Question[];
    onComplete: (earnedXp: number, correctCount: number) => void;
    accentColor?: string;
    icon?: string;
    backgroundColor?: string;
}

export function QuizEngine({ questions, onComplete, accentColor = "#00C48C", backgroundColor = "#0F1A14" }: Props) {
    const { quizMode, setQuizMode } = useLesson();
    const [shuffledQuestions] = useState<Question[]>(() => {
        return questions.map(q => {
            const optionsWithMetadata = q.options.map((opt, i) => ({
                text: opt,
                isCorrect: i === q.correctIndex
            }));

            const opts = [...optionsWithMetadata];
            for (let i = opts.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [opts[i], opts[j]] = [opts[j], opts[i]];
            }

            return {
                ...q,
                options: opts.map(o => o.text),
                correctIndex: opts.findIndex(o => o.isCorrect)
            };
        });
    });

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [correctAnswers, setCorrectAnswers] = useState<boolean[]>([]);
    const [earnedXp, setEarnedXp] = useState(0);
    const [timeLeft, setTimeLeft] = useState(15);
    const [showHint, setShowHint] = useState(false);

    const handleAnswer = useCallback((index: number, isTimeout = false) => {
        if (isAnswered) return;

        setSelectedOption(index);
        setIsAnswered(true);

        const isCorrect = isTimeout ? false : index === shuffledQuestions[currentQuestionIndex].correctIndex;
        setCorrectAnswers((prev) => [...prev, isCorrect]);

        if (isCorrect) {
            haptics.success();
            setEarnedXp(prev => prev + (quizMode === "scholar" ? 10 : 30));
        } else {
            haptics.error();
            if (quizMode === "gauntlet") {
                setEarnedXp(prev => prev - 20); // Penalty
            } else {
                setShowHint(true);
            }
        }
    }, [isAnswered, shuffledQuestions, currentQuestionIndex, quizMode]);

    // Timer Logic for Gauntlet
    useEffect(() => {
        if (quizMode === "gauntlet" && !isAnswered && timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (quizMode === "gauntlet" && !isAnswered && timeLeft === 0) {
            const timer = setTimeout(() => handleAnswer(-1, true), 0);
            return () => clearTimeout(timer);
        }
    }, [timeLeft, isAnswered, quizMode, handleAnswer]);

    const handleNext = useCallback(() => {
        if (currentQuestionIndex < shuffledQuestions.length - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
            setSelectedOption(null);
            setIsAnswered(false);
            setShowHint(false);
            setTimeLeft(15);
        } else {
            let finalXp = earnedXp;
            if (correctAnswers.filter(Boolean).length === shuffledQuestions.length) {
                finalXp += quizMode === "scholar" ? 20 : 50; // Perfect sweep bonus
            }
            onComplete(Math.max(0, finalXp), correctAnswers.filter(Boolean).length);
        }
    }, [currentQuestionIndex, shuffledQuestions.length, earnedXp, correctAnswers, quizMode, onComplete]);

    // Keyboard support
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

            if (!quizMode) {
                if (e.key === "1") { setQuizMode("scholar"); haptics.tap(); }
                if (e.key === "2") { setQuizMode("gauntlet"); haptics.tap(); }
                return;
            }

            if (!isAnswered) {
                const num = parseInt(e.key);
                if (!isNaN(num) && num >= 1 && num <= shuffledQuestions[currentQuestionIndex].options.length) {
                    handleAnswer(num - 1);
                }
            } else {
                if (e.key === " " || e.key === "Enter") {
                    e.preventDefault();
                    handleNext();
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [quizMode, isAnswered, handleAnswer, handleNext, currentQuestionIndex, shuffledQuestions, setQuizMode]);

    // Initial Path Selection Screen - Gaming Inspired RPG Dashboard
    if (!quizMode) {
        return (
            <m.div
                initial={{ opacity: 0, y: 15 }} 
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center justify-center p-6 h-full text-center max-w-4xl mx-auto w-full relative z-10 bg-transparent select-none"
            >
                <m.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-extrabold uppercase tracking-widest text-zinc-400 mb-4"
                >
                    בחירת נתיב למידה
                </m.div>

                <h2 className="text-3xl md:text-5xl font-extrabold mb-4 text-white tracking-tight leading-tight">בחר את הנתיב שלך</h2>
                <p className="text-zinc-400 mb-12 text-[16px] md:text-[18px] max-w-xl mx-auto leading-relaxed">
                    האם אתה רוצה להטמיע את הידע בנינוחות, או להעמיד אותו למבחן תחת אש?
                </p>

                <div className="flex flex-col md:flex-row gap-6 w-full max-w-3xl">
                    {/* Scholar (Blue) */}
                    <m.button
                        whileTap={{ scale: 0.97 }}
                        whileHover={{ scale: 1.03, y: -4, boxShadow: "0 20px 40px rgba(59,130,246,0.15)" }}
                        onClick={() => { haptics.tap(); setQuizMode("scholar"); }}
                        className="flex-1 p-6 md:p-8 rounded-[28px] border backdrop-blur-xl transition-all duration-300 text-right relative overflow-hidden group flex flex-col justify-between"
                        style={{
                            background: "linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(255,255,255,0.01) 100%)",
                            borderColor: "rgba(59, 130, 246, 0.25)"
                        }}
                    >
                        {/* Shimmer sweep */}
                        <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/[0.02] transition-colors duration-300" />
                        
                        <div>
                            <div className="flex items-center gap-3.5 mb-4">
                                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center">
                                    <Shield className="w-6 h-6 text-blue-400" />
                                </div>
                                <h3 className="text-2xl font-black text-white">המלומד</h3>
                            </div>
                            <p className="text-zinc-400 text-sm md:text-base leading-relaxed mb-6 font-medium">
                                מצב למידה נינוח. הדרכה ורמזים מסייעים על טעויות, ללא לחץ זמן.
                            </p>
                        </div>
                        
                        <div className="flex items-center justify-between mt-auto">
                            <div className="inline-flex items-center text-blue-400 font-extrabold text-xs bg-blue-500/15 px-4 py-1.5 rounded-full border border-blue-500/20">
                                <Zap className="w-3.5 h-3.5 ml-1.5" />
                                50 XP מקסימום
                            </div>
                            <div className="hidden md:inline-flex px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-zinc-500 text-xs font-bold font-mono">
                                [1]
                            </div>
                        </div>
                    </m.button>

                    {/* Gauntlet (Red) */}
                    <m.button
                        whileTap={{ scale: 0.97 }}
                        whileHover={{ scale: 1.03, y: -4, boxShadow: "0 20px 40px rgba(239,68,68,0.18)" }}
                        onClick={() => { haptics.tap(); setQuizMode("gauntlet"); }}
                        className="flex-1 p-6 md:p-8 rounded-[28px] border backdrop-blur-xl transition-all duration-300 text-right relative overflow-hidden group flex flex-col justify-between"
                        style={{
                            background: "linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(255,255,255,0.01) 100%)",
                            borderColor: "rgba(239, 68, 68, 0.25)"
                        }}
                    >
                        <div className="absolute inset-0 bg-red-500/0 group-hover:bg-red-500/[0.02] transition-colors duration-300" />
                        
                        <div>
                            <div className="flex items-center gap-3.5 mb-4">
                                <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center">
                                    <Flame className="w-6 h-6 text-red-400 animate-pulse" />
                                </div>
                                <h3 className="text-2xl font-black text-white">הזירה</h3>
                            </div>
                            <p className="text-zinc-400 text-sm md:text-base leading-relaxed mb-6 font-medium">
                                סיכון גבוה. 15 שניות לשאלה, עונש של מינוס 20 נקודות על טעות. בונוס שרשרת.
                            </p>
                        </div>

                        <div className="flex items-center justify-between mt-auto">
                            <div className="inline-flex items-center text-red-400 font-extrabold text-xs bg-red-500/15 px-4 py-1.5 rounded-full border border-red-500/20">
                                <Zap className="w-3.5 h-3.5 ml-1.5" />
                                150 XP מקסימום
                            </div>
                            <div className="hidden md:inline-flex px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-zinc-500 text-xs font-bold font-mono">
                                [2]
                            </div>
                        </div>
                    </m.button>
                </div>
            </m.div>
        );
    }

    const question = shuffledQuestions[currentQuestionIndex];

    return (
        <div className="flex flex-col h-[100svh] relative overflow-hidden bg-transparent">
            <div className="flex-1 flex flex-col pt-2 md:pt-4 pb-2 relative z-10 px-6 md:px-12 max-w-5xl mx-auto w-full text-white overflow-hidden h-full">
                {/* Header info */}
                <div className="flex justify-between items-center mb-4 shrink-0">
                    <div className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/15 text-[10px] md:text-xs font-extrabold uppercase tracking-wider text-zinc-400">
                        שאלה {currentQuestionIndex + 1} מתוך {shuffledQuestions.length}
                    </div>
                    {quizMode === "gauntlet" && (
                        <div className={cn("flex items-center font-extrabold text-base px-3.5 py-1 rounded-full bg-white/[0.03] border backdrop-blur-md", timeLeft <= 5 ? "text-red-400 border-red-500/30 animate-pulse" : "text-orange-400 border-orange-500/25")}>
                            <Timer className="w-4 h-4 ml-1.5" />
                            00:{timeLeft.toString().padStart(2, '0')}
                        </div>
                    )}
                </div>

                <div className="flex-1 min-h-0 flex flex-col justify-center gap-6 md:gap-10">
                    {/* Question */}
                    <div className="shrink-0 flex items-center justify-center py-2">
                        <m.h2 
                            key={`q-${currentQuestionIndex}`}
                            initial={{ opacity: 0, scale: 0.96 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="font-extrabold leading-[1.25] max-w-3xl text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] text-center"
                            style={{ 
                                fontSize: 'clamp(1.2rem, 3.8vh, 2.5rem)',
                                lineHeight: 1.25
                            }}
                        >
                            {question.text}
                        </m.h2>
                    </div>

                    {/* Options Grid */}
                    <div className={cn(
                        "shrink-0 grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl mx-auto transition-all duration-500",
                        isAnswered ? "opacity-40 pointer-events-none scale-[0.9] origin-top translate-y-[-1.5vh]" : ""
                    )}>
                        {question.options.map((option, idx) => {
                            const isCorrect = idx === question.correctIndex;
                            const isSelected = selectedOption === idx;

                            let ringColor = "border-white/10";
                            let innerBg = "bg-white/[0.02]";
                            let textColor = "text-white";
                            let shadowGlow = "none";

                            if (isAnswered) {
                                if (isCorrect) {
                                    ringColor = "border-emerald-500/50";
                                    innerBg = "bg-emerald-500/8";
                                    textColor = "text-emerald-400";
                                    shadowGlow = "0 0 20px rgba(16,185,129,0.2)";
                                } else if (isSelected) {
                                    ringColor = "border-rose-500/50";
                                    innerBg = "bg-rose-500/8";
                                    textColor = "text-rose-400";
                                    shadowGlow = "0 0 20px rgba(244,63,94,0.2)";
                                } else {
                                    ringColor = "border-white/5 opacity-30";
                                    innerBg = "bg-transparent";
                                    textColor = "text-zinc-500";
                                }
                            }

                            return (
                                <m.button
                                    key={idx}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.08, type: "spring", damping: 15 }}
                                    whileTap={{ scale: isAnswered ? 1 : 0.96, y: isAnswered ? 0 : 2 }}
                                    whileHover={!isAnswered ? { y: -2, scale: 1.01 } : {}}
                                    onClick={() => handleAnswer(idx)}
                                    disabled={isAnswered}
                                    className={cn(
                                        "group relative w-full text-right p-[1px] rounded-2xl transition-all duration-300 overflow-hidden flex flex-col h-full min-h-0",
                                        isAnswered ? "" : "hover:shadow-2xl"
                                    )}
                                >
                                    <div className={cn(
                                        "absolute inset-0 backdrop-blur-md rounded-2xl transition-colors duration-300",
                                        innerBg
                                    )} />
                                    
                                    <div className={cn(
                                        "absolute inset-0 rounded-2xl border transition-all duration-500 pointer-events-none",
                                        ringColor
                                    )} style={{ boxShadow: shadowGlow }} />

                                    {!isAnswered && (
                                        <div className="absolute -inset-[100%] bg-gradient-to-r from-transparent via-white/5 to-transparent rotate-[35deg] translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
                                    )}

                                    <div className="relative z-10 h-full flex justify-between items-center px-5 py-3 md:py-4.5 gap-4">
                                        <span 
                                            className={cn("font-bold leading-relaxed transition-colors duration-300", textColor)}
                                            style={{ fontSize: 'clamp(0.85rem, 1.85vh, 1.15rem)' }}
                                        >
                                            {option}
                                        </span>
                                        
                                        <div className="flex items-center flex-shrink-0">
                                            {!isAnswered ? (
                                                <div className="w-8 h-8 rounded-full border border-white/15 flex items-center justify-center text-xs font-black text-zinc-500 bg-white/5 transition-all duration-300 group-hover:border-white/40 group-hover:text-white group-hover:scale-110">
                                                    {idx + 1}
                                                </div>
                                            ) : (
                                                <m.div 
                                                    initial={{ scale: 0.5, rotate: -45 }}
                                                    animate={{ scale: 1, rotate: 0 }}
                                                    transition={{ type: "spring", damping: 10 }}
                                                >
                                                    {isCorrect && <CheckCircle className="w-7 h-7 text-emerald-400 drop-shadow-[0_0_12px_rgba(16,185,129,0.5)]" />}
                                                    {isSelected && !isCorrect && <XCircle className="w-7 h-7 text-rose-400 drop-shadow-[0_0_12px_rgba(244,63,94,0.5)]" />}
                                                </m.div>
                                            )}
                                        </div>
                                    </div>
                                </m.button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Frosted bottom sheet drawer for answer explanation */}
            <AnimatePresence>
                {isAnswered && (
                    <m.div 
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 100 }}
                        transition={{ type: "spring", damping: 20, stiffness: 200 }}
                        className="fixed bottom-0 left-0 right-0 p-5 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] md:p-6 bg-zinc-950/80 backdrop-blur-2xl border-t border-white/10 z-50 shadow-[0_-20px_50px_rgba(0,0,0,0.6)]"
                        style={{ height: 'auto', maxHeight: '42dvh' }}
                    >
                        <div className="max-w-3xl mx-auto w-full h-full flex flex-col">
                            {(showHint || quizMode === "gauntlet") && (
                                <m.div
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 overflow-y-auto min-h-0"
                                    style={{ borderRight: `3px solid ${correctAnswers[currentQuestionIndex] ? accentColor : '#EF4444'}` }}
                                >
                                    <div className="flex items-center mb-2">
                                        <Zap className="w-4 h-4 text-amber-400 mr-2" />
                                        <span className="font-extrabold text-zinc-400 uppercase tracking-widest text-[10px] md:text-xs">הסבר</span>
                                    </div>
                                    <p className="text-zinc-200 font-semibold leading-relaxed text-xs md:text-[14px]">
                                        {question.explanation}
                                    </p>
                                </m.div>
                            )}

                            <m.button
                                whileTap={{ scale: 0.97 }}
                                whileHover={{ scale: 1.02, boxShadow: `0 0 25px ${correctAnswers[currentQuestionIndex] ? accentColor : '#EF4444'}30` }}
                                onClick={handleNext}
                                className={cn(
                                    "w-full py-4 rounded-full font-extrabold text-[16px] shadow-2xl transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden",
                                    correctAnswers[currentQuestionIndex] ? "text-black bg-white" : "bg-rose-600 text-white border border-rose-500/30"
                                )}
                                style={correctAnswers[currentQuestionIndex] ? { backgroundColor: "#ffffff" } : {}}
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    {currentQuestionIndex < shuffledQuestions.length - 1 ? "לשאלה הבאה" : "סיים שיעור ולחגוג"}
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="animate-pulse"><path d="m15 18-6-6 6-6"/></svg>
                                </span>
                                <span className="opacity-40 text-[10px] font-normal hidden md:inline ml-2">(לחץ רווח)</span>
                            </m.button>
                        </div>
                    </m.div>
                )}
            </AnimatePresence>
        </div>
    );
}

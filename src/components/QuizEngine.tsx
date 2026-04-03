"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { m, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Zap, Shield, Flame, Timer } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSavantStore } from "@/store/useSavantStore";
import { useLesson } from "@/context/LessonContext";
import { AnimatedGradient } from "@/components/AnimatedGradient";
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

export function QuizEngine({ questions, onComplete, accentColor = "#00C48C", icon = "⚡", backgroundColor = "#0F1A14" }: Props) {
    const { quizMode, setQuizMode } = useLesson();

    const shuffledQuestions = useMemo(() => {
        return questions.map(q => {
            const optionsWithMetadata = q.options.map((opt, i) => ({
                text: opt,
                isCorrect: i === q.correctIndex
            }));

            const shuffled = [...optionsWithMetadata];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }

            return {
                ...q,
                options: shuffled.map(o => o.text),
                correctIndex: shuffled.findIndex(o => o.isCorrect)
            };
        });
    }, [questions]);

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

        // If it's a timeout, it counts as a wrong answer and we don't check options
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
            handleAnswer(-1, true); // Timeout
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
            // Finish Quiz
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
                if (e.key === "1") setQuizMode("scholar");
                if (e.key === "2") setQuizMode("gauntlet");
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
    }, [quizMode, isAnswered, handleAnswer, handleNext, currentQuestionIndex, shuffledQuestions]);

    // Initial Choice Screen
    if (!quizMode) {
        return (
            <m.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center p-6 h-full text-center max-w-4xl mx-auto w-full"
            >
                <h2 className="text-3xl md:text-5xl font-bold mb-6 text-zinc-900 dark:text-white">בחר את הנתיב שלך</h2>
                <p className="text-zinc-600 dark:text-zinc-400 mb-10 text-lg md:text-xl">
                    האם אתה רוצה להטמיע את הידע, או לבחון אותו תחת לחץ?
                </p>

                <div className="flex flex-col md:flex-row gap-4 w-full">
                    <m.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setQuizMode("scholar")}
                        className="flex-1 p-6 md:p-8 rounded-[24px] bg-zinc-900/50 border-2 border-white/10 hover:border-blue-500 transition-all text-right shadow-sm relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/5 transition-colors" />
                        <div className="relative flex items-center space-x-4 space-x-reverse mb-2">
                            <Shield className="w-8 h-8 md:w-10 md:h-10 text-blue-400" />
                            <h3 className="text-2xl md:text-3xl font-bold text-white">המלומד</h3>
                        </div>
                        <p className="relative text-zinc-400 text-sm md:text-base mb-4">
                            מצב נורמלי. הדרכה ורמזים על טעויות, ללא לחץ זמן.
                        </p>
                        <div className="relative inline-flex items-center text-blue-400 font-bold text-sm bg-blue-500/10 px-3 py-1 rounded-full">
                            <Zap className="w-4 h-4 ml-1" />
                            50 XP
                        </div>
                        <div className="hidden md:inline-flex absolute bottom-6 left-6 text-zinc-500 text-sm font-medium">לחץ [1]</div>
                    </m.button>

                    <m.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setQuizMode("gauntlet")}
                        className="flex-1 p-6 md:p-8 rounded-[24px] bg-black/50 border-2 border-red-500/20 hover:border-red-500 transition-all text-right shadow-[0_8px_32px_rgba(239,68,68,0.15)] relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-red-500/5 group-hover:bg-red-500/10 transition-colors" />
                        <div className="relative flex items-center space-x-4 space-x-reverse mb-2">
                            <Flame className="w-8 h-8 md:w-10 md:h-10 text-red-400" />
                            <h3 className="text-2xl md:text-3xl font-bold text-white">הזירה</h3>
                        </div>
                        <p className="relative text-zinc-400 text-sm md:text-base mb-4">
                            סיכון גבוה. 15 שניות לשאלה, מינוס 20 נקודות על טעות. פוטנציאל לבונוס.
                        </p>
                        <div className="relative inline-flex items-center text-red-400 font-bold text-sm bg-red-500/10 px-3 py-1 rounded-full">
                            <Zap className="w-4 h-4 ml-1" />
                            150 XP
                        </div>
                        <div className="hidden md:inline-flex absolute bottom-6 left-6 text-zinc-600 text-sm font-medium">לחץ [2]</div>
                    </m.button>
                </div>
            </m.div>
        );
    }

    // This part was already replaced above, no need to keep target lines here.

    const question = shuffledQuestions[currentQuestionIndex];

    return (
        <div className="flex flex-col h-[100svh] relative overflow-hidden">
            <AnimatedGradient color={accentColor} backgroundColor={backgroundColor} />

            <div className="flex-1 flex flex-col pt-2 md:pt-4 pb-2 relative z-10 px-6 md:px-12 max-w-5xl mx-auto w-full text-white overflow-hidden h-full">
                <div className="flex justify-between items-center mb-2 shrink-0">
                    <div className="flex font-bold text-zinc-500 uppercase tracking-[0.2em] text-[10px] md:text-xs">
                        שאלה {currentQuestionIndex + 1} מתוך {shuffledQuestions.length}
                    </div>
                    {quizMode === "gauntlet" && (
                        <div className={cn("flex items-center font-bold text-lg", timeLeft <= 5 ? "text-red-500 animate-pulse" : "text-orange-400")}>
                            <Timer className="w-5 h-5 ml-2" />
                            00:{timeLeft.toString().padStart(2, '0')}
                        </div>
                    )}
                </div>

                <div className="flex-1 min-h-0 flex flex-col justify-center gap-4 md:gap-8">
                    {/* Question */}
                    <div className="shrink-0 flex items-center justify-center py-2">
                        <m.h2 
                            key={`q-${currentQuestionIndex}`}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="font-bold leading-[1.1] max-w-4xl balance text-white drop-shadow-2xl text-center"
                            style={{ 
                                fontSize: 'clamp(1rem, 4vh, 2.75rem)',
                                lineHeight: 1.15
                            }}
                        >
                            {question.text}
                        </m.h2>
                    </div>

                    {/* Options Grid */}
                    <div className={cn(
                        "shrink-0 grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-4xl mx-auto transition-all duration-500",
                        isAnswered ? "opacity-30 pointer-events-none scale-[0.85] origin-top translate-y-[-2vh]" : ""
                    )}>
                        {question.options.map((option, idx) => {
                            const isCorrect = idx === question.correctIndex;
                            const isSelected = selectedOption === idx;

                            let ringColor = "border-white/10";
                            let innerBg = "bg-white/5";
                            let textColor = "text-white";

                            if (isAnswered) {
                                if (isCorrect) {
                                    ringColor = "border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.2)]";
                                    innerBg = "bg-green-500/10";
                                    textColor = "text-green-400";
                                } else if (isSelected) {
                                    ringColor = "border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)]";
                                    innerBg = "bg-red-500/10";
                                    textColor = "text-red-400";
                                } else {
                                    ringColor = "border-white/5 opacity-40";
                                    innerBg = "bg-transparent";
                                    textColor = "text-zinc-500";
                                }
                            }

                            return (
                                <m.button
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    whileTap={{ scale: isAnswered ? 1 : 0.98 }}
                                    whileHover={!isAnswered ? { y: -2, scale: 1.01 } : {}}
                                    onClick={() => handleAnswer(idx)}
                                    disabled={isAnswered}
                                    className={cn(
                                        "group relative w-full text-right p-[1px] rounded-[20px] transition-all duration-300 overflow-hidden flex flex-col h-full min-h-0",
                                        isAnswered ? "" : "hover:shadow-2xl"
                                    )}
                                >
                                    <div className={cn(
                                        "absolute inset-0 backdrop-blur-xl rounded-[24px] transition-colors duration-300",
                                        innerBg
                                    )} />
                                    
                                    <div className={cn(
                                        "absolute inset-0 rounded-[24px] border transition-colors duration-500 pointer-events-none",
                                        ringColor
                                    )} />

                                    {!isAnswered && (
                                        <div className="absolute -inset-[100%] bg-gradient-to-r from-transparent via-white/5 to-transparent rotate-[35deg] translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
                                    )}

                                    <div className="relative z-10 h-full flex justify-between items-center px-4 py-2.5 md:py-3.5 md:px-5 gap-3">
                                        <span 
                                            className={cn("font-bold leading-tight transition-colors duration-300", textColor)}
                                            style={{ fontSize: 'clamp(0.8rem, 1.8vh, 1.1rem)' }}
                                        >
                                            {option}
                                        </span>
                                        
                                        <div className="flex items-center flex-shrink-0">
                                            {!isAnswered ? (
                                                <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-[10px] md:text-xs font-black text-zinc-500 bg-white/5 transition-all group-hover:border-white/40 group-hover:text-white group-hover:scale-110">
                                                    {idx + 1}
                                                </div>
                                            ) : (
                                                <>
                                                    {isCorrect && <CheckCircle className="w-6 h-6 md:w-8 md:h-8 text-green-500 drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]" />}
                                                    {isSelected && !isCorrect && <XCircle className="w-6 h-6 md:w-8 md:h-8 text-red-500 drop-shadow-[0_0_10px_rgba(239,140,140,0.5)]" />}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </m.button>
                            );
                        })}
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isAnswered && (
                    <m.div 
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 100 }}
                        className="fixed bottom-0 left-0 right-0 p-4 pb-[env(safe-area-inset-bottom,16px)] md:p-6 bg-zinc-950/95 backdrop-blur-3xl border-t border-white/10 z-50 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]"
                        style={{ height: 'auto', maxHeight: '40dvh' }}
                    >
                        <div className="max-w-3xl mx-auto w-full h-full flex flex-col">
                            {(showHint || quizMode === "gauntlet") && (
                                <m.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-3 p-3 md:p-4 rounded-[16px] bg-white/5 border border-white/10 overflow-y-auto min-h-0"
                                >
                                    <div className="flex items-center mb-2">
                                        <Zap className="w-4 h-4 text-emerald-500 mr-2" />
                                        <span className="font-bold text-zinc-400 uppercase tracking-widest text-[10px] md:text-xs">הסבר</span>
                                    </div>
                                    <p className="text-zinc-200 font-medium leading-relaxed text-xs md:text-sm">
                                        {question.explanation}
                                    </p>
                                </m.div>
                            )}

                            <m.button
                                whileTap={{ scale: 0.96 }}
                                whileHover={{ scale: 1.01 }}
                                onClick={handleNext}
                                className={cn(
                                    "w-full py-4 md:py-5 rounded-xl md:rounded-2xl font-bold text-base md:text-lg shadow-2xl transition-all flex items-center justify-center gap-3",
                                    correctAnswers[currentQuestionIndex] ? "text-black" : "bg-red-600 text-white"
                                )}
                                style={correctAnswers[currentQuestionIndex] ? { backgroundColor: accentColor } : {}}
                            >
                                <span>
                                    {currentQuestionIndex < shuffledQuestions.length - 1 ? "לשאלה הבאה" : "סיים שיעור"}
                                </span>
                                <span className="opacity-50 text-[10px] font-normal hidden md:inline">(לחץ רווח)</span>
                            </m.button>
                        </div>
                    </m.div>
                )}
            </AnimatePresence>
        </div>
    );
}

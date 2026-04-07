"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { haptics } from "@/lib/haptics";

export type LessonStep = "story" | "quiz" | "complete";

interface UseLessonPulsesProps {
    maxPulses: number;
    hasPracticalCall: boolean;
    onQuizStart?: () => void;
}

export function useLessonPulses({ maxPulses, hasPracticalCall, onQuizStart }: UseLessonPulsesProps) {
    const [currentPulse, setCurrentPulse] = useState(0);
    const [step, setStep] = useState<LessonStep>("story");
    const [practicalCallDone, setPracticalCallDone] = useState(false);
    const [readProgress, setReadProgress] = useState(0);

    const nextPulse = useCallback(() => {
        setCurrentPulse((p) => Math.min(p + 1, maxPulses - 1));
    }, [maxPulses]);

    const prevPulse = useCallback(() => {
        setCurrentPulse((p) => Math.max(p - 1, 0));
    }, []);

    const handleSwipe = useCallback((direction: number) => {
        if (step !== "story") return;
        
        if (direction < 0) { // Forward
            if (currentPulse < maxPulses - 1) {
                nextPulse();
            } else if (!hasPracticalCall || practicalCallDone) {
                setStep("quiz");
                onQuizStart?.();
            }
        } else if (direction > 0) { // Backward
            prevPulse();
        }
    }, [step, currentPulse, maxPulses, nextPulse, prevPulse, hasPracticalCall, practicalCallDone, onQuizStart]);

    const handleReadScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
        const el = e.currentTarget;
        const progress = el.scrollTop / (el.scrollHeight - el.clientHeight || 1);
        setReadProgress(Math.min(progress, 1));
    }, []);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (step !== "story") return;
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
            
            if (e.key === "ArrowLeft") handleSwipe(-1);
            else if (e.key === "ArrowRight") handleSwipe(1);
            else if (e.key === " " || e.key === "Enter") { 
                e.preventDefault(); 
                handleSwipe(-1); 
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [step, handleSwipe]);

    return {
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
        setCurrentPulse,
    };
}


"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface LessonContextType {
    currentPulse: number;
    maxPulses: number;
    nextPulse: () => void;
    prevPulse: () => void;
    setPulse: (index: number) => void;
    isRTL: boolean;
    quizMode: "scholar" | "gauntlet" | null;
    setQuizMode: (mode: "scholar" | "gauntlet" | null) => void;
}

const LessonContext = createContext<LessonContextType | undefined>(undefined);

export function LessonProvider({ children, maxPulses = 3 }: { children: ReactNode; maxPulses?: number }) {
    const [currentPulse, setCurrentPulse] = useState(0);
    const [quizMode, setQuizMode] = useState<"scholar" | "gauntlet" | null>(null);

    const nextPulse = () => setCurrentPulse((p) => Math.min(p + 1, maxPulses - 1));
    const prevPulse = () => setCurrentPulse((p) => Math.max(p - 1, 0));
    const setPulse = (index: number) => setCurrentPulse(index);

    return (
        <LessonContext.Provider value={{
            currentPulse,
            maxPulses,
            nextPulse,
            prevPulse,
            setPulse,
            isRTL: true,
            quizMode,
            setQuizMode
        }}>
            {/* Wrapper enforcing RTL inside the context */}
            <div dir="rtl" className="w-full h-full font-sans transition-colors duration-500">
                {children}
            </div>
        </LessonContext.Provider>
    );
}

export function useLesson() {
    const context = useContext(LessonContext);
    if (context === undefined) {
        throw new Error("useLesson must be used within a LessonProvider");
    }
    return context;
}


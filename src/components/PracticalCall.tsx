"use client";

import { useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { haptics } from "@/lib/haptics";

interface PracticalCallProps {
    task: string;
    goal: string;
    tool: string;
    accentColor: string;
    courseCta?: { text: string; courseId: string };
    onDone: () => void;
    onBack: () => void;
    onNext: () => void;
}

const TOOL_LOGOS: Record<string, string> = {
    "ChatGPT": "/assets/logos/chatgpt.png",
    "Claude": "/assets/logos/claude.png",
    "Gemini": "/assets/logos/gemini.png",
};

function ToolBadge({ tool, accentColor }: { tool: string; accentColor: string }) {
    // Check if any known tool has a logo
    const toolKeys = Object.keys(TOOL_LOGOS);
    const matchedTools = toolKeys.filter(t => tool.includes(t));

    return (
        <div className="flex items-center gap-2.5 flex-wrap">
            {matchedTools.length > 0 ? (
                matchedTools.map(t => (
                    <m.div 
                        key={t}
                        whileHover={{ scale: 1.06, boxShadow: `0 0 15px ${accentColor}25` }}
                        className="flex items-center gap-2 bg-white/5 backdrop-blur-md rounded-full px-4 py-2 border border-white/10 transition-all duration-300 cursor-pointer"
                        style={{ willChange: 'transform' }}
                    >
                        <Image src={TOOL_LOGOS[t]} alt={t} width={18} height={18} className="rounded-sm" />
                        <span className="text-sm font-bold text-white tracking-wide">{t}</span>
                    </m.div>
                ))
            ) : (
                <m.div 
                    whileHover={{ scale: 1.04 }}
                    className="flex items-center gap-2 bg-white/5 backdrop-blur-md rounded-full px-4 py-2 border border-white/10 cursor-pointer"
                    style={{ willChange: 'transform' }}
                >
                    <span className="text-sm font-bold text-white tracking-wide">{tool}</span>
                </m.div>
            )}
        </div>
    );
}

export function PracticalCall({ task, goal, tool, accentColor, courseCta, onDone, onBack, onNext }: PracticalCallProps) {
    const [done, setDone] = useState(false);
    const [skipped, setSkipped] = useState(false);
    const resolved = done || skipped;

    const handleDone = () => {
        haptics.success();
        setDone(true);
        onDone();
    };

    const handleSkip = () => {
        haptics.tap();
        setSkipped(true);
        onDone();
    };

    return (
        <div className="flex flex-col h-full px-6 pt-8 md:pt-16 pb-4 overflow-y-auto no-scrollbar relative bg-transparent">
            <div className="flex-1 max-w-3xl mx-auto w-full flex flex-col pt-4">
                {/* Section header */}
                <m.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-xs md:text-sm font-extrabold mb-5 uppercase tracking-[0.2em] font-sans"
                    style={{ color: accentColor }}
                >
                    משימה מעשית
                </m.div>

                {/* Card with dynamic accent border and premium glass background */}
                <m.div
                    initial={{ opacity: 0, y: 25, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.6, type: "spring", damping: 18 }}
                    className="rounded-[24px] p-6 md:p-8 relative border border-white/10 backdrop-blur-xl transition-all duration-300"
                    style={{ 
                        borderRight: `5px solid ${accentColor}`,
                        background: "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
                        boxShadow: `0 20px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05), 0 0 30px ${accentColor}05`
                    }}
                >
                    {/* Tool badge */}
                    <m.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mb-6"
                    >
                        <ToolBadge tool={tool} accentColor={accentColor} />
                    </m.div>

                    {/* Task text */}
                    <m.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="text-white text-[19px] md:text-[21px] leading-[1.8] font-medium text-right mb-6"
                        dir="rtl"
                    >
                        {task}
                    </m.p>

                    {/* Divider */}
                    <div className="h-px w-full bg-white/10 mb-5" />

                    {/* Goal text */}
                    <m.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="text-right"
                        dir="rtl"
                    >
                        <span className="text-zinc-500 text-xs font-extrabold uppercase tracking-wide font-sans">מה לשים לב אליו:</span>
                        <p className="text-zinc-400 text-[15px] md:text-[16px] leading-[1.7] mt-1.5 font-medium">
                            {goal}
                        </p>
                    </m.div>

                    {/* Done button / congrats */}
                    <m.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="mt-8"
                    >
                        <AnimatePresence mode="wait">
                            {!resolved ? (
                                <m.div key="actions" className="flex flex-col items-center gap-3.5">
                                    <m.button
                                        whileTap={{ scale: 0.97 }}
                                        whileHover={{ scale: 1.03, boxShadow: `0 0 20px ${accentColor}30` }}
                                        onClick={handleDone}
                                        className="w-full py-4 rounded-2xl font-extrabold text-[16px] transition-all duration-300 border backdrop-blur-md"
                                        style={{
                                            backgroundColor: `${accentColor}10`,
                                            color: accentColor,
                                            borderColor: `${accentColor}40`,
                                            willChange: 'transform'
                                        }}
                                    >
                                        עשיתי את זה ✓
                                    </m.button>
                                    <m.button
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 0.6 }}
                                        whileHover={{ opacity: 1, color: "#ffffff" }}
                                        onClick={handleSkip}
                                        className="text-zinc-500 text-sm font-semibold transition-colors py-1.5"
                                    >
                                        דלג לעת עתה &larr;
                                    </m.button>
                                </m.div>
                            ) : (
                                <m.div
                                    key="done-msg"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center py-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 backdrop-blur-md flex flex-col items-center gap-1.5"
                                    style={{
                                        boxShadow: "0 10px 30px rgba(16, 185, 129, 0.05), inset 0 1px 0 rgba(16, 185, 129, 0.1)"
                                    }}
                                >
                                    <span className="text-2xl select-none animate-bounce">❇️</span>
                                    <p className="text-sm font-bold font-sans text-emerald-400 tracking-wide">
                                        {done ? "מעולה! עכשיו אפשר להמשיך למבחן 🎉" : "אפשר לחזור לזה מאוחר יותר"}
                                    </p>
                                </m.div>
                            )}
                        </AnimatePresence>
                    </m.div>
                </m.div>
            </div>

            {/* Course CTA — subtle inline card */}
            {courseCta && (
                <m.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                    className="max-w-3xl mx-auto w-full mt-4"
                    dir="rtl"
                >
                    <div style={{
                        padding: "14px 18px",
                        borderRadius: 16,
                        border: "0.5px solid rgba(255,255,255,0.08)",
                        background: "rgba(255,255,255,0.02)",
                    }} className="backdrop-blur-md">
                        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }} className="font-medium">
                            {courseCta.text}{" "}
                            <Link
                                href={`/courses/${courseCta.courseId}`}
                                style={{ color: accentColor, textDecoration: "underline", textUnderlineOffset: 3 }}
                                className="font-bold hover:text-white transition-colors"
                            >
                                לקורס NotebookLM ←
                            </Link>
                        </p>
                    </div>
                </m.div>
            )}

            {/* Navigation buttons */}
            <div className="mt-8 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] border-t border-white/10 md:pb-0 max-w-md mx-auto w-full md:mt-12 flex gap-4">
                <m.button
                    whileTap={{ scale: 0.95 }}
                    onClick={onBack}
                    className="w-16 h-14 md:h-16 flex items-center justify-center rounded-2xl border transition-all"
                    style={{
                        backgroundColor: `${accentColor}05`,
                        color: accentColor,
                        border: `1px solid ${accentColor}22`,
                        willChange: 'transform'
                    }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                </m.button>
                <m.button
                    whileTap={{ scale: 0.95 }}
                    onClick={onNext}
                    disabled={!resolved}
                    className="flex-1 py-4 rounded-2xl font-bold text-lg border transition-all duration-300"
                    style={{
                        backgroundColor: resolved ? `${accentColor}10` : "rgba(255,255,255,0.03)",
                        color: resolved ? accentColor : "rgba(255,255,255,0.2)",
                        border: `1px solid ${resolved ? `${accentColor}35` : "rgba(255,255,255,0.05)"}`,
                        cursor: resolved ? "pointer" : "not-allowed",
                        willChange: 'transform'
                    }}
                >
                    למבחן &larr;
                </m.button>
            </div>
        </div>
    );
}

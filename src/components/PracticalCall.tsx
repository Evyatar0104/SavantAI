"use client";

import { useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface PracticalCallProps {
    task: string;
    goal: string;
    tool: string;
    accentColor: string;
    onDone: () => void;
    onBack: () => void;
    onNext: () => void;
}

const TOOL_LOGOS: Record<string, string> = {
    "ChatGPT": "/assets/logos/chatgpt.png",
    "Claude": "/assets/logos/claude.png",
    "Gemini": "/assets/logos/gemini.png",
};

function ToolBadge({ tool }: { tool: string }) {
    // Check if any known tool has a logo
    const toolKeys = Object.keys(TOOL_LOGOS);
    const matchedTools = toolKeys.filter(t => tool.includes(t));

    return (
        <div className="flex items-center gap-2 flex-wrap">
            {matchedTools.length > 0 ? (
                matchedTools.map(t => (
                    <div key={t} className="flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/15">
                        <Image src={TOOL_LOGOS[t]} alt={t} width={20} height={20} className="rounded-sm" />
                        <span className="text-sm font-bold text-white">{t}</span>
                    </div>
                ))
            ) : (
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/15">
                    <span className="text-sm font-bold text-white">{tool}</span>
                </div>
            )}
        </div>
    );
}

export function PracticalCall({ task, goal, tool, accentColor, onDone, onBack, onNext }: PracticalCallProps) {
    const [done, setDone] = useState(false);
    const [skipped, setSkipped] = useState(false);
    const resolved = done || skipped;

    const handleDone = () => {
        setDone(true);
        onDone();
    };

    const handleSkip = () => {
        setSkipped(true);
        onDone();
    };

    return (
        <div className="flex flex-col h-full px-6 pt-8 md:pt-16 pb-4 overflow-y-auto no-scrollbar relative" style={{
            background: `linear-gradient(to bottom, #0A0A1A 0%, #050510 100%)`
        }}>
            <div className="flex-1 max-w-3xl mx-auto w-full flex flex-col pt-4">
                {/* Section header */}
                <m.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-sm md:text-base font-bold mb-6 uppercase tracking-[0.2em] font-sans"
                    style={{ color: "#534AB7" }}
                >
                    משימה מעשית
                </m.div>

                {/* Card with purple right border */}
                <m.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    className="rounded-2xl p-6 md:p-8 relative border border-white/10 bg-white/[0.03]"
                    style={{ borderRight: "4px solid #534AB7" }}
                >
                    {/* Tool badge */}
                    <m.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="mb-6"
                    >
                        <ToolBadge tool={tool} />
                    </m.div>

                    {/* Task text */}
                    <m.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="text-white text-[19px] md:text-[21px] leading-[1.8] font-medium text-right mb-6 font-serif"
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
                        transition={{ duration: 0.6, delay: 0.5 }}
                        className="text-right"
                        dir="rtl"
                    >
                        <span className="text-zinc-500 text-sm font-bold font-sans">מה לשים לב אליו:</span>
                        <p className="text-zinc-400 text-[15px] md:text-[16px] leading-[1.7] mt-1 font-serif">
                            {goal}
                        </p>
                    </m.div>

                    {/* Done button / congrats */}
                    <m.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        className="mt-8"
                    >
                        <AnimatePresence mode="wait">
                            {!resolved ? (
                                <m.div key="actions" className="flex flex-col items-center gap-3">
                                    <m.button
                                        whileTap={{ scale: 0.95 }}
                                        whileHover={{ scale: 1.02 }}
                                        onClick={handleDone}
                                        className="w-full py-4 rounded-2xl font-bold text-lg transition-all border"
                                        style={{
                                            backgroundColor: "#534AB715",
                                            color: "#534AB7",
                                            borderColor: "#534AB744"
                                        }}
                                    >
                                        עשיתי את זה ✓
                                    </m.button>
                                    <m.button
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 1.5 }}
                                        onClick={handleSkip}
                                        className="text-zinc-500 hover:text-zinc-300 text-sm font-medium transition-colors py-1"
                                    >
                                        דלג לעת עתה &larr;
                                    </m.button>
                                </m.div>
                            ) : (
                                <m.div
                                    key="done-msg"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center py-3"
                                >
                                    <p className="text-sm font-bold font-sans" style={{ color: "#534AB7" }}>
                                        {done ? "מעולה! עכשיו אפשר להמשיך למבחן 🎉" : "אפשר לחזור לזה מאוחר יותר"}
                                    </p>
                                </m.div>
                            )}
                        </AnimatePresence>
                    </m.div>
                </m.div>
            </div>

            {/* Navigation buttons */}
            <div className="mt-8 pt-4 pb-4 border-t border-white/10 md:pb-0 max-w-md mx-auto w-full md:mt-12 flex gap-3">
                <m.button
                    whileTap={{ scale: 0.95 }}
                    onClick={onBack}
                    className="w-16 h-14 md:h-16 flex items-center justify-center rounded-2xl border transition-all"
                    style={{
                        backgroundColor: `${accentColor}05`,
                        color: accentColor,
                        border: `1px solid ${accentColor}22`
                    }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                </m.button>
                <m.button
                    whileTap={{ scale: 0.95 }}
                    onClick={onNext}
                    disabled={!resolved}
                    className="flex-1 py-4 rounded-2xl font-bold text-lg md:text-xl border transition-all"
                    style={{
                        backgroundColor: resolved ? `${accentColor}15` : "rgba(255,255,255,0.03)",
                        color: resolved ? accentColor : "rgba(255,255,255,0.2)",
                        border: `1px solid ${resolved ? `${accentColor}44` : "rgba(255,255,255,0.05)"}`,
                        cursor: resolved ? "pointer" : "not-allowed"
                    }}
                >
                    למבחן &larr;
                </m.button>
            </div>
        </div>
    );
}

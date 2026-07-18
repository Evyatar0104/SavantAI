"use client";

import React, { useState, useRef } from "react";
import { m, AnimatePresence } from "framer-motion";
import { AlertCircle, CheckCircle, ArrowLeftRight, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
    badPrompt: string;
    goodPrompt: string;
    badOutput: string;
    goodOutput: string;
    explanation: string;
}

export function BadGoodSlider({
    badPrompt,
    goodPrompt,
    badOutput,
    goodOutput,
    explanation
}: Props) {
    const [mode, setMode] = useState<"side" | "bad" | "good">("side");
    const containerRef = useRef<HTMLDivElement>(null);
    const [dividerPercent, setDividerPercent] = useState(50);
    const [isDragging, setIsDragging] = useState(false);

    // Handle dragging/moving on the split pane slider (for desktop/larger screens)
    const handleMove = (clientX: number) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        // Since we are in RTL, the coordinates are measured from the right side
        const x = clientX - rect.left;
        const percent = Math.max(5, Math.min(95, (x / rect.width) * 100));
        setDividerPercent(percent);
    };

    const handlePointerDown = () => {
        setIsDragging(true);
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isDragging) return;
        handleMove(e.clientX);
    };

    const handlePointerUp = () => {
        setIsDragging(false);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (e.touches.length === 0) return;
        handleMove(e.touches[0].clientX);
    };

    return (
        <div className="w-full bg-zinc-950/60 border border-zinc-800/80 rounded-2xl p-6 backdrop-blur-md font-sans text-right select-none shadow-2xl relative overflow-hidden" dir="rtl">
            <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/5 rounded-full filter blur-[80px] pointer-events-none" />
            
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-zinc-800/60 pb-5">
                <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2.5">
                        <Sparkles className="w-5 h-5 text-emerald-400" />
                        השוואת פרומפטים: רע לעומת טוב
                    </h3>
                    <p className="text-sm text-zinc-400 mt-1">גרור את הידית או לחץ על הלשוניות כדי לראות את ההבדל העצום בתוצאה</p>
                </div>
                
                {/* Mode Selector Tabs */}
                <div className="flex bg-zinc-900 border border-zinc-800 p-1.5 rounded-xl self-start md:self-auto z-10">
                    {(["bad", "side", "good"] as const).map((mType) => (
                        <button
                            key={mType}
                            onClick={() => setMode(mType)}
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 ${
                                mode === mType
                                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/10"
                                    : "text-zinc-400 hover:text-zinc-200"
                            }`}
                        >
                            {mType === "bad" ? "הפרומפט הגרוע" : mType === "side" ? "השוואה חזותית" : "הפרומפט המעולה"}
                        </button>
                    ))}
                </div>
            </div>

            {/* Explanation box */}
            <div className="bg-zinc-900/40 border border-zinc-800/40 p-4 rounded-xl mb-6 text-zinc-300 text-sm leading-relaxed">
                <strong className="text-white block mb-1">ניתוח המומחה:</strong>
                {explanation}
            </div>

            {/* Desktop Drag Split Slider view */}
            {mode === "side" && (
                <div 
                    ref={containerRef}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerLeave={handlePointerUp}
                    onTouchMove={handleTouchMove}
                    className="relative w-full min-h-[380px] bg-zinc-900 rounded-xl border border-zinc-800/60 overflow-hidden cursor-ew-resize select-none"
                >
                    {/* Bad prompt layer (Left side - visible normally under overlay) */}
                    <div className="absolute inset-0 w-full h-full p-5 flex flex-col justify-between bg-zinc-900 pointer-events-none select-none">
                        <div className="flex justify-between items-center mb-4 border-b border-zinc-800/50 pb-2">
                            <span className="flex items-center gap-1.5 text-xs text-rose-400 font-bold bg-rose-950/30 px-2.5 py-1 rounded-lg border border-rose-500/10">
                                <AlertCircle className="w-3.5 h-3.5" />
                                גרוע ולא ממוקד
                            </span>
                            <span className="text-zinc-500 font-mono text-[10px]">BEFORE</span>
                        </div>
                        <div className="flex-1 space-y-4 text-right" dir="rtl">
                            <div>
                                <span className="text-[10px] text-zinc-500 block mb-1.5 font-semibold">הפרומפט שנשלח:</span>
                                <p className="text-sm font-mono text-zinc-400 bg-zinc-950/40 p-3 rounded-lg border border-zinc-800/20 max-w-[90%] leading-relaxed select-none">
                                    &quot;{badPrompt}&quot;
                                </p>
                            </div>
                            <div className="pt-2">
                                <span className="text-[10px] text-zinc-500 block mb-1.5 font-semibold">תוצאת המודל:</span>
                                <div className="text-sm text-zinc-400 bg-zinc-950/60 p-3.5 rounded-lg border border-zinc-800/30 italic max-w-[85%] select-none">
                                    {badOutput}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Good prompt layer (Right side overlay - dynamically clipped) */}
                    <div 
                        className="absolute inset-y-0 right-0 h-full bg-[#111C15] border-l border-emerald-500/10 p-5 flex flex-col justify-between overflow-hidden pointer-events-none select-none"
                        style={{ width: `${dividerPercent}%` }}
                    >
                        {/* Force the inner element to keep a fixed width matching the container so it doesn't compress or squash */}
                        <div className="w-[100%] min-w-[320px] md:min-w-[600px] h-full flex flex-col justify-between">
                            <div className="flex justify-between items-center mb-4 border-b border-emerald-950/40 pb-2">
                                <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold bg-emerald-950/50 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                                    <CheckCircle className="w-3.5 h-3.5" />
                                    מקצועי ומובנה
                                </span>
                                <span className="text-emerald-500/60 font-mono text-[10px] pl-6">AFTER</span>
                            </div>
                            <div className="flex-1 space-y-4 text-right" dir="rtl">
                                <div>
                                    <span className="text-[10px] text-emerald-500/60 block mb-1.5 font-semibold">הפרומפט המשופר:</span>
                                    <p className="text-sm font-mono text-emerald-100 bg-zinc-950/30 p-3 rounded-lg border border-emerald-500/10 max-w-[90%] leading-relaxed select-none">
                                        &quot;{goodPrompt}&quot;
                                    </p>
                                </div>
                                <div className="pt-2">
                                    <span className="text-[10px] text-emerald-500/60 block mb-1.5 font-semibold">תוצאת המודל האיכותית:</span>
                                    <div className="text-sm text-emerald-200 bg-emerald-950/20 p-3.5 rounded-lg border border-emerald-500/20 leading-relaxed max-w-[85%] select-none">
                                        {goodOutput}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Draggable Divider Bar */}
                    <div 
                        onPointerDown={handlePointerDown}
                        className="absolute inset-y-0 bottom-0 top-0 w-1 bg-emerald-500/70 cursor-ew-resize flex items-center justify-center select-none"
                        style={{ left: `${dividerPercent}%` }}
                    >
                        <div className={`w-8 h-8 bg-emerald-600 rounded-full border-2 border-zinc-950 flex items-center justify-center shadow-lg transition-transform ${isDragging ? 'scale-110 bg-emerald-500' : 'hover:scale-105'}`}>
                            <ArrowLeftRight className="w-3.5 h-3.5 text-white" />
                        </div>
                    </div>
                </div>
            )}

            {/* Split Individual Tab views for mobile/precise reading */}
            {mode !== "side" && (
                <div className="min-h-[300px] w-full bg-zinc-900 border border-zinc-800 rounded-xl p-5 relative overflow-hidden">
                    <AnimatePresence mode="wait">
                        {mode === "bad" ? (
                            <m.div
                                key="bad-panel"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-4"
                            >
                                <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                                    <span className="flex items-center gap-1.5 text-xs text-rose-400 font-bold bg-rose-950/30 px-2.5 py-1 rounded-lg border border-rose-500/10">
                                        <AlertCircle className="w-3.5 h-3.5" />
                                        גרוע ולא ממוקד (ללא הקשר)
                                    </span>
                                    <span className="text-zinc-500 font-mono text-[10px]">BEFORE</span>
                                </div>
                                <div className="space-y-4 text-right">
                                    <div>
                                        <span className="text-xs text-zinc-500 block mb-1.5 font-semibold">הפרומפט הגרוע:</span>
                                        <p className="text-sm font-mono text-zinc-300 bg-zinc-950 p-3 rounded-lg border border-zinc-800/80 leading-relaxed">
                                            &quot;{badPrompt}&quot;
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-xs text-zinc-500 block mb-1.5 font-semibold">תוצאה בנאלית ומאכזבת:</span>
                                        <div className="text-sm text-zinc-400 bg-zinc-950/50 p-3.5 rounded-lg border border-zinc-800/40 italic">
                                            {badOutput}
                                        </div>
                                    </div>
                                </div>
                            </m.div>
                        ) : (
                            <m.div
                                key="good-panel"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-4"
                            >
                                <div className="flex justify-between items-center border-b border-emerald-950/60 pb-2">
                                    <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold bg-emerald-950/50 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                                        <CheckCircle className="w-3.5 h-3.5" />
                                        פרומפט מובנה, מדוייק ואיכותי
                                    </span>
                                    <span className="text-emerald-500/60 font-mono text-[10px]">AFTER</span>
                                </div>
                                <div className="space-y-4 text-right">
                                    <div>
                                        <span className="text-xs text-emerald-500/60 block mb-1.5 font-semibold">הפרומפט המשופר (הכולל תפקיד, מגבלות ופורמט):</span>
                                        <p className="text-sm font-mono text-emerald-100 bg-[#111C15] p-3 rounded-lg border border-emerald-800/40 leading-relaxed">
                                            &quot;{goodPrompt}&quot;
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-xs text-emerald-500/60 block mb-1.5 font-semibold">תוצאה מרהיבה ומובנית:</span>
                                        <div className="text-sm text-emerald-200 bg-emerald-950/20 p-3.5 rounded-lg border border-emerald-500/20 leading-relaxed font-sans">
                                            {goodOutput}
                                        </div>
                                    </div>
                                </div>
                            </m.div>
                        )}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}

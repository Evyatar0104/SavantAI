"use client";

import React, { useState, useMemo, useEffect } from "react";
import { m, AnimatePresence } from "framer-motion";
import { Sparkles, Play, RotateCcw, AlertTriangle, CheckCircle } from "lucide-react";

interface TokenOption {
    token: string;
    logit: number; // raw model score before temperature
}

interface Props {
    prompt: string;
    options: TokenOption[];
}

const defaultOptions: TokenOption[] = [
    { token: "נפלא", logit: 3.8 },
    { token: "חם", logit: 2.9 },
    { token: "משוגע", logit: 1.8 },
    { token: "מוזר", logit: 1.1 },
    { token: "סוער", logit: 0.3 }
];

export function TemperatureVisualizer({ prompt = "מזג האוויר היום פשוט...", options = defaultOptions }: Props) {
    const [temp, setTemp] = useState<number>(0.7);
    const [sampledToken, setSampledToken] = useState<string | null>(null);
    const [isSampling, setIsSampling] = useState<boolean>(false);
    const [sampleLog, setSampleLog] = useState<string[]>([]);

    // Calculate probabilities using softmax with temperature
    const normalizedData = useMemo(() => {
        // Handle temp close to 0 to avoid division by zero
        const activeTemp = Math.max(temp, 0.05);
        
        // Calculate e^(logit / temp)
        const expValues = options.map(opt => ({
            ...opt,
            exp: Math.exp(opt.logit / activeTemp)
        }));
        
        const sumExp = expValues.reduce((acc, curr) => acc + curr.exp, 0);
        
        // Calculate probability
        return expValues.map(item => ({
            token: item.token,
            logit: item.logit,
            probability: (item.exp / sumExp) * 100
        })).sort((a, b) => b.probability - a.probability);
    }, [temp, options]);

    // Weighted sampling function based on our calculated probabilities
    const handleSample = () => {
        if (isSampling) return;
        setIsSampling(true);
        setSampledToken(null);

        // Simulation delay for micro-animation satisfaction
        let iterations = 0;
        const interval = setInterval(() => {
            // Pick a random token from options to flicker
            const tempPick = options[Math.floor(Math.random() * options.length)].token;
            setSampledToken(tempPick);
            iterations++;
            
            if (iterations > 8) {
                clearInterval(interval);
                
                // Final selection based on real probabilities
                const rand = Math.random() * 100;
                let cumulativeProb = 0;
                let selected = normalizedData[normalizedData.length - 1].token;
                
                for (const item of normalizedData) {
                    cumulativeProb += item.probability;
                    if (rand <= cumulativeProb) {
                        selected = item.token;
                        break;
                    }
                }
                
                setSampledToken(selected);
                setIsSampling(false);
                setSampleLog(prev => [selected, ...prev.slice(0, 4)]);
            }
        }, 80);
    };

    const resetSimulator = () => {
        setSampledToken(null);
        setSampleLog([]);
        setTemp(0.7);
    };

    // Description metadata of current temperature status
    const tempStatus = useMemo(() => {
        if (temp <= 0.2) {
            return {
                title: "שמרני וצפוי לחלוטין (Deterministic)",
                desc: "המודל תמיד יבחר במילה ההסתברותית ביותר. יצירתיות אפסית, מעולה לעובדות או קוד.",
                color: "text-emerald-400 border-emerald-500/20 bg-emerald-950/20",
                iconColor: "text-emerald-400"
            };
        } else if (temp <= 0.8) {
            return {
                title: "מאוזן ויצירתי במידה (Balanced)",
                desc: "בחירות הגיוניות לצד גיוון קל. זהו ערך ברירת המחדל ברוב מודלי השפה.",
                color: "text-indigo-400 border-indigo-500/20 bg-indigo-950/20",
                iconColor: "text-indigo-400"
            };
        } else if (temp <= 1.2) {
            return {
                title: "יצירתי והרפתקני (Creative)",
                desc: "מילים פחות נפוצות מקבלות סיכוי ממשי. מעולה לכתיבה ספרותית, סיעור מוחות או שיווק.",
                color: "text-amber-400 border-amber-500/20 bg-amber-950/20",
                iconColor: "text-amber-400"
            };
        } else {
            return {
                title: "כאוטי ובלתי צפוי (Chaotic)",
                desc: "התפלגות שטוחה לחלוטין. המודל עלול להמציא מילים או לאבד קשר ללוגיקה של המשפט.",
                color: "text-rose-400 border-rose-500/20 bg-rose-950/20",
                iconColor: "text-rose-400"
            };
        }
    }, [temp]);

    return (
        <div className="w-full bg-zinc-950/60 border border-zinc-800/80 rounded-2xl p-6 backdrop-blur-md font-sans text-right select-none shadow-2xl relative overflow-hidden" dir="rtl">
            <div className="absolute top-0 left-0 w-72 h-72 bg-violet-500/5 rounded-full filter blur-[80px] pointer-events-none" />
            
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-zinc-800/60 pb-5">
                <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2.5">
                        <Sparkles className="w-5 h-5 text-violet-400" />
                        מדד ההסתברות והטמפרטורה (Temperature)
                    </h3>
                    <p className="text-sm text-zinc-400 mt-1">ראה כיצד שינוי ה&apos;חום&apos; משפיע על פיזור ההסתברויות לבחירת המילה הבאה</p>
                </div>
                
                <button
                    onClick={resetSimulator}
                    className="p-2 border border-zinc-800 rounded-xl hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 self-start md:self-auto transition-colors duration-200"
                    title="אפס סימולטור"
                >
                    <RotateCcw className="w-4 h-4" />
                </button>
            </div>

            {/* Input Context Box */}
            <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-4 mb-6">
                <span className="text-xs text-zinc-500 block mb-1">הקלט למודל (Prompt):</span>
                <p className="text-base text-zinc-300 font-medium">
                    &quot;{prompt}&quot; <span className="text-violet-400 animate-pulse font-bold">| [המילה הבאה?]</span>
                </p>
            </div>

            {/* Slider Control */}
            <div className="bg-zinc-900/40 border border-zinc-800/30 rounded-xl p-5 mb-6">
                <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-semibold text-zinc-400">טמפרטורה (Temperature):</span>
                    <span className="text-lg font-mono font-bold text-violet-400 bg-violet-950/40 px-2.5 py-0.5 rounded-lg border border-violet-500/20">{temp.toFixed(2)}</span>
                </div>
                <input
                    type="range"
                    min="0.1"
                    max="1.5"
                    step="0.05"
                    value={temp}
                    onChange={(e) => setTemp(parseFloat(e.target.value))}
                    className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-violet-500 focus:outline-none"
                />
                <div className="flex justify-between text-[10px] text-zinc-500 font-mono mt-2 px-1">
                    <span>0.1 (צפוי מראש)</span>
                    <span>0.7 (מאוזן)</span>
                    <span>1.5 (כאוטי ויצירתי)</span>
                </div>
            </div>

            {/* Live Status Card */}
            <m.div
                key={tempStatus.title}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className={`border p-4 rounded-xl mb-6 text-sm flex gap-3 transition-all duration-300 ${tempStatus.color}`}
            >
                {temp <= 0.2 ? (
                    <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
                ) : temp >= 1.25 ? (
                    <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 animate-bounce" />
                ) : (
                    <Sparkles className="w-5 h-5 shrink-0 mt-0.5" />
                )}
                <div>
                    <strong className="block text-white mb-0.5 font-bold">{tempStatus.title}</strong>
                    <span className="opacity-90">{tempStatus.desc}</span>
                </div>
            </m.div>

            {/* Probability Bars Chart */}
            <div className="mb-6">
                <span className="text-xs font-medium text-zinc-400 block mb-4 mr-1">התפלגות הסתברויות למילה הבאה:</span>
                <div className="space-y-3.5">
                    {normalizedData.map((item) => {
                        const isSampled = sampledToken === item.token;
                        return (
                            <div key={item.token} className="relative flex items-center justify-between">
                                {/* Token Name Label */}
                                <div className="w-20 font-bold text-sm text-zinc-200 flex items-center gap-1.5 shrink-0">
                                    <span className="font-mono text-zinc-500 text-xs">&quot;</span>
                                    {item.token}
                                    <span className="font-mono text-zinc-500 text-xs">&quot;</span>
                                </div>

                                {/* Probability bar */}
                                <div className="flex-1 mx-4 bg-zinc-900 h-6 rounded-lg overflow-hidden relative border border-zinc-800/40">
                                    <m.div
                                        className={`h-full rounded-r-md transition-all duration-300 ${
                                            isSampled
                                                ? "bg-gradient-to-r from-violet-500 to-fuchsia-500"
                                                : "bg-gradient-to-r from-indigo-600/80 to-violet-600/80"
                                        }`}
                                        animate={{ width: `${item.probability}%` }}
                                        transition={{ type: "spring", stiffness: 120, damping: 20 }}
                                    />
                                    {isSampled && (
                                        <div className="absolute inset-0 bg-white/10 animate-pulse pointer-events-none" />
                                    )}
                                </div>

                                {/* Probability label */}
                                <div className="w-14 text-left font-mono text-xs font-semibold text-zinc-400 shrink-0">
                                    {item.probability.toFixed(1)}%
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Interactive Sampling Button */}
            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between border-t border-zinc-900 pt-5">
                <button
                    onClick={handleSample}
                    disabled={isSampling}
                    className={`flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 shadow-lg ${
                        isSampling
                            ? "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700/50"
                            : "bg-violet-600 hover:bg-violet-500 text-white shadow-violet-600/10 hover:shadow-violet-600/20 active:scale-95 border border-violet-500/30"
                    }`}
                >
                    <Play className={`w-4 h-4 ${isSampling ? "animate-spin" : ""}`} />
                    {isSampling ? "דוגם כעת..." : "בחר מילה אקראית (Weighted Sample)"}
                </button>

                {/* Selected Output Showcase */}
                <div className="flex items-center gap-3">
                    <span className="text-xs text-zinc-500">בחירה:</span>
                    <div className="min-w-[120px] bg-zinc-900 border border-zinc-800 px-4 py-2.5 rounded-xl text-center relative overflow-hidden">
                        <AnimatePresence mode="wait">
                            {sampledToken ? (
                                <m.span
                                    key={sampledToken}
                                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.8, y: -10 }}
                                    className={`text-base font-bold tracking-wide block ${
                                        isSampling ? "text-zinc-500" : "text-violet-400"
                                    }`}
                                >
                                    {sampledToken}
                                </m.span>
                            ) : (
                                <span className="text-zinc-600 text-sm block">-</span>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Sampled History Log */}
            {sampleLog.length > 0 && (
                <m.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-5 pt-4 border-t border-zinc-900/60 flex items-center gap-3.5 text-xs text-zinc-500 overflow-hidden"
                >
                    <span className="shrink-0 font-medium text-zinc-400">היסטוריית בחירות:</span>
                    <div className="flex gap-2 overflow-x-auto py-1 scrollbar-none" dir="rtl">
                        {sampleLog.map((log, i) => (
                            <span 
                                key={i}
                                className={`px-2.5 py-1 rounded-lg border font-medium ${
                                    i === 0 
                                        ? "bg-violet-950/30 border-violet-800/40 text-violet-300"
                                        : "bg-zinc-900 border-zinc-800 text-zinc-400 opacity-60"
                                }`}
                            >
                                {log}
                            </span>
                        ))}
                    </div>
                </m.div>
            )}
        </div>
    );
}

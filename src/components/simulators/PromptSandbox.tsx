"use client";

import React, { useState, useMemo } from "react";
import { m, AnimatePresence } from "framer-motion";
import { Play, Sparkles, Code, CheckCircle, Info, RefreshCw, AlertTriangle } from "lucide-react";

interface VariableConfig {
    name: string;
    label: string;
    placeholder: string;
}

interface Props {
    systemInstructions: string;
    variables: VariableConfig[];
    idealPromptStructure: string;
    sampleSuccessResponses: Record<string, string>; // Maps variable-matching themes to response text
}

export function PromptSandbox({
    systemInstructions,
    variables,
    idealPromptStructure,
    sampleSuccessResponses
}: Props) {
    // State to hold user input for each variable
    const [inputs, setInputs] = useState<Record<string, string>>(() => {
        const initial: Record<string, string> = {};
        variables.forEach(v => {
            initial[v.name] = "";
        });
        return initial;
    });

    const [userSystemPrompt, setUserSystemPrompt] = useState(systemInstructions);
    const [isCompiling, setIsCompiling] = useState(false);
    const [compileStep, setCompileStep] = useState("");
    const [compiledPrompt, setCompiledPrompt] = useState<string | null>(null);
    const [simulatedResponse, setSimulatedResponse] = useState<string | null>(null);
    const [smartFeedback, setSmartFeedback] = useState<{
        score: number;
        success: boolean;
        tips: string[];
    } | null>(null);

    const handleInputChange = (name: string, val: string) => {
        setInputs(prev => ({ ...prev, [name]: val }));
    };

    const isRunEnabled = useMemo(() => {
        return Object.values(inputs).some(v => v.trim() !== "");
    }, [inputs]);

    const handleCompileAndRun = () => {
        if (!isRunEnabled || isCompiling) return;

        setIsCompiling(true);
        setCompiledPrompt(null);
        setSimulatedResponse(null);
        setSmartFeedback(null);

        // Fun mock-compiler steps showing high-end tech feelings
        const steps = [
            "טוען הגדרות סיסטם...",
            "ממזג משתני קלט לתוך הפרומפט...",
            "מבצע אופטימיזציה קלה...",
            "מריץ מול מודל שפה מדומה..."
        ];

        let index = 0;
        setCompileStep(steps[0]);

        const interval = setInterval(() => {
            index++;
            if (index < steps.length) {
                setCompileStep(steps[index]);
            } else {
                clearInterval(interval);
                setIsCompiling(false);

                // Build the final compiled prompt string
                let tempPrompt = idealPromptStructure;
                Object.entries(inputs).forEach(([key, val]) => {
                    tempPrompt = tempPrompt.replace(`{{${key}}}`, val || `[ללא ערך]`);
                });

                setCompiledPrompt(tempPrompt);

                // Smart simulation feedback engine:
                const filledCount = Object.values(inputs).filter(v => v.trim() !== "").length;
                const totalCount = variables.length;
                
                // Let's analyze prompt quality
                const hasFormatRequest = tempPrompt.includes("פורמט") || tempPrompt.includes("טבלה") || tempPrompt.includes("רשימה") || userSystemPrompt.includes("פורמט");
                const systemPromptLength = userSystemPrompt.trim().length;

                let score = 50; // base score
                const tips: string[] = [];

                if (filledCount === totalCount) {
                    score += 20;
                } else {
                    tips.push("נסה למלא את כל תיבות המשתנים כדי לקבל תוצאה מותאמת ומלאה.");
                }

                if (systemPromptLength > 40) {
                    score += 15;
                } else {
                    tips.push("הנחיות הסיסטם (System Instructions) קצרות יחסית. הוספת תפקיד ברור ('אתה מומחה ל...') תשפר את התוצאה.");
                }

                if (hasFormatRequest) {
                    score += 15;
                } else {
                    tips.push("שקול להגדיר פורמט פלט מבוקש (כגון: 'הצג כרשימה' או 'ענה ב-3 פסקאות') לקבלת תוצאה קריאה יותר.");
                }

                // Make sure score is within bounds
                score = Math.min(100, Math.max(20, score));

                // Find matching sample response or fallback
                let finalResponse = "הפרומפט שלך הורכב בהצלחה! מודל השפה קיבל את המשתנים ועיבד אותם בהתאם להנחיות הסיסטם המוגדרות.";
                
                // Match key words in the inputs to generate realistic simulated text
                const joinedInputString = Object.values(inputs).join(" ").toLowerCase();
                let matched = false;
                
                for (const [keyTheme, sampleText] of Object.entries(sampleSuccessResponses)) {
                    if (joinedInputString.includes(keyTheme) || keyTheme === "default") {
                        finalResponse = sampleText;
                        matched = true;
                        if (keyTheme !== "default") break;
                    }
                }

                setSimulatedResponse(finalResponse);
                setSmartFeedback({
                    score,
                    success: score >= 75,
                    tips: tips.length > 0 ? tips : ["כל הכבוד! בנית פרומפט מצוין ומובנה היטב."]
                });
            }
        }, 600);
    };

    const handleReset = () => {
        const resetInputs: Record<string, string> = {};
        variables.forEach(v => {
            resetInputs[v.name] = "";
        });
        setInputs(resetInputs);
        setUserSystemPrompt(systemInstructions);
        setCompiledPrompt(null);
        setSimulatedResponse(null);
        setSmartFeedback(null);
    };

    return (
        <div className="w-full bg-zinc-950/60 border border-zinc-800/80 rounded-2xl p-6 backdrop-blur-md font-sans text-right select-none shadow-2xl relative overflow-hidden" dir="rtl">
            <div className="absolute top-0 left-0 w-72 h-72 bg-emerald-500/5 rounded-full filter blur-[80px] pointer-events-none" />
            
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-zinc-800/60 pb-5">
                <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2.5">
                        <Sparkles className="w-5 h-5 text-emerald-400" />
                        ארגז חול לפרומפטים (Prompt Sandbox)
                    </h3>
                    <p className="text-sm text-zinc-400 mt-1">הרכב את הפרומפט שלך בעזרת משתנים, והרץ סימולציית פלט של מודל שפה</p>
                </div>
                
                <button
                    onClick={handleReset}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-zinc-800 rounded-xl hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 text-xs transition-colors duration-200 self-start md:self-auto"
                >
                    <RefreshCw className="w-3.5 h-3.5" />
                    אפס ארגז חול
                </button>
            </div>

            {/* System instructions configuration */}
            <div className="mb-5 bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-4">
                <label className="block text-xs font-semibold text-zinc-400 mb-2 mr-1 flex items-center gap-1.5">
                    <Code className="w-3.5 h-3.5 text-zinc-500" />
                    הנחיות מערכת (System Instructions):
                </label>
                <textarea
                    value={userSystemPrompt}
                    onChange={(e) => setUserSystemPrompt(e.target.value)}
                    rows={2}
                    className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg px-3.5 py-2.5 text-zinc-200 font-mono text-xs leading-relaxed resize-none focus:outline-none"
                    placeholder="הגדר כאן את תפקיד המודל ומגבלותיו..."
                />
            </div>

            {/* Variables input block */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {variables.map((v) => (
                    <div key={v.name} className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-zinc-400 mr-1">
                            {v.label}:
                        </label>
                        <input
                            type="text"
                            value={inputs[v.name]}
                            onChange={(e) => handleInputChange(v.name, e.target.value)}
                            placeholder={v.placeholder}
                            className="bg-zinc-900 border border-zinc-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none placeholder-zinc-600"
                        />
                    </div>
                ))}
            </div>

            {/* Run CTA bar */}
            <div className="flex items-center justify-between gap-4 border-t border-zinc-900 pt-5">
                <button
                    onClick={handleCompileAndRun}
                    disabled={!isRunEnabled || isCompiling}
                    className={`flex items-center gap-2.5 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 shadow-lg ${
                        !isRunEnabled
                            ? "bg-zinc-900 text-zinc-600 border border-zinc-800/40 cursor-not-allowed"
                            : isCompiling
                            ? "bg-zinc-800 text-zinc-400 cursor-not-allowed border border-zinc-700/50"
                            : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/10 hover:shadow-emerald-600/20 active:scale-95 border border-emerald-500/30"
                    }`}
                >
                    <Play className={`w-4 h-4 ${isCompiling ? "animate-spin" : ""}`} />
                    {isCompiling ? "מפענח ומריץ..." : "הרכב והרץ פרומפט"}
                </button>
                
                {!isRunEnabled && (
                    <span className="text-xs text-zinc-500 flex items-center gap-1.5">
                        <Info className="w-3.5 h-3.5" />
                        מלא לפחות שדה אחד כדי להריץ
                    </span>
                )}
            </div>

            {/* Compiler screen showing step load animations */}
            <AnimatePresence>
                {isCompiling && (
                    <m.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-6 bg-zinc-900 border border-zinc-800 rounded-xl p-5 text-center flex flex-col items-center justify-center gap-3.5 min-h-[140px]"
                    >
                        <RefreshCw className="w-6 h-6 text-emerald-400 animate-spin" />
                        <span className="text-sm font-semibold text-zinc-300 animate-pulse">{compileStep}</span>
                    </m.div>
                )}
            </AnimatePresence>

            {/* Final outputs display */}
            <AnimatePresence>
                {compiledPrompt && simulatedResponse && smartFeedback && !isCompiling && (
                    <m.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-6 border-t border-zinc-900 pt-6 space-y-5"
                    >
                        {/* Compiled Prompt representation */}
                        <div>
                            <span className="text-xs font-semibold text-zinc-500 block mb-2 mr-1">הפרומפט המורכב שנשלח למודל:</span>
                            <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-4 font-mono text-xs text-zinc-400 leading-relaxed max-h-[100px] overflow-y-auto">
                                <span className="text-emerald-500/80 font-bold block mb-1"># SYSTEM INSTRUCTIONS:</span>
                                {userSystemPrompt}
                                <span className="text-indigo-500/80 font-bold block mt-3 mb-1"># USER PROMPT:</span>
                                {compiledPrompt}
                            </div>
                        </div>

                        {/* Simulated Model Response */}
                        <div className="bg-zinc-900/40 border border-zinc-800/40 rounded-xl p-5">
                            <span className="text-xs text-emerald-400 font-bold block mb-2.5 flex items-center gap-1.5">
                                <Sparkles className="w-4 h-4" />
                                תשובת מודל השפה (Simulated Output):
                            </span>
                            <div className="text-sm text-zinc-200 leading-relaxed font-sans whitespace-pre-line">
                                {simulatedResponse}
                            </div>
                        </div>

                        {/* Intelligent Feedback assessment */}
                        <div className="bg-zinc-900/80 border border-zinc-800/80 rounded-xl p-5 flex flex-col md:flex-row gap-5 items-stretch md:items-center">
                            {/* Score ring */}
                            <div className="flex flex-col items-center justify-center shrink-0 border-b md:border-b-0 md:border-l border-zinc-800 pb-4 md:pb-0 md:pl-5">
                                <span className="text-xs text-zinc-500 font-semibold mb-1">ציון פרומפט</span>
                                <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center font-mono text-lg font-bold ${
                                    smartFeedback.score >= 80 
                                        ? "border-emerald-500/20 text-emerald-400" 
                                        : smartFeedback.score >= 60 
                                        ? "border-amber-500/20 text-amber-400" 
                                        : "border-rose-500/20 text-rose-400"
                                }`}>
                                    {smartFeedback.score}
                                </div>
                            </div>

                            {/* Bullet Tips */}
                            <div className="flex-1 space-y-2">
                                <span className="text-xs font-semibold text-zinc-400 block mb-1">משוב חכם של המערכת:</span>
                                {smartFeedback.tips.map((tip, i) => (
                                    <div key={i} className="flex gap-2 text-xs leading-relaxed text-zinc-300">
                                        {smartFeedback.score >= 75 ? (
                                            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                        ) : (
                                            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                                        )}
                                        <span>{tip}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </m.div>
                )}
            </AnimatePresence>
        </div>
    );
}

"use client";

import React, { useState, useMemo } from "react";
import { m, AnimatePresence } from "framer-motion";
import { Check, Info, Sparkles, Layers } from "lucide-react";

interface Props {
    defaultText: string;
    language: "he" | "en";
    explanation: string;
}

type TokenizerType = "subword" | "word" | "character";

// Simple hash function to generate consistent token IDs and background colors
function getHashData(str: string): { id: number; colorClass: string; textColor: string } {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const id = Math.abs(hash % 90000) + 10000;
    
    // Aesthetic, harmonious dark-mode neon/pastel palette
    const colors = [
        { bg: "bg-indigo-950/40 border-indigo-500/30 text-indigo-200", text: "text-indigo-400" },
        { bg: "bg-emerald-950/40 border-emerald-500/30 text-emerald-200", text: "text-emerald-400" },
        { bg: "bg-violet-950/40 border-violet-500/30 text-violet-200", text: "text-violet-400" },
        { bg: "bg-rose-950/40 border-rose-500/30 text-rose-200", text: "text-rose-400" },
        { bg: "bg-amber-950/40 border-amber-500/30 text-amber-200", text: "text-amber-400" },
        { bg: "bg-cyan-950/40 border-cyan-500/30 text-cyan-200", text: "text-cyan-400" },
        { bg: "bg-fuchsia-950/40 border-fuchsia-500/30 text-fuchsia-200", text: "text-fuchsia-400" },
    ];
    
    const index = Math.abs(hash % colors.length);
    return { id, colorClass: colors[index].bg, textColor: colors[index].text };
}

// Subword Hebrew and English parser to simulate Byte-Pair Encoding (BPE)
function simulateTokenize(text: string, type: TokenizerType): Array<{ text: string; id: number; colorClass: string; textColor: string }> {
    if (!text) return [];

    if (type === "character") {
        return text.split("").map(char => {
            const data = getHashData(char);
            return {
                text: char === " " ? "␣" : char,
                ...data
            };
        });
    }

    if (type === "word") {
        // Split by spaces but preserve spaces as tokens or separators
        const parts = text.split(/(\s+)/);
        return parts.filter(Boolean).map(part => {
            const isSpace = /^\s+$/.test(part);
            const display = isSpace ? "␣".repeat(part.length) : part;
            const data = getHashData(part);
            return {
                text: display,
                ...data
            };
        });
    }

    // Default: "subword" (AI style BPE simulation)
    // Custom subword tokenizer focusing on Hebrew prefixes and English suffixes
    const words = text.split(/(\s+)/).filter(Boolean);
    const result: Array<{ text: string; id: number; colorClass: string; textColor: string }> = [];

    const hebrewPrefixes = ["וה", "ומ", "וש", "ה", "ו", "ב", "ל", "מ", "ש", "כ"];
    const englishSuffixes = ["ing", "ly", "ed", "es", "s", "ment", "tion", "ness", "able", "al"];
    const englishPrefixes = ["un", "re", "de", "pre", "dis", "in"];

    words.forEach(word => {
        if (/^\s+$/.test(word)) {
            const data = getHashData(word);
            result.push({
                text: "␣".repeat(word.length),
                ...data
            });
            return;
        }

        // Simulating Hebrew word splitting
        if (/[\u0590-\u05FF]/.test(word)) {
            let tempWord = word;
            let matchedPrefix = "";

            // Check Hebrew prefixes
            for (const prefix of hebrewPrefixes) {
                if (tempWord.startsWith(prefix) && tempWord.length > prefix.length + 1) {
                    matchedPrefix = prefix;
                    tempWord = tempWord.slice(prefix.length);
                    break;
                }
            }

            if (matchedPrefix) {
                const pData = getHashData(matchedPrefix);
                result.push({ text: matchedPrefix, ...pData });
            }

            // Check suffixes for Hebrew (e.g. ים, ות, נו)
            const hebrewSuffixes = ["נו", "ים", "ות", "כם", "הן", "ה"];
            let matchedSuffix = "";
            for (const suffix of hebrewSuffixes) {
                if (tempWord.endsWith(suffix) && tempWord.length > suffix.length + 1) {
                    matchedSuffix = suffix;
                    tempWord = tempWord.slice(0, -suffix.length);
                    break;
                }
            }

            const wData = getHashData(tempWord + (matchedSuffix ? "##" : ""));
            result.push({ 
                text: matchedPrefix ? `##${tempWord}` : tempWord, 
                ...wData 
            });

            if (matchedSuffix) {
                const sData = getHashData(matchedSuffix);
                result.push({ text: `##${matchedSuffix}`, ...sData });
            }
        } 
        // Simulating English word splitting
        else {
            let tempWord = word;
            let matchedPrefix = "";

            for (const prefix of englishPrefixes) {
                if (tempWord.toLowerCase().startsWith(prefix) && tempWord.length > prefix.length + 2) {
                    matchedPrefix = prefix;
                    tempWord = tempWord.slice(prefix.length);
                    break;
                }
            }

            if (matchedPrefix) {
                const pData = getHashData(matchedPrefix);
                result.push({ text: matchedPrefix, ...pData });
            }

            let matchedSuffix = "";
            for (const suffix of englishSuffixes) {
                if (tempWord.toLowerCase().endsWith(suffix) && tempWord.length > suffix.length + 2) {
                    matchedSuffix = suffix;
                    tempWord = tempWord.slice(0, -suffix.length);
                    break;
                }
            }

            const wData = getHashData(tempWord);
            result.push({ 
                text: matchedPrefix ? `##${tempWord}` : tempWord, 
                ...wData 
            });

            if (matchedSuffix) {
                const sData = getHashData(matchedSuffix);
                result.push({ text: `##${matchedSuffix}`, ...sData });
            }
        }
    });

    return result;
}

export function TokenizerVisualizer({ defaultText, language, explanation }: Props) {
    const [text, setText] = useState(defaultText);
    const [tokenizerType, setTokenizerType] = useState<TokenizerType>("subword");

    const tokens = useMemo(() => simulateTokenize(text, tokenizerType), [text, tokenizerType]);
    const tokenIds = useMemo(() => tokens.map(t => t.id), [tokens]);

    return (
        <div className="w-full bg-zinc-950/60 border border-zinc-800/80 rounded-2xl p-6 backdrop-blur-md font-sans text-right select-none shadow-2xl relative overflow-hidden" dir="rtl">
            <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-500/5 rounded-full filter blur-[80px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-emerald-500/5 rounded-full filter blur-[80px] pointer-events-none" />

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-zinc-800/60 pb-5">
                <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2.5">
                        <Sparkles className="w-5 h-5 text-indigo-400" />
                        סימולטור טוקניזציה אינטראקטיבי
                    </h3>
                    <p className="text-sm text-zinc-400 mt-1">ראה כיצד הבינה המלאכותית מפרקת את הטקסט שלך ליחידות בסיס</p>
                </div>
                
                {/* Method selector */}
                <div className="flex bg-zinc-900 border border-zinc-800 p-1.5 rounded-xl self-start md:self-auto">
                    {(["subword", "word", "character"] as TokenizerType[]).map((type) => (
                        <button
                            key={type}
                            onClick={() => setTokenizerType(type)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 ${
                                tokenizerType === type
                                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                                    : "text-zinc-400 hover:text-zinc-200"
                            }`}
                        >
                            {type === "subword" ? "תת-מילים (AI)" : type === "word" ? "מילים שלמות" : "תווים בודדים"}
                        </button>
                    ))}
                </div>
            </div>

            {/* Explanatory banner */}
            <div className="bg-indigo-950/20 border border-indigo-900/30 p-4 rounded-xl mb-6 flex gap-3 text-zinc-300 text-sm leading-relaxed items-start">
                <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                    <strong className="text-white block mb-1">הידעת?</strong>
                    {explanation}
                </div>
            </div>

            {/* Input field */}
            <div className="mb-6">
                <label className="block text-xs font-medium text-zinc-400 mb-2 mr-1">
                    הקלד טקסט לבדיקה (עברית או אנגלית):
                </label>
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={3}
                    maxLength={200}
                    className="w-full bg-zinc-900/80 border border-zinc-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-4 py-3 text-white placeholder-zinc-500 text-base leading-relaxed resize-none focus:outline-none transition-all duration-300"
                    placeholder="הקלד כאן משהו..."
                />
                <div className="flex justify-between items-center mt-2 px-1 text-xs text-zinc-500">
                    <span>{text.length}/200 תווים</span>
                    <span className="flex items-center gap-1">
                        <Layers className="w-3.5 h-3.5" />
                        {tokens.length} טוקנים נוצרו
                    </span>
                </div>
            </div>

            {/* Live Token Blocks */}
            <div className="mb-6">
                <label className="block text-xs font-medium text-zinc-400 mb-3.5 mr-1">
                    מבט ויזואלי של הטוקנים:
                </label>
                <div 
                    className="min-h-[100px] w-full bg-zinc-900/40 border border-zinc-800/40 rounded-xl p-4 flex flex-wrap gap-2.5 items-center justify-start content-start"
                    dir={language === "he" ? "rtl" : "ltr"}
                >
                    <AnimatePresence mode="wait">
                        {tokens.map((token, index) => (
                            <m.div
                                key={`${token.text}-${index}`}
                                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.8, y: -10 }}
                                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                                className={`px-3 py-2 rounded-lg border text-sm font-mono flex flex-col items-center gap-1 select-none transition-all duration-300 hover:scale-105 hover:bg-opacity-60 ${token.colorClass}`}
                            >
                                <span className="font-semibold">{token.text}</span>
                                <span className="text-[10px] opacity-60 font-sans tracking-tight">#{token.id}</span>
                            </m.div>
                        ))}
                    </AnimatePresence>
                    {tokens.length === 0 && (
                        <div className="text-zinc-500 text-sm py-4 w-full text-center font-sans">
                            הקלד טקסט כדי לראות אותו מפורק לטוקנים...
                        </div>
                    )}
                </div>
            </div>

            {/* Numerical Representation */}
            <div>
                <label className="block text-xs font-medium text-zinc-400 mb-2 mr-1">
                    איך המחשב באמת קורא את זה (מערך מזהי טוקנים - Token IDs):
                </label>
                <div className="bg-zinc-900/90 border border-zinc-800/80 rounded-xl p-4 font-mono text-sm text-indigo-400 tracking-wider flex flex-wrap gap-1.5 justify-start text-left min-h-[56px] items-center">
                    <span>[</span>
                    {tokenIds.map((id, index) => (
                        <span key={index} className="hover:text-indigo-300 transition-colors">
                            {id}
                            {index < tokenIds.length - 1 && <span className="text-zinc-600 mr-0.5">,</span>}
                        </span>
                    ))}
                    <span>]</span>
                </div>
            </div>
        </div>
    );
}

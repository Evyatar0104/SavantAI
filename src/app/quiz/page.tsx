"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { m, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useSavantStore } from "@/store/useSavantStore";
import { calculateQuizResult, generateModelCards } from "@/lib/quizScoring";
import { Check, ArrowLeft, Sparkles, Zap, Brain, Rocket, Target, MousePointer2 } from "lucide-react";
import { haptics } from "@/lib/haptics";
import { PathSelectionModal } from "@/components/PathSelectionModal";
import { QUIZ_MODEL_NAMES as MODEL_NAMES, QUIZ_MODEL_THEME as MODEL_THEME, TOOL_LOGOS, TOOL_EMOJIS } from "@/lib/userTheme";

// ── Data ──────────────────────────────────────────────

type Option = { emoji: string; label: string; value: string; subtitle?: string };

const Q1_OPTIONS: Option[] = [
    { emoji: "💼", label: "לחסוך זמן בעבודה", value: "work" },
    { emoji: "📚", label: "ללמוד ולהבין דברים", value: "study" },
    { emoji: "✍️", label: "לכתוב ולייצר תוכן", value: "content" },
    { emoji: "📈", label: "להשקיע ולנתח שוק", value: "investing" },
    { emoji: "💻", label: "לבנות ולפתח", value: "coding" },
    { emoji: "🎨", label: "ליצור ולהמציא", value: "creative" },
];

const Q2_OPTIONS: Option[] = [
    { emoji: "✍️", label: "טקסט וכתיבה", subtitle: "מאמרים, מיילים, פוסטים", value: "text" },
    { emoji: "🖼️", label: "תמונות וויזואלים", subtitle: "גרפיקה, עיצוב, תמונות AI", value: "visuals" },
    { emoji: "🔍", label: "מחקר וסיכומים", subtitle: "ניתוח מקורות, דוחות", value: "research" },
    { emoji: "💻", label: "קוד ואוטומציה", subtitle: "פיתוח, סקריפטים, כלים", value: "code" },
    { emoji: "📊", label: "דאטה ומספרים", subtitle: "אקסל, גרפים, ניתוח פיננסי", value: "data" },
    { emoji: "🎵", label: "אודיו ומוזיקה", subtitle: "מוזיקה, ווייסאובר, פודקאסט", value: "audio" },
    { emoji: "💬", label: "שיחה ורעיונות", subtitle: "סיעור מוחות, חשיבה בקול", value: "conversation" },
];

const Q3_OPTIONS: Option[] = [
    { emoji: "⚡", label: "מהיר ולעניין", subtitle: "תשובות קצרות, טאסקים פשוטים", value: "quick" },
    { emoji: "📄", label: "בינוני", subtitle: "מסמכים, מאמרים, ניתוחים קצרים", value: "medium" },
    { emoji: "🔬", label: "עמוק ומורכב", subtitle: "מחקר, פרויקטים ארוכים", value: "deep" },
];

const Q4_OPTIONS: Option[] = [
    { emoji: "💬", label: "שיחה חופשית", subtitle: "שואל, מקבל, ממשיך טבעי", value: "chat" },
    { emoji: "📋", label: "הוראות ברורות", subtitle: "נותן בריף, מקבל תוצר מוגמר", value: "brief" },
    { emoji: "🔁", label: "איטרציות", subtitle: "בונה ומשפר עם AI לאורך זמן", value: "iterative" },
    { emoji: "🤖", label: "אוטומציה", subtitle: "רוצה שזה ירוץ לבד", value: "automation" },
];

const Q5_OPTIONS: Option[] = [
    { emoji: "🆓", label: "בחינם בלבד", subtitle: "רק כלים חינמיים", value: "free" },
    { emoji: "💳", label: "עד 120 ₪", subtitle: "תוכנית אחת בסיסית", value: "low" },
    { emoji: "💎", label: "200 ₪ ומעלה", subtitle: "ביצועים מקסימליים", value: "high" },
];

type ToolOption = { id: string; label: string; emoji?: string; logo?: string };


const LLM_TOOLS: ToolOption[] = [
    { id: "ChatGPT", label: "ChatGPT", logo: "/assets/logos/chatgpt.png" },
    { id: "Claude", label: "Claude", logo: "/assets/logos/claude.png" },
    { id: "Gemini", label: "Gemini", logo: "/assets/logos/gemini.png" },
    { id: "Grok", label: "Grok", logo: "/assets/logos/grok.png" },
    { id: "Perplexity", label: "Perplexity", logo: "/assets/logos/perplexity.png" },
];

const CREATIVE_TOOLS: ToolOption[] = [
    { id: "Suno", label: "Suno", emoji: "🎵" },
    { id: "Midjourney", label: "Midjourney", emoji: "🎨" },
    { id: "NotebookLM", label: "NotebookLM", logo: "/assets/logos/notebooklm.png" },
    { id: "Notion AI", label: "Notion AI", emoji: "📝" },
    { id: "Runway", label: "Runway", emoji: "🎬" },
    { id: "Gamma", label: "Gamma", emoji: "✏️" },
    { id: "Other", label: "אחר", emoji: "🤖" },
];

// Models and Tools constants are now imported from @/lib/userTheme

// ── Components ────────────────────────────────────────

function ProgressBar({ current, total }: { current: number; total: number }) {
    return (
        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
            <m.div
                className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(current / total) * 100}%` }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            />
        </div>
    );
}

function OptionCard({
    emoji,
    label,
    subtitle,
    selected,
    onClick,
}: {
    emoji: string;
    label: string;
    subtitle?: string;
    selected: boolean;
    onClick: () => void;
}) {
    return (
        <m.button
            whileHover={{ scale: 1.01, x: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
                haptics.tap();
                onClick();
            }}
            className={cn(
                "w-full text-right p-4 md:p-5 rounded-[24px] border transition-all duration-300 relative overflow-hidden group",
                selected
                    ? "border-purple-500/50 bg-purple-500/10 shadow-[0_0_20px_rgba(168,85,247,0.15)] ring-1 ring-purple-500/20"
                    : "border-white/5 bg-white/[0.03] backdrop-blur-md hover:bg-white/[0.07] hover:border-white/10 shadow-lg"
            )}
        >
            {/* Background Glow */}
            <div className={cn(
                "absolute -inset-px bg-gradient-to-r from-transparent via-white/5 to-transparent transition-opacity duration-500",
                selected ? "opacity-20" : "opacity-0 group-hover:opacity-100"
            )} />

            <div className="flex items-center gap-4 relative z-10">
                <div className={cn(
                    "w-12 h-12 rounded-[14px] flex items-center justify-center shrink-0 text-2xl shadow-inner border transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3",
                    selected ? "bg-purple-500/20 border-purple-500/30" : "bg-white/5 border-white/10"
                )}>
                    {emoji}
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                    <span className={cn(
                        "text-base md:text-lg font-bold leading-tight transition-colors",
                        selected ? "text-white" : "text-zinc-300 group-hover:text-purple-400"
                    )}>{label}</span>
                    {subtitle && <span className="text-[10px] md:text-xs text-zinc-500 mt-0.5 font-medium">{subtitle}</span>}
                </div>
                
                <div className="shrink-0">
                    {selected ? (
                        <m.div 
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="w-7 h-7 rounded-full bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.4)] flex items-center justify-center border border-white/20"
                        >
                            <Check className="w-4 h-4 text-white stroke-[3px]" />
                        </m.div>
                    ) : (
                        <div className="w-7 h-7 rounded-full border-2 border-white/10 group-hover:border-white/20 transition-colors" />
                    )}
                </div>
            </div>
        </m.button>
    );
}

function ToolCard({
    tool,
    selected,
    onClick,
}: {
    tool: ToolOption;
    selected: boolean;
    onClick: () => void;
}) {
    return (
        <m.button
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
                haptics.tap();
                onClick();
            }}
            className={cn(
                "flex flex-col items-center justify-center p-4 rounded-[24px] border transition-all duration-300 aspect-square relative overflow-hidden group shadow-lg",
                selected
                    ? "border-purple-500/50 bg-purple-500/10 shadow-[0_0_25px_rgba(168,85,247,0.2)] ring-1 ring-purple-500/20"
                    : "border-white/5 bg-white/[0.03] backdrop-blur-md hover:bg-white/[0.07] hover:border-white/10"
            )}
        >
            <div className={cn(
                "absolute -inset-px bg-gradient-to-br from-white/5 via-transparent to-transparent transition-opacity duration-500",
                selected ? "opacity-20" : "opacity-0 group-hover:opacity-100"
            )} />

            <div className="relative z-10 flex flex-col items-center">
                <div className={cn(
                    "w-14 h-14 rounded-[18px] flex items-center justify-center mb-3 shadow-inner border transition-all duration-500 group-hover:scale-110 group-hover:rotate-3",
                    selected ? "bg-purple-500/20 border-purple-500/30" : "bg-white/5 border-white/10"
                )}>
                    {tool.logo ? (
                        <Image 
                            src={tool.logo} 
                            alt={tool.label} 
                            width={36} 
                            height={36} 
                            className={cn(
                                "w-9 h-9 object-contain",
                                (tool.id === "Grok" || tool.id === "Perplexity") && "brightness-0 invert"
                            )} 
                        />
                    ) : (
                        <span className="text-3xl">{tool.emoji}</span>
                    )}
                </div>
                <span className={cn(
                    "text-[11px] md:text-[12px] font-black tracking-tight text-center leading-tight transition-colors",
                    selected ? "text-white" : "text-zinc-400 group-hover:text-purple-400"
                )}>{tool.label}</span>
            </div>

            {selected && (
                <div className="absolute top-2 right-2">
                    <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center">
                        <Check className="w-3 h-3 text-white stroke-[3px]" />
                    </div>
                </div>
            )}
        </m.button>
    );
}

// ── Slide variants ────────────────────────────────────

const fadeVariants = {
    enter: { opacity: 0, y: 10, scale: 0.98 },
    center: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -10, scale: 1.02 },
};

// ── Page ──────────────────────────────────────────────

export default function QuizPage() {
    const router = useRouter();
    const setQuizResult = useSavantStore(s => s.setQuizResult);
    const quizCompleted = useSavantStore(s => s.quizCompleted);

    const [step, setStep] = useState(1);
    const [selectedUseCases, setSelectedUseCases] = useState<string[]>([]);
    const [outputTypes, setOutputTypes] = useState<string[]>([]);
    const [outputDepth, setOutputDepth] = useState<string | null>(null);
    const [workStyle, setWorkStyle] = useState<string | null>(null);
    const [budgetLevel, setBudgetLevel] = useState<string | null>(null);
    const [selectedTools, setSelectedTools] = useState<string[]>([]);
    const [noneSelected, setNoneSelected] = useState(false);
    const [result, setResult] = useState<ReturnType<typeof calculateQuizResult> | null>(null);
    const [isPathModalOpen, setIsPathModalOpen] = useState(false);

    // If quiz already done, redirect (only if at the start to avoid interrupting the finish flow)
    useEffect(() => {
        if (quizCompleted && step === 1) {
            router.replace("/courses/how-llms-work");
        }
    }, [quizCompleted, router, step]);

    // Auto-advance from loading screen (step 7)
    useEffect(() => {
        if (step === 7) {
            const timer = setTimeout(() => setStep(8), 1500);
            return () => clearTimeout(timer);
        }
        if (step === 8) {
            const timer = setTimeout(() => setIsPathModalOpen(true), 2500);
            return () => clearTimeout(timer);
        }
    }, [step]);

    const canAdvance = (): boolean => {
        switch (step) {
            case 1: return selectedUseCases.length >= 1;
            case 2: return outputTypes.length >= 1 && outputTypes.length <= 3;
            case 3: return outputDepth !== null;
            case 4: return workStyle !== null;
            case 5: return budgetLevel !== null;
            case 6: return true; // tools — always enabled
            default: return false;
        }
    };

    const handleAdvance = () => {
        haptics.tap();
        if (step === 6) {
            // Compute result and go to loading
            const r = calculateQuizResult({
                useCases: selectedUseCases,
                outputTypes: outputTypes,
                outputDepth: outputDepth!,
                workStyle: workStyle!,
                budgetLevel: budgetLevel!,
                preferredTools: noneSelected ? [] : selectedTools,
            });
            setResult(r);
            setStep(7);
        } else {
            setStep(step + 1);
        }
    };

    const handleBack = () => {
        if (step > 1 && step <= 6) {
            haptics.tap();
            setStep(step - 1);
        }
    };

    const toggleTool = (toolId: string) => {
        setNoneSelected(false);
        setSelectedTools((prev) =>
            prev.includes(toolId) ? prev.filter((t) => t !== toolId) : [...prev, toolId]
        );
    };

    const handleNone = () => {
        setNoneSelected(true);
        setSelectedTools([]);
    };

    const handleFinish = () => {
        if (result) {
            setQuizResult(result);
            router.push("/courses/how-llms-work");
        }
    };

    const gridColor = "168, 85, 247"; // Purple color for the grid

    if (quizCompleted) return null;

    return (
        <div className="min-h-[100dvh] flex flex-col relative bg-[#050508] text-white overflow-hidden" dir="rtl">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-0 right-0 w-[80%] h-[60%] rounded-full blur-[120px] bg-purple-500/10 opacity-30" />
                <div className="absolute bottom-0 left-0 w-[60%] h-[50%] rounded-full blur-[120px] bg-blue-500/10 opacity-20" />
                
                {/* Lowkey Dynamic Grid */}
                <AnimatePresence mode="wait">
                    <m.div 
                        key={step}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                        className="absolute inset-0"
                        style={{
                            backgroundImage: `
                                linear-gradient(rgba(${gridColor}, 0.5) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(${gridColor}, 0.5) 1px, transparent 1px)
                            `,
                            backgroundSize: "64px 64px",
                            backgroundPosition: "center",
                            maskImage: "linear-gradient(to bottom, black 10%, transparent 90%)",
                            WebkitMaskImage: "linear-gradient(to bottom, black 10%, transparent 90%)",
                        }}
                    />
                </AnimatePresence>
                
                {/* Animated Perspective Grid */}
                <div
                    className="absolute inset-0 origin-top pointer-events-none"
                    style={{
                        transform: "perspective(1000px) rotateX(60deg) scale(2.5) translateY(-5%)",
                        willChange: "transform",
                    }}
                >
                    <m.div 
                        animate={{ 
                            opacity: [0.03, 0.08, 0.03],
                        }}
                        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute inset-0"
                        style={{
                            backgroundImage: `
                                linear-gradient(rgba(${gridColor}, 0.4) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(${gridColor}, 0.4) 1px, transparent 1px)
                            `,
                            backgroundSize: "120px 120px",
                            backgroundPosition: "center",
                        }}
                    />
                </div>
            </div>

            {/* Header & Progress */}
            <div className="relative z-10 px-6 pt-12 md:pt-16 max-w-5xl mx-auto w-full">
                <div className="flex items-center justify-between mb-8">
                    {step > 1 && step <= 6 ? (
                        <button 
                            onClick={handleBack}
                            className="inline-flex items-center text-zinc-500 hover:text-white transition-all group font-bold text-xs"
                        >
                            <ArrowLeft className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" /> חזרה
                        </button>
                    ) : (
                        <div className="w-4 h-4" />
                    )}
                    
                    <div className="flex flex-col items-center">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-2">שלב {step <= 6 ? step : 6} מתוך 6</span>
                        {step <= 6 && <div className="w-32"><ProgressBar current={step} total={6} /></div>}
                    </div>
                    
                    <div className="w-4 h-4" />
                </div>
            </div>

            <div className="flex-1 flex items-center justify-center px-6 py-4 relative z-10">
                <AnimatePresence mode="wait">
                    {/* ── Step 1: Goal ── */}
                    {step === 1 && (
                        <m.div
                            key="step1"
                            variants={fadeVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                            className="w-full max-w-2xl"
                        >
                            <div className="text-center mb-10">
                                <m.div 
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="w-16 h-16 bg-purple-500/10 rounded-[20px] flex items-center justify-center mx-auto mb-4 border border-purple-500/20 shadow-lg"
                                >
                                    <Target className="w-8 h-8 text-purple-400" />
                                </m.div>
                                <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-3 tracking-tighter">
                                    מה היעד העיקרי שלך?
                                </h2>
                                <p className="text-zinc-500 text-sm md:text-base font-medium">בחר עד 2 תחומים שמעניינים אותך ב-AI</p>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                                {Q1_OPTIONS.map((opt) => (
                                    <OptionCard
                                        key={opt.value}
                                        emoji={opt.emoji}
                                        label={opt.label}
                                        selected={selectedUseCases.includes(opt.value)}
                                        onClick={() => {
                                            setSelectedUseCases((prev) => {
                                                if (prev.includes(opt.value)) {
                                                    return prev.filter((v) => v !== opt.value);
                                                }
                                                if (prev.length >= 2) {
                                                    return [...prev.slice(1), opt.value];
                                                }
                                                return [...prev, opt.value];
                                            });
                                        }}
                                    />
                                ))}
                            </div>
                        </m.div>
                    )}

                    {/* ── Step 2: Output Types ── */}
                    {step === 2 && (
                        <m.div
                            key="step2"
                            variants={fadeVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                            className="w-full max-w-3xl"
                        >
                            <div className="text-center mb-10">
                                <m.div 
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="w-16 h-16 bg-blue-500/10 rounded-[20px] flex items-center justify-center mx-auto mb-4 border border-blue-500/20 shadow-lg"
                                >
                                    <Brain className="w-8 h-8 text-blue-400" />
                                </m.div>
                                <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-3 tracking-tighter">
                                    מה אתה צריך לייצר?
                                </h2>
                                <p className="text-zinc-500 text-sm md:text-base font-medium">בחר עד 3 סוגי פלט שרלוונטיים עבורך</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {Q2_OPTIONS.map((opt) => (
                                    <OptionCard
                                        key={opt.value}
                                        emoji={opt.emoji}
                                        label={opt.label}
                                        subtitle={opt.subtitle}
                                        selected={outputTypes.includes(opt.value)}
                                        onClick={() => {
                                            setOutputTypes((prev) => {
                                                if (prev.includes(opt.value)) {
                                                    return prev.filter((v) => v !== opt.value);
                                                }
                                                if (prev.length >= 3) {
                                                    return [...prev.slice(1), opt.value];
                                                }
                                                return [...prev, opt.value];
                                            });
                                        }}
                                    />
                                ))}
                            </div>
                        </m.div>
                    )}

                    {/* ── Step 3: Depth ── */}
                    {step === 3 && (
                        <m.div
                            key="step3"
                            variants={fadeVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                            className="w-full max-w-2xl"
                        >
                            <div className="text-center mb-10">
                                <m.div 
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="w-16 h-16 bg-emerald-500/10 rounded-[20px] flex items-center justify-center mx-auto mb-4 border border-emerald-500/20 shadow-lg"
                                >
                                    <Sparkles className="w-8 h-8 text-emerald-400" />
                                </m.div>
                                <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-3 tracking-tighter">
                                    כמה עמוק הפלט הדרוש?
                                </h2>
                                <p className="text-zinc-500 text-sm md:text-base font-medium">בחר את רמת המורכבות הממוצעת של העבודה שלך</p>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                {Q3_OPTIONS.map((opt) => (
                                    <OptionCard
                                        key={opt.value}
                                        emoji={opt.emoji}
                                        label={opt.label}
                                        subtitle={opt.subtitle}
                                        selected={outputDepth === opt.value}
                                        onClick={() => setOutputDepth(opt.value)}
                                    />
                                ))}
                            </div>
                        </m.div>
                    )}

                    {/* ── Step 4: Work Style ── */}
                    {step === 4 && (
                        <m.div
                            key="step4"
                            variants={fadeVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                            className="w-full max-w-2xl"
                        >
                            <div className="text-center mb-10">
                                <m.div 
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="w-16 h-16 bg-orange-500/10 rounded-[20px] flex items-center justify-center mx-auto mb-4 border border-orange-500/20 shadow-lg"
                                >
                                    <MousePointer2 className="w-8 h-8 text-orange-400" />
                                </m.div>
                                <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-3 tracking-tighter">
                                    איך אתה מעדיף לעבוד?
                                </h2>
                                <p className="text-zinc-500 text-sm md:text-base font-medium">בחר את סגנון העבודה המועדף עליך עם AI</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {Q4_OPTIONS.map((opt) => (
                                    <OptionCard
                                        key={opt.value}
                                        emoji={opt.emoji}
                                        label={opt.label}
                                        subtitle={opt.subtitle}
                                        selected={workStyle === opt.value}
                                        onClick={() => setWorkStyle(opt.value)}
                                    />
                                ))}
                            </div>
                        </m.div>
                    )}

                    {/* ── Step 5: Budget ── */}
                    {step === 5 && (
                        <m.div
                            key="step5"
                            variants={fadeVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                            className="w-full max-w-4xl"
                        >
                            <div className="text-center mb-10">
                                <m.div 
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="w-16 h-16 bg-rose-500/10 rounded-[20px] flex items-center justify-center mx-auto mb-4 border border-rose-500/20 shadow-lg"
                                >
                                    <Zap className="w-8 h-8 text-rose-400" />
                                </m.div>
                                <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-3 tracking-tighter">
                                    מה התקציב החודשי שלך?
                                </h2>
                                <p className="text-zinc-500 text-sm md:text-base font-medium">כמה תהיה מוכן להשקיע בכלים מתקדמים?</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {Q5_OPTIONS.map((opt) => (
                                    <OptionCard
                                        key={opt.value}
                                        emoji={opt.emoji}
                                        label={opt.label}
                                        subtitle={opt.subtitle}
                                        selected={budgetLevel === opt.value}
                                        onClick={() => setBudgetLevel(opt.value)}
                                    />
                                ))}
                            </div>
                        </m.div>
                    )}

                    {/* ── Step 6: Tools ── */}
                    {step === 6 && (
                        <m.div
                            key="step6"
                            variants={fadeVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                            className="w-full max-w-3xl"
                        >
                            <div className="text-center mb-10">
                                <m.div 
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="w-16 h-16 bg-indigo-500/10 rounded-[20px] flex items-center justify-center mx-auto mb-4 border border-indigo-500/20 shadow-lg"
                                >
                                    <Rocket className="w-8 h-8 text-indigo-400" />
                                </m.div>
                                <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-3 tracking-tighter">
                                    במה כבר השתמשת?
                                </h2>
                                <p className="text-zinc-500 text-sm md:text-base font-medium">כל כלי שסימנת מקנה לך 50 נקודות XP כבונוס ידע!</p>
                            </div>

                            <div className="space-y-10 mb-10">
                                {/* Section A: LLM tools */}
                                <div>
                                    <p className="text-[10px] font-black text-zinc-500 tracking-[0.2em] uppercase mb-4 text-center">כלי AI שיחתיים</p>
                                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                                        {LLM_TOOLS.map((tool) => (
                                            <ToolCard
                                                key={tool.id}
                                                tool={tool}
                                                selected={!noneSelected && selectedTools.includes(tool.id)}
                                                onClick={() => toggleTool(tool.id)}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Section B: Creative tools */}
                                <div>
                                    <p className="text-[10px] font-black text-zinc-500 tracking-[0.2em] uppercase mb-4 text-center">כלים יצירתיים ופרודקטיביים</p>
                                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3">
                                        {CREATIVE_TOOLS.map((tool) => (
                                            <ToolCard
                                                key={tool.id}
                                                tool={tool}
                                                selected={!noneSelected && selectedTools.includes(tool.id)}
                                                onClick={() => toggleTool(tool.id)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleNone}
                                className={cn(
                                    "w-full p-4 rounded-[24px] border text-center text-sm font-bold transition-all duration-300 shadow-md",
                                    noneSelected
                                        ? "border-purple-500/50 bg-purple-500/10 text-white"
                                        : "border-white/5 bg-white/[0.03] text-zinc-400 hover:bg-white/[0.07] hover:border-white/10"
                                )}
                            >
                                אף אחד מהרשימה
                            </button>
                        </m.div>
                    )}

                    {/* ── Step 7: Loading ── */}
                    {step === 7 && (
                        <m.div
                            key="step7"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center text-center"
                        >
                            <div className="relative w-24 h-24 mb-10">
                                <m.div 
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-0 rounded-full border-4 border-white/5 border-t-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.3)]"
                                />
                                <m.div 
                                    animate={{ rotate: -360 }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-4 rounded-full border-4 border-white/5 border-t-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.2)]"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Brain className="w-8 h-8 text-white animate-pulse" />
                                </div>
                            </div>
                            <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-2">מנתח את הפרופיל שלך</h2>
                            <p className="text-zinc-500 font-medium">בונה עבורך את מסלול הלמידה המדויק...</p>
                        </m.div>
                    )}

                    {/* ── Step 8: Result ── */}
                    {step === 8 && result && (
                        <m.div
                            key="step8"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8 }}
                            className="w-full max-w-2xl pb-24"
                        >
                            {/* SECTION A — Profile reveal */}
                            <m.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                                className="w-full flex flex-col items-center text-center pt-8 mb-12"
                            >
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-4">
                                    הפרופיל הטכנולוגי שלך
                                </span>
                                <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 tracking-tighter">
                                    {result.profileTitle}
                                </h2>
                                <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full" />
                            </m.div>

                            {/* SECTION B — Primary model */}
                            <m.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="w-full flex flex-col mb-6"
                            >
                                <div className="flex justify-between max-w-[420px] mx-auto w-full mb-3" dir="rtl">
                                    <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">הנשק הראשי שלך</p>
                                </div>
                                {(() => {
                                    const modelCards = generateModelCards(result);
                                    const primary = modelCards[0];
                                    const theme = MODEL_THEME[primary.model];
                                    return (
                                        <div className={`max-w-[420px] mx-auto w-full rounded-[32px] bg-gradient-to-br ${theme.gradient} p-8 relative overflow-hidden shadow-2xl border border-white/10`} dir="rtl">
                                            {/* Animated orbs */}
                                            <m.div
                                                animate={{ x: [0, 20, -10, 0], y: [0, -15, 10, 0], scale: [1, 1.2, 0.9, 1] }}
                                                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                                                className="absolute top-[-30px] right-[-30px] w-[140px] h-[140px] rounded-full pointer-events-none opacity-50"
                                                style={{ background: `radial-gradient(circle, ${theme.orbColors[0]} 0%, transparent 70%)`, filter: "blur(30px)" }}
                                            />

                                            <div className="flex items-center relative z-10 mb-6">
                                                <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-3 ml-4 shadow-xl">
                                                    <Image 
                                                        src={`/assets/logos/${primary.model}.png`} 
                                                        alt={primary.model} 
                                                        width={64} 
                                                        height={64} 
                                                        className="w-full h-full object-contain"
                                                    />
                                                </div>
                                                <div>
                                                    <h3 className="text-2xl font-bold text-white">{MODEL_NAMES[primary.model]}</h3>
                                                    <div className="text-xs font-black tracking-wide" style={{ color: theme.accentColor }}>{theme.tagline}</div>
                                                </div>
                                            </div>

                                            <div className="mb-6 pt-6 text-sm md:text-base leading-relaxed text-zinc-300 relative z-10 border-t border-white/10">
                                                {primary.profileExplanation}
                                            </div>

                                            <div className="flex flex-col gap-3 relative z-10">
                                                {primary.pros.map((pro, i) => (
                                                    <div key={`p-${i}`} className="flex items-center gap-3">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)] shrink-0" />
                                                        <span className="text-sm font-medium text-white">{pro}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })()}
                            </m.div>

                            {/* SECTION C — Secondary model */}
                            <m.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                className="w-full flex flex-col mb-12"
                            >
                                <div className="flex justify-between max-w-[420px] mx-auto w-full mb-3" dir="rtl">
                                    <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">כלי משלים</p>
                                </div>
                                {(() => {
                                    const modelCards = generateModelCards(result);
                                    const secondary = modelCards[1];
                                    const secTheme = MODEL_THEME[secondary.model];
                                    return (
                                        <div className="max-w-[420px] mx-auto w-full rounded-[24px] p-6 relative overflow-hidden bg-white/[0.03] backdrop-blur-xl border border-white/10 shadow-xl" dir="rtl">
                                            <div className="flex items-center relative z-10 mb-4">
                                                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 p-2 ml-3">
                                                    <Image 
                                                        src={`/assets/logos/${secondary.model}.png`} 
                                                        alt={secondary.model} 
                                                        width={40} 
                                                        height={40} 
                                                        className="w-full h-full object-contain"
                                                    />
                                                </div>
                                                <div>
                                                    <h4 className="text-lg font-bold text-white">{MODEL_NAMES[secondary.model]}</h4>
                                                    <div className="text-[10px] font-bold" style={{ color: secTheme.accentColor }}>{secTheme.tagline}</div>
                                                </div>
                                            </div>

                                            <div className="pt-4 text-xs md:text-sm leading-relaxed text-zinc-400 relative z-10 border-t border-white/5">
                                                {secondary.profileExplanation.split('.')[0] + '.'}
                                            </div>
                                        </div>
                                    );
                                })()}
                            </m.div>

                            {/* SECTION D — Specialist tools */}
                            {result.specialistTools && result.specialistTools.length > 0 && (
                                <m.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.6 }}
                                    className="w-full mb-12"
                                >
                                    <div className="flex justify-between max-w-[420px] mx-auto w-full mb-4" dir="rtl">
                                        <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">ארגז הכלים המשלים שלך</p>
                                    </div>
                                    <div className="flex gap-3 overflow-x-auto pb-4 hide-scrollbar justify-center px-4" dir="rtl">
                                        {result.specialistTools.map(tool => {
                                            const logo = TOOL_LOGOS[tool];
                                            const emoji = TOOL_EMOJIS[tool];
                                            return (
                                                <div key={tool} className="flex flex-col items-center shrink-0">
                                                    <div className="border border-white/10 rounded-2xl px-4 py-2 bg-white/[0.05] backdrop-blur-md whitespace-nowrap text-sm font-bold text-white shadow-lg flex items-center gap-2">
                                                        {logo ? (
                                                            <Image src={logo} alt={tool} width={20} height={20} className="w-5 h-5 object-contain" />
                                                        ) : emoji ? (
                                                            <span className="text-base">{emoji}</span>
                                                        ) : null}
                                                        {tool}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </m.div>
                            )}

                            {/* SECTION F — CTA */}
                            <m.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.8 }}
                                className="w-full mt-8"
                            >
                                <div className="max-w-[420px] mx-auto">
                                    <button
                                        onClick={handleFinish}
                                        className="w-full h-[64px] bg-white text-black font-black text-lg rounded-[24px] shadow-[0_20px_40px_rgba(255,255,255,0.1)] hover:bg-zinc-200 transition-all active:scale-95 flex items-center justify-center gap-3"
                                    >
                                        התחל את קורס הבסיס
                                        <Brain className="w-6 h-6" />
                                    </button>
                                </div>
                            </m.div>
                        </m.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Bottom CTA — for question steps only (1-6) */}
            {step <= 6 && (
                <div className="relative z-20 px-6 pb-12 pt-4 max-w-2xl mx-auto w-full">
                    <button
                        onClick={handleAdvance}
                        disabled={!canAdvance()}
                        className={cn(
                            "w-full py-5 rounded-[24px] font-black text-lg transition-all duration-300 shadow-2xl flex items-center justify-center gap-2",
                            canAdvance()
                                ? "bg-white text-black hover:bg-zinc-200"
                                : "bg-white/5 text-zinc-600 cursor-not-allowed"
                        )}
                    >
                        {step === 6 ? "קבל את הסטאק שלי" : "המשך"}
                        <ArrowLeft className="w-5 h-5 rotate-180" />
                    </button>
                    
                    {step === 6 && selectedTools.length > 0 && (
                        <m.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center justify-center gap-2 mt-4 text-emerald-400 font-black text-xs uppercase tracking-widest"
                        >
                            <Sparkles size={14} />
                            בונוס ידע: +{Math.min(selectedTools.length * 50, 250)} XP
                        </m.div>
                    )}
                    {step === 1 && (
                        <p className="text-center text-[10px] text-zinc-600 mt-4 font-bold uppercase tracking-widest">
                            התשובות שלך יעזרו לנו להתאים לך את הכלים הנכונים
                        </p>
                    )}
                </div>
            )}

            <PathSelectionModal 
                isOpen={isPathModalOpen} 
                onClose={() => {
                    setIsPathModalOpen(false);
                    handleFinish();
                }} 
            />
        </div>
    );
}


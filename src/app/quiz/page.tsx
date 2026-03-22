"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { m, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useSavantStore } from "@/store/useSavantStore";
import { calculateQuizResult, generateModelCards } from "@/lib/quizScoring";
import { COURSES } from "@/data/lessons";

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
    { emoji: "✍️", label: "טקסט וכתיבה", subtitle: "מאמרים, מיילים, פוסטים, תסריטים", value: "text" },
    { emoji: "🖼️", label: "תמונות וויזואלים", subtitle: "גרפיקה, עיצוב, תמונות מבוססות AI", value: "visuals" },
    { emoji: "🔍", label: "מחקר וסיכומים", subtitle: "ניתוח מקורות, דוחות, למידת נושאים", value: "research" },
    { emoji: "💻", label: "קוד ואוטומציה", subtitle: "פיתוח, סקריפטים, כלים טכניים", value: "code" },
    { emoji: "📊", label: "דאטה ומספרים", subtitle: "אקסל, גרפים, ניתוח נתונים פיננסי", value: "data" },
    { emoji: "🎵", label: "אודיו ומוזיקה", subtitle: "יצירת מוזיקה, ווייסאובר, פודקאסט", value: "audio" },
    { emoji: "💬", label: "שיחה ורעיונות", subtitle: "סיעור מוחות, החלטות, חשיבה בקול", value: "conversation" },
];

const Q3_OPTIONS: Option[] = [
    { emoji: "⚡", label: "מהיר ולעניין", subtitle: "תשובות קצרות, טאסקים פשוטים ומהירים", value: "quick" },
    { emoji: "📄", label: "בינוני", subtitle: "מסמכים, מאמרים, ניתוחים קצרים", value: "medium" },
    { emoji: "🔬", label: "עמוק ומורכב", subtitle: "מחקר, פרויקטים ארוכים, ניתוח מורכב", value: "deep" },
];

const Q4_OPTIONS: Option[] = [
    { emoji: "💬", label: "שיחה חופשית", subtitle: "שואל, מקבל, ממשיך באופן טבעי", value: "chat" },
    { emoji: "📋", label: "הוראות ברורות", subtitle: "נותן בריף מסודר, מקבל תוצר מוגמר", value: "brief" },
    { emoji: "🔁", label: "איטרציות", subtitle: "בונה ומשפר עם AI לאורך זמן", value: "iterative" },
    { emoji: "🤖", label: "אוטומציה", subtitle: "רוצה שזה ירוץ לבד עם מינימום התערבות", value: "automation" },
];

const Q5_OPTIONS: Option[] = [
    { emoji: "🆓", label: "בחינם בלבד", subtitle: "רק כלים חינמיים", value: "free" },
    { emoji: "💳", label: "עד 80–120 ₪", subtitle: "תוכנית אחת בסיסית", value: "low" },
    { emoji: "💎", label: "200 ₪ ומעלה", subtitle: "כמה כלים במקביל, ביצועים מקסימליים", value: "high" },
];

type ToolOption = { id: string; label: string; emoji?: string; logo?: string };


const LLM_TOOLS: ToolOption[] = [
    { id: "ChatGPT", label: "ChatGPT", logo: "/assets/logos/chatgpt.png" },
    { id: "Claude", label: "Claude", logo: "/assets/logos/claude.png" },
    { id: "Gemini", label: "Gemini", logo: "/assets/logos/gemini.png" },
    { id: "Grok", label: "Grok", emoji: "🤖" },
    { id: "Perplexity", label: "Perplexity", emoji: "🔍" },
];

const CREATIVE_TOOLS: ToolOption[] = [
    { id: "Suno", label: "Suno", emoji: "🎵" },
    { id: "Midjourney", label: "Midjourney", emoji: "🎨" },
    { id: "NotebookLM", label: "NotebookLM", emoji: "📓" },
    { id: "Notion AI", label: "Notion AI", emoji: "📝" },
    { id: "Runway", label: "Runway", emoji: "🎬" },
    { id: "Gamma", label: "Gamma", emoji: "✏️" },
    { id: "Other", label: "אחר", emoji: "🤖" },
];

const MODEL_NAMES: Record<string, string> = {
    claude: "Claude",
    chatgpt: "ChatGPT",
    gemini: "Gemini",
};

const MODEL_THEME: Record<string, {
    gradient: string;
    glowColor: string;
    accentColor: string;
    orbColors: [string, string];
    tagline: string;
}> = {
    claude: {
        gradient: "from-[#D97706]/20 via-[#EA580C]/15 to-[#C2410C]/10",
        glowColor: "rgba(217,119,6,0.15)",
        accentColor: "#D97706",
        orbColors: ["rgba(234,88,12,0.25)", "rgba(217,119,6,0.2)"],
        tagline: "עומק, דיוק, ומחשבה",
    },
    chatgpt: {
        gradient: "from-[#10A37F]/20 via-[#0D9668]/15 to-[#059669]/10",
        glowColor: "rgba(16,163,127,0.15)",
        accentColor: "#10A37F",
        orbColors: ["rgba(16,163,127,0.25)", "rgba(5,150,105,0.2)"],
        tagline: "גמישות, יצירתיות, ומהירות",
    },
    gemini: {
        gradient: "from-[#4285F4]/20 via-[#A855F7]/15 to-[#EC4899]/10",
        glowColor: "rgba(66,133,244,0.15)",
        accentColor: "#4285F4",
        orbColors: ["rgba(66,133,244,0.25)", "rgba(168,85,247,0.2)"],
        tagline: "מחקר, אינטגרציה, וחינם",
    },
};

// ── Components ────────────────────────────────────────

function ProgressBar({ current, total }: { current: number; total: number }) {
    return (
        <div className="w-full h-[3px] bg-white/10 rounded-full overflow-hidden">
            <m.div
                className="h-full bg-[#534AB7] rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(current / total) * 100}%` }}
                transition={{ duration: 0.4, ease: "easeOut" }}
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
        <button
            onClick={onClick}
            className={cn(
                "w-full text-right p-[14px_16px] rounded-2xl border transition-all duration-200",
                "hover:bg-white/[0.03]",
                selected
                    ? "border-[#534AB7] bg-[#EEEDFE10]"
                    : "border-white/[0.08]"
            )}
        >
            <div className="flex items-center gap-3">
                <span className="text-xl shrink-0">{emoji}</span>
                <div className="flex flex-col">
                    <span className="text-[14px] font-medium text-white">{label}</span>
                    {subtitle && <span className="text-[12px] text-zinc-500">{subtitle}</span>}
                </div>
            </div>
        </button>
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
        <button
            onClick={onClick}
            className={cn(
                "flex flex-col items-center justify-center p-3 rounded-2xl border transition-all duration-200 aspect-square",
                "hover:bg-white/[0.03]",
                selected
                    ? "border-[#534AB7] bg-[#EEEDFE10]"
                    : "border-white/[0.08]"
            )}
        >
            {tool.logo ? (
                <img src={tool.logo} alt={tool.label} className="w-8 h-8 rounded-lg object-contain mb-2" />
            ) : (
                <span className="text-2xl mb-2">{tool.emoji}</span>
            )}
            <span className="text-[11px] font-medium text-zinc-300 text-center leading-tight">{tool.label}</span>
        </button>
    );
}

// ── Slide variants ────────────────────────────────────

const slideVariants = {
    enter: { x: -80, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: 80, opacity: 0 },
};

// ── Page ──────────────────────────────────────────────

export default function QuizPage() {
    const router = useRouter();
    const setQuizResult = useSavantStore((s: any) => s.setQuizResult);
    const quizCompleted = useSavantStore((s: any) => s.quizCompleted);

    const [step, setStep] = useState(1);
    const [selectedUseCases, setSelectedUseCases] = useState<string[]>([]);
    const [outputTypes, setOutputTypes] = useState<string[]>([]);
    const [outputDepth, setOutputDepth] = useState<string | null>(null);
    const [workStyle, setWorkStyle] = useState<string | null>(null);
    const [budgetLevel, setBudgetLevel] = useState<string | null>(null);
    const [selectedTools, setSelectedTools] = useState<string[]>([]);
    const [noneSelected, setNoneSelected] = useState(false);
    const [result, setResult] = useState<ReturnType<typeof calculateQuizResult> | null>(null);

    // If quiz already done, redirect
    useEffect(() => {
        if (quizCompleted) {
            router.replace("/courses/how-llms-work");
        }
    }, [quizCompleted, router]);

    // Auto-advance from loading screen (step 7)
    useEffect(() => {
        if (step === 7) {
            const timer = setTimeout(() => setStep(8), 1500);
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

    if (quizCompleted) return null;

    return (
        <div className="min-h-[100dvh] flex flex-col relative z-10">
            {/* Progress bar — only for question steps (1-6) */}
            {step <= 6 && (
                <div className="px-6 pt-6">
                    <ProgressBar current={step} total={6} />
                </div>
            )}

            <div className="flex-1 flex items-center justify-center px-6 py-10">
                <AnimatePresence mode="wait">
                    {/* ── Step 1: Goal (up to 2) ── */}
                    {step === 1 && (
                        <m.div
                            key="step1"
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.3 }}
                            className="w-full max-w-lg"
                        >
                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                                מה הסיבה הכי גדולה שאתה רוצה להשתמש ב-AI?
                            </h2>
                            <p className="text-zinc-500 text-sm mb-8">בחר עד 2 תחומים</p>
                            <div className="flex flex-col gap-3">
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
                            <p className="text-[11px] text-zinc-600 mt-4 text-center">בחר עד 2 תחומים</p>
                        </m.div>
                    )}

                    {/* ── Step 2: AI Usage ── */}
                    {step === 2 && (
                        <m.div
                            key="step2"
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.3 }}
                            className="w-full max-w-lg"
                        >
                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                                מה אתה הכי הרבה מייצר או צריך לייצר?
                            </h2>
                            <p className="text-[11px] text-zinc-500 mb-8">בחר עד 3</p>
                            <div className="flex flex-col gap-3">
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
                            <p className="text-[11px] text-zinc-600 mt-4 text-center">בחר עד 3</p>
                        </m.div>
                    )}

                    {/* ── Step 3: Output ── */}
                    {step === 3 && (
                        <m.div
                            key="step3"
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.3 }}
                            className="w-full max-w-lg"
                        >
                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                                כמה עמוק בדרך כלל הפלט שאתה צריך?
                            </h2>
                            <p className="text-zinc-500 text-sm mb-8">בחר אחד</p>
                            <div className="flex flex-col gap-3">
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

                    {/* ── Step 4: Depth ── */}
                    {step === 4 && (
                        <m.div
                            key="step4"
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.3 }}
                            className="w-full max-w-lg"
                        >
                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                                איך אתה מעדיף לעבוד עם AI?
                            </h2>
                            <p className="text-zinc-500 text-sm mb-8">בחר אחד</p>
                            <div className="flex flex-col gap-3">
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

                    {/* ── Step 5: Budget (NEW) ── */}
                    {step === 5 && (
                        <m.div
                            key="step5"
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.3 }}
                            className="w-full max-w-lg"
                        >
                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                                כמה אתה מוכן להוציא על כלי AI בחודש?
                            </h2>
                            <p className="text-zinc-500 text-sm mb-8">בחר אחד</p>
                            <div className="flex flex-col gap-3">
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

                    {/* ── Step 6: Tools (was step 5) ── */}
                    {step === 6 && (
                        <m.div
                            key="step6"
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.3 }}
                            className="w-full max-w-lg"
                        >
                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                                באילו כלי AI כבר השתמשת?
                            </h2>
                            <p className="text-zinc-500 text-sm mb-6">ניתן לבחור כמה שרוצים, או אף אחד</p>

                            {/* Section A: LLM tools */}
                            <p className="text-xs font-bold text-zinc-500 tracking-wider uppercase mb-3">כלי AI שיחתיים</p>
                            <div className="grid grid-cols-3 gap-3 mb-6">
                                {LLM_TOOLS.map((tool) => (
                                    <ToolCard
                                        key={tool.id}
                                        tool={tool}
                                        selected={!noneSelected && selectedTools.includes(tool.id)}
                                        onClick={() => toggleTool(tool.id)}
                                    />
                                ))}
                            </div>

                            {/* Divider */}
                            <div className="h-px bg-white/[0.06] mb-6" />

                            {/* Section B: Creative tools */}
                            <p className="text-xs font-bold text-zinc-500 tracking-wider uppercase mb-3">כלים יצירתיים ופרודקטיביים</p>
                            <div className="grid grid-cols-3 gap-3 mb-6">
                                {CREATIVE_TOOLS.map((tool) => (
                                    <ToolCard
                                        key={tool.id}
                                        tool={tool}
                                        selected={!noneSelected && selectedTools.includes(tool.id)}
                                        onClick={() => toggleTool(tool.id)}
                                    />
                                ))}
                            </div>

                            {/* None option */}
                            <button
                                onClick={handleNone}
                                className={cn(
                                    "w-full p-3 rounded-2xl border text-center text-sm font-medium transition-all duration-200",
                                    noneSelected
                                        ? "border-[#534AB7] bg-[#EEEDFE10] text-white"
                                        : "border-white/[0.08] text-zinc-400 hover:bg-white/[0.03]"
                                )}
                            >
                                אף אחד מהרשימה
                            </button>
                        </m.div>
                    )}

                    {/* ── Step 7: Loading (was step 6) ── */}
                    {step === 7 && (
                        <m.div
                            key="step7"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center"
                        >
                            <p className="text-xl font-bold text-white mb-6">מנתח את הפרופיל שלך...</p>
                            <div className="flex gap-2">
                                {[0, 1, 2].map((i) => (
                                    <m.div
                                        key={i}
                                        className="w-3 h-3 rounded-full bg-[#534AB7]"
                                        animate={{ opacity: [0.3, 1, 0.3] }}
                                        transition={{
                                            duration: 1,
                                            repeat: Infinity,
                                            delay: i * 0.2,
                                        }}
                                    />
                                ))}
                            </div>
                        </m.div>
                    )}

                    {/* ── Step 8: Result ── */}
                    {step === 8 && result && (
                        <m.div
                            key="step8"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.4 }}
                            className="w-full max-w-lg pb-14"
                        >
                            {/* SECTION A — Profile reveal */}
                            <m.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, ease: "easeOut", delay: 0 }}
                                className="w-full flex flex-col items-center text-center pt-[56px]"
                            >
                                <p className="text-[11px] uppercase tracking-[0.1em] text-zinc-500 mb-[10px]" style={{ color: "var(--color-text-tertiary, #a1a1aa)" }}>
                                    הפרופיל שלך
                                </p>
                                <h2 className="text-[42px] font-medium text-white mb-[16px]" style={{ color: "var(--color-text-primary, #ffffff)" }}>
                                    {result.profileTitle}
                                </h2>
                                <div className="w-[48px] h-[3px] bg-[#534AB7] rounded-full mx-auto mb-[40px]" />
                            </m.div>

                            {/* SECTION B — Primary model */}
                            <m.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, ease: "easeOut", delay: 0.12 }}
                                className="w-full flex flex-col"
                            >
                                <div className="flex justify-between max-w-[360px] mx-auto w-full mb-1" dir="rtl">
                                    <p className="text-[11px] uppercase text-zinc-500 tracking-wider">הנשק הראשי שלך</p>
                                    <div></div>
                                </div>
                                {(() => {
                                    const modelCards = generateModelCards(result);
                                    const primary = modelCards[0];
                                    const theme = MODEL_THEME[primary.model];
                                    return (
                                        <div className={`max-w-[360px] mx-auto w-full rounded-[24px] bg-gradient-to-br ${theme.gradient} p-[24px_20px] relative overflow-hidden`} dir="rtl"
                                            style={{ border: `1px solid ${theme.accentColor}40` }}>
                                            {/* Animated orb 1 */}
                                            <m.div
                                                animate={{ x: [0, 20, -10, 0], y: [0, -15, 10, 0], scale: [1, 1.2, 0.9, 1] }}
                                                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                                                className="absolute top-[-30px] right-[-30px] w-[120px] h-[120px] rounded-full pointer-events-none"
                                                style={{ background: `radial-gradient(circle, ${theme.orbColors[0]} 0%, transparent 70%)`, filter: "blur(20px)" }}
                                            />
                                            {/* Animated orb 2 */}
                                            <m.div
                                                animate={{ x: [0, -15, 10, 0], y: [0, 12, -8, 0], scale: [1, 1.15, 0.95, 1] }}
                                                transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 3 }}
                                                className="absolute bottom-[-20px] left-[-20px] w-[100px] h-[100px] rounded-full pointer-events-none"
                                                style={{ background: `radial-gradient(circle, ${theme.orbColors[1]} 0%, transparent 70%)`, filter: "blur(20px)" }}
                                            />

                                            {primary.model === "gemini" && result.geminiIsAllRounder && (
                                                <div className="absolute top-4 left-4 bg-[#FAEEDA] text-[#854F0B] text-[11px] font-medium px-[9px] py-[3px] rounded-full z-10">
                                                    All-rounder ⚡
                                                </div>
                                            )}

                                            <div className="flex items-center relative z-10">
                                                <img src={`/assets/logos/${primary.model}.png`} alt={primary.model} className="w-[52px] h-[52px] object-contain ml-[14px] rounded-xl" />
                                                <div>
                                                    <span className="text-[24px] font-medium text-white">{MODEL_NAMES[primary.model]}</span>
                                                    <div className="text-[11px] mt-[1px]" style={{ color: theme.accentColor }}>{theme.tagline}</div>
                                                </div>
                                            </div>

                                            <div className="mt-[16px] pt-[16px] text-[14px] leading-[1.7] text-zinc-300 relative z-10"
                                                style={{ borderTop: `0.5px solid ${theme.accentColor}30` }}>
                                                {primary.profileExplanation}
                                            </div>

                                            <div className="mt-[14px] flex flex-col gap-[8px] relative z-10">
                                                {primary.pros.map((pro, i) => (
                                                    <div key={`p-${i}`} className="flex items-center gap-2">
                                                        <div className="w-[6px] h-[6px] rounded-full bg-[#22c55e] shrink-0" />
                                                        <span className="text-[13px] text-white">{pro}</span>
                                                    </div>
                                                ))}
                                                {primary.cons.map((con, i) => (
                                                    <div key={`c-${i}`} className="flex items-center gap-2">
                                                        <div className="w-[6px] h-[6px] rounded-full bg-[#ef4444] shrink-0" />
                                                        <span className="text-[13px] text-zinc-400">{con}</span>
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
                                transition={{ duration: 0.4, ease: "easeOut", delay: 0.24 }}
                                className="w-full flex flex-col mt-4"
                            >
                                <div className="flex justify-between max-w-[360px] mx-auto w-full mb-1" dir="rtl">
                                    <p className="text-[11px] uppercase text-zinc-500 tracking-wider">כלי משלים</p>
                                    <div></div>
                                </div>
                                {(() => {
                                    const modelCards = generateModelCards(result);
                                    const secondary = modelCards[1];
                                    const secTheme = MODEL_THEME[secondary.model];
                                    return (
                                        <div className="max-w-[360px] mx-auto w-full rounded-[18px] p-[18px_20px] relative overflow-hidden" dir="rtl"
                                            style={{ border: `0.5px solid ${secTheme.accentColor}30`, background: `${secTheme.glowColor}` }}>
                                            {/* Subtle orb */}
                                            <div className="absolute top-[-20px] right-[-20px] w-[80px] h-[80px] rounded-full pointer-events-none"
                                                style={{ background: `radial-gradient(circle, ${secTheme.orbColors[0]} 0%, transparent 70%)`, filter: "blur(15px)" }} />

                                            <div className="flex items-center relative z-10">
                                                <img src={`/assets/logos/${secondary.model}.png`} alt={secondary.model} className="w-[36px] h-[36px] object-contain ml-[12px] rounded-lg" />
                                                <div>
                                                    <span className="text-[16px] font-medium text-white">{MODEL_NAMES[secondary.model]}</span>
                                                    <div className="text-[10px]" style={{ color: secTheme.accentColor }}>{secTheme.tagline}</div>
                                                </div>
                                            </div>

                                            <div className="mt-[12px] pt-[12px] text-[12px] leading-[1.6] text-zinc-400 relative z-10"
                                                style={{ borderTop: `0.5px solid ${secTheme.accentColor}25` }}>
                                                {secondary.profileExplanation.split('.')[0] + '.'}
                                            </div>

                                            <div className="mt-[12px] flex flex-col gap-[8px] relative z-10">
                                                {secondary.pros.slice(0, 2).map((pro, i) => (
                                                    <div key={`p2-${i}`} className="flex items-center gap-2">
                                                        <div className="w-[6px] h-[6px] rounded-full bg-[#22c55e] shrink-0" />
                                                        <span className="text-[13px] text-white">{pro}</span>
                                                    </div>
                                                ))}
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
                                    transition={{ duration: 0.4, ease: "easeOut", delay: 0.36 }}
                                    className="w-full mt-8 overflow-hidden pl-6"
                                >
                                    <div className="flex justify-between max-w-[360px] mx-auto w-full mb-3 pr-6" dir="rtl">
                                        <p className="text-[11px] uppercase text-zinc-500 tracking-wider">כלים נוספים שכדאי להכיר</p>
                                        <div></div>
                                    </div>
                                    <div className="flex gap-3 overflow-x-auto pb-4 hide-scrollbar justify-end flex-row-reverse" dir="rtl">
                                        {(() => {
                                            const labels: Record<string, string> = {
                                                "Midjourney": "יצירת תמונות",
                                                "DALL-E": "יצירת תמונות",
                                                "Runway": "עריכת וידיאו",
                                                "Suno": "יצירת מוזיקה",
                                                "ElevenLabs": "יצירת קול",
                                                "Udio": "יצירת מוזיקה",
                                                "NotebookLM": "לימוד ממסמכים",
                                                "Perplexity": "חיפוש חכם",
                                                "Cursor": "קוד עם AI",
                                                "v0": "בניית ממשקים",
                                                "GitHub Copilot": "קוד עם AI",
                                                "Julius AI": "ניתוח דאטה",
                                                "ChatGPT Data Analysis": "ניתוח דאטה"
                                            };
                                            return result.specialistTools.map(tool => (
                                                <div key={tool} className="flex flex-col items-center shrink-0">
                                                    <div className="border-[0.5px] border-white/[0.1] rounded-full px-[14px] py-[6px] bg-white/[0.03] whitespace-nowrap text-[13px] text-white mb-1" style={{ background: "var(--color-background-secondary, rgba(255,255,255,0.03))", borderColor: "var(--color-border-tertiary, rgba(255,255,255,0.1))" }}>
                                                        {tool}
                                                    </div>
                                                    <span className="text-[10px] text-zinc-500">{labels[tool] || "כלי עזר"}</span>
                                                </div>
                                            ));
                                        })()}
                                        {/* Spacer to allow scroll past last item */}
                                        <div className="w-4 shrink-0" />
                                    </div>
                                    <div className="text-[12px] text-zinc-500 text-center mt-2 max-w-[360px] mx-auto pr-6" dir="rtl">
                                        אלה לא מודלי שפה — הם כלים מיוחדים שמשלימים את הסטאק שלך
                                    </div>
                                </m.div>
                            )}

                            {/* SECTION E — Disclaimer */}
                            <m.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, ease: "easeOut", delay: result.specialistTools?.length ? 0.44 : 0.36 }}
                                className="w-full mt-7"
                            >
                                <div className="max-w-[360px] mx-auto rounded-2xl border-[0.5px] border-white/[0.1] bg-white/[0.03] p-[16px_18px]" dir="rtl" style={{ background: "var(--color-background-secondary, rgba(255,255,255,0.03))", borderColor: "var(--color-border-tertiary, rgba(255,255,255,0.1))" }}>
                                    <div className="text-[13px] font-medium text-white mb-2">
                                        ⚡ לפני שממשיכים
                                    </div>
                                    <div className="text-[12px] text-zinc-400 leading-[1.8]" style={{ color: "var(--color-text-secondary, #a1a1aa)" }}>
                                        • הכלים האלה מתעדכנים כל הזמן — מה שנכון היום יכול להשתנות בחודש הבא.<br />
                                        • ההמלצה מבוססת על התשובות שלך, אבל הדרך הכי טובה לדעת מה עובד לך היא לנסות בעצמך.<br />
                                        • כל הכלים קיימים בגרסה חינמית — אל תשלם כלום לפני שהתנסית.
                                    </div>
                                </div>
                            </m.div>

                            {/* SECTION F — CTA */}
                            <m.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, ease: "easeOut", delay: result.specialistTools?.length ? 0.52 : 0.44 }}
                                className="w-full mt-6 mb-14"
                            >
                                <div className="max-w-[360px] mx-auto">
                                    <button
                                        onClick={handleFinish}
                                        className="w-full h-[54px] bg-white text-black font-medium text-[16px] rounded-full border-none cursor-pointer hover:opacity-85 transition-[opacity,transform] duration-150 active:scale-95"
                                    >
                                        התחל את קורס הבסיס
                                    </button>
                                </div>
                            </m.div>
                        </m.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Bottom CTA — for question steps only (1-6) */}
            {step <= 6 && (
                <div className="px-6 pb-8 pt-4">
                    <button
                        onClick={handleAdvance}
                        disabled={!canAdvance()}
                        className={cn(
                            "w-full py-4 rounded-full font-bold text-base transition-all duration-200",
                            canAdvance()
                                ? "bg-[#534AB7] text-white hover:bg-[#4740A0] shadow-lg"
                                : "bg-white/5 text-zinc-600 cursor-not-allowed"
                        )}
                    >
                        {step === 6 ? "קבל את התוצאה שלך" : "המשך"}
                    </button>
                </div>
            )}
        </div>
    );
}

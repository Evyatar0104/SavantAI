"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { m, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { PRACTICE_ITEMS, type BuilderStep } from "@/content";
import { useSavantStore } from "@/store/useSavantStore";
import { haptics } from "@/lib/haptics";
import { X, Copy, CheckCircle2, Sparkles, Zap, ArrowRight, Send } from "lucide-react";
import confetti from "canvas-confetti";

// ── Theme per tool ────────────────────────────────────────────────────────────
const THEMES: Record<string, { primary: string; glow: string }> = {
    Claude:     { primary: "#D97757", glow: "rgba(217,119,87,0.22)" },
    ChatGPT:    { primary: "#10A37F", glow: "rgba(16,163,127,0.22)" },
    Gemini:     { primary: "#4285F4", glow: "rgba(66,133,244,0.22)" },
    "כל מודל": { primary: "#8B5CF6", glow: "rgba(139,92,246,0.22)" },
};

const TOOL_LOGO: Record<string, string | null> = {
    Claude:     "/assets/logos/claude.png",
    ChatGPT:    "/assets/logos/chatgpt.png",
    Gemini:     "/assets/logos/gemini.png",
    "כל מודל": null,
};

type FeedbackOption = { id: string; label: string; refinement: string; emoji: string };

const FEEDBACK_OPTIONS: FeedbackOption[] = [
    { id: "perfect",    label: "מעולה, בדיוק מה שחיפשתי",  refinement: "",                                                                           emoji: "✨" },
    { id: "too-long",   label: "ארוך מדי — תקצר",           refinement: "תקצר ב-30% ותהפוך את זה ליותר תכליתי וממוקד.",                              emoji: "📏" },
    { id: "too-dry",    label: "יבש מדי — תוסיף חיים",      refinement: "הוסף קצת הומור וסלנג מודרני, הפוך את זה ליותר שיווקי ומעניין.",             emoji: "🌶️" },
    { id: "inaccurate", label: "לא מספיק מדויק",            refinement: "תתמקד בעיקר, תתעלם מפרטים שוליים ותחדד את הנקודה המרכזית.",                emoji: "🎯" },
];

// ── XP Counter ────────────────────────────────────────────────────────────────
function XPCounter({ target }: { target: number }) {
    const [display, setDisplay] = useState(0);
    useEffect(() => {
        const start = Date.now();
        const duration = 1200;
        const tick = () => {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            setDisplay(Math.round((1 - Math.pow(1 - progress, 4)) * target));
            if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    }, [target]);
    return <span>+{display}</span>;
}

// ── Step progress bar ─────────────────────────────────────────────────────────
function StepBar({ total, current, themeColor }: { total: number; current: number; themeColor: string }) {
    return (
        <div className="flex gap-1.5 flex-1 mx-4">
            {Array.from({ length: total }).map((_, i) => (
                <div
                    key={i}
                    className="h-1 flex-1 rounded-full transition-all duration-500"
                    style={{
                        background: i < current
                            ? themeColor
                            : i === current
                            ? `${themeColor}88`
                            : "rgba(255,255,255,0.1)",
                    }}
                />
            ))}
        </div>
    );
}

// ── Prompt Slot ───────────────────────────────────────────────────────────────
// Renders inline within the prompt text. Three states: empty+inactive, empty+active, filled.
function PromptSlot({
    stepId,
    value,
    isActive,
    themeColor,
}: {
    stepId: string;
    value: string | undefined;
    isActive: boolean;
    themeColor: string;
}) {
    if (value) {
        return (
            <m.span
                key={`filled-${stepId}-${value}`}
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{
                    scale: 1,
                    opacity: 1,
                    boxShadow: [`0 0 0 1px ${themeColor}cc`, `0 0 14px ${themeColor}88`, `0 0 0 1px ${themeColor}44`],
                }}
                transition={{ duration: 0.2, ease: "easeOut", boxShadow: { duration: 0.5, times: [0, 0.3, 1] } }}
                className="inline-block rounded-lg px-2 py-0.5 mx-1 font-bold align-baseline"
                style={{
                    color: themeColor,
                    background: `${themeColor}18`,
                    willChange: "transform",
                }}
            >
                {value}
            </m.span>
        );
    }

    if (isActive) {
        return (
            <m.span
                key={`active-${stepId}`}
                animate={{
                    boxShadow: [
                        `0 0 0 1px ${themeColor}55`,
                        `0 0 0 1.5px ${themeColor}cc`,
                        `0 0 0 1px ${themeColor}55`,
                    ],
                    opacity: [0.6, 1, 0.6],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="inline-block rounded-lg px-3 py-0.5 mx-1 align-baseline"
                style={{
                    color: themeColor,
                    background: `${themeColor}0f`,
                    minWidth: 56,
                    textAlign: "center",
                    willChange: "transform",
                }}
            >
                ___
            </m.span>
        );
    }

    // empty + inactive
    return (
        <m.span
            key={`empty-${stepId}`}
            animate={{ opacity: [0.25, 0.5, 0.25] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="inline-block rounded-md px-3 py-0.5 mx-1 align-baseline"
            style={{
                color: "rgba(255,255,255,0.35)",
                background: "rgba(255,255,255,0.05)",
                minWidth: 56,
                textAlign: "center",
            }}
        >
            ___
        </m.span>
    );
}

// ── Prompt Canvas ─────────────────────────────────────────────────────────────
// Always visible. Shows the full prompt with live slots.
function PromptCanvas({
    steps,
    builderInputs,
    currentStepIndex,
    phase,
    theme,
    copied,
    copyButtonRef,
    onCopy,
    onComplete,
}: {
    steps: BuilderStep[];
    builderInputs: Record<string, string>;
    currentStepIndex: number;
    phase: "building" | "ready" | "complete";
    theme: { primary: string; glow: string };
    copied: boolean;
    copyButtonRef: React.RefObject<HTMLButtonElement | null>;
    onCopy: () => void;
    onComplete: () => void;
}) {
    const [selectedFeedback, setSelectedFeedback] = useState<FeedbackOption | null>(null);
    const [refinementText, setRefinementText]     = useState("");
    const [refineCopied, setRefineCopied]         = useState(false);

    const isReady = phase === "ready";

    const handleFeedbackSelect = (opt: FeedbackOption) => {
        haptics.tap();
        if (opt.id === "perfect") {
            onComplete();
        } else {
            setSelectedFeedback(opt);
            setRefinementText(opt.refinement);
        }
    };

    const handleApplyRefinement = () => {
        if (!refinementText.trim()) return;
        haptics.success();
        const base = steps.map((s) => s.template.replace("{{input}}", builderInputs[s.id] || "")).join(" ");
        navigator.clipboard.writeText(base + " " + refinementText.trim());
        setRefineCopied(true);
        setSelectedFeedback(null);
        setTimeout(() => setRefineCopied(false), 2000);
    };

    return (
        <m.div
            animate={{
                boxShadow: isReady
                    ? `0 0 0 1.5px ${theme.primary}bb, 0 0 32px ${theme.glow}`
                    : "0 0 0 0.5px rgba(255,255,255,0.08)",
            }}
            transition={{ duration: 0.4 }}
            className="rounded-2xl p-5 mb-6"
            style={{ background: "rgba(255,255,255,0.04)" }}
        >
            {/* Label */}
            <p
                className="text-xs font-bold uppercase tracking-widest mb-4"
                style={{ color: "rgba(255,255,255,0.3)" }}
            >
                הפרומפט שלך
            </p>

            {/* Assembled prompt with inline slots */}
            <div className="text-base leading-loose text-right" dir="rtl">
                {steps.map((step, i) => {
                    const parts  = step.template.split("{{input}}");
                    const before = parts[0] || "";
                    const after  = parts[1] || "";
                    const isActive = phase === "building" && i === currentStepIndex;

                    return (
                        <span key={step.id}>
                            {before}
                            <PromptSlot
                                stepId={step.id}
                                value={builderInputs[step.id]}
                                isActive={isActive}
                                themeColor={theme.primary}
                            />
                            {after}{" "}
                        </span>
                    );
                })}
            </div>

            {/* Ready state: copy + feedback */}
            <AnimatePresence>
                {isReady && (
                    <m.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        className="mt-6"
                        style={{ willChange: "transform" }}
                    >
                        {/* Copy button */}
                        <m.button
                            ref={copyButtonRef}
                            whileTap={{ scale: 0.97 }}
                            onClick={onCopy}
                            className="w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2.5 mb-4 relative overflow-hidden transition-all"
                            style={{
                                background: theme.primary,
                                color: "white",
                                willChange: "transform",
                            }}
                        >
                            <AnimatePresence mode="wait">
                                {(copied || refineCopied) ? (
                                    <m.span key="done" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                                        <CheckCircle2 className="w-5 h-5" />
                                        הועתק ללוח!
                                    </m.span>
                                ) : (
                                    <m.span key="copy" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                                        <Copy className="w-5 h-5" />
                                        העתק פרומפט
                                    </m.span>
                                )}
                            </AnimatePresence>
                        </m.button>

                        {/* Divider */}
                        <div style={{ height: 1, background: "rgba(255,255,255,0.07)", marginBottom: 20 }} />

                        {/* Feedback header */}
                        <m.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.35 }}
                        >
                            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "rgba(255,255,255,0.3)" }}>
                                איך נראית התוצאה?
                            </p>

                            {/* Feedback chips */}
                            <div className="flex flex-col gap-2">
                                {FEEDBACK_OPTIONS.map((opt, idx) => (
                                    <m.button
                                        key={opt.id}
                                        initial={{ opacity: 0, y: 12 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 + idx * 0.06 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handleFeedbackSelect(opt)}
                                        className="w-full text-right py-3.5 px-4 rounded-xl font-medium text-sm flex items-center gap-3 transition-all"
                                        style={{
                                            background: opt.id === "perfect"
                                                ? `${theme.primary}15`
                                                : "rgba(255,255,255,0.04)",
                                            border: opt.id === "perfect"
                                                ? `0.5px solid ${theme.primary}55`
                                                : "0.5px solid rgba(255,255,255,0.07)",
                                            color: "rgba(255,255,255,0.8)",
                                            willChange: "transform",
                                        }}
                                    >
                                        <span className="text-base shrink-0">{opt.emoji}</span>
                                        <span>{opt.label}</span>
                                    </m.button>
                                ))}
                            </div>

                            {/* Inline refinement textarea */}
                            <AnimatePresence>
                                {selectedFeedback && (
                                    <m.div
                                        key="refinement"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.25 }}
                                        className="overflow-hidden mt-3"
                                    >
                                        <textarea
                                            value={refinementText}
                                            onChange={(e) => setRefinementText(e.target.value)}
                                            dir="rtl"
                                            rows={3}
                                            className="w-full rounded-xl p-4 text-sm outline-none resize-none mb-3 transition-all"
                                            style={{
                                                background: "rgba(255,255,255,0.04)",
                                                border: "0.5px solid rgba(255,255,255,0.12)",
                                                color: "white",
                                            }}
                                        />
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setSelectedFeedback(null)}
                                                className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all active:scale-95"
                                                style={{
                                                    background: "rgba(255,255,255,0.05)",
                                                    border: "0.5px solid rgba(255,255,255,0.08)",
                                                    color: "rgba(255,255,255,0.45)",
                                                }}
                                            >
                                                ביטול
                                            </button>
                                            <m.button
                                                whileTap={{ scale: 0.97 }}
                                                onClick={handleApplyRefinement}
                                                disabled={!refinementText.trim()}
                                                className="flex-2 py-3 rounded-xl text-sm font-bold transition-all disabled:opacity-40"
                                                style={{ background: theme.primary, color: "white", willChange: "transform" }}
                                            >
                                                הוסף ל-Clipboard
                                            </m.button>
                                        </div>
                                    </m.div>
                                )}
                            </AnimatePresence>

                        </m.div>
                    </m.div>
                )}
            </AnimatePresence>
        </m.div>
    );
}

// ── Step Input Area ───────────────────────────────────────────────────────────
function StepInputArea({
    step,
    themeColor,
    isApproving,
    approvedValue,
    onSelect,
}: {
    step: BuilderStep;
    themeColor: string;
    isApproving: boolean;
    approvedValue: string;
    onSelect: (opt: string) => void;
}) {
    const [customText, setCustomText] = useState("");

    const handleCustomSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault();
        if (customText.trim()) {
            onSelect(customText.trim());
            setCustomText("");
        }
    };

    return (
        <div>
            {/* Question */}
            <div className="mb-5">
                <p
                    className="text-xs font-bold uppercase tracking-widest mb-1.5"
                    style={{ color: themeColor, opacity: 0.75 }}
                >
                    איטרציה חיה
                </p>
                <h2 className="text-xl font-bold leading-snug">{step.label}</h2>
                <p className="text-sm mt-2" style={{ color: "rgba(255,255,255,0.55)" }}>
                    בוחרים ניסוח, רואים אותו נטמע מיד בפרומפט, וממשיכים לשיפור הבא.
                </p>
            </div>

            {/* Options */}
            <div className="flex flex-col gap-2.5 mb-3">
                <AnimatePresence mode="popLayout">
                    {!isApproving && step.options?.map((opt, idx) => (
                        <m.button
                            key={opt}
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.96 }}
                            transition={{ delay: idx * 0.04, duration: 0.22 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onSelect(opt)}
                            className="w-full text-right py-4 px-5 rounded-2xl font-semibold text-base transition-all"
                            style={{
                                background: "rgba(255,255,255,0.05)",
                                border: "0.5px solid rgba(255,255,255,0.1)",
                                color: "rgba(255,255,255,0.85)",
                                willChange: "transform",
                            }}
                        >
                            {opt}
                        </m.button>
                    ))}
                </AnimatePresence>

                {/* Approving state */}
                <AnimatePresence>
                    {isApproving && (
                        <m.div
                            initial={{ opacity: 0, scale: 0.96 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.96 }}
                            className="w-full py-4 px-5 rounded-2xl flex items-center justify-center gap-3"
                            style={{
                                background: `${themeColor}15`,
                                border: `0.5px solid ${themeColor}55`,
                                willChange: "transform",
                            }}
                        >
                            <CheckCircle2 className="w-5 h-5" style={{ color: themeColor }} />
                            <span className="font-bold text-base" style={{ color: themeColor }}>
                                {approvedValue}
                            </span>
                        </m.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Custom input — shown for hybrid/text types */}
            {!isApproving && step.type !== "select" && (
                <m.form
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (step.options?.length || 0) * 0.04 + 0.06 }}
                    onSubmit={handleCustomSubmit}
                    className="relative"
                >
                    <input
                        type="text"
                        value={customText}
                        onChange={(e) => setCustomText(e.target.value)}
                        placeholder="הקלד ערך משלך..."
                        dir="rtl"
                        className="w-full py-4 px-5 rounded-2xl text-base outline-none transition-all"
                        style={{
                            background: "rgba(255,255,255,0.03)",
                            border: "0.5px dashed rgba(255,255,255,0.18)",
                            color: "white",
                        }}
                    />
                    {customText.trim() && (
                        <button
                            type="submit"
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl flex items-center justify-center transition-all active:scale-90"
                            style={{ background: themeColor }}
                        >
                            <Send className="w-3.5 h-3.5 text-white" />
                        </button>
                    )}
                </m.form>
            )}
        </div>
    );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function PromptBuilderPage() {
    const params       = useParams();
    const router       = useRouter();
    const searchParams = useSearchParams();
    const id           = params.id as string;
    const from         = searchParams.get("from");
    const courseId     = searchParams.get("courseId");

    const item = useMemo(() => PRACTICE_ITEMS.find((p) => p.id === id), [id]);

    const {
        activePracticeId, setActivePracticeId,
        currentStepIndex, setCurrentStepIndex,
        builderInputs, setBuilderInput,
        resetBuilder,
        completePracticeItem,
    } = useSavantStore();

    const [isClient,    setIsClient]    = useState(false);
    const [phase,       setPhase]       = useState<"building" | "ready" | "complete">("building");
    const [copied,      setCopied]      = useState(false);
    const [isApproving, setIsApproving] = useState(false);

    const copyButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const timer = setTimeout(() => setIsClient(true), 0);
        if (item && activePracticeId !== item.id) {
            const timer2 = setTimeout(() => setActivePracticeId(item.id), 0);
            return () => { clearTimeout(timer); clearTimeout(timer2); };
        }
        return () => clearTimeout(timer);
    }, [item, activePracticeId, setActivePracticeId]);

    // Scroll copy button into view when ready
    useEffect(() => {
        if (phase === "ready") {
            copyButtonRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }, [phase]);

    if (!isClient || !item || !item.builderSteps) return null;

    const steps    = item.builderSteps;
    const theme    = THEMES[item.recommendedModel] || THEMES["כל מודל"];
    const toolLogo = TOOL_LOGO[item.recommendedModel];

    const fullPrompt = steps
        .map((s) => s.template.replace("{{input}}", builderInputs[s.id] || ""))
        .join(" ");

    // ── Handlers ──────────────────────────────────────────────────────────────
    const handleExit = () => {
        haptics.tap();
        resetBuilder();
        if (from === "course" && courseId) {
            router.push(`/courses/${courseId}`);
        } else if (from === "practice") {
            router.push("/practice");
        } else {
            router.push("/");
        }
    };

    const handlePrevStep = () => {
        haptics.tap();
        if (currentStepIndex > 0) setCurrentStepIndex(currentStepIndex - 1);
    };

    const handleSelectOption = (opt: string) => {
        haptics.tap();
        setBuilderInput(steps[currentStepIndex].id, opt);
        setIsApproving(true);
        setTimeout(() => {
            haptics.success();
            setIsApproving(false);
            if (currentStepIndex < steps.length - 1) {
                setCurrentStepIndex(currentStepIndex + 1);
            } else {
                setPhase("ready");
            }
        }, 600);
    };

    const handleCopy = () => {
        haptics.success();
        navigator.clipboard.writeText(fullPrompt);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleComplete = () => {
        haptics.complete();
        completePracticeItem(item.id, item.xp);
        setPhase("complete");
        confetti({
            particleCount: 120,
            spread: 70,
            origin: { y: 0.6 },
            colors: [theme.primary, "#ffffff", "#FCD34D"],
            zIndex: 1000,
        });
    };

    const handleReturnToRefine = () => {
        haptics.tap();
        setPhase("ready");
    };

    const handleStartAnotherIteration = () => {
        haptics.tap();
        resetBuilder();
        setCurrentStepIndex(0);
        setCopied(false);
        setPhase("building");
    };

    // ── COMPLETE phase ────────────────────────────────────────────────────────
    if (phase === "complete") {
        return (
            <div
                dir="rtl"
                className="fixed inset-0 z-200 flex flex-col overflow-hidden"
                style={{
                    background: `radial-gradient(ellipse 70% 50% at 50% 0%, ${theme.glow}, transparent 65%), #0d0f1a`,
                    color: "white",
                }}
            >
                <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center px-6 pb-16 text-center">
                    <div className="max-w-95 w-full flex flex-col items-center">
                        <m.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: [0, 1.15, 1], opacity: 1 }}
                            transition={{ duration: 0.55, ease: "easeOut" }}
                            className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6"
                            style={{
                                background: `${theme.primary}22`,
                                border: `1px solid ${theme.primary}44`,
                                boxShadow: `0 0 40px ${theme.glow}`,
                                willChange: "transform",
                            }}
                        >
                            {toolLogo ? (
                                <Image src={toolLogo} alt={item.recommendedModel} width={40} height={40} style={{ objectFit: "contain" }} />
                            ) : (
                                <Sparkles className="w-8 h-8" style={{ color: theme.primary }} />
                            )}
                        </m.div>

                        <m.h2
                            initial={{ y: 16, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.25 }}
                            className="text-3xl font-bold mb-2"
                        >
                            איטרציה הושלמה
                        </m.h2>

                        <m.p
                            initial={{ y: 12, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-base mb-8"
                            style={{ color: "rgba(255,255,255,0.5)" }}
                        >
                            יש לך גרסה טובה. עכשיו אפשר לדייק אותה לעוד סיבוב ולראות מה משתפר.
                        </m.p>

                        <m.div
                            initial={{ y: 16, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.55 }}
                            className="flex items-center gap-2 px-6 py-3 rounded-2xl mb-8"
                            style={{
                                background: "rgba(252,211,77,0.1)",
                                border: "0.5px solid rgba(252,211,77,0.25)",
                                willChange: "transform",
                            }}
                        >
                            <Zap className="w-5 h-5 text-yellow-400" />
                            <span className="text-2xl font-black text-yellow-400">
                                <XPCounter target={item.xp} />
                            </span>
                            <span className="text-sm font-semibold" style={{ color: "rgba(252,211,77,0.7)" }}>XP</span>
                        </m.div>

                        <m.div
                            initial={{ y: 16, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.75 }}
                            className="w-full rounded-2xl p-4 text-right mb-8 relative overflow-hidden"
                            style={{
                                background: "rgba(255,255,255,0.04)",
                                border: "0.5px solid rgba(255,255,255,0.08)",
                                willChange: "transform",
                            }}
                        >
                            <div className="absolute top-0 right-0 w-1 h-full rounded-r-2xl" style={{ background: theme.primary }} />
                            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.3)" }}>
                                התוצר של האיטרציה
                            </p>
                            <p className="text-sm leading-relaxed line-clamp-3" style={{ color: "rgba(255,255,255,0.7)" }}>
                                {fullPrompt}
                            </p>
                        </m.div>

                        <m.div
                            initial={{ y: 16, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 1 }}
                            className="w-full flex flex-col gap-3"
                            style={{ willChange: "transform" }}
                        >
                            <m.button
                                whileTap={{ scale: 0.97 }}
                                onClick={handleReturnToRefine}
                                className="w-full py-4 rounded-2xl font-bold text-base transition-all"
                                style={{ background: "white", color: "#0d0f1a", willChange: "transform" }}
                            >
                                לשיפור מהיר של הגרסה הזאת
                            </m.button>
                            <m.button
                                whileTap={{ scale: 0.97 }}
                                onClick={handleStartAnotherIteration}
                                className="w-full py-4 rounded-2xl font-bold text-base transition-all"
                                style={{
                                    background: "rgba(255,255,255,0.06)",
                                    border: "0.5px solid rgba(255,255,255,0.1)",
                                    color: "white",
                                    willChange: "transform",
                                }}
                            >
                                להתחיל איטרציה חדשה
                            </m.button>
                            <button
                                onClick={() => {
                                    const text = `הרגע השלמתי איטרציה ב-Savant והרווחתי ${item.xp} XP!`;
                                    if (navigator.share) navigator.share({ title: "Savant", text });
                                    else navigator.clipboard.writeText(text);
                                }}
                                className="w-full py-3 text-sm font-semibold"
                                style={{ color: "rgba(255,255,255,0.3)" }}
                            >
                                שתף הישג 🏆
                            </button>
                        </m.div>
                    </div>
                </div>
            </div>
        );
    }

    // ── BUILDING + READY phases ───────────────────────────────────────────────
    return (
        <div
            dir="rtl"
            className="fixed inset-0 z-200 flex flex-col"
            style={{
                background: `radial-gradient(ellipse 70% 40% at 50% 0%, ${theme.glow}, transparent 60%), #0d0f1a`,
                color: "white",
            }}
        >
            {/* Header */}
            <header
                className="relative flex items-center px-4 z-50 shrink-0"
                style={{
                    paddingTop: "max(12px, env(safe-area-inset-top))",
                    paddingBottom: 12,
                    borderBottom: "0.5px solid rgba(255,255,255,0.06)",
                }}
            >
                <button
                    onClick={handleExit}
                    className="p-2 rounded-full transition-all active:scale-90"
                    style={{ background: "rgba(255,255,255,0.08)" }}
                >
                    <X className="w-4 h-4 text-white" />
                </button>

                <AnimatePresence>
                    {phase === "building" && currentStepIndex > 0 && (
                        <m.button
                            key="back"
                            initial={{ opacity: 0, x: 8 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 8 }}
                            onClick={handlePrevStep}
                            className="p-2 rounded-full transition-all active:scale-90 mr-2"
                            style={{ background: "rgba(255,255,255,0.08)", willChange: "transform" }}
                        >
                            <ArrowRight className="w-4 h-4 text-white" />
                        </m.button>
                    )}
                </AnimatePresence>

                <StepBar
                    total={steps.length}
                    current={phase === "ready" ? steps.length : currentStepIndex}
                    themeColor={theme.primary}
                />

                <div
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full shrink-0"
                    style={{ background: "rgba(255,255,255,0.06)", border: "0.5px solid rgba(255,255,255,0.1)" }}
                >
                    {toolLogo ? (
                        <Image src={toolLogo} alt={item.recommendedModel} width={14} height={14} style={{ borderRadius: 3, objectFit: "contain" }} />
                    ) : (
                        <Sparkles className="w-3.5 h-3.5" style={{ color: theme.primary }} />
                    )}
                    <span className="text-xs font-semibold" style={{ color: "rgba(255,255,255,0.7)" }}>
                        {item.recommendedModel}
                    </span>
                </div>
            </header>

            {/* Scrollable body */}
            <main className="flex-1 overflow-y-auto">
                <div className="max-w-175 mx-auto px-5 md:px-8 pt-6 pb-16">
                    {/* Always-visible prompt canvas */}
                    <PromptCanvas
                        steps={steps}
                        builderInputs={builderInputs}
                        currentStepIndex={currentStepIndex}
                        phase={phase}
                        theme={theme}
                        copied={copied}
                        copyButtonRef={copyButtonRef}
                        onCopy={handleCopy}
                        onComplete={handleComplete}
                    />

                    {/* Step input area — exits when ready */}
                    <AnimatePresence mode="wait">
                        {phase === "building" && (
                            <m.div
                                key={`step-${currentStepIndex}`}
                                initial={{ opacity: 0, y: 32 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -16, scale: 0.97, transition: { duration: 0.26, ease: "easeOut" } }}
                                transition={{ duration: 0.28, ease: "easeOut" }}
                                style={{ willChange: "transform" }}
                            >
                                <StepInputArea
                                    step={steps[currentStepIndex]}
                                    themeColor={theme.primary}
                                    isApproving={isApproving}
                                    approvedValue={builderInputs[steps[currentStepIndex].id] || ""}
                                    onSelect={handleSelectOption}
                                />
                            </m.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}

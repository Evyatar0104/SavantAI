"use client";

import { useState } from "react";
import Image from "next/image";
import { m, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const QUESTIONS = [
    {
        id: "q1",
        title: "מה הדבר הראשון שאתה רוצה לעשות עם AI?",
        options: [
            { id: "write", label: "📝 לכתוב ולנתח טקסט ארוך" },
            { id: "images", label: "🎨 ליצור תמונות ותוכן ויזואלי" },
            { id: "research", label: "🔍 לחקור נושא לעומק" },
            { id: "workflows", label: "⚙️ לבנות תהליכי עבודה חכמים" }
        ]
    },
    {
        id: "q2",
        title: "איך אתה בדרך כלל עובד?",
        options: [
            { id: "google", label: "🗂️ Google Docs, Gmail, Drive — אני חי שם" },
            { id: "longchat", label: "💬 שיחות ארוכות עם הרבה הקשר" },
            { id: "media", label: "🖼️ הרבה מדיה — תמונות, קבצים, PDF" },
            { id: "deepthink", label: "🧠 משימות שדורשות חשיבה עמוקה" }
        ]
    },
    {
        id: "q3",
        title: "מה הכי חשוב לך במודל AI?",
        options: [
            { id: "accuracy", label: "🎯 דיוק ועומק בתשובות" },
            { id: "creative", label: "🌈 יצירתיות וגיוון יכולות" },
            { id: "integrate", label: "🔗 אינטגרציה עם כלים קיימים" },
            { id: "longdocs", label: "📄 טיפול במסמכים ארוכים" }
        ]
    }
];

export function ModelQuiz({ onTrackSelected }: { onTrackSelected: (trackId: string) => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [scores, setScores] = useState({ claude: 0, chatgpt: 0, gemini: 0 });
    const [isResult, setIsResult] = useState(false);

    const handleAnswer = (answer: string) => {
        const newScores = { ...scores };
        
        // Q1 Logic
        if (currentStep === 0) {
            if (answer === 'write') newScores.claude += 2;
            if (answer === 'images') newScores.chatgpt += 2;
            if (answer === 'research') newScores.gemini += 2;
            if (answer === 'workflows') { newScores.claude += 1; newScores.chatgpt += 1; }
        }
        
        // Q2 Logic
        if (currentStep === 1) {
            if (answer === 'google') newScores.gemini += 2;
            if (answer === 'longchat') newScores.claude += 2;
            if (answer === 'media') newScores.chatgpt += 2;
            if (answer === 'deepthink') newScores.claude += 2;
        }

        // Q3 Logic
        if (currentStep === 2) {
            if (answer === 'accuracy') newScores.claude += 2;
            if (answer === 'creative') newScores.chatgpt += 2;
            if (answer === 'integrate') newScores.gemini += 2;
            if (answer === 'longdocs') newScores.gemini += 2;
        }

        setScores(newScores);

        if (currentStep < 2) {
            setCurrentStep(currentStep + 1);
        } else {
            setIsResult(true);
        }
    };

    const getWinner = () => {
        let max = -1;
        let finalWinner = "ta";
        if (scores.claude > max) { max = scores.claude; finalWinner = "ta"; }
        if (scores.chatgpt > max) { max = scores.chatgpt; finalWinner = "tb"; }
        if (scores.gemini > max) { max = scores.gemini; finalWinner = "tc"; }
        
        // Handling ties prioritizing Claude: check if any is strictly greater than Claude
        if (scores.chatgpt > scores.claude && scores.chatgpt >= scores.gemini) finalWinner = "tb";
        else if (scores.gemini > scores.claude && scores.gemini > scores.chatgpt) finalWinner = "tc";
        
        return finalWinner;
    };

    const winnerData = {
        "ta": {
            name: "Claude",
            logoUrl: "/assets/logos/claude.png",
            colorClass: "text-[#E8845A]",
            copy: "אתה מחפש עומק, ניתוח ועבודה מורכבת — Claude בנוי בדיוק לזה."
        },
        "tb": {
            name: "ChatGPT",
            logoUrl: "/assets/logos/chatgpt.png",
            colorClass: "text-[#8B74E8]",
            copy: "אתה עובד עם הרבה סוגי תוכן ורוצה גמישות — ChatGPT הוא הבחירה שלך."
        },
        "tc": {
            name: "Gemini",
            logoUrl: "/assets/logos/gemini.png",
            colorClass: "text-[#4A9EE8]",
            copy: "אתה חי בתוך Google ועובד עם מסמכים גדולים — Gemini ישנה לך את המשחק."
        }
    };

    const recommended = getWinner();
    const resultInfo = winnerData[recommended as keyof typeof winnerData];

    return (
        <div className="w-full max-w-2xl mx-auto flex flex-col items-center my-8 z-10" dir="rtl">
            {!isOpen ? (
                <button
                    onClick={() => setIsOpen(true)}
                    className="px-6 py-3 border-2 border-[#00C48C] text-[#00C48C] rounded-full font-bold hover:bg-[#00C48C]/10 transition-colors flex items-center shadow-[0_0_15px_rgba(0,196,140,0.2)]"
                >
                    מצא את המודל שלך <ChevronDown className="w-5 h-5 ml-2 rotate-90" />
                </button>
            ) : (
                <m.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    className="w-full overflow-hidden"
                >
                    {!isResult ? (
                        <div className="bg-[#111118] border border-[#1E1E2E] rounded-2xl p-6 shadow-xl w-full">
                            {/* Progress Dots */}
                            <div className="flex justify-center gap-2 mb-6">
                                {[0, 1, 2].map((step) => (
                                    <div
                                        key={step}
                                        className={cn(
                                            "w-2 h-2 rounded-full transition-colors",
                                            currentStep === step ? "bg-[#00C48C] w-4" : "bg-[#1E1E2E]"
                                        )}
                                    />
                                ))}
                            </div>

                            <AnimatePresence mode="wait">
                                <m.div
                                    key={currentStep}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex flex-col items-center"
                                >
                                    <h3 className="text-xl font-bold text-white mb-6 text-center">
                                        {QUESTIONS[currentStep].title}
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                                        {QUESTIONS[currentStep].options.map((opt) => (
                                            <button
                                                key={opt.id}
                                                onClick={() => handleAnswer(opt.id)}
                                                className="bg-[#1A1A24] border border-[#2A2A35] hover:border-[#00C48C] hover:bg-[#1A1A24]/80 text-right p-4 rounded-xl text-sm md:text-base text-zinc-300 hover:text-white transition-all duration-200"
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                </m.div>
                            </AnimatePresence>
                        </div>
                    ) : (
                        <m.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-[#111118] border-2 border-[#1E1E2E] rounded-2xl p-8 flex flex-col items-center text-center shadow-2xl w-full"
                        >
                            <h3 className="text-[#8B8B9E] font-bold text-sm mb-4">המודל המומלץ עבורך:</h3>
                            <div className="flex flex-col items-center bg-[#1A1A24] p-6 rounded-2xl w-full border border-white/5 mb-6">
                                <div className={cn("text-4xl mb-4 font-black flex items-center justify-center gap-3", resultInfo.colorClass)}>
                                    <Image src={resultInfo.logoUrl} alt={resultInfo.name} width={40} height={40} className="w-10 h-10 rounded-lg object-contain" loading="lazy" />
                                    <span>{resultInfo.name}</span>
                                </div>
                                <p className="text-lg text-white font-medium max-w-sm">
                                    &quot;{resultInfo.copy}&quot;
                                </p>
                            </div>
                            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                                <button
                                    onClick={() => onTrackSelected(recommended)}
                                    className="px-8 py-3 bg-[#00C48C] text-black rounded-full font-bold hover:bg-[#00C48C]/90 shadow-[0_0_20px_rgba(0,196,140,0.3)] transition-colors"
                                >
                                    התחל עם {recommended === 'ta' ? 'מסלול א\'' : recommended === 'tb' ? 'מסלול ב\'' : 'מסלול ג\'' } <ChevronDown className="w-4 h-4 inline-block -rotate-90 mr-1" />
                                </button>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="px-8 py-3 border border-[#1E1E2E] text-[#8B8B9E] rounded-full font-bold hover:bg-[#1E1E2E] transition-colors"
                                >
                                    בחר בעצמי
                                </button>
                            </div>
                        </m.div>
                    )}
                </m.div>
            )}
        </div>
    );
}


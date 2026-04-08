"use client";

import { useState, useEffect } from "react";
import { useSavantStore } from "@/store/useSavantStore";
import { learningPaths } from "@/data/learningPaths";
import { m, AnimatePresence } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";

interface PathSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function PathSelectionModal({ isOpen, onClose }: PathSelectionModalProps) {
    const activePathId = useSavantStore(state => state.activePathId);
    const selectPath = useSavantStore(state => state.selectPath);
    const profileTitle = useSavantStore(state => state.profileTitle);
    
    const [selectedId, setSelectedId] = useState<string | null>(activePathId);

    useEffect(() => {
        if (activePathId) setSelectedId(activePathId);
    }, [activePathId]);

    const handleSelect = (id: string) => {
        setSelectedId(id);
        selectPath(id);
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: [learningPaths.find(p => p.id === id)?.color || "#ffffff", "#ffffff"]
        });
        setTimeout(onClose, 2000);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 overflow-y-auto bg-black/80 backdrop-blur-xl rtl" dir="rtl">
            <m.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="w-full max-w-6xl bg-zinc-900/50 border border-white/10 rounded-[40px] p-8 md:p-12 relative overflow-hidden"
            >
                {/* Background Decoration */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
                </div>

                <div className="text-center mb-12 relative z-10">
                    <m.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full text-zinc-400 text-xs font-black uppercase tracking-widest mb-4"
                    >
                        <Sparkles className="w-3 h-3" />
                        בחירת התמחות
                    </m.div>
                    <h2 className="text-3xl md:text-5xl font-black text-white mb-4">איזה מומחה AI תרצה להיות?</h2>
                    <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
                        בחר את המסלול שמתאים למטרות שלך. אנחנו נבנה לך מפת דרכים מותאמת אישית שתביא אותך לשליטה מלאה.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 relative z-10">
                    {learningPaths.map((path) => {
                        const isRecommended = path.targetProfile === profileTitle;
                        const isSelected = selectedId === path.id;

                        return (
                            <m.button
                                key={path.id}
                                whileHover={{ y: -8, scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleSelect(path.id)}
                                className={cn(
                                    "flex flex-col items-center text-center p-8 rounded-[32px] border transition-all relative group",
                                    isSelected 
                                        ? "bg-white/10 border-white/40 shadow-[0_20px_40px_rgba(0,0,0,0.4)]" 
                                        : "bg-white/5 border-white/5 hover:border-white/20 hover:bg-white/[0.08]"
                                )}
                            >
                                {isRecommended && !isSelected && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-full whitespace-nowrap shadow-lg">
                                        מומלץ עבורך!
                                    </div>
                                )}

                                <div 
                                    className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mb-6 shadow-xl border border-white/10 transition-transform group-hover:rotate-6"
                                    style={{ backgroundColor: `${path.color}20`, borderColor: `${path.color}40` }}
                                >
                                    {path.icon}
                                </div>

                                <h3 className="text-xl font-black text-white mb-2">{path.nameHe}</h3>
                                <p className="text-[11px] text-zinc-500 font-medium leading-relaxed mb-6 line-clamp-3">
                                    {path.descriptionHe}
                                </p>

                                <div className={cn(
                                    "mt-auto w-10 h-10 rounded-full flex items-center justify-center border transition-all",
                                    isSelected 
                                        ? "bg-white border-white text-black" 
                                        : "bg-transparent border-white/10 text-transparent"
                                )}>
                                    <Check className="w-6 h-6" />
                                </div>

                                {isSelected && (
                                    <m.div 
                                        layoutId="glow"
                                        className="absolute inset-0 rounded-[32px] border-2 pointer-events-none"
                                        style={{ borderColor: path.color, opacity: 0.5 }}
                                    />
                                )}
                            </m.button>
                        );
                    })}
                </div>

                <div className="mt-16 text-center relative z-10">
                    <button
                        onClick={onClose}
                        className="text-zinc-500 hover:text-white font-bold transition-colors"
                    >
                        דלג בינתיים, אני רוצה להמשיך לחקור
                    </button>
                </div>
            </m.div>
        </div>
    );
}

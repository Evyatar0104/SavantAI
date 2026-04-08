"use client";

import { useState, useEffect } from "react";
import { useSavantStore } from "@/store/useSavantStore";
import { learningPaths } from "@/data/learningPaths";
import { m, AnimatePresence } from "framer-motion";
import { Check, Sparkles, Rocket } from "lucide-react";
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
    const [isRedirecting, setIsRedirecting] = useState(false);

    useEffect(() => {
        if (activePathId) setSelectedId(activePathId);
    }, [activePathId]);

    const handleSelect = (id: string) => {
        setSelectedId(id);
        selectPath(id);
        setIsRedirecting(true);
        
        const pathColor = learningPaths.find(p => p.id === id)?.color || "#3B82F6";
        
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: [pathColor, "#ffffff"]
        });

        // Small delay to show the "Building path" state
        setTimeout(onClose, 2500);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 overflow-hidden bg-black/90 backdrop-blur-2xl rtl" dir="rtl">
                {/* ── BACKGROUND ANIMATED BLOBS ────────────────── */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
                    <m.div 
                        animate={{ 
                            scale: [1, 1.2, 1],
                            x: [0, 100, 0],
                            y: [0, 50, 0],
                        }}
                        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -top-[10%] -right-[10%] w-[50%] h-[50%] rounded-full bg-blue-600/20 blur-[120px]" 
                    />
                    <m.div 
                        animate={{ 
                            scale: [1, 1.3, 1],
                            x: [0, -100, 0],
                            y: [0, -80, 0],
                        }}
                        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                        className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-purple-600/20 blur-[150px]" 
                    />
                </div>

                <m.div
                    initial={{ opacity: 0, scale: 0.95, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 30 }}
                    className="w-full max-w-7xl bg-zinc-900/40 border border-white/10 rounded-[40px] p-6 md:p-12 relative overflow-hidden shadow-2xl backdrop-blur-md flex flex-col max-h-[90vh]"
                >
                    {/* Interior Decorative Mesh */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                         style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />

                    <div className="text-center mb-8 md:mb-12 relative z-10">
                        <m.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/10 px-5 py-2 rounded-full text-white/80 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] mb-4 shadow-lg"
                        >
                            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                            בחירת התמחות
                        </m.div>
                        <h2 className="text-3xl md:text-6xl font-black text-white mb-4 tracking-tighter">איזה מומחה AI תרצה להיות?</h2>
                        <p className="text-sm md:text-xl text-zinc-400 max-w-2xl mx-auto font-medium leading-relaxed">
                            בחר את המסלול שמתאים למטרות שלך. אנחנו נבנה לך מפת דרכים שתביא אותך לשליטה מלאה.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-6 relative z-10 overflow-y-auto pr-2 pb-4 no-scrollbar">
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
                                        "flex flex-col items-center text-center p-5 md:p-8 rounded-[32px] border transition-all relative group h-full",
                                        isSelected 
                                            ? "bg-white/15 border-white/40 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.5)] scale-[1.02]" 
                                            : "bg-white/5 border-white/5 hover:border-white/20 hover:bg-white/[0.08]"
                                    )}
                                >
                                    <AnimatePresence>
                                        {isRecommended && !isSelected && (
                                            <m.div 
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-blue-600 text-white text-[9px] font-black px-3 py-1.5 rounded-full whitespace-nowrap shadow-xl z-20 border border-blue-400/50"
                                            >
                                                <Sparkles className="w-3 h-3" />
                                                מומלץ עבורך!
                                            </m.div>
                                        )}
                                    </AnimatePresence>

                                    <div 
                                        className="w-16 h-16 md:w-20 md:h-20 rounded-[24px] flex items-center justify-center text-3xl md:text-4xl mb-4 md:mb-6 shadow-2xl border border-white/10 transition-all duration-500 group-hover:rotate-6 group-hover:scale-110 relative overflow-hidden"
                                        style={{ 
                                            background: `linear-gradient(135deg, ${path.color}40, ${path.color}10)`,
                                            borderColor: `${path.color}30` 
                                        }}
                                    >
                                        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <span className="relative z-10 filter drop-shadow-lg">{path.icon}</span>
                                    </div>

                                    <h3 className="text-lg md:text-xl font-black text-white mb-2 tracking-tight">{path.nameHe}</h3>
                                    <p className="text-[10px] md:text-[11px] text-zinc-500 font-medium leading-relaxed mb-6 line-clamp-3 md:line-clamp-none opacity-80 group-hover:opacity-100 transition-opacity">
                                        {path.descriptionHe}
                                    </p>

                                    <div className={cn(
                                        "mt-auto w-10 h-10 rounded-2xl flex items-center justify-center border transition-all duration-500",
                                        isSelected 
                                            ? "bg-white border-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)]" 
                                            : "bg-transparent border-white/10 text-transparent group-hover:border-white/30"
                                    )}>
                                        <Check className="w-6 h-6" strokeWidth={3} />
                                    </div>

                                    {isSelected && (
                                        <m.div 
                                            layoutId="path-glow"
                                            className="absolute inset-0 rounded-[32px] border-2 pointer-events-none"
                                            style={{ borderColor: path.color, opacity: 0.4 }}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 0.4 }}
                                        />
                                    )}
                                </m.button>
                            );
                        })}
                    </div>

                    <div className="mt-8 md:mt-12 text-center relative z-10 shrink-0">
                        <button
                            onClick={onClose}
                            className="text-zinc-500 hover:text-white font-black text-xs md:text-sm uppercase tracking-widest transition-all duration-300 hover:tracking-[0.2em]"
                        >
                            דלג בינתיים, אני רוצה להמשיך לחקור
                        </button>
                    </div>

                    {/* ── REDIRECTING OVERLAY ──────────────────── */}
                    <AnimatePresence>
                        {isRedirecting && (
                            <m.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="absolute inset-0 z-50 bg-black/60 backdrop-blur-xl flex flex-col items-center justify-center text-center p-12"
                            >
                                <m.div
                                    animate={{ 
                                        rotate: 360,
                                        scale: [1, 1.1, 1],
                                    }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    className="mb-8"
                                >
                                    <div className="w-20 h-20 rounded-full border-4 border-t-white border-white/10 p-4">
                                        <Rocket className="w-full h-full text-white" />
                                    </div>
                                </m.div>
                                <m.h3 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tighter"
                                >
                                    בחירה מצוינת!
                                </m.h3>
                                <m.p 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="text-xl text-white/60 font-medium"
                                >
                                    מכין לך את מפת הדרכים האישית...
                                </m.p>
                                
                                <div className="mt-12 w-64 h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                    <m.div 
                                        initial={{ x: "-100%" }}
                                        animate={{ x: "0%" }}
                                        transition={{ duration: 2.5, ease: "easeInOut" }}
                                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                                    />
                                </div>
                            </m.div>
                        )}
                    </AnimatePresence>
                </m.div>
            </div>
        </AnimatePresence>
    );
}

"use client";

import { m, AnimatePresence } from "framer-motion";
import { Brain, ArrowRight, X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { haptics } from "@/lib/haptics";

interface QuizPromptDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onQuiz: () => void;
    onContinue: () => void;
}

export function QuizPromptDialog({ isOpen, onClose, onQuiz, onContinue }: QuizPromptDialogProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <m.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
                    />

                    {/* Content Container */}
                    <div className="fixed inset-0 flex items-center justify-center z-[101] p-6 pointer-events-none">
                        <m.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="w-full max-w-md bg-[#0D0D12] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl pointer-events-auto relative"
                            dir="rtl"
                        >
                            {/* Background Glow */}
                            <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/20 rounded-full blur-[80px]" />
                            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/10 rounded-full blur-[80px]" />

                            <button
                                onClick={onClose}
                                className="absolute top-6 left-6 text-zinc-500 hover:text-white transition-colors p-1"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="p-8 md:p-10 text-center relative z-10">
                                <div className="w-16 h-16 bg-purple-500/10 rounded-[20px] flex items-center justify-center mx-auto mb-6 border border-purple-500/20 shadow-lg">
                                    <Brain className="w-8 h-8 text-purple-400" />
                                </div>

                                <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-3 tracking-tight">
                                    רגע לפני שמתחילים...
                                </h2>
                                <p className="text-zinc-400 text-sm md:text-base leading-relaxed mb-10">
                                    רוצה לדעת איזה כלי AI הכי מתאים לך אישית, או להמשיך ישירות לשיעור הראשון?
                                </p>

                                <div className="space-y-3">
                                    <button
                                        onClick={() => {
                                            haptics.success();
                                            onQuiz();
                                        }}
                                        className="w-full h-14 bg-white text-black font-black text-base rounded-2xl shadow-xl hover:bg-zinc-200 transition-all active:scale-[0.98] flex items-center justify-center gap-3 group"
                                    >
                                        <Sparkles className="w-5 h-5 text-purple-600" />
                                        גלה את הסטאק שלי
                                    </button>

                                    <button
                                        onClick={() => {
                                            haptics.tap();
                                            onContinue();
                                        }}
                                        className="w-full h-14 bg-white/5 text-white font-bold text-base rounded-2xl border border-white/10 hover:bg-white/10 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
                                    >
                                        המשך לשיעור
                                        <ArrowRight className="w-4 h-4 rotate-180 text-zinc-500 group-hover:text-white group-hover:-translate-x-1 transition-all" />
                                    </button>
                                </div>

                                <p className="text-[10px] text-zinc-600 mt-6 font-bold uppercase tracking-widest">
                                    תמיד תוכל לגשת למבחן ההתאמה מאוחר יותר
                                </p>
                            </div>
                        </m.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}

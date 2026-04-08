"use client";

import { m, AnimatePresence } from "framer-motion";
import { X, Target, ChevronLeft, Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { loadCourseLessons } from "@/content";
import { useSavantStore } from "@/store/useSavantStore";
import { haptics } from "@/lib/haptics";
import { cn } from "@/lib/utils";
import type { Lesson } from "@/content";

interface Props {
    courseId: string;
    courseName: string;
    isOpen: boolean;
    onClose: () => void;
}

const TOOL_LOGO: Record<string, string | null> = {
    Claude: "/assets/logos/claude.png",
    ChatGPT: "/assets/logos/chatgpt.png",
    Gemini: "/assets/logos/gemini.png",
};

export function CoursePracticeSheet({ courseId, courseName, isOpen, onClose }: Props) {
    const router = useRouter();
    const completedLessons = useSavantStore(s => s.completedLessons);
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsLoading(true);
            loadCourseLessons(courseId).then(data => {
                if (Array.isArray(data)) {
                    setLessons(data);
                } else {
                    setLessons([]);
                }
                setIsLoading(false);
            }).catch(() => {
                setLessons([]);
                setIsLoading(false);
            });
        }
    }, [isOpen, courseId]);

    const practicalTasks = (lessons || []).filter(l => l?.practicalCall);

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
                        className="fixed inset-0 z-[500] bg-black/80 backdrop-blur-md"
                    />

                    {/* Sheet */}
                    <m.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed bottom-0 left-0 right-0 z-[501] flex flex-col h-[85dvh] md:h-[80dvh] max-w-4xl mx-auto"
                        style={{
                            borderRadius: "32px 32px 0 0",
                            background: "linear-gradient(to bottom, #0F0F19, #050508)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            borderBottom: "none",
                            boxShadow: "0 -20px 50px -10px rgba(0,0,0,0.5)",
                        }}
                        dir="rtl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 pb-2 shrink-0">
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-1">זירת התרגול</h2>
                                <p className="text-zinc-500 text-sm">{courseName}</p>
                            </div>
                            <button 
                                onClick={onClose}
                                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 pt-4 no-scrollbar">
                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center h-64 text-zinc-500 gap-3">
                                    <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                                    <p className="text-sm font-medium">טוען תרגילים...</p>
                                </div>
                            ) : practicalTasks.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-64 text-zinc-500 text-center px-8">
                                    <Target className="w-12 h-12 mb-4 opacity-20" />
                                    <p className="text-lg font-bold text-white mb-2">אין תרגילים בקורס זה</p>
                                    <p className="text-sm">המשך ללמוד כדי לגלות תרגילים חדשים בקורסים הבאים.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-12">
                                    {practicalTasks.map((lesson, idx) => {
                                        const isCompleted = completedLessons.includes(lesson.id);
                                        const task = lesson.practicalCall!;
                                        const logo = TOOL_LOGO[task.tool];

                                        return (
                                            <m.div
                                                key={lesson.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: idx * 0.05 }}
                                                onClick={() => {
                                                    haptics.tap();
                                                    router.push(`/lesson/${lesson.id}?from=course&practice=true`);
                                                }}
                                                className={cn(
                                                    "group relative p-6 rounded-2xl border transition-all cursor-pointer overflow-hidden flex flex-col h-full",
                                                    isCompleted 
                                                        ? "bg-emerald-500/[0.03] border-emerald-500/20" 
                                                        : "bg-white/[0.03] border-white/10 hover:border-white/20 hover:bg-white/[0.05]"
                                                )}
                                            >
                                                {/* Status Badge */}
                                                {isCompleted && (
                                                    <div className="absolute top-4 left-4 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg">
                                                        <span className="text-white text-[10px] font-bold">✓</span>
                                                    </div>
                                                )}

                                                {/* Lesson Info */}
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[18px]">{lesson.icon || "📄"}</span>
                                                        <span className="text-[10px] font-black uppercase tracking-wider text-zinc-500 line-clamp-1 max-w-[120px]">
                                                            {lesson.title}
                                                        </span>
                                                    </div>
                                                    {logo && (
                                                        <div className="flex items-center gap-1.5 opacity-60">
                                                            <Image src={logo} alt="" width={14} height={14} className="rounded-sm" />
                                                            <span className="text-[11px] font-medium text-zinc-400">{task.tool}</span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Task & Goal */}
                                                <div className="flex-1">
                                                    <h3 className="text-base font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors leading-tight">
                                                        {task.task}
                                                    </h3>
                                                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                                                        <p className="text-zinc-400 text-xs leading-relaxed">
                                                            <span className="text-emerald-500/80 font-bold ml-1">המטרה:</span>
                                                            {task.goal}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Footer */}
                                                <div className="mt-6 flex items-center justify-between">
                                                    <div className="flex items-center gap-1 text-emerald-500/60 text-[11px] font-bold">
                                                        <span>לשיעור המלא</span>
                                                    </div>
                                                    <div className="text-emerald-500 group-hover:translate-x-[-4px] transition-transform">
                                                        <ChevronLeft className="w-5 h-5" />
                                                    </div>
                                                </div>
                                            </m.div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Summary Footer */}
                        {!isLoading && practicalTasks.length > 0 && (
                            <div className="p-8 border-t border-white/5 bg-white/[0.02] shrink-0">
                                <div className="flex items-center justify-between max-w-sm mx-auto">
                                    <div className="text-center">
                                        <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold mb-1">משימות</p>
                                        <p className="text-2xl font-black text-white">{practicalTasks.length}</p>
                                    </div>
                                    <div className="w-px h-8 bg-white/10" />
                                    <div className="text-center">
                                        <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold mb-1">הושלמו</p>
                                        <p className="text-2xl font-black text-emerald-400">{practicalTasks.filter(l => completedLessons.includes(l.id)).length}</p>
                                    </div>
                                    <div className="w-px h-8 bg-white/10" />
                                    <div className="text-center">
                                        <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold mb-1">ביצוע</p>
                                        <p className="text-2xl font-black text-white">
                                            {Math.round((practicalTasks.filter(l => completedLessons.includes(l.id)).length / practicalTasks.length) * 100)}%
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </m.div>
                </>
            )}
        </AnimatePresence>
    );
}


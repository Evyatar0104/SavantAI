"use client";

import { useMemo, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSavantStore } from "@/store/useSavantStore";
import { learningPaths } from "@/data/learningPaths";
import { m } from "framer-motion";
import { ChevronRight, CheckCircle2, ArrowRight, Star, Target } from "lucide-react";
import Link from "next/link";
import { PathRoadmap } from "@/components/PathRoadmap";
import { RoadmapBackground } from "@/components/RoadmapBackground";
import { PathCompletionModal } from "@/components/PathCompletionModal";

export default function PathRoadmapPage() {
    const { pathId } = useParams();
    const router = useRouter();
    const completedCourses = useSavantStore(state => state.completedCourses);
    const activePathId = useSavantStore(state => state.activePathId);
    const selectPath = useSavantStore(state => state.selectPath);

    const path = useMemo(() => learningPaths.find(p => p.id === pathId), [pathId]);

    useEffect(() => {
        if (!path) {
            router.push("/courses");
        }
    }, [path, router]);

    const progressPercent = useMemo(() => {
        if (!path) return 0;
        const count = path.courses.filter(id => completedCourses.includes(id)).length;
        return Math.round((count / path.courses.length) * 100);
    }, [path, completedCourses]);

    if (!path) return null;

    const isSelected = activePathId === path.id;
    const safeProgressPercent = Math.max(0.01, progressPercent);

    return (
        <div className="min-h-screen bg-black text-white pb-32 rtl" dir="rtl">
            <RoadmapBackground color={path.color} />
            <PathCompletionModal />

            <div className="relative z-10">
                {/* Header Area */}
                <div className="max-w-7xl mx-auto px-4 md:px-8 pt-6 md:pt-12 mb-8 md:mb-16 text-center lg:text-right">
                    <div className="flex justify-center lg:justify-start">
                        <Link 
                            href="/courses" 
                            className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-all mb-8 md:mb-12 group bg-white/5 px-4 py-2 rounded-full border border-white/5 hover:border-white/10"
                        >
                            <ChevronRight className="w-4 h-4" />
                            <span className="text-sm font-bold">חזרה ללמידה</span>
                        </Link>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-10 md:gap-16 items-center lg:items-center justify-between">
                        <div className="space-y-6 md:space-y-8 flex-1 flex flex-col items-center lg:items-start">
                            <m.div 
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md"
                            >
                                <Target className="w-4 h-4 text-blue-400" />
                                <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-zinc-400">מסלול למידה מותאם</span>
                            </m.div>

                            <div className="space-y-4">
                                <m.h1 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="text-5xl md:text-8xl font-black tracking-tighter leading-none"
                                >
                                    {path.nameHe}
                                </m.h1>
                                <m.p 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="text-lg md:text-2xl text-zinc-400 font-medium max-w-3xl leading-relaxed"
                                >
                                    {path.descriptionHe}
                                </m.p>
                            </div>

                            <m.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3 }}
                                className="flex flex-wrap items-center justify-center lg:justify-start gap-4 md:gap-6 pt-2"
                            >
                                {!isSelected ? (
                                    <button
                                        onClick={() => selectPath(path.id)}
                                        className="group relative px-8 py-4 rounded-2xl font-black text-lg transition-all active:scale-95 shadow-2xl overflow-hidden bg-white text-black hover:bg-zinc-100 flex items-center gap-3"
                                    >
                                        התחל מסלול זה
                                        <ArrowRight className="w-5 h-5 rotate-180" />
                                    </button>
                                ) : (
                                    <div className="px-8 py-4 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md font-black text-lg text-white flex items-center gap-3">
                                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                                        מסלול פעיל
                                    </div>
                                )}
                                
                                <div className="px-5 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                    </div>
                                    <div className="flex flex-col text-right">
                                        <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest leading-none mb-1">פוטנציאל</span>
                                        <span className="text-sm font-black text-white leading-none">{path.xpTotal} XP</span>
                                    </div>
                                </div>
                            </m.div>
                        </div>

                        {/* Progress Circular Widget */}
                        <m.div 
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4 }}
                            className="relative w-48 h-48 md:w-72 md:h-72 flex items-center justify-center shrink-0 mx-auto lg:mx-0"
                        >
                            <div 
                                className="absolute inset-4 blur-[60px] opacity-20 rounded-full animate-pulse"
                                style={{ backgroundColor: path.color }}
                            />
                            
                            <svg className="w-full h-full -rotate-90 drop-shadow-2xl" viewBox="0 0 100 100">
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="42"
                                    className="stroke-white/5 fill-none"
                                    strokeWidth="12"
                                />
                                <m.circle
                                    cx="50"
                                    cy="50"
                                    r="42"
                                    className="fill-none"
                                    strokeWidth="12"
                                    stroke={path.color}
                                    strokeDasharray="264"
                                    initial={{ strokeDashoffset: 264 }}
                                    animate={{ strokeDashoffset: 264 - (264 * safeProgressPercent) / 100 }}
                                    transition={{ duration: 2, ease: "circOut", delay: 0.5 }}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                <m.span 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 1 }}
                                    className="text-5xl md:text-7xl font-black tracking-tighter"
                                >
                                    {progressPercent}%
                                </m.span>
                                <span className="text-[10px] md:text-xs font-black text-zinc-500 uppercase tracking-[0.3em] mt-1">התקדמות</span>
                            </div>
                        </m.div>
                    </div>
                </div>

                {/* The Roadmap Component */}
                <div className="w-full max-w-[100vw] overflow-x-hidden">
                    <PathRoadmap path={path} completedCourses={completedCourses} />
                </div>
            </div>
        </div>
    );
}

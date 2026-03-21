"use client";

import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { TRACKS, LESSONS } from "@/data/lessons";
import { ArrowLeft, Clock, Zap, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { isLockedAI } from "@/data/ai-lessons";
import { useSavantStore } from "@/store/useSavantStore";
import { AILearningPath } from "./AILearningPath";

export default function TrackSyllabusPage() {
    const params = useParams();
    const trackId = params.trackId as string;
    const track = TRACKS.find((t) => t.id === trackId);

    if (!track) {
        return notFound();
    }

    const trackLessons = LESSONS.filter(l => l.trackId === trackId);
    const unlockedAITracks = useSavantStore(state => state.unlockedAITracks);
    const completedLessons = useSavantStore(state => state.completedLessons);

    // Attempting a simple chunking logic for Modules (5 lessons per module)
    const modules = [];
    for (let i = 0; i < trackLessons.length; i += 5) {
        modules.push(trackLessons.slice(i, i + 5));
    }

    // Determine the next uncompleted lesson (simplistic first lesson for now)
    const nextLesson = trackLessons[0];

    return (
        <div className="p-6 md:p-10 flex flex-col pt-12 md:pt-16 max-w-5xl mx-auto w-full min-h-[100dvh]">
            <Link href="/tracks" className="flex items-center text-zinc-500 hover:text-white mb-8 transition-colors group">
                <ArrowLeft className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1 rotate-180" /> חזרה למסלולים
            </Link>

            <div className="flex flex-col md:flex-row gap-8 md:items-end mb-16">
                <div className={cn("w-32 h-32 md:w-48 md:h-48 rounded-[32px] md:rounded-[48px] bg-gradient-to-br flex items-center justify-center text-6xl md:text-8xl shadow-2xl shrink-0 border border-white/5", track.color)}>
                    {track.icon}
                </div>
                <div className="flex-1 space-y-4">
                    <span className="text-sm font-bold uppercase tracking-widest text-zinc-500">סילבוס הקורס</span>
                    <h1 className="text-4xl md:text-6xl font-serif italic font-bold leading-tight">{track.name}</h1>
                    <div className="flex flex-wrap gap-4 pt-4">
                        <div className="glass-panel px-4 py-2 rounded-full flex items-center text-sm font-semibold text-zinc-200">
                            <Clock className="w-4 h-4 ml-2 text-blue-400" /> {trackLessons.length * 3} דקות סה"כ
                        </div>
                        <div className="glass-panel px-4 py-2 rounded-full flex items-center text-sm font-semibold text-zinc-200">
                            <Target className="w-4 h-4 ml-2 text-green-400" /> {trackLessons.length} מודולים
                        </div>
                    </div>
                </div>

                {nextLesson && (
                    <div className="mt-8 md:mt-0">
                        <Link href={`/lesson/${nextLesson.id}`}>
                            <button className="w-full md:w-auto px-8 py-5 bg-white text-black font-black text-lg rounded-full hover:bg-zinc-200 hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)]">
                                המשך קורס
                            </button>
                        </Link>
                    </div>
                )}
            </div>

            <div className="space-y-12 pb-32">
                {trackId === "ai" ? (
                    <AILearningPath 
                        trackLessons={trackLessons}
                        unlockedAITracks={unlockedAITracks}
                        completedLessons={completedLessons}
                    />
                ) : (
                    modules.map((mod, moduleIndex) => (
                        <div key={moduleIndex} className="relative">
                            <div className="mb-6 flex items-center">
                                <div className="w-10 h-10 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center font-bold text-lg ml-4 text-blue-400">
                                    {moduleIndex + 1}
                                </div>
                                <h2 className="text-2xl font-bold">מודול {moduleIndex + 1}</h2>
                            </div>

                            <div className="space-y-4 pr-5 border-r-2 border-white/5 mr-5">
                                {mod.map((lesson, lessonIndex) => (
                                    <Link key={lesson.id} href={`/lesson/${lesson.id}`} className="block group">
                                        <div className="p-6 rounded-3xl bg-zinc-900/50 border border-white/5 hover:bg-zinc-800 hover:border-white/20 transition-all flex items-start gap-4 shadow-lg group-hover:-translate-y-1">
                                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center font-bold text-xs text-zinc-500 mt-1 shrink-0">
                                                {(moduleIndex * 5) + lessonIndex + 1}
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">{lesson.title}</h3>
                                                <p className="text-zinc-500 text-sm mb-4 leading-relaxed">{lesson.description}</p>
                                                <div className="flex items-center text-xs font-bold text-zinc-600 uppercase tracking-widest">
                                                    <Zap className="w-3 h-3 ml-1" /> כולל בוחן
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

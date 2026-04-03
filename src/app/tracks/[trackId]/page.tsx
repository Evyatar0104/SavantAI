"use client";

import { useParams, useRouter, notFound } from "next/navigation";
import { useEffect } from "react";
import { TRACKS } from "@/data/lessons";
import { LESSON_INDEX } from "@/data/lessons-index";
import { useSavantStore } from "@/store/useSavantStore";
import { AILearningPath } from "./AILearningPath";
import Link from "next/link";
import { ArrowLeft, Clock, Target } from "lucide-react";
import { cn } from "@/lib/utils";

// Legacy trackId → courseId mapping for redirects
const TRACK_TO_COURSE: Record<string, string> = {
    "ai": "how-llms-work",
};

export default function TrackSyllabusPage() {
    const params = useParams();
    const router = useRouter();
    const trackId = params.trackId as string;
    const track = TRACKS.find((t) => t.id === trackId);

    // If there's a known course mapping, redirect
    const courseId = TRACK_TO_COURSE[trackId];

    useEffect(() => {
        if (courseId) {
            router.replace(`/courses/${courseId}`);
        }
    }, [courseId, router]);

    if (!track || trackId !== "ai") {
        return notFound();
    }

    // Show existing UI while redirect happens
    const trackLessons = LESSON_INDEX.filter(l => l.trackId === trackId);
    const unlockedAITracks = useSavantStore(state => state.unlockedAITracks);
    const completedLessons = useSavantStore(state => state.completedLessons);

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
                            <Clock className="w-4 h-4 ml-2 text-blue-400" /> {trackLessons.length * 3} דקות סה&quot;כ
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
                <AILearningPath
                    trackLessons={trackLessons}
                    unlockedAITracks={unlockedAITracks}
                    completedLessons={completedLessons}
                />
            </div>
        </div>
    );
}

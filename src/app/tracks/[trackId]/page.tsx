"use client";

import { useParams, notFound } from "next/navigation";
import { TRACKS, COURSES, LESSON_INDEX } from "@/content";
import { useSavantStore } from "@/store/useSavantStore";
import Link from "next/link";
import { ArrowLeft, Clock, Target, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { RoadmapBackground } from "@/components/RoadmapBackground";
import { m } from "framer-motion";
import { AILearningPath } from "./AILearningPath";
import { useScrollRestoration } from "@/hooks/useScrollRestoration";

// Map trackId to a hex color for the roadmap background
const TRACK_COLORS: Record<string, string> = {
    "writer": "#3B82F6",
    "analyst": "#10B981",
    "visual": "#EC4899",
    "builder": "#F97316",
    "student": "#A855F7",
};

export default function TrackSyllabusPage() {
    const params = useParams();
    const trackScrollPositions = useSavantStore(state => state.trackScrollPositions);
    const setTrackScrollPosition = useSavantStore(state => state.setTrackScrollPosition);

    const trackId = params.trackId as string;
    const track = TRACKS.find((t) => t.id === trackId);
    const hasHydrated = useSavantStore(state => state._hasHydrated);

    const scrollPosition = trackScrollPositions[trackId] || 0;
    const setScrollPosition = (pos: number) => setTrackScrollPosition(trackId, pos);

    useScrollRestoration(scrollPosition, setScrollPosition, hasHydrated);

    if (!track) {
        return notFound();
    }

    const trackLessons = LESSON_INDEX.filter(l => l.trackIds?.includes(trackId));
    
    // Get unique courses for this track
    const trackCourseIds = Array.from(new Set(trackLessons.map(l => l.courseId)));
    const trackCourses = trackCourseIds.map(id => COURSES.find(c => c.id === id)).filter(Boolean);
    
    const themeColor = TRACK_COLORS[trackId] || "#3b82f6";

    return (
        <main className="relative min-h-[100dvh] w-full overflow-x-hidden bg-[#06060f]">
            <RoadmapBackground color={themeColor} />
            
            <div className="relative z-10 p-6 md:p-10 flex flex-col pt-12 md:pt-16 max-w-7xl mx-auto w-full rtl" dir="rtl">
                <Link href="/courses" className="flex items-center text-zinc-400 hover:text-white mb-8 transition-colors group w-fit">
                    <ArrowLeft className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" /> חזרה למסלולים
                </Link>

                <div className="flex flex-col md:flex-row gap-8 md:items-center justify-between mb-20">
                    <div className="flex flex-col md:flex-row gap-8 md:items-center">
                        <m.div 
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className={cn("w-32 h-32 md:w-40 md:h-40 rounded-[40px] bg-gradient-to-br flex items-center justify-center text-6xl md:text-7xl shadow-2xl shrink-0 border border-white/10 backdrop-blur-sm relative group", track.color)}
                        >
                            <div className="absolute inset-0 bg-white/10 rounded-[40px] opacity-0 group-hover:opacity-100 transition-opacity" />
                            {track.icon}
                        </m.div>
                        <div className="flex-1 space-y-4">
                            <m.div 
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center gap-2"
                            >
                                <span className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500">מסלול למידה</span>
                                <div className="h-px w-12 bg-zinc-800" />
                            </m.div>
                            <m.h1 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-5xl md:text-7xl font-black leading-tight text-white tracking-tighter"
                            >
                                {track.name}
                            </m.h1>
                            <m.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="flex flex-wrap gap-4 pt-4"
                            >
                                <div className="bg-white/5 backdrop-blur-md border border-white/10 px-5 py-2.5 rounded-2xl flex items-center text-sm font-bold text-zinc-300">
                                    <Clock className="w-4 h-4 ml-2 text-blue-400" /> {trackLessons.length * 5} דקות תוכן
                                </div>
                                <div className="bg-white/5 backdrop-blur-md border border-white/10 px-5 py-2.5 rounded-2xl flex items-center text-sm font-bold text-zinc-300">
                                    <Target className="w-4 h-4 ml-2 text-green-400" /> {trackCourses.length} קורסים במפה
                                </div>
                                <div className="bg-white/5 backdrop-blur-md border border-white/10 px-5 py-2.5 rounded-2xl flex items-center text-sm font-bold text-zinc-300">
                                    <Trophy className="w-4 h-4 ml-2 text-yellow-400" /> {trackLessons.length} השגים לפתיחה
                                </div>
                            </m.div>
                        </div>
                    </div>
                </div>

                <div className="space-y-12 pb-32">
                    <AILearningPath
                        track={track}
                        trackLessons={trackLessons}
                    />
                </div>
            </div>
        </main>
    );
}

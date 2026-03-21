"use client";

import Link from "next/link";
import { TRACKS, LESSONS } from "@/data/lessons";
import { m, Variants } from "framer-motion";

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function Tracks() {
    return (
        <div className="p-6 md:p-10 flex flex-col pt-12 md:pt-16 max-w-7xl mx-auto w-full relative">
            <h1 className="text-4xl md:text-5xl font-black mb-3 tracking-tight text-foreground">מסלולי למידה</h1>
            <p className="text-lg md:text-xl text-zinc-500 dark:text-zinc-400 mb-10 md:mb-12 font-medium">שלוט בחמשת תחומי היסוד.</p>

            <m.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
                variants={containerVariants}
                initial="hidden"
                animate="show"
            >
                {TRACKS.map((track) => {
                    const trackLessonsCount = LESSONS.filter(l => l.trackId === track.id).length;
                    const isAvailable = trackLessonsCount > 0;

                    return (
                        <m.div key={track.id} variants={itemVariants} className="h-full">
                            <Link
                                href={isAvailable ? `/tracks/${track.id}` : "#"}
                                className={`group h-full p-8 rounded-[32px] flex flex-col items-start space-y-6 transition-all duration-300 relative overflow-hidden ${isAvailable
                                    ? "glass-panel dark:hover:bg-white/[0.04] hover:bg-black/[0.02] hover:-translate-y-2 hover:shadow-2xl active:scale-[0.98]"
                                    : "border border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] opacity-60 cursor-not-allowed saturate-50 hover:bg-transparent"
                                    }`}
                            >
                                {/* Decorative gradient blob for active cards */}
                                {isAvailable && (
                                    <div className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${track.color} rounded-full blur-[50px] opacity-10 dark:opacity-20 pointer-events-none transition-opacity duration-500 group-hover:opacity-40 dark:group-hover:opacity-60`} />
                                )}

                                <div className={`w-20 h-20 md:w-24 md:h-24 rounded-[24px] bg-gradient-to-br ${track.color} flex items-center justify-center text-4xl md:text-5xl shadow-xl shadow-black/10 shrink-0 relative z-10 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                                    <div className="absolute inset-0 bg-white/20 dark:bg-black/20 rounded-[24px] mix-blend-overlay"></div>
                                    <div className="drop-shadow-md">{track.icon}</div>
                                </div>

                                <div className="flex-1 w-full relative z-10">
                                    <h3 className="font-black text-2xl md:text-3xl leading-tight mb-3 tracking-tight text-foreground">{track.name}</h3>
                                    <p className="text-sm md:text-base font-medium text-zinc-500 dark:text-zinc-400">
                                        {isAvailable ? `רמת מאסטר • ${trackLessonsCount} שיעורים` : "בקרוב • הישארו סקרנים"}
                                    </p>
                                </div>

                                {isAvailable && (
                                    <div className="mt-auto pt-4 relative z-10 w-full flex justify-end">
                                        <div className="inline-flex items-center space-x-2 space-x-reverse px-5 py-2.5 bg-black/5 group-hover:bg-blue-500/10 dark:bg-white/5 dark:group-hover:bg-blue-500/15 text-foreground group-hover:text-blue-500 dark:group-hover:text-blue-400 rounded-full text-sm font-bold transition-all duration-300">
                                            <span>צפה בסילבוס</span>
                                            <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span>
                                        </div>
                                    </div>
                                )}
                            </Link>
                        </m.div>
                    );
                })}
            </m.div>
        </div>
    );
}

"use client";

import Link from "next/link";
import { m } from "framer-motion";
import { CheckCircle, Lock, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { ModelQuiz } from "@/components/ModelQuiz";

const TRACKS_INFO = [
    { id: "ta", label: "מסלול א'", model: "Claude", color: "#E8845A", badge: "Claude Master", icon: "🏛️", colorClass: "text-[#E8845A]", borderClass: "border-r-[#E8845A]", bgClass: "bg-[#E8845A]", logoUrl: "/assets/logos/claude.png", badgeUrl: "/assets/badges/claude.png" },
    { id: "tb", label: "מסלול ב'", model: "ChatGPT", color: "#8B74E8", badge: "ChatGPT Master", icon: "✨", colorClass: "text-[#8B74E8]", borderClass: "border-r-[#8B74E8]", bgClass: "bg-[#8B74E8]", logoUrl: "/assets/logos/chatgpt.png", badgeUrl: "/assets/badges/chatgpt.png" },
    { id: "tc", label: "מסלול ג'", model: "Gemini", color: "#4A9EE8", badge: "Gemini Master", icon: "🌌", colorClass: "text-[#4A9EE8]", borderClass: "border-r-[#4A9EE8]", bgClass: "bg-[#4A9EE8]", logoUrl: "/assets/logos/gemini.png", badgeUrl: "/assets/badges/gemini.png" }
];

const PRESTIGE_BADGES = [
    { id: "initiate", name: "AI Initiate", desc: "1 track", req: 1 },
    { id: "polyglot", name: "AI Polyglot", desc: "2 tracks", req: 2 },
    { id: "savant", name: "AI Savant", desc: "3 tracks", req: 3 }
];

export function AILearningPath({ 
    trackLessons, 
    unlockedAITracks, 
    completedLessons 
}: { 
    trackLessons: any[], 
    unlockedAITracks: string[], 
    completedLessons: string[] 
}) {
    // Phase 0
    const phase0Lessons = trackLessons.filter(l => l.id.startsWith("ai-p0-"));
    const phase0Completed = phase0Lessons.filter(l => completedLessons.includes(l.id)).length;
    const isPhase0Done = phase0Completed === phase0Lessons.length;
    
    const completedTracksCount = ["ta", "tb", "tc"].filter(tId => 
        trackLessons.filter(l => l.id.startsWith(`ai-${tId}-`))
            .every(l => completedLessons.includes(l.id))
    ).length;

    return (
        <div className="flex flex-col items-center w-full pb-32">
            
            {/* Phase 0 Node */}
            <m.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.5 }}
                className="w-full max-w-2xl mx-auto flex flex-col items-center relative z-10"
            >
                <div className="text-[#00C48C] text-sm font-bold tracking-[0.2em] uppercase mb-2">Phase 0</div>
                <div className="w-full bg-[#111118] border border-[#1E1E2E] border-r-4 border-r-[#00C48C] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-6 md:items-center shadow-2xl relative overflow-hidden">
                    <div className="flex-1">
                        <h2 className="text-3xl font-bold text-white mb-2">בסיס הבינה המלאכותית</h2>
                        <p className="text-[#8B8B9E] text-base">7 שיעורים · פתוח לכולם</p>
                    </div>
                    
                    {/* Progress indicator */}
                    <div className="flex flex-col items-end shrink-0">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-[#8B8B9E] text-lg">7 /</span>
                            <span className="text-2xl font-black text-white">{phase0Completed}</span>
                        </div>
                        <div className="w-32 h-2 bg-[#1E1E2E] rounded-full overflow-hidden" dir="ltr">
                            <div 
                                className="h-full bg-[#00C48C] rounded-full transition-all duration-1000 ease-out"
                                style={{ width: `${(phase0Completed / 7) * 100}%` }}
                            />
                        </div>
                    </div>

                    {/* Phase 0 Lessons List (Compact) */}
                    <div className="w-full mt-6 space-y-2 border-t border-[#1E1E2E] pt-6 md:col-span-2">
                        {phase0Lessons.map((lesson, idx) => {
                            const isCompleted = completedLessons.includes(lesson.id);
                            return (
                                <Link href={`/lesson/${lesson.id}`} key={lesson.id} className="block group">
                                    <div className="flex items-center p-3 rounded-xl hover:bg-[#1E1E2E] transition-colors border border-transparent hover:border-white/5">
                                        <div className="w-6 h-6 rounded-full bg-[#00C48C]/10 flex items-center justify-center shrink-0 ml-3">
                                            {isCompleted ? <CheckCircle className="w-4 h-4 text-[#00C48C]" /> : <span className="text-[10px] font-bold text-[#00C48C]">{idx + 1}</span>}
                                        </div>
                                        <div className={cn("text-sm font-semibold transition-colors", isCompleted ? "text-white" : "text-zinc-300 group-hover:text-[#00C48C]")}>
                                            {lesson.title}
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </m.div>

            {isPhase0Done && (
                <ModelQuiz onTrackSelected={(trackId) => {
                    const el = document.getElementById(`track-${trackId}`);
                    if (el) {
                        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        el.classList.add('ring-4', 'ring-[#00C48C]', 'ring-offset-8', 'ring-offset-[#111118]', 'scale-[1.02]');
                        setTimeout(() => {
                            el.classList.remove('ring-4', 'ring-[#00C48C]', 'ring-offset-8', 'ring-offset-[#111118]', 'scale-[1.02]');
                        }, 2000);
                    }
                }} />
            )}

            {/* Track Split Connector */}
            <m.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 60 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="w-px bg-gradient-to-b from-[#00C48C] to-[#1E1E2E] my-0 relative flex justify-center"
            >
                <div className="absolute top-1/2 -translate-y-1/2 bg-[#0A0A0F] px-3 text-[#8B8B9E] text-xs font-bold whitespace-nowrap z-0">
                    בחר מסלול
                </div>
            </m.div>
            
            {/* Desktop Branching SVG Line */}
            <m.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="hidden md:block w-full max-w-4xl h-8 relative"
            >
                {/* Horizontal bridge */}
                <div className="absolute top-0 left-[16.66%] right-[16.66%] h-px bg-[#1E1E2E]" />
                {/* Vertical drops */}
                <div className="absolute top-0 left-[16.66%] w-px h-8 bg-[#1E1E2E]" />
                <div className="absolute top-0 left-1/2 w-px h-8 bg-[#1E1E2E]" />
                <div className="absolute top-0 right-[16.66%] w-px h-8 bg-[#1E1E2E]" />
            </m.div>

            {/* Mobile Branching Line (just straight down) */}
            <div className="md:hidden w-px h-8 bg-[#1E1E2E]" />

            {/* Track Cards */}
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10 w-full max-w-6xl mx-auto" dir="rtl">
                {TRACKS_INFO.map((track, idx) => {
                    const lessons = trackLessons.filter(l => l.id.startsWith(`ai-${track.id}-`));
                    const isTrackSelected = unlockedAITracks.includes(track.id);
                    const isTrackCompleted = lessons.length > 0 && lessons.every(l => completedLessons.includes(l.id));
                    
                    return (
                        <m.div 
                            key={track.id}
                            id={`track-${track.id}`}
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 + (idx * 0.1), duration: 0.5 }}
                            className={cn(
                                "relative flex flex-col bg-[#111118] rounded-2xl border border-[#1E1E2E] transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,0,0,0.2)]",
                                track.borderClass,
                                !isPhase0Done && "grayscale-[20%] border-white/5",
                                (isPhase0Done && isTrackSelected) && "border-[#1E1E2E] opacity-100",
                                (isPhase0Done && !isTrackSelected) && "opacity-80 hover:opacity-100 cursor-pointer"
                            )}
                            style={isPhase0Done ? { boxShadow: `0 0 0 0 ${track.color}22` } : {}}
                            onMouseEnter={(e) => { 
                                if(isPhase0Done) e.currentTarget.style.boxShadow = `0 10px 40px -10px ${track.color}44`; 
                            }}
                            onMouseLeave={(e) => { 
                                e.currentTarget.style.boxShadow = `0 0 0 0 ${track.color}22`; 
                            }}
                        >
                            {/* "השלם את Phase 0" overlay */}
                            {!isPhase0Done && (
                                <div className="absolute -top-3 right-1/2 translate-x-1/2 bg-[#FF4D4D]/20 text-[#FF4D4D] text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap border border-[#FF4D4D]/30 z-20 backdrop-blur-md">
                                    השלם Phase 0 כדי לפתוח
                                </div>
                            )}

                            {/* "המסלול שלך" overlay */}
                            {isTrackSelected && (
                                <div className="absolute top-4 left-4 bg-[#1E1E2E] text-white text-xs font-bold px-3 py-1 rounded-full border border-white/10 flex items-center shadow-lg">
                                    המסלול שלך <CheckCircle className="w-3 h-3 ml-1 text-green-400" />
                                </div>
                            )}

                            <div className={cn("p-6 flex-1 flex flex-col items-start min-h-[400px]")}>
                                <div className={cn("text-xs font-bold tracking-widest uppercase mb-1", track.colorClass)}>
                                    {track.label}
                                </div>
                                <h3 className="text-3xl font-bold text-white mb-2 flex items-center">
                                    <img src={track.logoUrl} alt={track.model} className="w-7 h-7 rounded-md ml-2 object-contain" />
                                    {track.model}
                                </h3>
                                <div className="flex items-center text-[#8B8B9E] text-sm font-medium mb-8">
                                    <div className="relative ml-4">
                                        <img 
                                            src={track.badgeUrl} 
                                            alt={track.badge} 
                                            className={cn(
                                                "w-12 h-12 object-contain transition-all duration-500",
                                                isTrackCompleted ? "drop-shadow-[0_0_15px_rgba(255,215,0,0.4)]" : "grayscale opacity-30 brightness-50"
                                            )} 
                                        />
                                        {isTrackCompleted && (
                                            <m.div 
                                                initial={{ scale: 0, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                className="absolute -top-1 -right-1 bg-[#00C48C] rounded-full p-0.5"
                                            >
                                                <CheckCircle className="w-3 h-3 text-white" />
                                            </m.div>
                                        )}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] uppercase tracking-tighter opacity-70">Badge</span>
                                        <span className={cn("font-bold transition-colors", isTrackCompleted ? "text-white" : "text-[#8B8B9E]")}>
                                            {track.badge}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-1 w-full mb-8 flex-1">
                                    {lessons.map((lesson, lIdx) => {
                                        const locked = false;
                                        const completed = completedLessons.includes(lesson.id);
                                        
                                        return (
                                            <Link href={locked ? "#" : `/lesson/${lesson.id}`} key={lesson.id} className={cn("block group", locked && "pointer-events-none")}>
                                                <div className="flex items-center p-3 rounded-xl hover:bg-[#1E1E2E] transition-colors border border-transparent hover:border-white/5">
                                                    <div className={cn("w-6 h-6 rounded-full flex items-center justify-center shrink-0 ml-3", 
                                                        completed ? track.bgClass : "bg-[#1E1E2E]"
                                                    )}>
                                                        {completed ? (
                                                            <CheckCircle className="w-4 h-4 text-white" />
                                                        ) : (
                                                            <span className={cn("text-[10px] font-bold", track.colorClass)}>{lIdx + 1}</span>
                                                        )}
                                                    </div>
                                                    <div dir="rtl" className={cn("text-sm font-semibold flex-1 mr-2 text-right transition-colors", 
                                                        completed ? "text-white" : locked ? "text-[#8B8B9E]" : "text-zinc-300",
                                                        !locked && !completed && `group-hover:${track.colorClass}`
                                                    )}>
                                                        {lesson.title}
                                                    </div>
                                                    {locked && !completed && <Lock className="w-4 h-4 text-[#FF4D4D] opacity-80" />}
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>


                            </div>
                        </m.div>
                    );
                })}
            </div>

            {/* Bottom Connective Lines */}
            <div className="hidden md:block w-full max-w-4xl h-16 relative">
                <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 0.4 }}>
                    <div className="absolute bottom-0 left-[16.66%] w-px h-8 bg-[#1E1E2E]" />
                    <div className="absolute bottom-0 right-[16.66%] w-px h-8 bg-[#1E1E2E]" />
                    <div className="absolute bottom-0 left-1/2 w-px h-16 bg-[#1E1E2E]" />
                    {/* Bridge */}
                    <div className="absolute bottom-8 left-[16.66%] right-[16.66%] h-px bg-[#1E1E2E]" />
                </m.div>
            </div>
            
            {/* Mobile Connective Line */}
            <div className="md:hidden w-px h-12 bg-[#1E1E2E]" />

            {/* Prestige Badges Section */}
            <m.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9, duration: 0.5 }}
                className="w-full max-w-4xl flex flex-col items-center mt-4"
            >
                <div className="text-[#8B8B9E] text-xs font-bold uppercase tracking-widest mb-6">עמדות יוקרה</div>
                
                <div className="w-full flex overflow-x-auto md:grid md:grid-cols-3 gap-4 pb-4 px-4 md:px-0 snap-x">
                    {PRESTIGE_BADGES.map((badge) => {
                        const isUnlocked = completedTracksCount >= badge.req;
                        return (
                            <div 
                                key={badge.id}
                                className={cn(
                                    "min-w-[140px] md:min-w-0 flex-1 flex flex-col items-center justify-center p-6 rounded-2xl transition-all duration-300 snap-center",
                                    isUnlocked 
                                        ? "bg-[#111118] border-2 border-[#00C48C] opacity-100 hover:scale-[1.02] shadow-[0_0_20px_rgba(0,196,140,0.15)]" 
                                        : "bg-[#0A0A0F] border border-dashed border-[#1E1E2E] opacity-50"
                                )}
                            >
                                <div className={cn("text-4xl mb-4 transition-all duration-500", isUnlocked && "drop-shadow-[0_0_15px_rgba(255,215,0,0.5)]")}>
                                    🎓
                                </div>
                                <h4 className="text-white font-bold text-lg text-center mb-1">{badge.name}</h4>
                                <div className="text-[#8B8B9E] text-xs font-medium flex items-center">
                                    {badge.desc} {isUnlocked && <CheckCircle className="w-3 h-3 mr-1 text-[#00C48C]" />}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </m.div>

        </div>
    );
}

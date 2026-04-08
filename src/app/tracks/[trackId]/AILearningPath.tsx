"use client";

import Link from "next/link";
import Image from "next/image";
import { m, useScroll, useSpring, AnimatePresence } from "framer-motion";
import { CheckCircle2, Lock, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { type LessonMeta, COURSES, CATEGORIES, type Track, type Course } from "@/content";
import { type Badge, BADGES } from "@/content/badges";
import { useRef, useMemo } from "react";
import { useSavantStore } from "@/store/useSavantStore";
import { BadgeCard } from "@/components/BadgeCard";

const EXPERT_TITLES: Record<string, string> = {
    "writer": "כתיבה",
    "analyst": "אנליזה",
    "visual": "ויזואל",
    "builder": "פיתוח",
    "student": "למידה",
};

interface CourseNodeProps {
    course: Course;
    index: number;
    isCompleted: boolean;
    isLocked: boolean;
    achievements: Badge[];
}

function CourseCard({ course, index, isCompleted, isLocked }: { course: Course, index: number, isCompleted: boolean, isLocked: boolean }) {
    return (
        <Link 
            href={!isLocked ? `/courses/${course.id}` : "#"}
            className={cn(
                "group relative block w-full",
                isLocked && "pointer-events-none"
            )}
        >
            <m.div
                whileHover={!isLocked ? { scale: 1.02, y: -5 } : {}}
                className={cn(
                    "relative p-6 md:p-8 rounded-[32px] md:rounded-[40px] border transition-all duration-500 overflow-hidden backdrop-blur-sm",
                    isCompleted ? "bg-green-500/5 border-green-500/20 shadow-[0_20px_40px_rgba(0,0,0,0.3)]" :
                    !isLocked ? "bg-white/5 border-white/10 hover:border-white/20 shadow-[0_20px_40px_rgba(0,0,0,0.4)]" :
                    "bg-white/[0.02] border-white/5 opacity-40 grayscale"
                )}
            >
                {/* Animated Glow */}
                {!isLocked && (
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/5 blur-[60px] rounded-full group-hover:bg-white/10 transition-colors pointer-events-none" />
                )}

                <div className="flex flex-col gap-5 md:gap-6 relative z-10">
                    <div className="flex justify-between items-start">
                        <div className={cn(
                            "w-16 h-16 md:w-20 md:h-20 rounded-[20px] md:rounded-[28px] flex items-center justify-center text-3xl md:text-4xl shadow-2xl border border-white/10 transition-transform duration-700 group-hover:rotate-6 group-hover:scale-110 shrink-0",
                            isCompleted ? "bg-green-500/20" : "bg-white/5"
                        )}>
                            {course.image ? (
                                <Image 
                                    src={course.image} 
                                    alt={course.nameHe} 
                                    width={48} 
                                    height={48} 
                                    className={cn(
                                        "w-10 h-10 md:w-12 md:h-12 object-contain",
                                        (course.id === "grok-mastery" || course.id === "course-perplexity") && "brightness-0 invert"
                                    )}
                                />
                            ) : (
                                <span>{course.icon}</span>
                            )}
                        </div>
                        {isLocked ? (
                            <div className="p-2.5 md:p-3 bg-white/5 rounded-xl md:rounded-2xl border border-white/10">
                                <Lock className="w-4 h-4 md:w-5 md:h-5 text-zinc-500" />
                            </div>
                        ) : isCompleted ? (
                            <div className="p-2.5 md:p-3 bg-green-500/20 rounded-xl md:rounded-2xl border border-green-500/30">
                                <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-green-400" />
                            </div>
                        ) : (
                            <div className="p-2.5 md:p-3 bg-white/10 rounded-xl md:rounded-2xl border border-white/20 group-hover:bg-white/20 transition-colors">
                                <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-white" />
                            </div>
                        )}
                    </div>

                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-[9px] md:text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">תחנה {index + 1}</span>
                            {isCompleted && <span className="text-[9px] md:text-[10px] font-black text-green-500 uppercase tracking-[0.2em]">הושלם</span>}
                        </div>
                        <h3 className="text-xl md:text-3xl font-black text-white mb-2 md:mb-3 tracking-tight group-hover:text-blue-400 transition-colors">
                            {course.nameHe}
                        </h3>
                        <p className="text-zinc-400 text-sm md:text-base font-medium leading-relaxed line-clamp-2 md:line-clamp-3 group-hover:text-zinc-300 transition-colors">
                            {course.description}
                        </p>
                    </div>
                </div>
            </m.div>
        </Link>
    );
}

function CourseNode({ course, index, isCompleted, isLocked, achievements }: CourseNodeProps) {
    const isEven = index % 2 === 0;

    const dotElement = (
        <div className="w-16 h-16 md:w-20 md:h-20 shrink-0 flex items-center justify-center relative">
            <div className={cn(
                "w-5 h-5 md:w-6 md:h-6 rounded-full border-[3px] md:border-4 relative z-10 transition-all duration-1000",
                isCompleted ? "bg-green-500 border-green-200 shadow-[0_0_20px_rgba(34,197,94,0.6)]" :
                !isLocked ? "bg-white border-blue-400 shadow-[0_0_20px_rgba(255,255,255,0.4)]" :
                "bg-zinc-800 border-zinc-700"
            )}>
                {!isLocked && !isCompleted && (
                    <m.div 
                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute -inset-4 bg-white/20 rounded-full pointer-events-none"
                    />
                )}
            </div>
            
            {/* Achievement Badge (if any) */}
            <AnimatePresence>
                {achievements.length > 0 && (
                    <m.div 
                        initial={{ scale: 0, opacity: 0, rotate: -20 }}
                        whileInView={{ scale: 1, opacity: 1, rotate: 5 }}
                        className={cn(
                            "absolute -top-8 md:-top-10 z-20",
                            isEven ? "left-0" : "right-0"
                        )}
                        style={{ pointerEvents: 'none' }}
                    >
                        <div className="relative group">
                            <div className="absolute -inset-4 bg-yellow-500/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                            <BadgeCard 
                                badge={achievements[0]} 
                                earned={isCompleted} 
                                size="sm" 
                            />
                        </div>
                    </m.div>
                )}
            </AnimatePresence>
        </div>
    );
    
    return (
        <m.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.1, type: "spring" }}
            className="w-full relative"
        >
            {/* Desktop Layout */}
            <div className="hidden md:grid grid-cols-[1fr_80px_1fr] gap-0 w-full relative z-10">
                {/* Right Side (Start in RTL) */}
                <div className="flex justify-end pt-2 px-8">
                    {isEven && <CourseCard course={course} index={index} isCompleted={isCompleted} isLocked={isLocked} />}
                </div>

                {/* Center Dot */}
                <div className="flex justify-center pt-10">
                    {dotElement}
                </div>

                {/* Left Side (End in RTL) */}
                <div className="flex justify-start pt-2 px-8">
                    {!isEven && <CourseCard course={course} index={index} isCompleted={isCompleted} isLocked={isLocked} />}
                </div>
            </div>

            {/* Mobile Layout */}
            <div className="grid md:hidden grid-cols-[64px_1fr] gap-4 w-full relative z-10">
                {/* Center Dot */}
                <div className="flex justify-center pt-8">
                    {dotElement}
                </div>

                {/* Card */}
                <div className="flex justify-start pt-2 pb-8 pe-2">
                    <CourseCard course={course} index={index} isCompleted={isCompleted} isLocked={isLocked} />
                </div>
            </div>
        </m.div>
    );
}

export function AILearningPath({ 
    track,
    trackLessons
}: { 
    track: Track,
    trackLessons: LessonMeta[]
}) {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start center", "end center"]
    });

    const pathLength = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

    const trackCourseIds = useMemo(() => Array.from(new Set(trackLessons.map(l => l.courseId))), [trackLessons]);
    
    const trackCourses = useMemo(() => {
        const courses = trackCourseIds.map(id => COURSES.find(c => c.id === id)).filter((c): c is Course => !!c);
        // Sort by category order, then by course order
        return courses.sort((a, b) => {
            const catA = CATEGORIES.find(c => c.id === a!.categoryId);
            const catB = CATEGORIES.find(c => c.id === b!.categoryId);
            if (catA!.order !== catB!.order) return catA!.order - catB!.order;
            return a!.order - b!.order;
        });
    }, [trackCourseIds]);

    const completedCourses = useSavantStore(state => state.completedCourses);

    return (
        <div ref={containerRef} className="relative w-full py-10 md:py-20 mb-32">
            
            {/* The Line container (positioned exactly in line with the columns) */}
            <div className="absolute top-0 bottom-0 left-0 right-0 z-0">
                <div className="relative w-full h-full max-w-5xl mx-auto">
                    {/* Desktop Line */}
                    <div className="absolute top-0 bottom-0 start-[calc(50%-2px)] w-[4px] hidden md:block border-s-[3px] border-dotted border-white/20" />
                    <m.div className="absolute top-0 bottom-0 start-[calc(50%-2px)] w-[4px] hidden md:block origin-top bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500" style={{ scaleY: pathLength }} />
                    
                    {/* Mobile Line */}
                    <div className="absolute top-0 bottom-0 start-[30px] w-[4px] md:hidden border-s-[3px] border-dotted border-white/20" />
                    <m.div className="absolute top-0 bottom-0 start-[30px] w-[4px] md:hidden origin-top bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500" style={{ scaleY: pathLength }} />
                </div>
            </div>

            {/* Courses List */}
            <div className="relative z-10 flex flex-col max-w-5xl mx-auto">
                {trackCourses.map((course, idx) => {
                    const isCompleted = completedCourses.includes(course!.id);
                    // A course is locked if it's not the first one and the previous one isn't completed
                    const isLocked = idx > 0 && !completedCourses.includes(trackCourses[idx - 1]!.id);
                    
                    // Find achievements for this course from LESSON_INDEX rewards
                    const courseLessons = trackLessons.filter(l => l.courseId === course.id);
                    const achievements = courseLessons
                        .filter(l => l.reward?.type === "badge")
                        .map(l => BADGES.find(b => b.id === l.reward?.value))
                        .filter((b): b is Badge => !!b);

                    return (
                        <CourseNode 
                            key={course!.id}
                            course={course}
                            index={idx}
                            isCompleted={isCompleted}
                            isLocked={isLocked}
                            achievements={achievements}
                        />
                    );
                })}

                {/* Final Goal Node */}
                <m.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center justify-center mt-20 md:mt-32 relative z-20"
                >
                    <div className="relative">
                        <m.div 
                            animate={{ rotate: 360 }}
                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                            className="absolute -inset-4 border border-dashed border-yellow-500/30 rounded-full"
                        />
                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-tr from-yellow-500 to-amber-200 p-1 shadow-[0_0_50px_rgba(234,179,8,0.4)] relative z-10">
                            <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-4xl md:text-5xl">
                                {track.icon}
                            </div>
                        </div>
                    </div>
                    <h4 className="text-white font-black text-2xl md:text-3xl mt-8 md:mt-12 tracking-tight text-center">
                        מומחה {EXPERT_TITLES[track.id] || track.name}
                    </h4>
                    <p className="text-zinc-500 font-bold mt-2 uppercase tracking-[0.2em] text-sm md:text-base text-center">סוף המסלול המלא</p>
                </m.div>
            </div>
        </div>
    );
}

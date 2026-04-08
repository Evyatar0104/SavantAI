"use client";

import Link from "next/link";
import Image from "next/image";
import { m, useScroll, useSpring, AnimatePresence } from "framer-motion";
import { CheckCircle2, Lock, Trophy, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { type LessonMeta, COURSES, CATEGORIES, type Course, type LessonReward, type Badge, BADGES } from "@/content";
import { useRef, useMemo } from "react";
import { useSavantStore } from "@/store/useSavantStore";
import { BadgeCard } from "./BadgeCard";

interface CourseNodeProps {
    course: Course;
    index: number;
    isCompleted: boolean;
    isLocked: boolean;
    achievements: Badge[];
}

function CourseNode({ course, index, isCompleted, isLocked, achievements }: CourseNodeProps) {
    const isEven = index % 2 === 0;
    
    return (
        <m.div 
            initial={{ opacity: 0, x: isEven ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: index * 0.1, type: "spring" }}
            className={cn(
                "relative flex items-center gap-8 md:gap-16 w-full max-w-4xl mx-auto mb-32 md:mb-48",
                isEven ? "flex-row" : "flex-row-reverse"
            )}
        >
            {/* Achievement Badge (if any) */}
            <AnimatePresence>
                {achievements.length > 0 && achievements[0] && (
                    <m.div 
                        initial={{ scale: 0, opacity: 0, rotate: -20 }}
                        whileInView={{ scale: 1, opacity: 1, rotate: 5 }}
                        className={cn(
                            "absolute -top-16 z-20",
                            isEven ? "right-[10%]" : "left-[10%]"
                        )}
                    >
                        <div className="relative group">
                            <div className="absolute -inset-4 bg-yellow-500/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                            <BadgeCard 
                                badge={achievements[0]} 
                                earned={isCompleted} 
                                size="sm" 
                            />
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-yellow-500 text-black text-[8px] font-black px-2 py-0.5 rounded-full whitespace-nowrap shadow-lg">
                                הישג במסלול
                            </div>
                        </div>
                    </m.div>
                )}
            </AnimatePresence>

            {/* Course Card */}
            <Link 
                href={!isLocked ? `/courses/${course.id}` : "#"}
                className={cn(
                    "flex-1 group relative",
                    isLocked && "pointer-events-none"
                )}
            >
                <m.div
                    whileHover={!isLocked ? { scale: 1.02, y: -5 } : {}}
                    className={cn(
                        "relative p-8 rounded-[40px] border transition-all duration-500 overflow-hidden backdrop-blur-sm",
                        isCompleted ? "bg-green-500/5 border-green-500/20 shadow-[0_20px_40px_rgba(0,0,0,0.3)]" :
                        !isLocked ? "bg-white/5 border-white/10 hover:border-white/20 shadow-[0_20px_40px_rgba(0,0,0,0.4)]" :
                        "bg-white/[0.02] border-white/5 opacity-40 grayscale"
                    )}
                >
                    {/* Animated Glow */}
                    {!isLocked && (
                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/5 blur-[60px] rounded-full group-hover:bg-white/10 transition-colors" />
                    )}

                    <div className="flex flex-col gap-6 relative z-10">
                        <div className="flex justify-between items-start">
                            <div className={cn(
                                "w-20 h-20 rounded-[28px] flex items-center justify-center text-4xl shadow-2xl border border-white/10 transition-transform duration-700 group-hover:rotate-6 group-hover:scale-110",
                                isCompleted ? "bg-green-500/20" : "bg-white/5"
                            )}>
                                {course.image ? (
                                    <Image 
                                        src={course.image} 
                                        alt={course.nameHe} 
                                        width={48} 
                                        height={48} 
                                        className={cn(
                                            "w-12 h-12 object-contain",
                                            (course.id === "grok-mastery" || course.id === "course-perplexity") && "brightness-0 invert"
                                        )}
                                    />
                                ) : (
                                    <span>{course.icon}</span>
                                )}
                            </div>
                            {isLocked ? (
                                <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                                    <Lock className="w-5 h-5 text-zinc-500" />
                                </div>
                            ) : isCompleted ? (
                                <div className="p-3 bg-green-500/20 rounded-2xl border border-green-500/30">
                                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                                </div>
                            ) : (
                                <div className="p-3 bg-white/10 rounded-2xl border border-white/20 group-hover:bg-white/20 transition-colors">
                                    <ChevronLeft className="w-5 h-5 text-white" />
                                </div>
                            )}
                        </div>

                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">תחנה {index + 1}</span>
                                {isCompleted && <span className="text-[10px] font-black text-green-500 uppercase tracking-[0.2em]">הושלם</span>}
                            </div>
                            <h3 className="text-2xl md:text-3xl font-black text-white mb-3 tracking-tight group-hover:text-blue-400 transition-colors">
                                {course.nameHe}
                            </h3>
                            <p className="text-zinc-400 text-sm md:text-base font-medium leading-relaxed line-clamp-2 group-hover:text-zinc-300 transition-colors">
                                {course.description}
                            </p>
                        </div>
                    </div>
                </m.div>
            </Link>

            {/* Visual Spacer for the SVG connector to hit */}
            <div className="w-24 md:w-32 h-24 shrink-0 flex items-center justify-center relative">
                <div className={cn(
                    "w-6 h-6 rounded-full border-4 relative z-10 transition-all duration-1000",
                    isCompleted ? "bg-green-500 border-green-200 shadow-[0_0_20px_rgba(34,197,94,0.6)]" :
                    !isLocked ? "bg-white border-blue-400 shadow-[0_0_20px_rgba(255,255,255,0.4)]" :
                    "bg-zinc-800 border-zinc-700"
                )}>
                    {!isLocked && !isCompleted && (
                        <m.div 
                            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute -inset-4 bg-white/20 rounded-full"
                        />
                    )}
                </div>
            </div>
        </m.div>
    );
}

export function TrackRoadmap({ 
    trackLessons, 
    completedLessons 
}: { 
    trackLessons: LessonMeta[], 
    completedLessons: string[] 
}) {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start center", "end center"]
    });

    const pathLength = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

    const trackCourseIds = useMemo(() => Array.from(new Set(trackLessons.map(l => l.courseId))), [trackLessons]);
    
    const trackCourses = useMemo(() => {
        const courses = trackCourseIds.map(id => COURSES.find(c => c.id === id)).filter(Boolean);
        // Sort by category order, then by course order
        return courses.sort((a, b) => {
            const catA = CATEGORIES.find(c => c.id === a!.categoryId);
            const catB = CATEGORIES.find(c => c.id === b!.categoryId);
            if (catA!.order !== catB!.order) return catA!.order - catB!.order;
            return a!.order - b!.order;
        });
    }, [trackCourseIds]);

    const completedCourses = useSavantStore(state => state.completedCourses);

    // Generate dynamic SVG path
    const dynamicPath = useMemo(() => {
        const count = trackCourses.length;
        if (count === 0) return "";
        let path = "M400,0";
        for (let i = 0; i < count; i++) {
            const y = (i * 300) + 150;
            const x = i % 2 === 0 ? 100 : 700;
            const prevY = i === 0 ? 0 : ((i - 1) * 300) + 150;
            const prevX = i === 0 ? 400 : (i - 1) % 2 === 0 ? 100 : 700;
            
            // Cubic bezier for smooth curves
            path += ` C${prevX},${prevY + 100} ${x},${y - 100} ${x},${y}`;
        }
        // Final segment to center
        const lastY = (count - 1) * 300 + 150;
        const lastX = (count - 1) % 2 === 0 ? 100 : 700;
        path += ` C${lastX},${lastY + 150} 400,${lastY + 150} 400,${lastY + 300}`;
        return path;
    }, [trackCourses.length]);

    return (
        <div ref={containerRef} className="relative w-full py-20 px-4">
            {/* SVG Connector Line */}
            <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl pointer-events-none z-0 hidden md:block">
                <svg width="100%" height="100%" viewBox={`0 0 800 ${trackCourses.length * 300 + 300}`} preserveAspectRatio="none" className="h-full w-full opacity-20">
                    <defs>
                        <linearGradient id="line-gradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#3b82f6" />
                            <stop offset="50%" stopColor="#8b5cf6" />
                            <stop offset="100%" stopColor="#ec4899" />
                        </linearGradient>
                    </defs>
                    <path 
                        d={dynamicPath} 
                        stroke="url(#line-gradient)" 
                        strokeWidth="4" 
                        fill="none"
                        strokeDasharray="10 10"
                    />
                    <m.path 
                        d={dynamicPath} 
                        stroke="#fff" 
                        strokeWidth="4" 
                        fill="none"
                        style={{ pathLength }}
                    />
                </svg>
            </div>

            {/* Mobile Central Line */}
            <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1 bg-white/5 md:hidden" />

            {/* Courses List */}
            <div className="relative z-10 space-y-0">
                {trackCourses.map((course, idx) => {
                    const currentCourse = course as Course;
                    const isCompleted = completedCourses.includes(currentCourse.id);
                    // A course is locked if it's not the first one and the previous one isn't completed
                    const isLocked = idx > 0 && !completedCourses.includes((trackCourses[idx - 1] as Course).id);
                    
                    // Find achievements for this course from LESSON_INDEX rewards
                    const courseLessons = trackLessons.filter(l => l.courseId === currentCourse.id);
                    const achievements = courseLessons
                        .filter(l => l.reward?.type === "badge")
                        .map(l => BADGES.find(b => b.id === l.reward?.value))
                        .filter((b): b is Badge => !!b);

                    return (
                        <CourseNode 
                            key={currentCourse.id}
                            course={currentCourse}
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
                    className="flex flex-col items-center justify-center mt-32"
                >
                    <div className="relative">
                        <m.div 
                            animate={{ rotate: 360 }}
                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                            className="absolute -inset-4 border border-dashed border-yellow-500/30 rounded-full"
                        />
                        <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-yellow-500 to-amber-200 p-1 shadow-[0_0_50px_rgba(234,179,8,0.4)] relative z-10">
                            <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-5xl">
                                👑
                            </div>
                        </div>
                    </div>
                    <h4 className="text-white font-black text-3xl mt-12 tracking-tight">מאסטר AI פרקטי</h4>
                    <p className="text-zinc-500 font-bold mt-2 uppercase tracking-[0.2em]">סוף המסלול המלא</p>
                </m.div>
            </div>
        </div>
    );
}

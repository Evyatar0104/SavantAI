"use client";

import React, { useMemo, useRef } from "react";
import { m, useScroll, useSpring, AnimatePresence } from "framer-motion";
import { CheckCircle2, Lock, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { COURSES, type Course } from "@/content";
import { type LearningPath } from "@/data/learningPaths";
import { getLessonTheme, FLOATING_ICONS_MAP } from "@/lib/lessonTheme";
import Link from "next/link";
import Image from "next/image";

const EXPERT_TITLES: Record<string, string> = {
    "writer": "כתיבה",
    "analyst": "אנליזה",
    "visual": "ויזואל",
    "builder": "פיתוח",
    "student": "למידה",
};

interface PathRoadmapProps {
    path: LearningPath;
    completedCourses: string[];
}

interface RoadmapItem {
    type: "course" | "achievement";
    data: Course | { name: string; icon: string };
    index?: number;
    isCompleted?: boolean;
    isLocked?: boolean;
    isUnlocked?: boolean;
}

function FloatingIcons({ courseId, color }: { courseId: string, color: string }) {
    const icons = FLOATING_ICONS_MAP[courseId] || FLOATING_ICONS_MAP.DEFAULT;
    
    return (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-visible">
            {icons.slice(0, 4).map((icon, i) => (
                <m.div
                    key={i}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 0.4 }}
                    animate={{
                        y: [0, -15, 0],
                        x: [0, i % 2 === 0 ? 10 : -10, 0],
                        rotate: [0, 10, -10, 0],
                    }}
                    transition={{
                        duration: 4 + i,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.5
                    }}
                    className="absolute text-xl md:text-2xl"
                    style={{
                        top: `${20 + i * 20}%`,
                        left: i % 2 === 0 ? "-10%" : "90%",
                        filter: `drop-shadow(0 0 10px ${color}40)`
                    }}
                >
                    {icon}
                </m.div>
            ))}
        </div>
    );
}

function AchievementNode({ achievement, isUnlocked }: { achievement: { name: string, icon: string }, isUnlocked: boolean }) {
    return (
        <m.div 
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="flex flex-col items-center gap-3 relative z-20"
        >
            <div className={cn(
                "w-16 h-16 md:w-20 md:h-20 rounded-3xl flex items-center justify-center text-3xl md:text-4xl shadow-2xl border transition-all duration-700",
                isUnlocked ? "bg-yellow-500/20 border-yellow-500/50 shadow-[0_0_40px_rgba(234,179,8,0.3)]" : "bg-zinc-900 border-zinc-800 opacity-40 grayscale"
            )}>
                {achievement.icon}
            </div>
            <div className="text-center">
                <span className="text-[10px] font-black text-yellow-500 uppercase tracking-widest block mb-1">הישג שלב</span>
                <span className={cn("text-xs md:text-sm font-bold", isUnlocked ? "text-white" : "text-zinc-500")}>{achievement.name}</span>
            </div>
            
            {isUnlocked && (
                <m.div 
                    animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute -inset-6 bg-yellow-500/20 rounded-full blur-2xl -z-10"
                />
            )}
        </m.div>
    );
}

function CourseNode({ 
    course, 
    index, 
    isCompleted, 
    isLocked, 
    isEven 
}: { 
    course: Course; 
    index: number; 
    isCompleted: boolean; 
    isLocked: boolean; 
    isEven: boolean;
}) {
    const isActive = !isCompleted && !isLocked;
    const theme = getLessonTheme(course.icon, course.id);

    return (
        <m.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            className={cn(
                "relative flex items-center gap-4 md:gap-12 w-full max-w-4xl mx-auto mb-16 md:mb-24",
                "flex-col md:flex-row", // Stack on mobile, row on desktop
                !isEven && "md:flex-row-reverse" // Reverse only on desktop for zig-zag
            )}
        >
            {/* Personalized background elements */}
            <AnimatePresence>
                {isActive && (
                    <m.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute inset-0 pointer-events-none -z-10"
                    >
                        <div 
                            className="absolute inset-0 blur-[100px] opacity-20 rounded-full"
                            style={{ background: `radial-gradient(circle, ${theme.primary}, transparent)` }}
                        />
                        <FloatingIcons courseId={course.id} color={theme.primary} />
                    </m.div>
                )}
            </AnimatePresence>

            {/* Course Card */}
            <Link 
                href={!isLocked ? `/courses/${course.id}` : "#"}
                className={cn(
                    "flex-1 group relative w-full",
                    isLocked && "pointer-events-none"
                )}
            >
                <m.div
                    whileHover={!isLocked ? { y: -8, scale: 1.02 } : {}}
                    className={cn(
                        "relative p-5 md:p-8 rounded-[32px] md:rounded-[40px] border transition-all duration-500 overflow-hidden backdrop-blur-xl shadow-2xl",
                        isCompleted ? "bg-green-500/5 border-green-500/20" :
                        isActive ? "bg-white/[0.08] border-white/20" :
                        "bg-white/[0.02] border-white/5 opacity-40 grayscale"
                    )}
                    style={isActive ? { 
                        borderColor: `${theme.primary}40`, 
                        background: `linear-gradient(135deg, ${theme.primary}10, transparent)`,
                        boxShadow: `0 20px 50px -10px ${theme.primary}20`
                    } : {}}
                >
                    <div className="flex flex-col gap-4 md:gap-6 relative z-10">
                        <div className="flex justify-between items-start">
                            <div className={cn(
                                "w-14 h-14 md:w-20 md:h-20 rounded-2xl md:rounded-3xl flex items-center justify-center text-3xl md:text-4xl shadow-xl border border-white/10 transition-all duration-700 group-hover:scale-110 group-hover:rotate-6",
                                isCompleted ? "bg-green-500/20 border-green-500/30" : "bg-white/5"
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
                                <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                                    <Lock className="w-5 h-5 text-zinc-600" />
                                </div>
                            ) : isCompleted ? (
                                <div className="p-3 bg-green-500/20 rounded-2xl border border-green-500/30">
                                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                                </div>
                            ) : (
                                <div className="p-3 bg-white/10 rounded-2xl border border-white/20 group-hover:bg-white/20 transition-all">
                                    <ArrowRight className="w-5 h-5 text-white rotate-180" />
                                </div>
                            )}
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">תחנה {index + 1}</span>
                                {isCompleted && <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">הושלם</span>}
                                {isActive && <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest animate-pulse">התחנה הבאה</span>}
                            </div>
                            <h3 className="text-xl md:text-3xl font-black text-white mb-2 leading-tight group-hover:text-blue-400 transition-colors">
                                {course.nameHe}
                            </h3>
                            <p className="text-zinc-400 text-sm md:text-base font-medium leading-relaxed line-clamp-2 group-hover:text-zinc-300 transition-colors">
                                {course.description}
                            </p>
                        </div>
                    </div>
                </m.div>
            </Link>

            {/* Path Node Indicator */}
            <div className="w-full md:w-24 flex justify-center shrink-0">
                <div className={cn(
                    "w-6 h-6 md:w-8 md:h-8 rounded-full border-[3px] md:border-4 relative z-10 transition-all duration-1000",
                    isCompleted ? "bg-green-500 border-green-200 shadow-[0_0_20px_rgba(34,197,94,0.6)]" :
                    isActive ? "bg-white border-white shadow-[0_0_25px_rgba(255,255,255,0.5)]" :
                    "bg-zinc-800 border-zinc-700"
                )}
                style={isActive ? { borderColor: theme.primary, boxShadow: `0 0 30px ${theme.primary}80` } : {}}
                >
                    {isActive && (
                        <m.div 
                            animate={{ scale: [1, 2.2, 1], opacity: [0.6, 0, 0.6] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute -inset-4 rounded-full"
                            style={{ backgroundColor: `${theme.primary}40` }}
                        />
                    )}
                </div>
            </div>
        </m.div>
    );
}

export function PathRoadmap({ path, completedCourses }: PathRoadmapProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start center", "end center"]
    });

    const pathLength = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

    const roadmapItems = useMemo(() => {
        const items: RoadmapItem[] = [];

        path.courses?.forEach((courseId, i) => {
            const course = COURSES.find(c => c.id === courseId);
            if (course) {
                items.push({ 
                    type: "course", 
                    data: course, 
                    index: i,
                    isCompleted: completedCourses.includes(course.id),
                    isLocked: i > 0 && !completedCourses.includes(path.courses[i - 1])
                });
            }
        });

        return items;
    }, [path, completedCourses]);

    const dynamicPath = useMemo(() => {
        const count = roadmapItems.length;
        if (count === 0) return "";
        
        let svgPath = "M400,0";
        
        roadmapItems.forEach((item, i) => {
            const y = (i * 280) + 140;
            let x = 400;
            
            if (item.type === "course") {
                x = item.index !== undefined && item.index % 2 === 0 ? 150 : 650;
            }
            
            const prevY = i === 0 ? 0 : ((i - 1) * 280) + 140;
            const prevX = i === 0 ? 400 : roadmapItems[i-1].type === "course" ? (roadmapItems[i-1].index !== undefined && roadmapItems[i-1].index! % 2 === 0 ? 150 : 650) : 400;
            
            svgPath += ` C${prevX},${prevY + 140} ${x},${y - 140} ${x},${y}`;
        });
        
        const lastY = (roadmapItems.length - 1) * 280 + 140;
        svgPath += ` L400,${lastY + 250}`;
        
        return svgPath;
    }, [roadmapItems]);

    return (
        <div ref={containerRef} className="relative w-full py-10 md:py-20">
            {/* SVG Connector Line (Desktop Only) */}
            <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-full max-w-5xl pointer-events-none z-0 hidden md:block">
                <svg width="100%" height="100%" viewBox={`0 0 800 ${roadmapItems.length * 280 + 400}`} preserveAspectRatio="none" className="h-full w-full opacity-30">
                    <defs>
                        <linearGradient id="path-gradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={path.color} />
                            <stop offset="50%" stopColor="#fff" />
                            <stop offset="100%" stopColor={path.color} />
                        </linearGradient>
                    </defs>
                    <path 
                        d={dynamicPath} 
                        stroke="url(#path-gradient)" 
                        strokeWidth="4" 
                        fill="none"
                        strokeDasharray="15 15"
                    />
                    <m.path 
                        d={dynamicPath} 
                        stroke={path.color} 
                        strokeWidth="8" 
                        fill="none"
                        style={{ pathLength }}
                        strokeLinecap="round"
                    />
                </svg>
            </div>

            {/* Mobile Central Line (Centered) */}
            <div className="absolute top-0 bottom-0 left-1/2 -translate-x-[1px] w-[2px] bg-white/10 md:hidden" />

            {/* Content List */}
            <div className="relative z-10 space-y-0 max-w-6xl mx-auto px-4 md:px-8">
                {roadmapItems.map((item, idx) => {


                    if (item.type === "course") {
                        const courseData = item.data as Course;
                        return (
                            <CourseNode 
                                key={`course-${courseData.id}`}
                                course={courseData}
                                index={item.index || 0}
                                isCompleted={!!item.isCompleted}
                                isLocked={!!item.isLocked}
                                isEven={(item.index || 0) % 2 === 0}
                            />
                        );
                    }

                    if (item.type === "achievement") {
                        const achData = item.data as { name: string; icon: string };
                        return (
                            <div key={`ach-${idx}`} className="py-24 md:py-32 flex justify-center">
                                <AchievementNode 
                                    achievement={achData} 
                                    isUnlocked={!!item.isUnlocked} 
                                />
                            </div>
                        );
                    }

                    return null;
                })}

                {/* Final Goal Node */}
                <m.div 
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center justify-center mt-32 pb-48"
                >
                    <div className="relative">
                        <m.div 
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="absolute -inset-16 border-2 border-dashed rounded-full opacity-20"
                            style={{ borderColor: path.color }}
                        />
                        <m.div 
                            animate={{ rotate: -360, scale: [1, 1.1, 1] }}
                            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                            className="absolute -inset-10 border border-dashed rounded-full opacity-40"
                            style={{ borderColor: path.color }}
                        />
                        <div 
                            className="w-48 h-48 md:w-64 md:h-64 rounded-full p-1 shadow-[0_0_80px_rgba(0,0,0,0.8)] relative z-10 overflow-hidden group border-2 border-white/20"
                            style={{ background: `linear-gradient(135deg, ${path.color}, #fff, ${path.color})` }}
                        >
                            <div className="w-full h-full rounded-full bg-black flex flex-col items-center justify-center text-center p-6 backdrop-blur-3xl">
                                <m.span 
                                    animate={{ y: [0, -10, 0], scale: [1, 1.1, 1] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="text-7xl md:text-8xl mb-4 filter drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]"
                                >
                                    {path.icon}
                                </m.span>
                                <span className="text-[12px] md:text-sm font-black uppercase tracking-[0.3em] text-zinc-400">
                                    מומחה {EXPERT_TITLES[path.id] || path.nameHe}
                                </span>
                            </div>
                            
                            <m.div 
                                animate={{ opacity: [0, 0.3, 0], scale: [1, 1.5, 1] }}
                                transition={{ duration: 5, repeat: Infinity }}
                                className="absolute inset-0 bg-white blur-3xl pointer-events-none"
                            />
                        </div>
                    </div>
                    <h4 className="text-white font-black text-4xl md:text-7xl mt-16 tracking-tighter text-center">מסע למידה הושלם</h4>
                    <p className="text-zinc-500 font-bold mt-4 uppercase tracking-[0.4em] text-center md:text-xl">הגעת ליעד הסופי!</p>
                </m.div>
            </div>
        </div>
    );
}

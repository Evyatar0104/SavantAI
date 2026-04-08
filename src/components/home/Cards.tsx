"use client";

import Link from "next/link";
import Image from "next/image";
import { memo, useRef } from "react";
import { m, useMotionValue, useSpring, useTransform, useMotionTemplate } from "framer-motion";
import { ArrowRight, Clock, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { CATEGORIES, COURSES } from "@/content";
import { LESSON_INDEX } from "@/content";
import { getLessonTheme } from "@/lib/lessonTheme";
import { isCourseUnlocked } from "@/lib/courseUnlock";

// Maps category color string to a vivid RGB glow color.
const CATEGORY_GLOW: Record<string, string> = {
    "from-purple-600 to-indigo-800":  "147, 51, 234",
    "from-blue-700 to-indigo-900":    "96, 165, 250",
    "from-[#0D1B2A] to-[#1B263B]":   "14, 165, 233",
    "from-emerald-500 to-teal-700":   "16, 185, 129",
    "from-blue-600 via-indigo-700 to-slate-900": "37, 99, 235",
    "from-amber-500 to-yellow-700":   "245, 158, 11",
};

function getGlowColor(colorKey: string): string {
    return CATEGORY_GLOW[colorKey] ?? "139, 92, 246";
}

interface CourseCardProps {
    course: typeof COURSES[0];
    category: typeof CATEGORIES[0];
    completedLessons: string[];
    completedCourses: string[];
    hasMoved: boolean;
}

export const CourseCard = memo(({ course, category, completedLessons, completedCourses, hasMoved }: CourseCardProps) => {
    const courseLessons = LESSON_INDEX.filter(l => l.courseId === course.id);
    const completedInCourse = courseLessons.filter(l => completedLessons.includes(l.id));
    const progress = courseLessons.length > 0
        ? (completedInCourse.length / courseLessons.length) * 100
        : 0;
    const unlocked = isCourseUnlocked(course.id, completedCourses);


    const primaryColorClass = category.color.split(' ')[0].replace('from-', 'text-').replace('-500', '-400').replace('-600', '-400').replace('-700', '-500');

    const cardRef = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseX = useSpring(x, { stiffness: 500, damping: 50 });
    const mouseY = useSpring(y, { stiffness: 500, damping: 50 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const { left, top } = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - left);
        y.set(e.clientY - top);
    };

    const cardContent = (
        <div 
            ref={cardRef}
            onMouseMove={handleMouseMove}
            className={cn(
                "relative overflow-hidden w-52 h-64 md:w-80 md:h-96 rounded-[40px] p-7 md:p-10 flex flex-col justify-between transition-all duration-500 shadow-2xl border",
                "bg-zinc-900/90 border-white/10",
                unlocked
                    ? "group-hover:-translate-y-3 hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.06)] group-hover:border-white/20"
                    : "opacity-60 grayscale saturate-50 cursor-default"
            )}
        >
            {/* Mouse-tracking highlight (Internal) */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-[40px]">
                {unlocked && (
                    <m.div 
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{
                            background: useMotionTemplate`radial-gradient(300px circle at ${mouseX}px ${mouseY}px, rgba(${getGlowColor(category.color)}, 0.18), transparent 70%)`
                        }}
                    />
                )}
            </div>

            {!unlocked && (
                <div className="absolute top-5 left-5 z-20">
                    <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10">
                        <Lock className="w-5 h-5 text-white/60" />
                    </div>
                </div>
            )}

            <div className={cn(
                "relative z-10 w-14 h-14 md:w-20 md:h-20 flex items-center justify-center text-3xl md:text-4xl shadow-2xl border border-white/20 transition-all duration-700 group-hover:scale-110 group-hover:rotate-3 squarcle bg-gradient-to-br",
                category.color
            )}>
                {course.icon.startsWith("@") ? (
                    <div className="w-full h-full p-3 flex items-center justify-center">
                        <Image
                            src={`/assets/logos/${course.icon.substring(1)}`}
                            alt={course.nameHe}
                            width={80}
                            height={80}
                            className={cn(
                                "w-full h-full object-contain",
                                (course.id === "grok-mastery" || course.id === "course-perplexity") && "brightness-0 invert"
                            )}
                            loading="lazy"
                        />
                    </div>
                ) : course.image ? (
                    <div className="w-full h-full p-3 flex items-center justify-center">
                        {course.id === "course-notebooklm" ? (
                            <div className="w-full h-full squarcle bg-white overflow-hidden flex items-center justify-center">
                                <Image src={course.image} alt={course.nameHe} width={80} height={80} className="w-full h-full object-contain p-2" loading="lazy" />
                            </div>
                        ) : (
                            <Image 
                                src={course.image} 
                                alt={course.nameHe} 
                                width={80} 
                                height={80} 
                                className={cn(
                                    "w-full h-full object-contain",
                                    (course.id === "grok-mastery" || course.id === "course-perplexity") && "brightness-0 invert"
                                )} 
                                loading="lazy" 
                            />
                        )}
                    </div>
                ) : (
                    <div className="drop-shadow-2xl">{course.icon}</div>
                )}
            </div>
            
            <div className="relative z-10 space-y-3">
                <div>
                    <p className={cn(
                        "text-[10px] md:text-xs font-black uppercase tracking-widest mb-1.5 transition-colors duration-300",
                        unlocked ? `text-zinc-500 group-hover:${primaryColorClass}` : "text-zinc-500"
                    )}>
                        {category.nameHe}
                    </p>
                    <h4 className={cn("text-zinc-900 dark:text-white font-black text-lg md:text-2xl leading-tight line-clamp-2 tracking-tight transition-colors duration-300", unlocked && `group-hover:${primaryColorClass}`)}>
                        {course.nameHe}
                    </h4>
                </div>
                
                {/* Removed prerequisite text */}


                <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] md:text-xs font-bold text-zinc-500">
                        <span>התקדמות</span>
                        <span>{courseLessons.length} / {completedInCourse.length}</span>
                    </div>
                    <div className="w-full h-1.5 md:h-2 bg-zinc-200 dark:bg-white/5 rounded-full overflow-hidden p-[1px]">
                        <m.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            className={cn("h-full rounded-full opacity-90 shadow-[0_0_12px_rgba(255,255,255,0.2)] bg-gradient-to-r transition-all duration-1000", category.color)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="relative group px-2">
            {/* Ambient Glows (Behind the card) */}
            <div className="absolute inset-0 pointer-events-none">
                <div
                    className="absolute -inset-[15%] rounded-full opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-700 blur-[50px]"
                    style={{ backgroundColor: `rgb(${getGlowColor(category.color)})` }}
                />
                <div
                    className="absolute -top-1/4 -right-1/4 w-full h-full rounded-full opacity-[0.05] group-hover:opacity-[0.14] transition-opacity duration-700 blur-[40px]"
                    style={{ backgroundColor: `rgb(${getGlowColor(category.color)})` }}
                />
                <div
                    className="absolute -bottom-1/4 -left-1/4 w-full h-full rounded-full opacity-0 group-hover:opacity-[0.1] transition-opacity duration-700 blur-[40px]"
                    style={{ backgroundColor: `rgb(${getGlowColor(category.color)})` }}
                />
            </div>

            {unlocked ? (
                <Link
                    href={`/courses/${course.id}?from=home`}
                    className="block"
                    onDragStart={(e) => e.preventDefault()}
                    onClick={(e) => { if (hasMoved) e.preventDefault(); }}
                >
                    {cardContent}
                </Link>
            ) : (
                cardContent
            )}
        </div>
    );
});
CourseCard.displayName = "CourseCard";

export const LessonCard = memo(({ lesson }: { lesson: typeof LESSON_INDEX[0] }) => {
    const lessonCategory = CATEGORIES.find(c => c.id === lesson.categoryId);
    const lessonCourse = COURSES.find(c => c.id === lesson.courseId);
    const theme = getLessonTheme(lesson.icon || "", lesson.courseId);
    
    const cardRef = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseX = useSpring(x, { stiffness: 500, damping: 50 });
    const mouseY = useSpring(y, { stiffness: 500, damping: 50 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const { left, top } = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - left);
        y.set(e.clientY - top);
    };

    return (
        <div className="relative group h-full">
            {/* Ambient Glows (Behind the card) */}
            <div className="absolute inset-0 pointer-events-none">
                <div
                    className="absolute -inset-[15%] rounded-full opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-700 blur-[50px]"
                    style={{ backgroundColor: theme.primary }}
                />
                <div
                    className="absolute -top-1/4 -right-1/4 w-full h-full rounded-full opacity-[0.05] group-hover:opacity-[0.14] transition-opacity duration-700 blur-[40px]"
                    style={{ backgroundColor: theme.primary }}
                />
                <div
                    className="absolute -bottom-1/4 -left-1/4 w-full h-full rounded-full opacity-0 group-hover:opacity-[0.1] transition-opacity duration-700 blur-[40px]"
                    style={{ backgroundColor: theme.primary }}
                />
            </div>

            <Link href={`/lesson/${lesson.id}?from=home`} className="group block focus:outline-none h-full perspective-1000">
                <div 
                    ref={cardRef}
                    onMouseMove={handleMouseMove}
                    className={cn(
                        "relative overflow-hidden rounded-[40px] md:rounded-[48px] p-8 md:p-10 flex flex-col h-full justify-between transition-all duration-700 border shadow-2xl transform-style-3d group-hover:-translate-y-3 group-hover:shadow-[0_48px_96px_-24px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.06)]",
                        "bg-zinc-900/90 border-white/10 hover:border-white/20"
                    )}
                >
                    {/* Internal Glows & Mouse tracking */}
                    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-[40px] md:rounded-[48px]">
                        <m.div 
                            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                            style={{
                                background: useMotionTemplate`radial-gradient(350px circle at ${mouseX}px ${mouseY}px, ${theme.primary}30, transparent 70%)`
                            }}
                        />
                    </div>

                    <div className="flex justify-between items-start mb-8 md:mb-10 relative z-10 w-full">
                        <div className={cn(
                            "px-5 py-2 rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest shadow-xl border transition-all duration-500 group-hover:scale-105",
                            "bg-white/90 dark:bg-zinc-800/90 border-black/5 dark:border-white/10 text-zinc-800 dark:text-zinc-200 group-hover:border-blue-500/30 group-hover:text-blue-400"
                        )}>
                            {lessonCourse?.nameHe || lessonCategory?.nameHe}
                        </div>
                        <div 
                            className="w-16 h-16 md:w-20 md:h-20 rounded-[28px] flex items-center justify-center text-4xl md:text-5xl shadow-2xl border border-white/20 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6"
                            style={{ 
                                background: `linear-gradient(135deg, ${theme.primary}50 0%, ${theme.secondary}30 100%)`,
                                boxShadow: `0 20px 40px -10px ${theme.primary}40`
                            }}
                        >
                            <span className="drop-shadow-2xl relative w-full h-full flex items-center justify-center p-3">
                                {lesson.icon?.startsWith("@") ? (
                                    <Image 
                                        src={`/assets/logos/${lesson.icon.substring(1)}`} 
                                        alt="" 
                                        width={64} 
                                        height={64} 
                                        className="object-contain filter drop-shadow-lg" 
                                    />
                                ) : (
                                    <div className="filter drop-shadow-lg">{lesson.icon || "📚"}</div>
                                )}
                            </span>
                        </div>
                    </div>

                    <div className="relative z-10 mb-8 flex-1">
                        <h4 className="text-2xl md:text-3xl font-black leading-tight mb-4 text-zinc-900 dark:text-white transition-colors duration-300 group-hover:text-blue-400 tracking-tight">
                            {lesson.title}
                        </h4>
                        <p className="text-zinc-600 dark:text-zinc-400 text-sm md:text-base line-clamp-3 leading-relaxed font-medium group-hover:text-zinc-300 transition-colors duration-300">
                            {lesson.description}
                        </p>
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-6 border-t border-black/5 dark:border-white/10 relative z-10">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">זמן קריאה</span>
                            <span className="text-zinc-500 dark:text-zinc-400 text-xs font-bold tracking-tight flex items-center">
                                <Clock className="w-4 h-4 ml-2 text-blue-500" /> 2 דק&apos; קריאה
                            </span>
                        </div>
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-xl border border-white/5 group-hover:border-white/20 group-hover:scale-110"
                             style={{ backgroundColor: `${theme.primary}20`, color: theme.primary }}>
                            <ArrowRight className="w-5 h-5 md:w-6 md:h-6 rotate-180 group-hover:-translate-x-1.5 transition-transform" />
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
});
LessonCard.displayName = "LessonCard";

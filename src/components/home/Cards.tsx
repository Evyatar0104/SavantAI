"use client";

import Link from "next/link";
import Image from "next/image";
import { memo } from "react";
import { m } from "framer-motion";
import { ArrowRight, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { CATEGORIES, COURSES } from "@/content";
import { LESSON_INDEX } from "@/content";
import { getLessonTheme } from "@/lib/lessonTheme";
import { isCourseUnlocked, getCoursePrerequisiteName } from "@/lib/courseUnlock";

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
    const prereqName = getCoursePrerequisiteName(course.id);

    const cardInner = (
        <div className={cn(
            "relative overflow-hidden w-48 h-56 md:w-72 md:h-80 rounded-[32px] p-6 md:p-8 flex flex-col justify-between transition-all duration-500 shadow-lg border",
            "bg-white/60 dark:bg-zinc-900/40 backdrop-blur-xl border-black/5 dark:border-white/5",
            unlocked
                ? "group-hover:-translate-y-2 group-hover:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.5)] hover:border-black/10 dark:hover:border-white/10"
                : "opacity-50 cursor-default"
        )}>
            <div className={cn(
                "absolute -top-10 -right-10 w-32 h-32 md:w-48 md:h-48 rounded-full blur-[40px] md:blur-[60px] opacity-20 dark:opacity-20 transition-opacity duration-500 pointer-events-none bg-gradient-to-br",
                unlocked && "group-hover:opacity-40",
                category.color
            )} />

            {!unlocked && (
                <div className="absolute top-3 left-3 text-lg z-20">🔒</div>
            )}

            <div className={cn(
                "relative z-10 w-12 h-12 md:w-16 md:h-16 flex items-center justify-center text-2xl md:text-3xl shadow-inner border border-white/15 squarcle bg-gradient-to-br",
                category.color
            )}>
                {course.icon.startsWith("@") ? (
                    <div className="w-full h-full p-2.5 flex items-center justify-center">
                        <Image
                            src={`/assets/logos/${course.icon.substring(1)}`}
                            alt={course.nameHe}
                            width={64}
                            height={64}
                            className={cn(
                                "w-full h-full object-contain",
                                (course.id === "grok-mastery" || course.id === "course-perplexity") && "brightness-0 invert"
                            )}
                            loading="lazy"
                        />
                    </div>
                ) : course.image ? (
                    <div className="w-full h-full p-2.5 flex items-center justify-center">
                        {course.id === "course-notebooklm" ? (
                            <div className="w-full h-full squarcle bg-white overflow-hidden flex items-center justify-center">
                                <Image src={course.image} alt={course.nameHe} width={64} height={64} className="w-full h-full object-contain p-1.5" loading="lazy" />
                            </div>
                        ) : (
                            <Image 
                                src={course.image} 
                                alt={course.nameHe} 
                                width={64} 
                                height={64} 
                                className={cn(
                                    "w-full h-full object-contain",
                                    (course.id === "grok-mastery" || course.id === "course-perplexity") && "brightness-0 invert"
                                )} 
                                loading="lazy" 
                            />
                        )}
                    </div>
                ) : (
                    course.icon
                )}
            </div>
            <div className="relative z-10">
                <p className="text-[10px] md:text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-1 tracking-wide">{category.nameHe}</p>
                <h4 className="text-zinc-900 dark:text-white/90 font-bold text-base md:text-xl leading-snug line-clamp-2 mb-1">
                    {course.nameHe}
                </h4>
                {!unlocked && prereqName && (
                    <p className="text-[9px] md:text-[10px] text-zinc-500 dark:text-zinc-500 mb-2 leading-tight">
                        נפתח אחרי השלמה של &ldquo;{prereqName}&rdquo;
                    </p>
                )}
                <div className="w-full h-1 md:h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <m.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className={cn("h-full opacity-80 bg-gradient-to-r", category.color)}
                    />
                </div>
            </div>
        </div>
    );

    if (!unlocked) return <div className="group">{cardInner}</div>;

    return (
        <Link
            href={`/courses/${course.id}?from=home`}
            className="block group"
            onDragStart={(e) => e.preventDefault()}
            onClick={(e) => { if (hasMoved) e.preventDefault(); }}
        >
            {cardInner}
        </Link>
    );
});
CourseCard.displayName = "CourseCard";

interface LessonCardProps {
    lesson: typeof LESSON_INDEX[0];
}

export const LessonCard = memo(({ lesson }: LessonCardProps) => {
    const lessonCategory = CATEGORIES.find(c => c.id === lesson.categoryId);
    const lessonCourse = COURSES.find(c => c.id === lesson.courseId);
    const theme = getLessonTheme(lesson.icon || "", lesson.courseId);
    return (
        <Link href={`/lesson/${lesson.id}?from=home`} className="group block focus:outline-none h-full perspective-1000">
            <div className={cn(
                "relative overflow-hidden rounded-[32px] md:rounded-[40px] p-6 md:p-8 flex flex-col h-full justify-between transition-all duration-500 border shadow-lg transform-style-3d group-hover:-translate-y-2 group-hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)]",
                "bg-white/60 dark:bg-zinc-900/40 backdrop-blur-xl border-black/5 dark:border-white/5 hover:border-black/10 dark:hover:border-white/10"
            )}>
                <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none" 
                     style={{ background: theme.primary }} />

                <div className="flex justify-between items-start mb-6 md:mb-8 relative z-10 w-full">
                    <div className={cn(
                        "px-4 py-1.5 rounded-full text-[10px] md:text-xs font-bold tracking-wide shadow-sm border",
                        "bg-white/80 dark:bg-zinc-800/80 border-black/5 dark:border-white/10 text-zinc-800 dark:text-zinc-200"
                    )}>
                        {lessonCourse?.nameHe || lessonCategory?.nameHe}
                    </div>
                    <div 
                        className="w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center text-3xl md:text-4xl shadow-inner border border-white/20 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
                        style={{ background: `linear-gradient(135deg, ${theme.primary}40 0%, ${theme.secondary}20 100%)` }}
                    >
                        <span className="drop-shadow-md relative w-full h-full flex items-center justify-center p-2">
                            {lesson.icon?.startsWith("@") ? (
                                <Image 
                                    src={`/assets/logos/${lesson.icon.substring(1)}`} 
                                    alt="" 
                                    width={48} 
                                    height={48} 
                                    className="object-contain" 
                                />
                            ) : (
                                lesson.icon || "📚"
                            )}
                        </span>
                    </div>
                </div>

                <div className="relative z-10 mb-6 flex-1">
                    <h4 className="text-xl md:text-2xl font-bold font-serif leading-snug mb-3 text-zinc-900 dark:text-white transition-colors duration-300">
                        {lesson.title}
                    </h4>
                    <p className="text-zinc-600 dark:text-zinc-400 text-xs md:text-sm line-clamp-2 md:line-clamp-3 leading-relaxed">
                        {lesson.description}
                    </p>
                </div>

                <div className="mt-auto flex items-center justify-between pt-4 border-t border-black/5 dark:border-white/5 relative z-10">
                    <span className="text-zinc-500 dark:text-zinc-500 text-[10px] md:text-xs font-bold tracking-wider flex items-center">
                        <Clock className="w-3.5 h-3.5 ml-1.5" /> 2 דק&apos; קריאה
                    </span>
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm"
                         style={{ backgroundColor: `${theme.primary}15`, color: theme.primary }}>
                        <ArrowRight className="w-4 h-4 md:w-5 md:h-5 rotate-180 group-hover:-translate-x-1 transition-transform" />
                    </div>
                </div>
            </div>
        </Link>
    );
});
LessonCard.displayName = "LessonCard";


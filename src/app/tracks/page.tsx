"use client";

import Link from "next/link";
import { CATEGORIES, COURSES, LESSONS } from "@/data/lessons";
import { useSavantStore } from "@/store/useSavantStore";
import { m, Variants } from "framer-motion";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08
        }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function Tracks() {
    const completedLessons = useSavantStore((state: any) => state.completedLessons);
    const completedCourses = useSavantStore((state: any) => state.completedCourses);

    const sortedCategories = [...CATEGORIES].sort((a, b) => a.order - b.order);

    return (
        <div className="p-6 md:p-10 flex flex-col pt-12 md:pt-16 max-w-7xl mx-auto w-full relative">
            <h1 className="text-4xl md:text-5xl font-black mb-3 tracking-tight text-foreground">מסלולי למידה</h1>
            <p className="text-lg md:text-xl text-zinc-500 dark:text-zinc-400 mb-10 md:mb-12 font-medium">שלוט בדור הבא של הבינה המלאכותית.</p>

            <div className="space-y-16">
                {sortedCategories.map((category) => {
                    const categoryCourses = COURSES
                        .filter(c => c.categoryId === category.id)
                        .sort((a, b) => a.order - b.order);

                    return (
                        <section key={category.id}>
                            {/* Category Header */}
                            <div className="flex items-center gap-4 mb-6">
                                <div className={cn(
                                    "w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center text-2xl md:text-3xl shadow-lg shrink-0",
                                    category.color
                                )}>
                                    {category.icon}
                                </div>
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-black tracking-tight text-foreground">{category.nameHe}</h2>
                                    <p className="text-sm md:text-base text-zinc-500 dark:text-zinc-400 font-medium">{category.description}</p>
                                </div>
                            </div>

                            {/* Course Cards */}
                            <m.div
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
                                variants={containerVariants}
                                initial="hidden"
                                animate="show"
                            >
                                {categoryCourses.map((course) => {
                                    const courseLessons = LESSONS.filter(l => l.courseId === course.id);
                                    const completedInCourse = courseLessons.filter(l => completedLessons.includes(l.id));
                                    const lessonsCount = courseLessons.length;
                                    const isCompleted = completedCourses.includes(course.id);
                                    const hasLessons = lessonsCount > 0;

                                    return (
                                        <m.div key={course.id} variants={itemVariants} className="h-full">
                                            <Link
                                                href={hasLessons ? `/courses/${course.id}` : "#"}
                                                className={cn(
                                                    "group h-full p-8 rounded-[32px] flex flex-col items-start space-y-6 transition-all duration-300 relative overflow-hidden",
                                                    hasLessons
                                                        ? "glass-panel dark:hover:bg-white/[0.04] hover:bg-black/[0.02] hover:-translate-y-2 hover:shadow-2xl active:scale-[0.98]"
                                                        : "border border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] opacity-60 cursor-not-allowed saturate-50 hover:bg-transparent"
                                                )}
                                            >
                                                {/* Decorative gradient blob */}
                                                {hasLessons && (
                                                    <div className={cn(
                                                        "absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br rounded-full blur-[50px] opacity-10 dark:opacity-20 pointer-events-none transition-opacity duration-500 group-hover:opacity-40 dark:group-hover:opacity-60",
                                                        category.color
                                                    )} />
                                                )}

                                                <div className={cn(
                                                    "w-20 h-20 md:w-24 md:h-24 rounded-[24px] bg-gradient-to-br flex items-center justify-center text-4xl md:text-5xl shadow-xl shadow-black/10 shrink-0 relative z-10 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3",
                                                    category.color
                                                )}>
                                                    <div className="absolute inset-0 bg-white/20 dark:bg-black/20 rounded-[24px] mix-blend-overlay"></div>
                                                    <div className="drop-shadow-md">{course.icon}</div>
                                                </div>

                                                <div className="flex-1 w-full relative z-10">
                                                    <h3 className="font-black text-2xl md:text-3xl leading-tight mb-2 tracking-tight text-foreground">{course.nameHe}</h3>
                                                    <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium line-clamp-2 mb-3">{course.description}</p>
                                                    <p className="text-sm md:text-base font-medium text-zinc-500 dark:text-zinc-400">
                                                        {hasLessons
                                                            ? `${lessonsCount} / ${completedInCourse.length} שיעורים`
                                                            : "בקרוב"}
                                                    </p>
                                                </div>

                                                {course.id === "how-llms-work" && completedInCourse.length === 0 && (
                                                    <m.div
                                                        initial={{ opacity: 0, scale: 0.8, y: -10 }}
                                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                                        className="absolute top-6 left-6 z-20"
                                                    >
                                                        <m.div
                                                            animate={{ 
                                                                scale: [1, 1.05, 1],
                                                                boxShadow: [
                                                                    "0 0 10px rgba(37,99,235,0.2)",
                                                                    "0 0 20px rgba(37,99,235,0.5)",
                                                                    "0 0 10px rgba(37,99,235,0.2)",
                                                                ]
                                                            }}
                                                            transition={{
                                                                duration: 2,
                                                                repeat: Infinity,
                                                                ease: "easeInOut"
                                                            }}
                                                            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] md:text-xs font-black px-3 py-1.5 rounded-full border border-white/20 flex items-center gap-1.5 pointer-events-none"
                                                        >
                                                            <span className="relative flex h-2 w-2">
                                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                                                            </span>
                                                            <span>התחל כאן!</span>
                                                        </m.div>
                                                    </m.div>
                                                )}

                                                {course.isLocked && !isCompleted && (
                                                    <div className="absolute top-4 left-4 z-10">
                                                        <Lock className="w-5 h-5 text-zinc-500" />
                                                    </div>
                                                )}

                                                {hasLessons && (
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
                        </section>
                    );
                })}
            </div>
        </div>
    );
}

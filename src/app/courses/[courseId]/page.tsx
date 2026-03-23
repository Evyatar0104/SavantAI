"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter, notFound } from "next/navigation";
import { useEffect } from "react";
import { COURSES, LESSONS, CATEGORIES } from "@/data/lessons";
import { ArrowLeft, Clock, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSavantStore } from "@/store/useSavantStore";
import { m } from "framer-motion";

export default function CoursePage() {
    const params = useParams();
    const router = useRouter();
    const courseId = params.courseId as string;
    const course = COURSES.find((c) => c.id === courseId);
    const quizCompleted = useSavantStore((s: any) => s.quizCompleted);

    // Quiz gate: redirect to quiz if foundation course and quiz not done
    useEffect(() => {
        if (courseId === "how-llms-work" && !quizCompleted) {
            router.replace("/quiz");
        }
    }, [courseId, quizCompleted, router]);

    const completedLessons = useSavantStore((state: any) => state.completedLessons);

    if (!course) {
        return notFound();
    }

    if (courseId === "how-llms-work" && !quizCompleted) {
        return null;
    }

    const category = CATEGORIES.find((cat) => cat.id === course.categoryId);
    const courseLessons = LESSONS.filter(l => l.courseId === courseId).sort((a, b) => a.order - b.order);

    const nextLesson = courseLessons.find(l => !completedLessons.includes(l.id)) || courseLessons[0];

    const groupColors = [
        "bg-blue-500/10 text-blue-400",
        "bg-purple-500/10 text-purple-400",
        "bg-green-500/10 text-green-400",
        "bg-orange-500/10 text-orange-400",
        "bg-pink-500/10 text-pink-400",
    ];

    const hebrewSuffixes = ["א׳", "ב׳", "ג׳", "ד׳", "ה׳", "ו׳", "ז׳", "ח׳", "ט׳", "י׳"];
    
    type GroupedLessons = { title: string; lessons: typeof courseLessons; color: string; };
    const groupedLessons: GroupedLessons[] = [];

    const splitIntoGroups = (title: string, lessons: typeof courseLessons, color: string): GroupedLessons[] => {
        if (lessons.length <= 5) return [{ title, lessons, color }];
        
        const result: GroupedLessons[] = [];
        for (let i = 0; i < lessons.length; i += 5) {
            const chunk = lessons.slice(i, i + 5);
            const suffix = hebrewSuffixes[Math.floor(i / 5)] || (Math.floor(i / 5) + 1).toString();
            result.push({
                title: `${title} ${suffix}`,
                lessons: chunk,
                color: color
            });
        }
        return result;
    };
    
    if (courseId === "how-llms-work") {
        groupedLessons.push(...splitIntoGroups("הבסיס", courseLessons.filter(l => l.order >= 1 && l.order <= 3), groupColors[0]));
        groupedLessons.push(...splitIntoGroups("טכניקות", courseLessons.filter(l => l.order >= 4 && l.order <= 6), groupColors[1]));

        const group3 = courseLessons.filter(l => l.order >= 7);
        if (group3.length > 0) {
            groupedLessons.push(...splitIntoGroups("מתקדם", group3, groupColors[2]));
        }
    } else {
        for (let i = 0; i < courseLessons.length; i += 5) {
            const idx = Math.floor(i / 5);
            const suffix = hebrewSuffixes[idx] || (idx + 1).toString();
            groupedLessons.push({
                title: `חלק ${suffix}`,
                lessons: courseLessons.slice(i, i + 5),
                color: groupColors[idx % groupColors.length]
            });
        }
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="p-6 md:p-10 flex flex-col pt-12 md:pt-16 max-w-5xl mx-auto w-full min-h-[100dvh]">
            <Link href="/tracks" className="flex items-center text-zinc-500 hover:text-white mb-8 transition-colors group">
                <ArrowLeft className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1 rotate-180" /> חזרה למסלולים
            </Link>

            <div className="flex flex-col md:flex-row gap-8 md:items-end mb-16">
                <div className={cn(
                    "w-32 h-32 md:w-48 md:h-48 bg-gradient-to-br flex items-center justify-center text-6xl md:text-8xl shadow-2xl shrink-0 border border-white/5 overflow-hidden squarcle",
                    category?.color
                )}>
                    {course.image ? (
                        <div className="w-full h-full p-8 flex items-center justify-center">
                            {course.id === "course-notebooklm" ? (
                                <div className="w-full h-full squarcle bg-white overflow-hidden flex items-center justify-center">
                                    <Image src={course.image} alt={course.nameHe} width={192} height={192} className="w-full h-full object-contain p-4" priority />
                                </div>
                            ) : (
                                <Image src={course.image} alt={course.nameHe} width={192} height={192} className="w-full h-full object-contain" priority />
                            )}
                        </div>
                    ) : (
                        course.icon
                    )}
                </div>
                <div className="flex-1 space-y-4">
                    <span className="text-sm font-bold uppercase tracking-widest text-zinc-500">{category?.nameHe}</span>
                    <h1 className="text-4xl md:text-6xl font-serif italic font-bold leading-tight">{course.nameHe}</h1>
                    <p className="text-zinc-400 text-lg">{course.description}</p>
                    <div className="flex flex-wrap gap-4 pt-4">
                        <div className="glass-panel px-4 py-2 rounded-full flex items-center text-sm font-semibold text-zinc-200">
                            <Clock className="w-4 h-4 ml-2 text-blue-400" /> {courseLessons.length * 3} דקות סה&quot;כ
                        </div>
                        <div className="glass-panel px-4 py-2 rounded-full flex items-center text-sm font-semibold text-zinc-200">
                            <Target className="w-4 h-4 ml-2 text-green-400" /> {courseLessons.length} שיעורים
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

            <m.div 
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="flex flex-col pb-32"
            >
                {groupedLessons.map((group, groupIdx) => {
                    const groupCompletedCount = group.lessons.filter(l => completedLessons.includes(l.id)).length;
                    
                    return (
                        <div key={groupIdx} className="flex flex-col mb-4">
                            {/* Section Header */}
                            <m.div variants={itemVariants} className="flex items-center mt-[20px] mb-[10px]">
                                <span className="text-[12px] font-medium text-zinc-500 ml-4 whitespace-nowrap">
                                    {group.title}
                                </span>
                                <div className="flex-1 h-px bg-white/10" />
                                <div className="mr-4 px-2 py-0.5 rounded-full border border-white/10 text-[10px] font-medium text-zinc-500 whitespace-nowrap">
                                    {group.lessons.length} / {groupCompletedCount} שיעורים
                                </div>
                            </m.div>
                            
                            {/* Lesson Cards */}
                            <div className="flex flex-col gap-2">
                                {group.lessons.map((lesson) => {
                                    const isCompleted = completedLessons.includes(lesson.id);
                                    const isLocked = lesson.title.includes("(בקרוב)");

                                    const cardContent = (
                                        <m.div 
                                            variants={itemVariants}
                                            className={cn(
                                                "flex items-center p-4 rounded-2xl bg-[#111118] border transition-all relative",
                                                isLocked ? "opacity-40 cursor-default border-[#1E1E2E]" : "border-[#1E1E2E] hover:border-white/10 hover:bg-[#1A1A24]"
                                            )}
                                        >
                                            <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ml-4 text-[18px]", group.color)}>
                                                {lesson.icon || "📄"}
                                            </div>
                                            <div className="flex-1 text-[14px] font-medium text-white">
                                                {lesson.title}
                                            </div>
                                            <div className="mr-4">
                                                {isCompleted ? (
                                                    <div className="w-5 h-5 rounded-full bg-[#00C48C] flex items-center justify-center">
                                                    </div>
                                                ) : (
                                                    <div className="w-5 h-5 rounded-full border-2 border-zinc-700" />
                                                )}
                                            </div>
                                        </m.div>
                                    );

                                    if (isLocked) {
                                        return <div key={lesson.id}>{cardContent}</div>;
                                    }

                                    return (
                                        <Link href={`/lesson/${lesson.id}`} key={lesson.id} className="block group">
                                            {cardContent}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </m.div>
        </div>
    );
}

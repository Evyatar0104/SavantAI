"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter, notFound, useSearchParams } from "next/navigation";
import { useEffect, useState, useMemo, Suspense } from "react";
import { COURSES, CATEGORIES, LESSON_INDEX, loadCourseLessons } from "@/content";
import { ArrowLeft, Clock, Target, Sparkles, ChevronRight } from "lucide-react";
import { haptics } from "@/lib/haptics";
import { cn } from "@/lib/utils";
import { useSavantStore } from "@/store/useSavantStore";
import { m, AnimatePresence } from "framer-motion";
import { CoursePracticeSheet } from "@/components/CoursePracticeSheet";
import { CourseLessonCard } from "@/components/course/CourseLessonCard";
import { QuizPromptDialog } from "@/components/QuizPromptDialog";

function CoursePageContent() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const from = searchParams.get('from');
    const courseId = params.courseId as string;
    const course = COURSES.find((c) => c.id === courseId);
    const quizCompleted = useSavantStore(s => s.quizCompleted);
    const hasSeenQuizPrompt = useSavantStore(s => s.hasSeenQuizPrompt);
    const setHasSeenQuizPrompt = useSavantStore(s => s.setHasSeenQuizPrompt);
    const hasHydrated = useSavantStore(s => s._hasHydrated);
    const completedLessons = useSavantStore(state => state.completedLessons);
    
    const [isPracticeOpen, setIsPracticeOpen] = useState(false);
    const [hasPractice, setHasPractice] = useState(false);
    const [isQuizPromptOpen, setIsQuizPromptOpen] = useState(false);

    // Show quiz prompt if first time visiting the first course and quiz not completed
    useEffect(() => {
        if (hasHydrated && courseId === "how-llms-work" && !quizCompleted && !hasSeenQuizPrompt) {
            const timer = setTimeout(() => {
                setIsQuizPromptOpen(true);
                setHasSeenQuizPrompt(true);
            }, 800);
            return () => clearTimeout(timer);
        }
    }, [hasHydrated, courseId, quizCompleted, hasSeenQuizPrompt, setHasSeenQuizPrompt]);

    const courseScrollPositions = useSavantStore(state => state.courseScrollPositions);
    const setCourseScrollPosition = useSavantStore(state => state.setCourseScrollPosition);

    const [isRestored, setIsRestored] = useState(() => {
        // If we're on client and pos is 0, we're already restored
        if (typeof window !== 'undefined') {
            const pos = useSavantStore.getState().courseScrollPositions[courseId] || 0;
            return pos === 0;
        }
        return false;
    });

    // Scroll Restoration
    useEffect(() => {
        if (!hasHydrated || isRestored) return;

        const mainElement = document.querySelector('main');
        if (mainElement) {
            const pos = courseScrollPositions[courseId] || 0;
            if (pos > 0) {
                const restore = () => {
                    mainElement.scrollTo({ top: pos });
                    setIsRestored(true);
                };

                restore();
                const timers = [
                    setTimeout(restore, 20),
                    setTimeout(restore, 100),
                    setTimeout(restore, 300),
                ];
                return () => timers.forEach(clearTimeout);
            } else {
                // If pos is 0, we're technically already "restored" to 0
                setIsRestored(true);
            }
        }
    }, [courseId, hasHydrated, isRestored, courseScrollPositions]);

    // Scroll Capture
    useEffect(() => {
        const mainElement = document.querySelector('main');
        if (!mainElement || !isRestored) return;

        let frameId: number;
        const handleScroll = () => {
            cancelAnimationFrame(frameId);
            frameId = requestAnimationFrame(() => {
                const currentPos = mainElement.scrollTop;
                const pos = courseScrollPositions[courseId] || 0;
                if (currentPos > 0 || (currentPos === 0 && pos < 100)) {
                    setCourseScrollPosition(courseId, currentPos);
                }
            });
        };

        mainElement.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            mainElement.removeEventListener('scroll', handleScroll);
            cancelAnimationFrame(frameId);
        };
    }, [courseId, setCourseScrollPosition, isRestored, courseScrollPositions]);

    useEffect(() => {
        loadCourseLessons(courseId).then(lessons => {
            if (Array.isArray(lessons)) {
                setHasPractice(lessons.some(l => l?.practicalCall));
            }
        });
    }, [courseId]);

    const handleBack = () => {
        haptics.tap();
        if (from === 'home') router.push('/');
        else if (from === 'tracks') router.push('/tracks');
        else router.back();
    };

    const category = CATEGORIES.find((cat) => cat.id === course?.categoryId);
    const courseLessons = useMemo(() => 
        LESSON_INDEX.filter(l => l.courseId === courseId).sort((a, b) => a.order - b.order),
    [courseId]);
    
    const nextLesson = useMemo(() => 
        courseLessons.find(l => !completedLessons.includes(l.id)) || courseLessons[0],
    [courseLessons, completedLessons]);

    const gridColor = useMemo(() => {
        if (!category) return "139, 92, 246"; // Default purple
        if (category.id === "foundation") return "168, 85, 247"; // Purple
        if (category.id === "tools") return "59, 130, 246"; // Blue
        if (category.id === "real-life") return "16, 185, 129"; // Emerald
        if (category.id === "professional") return "249, 115, 22"; // Orange
        if (category.id === "advanced") return "245, 158, 11"; // Amber
        return "139, 92, 246";
    }, [category]);

    const groupedLessons = useMemo(() => {
        const groupColors = [
            "bg-blue-500/20 text-blue-400",
            "bg-purple-500/20 text-purple-400",
            "bg-emerald-500/20 text-emerald-400",
            "bg-orange-500/20 text-orange-400",
            "bg-rose-500/20 text-rose-400",
        ];

        const hebrewSuffixes = ["א׳", "ב׳", "ג׳", "ד׳", "ה׳", "ו׳", "ז׳", "ח׳", "ט׳", "י׳"];

        const groups: { title: string; lessons: typeof courseLessons; color: string; }[] = [];
        
        if (courseId === "how-llms-work") {
            const base = courseLessons.filter(l => l.order <= 3);
            const techniques = courseLessons.filter(l => l.order >= 4 && l.order <= 6);
            const advanced = courseLessons.filter(l => l.order >= 7);
            
            if (base.length) groups.push({ title: "הבסיס", lessons: base, color: groupColors[0] });
            if (techniques.length) groups.push({ title: "טכניקות", lessons: techniques, color: groupColors[1] });
            if (advanced.length) groups.push({ title: "מתקדם", lessons: advanced, color: groupColors[2] });
        } else {
            for (let i = 0; i < courseLessons.length; i += 5) {
                const idx = Math.floor(i / 5);
                groups.push({
                    title: `חלק ${hebrewSuffixes[idx] || (idx + 1)}`,
                    lessons: courseLessons.slice(i, i + 5),
                    color: groupColors[idx % groupColors.length]
                });
            }
        }
        return groups;
    }, [courseLessons, courseId]);

    if (!course) return notFound();
    
    // Prevent flash while hydrating
    if (!hasHydrated) return (
        <div className="min-h-screen bg-[#050508] flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
    );

    return (
        <m.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="relative min-h-[100dvh] bg-[#050508] text-white overflow-x-hidden" 
            dir="rtl"
        >
            {/* Mesh Background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className={cn(
                    "absolute -top-[20%] w-[140%] md:w-[70%] h-[60%] rounded-full blur-[120px] bg-gradient-to-br opacity-[0.2] transition-all duration-1000",
                    "left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:-right-[10%]",
                    category?.color
                )} />
                <div className="absolute top-[20%] -left-[20%] md:-left-[10%] w-[70%] md:w-[50%] h-[50%] rounded-full blur-[100px] bg-blue-500/10 opacity-30" />
                
                {/* Lowkey Dynamic Grid */}
                <div 
                    className="absolute inset-0 opacity-[0.15]"
                    style={{
                        backgroundImage: `
                            linear-gradient(rgba(${gridColor}, 0.5) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(${gridColor}, 0.5) 1px, transparent 1px)
                        `,
                        backgroundSize: "64px 64px",
                        backgroundPosition: "center",
                        maskImage: "linear-gradient(to bottom, black 10%, transparent 85%)",
                        WebkitMaskImage: "linear-gradient(to bottom, black 10%, transparent 85%)",
                    }}
                />
                
                {/* Animated Perspective Grid (Responsive Origin) */}
                {/* Static wrapper handles the heavy perspective/scale transform so the GPU layer is promoted once */}
                <div
                    className="absolute inset-0 origin-top md:origin-top-right pointer-events-none"
                    style={{
                        transform: "perspective(1000px) rotateX(55deg) scale(2.5) translateY(-5%)",
                        willChange: "transform",
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                    }}
                >
                    <m.div 
                        initial={{ opacity: 0.06 }}
                        animate={{ 
                            opacity: [0.06, 0.12, 0.06],
                        }}
                        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute inset-0"
                        style={{
                            backgroundImage: `
                                linear-gradient(rgba(${gridColor}, 0.4) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(${gridColor}, 0.4) 1px, transparent 1px)
                            `,
                            backgroundSize: "120px 120px",
                            backgroundPosition: "center",
                            willChange: "opacity",
                        }}
                    />
                </div>
            </div>

            <div className="relative z-10 p-6 md:p-10 pt-12 md:pt-16 max-w-5xl mx-auto w-full">
                {/* Back Link */}
                <m.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                    <button 
                        onClick={handleBack}
                        className="inline-flex items-center text-zinc-500 hover:text-white mb-10 transition-all group font-bold text-sm cursor-pointer"
                    >
                        <ArrowLeft className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" /> חזרה
                    </button>
                </m.div>

                {/* Hero Header */}
                <div className="flex flex-col lg:flex-row gap-10 items-center lg:items-end mb-20">
                    <m.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className={cn(
                            "w-40 h-40 md:w-56 md:h-56 flex items-center justify-center text-7xl md:text-9xl shadow-2xl shrink-0 relative group squarcle bg-gradient-to-br",
                            category?.color
                        )}
                    >
                        <div className="absolute inset-0 bg-white/10 mix-blend-overlay" />
                        <div className="drop-shadow-2xl relative z-10 w-full h-full flex items-center justify-center">
                            {course.image ? (
                                <div className="w-full h-full p-10 flex items-center justify-center">
                                    {course.id === "course-notebooklm" ? (
                                        <div className="w-full h-full squarcle bg-white overflow-hidden flex items-center justify-center">
                                            <Image src={course.image} alt={course.nameHe} width={256} height={256} className="w-full h-full object-contain p-4" priority />
                                        </div>
                                    ) : (
                                        <Image 
                                            src={course.image} 
                                            alt={course.nameHe} 
                                            width={256} 
                                            height={256} 
                                            className={cn(
                                                "w-full h-full object-contain",
                                                (course.id === "grok-mastery" || course.id === "course-perplexity") && "brightness-0 invert"
                                            )} 
                                            priority 
                                        />
                                    )}
                                </div>
                            ) : (
                                <span className="relative z-10">{course.icon}</span>
                            )}
                        </div>
                    </m.div>

                    <div className="flex-1 text-center lg:text-right space-y-4">
                        <m.span 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                            className="text-xs md:text-sm font-black uppercase tracking-[0.2em] text-zinc-500 block"
                        >
                            {category?.nameHe}
                        </m.span>
                        <m.h1 
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                            className="text-5xl md:text-7xl font-serif font-bold leading-tight tracking-tighter"
                        >
                            {course.nameHe}
                        </m.h1>
                        <m.p 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                            className="text-zinc-400 text-lg md:text-xl max-w-2xl font-medium leading-relaxed mx-auto lg:mx-0"
                        >
                            {course.description}
                        </m.p>
                        
                        <m.div 
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                            className="flex flex-wrap justify-center lg:justify-start gap-3 pt-4"
                        >
                            <div className="bg-white/5 border border-white/10 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center text-xs font-black text-zinc-300">
                                <Clock className="w-3.5 h-3.5 ml-2 text-blue-400" /> {courseLessons.length * 3} דק׳ קריאה
                            </div>
                            <div className="bg-white/5 border border-white/10 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center text-xs font-black text-zinc-300">
                                <Target className="w-3.5 h-3.5 ml-2 text-emerald-400" /> {courseLessons.length} פרקים
                            </div>
                            {hasPractice && (
                                <m.button
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ 
                                        opacity: 1, 
                                        scale: [1, 1.02, 1],
                                        boxShadow: [
                                            "0 0 0px rgba(168, 85, 247, 0)",
                                            "0 0 20px rgba(168, 85, 247, 0.4)",
                                            "0 0 0px rgba(168, 85, 247, 0)"
                                        ]
                                    }}
                                    transition={{
                                        opacity: { delay: 0.5 },
                                        scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                                        boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                                    }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => { setIsPracticeOpen(true); haptics.tap(); }}
                                    className="bg-purple-500/10 border border-purple-500/30 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center text-xs font-black text-purple-200 hover:bg-purple-500/20 transition-all cursor-pointer"
                                >
                                    <Sparkles className="w-3.5 h-3.5 ml-2 text-purple-400" /> תרגול מעשי
                                </m.button>
                            )}                        </m.div>
                    </div>

                    <m.div 
                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 }}
                        className="w-full lg:w-auto"
                    >
                        <Link href={`/lesson/${nextLesson.id}?from=course`} className="block group">
                            <button className="w-full lg:w-auto px-10 py-5 bg-white text-black font-black text-xl rounded-[24px] hover:bg-zinc-200 transition-all shadow-[0_20px_40px_rgba(255,255,255,0.15)] group-hover:shadow-[0_25px_50px_rgba(255,255,255,0.2)] group-active:scale-95 flex items-center justify-center gap-3">
                                {completedLessons.includes(nextLesson.id) ? "חזור על החומר" : "המשך למידה"}
                                <ChevronRight className="w-6 h-6 rotate-180 group-hover:-translate-x-1 transition-transform" />
                            </button>
                        </Link>
                    </m.div>
                </div>

                <CoursePracticeSheet courseId={courseId} courseName={course.nameHe} isOpen={isPracticeOpen} onClose={() => setIsPracticeOpen(false)} />

                {/* Lessons List */}
                <m.div 
                    initial="hidden" animate="show"
                    variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.7 } } }}
                    className="flex flex-col pb-40 space-y-10"
                >
                    {groupedLessons.map((group, groupIdx) => {
                        const groupCompletedCount = group.lessons.filter(l => completedLessons.includes(l.id)).length;
                        const isGroupActive = group.lessons.some(l => l.id === nextLesson.id);

                        return (
                            <div key={groupIdx} className="relative">
                                {/* Section Header */}
                                <m.div 
                                    variants={{ hidden: { opacity: 0, x: 20 }, show: { opacity: 1, x: 0 } }}
                                    className="flex items-center mb-6"
                                >
                                    <div className={cn("w-2 h-8 rounded-full ml-4 shadow-lg", isGroupActive ? "bg-white" : "bg-zinc-800")} />
                                    <div className="flex flex-col">
                                        <h3 className={cn("text-xl md:text-2xl font-serif font-bold", isGroupActive ? "text-white" : "text-zinc-500")}>
                                            {group.title}
                                        </h3>
                                        <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">
                                            {groupCompletedCount} מתוך {group.lessons.length} הושלמו
                                        </span>
                                    </div>
                                    <div className="flex-1 h-px bg-gradient-to-l from-white/10 to-transparent mr-6" />
                                </m.div>
                                
                                {/* Lesson Cards Grid */}
                                <div className="grid grid-cols-1 gap-3">
                                    {group.lessons.map((lesson, lessonIdx) => {
                                        const isCompleted = completedLessons.includes(lesson.id);
                                        const isActive = lesson.id === nextLesson.id;
                                        const isLocked = lesson.title.includes("(בקרוב)");

                                        return (
                                            <CourseLessonCard 
                                                key={lesson.id}
                                                lesson={lesson}
                                                isCompleted={isCompleted}
                                                isActive={isActive}
                                                isLocked={isLocked}
                                                colorClass={group.color}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </m.div>
            </div>

            <QuizPromptDialog 
                isOpen={isQuizPromptOpen}
                onClose={() => setIsQuizPromptOpen(false)}
                onQuiz={() => {
                    setIsQuizPromptOpen(false);
                    router.push("/quiz");
                }}
                onContinue={() => {
                    setIsQuizPromptOpen(false);
                    haptics.tap();
                }}
            />
        </m.div>
    );
}

export default function CoursePage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#050508] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            </div>
        }>
            <CoursePageContent />
        </Suspense>
    );
}

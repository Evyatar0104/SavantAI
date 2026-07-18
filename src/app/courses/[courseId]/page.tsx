"use client";

import { Suspense, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { notFound, useParams, useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, BookOpen, Check, Clock3, Lock, Sparkles, Target } from "lucide-react";
import { m } from "framer-motion";
import { CATEGORIES, COURSES, LESSON_INDEX } from "@/content";
import { CourseLessonCard } from "@/components/course/CourseLessonCard";
import { GlassCard, IconButton, PageShell, ProgressBar, StatusChip } from "@/components/ui/Primitives";
import { isCourseUnlocked, getCoursePrerequisiteName } from "@/lib/courseUnlock";
import { haptics } from "@/lib/haptics";
import { cn } from "@/lib/utils";
import { useScrollRestoration } from "@/hooks/useScrollRestoration";
import { useSavantStore } from "@/store/useSavantStore";

const CoursePracticeSheet = dynamic(() => import("@/components/CoursePracticeSheet").then((module) => module.CoursePracticeSheet), { ssr: false });
const QuizPromptDialog = dynamic(() => import("@/components/QuizPromptDialog").then((module) => module.QuizPromptDialog), { ssr: false });

function CoursePageContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = params.courseId as string;
  const from = searchParams.get("from");
  const course = COURSES.find((item) => item.id === courseId);
  const completedLessons = useSavantStore((state) => state.completedLessons);
  const completedCourses = useSavantStore((state) => state.completedCourses);
  const quizCompleted = useSavantStore((state) => state.quizCompleted);
  const hasSeenQuizPrompt = useSavantStore((state) => state.hasSeenQuizPrompt);
  const setHasSeenQuizPrompt = useSavantStore((state) => state.setHasSeenQuizPrompt);
  const hasHydrated = useSavantStore((state) => state._hasHydrated);
  const courseScrollPositions = useSavantStore((state) => state.courseScrollPositions);
  const setCourseScrollPosition = useSavantStore((state) => state.setCourseScrollPosition);
  const [isPracticeOpen, setIsPracticeOpen] = useState(false);
  const [isQuizPromptOpen, setIsQuizPromptOpen] = useState(false);

  useScrollRestoration(courseScrollPositions[courseId] || 0, (position) => setCourseScrollPosition(courseId, position), hasHydrated, "main", courseId);

  useEffect(() => {
    if (hasHydrated && courseId === "how-llms-work" && !quizCompleted && !hasSeenQuizPrompt) {
      const timer = window.setTimeout(() => {
        setIsQuizPromptOpen(true);
        setHasSeenQuizPrompt(true);
      }, 800);
      return () => window.clearTimeout(timer);
    }
  }, [courseId, hasHydrated, hasSeenQuizPrompt, quizCompleted, setHasSeenQuizPrompt]);

  if (!course) return notFound();

  const category = CATEGORIES.find((item) => item.id === course.categoryId);
  const courseLessons = LESSON_INDEX.filter((lesson) => lesson.courseId === courseId).sort((a, b) => a.order - b.order);
  const completedCount = courseLessons.filter((lesson) => completedLessons.includes(lesson.id)).length;
  const progress = courseLessons.length ? (completedCount / courseLessons.length) * 100 : 0;
  const nextLesson = courseLessons.find((lesson) => !completedLessons.includes(lesson.id)) ?? courseLessons[0];
  const unlocked = isCourseUnlocked(courseId, completedCourses);
  const prerequisite = getCoursePrerequisiteName(courseId);
  const groups = Array.from({ length: Math.ceil(courseLessons.length / 5) }, (_, index) => ({ title: index === 0 ? "מתחילים כאן" : `חלק ${index + 1}`, lessons: courseLessons.slice(index * 5, index * 5 + 5) }));

  const handleExit = () => {
    haptics.tap();
    router.push(from === "home" ? "/" : "/courses?tab=all");
  };

  if (!hasHydrated) return <PageShell><GlassCard className="min-h-72 animate-pulse motion-reduce:animate-none" /></PageShell>;

  if (!unlocked) {
    return (
      <PageShell width="content" className="min-h-[80dvh]">
        <div className="mb-6"><IconButton label="חזרה לקורסים" onClick={handleExit}><ArrowRight className="size-5" /></IconButton></div>
        <GlassCard level="strong" className="mx-auto flex max-w-2xl flex-col items-center py-14 text-center">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-amber-400/10 text-amber-300"><Lock className="size-7" /></div>
          <h1 className="mt-6 text-3xl font-black text-white">הקורס עדיין נעול</h1>
          <p className="mt-3 max-w-lg leading-7 text-zinc-400">כדי לפתוח את „{course.nameHe}”, צריך להשלים קודם את „{prerequisite}”.</p>
          <button onClick={handleExit} className="mt-8 min-h-12 rounded-2xl bg-white px-6 text-sm font-black text-[#0d0f1a]">חזרה לכל הקורסים</button>
        </GlassCard>
      </PageShell>
    );
  }

  return (
    <div dir="rtl" className="relative min-h-[100dvh] overflow-x-hidden bg-[#0d0f1a] text-white">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_80%_50%_at_80%_-10%,rgba(83,74,183,0.22),transparent_66%)]" />
      <PageShell className="relative z-10">
        <div className="mb-6 flex items-center justify-between gap-4">
          <IconButton label="חזרה" onClick={handleExit}><ArrowRight className="size-5" /></IconButton>
          <StatusChip tone={progress === 100 ? "success" : "accent"}>{progress === 100 ? <><Check className="size-3.5" /> הושלם</> : `${completedCount}/${courseLessons.length} שיעורים`}</StatusChip>
        </div>

        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_340px] xl:items-start">
          <main className="order-2 min-w-0 space-y-8 xl:order-1">
            <m.header initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 sm:p-8" style={{ willChange: "transform" }}>
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                <div className={cn("flex size-24 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br text-5xl shadow-xl", category?.color)}>
                  {course.image ? <Image src={course.image} alt={course.nameHe} width={72} height={72} priority className={cn("size-16 object-contain", (course.id === "grok-mastery" || course.id === "course-perplexity") && "brightness-0 invert")} /> : course.icon}
                </div>
                <div className="min-w-0"><p className="text-xs font-bold text-violet-300">{category?.nameHe}</p><h1 className="mt-2 text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">{course.nameHe}</h1><p className="mt-3 max-w-3xl text-base leading-7 text-zinc-400">{course.description}</p></div>
              </div>
            </m.header>

            <section aria-labelledby="lessons-heading" className="space-y-8">
              <div><h2 id="lessons-heading" className="text-2xl font-black">תוכנית הקורס</h2><p className="mt-1 text-sm text-zinc-500">השיעורים נפתחים לפי הסדר כדי לשמור על רצף ברור.</p></div>
              {groups.map((group, groupIndex) => (
                <div key={group.title} className="content-auto space-y-3">
                  <div className="flex items-center gap-3"><span className="flex size-8 items-center justify-center rounded-xl bg-white/[0.06] text-xs font-black text-zinc-300">{groupIndex + 1}</span><h3 className="font-black text-white">{group.title}</h3><div className="h-px flex-1 bg-white/[0.07]" /></div>
                  <div className="grid gap-3">
                    {group.lessons.map((lesson) => {
                      const isCompleted = completedLessons.includes(lesson.id);
                      const isActive = lesson.id === nextLesson?.id;
                      const isLocked = !isCompleted && Boolean(nextLesson) && lesson.order > nextLesson.order;
                      return <CourseLessonCard key={lesson.id} lesson={lesson} isCompleted={isCompleted} isActive={isActive} isLocked={isLocked} colorClass="bg-violet-500/15 text-violet-200" />;
                    })}
                  </div>
                </div>
              ))}
            </section>
          </main>

          <aside className="order-1 xl:order-2 xl:sticky xl:top-6">
            <GlassCard level="strong" className="space-y-6">
              <div><p className="text-xs font-bold text-zinc-500">התקדמות בקורס</p><p className="mt-1 text-3xl font-black text-white">{Math.round(progress)}%</p></div>
              <ProgressBar value={progress} accent={progress === 100 ? "#10b981" : "#534AB7"} />
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white/[0.04] p-4"><Clock3 className="size-4 text-violet-300" /><p className="mt-3 text-lg font-black">{courseLessons.length * 3}</p><p className="text-xs text-zinc-500">דקות</p></div>
                <div className="rounded-2xl bg-white/[0.04] p-4"><Target className="size-4 text-emerald-300" /><p className="mt-3 text-lg font-black">{courseLessons.length}</p><p className="text-xs text-zinc-500">שיעורים</p></div>
              </div>
              {nextLesson && <Link href={`/lesson/${nextLesson.id}?from=course`} onClick={() => haptics.tap()} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 text-sm font-black text-[#0d0f1a]">{progress === 100 ? "חזרה לשיעור הראשון" : completedCount > 0 ? "המשך למידה" : "התחל את הקורס"}<BookOpen className="size-4" /></Link>}
              <m.button whileTap={{ scale: 0.98 }} onClick={() => { haptics.tap(); setIsPracticeOpen(true); }} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border border-violet-400/25 bg-violet-400/10 px-5 text-sm font-black text-violet-200" style={{ willChange: "transform" }}><Sparkles className="size-4" />תרגול הקורס</m.button>
            </GlassCard>
          </aside>
        </div>
      </PageShell>

      {isPracticeOpen && <CoursePracticeSheet courseId={courseId} courseName={course.nameHe} isOpen={isPracticeOpen} onClose={() => setIsPracticeOpen(false)} />}
      {isQuizPromptOpen && <QuizPromptDialog isOpen={isQuizPromptOpen} onClose={() => setIsQuizPromptOpen(false)} onQuiz={() => { setIsQuizPromptOpen(false); router.push("/quiz"); }} onContinue={() => { haptics.tap(); setIsQuizPromptOpen(false); }} />}
    </div>
  );
}

export default function CoursePage() {
  return <Suspense fallback={<PageShell><GlassCard className="min-h-72 animate-pulse motion-reduce:animate-none" /></PageShell>}><CoursePageContent /></Suspense>;
}
"use client";

import { Suspense, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, BookOpen, Check, Lock, Search, Sparkles } from "lucide-react";
import { m } from "framer-motion";
import { CATEGORIES, COURSES, LESSON_INDEX, type Category, type Course } from "@/content";
import { learningPaths } from "@/data/learningPaths";
import { getCoursePrerequisiteName, isCourseUnlocked } from "@/lib/courseUnlock";
import { haptics } from "@/lib/haptics";
import { entranceVariants, staggerContainerVariants } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { useSavantStore } from "@/store/useSavantStore";
import { EmptyState, GlassCard, PageHeader, PageShell, ProgressBar, SectionHeader, StatusChip } from "@/components/ui/Primitives";

type CourseStatus = "all" | "available" | "completed" | "locked";

function CourseIcon({ course, size = 44 }: { course: Course; size?: number }) {
  if (!course.image) return <span className="text-3xl" aria-hidden="true">{course.icon}</span>;
  return <Image src={course.image} alt="" width={size} height={size} className={cn("size-10 object-contain", (course.id === "grok-mastery" || course.id === "course-perplexity") && "brightness-0 invert")} />;
}

function CourseCard({ course, category, completedLessons, completedCourses }: { course: Course; category: Category; completedLessons: string[]; completedCourses: string[] }) {
  const lessons = LESSON_INDEX.filter((lesson) => lesson.courseId === course.id);
  const completedCount = lessons.filter((lesson) => completedLessons.includes(lesson.id)).length;
  const unlocked = isCourseUnlocked(course.id, completedCourses);
  const completed = lessons.length > 0 && completedCount === lessons.length;
  const progress = lessons.length ? (completedCount / lessons.length) * 100 : 0;
  const prerequisite = getCoursePrerequisiteName(course.id);

  return (
    <Link
      href={unlocked ? `/courses/${course.id}?from=courses` : "#"}
      aria-disabled={!unlocked}
      onClick={(event) => {
        if (!unlocked) event.preventDefault();
        unlocked ? haptics.tap() : haptics.error();
      }}
      className="block h-full"
    >
      <m.article
        variants={entranceVariants}
        whileHover={unlocked ? { y: -3 } : undefined}
        whileTap={unlocked ? { scale: 0.99 } : undefined}
        className={cn("interactive-surface content-auto flex h-full min-h-72 flex-col rounded-2xl border border-white/10 bg-white/[0.045] p-5 sm:p-6", !unlocked && "opacity-55")}
        style={{ willChange: unlocked ? "transform" : "auto" }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className={cn("flex size-14 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br shadow-lg", category.color)}>
            <CourseIcon course={course} />
          </div>
          {completed ? <StatusChip tone="success"><Check className="size-3.5" /> הושלם</StatusChip> : unlocked ? <StatusChip tone="accent">{completedCount}/{lessons.length} שיעורים</StatusChip> : <StatusChip><Lock className="size-3.5" /> נעול</StatusChip>}
        </div>

        <div className="mt-6 flex-1">
          <p className="text-xs font-bold text-zinc-500">{category.nameHe}</p>
          <h3 className="mt-1 text-xl font-black leading-snug text-white">{course.nameHe}</h3>
          <p className="mt-2 line-clamp-3 text-sm leading-6 text-zinc-400">{course.description}</p>
          {!unlocked && prerequisite && <p className="mt-4 text-xs font-bold text-amber-300">ייפתח לאחר השלמת „{prerequisite}”</p>}
        </div>

        <div className="mt-6 border-t border-white/[0.07] pt-5">
          <ProgressBar value={progress} label={unlocked ? "התקדמות בקורס" : "עדיין לא זמין"} accent={completed ? "#10b981" : "#534AB7"} />
          <span className={cn("mt-4 inline-flex min-h-11 items-center gap-1 text-sm font-bold", unlocked ? "text-violet-200" : "text-zinc-600")}>{completed ? "לתרגול חוזר" : unlocked ? "לצפייה בקורס" : "השלם קורס מקדים"}<ArrowLeft className="size-4" /></span>
        </div>
      </m.article>
    </Link>
  );
}

function PathsView({ completedCourses, activePathId }: { completedCourses: string[]; activePathId: string | null }) {
  return (
    <m.div variants={staggerContainerVariants} initial="hidden" animate="visible" className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {learningPaths.map((path) => {
        const completed = path.courses.filter((courseId) => completedCourses.includes(courseId)).length;
        const progress = path.courses.length ? (completed / path.courses.length) * 100 : 0;
        const selected = activePathId === path.id;
        return (
          <Link key={path.id} href={`/paths/${path.id}`} onClick={() => haptics.tap()} className="block h-full">
            <m.article variants={entranceVariants} whileHover={{ y: -3 }} whileTap={{ scale: 0.99 }} className={cn("interactive-surface flex h-full min-h-72 flex-col overflow-hidden rounded-2xl border bg-white/[0.045] p-6", selected ? "border-violet-400/35" : "border-white/10")} style={{ willChange: "transform" }}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex size-14 items-center justify-center rounded-2xl border border-white/10 text-3xl" style={{ backgroundColor: `${path.color}20` }}>{path.icon}</div>
                {selected && <StatusChip tone="accent">המסלול שלך</StatusChip>}
              </div>
              <div className="mt-6 flex-1"><h2 className="text-2xl font-black text-white">{path.nameHe}</h2><p className="mt-2 text-sm leading-7 text-zinc-400">{path.descriptionHe}</p></div>
              <div className="mt-6"><ProgressBar value={progress} label={`${completed} מתוך ${path.courses.length} קורסים`} accent={path.color} /><span className="mt-4 inline-flex min-h-11 items-center gap-1 text-sm font-bold text-violet-200">למפת המסלול <ArrowLeft className="size-4" /></span></div>
            </m.article>
          </Link>
        );
      })}
    </m.div>
  );
}

function CoursesPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const completedCourses = useSavantStore((state) => state.completedCourses);
  const completedLessons = useSavantStore((state) => state.completedLessons);
  const activePathId = useSavantStore((state) => state.activePathId);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [status, setStatus] = useState<CourseStatus>("all");
  const activeTab = searchParams.get("tab") === "all" ? "all" : "paths";

  const setActiveTab = (tab: "paths" | "all") => {
    haptics.tap();
    const params = new URLSearchParams(searchParams.toString());
    if (tab === "all") params.set("tab", "all"); else params.delete("tab");
    const query = params.toString();
    router.replace(query ? `/courses?${query}` : "/courses", { scroll: false });
  };

  const filteredCourses = useMemo(() => COURSES.filter((course) => {
    const lessons = LESSON_INDEX.filter((lesson) => lesson.courseId === course.id);
    const complete = lessons.length > 0 && lessons.every((lesson) => completedLessons.includes(lesson.id));
    const unlocked = isCourseUnlocked(course.id, completedCourses);
    const query = searchQuery.trim().toLowerCase();
    if (query && !course.nameHe.toLowerCase().includes(query) && !course.description.toLowerCase().includes(query)) return false;
    if (selectedCategory && course.categoryId !== selectedCategory) return false;
    if (status === "available" && !unlocked) return false;
    if (status === "completed" && !complete) return false;
    if (status === "locked" && unlocked) return false;
    return true;
  }), [completedCourses, completedLessons, searchQuery, selectedCategory, status]);

  const groupedCourses = CATEGORIES.map((category) => ({ category, courses: filteredCourses.filter((course) => course.categoryId === category.id) })).filter((group) => group.courses.length > 0);

  return (
    <PageShell className="space-y-8 lg:space-y-10">
      <PageHeader eyebrow="ספריית Savant" title={activeTab === "paths" ? "מסלולי למידה" : "כל הקורסים"} description={activeTab === "paths" ? "מסלול מסודר לוקח אותך מהבסיס ליכולת אמיתית, בלי לנחש מה ללמוד אחר כך." : "סנן לפי תחום, זמינות או התקדמות ומצא את השיעור הבא שלך."} />

      <div className="inline-flex w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.045] p-1.5 sm:w-auto">
        {([{"id":"paths","label":"מסלולים"},{"id":"all","label":"כל הקורסים"}] as const).map((tab) => (
          <m.button key={tab.id} whileTap={{ scale: 0.98 }} onClick={() => setActiveTab(tab.id)} className={cn("relative min-h-11 flex-1 rounded-xl px-6 text-sm font-black sm:flex-none", activeTab === tab.id ? "bg-white text-[#0d0f1a]" : "text-zinc-400")} style={{ willChange: "transform" }}>{tab.label}</m.button>
        ))}
      </div>

      {activeTab === "paths" ? <PathsView completedCourses={completedCourses} activePathId={activePathId} /> : (
        <div className="space-y-8">
          <GlassCard density="compact" className="space-y-4 shadow-none">
            <div className="relative">
              <Search className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
              <input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="חיפוש לפי שם או נושא" aria-label="חיפוש קורסים" dir="rtl" className="min-h-12 w-full rounded-2xl border border-white/10 bg-black/15 pr-11 pl-4 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-violet-400/45" />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar" aria-label="סינון לפי קטגוריה">
              <button onClick={() => { haptics.tap(); setSelectedCategory(null); }} className={cn("min-h-11 shrink-0 rounded-full border px-4 text-xs font-bold", selectedCategory === null ? "border-violet-400/35 bg-violet-400/15 text-violet-200" : "border-white/10 bg-white/[0.04] text-zinc-400")}>כל התחומים</button>
              {CATEGORIES.map((category) => <button key={category.id} onClick={() => { haptics.tap(); setSelectedCategory(category.id === selectedCategory ? null : category.id); }} className={cn("min-h-11 shrink-0 rounded-full border px-4 text-xs font-bold", selectedCategory === category.id ? "border-violet-400/35 bg-violet-400/15 text-violet-200" : "border-white/10 bg-white/[0.04] text-zinc-400")}>{category.icon} {category.nameHe}</button>)}
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar" aria-label="סינון לפי סטטוס">
              {([{"id":"all","label":"הכל"},{"id":"available","label":"זמינים"},{"id":"completed","label":"הושלמו"},{"id":"locked","label":"נעולים"}] as const).map((item) => <button key={item.id} onClick={() => { haptics.tap(); setStatus(item.id); }} className={cn("min-h-11 shrink-0 rounded-full border px-4 text-xs font-bold", status === item.id ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300" : "border-white/10 bg-white/[0.04] text-zinc-400")}>{item.label}</button>)}
            </div>
          </GlassCard>

          {groupedCourses.length === 0 ? <EmptyState icon={<Search className="size-5" />} title="לא נמצאו קורסים" description="נסה לשנות את החיפוש או להסיר אחד מהסינונים." /> : groupedCourses.map(({ category, courses }) => (
            <section key={category.id} className="space-y-4 content-auto">
              <SectionHeader title={category.nameHe} description={category.description} action={<StatusChip>{courses.length} קורסים</StatusChip>} />
              <m.div variants={staggerContainerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {courses.map((course) => <CourseCard key={course.id} course={course} category={category} completedLessons={completedLessons} completedCourses={completedCourses} />)}
              </m.div>
            </section>
          ))}
        </div>
      )}

      <GlassCard level="subtle" className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3"><div className="flex size-11 items-center justify-center rounded-2xl bg-violet-400/10 text-violet-300"><Sparkles className="size-5" /></div><div><h2 className="font-black text-white">לא בטוח מאיפה להתחיל?</h2><p className="text-sm text-zinc-500">מסלול הבסיס מתאים לרוב הלומדים.</p></div></div>
        <Link href="/courses/how-llms-work?from=courses" onClick={() => haptics.tap()} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-white px-5 text-sm font-black text-[#0d0f1a]"><BookOpen className="size-4" />לקורס הראשון</Link>
      </GlassCard>
    </PageShell>
  );
}

export default function CoursesPage() {
  return <Suspense fallback={<PageShell><GlassCard className="min-h-64 animate-pulse motion-reduce:animate-none" /></PageShell>}><CoursesPageContent /></Suspense>;
}
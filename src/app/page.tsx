"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, BadgeCheck, BookOpen, BrainCircuit, Check, Clock3, Flame, Layers3, Lock, Play, Route, Sparkles, WandSparkles } from "lucide-react";
import { m } from "framer-motion";
import { CATEGORIES, COURSES, LESSON_INDEX, type Course, type LessonMeta } from "@/content";
import { haptics } from "@/lib/haptics";
import { isCourseUnlocked } from "@/lib/courseUnlock";
import { entranceVariants, staggerContainerVariants } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { useScrollRestoration } from "@/hooks/useScrollRestoration";
import { useSavantStore } from "@/store/useSavantStore";
import { GlassCard, PageShell, ProgressBar, SectionHeader, StatusChip } from "@/components/ui/Primitives";
import { HomeLeaderboardCard } from "@/components/home/HomeLeaderboardCard";
import { learningPaths, type LearningPath } from "@/data/learningPaths";
import { MODEL_THEMES } from "@/lib/userTheme";

function CourseVisual({ course }: { course: Course }) {
  if (!course.image) return <span className="text-3xl" aria-hidden="true">{course.icon}</span>;
  return <Image src={course.image} alt="" width={40} height={40} className={cn("size-9 object-contain", (course.id === "grok-mastery" || course.id === "course-perplexity") && "brightness-0 invert")} />;
}

function FeaturedLessonGraphic({ icon }: { icon?: string }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] overflow-hidden sm:h-[62%]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_72%,rgba(34,211,238,0.18),transparent_27%),radial-gradient(circle_at_43%_100%,rgba(83,74,183,0.3),transparent_42%)]" />
      <div className="absolute -bottom-28 -left-24 size-80 rounded-full border border-cyan-200/15 sm:size-[26rem]" />
      <div className="absolute -bottom-16 -left-10 size-56 rounded-full border border-cyan-200/20 sm:size-72">
        <div className="absolute inset-7 rounded-full border border-violet-300/20" />
        <div className="absolute inset-14 rounded-full border border-white/10 bg-[#111522]/70 shadow-[0_0_80px_rgba(34,211,238,0.15)] backdrop-blur-sm" />
        <span className="absolute inset-0 flex items-center justify-center pb-1 text-5xl drop-shadow-[0_0_25px_rgba(103,232,249,0.45)] sm:text-7xl">{icon || "✦"}</span>
      </div>
      <div className="absolute bottom-28 left-52 size-2 rounded-full bg-cyan-200 shadow-[0_0_18px_5px_rgba(103,232,249,0.42)] sm:left-64" />
      <div className="absolute bottom-12 left-72 hidden size-1.5 rounded-full bg-violet-200 shadow-[0_0_16px_4px_rgba(196,181,253,0.35)] sm:block" />
      <div className="absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-[#151725] to-transparent" />
    </div>
  );
}

const LESSON_CARD_STYLES = [
  { accent: "text-cyan-200", chip: "bg-cyan-400/10 border-cyan-300/20", glow: "bg-cyan-400/16", line: "from-cyan-300/70" },
  { accent: "text-fuchsia-200", chip: "bg-fuchsia-400/10 border-fuchsia-300/20", glow: "bg-fuchsia-500/14", line: "from-fuchsia-300/70" },
  { accent: "text-amber-200", chip: "bg-amber-400/10 border-amber-300/20", glow: "bg-amber-400/14", line: "from-amber-300/70" },
  { accent: "text-emerald-200", chip: "bg-emerald-400/10 border-emerald-300/20", glow: "bg-emerald-400/14", line: "from-emerald-300/70" },
  { accent: "text-violet-200", chip: "bg-violet-400/10 border-violet-300/20", glow: "bg-violet-500/16", line: "from-violet-300/70" },
] as const;

const PORTFOLIO_LAYOUTS = [
  "md:col-span-2 xl:col-span-5 xl:row-span-2",
  "xl:col-span-4",
  "xl:col-span-3",
  "xl:col-span-3",
  "xl:col-span-4",
] as const;
const HEADER_CTA_LINES = [
  { title: "שלוש דקות עכשיו. יכולת חדשה אחר כך.", description: "שיעור קצר אחד מספיק כדי לשמור על המומנטום ולהפוך AI לכלי שבאמת עובד בשבילך.", action: "מתחילים ללמוד" },
  { title: "עוד רעיון אחד, ואתה כבר צעד קדימה.", description: "בחרנו עבורך שיעור קצר שאפשר לסיים עכשיו וליישם עוד היום.", action: "לוקחים רעיון חדש" },
  { title: "הניצחון הבא שלך מתחיל בשיעור קטן.", description: "בלי עומס ובלי מרתון. כמה דקות ממוקדות שבונות ביטחון אמיתי עם AI.", action: "יוצאים לדרך" },
  { title: "סקרנות נכנסת. יכולת שימושית יוצאת.", description: "התחנה הבאה מותאמת להתקדמות שלך ומחכה בדיוק במקום שבו עצרת.", action: "פותחים את התחנה" },
  { title: "היום לומדים קטן. מחר עובדים חכם.", description: "עוד מיקרו־שיעור אחד יהפוך את הכלים שלך למהירים, מדויקים וטבעיים יותר.", action: "מתקדמים עכשיו" },
] as const;

function hashSeed(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function seededShuffle<T>(items: T[], seed: number) {
  const shuffled = [...items];
  let state = seed || 1;
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    const target = state % (index + 1);
    [shuffled[index], shuffled[target]] = [shuffled[target], shuffled[index]];
  }
  return shuffled;
}

function LessonCard({ lesson, completed, index }: { lesson: LessonMeta; completed: boolean; index: number }) {
  const course = COURSES.find((item) => item.id === lesson.courseId);
  const style = LESSON_CARD_STYLES[index % LESSON_CARD_STYLES.length];
  const isFeatured = index === 0;

  return (
    <Link href={`/lesson/${lesson.id}?from=home`} onClick={() => haptics.tap()} className={cn("block h-full min-w-0", PORTFOLIO_LAYOUTS[index] ?? "xl:col-span-4")}>
      <m.article
        variants={entranceVariants}
        whileHover={{ y: -4 }}
        whileTap={{ scale: 0.99 }}
        className={cn("interactive-surface group relative flex h-full min-h-52 flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#151725]/90 p-5 shadow-[0_18px_50px_rgba(0,0,0,0.2)] sm:p-6", isFeatured && "min-h-[520px] border-cyan-300/15 bg-[linear-gradient(145deg,rgba(13,40,53,0.92)_0%,rgba(21,23,37,0.96)_48%)] md:min-h-[520px]")}
        style={{ willChange: "transform" }}
        dir="rtl"
      >
        <div aria-hidden="true" className={cn("pointer-events-none absolute -left-16 -top-16 size-48 rounded-full blur-3xl transition-opacity duration-300 group-hover:opacity-100", style.glow)} />
        <div aria-hidden="true" className={cn("absolute inset-x-0 top-0 h-px bg-gradient-to-l via-transparent to-transparent", style.line)} />
        {isFeatured && <FeaturedLessonGraphic icon={lesson.icon} />}
        <div className="relative flex items-start justify-between gap-4">
          <div className={cn("flex size-12 items-center justify-center rounded-2xl border text-2xl shadow-lg", style.chip)}>{lesson.icon || "📘"}</div>
          {completed ? <StatusChip tone="success"><Check className="size-3.5" /> הושלם</StatusChip> : <span className="rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-[10px] font-black text-zinc-400">כ־3 דקות</span>}
        </div>
        <div className={cn("relative z-10", isFeatured ? "mt-12 max-w-2xl md:mt-16 md:w-[72%]" : "mt-7")}>
          <p className={cn("text-xs font-black", style.accent)}>{course?.nameHe}</p>
          <h3 className={cn("mt-2 font-black leading-tight text-white", isFeatured ? "text-3xl sm:text-4xl lg:text-[2.65rem]" : "text-xl")}>{lesson.title}</h3>
          <p className={cn("mt-3 line-clamp-2 text-sm leading-6 text-zinc-400", isFeatured && "text-base leading-7 text-zinc-300")}>{lesson.description}</p>
          <span className={cn("mt-5 inline-flex items-center gap-1.5 text-xs font-black", style.accent)}>לפתיחת השיעור <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-1" /></span>
        </div>
      </m.article>
    </Link>
  );
}
function TrackProgressCard({ path, completedCourses, earned }: { path?: LearningPath; completedCourses: string[]; earned: boolean }) {
  const completed = path?.courses.filter((courseId) => completedCourses.includes(courseId)).length ?? 0;
  const total = path?.courses.length ?? 0;
  const percent = total ? Math.round((completed / total) * 100) : 0;

  return (
    <Link href={path ? `/paths/${path.id}` : "/courses"} onClick={() => haptics.tap()} className="block h-full" dir="rtl">
      <m.article whileHover={{ y: -3 }} whileTap={{ scale: 0.99 }} className="interactive-surface group relative flex h-full min-h-48 flex-col overflow-hidden rounded-3xl border border-violet-300/15 bg-[radial-gradient(circle_at_90%_0%,rgba(168,85,247,0.2),transparent_42%),rgba(21,23,37,0.92)] p-5" style={{ willChange: "transform" }}>
        <div aria-hidden="true" className="absolute -right-12 -top-12 size-36 rounded-full bg-violet-500/18 blur-3xl" />
        <div className="relative flex items-start justify-between gap-4">
          <span className="flex size-11 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-400/10 text-2xl">{path?.icon || <Route className="size-5 text-violet-200" />}</span>
          <span className="rounded-full border border-violet-300/20 bg-violet-400/10 px-3 py-1 text-[10px] font-black text-violet-200">התקדמות לתג</span>
        </div>
        <div className="relative mt-5 flex items-end justify-between gap-4">
          <div className="min-w-0"><p className="text-xs font-bold text-zinc-500">{path ? "המסלול שבחרת" : "עדיין לא נבחר מסלול"}</p><h2 className="mt-1 truncate text-xl font-black text-white">{path?.nameHe || "בחר מסלול אישי"}</h2></div>
          <div className="flex size-16 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-lg font-black text-violet-200">{earned ? <BadgeCheck className="size-7 text-emerald-300" /> : `${percent}%`}</div>
        </div>
        <div className="relative mt-5 h-2 overflow-hidden rounded-full bg-white/[0.07]"><m.div initial={false} animate={{ width: `${percent}%` }} transition={{ duration: 0.55 }} className="h-full rounded-full bg-gradient-to-l from-cyan-300 via-violet-400 to-fuchsia-400" /></div>
        <div className="relative mt-auto flex items-center justify-between pt-5 text-xs font-black"><span className="text-violet-200">{earned ? "התג הושג" : path ? `${completed} מתוך ${total} קורסים` : "לצפייה במסלולים"}</span><ArrowLeft className="size-4 text-zinc-500 transition-transform group-hover:-translate-x-1" /></div>
      </m.article>
    </Link>
  );
}
export default function Home() {
  const xp = useSavantStore((state) => state.xp);
  const streak = useSavantStore((state) => state.streak);
  const userName = useSavantStore((state) => state.userName);
  const completedLessons = useSavantStore((state) => state.completedLessons);
  const completedCourses = useSavantStore((state) => state.completedCourses);
  const primaryModel = useSavantStore((state) => state.primaryModel);
  const activePathId = useSavantStore((state) => state.activePathId);
  const achievements = useSavantStore((state) => state.achievements);
  const homeScrollPosition = useSavantStore((state) => state.homeScrollPosition);
  const setHomeScrollPosition = useSavantStore((state) => state.setHomeScrollPosition);
  const hasHydrated = useSavantStore((state) => state._hasHydrated);
  const [greeting, setGreeting] = useState("ברוך הבא");
  const [ctaIndex, setCtaIndex] = useState(0);

  useScrollRestoration(homeScrollPosition, setHomeScrollPosition, hasHydrated);

  useEffect(() => {
    const hour = new Date().getHours();
    setGreeting(hour < 12 ? "בוקר טוב" : hour < 18 ? "צהריים טובים" : hour < 22 ? "ערב טוב" : "לילה טוב");
    setCtaIndex(Math.floor(Math.random() * HEADER_CTA_LINES.length));
  }, []);

  const availableLessons = useMemo(() => LESSON_INDEX.filter((lesson) => isCourseUnlocked(lesson.courseId, completedCourses)), [completedCourses]);
  const continueLesson = useMemo(() => {
    const startedCourseIds = COURSES.filter((course) => LESSON_INDEX.some((lesson) => lesson.courseId === course.id && completedLessons.includes(lesson.id))).map((course) => course.id);
    return availableLessons.find((lesson) => startedCourseIds.includes(lesson.courseId) && !completedLessons.includes(lesson.id)) ?? availableLessons.find((lesson) => !completedLessons.includes(lesson.id)) ?? availableLessons[0];
  }, [availableLessons, completedLessons]);

  const continueCourse = COURSES.find((course) => course.id === continueLesson?.courseId);
  const continueCourseLessons = continueLesson ? LESSON_INDEX.filter((lesson) => lesson.courseId === continueLesson.courseId) : [];
  const continueCompleted = continueCourseLessons.filter((lesson) => completedLessons.includes(lesson.id)).length;
  const continueProgress = continueCourseLessons.length ? (continueCompleted / continueCourseLessons.length) * 100 : 0;
  const overallProgress = LESSON_INDEX.length ? (completedLessons.length / LESSON_INDEX.length) * 100 : 0;

  const portfolioSeed = useMemo(() => hashSeed(`${userName || "guest"}|${xp}|${streak}|${completedLessons.join(",")}`), [completedLessons, streak, userName, xp]);
  const recommendedLessons = useMemo(() => {
    const candidates = availableLessons.filter((lesson) => lesson.id !== continueLesson?.id && !completedLessons.includes(lesson.id));
    const shuffled = seededShuffle(candidates, portfolioSeed);
    const diverse: LessonMeta[] = [];
    const usedCourses = new Set<string>();

    for (const lesson of shuffled) {
      if (!usedCourses.has(lesson.courseId)) {
        diverse.push(lesson);
        usedCourses.add(lesson.courseId);
      }
      if (diverse.length === 5) break;
    }

    if (diverse.length < 5) {
      for (const lesson of shuffled) {
        if (!diverse.some((item) => item.id === lesson.id)) diverse.push(lesson);
        if (diverse.length === 5) break;
      }
    }

    return diverse;
  }, [availableLessons, completedLessons, continueLesson, portfolioSeed]);

  const featuredCourses = useMemo(() => COURSES.filter((course) => isCourseUnlocked(course.id, completedCourses)).slice(0, 4), [completedCourses]);
  const activePath = learningPaths.find((path) => path.id === activePathId);
  const selectedModel = primaryModel || "chatgpt";
  const modelTheme = MODEL_THEMES[selectedModel];
  const headerCta = HEADER_CTA_LINES[ctaIndex];

  return (
    <PageShell className="space-y-8 lg:space-y-10">
      <m.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden rounded-3xl border border-white/[0.09] bg-[radial-gradient(circle_at_18%_20%,rgba(6,182,212,0.13),transparent_28%),radial-gradient(circle_at_82%_12%,rgba(168,85,247,0.18),transparent_34%),linear-gradient(135deg,rgba(27,29,52,0.98),rgba(15,17,31,0.98))] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.24)] sm:p-7 lg:p-9"
        style={{ willChange: "transform" }}
        dir="rtl"
      >
        <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-32 size-80 rounded-full bg-violet-500/14 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-violet-300/45 to-transparent" />

        <div className="relative grid items-center gap-7 lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-12">
          <div className="flex min-w-0 flex-col items-center text-center lg:items-start lg:text-right">
            <div className="flex items-center gap-2 text-xs font-black text-violet-300">
              <span className="size-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.65)]" />
              {greeting}{userName ? `, ${userName}` : ""}
            </div>
            <h1 className="mt-3 max-w-3xl text-balance text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl lg:text-[3rem]">
              {headerCta.title}
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-7 text-zinc-400 sm:text-base">
              {headerCta.description}
            </p>

            {continueLesson && (
              <m.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} className="mt-6 w-full sm:w-auto" style={{ willChange: "transform" }}>
                <Link href={`/lesson/${continueLesson.id}?from=home`} onClick={() => haptics.tap()} className="group inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl bg-white px-7 py-3.5 text-base font-black text-[#0d0f1a] shadow-[0_14px_40px_rgba(255,255,255,0.12)] sm:w-auto">
                  <span className="flex size-8 items-center justify-center rounded-full bg-[#534AB7] text-white"><Play className="size-4 fill-current" /></span>
                  {headerCta.action}
                  <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
                </Link>
              </m.div>
            )}

            <div className="mt-5 flex w-full max-w-xl flex-col gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.035] p-3.5 sm:flex-row sm:items-center">
              <div className="flex min-w-0 flex-1 items-center gap-3 text-right">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300"><BookOpen className="size-4" /></span>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-zinc-500">התחנה הבאה</p>
                  <p className="truncate text-sm font-black text-zinc-200">{continueLesson?.title || "מוכן כשנוח לך להתחיל"}</p>
                </div>
              </div>
              <div className="flex shrink-0 items-center justify-center gap-4 border-t border-white/[0.06] pt-3 text-xs font-bold text-zinc-400 sm:border-r sm:border-t-0 sm:pr-4 sm:pt-0">
                <span className="inline-flex items-center gap-1.5"><Sparkles className="size-3.5 text-violet-300" />{xp.toLocaleString()} XP</span>
                <span className="inline-flex items-center gap-1.5"><Flame className="size-3.5 text-orange-400" />{streak} ימים</span>
              </div>
            </div>
          </div>

          <m.div
            initial={{ opacity: 0, scale: 0.9, rotate: 4 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: 0.16, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ scale: 1.02, rotate: -0.6 }}
            className="relative mx-auto h-[260px] w-full max-w-[300px] lg:h-[300px] lg:max-w-[330px]"
            style={{ willChange: "transform" }}
            aria-hidden="true"
          >
            <div className="absolute inset-3 rounded-[2.4rem] border border-violet-300/20 bg-[linear-gradient(145deg,rgba(83,74,183,0.28),rgba(6,182,212,0.08),rgba(255,255,255,0.025))] shadow-[0_35px_90px_rgba(83,74,183,0.34)] backdrop-blur-xl" />
            <div className="absolute inset-x-10 top-7 h-24 rounded-full bg-fuchsia-500/20 blur-3xl" />
            <div className="absolute inset-x-10 bottom-7 h-20 rounded-full bg-cyan-400/15 blur-3xl" />

            <m.div initial={{ opacity: 0, y: 14, rotate: -4 }} animate={{ opacity: 0.45, y: 0, rotate: -4 }} transition={{ delay: 0.28 }} className="absolute left-8 right-14 top-11 h-36 rounded-3xl border border-white/10 bg-white/[0.04]" style={{ willChange: "transform" }} />
            <m.div initial={{ opacity: 0, y: 14, rotate: 4 }} animate={{ opacity: 0.7, y: 0, rotate: 4 }} transition={{ delay: 0.34 }} className="absolute left-14 right-8 top-14 h-36 rounded-3xl border border-cyan-300/15 bg-cyan-400/[0.05]" style={{ willChange: "transform" }} />

            <div className="absolute inset-x-9 top-16 rounded-3xl border border-violet-200/20 bg-[#181a2a]/95 p-5 shadow-2xl">
              <div className="flex items-center justify-between">
                <span className="flex size-11 items-center justify-center rounded-2xl bg-violet-500/20 text-violet-100"><BrainCircuit className="size-6" /></span>
                <span className="inline-flex items-center gap-1 rounded-full border border-cyan-300/20 bg-cyan-400/10 px-2.5 py-1 text-[10px] font-black text-cyan-200"><Sparkles className="size-3" /> מיקרו־שיעור</span>
              </div>
              <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/[0.07]"><div className="h-full w-2/3 rounded-full bg-gradient-to-l from-cyan-300 via-violet-400 to-fuchsia-400" /></div>
              <div className="mt-3 flex items-center justify-between text-[11px] font-black"><span className="text-zinc-500">3:00 דקות</span><span className="text-white">יכולת אחת קדימה</span></div>
            </div>

            <m.div initial={{ opacity: 0, x: 12, y: 8 }} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ delay: 0.48 }} className="absolute right-0 top-5 flex items-center gap-2 rounded-2xl border border-amber-300/20 bg-[#171925]/95 px-3 py-2 text-xs font-black text-amber-200 shadow-xl" style={{ willChange: "transform" }}><WandSparkles className="size-4" /> רעיון חדש</m.div>
            <m.div initial={{ opacity: 0, x: -12, y: -8 }} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ delay: 0.56 }} className="absolute bottom-5 left-0 flex items-center gap-2 rounded-2xl border border-emerald-300/20 bg-[#171925]/95 px-3 py-2 text-xs font-black text-emerald-200 shadow-xl" style={{ willChange: "transform" }}><Layers3 className="size-4" /> נשמר לדרך</m.div>
          </m.div>
        </div>
      </m.header>      <m.section variants={staggerContainerVariants} initial="hidden" animate="visible" className="grid gap-4 xl:grid-cols-[minmax(0,1.55fr)_minmax(310px,0.75fr)]" dir="rtl">
        {continueLesson && continueCourse && (
          <m.div variants={entranceVariants} style={{ willChange: "transform" }}>
            <GlassCard level="strong" className="relative h-full min-h-[370px] overflow-hidden p-0 sm:p-0">
              <div className="absolute inset-0 opacity-90" style={{ background: `radial-gradient(circle at 12% 20%, ${modelTheme.glow}, transparent 34%), radial-gradient(circle at 90% 90%, rgba(83,74,183,0.18), transparent 40%)` }} />
              <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:32px_32px]" />
              <div className="relative grid h-full min-h-[370px] gap-8 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_220px] lg:items-center lg:p-9">
                <div className="flex min-w-0 flex-col items-start">
                  <StatusChip tone="accent">המשך למידה</StatusChip>
                  <p className="mt-7 text-sm font-bold" style={{ color: modelTheme.secondary }}>{continueCourse.nameHe} · שיעור {continueLesson.order}</p>
                  <h2 className="mt-2 max-w-2xl text-3xl font-black leading-tight text-white sm:text-4xl lg:text-[2.7rem]">{continueLesson.title}</h2>
                  <p className="mt-3 max-w-xl text-sm leading-7 text-zinc-300 sm:text-base">{continueLesson.description}</p>
                  <div className="mt-7 flex w-full max-w-xl flex-col gap-4 sm:flex-row sm:items-center">
                    <Link href={`/lesson/${continueLesson.id}?from=home`} onClick={() => haptics.tap()} className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3 text-sm font-black text-[#0d0f1a]">המשך לשיעור <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" /></Link>
                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex items-center justify-between text-[11px] font-bold text-zinc-500"><span>{continueCompleted} מתוך {continueCourseLessons.length} שיעורים</span><span>{Math.round(continueProgress)}%</span></div>
                      <div className="h-2 overflow-hidden rounded-full bg-white/[0.08]"><m.div initial={false} animate={{ width: `${continueProgress}%` }} transition={{ duration: 0.6 }} className="h-full rounded-full" style={{ background: `linear-gradient(90deg, ${modelTheme.primary}, ${modelTheme.secondary})` }} /></div>
                    </div>
                  </div>
                </div>

                <m.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="relative mx-auto flex size-52 items-center justify-center" style={{ willChange: "transform" }} aria-label={`${modelTheme.label}, ${Math.round(continueProgress)}% התקדמות`}>
                  <div className="absolute inset-4 rounded-full opacity-30 blur-3xl" style={{ backgroundColor: modelTheme.primary }} />
                  <svg className="absolute inset-0 size-full -rotate-90" viewBox="0 0 100 100" aria-hidden="true">
                    <circle cx="50" cy="50" r="43" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="5" />
                    <m.circle cx="50" cy="50" r="43" fill="none" stroke={modelTheme.primary} strokeWidth="5" strokeDasharray="270" initial={{ strokeDashoffset: 270 }} animate={{ strokeDashoffset: 270 - (270 * continueProgress) / 100 }} transition={{ duration: 1, ease: "circOut", delay: 0.25 }} strokeLinecap="round" />
                  </svg>
                  <div className="relative flex size-36 flex-col items-center justify-center rounded-full border border-white/10 bg-[#11131f]/90 shadow-2xl backdrop-blur-xl">
                    <Image src={modelTheme.icon} alt={modelTheme.label} width={58} height={58} className="size-14 object-contain" />
                    <span className="mt-2 text-sm font-black text-white">{modelTheme.label}</span>
                    <span className="text-[10px] font-bold text-zinc-500">{primaryModel ? "המודל שלך" : "המלצה להתחלה"}</span>
                  </div>
                  <span className="absolute bottom-1 rounded-full border border-white/10 bg-[#171925] px-3 py-1 text-[10px] font-black text-white">{Math.round(continueProgress)}% הושלם</span>
                </m.div>
              </div>
            </GlassCard>
          </m.div>
        )}

        <m.div variants={entranceVariants} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1" style={{ willChange: "transform" }}>
          <TrackProgressCard path={activePath} completedCourses={completedCourses} earned={Boolean(activePath && achievements.includes(activePath.id))} />
          <HomeLeaderboardCard xp={xp} />
        </m.div>
      </m.section>
      {recommendedLessons.length > 0 && (
        <section className="space-y-4">
          <SectionHeader title="נבחר במיוחד בשבילך" description="תמהיל רענן של שיעורים קצרים ממסלולים שונים, לפי ההתקדמות שלך" />
          <m.div variants={staggerContainerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} className="grid auto-rows-fr gap-4 md:grid-cols-2 xl:grid-cols-12">
            {recommendedLessons.map((lesson, index) => <LessonCard key={lesson.id} lesson={lesson} completed={completedLessons.includes(lesson.id)} index={index} />)}
          </m.div>
        </section>
      )}

      <section className="space-y-4">
        <SectionHeader title="מסלולי למידה" description="בחר תחום והתקדם בקצב שלך" action={<Link href="/courses" className="inline-flex min-h-11 items-center gap-1 text-sm font-bold text-violet-300">לכל הקורסים <ArrowLeft className="size-4" /></Link>} />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {featuredCourses.map((course) => {
            const category = CATEGORIES.find((item) => item.id === course.categoryId);
            const courseLessons = LESSON_INDEX.filter((lesson) => lesson.courseId === course.id);
            const done = courseLessons.filter((lesson) => completedLessons.includes(lesson.id)).length;
            const unlocked = isCourseUnlocked(course.id, completedCourses);
            return (
              <Link key={course.id} href={unlocked ? `/courses/${course.id}?from=home` : "#"} onClick={(event) => { if (!unlocked) event.preventDefault(); unlocked ? haptics.tap() : haptics.error(); }} className="block h-full">
                <m.article whileHover={unlocked ? { y: -3 } : undefined} whileTap={unlocked ? { scale: 0.99 } : undefined} className={cn("interactive-surface flex h-full min-h-48 flex-col rounded-2xl border border-white/10 bg-white/[0.045] p-5", !unlocked && "opacity-55")} style={{ willChange: unlocked ? "transform" : "auto" }}>
                  <div className="flex items-center justify-between"><div className="flex size-12 items-center justify-center rounded-2xl bg-white/[0.06]"><CourseVisual course={course} /></div>{unlocked ? <StatusChip tone={done === courseLessons.length && done > 0 ? "success" : "neutral"}>{done === courseLessons.length && done > 0 ? "הושלם" : `${done}/${courseLessons.length}`}</StatusChip> : <Lock className="size-4 text-zinc-500" />}</div>
                  <p className="mt-5 text-xs font-bold text-zinc-500">{category?.nameHe}</p>
                  <h3 className="mt-1 text-lg font-black text-white">{course.nameHe}</h3>
                  <div className="mt-auto flex items-center gap-2 pt-5 text-xs text-zinc-500"><Clock3 className="size-3.5" />{courseLessons.length * 3} דקות</div>
                </m.article>
              </Link>
            );
          })}
        </div>
      </section>
    </PageShell>
  );
}

"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { m } from "framer-motion";
import { ArrowLeft, CheckCircle2, ChevronRight, Star, Target } from "lucide-react";
import { PathRoadmap } from "@/components/PathRoadmap";
import { RoadmapBackground } from "@/components/RoadmapBackground";
import { learningPaths } from "@/data/learningPaths";
import { haptics } from "@/lib/haptics";
import { useSavantStore } from "@/store/useSavantStore";

export default function PathRoadmapPage() {
  const { pathId } = useParams<{ pathId: string }>();
  const router = useRouter();
  const completedCourses = useSavantStore((state) => state.completedCourses);
  const achievements = useSavantStore((state) => state.achievements);
  const activePathId = useSavantStore((state) => state.activePathId);
  const selectPath = useSavantStore((state) => state.selectPath);

  const path = useMemo(() => learningPaths.find((item) => item.id === pathId), [pathId]);

  useEffect(() => {
    if (!path) router.push("/courses");
  }, [path, router]);

  const completedCount = path?.courses.filter((id) => completedCourses.includes(id)).length ?? 0;
  const progressPercent = path?.courses.length ? Math.round((completedCount / path.courses.length) * 100) : 0;

  if (!path) return null;

  const isSelected = activePathId === path.id;
  const isPathComplete = path.courses.every((id) => completedCourses.includes(id));
  const hasPathBadge = achievements.includes(path.id);
  const showCompletion = isPathComplete && hasPathBadge;

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-clip bg-background pb-28 text-white" dir="rtl">
      <RoadmapBackground color={path.color} />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 md:px-8 md:py-10">
        <section className="w-full min-w-0 overflow-hidden rounded-[28px] border border-white/10 bg-[#10121e]/88 shadow-[0_30px_90px_rgba(0,0,0,0.34)] backdrop-blur-xl" dir="rtl">
          <header className="relative px-5 pb-8 pt-5 sm:px-8 sm:pb-10 md:px-10 md:pt-8">
            <div aria-hidden="true" className="pointer-events-none absolute -left-24 -top-32 size-80 rounded-full opacity-20 blur-3xl" style={{ backgroundColor: path.color }} />
            <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-l from-transparent via-white/15 to-transparent" />

            <Link href="/courses" onClick={() => haptics.tap()} className="relative inline-flex min-h-11 items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-4 text-sm font-bold text-zinc-400 transition-colors hover:bg-white/[0.07] hover:text-white">
              <ChevronRight className="size-4" />
              חזרה למסלולים
            </Link>

            <div className="relative mt-7 grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_210px] lg:gap-14">
              <div className="flex min-w-0 flex-col items-center text-center lg:items-start lg:text-right">
                <m.div initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.045] px-3.5 py-2 text-[11px] font-black text-zinc-400" style={{ willChange: "transform" }}>
                  <Target className="size-4" style={{ color: path.color }} />
                  מסלול למידה מותאם
                </m.div>
                <m.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="mt-4 text-balance text-4xl font-black leading-none tracking-tight sm:text-5xl md:text-6xl" style={{ willChange: "transform" }}>
                  {path.nameHe}
                </m.h1>
                <m.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }} className="mt-4 max-w-2xl text-sm font-medium leading-7 text-zinc-400 sm:text-base" style={{ willChange: "transform" }}>
                  {path.descriptionHe}
                </m.p>

                <m.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-6 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center" style={{ willChange: "transform" }}>
                  {!isSelected ? (
                    <button onClick={() => { haptics.tap(); selectPath(path.id); }} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-white px-6 text-sm font-black text-[#0d0f1a] transition-colors hover:bg-zinc-100">
                      בחירת המסלול
                      <ArrowLeft className="size-4" />
                    </button>
                  ) : (
                    <div className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-emerald-300/20 bg-emerald-400/10 px-6 text-sm font-black text-emerald-300">
                      <CheckCircle2 className="size-5" />
                      המסלול פעיל
                    </div>
                  )}
                  <div className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.035] px-5 text-sm font-black text-white">
                    <Star className="size-4 fill-amber-400 text-amber-400" />
                    {path.xpTotal} XP במסלול
                  </div>
                </m.div>
              </div>

              <m.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.18 }} className="relative mx-auto flex size-44 shrink-0 items-center justify-center" style={{ willChange: "transform" }} aria-label={`${progressPercent}% התקדמות`}>
                <div className="absolute inset-5 rounded-full opacity-20 blur-3xl" style={{ backgroundColor: path.color }} />
                <svg className="size-full -rotate-90" viewBox="0 0 100 100" aria-hidden="true">
                  <circle cx="50" cy="50" r="42" className="fill-none stroke-white/[0.06]" strokeWidth="9" />
                  <m.circle cx="50" cy="50" r="42" className="fill-none" strokeWidth="9" stroke={path.color} strokeDasharray="264" initial={{ strokeDashoffset: 264 }} animate={{ strokeDashoffset: 264 - (264 * progressPercent) / 100 }} transition={{ duration: 1.1, ease: "circOut", delay: 0.25 }} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-4xl font-black tracking-tight">{progressPercent}%</span>
                  <span className="mt-1 text-[10px] font-black text-zinc-500">{completedCount} מתוך {path.courses.length} תחנות</span>
                </div>
              </m.div>
            </div>
          </header>

          <div className="relative min-w-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.018),transparent_18%)]">
            <div className="absolute right-1/2 top-0 z-10 hidden h-7 w-px translate-x-1/2 bg-gradient-to-b from-white/25 to-transparent md:block" aria-hidden="true" />
            <PathRoadmap path={path} completedCourses={completedCourses} showCompletion={showCompletion} />
          </div>
        </section>
      </div>
    </div>
  );
}
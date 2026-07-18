"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { m, useScroll, useSpring } from "framer-motion";
import { ArrowLeft, CheckCircle2, Lock, Trophy } from "lucide-react";
import { COURSES, type Course } from "@/content";
import { type LearningPath } from "@/data/learningPaths";
import { haptics } from "@/lib/haptics";
import { isCourseUnlocked } from "@/lib/courseUnlock";
import { cn } from "@/lib/utils";

interface PathRoadmapProps {
  path: LearningPath;
  completedCourses: string[];
  showCompletion: boolean;
}

interface CourseNodeProps {
  course: Course;
  index: number;
  isCompleted: boolean;
  isLocked: boolean;
  isEven: boolean;
  pathColor: string;
}

function CourseNode({ course, index, isCompleted, isLocked, isEven, pathColor }: CourseNodeProps) {
  const card = (
    <m.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      whileHover={!isLocked ? { y: -4 } : undefined}
      whileTap={!isLocked ? { scale: 0.99 } : undefined}
      className={cn(
        "group relative min-h-56 overflow-hidden rounded-3xl border p-5 text-right shadow-[0_20px_50px_rgba(0,0,0,0.2)] sm:p-6",
        isCompleted ? "border-emerald-400/25 bg-emerald-400/[0.06]" : "border-white/10 bg-[#171925]/90",
        isLocked && "opacity-55"
      )}
      style={{ willChange: "transform" }}
      dir="rtl"
    >
      <div aria-hidden="true" className="absolute -left-16 -top-16 size-40 rounded-full blur-3xl" style={{ backgroundColor: `${pathColor}18` }} />
      <div className="relative flex h-full flex-col">
        <div className="flex items-start justify-between gap-4">
          <div className="flex size-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.055] text-3xl">
            {course.image ? (
              <Image src={course.image} alt="" width={42} height={42} className={cn("size-10 object-contain", (course.id === "grok-mastery" || course.id === "course-perplexity") && "brightness-0 invert")} />
            ) : course.icon}
          </div>
          <span className={cn("inline-flex min-h-8 items-center gap-1.5 rounded-full border px-3 text-[11px] font-black", isCompleted ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-300" : isLocked ? "border-white/10 bg-white/[0.04] text-zinc-500" : "border-violet-300/20 bg-violet-400/10 text-violet-200") }>
            {isCompleted ? <><CheckCircle2 className="size-3.5" /> הושלם</> : isLocked ? <><Lock className="size-3.5" /> נעול</> : `תחנה ${index + 1}`}
          </span>
        </div>
        <div className="mt-7">
          <p className="text-[10px] font-black tracking-[0.18em] text-zinc-500">שלב {index + 1}</p>
          <h2 className="mt-2 text-xl font-black text-white transition-colors group-hover:text-violet-200 sm:text-2xl">{course.nameHe}</h2>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-zinc-400">{course.description}</p>
        </div>
        {!isLocked && <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-black text-white">{isCompleted ? "לרענון הקורס" : "להתחלת הקורס"}<ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" /></span>}
      </div>
    </m.article>
  );

  return (
    <div className={cn("relative mb-8 flex w-full items-center pr-12 md:mb-12 md:pr-0", isEven ? "md:flex-row" : "md:flex-row-reverse") }>
      <div className="w-full min-w-0 md:w-[calc(50%-32px)]">
        {isLocked ? card : <Link href={`/courses/${course.id}?from=courses`} onClick={() => haptics.tap()} className="block">{card}</Link>}
      </div>
      <div className="absolute right-1 top-8 z-10 flex size-7 items-center justify-center md:static md:mx-[18px] md:size-7 md:shrink-0">
        <span className={cn("size-5 rounded-full border-[3px] shadow-[0_0_0_6px_rgba(13,15,26,0.9)]", isCompleted ? "border-emerald-200 bg-emerald-500" : isLocked ? "border-zinc-700 bg-zinc-900" : "border-white bg-violet-500")} />
      </div>
      <div className="hidden flex-1 md:block" />
    </div>
  );
}

export function PathRoadmap({ path, completedCourses, showCompletion }: PathRoadmapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    scrollContainerRef.current = document.getElementById("main-content");
  }, []);

  const { scrollYProgress } = useScroll({
    container: scrollContainerRef,
    target: containerRef,
    offset: ["start center", "end center"],
  });
  const pathProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  const courses = useMemo(() => path.courses.map((courseId) => COURSES.find((course) => course.id === courseId)).filter((course): course is Course => Boolean(course)), [path.courses]);

  return (
    <div ref={containerRef} className="relative w-full min-w-0 px-4 py-9 sm:px-6 md:px-8 md:py-12" dir="rtl">
      <div className="pointer-events-none absolute bottom-10 right-[29px] top-10 w-0.5 bg-white/[0.08] md:right-1/2">
        <m.div className="h-full w-full origin-top rounded-full" style={{ scaleY: pathProgress, backgroundColor: path.color, willChange: "transform" }} />
      </div>

      <div className="relative mx-auto w-full max-w-5xl">
        {courses.map((course, index) => (
          <CourseNode
            key={course.id}
            course={course}
            index={index}
            isCompleted={completedCourses.includes(course.id)}
            isLocked={!isCourseUnlocked(course.id, completedCourses)}
            isEven={index % 2 === 0}
            pathColor={path.color}
          />
        ))}

        {showCompletion && (
          <m.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            className="relative mx-auto mt-4 flex max-w-lg flex-col items-center rounded-3xl border border-amber-300/25 bg-[linear-gradient(145deg,rgba(245,158,11,0.12),rgba(255,255,255,0.04))] p-7 text-center shadow-[0_24px_70px_rgba(0,0,0,0.3)] sm:p-9"
            style={{ willChange: "transform" }}
            dir="rtl"
          >
            <span className="flex size-16 items-center justify-center rounded-2xl border border-amber-300/25 bg-amber-400/10 text-amber-300"><Trophy className="size-8" /></span>
            <span className="mt-5 text-xs font-black tracking-[0.2em] text-amber-300">התג שלך נפתח</span>
            <h2 className="mt-2 text-3xl font-black text-white">המסלול הושלם</h2>
            <p className="mt-3 text-sm leading-7 text-zinc-400">סיימת את כל התחנות וקיבלת את תג {path.nameHe}. זה רשמי.</p>
          </m.div>
        )}
      </div>
    </div>
  );
}
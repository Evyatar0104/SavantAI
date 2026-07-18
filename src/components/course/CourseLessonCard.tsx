"use client";

import Image from "next/image";
import Link from "next/link";
import { Check, Lock, Play } from "lucide-react";
import { m } from "framer-motion";
import type { LessonMeta } from "@/content";
import { haptics } from "@/lib/haptics";
import { cn } from "@/lib/utils";

interface CourseLessonCardProps {
  lesson: LessonMeta;
  isCompleted: boolean;
  isLocked: boolean;
  isActive: boolean;
  colorClass: string;
}

export function CourseLessonCard({ lesson, isCompleted, isLocked, isActive, colorClass }: CourseLessonCardProps) {
  const icon = lesson.icon?.startsWith("@") ? (
    <Image src={`/assets/logos/${lesson.icon.substring(1)}`} alt="" width={32} height={32} className="size-8 object-contain" />
  ) : <span aria-hidden="true">{lesson.icon || "📄"}</span>;

  const card = (
    <m.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-24px" }}
      whileHover={!isLocked ? { x: -3 } : undefined}
      whileTap={!isLocked ? { scale: 0.99 } : undefined}
      onClick={() => isLocked ? haptics.error() : haptics.tap()}
      className={cn("interactive-surface flex min-h-[88px] items-center gap-4 rounded-2xl border p-4 sm:p-5", isLocked ? "cursor-default border-white/[0.05] bg-white/[0.02] opacity-45" : "border-white/[0.08] bg-white/[0.04]", isActive && !isLocked && "border-violet-400/30 bg-violet-400/[0.07]")}
      style={{ willChange: !isLocked ? "transform" : "auto" }}
    >
      <div className={cn("flex size-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 text-2xl", colorClass)}>{isLocked ? <Lock className="size-5 text-zinc-500" /> : icon}</div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2"><span className="text-[10px] font-black text-zinc-500">שיעור {lesson.order}</span>{isActive && !isCompleted && <span className="rounded-full bg-violet-400/12 px-2 py-0.5 text-[10px] font-bold text-violet-200">הבא בתור</span>}</div>
        <h4 className={cn("mt-1 font-black leading-snug", isLocked ? "text-zinc-600" : "text-white")}>{lesson.title}</h4>
        {!isLocked && <p className="mt-1 line-clamp-1 text-xs text-zinc-500 sm:line-clamp-2">{lesson.description}</p>}
      </div>
      <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
        {isCompleted ? <Check className="size-4 text-emerald-300" /> : isActive && !isLocked ? <Play className="size-4 fill-violet-300 text-violet-300" /> : isLocked ? <Lock className="size-3.5 text-zinc-600" /> : <span className="size-2 rounded-full bg-white/15" />}
      </div>
    </m.div>
  );

  if (isLocked) return card;
  return <Link href={`/lesson/${lesson.id}?from=course`} className="block w-full">{card}</Link>;
}
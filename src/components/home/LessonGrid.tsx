"use client";

import { m } from "framer-motion";
import { LessonCard } from "./Cards";
import type { LessonMeta } from "@/content";

interface LessonGridProps {
    recommendedLessons: LessonMeta[];
}

export function LessonGrid({ recommendedLessons }: LessonGridProps) {
    return (
        <section className="space-y-8">
          <div className="px-2">
            <h3 className="text-xl md:text-3xl font-bold font-serif">מומלץ עבורך</h3>
            <p className="text-xs md:text-lg text-zinc-500 font-medium tracking-tight">מבוסס על תחומי העניין שלך בבינה מלאכותית</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recommendedLessons.map((lesson, i) => (
                <m.div
                  key={lesson.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                >
                    <LessonCard lesson={lesson} />
                </m.div>
            ))}
          </div>
        </section>
    );
}


"use client";

import { m } from "framer-motion";
import { LessonCard } from "./Cards";
import { SectionHeader } from "./SectionHeader";
import type { LessonMeta } from "@/content";

interface LessonGridProps {
    recommendedLessons: LessonMeta[];
}

export function LessonGrid({ recommendedLessons }: LessonGridProps) {
    return (
        <section className="space-y-8">
          <SectionHeader
            title="מומלץ עבורך"
            subtitle="מבוסס על תחומי העניין שלך בבינה מלאכותית"
            accent="#A78BFA"
          />

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


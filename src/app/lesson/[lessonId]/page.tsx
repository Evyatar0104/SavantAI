"use client";

import dynamic from "next/dynamic";
import { use } from "react";

const DynamicLessonRunner = dynamic(() => import("@/components/LessonRunner").then(mod => mod.LessonRunner), {
    ssr: false,
});
export default function LessonPage({ params }: { params: Promise<{ lessonId: string }> }) {
    const { lessonId } = use(params);
    return <DynamicLessonRunner lessonId={lessonId} />;
}

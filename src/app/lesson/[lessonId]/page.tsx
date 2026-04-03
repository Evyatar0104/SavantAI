"use client";

import dynamic from "next/dynamic";
import { use } from "react";

const DynamicLessonRunner = dynamic(() => import("@/components/LessonRunner").then(mod => mod.LessonRunner), {
    ssr: false,
});
export default function LessonPage({
    params,
    searchParams,
}: {
    params: Promise<{ lessonId: string }>;
    searchParams: Promise<{ from?: string }>;
}) {
    const { lessonId } = use(params);
    const { from } = use(searchParams);
    return <DynamicLessonRunner lessonId={lessonId} from={from} />;
}

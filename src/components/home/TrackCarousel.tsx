"use client";

import { useRef, useState, useEffect } from "react";
import { m } from "framer-motion";
import { cn } from "@/lib/utils";
import { CourseCard } from "./Cards";
import { SectionHeader } from "./SectionHeader";
import type { Course, Category } from "@/content";

interface TrackCarouselProps {
    coursesList: { course: Course; category: Category }[];
    completedLessons: string[];
    completedCourses: string[];
}

export function TrackCarousel({ coursesList, completedLessons, completedCourses }: TrackCarouselProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [scrollState, setScrollState] = useState({ isAtStart: true, isAtEnd: false });
    const [isDragging, setIsDragging] = useState(false);
    const isDraggingRef = useRef(false);
    const startX = useRef(0);
    const scrollLeftStart = useRef(0);
    const [hasMoved, setHasMoved] = useState(false);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!scrollRef.current) return;
        isDraggingRef.current = true;
        setIsDragging(true);
        setHasMoved(false);
        startX.current = e.pageX;
        scrollLeftStart.current = scrollRef.current.scrollLeft;
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDraggingRef.current || !scrollRef.current) return;
        const walk = (e.pageX - startX.current);
        if (Math.abs(walk) > 5) {
            if (!hasMoved) setHasMoved(true);
            scrollRef.current.scrollLeft = scrollLeftStart.current - walk;
        }
    };

    const handleMouseUpOrLeave = () => {
        isDraggingRef.current = false;
        setIsDragging(false);
    };

    const handleScroll = () => {
        if (!scrollRef.current) return;
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        const absScrollLeft = Math.abs(scrollLeft);
        const isAtStart = absScrollLeft < 10;
        const isAtEnd = absScrollLeft + clientWidth >= scrollWidth - 10;
        setScrollState({ isAtStart, isAtEnd });
    };

    useEffect(() => {
        const el = scrollRef.current;
        if (el) {
            el.addEventListener('scroll', handleScroll);
            handleScroll(); 
            return () => el.removeEventListener('scroll', handleScroll);
        }
    }, []);

    return (
        <section className="space-y-6">
          <SectionHeader
            title="מסלולי למידה"
            subtitle="העמק בתחומי ידע ספציפיים"
            accent="#60A5FA"
            href="/courses"
            linkLabel="צפה בהכל"
          />

          <div
            ref={scrollRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            className={cn(
              "flex space-x-6 overflow-x-auto overflow-y-hidden touch-pan-x no-scrollbar pt-10 pb-20 px-8 -my-6",
              isDragging ? "cursor-grabbing select-none" : "cursor-grab",
              !scrollState.isAtStart && !scrollState.isAtEnd ? "mask-horizontal-fade" :
                scrollState.isAtStart ? "mask-linear-fade-left" : "mask-linear-fade-right"
            )}
          >
            {coursesList.map(({ course, category }, i) => (
                <m.div
                    key={course.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                    className="flex-shrink-0"
                >
                    <CourseCard 
                        course={course} 
                        category={category} 
                        completedLessons={completedLessons}
                        completedCourses={completedCourses}
                        hasMoved={hasMoved}
                    />
                </m.div>
            ))}
          </div>
        </section>
    );
}


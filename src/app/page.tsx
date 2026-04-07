"use client";

import { useState, useEffect, useMemo } from "react";
import { useSavantStore } from "@/store/useSavantStore";
import { CATEGORIES, COURSES, LESSON_INDEX } from "@/content";
import { m } from "framer-motion";
import { getLessonTheme } from "@/lib/lessonTheme";
import { isCourseUnlocked } from "@/lib/courseUnlock";
import { HeroSection, getFloatingIcons } from "@/components/home/HeroSection";
import { TrackCarousel } from "@/components/home/TrackCarousel";
import { LessonGrid } from "@/components/home/LessonGrid";

export default function Home() {
  const streak = useSavantStore(state => state.streak);
  const completedLessons = useSavantStore(state => state.completedLessons);
  const completedCourses = useSavantStore(state => state.completedCourses);
  
  const [randomSeed, setRandomSeed] = useState<number | null>(null);

  useEffect(() => {
    setRandomSeed(Math.random());
  }, []);

  const recommendedLessons = useMemo(() => {
    const uncompleted = LESSON_INDEX.filter(l => 
        !completedLessons.includes(l.id) && 
        isCourseUnlocked(l.courseId, completedCourses)
    );

    const nextByCourse = new Map<string, typeof LESSON_INDEX[0]>();
    uncompleted.forEach(l => {
       if (!nextByCourse.has(l.courseId)) {
            nextByCourse.set(l.courseId, l);
       } else {
            const existing = nextByCourse.get(l.courseId)!;
            if (l.order < existing.order) nextByCourse.set(l.courseId, l);
       }
    });

    let frontier = Array.from(nextByCourse.values());

    // Seeded random helper
    const seededRandom = (seed: number) => {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };

    if (randomSeed !== null) {
      let currentSeed = randomSeed;
      frontier = [...frontier].sort(() => seededRandom(currentSeed++) - 0.5);
    } else {
      const courseProgress = (courseId: string) => completedLessons.filter(id => LESSON_INDEX.find(l=>l.id===id)?.courseId === courseId).length;
      frontier.sort((a, b) => {
         const aProgress = courseProgress(a.courseId) > 0 ? 1 : 0;
         const bProgress = courseProgress(b.courseId) > 0 ? 1 : 0;
         if (aProgress !== bProgress) return bProgress - aProgress;
         return a.order - b.order; 
      });
    }

    let recs = frontier.slice(0, 3);
    if (recs.length < 3) {
       const remaining = uncompleted.filter(l => !recs.find(r => r.id === l.id));
       let currentSeed = (randomSeed || 0) + 100;
       const pool = randomSeed !== null ? [...remaining].sort(() => seededRandom(currentSeed++) - 0.5) : remaining;
       recs = [...recs, ...pool.slice(0, 3 - recs.length)];
    }
    return recs;
  }, [completedLessons, completedCourses, randomSeed]);

  const coursesList = useMemo(() => {
    return CATEGORIES
      .slice()
      .sort((a, b) => a.order - b.order)
      .flatMap((category) =>
        COURSES
          .filter(c => c.categoryId === category.id)
          .sort((a, b) => a.order - b.order)
          .map((course) => ({ course, category }))
      );
  }, []);

  const heroData = useMemo(() => {
    const validLessons = LESSON_INDEX.filter(l => l.trackId === "ai");
    const available = validLessons.filter(l => !completedLessons.includes(l.id));
    const pool = available.length > 0 ? available : validLessons;
    
    const index = randomSeed !== null 
      ? Math.floor(randomSeed * 123456) % pool.length 
      : (completedLessons.length) % pool.length;
      
    const lesson = pool[index];
    const theme = getLessonTheme(lesson.icon || "", lesson.courseId);
    const floatingIcons = getFloatingIcons(lesson.courseId, lesson.id);
    
    return { lesson, theme, floatingIcons };
  }, [completedLessons, randomSeed]);

  const homeScrollPosition = useSavantStore(state => state.homeScrollPosition);
  const setHomeScrollPosition = useSavantStore(state => state.setHomeScrollPosition);
  const hasHydrated = useSavantStore(state => state._hasHydrated);
  const [isRestored, setIsRestored] = useState(() => {
    if (typeof window !== 'undefined') {
        const pos = useSavantStore.getState().homeScrollPosition || 0;
        return pos === 0;
    }
    return false;
  });

  // Scroll Restoration
  useEffect(() => {
    if (!hasHydrated || isRestored) return;

    const mainElement = document.querySelector('main');
    if (mainElement && homeScrollPosition > 0) {
        const restore = () => {
            mainElement.scrollTo({ top: homeScrollPosition });
            setIsRestored(true);
        };

        restore();
        const timers = [
            setTimeout(restore, 20),
            setTimeout(restore, 100),
            setTimeout(restore, 300),
        ];
        return () => timers.forEach(clearTimeout);
    } else {
        setIsRestored(true);
    }
  }, [hasHydrated, homeScrollPosition, isRestored]);

  // Scroll Capture
  useEffect(() => {
    const mainElement = document.querySelector('main');
    if (!mainElement) return;

    let frameId: number;
    const handleScroll = () => {
        if (!isRestored) return;
        
        cancelAnimationFrame(frameId);
        frameId = requestAnimationFrame(() => {
            const currentPos = mainElement.scrollTop;
            if (currentPos > 0 || (currentPos === 0 && homeScrollPosition < 100)) {
                setHomeScrollPosition(currentPos);
            }
        });
    };

    mainElement.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
        mainElement.removeEventListener('scroll', handleScroll);
        cancelAnimationFrame(frameId);
    };
  }, [setHomeScrollPosition, isRestored, homeScrollPosition]);

  return (
    <div className="flex-1 w-full bg-transparent text-foreground flex flex-col min-h-screen">
      <header className="z-30 w-full px-6 py-8 md:px-10 md:py-12">
        <div className="w-full flex justify-between items-end">
          <m.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <span className="text-[10px] md:text-sm font-black uppercase tracking-widest text-zinc-500 mb-2">ברוך הבא</span>
            <h1 className="text-3xl md:text-6xl font-serif font-semibold tracking-tight">מוכן ללמוד?</h1>
          </m.div>

          <div className="flex items-center space-x-4 md:space-x-8">
            <m.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-zinc-900/40 border border-white/5 rounded-3xl px-6 py-4 flex items-center space-x-4 shadow-xl"
            >
              <div className="text-2xl md:text-3xl">🔥</div>
              <div className="flex flex-col">
                <span className="text-[8px] md:text-[10px] font-bold text-zinc-500 tracking-wider leading-none mb-1">רצף</span>
                <span className="text-lg md:text-2xl font-black text-orange-500 leading-none">{streak}</span>
              </div>
            </m.div>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-1 flex flex-col space-y-12 pb-32 px-6 md:px-10 lg:px-14 w-full">
        <HeroSection heroLesson={heroData.lesson} theme={heroData.theme} floatingIcons={heroData.floatingIcons} />
        
        <TrackCarousel 
            coursesList={coursesList} 
            completedLessons={completedLessons} 
            completedCourses={completedCourses} 
        />

        <LessonGrid recommendedLessons={recommendedLessons} />
      </main>
    </div>
  );
}


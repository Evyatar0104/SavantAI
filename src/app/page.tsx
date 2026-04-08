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
import { ChevronLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useScrollRestoration } from "@/hooks/useScrollRestoration";

const MOCK_LEADERBOARD = [
  { name: "אלכסנדר הגדול", xp: 12500, avatar: "👑" },
  { name: "מרקוס אורליוס", xp: 11200, avatar: "🏛️" },
  { name: "עדה לאבלייס", xp: 9800, avatar: "💻" },
];

function LeaderboardSection() {
  return (
    <m.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      className="w-full space-y-6 md:space-y-10 pt-16 md:pt-24"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
        <div className="space-y-2">
          <m.h2 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="text-3xl md:text-6xl font-black text-white tracking-tighter flex items-center gap-4"
          >
            <span className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-2xl md:rounded-3xl bg-gradient-to-br from-yellow-400 to-amber-600 text-2xl md:text-4xl shadow-[0_0_30px_rgba(234,179,8,0.3)] border border-yellow-300/30">🏆</span>
            טבלת המובילים
          </m.h2>
          <p className="text-zinc-400 font-medium text-base md:text-xl max-w-md leading-relaxed">
            הצטרף לטופ 1% של משתמשי ה-AI בסוואנט וזכה בתגים בלעדיים
          </p>
        </div>
        <Link 
          href="/leaderboard" 
          className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all group w-fit"
        >
          לדירוג המלא
          <ChevronLeft className="w-5 h-5 rotate-180 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-2 md:px-0">
        {/* Top 3 Podium */}
        <div className="lg:col-span-2 relative overflow-hidden rounded-[40px] border border-white/10 bg-zinc-950/40 backdrop-blur-3xl p-4 md:p-8">
           {/* Animated Background Glows */}
           <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
           <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

           <div className="flex flex-col gap-3 relative z-10">
              {MOCK_LEADERBOARD.map((user, i) => (
                <m.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.01, x: -4 }}
                  className={cn(
                    "flex items-center justify-between p-4 md:p-6 rounded-[28px] border transition-all duration-300 relative overflow-hidden",
                    i === 0 
                      ? "bg-gradient-to-l from-yellow-500/20 to-yellow-500/5 border-yellow-500/30 shadow-2xl shadow-yellow-500/10" 
                      : "bg-white/[0.03] border-white/5 hover:border-white/10 hover:bg-white/[0.05]"
                  )}
                >
                  {/* Shimmer for #1 */}
                  {i === 0 && (
                    <m.div
                      animate={{
                        x: ['-100%', '200%'],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear",
                        repeatDelay: 1
                      }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 pointer-events-none"
                    />
                  )}

                  <div className="flex items-center gap-3 md:gap-6 min-w-0 relative z-10">
                    <div className={cn(
                      "w-10 h-10 md:w-14 md:h-14 rounded-2xl flex items-center justify-center text-lg md:text-2xl font-black border-2 flex-shrink-0 shadow-lg",
                      i === 0 ? "bg-yellow-500 text-black border-yellow-400 shadow-yellow-500/20" : 
                      i === 1 ? "bg-zinc-400 text-black border-zinc-300 shadow-zinc-400/20" :
                      "bg-amber-700 text-white border-amber-600 shadow-amber-700/20"
                    )}>
                      {i + 1}
                    </div>
                    <div className="flex items-center gap-3 md:gap-5 min-w-0">
                      <span className="text-2xl md:text-4xl filter drop-shadow-md">{user.avatar}</span>
                      <div className="flex flex-col min-w-0">
                        <span className="text-lg md:text-2xl font-black text-white truncate leading-tight">{user.name}</span>
                        <div className="flex items-center gap-2">
                           <span className={cn(
                             "text-[10px] md:text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded-full border flex items-center gap-1",
                             i === 0 ? "bg-yellow-500/20 border-yellow-500/30 text-yellow-500" : "bg-white/10 border-white/10 text-zinc-400"
                           )}>
                            {i === 0 && <span className="w-1 h-1 rounded-full bg-yellow-500 animate-pulse" />}
                            מאסטר AI
                           </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2 relative z-10">
                    <div className={cn(
                      "text-xl md:text-3xl font-black leading-none tracking-tight",
                      i === 0 ? "text-yellow-500" : "text-white"
                    )}>{user.xp.toLocaleString()}</div>
                    <div className="text-[10px] md:text-xs font-bold text-zinc-500 uppercase tracking-widest mt-1">XP</div>
                  </div>
                </m.div>
              ))}
           </div>
        </div>

        {/* Your Ranking Summary */}
        <m.div 
          whileHover={{ y: -5 }}
          className="relative overflow-hidden rounded-[40px] border border-white/10 bg-gradient-to-br from-blue-600/30 to-purple-600/20 p-8 flex flex-col justify-between group min-h-[440px]"
        >
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            
            {/* Animated Shine Effect */}
            <m.div
              animate={{
                x: ['-200%', '200%'],
                y: ['-200%', '200%'],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent opacity-30 pointer-events-none"
            />

            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-50" />
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-10">
                <h3 className="text-xl md:text-2xl font-black text-white">הדירוג שלך</h3>
                <m.div 
                  whileHover={{ scale: 1.1 }}
                  className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-400 text-xs font-black uppercase tracking-wider cursor-default shadow-lg shadow-blue-500/10"
                >
                  חודשי
                </m.div>
              </div>
              
              <div className="flex items-center gap-6 mb-10">
                <m.div 
                  animate={{ 
                    y: [0, -12, 0],
                    rotate: [0, 8, -8, 0],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ 
                    duration: 5, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="w-20 h-20 md:w-24 md:h-24 rounded-[32px] bg-white/10 flex items-center justify-center text-4xl md:text-5xl border border-white/20 shadow-[0_0_50px_rgba(59,130,246,0.3)] backdrop-blur-xl group-hover:shadow-[0_0_70px_rgba(59,130,246,0.5)] transition-shadow"
                >
                  🚀
                </m.div>
                <div>
                  <m.div 
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    className="text-4xl md:text-6xl font-black text-white tracking-tighter"
                  >
                    #1,240
                  </m.div>
                  <p className="text-sm md:text-base text-zinc-400 font-bold mt-1 opacity-80 flex items-center gap-2">
                    מתוך 45,000 לומדים
                    <span className="w-1 h-1 rounded-full bg-zinc-500" />
                    <span className="text-zinc-500">טופ 3%</span>
                  </p>
                </div>
              </div>
              
              <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                <p className="text-zinc-200 font-medium leading-relaxed text-base md:text-lg relative z-10">
                  אתה בדרך הנכונה! 
                  <br />
                  <span className="text-zinc-400 text-sm md:text-base mt-2 block">
                    חסרים לך <span className="text-white font-black">450 XP</span> כדי לעלות בדירוג הבא.
                  </span>
                </p>
                {/* Progress Mini-bar */}
                <div className="w-full h-1.5 bg-white/5 rounded-full mt-4 overflow-hidden">
                  <m.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: '75%' }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                  />
                </div>
              </div>
            </div>

            <Link 
              href="/leaderboard" 
              className="relative z-10 w-full py-5 rounded-[24px] bg-white text-black font-black text-lg text-center hover:bg-zinc-200 transition-all shadow-2xl hover:shadow-white/10 active:scale-[0.98] mt-8 flex items-center justify-center gap-3 group/btn"
            >
              לדירוג המלא
              <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
        </m.div>
      </div>
    </m.div>
  );
}

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
    const validLessons = LESSON_INDEX.filter(l => l.trackIds && l.trackIds.length > 0);
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

  useScrollRestoration(homeScrollPosition, setHomeScrollPosition, hasHydrated);

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

      <main className="relative z-10 flex-1 flex-col space-y-12 pb-32 px-6 md:px-10 lg:px-14 w-full">
        <HeroSection heroLesson={heroData.lesson} theme={heroData.theme} floatingIcons={heroData.floatingIcons} />
        
        <TrackCarousel 
            coursesList={coursesList} 
            completedLessons={completedLessons} 
            completedCourses={completedCourses} 
        />

        <LessonGrid recommendedLessons={recommendedLessons} />

        <LeaderboardSection />
      </main>
    </div>
  );
}


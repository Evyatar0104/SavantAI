"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { useSavantStore } from "@/store/useSavantStore";
import { TRACKS, CATEGORIES, COURSES } from "@/data/lessons";
import { LESSON_INDEX } from "@/data/lessons-index";
import { m, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, Clock, BookOpen, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { getLessonTheme, FLOATING_ICONS_MAP } from "@/lib/lessonTheme";

// Positions for orbiting icons around the main icon (relative offsets in px)
// Pushed far enough out so the large main emoji never covers them
const ORBIT_POSITIONS = [
  { dx: -130, dy: -120, size: 44 },  // top-left
  { dx: 140, dy: -100, size: 36 },   // top-right
  { dx: -150, dy: 60, size: 38 },    // bottom-left
  { dx: 130, dy: 90, size: 42 },     // bottom-right
  { dx: -50, dy: -160, size: 30 },   // far top
  { dx: 160, dy: -10, size: 34 },    // far right
];

const getFloatingIcons = (courseId: string, lessonId: string) => {
  let hash = 0;
  for (let i = 0; i < lessonId.length; i++) {
    hash = Math.imul(31, hash) + lessonId.charCodeAt(i) | 0;
  }
  const rand = () => {
    hash = (hash * 9301 + 49297) % 233280;
    return hash / 233280;
  };

  const pool = FLOATING_ICONS_MAP[courseId] || FLOATING_ICONS_MAP.DEFAULT;
  return ORBIT_POSITIONS.map((pos, i) => ({
    emoji: pool[i % pool.length],
    dx: pos.dx,
    dy: pos.dy,
    size: pos.size,
    opacity: 0.12 + rand() * 0.15,
    duration: 10 + rand() * 8,
    delay: rand() * 3,
    rotateRange: 5 + rand() * 15,
  }));
};

export default function Home() {
  const streak = useSavantStore((state: any) => state.streak);
  const xp = useSavantStore((state: any) => state.xp);
  const completedLessons = useSavantStore((state: any) => state.completedLessons);
  const otherLessons = LESSON_INDEX.slice(1, 4); // Just get top 3 for recommendations

  const [scrollState, setScrollState] = useState({ isAtStart: true, isAtEnd: false });
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const isDraggingRef = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);
  const [hasMoved, setHasMoved] = useState(false);
  
  const [heroLesson, setHeroLesson] = useState<any>(null);

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
    // In RTL, scrollLeft is 0 at start (right) and negative when scrolling left
    const absScrollLeft = Math.abs(scrollLeft);
    const isAtStart = absScrollLeft < 10;
    const isAtEnd = absScrollLeft + clientWidth >= scrollWidth - 10;
    setScrollState({ isAtStart, isAtEnd });
  };

  useEffect(() => {
    const validLessons = LESSON_INDEX.filter(l => l.title && l.description && l.icon);
    const available = validLessons.filter(l => !completedLessons.includes(l.id));
    const pool = available.length > 0 ? available : validLessons;
    const random = pool[Math.floor(Math.random() * pool.length)];
    setHeroLesson(random);
  }, [completedLessons]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', handleScroll);
      handleScroll(); // Initial check
      return () => el.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return (
    <div className="flex-1 w-full bg-transparent text-foreground flex flex-col min-h-screen">
      {/* Simplified Header - Merged aesthetically with the app flow */}
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

        {/* Premium Animated Hero Banner */}
        <section className="relative w-full pt-4 min-h-[350px] md:min-h-[420px]">
          <AnimatePresence mode="wait">
            {!heroLesson ? (
              <m.div
                key="skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative overflow-hidden rounded-[32px] md:rounded-[48px] min-h-[350px] md:min-h-[420px] p-6 md:p-10 lg:p-14 bg-white/[0.04] animate-pulse"
              />
            ) : (
              <m.div
                key={heroLesson.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <Link href={`/lesson/${heroLesson.id}`} className="group block focus:outline-none perspective-1000" dir="rtl">
                  {(() => {
                    const theme = getLessonTheme(heroLesson.icon);
                    const floatingIcons = getFloatingIcons(heroLesson.courseId, heroLesson.id);
                    return (
                      <div className={cn(
                        "relative overflow-hidden rounded-[32px] md:rounded-[48px] min-h-[350px] md:min-h-[420px] p-6 md:p-10 lg:p-14 flex flex-col justify-end transition-all duration-700 shadow-2xl hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] border border-white/10 group-hover:border-white/20 transform-style-3d group-hover:-translate-y-2",
                        "bg-zinc-950"
                      )}>
                        {/* Dynamic Animated Background Gradient */}
                        <div className="absolute inset-0 opacity-40 mix-blend-screen transition-opacity duration-1000 group-hover:opacity-60" 
                             style={{ background: `linear-gradient(135deg, ${theme.secondary}CC 0%, ${theme.primary}99 50%, #0a0a0f 100%)` }} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-0 pointer-events-none" />

                        {/* Floating Lesson Icon + Orbiting Background Icons */}
                        <div className="absolute top-1/2 -translate-y-1/2 left-8 md:left-16 lg:left-24 pointer-events-none transition-all duration-1000 group-hover:scale-105 z-[1]">
                          {/* Radial Glow behind the icon cluster */}
                          <div className="absolute -inset-20 md:-inset-28" style={{ background: `radial-gradient(circle, ${theme.glow} 0%, transparent 65%)`, mixBlendMode: 'screen' }} />

                          {/* Orbiting background icons */}
                          {floatingIcons.map((fi, i) => (
                            <m.div
                              key={i}
                              className="absolute pointer-events-none select-none"
                              style={{
                                left: '50%',
                                top: '50%',
                                marginLeft: fi.dx,
                                marginTop: fi.dy,
                                fontSize: `${fi.size}px`,
                                lineHeight: 1,
                                filter: 'none',
                              }}
                              animate={{
                                y: [0, -15, 0],
                                x: [0, 8, 0],
                                rotate: [0, fi.rotateRange, 0],
                                opacity: [fi.opacity, fi.opacity * 1.4, fi.opacity],
                              }}
                              transition={{ duration: fi.duration, delay: fi.delay, repeat: Infinity, ease: "easeInOut" }}
                            >
                              {fi.emoji}
                            </m.div>
                          ))}

                          {/* Main Icon — large and prominent */}
                          <m.div
                            animate={{ y: [0, -12, 0], rotate: [-3, 3, -3] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            className="relative z-10 text-[100px] md:text-[160px] lg:text-[220px] leading-none select-none opacity-50 group-hover:opacity-80 transition-opacity duration-700"
                          >
                            {heroLesson.icon}
                          </m.div>
                        </div>

                        {/* Content */}
                        <div className="relative z-10 flex flex-col space-y-4 max-w-2xl lg:max-w-3xl translate-z-20">
                          <div className="flex items-center space-x-3 mb-2 rtl:space-x-reverse">
                            <m.span
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.1 }}
                              className="bg-white/10 backdrop-blur-3xl border border-white/20 px-3 py-1.5 rounded-full text-[10px] md:text-xs font-black tracking-wider text-white shadow-xl"
                            >
                              למידה יומית
                            </m.span>
                          </div>

                          <m.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
                            className="text-3xl md:text-5xl lg:text-7xl font-serif font-bold text-white leading-[1.1] tracking-tight drop-shadow-2xl"
                          >
                            {heroLesson.title}
                          </m.h2>

                          <m.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-white/80 text-sm md:text-lg lg:text-xl font-medium max-w-xl line-clamp-2 leading-relaxed"
                          >
                            {heroLesson.description}
                          </m.p>

                          <m.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="pt-6 flex flex-wrap items-center gap-4 md:gap-6"
                          >
                            <div 
                              className="bg-white text-black px-6 py-3 md:px-8 md:py-4 rounded-full font-black text-sm md:text-base flex items-center transition-all shadow-xl hover:scale-105"
                              style={{ border: `2px solid ${theme.primary}` }}
                            >
                              התחל ללמוד <ArrowRight className="mr-2 w-4 h-4 md:w-5 md:h-5 rtl:rotate-180" style={{ color: theme.primary }} />
                            </div>

                            <div 
                              className="flex space-x-6 rtl:space-x-reverse items-center backdrop-blur-xl px-5 py-2.5 rounded-full border border-white/10"
                              style={{ backgroundColor: `${theme.primary}33` }} // 20% opacity using hex
                            >
                              <div className="flex flex-col">
                                <span className="text-white/60 text-[8px] md:text-[10px] font-bold tracking-widest leading-none mb-1">פרס</span>
                                <span className="text-white font-black text-sm md:text-lg leading-none">+150 XP</span>
                              </div>
                              <div className="h-6 w-px bg-white/15" />
                              <div className="flex items-center text-white/90 font-bold text-xs md:text-sm">
                                <Sparkles className="w-3.5 h-3.5 ml-1.5 rtl:mr-1.5 rtl:ml-0" style={{ color: theme.primary }} /> צמיחה
                              </div>
                            </div>
                          </m.div>
                        </div>
                      </div>
                    );
                  })()}
                </Link>
              </m.div>
            )}
          </AnimatePresence>
        </section>

        {/* Courses Carousel Section — grouped by category */}
        <section className="space-y-6">
          <div className="flex justify-between items-end px-2">
            <div>
              <h3 className="text-xl md:text-3xl font-bold font-serif">מסלולי למידה</h3>
              <p className="text-xs md:text-lg text-zinc-500 font-medium tracking-tight">העמק בתחומי ידע ספציפיים</p>
            </div>
            <Link href="/tracks" className="text-blue-500 text-xs md:text-base font-bold flex items-center hover:underline">
              צפה בהכל <ChevronRight className="w-4 h-4 mr-1 rotate-180" />
            </Link>
          </div>

          <div
            ref={scrollRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            className={cn(
              "flex space-x-6 overflow-x-auto no-scrollbar pt-4 pb-8 px-8",
              isDragging ? "cursor-grabbing select-none" : "cursor-grab",
              !scrollState.isAtStart && !scrollState.isAtEnd ? "mask-horizontal-fade" :
                scrollState.isAtStart ? "mask-linear-fade-left" : "mask-linear-fade-right"
            )}
          >
            {CATEGORIES
              .slice()
              .sort((a, b) => a.order - b.order)
              .flatMap((category) =>
                COURSES
                  .filter(c => c.categoryId === category.id)
                  .sort((a, b) => a.order - b.order)
                  .map((course) => ({ course, category }))
              )
              .map(({ course, category }, i) => {
                const courseLessons = LESSON_INDEX.filter(l => l.courseId === course.id);
                const completedInCourse = courseLessons.filter(l => completedLessons.includes(l.id));
                const progress = courseLessons.length > 0
                  ? (completedInCourse.length / courseLessons.length) * 100
                  : 0;

                return (
                  <m.div
                    key={course.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                    className="flex-shrink-0"
                  >
                    <Link 
                      href={`/courses/${course.id}`} 
                      className="block group"
                      onDragStart={(e) => e.preventDefault()}
                      onClick={(e) => {
                        if (hasMoved) {
                          e.preventDefault();
                        }
                      }}
                    >
                      <div className={cn(
                        "relative overflow-hidden w-48 h-56 md:w-72 md:h-80 rounded-[32px] p-6 md:p-8 flex flex-col justify-between transition-all duration-500 group-hover:-translate-y-2 shadow-lg group-hover:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.5)] hover:border-black/10 dark:hover:border-white/10",
                        "bg-white/60 dark:bg-zinc-900/40 backdrop-blur-xl border border-black/5 dark:border-white/5"
                      )}>
                        {/* Glowing Orb */}
                        <div className={cn(
                          "absolute -top-10 -right-10 w-32 h-32 md:w-48 md:h-48 rounded-full blur-[40px] md:blur-[60px] opacity-20 dark:opacity-20 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none bg-gradient-to-br",
                          category.color
                        )} />

                        <div className={cn(
                          "relative z-10 w-12 h-12 md:w-16 md:h-16 flex items-center justify-center text-2xl md:text-3xl shadow-inner border border-white/15 squarcle bg-gradient-to-br",
                          category.color
                        )}>
                          {course.image ? (
                            <div className="w-full h-full p-2.5 flex items-center justify-center">
                                {course.id === "course-notebooklm" ? (
                                    <div className="w-full h-full squarcle bg-white overflow-hidden flex items-center justify-center">
                                        <Image src={course.image} alt={course.nameHe} width={64} height={64} className="w-full h-full object-contain p-1.5" loading="lazy" />
                                    </div>
                                ) : (
                                    <Image src={course.image} alt={course.nameHe} width={64} height={64} className="w-full h-full object-contain" loading="lazy" />
                                )}
                            </div>
                          ) : (
                            course.icon
                          )}
                        </div>
                        <div className="relative z-10">
                          <p className="text-[10px] md:text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-1 tracking-wide">{category.nameHe}</p>
                          <h4 className="text-zinc-900 dark:text-white/90 font-bold text-base md:text-xl leading-snug line-clamp-2 mb-3">
                            {course.nameHe}
                          </h4>
                          <div className="w-full h-1 md:h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                            <m.div
                              initial={{ width: 0 }}
                              animate={{ width: `${progress}%` }}
                              className={cn("h-full opacity-80 bg-gradient-to-r", category.color)}
                            />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </m.div>
                );
              })}
          </div>
        </section>

        {/* Recommended Lessons Grid */}
        <section className="space-y-8">
          <div className="px-2">
            <h3 className="text-xl md:text-3xl font-bold font-serif">מומלץ עבורך</h3>
            <p className="text-xs md:text-lg text-zinc-500 font-medium tracking-tight">מבוסס על תחומי העניין שלך בבינה מלאכותית</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {otherLessons.map((lesson, i) => {
              const lessonCategory = CATEGORIES.find(c => c.id === lesson.categoryId);
              const lessonCourse = COURSES.find(c => c.id === lesson.courseId);
              return (
                <m.div
                  key={lesson.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                >
                  <Link href={`/lesson/${lesson.id}`} className="group block focus:outline-none h-full">
                    <div className="bg-zinc-900/30 backdrop-blur-md border border-white/5 rounded-[40px] p-8 md:p-10 flex flex-col h-full hover:bg-zinc-900/60 transition-all duration-500 hover:border-blue-500/30 group-hover:translate-y-[-8px]">
                      <div className="flex justify-between items-start mb-10">
                        <div className={cn("px-5 py-2 rounded-full text-[10px] font-black text-white shadow-xl bg-gradient-to-r", lessonCategory?.color)}>
                          {lessonCourse?.nameHe || lessonCategory?.nameHe}
                        </div>
                        <div className="text-zinc-600 group-hover:text-blue-400 transition-colors">
                          <BookOpen className="w-6 h-6 md:w-8 md:h-8" />
                        </div>
                      </div>

                      <h4 className="text-2xl md:text-4xl font-black mb-4 tracking-tight group-hover:text-blue-50 transition-colors leading-[1.1]">
                        {lesson.title}
                      </h4>

                      <p className="text-zinc-500 text-sm md:text-lg mb-10 line-clamp-2 leading-relaxed">
                        {lesson.description}
                      </p>

                      <div className="mt-auto flex items-center justify-between pt-6 border-t border-white/5">
                        <span className="text-zinc-500 text-[10px] md:text-xs font-black tracking-widest flex items-center">
                          <Clock className="w-4 h-4 ml-2" /> 2 דק' קריאה
                        </span>
                        <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all shadow-xl">
                          <ArrowRight className="w-5 h-5 md:w-6 md:h-6 rotate-180" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </m.div>
              );
            })}
          </div>
        </section>

      </main>
    </div>
  );
}

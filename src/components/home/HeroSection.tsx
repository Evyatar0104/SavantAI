"use client";

import Link from "next/link";
import Image from "next/image";
import { m } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { FLOATING_ICONS_MAP, type LessonTheme } from "@/lib/lessonTheme";
import type { LessonMeta } from "@/content";

// Positions for orbiting icons around the main icon (relative offsets in px)
const ORBIT_POSITIONS = [
  { dx: -130, dy: -120, size: 44 },  // top-left
  { dx: 140, dy: -100, size: 36 },   // top-right
  { dx: -150, dy: 60, size: 38 },    // bottom-left
  { dx: 130, dy: 90, size: 42 },     // bottom-right
  { dx: -50, dy: -160, size: 30 },   // far top
  { dx: 160, dy: -10, size: 34 },    // far right
];

export const getFloatingIcons = (courseId: string, lessonId: string) => {
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

interface HeroSectionProps {
    heroLesson: LessonMeta;
    theme: LessonTheme;
    floatingIcons: ReturnType<typeof getFloatingIcons>;
}

export function HeroSection({ heroLesson, theme, floatingIcons }: HeroSectionProps) {
    return (
        <section className="relative w-full pt-4 min-h-[350px] md:min-h-[420px]">
          <Link href={`/lesson/${heroLesson.id}?from=home`} className="group block focus:outline-none perspective-1000" dir="rtl">
            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
              "relative overflow-hidden rounded-[32px] md:rounded-[48px] min-h-[350px] md:min-h-[420px] p-6 md:p-10 lg:p-14 flex flex-col justify-end transition-all duration-700 shadow-2xl hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] border border-white/10 group-hover:border-white/20 transform-style-3d group-hover:-translate-y-2",
              "bg-zinc-950"
            )}>
              <div className="absolute inset-0 opacity-40 mix-blend-screen transition-opacity duration-1000 group-hover:opacity-60" 
                   style={{ background: `linear-gradient(135deg, ${theme.secondary}CC 0%, ${theme.primary}99 50%, #0a0a0f 100%)` }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-0 pointer-events-none" />

              <div className="hidden md:block absolute top-[53%] -translate-y-1/2 left-16 lg:left-24 pointer-events-none z-[1] transition-all duration-1000 group-hover:scale-105">
                <div className="relative flex items-center justify-center scale-100 lg:scale-110 origin-center transition-transform">
                  <div className="absolute -inset-28" style={{ background: `radial-gradient(circle, ${theme.glow} 0%, transparent 65%)`, mixBlendMode: 'screen' }} />

                  {floatingIcons.map((fi, i) => (
                    <m.div
                      key={i}
                      className="absolute pointer-events-none select-none"
                      style={{
                        left: '50%',
                        top: '50%',
                        x: fi.dx * 0.9, 
                        y: fi.dy * 0.9,
                        fontSize: `${fi.size}px`,
                        lineHeight: 1,
                        willChange: 'transform, opacity',
                      }}
                      animate={{
                        y: [fi.dy * 0.9, fi.dy * 0.9 - 15, fi.dy * 0.9],
                        x: [fi.dx * 0.9, fi.dx * 0.9 + 8, fi.dx * 0.9],
                        rotate: [0, fi.rotateRange, 0],
                        opacity: [fi.opacity, fi.opacity * 1.4, fi.opacity],
                      }}
                      transition={{ duration: fi.duration, delay: fi.delay, repeat: Infinity, ease: "easeInOut" }}
                    >
                      {fi.emoji}
                    </m.div>
                  ))}

                  <m.div
                    animate={{ y: [0, -12, 0], rotate: [-3, 3, -3] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="relative z-10 text-[180px] lg:text-[230px] leading-none select-none opacity-50 group-hover:opacity-100 transition-opacity duration-700 flex items-center justify-center"
                    style={{ willChange: 'transform' }}
                  >
                    {heroLesson.icon?.startsWith("@") ? (
                      <div className="w-[180px] h-[180px] lg:w-[230px] lg:h-[230px] relative">
                        <Image 
                            src={`/assets/logos/${heroLesson.icon.substring(1)}`} 
                            alt="" 
                            fill 
                            className="object-contain"
                        />
                      </div>
                    ) : (
                      heroLesson.icon
                    )}
                  </m.div>
                </div>
              </div>

              <div className="relative z-10 flex flex-col max-w-2xl lg:max-w-3xl translate-z-20 w-full h-full justify-end md:items-start">
                <div className="flex items-center justify-center md:justify-start space-x-3 mb-2 rtl:space-x-reverse w-full">
                  <span className="bg-white/10 backdrop-blur-3xl border border-white/20 px-3 py-1.5 rounded-full text-[10px] md:text-xs font-black tracking-wider text-white shadow-xl max-w-fit">
                    למידה יומית
                  </span>
                </div>

                <h2 className="text-3xl md:text-5xl lg:text-7xl font-serif font-bold text-white leading-[1.1] tracking-tight drop-shadow-2xl z-20 text-center md:text-right w-full">
                  {heroLesson.title}
                </h2>

                <div className="md:hidden relative flex items-center justify-center py-6 pointer-events-none z-[1]">
                  <div className="relative flex items-center justify-center scale-[0.75] origin-center transition-transform">
                    <div className="absolute -inset-28" style={{ background: `radial-gradient(circle, ${theme.glow} 0%, transparent 65%)`, mixBlendMode: 'screen' }} />
                    {floatingIcons.map((fi, i) => (
                      <m.div
                        key={i}
                        className="absolute"
                        style={{
                          left: '50%', top: '50%', 
                          x: fi.dx, y: fi.dy,
                          fontSize: `${fi.size}px`, opacity: fi.opacity,
                          willChange: 'transform, opacity',
                        }}
                        animate={{ 
                          y: [fi.dy, fi.dy - 10, fi.dy], 
                          rotate: [0, 10, 0] 
                        }}
                        transition={{ duration: fi.duration, repeat: Infinity, ease: "easeInOut" }}
                      >
                        {fi.emoji}
                      </m.div>
                    ))}
                    <m.div 
                      className="relative z-10 text-[160px] leading-none select-none opacity-90 flex items-center justify-center"
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      {heroLesson.icon?.startsWith("@") ? (
                        <div className="w-[120px] h-[120px] relative">
                          <Image 
                              src={`/assets/logos/${heroLesson.icon.substring(1)}`} 
                              alt="" 
                              fill 
                              className="object-contain"
                          />
                        </div>
                      ) : (
                        heroLesson.icon
                      )}
                    </m.div>
                  </div>
                </div>

                <p className="text-white/80 text-sm md:text-lg lg:text-xl font-medium max-w-xl md:line-clamp-3 leading-relaxed mt-2 md:mt-4 z-20 drop-shadow-md text-center md:text-right w-full">
                  {heroLesson.description}
                </p>

                <div className="pt-6 flex flex-row items-center justify-between w-full gap-2 md:gap-6 md:justify-start z-20">
                  <div 
                    className="bg-white text-black px-4 md:px-8 py-3 md:py-4 rounded-full font-black text-sm md:text-base flex items-center justify-center transition-all shadow-xl hover:scale-105 cursor-pointer flex-1 md:flex-none"
                    style={{ border: `2px solid ${theme.primary}` }}
                  >
                    התחל ללמוד <ArrowRight className="mr-1 w-4 h-4 md:mr-2 md:w-5 md:h-5 rtl:rotate-180" style={{ color: theme.primary }} />
                  </div>

                  {heroLesson.reward ? (
                      <div 
                        className="flex space-x-3 rtl:space-x-reverse items-center justify-center backdrop-blur-xl px-4 py-2.5 md:px-5 md:py-3 rounded-full border border-white/20 shrink-0 shadow-xl"
                        style={{ backgroundColor: `${theme.primary}30` }}
                      >
                        <div className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/10 shadow-inner">
                          {heroLesson.reward.type === 'badge' && <span className="text-xl md:text-2xl drop-shadow-md leading-none">🎖️</span>}
                          {heroLesson.reward.type === 'unlock' && <span className="text-xl md:text-2xl drop-shadow-md leading-none">🔑</span>}
                          {heroLesson.reward.type === 'xp' && <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-yellow-400 drop-shadow-md" />}
                        </div>
                        
                        <div className="flex flex-col text-right">
                          <span className="text-white/70 text-[9px] md:text-[10px] font-black tracking-widest leading-none mb-1">
                            {heroLesson.reward.type === 'badge' ? 'תג הישג' : heroLesson.reward.type === 'unlock' ? 'פתיחת יכולת' : 'צמיחה'}
                          </span>
                          <span className="text-white font-black text-sm md:text-lg leading-none whitespace-nowrap drop-shadow-sm">
                            {heroLesson.reward.label || `+${heroLesson.reward.value} XP`}
                          </span>
                        </div>
                      </div>
                  ) : null}
                </div>
              </div>
            </m.div>
          </Link>
        </section>
    );
}


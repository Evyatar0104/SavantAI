"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, ChevronLeft, Crosshair, Flame, Gem, Sparkles } from "lucide-react";
import { m } from "framer-motion";
import { haptics } from "@/lib/haptics";
import { isNavigationItemActive, NAVIGATION_ITEMS, NAVIGATION_ROUTES } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { useSavantStore } from "@/store/useSavantStore";

function useNavigationVisibility() {
  const pathname = usePathname();
  const isFocusedFlow = pathname?.startsWith("/lesson") || pathname === "/quiz" || pathname?.includes("/practice/builder/") || pathname?.startsWith("/paths/") || pathname?.startsWith("/courses/");
  return { pathname, isFocusedFlow };
}

export function DesktopNavigation() {
  const { pathname, isFocusedFlow } = useNavigationVisibility();
  const userName = useSavantStore((state) => state.userName);
  const xp = useSavantStore((state) => state.xp);
  const streak = useSavantStore((state) => state.streak);
  const completedLessons = useSavantStore((state) => state.completedLessons);
  const level = Math.floor(xp / 500) + 1;
  const levelProgress = ((xp % 500) / 500) * 100;

  if (isFocusedFlow) return null;

  return (
    <aside dir="rtl" className="relative z-40 hidden h-[100dvh] w-[252px] shrink-0 flex-col overflow-hidden border-l border-white/[0.07] bg-[#0d0f1a]/92 lg:flex">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-[radial-gradient(circle_at_80%_0%,rgba(117,107,224,0.13),transparent_68%)]" />

      <Link href="/" onClick={() => haptics.tap()} className="relative mx-3 mt-4 flex min-h-12 items-center gap-3 rounded-2xl px-3" aria-label="Savant — דף הבית">
        <Image src="/assets/savant-logo.png" alt="" width={36} height={36} priority className="size-9 object-contain" />
        <div>
          <p className="text-lg font-black tracking-tight text-white">Savant</p>
          <p className="text-[10px] font-semibold text-zinc-500">AI ברור. צעד אחר צעד.</p>
        </div>
      </Link>

      <nav aria-label="ניווט ראשי" className="relative mt-6 flex flex-col gap-1 px-3">
        {NAVIGATION_ITEMS.map((item, index) => {
          const active = isNavigationItemActive(pathname, item.href);
          const Icon = item.icon;
          return (
            <m.div key={item.href} whileHover={active ? undefined : { x: -2 }} transition={{ duration: 0.18 }} style={{ willChange: "transform" }}>
              {index === 3 && <div className="my-2.5 border-t border-white/[0.06]" />}
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                onClick={() => haptics.tap()}
                className={cn("group relative flex min-h-11 items-center gap-3 rounded-xl px-3.5 text-sm font-bold transition-colors", active ? "bg-violet-500/13 text-white shadow-[inset_0_0_0_1px_rgba(139,92,246,0.08)]" : "text-zinc-400 hover:bg-white/[0.045] hover:text-white")}
              >
                {active && <m.span initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} className="absolute inset-y-2 right-0 w-1 origin-center rounded-full bg-violet-400" style={{ willChange: "transform" }} />}
                <Icon className={cn("size-5", active && "text-violet-300")} strokeWidth={active ? 2.5 : 2} />
                <span>{item.label}</span>
              </Link>
            </m.div>
          );
        })}
      </nav>

      <div className="relative mt-5 space-y-2.5 px-3">
        <m.div whileHover={{ y: -2 }} whileTap={{ scale: 0.99 }} transition={{ duration: 0.18 }} style={{ willChange: "transform" }}>
          <Link href="/profile" onClick={() => haptics.tap()} className="block rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4 transition-colors hover:border-violet-400/20 hover:bg-white/[0.05]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold text-zinc-500">ההתקדמות שלי</p>
                <p className="mt-1 text-sm font-black text-white">רמה {level}</p>
              </div>
              <span className="text-sm font-black text-violet-300">{xp.toLocaleString()} XP</span>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
              <m.div initial={false} animate={{ width: `${levelProgress}%` }} transition={{ duration: 0.45 }} className="h-full rounded-full bg-gradient-to-l from-violet-400 to-indigo-500" />
            </div>
            <div className="mt-3 flex items-center justify-between text-[10px] font-bold text-zinc-500">
              <span className="flex items-center gap-1"><BookOpen className="size-3 text-violet-300" />{completedLessons.length} שיעורים</span>
              <span className="flex items-center gap-1"><Flame className="size-3 text-orange-400" />{streak} ימים</span>
            </div>
          </Link>
        </m.div>

        <Link href="/vault" onClick={() => haptics.tap()} className="group flex min-h-11 items-center justify-between rounded-xl px-3 text-xs font-bold text-zinc-500 transition-colors hover:bg-white/[0.035] hover:text-white">
          <span className="flex items-center gap-2"><Gem className="size-4 text-amber-300" />כספת ההישגים</span>
          <ChevronLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
        </Link>

        <m.div whileHover={{ y: -2 }} transition={{ duration: 0.18 }} style={{ willChange: "transform" }}>
          <Link href="/practice" onClick={() => haptics.tap()} className="group block rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.045] p-3.5 transition-colors hover:border-emerald-400/20 hover:bg-emerald-400/[0.07]">
            <div className="flex items-center justify-between">
              <span className="flex size-8 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300"><Crosshair className="size-4" /></span>
              <span className="text-[9px] font-black text-emerald-300">3–10 דקות</span>
            </div>
            <p className="mt-3 text-xs font-black text-white">תרגול קטן. קפיצה גדולה.</p>
            <span className="mt-1.5 flex items-center gap-1 text-[10px] font-bold text-zinc-500 group-hover:text-zinc-300">לבחירת משימה<ChevronLeft className="size-3 transition-transform group-hover:-translate-x-0.5" /></span>
          </Link>
        </m.div>
      </div>

      <Link href="/profile" onClick={() => haptics.tap()} className="group m-3 mt-auto rounded-2xl border border-white/[0.08] bg-[#131525]/80 p-3.5 transition-colors hover:border-white/[0.13] hover:bg-[#17192b]">
        <div className="flex items-center gap-3">
          <div className="relative flex size-10 items-center justify-center rounded-xl bg-violet-500/15 text-sm font-black text-violet-200">
            {(userName || "ל").charAt(0)}
            <span className="absolute -bottom-0.5 -left-0.5 size-2.5 rounded-full border-2 border-[#131525] bg-emerald-400" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-white">{userName || "לומד/ת"}</p>
            <span className="mt-0.5 flex items-center gap-1 text-[10px] font-bold text-zinc-500"><Sparkles className="size-3 text-violet-300" />ממשיכים לצבור ידע</span>
          </div>
          <ChevronLeft className="mr-auto size-4 text-zinc-600 transition-transform group-hover:-translate-x-0.5 group-hover:text-zinc-300" />
        </div>
      </Link>
    </aside>
  );
}

export function MobileNavigation() {
  const { pathname } = useNavigationVisibility();
  if (!NAVIGATION_ROUTES.includes(pathname ?? "")) return null;

  return (
    <m.nav
      dir="rtl"
      aria-label="ניווט ראשי"
      initial={{ y: 24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      style={{ willChange: "transform" }}
      className="fixed inset-x-3 bottom-[calc(0.75rem+env(safe-area-inset-bottom))] z-50 mx-auto flex max-w-md items-center justify-around rounded-2xl border border-white/10 bg-[#111322]/94 p-1.5 shadow-[0_18px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl lg:hidden"
    >
      {NAVIGATION_ITEMS.map((item) => {
        const active = isNavigationItemActive(pathname, item.href);
        const Icon = item.icon;
        return (
          <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined} onClick={() => haptics.tap()} className={cn("relative flex min-h-14 min-w-14 flex-col items-center justify-center gap-1 rounded-xl px-2 text-[10px] font-bold", active ? "text-violet-200" : "text-zinc-500")}>
            {active && <m.span initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} className="absolute inset-0 rounded-xl bg-violet-400/12" style={{ willChange: "transform" }} />}
            <Icon className="relative z-10 size-5" strokeWidth={active ? 2.6 : 2} />
            <span className="relative z-10">{item.shortLabel}</span>
          </Link>
        );
      })}
    </m.nav>
  );
}
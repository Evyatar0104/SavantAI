"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, BookOpen, Check, Edit2, Flame, Info, Layers3, Palette, RotateCcw, Sparkles, Target, Trophy, X, Zap } from "lucide-react";
import { AnimatePresence, m } from "framer-motion";
import { BADGES, isBadgeEarned, type Badge } from "@/content/badges";
import { AchievementCard } from "@/components/AchievementCard";
import { BadgeCard } from "@/components/BadgeCard";
import { GlassCard, IconButton, PageShell, ProgressBar, SectionHeader, StatusChip } from "@/components/ui/Primitives";
import { learningPaths, type LearningPath } from "@/data/learningPaths";
import { haptics } from "@/lib/haptics";
import { getLevelInfo, MODEL_THEMES, QUIZ_MODEL_NAMES, TOOL_EMOJIS, TOOL_LOGOS } from "@/lib/userTheme";
import { cn } from "@/lib/utils";
import { useSavantStore } from "@/store/useSavantStore";

const USER_COLORS = ["#6366F1", "#14B8A6", "#EC4899", "#F97316", "#F59E0B", "#A855F7", "#10B981", "#3B82F6"];

export default function Profile() {
  const router = useRouter();
  const xp = useSavantStore((state) => state.xp);
  const streak = useSavantStore((state) => state.streak);
  const completedLessons = useSavantStore((state) => state.completedLessons);
  const completedCourses = useSavantStore((state) => state.completedCourses);
  const primaryModel = useSavantStore((state) => state.primaryModel);
  const secondaryModel = useSavantStore((state) => state.secondaryModel);
  const primaryModelReason = useSavantStore((state) => state.primaryModelReason);
  const specialistTools = useSavantStore((state) => state.specialistTools);
  const profileTitle = useSavantStore((state) => state.profileTitle);
  const quizCompleted = useSavantStore((state) => state.quizCompleted);
  const achievements = useSavantStore((state) => state.achievements);
  const badges = useSavantStore((state) => state.badges);
  const userName = useSavantStore((state) => state.userName);
  const userColor = useSavantStore((state) => state.userColor);
  const setUserName = useSavantStore((state) => state.setUserName);
  const setUserColor = useSavantStore((state) => state.setUserColor);
  const resetPreferences = useSavantStore((state) => state.resetPreferences);
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(userName || "");
  const [showColors, setShowColors] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { level, progress, xpToNext } = useMemo(() => getLevelInfo(xp), [xp]);
  const theme = MODEL_THEMES[primaryModel || "default"] || MODEL_THEMES.default;
  const accent = userColor || theme.primary || "#534AB7";
  const displayName = userName || "לומד/ת";
  const totalCards = learningPaths.length + BADGES.length;
  const earnedCards = achievements.length + badges.length;
  const collectionProgress = totalCards ? (earnedCards / totalCards) * 100 : 0;

  const nextStep = !quizCompleted
    ? { href: "/quiz", eyebrow: "הצעד הבא", title: "לבנות את הסטאק האישי", description: "כמה שאלות קצרות יתאימו לך מודל וכלים.", action: "להתחלת האפיון" }
    : completedLessons.length === 0
      ? { href: "/courses", eyebrow: "הצעד הבא", title: "להתחיל שיעור ראשון", description: "שלוש דקות יספיקו כדי להניע את המסלול.", action: "לבחירת שיעור" }
      : { href: "/practice", eyebrow: "הצעד הבא", title: "להפוך ידע להרגל", description: "משימה מעשית קצרה תחבר את מה שלמדת לעבודה אמיתית.", action: "לזירת התרגול" };

  const saveName = () => {
    setUserName(nameInput.trim());
    setIsEditingName(false);
    haptics.success();
  };

  const resetProfile = () => {
    resetPreferences();
    haptics.tap();
    router.push("/quiz");
  };

  const badgeContext = { badges, completedLessons, completedCourses, streak, quizCompleted };
  const cardItems: Array<{ type: "path"; item: LearningPath } | { type: "badge"; item: Badge }> = [
    ...learningPaths.map((item) => ({ type: "path" as const, item })),
    ...BADGES.map((item) => ({ type: "badge" as const, item })),
  ];

  return (
    <PageShell className="space-y-8 lg:space-y-10">
      <m.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden rounded-3xl border border-white/[0.1] bg-[linear-gradient(135deg,rgba(28,30,54,0.95),rgba(15,17,31,0.96))] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.25)] sm:p-7"
        style={{ willChange: "transform" }}
        dir="rtl"
      >
        <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-36 size-96 rounded-full opacity-25 blur-3xl" style={{ backgroundColor: accent }} />
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-white/35 to-transparent" />

        <div className="relative flex flex-col gap-5 border-b border-white/[0.07] pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-black text-violet-300">המרכז האישי</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">הפרופיל שלי</h1>
            <p className="mt-2 text-sm leading-6 text-zinc-400">כל ההתקדמות, הכלים וההישגים שלך במקום אחד.</p>
          </div>
          <Link href="/vault" onClick={() => haptics.tap()} className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.05] px-4 text-sm font-black text-white transition-colors hover:border-amber-300/25 hover:bg-amber-300/[0.07]">
            <Trophy className="size-4 text-amber-300" />לאוסף המלא<ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
          </Link>
        </div>

        <div className="relative grid gap-6 pt-6 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center">
          <m.button
            whileHover={{ scale: 1.03, rotate: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => { haptics.tap(); setShowColors((value) => !value); }}
            aria-label="בחירת צבע לפרופיל"
            className="relative flex size-24 shrink-0 items-center justify-center rounded-3xl border border-white/15 bg-[#0d0f1a] text-4xl font-black"
            style={{ color: accent, boxShadow: `0 18px 50px ${accent}25`, willChange: "transform" }}
          >
            {(userName || "ל").charAt(0).toUpperCase()}
            <span className="absolute -bottom-2 -left-2 flex size-9 items-center justify-center rounded-2xl bg-white text-xs font-black text-[#0d0f1a]">{level}</span>
            <span className="absolute -right-1 -top-1 size-3 rounded-full border-2 border-[#141629] bg-emerald-400" />
          </m.button>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              {isEditingName ? (
                <div className="flex w-full max-w-md items-center gap-2">
                  <input ref={inputRef} value={nameInput} onChange={(event) => setNameInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") saveName(); if (event.key === "Escape") setIsEditingName(false); }} className="min-h-11 min-w-0 flex-1 rounded-2xl border border-white/10 bg-white/[0.05] px-4 text-lg font-black text-white outline-none focus:border-violet-400/45" aria-label="שם תצוגה" />
                  <IconButton label="שמירת השם" onClick={saveName}><Check className="size-4" /></IconButton>
                  <IconButton label="ביטול עריכה" onClick={() => setIsEditingName(false)}><X className="size-4" /></IconButton>
                </div>
              ) : (
                <>
                  <h2 className="text-3xl font-black text-white">{displayName}</h2>
                  <IconButton label="עריכת השם" onClick={() => { setNameInput(userName || ""); setIsEditingName(true); window.setTimeout(() => inputRef.current?.focus(), 0); }}><Edit2 className="size-4" /></IconButton>
                </>
              )}
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              <StatusChip tone="accent">רמה {level}</StatusChip>
              <StatusChip>{profileTitle || "מתחיל/ה"}</StatusChip>
              {quizCompleted && primaryModel && <StatusChip tone="success">האפיון הושלם</StatusChip>}
            </div>
            <ProgressBar value={progress} label={`${xpToNext} XP לרמה הבאה`} accent={accent} className="mt-5 max-w-xl" />
          </div>

          <div className="grid grid-cols-3 gap-2 lg:w-[330px]">
            {[
              { label: "XP", value: xp.toLocaleString(), icon: Sparkles, color: "text-amber-300" },
              { label: "רצף", value: streak, icon: Flame, color: "text-orange-400" },
              { label: "שיעורים", value: completedLessons.length, icon: BookOpen, color: "text-violet-300" },
            ].map((stat) => (
              <m.div key={stat.label} whileHover={{ y: -2 }} transition={{ duration: 0.18 }} className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-3 text-center" style={{ willChange: "transform" }}>
                <stat.icon className={cn("mx-auto size-4", stat.color)} />
                <p className="mt-2 truncate text-lg font-black text-white">{stat.value}</p>
                <p className="text-[9px] font-bold text-zinc-500">{stat.label}</p>
              </m.div>
            ))}
          </div>
        </div>

        <AnimatePresence>
          {showColors && (
            <m.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="relative mt-6 rounded-2xl border border-white/10 bg-black/15 p-4" style={{ willChange: "transform" }}>
              <div className="mb-3 flex items-center gap-2 text-sm font-black text-white"><Palette className="size-4 text-violet-300" />בחר צבע לפרופיל</div>
              <div className="flex flex-wrap gap-3">
                {USER_COLORS.map((color) => (
                  <m.button key={color} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.9 }} onClick={() => { setUserColor(color); setShowColors(false); haptics.tap(); }} aria-label={`בחירת צבע ${color}`} className={cn("size-11 rounded-full border-2", accent === color ? "border-white" : "border-transparent")} style={{ backgroundColor: color, boxShadow: accent === color ? `0 0 20px ${color}` : "none", willChange: "transform" }} />
                ))}
              </div>
            </m.div>
          )}
        </AnimatePresence>
      </m.header>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(300px,0.62fr)] xl:items-start">
        <section className="space-y-4">
          <SectionHeader title="הסטאק שלי" description="הכלים שהכי מתאימים לצורת העבודה שלך" action={quizCompleted ? <button onClick={() => { haptics.tap(); setShowResetModal(true); }} className="inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-xs font-black text-zinc-400 transition-colors hover:bg-white/[0.04] hover:text-white"><RotateCcw className="size-4" />אפיון מחדש</button> : undefined} />
          {quizCompleted && primaryModel ? (
            <div className="grid gap-4 md:grid-cols-2">
              <m.div whileHover={{ y: -2 }} transition={{ duration: 0.18 }} className="md:row-span-2" style={{ willChange: "transform" }}>
                <GlassCard className="relative h-full overflow-hidden">
                  <div aria-hidden="true" className="absolute inset-0 opacity-20" style={{ background: `radial-gradient(circle at 85% 0%, ${theme.primary}, transparent 55%)` }} />
                  <div className="relative">
                    <div className="flex items-center gap-3">
                      <div className="flex size-14 items-center justify-center rounded-2xl bg-white/[0.07]"><Image src={`/assets/logos/${primaryModel}.png`} alt="" width={40} height={40} className="size-10 object-contain" /></div>
                      <div><p className="text-xs font-bold text-violet-300">המודל הראשי</p><h3 className="text-xl font-black text-white">{QUIZ_MODEL_NAMES[primaryModel]}</h3></div>
                    </div>
                    <p className="mt-6 text-sm leading-7 text-zinc-400">{primaryModelReason || "המודל שמתאים בצורה הטובה ביותר לצרכים ולסגנון העבודה שבחרת."}</p>
                    <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/[0.07] px-3 py-1.5 text-xs font-bold text-emerald-300"><Target className="size-3.5" />הבחירה המומלצת עבורך</div>
                  </div>
                </GlassCard>
              </m.div>

              {secondaryModel && (
                <m.div whileHover={{ y: -2 }} transition={{ duration: 0.18 }} style={{ willChange: "transform" }}>
                  <GlassCard className="h-full">
                    <div className="flex items-center gap-3"><div className="flex size-11 items-center justify-center rounded-2xl bg-white/[0.06]"><Image src={`/assets/logos/${secondaryModel}.png`} alt="" width={30} height={30} className="size-8 object-contain" /></div><div><p className="text-[10px] font-bold text-zinc-500">מודל משלים</p><h3 className="font-black text-white">{QUIZ_MODEL_NAMES[secondaryModel]}</h3></div></div>
                  </GlassCard>
                </m.div>
              )}

              <m.div whileHover={{ y: -2 }} transition={{ duration: 0.18 }} style={{ willChange: "transform" }}>
                <GlassCard className="h-full">
                  <p className="text-xs font-black text-zinc-500">כלים מומלצים</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {specialistTools.length > 0 ? specialistTools.map((tool) => <span key={tool} className="inline-flex min-h-8 items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.05] px-3 text-xs font-bold text-zinc-300">{TOOL_LOGOS[tool] ? <Image src={TOOL_LOGOS[tool]} alt="" width={14} height={14} className="size-3.5 object-contain" /> : TOOL_EMOJIS[tool] || <Zap className="size-3.5" />}{tool}</span>) : <span className="text-sm text-zinc-500">אין כלים נוספים כרגע</span>}
                  </div>
                </GlassCard>
              </m.div>
            </div>
          ) : (
            <GlassCard className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div><h3 className="font-black text-white">עוד לא בנינו את הסטאק שלך</h3><p className="mt-1 text-sm text-zinc-500">שאלון קצר יתאים לך מודל ראשי וכלים משלימים.</p></div>
              <Link href="/quiz" onClick={() => haptics.tap()} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[#534AB7] px-5 text-sm font-black text-white"><Sparkles className="size-4" />להתחלת האפיון</Link>
            </GlassCard>
          )}
        </section>

        <aside className="space-y-4 xl:sticky xl:top-6">
          <GlassCard level="strong">
            <div className="flex items-center justify-between"><div><p className="text-xs font-black text-violet-300">תמונת מצב</p><h2 className="mt-1 text-xl font-black text-white">המומנטום שלך</h2></div><Layers3 className="size-6 text-violet-300" /></div>
            <div className="mt-6 space-y-5">
              <ProgressBar value={Math.min(100, completedLessons.length * 2)} label="שיעורים" />
              <ProgressBar value={Math.min(100, completedCourses.length * 8)} label="קורסים" accent="#10b981" />
              <ProgressBar value={collectionProgress} label="אוסף" accent="#f59e0b" />
            </div>
          </GlassCard>

          <m.div whileHover={{ y: -2 }} transition={{ duration: 0.18 }} style={{ willChange: "transform" }}>
            <Link href={nextStep.href} onClick={() => haptics.tap()} className="group block rounded-2xl border border-violet-400/15 bg-violet-400/[0.07] p-5 transition-colors hover:border-violet-400/25 hover:bg-violet-400/[0.1]">
              <div className="flex size-10 items-center justify-center rounded-xl bg-violet-400/12 text-violet-300"><Target className="size-5" /></div>
              <p className="mt-5 text-xs font-black text-violet-300">{nextStep.eyebrow}</p>
              <h2 className="mt-1 text-lg font-black text-white">{nextStep.title}</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-400">{nextStep.description}</p>
              <span className="mt-5 inline-flex items-center gap-1 text-sm font-black text-white">{nextStep.action}<ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" /></span>
            </Link>
          </m.div>
        </aside>
      </div>

      <section className="space-y-4">
        <SectionHeader title="קלפים והישגים" description={`${earnedCards} מתוך ${totalCards} נאספו`} action={<Link href="/vault" onClick={() => haptics.tap()} className="group inline-flex min-h-11 items-center gap-1 text-sm font-black text-violet-300">לכל האוסף<ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" /></Link>} />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {cardItems.map(({ type, item }) => type === "path"
            ? <AchievementCard key={item.id} path={item} earned={achievements.includes(item.id)} onClick={() => achievements.includes(item.id) && haptics.tap()} />
            : <BadgeCard key={item.id} badge={item} earned={isBadgeEarned(item.id, badgeContext)} onClick={() => { if (isBadgeEarned(item.id, badgeContext)) { haptics.tap(); router.push(`/vault/${item.id}?from=profile`); } }} />)}
        </div>
      </section>

      <AnimatePresence>
        {showResetModal && (
          <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm" dir="rtl">
            <m.div initial={{ opacity: 0, y: 18, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 18, scale: 0.96 }} className="w-full max-w-md rounded-2xl border border-white/10 bg-[#16182b] p-6 shadow-2xl" style={{ willChange: "transform" }}>
              <div className="flex items-start justify-between"><div className="flex size-12 items-center justify-center rounded-2xl bg-red-400/10 text-red-300"><Info className="size-5" /></div><IconButton label="סגירת החלון" onClick={() => setShowResetModal(false)}><X className="size-4" /></IconButton></div>
              <h2 className="mt-6 text-2xl font-black text-white">לאפס את האפיון?</h2>
              <p className="mt-3 text-sm leading-7 text-zinc-400">ההמלצות והעדפות הכלים יאופסו. ה־XP, הקורסים והקלפים שלך יישמרו.</p>
              <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row"><button onClick={() => { haptics.tap(); setShowResetModal(false); }} className="min-h-12 flex-1 rounded-2xl border border-white/10 bg-white/[0.05] text-sm font-black text-zinc-300">ביטול</button><button onClick={resetProfile} className="min-h-12 flex-1 rounded-2xl bg-red-500 text-sm font-black text-white">אישור ואיפוס</button></div>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </PageShell>
  );
}
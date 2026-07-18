"use client";

import { useEffect, useMemo, useState } from "react";
import { m, type Variants } from "framer-motion";
import { Crown, Medal, Sparkles, Trophy } from "lucide-react";
import { useSavantStore } from "@/store/useSavantStore";
import { GlassCard, PageHeader, PageShell, Skeleton, StatusChip } from "@/components/ui/Primitives";
import { cn } from "@/lib/utils";

interface LeaderboardEntry {
  id: string;
  name: string;
  xp: number;
  avatar: string;
  badges: string[];
  isCurrentUser?: boolean;
}

const CURRENT_USER_ID = "current-user-id";

const FALLBACK_LEADERBOARD: LeaderboardEntry[] = [
  { id: "1", name: "נועה לוי", xp: 12500, avatar: "👑", badges: ["🧠", "🏛️"] },
  { id: "2", name: "יואב כהן", xp: 11200, avatar: "🚀", badges: ["🎓"] },
  { id: "3", name: "מאיה רז", xp: 9800, avatar: "💡", badges: ["🤖", "🧠"] },
  { id: "4", name: "איתי בר", xp: 7400, avatar: "🧑‍💻", badges: ["💻"] },
  { id: "5", name: "רוני גל", xp: 6150, avatar: "✨", badges: ["⚡"] },
];

const listVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.045 } },
};

const rowVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.28 } },
};

function createFallbackData(xp: number, userName: string): LeaderboardEntry[] {
  return [
    ...FALLBACK_LEADERBOARD,
    { id: CURRENT_USER_ID, name: userName, xp, avatar: "🧑‍🎓", badges: ["🎯"], isCurrentUser: true },
  ].sort((a, b) => b.xp - a.xp);
}

function rankTone(rank: number) {
  if (rank === 1) return "border-amber-300/35 bg-amber-300/10 text-amber-200";
  if (rank === 2) return "border-zinc-300/25 bg-zinc-300/10 text-zinc-200";
  return "border-orange-300/20 bg-orange-300/10 text-orange-200";
}

export default function LeaderboardPage() {
  const xp = useSavantStore((state) => state.xp);
  const storedName = useSavantStore((state) => state.userName);
  const userName = storedName || "החשבון שלי";
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    let cancelled = false;

    async function initLeaderboard() {
      try {
        const [{ db }, firestore] = await Promise.all([
          import("@/lib/firebase"),
          import("firebase/firestore"),
        ]);
        if (cancelled) return;
        if (!db) {
          setLeaderboardData(createFallbackData(xp, userName));
          setLoading(false);
          return;
        }

        const userRef = firestore.doc(db, "users", CURRENT_USER_ID);
        await firestore.setDoc(userRef, { name: userName, xp, avatar: "🧑‍🎓", badges: ["🎯"] }, { merge: true });
        if (cancelled) return;

        const usersQuery = firestore.query(
          firestore.collection(db, "users"),
          firestore.orderBy("xp", "desc"),
          firestore.limit(25),
        );

        unsubscribe = firestore.onSnapshot(usersQuery, (snapshot) => {
          const entries = snapshot.docs.map((entry) => ({
            id: entry.id,
            ...entry.data(),
            isCurrentUser: entry.id === CURRENT_USER_ID,
          })) as LeaderboardEntry[];
          setLeaderboardData(entries.length > 0 ? entries : createFallbackData(xp, userName));
          setLoading(false);
        });
      } catch {
        if (!cancelled) {
          setLeaderboardData(createFallbackData(xp, userName));
          setLoading(false);
        }
      }
    }

    initLeaderboard();
    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, [userName, xp]);

  const rankedEntries = useMemo(
    () => leaderboardData.map((entry, index) => ({ ...entry, rank: index + 1 })),
    [leaderboardData],
  );
  const topThree = rankedEntries.slice(0, 3);
  const currentUser = rankedEntries.find((entry) => entry.isCurrentUser);

  return (
    <PageShell width="wide" className="pb-28">
      <PageHeader
        eyebrow="קהילת Savant"
        title="טבלת המובילים"
        description="צוברים XP דרך שיעורים ותרגול. ההתקדמות שלך חשובה יותר מהמקום בטבלה."
        actions={<StatusChip tone="warning"><Trophy className="ml-1.5 size-3.5" />הדירוג מתעדכן בזמן אמת</StatusChip>}
      />

      {loading ? (
        <div className="mt-10 grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-4">
            <Skeleton className="h-56" />
            <Skeleton className="h-96" />
          </div>
          <Skeleton className="h-64" />
        </div>
      ) : (
        <div className="mt-10 grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
          <main className="min-w-0 space-y-6">
            <section aria-labelledby="podium-title">
              <div className="mb-4 flex items-center gap-2">
                <Crown className="size-5 text-amber-300" />
                <h2 id="podium-title" className="text-xl font-black text-white">שלושת המובילים</h2>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {topThree.map((entry) => (
                  <m.article
                    key={entry.id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: (entry.rank - 1) * 0.06 }}
                    className={cn("relative overflow-hidden rounded-2xl border p-5", rankTone(entry.rank), entry.rank === 1 && "sm:-translate-y-2")}
                    style={{ willChange: "transform" }}
                    dir="rtl"
                  >
                    <div className="absolute -left-10 -top-10 size-32 rounded-full bg-current opacity-[0.06] blur-2xl" />
                    <div className="relative flex items-start justify-between gap-3">
                      <div className="flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-black/20 text-2xl">{entry.avatar}</div>
                      <span className="text-3xl font-black opacity-70">#{entry.rank}</span>
                    </div>
                    <h3 className="relative mt-5 truncate text-lg font-black text-white">{entry.name}</h3>
                    <p className="relative mt-1 text-sm font-bold">{entry.xp.toLocaleString("he-IL")} XP</p>
                  </m.article>
                ))}
              </div>
            </section>

            <GlassCard className="overflow-hidden p-0 sm:p-0">
              <div className="grid grid-cols-[52px_minmax(0,1fr)_auto] gap-3 border-b border-white/[0.07] px-4 py-3 text-xs font-bold text-zinc-500 sm:grid-cols-[64px_minmax(0,1fr)_120px_120px] sm:px-6">
                <span>מקום</span><span>לומד/ת</span><span className="hidden sm:block">הישגים</span><span className="text-left">XP</span>
              </div>
              <m.div variants={listVariants} initial="hidden" animate="show" className="divide-y divide-white/[0.06]">
                {rankedEntries.map((entry) => (
                  <m.div
                    key={entry.id}
                    variants={rowVariants}
                    className={cn("grid min-h-18 grid-cols-[52px_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:grid-cols-[64px_minmax(0,1fr)_120px_120px] sm:px-6", entry.isCurrentUser && "bg-violet-400/[0.09]")}
                    style={{ willChange: "transform" }}
                  >
                    <span className={cn("font-black", entry.rank <= 3 ? "text-amber-300" : "text-zinc-500")}>#{entry.rank}</span>
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.06] text-xl">{entry.avatar}</span>
                      <div className="min-w-0">
                        <p className="truncate font-bold text-white">{entry.name}</p>
                        {entry.isCurrentUser && <p className="text-xs text-violet-300">זה החשבון שלך</p>}
                      </div>
                    </div>
                    <div className="hidden items-center gap-1 sm:flex">
                      {entry.badges.slice(0, 3).map((badge, index) => <span key={`${entry.id}-${index}`} className="text-lg" aria-hidden="true">{badge}</span>)}
                    </div>
                    <span className="text-left font-black text-white">{entry.xp.toLocaleString("he-IL")}</span>
                  </m.div>
                ))}
              </m.div>
            </GlassCard>
          </main>

          <aside className="xl:sticky xl:top-8">
            <GlassCard level="strong" className="overflow-hidden">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-violet-400/12 text-violet-300"><Medal className="size-6" /></div>
              <p className="mt-5 text-sm font-bold text-zinc-500">הדירוג שלך</p>
              <p className="mt-1 text-4xl font-black text-white">#{currentUser?.rank || "—"}</p>
              <div className="mt-5 flex items-end justify-between gap-4 border-t border-white/[0.08] pt-5">
                <div>
                  <p className="text-sm text-zinc-500">XP שנצבר</p>
                  <p className="mt-1 text-2xl font-black text-violet-300">{xp.toLocaleString("he-IL")}</p>
                </div>
                <Sparkles className="size-7 text-violet-300" />
              </div>
              <p className="mt-5 text-sm leading-6 text-zinc-400">כל שיעור ותרגול מקדמים אותך. אין צורך לרדוף אחרי המקום הראשון — מספיק לשמור על רצף.</p>
            </GlassCard>
          </aside>
        </div>
      )}
    </PageShell>
  );
}
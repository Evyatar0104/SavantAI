"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { m } from "framer-motion";
import { ArrowLeft, TrendingUp, Trophy } from "lucide-react";
import { haptics } from "@/lib/haptics";

interface RankedUser {
  id: string;
  xp: number;
}

interface HomeLeaderboardCardProps {
  xp: number;
}

const CURRENT_USER_ID = "current-user-id";
const FALLBACK_XP = [12500, 11200, 9800, 7400, 6150];

function rankUsers(users: RankedUser[], xp: number) {
  const withCurrentUser = users.some((user) => user.id === CURRENT_USER_ID)
    ? users
    : [...users, { id: CURRENT_USER_ID, xp }];
  const ranked = [...withCurrentUser].sort((a, b) => b.xp - a.xp);
  const index = ranked.findIndex((user) => user.id === CURRENT_USER_ID);
  const currentRank = index >= 0 ? index + 1 : ranked.length;
  const nextUser = currentRank > 1 ? ranked[currentRank - 2] : undefined;
  return { rank: currentRank, total: ranked.length, gap: nextUser ? Math.max(0, nextUser.xp - xp + 1) : 0 };
}

export function HomeLeaderboardCard({ xp }: HomeLeaderboardCardProps) {
  const fallbackUsers = useMemo(() => FALLBACK_XP.map((score, index) => ({ id: `fallback-${index}`, xp: score })), []);
  const [ranking, setRanking] = useState(() => rankUsers(fallbackUsers, xp));

  useEffect(() => {
    setRanking(rankUsers(fallbackUsers, xp));
    let unsubscribe: (() => void) | undefined;
    let cancelled = false;

    async function connectLeaderboard() {
      try {
        const [{ db }, firestore] = await Promise.all([import("@/lib/firebase"), import("firebase/firestore")]);
        if (!db || cancelled) return;
        const usersQuery = firestore.query(firestore.collection(db, "users"), firestore.orderBy("xp", "desc"), firestore.limit(25));
        unsubscribe = firestore.onSnapshot(usersQuery, (snapshot) => {
          if (cancelled) return;
          const users = snapshot.docs.map((entry) => ({ id: entry.id, xp: Number(entry.data().xp) || 0 }));
          setRanking(rankUsers(users.length > 0 ? users : fallbackUsers, xp));
        });
      } catch {
        if (!cancelled) setRanking(rankUsers(fallbackUsers, xp));
      }
    }

    connectLeaderboard();
    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, [fallbackUsers, xp]);

  const positionPercent = ranking.total > 1 ? Math.max(8, 100 - ((ranking.rank - 1) / (ranking.total - 1)) * 92) : 100;

  return (
    <Link href="/leaderboard" onClick={() => haptics.tap()} className="block h-full" dir="rtl">
      <m.article whileHover={{ y: -3 }} whileTap={{ scale: 0.99 }} className="interactive-surface group relative flex h-full min-h-48 flex-col overflow-hidden rounded-3xl border border-amber-300/15 bg-[radial-gradient(circle_at_10%_10%,rgba(245,158,11,0.18),transparent_40%),rgba(21,23,37,0.92)] p-5" style={{ willChange: "transform" }}>
        <div aria-hidden="true" className="absolute -left-10 -top-10 size-32 rounded-full bg-orange-400/15 blur-3xl" />
        <div className="relative flex items-center justify-between">
          <span className="flex size-11 items-center justify-center rounded-2xl border border-amber-300/20 bg-amber-400/10 text-amber-300"><Trophy className="size-5" /></span>
          <span className="rounded-full border border-amber-300/20 bg-amber-400/10 px-3 py-1 text-[10px] font-black text-amber-200">דירוג חי</span>
        </div>
        <div className="relative mt-5 flex items-end justify-between gap-4">
          <div><p className="text-xs font-bold text-zinc-500">המיקום שלך</p><p className="mt-1 text-4xl font-black text-white">#{ranking.rank}</p></div>
          <div className="text-left"><p className="text-xs font-bold text-zinc-500">הניקוד שלך</p><p className="mt-1 text-xl font-black text-amber-200">{xp.toLocaleString("he-IL")} XP</p></div>
        </div>
        <div className="relative mt-5">
          <div className="h-2 overflow-hidden rounded-full bg-white/[0.07]"><m.div initial={false} animate={{ width: `${positionPercent}%` }} transition={{ duration: 0.55 }} className="h-full rounded-full bg-gradient-to-l from-yellow-300 via-amber-400 to-orange-500" /></div>
          <div className="mt-2 flex items-center justify-between text-[10px] font-bold text-zinc-500"><span>#{ranking.total}</span><span>#1</span></div>
        </div>
        <div className="relative mt-auto flex items-center justify-between pt-5 text-xs font-black">
          <span className="inline-flex items-center gap-1.5 text-amber-200"><TrendingUp className="size-3.5" />{ranking.gap > 0 ? `עוד ${ranking.gap.toLocaleString("he-IL")} XP לעלייה` : "אתה בפסגה"}</span>
          <ArrowLeft className="size-4 text-zinc-500 transition-transform group-hover:-translate-x-1" />
        </div>
      </m.article>
    </Link>
  );
}
"use client";

import { memo, useMemo, useState } from "react";
import { m, type Variants } from "framer-motion";
import { Award, Grid2X2, LockKeyhole, Rows3, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { BADGES, isBadgeEarned, RARITY_COLORS, type Badge, type RarityTier } from "@/content";
import { haptics } from "@/lib/haptics";
import { useSavantStore } from "@/store/useSavantStore";
import { EmptyState, GlassCard, IconButton, PageHeader, PageShell, StatusChip } from "@/components/ui/Primitives";
import { cn } from "@/lib/utils";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.045 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.28 } },
};

type CollectionFilter = "all" | "earned" | "locked";
type RarityFilter = "all" | RarityTier;

const rarityLabels: Record<RarityTier, string> = {
  Common: "רגיל",
  Rare: "נדיר",
  "Super Rare": "נדיר מאוד",
  Epic: "אפי",
  Legendary: "אגדי",
};

const VaultBadgeCard = memo(function VaultBadgeCard({ badge, earned, compact, onOpen }: { badge: Badge; earned: boolean; compact: boolean; onOpen: () => void }) {
  const rarity = badge.rarity || "Common";
  const colors = RARITY_COLORS[rarity];

  return (
    <m.button
      type="button"
      variants={itemVariants}
      whileHover={earned ? { y: -3, scale: 1.01 } : undefined}
      whileTap={earned ? { scale: 0.98 } : undefined}
      disabled={!earned}
      onClick={onOpen}
      aria-label={earned ? `פתיחת ההישג ${badge.name}` : "הישג נעול"}
      className={cn(
        "group relative w-full overflow-hidden rounded-2xl border text-right disabled:cursor-default",
        compact ? "flex min-h-24 items-center gap-4 p-4" : "flex aspect-[4/5] flex-col items-center justify-center p-5 text-center",
      )}
      style={{
        background: earned ? `linear-gradient(145deg, ${colors.main}, rgba(18,20,35,0.94))` : "rgba(255,255,255,0.025)",
        borderColor: earned ? colors.border : "rgba(255,255,255,0.07)",
        boxShadow: earned ? `0 16px 40px -24px ${colors.glow}` : "none",
        willChange: "transform",
      }}
      dir="rtl"
    >
      {earned && <span className="pointer-events-none absolute inset-0 opacity-50" style={{ background: `radial-gradient(circle at 50% 0%, ${colors.glow}, transparent 58%)` }} />}
      <div className={cn("relative flex shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-black/20", compact ? "size-14 text-3xl" : "size-20 text-5xl")}>{earned ? badge.icon : <LockKeyhole className="size-7 text-zinc-600" />}</div>
      <div className={cn("relative min-w-0", !compact && "mt-5")}>
        <StatusChip className="mb-2" tone={earned ? "accent" : "neutral"}>{rarityLabels[rarity]}</StatusChip>
        <h2 className={cn("font-black", compact ? "truncate text-base" : "text-lg", earned ? "text-white" : "text-zinc-600")}>{earned ? badge.name : "הישג נעול"}</h2>
        <p className={cn("mt-1 leading-5", compact ? "line-clamp-1 text-xs" : "line-clamp-2 text-sm", earned ? "text-zinc-400" : "text-zinc-700")}>{earned ? badge.description : "המשיכו ללמוד ולתרגל כדי לחשוף אותו."}</p>
      </div>
    </m.button>
  );
});

export default function VaultPage() {
  const router = useRouter();
  const state = useSavantStore();
  const compact = state.isCompactView;
  const setCompact = state.setCompactView;
  const [collectionFilter, setCollectionFilter] = useState<CollectionFilter>("all");
  const [rarityFilter, setRarityFilter] = useState<RarityFilter>("all");

  const badges = useMemo(() => BADGES.map((badge) => ({ badge, earned: isBadgeEarned(badge.id, state) })), [state]);
  const earnedCount = badges.filter((item) => item.earned).length;
  const filteredBadges = badges.filter(({ badge, earned }) => {
    if (collectionFilter === "earned" && !earned) return false;
    if (collectionFilter === "locked" && earned) return false;
    return rarityFilter === "all" || (badge.rarity || "Common") === rarityFilter;
  });

  function changeView(nextCompact: boolean) {
    haptics.tap();
    setCompact(nextCompact);
  }

  return (
    <PageShell width="wide" className="pb-28">
      <PageHeader
        eyebrow="האוסף האישי"
        title="כספת ההישגים"
        description="כל ציון דרך נשמר כאן. הישגים נעולים נחשפים כשמסיימים שיעורים, קורסים ותרגולים."
        actions={
          <div className="flex items-center gap-2">
            <StatusChip tone="accent"><Award className="ml-1.5 size-3.5" />{earnedCount} מתוך {BADGES.length}</StatusChip>
            <IconButton label="חזרה לפרופיל" onClick={() => router.push("/profile")}><X className="size-5" /></IconButton>
          </div>
        }
      />

      <GlassCard density="compact" className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2" role="group" aria-label="סינון לפי מצב הישג">
          {([
            ["all", "הכול"],
            ["earned", "נפתחו"],
            ["locked", "נעולים"],
          ] as const).map(([value, label]) => (
            <button key={value} type="button" onClick={() => { haptics.tap(); setCollectionFilter(value); }} className={cn("min-h-11 rounded-xl border px-4 text-sm font-bold transition-colors", collectionFilter === value ? "border-violet-400/30 bg-violet-400/12 text-violet-200" : "border-white/[0.08] bg-white/[0.035] text-zinc-400 hover:text-white")}>{label}</button>
          ))}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="sr-only" htmlFor="rarity-filter">סינון לפי נדירות</label>
          <select id="rarity-filter" value={rarityFilter} onChange={(event) => setRarityFilter(event.target.value as RarityFilter)} className="min-h-11 rounded-xl border border-white/[0.08] bg-[#151727] px-4 text-sm font-bold text-zinc-300 outline-none focus:border-violet-400/50">
            <option value="all">כל דרגות הנדירות</option>
            {(Object.keys(rarityLabels) as RarityTier[]).map((rarity) => <option key={rarity} value={rarity}>{rarityLabels[rarity]}</option>)}
          </select>
          <div className="flex rounded-xl border border-white/[0.08] bg-white/[0.035] p-1" role="group" aria-label="בחירת תצוגה">
            <button type="button" onClick={() => changeView(false)} aria-label="תצוגת כרטיסים" aria-pressed={!compact} className={cn("flex size-11 items-center justify-center rounded-lg", !compact ? "bg-violet-400/15 text-violet-200" : "text-zinc-500")}><Grid2X2 className="size-4" /></button>
            <button type="button" onClick={() => changeView(true)} aria-label="תצוגה קומפקטית" aria-pressed={compact} className={cn("flex size-11 items-center justify-center rounded-lg", compact ? "bg-violet-400/15 text-violet-200" : "text-zinc-500")}><Rows3 className="size-4" /></button>
          </div>
        </div>
      </GlassCard>

      {filteredBadges.length === 0 ? (
        <EmptyState icon={<Award className="size-6" />} title="לא נמצאו הישגים" description="שנו את המסננים כדי לראות הישגים נוספים." />
      ) : (
        <m.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className={cn("mt-6", compact ? "grid gap-3 md:grid-cols-2 xl:grid-cols-3" : "grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 2xl:grid-cols-5")}
        >
          {filteredBadges.map(({ badge, earned }) => (
            <VaultBadgeCard
              key={badge.id}
              badge={badge}
              earned={earned}
              compact={compact}
              onOpen={() => {
                haptics.tap();
                router.push(`/vault/${badge.id}?from=vault`);
              }}
            />
          ))}
        </m.div>
      )}
    </PageShell>
  );
}
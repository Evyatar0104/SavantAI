"use client";

import { memo } from "react";
import { m } from "framer-motion";
import { LockKeyhole } from "lucide-react";
import { type Badge, RARITY_COLORS, type RarityTier } from "@/content";
import { type LearningPath } from "@/data/learningPaths";
import { cn } from "@/lib/utils";

const rarityLabels: Record<RarityTier, string> = {
  Common: "רגיל",
  Rare: "נדיר",
  "Super Rare": "נדיר מאוד",
  Epic: "אפי",
  Legendary: "אגדי",
};

export const AchievementCard = memo(function AchievementCard({ path, earned, onClick, size = "md" }: { path: Badge | LearningPath; earned: boolean; onClick?: () => void; size?: "sm" | "md" | "lg" }) {
  const rarity = (path.rarity || "Legendary") as RarityTier;
  const colors = RARITY_COLORS[rarity] || RARITY_COLORS.Legendary;
  const name = "nameHe" in path ? path.nameHe : path.name;
  const description = "descriptionHe" in path ? path.descriptionHe : path.description;
  const large = size === "lg";
  const small = size === "sm";
  const interactive = earned && Boolean(onClick);

  return (
    <m.button
      type="button"
      dir="rtl"
      disabled={!interactive}
      onClick={onClick}
      aria-label={earned ? name : "הישג נעול"}
      whileHover={interactive ? { y: -3, scale: 1.015 } : undefined}
      whileTap={interactive ? { scale: 0.97 } : undefined}
      className={cn("relative flex aspect-[3/4] w-full max-w-full flex-col items-center justify-center overflow-hidden border text-center disabled:cursor-default", large ? "rounded-3xl p-8" : small ? "rounded-xl p-3" : "rounded-2xl p-4")}
      style={{
        width: large ? 280 : "100%",
        background: earned ? `linear-gradient(145deg, ${colors.main}, rgba(14,16,29,0.94))` : "rgba(255,255,255,0.025)",
        borderColor: earned ? colors.border : "rgba(255,255,255,0.07)",
        boxShadow: earned ? `0 16px 38px -24px ${colors.glow}` : "none",
        willChange: "transform",
      }}
    >
      {earned && <span className="pointer-events-none absolute inset-0 opacity-55" style={{ background: `radial-gradient(circle at 50% 0%, ${colors.glow}, transparent 60%)` }} />}
      <span className={cn("relative flex items-center justify-center rounded-2xl border border-white/10 bg-black/20", large ? "size-28 text-7xl" : small ? "size-11 text-2xl" : "size-16 text-4xl")}>
        {earned ? path.icon : <LockKeyhole className={cn(small ? "size-4" : "size-7", "text-zinc-600")} />}
      </span>
      <h3 className={cn("relative font-black leading-tight", large ? "mt-7 text-2xl" : small ? "mt-2 text-xs" : "mt-4 text-sm", earned ? "text-white" : "text-zinc-600")}>{earned ? name : "הישג נעול"}</h3>
      {!small && <span className={cn("relative mt-3 rounded-full border px-3 py-1 text-[10px] font-black", earned ? "text-white/75" : "border-white/[0.06] text-zinc-700")} style={earned ? { borderColor: colors.border, background: colors.main } : undefined}>{rarityLabels[rarity]}</span>}
      {!small && <p className={cn("relative mt-3 line-clamp-3 leading-6", large ? "text-base" : "text-xs", earned ? "text-zinc-400" : "text-zinc-700")}>{earned ? description : "המשיכו במסלול כדי לפתוח"}</p>}
    </m.button>
  );
});
"use client";

import { memo } from "react";
import { m } from "framer-motion";
import { LockKeyhole } from "lucide-react";
import { type Badge, RARITY_COLORS, type RarityTier } from "@/content";
import { cn } from "@/lib/utils";

const rarityLabels: Record<RarityTier, string> = {
  Common: "רגיל",
  Rare: "נדיר",
  "Super Rare": "נדיר מאוד",
  Epic: "אפי",
  Legendary: "אגדי",
};

export const BadgeCard = memo(function BadgeCard({ badge, earned, onClick, size = "md" }: { badge: Badge; earned: boolean; onClick?: () => void; size?: "sm" | "md" | "lg" }) {
  const rarity = badge.rarity || "Common";
  const colors = RARITY_COLORS[rarity];
  const small = size === "sm";
  const large = size === "lg";
  const interactive = earned && Boolean(onClick);

  return (
    <m.button
      type="button"
      dir="rtl"
      disabled={!interactive}
      onClick={onClick}
      aria-label={earned ? badge.name : "הישג נעול"}
      whileHover={interactive ? { y: -3, scale: 1.015 } : undefined}
      whileTap={interactive ? { scale: 0.97 } : undefined}
      className={cn("relative flex aspect-[3/4] w-full flex-col items-center justify-center overflow-hidden border text-center disabled:cursor-default", small ? "rounded-xl px-2 py-3" : large ? "rounded-3xl p-7" : "rounded-2xl p-4")}
      style={{
        width: small ? 80 : "100%",
        background: earned ? `linear-gradient(145deg, ${colors.main}, rgba(14,16,29,0.94))` : "rgba(255,255,255,0.025)",
        borderColor: earned ? colors.border : "rgba(255,255,255,0.07)",
        boxShadow: earned ? `0 16px 38px -24px ${colors.glow}` : "none",
        willChange: "transform",
      }}
    >
      {earned && <span className="pointer-events-none absolute inset-0 opacity-50" style={{ background: `radial-gradient(circle at 50% 0%, ${colors.glow}, transparent 60%)` }} />}
      <span className={cn("relative flex items-center justify-center rounded-2xl border border-white/10 bg-black/20", small ? "size-10 text-2xl" : large ? "size-24 text-6xl" : "size-16 text-4xl")}>
        {earned ? badge.icon : <LockKeyhole className={cn(small ? "size-4" : "size-6", "text-zinc-600")} />}
      </span>
      <h3 className={cn("relative font-black leading-tight", small ? "mt-2 text-[10px]" : large ? "mt-6 text-xl" : "mt-4 text-sm", earned ? "text-white" : "text-zinc-600")}>{earned ? badge.name : "נעול"}</h3>
      {!small && <p className={cn("relative mt-1 line-clamp-2 leading-5", large ? "text-sm" : "text-xs", earned ? "text-zinc-400" : "text-zinc-700")}>{earned ? badge.description : "המשיכו ללמוד כדי לפתוח"}</p>}
      {!small && <span className={cn("relative mt-3 rounded-full border px-2.5 py-1 text-[10px] font-black", earned ? "text-white/75" : "border-white/[0.06] text-zinc-700")} style={earned ? { borderColor: colors.border, background: colors.main } : undefined}>{rarityLabels[rarity]}</span>}
    </m.button>
  );
});
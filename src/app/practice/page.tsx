"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Check, Clock3, Filter, Search, Sparkles, Zap } from "lucide-react";
import { m } from "framer-motion";
import { PRACTICE_ITEMS, type PracticeItem } from "@/content";
import { EmptyState, GlassCard, PageHeader, PageShell, SectionHeader, StatusChip } from "@/components/ui/Primitives";
import { useScrollRestoration } from "@/hooks/useScrollRestoration";
import { haptics } from "@/lib/haptics";
import { entranceVariants, staggerContainerVariants } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { useSavantStore } from "@/store/useSavantStore";

const PracticeDetailSheet = dynamic(() => import("@/components/PracticeDetailSheet").then((module) => module.PracticeDetailSheet), { ssr: false });

type TypeFilter = "all" | "drill" | "project";
type ToolFilter = "all" | "Claude" | "ChatGPT" | "Gemini" | "כל מודל";

const TOOL_META: Record<string, { label: string; logo: string | null }> = {
  Claude: { label: "Claude", logo: "/assets/logos/claude.png" },
  ChatGPT: { label: "ChatGPT", logo: "/assets/logos/chatgpt.png" },
  Gemini: { label: "Gemini", logo: "/assets/logos/gemini.png" },
  "כל מודל": { label: "כל מודל", logo: null },
};

function PracticeCard({ item, completed, selected, onSelect }: { item: PracticeItem; completed: boolean; selected: boolean; onSelect: () => void }) {
  const tool = TOOL_META[item.recommendedModel] ?? TOOL_META["כל מודל"];
  return (
    <m.button
      type="button"
      variants={entranceVariants}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.99 }}
      onClick={onSelect}
      aria-pressed={selected}
      className={cn("interactive-surface flex min-h-56 w-full flex-col rounded-2xl border p-5 text-right", selected ? "border-violet-400/35 bg-violet-400/[0.08]" : "border-white/10 bg-white/[0.045]")}
      style={{ willChange: "transform" }}
    >
      <div className="flex w-full items-start justify-between gap-4">
        <StatusChip tone={item.type === "project" ? "accent" : "neutral"}>{item.type === "project" ? "פרויקט" : "תרגיל"}</StatusChip>
        {completed && <StatusChip tone="success"><Check className="size-3.5" /> הושלם</StatusChip>}
      </div>
      <h3 className="mt-5 text-lg font-black leading-snug text-white">{item.title}</h3>
      <p className="mt-2 line-clamp-2 text-sm leading-6 text-zinc-400">{item.description}</p>
      <div className="mt-auto flex w-full items-end justify-between gap-3 pt-5">
        <div className="flex items-center gap-2 text-xs font-bold text-zinc-500">{tool.logo ? <Image src={tool.logo} alt="" width={18} height={18} className="size-[18px] rounded object-contain" /> : <Sparkles className="size-4" />}{tool.label}</div>
        <div className="flex gap-2"><span className="inline-flex items-center gap-1 text-xs text-zinc-500"><Clock3 className="size-3.5" />{item.timeMinutes} דק׳</span><span className="inline-flex items-center gap-1 text-xs font-black text-amber-300"><Zap className="size-3.5" />{item.xp} XP</span></div>
      </div>
    </m.button>
  );
}

function PracticeDetail({ item, completed, onStart, onComplete }: { item: PracticeItem; completed: boolean; onStart: () => void; onComplete: () => void }) {
  const tool = TOOL_META[item.recommendedModel] ?? TOOL_META["כל מודל"];
  const hasBuilder = Boolean(item.builderSteps?.length);
  return (
    <GlassCard level="strong" className="space-y-6">
      <div className="flex items-start justify-between gap-4"><StatusChip tone={item.type === "project" ? "accent" : "neutral"}>{item.type === "project" ? "פרויקט" : "תרגיל"}</StatusChip>{completed && <StatusChip tone="success"><Check className="size-3.5" /> הושלם</StatusChip>}</div>
      <div><h2 className="text-2xl font-black leading-snug text-white">{item.title}</h2><p className="mt-3 text-sm leading-7 text-zinc-400">{item.description}</p></div>
      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-2xl bg-white/[0.04] p-3 text-center"><Clock3 className="mx-auto size-4 text-zinc-400" /><p className="mt-2 text-sm font-black text-white">{item.timeMinutes}</p><p className="text-[10px] text-zinc-500">דקות</p></div>
        <div className="rounded-2xl bg-white/[0.04] p-3 text-center"><Zap className="mx-auto size-4 text-amber-300" /><p className="mt-2 text-sm font-black text-white">{item.xp}</p><p className="text-[10px] text-zinc-500">XP</p></div>
        <div className="rounded-2xl bg-white/[0.04] p-3 text-center">{tool.logo ? <Image src={tool.logo} alt="" width={16} height={16} className="mx-auto size-4 rounded object-contain" /> : <Sparkles className="mx-auto size-4 text-violet-300" />}<p className="mt-2 truncate text-xs font-black text-white">{tool.label}</p><p className="text-[10px] text-zinc-500">כלי</p></div>
      </div>
      <div><p className="text-xs font-black text-zinc-500">איך עושים את זה</p><ol className="mt-4 space-y-3">{item.steps.slice(0, 4).map((step, index) => <li key={`${item.id}-${index}`} className="flex gap-3 text-sm leading-6 text-zinc-300"><span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-violet-400/12 text-[10px] font-black text-violet-200">{index + 1}</span><span>{step}</span></li>)}</ol></div>
      {hasBuilder ? <m.button whileTap={{ scale: 0.98 }} onClick={onStart} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#534AB7] px-5 text-sm font-black text-white" style={{ willChange: "transform" }}><Zap className="size-4" />התחל משימה</m.button> : <m.button whileTap={{ scale: 0.98 }} onClick={onComplete} disabled={completed} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#534AB7] px-5 text-sm font-black text-white disabled:bg-white/[0.06] disabled:text-zinc-500" style={{ willChange: "transform" }}>{completed ? <><Check className="size-4" />המשימה הושלמה</> : "סיימתי ידנית"}</m.button>}
    </GlassCard>
  );
}

export default function PracticePage() {
  const router = useRouter();
  const completedPractice = useSavantStore((state) => state.completedPractice);
  const completePracticeItem = useSavantStore((state) => state.completePracticeItem);
  const primaryModel = useSavantStore((state) => state.primaryModel);
  const practiceScrollPosition = useSavantStore((state) => state.practiceScrollPosition);
  const setPracticeScrollPosition = useSavantStore((state) => state.setPracticeScrollPosition);
  const hasHydrated = useSavantStore((state) => state._hasHydrated);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [toolFilter, setToolFilter] = useState<ToolFilter>("all");
  const [selectedId, setSelectedId] = useState(PRACTICE_ITEMS[0]?.id ?? "");
  const [mobileSheetItem, setMobileSheetItem] = useState<PracticeItem | null>(null);

  useScrollRestoration(practiceScrollPosition, setPracticeScrollPosition, hasHydrated);

  const filtered = useMemo(() => PRACTICE_ITEMS.filter((item) => {
    const normalizedQuery = query.trim().toLowerCase();
    if (normalizedQuery && !item.title.toLowerCase().includes(normalizedQuery) && !item.description.toLowerCase().includes(normalizedQuery) && !item.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery))) return false;
    if (typeFilter !== "all" && item.type !== typeFilter) return false;
    if (toolFilter !== "all" && item.recommendedModel !== toolFilter && !item.compatibleModels.includes(toolFilter)) return false;
    return true;
  }).sort((a, b) => {
    if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
    if (!primaryModel) return 0;
    const aMatches = a.recommendedModel.toLowerCase() === primaryModel;
    const bMatches = b.recommendedModel.toLowerCase() === primaryModel;
    return Number(bMatches) - Number(aMatches);
  }), [primaryModel, query, toolFilter, typeFilter]);

  useEffect(() => {
    if (filtered.length > 0 && !filtered.some((item) => item.id === selectedId)) setSelectedId(filtered[0].id);
  }, [filtered, selectedId]);

  const selectedItem = filtered.find((item) => item.id === selectedId) ?? filtered[0];
  const completedCount = PRACTICE_ITEMS.filter((item) => completedPractice.includes(item.id)).length;

  const startItem = (item: PracticeItem) => {
    haptics.tap();
    router.push(`/practice/builder/${item.id}?from=practice`);
  };

  const completeItem = (item: PracticeItem) => {
    if (completedPractice.includes(item.id)) return;
    completePracticeItem(item.id, item.xp);
    haptics.complete();
  };

  return (
    <PageShell className="space-y-8 lg:space-y-10">
      <PageHeader eyebrow="תרגול מעשי" title="זירת המשימות" description="בחר משימה קצרה, תרגל עם הכלי המתאים והפוך ידע להרגל עבודה." actions={<GlassCard density="compact" className="flex items-center gap-3 shadow-none"><Check className="size-5 text-emerald-300" /><div><p className="text-[10px] font-bold text-zinc-500">הושלמו</p><p className="font-black text-white">{completedCount}/{PRACTICE_ITEMS.length}</p></div></GlassCard>} />

      <GlassCard density="compact" className="space-y-4 shadow-none">
        <div className="relative"><Search className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-zinc-500" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="חיפוש תרגיל, פרויקט או מיומנות" aria-label="חיפוש משימות" className="min-h-12 w-full rounded-2xl border border-white/10 bg-black/15 pr-11 pl-4 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-violet-400/45" /></div>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="flex items-center gap-2 text-xs font-black text-zinc-500"><Filter className="size-4" />סינון</div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {([{"id":"all","label":"כל הסוגים"},{"id":"drill","label":"תרגילים"},{"id":"project","label":"פרויקטים"}] as const).map((item) => <button key={item.id} onClick={() => { haptics.tap(); setTypeFilter(item.id); }} className={cn("min-h-11 shrink-0 rounded-full border px-4 text-xs font-bold", typeFilter === item.id ? "border-violet-400/35 bg-violet-400/15 text-violet-200" : "border-white/10 bg-white/[0.04] text-zinc-400")}>{item.label}</button>)}
          </div>
          <div className="hidden h-7 w-px bg-white/10 lg:block" />
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {(["all", "Claude", "ChatGPT", "Gemini", "כל מודל"] as ToolFilter[]).map((tool) => <button key={tool} onClick={() => { haptics.tap(); setToolFilter(tool); }} className={cn("min-h-11 shrink-0 rounded-full border px-4 text-xs font-bold", toolFilter === tool ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300" : "border-white/10 bg-white/[0.04] text-zinc-400")}>{tool === "all" ? "כל הכלים" : tool}</button>)}
          </div>
        </div>
      </GlassCard>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
        <section className="min-w-0 space-y-4">
          <SectionHeader title="משימות לבחירה" description={`${filtered.length} תוצאות`} />
          {filtered.length === 0 ? <EmptyState icon={<Search className="size-5" />} title="לא נמצאו משימות" description="נסה חיפוש אחר או הסר אחד מהסינונים." /> : <m.div variants={staggerContainerVariants} initial="hidden" animate="visible" className="grid gap-4 md:grid-cols-2">{filtered.map((item) => <PracticeCard key={item.id} item={item} completed={completedPractice.includes(item.id)} selected={selectedItem?.id === item.id} onSelect={() => { haptics.tap(); setSelectedId(item.id); setMobileSheetItem(item); }} />)}</m.div>}
        </section>
        <aside className="hidden lg:sticky lg:top-6 lg:block">{selectedItem && <PracticeDetail item={selectedItem} completed={completedPractice.includes(selectedItem.id)} onStart={() => startItem(selectedItem)} onComplete={() => completeItem(selectedItem)} />}</aside>
      </div>

      {mobileSheetItem && <div className="lg:hidden"><PracticeDetailSheet item={mobileSheetItem} onClose={() => setMobileSheetItem(null)} /></div>}
    </PageShell>
  );
}
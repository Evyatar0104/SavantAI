"use client";

import type { HTMLAttributes, ReactNode } from "react";
import { m, type HTMLMotionProps } from "framer-motion";
import { haptics } from "@/lib/haptics";
import { cn } from "@/lib/utils";

export type SurfaceLevel = "subtle" | "default" | "strong";
export type ComponentDensity = "compact" | "comfortable";
export type ContentWidth = "reading" | "content" | "wide" | "full";
export type StatusTone = "neutral" | "accent" | "success" | "warning" | "danger";

const widths: Record<ContentWidth, string> = {
  reading: "max-w-3xl",
  content: "max-w-6xl",
  wide: "max-w-[1480px]",
  full: "max-w-none",
};

export function PageShell({ children, width = "wide", className }: { children: ReactNode; width?: ContentWidth; className?: string }) {
  return (
    <div dir="rtl" className={cn("savant-page-shell mx-auto w-full px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10 2xl:px-14", widths[width], className)}>
      {children}
    </div>
  );
}

export function PageHeader({ title, description, eyebrow, actions, className }: { title: string; description?: string; eyebrow?: string; actions?: ReactNode; className?: string }) {
  return (
    <header dir="rtl" className={cn("flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between", className)}>
      <div className="min-w-0">
        {eyebrow && <p className="mb-2 text-xs font-bold tracking-[0.12em] text-violet-300">{eyebrow}</p>}
        <h1 className="max-w-3xl text-balance text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">{title}</h1>
        {description && <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-3">{actions}</div>}
    </header>
  );
}

export function SectionHeader({ title, description, action, className }: { title: string; description?: string; action?: ReactNode; className?: string }) {
  return (
    <div dir="rtl" className={cn("flex items-end justify-between gap-4", className)}>
      <div className="min-w-0">
        <h2 className="text-xl font-black tracking-tight text-white sm:text-2xl">{title}</h2>
        {description && <p className="mt-1 text-sm leading-6 text-zinc-500">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

const surfaces: Record<SurfaceLevel, string> = {
  subtle: "bg-white/[0.035] border-white/[0.07]",
  default: "bg-[rgba(20,22,39,0.78)] border-white/[0.1]",
  strong: "bg-[rgba(22,24,43,0.94)] border-white/[0.13]",
};

export function GlassCard({ children, level = "default", density = "comfortable", className, ...props }: HTMLAttributes<HTMLDivElement> & { level?: SurfaceLevel; density?: ComponentDensity }) {
  return (
    <div dir="rtl" className={cn("savant-glass-card rounded-2xl border shadow-[0_18px_60px_rgba(0,0,0,0.22)]", surfaces[level], density === "compact" ? "p-4" : "p-5 sm:p-6", className)} {...props}>
      {children}
    </div>
  );
}

export function ProgressBar({ value, label = "התקדמות", accent = "#534AB7", className }: { value: number; label?: string; accent?: string; className?: string }) {
  const normalized = Math.min(100, Math.max(0, value));
  return (
    <div dir="rtl" className={cn("w-full", className)}>
      <div className="mb-2 flex items-center justify-between text-xs text-zinc-400"><span>{label}</span><span>{Math.round(normalized)}%</span></div>
      <div role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(normalized)} className="h-2 overflow-hidden rounded-full bg-white/[0.07]">
        <m.div initial={false} animate={{ width: `${normalized}%` }} transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }} className="h-full rounded-full" style={{ backgroundColor: accent }} />
      </div>
    </div>
  );
}

const tones: Record<StatusTone, string> = {
  neutral: "border-white/10 bg-white/[0.06] text-zinc-300",
  accent: "border-violet-400/25 bg-violet-400/10 text-violet-200",
  success: "border-emerald-400/25 bg-emerald-400/10 text-emerald-300",
  warning: "border-amber-400/25 bg-amber-400/10 text-amber-300",
  danger: "border-red-400/25 bg-red-400/10 text-red-300",
};

export function StatusChip({ children, tone = "neutral", className }: { children: ReactNode; tone?: StatusTone; className?: string }) {
  return <span dir="rtl" className={cn("inline-flex min-h-7 items-center rounded-full border px-2.5 py-1 text-xs font-bold", tones[tone], className)}>{children}</span>;
}

export function PrimaryButton({ children, className, onClick, ...props }: Omit<HTMLMotionProps<"button">, "children"> & { children: ReactNode }) {
  return (
    <m.button
      dir="rtl"
      whileTap={{ scale: 0.98 }}
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 450, damping: 32 }}
      onClick={(event) => { haptics.tap(); onClick?.(event); }}
      className={cn("inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-[#534AB7] px-5 py-3 text-sm font-extrabold text-white shadow-[0_12px_30px_rgba(83,74,183,0.3)] hover:bg-[#6259c9] disabled:cursor-not-allowed disabled:opacity-50", className)}
      style={{ willChange: "transform" }}
      {...props}
    >
      {children}
    </m.button>
  );
}

export function IconButton({ label, children, className, onClick, ...props }: Omit<HTMLMotionProps<"button">, "children"> & { label: string; children: ReactNode }) {
  return (
    <m.button
      dir="rtl"
      aria-label={label}
      title={label}
      whileTap={{ scale: 0.94 }}
      onClick={(event) => { haptics.tap(); onClick?.(event); }}
      className={cn("inline-flex size-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-white hover:bg-white/[0.1]", className)}
      style={{ willChange: "transform" }}
      {...props}
    >
      {children}
    </m.button>
  );
}

export function EmptyState({ icon, title, description, action }: { icon?: ReactNode; title: string; description: string; action?: ReactNode }) {
  return (
    <GlassCard className="flex min-h-64 flex-col items-center justify-center text-center">
      {icon && <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-violet-400/10 text-violet-300">{icon}</div>}
      <h2 className="text-xl font-extrabold text-white">{title}</h2>
      <p className="mt-2 max-w-md leading-7 text-zinc-400">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </GlassCard>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn("animate-pulse rounded-xl bg-white/[0.07] motion-reduce:animate-none", className)} />;
}
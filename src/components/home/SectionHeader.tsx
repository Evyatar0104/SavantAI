"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";

interface SectionHeaderProps {
    title: string;
    subtitle?: string;
    /** CSS color for the accent tick, e.g. "#60A5FA" */
    accent?: string;
    href?: string;
    linkLabel?: string;
}

export function SectionHeader({ title, subtitle, accent = "#60A5FA", href, linkLabel }: SectionHeaderProps) {
    return (
        <div className="flex justify-between items-end gap-4 px-2" dir="rtl">
            <div className="min-w-0">
                <div className="flex items-center gap-3 mb-1.5">
                    <span
                        aria-hidden
                        className="w-1.5 h-6 md:h-7 rounded-full shrink-0"
                        style={{ background: `linear-gradient(to bottom, ${accent}, ${accent}55)` }}
                    />
                    <h3 className="text-2xl md:text-4xl font-bold font-serif tracking-tight text-white truncate">
                        {title}
                    </h3>
                </div>
                {subtitle && (
                    <p className="text-xs md:text-base text-zinc-500 font-medium pr-[18px] leading-snug">
                        {subtitle}
                    </p>
                )}
            </div>
            {href && linkLabel && (
                <Link
                    href={href}
                    className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/[0.04] border border-white/10 text-xs md:text-sm font-bold text-zinc-300 hover:text-white hover:bg-white/[0.08] hover:border-white/20 transition-colors"
                >
                    {linkLabel}
                    <ChevronLeft className="w-4 h-4" />
                </Link>
            )}
        </div>
    );
}

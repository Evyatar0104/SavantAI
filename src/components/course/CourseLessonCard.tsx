"use client";

import Link from "next/link";
import Image from "next/image";
import { m } from "framer-motion";
import { Check, Lock, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { haptics } from "@/lib/haptics";
import type { LessonMeta } from "@/content";

interface CourseLessonCardProps {
    lesson: LessonMeta;
    isCompleted: boolean;
    isLocked: boolean;
    isActive: boolean;
    colorClass: string;
}

export function CourseLessonCard({ lesson, isCompleted, isLocked, isActive, colorClass }: CourseLessonCardProps) {
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    const renderIcon = () => {
        if (isLocked) return <Lock className="w-5 h-5 text-white/40" />;
        
        if (lesson.icon?.startsWith("@")) {
            const iconName = lesson.icon.substring(1);
            const isWhiteIconNeeded = iconName.includes("grok") || iconName.includes("perplexity");
            return (
                <div className="w-8 h-8 relative">
                    <Image 
                        src={`/assets/logos/${iconName}`} 
                        alt="" 
                        fill 
                        className={cn("object-contain", isWhiteIconNeeded && "brightness-0 invert")}
                    />
                </div>
            );
        }
        
        return lesson.icon || "📄";
    };

    const cardContent = (
        <m.div 
            variants={itemVariants}
            whileHover={!isLocked ? { scale: 1.01, x: -4 } : {}}
            whileTap={!isLocked ? { scale: 0.98 } : {}}
            onClick={() => {
                if (isLocked) haptics.error();
                else haptics.tap();
            }}
            className={cn(
                "group flex items-center p-4 md:p-5 rounded-[24px] border transition-all relative overflow-hidden",
                isLocked 
                    ? "opacity-50 cursor-default border-white/5 bg-zinc-900/20" 
                    : cn(
                        "border-white/5 bg-white/[0.03] backdrop-blur-md hover:bg-white/[0.07] hover:border-white/10 shadow-lg",
                        isActive && "border-blue-500/30 bg-blue-500/5 ring-1 ring-blue-500/20"
                    )
            )}
        >
            {/* Background Glow for Active/Hover */}
            {!isLocked && (
                <div className="absolute -inset-px bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            )}

            {/* Icon Container with Squarcle */}
            <div className={cn(
                "w-12 h-12 rounded-[14px] flex items-center justify-center shrink-0 ml-4 text-2xl shadow-inner border border-white/10 relative z-10 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3",
                colorClass
            )}>
                {renderIcon()}
                
                {/* Active Indicator Pulse */}
                {isActive && !isCompleted && (
                    <m.div 
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 rounded-[14px] bg-white/20"
                    />
                )}
            </div>

            {/* Lesson Info */}
            <div className="flex-1 min-w-0 relative z-10">
                <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] font-black uppercase tracking-tighter text-zinc-500">שיעור {lesson.order}</span>
                    {isActive && !isCompleted && (
                        <span className="bg-blue-500/20 text-blue-400 text-[9px] px-1.5 py-0.5 rounded-full font-bold animate-pulse">הבא בתור</span>
                    )}
                </div>
                <h4 className={cn(
                    "text-base md:text-lg font-bold leading-tight transition-colors",
                    isLocked ? "text-zinc-500" : "text-white group-hover:text-blue-400"
                )}>
                    {lesson.title}
                </h4>
                {!isLocked && (
                    <p className="text-zinc-500 text-[11px] md:text-xs mt-0.5">
                        {lesson.description}
                    </p>
                )}
            </div>

            {/* Status Indicator */}
            <div className="mr-4 relative z-10 shrink-0">
                {isCompleted ? (
                    <div className="w-7 h-7 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)] flex items-center justify-center border border-white/20">
                        <Check className="w-4 h-4 text-white stroke-[3px]" />
                    </div>
                ) : isActive ? (
                    <div className="w-7 h-7 rounded-full bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)] flex items-center justify-center border border-white/20">
                        <Play className="w-3.5 h-3.5 text-white fill-current translate-x-[1px] rotate-180" />
                    </div>
                ) : (
                    <div className="w-7 h-7 rounded-full border-2 border-white/10 group-hover:border-white/20 transition-colors" />
                )}
            </div>
        </m.div>
    );

    if (isLocked) return cardContent;

    return (
        <Link href={`/lesson/${lesson.id}?from=course`} className="block w-full">
            {cardContent}
        </Link>
    );
}


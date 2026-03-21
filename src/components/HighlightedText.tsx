"use client";

import React, { useState, useRef, useEffect } from "react";
import { AnimatePresence, m } from "framer-motion";
import { TERM_DEFINITIONS } from "@/data/ai-lessons";

function TooltipPill({ term, definition, targetRect, onClose }: { term: string, definition: string, targetRect: DOMRect, onClose: () => void }) {
    const tooltipRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ top: 0, left: 0 });

    useEffect(() => {
        if (!tooltipRef.current || !targetRect) return;
        const tooltipRect = tooltipRef.current.getBoundingClientRect();
        
        let top = targetRect.top - tooltipRect.height - 12;
        if (top < 10) {
            top = targetRect.bottom + 12; // flip to below
        }
        
        let left = targetRect.left + (targetRect.width / 2) - (tooltipRect.width / 2);
        
        if (left < 10) left = 10;
        if (left + tooltipRect.width > window.innerWidth - 10) {
            left = window.innerWidth - tooltipRect.width - 10;
        }

        setPosition({ top, left });
    }, [targetRect]);

    useEffect(() => {
        const handleOutside = (e: PointerEvent) => {
            if (tooltipRef.current && !tooltipRef.current.contains(e.target as Node)) {
                onClose();
            }
        };
        setTimeout(() => document.addEventListener("pointerdown", handleOutside), 10);
        return () => document.removeEventListener("pointerdown", handleOutside);
    }, [onClose]);

    return (
        <m.div
            ref={tooltipRef}
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="fixed z-[300] bg-[#1E1E2E] shadow-2xl p-4 font-sans"
            style={{
                top: position.top,
                left: position.left,
                width: "max-content",
                maxWidth: 260,
                borderRadius: 8,
                border: "1px solid rgba(0, 196, 140, 0.33)"
            }}
            dir="rtl"
        >
            <div className="font-bold text-[#00C48C] mb-1.5">{term}</div>
            <div className="text-[15px] text-zinc-300 leading-snug">{definition}</div>
        </m.div>
    );
}

export function HighlightedText({ text }: { text: string }) {
    const [activeTooltip, setActiveTooltip] = useState<{ term: string, rect: DOMRect } | null>(null);

    // Use empty string on old lessons without readContent
    if (!text) return null;

    const terms = Object.keys(TERM_DEFINITIONS).sort((a, b) => b.length - a.length);
    // Escape terms for Regex just in case
    const escapedTerms = terms.map(t => t.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&'));
    const regex = new RegExp(`(${escapedTerms.join('|')})`, 'g');

    const parts = text.split(regex);

    return (
        <>
            {parts.map((part, i) => {
                if (TERM_DEFINITIONS[part]) {
                    return (
                        <span
                            key={i}
                            onClick={(e) => {
                                e.stopPropagation();
                                setActiveTooltip({
                                    term: part,
                                    rect: e.currentTarget.getBoundingClientRect()
                                });
                            }}
                            className="inline-block cursor-pointer"
                            style={{
                                background: "rgba(0, 196, 140, 0.13)", // #00C48C22
                                color: "#00C48C",
                                borderRadius: 3,
                                padding: "0px 4px",
                                margin: "0 2px"
                            }}
                        >
                            {part}
                        </span>
                    );
                }
                
                // Return preserved text with newlines mapped to <br/>
                if (part.includes('\\n')) {
                    return (
                        <span key={i}>
                            {part.split('\\n').map((line, j) => (
                                <React.Fragment key={j}>
                                    {line}
                                    {j < part.split('\\n').length - 1 && <br />}
                                </React.Fragment>
                            ))}
                        </span>
                    );
                }

                return <span key={i}>{part}</span>;
            })}

            <AnimatePresence>
                {activeTooltip && (
                    <TooltipPill
                        key="tooltip"
                        term={activeTooltip.term}
                        definition={TERM_DEFINITIONS[activeTooltip.term]}
                        targetRect={activeTooltip.rect}
                        onClose={() => setActiveTooltip(null)}
                    />
                )}
            </AnimatePresence>
        </>
    );
}

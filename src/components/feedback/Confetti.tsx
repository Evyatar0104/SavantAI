"use client";

import { useState } from "react";
import { m } from "framer-motion";

interface Particle {
    id: number;
    left: string;
    size: number;
    delay: number;
    duration: number;
    rotate: number;
    xDrift: number;
    opacity: number;
    variant: "circle" | "square";
}

export function Confetti({ color }: { color: string }) {
    const [particles] = useState<Particle[]>(() => {
        return Array.from({ length: 24 }, (_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            size: 4 + Math.random() * 5,
            delay: Math.random() * 0.8,
            duration: 1.5 + Math.random() * 1,
            rotate: Math.random() * 360,
            xDrift: (Math.random() - 0.5) * 120,
            opacity: 0.6 + Math.random() * 0.4,
            variant: (Math.random() > 0.5 ? "circle" : "square") as "circle" | "square",
        }));
    });

    return (
        <div className="fixed inset-0 pointer-events-none z-[300] overflow-hidden">
            {particles.map(p => (
                <m.div
                    key={p.id}
                    initial={{ y: -20, x: 0, opacity: p.opacity, rotate: 0, scale: 1 }}
                    animate={{ y: "110vh", x: p.xDrift, opacity: 0, rotate: p.rotate + 360, scale: 0.5 }}
                    transition={{ duration: p.duration, delay: p.delay, ease: "easeIn" }}
                    style={{ willChange: 'transform',
                        position: "absolute",
                        top: 0,
                        left: p.left,
                        width: p.size,
                        height: p.size,
                        borderRadius: p.variant === "circle" ? "50%" : 2,
                        background: color,
                        boxShadow: `0 0 6px ${color}60`,
                    }}
                />
            ))}
        </div>
    );
}


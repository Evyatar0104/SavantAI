"use client";

import { m, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useCallback } from "react";

interface Props {
    color?: string;
    backgroundColor?: string;
}

export function AnimatedGradient({ color = "#00C48C", backgroundColor = "#050510" }: Props) {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 30, stiffness: 100 };
    const sx = useSpring(mouseX, springConfig);
    const sy = useSpring(mouseY, springConfig);

    useEffect(() => {
        let rafId: number;
        const onMouseMove = (e: MouseEvent) => {
            if (rafId) return;
            rafId = window.requestAnimationFrame(() => {
                const { clientX, clientY } = e;
                const moveX = (clientX / window.innerWidth - 0.5) * 60;
                const moveY = (clientY / window.innerHeight - 0.5) * 60;
                mouseX.set(moveX);
                mouseY.set(moveY);
                rafId = 0;
            });
        };

        window.addEventListener("mousemove", onMouseMove);
        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            if (rafId) window.cancelAnimationFrame(rafId);
        };
    }, [mouseX, mouseY]);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0" style={{ backgroundColor }}>
            {/* Primary Decorative Blob */}
            <m.div
                className="absolute w-[120%] h-[120%] -top-[10%] -left-[10%] opacity-[0.15] blur-[120px]"
                style={{
                    background: `radial-gradient(circle at 50% 50%, ${color} 0%, transparent 70%)`,
                    x: sx,
                    y: sy,
                    scale: useTransform(sy, [ -30, 30 ], [ 1, 1.1 ])
                }}
            />

            {/* Accent Glowing Orb */}
            <m.div
                className="absolute w-[60%] h-[60%] top-[10%] right-[10%] rounded-full opacity-[0.1] blur-[80px]"
                style={{
                    background: color,
                    x: useTransform(sx, (v) => v * -0.8),
                    y: useTransform(sy, (v) => v * -0.8),
                }}
                animate={{
                    opacity: [0.05, 0.15, 0.05],
                    scale: [1, 1.2, 1]
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            {/* Dynamic Mesh Shine */}
            <m.div 
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, ${color} 1px, transparent 0)`,
                    backgroundSize: '48px 48px',
                    x: useTransform(sx, (v) => v * 0.2),
                    y: useTransform(sy, (v) => v * 0.2),
                }}
            />

            {/* Dark Vignette Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
        </div>
    );
}

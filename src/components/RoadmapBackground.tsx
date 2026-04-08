"use client";

import { m } from "framer-motion";
import { cn } from "@/lib/utils";

interface RoadmapBackgroundProps {
    color?: string;
    className?: string;
}

export function RoadmapBackground({ color = "#3b82f6", className }: RoadmapBackgroundProps) {
    return (
        <div className={cn("fixed inset-0 z-0 overflow-hidden pointer-events-none", className)} style={{ background: "#06060f" }}>
            {/* Deep space base */}
            <div className="absolute inset-0" style={{
                background: `radial-gradient(ellipse 120% 80% at 60% 0%, ${color}15 0%, #06060f 55%, #030308 100%)`
            }} />

            {/* Grid Pattern */}
            <div className="absolute inset-0" style={{
                backgroundImage: `
                    linear-gradient(${color}10 1px, transparent 1px),
                    linear-gradient(90deg, ${color}10 1px, transparent 1px)
                `,
                backgroundSize: "40px 40px",
                maskImage: "radial-gradient(ellipse 80% 50% at 50% 50%, black, transparent)",
                WebkitMaskImage: "radial-gradient(ellipse 80% 50% at 50% 50%, black, transparent)",
                opacity: 0.6,
            }} />

            {/* Perspective Grid */}
            <div className="absolute inset-0" style={{
                backgroundImage: `
                    linear-gradient(${color}15 1px, transparent 1px),
                    linear-gradient(90deg, ${color}15 1px, transparent 1px)
                `,
                backgroundSize: "80px 80px",
                maskImage: "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.4) 30%, rgba(0,0,0,0.4) 70%, transparent 100%)",
                WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.4) 30%, rgba(0,0,0,0.4) 70%, transparent 100%)",
                transform: "perspective(1000px) rotateX(60deg) scaleX(2.5) translateY(-20%)",
                transformOrigin: "center top",
                opacity: 0.4,
            }} />

            {/* Floating Orbs */}
            <m.div
                animate={{
                    x: [0, 100, -50, 0],
                    y: [0, -80, 40, 0],
                    scale: [1, 1.2, 0.9, 1],
                }}
                transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
                className="absolute"
                style={{
                    top: "10%",
                    right: "10%",
                    width: "500px",
                    height: "500px",
                    borderRadius: "50%",
                    background: `radial-gradient(circle, ${color}15 0%, transparent 70%)`,
                    filter: "blur(80px)",
                }}
            />

            <m.div
                animate={{
                    x: [0, -120, 60, 0],
                    y: [0, 100, -60, 0],
                    scale: [1, 1.1, 0.95, 1],
                }}
                transition={{ duration: 35, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute"
                style={{
                    bottom: "10%",
                    left: "5%",
                    width: "600px",
                    height: "600px",
                    borderRadius: "50%",
                    background: `radial-gradient(circle, ${color}10 0%, transparent 70%)`,
                    filter: "blur(100px)",
                }}
            />

            {/* Scanning line */}
            <m.div
                animate={{
                    top: ["-10%", "110%"],
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 right-0 h-[2px] z-10"
                style={{
                    background: `linear-gradient(90deg, transparent, ${color}40, transparent)`,
                    boxShadow: `0 0 20px ${color}20`,
                }}
            />

            {/* Noise grain */}
            <div
                className="absolute inset-0 mix-blend-overlay"
                style={{
                    opacity: 0.02,
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                }}
            />
        </div>
    );
}

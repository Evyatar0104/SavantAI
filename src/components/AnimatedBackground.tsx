"use client";

import { m } from "framer-motion";
import { usePathname } from "next/navigation";

export function AnimatedBackground() {
    const pathname = usePathname();
    const isHiddenPage =
        pathname?.startsWith("/lesson") ||
        pathname?.startsWith("/courses/") ||
        pathname === "/quiz";

    if (isHiddenPage) return null;

    return (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none" style={{ background: "#06060f" }}>

            {/* ── Deep space base ── */}
            <div className="absolute inset-0" style={{
                background: "radial-gradient(ellipse 120% 80% at 60% 0%, #0d0820 0%, #06060f 55%, #030308 100%)"
            }} />

            {/* ── 3D perspective grid ── */}
            <div className="absolute inset-0" style={{
                backgroundImage: `
                    linear-gradient(rgba(99,85,255,0.18) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(99,85,255,0.18) 1px, transparent 1px)
                `,
                backgroundSize: "72px 72px",
                maskImage: "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.5) 25%, rgba(0,0,0,0.25) 60%, transparent 90%)",
                WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.5) 25%, rgba(0,0,0,0.25) 60%, transparent 90%)",
                transform: "perspective(700px) rotateX(40deg) scaleX(1.6) translateY(-10%)",
                transformOrigin: "center 45%",
                opacity: 0.55,
            }} />

            {/* ── Flat micro-grid overlay ── */}
            <div className="absolute inset-0" style={{
                backgroundImage: `
                    linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
                `,
                backgroundSize: "40px 40px",
                opacity: 1,
            }} />

            {/* ── Horizon glow where grid converges ── */}
            <div className="absolute left-0 right-0" style={{
                top: "38%",
                height: "2px",
                background: "linear-gradient(90deg, transparent 0%, rgba(120,100,255,0.0) 10%, rgba(120,100,255,0.35) 35%, rgba(160,130,255,0.6) 50%, rgba(120,100,255,0.35) 65%, rgba(120,100,255,0.0) 90%, transparent 100%)",
                filter: "blur(1px)",
            }} />
            <div className="absolute left-0 right-0" style={{
                top: "36%",
                height: "60px",
                background: "linear-gradient(to bottom, transparent, rgba(90,75,200,0.08), transparent)",
            }} />

            {/* ── PRIMARY aurora — indigo/violet, slow drift ── */}
            <m.div
                animate={{
                    x: [0, 60, -30, 0],
                    y: [0, -50, 25, 0],
                    scale: [1, 1.18, 0.92, 1],
                }}
                transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
                className="absolute"
                style={{
                    top: "-20%",
                    right: "-8%",
                    width: "750px",
                    height: "750px",
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(83,74,183,0.28) 0%, rgba(83,74,183,0.1) 40%, transparent 70%)",
                    filter: "blur(90px)",
                }}
            />

            {/* ── SECONDARY aurora — deep blue, slow cross-drift ── */}
            <m.div
                animate={{
                    x: [0, -50, 35, 0],
                    y: [0, 45, -25, 0],
                    scale: [1, 1.12, 1.06, 1],
                }}
                transition={{ duration: 34, repeat: Infinity, ease: "easeInOut", delay: 4 }}
                className="absolute"
                style={{
                    bottom: "-15%",
                    left: "-8%",
                    width: "650px",
                    height: "650px",
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(45,80,220,0.22) 0%, rgba(45,80,220,0.07) 40%, transparent 70%)",
                    filter: "blur(90px)",
                }}
            />

            {/* ── TERTIARY — warm teal accent, center-left ── */}
            <m.div
                animate={{
                    x: [0, 25, -18, 0],
                    y: [0, -35, 20, 0],
                    opacity: [0.12, 0.22, 0.09, 0.12],
                }}
                transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 8 }}
                className="absolute"
                style={{
                    top: "42%",
                    left: "28%",
                    width: "420px",
                    height: "420px",
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(40,150,180,0.18) 0%, transparent 60%)",
                    filter: "blur(80px)",
                }}
            />

            {/* ── QUATERNARY — rose accent, top-left, very subtle ── */}
            <m.div
                animate={{
                    x: [0, 40, -20, 0],
                    y: [0, 30, -40, 0],
                    opacity: [0.06, 0.14, 0.06, 0.06],
                }}
                transition={{ duration: 38, repeat: Infinity, ease: "easeInOut", delay: 12 }}
                className="absolute"
                style={{
                    top: "10%",
                    left: "15%",
                    width: "500px",
                    height: "500px",
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(180,60,150,0.15) 0%, transparent 65%)",
                    filter: "blur(100px)",
                }}
            />

            {/* ── Animated horizon beam ── */}
            <m.div
                animate={{
                    opacity: [0.0, 0.08, 0.0],
                    scaleX: [0.8, 1.05, 0.8],
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute left-0 right-0 h-px"
                style={{
                    top: "37%",
                    background: "linear-gradient(90deg, transparent 5%, rgba(140,120,255,0.6) 30%, rgba(180,160,255,1) 50%, rgba(140,120,255,0.6) 70%, transparent 95%)",
                }}
            />

            {/* ── Floating orbs / stars ── */}
            {[
                { top: "12%", left: "22%", size: 2, delay: 0, dur: 5 },
                { top: "8%", left: "68%", size: 1.5, delay: 1.5, dur: 6 },
                { top: "22%", left: "45%", size: 2.5, delay: 3, dur: 7 },
                { top: "18%", left: "80%", size: 1.5, delay: 0.8, dur: 5.5 },
                { top: "30%", left: "10%", size: 2, delay: 2, dur: 6.5 },
                { top: "28%", left: "88%", size: 1, delay: 4, dur: 4.5 },
                { top: "6%", left: "35%", size: 1.5, delay: 2.5, dur: 8 },
                { top: "15%", left: "55%", size: 2, delay: 1, dur: 7 },
            ].map((star, i) => (
                <m.div
                    key={i}
                    className="absolute rounded-full bg-white"
                    style={{ top: star.top, left: star.left, width: star.size, height: star.size }}
                    animate={{ opacity: [0.2, 0.8, 0.2], scale: [1, 1.4, 1] }}
                    transition={{ duration: star.dur, repeat: Infinity, ease: "easeInOut", delay: star.delay }}
                />
            ))}

            {/* ── Noise grain texture ── */}
            <div
                className="absolute inset-0 mix-blend-overlay"
                style={{
                    opacity: 0.018,
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "repeat",
                    backgroundSize: "128px 128px",
                }}
            />

            {/* ── Top-edge darkening ── */}
            <div className="absolute top-0 left-0 right-0 h-24" style={{
                background: "linear-gradient(to bottom, #06060f, transparent)"
            }} />

            {/* ── Bottom-edge darkening ── */}
            <div className="absolute bottom-0 left-0 right-0 h-32" style={{
                background: "linear-gradient(to top, #06060f, transparent)"
            }} />

        </div>
    );
}


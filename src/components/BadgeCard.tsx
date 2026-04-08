"use client";

import { m } from "framer-motion";
import { memo } from "react";
import { type Badge, RARITY_COLORS } from "@/content";

export const BadgeCard = memo(({ badge, earned, onClick, size = "md" }: { badge: Badge, earned: boolean, onClick?: () => void, size?: "sm" | "md" | "lg" }) => {
    const rarity = badge.rarity || "Common";
    const tierColor = RARITY_COLORS[rarity];
    const isSmall = size === "sm";

    return (
        <div
            onClick={onClick}
            style={{
                aspectRatio: "3/4",
                borderRadius: isSmall ? 12 : 20,
                overflow: "hidden",
                perspective: 1000,
                cursor: earned && onClick ? "pointer" : "default",
                willChange: "transform",
                transform: "translateZ(0)",
                border: earned
                    ? `1px solid ${tierColor.border}`
                    : `1px solid ${tierColor.border.replace('0.4', '0.1').replace('0.5', '0.1').replace('0.6', '0.1')}`,
                boxShadow: earned ? `0 ${isSmall ? 6 : 12}px ${isSmall ? 16 : 32}px -8px ${tierColor.glow}` : "none",
                width: isSmall ? "80px" : "100%",
            }}
        >
            <m.div
                whileHover={earned && onClick ? { scale: 1.03, rotateY: 8, rotateX: 6 } : undefined}
                whileTap={earned && onClick ? { scale: 0.95 } : undefined}
                style={{
                    width: "100%",
                    height: "100%",
                    padding: isSmall ? "8px 4px" : "16px 12px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    position: "relative",
                    background: earned
                        ? `linear-gradient(145deg, ${tierColor.main} 0%, rgba(10,10,15,0.4) 100%)`
                        : "rgba(15,15,25,0.4)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                }}
            >
                {/* Atmospheric Glow */}
                {earned && (
                    <div
                        style={{
                            position: "absolute",
                            inset: 0,
                            background: `radial-gradient(ellipse 120% 80% at 50% -10%, ${tierColor.glow}, transparent 70%)`,
                            opacity: 0.45,
                            pointerEvents: "none",
                        }}
                    />
                )}

                {/* Colored shimmer blob */}
                {earned && (
                    <div
                        className="card-shimmer-blob"
                        style={{
                            position: "absolute",
                            width: "180%",
                            height: "180%",
                            top: "-40%",
                            left: "-40%",
                            background: `radial-gradient(ellipse 35% 25% at 50% 50%, rgba(${tierColor.shimmer},0.22), transparent 60%),
                                         radial-gradient(ellipse 70% 55% at 50% 50%, rgba(${tierColor.shimmer},0.07), transparent 80%)`,
                            pointerEvents: "none",
                            zIndex: 1,
                        }}
                    />
                )}

                <div
                    className={`${isSmall ? "text-2xl mb-1" : "text-4xl sm:text-5xl mb-3"} drop-shadow-xl relative z-10`}
                    style={{
                        filter: earned ? "none" : "grayscale(1) brightness(0.2) blur(1px)",
                        opacity: earned ? 1 : 0.4
                    }}
                >
                    {earned ? badge.icon : "🔒"}
                </div>

                <h3
                    className={`${isSmall ? "text-[8px]" : "text-[13px] sm:text-sm mb-1.5"} font-bold relative z-10 leading-tight`}
                    style={{ color: earned ? "white" : "rgba(255,255,255,0.3)" }}
                >
                    {badge.name}
                </h3>

                {!isSmall && (
                    <p
                        className="text-[10px] sm:text-[11px] leading-tight relative z-10 px-1"
                        style={{ color: earned ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.15)" }}
                    >
                        {badge.description}
                    </p>
                )}

                {/* Rarity Label for Medium/Large cards */}
                {!isSmall && (
                    <div 
                        className="mt-2 text-[7px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-full z-10"
                        style={{ 
                            backgroundColor: earned 
                                ? tierColor.border.replace('0.4', '0.2').replace('0.5', '0.2').replace('0.6', '0.2')
                                : "rgba(255,255,255,0.05)",
                            color: earned 
                                ? tierColor.border.replace('0.4', '1').replace('0.5', '1').replace('0.6', '1')
                                : "rgba(255,255,255,0.2)",
                            border: `1px solid ${earned ? tierColor.border : "rgba(255,255,255,0.1)"}`
                        }}
                    >
                        {rarity === "Super Rare" ? "SUPER RARE" : rarity.toUpperCase()}
                    </div>
                )}
            </m.div>

            <style jsx global>{`
                @keyframes cardShimmerDrift {
                    0%   { transform: translate(-18%, -22%) rotate(0deg);   opacity: 0.7; }
                    25%  { transform: translate(18%, -14%) rotate(90deg);   opacity: 1;   }
                    50%  { transform: translate(14%, 18%)  rotate(180deg);  opacity: 0.75; }
                    75%  { transform: translate(-14%, 14%) rotate(270deg);  opacity: 1;   }
                    100% { transform: translate(-18%, -22%) rotate(360deg); opacity: 0.7; }
                }
                .card-shimmer-blob {
                    animation: cardShimmerDrift 7s infinite ease-in-out;
                }
            `}</style>
        </div>
    );
});
BadgeCard.displayName = "BadgeCard";

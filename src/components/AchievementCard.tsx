"use client";

import { m } from "framer-motion";
import { memo } from "react";
import { type Badge, RARITY_COLORS, RarityTier } from "@/content";
import { type LearningPath } from "@/data/learningPaths";

export const AchievementCard = memo(({ path, earned, onClick, size = "md" }: { path: Badge | LearningPath, earned: boolean, onClick?: () => void, size?: "sm" | "md" | "lg" }) => {
    const rarity = (path.rarity || "Legendary") as RarityTier;
    const tierColor = RARITY_COLORS[rarity] || RARITY_COLORS.Legendary;
    const isLarge = size === "lg";
    
    // Support both Badge and LearningPath shapes
    const name = 'nameHe' in path ? (path as LearningPath).nameHe : (path as Badge).name;
    const description = 'descriptionHe' in path ? (path as LearningPath).descriptionHe : (path as Badge).description;
    
    return (
        <div
            onClick={onClick}
            style={{
                aspectRatio: "3/4",
                borderRadius: isLarge ? 32 : 20,
                overflow: "hidden",
                perspective: 1000,
                cursor: earned && onClick ? "pointer" : "default",
                willChange: "transform",
                transform: "translateZ(0)",
                border: earned
                    ? `1px solid ${tierColor.border}`
                    : `1px solid ${tierColor.border.replace('0.4', '0.1').replace('0.5', '0.1').replace('0.6', '0.1')}`,
                boxShadow: earned ? `0 12px 32px -8px ${tierColor.glow}` : "none",
                width: isLarge ? "280px" : "100%",
                maxWidth: isLarge ? "100%" : "none",
            }}
        >
            <m.div
                whileHover={earned && onClick ? { scale: 1.03, rotateY: 8, rotateX: 6 } : undefined}
                whileTap={earned && onClick ? { scale: 0.95 } : undefined}
                style={{
                    width: "100%",
                    height: "100%",
                    padding: isLarge ? "32px 24px" : "16px 12px",
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
                            opacity: 0.6,
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
                    className={`${isLarge ? "text-7xl md:text-8xl mb-8" : "text-4xl sm:text-5xl mb-3"} drop-shadow-xl relative z-10`}
                    style={{
                        filter: earned ? "none" : "grayscale(1) brightness(0.2) blur(1px)",
                        opacity: earned ? 1 : 0.4
                    }}
                >
                    {earned ? path.icon : "🔒"}
                </div>

                <div className="relative z-10">
                    <h3
                        className={`${isLarge ? "text-2xl mb-2" : "text-[13px] sm:text-sm mb-1"} font-black leading-tight`}
                        style={{ color: earned ? "white" : "rgba(255,255,255,0.3)" }}
                    >
                        {name}
                    </h3>
                    
                    {/* Rarity Label */}
                    <div 
                        className={`${isLarge ? "text-xs px-4 py-1 mb-4" : "text-[8px] px-2 py-0.5 mb-2"} font-black uppercase tracking-widest rounded-full inline-block`}
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
                </div>

                {!isLarge && (
                    <p
                        className="text-[10px] leading-tight relative z-10 px-1 line-clamp-2"
                        style={{ color: earned ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.15)" }}
                    >
                        {description}
                    </p>
                )}
                
                {isLarge && (
                    <p className="text-sm md:text-base text-white/60 font-medium max-w-[200px] mx-auto relative z-10">
                        {description}
                    </p>
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
AchievementCard.displayName = "AchievementCard";

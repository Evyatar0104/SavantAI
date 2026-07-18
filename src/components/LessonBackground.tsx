"use client";

import { useEffect, useState } from "react";
import { m, useReducedMotion } from "framer-motion";

interface LessonBackgroundProps {
  accentColor: string;
  bgGlowColor: string;
}

export function LessonBackground({ accentColor, bgGlowColor }: LessonBackgroundProps) {
  const reduceMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const updateVisibility = () => setIsVisible(document.visibilityState === "visible");
    updateVisibility();
    document.addEventListener("visibilitychange", updateVisibility);
    return () => document.removeEventListener("visibilitychange", updateVisibility);
  }, []);

  const shouldAnimate = !reduceMotion && isVisible;

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-[#0d0f1a]">
      <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse 90% 65% at 75% -10%, ${bgGlowColor}24, transparent 65%), #0d0f1a` }} />
      <m.div
        animate={shouldAnimate ? { x: [0, 28, -16, 0], y: [0, -20, 12, 0], scale: [1, 1.08, 0.98, 1] } : undefined}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-44 -left-40 size-[34rem] rounded-full opacity-15 blur-[100px]"
        style={{ background: `radial-gradient(circle, ${accentColor}, transparent 70%)`, willChange: shouldAnimate ? "transform" : "auto" }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:linear-gradient(to_bottom,black,transparent_82%)]" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0d0f1a] to-transparent" />
    </div>
  );
}
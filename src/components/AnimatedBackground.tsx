"use client";

import { useEffect, useState } from "react";
import { m, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";

export function AnimatedBackground() {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(true);
  const isFocusedFlow = pathname?.startsWith("/lesson") || pathname?.startsWith("/courses/") || pathname === "/quiz" || pathname?.includes("/practice/builder/");

  useEffect(() => {
    const updateVisibility = () => setIsVisible(document.visibilityState === "visible");
    updateVisibility();
    document.addEventListener("visibilitychange", updateVisibility);
    return () => document.removeEventListener("visibilitychange", updateVisibility);
  }, []);

  if (isFocusedFlow) return null;
  const shouldAnimate = !reduceMotion && isVisible;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#0d0f1a]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_75%_-10%,rgba(83,74,183,0.24),transparent_58%),radial-gradient(ellipse_70%_55%_at_0%_100%,rgba(37,99,235,0.12),transparent_62%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:linear-gradient(to_bottom,black,transparent_86%)]" />
      <m.div
        animate={shouldAnimate ? { x: [0, -28, 18, 0], y: [0, 24, -14, 0], scale: [1, 1.06, 0.98, 1] } : undefined}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -left-40 top-[24%] size-[34rem] rounded-full bg-violet-600/10 blur-[100px]"
        style={{ willChange: shouldAnimate ? "transform" : "auto" }}
      />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#0d0f1a] to-transparent" />
    </div>
  );
}
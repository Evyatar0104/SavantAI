"use client";

import { useState, useEffect, useRef } from "react";

export function XPCounter({ target }: { target: number }) {
    const [display, setDisplay] = useState(0);
    const started = useRef(false);

    useEffect(() => {
        if (started.current) return;
        started.current = true;
        const start = Date.now();
        const duration = 1000;
        const tick = () => {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    }, [target]);

    return <span>+{display}</span>;
}


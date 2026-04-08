import { useEffect, useState } from "react";

/**
 * Custom hook to handle scroll capture and restoration for a specific element.
 * Useful for maintaining scroll state in the global store across page navigations.
 */
export function useScrollRestoration(
    scrollPosition: number,
    setScrollPosition: (pos: number) => void,
    hasHydrated: boolean,
    selector: string = 'main'
) {
    const [isRestored, setIsRestored] = useState(() => {
        // Initial state: if we have no position stored or it's top, mark as restored immediately
        // to start capturing. Otherwise, wait for hydration and restoration logic.
        if (typeof window !== 'undefined') {
            return scrollPosition === 0;
        }
        return false;
    });

    // Scroll Restoration Logic
    useEffect(() => {
        if (!hasHydrated || isRestored) return;

        const element = document.querySelector(selector);
        if (element && scrollPosition > 0) {
            const restore = () => {
                element.scrollTo({ top: scrollPosition });
                setIsRestored(true);
            };

            // Trigger restoration multiple times to account for dynamic content layout shifts
            restore();
            const timers = [
                setTimeout(restore, 20),
                setTimeout(restore, 100),
                setTimeout(restore, 300),
                setTimeout(restore, 600), // Added one extra for slower connections/renders
            ];
            return () => timers.forEach(clearTimeout);
        } else {
            setIsRestored(true);
        }
    }, [hasHydrated, scrollPosition, isRestored, selector]);

    // Scroll Capture Logic
    useEffect(() => {
        const element = document.querySelector(selector);
        if (!element) return;

        let frameId: number;
        const handleScroll = () => {
            // Only capture scroll positions AFTER the initial restoration is complete
            if (!isRestored) return;
            
            cancelAnimationFrame(frameId);
            frameId = requestAnimationFrame(() => {
                const currentPos = element.scrollTop;
                // Only save if it's a meaningful change or we are at the top
                if (currentPos > 0 || (currentPos === 0 && scrollPosition < 100)) {
                    setScrollPosition(currentPos);
                }
            });
        };

        element.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            element.removeEventListener('scroll', handleScroll);
            cancelAnimationFrame(frameId);
        };
    }, [setScrollPosition, isRestored, scrollPosition, selector]);

    return { isRestored };
}

import { useEffect, useRef, useState } from "react";

/**
 * Custom hook to handle scroll capture and restoration for a specific element.
 * Useful for maintaining scroll state in the global store across page navigations.
 *
 * Capture is flush-based: the position is tracked locally and only written to the
 * store when the page is left (unmount / pagehide / resetKey change). Writing on
 * every scroll frame would re-render the subscribing page and re-serialize the
 * persisted store to localStorage continuously while scrolling.
 *
 * Pass `resetKey` (e.g. courseId) when the same mounted page can switch to a
 * different scroll-position record without unmounting.
 */
export function useScrollRestoration(
    scrollPosition: number,
    setScrollPosition: (pos: number) => void,
    hasHydrated: boolean,
    selector: string = 'main',
    resetKey: string | number = ''
) {
    const [isRestored, setIsRestored] = useState(() => {
        // Initial state: if we have no position stored or it's top, mark as restored immediately
        // to start capturing. Otherwise, wait for hydration and restoration logic.
        if (typeof window !== 'undefined') {
            return scrollPosition === 0;
        }
        return false;
    });

    // Keep latest values in refs so effects don't need to re-subscribe per render.
    const scrollPositionRef = useRef(scrollPosition);
    scrollPositionRef.current = scrollPosition;
    const setScrollPositionRef = useRef(setScrollPosition);
    setScrollPositionRef.current = setScrollPosition;
    const isRestoredRef = useRef(isRestored);
    isRestoredRef.current = isRestored;

    // Re-arm restoration when the record we track changes in place (render-phase reset).
    const prevKeyRef = useRef(resetKey);
    if (prevKeyRef.current !== resetKey) {
        prevKeyRef.current = resetKey;
        setIsRestored(scrollPosition === 0);
    }

    // Scroll Restoration Logic
    useEffect(() => {
        if (!hasHydrated || isRestored) return;

        const element = document.querySelector(selector);
        const target = scrollPositionRef.current;
        if (element && target > 0) {
            const restore = () => {
                element.scrollTo({ top: target });
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
    }, [hasHydrated, isRestored, selector, resetKey]);

    // Scroll Capture Logic — track locally, flush to the store only on exit
    useEffect(() => {
        const element = document.querySelector(selector);
        if (!element) return;

        // Capture the setter for THIS resetKey at subscribe time, so the exit
        // flush writes to the record we were tracking, not the next one.
        const setPos = setScrollPositionRef.current;
        const initialPos = scrollPositionRef.current;

        let lastPos = 0;
        let dirty = false;
        const handleScroll = () => {
            // Only capture scroll positions AFTER the initial restoration is complete
            if (!isRestoredRef.current) return;
            lastPos = element.scrollTop;
            dirty = true;
        };

        const flush = () => {
            if (!dirty) return;
            if (lastPos !== initialPos) {
                setPos(lastPos);
            }
        };

        element.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('pagehide', flush);
        return () => {
            element.removeEventListener('scroll', handleScroll);
            window.removeEventListener('pagehide', flush);
            flush();
        };
    }, [selector, resetKey]);

    return { isRestored };
}

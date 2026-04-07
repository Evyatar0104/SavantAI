export const haptics = {
    tap: () => typeof navigator !== "undefined" && navigator.vibrate?.(10),
    success: () => typeof navigator !== "undefined" && navigator.vibrate?.([10, 50, 20]),
    error: () => typeof navigator !== "undefined" && navigator.vibrate?.([30, 20, 30]),
    complete: () => typeof navigator !== "undefined" && navigator.vibrate?.([10, 30, 10, 30, 40]),
    impact: (style: "light" | "medium" | "heavy" = "medium") => {
        if (typeof navigator === "undefined" || !navigator.vibrate) return;
        const duration = style === "light" ? 10 : style === "medium" ? 20 : 40;
        navigator.vibrate(duration);
    },
    notification: (type: "success" | "warning" | "error") => {
        if (typeof navigator === "undefined" || !navigator.vibrate) return;
        const pattern = type === "success" ? [10, 60, 10] : type === "warning" ? [30, 40, 30] : [60, 40, 60];
        navigator.vibrate(pattern);
    }
};


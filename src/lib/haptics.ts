export const haptics = {
    tap: () => navigator.vibrate?.(10),
    success: () => navigator.vibrate?.([10, 50, 20]),
    error: () => navigator.vibrate?.([30, 20, 30]),
    complete: () => navigator.vibrate?.([10, 30, 10, 30, 40]),
};

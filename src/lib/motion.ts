import type { Transition, Variants } from "framer-motion";

export const motionTransition: Transition = {
    duration: 0.38,
    ease: [0.16, 1, 0.3, 1],
};

export const entranceVariants: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
        opacity: 1,
        y: 0,
        transition: motionTransition,
    },
};

export const staggerContainerVariants: Variants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.06,
            delayChildren: 0.04,
        },
    },
};

export const pressMotion = {
    whileTap: { scale: 0.98 },
    transition: { type: "spring", stiffness: 450, damping: 32 } satisfies Transition,
} as const;

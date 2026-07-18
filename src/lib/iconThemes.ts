// Single source of truth for the lesson icon → accent theme mapping.
// Used by both LessonRunner and BlockLessonRunner so the two runners
// always resolve the same colors for the same lesson icon.

export interface IconTheme {
    bgGlow: string;
    accent: string;
}

export const ICON_THEMES: Record<string, IconTheme> = {
    "🧠": { bgGlow: "#7C3AED", accent: "#A78BFA" },
    "🗂️": { bgGlow: "#1D4ED8", accent: "#60A5FA" },
    "🪟": { bgGlow: "#0E7490", accent: "#22D3EE" },
    "🔁": { bgGlow: "#C2410C", accent: "#FB923C" },
    "⛓️": { bgGlow: "#B45309", accent: "#FCD34D" },
    "🎭": { bgGlow: "#991B1B", accent: "#FCA5A5" },
    "🎯": { bgGlow: "#0F766E", accent: "#2DD4BF" },
    "📐": { bgGlow: "#3730A3", accent: "#818CF8" },
    "💬": { bgGlow: "#9D174D", accent: "#F9A8D4" },
    "🔬": { bgGlow: "#166534", accent: "#86EFAC" },
    "📚": { bgGlow: "#92400E", accent: "#FDE68A" },
    "🧬": { bgGlow: "#6B21A8", accent: "#C084FC" },
};

export const DEFAULT_ICON_THEME: IconTheme = { bgGlow: "#064E3B", accent: "#34D399" };

export function getIconTheme(icon: string | undefined): IconTheme {
    return ICON_THEMES[icon || ""] || DEFAULT_ICON_THEME;
}

export const XP_PER_LEVEL = 500;

export const getLevelInfo = (xp: number) => {
    const level = Math.floor(xp / XP_PER_LEVEL) + 1;
    const currentLevelXp = xp % XP_PER_LEVEL;
    const progress = (currentLevelXp / XP_PER_LEVEL) * 100;
    const xpToNext = XP_PER_LEVEL - currentLevelXp;
    
    return { level, progress, xpToNext };
};

export const MODEL_THEMES: Record<string, { 
    primary: string; 
    secondary: string; 
    glow: string; 
    label: string;
    icon: string;
    description: string;
}> = {
    claude:  { 
        primary: "#EF6C00", 
        secondary: "#FF9800", 
        glow: "rgba(239, 108, 0, 0.4)", 
        label: "Claude",
        icon: "/assets/logos/claude.png",
        description: "המומחה לכתיבה יצירתית, ניתוח טקסטים מורכבים וחשיבה אנושית ומעמיקה."
    },
    chatgpt: { 
        primary: "#10A37F", 
        secondary: "#19C37D", 
        glow: "rgba(16, 163, 127, 0.4)", 
        label: "ChatGPT",
        icon: "/assets/logos/chatgpt.png",
        description: "הכלי הרב-תכליתי ביותר בעולם. מצטיין בפתרון בעיות, כתיבת קוד וניהול שיחות זורמות."
    },
    gemini:  { 
        primary: "#4285F4", 
        secondary: "#8AB4F8", 
        glow: "rgba(66, 133, 244, 0.4)", 
        label: "Gemini",
        icon: "/assets/logos/gemini.png",
        description: "העוזר החכם של גוגל. מחובר למידע בזמן אמת ומצטיין בעיבוד מידע רב-ערוצי (תמונות, וידאו וטקסט)."
    },
    default: {
        primary: "#6366F1",
        secondary: "#A855F7",
        glow: "rgba(99, 102, 241, 0.4)",
        label: "Savant",
        icon: "/assets/savant-logo.png",
        description: "המדריך האישי שלך לעולם הבינה המלאכותית."
    }
};

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

export const QUIZ_MODEL_NAMES: Record<string, string> = {
    claude: "Claude",
    chatgpt: "ChatGPT",
    gemini: "Gemini",
};

export const QUIZ_MODEL_THEME: Record<string, {
    gradient: string;
    glowColor: string;
    accentColor: string;
    orbColors: [string, string];
    tagline: string;
}> = {
    claude: {
        gradient: "from-[#D97706]/20 via-[#EA580C]/15 to-[#C2410C]/10",
        glowColor: "rgba(217,119,6,0.15)",
        accentColor: "#D97706",
        orbColors: ["rgba(234,88,12,0.25)", "rgba(217,119,6,0.2)"],
        tagline: "עומק, דיוק, ומחשבה",
    },
    chatgpt: {
        gradient: "from-[#10A37F]/20 via-[#0D9668]/15 to-[#059669]/10",
        glowColor: "rgba(16,163,127,0.15)",
        accentColor: "#10A37F",
        orbColors: ["rgba(16,163,127,0.25)", "rgba(5,150,105,0.2)"],
        tagline: "גמישות, יצירתיות, ומהירות",
    },
    gemini: {
        gradient: "from-[#4285F4]/20 via-[#A855F7]/15 to-[#EC4899]/10",
        glowColor: "rgba(66,133,244,0.15)",
        accentColor: "#4285F4",
        orbColors: ["rgba(66,133,244,0.25)", "rgba(168,85,247,0.2)"],
        tagline: "מחקר, אינטגרציה, וחינם",
    },
};

export const TOOL_LOGOS: Record<string, string> = {
    "ChatGPT": "/assets/logos/chatgpt.png",
    "Claude": "/assets/logos/claude.png",
    "Gemini": "/assets/logos/gemini.png",
    "Grok": "/assets/logos/grok.png",
    "Perplexity": "/assets/logos/perplexity.png",
    "NotebookLM": "/assets/logos/notebooklm.png",
};

export const TOOL_EMOJIS: Record<string, string> = {
    "Suno": "🎵",
    "Midjourney": "🎨",
    "Notion AI": "📝",
    "Runway": "🎬",
    "Gamma": "✏️",
    "DALL-E": "🎨",
    "ElevenLabs": "🎙️",
    "Udio": "🎶",
    "Cursor": "💻",
    "v0": "💅",
    "GitHub Copilot": "🤖",
    "Julius AI": "📊",
    "ChatGPT Data Analysis": "📈",
};

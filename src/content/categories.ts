import { Category } from "./types";

export const CATEGORIES: Category[] = [
    {
        id: "foundation",
        name: "Foundation",
        nameHe: "הבסיס",
        description: "מושגי מפתח בבינה המלאכותית, אבן דרך להבנת מדריכי עומק",
        color: "from-purple-600 to-indigo-800",
        icon: "🧠",
        order: 1,
        unlockType: "linear"
    },
    {
        id: "models",
        name: "Model Guides",
        nameHe: "מדריך למודל",
        description: "הכרות מעמיקה עם מודלי השפה המובילים — היכולות, המגבלות והכלים הייחודיים לכל אחד.",
        color: "from-blue-700 to-indigo-900",
        icon: "🤖",
        order: 2,
        unlockType: "open"
    },
    {
        id: "tools",
        name: "Tool Guides",
        nameHe: "כלים",
        description: "מדריכים מעמיקים לכלי ה-AI המובילים — NotebookLM, Vibe Coding ועוד",
        color: "from-[#0D1B2A] to-[#1B263B]",
        icon: "🛠️",
        order: 3,
        unlockType: "open"
    },
    {
        id: "real-life",
        name: "Real Life",
        nameHe: "AI בחיים האמיתיים",
        description: "כלי בינה מלאכותית שימושיים למשימות יומיומיות",
        color: "from-emerald-500 to-teal-700",
        icon: "🌍",
        order: 4,
        unlockType: "open"
    },
    {
        id: "professional",
        name: "Professional",
        nameHe: "AI מקצועי",
        description: "ללמוד איך להיות אלוף עם בינה מלאכותית בתחומים שונים",
        color: "from-orange-500 to-red-700",
        icon: "💼",
        order: 5,
        unlockType: "open"
    },
    {
        id: "advanced",
        name: "Advanced",
        nameHe: "חשיבה מתקדמת",
        description: "השקפות עולם וסטטיסטיקות מהמובילים בתחום, אתיקה וכלים מתקדמים",
        color: "from-amber-500 to-yellow-700",
        icon: "🔮",
        order: 6,
        unlockType: "open"
    }
];

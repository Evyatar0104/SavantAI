export type ModelTheme = "claude" | "chatgpt" | "gemini";
export type RarityTier = "Common" | "Rare" | "Epic" | "Legendary";

export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string;
    special?: boolean;
    modelTheme?: ModelTheme;
    xpReward?: number;
    rarity?: RarityTier;
}

export const BADGES: Badge[] = [
    {
        id: "first-lesson",
        name: "צעד ראשון",
        description: "השלמת שיעור ראשון",
        icon: "🎯",
        modelTheme: "claude",
        rarity: "Common",
        xpReward: 10,
    },
    {
        id: "three-lessons",
        name: "מתחמם",
        description: "השלמת 3 שיעורים",
        icon: "🔥",
        modelTheme: "chatgpt",
        rarity: "Common",
        xpReward: 30,
    },
    {
        id: "six-lessons",
        name: "רציני",
        description: "השלמת 6 שיעורים",
        icon: "💎",
        modelTheme: "gemini",
        rarity: "Rare",
        xpReward: 60,
    },
    {
        id: "first-course",
        name: "בוגר קורס",
        description: "השלמת קורס שלם",
        icon: "🎓",
        modelTheme: "claude",
        rarity: "Rare",
        xpReward: 100,
    },
    {
        id: "streak-3",
        name: "עקשן",
        description: "3 ימים ברצף",
        icon: "⚡",
        modelTheme: "chatgpt",
        rarity: "Rare",
        xpReward: 50,
    },
    {
        id: "quiz-done",
        name: "מאופיין",
        description: "השלמת את האפיון",
        icon: "🧬",
        special: true,
        modelTheme: "gemini",
        rarity: "Epic",
        xpReward: 100,
    },
    {
        id: "hall-of-projects",
        name: "בונה פרוייקטים",
        description: "השלמת 3 פרוייקטים מעשיים",
        icon: "🏗️",
        modelTheme: "claude",
        rarity: "Epic",
        xpReward: 200,
    }
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isBadgeEarned = (badgeId: string, state: any) => {
    switch (badgeId) {
        case "first-lesson": return state.completedLessons.length >= 1;
        case "three-lessons": return state.completedLessons.length >= 3;
        case "six-lessons": return state.completedLessons.length >= 6;
        case "first-course": return state.completedCourses.length >= 1;
        case "streak-3": return state.streak >= 3;
        case "quiz-done": return state.quizCompleted === true;
        default: return state.badges.includes(badgeId);
    }
};

import { CATEGORIES } from "./categories";
import { COURSES } from "./courses";

export type Question = {
    id: string;
    text: string;
    options: string[];
    correctIndex: number;
    explanation: string;
};

export type Category = {
    id: string;
    name: string;
    nameHe: string;
    description: string;
    color: string;
    icon: string;
    order: number;
    unlockType: "linear" | "open";
};

export type Course = {
    id: string;
    categoryId: string;
    name: string;
    nameHe: string;
    description: string;
    icon: string;
    image?: string;
    order: number;
    isLocked: boolean;
    requiredCourseId?: string;
};

export type RewardType = "xp" | "badge" | "unlock";

export type LessonReward = {
    type: RewardType;
    value: number | string;
    label: string;
};

export type Lesson = {
    id: string;
    trackId?: string;
    courseId: string;
    categoryId: string;
    order: number;
    title: string;
    description: string;
    hook?: string;
    icon?: string;
    readContent: string;
    tldr?: string;
    scienceA?: string;
    scienceB?: string;
    pullQuote?: string;
    practicalCall?: {
        task: string;
        goal: string;
        tool: string;
    };
    insight: string;
    image?: string;
    questions: Question[];
    reward?: LessonReward;
};


export type Track = {
    id: string;
    name: string;
    color: string;
    icon: string;
};

export const TRACKS: Track[] = [
    { id: "ai", name: "בינה מלאכותית פרקטית", color: "from-purple-600 to-indigo-800", icon: "🤖" },
];

export { CATEGORIES, COURSES };


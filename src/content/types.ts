export type RewardType = "xp" | "badge" | "unlock";

export interface LessonReward {
    type: RewardType;
    value: number | string;
    label: string;
}

export interface Question {
    id: string;
    text: string;
    options: string[];
    correctIndex: number;
    explanation: string;
}

export interface PracticalCall {
    task: string;
    goal: string;
    tool: string;
}

export interface CourseCta {
    text: string;
    courseId: string;
}

export interface Category {
    id: string;
    name: string;
    nameHe: string;
    description: string;
    color: string;
    icon: string;
    order: number;
    unlockType: "linear" | "open";
}

export interface Course {
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
}

export interface Track {
    id: string;
    name: string;
    color: string;
    icon: string;
}

export interface Lesson {
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
    practicalCall?: PracticalCall;
    insight: string;
    image?: string;
    courseCta?: CourseCta;
    questions: Question[];
    reward?: LessonReward;
    diagram?: string;
}

export interface LessonMeta {
    id: string;
    trackId?: string;
    courseId: string;
    categoryId: string;
    order: number;
    title: string;
    icon?: string;
    description: string;
    reward?: LessonReward;
}

/**
 * Helper to define a course's lessons with full type checking.
 */
export function defineCourse(lessons: Lesson[]): Lesson[] {
    return lessons;
}

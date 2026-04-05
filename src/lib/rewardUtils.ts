import { LESSON_INDEX } from "@/data/lessons-index";
import { COURSES } from "@/data/lessons";

export interface RewardResult {
    newXp: number;
    newBadges: string[];
    newCard: string | null;
}

export const calculateLessonRewards = (
    lessonId: string,
    currentXp: number,
    currentBadges: string[],
    completedCount: number
): RewardResult => {
    let newXp = currentXp;
    const newBadges = [...currentBadges];
    let newCard: string | null = null;

    const meta = LESSON_INDEX.find(l => l.id === lessonId);
    if (meta?.reward) {
        if (meta.reward.type === 'xp' && typeof meta.reward.value === 'number') {
            newXp += meta.reward.value;
        } else if (meta.reward.type === 'badge' && typeof meta.reward.value === 'string') {
            if (!newBadges.includes(meta.reward.value)) {
                newBadges.push(meta.reward.value);
                newCard = meta.reward.value;
            }
        }
    }

    if (completedCount === 1 && !newBadges.includes("first-lesson")) {
        newBadges.push("first-lesson");
        newCard = "first-lesson";
    }
    if (completedCount === 3 && !newBadges.includes("three-lessons")) {
        newBadges.push("three-lessons");
        newCard = "three-lessons";
    }
    if (completedCount === 6 && !newBadges.includes("six-lessons")) {
        newBadges.push("six-lessons");
        newCard = "six-lessons";
    }

    return { newXp, newBadges, newCard };
};

export const calculateStreakRewards = (
    streak: number,
    currentBadges: string[]
): { newBadges: string[]; newCard: string | null } => {
    const newBadges = [...currentBadges];
    let newCard: string | null = null;
    if (streak >= 3 && !newBadges.includes("streak-3")) {
        newBadges.push("streak-3");
        newCard = "streak-3";
    }
    return { newBadges, newCard };
};

export const calculateCourseRewards = (
    courseId: string,
    completedCourses: string[],
    currentBadges: string[]
): { newBadges: string[]; newCard: string | null; categoryUnlocked: string | null } => {
    const newBadges = [...currentBadges];
    let newCard: string | null = null;
    let categoryUnlocked: string | null = null;

    if (completedCourses.length === 1 && !newBadges.includes("first-course")) {
        newBadges.push("first-course");
        newCard = "first-course";
    }

    const course = COURSES.find(c => c.id === courseId);
    if (course) {
        const categoryCourses = COURSES.filter(c => c.categoryId === course.categoryId);
        const allCategoryDone = categoryCourses.every(c => completedCourses.includes(c.id));
        if (allCategoryDone) {
            categoryUnlocked = course.categoryId;
        }
    }

    return { newBadges, newCard, categoryUnlocked };
};

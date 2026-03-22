import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { COURSES } from '@/data/lessons';

type ModelName = "claude" | "chatgpt" | "gemini";

interface QuizResult {
    primaryUseCase: string;
    profileTitle: string;
    outputTypes: string[];
    outputDepth: string | null;
    workStyle: string | null;
    budgetLevel: string | null;
    specialistTools: string[];
    geminiIsAllRounder: boolean;
    preferredTools: string[];
    experienceLevel: "beginner" | "intermediate";
    primaryModel: ModelName;
    secondaryModel: ModelName;
    primaryModelReason: string;
    recommendedCourseId: string;
}

interface SavantState {
    xp: number;
    streak: number;
    lastActiveDate: string | null;
    completedLessons: string[];
    unlockedAITracks: string[];
    completedCourses: string[];
    unlockedCategories: string[];
    // Quiz profile
    quizCompleted: boolean;
    primaryUseCase: string | null;
    profileTitle: string | null;
    outputTypes: string[];
    outputDepth: string | null;
    workStyle: string | null;
    budgetLevel: string | null;
    specialistTools: string[];
    geminiIsAllRounder: boolean;
    preferredTools: string[];
    experienceLevel: "beginner" | "intermediate" | null;
    // Recommendations
    primaryModel: ModelName | null;
    secondaryModel: ModelName | null;
    primaryModelReason: string | null;
    recommendedCourseId: string | null;
    // User identity
    userName: string | null;
    // Actions
    addXp: (amount: number) => void;
    completeLesson: (lessonId: string) => void;
    unlockAITrack: (trackId: string) => void;
    completeCourse: (courseId: string) => void;
    unlockCategory: (categoryId: string) => void;
    checkStreak: () => void;
    setQuizResult: (result: QuizResult) => void;
    setUserName: (name: string) => void;
    resetAllData: () => void;
    resetPreferences: () => void;
}

export const useSavantStore = create<SavantState>()(
    persist(
        (set, get) => ({
            xp: 0,
            streak: 0,
            lastActiveDate: null,
            completedLessons: [],
            unlockedAITracks: [],
            completedCourses: [],
            unlockedCategories: ["foundation"],
            // Quiz profile
            quizCompleted: false,
            primaryUseCase: null,
            profileTitle: null,
            outputTypes: [],
            outputDepth: null,
            workStyle: null,
            budgetLevel: null,
            specialistTools: [],
            geminiIsAllRounder: false,
            preferredTools: [],
            experienceLevel: null,
            // User identity
            userName: null,
            // Recommendations
            primaryModel: null,
            secondaryModel: null,
            primaryModelReason: null,
            recommendedCourseId: null,
            // Actions
            addXp: (amount: number) => set((state: SavantState) => ({ xp: state.xp + amount })),
            completeLesson: (lessonId: string) =>
                set((state: SavantState) => ({
                    completedLessons: state.completedLessons.includes(lessonId)
                        ? state.completedLessons
                        : [...state.completedLessons, lessonId],
                })),
            unlockAITrack: (trackId: string) =>
                set((state: SavantState) => ({
                    unlockedAITracks: state.unlockedAITracks.includes(trackId)
                        ? state.unlockedAITracks
                        : [...state.unlockedAITracks, trackId],
                })),
            completeCourse: (courseId: string) => {
                const state = get();
                if (state.completedCourses.includes(courseId)) return;

                const updatedCourses = [...state.completedCourses, courseId];

                const course = COURSES.find(c => c.id === courseId);
                if (course) {
                    const categoryCourses = COURSES.filter(c => c.categoryId === course.categoryId);
                    const allCategoryDone = categoryCourses.every(c => updatedCourses.includes(c.id));
                    if (allCategoryDone && !state.unlockedCategories.includes(course.categoryId)) {
                        set({
                            completedCourses: updatedCourses,
                            unlockedCategories: [...state.unlockedCategories, course.categoryId],
                        });
                        return;
                    }
                }

                set({ completedCourses: updatedCourses });
            },
            unlockCategory: (categoryId: string) =>
                set((state: SavantState) => ({
                    unlockedCategories: state.unlockedCategories.includes(categoryId)
                        ? state.unlockedCategories
                        : [...state.unlockedCategories, categoryId],
                })),
            checkStreak: () => {
                const today = new Date().toDateString();
                const lastActive = get().lastActiveDate;

                if (lastActive !== today) {
                    const yesterday = new Date();
                    yesterday.setDate(yesterday.getDate() - 1);

                    if (lastActive === yesterday.toDateString()) {
                        set((state: SavantState) => ({ streak: state.streak + 1, lastActiveDate: today }));
                    } else {
                        set({ streak: 1, lastActiveDate: today });
                    }
                }
            },
            setQuizResult: (result: QuizResult) =>
                set({
                    quizCompleted: true,
                    primaryUseCase: result.primaryUseCase,
                    profileTitle: result.profileTitle,
                    outputTypes: result.outputTypes,
                    outputDepth: result.outputDepth,
                    workStyle: result.workStyle,
                    budgetLevel: result.budgetLevel,
                    specialistTools: result.specialistTools,
                    geminiIsAllRounder: result.geminiIsAllRounder,
                    preferredTools: result.preferredTools,
                    experienceLevel: result.experienceLevel,
                    primaryModel: result.primaryModel,
                    secondaryModel: result.secondaryModel,
                    primaryModelReason: result.primaryModelReason,
                    recommendedCourseId: result.recommendedCourseId,
                }),
            setUserName: (name: string) => set({ userName: name.trim() || null }),
            resetPreferences: () =>
                set({
                    quizCompleted: false,
                    primaryUseCase: null,
                    profileTitle: null,
                    outputTypes: [],
                    outputDepth: null,
                    workStyle: null,
                    budgetLevel: null,
                    specialistTools: [],
                    geminiIsAllRounder: false,
                    preferredTools: [],
                    experienceLevel: null,
                    primaryModel: null,
                    secondaryModel: null,
                    primaryModelReason: null,
                    recommendedCourseId: null,
                }),
            resetAllData: () =>
                set({
                    quizCompleted: false,
                    primaryUseCase: null,
                    profileTitle: null,
                    outputTypes: [],
                    outputDepth: null,
                    workStyle: null,
                    budgetLevel: null,
                    specialistTools: [],
                    geminiIsAllRounder: false,
                    preferredTools: [],
                    experienceLevel: null,
                    primaryModel: null,
                    secondaryModel: null,
                    primaryModelReason: null,
                    recommendedCourseId: null,
                    userName: null,
                }),
        }),
        {
            name: 'savant-storage',
        }
    )
);

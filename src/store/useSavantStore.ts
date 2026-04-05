import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { COURSES } from '@/data/lessons';
import { LESSON_INDEX } from '@/data/lessons-index';

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
    completedPractice: string[];
    unlockedAITracks: string[];
    completedCourses: string[];
    unlockedCategories: string[];
    badges: string[];
    // Vault notification
    unlockedVaultCard: string | null;
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
    // Prompt Builder State
    activePracticeId: string | null;
    currentStepIndex: number;
    builderInputs: Record<string, string>;
    hasIterated: boolean;
    // Actions
    addXp: (amount: number) => void;
    completeLesson: (lessonId: string) => void;
    completePracticeItem: (itemId: string, xp: number) => void;
    unlockAITrack: (trackId: string) => void;
    completeCourse: (courseId: string) => void;
    unlockCategory: (categoryId: string) => void;
    checkStreak: () => void;
    setQuizResult: (result: QuizResult) => void;
    setUserName: (name: string) => void;
    resetAllData: () => void;
    resetPreferences: () => void;
    setActivePracticeId: (id: string | null) => void;
    setCurrentStepIndex: (index: number) => void;
    setBuilderInput: (stepId: string, value: string) => void;
    setHasIterated: (val: boolean) => void;
    resetBuilder: () => void;
    clearUnlockedVaultCard: () => void;
}

export const useSavantStore = create<SavantState>()(
    persist(
        (set, get) => ({
            xp: 0,
            streak: 0,
            lastActiveDate: null,
            completedLessons: [],
            completedPractice: [],
            unlockedAITracks: [],
            completedCourses: [],
            unlockedCategories: ["foundation"],
            badges: [],
            unlockedVaultCard: null,
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
            // Prompt Builder State
            activePracticeId: null,
            currentStepIndex: 0,
            builderInputs: {},
            hasIterated: false,
            // Actions
            clearUnlockedVaultCard: () => set({ unlockedVaultCard: null }),
            addXp: (amount: number) => set((state: SavantState) => ({ xp: state.xp + amount })),
            completeLesson: (lessonId: string) => {
                const state = get();
                if (state.completedLessons.includes(lessonId)) return;

                // Process potential rewards
                let newXp = state.xp;
                const newBadges = [...state.badges];
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

                const newCompletedCount = state.completedLessons.length + 1;
                if (newCompletedCount === 1 && !newBadges.includes("first-lesson")) { newBadges.push("first-lesson"); newCard = "first-lesson"; }
                if (newCompletedCount === 3 && !newBadges.includes("three-lessons")) { newBadges.push("three-lessons"); newCard = "three-lessons"; }
                if (newCompletedCount === 6 && !newBadges.includes("six-lessons")) { newBadges.push("six-lessons"); newCard = "six-lessons"; }

                set({
                    completedLessons: [...state.completedLessons, lessonId],
                    xp: newXp,
                    badges: newBadges,
                    ...(newCard ? { unlockedVaultCard: newCard } : {})
                });
            },
            completePracticeItem: (itemId: string, xp: number) =>
                set((state: SavantState) => {
                    if (state.completedPractice.includes(itemId)) return {};
                    const updatedPractice = [...state.completedPractice, itemId];
                    const completedProjects = updatedPractice.filter(id => id.startsWith('project-'));
                    const newBadges = [...state.badges];
                    let newCard: string | null = null;
                    if (completedProjects.length >= 3 && !newBadges.includes('hall-of-projects')) {
                        newBadges.push('hall-of-projects');
                        newCard = 'hall-of-projects';
                    }
                    return { 
                        completedPractice: updatedPractice, 
                        xp: state.xp + xp, 
                        badges: newBadges,
                        ...(newCard ? { unlockedVaultCard: newCard } : {})
                    };
                }),
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
                const newBadges = [...state.badges];
                let newCard: string | null = null;
                
                if (updatedCourses.length === 1 && !newBadges.includes("first-course")) {
                    newBadges.push("first-course");
                    newCard = "first-course";
                }

                const course = COURSES.find(c => c.id === courseId);
                if (course) {
                    const categoryCourses = COURSES.filter(c => c.categoryId === course.categoryId);
                    const allCategoryDone = categoryCourses.every(c => updatedCourses.includes(c.id));
                    if (allCategoryDone && !state.unlockedCategories.includes(course.categoryId)) {
                        set({
                            completedCourses: updatedCourses,
                            unlockedCategories: [...state.unlockedCategories, course.categoryId],
                            badges: newBadges,
                            ...(newCard ? { unlockedVaultCard: newCard } : {})
                        });
                        return;
                    }
                }

                set({ 
                    completedCourses: updatedCourses, 
                    badges: newBadges,
                    ...(newCard ? { unlockedVaultCard: newCard } : {})
                });
            },
            unlockCategory: (categoryId: string) =>
                set((state: SavantState) => ({
                    unlockedCategories: state.unlockedCategories.includes(categoryId)
                        ? state.unlockedCategories
                        : [...state.unlockedCategories, categoryId],
                })),
            checkStreak: () => {
                const today = new Date().toDateString();
                const state = get();
                const lastActive = state.lastActiveDate;

                if (lastActive !== today) {
                    const yesterday = new Date();
                    yesterday.setDate(yesterday.getDate() - 1);

                    let newStreak = state.streak;
                    if (lastActive === yesterday.toDateString()) {
                        newStreak += 1;
                    } else {
                        newStreak = 1;
                    }
                    
                    const newBadges = [...state.badges];
                    let newCard: string | null = null;
                    if (newStreak >= 3 && !newBadges.includes("streak-3")) {
                        newBadges.push("streak-3");
                        newCard = "streak-3";
                    }

                    set({ 
                        streak: newStreak, 
                        lastActiveDate: today,
                        badges: newBadges,
                        ...(newCard ? { unlockedVaultCard: newCard } : {})
                    });
                }
            },
            setQuizResult: (result: QuizResult) => {
                const state = get();
                const newBadges = [...state.badges];
                let newCard: string | null = null;
                if (!newBadges.includes("quiz-done")) {
                    newBadges.push("quiz-done");
                    newCard = "quiz-done";
                }
                
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
                    badges: newBadges,
                    ...(newCard ? { unlockedVaultCard: newCard } : {})
                });
            },
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
            setActivePracticeId: (id: string | null) => set({ activePracticeId: id, currentStepIndex: 0, builderInputs: {}, hasIterated: false }),
            setCurrentStepIndex: (index: number) => set({ currentStepIndex: index }),
            setBuilderInput: (stepId: string, value: string) => 
                set((state: SavantState) => ({
                    builderInputs: { ...state.builderInputs, [stepId]: value }
                })),
            setHasIterated: (val: boolean) => set({ hasIterated: val }),
            resetBuilder: () => set({ activePracticeId: null, currentStepIndex: 0, builderInputs: {}, hasIterated: false }),
            resetAllData: () =>
                set({
                    xp: 0,
                    streak: 0,
                    lastActiveDate: null,
                    completedLessons: [],
                    completedPractice: [],
                    unlockedAITracks: [],
                    completedCourses: [],
                    unlockedCategories: ["foundation"],
                    badges: [],
                    unlockedVaultCard: null,
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
                    activePracticeId: null,
                    currentStepIndex: 0,
                    builderInputs: {},
                    hasIterated: false,
                }),
        }),
        {
            name: 'savant-storage',
        }
    )
);

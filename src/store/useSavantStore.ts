import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { calculateLessonRewards, calculateStreakRewards, calculateCourseRewards } from '@/lib/rewardUtils';
import { learningPaths } from '@/data/learningPaths';

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
    newlyCompletedPathId: string | null;
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
    userColor: string | null;
    // Path Tracking
    activePathId: string | null;
    pathProgress: Record<string, { completedCourses: string[]; percent: number }>;
    achievements: string[];
    // Prompt Builder State
    activePracticeId: string | null;
    currentStepIndex: number;
    builderInputs: Record<string, string>;
    hasIterated: boolean;
    // UI Preference
    isCompactView: boolean;
    tracksScrollPosition: number;
    homeScrollPosition: number;
    practiceScrollPosition: number;
    courseScrollPositions: Record<string, number>;
    trackScrollPositions: Record<string, number>;
    _hasHydrated: boolean;
    hasSeenQuizPrompt: boolean;
    // Actions
    setHasHydrated: (state: boolean) => void;
    setHasSeenQuizPrompt: (val: boolean) => void;
    addXp: (amount: number) => void;
    completeLesson: (lessonId: string) => void;
    completePracticeItem: (itemId: string, xp: number) => void;
    unlockAITrack: (trackId: string) => void;
    completeCourse: (courseId: string) => void;
    unlockCategory: (categoryId: string) => void;
    checkStreak: () => void;
    setQuizResult: (result: QuizResult) => void;
    setUserName: (name: string) => void;
    setUserColor: (color: string) => void;
    resetAllData: () => void;
    resetPreferences: () => void;
    setActivePracticeId: (id: string | null) => void;
    setCurrentStepIndex: (index: number) => void;
    setBuilderInput: (stepId: string, value: string) => void;
    setHasIterated: (val: boolean) => void;
    resetBuilder: () => void;
    clearUnlockedVaultCard: () => void;
    clearNewlyCompletedPath: () => void;
    setCompactView: (isCompact: boolean) => void;
    setTracksScrollPosition: (pos: number) => void;
    setHomeScrollPosition: (pos: number) => void;
    setPracticeScrollPosition: (pos: number) => void;
    setCourseScrollPosition: (courseId: string, pos: number) => void;
    setTrackScrollPosition: (trackId: string, pos: number) => void;
    selectPath: (pathId: string) => void;
    updatePathProgress: (pathId: string, courseId: string) => void;
}

export const useSavantStore = create<SavantState>()(
    persist(
        (set, get): SavantState => ({
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
            newlyCompletedPathId: null,
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
            userColor: null,
            // Path Tracking
            activePathId: null,
            pathProgress: {},
            achievements: [],
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
            // UI Preference
            isCompactView: false,
            tracksScrollPosition: 0,
            homeScrollPosition: 0,
            practiceScrollPosition: 0,
            courseScrollPositions: {},
            trackScrollPositions: {},
            _hasHydrated: false,
            hasSeenQuizPrompt: false,
            // Actions
            setHasHydrated: (state: boolean) => set({ _hasHydrated: state }),
            setHasSeenQuizPrompt: (val: boolean) => set({ hasSeenQuizPrompt: val }),
            setCompactView: (isCompact: boolean) => set({ isCompactView: isCompact }),
            setTracksScrollPosition: (pos: number) => set({ tracksScrollPosition: pos }),
            setHomeScrollPosition: (pos: number) => set({ homeScrollPosition: pos }),
            setPracticeScrollPosition: (pos: number) => set({ practiceScrollPosition: pos }),
            setCourseScrollPosition: (courseId: string, pos: number) => 
                set((state: SavantState) => ({
                    courseScrollPositions: { ...state.courseScrollPositions, [courseId]: pos }
                })),
            setTrackScrollPosition: (trackId: string, pos: number) =>
                set((state: SavantState) => ({
                    trackScrollPositions: { ...state.trackScrollPositions, [trackId]: pos }
                })),
            addXp: (amount: number) => set((state: SavantState) => ({ xp: state.xp + amount })),
            selectPath: (pathId: string) => set((state: SavantState) => {
                const isNew = state.activePathId === null;
                return {
                    activePathId: pathId,
                    xp: isNew ? state.xp + 100 : state.xp
                };
            }),
            updatePathProgress: (pathId: string, courseId: string) => set((state: SavantState) => {
                const current = state.pathProgress[pathId] || { completedCourses: [], percent: 0 };
                if (current.completedCourses.includes(courseId)) return {};
                
                const updatedCourses = [...current.completedCourses, courseId];
                const percent = Math.round((updatedCourses.length / (learningPaths.find(p => p.id === pathId)?.courses.length || 1)) * 100);
                return {
                    pathProgress: {
                        ...state.pathProgress,
                        [pathId]: { ...current, completedCourses: updatedCourses, percent }
                    }
                };
            }),
            clearUnlockedVaultCard: () => set({ unlockedVaultCard: null }),
            clearNewlyCompletedPath: () => set({ newlyCompletedPathId: null }),
            completeLesson: (lessonId: string) => {
                const state = get();
                if (state.completedLessons.includes(lessonId)) return;

                const { newXp, newBadges, newCard } = calculateLessonRewards(
                    lessonId,
                    state.xp,
                    state.badges,
                    state.completedLessons.length + 1
                );

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
                const { newBadges, newCard, categoryUnlocked } = calculateCourseRewards(
                    courseId,
                    updatedCourses,
                    state.badges
                );

                const newUnlockedCategories = categoryUnlocked && !state.unlockedCategories.includes(categoryUnlocked)
                    ? [...state.unlockedCategories, categoryUnlocked]
                    : state.unlockedCategories;

                // Path Completion Logic
                const newAchievements = [...state.achievements];
                let pathBonusXp = 0;
                let newlyCompletedId: string | null = null;
                const newPathProgress = { ...state.pathProgress };

                learningPaths.forEach(path => {
                    if (path.courses.includes(courseId)) {
                        const current = newPathProgress[path.id] || { completedCourses: [], percent: 0 };
                        if (!current.completedCourses.includes(courseId)) {
                            const updatedPathCourses = [...current.completedCourses, courseId];
                            const percent = Math.round((updatedPathCourses.length / path.courses.length) * 100);
                            newPathProgress[path.id] = { completedCourses: updatedPathCourses, percent };
                        }
                    }

                    if (!newAchievements.includes(path.id)) {
                        const allCompleted = path.courses.every(id => updatedCourses.includes(id));
                        if (allCompleted) {
                            newAchievements.push(path.id);
                            pathBonusXp += 500;
                            newlyCompletedId = path.id;
                        }
                    }
                });

                set({ 
                    completedCourses: updatedCourses, 
                    unlockedCategories: newUnlockedCategories,
                    badges: newBadges,
                    achievements: newAchievements,
                    xp: state.xp + pathBonusXp,
                    pathProgress: newPathProgress,
                    newlyCompletedPathId: newlyCompletedId,
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
                    
                    const { newBadges, newCard } = calculateStreakRewards(newStreak, state.badges);

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
            setUserColor: (color: string) => set({ userColor: color }),
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
                    userColor: null,
                    activePathId: null,
                    pathProgress: {},
                    achievements: [],
                    activePracticeId: null,
                    currentStepIndex: 0,
                    builderInputs: {},
                    hasIterated: false,
                    isCompactView: false,
                    tracksScrollPosition: 0,
                    homeScrollPosition: 0,
                    practiceScrollPosition: 0,
                    courseScrollPositions: {},
                    trackScrollPositions: {},
                    _hasHydrated: true,
                    hasSeenQuizPrompt: false,
                }),
        }),
        {
            name: 'savant-storage',
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true);
            }
        }
    )
);


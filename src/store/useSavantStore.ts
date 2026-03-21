import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SavantState {
    xp: number;
    streak: number;
    lastActiveDate: string | null;
    completedLessons: string[];
    unlockedAITracks: string[];
    addXp: (amount: number) => void;
    completeLesson: (lessonId: string) => void;
    unlockAITrack: (trackId: string) => void;
    checkStreak: () => void;
}

export const useSavantStore = create<SavantState>()(
    persist(
        (set, get) => ({
            xp: 0,
            streak: 0,
            lastActiveDate: null,
            completedLessons: [],
            unlockedAITracks: [],
            addXp: (amount) => set((state) => ({ xp: state.xp + amount })),
            completeLesson: (lessonId) =>
                set((state) => ({
                    completedLessons: state.completedLessons.includes(lessonId)
                        ? state.completedLessons
                        : [...state.completedLessons, lessonId],
                })),
            unlockAITrack: (trackId) => 
                set((state) => ({
                    unlockedAITracks: state.unlockedAITracks.includes(trackId)
                        ? state.unlockedAITracks
                        : [...state.unlockedAITracks, trackId],
                })),
            checkStreak: () => {
                const today = new Date().toDateString();
                const lastActive = get().lastActiveDate;

                if (lastActive !== today) {
                    const yesterday = new Date();
                    yesterday.setDate(yesterday.getDate() - 1);

                    if (lastActive === yesterday.toDateString()) {
                        set((state) => ({ streak: state.streak + 1, lastActiveDate: today }));
                    } else {
                        set({ streak: 1, lastActiveDate: today }); // Reset or start streak
                    }
                }
            },
        }),
        {
            name: 'savant-storage',
        }
    )
);

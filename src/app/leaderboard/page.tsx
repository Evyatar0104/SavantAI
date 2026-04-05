"use client";

import { useEffect, useState } from "react";
import { useSavantStore } from "@/store/useSavantStore";
import { m, Variants } from "framer-motion";
import { Trophy } from "lucide-react";
import { collection, query, orderBy, limit, onSnapshot, doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface LeaderboardEntry {
    id: string;
    name: string;
    xp: number;
    avatar: string;
    badges: string[]; // e.g. ["🧠", "🏛️"]
    isCurrentUser?: boolean;
}

const FALLBACK_LEADERBOARD: LeaderboardEntry[] = [
    { id: "1", name: "אלכסנדר הגדול", xp: 12500, avatar: "👑", badges: ["🧠", "🏛️"] },
    { id: "2", name: "מרקוס אורליוס", xp: 11200, avatar: "🏛️", badges: ["🏛️"] },
    { id: "3", name: "עדה לאבלייס", xp: 9800, avatar: "💻", badges: ["🤖", "🧠"] },
];

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function Leaderboard() {
    const xp = useSavantStore(state => state.xp);
    const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // In a real app we'd have a user ID. We use a mock ID for the current user.
    const userId = "current-user-id";
    const userName = "את/ה";

    const getFallbackData = (currentXp: number) => {
        const data = [...FALLBACK_LEADERBOARD, { id: userId, name: userName, xp: currentXp, avatar: "🧑‍🎓", badges: ["🎓"], isCurrentUser: true }];
        data.sort((a, b) => b.xp - a.xp);
        return data;
    };

    useEffect(() => {
        let unsubscribe: (() => void) | undefined;

        const initLeaderboard = async () => {
            if (!db) {
                console.warn("Firebase DB not initialized. Using fallback data.");
                setLeaderboardData(getFallbackData(xp));
                setLoading(false);
                return;
            }

            try {
                // Try to update current user first
                const userRef = doc(db, "users", userId);
                await setDoc(userRef, {
                    name: userName,
                    xp: xp,
                    avatar: "🧑‍🎓",
                    badges: ["🎓"]
                }, { merge: true }).catch(err => {
                    console.warn("Could not update user in Firebase, using local state only.", err);
                });

                const usersRef = collection(db, "users");
                const q = query(usersRef, orderBy("xp", "desc"), limit(10));

                unsubscribe = onSnapshot(q, 
                    (querySnapshot) => {
                        const users: LeaderboardEntry[] = [];
                        querySnapshot.forEach((doc) => {
                            const data = doc.data();
                            users.push({
                                id: doc.id,
                                name: data.name,
                                xp: data.xp,
                                avatar: data.avatar,
                                badges: data.badges || [],
                                isCurrentUser: doc.id === userId
                            });
                        });

                        if (users.length > 0) {
                            setLeaderboardData(users);
                            setLoading(false);
                            setError(null);
                        } else {
                            // If empty, use fallback
                            setLeaderboardData(getFallbackData(xp));
                            setLoading(false);
                        }
                    }, 
                    (err) => {
                        console.error("Leaderboard snapshot error:", err);
                        setLeaderboardData(getFallbackData(xp));
                        setLoading(false);
                    }
                );
            } catch (e) {
                console.error("Leaderboard initialization error:", e);
                setLeaderboardData(getFallbackData(xp));
                setLoading(false);
            }
        };

        initLeaderboard();
        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [xp]);

    return (
        <div className="p-6 md:p-12 flex flex-col min-h-full pb-32 w-full max-w-2xl mx-auto" dir="rtl">
            <m.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="mb-10 md:mb-16 text-center"
            >
                <div className="flex items-center justify-center text-zinc-500 dark:text-zinc-400 mb-2 uppercase tracking-widest text-xs font-bold">
                    <Trophy className="w-4 h-4 ml-1.5 text-yellow-500" /> המעגל המנצח
                </div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                    טבלת מובילים
                </h1>
            </m.div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
                </div>
            ) : (
                <m.div variants={containerVariants} initial="hidden" animate="show" className="space-y-4 md:space-y-6">
                    {leaderboardData.map((user, index) => {
                        const rank = index + 1;
                        return (
                            <m.div
                                variants={itemVariants}
                                key={user.id}
                                className={`p-5 md:p-6 rounded-[24px] flex items-center shadow-lg transition-all duration-300 transform hover:scale-[1.02] ${user.isCurrentUser
                                        ? 'bg-emerald-500/10 border-2 border-emerald-500/30 ring-1 ring-emerald-500/50'
                                        : 'bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5'
                                    }`}
                            >
                                <div className={`w-10 md:w-16 text-center font-black text-2xl md:text-3xl ${rank === 1 ? 'text-yellow-500 drop-shadow-md' :
                                        rank === 2 ? 'text-zinc-400 dark:text-zinc-300' :
                                            rank === 3 ? 'text-orange-500' : 'text-zinc-300 dark:text-zinc-700'
                                    }`}>
                                    {rank}
                                </div>
                                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center text-3xl md:text-4xl ml-4 md:ml-6 shadow-inner border border-black/5 dark:border-white/5 backdrop-blur-md relative">
                                    {user.avatar}
                                </div>
                                <div className="flex-1 text-right">
                                    <div className="flex items-center justify-start space-x-2 space-x-reverse mb-1">
                                        <div className={`font-bold text-lg md:text-2xl tracking-tight ${user.isCurrentUser ? 'text-emerald-700 dark:text-emerald-400' : 'text-zinc-900 dark:text-zinc-100'
                                            }`}>
                                            {user.name}
                                        </div>
                                        <div className="flex space-x-1 space-x-reverse opacity-80">
                                            {user.badges.map((b, i) => (
                                                <span key={i} className="text-sm bg-black/5 dark:bg-white/10 rounded-full px-1">{b}</span>
                                            ))}
                                        </div>
                                    </div>
                                    {user.isCurrentUser && <div className="text-[10px] md:text-xs uppercase tracking-widest font-bold text-emerald-500 mt-0.5 md:mt-1">הפרופיל שלך</div>}
                                </div>
                                <div className="font-black text-zinc-900 dark:text-white text-xl md:text-3xl tracking-tight text-left flex flex-col md:flex-row md:items-baseline md:space-x-2 md:space-x-reverse">
                                    {user.xp} <span className="text-[10px] md:text-sm text-zinc-500 uppercase tracking-widest font-bold leading-none mt-1 md:mt-0">XP</span>
                                </div>
                            </m.div>
                        );
                    })}
                </m.div>
            )}
        </div>
    );
}

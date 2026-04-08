"use client";

import { useEffect, useState } from "react";
import { useSavantStore } from "@/store/useSavantStore";
import { m, Variants } from "framer-motion";
import { Crown, Trophy, Star } from "lucide-react";
import { collection, query, orderBy, limit, onSnapshot, doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { cn } from "@/lib/utils";

interface LeaderboardEntry {
    id: string;
    name: string;
    xp: number;
    avatar: string;
    badges: string[];
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
        transition: { staggerChildren: 0.05 }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function Leaderboard() {
    const xp = useSavantStore(state => state.xp);
    const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);

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
                setLeaderboardData(getFallbackData(xp));
                setLoading(false);
                return;
            }
            try {
                const userRef = doc(db, "users", userId);
                await setDoc(userRef, { name: userName, xp: xp, avatar: "🧑‍🎓", badges: ["🎓"] }, { merge: true });
                const usersRef = collection(db, "users");
                const q = query(usersRef, orderBy("xp", "desc"), limit(25));
                unsubscribe = onSnapshot(q, (snapshot) => {
                    const users: LeaderboardEntry[] = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                        isCurrentUser: doc.id === userId
                    } as LeaderboardEntry));
                    setLeaderboardData(users.length > 0 ? users : getFallbackData(xp));
                    setLoading(false);
                });
            } catch {
                setLeaderboardData(getFallbackData(xp));
                setLoading(false);
            }
        };
        initLeaderboard();
        return () => unsubscribe?.();
    }, [xp]);

    const topThree = leaderboardData.slice(0, 3);
    const theRest = leaderboardData.slice(3);
    const currentUserEntry = leaderboardData.find(u => u.isCurrentUser);
    const currentUserRank = leaderboardData.findIndex(u => u.isCurrentUser) + 1;

    const podiumOrder = topThree.length === 3 ? [topThree[1], topThree[0], topThree[2]] : topThree;

    return (
        <div className="min-h-screen bg-black text-white selection:bg-yellow-500/30 selection:text-yellow-500 pb-32 overflow-x-hidden relative" dir="rtl">
            {/* Golden Grid Background */}
            <div className="fixed inset-0 pointer-events-none opacity-20" 
                 style={{ 
                    backgroundImage: `linear-gradient(to right, rgba(234, 179, 8, 0.1) 1px, transparent 1px), 
                                     linear-gradient(to bottom, rgba(234, 179, 8, 0.1) 1px, transparent 1px)`,
                    backgroundSize: '40px 40px' 
                 }} 
            />
            <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,black_90%)]" />
            
            {/* Ambient Glows */}
            <div className="fixed top-[-10%] right-[-10%] w-[60%] h-[50%] bg-yellow-500/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="fixed bottom-[-10%] left-[-10%] w-[60%] h-[50%] bg-yellow-600/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative z-10 max-w-2xl mx-auto p-4 md:p-8 pt-12 md:pt-20">
                {/* Header */}
                <m.header 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16 md:mb-20"
                >
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-[32px] bg-gradient-to-br from-yellow-400 to-amber-600 mb-6 shadow-[0_0_60px_rgba(234,179,8,0.4)] border border-yellow-300/30">
                        <Trophy className="w-12 h-12 text-black fill-black/10" />
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-3 bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-500">
                        היכל התהילה
                    </h1>
                    <p className="text-yellow-500/60 font-black text-sm md:text-base uppercase tracking-[0.2em]">The Golden Circle</p>
                </m.header>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 gap-4">
                        <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : (
                    <div className="space-y-10">
                        {/* Podium Section */}
                        <div className="grid grid-cols-3 items-end gap-3 md:gap-6 px-2 relative">
                            {podiumOrder.map((user, i) => {
                                const isFirst = user.id === topThree[0]?.id;
                                const isSecond = user.id === topThree[1]?.id;

                                return (
                                    <m.div
                                        key={user.id}
                                        initial={{ opacity: 0, y: 50 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1, type: "spring", damping: 15 }}
                                        className={cn(
                                            "flex flex-col items-center group relative",
                                            isFirst ? "z-20 scale-110 mb-8" : "z-10 scale-95"
                                        )}
                                    >
                                        <div className="mb-6 relative">
                                            {isFirst && (
                                                <div className="absolute -top-14 left-1/2 -translate-x-1/2 z-30">
                                                    <m.div
                                                        animate={{ y: [0, -8, 0], scale: [1, 1.1, 1] }}
                                                        transition={{ duration: 3, repeat: Infinity }}
                                                    >
                                                        <Crown className="w-12 h-12 text-yellow-400 fill-yellow-400 drop-shadow-[0_0_15px_rgba(234,179,8,0.8)]" />
                                                    </m.div>
                                                </div>
                                            )}

                                            <div className={cn(
                                                "w-18 h-18 md:w-32 md:h-32 flex items-center justify-center text-5xl md:text-7xl squarcle shadow-2xl relative transition-all duration-700 overflow-visible",
                                                isFirst ? "bg-gradient-to-br from-yellow-400 to-amber-600 border-2 border-yellow-300/50 ring-8 ring-yellow-500/10" :
                                                isSecond ? "bg-zinc-800 border border-white/10" :
                                                "bg-zinc-900 border border-white/5"
                                            )}>
                                                <span className="relative z-10">{user.avatar}</span>
                                            </div>
                                            
                                            <div className={cn(
                                                "absolute -bottom-4 left-1/2 -translate-x-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-black text-sm md:text-xl border-4 border-black shadow-2xl z-20",
                                                isFirst ? "bg-yellow-500 text-black" :
                                                isSecond ? "bg-zinc-400 text-black" :
                                                "bg-amber-700 text-white"
                                            )}>
                                                {isFirst ? 1 : isSecond ? 2 : 3}
                                            </div>
                                        </div>

                                        <div className="text-center w-full px-1">
                                            <h3 className={cn("font-black text-sm md:text-xl truncate mb-1", isFirst ? "text-yellow-500" : "text-white")}>
                                                {user.name}
                                            </h3>
                                            <div className="text-[10px] md:text-xs font-black text-zinc-500 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
                                                {user.xp.toLocaleString()} XP
                                            </div>
                                        </div>
                                    </m.div>
                                );
                            })}
                        </div>

                        {/* Pinned "You" Row */}
                        {currentUserEntry && (
                            <m.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="relative p-[1px] rounded-[32px] bg-gradient-to-br from-yellow-400 to-transparent shadow-[0_20px_60px_rgba(234,179,8,0.2)]"
                            >
                                <div className="relative flex items-center justify-between p-5 md:p-6 rounded-[31px] bg-zinc-900/90 backdrop-blur-xl border border-white/5 overflow-hidden">
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_right,rgba(234,179,8,0.1)_0%,transparent_50%)]" />
                                    
                                    <div className="flex items-center gap-4 md:gap-6 relative z-10">
                                        <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center text-xl md:text-3xl font-black bg-yellow-500 text-black squarcle shadow-lg shadow-yellow-500/20">
                                            {currentUserRank}
                                        </div>

                                        <div className="relative shrink-0">
                                            <div className="w-14 h-14 md:w-18 md:h-18 flex items-center justify-center text-3xl md:text-5xl squarcle bg-white/5 border border-white/10">
                                                {currentUserEntry.avatar}
                                            </div>
                                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg border-2 border-zinc-900">
                                                <Star className="w-3 h-3 text-white fill-white" />
                                            </div>
                                        </div>

                                        <div className="flex flex-col">
                                            <span className="font-black text-xl md:text-2xl text-white tracking-tight leading-none mb-1">הדירוג שלך</span>
                                            <span className="text-[10px] md:text-xs font-black text-yellow-500 uppercase tracking-[0.1em]">AI Master Elite</span>
                                        </div>
                                    </div>

                                    <div className="text-left relative z-10">
                                        <div className="font-black text-3xl md:text-5xl tracking-tighter text-yellow-500">
                                            {currentUserEntry.xp.toLocaleString()}
                                            <span className="text-[10px] md:text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">XP</span>
                                        </div>
                                    </div>
                                </div>
                            </m.div>
                        )}

                        {/* Main List */}
                        <m.div 
                            variants={containerVariants}
                            initial="hidden"
                            animate="show"
                            className="bg-zinc-900/50 backdrop-blur-xl rounded-[32px] border border-white/5 shadow-2xl"
                        >
                            <div className="p-2 divide-y divide-white/5">
                                {theRest.map((user, index) => {
                                    const rank = index + 4;
                                    return (
                                        <m.div
                                            variants={itemVariants}
                                            key={user.id}
                                            className="group flex items-center justify-between p-4 md:p-5 hover:bg-white/[0.02] transition-all rounded-2xl"
                                        >
                                            <div className="flex items-center gap-4 md:gap-6 flex-1 min-w-0">
                                                <div className="w-6 md:w-8 text-center font-black text-lg md:text-2xl text-zinc-800">
                                                    {rank}
                                                </div>
                                                <div className="w-10 h-10 md:w-14 md:h-14 flex items-center justify-center text-xl md:text-3xl squarcle bg-white/5 border border-white/5 grayscale group-hover:grayscale-0 opacity-40 group-hover:opacity-100 transition-all">
                                                    {user.avatar}
                                                </div>
                                                <div className="flex flex-col min-w-0">
                                                    <span className="font-bold text-base md:text-xl truncate text-zinc-500 group-hover:text-white transition-colors">
                                                        {user.name}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-left font-black text-xl md:text-2xl tracking-tight text-zinc-700 group-hover:text-zinc-300 transition-colors">
                                                {user.xp.toLocaleString()}
                                            </div>
                                        </m.div>
                                    );
                                })}
                            </div>
                        </m.div>
                    </div>
                )}
            </div>
        </div>
    );
}

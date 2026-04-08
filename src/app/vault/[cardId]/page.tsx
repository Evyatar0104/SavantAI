"use client";

import { useSavantStore } from "@/store/useSavantStore";
import { BADGES, isBadgeEarned } from "@/content";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import dynamic from "next/dynamic";

const CardScene = dynamic(() => import("@/components/vault/CardScene"), { 
    ssr: false,
    loading: () => <div className="w-full h-full bg-[#050508] animate-pulse" />
});

function CardView() {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();
    const cardId = params.cardId as string;
    const from = searchParams.get("from") || "vault";
    
    const state = useSavantStore();
    const userName = useSavantStore(s => s.userName) || "לומד/ת";

    const badge = BADGES.find(b => b.id === cardId);
    const earned = isBadgeEarned(cardId, state);

    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <div className="min-h-screen bg-[#050508]" />;

    if (!badge || !earned) {
        return (
            <div className="min-h-screen bg-[#050508] flex items-center justify-center text-white flex-col gap-4">
                <h1 className="text-2xl">הקלף לא נמצא או שטרם הושג.</h1>
                <button 
                    onClick={() => router.push(`/${from === "profile" ? "profile" : "vault"}`)}
                    className="px-4 py-2 bg-white/10 rounded-lg"
                >
                    חזור
                </button>
            </div>
        );
    }

    const handleExit = () => {
        router.push(`/${from === "profile" ? "profile" : "vault"}`);
    };

    return (
        <div className="relative w-full h-screen overflow-hidden" dir="rtl">
            {/* 3D Scene Background */}
            <div className="absolute inset-0">
                <CardScene badge={badge} userName={userName} />
            </div>

            {/* UI Overlay */}
            <div className="absolute top-0 left-0 right-0 p-4 sm:p-6 flex justify-between items-start pointer-events-none z-10">
                <div className="flex flex-col gap-2 pointer-events-auto">
                    <button
                        onClick={handleExit}
                        className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white backdrop-blur-md hover:bg-white/20 transition-all text-xl"
                    >
                        ✕
                    </button>
                </div>
                
                <div className="flex flex-col items-end pointer-events-none text-right drop-shadow-md">
                    <span className="text-xs text-white/50 uppercase tracking-widest font-medium mb-1">
                        Vault Item
                    </span>
                    <span className="text-sm text-white/80 font-mono">
                        #{badge.id.toUpperCase().substring(0, 8)}
                    </span>
                </div>
            </div>
            
            <div className="absolute bottom-10 w-full text-center pointer-events-none z-10">
                <span className="text-white/40 text-xs tracking-wider bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/5">
                    החלק לסיבוב | גלול לזום
                </span>
            </div>
        </div>
    );
}

export default function CardViewPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#050508]" />}>
            <CardView />
        </Suspense>
    );
}
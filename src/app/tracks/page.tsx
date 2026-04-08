"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Tracks() {
    const router = useRouter();
    useEffect(() => {
        router.replace('/tracks/builder');
    }, [router]);
    return null;
}

"use client";

import { useMemo, useState, useRef } from "react";
import { useSavantStore } from "@/store/useSavantStore";
import { learningPaths, type LearningPath } from "@/data/learningPaths";
import { CATEGORIES, COURSES, LESSON_INDEX, type Course } from "@/content";
import { m, AnimatePresence, Variants, useMotionValue, useSpring, useTransform, useMotionTemplate } from "framer-motion";
import { LayoutGrid, Search, List, Lock, ChevronLeft, ArrowRight } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { isCourseUnlocked } from "@/lib/courseUnlock";
import { Suspense } from "react";
import { useScrollRestoration } from "@/hooks/useScrollRestoration";

function LearningPathCard({ 
    path, 
    index, 
    isSelected, 
    completedInPath, 
    progressPercent 
}: { 
    path: LearningPath; 
    index: number; 
    isSelected: boolean; 
    completedInPath: string[]; 
    progressPercent: number;
}) {
    const cardRef = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <Link href={`/paths/${path.id}`} className="perspective-1000 block h-full">
            <m.div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d",
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, type: "spring", stiffness: 260, damping: 20 }}
                className={cn(
                    "bg-zinc-900/90 border border-white/8 p-5 md:p-8 rounded-3xl md:rounded-[40px] transition-all duration-500 h-full flex flex-col group relative",
                    isSelected 
                        ? "border-white/30 bg-white/[0.05] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.1)]" 
                        : "hover:border-white/20 shadow-[0_16px_32px_-8px_rgba(0,0,0,0.6)] hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.06)]"
                )}
            >
                {/* Background Layer (Moved outside overflow-hidden in a real scenario, but here we can just adjust the container) */}
                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-3xl md:rounded-[40px]">
                    <Grain />
                </div>

                {/* Ambient Glows (Outside overflow-hidden to prevent cutoff) */}
                <m.div 
                    style={{
                        x: useTransform(mouseXSpring, [-0.5, 0.5], ["-20px", "20px"]),
                        y: useTransform(mouseYSpring, [-0.5, 0.5], ["-20px", "20px"]),
                        backgroundColor: path.color
                    }}
                    className="absolute -top-[10%] -right-[10%] w-[120%] h-[120%] rounded-full blur-[100px] md:blur-[140px] opacity-[0.06] transition-all duration-500 group-hover:opacity-[0.14] group-hover:scale-110 pointer-events-none"
                />
                <m.div 
                    style={{
                        x: useTransform(mouseXSpring, [-0.5, 0.5], ["20px", "-20px"]),
                        y: useTransform(mouseYSpring, [-0.5, 0.5], ["20px", "-20px"]),
                        backgroundColor: path.color
                    }}
                    className="absolute -bottom-[20%] -left-[20%] w-[100%] h-[100%] rounded-full blur-[100px] md:blur-[140px] opacity-0 transition-all duration-500 group-hover:opacity-[0.08] pointer-events-none"
                />

                <div className="flex items-start justify-between mb-6 md:mb-10 relative z-10" style={{ transform: "translateZ(50px)" }}>
                    <div 
                        className="w-16 h-16 md:w-24 md:h-24 rounded-2xl md:rounded-[32px] flex items-center justify-center text-3xl md:text-5xl shadow-2xl border border-white/20 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6"
                        style={{ 
                            background: `linear-gradient(135deg, ${path.color}40 0%, ${path.color}10 100%)`,
                            boxShadow: `0 20px 40px -10px ${path.color}30`
                        }}
                    >
                        <div className="drop-shadow-2xl filter brightness-110">{path.icon}</div>
                    </div>
                    {isSelected && (
                        <m.div 
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-blue-500 text-white text-[10px] font-black px-5 py-2 rounded-full border border-white/30 shadow-lg shadow-blue-500/30 uppercase tracking-[0.2em]"
                        >
                            המסלול שלך
                        </m.div>
                    )}
                </div>

                <div className="flex-1 relative z-10" style={{ transform: "translateZ(30px)" }}>
                    <h3 className="text-2xl md:text-4xl font-black mb-4 text-white tracking-tighter transition-all duration-500 group-hover:text-transparent bg-clip-text"
                        style={{ 
                            backgroundImage: `linear-gradient(to left, white, ${path.color})`,
                            WebkitBackgroundClip: "text",
                            backgroundClip: "text"
                        }}>
                        {path.nameHe}
                    </h3>
                    <p className="text-base md:text-lg text-zinc-400 font-medium leading-relaxed mb-6 md:mb-8 group-hover:text-zinc-300 transition-colors">
                        {path.descriptionHe}
                    </p>
                </div>

                <div className="space-y-4 md:space-y-6 relative z-10 mt-auto" style={{ transform: "translateZ(40px)" }}>
                    <div className="flex justify-between items-end">
                        <div className="flex flex-col">
                            <span className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-1.5">התקדמות המסלול</span>
                            <span className="text-base font-bold text-zinc-300">{path.courses.length} / {completedInPath.length} קורסים</span>
                        </div>
                        <span className="text-3xl font-black text-white tabular-nums">{progressPercent}%</span>
                    </div>
                    
                    <div className="h-4 bg-white/5 rounded-full overflow-hidden border border-white/10 p-[3px] shadow-inner">
                        <m.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercent}%` }}
                            transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                            className="h-full rounded-full relative shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                            style={{ backgroundColor: path.color }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                            <m.div 
                                animate={{ x: ["-100%", "200%"] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                className="absolute top-0 bottom-0 w-24 bg-white/30 skew-x-[30deg] blur-md"
                            />
                        </m.div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <div className="flex items-center gap-3 text-sm font-black text-white px-5 py-2.5 md:px-7 md:py-3.5 rounded-2xl bg-white/5 group-hover:bg-white/15 transition-all border border-white/5 group-hover:border-white/20 group-hover:translate-x-[-8px] shadow-xl">
                            <span>{progressPercent === 100 ? "הושלם בהצלחה!" : "המשך למסלול"}</span>
                            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-[-6px]" />
                        </div>
                    </div>
                </div>
            </m.div>
        </Link>
    );
}

const CATEGORY_GLOW: Record<string, string> = {
    "from-purple-600 to-indigo-800":    "147, 51, 234",
    "from-blue-700 to-indigo-900":      "96, 165, 250",
    "from-[#0D1B2A] to-[#1B263B]":     "14, 165, 233",
    "from-emerald-500 to-teal-700":     "16, 185, 129",
    "from-orange-500 to-red-700":       "249, 115, 22",
    "from-amber-500 to-yellow-700":     "245, 158, 11",
};

function getGlowColor(categoryColor: string): string {
    return CATEGORY_GLOW[categoryColor] ?? "139, 92, 246";
}

function Grain() {
    return (
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
    );
}

function ViewToggle({ compact, setCompact }: { compact: boolean; setCompact: (v: boolean) => void }) {
    return (
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 backdrop-blur-md">
            <button
                onClick={() => setCompact(false)}
                className={cn(
                    "p-2 rounded-lg transition-all",
                    !compact ? "bg-white/10 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"
                )}
            >
                <LayoutGrid className="w-4 h-4" />
            </button>
            <button
                onClick={() => setCompact(true)}
                className={cn(
                    "p-2 rounded-lg transition-all",
                    compact ? "bg-white/10 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"
                )}
            >
                <List className="w-4 h-4" />
            </button>
        </div>
    );
}

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05
        }
    }
};

function CoursesPageContent() {
    const completedCourses = useSavantStore(state => state.completedCourses);
    const activePathId = useSavantStore(state => state.activePathId);
    const isCompact = useSavantStore(state => state.isCompactView);
    const setIsCompact = useSavantStore(state => state.setCompactView);
    const scrollPosition = useSavantStore(state => state.tracksScrollPosition);
    const setScrollPosition = useSavantStore(state => state.setTracksScrollPosition);
    const hasHydrated = useSavantStore(state => state._hasHydrated);

    useScrollRestoration(scrollPosition, setScrollPosition, hasHydrated);

    const searchParams = useSearchParams();
    const router = useRouter();
    const activeTab = searchParams.get("tab") === "all" ? "all" : "paths";

    const setActiveTab = (tab: "paths" | "all") => {
        const params = new URLSearchParams(searchParams.toString());
        if (tab === "all") params.set("tab", "all");
        else params.delete("tab");
        router.replace(`?${params.toString()}`, { scroll: false });
    };

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    const filteredCourses = useMemo(() => {
        return COURSES.filter(course => {
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                if (!course.nameHe.toLowerCase().includes(q) && !course.description.toLowerCase().includes(q)) return false;
            }
            if (selectedCategories.length > 0 && !selectedCategories.includes(course.categoryId)) return false;
            return true;
        }).sort((a, b) => a.order - b.order);
    }, [searchQuery, selectedCategories]);

    const visibleCategories = [...CATEGORIES].filter(cat => 
        filteredCourses.some(course => course.categoryId === cat.id)
    ).sort((a, b) => a.order - b.order);

    return (
        <div className="px-5 py-8 md:p-10 flex flex-col pt-12 md:pt-16 max-w-7xl mx-auto w-full relative min-h-screen safe-bottom-padding">
            {/* Header Section */}
            <m.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="mb-8 md:mb-14 relative"
            >
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />
                <div className="absolute -top-24 -left-24 w-64 h-64 bg-purple-500/10 blur-[100px] rounded-full pointer-events-none" />
                
                <div className="overflow-hidden">
                    <AnimatePresence mode="wait">
                        <m.h1 
                            key={activeTab}
                            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                            exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            className="text-4xl md:text-7xl font-black mb-4 tracking-tight text-white inline-flex items-center gap-4"
                        >
                            {activeTab === "paths" ? "מסלולי התמחות" : "כל הקורסים"}
                        </m.h1>
                    </AnimatePresence>
                </div>
                
                <div className="overflow-hidden h-[3lh] md:h-auto">
                    <AnimatePresence mode="wait">
                        <m.p 
                            key={activeTab}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 25 }}
                            className="text-base md:text-xl text-zinc-400 font-medium max-w-2xl leading-relaxed"
                        >
                            {activeTab === "paths" 
                                ? "ידע ממוקד להתמקצעות מקסימלית. סילבוס מלא לרכישת מיומנות חדשה עם AI" 
                                : "מבט מלא על כל הידע של סוואנט"}
                        </m.p>
                    </AnimatePresence>
                </div>

                {/* Tab Switcher */}
                <div className="flex items-center gap-1 mt-6 md:mt-10 p-1.5 bg-white/5 rounded-[20px] border border-white/10 w-fit backdrop-blur-xl relative z-10">
                    <button
                        onClick={() => setActiveTab("paths")}
                        className={cn(
                            "px-6 py-2.5 rounded-[14px] text-sm font-bold transition-all flex items-center gap-2 relative z-10",
                            activeTab === "paths" ? "text-black" : "text-zinc-400 hover:text-white"
                        )}
                    >
                        {activeTab === "paths" && (
                            <m.div 
                                layoutId="activeTabPill" 
                                className="absolute inset-0 bg-white rounded-[14px] shadow-lg shadow-white/10"
                                transition={{ type: "spring", stiffness: 500, damping: 35 }}
                            />
                        )}
                        <span className="relative z-10 flex items-center gap-2">
                            מסלולי התמחות
                        </span>
                    </button>
                    <button
                        onClick={() => setActiveTab("all")}
                        className={cn(
                            "px-6 py-2.5 rounded-[14px] text-sm font-bold transition-all flex items-center gap-2 relative z-10",
                            activeTab === "all" ? "text-black" : "text-zinc-400 hover:text-white"
                        )}
                    >
                        {activeTab === "all" && (
                            <m.div 
                                layoutId="activeTabPill" 
                                className="absolute inset-0 bg-white rounded-[14px] shadow-lg shadow-white/10"
                                transition={{ type: "spring", stiffness: 500, damping: 35 }}
                            />
                        )}
                        <span className="relative z-10 flex items-center gap-2">
                            כל הקורסים
                        </span>
                    </button>
                </div>
            </m.div>

            <div className="perspective-2000">
                <AnimatePresence mode="wait">
                    {activeTab === "paths" ? (
                        <m.div
                            key="paths"
                            initial={{ opacity: 0, rotateY: 15, scale: 0.95, x: 100 }}
                            animate={{ opacity: 1, rotateY: 0, scale: 1, x: 0 }}
                            exit={{ opacity: 0, rotateY: -15, scale: 0.95, x: -100 }}
                            transition={{ type: "spring", stiffness: 200, damping: 25 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 origin-center"
                        >
                            {learningPaths.map((path, index) => {
                                const isSelected = activePathId === path.id;
                                const pathCourses = path.courses;
                                const completedInPath = pathCourses.filter(id => completedCourses.includes(id));
                                const progressPercent = Math.round((completedInPath.length / pathCourses.length) * 100);
                                
                                return (
                                    <LearningPathCard 
                                        key={path.id}
                                        path={path}
                                        index={index}
                                        isSelected={isSelected}
                                        completedInPath={completedInPath}
                                        progressPercent={progressPercent}
                                    />
                                );
                            })}
                        </m.div>
                    ) : (
                        <m.div
                            key="all"
                            initial={{ opacity: 0, rotateY: -15, scale: 0.95, x: -100 }}
                            animate={{ opacity: 1, rotateY: 0, scale: 1, x: 0 }}
                            exit={{ opacity: 0, rotateY: 15, scale: 0.95, x: 100 }}
                            transition={{ type: "spring", stiffness: 200, damping: 25 }}
                            className="space-y-12 origin-center"
                        >
                        {/* Filters & Search for All Courses */}
                        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                            <div className="flex items-center gap-3 w-full md:w-auto">
                                <div className="relative flex-1 md:w-80">
                                    <Search className="absolute top-1/2 -translate-y-1/2 right-3 w-4 h-4 text-zinc-500 pointer-events-none" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="חפש קורס..."
                                        dir="rtl"
                                        className="w-full py-2.5 pr-10 pl-4 rounded-xl border border-white/10 bg-white/5 text-white text-sm outline-none focus:border-blue-500/50 transition-colors"
                                    />
                                </div>
                                <ViewToggle compact={isCompact} setCompact={setIsCompact} />
                            </div>

                            <div className="flex gap-2 overflow-x-auto no-scrollbar w-full md:w-auto pb-1">
                                <button
                                    onClick={() => setSelectedCategories([])}
                                    className={cn(
                                        "px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap border",
                                        selectedCategories.length === 0 
                                            ? "bg-blue-500 border-blue-400 text-white" 
                                            : "bg-white/5 border-white/10 text-zinc-400 hover:text-white"
                                    )}
                                >
                                    הכל
                                </button>
                                {CATEGORIES.map(cat => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setSelectedCategories(prev => 
                                            prev.includes(cat.id) ? prev.filter(id => id !== cat.id) : [...prev, cat.id]
                                        )}
                                        className={cn(
                                            "px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap border flex items-center gap-2",
                                            selectedCategories.includes(cat.id)
                                                ? "bg-blue-500 border-blue-400 text-white"
                                                : "bg-white/5 border-white/10 text-zinc-400 hover:text-white"
                                        )}
                                    >
                                        <span>{cat.icon}</span>
                                        {cat.nameHe}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Courses Grid */}
                        <div className="space-y-16">
                            {visibleCategories.length > 0 ? (
                                visibleCategories.map((category) => {
                                    const categoryCourses = filteredCourses.filter(c => c.categoryId === category.id);
                                    return (
                                        <m.section key={category.id} layout variants={containerVariants} initial="hidden" animate="show">
                                            <div className="flex items-center gap-4 mb-8">
                                                <div className={cn(
                                                    "w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center text-2xl shadow-lg border border-white/10",
                                                    category.color
                                                )}>
                                                    {category.icon}
                                                </div>
                                                <div>
                                                    <h2 className="text-2xl font-black text-white tracking-tight">{category.nameHe}</h2>
                                                    <p className="text-sm text-zinc-500 font-medium">{category.description}</p>
                                                </div>
                                            </div>

                                            <div className={cn(
                                                "grid gap-6",
                                                isCompact ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                                            )}>
                                                {categoryCourses.map((course) => (
                                                    <CourseCard key={course.id} course={course} isCompact={isCompact} categoryColor={category.color} />
                                                ))}
                                            </div>
                                        </m.section>
                                    );
                                })
                            ) : (
                                <div className="py-20 text-center">
                                    <p className="text-4xl mb-4">🔍</p>
                                    <h3 className="text-xl font-bold text-white">לא נמצאו קורסים</h3>
                                    <p className="text-zinc-500">נסה חיפוש אחר או הסר פילטרים</p>
                                </div>
                            )}
                        </div>
                    </m.div>
                )}
            </AnimatePresence>
            </div>
        </div>
    );
}

function CourseCard({ course, isCompact, categoryColor }: { course: Course; isCompact: boolean; categoryColor: string }) {
    const completedCourses = useSavantStore(state => state.completedCourses);
    const completedLessons = useSavantStore(state => state.completedLessons);
    const unlocked = isCourseUnlocked(course.id, completedCourses);
    const courseLessons = LESSON_INDEX.filter(l => l.courseId === course.id);
    const completedInCourse = courseLessons.filter(l => completedLessons.includes(l.id));
    
    // Extract primary color from tailwind gradient (e.g. "from-blue-500" -> "text-blue-400")
    const primaryColorClass = categoryColor.split(' ')[0].replace('from-', 'text-').replace('-500', '-400').replace('-600', '-400').replace('-700', '-500');
    // For gradient text effect on hover
    const hoverGradientClass = `group-hover:bg-gradient-to-l ${categoryColor} group-hover:bg-clip-text group-hover:text-transparent`;

    const cardRef = useRef<HTMLAnchorElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseX = useSpring(x, { stiffness: 500, damping: 50 });
    const mouseY = useSpring(y, { stiffness: 500, damping: 50 });
    const mouseHighlight = useMotionTemplate`radial-gradient(400px circle at ${mouseX}px ${mouseY}px, rgba(${getGlowColor(categoryColor)}, 0.12), transparent 70%)`;

    const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
        const { left, top } = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - left);
        y.set(e.clientY - top);
    };

    if (isCompact) {
        return (
            <m.div variants={itemVariants} layout>
                <Link 
                    href={unlocked ? `/courses/${course.id}?from=courses` : "#"}
                    onClick={(e) => !unlocked && e.preventDefault()}
                    className={cn(
                        "group flex items-center gap-4 p-4 rounded-2xl transition-all glass-panel border border-white/5",
                        unlocked ? "hover:bg-white/10 active:scale-[0.98] hover:border-white/20" : "opacity-50 grayscale saturate-50 cursor-default"
                    )}
                >
                    <div className={cn("w-12 h-12 flex items-center justify-center text-xl shrink-0 squarcle bg-gradient-to-br shadow-lg", categoryColor)}>
                        {course.image ? (
                            <div className="w-full h-full p-2 flex items-center justify-center">
                                {course.id === "course-notebooklm" ? (
                                    <div className="w-full h-full squarcle bg-white overflow-hidden flex items-center justify-center">
                                        <Image src={course.image} alt="" width={24} height={24} className="w-full h-full object-contain p-1" />
                                    </div>
                                ) : (
                                    <Image 
                                        src={course.image} 
                                        alt="" 
                                        width={24} 
                                        height={24} 
                                        className={cn(
                                            "w-full h-full object-contain",
                                            (course.id === "grok-mastery" || course.id === "course-perplexity") && "brightness-0 invert"
                                        )} 
                                    />
                                )}
                            </div>
                        ) : course.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className={cn("font-bold text-white text-sm md:text-base truncate transition-colors", unlocked && `group-hover:${primaryColorClass}`)}>{course.nameHe}</h4>
                        <p className="text-[10px] md:text-xs text-zinc-500 font-medium">
                            {unlocked ? `${courseLessons.length} / ${completedInCourse.length}` : "נעול"}
                        </p>
                    </div>
                    {!unlocked ? <Lock className="w-4 h-4 text-zinc-500" /> : <ChevronLeft className="w-4 h-4 text-zinc-500 rotate-180 group-hover:translate-x-[-4px] transition-transform" />}
                </Link>
            </m.div>
        );
    }

    return (
        <m.div variants={itemVariants} layout className="h-full relative group">
            {/* Ambient Glows (Behind the card) */}
            <div className="absolute inset-0 pointer-events-none">
                <div
                    className="absolute -inset-[20%] rounded-full opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-700 blur-[80px]"
                    style={{ backgroundColor: `rgb(${getGlowColor(categoryColor)})` }}
                />
                <div
                    className="absolute -top-1/4 -right-1/4 w-full h-full rounded-full opacity-[0.05] group-hover:opacity-[0.14] transition-opacity duration-700 blur-[60px]"
                    style={{ backgroundColor: `rgb(${getGlowColor(categoryColor)})` }}
                />
                <div
                    className="absolute -bottom-1/4 -left-1/4 w-full h-full rounded-full opacity-0 group-hover:opacity-[0.1] transition-opacity duration-700 blur-[60px]"
                    style={{ backgroundColor: `rgb(${getGlowColor(categoryColor)})` }}
                />
            </div>
            <Link
                href={unlocked ? `/courses/${course.id}?from=courses` : "#"}
                onClick={(e) => !unlocked && e.preventDefault()}
                className={cn(
                    "group h-full p-5 md:p-8 rounded-3xl md:rounded-[40px] flex flex-col items-start space-y-4 md:space-y-6 transition-all duration-500 relative overflow-hidden bg-zinc-900/90 border border-white/10",
                    unlocked 
                        ? "hover:bg-zinc-800/50 hover:-translate-y-2 hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.06)] active:scale-[0.98] hover:border-white/20" 
                        : "opacity-50 grayscale saturate-50 cursor-default"
                )}
                onMouseMove={handleMouseMove}
                ref={cardRef}
            >
                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-3xl md:rounded-[40px]">
                    <Grain />
                    
                    {/* Mouse-tracking highlight (Kept inside for interactive feel) */}
                    {unlocked && (
                        <m.div 
                            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                            style={{
                                background: mouseHighlight
                            }}
                        />
                    )}
                </div>

                <div className={cn(
                    "w-16 h-16 md:w-20 md:h-20 flex items-center justify-center text-3xl md:text-4xl shadow-2xl shrink-0 relative z-10 transition-all duration-700 group-hover:scale-110 group-hover:rotate-3 squarcle bg-gradient-to-br border border-white/10",
                    categoryColor
                )}>
                    {course.image ? (
                        <div className="w-full h-full p-3 md:p-4 flex items-center justify-center">
                            {course.id === "course-notebooklm" ? (
                                <div className="w-full h-full squarcle bg-white overflow-hidden flex items-center justify-center">
                                    <Image src={course.image} alt="" width={48} height={48} className="w-full h-full object-contain p-2" />
                                </div>
                            ) : (
                                <Image 
                                    src={course.image} 
                                    alt="" 
                                    width={48} 
                                    height={48} 
                                    className={cn(
                                        "w-full h-full object-contain",
                                        (course.id === "grok-mastery" || course.id === "course-perplexity") && "brightness-0 invert"
                                    )} 
                                />
                            )}
                        </div>
                    ) : (
                        <div className="drop-shadow-2xl">{course.icon}</div>
                    )}
                </div>

                <div className="flex-1 w-full relative z-10">
                    <h4 className={cn("font-black text-xl md:text-2xl mb-2 md:mb-3 text-white tracking-tight transition-all duration-300", unlocked && hoverGradientClass)}>{course.nameHe}</h4>
                    <p className="text-sm md:text-base text-zinc-400 font-medium line-clamp-2 group-hover:text-zinc-300 transition-colors duration-300 leading-relaxed">{course.description}</p>
                </div>

                {course.id === "how-llms-work" && completedInCourse.length === 0 && (
                    <m.div
                        initial={{ opacity: 0, scale: 0.8, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="absolute top-6 left-6 z-20"
                    >
                        <m.div
                            animate={{ 
                                scale: [1, 1.05, 1],
                                boxShadow: [
                                    "0 0 10px rgba(37,99,235,0.2)",
                                    "0 0 30px rgba(37,99,235,0.6)",
                                    "0 0 10px rgba(37,99,235,0.2)",
                                ]
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="bg-blue-600 text-white text-[11px] font-black px-4 py-2 rounded-full border border-white/30 flex items-center gap-2 shadow-2xl"
                        >
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
                            </span>
                            <span className="tracking-wide">התחל כאן!</span>
                        </m.div>
                    </m.div>
                )}

                <div className="mt-auto w-full pt-4 md:pt-6 flex items-center justify-between relative z-10 border-t border-white/10">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">התקדמות</span>
                        <span className="text-xs font-bold text-zinc-300">
                            {unlocked ? `${courseLessons.length} / ${completedInCourse.length} שיעורים` : "נעול"}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-black text-white px-4 py-2 md:px-5 md:py-2.5 rounded-xl bg-white/5 group-hover:bg-white/15 transition-all border border-white/5 group-hover:border-white/10 group-hover:translate-x-[-4px]">
                        <span>{unlocked ? "צפה בקורס" : "נעול"}</span>
                        <ChevronLeft className="w-4 h-4 rotate-180 transition-transform group-hover:translate-x-[-2px]" />
                    </div>
                </div>

                {!unlocked && (
                    <div className="absolute top-6 left-6 z-10">
                        <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10">
                            <Lock className="w-5 h-5 text-white/60" />
                        </div>
                    </div>
                )}
            </Link>
        </m.div>
    );
}

export default function CoursesPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-[#06060f]">
                <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
            </div>
        }>
            <CoursesPageContent />
        </Suspense>
    );
}

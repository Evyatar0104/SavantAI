"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CATEGORIES, COURSES } from "@/data/lessons";
import { LESSON_INDEX } from "@/data/lessons-index";
import { useSavantStore } from "@/store/useSavantStore";
import { m, Variants, AnimatePresence } from "framer-motion";
import { Lock, Search, LayoutGrid, List } from "lucide-react";
import { cn } from "@/lib/utils";
import { isCourseUnlocked, getCoursePrerequisiteName } from "@/lib/courseUnlock";

// ── View Toggle ──────────────────────────────────────
function ViewToggle({ compact, setCompact }: { compact: boolean; setCompact: (v: boolean) => void }) {
    return (
        <div style={{
            display: "flex",
            background: "rgba(255,255,255,0.04)",
            padding: 4,
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.08)",
        }}>
            <button
                onClick={() => setCompact(false)}
                style={{
                    padding: "6px 10px",
                    borderRadius: 7,
                    background: !compact ? "rgba(83,74,183,0.3)" : "transparent",
                    color: !compact ? "white" : "rgba(255,255,255,0.4)",
                    transition: "all 0.2s",
                }}
            >
                <LayoutGrid className="w-4 h-4" />
            </button>
            <button
                onClick={() => setCompact(true)}
                style={{
                    padding: "6px 10px",
                    borderRadius: 7,
                    background: compact ? "rgba(83,74,183,0.3)" : "transparent",
                    color: compact ? "white" : "rgba(255,255,255,0.4)",
                    transition: "all 0.2s",
                }}
            >
                <List className="w-4 h-4" />
            </button>
        </div>
    );
}

// ── Compact Course Card ──────────────────────────────
function CompactCourseCard({ 
    course, 
    unlocked, 
    hasLessons, 
    lessonsCount, 
    completedCount, 
    categoryColor 
}: { 
    course: any, 
    unlocked: boolean, 
    hasLessons: boolean, 
    lessonsCount: number, 
    completedCount: number,
    categoryColor: string
}) {
    return (
        <m.div
            layout
            variants={itemVariants}
            className={cn(
                "group relative flex items-center gap-4 p-4 rounded-2xl transition-all duration-300",
                unlocked && hasLessons 
                    ? "glass-panel dark:hover:bg-white/[0.04] hover:bg-black/[0.02] active:scale-[0.99]" 
                    : "opacity-50 grayscale saturate-50"
            )}
        >
            <Link 
                href={hasLessons && unlocked ? `/courses/${course.id}` : "#"}
                onClick={(e) => { if (!unlocked || !hasLessons) e.preventDefault(); }}
                className="absolute inset-0 z-10"
            />
            
            <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 bg-gradient-to-br shadow-lg group-hover:scale-110 transition-transform duration-300",
                categoryColor
            )}>
                {course.image ? (
                    <Image src={course.image} alt={course.nameHe} width={32} height={32} className="object-contain" />
                ) : (
                    course.icon
                )}
            </div>

            <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg text-foreground truncate">{course.nameHe}</h3>
                <p className="text-xs text-zinc-500 font-medium truncate">
                    {unlocked ? `${lessonsCount} שיעורים (${completedCount} הושלמו)` : "נעול"}
                </p>
            </div>

            {!unlocked && <Lock className="w-4 h-4 text-zinc-500 shrink-0" />}
            {unlocked && hasLessons && (
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-blue-500/10 transition-colors">
                    <span className="text-lg group-hover:text-blue-500 transition-colors">←</span>
                </div>
            )}
        </m.div>
    );
}

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08
        }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

// ── Filter pill ──────────────────────────────────────
function FilterPill({
    label,
    active,
    onClick,
    icon,
}: {
    label: string;
    active: boolean;
    onClick: () => void;
    icon?: string;
}) {
    return (
        <button
            onClick={onClick}
            style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 14px",
                borderRadius: 99,
                border: active ? "1px solid rgba(83,74,183,0.8)" : "1px solid rgba(255,255,255,0.1)",
                background: active ? "rgba(83,74,183,0.2)" : "rgba(255,255,255,0.04)",
                color: active ? "#A78BFA" : "rgba(255,255,255,0.55)",
                fontSize: 12,
                fontWeight: active ? 600 : 500,
                cursor: "pointer",
                whiteSpace: "nowrap",
                flexShrink: 0,
                transition: "all 0.2s",
            }}
        >
            {icon && <span style={{ fontSize: 14 }}>{icon}</span>}
            <span>{label}</span>
        </button>
    );
}

type StatusFilter = "all" | "unlocked" | "completed";

export default function Tracks() {
    const completedLessons = useSavantStore(state => state.completedLessons);
    const completedCourses = useSavantStore(state => state.completedCourses);
    
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
    const [isCompact, setIsCompact] = useState(false);

    const filteredCourses = useMemo(() => {
        return COURSES.filter(course => {
            // 1. Search Query
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                const inName = course.nameHe.toLowerCase().includes(q) || course.name.toLowerCase().includes(q);
                const inDesc = course.description.toLowerCase().includes(q);
                if (!inName && !inDesc) return false;
            }

            // 2. Category Filter
            if (selectedCategories.length > 0) {
                if (!selectedCategories.includes(course.categoryId)) return false;
            }

            // 3. Status Filter
            const unlocked = isCourseUnlocked(course.id, completedCourses);
            const completed = completedCourses.includes(course.id);
            if (statusFilter === "unlocked" && !unlocked) return false;
            if (statusFilter === "completed" && !completed) return false;

            return true;
        }).sort((a, b) => a.order - b.order);
    }, [searchQuery, selectedCategories, statusFilter, completedCourses]);

    const sortedCategories = [...CATEGORIES]
        .sort((a, b) => a.order - b.order)
        .filter(cat => {
            // Only show category if it has matching courses
            return filteredCourses.some(course => course.categoryId === cat.id);
        });

    const statusOptions: { value: StatusFilter; label: string }[] = [
        { value: "all", label: "הכל" },
        { value: "unlocked", label: "זמין" },
        { value: "completed", label: "הושלם" },
    ];

    return (
        <div className="p-6 md:p-10 flex flex-col pt-12 md:pt-16 max-w-7xl mx-auto w-full relative">
            <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <h1 className="text-4xl md:text-5xl font-black mb-3 tracking-tight text-foreground">מסלולי למידה</h1>
                <p className="text-lg md:text-xl text-zinc-500 dark:text-zinc-400 mb-10 md:mb-12 font-medium">שלוט בדור הבא של הבינה המלאכותית.</p>
            </m.div>

            {/* Search and Filters */}
            <div className="space-y-6 mb-12">
                {/* Search box & View Toggle */}
                <m.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.05 }}
                    className="flex items-center gap-3 max-w-2xl"
                >
                    <div className="relative flex-1">
                        <Search
                            className="absolute top-1/2 -translate-y-1/2 right-3 w-4 h-4 pointer-events-none"
                            style={{ color: "rgba(255,255,255,0.3)" }}
                        />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="חפש קורס..."
                            dir="rtl"
                            className="w-full py-2.5 pr-10 pl-4 rounded-xl border border-white/10 bg-white/5 text-foreground text-sm outline-none focus:border-purple-500/50 transition-colors"
                        />
                    </div>
                    <ViewToggle compact={isCompact} setCompact={setIsCompact} />
                </m.div>

                <div className="flex flex-col gap-3">
                    {/* Category filters */}
                    <m.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: 0.1 }}
                        className="flex gap-2 overflow-x-auto no-scrollbar pb-1"
                    >
                        <FilterPill 
                            label="כל הקטגוריות" 
                            active={selectedCategories.length === 0} 
                            onClick={() => setSelectedCategories([])} 
                        />
                        {CATEGORIES.map((cat) => (
                            <FilterPill
                                key={cat.id}
                                label={cat.nameHe}
                                icon={cat.icon}
                                active={selectedCategories.includes(cat.id)}
                                onClick={() => setSelectedCategories(prev => 
                                    prev.includes(cat.id) ? prev.filter(id => id !== cat.id) : [...prev, cat.id]
                                )}
                            />
                        ))}
                    </m.div>

                    {/* Status filters */}
                    <m.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: 0.15 }}
                        className="flex gap-2 overflow-x-auto no-scrollbar pb-1"
                    >
                        {statusOptions.map((opt) => (
                            <FilterPill
                                key={opt.value}
                                label={opt.label}
                                active={statusFilter === opt.value}
                                onClick={() => setStatusFilter(opt.value)}
                            />
                        ))}
                    </m.div>
                </div>
            </div>

            <div className="space-y-16">
                <AnimatePresence mode="popLayout">
                    {sortedCategories.length > 0 ? (
                        sortedCategories.map((category) => {
                            const categoryCourses = filteredCourses.filter(c => c.categoryId === category.id);

                            return (
                                <m.section 
                                    key={category.id}
                                    layout
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    {/* Category Header */}
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className={cn(
                                            "w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center text-2xl md:text-3xl shadow-lg shrink-0",
                                            category.color
                                        )}>
                                            {category.icon}
                                        </div>
                                        <div>
                                            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-foreground">{category.nameHe}</h2>
                                            <p className="text-sm md:text-base text-zinc-500 dark:text-zinc-400 font-medium">{category.description}</p>
                                        </div>
                                    </div>

                                    {/* Course Cards */}
                                    <m.div
                                        className={cn(
                                            "grid gap-6 md:gap-8",
                                            isCompact ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                                        )}
                                        variants={containerVariants}
                                        initial="hidden"
                                        animate="show"
                                    >
                                        {categoryCourses.map((course) => {
                                            const courseLessons = LESSON_INDEX.filter(l => l.courseId === course.id);
                                            const completedInCourse = courseLessons.filter(l => completedLessons.includes(l.id));
                                            const lessonsCount = courseLessons.length;
                                            const isCompleted = completedCourses.includes(course.id);
                                            const hasLessons = lessonsCount > 0;
                                            const unlocked = isCourseUnlocked(course.id, completedCourses);
                                            const prereqName = getCoursePrerequisiteName(course.id);

                                            if (isCompact) {
                                                return (
                                                    <CompactCourseCard
                                                        key={course.id}
                                                        course={course}
                                                        unlocked={unlocked}
                                                        hasLessons={hasLessons}
                                                        lessonsCount={lessonsCount}
                                                        completedCount={completedInCourse.length}
                                                        categoryColor={category.color}
                                                    />
                                                );
                                            }

                                            return (
                                                <m.div key={course.id} variants={itemVariants} layout className="h-full">
                                                    <Link
                                                        href={hasLessons && unlocked ? `/courses/${course.id}` : "#"}
                                                        onClick={(e) => { if (!unlocked || !hasLessons) e.preventDefault(); }}
                                                        className={cn(
                                                            "group h-full p-8 rounded-[32px] flex flex-col items-start space-y-6 transition-all duration-300 relative overflow-hidden",
                                                            hasLessons && unlocked
                                                                ? "glass-panel dark:hover:bg-white/[0.04] hover:bg-black/[0.02] hover:-translate-y-2 hover:shadow-2xl active:scale-[0.98]"
                                                                : "border border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] opacity-50 cursor-default saturate-50"
                                                        )}
                                                    >
                                                        {/* Decorative gradient blob */}
                                                        {hasLessons && (
                                                            <div className={cn(
                                                                "absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br rounded-full blur-[50px] opacity-10 dark:opacity-20 pointer-events-none transition-opacity duration-500 group-hover:opacity-40 dark:group-hover:opacity-60",
                                                                category.color
                                                            )} />
                                                        )}

                                                        <div className={cn(
                                                            "w-20 h-20 md:w-24 md:h-24 flex items-center justify-center text-4xl md:text-5xl shadow-xl shadow-black/10 shrink-0 relative z-10 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 squarcle bg-gradient-to-br",
                                                            category.color
                                                        )}>
                                                            <div className="absolute inset-0 bg-white/10 dark:bg-black/10 mix-blend-overlay"></div>
                                                            <div className="drop-shadow-md relative z-10 w-full h-full flex items-center justify-center">
                                                                {course.image ? (
                                                                    <div className="w-full h-full p-4 flex items-center justify-center">
                                                                         {course.id === "course-notebooklm" ? (
                                                                             <div className="w-full h-full squarcle bg-white overflow-hidden flex items-center justify-center">
                                                                                 <Image src={course.image} alt={course.nameHe} width={96} height={96} className="w-full h-full object-contain p-2" loading="lazy" />
                                                                             </div>
                                                                         ) : (
                                                                             <Image src={course.image} alt={course.nameHe} width={96} height={96} className="w-full h-full object-contain" loading="lazy" />
                                                                         )}
                                                                    </div>
                                                                ) : (
                                                                    course.icon
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className="flex-1 w-full relative z-10">
                                                            <h3 className="font-black text-2xl md:text-3xl leading-tight mb-2 tracking-tight text-foreground">{course.nameHe}</h3>
                                                            <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium line-clamp-2 mb-3">{course.description}</p>
                                                            {!unlocked && prereqName ? (
                                                                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-500">
                                                                    נפתח אחרי השלמה של &ldquo;{prereqName}&rdquo;
                                                                </p>
                                                            ) : (
                                                                <p className="text-sm md:text-base font-medium text-zinc-500 dark:text-zinc-400">
                                                                    {hasLessons
                                                                        ? `${lessonsCount} / ${completedInCourse.length} שיעורים`
                                                                        : "בקרוב"}
                                                                </p>
                                                            )}
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
                                                                            "0 0 20px rgba(37,99,235,0.5)",
                                                                            "0 0 10px rgba(37,99,235,0.2)",
                                                                        ]
                                                                    }}
                                                                    transition={{
                                                                        duration: 2,
                                                                        repeat: Infinity,
                                                                        ease: "easeInOut"
                                                                    }}
                                                                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] md:text-xs font-black px-3 py-1.5 rounded-full border border-white/20 flex items-center gap-1.5 pointer-events-none"
                                                                >
                                                                    <span className="relative flex h-2 w-2">
                                                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                                                                    </span>
                                                                    <span>התחל כאן!</span>
                                                                </m.div>
                                                            </m.div>
                                                        )}

                                                        {!unlocked && !isCompleted && (
                                                            <div className="absolute top-4 left-4 z-10">
                                                                <Lock className="w-5 h-5 text-zinc-500" />
                                                            </div>
                                                        )}

                                                        {hasLessons && (
                                                            <div className="mt-auto pt-4 relative z-10 w-full flex justify-end">
                                                                <div className="inline-flex items-center space-x-2 space-x-reverse px-5 py-2.5 bg-black/5 group-hover:bg-blue-500/10 dark:bg-white/5 dark:group-hover:bg-blue-500/15 text-foreground group-hover:text-blue-500 dark:group-hover:text-blue-400 rounded-full text-sm font-bold transition-all duration-300">
                                                                    <span>צפה בסילבוס</span>
                                                                    <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </Link>
                                                </m.div>
                                            );
                                        })}
                                    </m.div>
                                </m.section>
                            );
                        })
                    ) : (
                        /* Empty state */
                        <m.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col items-center py-20 text-center"
                        >
                            <p style={{ fontSize: 40, marginBottom: 12 }}>🔍</p>
                            <p className="text-xl font-bold text-foreground">לא נמצאו קורסים</p>
                            <p className="text-zinc-500 mt-2">נסה חיפוש אחר או הסר פילטרים</p>
                            <button 
                                onClick={() => {
                                    setSearchQuery("");
                                    setSelectedCategories([]);
                                    setStatusFilter("all");
                                }}
                                className="mt-6 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full font-bold transition-colors"
                            >
                                נקה הכל
                            </button>
                        </m.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

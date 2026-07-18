export function isCourseUnlocked(courseId: string, completedCourses: string[]): boolean {
    if (courseId === "prompting-mastery") {
        return completedCourses.includes("how-llms-work");
    }
    if (courseId === "choosing-models") {
        return completedCourses.includes("prompting-mastery");
    }
    return true;
}

export function getCoursePrerequisiteName(courseId: string): string | null {
    if (courseId === "prompting-mastery") return "איך AI באמת עובד";
    if (courseId === "choosing-models") return "לדבר עם AI כמו מקצוען";
    return null;
}
import { COURSES } from "@/data/lessons";

// Returns true if the course is accessible to the user
export function isCourseUnlocked(courseId: string, completedCourses: string[]): boolean {
    const course = COURSES.find(c => c.id === courseId);
    if (!course) return true;
    if (!course.requiredCourseId) return true;
    return completedCourses.includes(course.requiredCourseId);
}

export function getCoursePrerequisiteName(courseId: string): string | null {
    const course = COURSES.find(c => c.id === courseId);
    if (!course || !course.requiredCourseId) return null;
    
    const prerequisite = COURSES.find(c => c.id === course.requiredCourseId);
    return prerequisite ? prerequisite.nameHe : null;
}

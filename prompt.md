CURRENT STATE

The navigation is clean: בית, קורסים, פרופיל (Sidebar + BottomNav).
/courses/page.tsx exists and shows courses grouped by category.
/app/page.tsx has a hero card and course rows.
No Learning Paths exist yet.
Leaderboard route exists but is not integrated anywhere.
Zustand store has completedCourses, completedCourses, quiz results, but no path tracking.
No data/learningPaths.ts file.

TARGET STATE

"התמחויות" appear as a beautiful visual section inside /courses (with two tabs: "מסלולי התמחות" + "כל הקורסים").
5 fixed Learning Paths that match the existing quiz profile titles.
Each path has a dedicated roadmap page (/paths/[pathId]) with visual "מפת דרך".
Micro + macro progress tracking (per course and per entire path).
Exciting path selection modal that feels premium and motivating.
Leaderboard moved to a nice card on the home page (below hero).
All existing navigation, courses, and data stay untouched.


STEP 1 — CREATE DATA MODEL (src/data/learningPaths.ts)
Create a new file src/data/learningPaths.ts with exactly these 5 paths:
TypeScriptexport interface LearningPath {
  id: string;
  nameHe: string;
  descriptionHe: string;
  icon: string;
  color: string; // primary hex
  targetProfile: string; // matches quiz profileTitle
  courses: string[]; // course ids in exact order
  xpTotal: number;
}

export const learningPaths: LearningPath[] = [
  {
    id: "writer-ai",
    nameHe: "כותב AI",
    descriptionHe: "מהפרומפט הראשון ועד תוכן ברמה מקצועית",
    icon: "✍️",
    color: "#8B5CF6",
    targetProfile: "כותב",
    courses: ["how-llms-work", "prompting-mastery", "choosing-models", /* add more as needed */],
    xpTotal: 1200
  },
  // ... repeat for the other 4:
  // יוצר ויזואלי (icon: "🎨", color: "#EC4899")
  // מפתח AI (icon: "💻", color: "#3B82F6")
  // אנליסט AI (icon: "📊", color: "#10B981")
  // סטודנט AI (icon: "📚", color: "#F59E0B")
];
STEP 2 — UPDATE ZUSTAND STORE (src/store/useSavantStore.ts)
Add these fields to the store (and to resetAllData + persist):

activePathId: string | null
pathProgress: Record<string, { completedCourses: string[]; percent: number }>

Add action: selectPath(pathId: string) and updatePathProgress(pathId: string, courseId: string).

STEP 3 — ADD LEADERBOARD CARD TO HOME PAGE (src/app/page.tsx)
Add a new card component below the hero (or in the recommendations section) titled "🏆 טבלת המובילים".
Show top 3 users with XP + avatar placeholders.
Clicking it goes to /leaderboard (existing route).
Use Framer Motion for smooth entrance. Keep existing hero untouched.

STEP 4 — ENHANCE COURSES PAGE (src/app/courses/page.tsx)
Add two tabs at the top:

מסלולי התמחות (default)
כל הקורסים (existing content)

Under "מסלולי התמחות" show 5 large visual cards (one per path) with:

icon + nameHe + descriptionHe
progress bar (macro)
"התחל מסלול" button (opens selection modal if none selected, or goes to /paths/[id])

Keep existing category rows below the second tab.

STEP 5 — CREATE PATH ROADMAP PAGE (src/app/paths/[pathId]/page.tsx)
New dynamic route that shows:

Big header with path icon + nameHe + color theme (use getLessonTheme logic or similar)
Macro progress bar ("X% מהמסלול הושלם")
Visual roadmap (vertical timeline, RTL friendly):
Each course is a "station" with icon, name, micro progress, status (locked/open/done)
Connected by animated lines

"התחל את הקורס הבא" big button

Use Framer Motion for all animations.

STEP 6 — EXCITING SELECTION MODAL
Create components/PathSelectionModal.tsx
Trigger it from:

After quiz completion (if no activePathId)
From any "בחר מסלול חדש" button

Design:

Dark glassmorphism with radial glow
5 huge cards in a responsive grid
Each card has hover scale + glow based on path.color
Confetti on selection + 100 XP bonus
"זה המסלול בשבילי!" button


RULES:

Client-side only where needed (useEffect for any random/selection logic).
Hebrew-first — all new UI text in Hebrew.
RTL preserved everywhere (dir="rtl").
Use Framer Motion for every animation.
Do not change Sidebar, BottomNav, or any existing navigation items.
Do not break any existing lesson/course data or quiz flow.
Add new store fields to resetAllData() and persist config.
All new components must match the glassmorphism design system.
Run next build after every change and report any errors.
Do not change any other component or page unless explicitly mentioned above.
The card dimensions and layout structure on home and courses stay the same — only add the new sections.

STEP 7 — PATH COMPLETION ACHIEVEMENT
When a user completes all courses in a Learning Path (i.e. every courseId in the path's courses array appears in completedCourses):

Automatically trigger a full-screen celebratory completion screen (similar to lesson completion but bigger).
Show large animated badge/achievement card with the path's icon, nameHe, and a unique title (e.g. "כותב AI מומחה", "יוצר ויזואלי מקצועי").
Display confetti + XP counter (500 XP bonus for completing the entire path).
The achievement badge should be saved to the user profile and appear in a new "הישגים" section in the Profile page (or next to existing badges).
Add a new store field: achievements: string[] (array of completed path ids) and make sure it is persisted and included in resetAllData().

The completion screen must feel premium and motivating, using the path's color theme for glow and accents. After closing the screen, redirect the user back to the path roadmap page with updated 100% progress.
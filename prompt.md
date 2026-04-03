# Savant — Agent Sprint Prompt

You are working on **Savant**, a Hebrew-first AI literacy micro-learning app.
Read every file you need before touching anything. Do not guess file locations.
After all changes are complete, run `next build` and fix every error and warning before finishing.

---

## App Context

- Framework: Next.js 14 App Router, TypeScript, Tailwind CSS v4, Framer Motion, Zustand (persist), Firebase
- Direction: RTL (`dir="rtl"`, `lang="he"`) — every component must be RTL
- Design: dark theme, glassmorphism cards, primary accent `#534AB7`
- All UI text in Hebrew unless it is a proper noun (Claude, ChatGPT, Gemini, etc.)
- Never break existing lesson data in `ai-lessons.ts` or any lesson file
- Any new Zustand fields must be added to: interface + initial state + `resetAllData()` + persist config
- No new npm dependencies without a strong reason

---

## Task 1 — Remove purple status bar on mobile

**Goal:** The thin purple line that appears between the iOS/Android system status bar and the app content must be eliminated.

1. Search the entire codebase for `theme-color` meta tags. Check `app/layout.tsx`, `app/head.tsx`, `public/manifest.json`, and any PWA config files.
2. Change every `theme-color` value to match the app's dark background color (find the root background CSS value — likely something near `#0d0f1a` or equivalent. Match it exactly).
3. Find any `apple-mobile-web-app-status-bar-style` meta tag. Set its value to `black-translucent`.
4. In `public/manifest.json`, set `"background_color"` and `"theme_color"` to the same dark background value.
5. Verify no other file is injecting a conflicting theme color.

---

## Task 2 — Fix hero card layout on mobile

**Goal:** On mobile, the hero card on the home screen has a large emoji/illustration that overlaps the text content and CTA buttons. Fix the layout so the illustration is visually decorative (bottom-left anchor) and never overlaps text or buttons.

1. Find the hero card component (likely `HeroCard.tsx` or similar in `src/components/`). Read the full file.
2. Identify how the illustration/emoji is positioned. If it is `position: absolute`, it is likely overflowing onto the text.
3. Fix the mobile layout:
   - Text content (title, subtitle) sits in its own block, full width, unobstructed
   - CTA buttons sit below the text, full width, unobstructed
   - The illustration is decorative — position it at the bottom-left of the card, behind the text (`z-index` lower than text and buttons), clipped by the card's `overflow: hidden`
   - On desktop the current layout can stay if it already looks correct
4. Test at 390px viewport width (iPhone 14 size).

---

## Task 3 — Fix lesson exit button routing

**Goal:** Pressing ✕ during a lesson should return the user to where they came from — home screen or course page — not to the previous lesson in the browser history stack.

1. Find the component that renders the ✕ exit button during lesson flow. Check `LessonRunner.tsx` and any hook/header components used inside the lesson route.
2. The fix requires context-aware routing. Implement as follows:
   - When navigating **into** a lesson from the home screen (`/`), append `?from=home` to the lesson URL: `/lesson/[lessonId]?from=home`
   - When navigating **into** a lesson from a course page (`/courses/[courseId]`), append `?from=course`: `/lesson/[lessonId]?from=course`
   - Find every `router.push` or `<Link>` that navigates to a lesson and add the appropriate `from` param
3. In the lesson exit button handler:
   - Read `searchParams.get('from')`
   - If `from === 'home'` → `router.push('/')`
   - If `from === 'course'` → `router.push('/courses/' + lesson.courseId)`
   - Default fallback → `router.push('/')` (never use `router.back()`)
4. When the lesson completion screen navigates to the **next lesson**, preserve the `from` param: `/lesson/[nextLessonId]?from=course` (or `from=home` — match whatever the current lesson had).

---

## Task 4 — PWA polish: icon padding + haptics + performance

### 4a — Icon maskable padding
1. Open `public/manifest.json`. Ensure icon entries include both `192x192` and `512x512` sizes with `"purpose": "any maskable"`.
2. The icon file itself needs ~12% safe-zone padding on all sides so it is not cropped on maskable icon templates. If the current icon has no padding, note this in a comment for the developer to regenerate the PNG manually — do not break the existing icon reference.
3. Ensure `manifest.json` has: `"display": "standalone"`, `"orientation": "portrait"`, `"start_url": "/"`, `"lang": "he"`.

### 4b — Haptic feedback
Implement haptic feedback using the browser Vibration API (`navigator.vibrate()`). No new library needed. Create a utility file `src/lib/haptics.ts`:

```ts
export const haptics = {
  tap: () => navigator.vibrate?.(10),
  success: () => navigator.vibrate?.([10, 50, 20]),
  error: () => navigator.vibrate?.([30, 20, 30]),
  complete: () => navigator.vibrate?.([10, 30, 10, 30, 40]),
}
```

Apply haptics in the following places:
- **Any primary button tap** (CTA, "המשך", "התחל") → `haptics.tap()`
- **Correct quiz answer selected** → `haptics.success()`
- **Wrong quiz answer selected** → `haptics.error()`
- **Lesson completion** (confetti/XP screen) → `haptics.complete()`
- **✕ exit button** → `haptics.tap()`

### 4c — Rendering performance
1. Find all Framer Motion `motion.*` elements that animate `x`, `y`, or `scale`. Add `style={{ willChange: 'transform' }}` to ensure GPU compositing.
2. Find the lesson data loading pattern. If lesson data is loaded on demand when entering a lesson, add prefetching: when a lesson starts, preload the next lesson's data into component state or a ref so the transition to the next step is instant.
3. Verify all images use Next.js `<Image>` with explicit `width`/`height` or `fill`. Replace any bare `<img>` tags found.

---

## Task 5 — Course lock logic

**Goal:** Foundation courses (הבסיס category) unlock linearly. All other categories are always fully open.

### Lock rules:
- **איך AI באמת עובד** (`how-llms-work`) — always open, no prerequisite
- **לדבר עם AI כמו מקצוען** (`prompting-mastery`) — locked until `how-llms-work` is in `completedCourses`
- **לבחור את הכלי הנכון** (`choosing-models`) — locked until `prompting-mastery` is in `completedCourses`
- **Every course in every other category** (real-life, professional, advanced) — always open, never locked, regardless of any completion state

### Implementation:
1. Read `src/data/courses.ts` and `src/store/useSavantStore.ts`.
2. Create a utility function `src/lib/courseUnlock.ts`:

```ts
// Returns true if the course is accessible to the user
export function isCourseUnlocked(courseId: string, completedCourses: string[]): boolean {
  if (courseId === 'how-llms-work') return true
  if (courseId === 'prompting-mastery') return completedCourses.includes('how-llms-work')
  if (courseId === 'choosing-models') return completedCourses.includes('prompting-mastery')
  return true // all other courses always open
}
```

3. Find the course card component. Remove any static `isLocked` field usage. Replace with a dynamic call to `isCourseUnlocked(course.id, completedCourses)` reading `completedCourses` from Zustand.
4. For locked course cards:
   - Show a lock icon (🔒 or an SVG lock) in the top-right corner of the card
   - Show prerequisite text below the course description: `"נפתח אחרי השלמה של "[prerequisite course name]"`
     - For `prompting-mastery`: `נפתח אחרי השלמה של "איך AI באמת עובד"`
     - For `choosing-models`: `נפתח אחרי השלמה של "לדבר עם AI כמו מקצוען"`
   - Tapping a locked card shows a bottom sheet or toast with the same message — do NOT navigate to the course
   - The card should have reduced opacity (`opacity: 0.5`) and no hover/active effects
5. Fix the current bug where locked visual state is showing on open courses — ensure the dynamic unlock function is the single source of truth.

---

## Task 6 — Practice section: PracticeDetailSheet + filter + search

### 6a — PracticeDetailSheet component

Create `src/components/PracticeDetailSheet.tsx`. This is a bottom sheet that opens when any drill or project card is tapped.

**Sheet structure (top to bottom, RTL):**
1. Drag handle bar (centered, decorative)
2. Type badge (`תרגיל` or `פרויקט`) + Tool badge (Claude / ChatGPT / Gemini / כל מודל)
3. Title (large, bold)
4. Time estimate + XP reward in a small row
5. Description paragraph
6. Tags row
7. Divider
8. **"איך עושים את זה"** section header
9. Numbered step-by-step guide (ordered list, each step 1–3 sentences)
10. Divider
11. **"סיימתי"** CTA button — full width, primary purple

**Behavior:**
- Opens with Framer Motion slide-up from bottom + backdrop fade
- Backdrop tap closes the sheet
- On "סיימתי" press:
  - If already completed: show a small toast "כבר השלמת את זה 💪" and close
  - If not completed: mark as complete in Zustand (add `completedPractice: string[]` field), award XP (`75` for drills, `200` for projects), trigger `haptics.complete()`, close sheet, trigger XP animation on the card
- After completing 3 projects: award "Hall of Projects" badge (add to Zustand `badges` array or equivalent) and show a brief celebration animation

**Zustand additions for practice:**
- `completedPractice: string[]` — array of completed practice item IDs
- Add to `resetAllData()`
- Add to persist config

### 6b — Step-by-step guides

Write a full `steps: string[]` field for every drill and project. Content must be practical, specific, and written in Hebrew. Each step should be 1–3 sentences. Write the guides yourself based on the practice item's title, description, and tool.

The 10 items to write guides for:

**Drills:**
1. `system-prompt-business` — כתוב System Prompt לעסק שלך (Claude)
2. `summarize-3-depths` — סכם מאמר ב-3 רמות עומק (כל מודל)
3. `compare-3-models` — השווה תשובות בין שלושה מודלים (כל מודל)
4. `chain-of-thought` — אלץ חשיבה שלב-אחר-שלב (Claude)
5. `rewrite-email-3-tones` — שכתב מייל ב-3 טונים שונים (ChatGPT)
6. `extract-data-text` — חלץ נתונים מטקסט חופשי (Gemini)

**Projects:**
1. `full-presentation` — בנה מצגת שלמה עם Claude (Claude)
2. `market-research` — מחקר שוק מלא עם AI (Gemini)
3. `landing-page-code` — צור דף נחיתה מאפס עם קוד (Claude)
4. `monthly-content-plan` — בנה לוח תוכן חודשי (ChatGPT)

Structure the practice data as an array in `src/data/practice.ts`. Each item shape:

```ts
type PracticeItem = {
  id: string
  type: 'drill' | 'project'
  tool: 'Claude' | 'ChatGPT' | 'Gemini' | 'כל מודל'
  title: string
  description: string
  tags: string[]
  timeMinutes: number
  xp: 75 | 200
  steps: string[]
}
```

### 6c — Filter and search

On the practice page (`/practice` or `src/app/practice/page.tsx`):

1. **Search box** — add above the filter pills. Placeholder: `חפש תרגיל או פרויקט...`. Real-time filter on `title + description + tags`. RTL text input.

2. **Filter pills** — keep existing pills (תרגיל, פרויקט, זמן, נושא). Add a new **model filter** pill group: `כולם | Claude | ChatGPT | Gemini | כל מודל`. Selecting a model filters cards to that tool only.

3. Filter and search work together (AND logic — both must match).

4. Improve card titles: make sure each card title in the rendered list is sharp and scannable. Titles should be the full Hebrew title from the data, not truncated.

5. No new routing — everything happens in-page with React state.

---

## Task 7 — Quiz answer complexity

**Goal:** Quiz answers are currently too easy — the longest option is usually correct. Fix this across all lessons in all lesson data files.

1. Read every lesson file in `src/data/` that contains `questions[]`.
2. For every question, examine all answer options. Apply these rules:
   - All options must be **similar in length** — within ~10 words of each other
   - Wrong answers must sound **plausible** — they should be things a real beginner might believe
   - Wrong answers must be wrong for a **subtle, specific reason** — not obviously false
   - The correct answer must not be the only one that "sounds professional"
   - Update the `explanation` field to explain why the correct answer is right AND briefly why the most tempting wrong answer is wrong
3. Do not change question prompts — only rewrite the answer options and explanations.
4. Do not change which answer is marked correct — only make the distractors stronger.
5. Touch every lesson file that has questions. Do not skip any.

---

## Task 8 — Technical optimization pass

**Goal:** Clean, production-ready build with no warnings, no dead code, optimal runtime performance.

1. **Strip all console.log calls** from the entire `src/` directory. Keep `console.error` and `console.warn` only. Add this to `next.config.js` compiler options:
```js
compiler: {
  removeConsole: {
    exclude: ['error', 'warn'],
  },
}
```

2. **Clean up dead code:** Find and remove any unused imports, unused variables, unused components, and commented-out code blocks across all files in `src/`.

3. **Run `next build`** and fix every error and every warning. The build must complete cleanly with zero errors and zero warnings.

4. **Verify image optimization:** Confirm every `<img>` tag in `src/` has been replaced with Next.js `<Image>`. No exceptions.

5. **Check for layout shift:** In the lesson flow components, ensure that elements don't shift position during animation. All animated containers should have explicit `min-height` or `height` set so they don't cause CLS.

6. **Zustand persist sanity check:** Confirm that every field in `SavantState` is either in the persist config or explicitly excluded. No orphaned fields.

7. **TypeScript strictness:** Fix any `any` types that can be replaced with proper types. Do not introduce new `any` types.

8. **Final build:** Run `next build` one last time after all changes. Report the output. It must be clean.

---

## Completion Checklist

Before finishing, confirm:
- [ ] `next build` passes with zero errors and zero warnings
- [ ] All UI text is in Hebrew (proper nouns excluded)
- [ ] All new components have `dir="rtl"`
- [ ] All new Zustand fields are in `resetAllData()` and persist config
- [ ] Haptics utility is wired up in all specified locations
- [ ] Course lock logic uses `isCourseUnlocked()` as single source of truth — no static `isLocked` field drives UI
- [ ] Practice detail sheet opens and closes with Framer Motion animation
- [ ] "סיימתי" awards XP and marks completion correctly
- [ ] Search and model filter on practice page work together
- [ ] Lesson exit ✕ never calls `router.back()` — always uses explicit route
- [ ] Purple status bar meta tags updated in all locations
- [ ] Hero card illustration does not overlap text or buttons on mobile (390px)
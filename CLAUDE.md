# CLAUDE.md — Savant

You are working on **Savant**, a Hebrew-first AI literacy micro-learning app.
Read every file you need before touching anything. Do not guess file locations.
After all changes, run `next build` and fix every error and warning before finishing.

---

## Stack

- **Framework:** Next.js 14 App Router, TypeScript
- **Styling:** Tailwind CSS v4 (no v3 syntax — no `@apply`, no `theme()`)
- **Animation:** Framer Motion — use it for all animations, no exceptions
- **State:** Zustand with `persist` middleware (localStorage only — no Firestore sync yet)
- **Database:** Firebase / Firestore — imported but not fully wired
- **Font:** Assistant (Hebrew + Latin)

---

## Non-Negotiable Rules

1. **RTL always** — every new component needs `dir="rtl"`. No exceptions.
2. **Hebrew first** — all UI text in Hebrew. Proper nouns stay in English: Claude, ChatGPT, Gemini, NotebookLM, Google, OpenAI.
3. **Never touch src/content/lessons/ or any lesson data file** unless the task explicitly requires it. Production content lives there.
4. **Zustand additions:** any new field must be added to (a) `SavantState` interface, (b) initial state, (c) `resetAllData()`, (d) the persist config. All four. Every time.
5. **No new npm dependencies** without a clear reason stated in a comment.
6. **Never use `router.back()`** — always push an explicit route.
7. **No `console.log`** in `src/`. Keep `console.error` and `console.warn`.
8. **No bare `<img>` tags** — always use Next.js `<Image>` with explicit `width`/`height` or `fill`.
9. **No `any` types** unless genuinely unavoidable — add a comment explaining why.

---

## Project Structure

```
src/
  app/           → Next.js pages (/, /courses, /courses/[courseId], /lesson/[lessonId], /quiz, /profile, /practice, /leaderboard)
  components/    → Shared UI components
  content/       → Content files — lesson data, courses, categories, practice items, registry
  lib/           → Pure utilities (no React, no side effects)
  store/         → useSavantStore.ts — single Zustand store
  context/       → LessonContext.tsx

public/
  assets/logos/  → claude.png, chatgpt.png, gemini.png
  assets/badges/ → badge images
  manifest.json  → PWA manifest
```

---

## Data Model

```
Category → Course → Lesson (hierarchical)
```

**Lesson fields:** `id, courseId, categoryId, order, title, description, hook, tldr, scienceA, scienceB, pullQuote, insight, readContent, icon, practicalCall { task, goal, tool }, questions[]`

**PracticeItem fields:** `id, type, tool, title, description, tags, timeMinutes, xp, steps[]`

---

## Lesson Flow (in order)

Hook → TLDR → Read (scienceA + scienceB) → Pull Quote → Insight → Practical Call → Mode Choice → Quiz (3 questions) → Completion (XP + confetti)

---

## Design System

- **Theme:** dark, glassmorphism
- **Primary accent:** `#534AB7`
- **Card style:** `border-radius: 16px`, `background: rgba(255,255,255,0.06–0.08)`, `border: 0.5px solid rgba(255,255,255,0.1)`
- **Root background:** `#0d0f1a` (match this for all PWA theme-color and manifest values)
- **Lesson accent:** derived from `lesson.icon` — each lesson has a unique color theme
- All Framer Motion elements animating `x`, `y`, or `scale` → add `style={{ willChange: 'transform' }}`

---

## Course Unlock Logic

Use `src/lib/courseUnlock.ts` as the single source of truth. Never use static `isLocked` field to drive UI.

```
how-llms-work       → always open
prompting-mastery   → unlocks after how-llms-work completed
choosing-models     → unlocks after prompting-mastery completed
all other courses   → always open
```

---

## Haptics

Use `src/lib/haptics.ts` — no external library.

```ts
export const haptics = {
  tap:      () => navigator.vibrate?.(10),
  success:  () => navigator.vibrate?.([10, 50, 20]),
  error:    () => navigator.vibrate?.([30, 20, 30]),
  complete: () => navigator.vibrate?.([10, 30, 10, 30, 40]),
}
```

Apply at: primary button taps → `tap`, correct quiz answer → `success`, wrong answer → `error`, lesson completion → `complete`, ✕ exit → `tap`.

---

## Routing Convention for Lessons

When navigating into a lesson, always append a `from` param:
- From home (`/`) → `/lesson/[id]?from=home`
- From course page → `/lesson/[id]?from=course`

Exit button reads `searchParams.get('from')` and pushes explicitly:
- `home` → `router.push('/')`
- `course` → `router.push('/courses/' + lesson.courseId)`
- default → `router.push('/')`

Never call `router.back()`.

---

## Zustand Fields Reference

```
xp, streak, lastActiveDate, completedLessons, completedCourses,
completedPractice, quizCompleted, primaryUseCase, secondaryUseCase,
outputTypes, outputDepth, workStyle, budgetLevel, preferredTools,
experienceLevel, primaryModel, secondaryModel, primaryModelReason,
recommendedCourseId, profileTitle, specialistTools,
geminiIsAllRounder, userName, badges
```

---

## Writing Standard (for lesson and practice content)

- **Tone:** smart friend explaining over coffee — not a professor
- **Sentences:** short, max 2 lines each
- **scienceA + scienceB:** readable together in 90 seconds
- **Hebrew:** clear, direct, zero academic language
- **English terms:** keep industry-standard terms, explain on first use
- **Practical call:** one task, one tool, one clear goal
- **Quiz answers:** all options similar length, wrong answers plausible and subtly wrong

---

## Completion Checklist

Before finishing any task, confirm:

- [ ] `next build` passes — zero errors, zero warnings
- [ ] All UI text is in Hebrew (proper nouns excluded)
- [ ] All new components have `dir="rtl"`
- [ ] All new Zustand fields in `resetAllData()` and persist config
- [ ] No `router.back()` anywhere in `src/`
- [ ] No bare `<img>` tags in `src/`
- [ ] No `console.log` in `src/`
- [ ] Haptics wired in all specified locations
- [ ] Course lock UI reads from `isCourseUnlocked()` only
- [ ] Framer Motion animated elements have `willChange: 'transform'`

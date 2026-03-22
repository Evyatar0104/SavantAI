export type SkillTag =
    | "system-prompts"
    | "research"
    | "writing"
    | "analysis"
    | "coding"
    | "ideation"
    | "summarization";

export interface PracticeItem {
    id: string;
    type: "drill" | "project";
    title: string;
    description: string;
    goal: string;
    tool: "claude" | "chatgpt" | "gemini" | "any";
    estimatedMinutes: number;
    skillTags: SkillTag[];
    difficulty: 1 | 2 | 3;
    xpReward: number;
    badgeId?: string;
    relatedLessonId?: string;
    isPinned?: boolean;
}

export const SKILL_TAG_LABELS: Record<SkillTag, string> = {
    "system-prompts": "System Prompts",
    research: "מחקר",
    writing: "כתיבה",
    analysis: "ניתוח",
    coding: "קוד",
    ideation: "רעיונות",
    summarization: "סיכום",
};

export const PRACTICE_ITEMS: PracticeItem[] = [
    // ── DRILLS (6) ──────────────────────────────────────
    {
        id: "drill-system-prompt-business",
        type: "drill",
        title: "כתוב System Prompt לעסק שלך",
        description:
            "צור system prompt מקצועי שמגדיר טון, תחום ומגבלות — כדי ש-AI יענה בדיוק כמו שאתה צריך.",
        goal: "בסוף יהיה לך system prompt מוכן לשימוש יומיומי",
        tool: "claude",
        estimatedMinutes: 10,
        skillTags: ["system-prompts"],
        difficulty: 1,
        xpReward: 75,
        isPinned: true,
        relatedLessonId: "how-llms-work-4",
    },
    {
        id: "drill-summarize-article",
        type: "drill",
        title: "סכם מאמר ב-3 רמות עומק",
        description:
            "קח מאמר ארוך ובקש סיכום בשורה אחת, בפסקה אחת, ובחצי עמוד. השווה את התוצאות.",
        goal: "בסוף תדע לבקש סיכום ברמת הפירוט המדויקת שאתה צריך",
        tool: "any",
        estimatedMinutes: 8,
        skillTags: ["summarization", "writing"],
        difficulty: 1,
        xpReward: 75,
    },
    {
        id: "drill-compare-models",
        type: "drill",
        title: "השווה תשובות בין שלושה מודלים",
        description:
            "שלח את אותו prompt ל-Claude, ChatGPT ו-Gemini. נתח הבדלים בסגנון, דיוק ומבנה.",
        goal: "בסוף תבין מתי כל מודל עדיף — לא מהתיאוריה, מהניסיון",
        tool: "any",
        estimatedMinutes: 15,
        skillTags: ["analysis", "research"],
        difficulty: 2,
        xpReward: 75,
    },
    {
        id: "drill-chain-of-thought",
        type: "drill",
        title: "אלץ חשיבה שלב-אחר-שלב",
        description:
            "קח בעיה מורכבת ותרגל שימוש בטכניקת Chain of Thought כדי לקבל תשובה מדויקת יותר.",
        goal: "בסוף תדע לזהות מתי CoT משפר תוצאות ואיך לנסח את זה",
        tool: "claude",
        estimatedMinutes: 12,
        skillTags: ["system-prompts", "analysis"],
        difficulty: 2,
        xpReward: 75,
        relatedLessonId: "how-llms-work-3",
    },
    {
        id: "drill-email-rewrite",
        type: "drill",
        title: "שכתב מייל ב-3 טונים שונים",
        description:
            "קח מייל עסקי ובקש ממודל לשכתב אותו בטון רשמי, ידידותי ומשכנע. השווה את האפקט.",
        goal: "בסוף יהיה לך תבנית prompt לכל סוג תקשורת",
        tool: "chatgpt",
        estimatedMinutes: 10,
        skillTags: ["writing"],
        difficulty: 1,
        xpReward: 75,
    },
    {
        id: "drill-data-extraction",
        type: "drill",
        title: "חלץ נתונים מטקסט חופשי",
        description:
            "העתק טקסט לא מובנה (כתבה, דוח, פוסט) ובקש מהמודל לחלץ ישויות, תאריכים ומספרים לטבלה.",
        goal: "בסוף תדע לבנות prompt לחילוץ מידע מובנה מכל מקור",
        tool: "gemini",
        estimatedMinutes: 12,
        skillTags: ["analysis", "summarization"],
        difficulty: 2,
        xpReward: 75,
    },

    // ── PROJECTS (4) ────────────────────────────────────
    {
        id: "project-presentation",
        type: "project",
        title: "בנה מצגת שלמה עם Claude",
        description:
            "תכנן, כתוב ועצב מצגת של 10 שקפים — מרעיון ראשוני ועד תוכן מוכן להצגה.",
        goal: "בסוף תהיה לך מצגת מקצועית מוכנה לשימוש",
        tool: "claude",
        estimatedMinutes: 45,
        skillTags: ["writing", "ideation"],
        difficulty: 3,
        xpReward: 200,
        badgeId: "presentation-master",
        isPinned: true,
    },
    {
        id: "project-market-research",
        type: "project",
        title: "מחקר שוק מלא עם AI",
        description:
            "הגדר תחום, נתח מתחרים, זהה קהל יעד וצור דוח תובנות — הכל באמצעות שיחה מובנית.",
        goal: "בסוף יהיה לך דוח מחקר שוק שאפשר להציג",
        tool: "gemini",
        estimatedMinutes: 60,
        skillTags: ["research", "analysis"],
        difficulty: 3,
        xpReward: 200,
        badgeId: "researcher-pro",
    },
    {
        id: "project-landing-page",
        type: "project",
        title: "צור דף נחיתה מאפס עם קוד",
        description:
            "תכנן מבנה דף, כתוב קופי שיווקי וקבל קוד HTML/CSS מוכן להעלאה.",
        goal: "בסוף יהיה לך דף נחיתה עובד שאפשר לפרוס",
        tool: "claude",
        estimatedMinutes: 40,
        skillTags: ["coding", "writing"],
        difficulty: 3,
        xpReward: 200,
    },
    {
        id: "project-content-calendar",
        type: "project",
        title: "בנה לוח תוכן חודשי",
        description:
            "תכנן חודש שלם של תוכן לרשתות חברתיות — נושאים, כותרות, ותזמון מותאם לקהל שלך.",
        goal: "בסוף יהיה לך לוח תוכן מלא ל-30 יום",
        tool: "chatgpt",
        estimatedMinutes: 35,
        skillTags: ["ideation", "writing"],
        difficulty: 2,
        xpReward: 200,
    },
];

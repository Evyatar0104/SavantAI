export type SkillTag =
    | "system-prompts"
    | "research"
    | "writing"
    | "analysis"
    | "coding"
    | "ideation"
    | "summarization";

export type AIModelType = "Claude" | "ChatGPT" | "Gemini" | "כל מודל";

export type BuilderStep = {
    id: string;
    label: string;
    type: "select" | "text" | "hybrid";
    options: string[];
    // The sub-string template. Use {{input}} as placeholder for the user's choice/text
    template: string; 
};

export type PracticeItem = {
    id: string;
    courseId?: string;
    type: "drill" | "project";
    recommendedModel: AIModelType;
    compatibleModels: AIModelType[];
    isExclusive: boolean;
    builderSteps?: BuilderStep[];
    title: string;
    description: string;
    tags: string[];
    timeMinutes: number;
    xp: 75 | 200;
    steps: string[];
    // Legacy fields kept for backward compatibility with practice page UI
    goal?: string;
    estimatedMinutes?: number;
    skillTags?: SkillTag[];
    difficulty?: 1 | 2 | 3;
    xpReward?: number;
    badgeId?: string;
    relatedLessonId?: string;
    isPinned?: boolean;
};

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
        courseId: "prompting-mastery",
        type: "drill",
        recommendedModel: "Claude",
        compatibleModels: ["ChatGPT", "Gemini"],
        isExclusive: false,
        title: "משימה: בנה System Prompt עסקי (מנוע פרומפטים)",
        description:
            "צור system prompt מקצועי שמגדיר טון, תחום ומגבלות — כדי ש-AI יענה בדיוק כמו שאתה צריך, ללא מאמץ.",
        tags: ["System Prompts", "עסקים"],
        timeMinutes: 10,
        xp: 75,
        steps: [
            "השתמש ב-Prompt Builder כדי להרכיב את ההנחיה המדויקת באמצעות ה-Chips.",
            "העתק את הפרומפט והדבק אותו בתחילת העבודה מול המודל כדי לייצר סביבת עבודה 'נעולה' לתפקיד."
        ],
        builderSteps: [
            {
                id: "role",
                label: "מה התפקיד של ה-AI?",
                type: "hybrid",
                options: ["מנהל שיווק סושיאל", "קופירייטר ממיר", "יועץ אסטרטגי בכיר", "מתכנת צד לקוח"],
                template: "אתה פועל כ{{input}} מומחה."
            },
            {
                id: "tone",
                label: "באיזה טון הוא יענה?",
                type: "hybrid",
                options: ["מקצועי וענייני", "ידידותי, המשלב הומור קל", "ישיר, חד וללא מגילות", "מעורר השראה ומלא מוטיבציה"],
                template: "הטון של התשובות שלך צריך להיות {{input}}."
            },
            {
                id: "audience",
                label: "מי קהל היעד העיקרי?",
                type: "hybrid",
                options: ["לקוחות קצה (B2C)", "מקבלי החלטות בחברות (B2B)", "בני נוער וצעירים", "משקיעים ויזמים"],
                template: "התאם את השפה ל{{input}}."
            },
            {
                id: "constraints",
                label: "אילו מגבלות נחיל עליו?",
                type: "hybrid",
                options: ["שפה פשוטה נטולת מונחים מסובכים", "אסור לדבר על מחירים", "ספק תמיד תשובות קצרות - מקסימום פסקה"],
                template: "שים לב למגבלה הקריטית הבאה במסגרת הכתיבה: {{input}}."
            }
        ],
        // Legacy fields
        goal: "בסוף יהיה לך system prompt מוכן לשימוש יומיומי",
        estimatedMinutes: 10,
        skillTags: ["system-prompts"],
        difficulty: 1,
        xpReward: 75,
        isPinned: true,
        relatedLessonId: "prompting-system-prompt-mindset",
    },
    {
        id: "drill-summarize-article",
        courseId: "prompting-mastery",
        type: "drill",
        recommendedModel: "כל מודל",
        compatibleModels: ["Claude", "ChatGPT", "Gemini"],
        isExclusive: false,
        title: "סכם מאמר ב-3 רמות עומק",
        description:
            "קח מאמר ארוך ובקש סיכום בשורה אחת, בפסקה אחת, ובחצי עמוד. השווה את התוצאות.",
        tags: ["סיכום", "כתיבה"],
        timeMinutes: 8,
        xp: 75,
        steps: [
            "השתמש במחולל הסיכום כדי להגדיר את רמות הפירוט.",
            "העתק את הטקסט שברצונך לסכם והדבק אותו יחד עם ההנחיה שייצרנו."
        ],
        builderSteps: [
            {
                id: "source",
                label: "מה סוג הטקסט?",
                type: "hybrid",
                options: ["מאמר מדעי", "פוסט בבלוג", "דוח עסקי", "כתבה חדשותית"],
                template: "אני רוצה שתסכם עבורי {{input}}."
            },
            {
                id: "format",
                label: "באיזה פורמט תרצה את הסיכום?",
                type: "select",
                options: ["שורה אחת (TL;DR)", "פסקה אחת מרוכזת", "נקודות עיקריות (Bulleted list)", "סיכום מנהלים מקיף"],
                template: "הפורמט הנדרש הוא {{input}}."
            },
            {
                id: "focus",
                label: "על מה לשים דגש?",
                type: "hybrid",
                options: ["תובנות מעשיות", "נתונים ומספרים", "טיעונים מרכזיים", "סיכום ניטרלי"],
                template: "בסיכום, שים דגש מיוחד על {{input}}."
            }
        ],
        goal: "בסוף תדע לבקש סיכום ברמת הפירוט המדויקת שאתה צריך",
        estimatedMinutes: 8,
        skillTags: ["summarization", "writing"],
        difficulty: 1,
        xpReward: 75,
    },
    {
        id: "drill-compare-models",
        courseId: "choosing-models",
        type: "drill",
        recommendedModel: "כל מודל",
        compatibleModels: ["Claude", "ChatGPT", "Gemini"],
        isExclusive: false,
        title: "השווה תשובות בין שלושה מודלים",
        description:
            "שלח את אותו prompt ל-Claude, ChatGPT ו-Gemini. נתח הבדלים בסגנון, דיוק ומבנה.",
        tags: ["ניתוח", "השוואה"],
        timeMinutes: 15,
        xp: 75,
        steps: [
            "השתמש בבנייה כדי להגדיר את המשימה להשוואה.",
            "העתק את התוצאה ל-3 מודלים שונים וראה מי המנצח שלך."
        ],
        builderSteps: [
            {
                id: "task",
                label: "מה המשימה להשוואה?",
                type: "hybrid",
                options: ["כתיבת קוד פשוט", "הסבר מושג מורכב", "כתיבת פוסט יצירתי", "פתרון בעיה לוגית"],
                template: "בצע את המשימה הבאה: {{input}}."
            },
            {
                id: "criteria",
                label: "לפי מה נשפוט את התוצאה?",
                type: "select",
                options: ["יצירתיות ומקוריות", "דיוק עובדתי", "קיצור ותמציתיות", "איכות הקוד ומבנה"],
                template: "אני אשווה את התשובות שלך לפי {{input}}."
            }
        ],
        goal: "בסוף תבינו מתי כל מודל עדיף — לא מהתיאוריה, מהניסיון",
        estimatedMinutes: 15,
        skillTags: ["analysis", "research"],
        difficulty: 2,
        xpReward: 75,
    },
    {
        id: "drill-chain-of-thought",
        courseId: "prompting-mastery",
        type: "drill",
        recommendedModel: "Claude",
        compatibleModels: ["ChatGPT", "Gemini"],
        isExclusive: false,
        title: "אלץ חשיבה שלב-אחר-שלב",
        description:
            "קח בעיה מורכבת ותרגל שימוש בטכניקת Chain of Thought כדי לקבל תשובה מדויקת יותר.",
        tags: ["System Prompts", "ניתוח"],
        timeMinutes: 12,
        xp: 75,
        steps: [
            "בנה את הבעיה ב-Builder.",
            "השתמש בהנחיה כדי לאלץ את המודל 'לחשוב בקול רם' לפני התשובה."
        ],
        builderSteps: [
            {
                id: "problem",
                label: "מה הבעיה המורכבת?",
                type: "hybrid",
                options: ["תכנון תקציב חודשי", "פתרון קונפליקט בצוות", "אופטימיזציה של תהליך עבודה", "ניתוח מקרה בוחן"],
                template: "עזור לי לפתור את הבעיה הבאה: {{input}}."
            },
            {
                id: "cot_trigger",
                label: "איך להפעיל את החשיבה?",
                type: "select",
                options: ["חשוב שלב אחר שלב באופן מפורט", "פרק את הבעיה לתת-משימות לפני הפתרון", "הסבר את הלוגיקה מאחורי כל החלטה"],
                template: "לפני שתספק תשובה סופית, {{input}}."
            }
        ],
        goal: "בסוף תדע לזהות מתי CoT משפר תוצאות ואיך לנסח את זה",
        estimatedMinutes: 12,
        skillTags: ["system-prompts", "analysis"],
        difficulty: 2,
        xpReward: 75,
        relatedLessonId: "prompting-chain-of-thought",
    },
    {
        id: "drill-email-rewrite",
        courseId: "course-chatgpt",
        type: "drill",
        recommendedModel: "ChatGPT",
        compatibleModels: ["Claude", "Gemini"],
        isExclusive: false,
        title: "שכתב מייל ב-3 טונים שונים",
        description:
            "קח מייל עסקי ובקש ממודל לשכתב אותו בטון רשמי, ידידותי ומשכנע. השווה את האפקט.",
        tags: ["כתיבה", "תקשורת"],
        timeMinutes: 10,
        xp: 75,
        steps: [
            "הגדר את הטון והמטרה ב-Builder.",
            "הדבק את המייל המקורי וראה איך הוא משתנה."
        ],
        builderSteps: [
            {
                id: "tone",
                label: "מה הטון הרצוי?",
                type: "select",
                options: ["רשמי ומנומס (Corporate)", "ידידותי וחם (Casual)", "אסרטיבי ומשכנע (Sales)", "קצר ותכליתי (Urgent)"],
                template: "שכתב את המייל הבא בטון {{input}}."
            },
            {
                id: "audience",
                label: "מי המקבל?",
                type: "hybrid",
                options: ["מנהל ישיר", "לקוח זועם", "קולגה לעבודה", "מועמד לעבודה"],
                template: "המייל מיועד ל{{input}}."
            }
        ],
        goal: "בסוף יהיה לך תבנית prompt לכל סוג תקשורת",
        estimatedMinutes: 10,
        skillTags: ["writing"],
        difficulty: 1,
        xpReward: 75,
    },
    {
        id: "drill-data-extraction",
        courseId: "prompting-mastery",
        type: "drill",
        recommendedModel: "Gemini",
        compatibleModels: ["Claude", "ChatGPT"],
        isExclusive: false,
        title: "חלץ נתונים מטקסט חופשי",
        description:
            "העתק טקסט לא מובנה (כתבה, דוח, פוסט) ובקש מהמודל לחלץ ישויות, תאריכים ומספרים לטבלה.",
        tags: ["ניתוח", "סיכום"],
        timeMinutes: 12,
        xp: 75,
        steps: [
            "הגדר את מבנה הנתונים הנדרש.",
            "הדבק את הטקסט המבולגן וקבל טבלה מסודרת."
        ],
        builderSteps: [
            {
                id: "schema",
                label: "אילו נתונים לחלץ?",
                type: "text",
                options: [],
                template: "עבור הטקסט שאספק, חלץ את הפרטים הבאים: {{input}}."
            },
            {
                id: "output",
                label: "מה מבנה הפלט?",
                type: "select",
                options: ["טבלה מסודרת (Markdown Table)", "רשימת בולטים (Bullet points)", "קובץ JSON", "רשימת CSV"],
                template: "הצג את התוצאות בפורמט {{input}}."
            }
        ],
        goal: "בסוף תדע לבנות prompt לחילוץ מידע מובנה מכל מקור",
        estimatedMinutes: 12,
        skillTags: ["analysis", "summarization"],
        difficulty: 2,
        xpReward: 75,
    },

    // ── PROJECTS (4) ────────────────────────────────────
    {
        id: "project-presentation",
        courseId: "course-claude",
        type: "project",
        recommendedModel: "Claude",
        compatibleModels: ["ChatGPT"],
        isExclusive: false,
        title: "בנה מצגת שלמה עם Claude",
        description:
            "תכנן, כתוב ועצב מצגת של 10 שקפים — מרעיון ראשוני ועד תוכן מוכן להצגה.",
        tags: ["כתיבה", "רעיונות", "עסקים"],
        timeMinutes: 45,
        xp: 200,
        steps: [
            "השתמש במחולל המבנה כדי לייצר את הבסיס למצגת.",
            "העתק את המבנה ל-Claude ועבוד שקף-שקף לפי ההנחיות שיצרנו."
        ],
        builderSteps: [
            {
                id: "topic",
                label: "מה נושא המצגת?",
                type: "hybrid",
                options: ["גיוס הון לסטארטאפ", "סיכום רבעון מכירות", "הדרכת עובדים חדשים", "הצגת מוצר ללקוח"],
                template: "אני רוצה לבנות מצגת מקצועית בנושא {{input}}."
            },
            {
                id: "audience",
                label: "מי קהל היעד?",
                type: "hybrid",
                options: ["משקיעי VL/אנג'לים", "הנהלה בכירה", "צוותים טכניים", "לקוחות פוטנציאליים"],
                template: "קהל היעד שלי הוא {{input}}."
            },
            {
                id: "goal",
                label: "מה המטרה העיקרית?",
                type: "hybrid",
                options: ["לשכנע להשקיע", "ללמד מיומנות חדשה", "להציג הצלחות ונתונים", "לסגור עסקה/מכירה"],
                template: "המטרה המרכזית של המצגת היא {{input}}."
            },
            {
                id: "slides",
                label: "כמה שקפים תרצה?",
                type: "select",
                options: ["5 שקפים (קצר ולעניין)", "10 שקפים (סטנדרטי)", "15 שקפים (מפורט)"],
                template: "תכנן לי מבנה של {{input}}."
            }
        ],
        goal: "בסוף תהיה לך מצגת מקצועית מוכנה לשימוש",
        estimatedMinutes: 45,
        skillTags: ["writing", "ideation"],
        difficulty: 3,
        xpReward: 200,
        badgeId: "presentation-master",
        isPinned: true,
    },
    {
        id: "project-market-research",
        courseId: "course-gemini",
        type: "project",
        recommendedModel: "Gemini",
        compatibleModels: ["Claude", "ChatGPT"],
        isExclusive: false,
        title: "מחקר שוק מלא עם AI",
        description:
            "הגדר תחום, נתח מתחרים, זהה קהל יעד וצור דוח תובנות — הכל באמצעות שיחה מובנית.",
        tags: ["מחקר", "ניתוח", "עסקים"],
        timeMinutes: 60,
        xp: 200,
        steps: [
            "בנה את אסטרטגיית המחקר באמצעות ה-Builder.",
            "בצע את השלבים מול Gemini וסכם את התובנות הכלכליות."
        ],
        builderSteps: [
            {
                id: "industry",
                label: "מה התחום שאתה חוקר?",
                type: "hybrid",
                options: ["בינה מלאכותית יוצרת", "נדל\"ן להשקעה בחו\"ל", "מסחר אלקטרוני (E-com)", "בריאות ואיכות חיים"],
                template: "אני רוצה לבצע מחקר שוק מעמיק בתחום {{input}}."
            },
            {
                id: "focus",
                label: "מה הדגש במחקר?",
                type: "select",
                options: ["ניתוח מתחרים ישירים", "מגמות עתידיות ב-2024", "פילוח קהלי יעד", "חסמי כניסה ורגולציה"],
                template: "התמקד במיוחד ב{{input}}."
            },
            {
                id: "region",
                label: "מה האזור הגיאוגרפי?",
                type: "hybrid",
                options: ["ישראל", "ארה\"ב וקנדה", "אירופה", "גלובלי"],
                template: "הנתונים צריכים להתייחס לאזור {{input}}."
            }
        ],
        goal: "בסוף יהיה לך דוח מחקר שוק שאפשר להציג",
        estimatedMinutes: 60,
        skillTags: ["research", "analysis"],
        difficulty: 3,
        xpReward: 200,
        badgeId: "researcher-pro",
    },
    {
        id: "project-landing-page",
        courseId: "course-vibe-coding",
        type: "project",
        recommendedModel: "Claude",
        compatibleModels: ["ChatGPT", "Gemini"],
        isExclusive: false,
        title: "צור דף נחיתה מאפס עם קוד",
        description:
            "תכנן מבנה דף, כתוב קופי שיווקי וקבל קוד HTML/CSS מוכן להעלאה.",
        tags: ["קוד", "כתיבה", "שיווק"],
        timeMinutes: 40,
        xp: 200,
        steps: [
            "תכנן את מבנה הדף ב-Builder.",
            "בקש מ-Claude לייצר את הקוד המלא לפי המבנה שבחרת."
        ],
        builderSteps: [
            {
                id: "product",
                label: "מה המוצר/שירות?",
                type: "text",
                options: [],
                template: "הדף מיועד לשיווק {{input}}."
            },
            {
                id: "style",
                label: "מה הסגנון העיצובי?",
                type: "select",
                options: ["מינימליסטי ונקי", "הייטק ועתידני (Dark Mode)", "צבעוני ומשחקי", "יוקרתי ואלגנטי"],
                template: "השתמש בסגנון {{input}} בעיצוב ה-CSS."
            },
            {
                id: "cta",
                label: "מה ה-Call to Action?",
                type: "hybrid",
                options: ["השארת פרטים ליצירת קשר", "רכישה מיידית", "הרשמה לניוזלטר", "קביעת פגישת ייעוץ"],
                template: "הנעה לפעולה המרכזית היא {{input}}."
            }
        ],
        goal: "בסוף יהיה לך דף נחיתה עובד שאפשר לפרוס",
        estimatedMinutes: 40,
        skillTags: ["coding", "writing"],
        difficulty: 3,
        xpReward: 200,
    },
    {
        id: "project-content-calendar",
        courseId: "course-chatgpt",
        type: "project",
        recommendedModel: "ChatGPT",
        compatibleModels: ["Claude"],
        isExclusive: false,
        title: "בנה לוח תוכן חודשי",
        description:
            "תכנן חודש שלם של תוכן לרשתות חברתיות — נושאים, כותרות, ותזמון מותאם לקהל שלך.",
        tags: ["רעיונות", "כתיבה", "שיווק"],
        timeMinutes: 35,
        xp: 200,
        steps: [
            "קבע את אופי החודש ב-Builder.",
            "המשך ל-ChatGPT כדי לקבל פריסה של 30 יום."
        ],
        builderSteps: [
            {
                id: "platform",
                label: "איזו פלטפורמה?",
                type: "select",
                options: ["LinkedIn", "Instagram & TikTok", "Facebook Page", "X (Twitter)"],
                template: "צור לי לוח תוכן לחודש הקרוב עבור {{input}}."
            },
            {
                id: "goal",
                label: "מה המטרה החודשית?",
                type: "select",
                options: ["בניית סמכות מקצועית", "מכירות ישירות", "הגדלת חשיפה ו-Engagement", "גיוס עובדים"],
                template: "מטרת התוכן היא {{input}}."
            },
            {
                id: "pillars",
                label: "אילו נושאים מרכזיים (Pillars)?",
                type: "text",
                options: [],
                template: "התמקד ב3 עמודי התווך הבאים: {{input}}."
            }
        ],
        goal: "בסוף יהיה לך לוח תוכן מלא ל-30 יום",
        estimatedMinutes: 35,
        skillTags: ["ideation", "writing"],
        difficulty: 2,
        xpReward: 200,
    },
];

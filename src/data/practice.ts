export type SkillTag =
    | "system-prompts"
    | "research"
    | "writing"
    | "analysis"
    | "coding"
    | "ideation"
    | "summarization";

export type PracticeItem = {
    id: string;
    type: "drill" | "project";
    tool: "Claude" | "ChatGPT" | "Gemini" | "כל מודל";
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
        type: "drill",
        tool: "Claude",
        title: "כתוב System Prompt לעסק שלך",
        description:
            "צור system prompt מקצועי שמגדיר טון, תחום ומגבלות — כדי ש-AI יענה בדיוק כמו שאתה צריך.",
        tags: ["System Prompts", "עסקים"],
        timeMinutes: 10,
        xp: 75,
        steps: [
            "פתח שיחה חדשה ב-Claude. בתחילת השיחה כתוב: 'אני עומד לתת לך system prompt — אנא פעל לפיו בכל התשובות הבאות.'",
            "כתוב system prompt שכולל: שם ותפקיד הבוט, הטון הרצוי (רשמי/ידידותי/מקצועי), תחומי עיסוק, ומה שאסור לדון בו. לדוגמה: 'אתה עוזר תוכן לסטודיו צילום. ענה בעברית, בטון חם ומקצועי. אל תדון במחירים — הפנה ללינק ליצירת קשר.'",
            "שלח הודעת בדיקה — שאל שאלה רגילה ושאלה שה-prompt אמור לחסום. ראה אם הבוט מחזיק את האופי. שפר את ה-prompt לפי מה שמצאת.",
        ],
        // Legacy fields
        goal: "בסוף יהיה לך system prompt מוכן לשימוש יומיומי",
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
        tool: "כל מודל",
        title: "סכם מאמר ב-3 רמות עומק",
        description:
            "קח מאמר ארוך ובקש סיכום בשורה אחת, בפסקה אחת, ובחצי עמוד. השווה את התוצאות.",
        tags: ["סיכום", "כתיבה"],
        timeMinutes: 8,
        xp: 75,
        steps: [
            "בחר מאמר מעניין — כתבה, פוסט בלוג, או מסמך ארוך. העתק את הטקסט המלא.",
            "שלח שלוש בקשות נפרדות: (1) 'סכם בשורה אחת', (2) 'סכם בפסקה אחת', (3) 'סכם בחצי עמוד עם נקודות עיקריות'. תן לכל בקשה חיים נפרדים — שיחה חדשה או הודעה חדשה.",
            "קרא את שלוש הגרסאות ושאל את עצמך: מה כל גרסה מוסיפה? מה היא מפספסת? הבנה זו תעזור לך לבקש את רמת הפירוט הנכונה בכל פעם.",
        ],
        goal: "בסוף תדע לבקש סיכום ברמת הפירוט המדויקת שאתה צריך",
        estimatedMinutes: 8,
        skillTags: ["summarization", "writing"],
        difficulty: 1,
        xpReward: 75,
    },
    {
        id: "drill-compare-models",
        type: "drill",
        tool: "כל מודל",
        title: "השווה תשובות בין שלושה מודלים",
        description:
            "שלח את אותו prompt ל-Claude, ChatGPT ו-Gemini. נתח הבדלים בסגנון, דיוק ומבנה.",
        tags: ["ניתוח", "השוואה"],
        timeMinutes: 15,
        xp: 75,
        steps: [
            "בחר prompt מעניין — שאלה טכנית, בקשת כתיבה יצירתית, או דילמה עסקית. כתוב אותו פעם אחת ושמור אותו.",
            "שלח את אותו הprompt המדויק לשלושת המודלים — Claude (claude.ai), ChatGPT (chat.openai.com), Gemini (gemini.google.com). אל תשנה שום מילה.",
            "השווה: מי ענה ארוך יותר? מי השתמש בנקודות? מי נשמע יותר זהיר? מי נתן את התשובה הכי שימושית *לצורך שלך*? תרשום לך מסקנה אחת על כל מודל.",
        ],
        goal: "בסוף תבין מתי כל מודל עדיף — לא מהתיאוריה, מהניסיון",
        estimatedMinutes: 15,
        skillTags: ["analysis", "research"],
        difficulty: 2,
        xpReward: 75,
    },
    {
        id: "drill-chain-of-thought",
        type: "drill",
        tool: "Claude",
        title: "אלץ חשיבה שלב-אחר-שלב",
        description:
            "קח בעיה מורכבת ותרגל שימוש בטכניקת Chain of Thought כדי לקבל תשובה מדויקת יותר.",
        tags: ["System Prompts", "ניתוח"],
        timeMinutes: 12,
        xp: 75,
        steps: [
            "בחר בעיה שדורשת כמה שלבים — חישוב, השוואת אפשרויות, תכנון פרויקט, או ניתוח מצב. שאל אותה ראשית בצורה ישירה וקבל תשובה.",
            "עכשיו שאל שוב — אבל הוסף בסוף: 'חשוב על זה שלב אחר שלב לפני שאתה עונה.' השווה את שתי התשובות — האם השנייה מפורטת יותר? מדויקת יותר?",
            "נסה גרסה שלישית: 'לפני שתענה, רשום את כל ההנחות שאתה מניח ואת שלבי הפתרון.' ראה איך המודל 'חושב בקול' ומתי זה עוזר.",
        ],
        goal: "בסוף תדע לזהות מתי CoT משפר תוצאות ואיך לנסח את זה",
        estimatedMinutes: 12,
        skillTags: ["system-prompts", "analysis"],
        difficulty: 2,
        xpReward: 75,
        relatedLessonId: "how-llms-work-3",
    },
    {
        id: "drill-email-rewrite",
        type: "drill",
        tool: "ChatGPT",
        title: "שכתב מייל ב-3 טונים שונים",
        description:
            "קח מייל עסקי ובקש ממודל לשכתב אותו בטון רשמי, ידידותי ומשכנע. השווה את האפקט.",
        tags: ["כתיבה", "תקשורת"],
        timeMinutes: 10,
        xp: 75,
        steps: [
            "בחר מייל שכתבת לאחרונה — אפשר בקשה, עדכון, או מכתב פנייה. הכנס אותו ל-ChatGPT ובקש: 'שכתב את המייל הזה בטון רשמי ומקצועי.'",
            "בהמשך אותה שיחה בקש: 'עכשיו שכתב אותו בטון ידידותי וחמים.' ואז: 'עכשיו שכתב אותו בטון משכנע שמדגיש ערך ותועלת.'",
            "קרא את שלוש הגרסאות ובחר אחת. שים לב: מה השתנה בין הגרסאות? מה נשאר? שמור את הפרומפט הזה — הוא עובד על כל מייל.",
        ],
        goal: "בסוף יהיה לך תבנית prompt לכל סוג תקשורת",
        estimatedMinutes: 10,
        skillTags: ["writing"],
        difficulty: 1,
        xpReward: 75,
    },
    {
        id: "drill-data-extraction",
        type: "drill",
        tool: "Gemini",
        title: "חלץ נתונים מטקסט חופשי",
        description:
            "העתק טקסט לא מובנה (כתבה, דוח, פוסט) ובקש מהמודל לחלץ ישויות, תאריכים ומספרים לטבלה.",
        tags: ["ניתוח", "סיכום"],
        timeMinutes: 12,
        xp: 75,
        steps: [
            "מצא טקסט לא מובנה — כתבה עיתונאית, סקירת שוק, פוסט ארוך בלינקדאין, או מסמך PDF שסרקת. העתק לפחות 3 פסקאות.",
            "שלח ל-Gemini עם ההוראה: 'חלץ מהטקסט הבא את כל הישויות הבאות לטבלה: שמות, תאריכים, מספרים/אחוזים, ארגונים. [הדבק טקסט]'",
            "בדוק את הטבלה שקיבלת — האם פספס משהו? האם יש שגיאות? נסה שוב עם הוראה יותר ספציפית: 'חלץ רק נתונים כספיים ואחוזים'. בנה את ה-prompt שעובד הכי טוב לסוג הטקסט שלך.",
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
        type: "project",
        tool: "Claude",
        title: "בנה מצגת שלמה עם Claude",
        description:
            "תכנן, כתוב ועצב מצגת של 10 שקפים — מרעיון ראשוני ועד תוכן מוכן להצגה.",
        tags: ["כתיבה", "רעיונות", "עסקים"],
        timeMinutes: 45,
        xp: 200,
        steps: [
            "פתח שיחה ב-Claude ותאר את המצגת: נושא, קהל יעד, מטרה (למכור? ללמד? לעדכן?), ומספר השקפים. בקש: 'הצע לי מבנה של 10 שקפים עם כותרת וקצרה לכל שקף.'",
            "לאחר שאישרת את המבנה, בקש: 'עכשיו כתוב את התוכן המלא לכל שקף — כולל כותרת, 3-5 נקודות עיקריות, והצעה לויזואל או דוגמה.' עבד שקף אחד בכל פעם אם צריך.",
            "לאחר שיש לך תוכן לכל השקפים, בקש: 'עבור על כל המצגת ובדוק: האם יש זרימה הגיונית? האם הפתיחה מושכת? האם הסיכום קורא לפעולה?' השתמש בהערות לשיפור.",
            "העתק את התוכן ל-Google Slides, Canva, או Gamma.app. Claude יכול גם לכתוב הערות דובר לכל שקף — בקש זאת בנפרד.",
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
        type: "project",
        tool: "Gemini",
        title: "מחקר שוק מלא עם AI",
        description:
            "הגדר תחום, נתח מתחרים, זהה קהל יעד וצור דוח תובנות — הכל באמצעות שיחה מובנית.",
        tags: ["מחקר", "ניתוח", "עסקים"],
        timeMinutes: 60,
        xp: 200,
        steps: [
            "פתח שיחה ב-Gemini ותאר את התחום: 'אני רוצה לעשות מחקר שוק ל[תאר עסק/מוצר]. מה המסגרת המומלצת לניתוח — מה לחקור ובאיזה סדר?' קבל מפת דרכים מהמודל.",
            "עבד על כל קטגוריה בנפרד: (1) ניתוח מתחרים — 'מי הם 5 המתחרים הראשיים ב[תחום]? מה החוזקות והחולשות של כל אחד?' (2) קהל יעד — 'אפיין 3 פרסונות לקוח טיפוסיות.' (3) טרנדים — 'מה הטרנדים המרכזיים בתחום ב-2025?'",
            "בשלב הסיכום בקש: 'על סמך כל מה שדנו, כתוב דוח תובנות קצר: מה ההזדמנויות? מה הסיכונים? מה ה-USP המומלץ?' ייצא את הכל למסמך אחד מסודר.",
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
        type: "project",
        tool: "Claude",
        title: "צור דף נחיתה מאפס עם קוד",
        description:
            "תכנן מבנה דף, כתוב קופי שיווקי וקבל קוד HTML/CSS מוכן להעלאה.",
        tags: ["קוד", "כתיבה", "שיווק"],
        timeMinutes: 40,
        xp: 200,
        steps: [
            "תאר ל-Claude את המוצר/שירות: מה זה, למי, ומה הפעולה שאתה רוצה שהמבקר יעשה (קנייה, הרשמה, יצירת קשר). בקש: 'הצע לי מבנה לדף נחיתה — אילו סקציות, באיזה סדר, ומה המסר הראשי.'",
            "לאחר שאישרת את המבנה, בקש: 'כתוב את הקופי לכל סקציה — כותרת ראשית, כותרות משנה, תיאורים קצרים, ו-CTA חזק. הכל בעברית.' ערוך והתאם לקול שלך.",
            "עכשיו בקש את הקוד: 'כתוב HTML + CSS מלא לדף הנחיתה הזה. עיצוב מודרני, רספונסיבי למובייל, ללא ספריות חיצוניות.' שמור את הקובץ כ-index.html ופתח בדפדפן — זה עובד.",
        ],
        goal: "בסוף יהיה לך דף נחיתה עובד שאפשר לפרוס",
        estimatedMinutes: 40,
        skillTags: ["coding", "writing"],
        difficulty: 3,
        xpReward: 200,
    },
    {
        id: "project-content-calendar",
        type: "project",
        tool: "ChatGPT",
        title: "בנה לוח תוכן חודשי",
        description:
            "תכנן חודש שלם של תוכן לרשתות חברתיות — נושאים, כותרות, ותזמון מותאם לקהל שלך.",
        tags: ["רעיונות", "כתיבה", "שיווק"],
        timeMinutes: 35,
        xp: 200,
        steps: [
            "פתח שיחה ב-ChatGPT ותאר: הרשת החברתית (אינסטגרם/לינקדאין/פייסבוק/טיקטוק), קהל היעד, נושא הדף, ותדירות הפרסום הרצויה. בקש: 'הצע לי 4 עמודות תוכן (pillars) לחודש הקרוב.'",
            "לאחר אישור העמודות, בקש: 'צור לוח תוכן ל-30 יום — לכל פוסט: תאריך, עמוד תוכן, נושא ספציפי, סוג פוסט (טקסט/תמונה/וידאו/שאלה), וכותרת ראשונה מושכת.' קבל את זה בפורמט טבלה.",
            "בחר 5-7 פוסטים מהלוח שנראים הכי טובים ובקש: 'כתוב טיוטה מלאה לכל אחד מהפוסטים האלו — כולל כיתוב, hashtags, ו-CTA.' העתק לגוגל שיטס או Notion לתזמון.",
        ],
        goal: "בסוף יהיה לך לוח תוכן מלא ל-30 יום",
        estimatedMinutes: 35,
        skillTags: ["ideation", "writing"],
        difficulty: 2,
        xpReward: 200,
    },
];

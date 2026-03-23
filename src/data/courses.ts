import { Course } from "./lessons";

export const COURSES: Course[] = [
    // Foundation (linear — order matters)
    {
        id: "how-llms-work",
        categoryId: "foundation",
        name: "How LLMs Actually Work",
        nameHe: "איך AI באמת עובד",
        description: "לפני שמשתמשים — מבינים. טוקנים, הזיות, חלונות הקשר והמנגנון שמאחורי כל תשובה שאתה מקבל.",
        icon: "🧠",
        order: 1,
        isLocked: false
    },
    {
        id: "prompting-mastery",
        categoryId: "foundation",
        name: "Prompting Mastery",
        nameHe: "לדבר עם AI כמו מקצוען",
        description: "הפרומפט הוא הכלי. RCTF, איטרציה, שרשרת מחשבה, פרומפטים לפי פורמט — כל מה שהופך תשובה בינונית לתשובה מדויקת.",
        icon: "🗂️",
        order: 2,
        isLocked: true,
        requiredCourseId: "how-llms-work"
    },
    {
        id: "choosing-models",
        categoryId: "foundation",
        name: "Choosing the Right Model",
        nameHe: "לבחור את הכלי הנכון",
        description: "Claude, ChatGPT, Gemini — לא אותו דבר. תלמד מתי להשתמש בכל אחד, למה, ואיך לבנות סטאק שעובד לך.",
        icon: "🎯",
        order: 3,
        isLocked: true,
        requiredCourseId: "prompting-mastery"
    },
    // Tools (open)
    {
        id: "course-chatgpt",
        categoryId: "tools",
        name: "ChatGPT — The Complete Guide",
        nameHe: "ChatGPT — המדריך המלא",
        description: "ממשק, זיכרון, Custom GPTs, DALL-E, קוד — כל מה שצריך לדעת",
        icon: "💬",
        image: "/assets/logos/chatgpt.png",
        order: 1,
        isLocked: false
    },
    {
        id: "course-claude",
        categoryId: "tools",
        name: "Claude — The Complete Guide",
        nameHe: "Claude — המדריך המלא",
        description: "Projects, Artifacts, מסמכים ארוכים, וכתיבה שנשמעת אנושית",
        icon: "🎯",
        image: "/assets/logos/claude.png",
        order: 2,
        isLocked: false
    },
    {
        id: "course-gemini",
        categoryId: "tools",
        name: "Gemini — The Complete Guide",
        nameHe: "Gemini — המדריך המלא",
        description: "Google Workspace, חיפוש חי, Gems, ו-1M token context",
        icon: "🌐",
        image: "/assets/logos/gemini.png",
        order: 3,
        isLocked: false
    },
    {
        id: "course-notebooklm",
        categoryId: "tools",
        name: "NotebookLM",
        nameHe: "NotebookLM — מחקר בלי לאבד את הדעת",
        description: "העלה מקורות, שאל שאלות, קבל פודקאסט — מחקר שעובד אחרת",
        icon: "📓",
        image: "/assets/logos/notebooklm.png",
        order: 4,
        isLocked: false
    },
    {
        id: "course-vibe-coding",
        categoryId: "tools",
        name: "Vibe Coding",
        nameHe: "Vibe Coding — לבנות בלי לדעת לקודד",
        description: "מרעיון לאפליקציה עם Lovable, Bolt ו-Claude Code — בלי שורת קוד אחת",
        icon: "⚡",
        image: "/assets/logos/vibe-coding.png",
        order: 5,
        isLocked: false
    },
    {
        id: "course-image-gen",
        categoryId: "tools",
        name: "Image Generators",
        nameHe: "Image Generators — לייצר ויז'ואל עם AI",
        description: "לדבר בשפה הויזואלית של ה-AI. סגנון, תאורה, קומפוזיציה ועקביות ב-Midjourney, Flux ו-Nano Banana 2.",
        icon: "🎨",
        image: "/assets/logos/image-generation.png",
        order: 6,
        isLocked: false
    },
    // Real Life (open)
    {
        id: "ai-productivity",
        categoryId: "real-life",
        name: "AI for Daily Productivity",
        nameHe: "AI ביום יום",
        description: "מיילים, החלטות, ניהול מידע, שגרת בוקר עם AI. איך להפוך שעה של עבודה לעשרים דקות.",
        icon: "⚡",
        order: 1,
        isLocked: true,
        requiredCourseId: "how-llms-work"
    },
    {
        id: "ai-studying",
        categoryId: "real-life",
        name: "AI for Studying",
        nameHe: "AI ללמידה",
        description: "NotebookLM, שיטת פיינמן עם AI, סיכומים חכמים והכנה למבחנים. ללמוד יותר בפחות זמן.",
        icon: "📚",
        order: 2,
        isLocked: true,
        requiredCourseId: "how-llms-work"
    },
    {
        id: "ai-writing",
        categoryId: "real-life",
        name: "AI for Writing & Content",
        nameHe: "AI לכתיבה",
        description: "לשמור על הקול שלך בזמן שה-AI עושה את העבודה הכבדה. כתיבת תוכן, עריכה, פוסטים, מיילים — בעברית ובאנגלית.",
        icon: "✍️",
        order: 3,
        isLocked: true,
        requiredCourseId: "how-llms-work"
    },
    {
        id: "ai-creative",
        categoryId: "real-life",
        name: "AI for Creative Work",
        nameHe: "AI ליצירה",
        description: "תמונות, מוזיקה, וידיאו, עיצוב. Midjourney, Suno, Runway — איך לתת לדמיון שלך כלים אמיתיים.",
        icon: "🎨",
        order: 4,
        isLocked: true,
        requiredCourseId: "how-llms-work"
    },
    // Professional (open)
    {
        id: "ai-market-research",
        categoryId: "professional",
        name: "AI for Market Research",
        nameHe: "AI למחקר שוק",
        description: "ניתוח מתחרים, סינתזת לקוחות, זיהוי טרנדים ובניית דוחות מחקר — בשעה במקום בשבוע.",
        icon: "🔍",
        order: 1,
        isLocked: true,
        requiredCourseId: "how-llms-work"
    },
    {
        id: "ai-stock-market",
        categoryId: "professional",
        name: "AI for the Stock Market",
        nameHe: "AI לשוק ההון",
        description: "קריאת דוחות כספיים, ניתוח חדשות שוק, מחקר סקטורים. AI ככלי עבודה למשקיע הרציני.",
        icon: "📈",
        order: 2,
        isLocked: true,
        requiredCourseId: "how-llms-work"
    },
    // Advanced (open)
    {
        id: "vibe-coding",
        categoryId: "advanced",
        name: "AI for Coding & Vibe Coding",
        nameHe: "ניהול סוכני תכנות",
        description: "Cursor, v0, Claude — איך לבנות כלים, אתרים ואוטומציות אמיתיות גם בלי ידע עמוק בקוד.",
        icon: "💻",
        order: 1,
        isLocked: true,
        requiredCourseId: "prompting-mastery"
    },
    {
        id: "new-software-mindset",
        categoryId: "advanced",
        name: "The New Software Mindset",
        nameHe: "התוכנה החדשה",
        description: "הבינה המלאכותית שינתה את הנגישות של תחום התוכנה. ניתן כעת ללמוד בפשטות איך למנף פתרונות תוכנה להתקדמות ברמה האישית והמקצועית.",
        icon: "🔮",
        order: 2,
        isLocked: true,
        requiredCourseId: "prompting-mastery"
    },
    {
        id: "ai-safety",
        categoryId: "advanced",
        name: "AI Safety & Critical Thinking",
        nameHe: "AI ביקורתי",
        description: "הטיות, מידע שגוי, דיפייקים, פרטיות. איך להשתמש ב-AI מבלי להיות מוטעה על ידו.",
        icon: "🛡️",
        order: 3,
        isLocked: true,
        requiredCourseId: "prompting-mastery"
    }
];

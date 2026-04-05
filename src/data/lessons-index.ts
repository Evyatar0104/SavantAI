import { LessonReward } from "./lessons";

/**
 * Lightweight lesson index — metadata only, no heavy content fields.
 * Import this instead of the full LESSONS array when you only need
 * id / courseId / categoryId / order / title / icon / trackId / description.
 */

export interface LessonMeta {
    id: string;
    trackId?: string;
    courseId: string;
    categoryId: string;
    order: number;
    title: string;
    icon?: string;
    description: string;
    reward?: LessonReward;
}

export const LESSON_INDEX: LessonMeta[] = [
    // ── how-llms-work (7 lessons) ──
    { id: "ai-p0-01", trackId: "ai", courseId: "how-llms-work", categoryId: "foundation", order: 1, title: "ChatGPT לא מחפש — הוא ממציא", icon: "🧠", description: "הוא לא גוגל. הוא לא מסד נתונים. אז מה הוא בעצם עושה?" },
    { id: "llm-tokens", trackId: "ai", courseId: "how-llms-work", categoryId: "foundation", order: 2, title: "איך המודל קורא טקסט", icon: "🔤", description: "הוא לא קורא מילים — הוא קורא פיסות. זה משנה הכל." },
    { id: "llm-probability", trackId: "ai", courseId: "how-llms-work", categoryId: "foundation", order: 3, title: "המודל מנחש — כל פעם מחדש", icon: "🎲", description: "כל מילה שהמודל כותב היא הימור. הבנה זו תשנה איך אתה קורא תשובות." },
    { id: "llm-context-window", trackId: "ai", courseId: "how-llms-work", categoryId: "foundation", order: 4, title: "כמה המודל יכול לזכור בבת אחת?", icon: "📏", description: "ל-AI יש זיכרון עבודה מוגבל. אם תעמיס עליו יותר מדי, הוא פשוט יתחיל לשכוח." },
    { id: "llm-training", trackId: "ai", courseId: "how-llms-work", categoryId: "foundation", order: 5, title: "מאיפה המודל יודע מה שהוא יודע", icon: "📚", description: "הוא לא למד בבית ספר. הוא קרא את כל האינטרנט — וזה משפיע על כל תשובה שלו." },
    { id: "llm-limits", trackId: "ai", courseId: "how-llms-work", categoryId: "foundation", order: 6, title: "מה המודל לא יכול לעשות", icon: "🚫", description: "הוא נראה כמו קסם, אבל יש דברים שהוא תמיד יכשל בהם. דע אותם כדי לא ליפול." },
    { id: "ai-p0-06", trackId: "ai", courseId: "how-llms-work", categoryId: "foundation", order: 7, title: "כשה-AI משקר לך בפנים", icon: "🎭", description: "זה היה נשמע מלוטש, רהוט ובטוח לחלוטין. הבעיה שהוא המציא את הסיפור מאפס." },

    // ── prompting-mastery (10 lessons) ──
    { id: "prompting-why-prompts-fail", trackId: "ai", courseId: "prompting-mastery", categoryId: "foundation", order: 1, title: "למה רוב הפרומפטים נכשלים", icon: "🤔", description: "ה-AI לא טיפש. פשוט חסר לו הקשר.", reward: { type: "badge", value: "prompt-master", label: "תג מאסטר" } },
    { id: "prompting-give-it-a-role", trackId: "ai", courseId: "prompting-mastery", categoryId: "foundation", order: 2, title: "תן לו תפקיד (Role)", icon: "👨🏫", description: "משפט הפתיחה משנה לחלוטין את העומק והסגנון של הפלט." },
    { id: "prompting-context-is-everything", trackId: "ai", courseId: "prompting-mastery", categoryId: "foundation", order: 3, title: "תן לו הקשר ורקע עמוק", icon: "📝", description: "המודל יודע רק מה שסיפרת לו כרגע. ספר לו את התמונה המלאה." },
    { id: "prompting-say-what-you-dont-want", trackId: "ai", courseId: "prompting-mastery", categoryId: "foundation", order: 4, title: "ציין במפורש מה אתה לא רוצה שיהיה", icon: "🚫", description: "לפעמים ה-לא שאתה אומר לו משמעותי פי כמה מהדברים שביקשת." },
    { id: "prompting-chain-of-thought", trackId: "ai", courseId: "prompting-mastery", categoryId: "foundation", order: 5, title: "גרור אותו לחשוב בצעדים", icon: "🧠", description: "משפט אחד קטן יכול לשלש את יכולת ההיגיון שלו על משימה מורכבת במכה." },
    { id: "prompting-few-shot", trackId: "ai", courseId: "prompting-mastery", categoryId: "foundation", order: 6, title: "תעשה כמוני — דוגמאות (Few-Shot)", icon: "📋", description: "אל תסביר לו איך אתה רוצה את זה. פשוט תראה לו 3 דוגמאות." },
    { id: "prompting-format-control", trackId: "ai", courseId: "prompting-mastery", categoryId: "foundation", order: 7, title: "שלוט במה שיוצא — פורמט הפלט", icon: "📐", description: "אתה יכול להכתיב בדיוק איך התשובה תיראה — טבלה, רשימה או קוד. זה חוסך זמן ומייצר סדר." },
    { id: "prompting-system-prompt-mindset", trackId: "ai", courseId: "prompting-mastery", categoryId: "foundation", order: 8, title: "ההוראות שהוא תמיד זוכר", icon: "⚙️", description: "השתמש ב-System Prompt כדי להגדיר חוקי ברזל קבועים לכל השיחות שלך." },
    { id: "prompting-chaining-tasks", trackId: "ai", courseId: "prompting-mastery", categoryId: "foundation", order: 9, title: "שרשר משימות — תן לו לבנות על עצמו", icon: "🔗", description: "פרק משימות מורכבות לסדרה של צעדים קטנים וממוקדים כדי להבטיח איכות מקסימלית." },
    { id: "prompting-meta-prompt", trackId: "ai", courseId: "prompting-mastery", categoryId: "foundation", order: 10, title: "תבקש ממנו לשפר את הפרומפט שלך", icon: "🪄", description: "אל תתאמץ לכתוב את הפרומפט המושלם. תן ל-AI לעזור לך לנסח אותו טוב יותר." },

    // ── choosing-models (8 lessons) ──
    { id: "choosing-what-are-llms-really", trackId: "ai", courseId: "choosing-models", categoryId: "foundation", order: 1, title: "כולם LLMs — אז מה ההבדל בעצם?", icon: "🧬", description: "למה שלושה כלים שמבוססים על אותה טכנולוגיה מתנהגים אחרת לגמרי?" },
    { id: "choosing-chatgpt-profile", trackId: "ai", courseId: "choosing-models", categoryId: "foundation", order: 2, title: "ChatGPT — הכלי שכולם מכירים", icon: "💬", description: "האולר השוויצרי של עולם ה-AI. הוא טוב להכל, אבל יש לו גם חולשות." },
    { id: "choosing-claude-profile", trackId: "ai", courseId: "choosing-models", categoryId: "foundation", order: 3, title: "Claude — הכלי שחושב לפני שמדבר", icon: "🎯", description: "הוא לא תמיד הראשון שעולה בגוגל. אבל הוא לרוב הכי מדויק." },
    { id: "choosing-gemini-profile", trackId: "ai", courseId: "choosing-models", categoryId: "foundation", order: 4, title: "Gemini — הכלי שמחובר לעולם", icon: "🌐", description: "הוא לא הכי חכם בחדר — אבל הוא היחיד שיודע מה קורה עכשיו." },
    { id: "choosing-by-task", trackId: "ai", courseId: "choosing-models", categoryId: "foundation", order: 5, title: "תתאים כלי למשימה — לא משימה לכלי", icon: "🎯", description: "אם יש לך רק פטיש, כל בעיה נראית כמו מסמר. בוא נלמד להחליף כלים." },
    { id: "choosing-strengths-weaknesses", trackId: "ai", courseId: "choosing-models", categoryId: "foundation", order: 6, title: "כל כלי מצטיין במשהו — וגרוע במשהו", icon: "⚖️", description: "בוא נלמד לזהות מתי ה-AI מתחיל 'לזייף' ואיך לתקן את זה בזמן." },
    { id: "choosing-free-vs-paid", trackId: "ai", courseId: "choosing-models", categoryId: "foundation", order: 7, title: "חינמי מול בתשלום — מתי שווה לשלם?", icon: "💳", description: "האם ה-20$ האלו הם הוצאה או השקעה? בוא נעשה חשבון." },
    { id: "choosing-build-your-stack", trackId: "ai", courseId: "choosing-models", categoryId: "foundation", order: 8, title: "בנה את ה-Stack האישי שלך", icon: "🏗️", description: "השיעור האחרון: איך להרכיב לעצמך נבחרת מנצחת של כלי AI." },

    // ── course-chatgpt (10 lessons) ──
    { id: "chatgpt-platform-2026", trackId: "ai", courseId: "course-chatgpt", categoryId: "tools", order: 1, title: "ChatGPT של 2026 — זה כבר לא רק צ'אט", icon: "🚀", description: "900 מיליון משתמשים עושים בו שימוש יומיומי, אבל רובם עדיין תקועים ב-2023. הגיע הזמן להתקדם." },
    { id: "chatgpt-memory-instructions", trackId: "ai", courseId: "course-chatgpt", categoryId: "tools", order: 2, title: "Memory — הוא זוכר מי אתה (אם תלמד אותו)", icon: "🧠", description: "פיצ'רים כמו זיכרון והוראות מותאמות ימנעו ממך לחזור על אותם פרטים שוב ושוב בכל שיחה חדשה." },
    { id: "chatgpt-projects", trackId: "ai", courseId: "course-chatgpt", categoryId: "tools", order: 3, title: "Projects — שיחות מאורגנות, context שנשמר", icon: "📁", description: "קובץ קבוע, מטרה ברורה, ושמירת הקשר לכל שיחה חדשה. הכלי שהופך סשן מחקר בוסרי ליחידת עבודה מוגמרת." },
    { id: "chatgpt-deep-research", trackId: "ai", courseId: "course-chatgpt", categoryId: "tools", order: 4, title: "Deep Research — מחקר של שעות בדקות", icon: "🔬", description: "הסוכן שיודע לחקור, להצליב, לקרוא ולחזור אליך אחרי 15 דקות עם דוח מלא, שמשנה את צורת העבודה והלימוד. (דרישה: מנוי Plus)" },
    { id: "chatgpt-canvas", trackId: "ai", courseId: "course-chatgpt", categoryId: "tools", order: 5, title: "Canvas — לכתוב ולקודד ביחד עם ChatGPT", icon: "🖊️", description: "ממשק עבודה צידי ומפוצל המאפשר עריכת מסמכים שלמים וקוד ללא איבוד רצף ההקשר ומבלי לעשות פעולות 'Copy-Paste' סיזיפיות." },
    { id: "chatgpt-custom-gpts", trackId: "ai", courseId: "course-chatgpt", categoryId: "tools", order: 6, title: "Custom GPTs — אלפי כלים מוכנים, חינם", icon: "🧩", description: "חנות מלאה בכלים שמישהו אחר טרח כדי להגדיר. עוזר תכנות, עורך דין ויורשה לכתיבה - נמצאים במרחק הקלקה." },
    { id: "chatgpt-voice-mode", trackId: "ai", courseId: "course-chatgpt", categoryId: "tools", order: 7, title: "Voice Mode — ChatGPT שמקשיב ועונה בקול", icon: "🎙️", description: "לדבר למודל בזמן אמת בלי לעבוד עם ההקלדה המתישה. מצב סופר נוח לנסיעות, סיעורי מוחות, ותרגול פרונטלי." },
    { id: "chatgpt-connectors", trackId: "ai", courseId: "course-chatgpt", categoryId: "tools", order: 8, title: "Connectors — ChatGPT מחובר לכלים שלך", icon: "🔌", description: "בלי להעתיק מסמכים ארוכים הלוך ושוב: לחבר ישירות את המודל ל-Google Drive, Slack וסביבות החברה המשותפות שלך." },
    { id: "chatgpt-agent-mode", trackId: "ai", courseId: "course-chatgpt", categoryId: "tools", order: 9, title: "Agent Mode — ChatGPT שעושה, לא רק מדבר", icon: "🤖", description: "מוד ה-Agent מאפשר למודל לשוטט באתרים עבורך, ללחוץ, להכניס נתונים באופן עצמאי לקבלת משימה ברורה מהחיים." },
    { id: "chatgpt-plans-pricing", trackId: "ai", courseId: "course-chatgpt", categoryId: "tools", order: 10, title: "Free, Go, Plus, Pro — מה שווה לשלם", icon: "💳", description: "פריסת מנויים כנה וללא יומרה: מי צריך דחיפת Plus מלאה, מתי מספיקה Go צנועה, ולמי עדכון החינם הופך להיות כפתור מעצבן." },

    // ── course-claude (10 lessons) ──
    { id: "claude-honest-by-design", trackId: "ai", courseId: "course-claude", categoryId: "tools", order: 1, title: "Claude לא מנסה לרצות אותך — וזו בדיוק הנקודה", icon: "🎯", description: "Claude בנוי להיות ישר, לא נעים — וזה הופך אותו לשימושי יותר כשמשהו חשוב." },
    { id: "claude-long-context", trackId: "ai", courseId: "course-claude", categoryId: "tools", order: 2, title: "תן לו 500 עמוד — הוא לא יאבד את הדרך", icon: "📄", description: "חלון הקשר של 200K טוקנים הופך ניתוח מסמכים ארוכים למשהו שאפשר לעשות בפועל." },
    { id: "claude-writing-voice", trackId: "ai", courseId: "course-claude", categoryId: "tools", order: 3, title: "הכתיבה שנשמעת כמוך — לא כמו AI", icon: "✍️", description: "Claude מייצר את הכתיבה הכי אנושית מבין המודלים — ועם ההגדרה הנכונה, היא תישמע כמוך." },
    { id: "claude-projects", trackId: "ai", courseId: "course-claude", categoryId: "tools", order: 4, title: "Projects — תפסיק להסביר את עצמך מחדש בכל שיחה", icon: "📁", description: "Projects הם סביבת עבודה קבועה עם זיכרון, קבצים, והוראות — עכשיו בחינם לכולם." },
    { id: "claude-artifacts", trackId: "ai", courseId: "course-claude", categoryId: "tools", order: 5, title: "Artifacts — הפלט שאפשר לשלוח, לשתף ולהמשיך לבנות", icon: "🔧", description: "Artifact הוא תוצר עצמאי — מסמך, כלי, אפליקציה אינטראקטיבית — לא עוד תשובה בצ'אט." },
    { id: "claude-thinking-partner", trackId: "ai", courseId: "course-claude", categoryId: "tools", order: 6, title: "להחליט דברים קשים — Claude כחבר שחושב איתך", icon: "🧠", description: "שימוש ב-Claude לחשיבה ולקבלת החלטות — לא רק למשימות — הוא השימוש עם הערך הגבוה ביותר." },
    { id: "claude-extended-thinking", trackId: "ai", courseId: "course-claude", categoryId: "tools", order: 7, title: "Extended Thinking — תגיד לו לחשוב לפני שהוא עונה", icon: "⚙️", description: "Extended Thinking הוא מצב שבו Claude חושב בקול לפני שהוא עונה — ומשפר דיוק ב-30-35% על משימות מורכבות." },
    { id: "claude-google-workspace", trackId: "ai", courseId: "course-claude", categoryId: "tools", order: 8, title: "Google Workspace — Claude בתוך ה-Docs וה-Gmail שלך", icon: "📧", description: "מנויי Pro מקבלים אינטגרציה ישירה עם Google Docs, Gmail ו-Drive — Claude קורא ועורך קבצים אמיתיים שלך." },
    { id: "claude-cowork", trackId: "ai", courseId: "course-claude", categoryId: "tools", order: 9, title: "Cowork — תן לו משימה ותחזור כשסיים", icon: "🤖", description: "Cowork (Pro+) הוא Claude שעובד אוטונומית על קבצים ומשימות במחשב שלך — בלי פיקוח צמוד." },
    { id: "claude-plans-pricing", trackId: "ai", courseId: "course-claude", categoryId: "tools", order: 10, title: "Free, Pro, Max — ההחלטה הכנה", icon: "💳", description: "פירוט ישיר של תוכניות Claude — בלי upsell, עם המלצה ברורה לפי שימוש." },

    // ── course-gemini (10 lessons) ──
    { id: "gemini-ecosystem-intro", trackId: "ai", courseId: "course-gemini", categoryId: "tools", order: 1, title: "Gemini לא רק אפליקציה — הוא בכל מקום שאתה כבר נמצא", icon: "🌐", description: "רוב האנשים פותחים את האתר של גוגל ומתכתבים עם צ'אט. הם מפספסים 90% מהערך." },
    { id: "gemini-gmail", trackId: "ai", courseId: "course-gemini", categoryId: "tools", order: 2, title: "Gemini ב-Gmail — תפסיק לבזבז שעתיים על האימייל", icon: "📧", description: "העובד הממוצע מבזבז שעות על ניהול דואר. Gemini תוקף את זה מארבעה כיוונים." },
    { id: "gemini-search", trackId: "ai", courseId: "course-gemini", categoryId: "tools", order: 3, title: "Gemini ב-Google Search — חיפוש שמבין מה אתה באמת שואל", icon: "🔍", description: "גוגל הוא כבר לא רק רשימת קישורים. ה-AI נותן תשובות מלאות עם מקורות." },
    { id: "gemini-workspace-docs-sheets", trackId: "ai", courseId: "course-gemini", categoryId: "tools", order: 4, title: "Gemini ב-Docs, Sheets, Slides — מסמכים שכותבים את עצמם", icon: "📝", description: "ה-AI מוטמע כפאנל צדדי בכל כלי העבודה. הוא מכיר את הקבצים שלכם ב-Drive." },
    { id: "gemini-deep-research", trackId: "ai", courseId: "course-gemini", categoryId: "tools", order: 5, title: "Deep Research — מחקר של יום עבודה בפחות מ-20 דקות", icon: "🔬", description: "סוכן אוטונומי שגולש במאות אתרים עבורכם. דורש AI Pro." },
    { id: "gemini-agent", trackId: "ai", courseId: "course-gemini", categoryId: "tools", order: 6, title: "Gemini Agent — תן לו משימה שדורשת כמה כלים", icon: "🤖", description: "השלב הבא של ה-AI: משימות מרובות שלבים אוטונומיות לגמרי. דורש AI Ultra." },
    { id: "gemini-drive", trackId: "ai", courseId: "course-gemini", categoryId: "tools", order: 7, title: "Gemini ב-Drive — הקבצים שלך הופכים לידע שאפשר לשאול", icon: "💾", description: "ה-Drive שלכם הוא כבר לא רק מחסן קבצים. הוא בסיס ידע אינטראקטיבי." },
    { id: "gemini-gems", trackId: "ai", courseId: "course-gemini", categoryId: "tools", order: 8, title: "Gems — תבנה AI מומחה לכל משימה חוזרת שלך", icon: "💎", description: "צרו גירסאות מותאמות אישית של Gemini עם הוראות קבועות וקבצים מצורפים." },
    { id: "gemini-ecosystem-connected", trackId: "ai", courseId: "course-gemini", categoryId: "tools", order: 9, title: "הכל מחובר — ככה ה-Ecosystem של Gemini עובד ביחד", icon: "🔗", description: "העוצמה האמיתית היא האינטגרציה. איך כל הכלים שדיברנו עליהם מתקשרים אחד עם השני." },
    { id: "gemini-plans-pricing", trackId: "ai", courseId: "course-gemini", categoryId: "tools", order: 10, title: "Free / AI Pro / AI Ultra — ההחלטה הכנה", icon: "💳", description: "השוואה אובייקטיבית של המסלולים. מה באמת מקבלים בעד הכסף?" },

    // ── course-notebooklm (7 lessons) ──
    { id: "notebooklm-what-it-is", trackId: "ai", courseId: "course-notebooklm", categoryId: "tools", order: 1, title: "NotebookLM — ה-AI שלא ממציא דברים", icon: "📚", description: "כל ה-AI האחרים עונים ממה שהם יודעים מהאינטרנט. NotebookLM עונה רק ממה שאתה מעלה אליו." },
    { id: "notebooklm-how-it-works", trackId: "ai", courseId: "course-notebooklm", categoryId: "tools", order: 2, title: "Sources, Chat, Studio — הארכיטקטורה שמסבירה הכל", icon: "🏗️", description: "שלושה פאנלים שיוצרים סביבת עבודה מלאה. מהמקורות ועד לתוצר הסופי." },
    { id: "notebooklm-top-30", trackId: "ai", courseId: "course-notebooklm", categoryId: "tools", order: 3, title: "Top 30% — תעלה נכון, תשאל נכון, תשמע את הפודקאסט", icon: "🎧", description: "סיכום הוא רק ההתחלה. איך לחלץ תובנות אמיתיות ולהשתמש ב-Interactive Mode ב-Audio Overview." },
    { id: "notebooklm-top-10", trackId: "ai", courseId: "course-notebooklm", categoryId: "tools", order: 4, title: "Top 10% — Configure Chat + Studio כמו מקצוען", icon: "⚙️", description: "הפיכת ה-AI לעוזר מחקר אישי עם הוראות קבע ושימוש בכלים הויזואליים של ה-Studio." },
    { id: "notebooklm-slides", trackId: "ai", courseId: "course-notebooklm", categoryId: "tools", order: 5, title: "Slides — המצגת שכותבת את עצמה מהמקורות שלך", icon: "🎨", description: "יצירת מצגות ויזואליות ומקצועיות ישירות מהמקורות. איך לעשות את זה נכון מבלי לבזבז את המכסה." },
    { id: "notebooklm-top-1", trackId: "ai", courseId: "course-notebooklm", categoryId: "tools", order: 6, title: "Top 1% — Deep Research + שבירת הסילואים בין Notebooks", icon: "🔬", description: "השלמת פערים במחקר עם Deep Research וחיבור כל המחברות שלכם בתוך אפליקציית Gemini." },
    { id: "notebooklm-pipeline", trackId: "ai", courseId: "course-notebooklm", categoryId: "tools", order: 7, title: "ה-Pipeline המלא — ממחקר לתוצר בלי לאבד את הדרך", icon: "🚀", description: "איך לחבר את כל הכלים לזרימת עבודה אחת שהופכת ימי מחקר לשעות בודדות של עבודה מזוקקת." },

    // ── course-vibe-coding (6 lessons) ──
    { id: "vibe-coding-what-why", trackId: "ai", courseId: "course-vibe-coding", categoryId: "tools", order: 1, title: "מה זה Vibe Coding ולמה עכשיו זה אפשרי", icon: "⚡", description: "להבין את המהפכה שמאפשרת לבנות אפליקציות שלמות בלי לדעת לקודד, ומה ההבדל הקריטי שמונע ממתחילים להצליח." },
    { id: "vibe-coding-tools-map", trackId: "ai", courseId: "course-vibe-coding", categoryId: "tools", order: 2, title: "הכלים — מי עושה מה ולמי בדיוק", icon: "🗺️", description: "ניווט בין עשרות הכלים הקיימים ובחירת הכלי האופטימלי לפרויקט שלך על סמך רמת המיומנות והצורך." },
    { id: "vibe-coding-first-prompt", trackId: "ai", courseId: "course-vibe-coding", categoryId: "tools", order: 3, title: "הפרומפט הראשון — איך לתאר מה אתה רוצה לבנות", icon: "✍️", description: "שיטות עבודה לכתיבת הנחיות ל-AI שיפיקו אפליקציה מדויקת במקום תוצאות אקראיות ושבורות." },
    { id: "vibe-coding-when-it-breaks", trackId: "ai", courseId: "course-vibe-coding", categoryId: "tools", order: 4, title: "כשזה נשבר — איך לתקן בלי להתחיל מחדש", icon: "🔧", description: "איך להתמודד עם שגיאות קוד, לצאת משיח מעגלי עם ה-AI ולהשתמש ב-GitHub כדי להבטיח שלעולם לא תאבדו התקדמות." },
    { id: "vibe-coding-deploy", trackId: "ai", courseId: "course-vibe-coding", categoryId: "tools", order: 5, title: "Deploy — תוציא את זה לעולם", icon: "🚀", description: "תהליך הפיכת התיקייה ב-Lovable או ב-Bolt לכתובת URL חיה שניתן לשלוח למשתמשים ולקוחות." },
    { id: "vibe-coding-whats-next", trackId: "ai", courseId: "course-vibe-coding", categoryId: "tools", order: 6, title: "מה הלאה — מתי לשדרג, מתי להביא מפתח", icon: "🎓", description: "ניהול אסטרטגי של המוצר שלך: מסלול ההתקדמות ממתחילים לכלי פיתוח מתקדמים וזיהוי הרגע הנכון להפוך את האב-טיפוס למוצר אמיתי." },

    // ── learning-with-ai (8 lessons) ──
    { id: "learning-ai-01", courseId: "learning-with-ai", categoryId: "real-life", order: 1, title: "איך המוח שלך באמת לומד — ולמה AI משנה הכל", icon: "🧠", description: "הסיבה שאתה קורא פעמיים ועדיין לא זוכר, והדרך שה-AI פותר אותה." },
    { id: "learning-ai-02", courseId: "learning-with-ai", categoryId: "real-life", order: 2, title: "למה Gemini הוא חבר הלימודים הכי טוב שיש לך", icon: "💎", description: "ההבדל בין לחפש מידע להבין אותו — ולמה Gemini נמצא בצד הנכון." },
    { id: "learning-ai-03", courseId: "learning-with-ai", categoryId: "real-life", order: 3, title: "הטכניקה שפיינמן השתמש בה — ועכשיו יש לך AI לעשות אותה", icon: "🔬", description: "ארבעה צעדים שמוכיחים אם באמת הבנת, ולמה AI הוא השותף המושלם לזה." },
    { id: "learning-ai-04", courseId: "learning-with-ai", categoryId: "real-life", order: 4, title: "NotebookLM הופך כל מסמך לקורס פרטי שלך", icon: "📓", description: "תעלה מאמר, תוציא פודקאסט, כרטיסיות ומבחן — מותאם אישית, בלי מאמץ." },
    { id: "learning-ai-05", courseId: "learning-with-ai", categoryId: "real-life", order: 5, title: "איך לבחון את עצמך כמו שאף מורה לא יעשה לך", icon: "🎯", description: "מבחן שמוצא בדיוק מה חסר לך — ומסביר לך למה." },
    { id: "learning-ai-06", courseId: "learning-with-ai", categoryId: "real-life", order: 6, title: "הדרך לקרוא מאמר מדעי קשה בלי להישבר", icon: "📚", description: "שלוש שאלות לפני שאתה קורא שורה אחת — וכל השאר נופל למקום." },
    { id: "learning-ai-07", courseId: "learning-with-ai", categoryId: "real-life", order: 7, title: "מה אם יכולת לשוחח עם פיינמן, סוקרטס, או באפט?", icon: "🎭", description: "לבקש מ-AI לחשוב בסגנון של מישהו ספציפי — ולמה זה שינוי עצום בלמידה." },
    { id: "learning-ai-08", courseId: "learning-with-ai", categoryId: "real-life", order: 8, title: "איך הופכים שיחה עם AI לידע שנשאר לתמיד", icon: "💡", description: "מה לעשות עם מה שלמדת כדי שהמוח שלך ישמור את זה." },

    // ── course-image-gen (7 lessons) ──
    { id: "image-gen-tools-map", trackId: "ai", courseId: "course-image-gen", categoryId: "tools", order: 1, title: "הכלים — מי מצטיין במה ולמה זה משנה", icon: "🗺️", description: "ההבדלים הקריטיים בין Midjourney, Flux, Nano Banana ו-Firefly בשנת 2026." },
    { id: "image-gen-prompt-language", trackId: "ai", courseId: "course-image-gen", categoryId: "tools", order: 2, title: "הפרומפט לתמונה — שפה אחרת לגמרי", icon: "✍️", description: "איך לכתוב ב-5 אלמנטים כדי להפסיק לקבל תוצאות גנריות." },
    { id: "image-gen-visual-vocabulary", trackId: "ai", courseId: "course-image-gen", categoryId: "tools", order: 3, title: "סגנון, תאורה, קומפוזיציה — המילים שעובדות", icon: "🎨", description: "אוצר המילים של צלמים ואמנים שמעלה את התמונות שלכם ליגה." },
    { id: "image-gen-nano-banana-2", trackId: "ai", courseId: "course-image-gen", categoryId: "tools", order: 4, title: "Nano Banana 2 — הכלי החינמי שמחובר לעולם האמיתי", icon: "🍌", description: "המחולל היחיד שמחפש ברשת כדי לדייק לוגואים ואירועים אקטואליים." },
    { id: "image-gen-consistency", trackId: "ai", courseId: "course-image-gen", categoryId: "tools", order: 5, title: "עקביות — אותו אופי, תמונות שונות", icon: "🔄", description: "איך שומרים על אותה דמות או סגנון לאורך זמן מבלי שזה ישתנה." },
    { id: "image-gen-real-use-cases", trackId: "ai", courseId: "course-image-gen", categoryId: "tools", order: 6, title: "שימושים אמיתיים — פוסטים, לוגו, UI, מוצרים", icon: "💼", description: "איך מתאימים את הכלי למשימה כדי לקבל תוצאה סופית לשימוש." },
    { id: "image-gen-personal-stack", trackId: "ai", courseId: "course-image-gen", categoryId: "tools", order: 7, title: "ה-Stack האישי שלך + מה מותר לעשות עם התמונות", icon: "⚖️", description: "איך לבנות את ארגז הכלים שלך ולהבין את נושא זכויות היוצרים ב-AI." },
];

/**
 * Dynamically load full lesson data for a specific course.
 * Use this in lesson pages instead of importing the full LESSONS array.
 */
export async function loadCourseLessons(courseId: string) {
    switch (courseId) {
        case "how-llms-work":
            return (await import("./lessons/how-llms-work")).HOW_LLMS_WORK_LESSONS;
        case "prompting-mastery":
            return (await import("./lessons/prompting-mastery")).PROMPTING_MASTERY_LESSONS;
        case "choosing-models":
            return (await import("./lessons/choosing-models")).CHOOSING_MODELS_LESSONS;
        case "course-chatgpt":
            return (await import("./lessons/course-chatgpt")).COURSE_CHATGPT_LESSONS;
        case "course-claude":
            return (await import("./lessons/course-claude")).COURSE_CLAUDE_LESSONS;
        case "course-gemini":
            return (await import("./lessons/course-gemini")).COURSE_GEMINI_LESSONS;
        case "course-notebooklm":
            return (await import("./lessons/course-notebooklm")).COURSE_NOTEBOOKLM_LESSONS;
        case "course-vibe-coding":
            return (await import("./lessons/course-vibe-coding")).COURSE_VIBE_CODING_LESSONS;
        case "course-image-gen":
            return (await import("./lessons/course-image-gen")).COURSE_IMAGE_GEN_LESSONS;
        case "learning-with-ai":
            return (await import("./lessons/course-learning-with-ai")).COURSE_LEARNING_WITH_AI_LESSONS;
        default:
            return [];
    }
}

/**
 * Dynamically load a single full lesson by ID.
 * First finds the courseId from the index, then loads only that course's data.
 */
export async function loadLessonById(lessonId: string) {
    const meta = LESSON_INDEX.find(l => l.id === lessonId);
    if (!meta) return null;
    const courseLessons = await loadCourseLessons(meta.courseId);
    return courseLessons.find(l => l.id === lessonId) ?? null;
}

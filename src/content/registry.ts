import { Lesson, LessonMeta } from "./types";

/**
 * LIGHTWEIGHT INDEX:
 * Only metadata is loaded here. No heavy content fields (readContent, questions, etc.).
 * This keeps the initial page load fast.
 */
export const LESSON_INDEX: LessonMeta[] = [
    // ── how-llms-work (7 lessons) ──
    { id: "ai-p0-01", trackIds: ["student"], courseId: "how-llms-work", categoryId: "foundation", order: 1, title: "ChatGPT לא מחפש — הוא ממציא", icon: "🧠", description: "הוא לא גוגל. הוא לא מסד נתונים. אז מה הוא בעצם עושה?" },
    { id: "llm-tokens", trackIds: ["student"], courseId: "how-llms-work", categoryId: "foundation", order: 2, title: "איך המודל קורא טקסט", icon: "🔤", description: "הוא לא קורא מילים — הוא קורא פיסות. זה משנה הכל." },
    { id: "llm-probability", trackIds: ["student"], courseId: "how-llms-work", categoryId: "foundation", order: 3, title: "המודל מנחש — כל פעם מחדש", icon: "🎲", description: "כל מילה שהמודל כותב היא הימור. הבנה זו תשנה איך אתה קורא תשובות." },
    { id: "llm-context-window", trackIds: ["student"], courseId: "how-llms-work", categoryId: "foundation", order: 4, title: "כמה המודל יכול לזכור בבת אחת?", icon: "📏", description: "ל-AI יש זיכרון עבודה מוגבל. אם תעמיס עליו יותר מדי, הוא פשוט יתחיל לשכוח." },
    { id: "llm-training", trackIds: ["student"], courseId: "how-llms-work", categoryId: "foundation", order: 5, title: "מאיפה המודל יודע מה שהוא יודע", icon: "📚", description: "הוא לא למד בבית ספר. הוא קרא את כל האינטרנט — וזה משפיע על כל תשובה שלו." },
    { id: "llm-limits", trackIds: ["student"], courseId: "how-llms-work", categoryId: "foundation", order: 6, title: "מה המודל לא יכול לעשות", icon: "🚫", description: "הוא נראה כמו קסם, אבל יש דברים שהוא תמיד יכשל בהם. דע אותם כדי לא ליפול." },
    { id: "ai-p0-06", trackIds: ["student"], courseId: "how-llms-work", categoryId: "foundation", order: 7, title: "כשה-AI משקר לך בפנים", icon: "🎭", description: "זה היה נשמע מלוטש, רהוט ובטוח לחלוטין. הבעיה שהוא המציא את הסיפור מאפס." },

    // ── prompting-mastery (10 lessons) ──
    { id: "prompting-why-prompts-fail", trackIds: ["writer"], courseId: "prompting-mastery", categoryId: "foundation", order: 1, title: "למה רוב הפרומפטים נכשלים", icon: "🤔", description: "ה-AI לא טיפש. פשוט חסר לו הקשר.", reward: { type: "badge", value: "prompt-master", label: "תג מאסטר" } },
    { id: "prompting-give-it-a-role", trackIds: ["writer"], courseId: "prompting-mastery", categoryId: "foundation", order: 2, title: "תן לו תפקיד (Role)", icon: "👨🏫", description: "משפט הפתיחה משנה לחלוטין את העומק והסגנון של הפלט." },
    { id: "prompting-context-is-everything", trackIds: ["writer"], courseId: "prompting-mastery", categoryId: "foundation", order: 3, title: "תן לו הקשר ורקע עמוק", icon: "📝", description: "המודל יודע רק מה שסיפרת לו כרגע. ספר לו את התמונה המלאה." },
    { id: "prompting-say-what-you-dont-want", trackIds: ["writer"], courseId: "prompting-mastery", categoryId: "foundation", order: 4, title: "ציין במפורש מה אתה לא רוצה שיהיה", icon: "🚫", description: "לפעמים ה-לא שאתה אומר לו משמעותי פי כמה מהדברים שביקשת." },
    { id: "prompting-chain-of-thought", trackIds: ["writer"], courseId: "prompting-mastery", categoryId: "foundation", order: 5, title: "גרור אותו לחשוב בצעדים", icon: "🧠", description: "משפט אחד קטן יכול לשלש את יכולת ההיגיון שלו על משימה מורכבת במכה." },
    { id: "prompting-few-shot", trackIds: ["writer"], courseId: "prompting-mastery", categoryId: "foundation", order: 6, title: "תעשה כמוני — דוגמאות (Few-Shot)", icon: "📋", description: "אל תסביר לו איך אתה רוצה את זה. פשוט תראה לו 3 דוגמאות." },
    { id: "prompting-format-control", trackIds: ["writer"], courseId: "prompting-mastery", categoryId: "foundation", order: 7, title: "שלוט במה שיוצא — פורמט הפלט", icon: "📐", description: "אתה יכול להכתיב בדיוק איך התשובה תיראה — טבלה, רשימה או קוד. זה חוסך זמן ומייצר סדר." },
    { id: "prompting-system-prompt-mindset", trackIds: ["writer"], courseId: "prompting-mastery", categoryId: "foundation", order: 8, title: "ההוראות שהוא תמיד זוכר", icon: "⚙️", description: "השתמש ב-System Prompt כדי להגדיר חוקי ברזל קבועים לכל השיחות שלך." },
    { id: "prompting-chaining-tasks", trackIds: ["writer"], courseId: "prompting-mastery", categoryId: "foundation", order: 9, title: "שרשר משימות — תן לו לבנות על עצמו", icon: "🔗", description: "פרק משימות מורכבות לסדרה של צעדים קטנים וממוקדים כדי להבטיח איכות מקסימלית." },
    { id: "prompting-meta-prompt", trackIds: ["writer"], courseId: "prompting-mastery", categoryId: "foundation", order: 10, title: "תבקש ממנו לשפר את הפרומפט שלך", icon: "🪄", description: "אל תתאמץ לכתוב את הפרומפט המושלם. תן ל-AI לעזור לך לנסח אותו טוב יותר." },

    // ── choosing-models (8 lessons) ──
    { id: "choosing-what-are-llms-really", trackIds: ["analyst"], courseId: "choosing-models", categoryId: "foundation", order: 1, title: "כולם LLMs — אז מה ההבדל בעצם?", icon: "🧬", description: "למה שלושה כלים שמבוססים על אותה טכנולוגיה מתנהגים אחרת לגמרי?" },
    { id: "choosing-chatgpt-profile", trackIds: ["analyst"], courseId: "choosing-models", categoryId: "foundation", order: 2, title: "ChatGPT — הכלי שכולם מכירים", icon: "💬", description: "האולר השוויצרי של עולם ה-AI. הוא טוב להכל, אבל יש לו גם חולשות." },
    { id: "choosing-claude-profile", trackIds: ["analyst"], courseId: "choosing-models", categoryId: "foundation", order: 3, title: "Claude — הכלי שחושב לפני שמדבר", icon: "🎯", description: "הוא לא תמיד הראשון שעולה בגוגל. אבל הוא לרוב הכי מדויק." },
    { id: "choosing-gemini-profile", trackIds: ["analyst"], courseId: "choosing-models", categoryId: "foundation", order: 4, title: "Gemini — הכלי שמחובר לעולם", icon: "🌐", description: "הוא לא הכי חכם בחדר — אבל הוא היחיד שיודע מה קורה עכשיו." },
    { id: "choosing-by-task", trackIds: ["analyst"], courseId: "choosing-models", categoryId: "foundation", order: 5, title: "תתאים כלי למשימה — לא משימה לכלי", icon: "🎯", description: "אם יש לך רק פטיש, כל בעיה נראית כמו מסמר. בוא נלמד להחליף כלים." },
    { id: "choosing-strengths-weaknesses", trackIds: ["analyst"], courseId: "choosing-models", categoryId: "foundation", order: 6, title: "כל כלי מצטיין במשהו — וגרוע במשהו", icon: "⚖️", description: "בוא נלמד לזהות מתי ה-AI מתחיל 'לזייף' ואיך לתקן את זה בזמן." },
    { id: "choosing-free-vs-paid", trackIds: ["analyst"], courseId: "choosing-models", categoryId: "foundation", order: 7, title: "חינמי מול בתשלום — מתי שווה לשלם?", icon: "💳", description: "האם ה-20$ האלו הם הוצאה או השקעה? בוא נעשה חשבון." },
    { id: "choosing-build-your-stack", trackIds: ["builder"], courseId: "choosing-models", categoryId: "foundation", order: 8, title: "בנה את ה-Stack האישי שלך", icon: "🏗️", description: "השיעור האחרון: איך להרכיב לעצמך נבחרת מנצחת של כלי AI." },

    // ── course-chatgpt (10 lessons) ──
    { id: "chatgpt-platform-2026", trackIds: ["student"], courseId: "course-chatgpt", categoryId: "models", order: 1, title: "ChatGPT של 2026 — זה כבר לא רק צ'אט", icon: "🚀", description: "900 מיליון משתמשים עושים בו שימוש יומיומי, אבל רובם עדיין תקועים ב-2023. הגיע הזמן להתקדם." },
    { id: "chatgpt-memory-instructions", trackIds: ["writer"], courseId: "course-chatgpt", categoryId: "models", order: 2, title: "Memory — הוא זוכר מי אתה (אם תלמד אותו)", icon: "🧠", description: "פיצ'רים כמו זיכרון והוראות מותאמות ימנעו ממך לחזור על אותם פרטים שוב ושוב בכל שיחה חדשה." },
    { id: "chatgpt-projects", trackIds: ["builder"], courseId: "course-chatgpt", categoryId: "models", order: 3, title: "Projects — שיחות מאורגנות, context שנשמר", icon: "📁", description: "קובץ קבוע, מטרה ברורה, ושמירת הקשר לכל שיחה חדשה. הכלי שהופך סשן מחקר בוסרי ליחידת עבודה מוגמרת." },
    { id: "chatgpt-deep-research", trackIds: ["analyst"], courseId: "course-chatgpt", categoryId: "models", order: 4, title: "Deep Research — מחקר של שעות בדקות", icon: "🔬", description: "הסוכן שיודע לחקור, להצליב, לקרוא ולחזור אליך אחרי 15 דקות עם דוח מלא, שמשנה את צורת העבודה והלימוד. (דרישה: מנוי Plus)" },
    { id: "chatgpt-canvas", trackIds: ["writer"], courseId: "course-chatgpt", categoryId: "models", order: 5, title: "Canvas — לכתוב ולקודד ביחד עם ChatGPT", icon: "🖊️", description: "ממשק עבודה צידי ומפוצל המאפשר עריכת מסמכים שלמים וקוד ללא איבוד רצף ההקשר ומבלי לעשות פעולות 'Copy-Paste' סיזיפיות." },
    { id: "chatgpt-custom-gpts", trackIds: ["builder"], courseId: "course-chatgpt", categoryId: "models", order: 6, title: "Custom GPTs — אלפי כלים מוכנים, חינם", icon: "🧩", description: "חנות מלאה בכלים שמישהו אחר טרח כדי להגדיר. עוזר תכנות, עורך דין ויורשה לכתיבה - נמצאים במרחק הקלקה." },
    { id: "chatgpt-voice-mode", trackIds: ["student"], courseId: "course-chatgpt", categoryId: "models", order: 7, title: "Voice Mode — ChatGPT שמקשיב ועונה בקול", icon: "🎙️", description: "לדבר למודל בזמן אמת בלי לעבוד עם ההקלדה המתישה. מצב סופר נוח לנסיעות, סיעורי מוחות, ותרגול פרונטלי." },
    { id: "chatgpt-connectors", trackIds: ["builder"], courseId: "course-chatgpt", categoryId: "models", order: 8, title: "Connectors — ChatGPT מחובר לכלים שלך", icon: "🔌", description: "בלי להעתיק מסמכים ארוכים הלוך ושוב: לחבר ישירות את המודל ל-Google Drive, Slack וסביבות החברה המשותפות שלך." },
    { id: "chatgpt-agent-mode", trackIds: ["builder"], courseId: "course-chatgpt", categoryId: "models", order: 9, title: "Agent Mode — ChatGPT שעושה, לא רק מדבר", icon: "🤖", description: "מוד ה-Agent מאפשר למודל לשוטט באתרים עבורך, ללחוץ, להכניס נתונים באופן עצמאי לקבלת משימה ברורה מהחיים." },
    { id: "chatgpt-plans-pricing", trackIds: ["analyst"], courseId: "course-chatgpt", categoryId: "models", order: 10, title: "Free, Go, Plus, Pro — מה שווה לשלם", icon: "💳", description: "פריסת מנויים כנה וללא יומרה: מי צריך דחיפת Plus מלאה, מתי מספיקה Go צנועה, ולמי עדכון החינם הופך להיות כפתור מעצבן." },

    // ── course-claude (10 lessons) ──
    { id: "claude-honest-by-design", trackIds: ["analyst"], courseId: "course-claude", categoryId: "models", order: 1, title: "Claude לא מנסה לרצות אותך — וזו בדיוק הנקודה", icon: "🎯", description: "Claude בנוי להיות ישר, לא נעים — וזה הופך אותו לשימושי יותר כשמשהו חשוב." },
    { id: "claude-long-context", trackIds: ["analyst"], courseId: "course-claude", categoryId: "models", order: 2, title: "תן לו 500 עמוד — הוא לא יאבד את הדרך", icon: "📄", description: "חלון הקשר של 200K טוקנים הופך ניתוח מסמכים ארוכים למשהו שאפשר לעשות בפועל." },
    { id: "claude-writing-voice", trackIds: ["writer"], courseId: "course-claude", categoryId: "models", order: 3, title: "הכתיבה שנשמעת כמוך — לא כמו AI", icon: "✍️", description: "Claude מייצר את הכתיבה הכי אנושית מבין המודלים — ועם ההגדרה הנכונה, היא תישמע כמוך." },
    { id: "claude-projects", trackIds: ["builder"], courseId: "course-claude", categoryId: "models", order: 4, title: "Projects — תפסיק להסביר את עצמך מחדש בכל שיחה", icon: "📁", description: "Projects הם סביבת עבודה קבועה עם זיכרון, קבצים, והוראות — עכשיו בחינם לכולם." },
    { id: "claude-artifacts", trackIds: ["builder"], courseId: "course-claude", categoryId: "models", order: 5, title: "Artifacts — הפלט שאפשר לשלוח, לשתף ולהמשיך לבנות", icon: "🔧", description: "Artifact הוא תוצר עצמאי — מסמך, כלי, אפליקציה אינטראקטיבית — לא עוד תשובה בצ'אט." },
    { id: "claude-thinking-partner", trackIds: ["analyst"], courseId: "course-claude", categoryId: "models", order: 6, title: "להחליט דברים קשים — Claude כחבר שחושב איתך", icon: "🧠", description: "שימוש ב-Claude לחשיבה ולקבלת החלטות — לא רק למשימות — הוא השימוש עם הערך הגבוה ביותר." },
    { id: "claude-extended-thinking", trackIds: ["analyst"], courseId: "course-claude", categoryId: "models", order: 7, title: "Extended Thinking — תגיד לו לחשוב לפני שהוא עונה", icon: "⚙️", description: "Extended Thinking הוא מצב שבו Claude חושב בקול לפני שהוא עונה — ומשפר דיוק ב-30-35% על משימות מורכבות." },
    { id: "claude-google-workspace", trackIds: ["builder"], courseId: "course-claude", categoryId: "models", order: 8, title: "Google Workspace — Claude בתוך ה-Docs וה-Gmail שלך", icon: "📧", description: "מנויי Pro מקבלים אינטגרציה ישירה עם Google Docs, Gmail ו-Drive — Claude קורא ועורך קבצים אמיתיים שלך." },
    { id: "claude-cowork", trackIds: ["builder"], courseId: "course-claude", categoryId: "models", order: 9, title: "Cowork — תן לו משימה ותחזור כשסיים", icon: "🤖", description: "Cowork (Pro+) הוא Claude שעובד אוטונומית על קבצים ומשימות במחשב שלך — בלי פיקוח צמוד." },
    { id: "claude-plans-pricing", trackIds: ["analyst"], courseId: "course-claude", categoryId: "models", order: 10, title: "Free, Pro, Max — ההחלטה הכנה", icon: "💳", description: "פירוט ישיר של תוכניות Claude — בלי upsell, עם המלצה ברורה לפי שימוש." },

    // ── course-gemini (10 lessons) ──
    { id: "gemini-ecosystem-intro", trackIds: ["student"], courseId: "course-gemini", categoryId: "models", order: 1, title: "Gemini לא רק אפליקציה — הוא בכל מקום שאתה כבר נמצא", icon: "🌐", description: "רוב האנשים פותחים את האתר של גוגל ומתכתבים עם צ'אט. הם מפספסים 90% מהערך." },
    { id: "gemini-gmail", trackIds: ["writer"], courseId: "course-gemini", categoryId: "models", order: 2, title: "Gemini ב-Gmail — תפסיק לבזבז שעתיים על האימייל", icon: "📧", description: "העובד הממוצע מבזבז שעות על ניהול דואר. Gemini תוקף את זה מארבעה כיוונים." },
    { id: "gemini-search", trackIds: ["analyst"], courseId: "course-gemini", categoryId: "models", order: 3, title: "Gemini ב-Google Search — חיפוש שמבין מה אתה באמת שואל", icon: "🔍", description: "גוגל הוא כבר לא רק רשימת קישורים. ה-AI נותן תשובות מלאות עם מקורות." },
    { id: "gemini-workspace-docs-sheets", trackIds: ["writer"], courseId: "course-gemini", categoryId: "models", order: 4, title: "Gemini ב-Docs, Sheets, Slides — מסמכים שכותבים את עצמם", icon: "📝", description: "ה-AI מוטמע כפאנל צדדי בכל כלי העבודה. הוא מכיר את הקבצים שלכם ב-Drive." },
    { id: "gemini-deep-research", trackIds: ["analyst"], courseId: "course-gemini", categoryId: "models", order: 5, title: "Deep Research — מחקר של יום עבודה בפחות מ-20 דקות", icon: "🔬", description: "סוכן אוטונומי שגולש במאות אתרים עבורכם. דורש AI Pro." },
    { id: "gemini-agent", trackIds: ["builder"], courseId: "course-gemini", categoryId: "models", order: 6, title: "Gemini Agent — תן לו משימה שדורשת כמה כלים", icon: "🤖", description: "השלב הבא של ה-AI: משימות מרובות שלבים אוטונומיות לגמרי. דורש AI Ultra." },
    { id: "gemini-drive", trackIds: ["analyst"], courseId: "course-gemini", categoryId: "models", order: 7, title: "Gemini ב-Drive — הקבצים שלך הופכים לידע שאפשר לשאול", icon: "💾", description: "ה-Drive שלכם הוא כבר לא רק מחסן קבצים. הוא בסיס ידע אינטראקטיבי." },
    { id: "gemini-gems", trackIds: ["builder"], courseId: "course-gemini", categoryId: "models", order: 8, title: "Gems — תבנה AI מומחה לכל משימה חוזרת שלך", icon: "💎", description: "צרו גירסאות מותאמות אישית של Gemini עם הוראות קבועות וקבצים מצורפים." },
    { id: "gemini-ecosystem-connected", trackIds: ["builder"], courseId: "course-gemini", categoryId: "models", order: 9, title: "הכל מחובר — ככה ה-Ecosystem של Gemini עובד ביחד", icon: "🔗", description: "העוצמה האמיתית היא האינטגרציה. איך כל הכלים שדיברנו עליהם מתקשרים אחד עם השני." },
    { id: "gemini-plans-pricing", trackIds: ["analyst"], courseId: "course-gemini", categoryId: "models", order: 10, title: "Free / AI Pro / AI Ultra — ההחלטה הכנה", icon: "💳", description: "השוואה אובייקטיבית של המסלולים. מה באמת מקבלים בעד הכסף?" },

    // ── course-notebooklm (7 lessons) ──
    { id: "notebooklm-what-it-is", trackIds: ["analyst"], courseId: "course-notebooklm", categoryId: "tools", order: 1, title: "NotebookLM — ה-AI שלא ממציא דברים", icon: "📚", description: "כל ה-AI האחרים עונים ממה שהם יודעים מהאינטרנט. NotebookLM עונה רק ממה שאתה מעלה אליו." },
    { id: "notebooklm-how-it-works", trackIds: ["student"], courseId: "course-notebooklm", categoryId: "tools", order: 2, title: "Sources, Chat, Studio — הארכיטקטורה שמסבירה הכל", icon: "🏗️", description: "שלושה פאנלים שיוצרים סביבת עבודה מלאה. מהמקורות ועד לתוצר הסופי." },
    { id: "notebooklm-top-30", trackIds: ["analyst"], courseId: "course-notebooklm", categoryId: "tools", order: 3, title: "Top 30% — תעלה נכון, תשאל נכון, תשמע את הפודקאסט", icon: "🎧", description: "סיכום הוא רק ההתחלה. איך לחלץ תובנות אמיתיות ולהשתמש ב-Interactive Mode ב-Audio Overview." },
    { id: "notebooklm-top-10", trackIds: ["writer"], courseId: "course-notebooklm", categoryId: "tools", order: 4, title: "Top 10% — Configure Chat + Studio כמו מקצוען", icon: "⚙️", description: "הפיכת ה-AI לעוזר מחקר אישי עם הוראות קבע ושימוש בכלים הויזואליים של ה-Studio." },
    { id: "notebooklm-slides", trackIds: ["visual"], courseId: "course-notebooklm", categoryId: "tools", order: 5, title: "Slides — המצגת שכותבת את עצמה מהמקורות שלך", icon: "🎨", description: "יצירת מצגות ויזואליות ומקצועיות ישירות מהמקורות. איך לעשות את זה נכון מבלי לבזבז את המכסה." },
    { id: "notebooklm-top-1", trackIds: ["analyst"], courseId: "course-notebooklm", categoryId: "tools", order: 6, title: "Top 1% — Deep Research + שבירת הסילואים בין Notebooks", icon: "🔬", description: "השלמת פערים במחקר עם Deep Research וחיבור כל המחברות שלכם בתוך אפליקציית Gemini." },
    { id: "notebooklm-pipeline", trackIds: ["builder"], courseId: "course-notebooklm", categoryId: "tools", order: 7, title: "ה-Pipeline המלא — ממחקר לתוצר בלי לאבד את הדרך", icon: "🚀", description: "איך לחבר את כל הכלים לזרימת עבודה אחת שהופכת ימי מחקר לשעות בודדות של עבודה מזוקקת." },

    // ── course-vibe-coding (6 lessons) ──
    { id: "vibe-coding-what-why", trackIds: ["builder"], courseId: "course-vibe-coding", categoryId: "tools", order: 1, title: "מה זה Vibe Coding ולמה עכשיו זה אפשרי", icon: "⚡", description: "להבין את המהפכה שמאפשרת לבנות אפליקציות שלמות בלי לדעת לקודד, ומה ההבדל הקריטי שמונע ממתחילים להצליח." },
    { id: "vibe-coding-tools-map", trackIds: ["builder"], courseId: "course-vibe-coding", categoryId: "tools", order: 2, title: "הכלים — מי עושה מה ולמי בדיוק", icon: "🗺️", description: "ניווט בין עשרות הכלים הקיימים ובחירת הכלי האופטימלי לפרויקט שלך על סמך רמת המיומנות והצורך." },
    { id: "vibe-coding-first-prompt", trackIds: ["builder"], courseId: "course-vibe-coding", categoryId: "tools", order: 3, title: "הפרומפט הראשון — איך לתאר מה אתה רוצה לבנות", icon: "✍️", description: "שיטות עבודה לכתיבת הנחיות ל-AI שיפיקו אפליקציה מדויקת במקום תוצאות אקראיות ושבורות." },
    { id: "vibe-coding-when-it-breaks", trackIds: ["builder"], courseId: "course-vibe-coding", categoryId: "tools", order: 4, title: "כשזה נשבר — איך לתקן בלי להתחיל מחדש", icon: "🔧", description: "איך להתמודד עם שגיאות קוד, לצאת משיח מעגלי עם ה-AI ולהשתמש ב-GitHub כדי להבטיח שלעולם לא תאבדו התקדמות." },
    { id: "vibe-coding-deploy", trackIds: ["builder"], courseId: "course-vibe-coding", categoryId: "tools", order: 5, title: "Deploy — תוציא את זה לעולם", icon: "🚀", description: "תהליך הפיכת התיקייה ב-Lovable או ב-Bolt לכתובת URL חיה שניתן לשלוח למשתמשים ולקוחות." },
    { id: "vibe-coding-whats-next", trackIds: ["builder"], courseId: "course-vibe-coding", categoryId: "tools", order: 6, title: "מה הלאה — מתי לשדרג, מתי להביא מפתח", icon: "🎓", description: "ניהול אסטרטגי של המוצר שלך: מסלול ההתקדמות ממתחילים לכלי פיתוח מתקדמים וזיהוי הרגע הנכון להפוך את האב-טיפוס למוצר אמיתי." },

    // ── learning-with-ai (8 lessons) ──
    { id: "learning-ai-01", trackIds: ["student"], courseId: "learning-with-ai", categoryId: "real-life", order: 1, title: "איך המוח שלך באמת לומד — ולמה AI משנה הכל", icon: "🧠", description: "הסיבה שאתה קורא פעמיים ועדיין לא זוכר, והדרך שה-AI פותר אותה." },
    { id: "learning-ai-02", trackIds: ["student"], courseId: "learning-with-ai", categoryId: "real-life", order: 2, title: "למה Gemini הוא חבר הלימודים הכי טוב שיש לך", icon: "💎", description: "ההבדל בין לחפש מידע להבין אותו — ולמה Gemini נמצא בצד הנכון." },
    { id: "learning-ai-03", trackIds: ["student"], courseId: "learning-with-ai", categoryId: "real-life", order: 3, title: "הטכניקה שפיינמן השתמש בה — ועכשיו יש לך AI לעשות אותה", icon: "🔬", description: "ארבעה צעדים שמוכיחים אם באמת הבנת, ולמה AI הוא השותף המושלם לזה." },
    { id: "learning-ai-04", trackIds: ["student"], courseId: "learning-with-ai", categoryId: "real-life", order: 4, title: "NotebookLM הופך כל מסמך לקורס פרטי שלך", icon: "📓", description: "תעלה מאמר, תוציא פודקאסט, כרטיסיות ומבחן — מותאם אישית, בלי מאמץ." },
    { id: "learning-ai-05", trackIds: ["student"], courseId: "learning-with-ai", categoryId: "real-life", order: 5, title: "איך לבחון את עצמך כמו שאף מורה לא יעשה לך", icon: "🎯", description: "מבחן שמוצא בדיוק מה חסר לך — ומסביר לך למה." },
    { id: "learning-ai-06", trackIds: ["student"], courseId: "learning-with-ai", categoryId: "real-life", order: 6, title: "הדרך לקרוא מאמר מדעי קשה בלי להישבר", icon: "📚", description: "שלוש שאלות לפני שאתה קורא שורה אחת — וכל השאר נופל למקום." },
    { id: "learning-ai-07", trackIds: ["student"], courseId: "learning-with-ai", categoryId: "real-life", order: 7, title: "מה אם יכולת לשוחח עם פיינמן, סוקרטס, או באפט?", icon: "🎭", description: "לבקש מ-AI לחשוב בסגנון של מישהו ספציפי — ולמה זה שינוי עצום בלמידה." },
    { id: "learning-ai-08", trackIds: ["student"], courseId: "learning-with-ai", categoryId: "real-life", order: 8, title: "איך הופכים שיחה עם AI לידע שנשאר לתמיד", icon: "💡", description: "מה לעשות עם מה שלמדת כדי שהמוח שלך ישמור את זה." },

    // ── course-image-gen (7 lessons) ──
    { id: "image-gen-tools-map", trackIds: ["visual"], courseId: "course-image-gen", categoryId: "tools", order: 1, title: "הכלים — מי מצטיין במה ולמה זה משנה", icon: "🗺️", description: "ההבדלים הקריטיים בין Midjourney, Flux, Nano Banana ו-Firefly בשנת 2026." },
    { id: "image-gen-prompt-language", trackIds: ["visual"], courseId: "course-image-gen", categoryId: "tools", order: 2, title: "הפרומפט לתמונה — שפה אחרת לגמרי", icon: "✍️", description: "איך לכתוב ב-5 אלמנטים כדי להפסיק לקבל תוצאות גנריות." },
    { id: "image-gen-visual-vocabulary", trackIds: ["visual"], courseId: "course-image-gen", categoryId: "tools", order: 3, title: "סגנון, תאורה, קומפוזיציה — המילים שעובדות", icon: "🎨", description: "אוצר המילים של צלמים ואמנים שמעלה את התמונות שלכם ליגה." },
    { id: "image-gen-nano-banana-2", trackIds: ["visual"], courseId: "course-image-gen", categoryId: "tools", order: 4, title: "Nano Banana 2 — הכלי החינמי שמחובר לעולם האמיתי", icon: "🍌", description: "המחולל היחיד שמחפש ברשת כדי לדייק לוגואים ואירועים אקטואליים." },
    { id: "image-gen-consistency", trackIds: ["visual"], courseId: "course-image-gen", categoryId: "tools", order: 5, title: "עקביות — אותו אופי, תמונות שונות", icon: "🔄", description: "איך שומרים על אותה דמות או סגנון לאורך זמן מבלי שזה ישתנה." },
    { id: "image-gen-real-use-cases", trackIds: ["visual"], courseId: "course-image-gen", categoryId: "tools", order: 6, title: "שימושים אמיתיים — פוסטים, לוגו, UI, מוצרים", icon: "💼", description: "איך מתאימים את הכלי למשימה כדי לקבל תוצאה סופית לשימוש." },
    { id: "image-gen-personal-stack", trackIds: ["visual"], courseId: "course-image-gen", categoryId: "tools", order: 7, title: "ה-Stack האישי שלך + מה מותר לעשות עם התמונות", icon: "⚖️", description: "איך לבנות את ארגז הכלים שלך ולהבין את נושא זכויות היוצרים ב-AI." },

    // ── course-gems-gpts-mastery (8 lessons) ──
    { id: "gems-gpts-01", trackIds: ["builder"], courseId: "course-gems-gpts-mastery", categoryId: "tools", order: 1, title: "הצ'אט הרגיל שלך שוכח הכל. יש פתרון", icon: "🔄", description: "כל שיחה מתחילה מאפס — אלא אם כן אתה משתמש ב-Gem או GPT." },
    { id: "gems-gpts-02", trackIds: ["builder"], courseId: "course-gems-gpts-mastery", categoryId: "tools", order: 2, title: "מישהו כבר בנה את מה שאתה צריך", icon: "🏪", description: "לפני שאתה בונה — תבדוק אם זה כבר קיים. הסטור מלא בפתרונות מוכנים." },
    { id: "gems-gpts-03", trackIds: ["builder"], courseId: "course-gems-gpts-mastery", categoryId: "tools", order: 3, title: "אתה יכול להגיד לו מי להיות", icon: "🎭", description: "מאחורי כל Gem ו-GPT יש הוראות שמגדירות את האישיות שלו. ועכשיו אתה הולך לראות אותן." },
    { id: "gems-gpts-04", trackIds: ["builder"], courseId: "course-gems-gpts-mastery", categoryId: "tools", order: 4, title: "בוט שבנית בעצמך ב-10 דקות", icon: "🔨", description: "אתה לא צריך לדעת לתכנת. רק לדעת מה אתה רוצה — ואיך לכתוב את זה בבהירות." },
    { id: "gems-gpts-05", trackIds: ["builder"], courseId: "course-gems-gpts-mastery", categoryId: "tools", order: 5, title: "למה הבוט שלך מתנהג כמו ילד קטן — ואיך לתקן את זה", icon: "🔬", description: "בנית בוט, הוא לא עושה מה שרצית. זה לא כישלון — זה שלב חובה בתהליך." },
    { id: "gems-gpts-06", trackIds: ["builder"], courseId: "course-gems-gpts-mastery", categoryId: "tools", order: 6, title: "תן לו זיכרון, מסמכים, וכלים", icon: "📎", description: "בוט בסיסי יודע מה כתבת לו. בוט מתקדם יודע גם מה העלית לו — וניגש לאינטרנט בזמן אמת." },
    { id: "gems-gpts-07", trackIds: ["builder"], courseId: "course-gems-gpts-mastery", categoryId: "tools", order: 7, title: "Gems או GPTs — תבחר נכון", icon: "⚖️", description: "לא מדובר באיזה מודל חכם יותר. מדובר באיזה מערכת כלים מתאימה לחיים שלך." },
    { id: "gems-gpts-08", trackIds: ["builder"], courseId: "course-gems-gpts-mastery", categoryId: "tools", order: 8, title: "הבוט שחוסך לך שעה בשבוע", icon: "⏱️", description: "לא כל משימה שווה בוט. הנה איך לזהות את זו שכן." },

    // ── agent-mastery (9 lessons) ──
    { id: "agent-mastery-1", trackIds: ["builder"], courseId: "agent-mastery", categoryId: "advanced", order: 1, title: "Agent, Subagent, Skill — המילון", icon: "🤖", description: "שלושה מושגים שישנו איך אתה עובד עם AI" },
    { id: "agent-mastery-2", trackIds: ["builder"], courseId: "agent-mastery", categoryId: "advanced", order: 2, title: "למה הפרומפטים שלך לא עובדים על סוכנים", icon: "🔄", description: "Mental model shift: אתה לא מפרומפט, אתה מתכנן עובד" },
    { id: "agent-mastery-3", trackIds: ["builder"], courseId: "agent-mastery", categoryId: "advanced", order: 3, title: "ההבדל בין פרומפט שאדם מבין לפרומפט שסוכן מבין", icon: "✍️", description: "איך לכתוב הוראות שסוכן באמת יכול לפעול לפיהן" },
    { id: "agent-mastery-4", trackIds: ["builder"], courseId: "agent-mastery", categoryId: "advanced", order: 4, title: "איך לגרום לסוכנים לעבוד אחד בשביל השני", icon: "🏗️", description: "Orchestrator ו-subagents — כשמשימה גדולה מדי לסוכן אחד" },
    { id: "agent-mastery-5", trackIds: ["builder"], courseId: "agent-mastery", categoryId: "advanced", order: 5, title: "מה סוכן יכול לגעת בו — וזה הרבה יותר ממה שחשבת", icon: "🔧", description: "כלים — העיניים והידיים של הסוכן" },
    { id: "agent-mastery-6", trackIds: ["builder"], courseId: "agent-mastery", categoryId: "advanced", order: 6, title: "קובץ אחד שהופך סוכן בינוני לסוכן מדהים", icon: "📄", description: "Skills כתשתית — למה SKILL.md שווה יותר מפרומפט ארוך" },
    { id: "agent-mastery-7", trackIds: ["builder"], courseId: "agent-mastery", categoryId: "advanced", order: 7, title: "למה סוכנים משתגעים — ואיך לזהות את זה לפני שזה קורה", icon: "⚠️", description: "שלושת כשלי ה-agent הנפוצים — וסימני האזהרה המוקדמים" },
    { id: "agent-mastery-8", trackIds: ["builder"], courseId: "agent-mastery", categoryId: "advanced", order: 8, title: "כמה שליטה לוותר — ומתי לעצור הכל", icon: "🎛️", description: "Checkpoints, human-in-the-loop, ואיפה לשים את קו הוודאות" },
    { id: "agent-mastery-9", trackIds: ["builder"], courseId: "agent-mastery", categoryId: "advanced", order: 9, title: "מפרומפט ראשון לפיצ׳ר ששוחרר: תזרים עבודה שלם עם סוכן", icon: "🚀", description: "איך מחברים את כל מה שלמדנו לתהליך עבודה אמיתי" },

    // ── grok-mastery (8 lessons) ──
    { id: "grok-mastery-1", trackIds: ["analyst"], courseId: "grok-mastery", categoryId: "models", order: 1, title: "ה-AI שלא מפחד לקלל אותך", icon: "🌶️", description: "למה Grok אומר לך את האמת הלא-נוחה בלי להתנצל – וזה דווקא יתרון ענק" },
    { id: "grok-mastery-2", trackIds: ["student"], courseId: "grok-mastery", categoryId: "models", order: 2, title: "לחקור את סודות היקום עם ה-AI?", icon: "🌌", description: "למה Grok לא סתם עוד צ'אטבוט – והמשימה הגדולה שמאחוריו" },
    { id: "grok-mastery-3", trackIds: ["analyst"], courseId: "grok-mastery", categoryId: "models", order: 3, title: "לדעת מה קורה עכשיו - לפני כולם?", icon: "📡", description: "היתרון הכי גדול של Grok: מידע בזמן אמת ששום AI אחר לא יכול להשיג" },
    { id: "grok-mastery-4", trackIds: ["visual"], courseId: "grok-mastery", categoryId: "models", order: 4, title: "סרטון הוליוודי ב-10 שניות?", icon: "🎬", description: "Grok Imagine – טקסט לתמונה + טקסט לסרטון 10 שניות עם סאונד" },
    { id: "grok-mastery-5", trackIds: ["student"], courseId: "grok-mastery", categoryId: "models", order: 5, title: "לדבר עם ה-AI בלי להקליד מילה?", icon: "🎙️", description: "Voice Mode של Grok – שיחה טבעית, מהירה, עם כלים בזמן אמת" },
    { id: "grok-mastery-6", trackIds: ["analyst"], courseId: "grok-mastery", categoryId: "models", order: 6, title: "אפס טעויות? הסוד של Think Mode", icon: "🧠", description: "Think Mode, DeepSearch, low hallucination ו-strict prompt adherence" },
    { id: "grok-mastery-7", trackIds: ["builder"], courseId: "grok-mastery", categoryId: "models", order: 7, title: "לבנות עוזר אישי שחוסך שעות?", icon: "💼", description: "Workflows, פרומפטינג, checkpoints וטיפים מתקדמים" },
    { id: "grok-mastery-8", trackIds: ["analyst"], courseId: "grok-mastery", categoryId: "models", order: 8, title: "גרוק באמת מנצח את ChatGPT וקלוד?", icon: "⚔️", description: "השוואה ישירה + מתי Grok מנצח" },

    // ── course-perplexity (8 lessons) ──
    { id: "perplexity-mastery-1", trackIds: ["analyst"], courseId: "course-perplexity", categoryId: "models", order: 1, title: "Perplexity תמיד מראה לך מאיפה הוא לקח את התשובה", icon: "🔍", description: "ההבדל הגדול בין Perplexity לכל שאר ה-AI" },
    { id: "perplexity-mastery-2", trackIds: ["analyst"], courseId: "course-perplexity", categoryId: "models", order: 2, title: "למה Perplexity מחליף את Google Search", icon: "🌐", description: "המעבר מגוגל ל-Perplexity – ומה משתנה" },
    { id: "perplexity-mastery-3", trackIds: ["analyst"], courseId: "course-perplexity", categoryId: "models", order: 3, title: "Deep Research – מחקר עמוק שעושה את כל העבודה בשבילך", icon: "🔬", description: "Pro Search ו-Deep Research – הכלי הכי חזק של Perplexity" },
    { id: "perplexity-mastery-4", trackIds: ["analyst"], courseId: "course-perplexity", categoryId: "models", order: 4, title: "Model Council – מה קורה כשמריצים 3 מודלים בו זמנית?", icon: "🏛️", description: "הפיצ'ר שמשלב כמה AI כדי לתת תשובה מדויקת יותר" },
    { id: "perplexity-mastery-5", trackIds: ["builder"], courseId: "course-perplexity", categoryId: "models", order: 5, title: "Perplexity Computer – העוזר שמבצע פרויקטים שלמים לבד", icon: "💻", description: "ה-agent החזק ביותר של Perplexity" },
    { id: "perplexity-mastery-6", trackIds: ["builder"], courseId: "course-perplexity", categoryId: "models", order: 6, title: "Comet – הדפדפן שחושב ומבצע משימות בשבילך", icon: "☄️", description: "הדפדפן החכם של Perplexity" },
    { id: "perplexity-mastery-7", trackIds: ["student"], courseId: "course-perplexity", categoryId: "models", order: 7, title: "איך להפוך את Perplexity לעוזר יומיומי חזק", icon: "🛠️", description: "טיפים ו-workflows מתקדמים" },
    { id: "perplexity-mastery-8", trackIds: ["analyst"], courseId: "course-perplexity", categoryId: "models", order: 8, title: "מתי כדאי להשתמש ב-Perplexity", icon: "⚖️", description: "השוואה והחלטה מתי הוא הכלי הנכון" },
];

/**
 * Maps courseId to its dynamic import.
 * When you add a new course file in src/content/lessons/, simply add it here.
 */
const COURSE_LOADERS: Record<string, () => Promise<Lesson[]>> = {
    "how-llms-work": () => import("./lessons/how-llms-work").then(m => Object.values(m)[0] as Lesson[]),
    "prompting-mastery": () => import("./lessons/prompting-mastery").then(m => Object.values(m)[0] as Lesson[]),
    "choosing-models": () => import("./lessons/choosing-models").then(m => Object.values(m)[0] as Lesson[]),
    "course-chatgpt": () => import("./lessons/course-chatgpt").then(m => Object.values(m)[0] as Lesson[]),
    "course-claude": () => import("./lessons/course-claude").then(m => Object.values(m)[0] as Lesson[]),
    "course-gemini": () => import("./lessons/course-gemini").then(m => Object.values(m)[0] as Lesson[]),
    "course-notebooklm": () => import("./lessons/course-notebooklm").then(m => Object.values(m)[0] as Lesson[]),
    "course-vibe-coding": () => import("./lessons/course-vibe-coding").then(m => Object.values(m)[0] as Lesson[]),
    "course-image-gen": () => import("./lessons/course-image-gen").then(m => Object.values(m)[0] as Lesson[]),
    "course-gems-gpts-mastery": () => import("./lessons/gems-gpts-lessons").then(m => Object.values(m)[0] as Lesson[]),
    "learning-with-ai": () => import("./lessons/course-learning-with-ai").then(m => Object.values(m)[0] as Lesson[]),
    "agent-mastery": () => import("./lessons/agent-mastery-lessons").then(m => Object.values(m)[0] as Lesson[]),
    "grok-mastery": () => import("./lessons/course-grok").then(m => Object.values(m)[0] as Lesson[]),
    "course-perplexity": () => import("./lessons/course-perplexity").then(m => Object.values(m)[0] as Lesson[]),
};

export async function loadCourseLessons(courseId: string): Promise<Lesson[]> {
    const loader = COURSE_LOADERS[courseId];
    return loader ? await loader() : [];
}

export async function loadLessonById(lessonId: string): Promise<Lesson | null> {
    const meta = LESSON_INDEX.find(l => l.id === lessonId);
    if (!meta) return null;
    const courseLessons = await loadCourseLessons(meta.courseId);
    return courseLessons.find(l => l.id === lessonId) ?? null;
}

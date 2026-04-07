import { defineCourse } from "../types";

export const PERPLEXITY_MASTERY_LESSONS = defineCourse([
  {
    id: "perplexity-mastery-1",
    courseId: "perplexity-mastery",
    categoryId: "advanced",
    order: 1,
    icon: "📑",
    title: "Perplexity תמיד מראה לך מאיפה הוא לקח את התשובה",
    description: "ההבדל הגדול בין Perplexity לכל שאר ה-AI",
    hook: "אתה שואל שאלה.\nChatGPT נותן תשובה.\nPerplexity נותן תשובה + את כל המקורות.\nוזה משנה הכל.",
    tldr: "Perplexity הוא ה-AI היחיד שתמיד מציין בדיוק מאיפה הוא לקח כל פיסת מידע. אין המצאות, אין 'סומך על הידע שלי' – רק עובדות עם קישורים.",
    scienceA: "רוב מודלי ה-AI (כולל ChatGPT, Claude ו-Grok) יכולים 'להמציא' תשובות כי הם משתמשים בידע ש'נלמד' באימון. Perplexity עובד אחרת – הוא משלב חיפוש בזמן אמת עם מודל AI, ואז מציג לך את המקורות המדויקים של כל משפט.",
    scienceB: "זה אומר שאתה יכול לבדוק כל דבר בעצמך. Perplexity לא מבקש שתסמוך עליו – הוא נותן לך את ההוכחות.",
    pullQuote: "אני לא סומך על עצמי. אני סומך על המקורות.",
    insight: "כש-AI מראה לך את המקורות – אתה לא סתם מקבל תשובה. אתה מקבל אמון.",
    readContent: "רוב האנשים עדיין משתמשים ב-AI כמו במנוע חיפוש ישן: שואלים, מקבלים תשובה, ומקווים שהיא נכונה.\n\nPerplexity עובד אחרת.\n\nהוא מחפש בזמן אמת, קורא עשרות מקורות, מסכם אותם – ואז מציג לך בדיוק איפה כל פרט בא מה. כל משפט בתשובה שלו מקושר למקור.\n\nזה הופך אותו לכלי מחקר אמיתי, לא סתם צ'אטבוט חכם.",
    practicalCall: {
      task: "שאל את Perplexity שאלה כלשהי (למשל על חדשות, מחקר או נושא מקצועי). שים לב איך כל תשובה מגיעה עם מקורות clickable.",
      goal: "להרגיש את ההבדל בין 'תשובה' לבין 'תשובה עם הוכחות'.",
      tool: "Perplexity.ai"
    },
    questions: [
      {
        id: "perplexity-1-q1",
        question: "מה ההבדל העיקרי בין Perplexity ל-ChatGPT בתשובות?",
        options: [
          "Perplexity מהיר יותר",
          "Perplexity תמיד מציג מקורות מדויקים",
          "Perplexity משתמש במודלים חלשים יותר",
          "Perplexity לא עונה בעברית"
        ],
        correctIndex: 1,
        explanation: "Perplexity בנוי סביב חיפוש + מקורות. זה מה שהופך אותו לאמין יותר."
      },
      {
        id: "perplexity-1-q2",
        question: "למה חשוב ש-AI יציג מקורות?",
        options: [
          "כדי שהתשובה תהיה ארוכה יותר",
          "כדי שתוכל לבדוק את המידע בעצמך",
          "זה רק עיצוב",
          "זה מאט את התשובה"
        ],
        correctIndex: 1,
        explanation: "מקורות = אמון. אתה לא צריך להאמין ל-AI – אתה יכול לבדוק."
      },
      {
        id: "perplexity-1-q3",
        question: "מתי Perplexity הכי שימושי?",
        options: [
          "רק לבדיחות",
          "במחקר, עבודה, לימודים – בכל מקום שצריך אמינות",
          "רק לשאלות פשוטות",
          "רק כשאתה משלם"
        ],
        correctIndex: 1,
        explanation: "בכל פעם שאתה צריך תשובה שאפשר לסמוך עליה – Perplexity הוא הבחירה הטבעית."
      }
    ]
  },
  {
    id: "perplexity-mastery-2",
    courseId: "perplexity-mastery",
    categoryId: "advanced",
    order: 2,
    icon: "🔍",
    title: "למה Perplexity מחליף את Google Search",
    description: "המעבר מגוגל ל-Perplexity – ומה משתנה",
    hook: "אתה מחפש משהו.\nGoogle נותן לך 10 קישורים.\nPerplexity נותן לך תשובה מלאה + מקורות.",
    tldr: "Perplexity לא סתם 'חיפוש'. הוא חיפוש + סיכום + מקורות + שיחה. רוב האנשים שמנסים אותו – מפסיקים להשתמש ב-Google.",
    scienceA: "Google Search בנוי על דירוג קישורים. Perplexity בנוי על חיפוש בזמן אמת + AI שמסכם ומצטט. התוצאה: תשובה ישירה במקום רשימת קישורים.",
    scienceB: "Perplexity גם זוכר את ההקשר שלך, מאפשר שאלות המשך, ומשלב מידע ממקורות רבים – משהו ש-Google לא עושה בצורה כזאת.",
    pullQuote: "Google מראה לך איפה המידע. Perplexity נותן לך את המידע.",
    insight: "מי שפעם חיפש ב-Google – עובר ל-Perplexity ופשוט לא חוזר.",
    readContent: "השינוי הכי גדול שקורה עכשיו הוא שאנשים מפסיקים 'לחפש' ומתחילים 'לשאול'.\n\nPerplexity הופך את החיפוש לשיחה חכמה: אתה שואל שאלה מורכבת, הוא נותן תשובה מלאה, ואתה יכול להמשיך לשאול שאלות המשך בלי לאבד הקשר.",
    practicalCall: {
      task: "קח שאלה שאתה בדרך כלל מחפש ב-Google והשתמש ב-Perplexity במקום. שים לב כמה זמן חסכת.",
      goal: "להרגיש את ההבדל בין חיפוש ישן לחיפוש חדש.",
      tool: "Perplexity.ai"
    },
    questions: [
      {
        id: "perplexity-2-q1",
        question: "מה Perplexity נותן ש-Google לא נותן?",
        options: [
          "קישורים בלבד",
          "תשובה מסוכמת + מקורות + שיחה המשך",
          "פרסומות",
          "תמונות בלבד"
        ],
        correctIndex: 1,
        explanation: "Perplexity הופך חיפוש לשיחה חכמה עם תשובות מוכנות."
      },
      {
        id: "perplexity-2-q2",
        question: "למה אנשים עוברים מ-Google ל-Perplexity?",
        options: [
          "כי הוא יפה יותר",
          "כי הוא חוסך זמן ונותן תשובות ישירות",
          "כי הוא זול יותר",
          "כי הוא לא עובד בעברית"
        ],
        correctIndex: 1,
        explanation: "החיסכון בזמן והדיוק הם הסיבה העיקרית."
      },
      {
        id: "perplexity-2-q3",
        question: "מתי Perplexity עדיף על Google Search?",
        options: [
          "רק לשאלות פשוטות",
          "לשאלות מורכבות, מחקר, סיכומים והשוואות",
          "רק לחדשות",
          "רק כשאתה ממהר"
        ],
        correctIndex: 1,
        explanation: "ככל שהשאלה יותר מורכבת – Perplexity מנצח בגדול."
      }
    ]
  },
  {
    id: "perplexity-mastery-3",
    courseId: "perplexity-mastery",
    categoryId: "advanced",
    order: 3,
    icon: "📚",
    title: "Deep Research – מחקר עמוק שעושה את כל העבודה בשבילך",
    description: "Pro Search ו-Deep Research – הכלי הכי חזק של Perplexity",
    hook: "אתה צריך מחקר שלם.\nבמקום לעבור 20 אתרים – Perplexity עושה את זה בשבילך.",
    tldr: "Deep Research (לשעבר Pro Search) יוצר דוחות מלאים, ארוכים ומעמיקים – עם מקורות, ניתוח והשוואות.",
    scienceA: "Deep Research מפעיל חיפוש רב-שלבי, קורא עשרות מקורות, מסכם, משווה ומארגן את המידע לדוח מסודר.",
    scienceB: "זה לא סתם 'סיכום'. זה מחקר אמיתי – כמו שעוזר מחקר אנושי היה עושה, רק הרבה יותר מהר.",
    pullQuote: "תגיד לי מה אתה צריך לדעת – ואני אעשה את כל המחקר.",
    insight: "Deep Research הופך Perplexity ממנוע חיפוש לכלי עבודה אמיתי.",
    readContent: "Deep Research הוא אחד הפיצ'רים החזקים ביותר של Perplexity. אתה נותן נושא, והוא יוצר דוח מקיף עם מבנה, ניתוח, טבלאות והמון מקורות.",
    practicalCall: {
      task: "הפעל Deep Research על נושא שאתה צריך לחקור (עבודה, לימודים או תחביב). שים לב לאיכות הדוח.",
      goal: "להבין כמה זמן Deep Research חוסך לך.",
      tool: "Perplexity Pro / Max"
    },
    questions: [
      {
        id: "perplexity-3-q1",
        question: "מה Deep Research עושה בשבילך?",
        options: [
          "נותן תשובה קצרה",
          "עושה מחקר מלא עם דוח מסודר ומקורות",
          "רק מחפש תמונות",
          "רק עונה בעברית"
        ],
        correctIndex: 1,
        explanation: "הוא מבצע את כל עבודת המחקר במקומך."
      },
      {
        id: "perplexity-3-q2",
        question: "למי Deep Research הכי שימושי?",
        options: [
          "למי שרק שואל שאלות פשוטות",
          "לסטודנטים, אנשי מקצוע ועסקים שצריכים מחקר מעמיק",
          "לילדים",
          "למי שרוצה בדיחות"
        ],
        correctIndex: 1,
        explanation: "כל מי שצריך מידע מעמיק ומסודר."
      }
    ]
  },
  {
    id: "perplexity-mastery-4",
    courseId: "perplexity-mastery",
    categoryId: "advanced",
    order: 4,
    icon: "🤝",
    title: "Model Council – מה קורה כשמריצים 3 מודלים בו זמנית?",
    description: "הפיצ'ר שמשלב כמה AI כדי לתת תשובה מדויקת יותר",
    hook: "במקום לבחור מודל אחד – Perplexity מריץ שלושה ביחד.",
    tldr: "Model Council מפעיל 3 מודלים חזקים במקביל, משווה ביניהם ומסכם את התשובה הטובה ביותר.",
    scienceA: "Model Council (פברואר 2026) לוקח שאלה אחת, שולח אותה ל-3 מודלים (למשל Claude Opus, GPT-5, Gemini), ואז מודל סינתזה משלב את התוצאות.",
    scienceB: "התוצאה היא תשובה עם פחות הטיות, יותר דיוק, והשוואה ברורה בין המודלים.",
    pullQuote: "שלושה ראשים טובים יותר מראש אחד.",
    insight: "זה אחד הפיצ'רים הכי חכמים שקיימים היום ב-AI.",
    readContent: "במקום להסתמך על מודל אחד – Perplexity נותן לך את היתרונות של כולם.",
    practicalCall: {
      task: "הפעל Model Council על שאלה חשובה או מורכבת. שים לב להבדלים בין המודלים.",
      goal: "לראות איך מודלים שונים חושבים.",
      tool: "Perplexity (Model Council)"
    },
    questions: [
      {
        id: "perplexity-4-q1",
        question: "מה Model Council עושה?",
        options: [
          "מריץ מודל אחד",
          "מריץ 3 מודלים בו זמנית ומשלב תשובה",
          "רק מחפש תמונות",
          "משנה את השפה"
        ],
        correctIndex: 1,
        explanation: "הוא משלב כוח של כמה מודלים."
      }
    ]
  },
  {
    id: "perplexity-mastery-5",
    courseId: "perplexity-mastery",
    categoryId: "advanced",
    order: 5,
    icon: "💻",
    title: "Perplexity Computer – העוזר שמבצע פרויקטים שלמים לבד",
    description: "ה-agent החזק ביותר של Perplexity",
    hook: "אתה נותן מטרה.\nPerplexity Computer מפרק, בונה sub-agents, ומוציא תוצאה מוכנה.",
    tldr: "Perplexity Computer הוא agentic system שמשתמש ב-19 מודלים, יוצר sub-agents ומבצע משימות מורכבות באופן אוטונומי.",
    scienceA: "הושק בפברואר 2026 – הוא לוקח פרויקט שלם (בניית אתר, דוח, ניתוח נתונים) ומבצע אותו end-to-end.",
    scienceB: "הוא יודע ליצור sub-agents, להשתמש בכלים, ולרוץ שעות עד שהמשימה גמורה.",
    pullQuote: "תגיד לי מה אתה רוצה – ואני אעשה את זה.",
    insight: "זה כבר לא AI ש'עונה'. זה AI ש'עושה'.",
    readContent: "Perplexity Computer הוא השלב הבא – הוא לא רק חושב, הוא מבצע.",
    practicalCall: {
      task: "תן ל-Perplexity Computer משימה מורכבת (למשל: 'בנה לי דוח על...') ותראה איך הוא עובד.",
      goal: "להבין את הכוח של agentic AI.",
      tool: "Perplexity Computer"
    },
    questions: [
      {
        id: "perplexity-5-q1",
        question: "מה Perplexity Computer יכול לעשות?",
        options: [
          "רק לענות על שאלות",
          "לבצע פרויקטים שלמים באופן אוטונומי",
          "רק ליצור תמונות",
          "רק לחפש"
        ],
        correctIndex: 1,
        explanation: "הוא agent שמבצע עבודה אמיתית."
      }
    ]
  },
  {
    id: "perplexity-mastery-6",
    courseId: "perplexity-mastery",
    categoryId: "advanced",
    order: 6,
    icon: "🌐",
    title: "Comet – הדפדפן שחושב ומבצע משימות בשבילך",
    description: "הדפדפן החכם של Perplexity",
    hook: "דפדפן רגיל מראה לך את האינטרנט.\nComet חושב איתך ומבצע דברים בשבילך.",
    tldr: "Comet הוא דפדפן AI שמשלב חיפוש, סיוע קולי ואוטומציה – הוא יכול לחקור, לסכם, לארגן אימיילים ועוד.",
    scienceA: "Comet הוא דפדפן אמיתי (זמין ב-Mac, Windows, iOS, Android) עם AI מובנה שמבין מה אתה רוצה ופועל.",
    scienceB: "אתה יכול לבקש ממנו 'סכם לי את הדף הזה', 'השווה מחירים', 'ארגן לי את האימיילים' – והוא עושה.",
    pullQuote: "הדפדפן של העתיד – שחושב בשבילך.",
    insight: "Comet הופך גלישה פשוטה לעבודה חכמה.",
    readContent: "Comet הוא לא סתם דפדפן. הוא עוזר אישי שיושב בתוך הדפדפן.",
    practicalCall: {
      task: "הורד את Comet ונסה לבקש ממנו משימה פשוטה (למשל סיכום דף או חיפוש).",
      goal: "להרגיש דפדפן שחושב איתך.",
      tool: "Comet Browser"
    },
    questions: [
      {
        id: "perplexity-6-q1",
        question: "מה Comet יכול לעשות?",
        options: [
          "רק לגלוש",
          "לחקור, לסכם, לארגן ולהפעיל משימות",
          "רק להציג תמונות",
          "רק להאזין למוזיקה"
        ],
        correctIndex: 1,
        explanation: "הוא דפדפן + עוזר AI."
      }
    ]
  },
  {
    id: "perplexity-mastery-7",
    courseId: "perplexity-mastery",
    categoryId: "advanced",
    order: 7,
    icon: "⚡",
    title: "איך להפוך את Perplexity לעוזר יומיומי חזק",
    description: "טיפים ו-workflows מתקדמים",
    hook: "Perplexity יכול להיות הרבה יותר מסתם חיפוש.",
    tldr: "עם Deep Research, Model Council, Computer ו-Comet – אתה יכול לבנות workflow יומיומי חזק.",
    scienceA: "השילוב בין כל הפיצ'רים הופך את Perplexity לעוזר אישי אמיתי.",
    scienceB: "טיפים: השתמש ב-Collections, שמור שיחות, השתמש ב-Collections לפרויקטים, והפעל Computer למשימות גדולות.",
    pullQuote: "Perplexity הוא לא כלי. הוא שותף.",
    insight: "מי שיודע להשתמש בו נכון – חוסך שעות בכל יום.",
    readContent: "הנה איך להפוך את Perplexity לעוזר הכי חזק שלך.",
    practicalCall: {
      task: "בנה workflow אחד קבוע (למשל: סיכום חדשות יומי, מחקר פרויקט וכו').",
      goal: "לצאת עם שימוש יומיומי חכם.",
      tool: "Perplexity"
    },
    questions: [
      {
        id: "perplexity-7-q1",
        question: "מה הדבר הכי חשוב כדי להפיק את המקסימום מ-Perplexity?",
        options: [
          "להשתמש רק בשאלות פשוטות",
          "לשלב את כל הפיצ'רים (Deep Research, Computer, Comet)",
          "להשתמש רק במודל אחד",
          "לא לשמור שיחות"
        ],
        correctIndex: 1,
        explanation: "השילוב בין הכלים הוא מה שהופך אותו לעוזר חזק."
      }
    ]
  },
  {
    id: "perplexity-mastery-8",
    courseId: "perplexity-mastery",
    categoryId: "advanced",
    order: 8,
    icon: "⚖️",
    title: "מתי כדאי להשתמש ב-Perplexity",
    description: "השוואה והחלטה מתי הוא הכלי הנכון",
    hook: "כל AI טוב במשהו. מתי Perplexity הוא הבחירה הכי טובה?",
    tldr: "Perplexity מנצח כשאתה צריך מחקר, דיוק, מקורות, Deep Research או agentic work.",
    scienceA: "Perplexity מצטיין במחקר, citations, Deep Research ו-Computer.",
    scienceB: "השוואה פשוטה: Grok – truth & real-time, Claude – כתיבה, ChatGPT – ecosystem. Perplexity – מחקר ומקורות.",
    pullQuote: "Perplexity הוא הכלי הכי טוב כשאתה צריך לדעת – ולא רק לקבל תשובה.",
    insight: "ה-AI הכי טוב הוא זה שמתאים לצורך שלך.",
    readContent: "Perplexity הוא הבחירה הנכונה בכל פעם שאתה צריך מידע אמין, מחקר מעמיק או agent שמבצע עבודה.",
    practicalCall: {
      task: "קח משימה אחת והרץ אותה גם ב-Perplexity וגם ב-AI אחר. השווה.",
      goal: "להחליט בעצמך מתי Perplexity הוא הכלי שלך.",
      tool: "Perplexity + AI אחר"
    },
    questions: [
      {
        id: "perplexity-8-q1",
        question: "מתי Perplexity הוא הבחירה הכי טובה?",
        options: [
          "כשאתה רוצה בדיחות",
          "כשאתה צריך מחקר, מקורות ודיוק",
          "כשאתה רוצה רק תשובות קצרות",
          "כשאתה לא רוצה מקורות"
        ],
        correctIndex: 1,
        explanation: "Perplexity בנוי סביב דיוק ומקורות."
      },
      {
        id: "perplexity-8-q2",
        question: "מה הצעד הבא אחרי הקורס?",
        options: [
          "לשכוח הכל",
          "להפוך את Perplexity לעוזר הראשי שלך",
          "לעבור רק ל-ChatGPT",
          "להפסיק להשתמש ב-AI"
        ],
        correctIndex: 1,
        explanation: "עכשיו תשתמש בו יום יום."
      }
    ]
  }
]);
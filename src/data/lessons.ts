import { PRODUCTIVITY_LESSONS } from "./productivity-lessons";
import { AI_LESSONS, AI_TRACK_A, AI_TRACK_B, AI_TRACK_C } from "./ai-lessons";

export type Question = {
    id: string;
    text: string;
    options: string[];
    correctIndex: number;
    explanation: string;
};

export type Lesson = {
    id: string;
    trackId: string;
    title: string;
    description: string;
    hook?: string;
    icon?: string;
    readContent: string;
    tldr?: string;
    scienceA?: string;
    scienceB?: string;
    pullQuote?: string;
    insight: string;
    questions: Question[];
};

export type Track = {
    id: string;
    name: string;
    color: string;
    icon: string;
};

export const TRACKS: Track[] = [
    { id: "behavioral-economics", name: "כלכלה התנהגותית", color: "from-blue-600 to-indigo-700", icon: "🧠" },
    { id: "rhetoric", name: "רטוריקה ודיבייט", color: "from-rose-600 to-orange-700", icon: "🗣️" },

    { id: "philosophy", name: "פילוסופיה", color: "from-amber-600 to-amber-800", icon: "🏛️" },
    { id: "ai", name: "בינה מלאכותית פרקטית", color: "from-purple-600 to-indigo-800", icon: "🤖" },
    { id: "productivity", name: "פרודוקטיביות קיצונית", color: "from-blue-500 to-cyan-700", icon: "🚀" },
];

export const LESSONS: Lesson[] = [
    {
        id: "sunk-cost-fallacy",
        trackId: "behavioral-economics",
        title: "כשל העלות השקועה",
        description: "למה אנחנו ממשיכים להשקיע בחלופות גרועות.",
        readContent: "כשל העלות השקועה הוא הנטייה שלנו להמשיך להשקיע במאמץ אם כבר השקענו בו זמן, מאמץ או כסף, ללא קשר לשאלה האם העלויות הנוכחיות עולות על התועלת. הכרה ב'עלות השקועה' משחררת אותך להקצות את המשאבים שלך להזדמנויות טובות יותר.",
        insight: "ההשקעות שביצעת בעבר לא צריכות להכתיב את ההחלטות העתידיות שלך; חתוך הפסדים כשהערך העתידי שלילי.",
        questions: [
            {
                id: "q1",
                text: "What defines a 'sunk cost'?",
                options: [
                    "A cost that can be easily recovered.",
                    "An investment that has already been incurred and cannot be recovered.",
                    "A future expense that is inevitable.",
                    "The emotional toll of a bad decision."
                ],
                correctIndex: 1,
                explanation: "Sunk costs are past expenses that cannot be recovered."
            },
            {
                id: "q2",
                text: "You bought a non-refundable $50 ticket to a concert, but you wake up sick. Going will make you feel worse. Assuming you act rationally (ignoring the sunk cost), what should you do?",
                options: [
                    "Go to the concert to get your money's worth.",
                    "Stay home and rest to maximize your current well-being.",
                    "Go for half the concert and then leave.",
                    "Buy another ticket for a friend to feel better."
                ],
                correctIndex: 1,
                explanation: "Staying home maximizes future utility, ignoring the unrecoverable $50."
            },
            {
                id: "q3",
                text: "Why is the sunk cost fallacy so difficult to overcome psychologically?",
                options: [
                    "Because people have perfect foresight.",
                    "Because society doesn't value persistence.",
                    "Because humans have a strong aversion to perceived loss and admitting failure.",
                    "Because future costs are always lower than past costs."
                ],
                correctIndex: 2,
                explanation: "Loss aversion makes us hate accepting that our investment was 'wasted'."
            }
        ]
    },
    {
        id: "anchoring-effect",
        trackId: "behavioral-economics",
        title: "אפקט העיגון",
        description: "איך רושם ראשוני מעוות את שיקול הדעת שלנו.",
        readContent: "עיגון הוא הטיה קוגניטיבית שבה אדם מסתמך יותר מדי על פיסת המידע הראשונית שהוצעה לו (ה'עוגן') בעת קבלת החלטות. למשל, במשא ומתן, המחיר הראשון שזורקים קובע קו בסיס מנטלי שעליו הכל נמדד.",
        insight: "אל תיתן למספר הראשון שאתה שומע להגדיר את הערך של מה שקורה אחר כך.",
        questions: [
            {
                id: "q1",
                text: "What is an 'anchor' in this context?",
                options: ["A heavy weight.", "The first piece of information received.", "A final decision.", "A logical premise."],
                correctIndex: 1,
                explanation: "The anchor is the initial information that sets a baseline."
            }
        ]
    },
    {
        id: "deep-work",
        trackId: "productivity",
        title: "הכוח של עבודת עומק",
        description: "שליטה ביכולת להתרכז ללא הסחות דעת.",
        readContent: "עבודת עומק היא היכולת להתרכז ללא הסחות דעת במשימה תובענית קוגניטיבית. כדי להשיג זאת, עליך לקבוע בלוקים ארוכים של זמן פנוי מהפרעות ולבנות טקסים סביב סביבת העבודה שלך.",
        insight: "עוצמת המיקוד = (איכות העבודה) / (הזמן שהושקע). היפטר מהסחות דעת כדי לשגשג.",
        questions: [
            {
                id: "q1",
                text: "Which of these is most likely to disrupt Deep Work?",
                options: ["White noise.", "A clear goal.", "Checking notifications every 15 minutes.", "A dedicated workspace."],
                correctIndex: 2,
                explanation: "Rapid switching between tasks (context switching) destroys concentration."
            }
        ]
    },
    ...PRODUCTIVITY_LESSONS,
    ...AI_LESSONS,
    ...AI_TRACK_A,
    ...AI_TRACK_B,
    ...AI_TRACK_C
];

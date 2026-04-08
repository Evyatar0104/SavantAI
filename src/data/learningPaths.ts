import { RarityTier } from "@/content/badges";

export interface LearningPath {
  id: string;
  nameHe: string;
  descriptionHe: string;
  icon: string;
  color: string; // primary hex
  targetProfile: string; // matches quiz profileTitle
  courses: string[]; // course ids in order
  xpTotal: number;
  rarity: RarityTier;
}

export const learningPaths: LearningPath[] = [
  {
    id: "writer",
    nameHe: "כותב",
    descriptionHe: "אלוף בתקשורת, כתיבת תוכן חכם, סטוריטלינג ויצירת קול ייחודי",
    icon: "✍️",
    color: "#3B82F6",
    targetProfile: "כותב",
    courses: ["how-llms-work", "prompting-mastery", "course-chatgpt", "course-claude", "ai-writing"],
    xpTotal: 1200,
    rarity: "Epic"
  },
  {
    id: "analyst",
    nameHe: "אנליסט",
    descriptionHe: "מאסטר במחקר, ניתוח נתונים, הפקת תובנות עמוקות וסקר שוק",
    icon: "📊",
    color: "#10B981",
    targetProfile: "אנליסט",
    courses: ["how-llms-work", "prompting-mastery", "course-notebooklm", "ai-market-research", "course-gemini"],
    xpTotal: 1200,
    rarity: "Legendary"
  },
  {
    id: "visual",
    nameHe: "יוצר ויזואלי",
    descriptionHe: "לדבר בשפה הויזואלית של ה-AI, עיצוב, קריאייטיב והפקת תוכן ויזואלי",
    icon: "🎨",
    color: "#EC4899",
    targetProfile: "יוצר ויזואלי",
    courses: ["how-llms-work", "prompting-mastery", "course-image-gen", "ai-creative", "course-chatgpt"],
    xpTotal: 1200,
    rarity: "Epic"
  },
  {
    id: "builder",
    nameHe: "מתכנת",
    descriptionHe: "התמחות בפיתוח רעיונות מסובכים בשפה פשוטה בעזרת סוכני קוד",
    icon: "💻",
    color: "#1E40AF",
    targetProfile: "מתכנת",
    courses: ["how-llms-work", "prompting-mastery", "course-vibe-coding", "course-gems-gpts-mastery", "agent-mastery"],
    xpTotal: 1500,
    rarity: "Legendary"
  },
  {
    id: "student",
    nameHe: "סטודנט",
    descriptionHe: "ללמוד מהר יותר, לחקור עמוק יותר, ולשלוט בכל כלי הלמידה העדכניים",
    icon: "🎓",
    color: "#A855F7",
    targetProfile: "סטודנט",
    courses: ["how-llms-work", "prompting-mastery", "course-gemini", "learning-with-ai", "course-notebooklm"],
    xpTotal: 1200,
    rarity: "Epic"
  }
];

export interface LessonTheme {
  primary: string;
  secondary: string;
  glow: string;
  text: string;
}

export function getLessonTheme(icon: string, courseId?: string): LessonTheme {
  if (courseId === "course-chatgpt") {
    return { primary: '#74AA9C', secondary: '#5C8A7D', glow: 'rgba(116, 170, 156, 0.3)', text: '#FFFFFF' };
  }
  if (courseId === "course-gemini") {
    return { primary: '#4796E3', secondary: '#3679BD', glow: 'rgba(71, 150, 227, 0.3)', text: '#FFFFFF' };
  }
  if (courseId === "course-claude") {
    return { primary: '#C15F3C', secondary: '#A14D2E', glow: 'rgba(193, 95, 60, 0.3)', text: '#FFFFFF' };
  }

  if (!icon) {
    return {
      primary: '#534AB7',
      secondary: '#3D3589',
      glow: 'rgba(83,74,183,0.3)',
      text: '#FFFFFF',
    };
  }

  // Get first character/emoji
  const firstChar = Array.from(icon)[0];

  switch (firstChar) {
    // Brain / thinking / AI
    case '🧠':
      return { primary: '#8B5CF6', secondary: '#6D28D9', glow: 'rgba(139,92,246,0.3)', text: '#FFFFFF' };
    // Rocket / launch
    case '🚀':
      return { primary: '#F97316', secondary: '#EA580C', glow: 'rgba(249,115,22,0.3)', text: '#FFFFFF' };
    // Chat / conversation
    case '💬':
    case '💭':
      return { primary: '#06B6D4', secondary: '#0891B2', glow: 'rgba(6,182,212,0.3)', text: '#FFFFFF' };
    // Target / precision
    case '🎯':
      return { primary: '#EF4444', secondary: '#DC2626', glow: 'rgba(239,68,68,0.3)', text: '#FFFFFF' };
    // Book / learning
    case '📚':
      return { primary: '#10B981', secondary: '#059669', glow: 'rgba(16,185,129,0.3)', text: '#FFFFFF' };
    // Science / research
    case '🔬':
      return { primary: '#3B82F6', secondary: '#2563EB', glow: 'rgba(59,130,246,0.3)', text: '#FFFFFF' };
    // Lightning / power
    case '⚡':
      return { primary: '#EAB308', secondary: '#CA8A04', glow: 'rgba(234,179,8,0.3)', text: '#FFFFFF' };
    // Art / creative / design
    case '🎨':
      return { primary: '#EC4899', secondary: '#DB2777', glow: 'rgba(236,72,153,0.3)', text: '#FFFFFF' };
    // Tool / build / wrench
    case '🔧':
    case '🛠':
    case '🛠️':
      return { primary: '#64748B', secondary: '#475569', glow: 'rgba(100,116,139,0.3)', text: '#FFFFFF' };
    // Globe / web
    case '🌐':
      return { primary: '#14B8A6', secondary: '#0D9488', glow: 'rgba(20,184,166,0.3)', text: '#FFFFFF' };
    // Notebook
    case '📓':
      return { primary: '#F59E0B', secondary: '#D97706', glow: 'rgba(245,158,11,0.3)', text: '#FFFFFF' };
    // Robot / AI
    case '🤖':
      return { primary: '#8B5CF6', secondary: '#7C3AED', glow: 'rgba(139,92,246,0.3)', text: '#FFFFFF' };
    // Money / payment
    case '💳':
      return { primary: '#22C55E', secondary: '#16A34A', glow: 'rgba(34,197,94,0.3)', text: '#FFFFFF' };
    // Map / navigation
    case '🗺':
    case '🗺️':
      return { primary: '#F97316', secondary: '#EA580C', glow: 'rgba(249,115,22,0.3)', text: '#FFFFFF' };
    // Banana
    case '🍌':
      return { primary: '#EAB308', secondary: '#CA8A04', glow: 'rgba(234,179,8,0.3)', text: '#FFFFFF' };
    // Thinking / questioning
    case '🤔':
      return { primary: '#A78BFA', secondary: '#7C3AED', glow: 'rgba(167,139,250,0.3)', text: '#FFFFFF' };
    // Teacher / person
    case '👨':
      return { primary: '#3B82F6', secondary: '#2563EB', glow: 'rgba(59,130,246,0.3)', text: '#FFFFFF' };
    // Writing / pen / pencil
    case '✍':
    case '✍️':
    case '🖊':
    case '🖊️':
      return { primary: '#F59E0B', secondary: '#D97706', glow: 'rgba(245,158,11,0.3)', text: '#FFFFFF' };
    // Notes / clipboard / document / memo
    case '📝':
    case '📋':
    case '📄':
      return { primary: '#38BDF8', secondary: '#0284C7', glow: 'rgba(56,189,248,0.3)', text: '#FFFFFF' };
    // No / prohibited
    case '🚫':
      return { primary: '#EF4444', secondary: '#DC2626', glow: 'rgba(239,68,68,0.3)', text: '#FFFFFF' };
    // Ruler / precision
    case '📐':
    case '📏':
      return { primary: '#06B6D4', secondary: '#0891B2', glow: 'rgba(6,182,212,0.3)', text: '#FFFFFF' };
    // Gear / settings
    case '⚙':
    case '⚙️':
      return { primary: '#64748B', secondary: '#475569', glow: 'rgba(100,116,139,0.3)', text: '#FFFFFF' };
    // Magic wand
    case '🪄':
      return { primary: '#A78BFA', secondary: '#7C3AED', glow: 'rgba(167,139,250,0.3)', text: '#FFFFFF' };
    // DNA / genetics / science
    case '🧬':
      return { primary: '#14B8A6', secondary: '#0D9488', glow: 'rgba(20,184,166,0.3)', text: '#FFFFFF' };
    // Chain / link
    case '🔗':
      return { primary: '#6366F1', secondary: '#4F46E5', glow: 'rgba(99,102,241,0.3)', text: '#FFFFFF' };
    // Folder / files
    case '📁':
      return { primary: '#F59E0B', secondary: '#D97706', glow: 'rgba(245,158,11,0.3)', text: '#FFFFFF' };
    // Plug / connector
    case '🔌':
      return { primary: '#22C55E', secondary: '#16A34A', glow: 'rgba(34,197,94,0.3)', text: '#FFFFFF' };
    // Microphone
    case '🎙':
    case '🎙️':
      return { primary: '#EC4899', secondary: '#DB2777', glow: 'rgba(236,72,153,0.3)', text: '#FFFFFF' };
    // Puzzle / jigsaw
    case '🧩':
      return { primary: '#F97316', secondary: '#EA580C', glow: 'rgba(249,115,22,0.3)', text: '#FFFFFF' };
    // Briefcase / business
    case '💼':
      return { primary: '#64748B', secondary: '#475569', glow: 'rgba(100,116,139,0.3)', text: '#FFFFFF' };
    // Graduation / education
    case '🎓':
      return { primary: '#3B82F6', secondary: '#2563EB', glow: 'rgba(59,130,246,0.3)', text: '#FFFFFF' };
    // Building / construction
    case '🏗':
    case '🏗️':
      return { primary: '#F97316', secondary: '#EA580C', glow: 'rgba(249,115,22,0.3)', text: '#FFFFFF' };
    // Email
    case '📧':
      return { primary: '#3B82F6', secondary: '#2563EB', glow: 'rgba(59,130,246,0.3)', text: '#FFFFFF' };
    // Gem / diamond
    case '💎':
      return { primary: '#06B6D4', secondary: '#0891B2', glow: 'rgba(6,182,212,0.3)', text: '#FFFFFF' };
    // Floppy / save
    case '💾':
      return { primary: '#3B82F6', secondary: '#2563EB', glow: 'rgba(59,130,246,0.3)', text: '#FFFFFF' };
    // Cycle / refresh
    case '🔄':
      return { primary: '#22C55E', secondary: '#16A34A', glow: 'rgba(34,197,94,0.3)', text: '#FFFFFF' };
    // Dice / probability
    case '🎲':
      return { primary: '#EC4899', secondary: '#DB2777', glow: 'rgba(236,72,153,0.3)', text: '#FFFFFF' };
    // Mask / theater
    case '🎭':
      return { primary: '#EF4444', secondary: '#DC2626', glow: 'rgba(239,68,68,0.3)', text: '#FFFFFF' };
    // Scale / balance
    case '⚖':
    case '⚖️':
      return { primary: '#F59E0B', secondary: '#D97706', glow: 'rgba(245,158,11,0.3)', text: '#FFFFFF' };
    // Magnifying glass / search
    case '🔍':
      return { primary: '#06B6D4', secondary: '#0891B2', glow: 'rgba(6,182,212,0.3)', text: '#FFFFFF' };
    // Headphones
    case '🎧':
      return { primary: '#8B5CF6', secondary: '#6D28D9', glow: 'rgba(139,92,246,0.3)', text: '#FFFFFF' };
    default:
      return {
        primary: '#534AB7',
        secondary: '#3D3589',
        glow: 'rgba(83,74,183,0.3)',
        text: '#FFFFFF',
      };
  }
}

export const FLOATING_ICONS_MAP: Record<string, string[]> = {
  "how-llms-work": ["🔤", "📊", "🔢", "⚙️", "🧩", "💡", "🔄"],
  "prompting-mastery": ["✍️", "💭", "🎯", "📝", "🔁", "💬", "⚡"],
  "choosing-models": ["⚖️", "🔍", "📋", "🏆", "🔀", "📌", "🎛️"],
  "course-chatgpt": ["💬", "🖼️", "📊", "🔌", "🧠", "⚙️", "🌐"],
  "course-claude": ["📄", "🔍", "📁", "⚙️", "🎯", "💡", "🔗"],
  "course-gemini": ["🌐", "📧", "🔍", "📊", "💎", "🔮", "🛰️"],
  "course-notebooklm": ["📚", "🎙️", "🗂️", "🔬", "💡", "📊", "🎧"],
  "course-vibe-coding": ["⚡", "🚀", "🛠️", "💻", "🔧", "📦", "🌐"],
  "course-image-gen": ["🎨", "🖌️", "✨", "🖼️", "🌈", "📸", "🎭"],
  "agent-mastery": ["🤖", "⚙️", "🔄", "🧠", "📄", "⚡", "🔧"],
  DEFAULT: ["✨", "💡", "🔮", "⚡", "🎯", "🔷", "⭐"],
};

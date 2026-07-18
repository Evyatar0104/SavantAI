export type RewardType = "xp" | "badge" | "unlock";

export interface LessonReward {
    type: RewardType;
    value: number | string;
    label: string;
}

export interface Question {
    id: string;
    text: string;
    options: string[];
    correctIndex: number;
    explanation: string;
}

export interface PracticalCall {
    task: string;
    goal: string;
    tool: string;
}

export interface CourseCta {
    text: string;
    courseId: string;
}

export interface Category {
    id: string;
    name: string;
    nameHe: string;
    description: string;
    color: string;
    icon: string;
    order: number;
    unlockType: "linear" | "open";
}

export interface Course {
    id: string;
    categoryId: string;
    name: string;
    nameHe: string;
    description: string;
    icon: string;
    image?: string;
    order: number;
    isLocked: boolean;
    requiredCourseId?: string;
}

export interface Track {
    id: string;
    name: string;
    color: string;
    icon: string;
}

export type BlockType = 
    | "hook"
    | "content"
    | "tokenizer-sim"
    | "temp-sampler-sim"
    | "bad-good-slider"
    | "prompt-sandbox"
    | "inline-assessment";

export interface BaseBlock {
    id: string;
    type: BlockType;
    title?: string;
}

export interface HookBlock extends BaseBlock {
    type: "hook";
    subtitle: string;
    description: string;
    ctaLabel?: string;
}

export interface ContentBlock extends BaseBlock {
    type: "content";
    body: string;
    tldr?: string;
    highlightTerms?: string[];
    diagramSvg?: string;
}

export interface TokenizerSimBlock extends BaseBlock {
    type: "tokenizer-sim";
    defaultText: string;
    language: "he" | "en";
    explanation: string;
}

export interface TempSamplerSimBlock extends BaseBlock {
    type: "temp-sampler-sim";
    prompt: string;
    options: Array<{ token: string; logit: number }>;
}

export interface BadGoodSliderBlock extends BaseBlock {
    type: "bad-good-slider";
    badPrompt: string;
    goodPrompt: string;
    badOutput: string;
    goodOutput: string;
    explanation: string;
}

export interface PromptSandboxBlock extends BaseBlock {
    type: "prompt-sandbox";
    systemInstructions: string;
    variables: Array<{ name: string; label: string; placeholder: string }>;
    idealPromptStructure: string;
    sampleSuccessResponses: Record<string, string>;
}

export interface InlineAssessmentBlock extends BaseBlock {
    type: "inline-assessment";
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
}

export type LessonBlock =
    | HookBlock
    | ContentBlock
    | TokenizerSimBlock
    | TempSamplerSimBlock
    | BadGoodSliderBlock
    | PromptSandboxBlock
    | InlineAssessmentBlock;

export interface Lesson {
    id: string;
    trackIds?: string[];
    courseId: string;
    categoryId: string;
    order: number;
    title: string;
    description: string;
    hook?: string;
    icon?: string;
    readContent?: string;
    tldr?: string;
    scienceA?: string;
    scienceB?: string;
    pullQuote?: string;
    practicalCall?: PracticalCall;
    insight?: string;
    image?: string;
    courseCta?: CourseCta;
    questions?: Question[];
    reward?: LessonReward;
    diagram?: string;
    blocks?: LessonBlock[];
}

export interface LessonMeta {
    id: string;
    trackIds?: string[];
    courseId: string;
    categoryId: string;
    order: number;
    title: string;
    icon?: string;
    description: string;
    reward?: LessonReward;
}

/**
 * Helper to define a course's lessons with full type checking.
 */
export function defineCourse(lessons: Lesson[]): Lesson[] {
    return lessons;
}

type ModelName = "claude" | "chatgpt" | "gemini";

export interface QuizAnswers {
    useCases: string[];
    outputTypes: string[];
    outputDepth: string;
    workStyle: string;
    budgetLevel: string;
    preferredTools: string[];
}

export interface QuizResult {
    primaryUseCase: string;
    outputTypes: string[];
    outputDepth: string;
    workStyle: string;
    budgetLevel: string;
    specialistTools: string[];
    geminiIsAllRounder: boolean;
    preferredTools: string[];
    experienceLevel: "beginner" | "intermediate";
    primaryModel: ModelName;
    secondaryModel: ModelName;
    primaryModelReason: string;
    recommendedCourseId: string;
    profileTitle: string;
    startingXp: number;
}

const LLM_TOOLS = ["ChatGPT", "Claude", "Gemini", "Grok", "Perplexity"];

export function calculateQuizResult(answers: QuizAnswers): QuizResult {
    const scores: Record<ModelName, number> = { claude: 0, chatgpt: 0, gemini: 0 };
    const trackAffinities: Record<string, number> = { writer: 0, analyst: 0, visual: 0, builder: 0, student: 0 };

    // Q1 — primaryUseCase
    const primaryUseCase = answers.useCases[0] || "work";
    switch (primaryUseCase) {
        case "work":      scores.claude += 2; scores.chatgpt += 1; scores.gemini += 1; trackAffinities.writer += 1; break;
        case "study":     scores.gemini += 3; scores.claude += 1; trackAffinities.student += 2; break;
        case "creative":  scores.chatgpt += 2; scores.gemini += 1; trackAffinities.visual += 2; break;
        case "investing": scores.claude += 2; scores.gemini += 2; trackAffinities.analyst += 2; break;
        case "coding":    scores.claude += 3; scores.chatgpt += 2; trackAffinities.builder += 3; break;
        case "content":   scores.chatgpt += 2; scores.claude += 1; trackAffinities.writer += 2; break;
    }

    // Q2 — outputTypes
    for (const ot of answers.outputTypes) {
        switch (ot) {
            case "text":         scores.claude += 3; scores.chatgpt += 1; trackAffinities.writer += 2; break;
            case "visuals":      scores.chatgpt += 3; scores.gemini += 1; trackAffinities.visual += 3; break;
            case "research":     scores.gemini += 3; scores.claude += 1; trackAffinities.student += 3; break;
            case "code":         scores.claude += 3; scores.chatgpt += 2; trackAffinities.builder += 3; break;
            case "data":         scores.chatgpt += 3; scores.gemini += 1; trackAffinities.analyst += 3; break;
            case "audio":        scores.chatgpt += 1; scores.gemini += 1; trackAffinities.visual += 2; break;
            case "conversation": scores.gemini += 2; scores.chatgpt += 1; scores.claude += 1; break;
        }
    }

    // Tools Impact (Grant XP and influence tracks)
    let startingXp = 0;
    for (const tool of answers.preferredTools) {
        startingXp += 50;
        
        // Tool-specific affinity
        if (["Midjourney", "DALL-E", "Runway", "Suno", "Udio", "ElevenLabs"].includes(tool)) trackAffinities.visual += 3;
        if (["Cursor", "v0", "GitHub Copilot"].includes(tool)) trackAffinities.builder += 3;
        if (["Julius AI", "ChatGPT Data Analysis"].includes(tool)) trackAffinities.analyst += 3;
        if (["NotebookLM", "Perplexity"].includes(tool)) trackAffinities.student += 3;
        if (["Notion AI"].includes(tool)) trackAffinities.writer += 3;
        
        // Model bias
        if (tool === "Claude") { scores.claude += 2; trackAffinities.writer += 1; trackAffinities.builder += 1; }
        if (tool === "Gemini") { scores.gemini += 2; trackAffinities.student += 1; trackAffinities.visual += 1; }
        if (tool === "ChatGPT") { scores.chatgpt += 1; /* neutral */ }
    }
    startingXp = Math.min(startingXp, 250);

    // Q3 — outputDepth
    switch (answers.outputDepth) {
        case "quick":  scores.chatgpt += 2; scores.gemini += 2; break;
        case "medium": scores.gemini += 3; break;
        case "deep":   scores.claude += 3; break;
    }

    // Q4 — workStyle
    switch (answers.workStyle) {
        case "chat":       scores.gemini += 2; scores.chatgpt += 1; break;
        case "brief":      scores.claude += 2; scores.chatgpt += 1; break;
        case "iterative":  scores.claude += 3; break;
        case "automation": scores.chatgpt += 2; scores.claude += 1; break;
    }

    // Q5 — budgetLevel
    switch (answers.budgetLevel) {
        case "free": scores.gemini += 3; break;
        case "low":  scores.gemini += 2; scores.chatgpt += 1; break;
        case "high": scores.claude += 2; scores.chatgpt += 1; break;
    }

    // Profile title logic based on affinities
    const sortedAffinities = Object.entries(trackAffinities).sort((a, b) => b[1] - a[1]);
    const topTrack = sortedAffinities[0][0];
    
    let profileTitle = "משתמש כללי";
    switch (topTrack) {
        case "writer":  profileTitle = "כותב"; break;
        case "analyst": profileTitle = "אנליסט"; break;
        case "visual":  profileTitle = "יוצר ויזואלי"; break;
        case "builder": profileTitle = "מתכנת"; break;
        case "student": profileTitle = "חוקר"; break;
    }

    // Specialist tools mapping (internal for profile display)
    const specialistToolsSet = new Set<string>();
    if (trackAffinities.visual >= 2) ["Midjourney", "DALL-E", "Runway"].forEach(t => specialistToolsSet.add(t));
    if (trackAffinities.student >= 2) ["NotebookLM", "Perplexity"].forEach(t => specialistToolsSet.add(t));
    if (trackAffinities.builder >= 2) ["Cursor", "v0", "GitHub Copilot"].forEach(t => specialistToolsSet.add(t));
    if (trackAffinities.analyst >= 2) ["Julius AI", "ChatGPT Data Analysis"].forEach(t => specialistToolsSet.add(t));
    const specialistTools = Array.from(specialistToolsSet);

    // Determine primary and secondary models
    const sorted = (Object.entries(scores) as [ModelName, number][])
        .sort((a, b) => b[1] - a[1]);
    const primaryModel = sorted[0][0];
    const secondaryModel = sorted[1][0];

    const maxScore = sorted[0][1];
    const geminiScore = scores.gemini;
    const geminiIsAllRounder = (maxScore - geminiScore <= 2) || (answers.budgetLevel === "free") || answers.outputTypes.includes("research");

    const experienceLevel: "beginner" | "intermediate" = answers.preferredTools.some(t => LLM_TOOLS.includes(t)) ? "intermediate" : "beginner";

    const primaryModelReason = "הכלים המומלצים שויכו על סמך התשובות שלך כדי לתת לך את התוצאה הטובה ביותר.";
    const recommendedCourseId = "how-llms-work";

    return {
        primaryUseCase,
        outputTypes: answers.outputTypes,
        outputDepth: answers.outputDepth,
        workStyle: answers.workStyle,
        budgetLevel: answers.budgetLevel,
        specialistTools,
        geminiIsAllRounder,
        preferredTools: answers.preferredTools,
        experienceLevel,
        primaryModel,
        secondaryModel,
        primaryModelReason,
        recommendedCourseId,
        profileTitle,
        startingXp,
    };
}

export interface ModelCard {
    model: ModelName;
    isPrimary: boolean;
    profileExplanation: string;
    pros: string[];
    cons: string[];
}

export function generateModelCards(result: { 
    primaryModel: ModelName, 
    secondaryModel: ModelName, 
    profileTitle: string 
}): ModelCard[] {
    const { primaryModel, secondaryModel, profileTitle } = result;
    const allModels: ModelName[] = ["claude", "chatgpt", "gemini"];
    const thirdModel = allModels.find(m => m !== primaryModel && m !== secondaryModel) as ModelName;

    const orderedModels = [primaryModel, secondaryModel, thirdModel];

    return orderedModels.map(model => {
        const isPrimary = model === primaryModel;
        let profileExplanation = "";
        let pros: string[] = [];
        let cons: string[] = [];

        if (model === "claude") {
            if (profileTitle === "חוקר") {
                profileExplanation = "Claude הוא חוקר בעצמו. הוא יקרא מסמך ארוך, יבין את הטיעונים, ויסביר לך מה חשוב — בלי לפספס פרטים קריטיים.";
            } else if (profileTitle === "מתכנת") {
                profileExplanation = "Claude מבין קוד ברמה עמוקה. הוא לא רק כותב — הוא מסביר למה, מה יכול להישבר, ואיפה הלוגיקה עלולה להתפרק.";
            } else if (profileTitle === "כותב") {
                profileExplanation = "Claude כותב כמו בן אדם, לא כמו מכונה. הוא שומר על הקול שלך, מציע שיפורים בלי להרוס את הסגנון.";
            } else {
                profileExplanation = "Claude מצטיין בהנמקה מורכבת וכתיבה מדויקת. מתאים במיוחד לעבודה מעמיקה ופרויקטים ארוכים.";
            }
            pros = ["הנמקה וניתוח", "כתיבה בעברית", "חלון הקשר"];
            cons = ["ללא תמונות"];
        } else if (model === "gemini") {
            if (profileTitle === "חוקר") {
                profileExplanation = "Gemini עם Deep Research הוא כמו לקבל עוזר מחקר שסורק עשרות מקורות תוך דקות. NotebookLM הופך כל מסמך לשיעור פרטי.";
            } else if (profileTitle === "אנליסט") {
                profileExplanation = "Gemini מעבד כמויות מידע שאף מודל אחר לא מסוגל. הוא יקרא דוח שלם ויסכם לך בדיוק מה רלוונטי.";
            } else if (profileTitle === "משתמש כללי") {
                profileExplanation = "Gemini הוא נקודת הכניסה הכי טובה ל-AI — חינמי, מהיר, ומחובר לכל כלי Google שאתה כבר משתמש בו יום יום.";
            } else {
                profileExplanation = "Gemini מצטיין במחקר, אינטגרציה מעולה עם Google, ומהירות תגובה מעולה.";
            }
            pros = ["חינמי ומהיר", "אינטגרציה ל-Google"];
            cons = ["מכסות חינמיות מוגבלות בשעות עומס"];
        } else if (model === "chatgpt") {
            if (profileTitle === "מתכנת") {
                profileExplanation = "ChatGPT הוא הכלי הכי גמיש למתכנתים — כותב קוד, מסביר שגיאות, ויוצר תמונות לפרויקט, הכל בלי לצאת מהממשק.";
            } else if (profileTitle === "יוצר ויזואלי") {
                profileExplanation = "ChatGPT הוא הסטודיו הדיגיטלי שלך — תמונות, תסריטים, רעיונות ועריכה, הכל מממשק אחד.";
            } else {
                profileExplanation = "ChatGPT הוא הכלי הרב-ממדי הטוב ביותר כרגע. הוא גמיש במיוחד ומתאים כמעט לכל משימה.";
            }
            pros = ["גמישות מקסימלית", "כולל יצירת תמונות מובנית"];
            cons = ["מאבד הקשר בשיחות אדגיות"];
        }

        return {
            model,
            isPrimary,
            profileExplanation,
            pros,
            cons
        };
    });
}

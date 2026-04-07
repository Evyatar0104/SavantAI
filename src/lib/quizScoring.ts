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
}

const LLM_TOOLS = ["ChatGPT", "Claude", "Gemini", "Grok", "Perplexity"];

export function calculateQuizResult(answers: QuizAnswers): QuizResult {
    const scores: Record<ModelName, number> = { claude: 0, chatgpt: 0, gemini: 0 };

    // Q1 — primaryUseCase
    const primaryUseCase = answers.useCases[0] || "work";
    switch (primaryUseCase) {
        case "work":      scores.claude += 2; scores.chatgpt += 1; scores.gemini += 1; break;
        case "study":     scores.gemini += 3; scores.claude += 1; break;
        case "creative":  scores.chatgpt += 2; scores.gemini += 1; break;
        case "investing": scores.claude += 2; scores.gemini += 2; break;
        case "coding":    scores.claude += 3; scores.chatgpt += 2; break;
        case "content":   scores.chatgpt += 2; scores.claude += 1; break;
    }

    // Q2 — outputTypes
    for (const ot of answers.outputTypes) {
        switch (ot) {
            case "text":         scores.claude += 3; scores.chatgpt += 1; break;
            case "visuals":      scores.chatgpt += 3; scores.gemini += 1; break;
            case "research":     scores.gemini += 3; scores.claude += 1; break;
            case "code":         scores.claude += 3; scores.chatgpt += 2; break;
            case "data":         scores.chatgpt += 3; scores.gemini += 1; break;
            case "audio":        scores.chatgpt += 1; scores.gemini += 1; break;
            case "conversation": scores.gemini += 2; scores.chatgpt += 1; scores.claude += 1; break;
        }
    }

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

    // Q6 tools
    if (answers.preferredTools.includes("NotebookLM")) {
        scores.gemini += 2;
    }
    if (answers.preferredTools.includes("Cursor")) {
        scores.claude += 1;
    }
    if (answers.preferredTools.length === 0) { // none tried at all
        scores.gemini += 1;
    }

    // Profile title logic
    let profileTitle = "משתמש כללי";
    if (answers.outputTypes.includes("code")) {
        profileTitle = "מפתח";
    } else if (answers.outputTypes.includes("data")) {
        profileTitle = "אנליסט";
    } else if (answers.outputTypes.includes("research") && answers.outputDepth === "deep") {
        profileTitle = "חוקר";
    } else if (answers.outputTypes.includes("research")) {
        profileTitle = "חוקר";
    } else if (answers.outputTypes.includes("visuals") || answers.outputTypes.includes("audio")) {
        profileTitle = "יוצר ויזואלי";
    } else if (answers.outputTypes.includes("text") && answers.outputTypes.length === 1) {
        profileTitle = "כותב";
    } else if (answers.outputTypes.includes("conversation") && answers.outputTypes.length <= 2) {
        profileTitle = "בונה רעיונות";
    }

    // Specialist tools mapping
    const specialistToolsSet = new Set<string>();
    if (answers.outputTypes.includes("visuals")) {
        ["Midjourney", "DALL-E", "Runway"].forEach(t => specialistToolsSet.add(t));
    }
    if (answers.outputTypes.includes("audio")) {
        ["Suno", "ElevenLabs", "Udio"].forEach(t => specialistToolsSet.add(t));
    }
    if (answers.outputTypes.includes("research")) {
        ["NotebookLM", "Perplexity"].forEach(t => specialistToolsSet.add(t));
    }
    if (answers.outputTypes.includes("code")) {
        ["Cursor", "v0", "GitHub Copilot"].forEach(t => specialistToolsSet.add(t));
    }
    if (answers.outputTypes.includes("data")) {
        ["Julius AI", "ChatGPT Data Analysis"].forEach(t => specialistToolsSet.add(t));
    }
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

    const primaryModelReason = "הכלים המומלצים שויכו על סמך התשובות שלך כדי לתת לך את התוצאה הטובה ביותר."; // Fallback

    const courseMap: Record<string, string> = {
        "work": "ai-productivity",
        "study": "ai-how-llms-work", // assuming it falls to how-llms-work since user wants to start course
        "creative": "ai-how-llms-work",
        "investing": "ai-how-llms-work",
        "coding": "ai-how-llms-work",
        "content": "ai-how-llms-work",
    };
    const recommendedCourseId = "how-llms-work"; // Fixed to the course from router.push for now.

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
    };
}

export interface ModelCard {
    model: ModelName;
    isPrimary: boolean;
    profileExplanation: string;
    pros: string[];
    cons: string[];
}

export function generateModelCards(result: QuizResult): ModelCard[] {
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
            } else if (profileTitle === "מפתח") {
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
            if (profileTitle === "מפתח") {
                profileExplanation = "ChatGPT הוא הכלי הכי גמיש למפתחים — כותב קוד, מסביר שגיאות, ויוצר תמונות לפרויקט, הכל בלי לצאת מהממשק.";
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



import { PREDEFINED_QUESTIONS } from '../constants';
import { QuestionCategory, QuestionItem, QuestionType } from '../types';
import { generateQuestionWithGemini } from './geminiService';

let askedQuestionIds: Set<string> = new Set();
let askedGeneratedTexts: Set<string> = new Set();

export const resetAskedQuestions = (): void => {
  askedQuestionIds.clear();
  askedGeneratedTexts.clear();
};

export const getQuestionOrDare = async (
  type: QuestionType,
  selectedCategories: QuestionCategory[]
): Promise<QuestionItem | null> => {
  const availablePredefined = PREDEFINED_QUESTIONS.filter(q =>
    q.type === type &&
    !askedQuestionIds.has(q.id) &&
    (selectedCategories.some(sc => q.categories.includes(sc)) || selectedCategories.includes(QuestionCategory.CUSTOM)) // CUSTOM allows any category if others exhausted
  );

  if (availablePredefined.length > 0 && !selectedCategories.includes(QuestionCategory.CUSTOM)) {
     // Prioritize predefined if not explicitly asking for CUSTOM only, or if CUSTOM is part of a mix.
    const randomIndex = Math.floor(Math.random() * availablePredefined.length);
    const question = availablePredefined[randomIndex];
    askedQuestionIds.add(question.id);
    return question;
  }

  // If "Custom (AI Generated)" is selected or no predefined questions match, try Gemini
  if (selectedCategories.includes(QuestionCategory.CUSTOM) || availablePredefined.length === 0) {
    const geminiCategories = selectedCategories.filter(c => c !== QuestionCategory.CUSTOM); // Pass actual themes to Gemini
    if(geminiCategories.length === 0) geminiCategories.push(QuestionCategory.FUN); // Default if only custom is selected

    const generatedText = await generateQuestionWithGemini(type, geminiCategories, Array.from(askedGeneratedTexts));
    if (generatedText && !askedGeneratedTexts.has(generatedText.toLowerCase())) {
      askedGeneratedTexts.add(generatedText.toLowerCase());
      return {
        id: `gemini-${Date.now()}`,
        type: type,
        text: generatedText,
        categories: [QuestionCategory.CUSTOM, ...geminiCategories],
      };
    } else if (generatedText && askedGeneratedTexts.has(generatedText.toLowerCase())) {
        console.log("Gemini returned a duplicate question, trying predefined again or returning null.");
    }
  }
  
  // Fallback if Gemini fails or returns nothing, or if CUSTOM wasn't selected and predefined ran out.
  // Try to pick any remaining predefined question of the correct type, even if categories don't perfectly match.
  const fallbackPredefined = PREDEFINED_QUESTIONS.filter(q => q.type === type && !askedQuestionIds.has(q.id));
  if (fallbackPredefined.length > 0) {
    const randomIndex = Math.floor(Math.random() * fallbackPredefined.length);
    const question = fallbackPredefined[randomIndex];
    askedQuestionIds.add(question.id);
    return question;
  }
  
  return null; // No questions available
};

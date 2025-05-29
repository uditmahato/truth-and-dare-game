
import { GoogleGenAI } from "@google/genai";
import { QuestionCategory, QuestionType } from '../types';

const API_KEY = process.env.API_KEY;

let ai: GoogleGenAI | null = null;
if (API_KEY) {
  ai = new GoogleGenAI({ apiKey: API_KEY });
} else {
  console.warn(
    "API_KEY environment variable not set. AI question generation will be disabled."
  );
}

export const generateQuestionWithGemini = async (
  type: QuestionType,
  categories: QuestionCategory[],
  existingQuestionTexts: string[]
): Promise<string | null> => {
  if (!ai) {
    console.log("Gemini AI client not initialized. Cannot generate question.");
    return null;
  }

  const categoryString = categories.filter(cat => cat !== QuestionCategory.CUSTOM).join(', ') || 'general fun';
  
  const prompt = `Generate a single, unique, and engaging ${type} question for a party game.
The ${type} should be suitable for the following themes/categories: ${categoryString}.
Ensure the question is creative and appropriate for young adults.
Do NOT repeat any of these previously asked questions/dares: ${existingQuestionTexts.join('; ')}.
Provide only the ${type} text itself, without any preamble, explanation, or markdown formatting.
Example of a good ${type} question: "What's a secret talent you have?" if type is truth.
Example of a good ${type} dare: "Sing the chorus of your favorite song out loud." if type is dare.
The question should be a maximum of 20 words.
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview-04-17',
      contents: prompt,
      // Default thinkingConfig for higher quality unless low latency is specifically needed.
    });
    
    const text = response.text.trim();
    // Basic filter for empty or placeholder responses
    if (!text || text.toLowerCase().includes("cannot fulfill") || text.toLowerCase().includes("i am unable")) {
        console.warn("Gemini returned an unhelpful response:", text);
        return null;
    }
    return text;
  } catch (error) {
    console.error(`Error generating ${type} with Gemini:`, error);
    return null;
  }
};

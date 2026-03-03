
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { UserProfile, Language } from "../types";

export const getScoreExplanation = async (user: UserProfile, lang: Language): Promise<string> => {
  try {
    // Create a new GoogleGenAI instance right before making an API call to ensure it uses the correct API key
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `
      You are an expert AI financial advisor for a worker in India using the "MicroTrust" app.
      
      User Data:
      - Score: ${user.score}/900
      - Categories: Consistency ${user.breakdown.consistency}%, Bills ${user.breakdown.billPayments}%, Stability ${user.breakdown.stability}%
      
      Task:
      Provide exactly 3 very short, crisp, and actionable bullet points to improve their score in ${lang}.
      Maximum 8 words per bullet point. No introductory text. 
      Format strictly like this:
      • Point 1
      • Point 2
      • Point 3
      Keep it high-impact and practical.
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.5,
        topP: 0.8,
      },
    });

    // Directly access the .text property of GenerateContentResponse
    return response.text || "• Maintain daily transactions\n• Pay bills on time\n• Expand trust network";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "• Update your profile\n• Verify local referrals\n• Sync bill payments";
  }
};

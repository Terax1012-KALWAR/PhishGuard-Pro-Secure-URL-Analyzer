
import { GoogleGenAI } from "@google/genai";

export const getAISmartInsight = async (url: string, heuristicSummary: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a cybersecurity expert. Provide a concise (2-3 sentence) security assessment of this URL: ${url}. 
      Our local checks found: ${heuristicSummary}. 
      Give a clear "Safe", "Caution", or "Dangerous" verdict and explain why based on common phishing patterns. 
      Keep it professional and helpful.`,
    });
    
    return response.text || "Unable to retrieve AI insights at this time.";
  } catch (error) {
    console.error("AI Insight Error:", error);
    return "AI analysis failed. Please rely on local heuristic checks.";
  }
};

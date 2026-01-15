
import { GoogleGenAI } from "@google/genai";
import { AIAction } from "../types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const PROMPTS: Record<AIAction, string> = {
  summarize: "Provide a concise summary of the following note content. Use bullet points if necessary. Keep it professional and brief.",
  improve: "Proofread and enhance the following text. Fix grammar, improve flow, and make it more engaging while maintaining the original meaning.",
  brainstorm: "Based on the content of this note, suggest 5 related creative ideas or next steps that could be explored.",
  simplify: "Rewrite the following content so it's much easier to understand. Use simple language and clear sentences.",
  expand: "Elaborate on the key points in this note. Add relevant details and context to make the content more comprehensive."
};

export const processNoteWithAI = async (content: string, action: AIAction): Promise<string> => {
  if (!content.trim()) return "Please add some content first.";
  
  try {
    const ai = getAI();
    const systemInstruction = "You are a helpful writing assistant within a notebook application. Your goal is to help users improve their notes.";
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `${PROMPTS[action]}\n\nContent:\n${content}`,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return response.text || "I couldn't process that. Please try again.";
  } catch (error) {
    console.error("AI processing error:", error);
    return "An error occurred while communicating with the AI. Please ensure your environment is configured correctly.";
  }
};

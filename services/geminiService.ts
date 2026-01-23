
import { GoogleGenAI, Type } from "@google/genai";
import { DropType, DropMetadata } from "../types";

export async function analyzeDrop(content: string): Promise<{
  type: DropType;
  tags: string[];
  metadata?: DropMetadata;
}> {
  // Use the API_KEY directly from process.env as per guidelines.
  // We initialize a new GoogleGenAI instance inside the function to ensure the most up-to-date key is used.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const isUrl = content.match(/^https?:\/\/[^\s$.?#].[^\s]*$/gm);

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze this content for a digital clipboard. 
      Content: "${content}"
      
      Determine if it's a 'url', 'snippet' (code), or 'text'.
      Suggest 2-3 relevant tags.
      If it's a URL, suggest a possible title and site name.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            type: { type: Type.STRING, enum: ['url', 'snippet', 'text'] },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } },
            metadata: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                siteName: { type: Type.STRING },
                description: { type: Type.STRING },
              }
            }
          },
          required: ['type', 'tags']
        }
      }
    });

    // Extract and trim response text before parsing JSON
    const jsonStr = response.text.trim();
    const data = JSON.parse(jsonStr);
    return data;
  } catch (error) {
    console.error("Gemini analysis failed", error);
    return { 
      type: isUrl ? 'url' : 'text', 
      tags: [],
      metadata: isUrl ? { title: content, siteName: 'Web Link' } : undefined
    };
  }
}
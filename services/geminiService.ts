
import { GoogleGenAI, Type } from "@google/genai";
import { DropType, DropMetadata } from "../types";

export async function analyzeDrop(content: string): Promise<{
  type: DropType;
  tags: string[];
  suggestedCollectionId: string;
  metadata?: DropMetadata;
}> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const isUrl = content.match(/^https?:\/\/[^\s$.?#].[^\s]*$/gm);

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze this clipboard drop and route it to the best collection.
      Collections: inbox, work, personal, links, code.
      Content: "${content}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            type: { type: Type.STRING, enum: ['url', 'snippet', 'text'] },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } },
            suggestedCollectionId: { type: Type.STRING },
            metadata: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                siteName: { type: Type.STRING },
                description: { type: Type.STRING },
              }
            }
          },
          required: ['type', 'tags', 'suggestedCollectionId']
        },
        tools: isUrl ? [{ googleSearch: {} }] : undefined
      }
    });

    const data = JSON.parse(response.text.trim());
    return data;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return { 
      type: isUrl ? 'url' : 'text', 
      tags: [],
      suggestedCollectionId: isUrl ? 'links' : 'inbox',
      metadata: isUrl ? { title: content, siteName: 'Web Link' } : undefined
    };
  }
}


import { GoogleGenAI, Type } from "@google/genai";
import { DropType, DropMetadata } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export async function analyzeDrop(content: string): Promise<{
  type: DropType;
  tags: string[];
  metadata?: DropMetadata;
}> {
  if (!process.env.API_KEY) {
    return { type: 'text', tags: [] };
  }

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

    const data = JSON.parse(response.text);
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

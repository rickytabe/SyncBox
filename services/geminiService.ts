
import { GoogleGenAI, Type } from "@google/genai";
import { DropType, DropMetadata } from "../types";

export async function analyzeDrop(content: string, forceType?: DropType): Promise<{
  type: DropType;
  tags: string[];
  suggestedCollectionId: string;
  metadata?: DropMetadata;
}> {
  if (forceType && forceType !== 'text') {
    // If it's a file, we skip heavy text analysis and just categorize
    const mapping: Record<string, string> = {
      image: 'images',
      video: 'videos',
      document: 'documents'
    };
    return {
      type: forceType,
      tags: [forceType],
      suggestedCollectionId: mapping[forceType] || 'inbox'
    };
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const isUrl = content.match(/^https?:\/\/[^\s$.?#].[^\s]*$/gm);

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze this content for SyncDrop. 
      Collections: inbox (general), links (URLs), code (snippets), images, videos, documents.
      Content: "${content.substring(0, 1000)}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            type: { type: Type.STRING, enum: ['url', 'snippet', 'text'] },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } },
            suggestedCollectionId: { type: Type.STRING, enum: ['inbox', 'links', 'code'] },
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

    return JSON.parse(response.text.trim());
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

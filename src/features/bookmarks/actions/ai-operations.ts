"use server";

import { GoogleGenAI } from "@google/genai";
import { updateBookmarkMetadataInBackground } from "./db-operations";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function predictLinkMetadata(targetUrl: string) {
  try {
    const response = await fetch(targetUrl, { next: { revalidate: 3600 } });
    if (!response.ok) throw new Error("Failed to fetch website content");

    const htmlContent = await response.text();
    const headChunk = htmlContent.slice(0, 10000);

    const aiPrompt = `
      Analyze this website's raw HTML chunk and extract its high-quality Metadata.
      
      Tasks:
      1. Generate a clean, concise title.
      2. Categorize the website. Prefer using exactly one of these: 'Social Accounts', 'Dev Tools', 'Documentation', 'Design Resources'. 
         If it absolutely fits none, create a brand new highly descriptive 1-2 word category name (e.g., 'Crypto', 'AI Tools', 'Database').

      HTML Chunk:
      ${headChunk}

      CRITICAL: Return a strict raw JSON object with keys "title" and "category". Do not warp response in markdown markdown code blocks or backticks.
    `;

    const aiResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: aiPrompt,
    });

    const aiTextOutput = aiResponse.text || "";
    const cleanedJsonText = aiTextOutput.replace(/```json|```/g, "").trim();
    const parsedMetadata = JSON.parse(cleanedJsonText);

    return {
      success: true,
      title: parsedMetadata.title || "",
      category: parsedMetadata.category || "General",
    };
  } catch (error) {
    console.error("AI Metadata Prediction Error:", error);
    return {
      success: false,
      title: "",
      category: "",
    };
  }
}

export async function processBookmarkAIInBackground(
  targetUrl: string,
  bookmarkId: number,
  userId: string,
) {
  try {
    const result = await predictLinkMetadata(targetUrl);

    if (result.success && (result.title || result.category)) {
      await updateBookmarkMetadataInBackground(
        bookmarkId,
        result.title,
        result.category,
        userId,
      );
    }
  } catch (error) {
    console.error("Background AI Enrichment Error:", error);
  }
}

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function getFundamentalAnalysis(symbol: string, companyName: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Provide a brief, high-level fundamental analysis for ${companyName} (${symbol}). 
      Focus on recent performance, key growth drivers, and potential risks. 
      Keep it professional and concise (under 100 words).`,
    });
    return response.text;
  } catch (error) {
    console.error("AI Analysis Error:", error);
    return "Unable to generate AI analysis at this moment. Please check your API key.";
  }
}

export async function getMarketNewsAnalysis(newsItems: string[]) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Summarize the following market news into a single cohesive sentiment paragraph:
      ${newsItems.join('\n')}`,
    });
    return response.text;
  } catch (error) {
    console.error("AI News Summary Error:", error);
    return "Unable to summarize news.";
  }
}

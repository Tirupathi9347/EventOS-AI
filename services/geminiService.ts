
import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateEventIdeas = async (prompt: string): Promise<string> => {
  try {
    const ai = getClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a creative college event planner. Suggest 3 unique, modern, and fun event themes/ideas based on this request: "${prompt}". 
      Keep the tone youthful and exciting. Format the output as a simple HTML list using <li> tags, but do not wrap it in <ul> or <html> tags.`,
    });
    return response.text || "Could not generate ideas at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error connecting to AI Assistant. Please check your API key.";
  }
};

export const predictEventCost = async (eventType: string, attendees: number): Promise<string> => {
  try {
    const ai = getClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Estimate the budget breakdown for a college "${eventType}" event with ${attendees} attendees. 
      Provide a JSON string (no markdown formatting) with keys: 'food', 'decoration', 'venue', 'logistics', 'total'. 
      Values should be realistic numbers in USD.`,
    });
    const text = response.text || "{}";
    // Clean up potential markdown code blocks
    return text.replace(/```json|```/g, '').trim();
  } catch (error) {
    console.error("Gemini API Error:", error);
    return JSON.stringify({ food: 0, decoration: 0, venue: 0, logistics: 0, total: 0 });
  }
};

export const generateMoodBoardDescription = async (theme: string): Promise<string[]> => {
  try {
    const ai = getClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Describe a visual mood board for a "${theme}" event. 
      Return exactly 4 short, comma-separated search terms that would find good images on Unsplash. 
      Example output: Neon lights, Cyberpunk city, Holographic texture, Future crowd`,
    });
    const text = response.text || "";
    return text.split(',').map(s => s.trim());
  } catch (error) {
    return ["Event", "Party", "Lights", "Decoration"];
  }
};

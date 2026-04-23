import { GoogleGenerativeAI, Content } from "@google/generative-ai";
import { Message } from "./types";

const INSTRUCTION = `You are Iris, a real-time visual assistant for blind users. Describe what you see in exactly 1-2 short sentences. Prioritize hazards and obstacles first, then the most important visual details. If the user asks you to read text, read it exactly as written, concisely. Be direct — no filler words, no greetings, no "I can see". Just state what matters.`;

export async function askGemini(
  imageBase64: string,
  transcript: string,
  history: Message[],
): Promise<string> {
  const apiKey = process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) {
    throw new Error("GOOGLE_AI_API_KEY is not set");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: INSTRUCTION,
  });

  const recentHistory = history.slice(-10);
  const chatHistory: Content[] = recentHistory.map((msg) => ({
    role: msg.role === "user" ? "user" : "model",
    parts: [{ text: msg.content }],
  }));

  const chat = model.startChat({ history: chatHistory });

  const result = await chat.sendMessage([
    {
      inlineData: {
        mimeType: "image/jpeg",
        data: imageBase64,
      },
    },
    { text: transcript },
  ]);

  return result.response.text();
}

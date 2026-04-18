import { GoogleGenerativeAI, Content } from "@google/generative-ai";
import { Message } from "./types";

const SYSTEM_INSTRUCTION = `You are SceneSpeak, a real-time visual assistant for blind and visually impaired users. A user is pointing their phone camera at something and asking you about it. Describe what you see clearly, concisely, and helpfully. Focus on: spatial relationships, text/signage, people, obstacles, colors, and anything safety-relevant. Keep responses under 3 sentences unless the user asks for more detail. Be warm but efficient. If you see potential hazards (stairs, curbs, obstacles in path), mention them first.`;

const GUARDIAN_SYSTEM_INSTRUCTION = `You are a real-time safety monitor for a blind user. You see their camera feed. ONLY speak if you notice: obstacles in their path, steps/stairs/curbs, people approaching, doors, vehicles, signs/text they should know about, or any hazard. If nothing important or new is happening, respond with exactly NOTHING_NEW. Otherwise give ONE short sentence about what they need to know. Prioritize safety. Never describe mundane unchanging scenery.`;

export async function askGemini(
  imageBase64: string,
  transcript: string,
  history: Message[]
): Promise<string> {
  const apiKey = process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) {
    throw new Error("GOOGLE_AI_API_KEY is not set");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: SYSTEM_INSTRUCTION,
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

export async function guardianScan(imageBase64: string): Promise<string> {
  const apiKey = process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) {
    throw new Error("GOOGLE_AI_API_KEY is not set");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: GUARDIAN_SYSTEM_INSTRUCTION,
  });

  const result = await model.generateContent([
    {
      inlineData: {
        mimeType: "image/jpeg",
        data: imageBase64,
      },
    },
    { text: "What do you see? Report only if there is something important." },
  ]);

  return result.response.text();
}

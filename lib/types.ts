export interface Message {
  role: "user" | "assistant";
  content: string;
}

export type AppState = "idle" | "listening" | "thinking" | "speaking";
export type AppMode = "ask" | "guardian";

export interface AskRequest {
  image: string;
  transcript: string;
  history: Message[];
}

export interface SessionEntry {
  id: number;
  thumbnail: string;
  question: string;
  answer: string;
  timestamp: number;
}

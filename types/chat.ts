export type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp?: Date;
};

export type ChatState = {
  messages: ChatMessage[];
  loading: boolean;
  error: string | null;
};

export type ChatRequest = {
  message: string;
  messages?: ChatMessage[];
};

export type ChatResponse = {
  response: string;
  error?: string;
};
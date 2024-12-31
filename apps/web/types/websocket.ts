export interface ChatMessage {
  id: string;
  content: string;
  roomId: string;
  userId: string;
  createdAt: Date;
}

export interface UserStatus {
  userId: string;
  status: "online" | "offline";
  lastSeen?: string;
}

export interface TypingStatus {
  userId: string;
  roomId: string;
  isTyping: boolean;
}

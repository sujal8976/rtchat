export interface ChatMessage {
  id: string;
  roomId: string;
  userId: string;
  message: string;
  timestamp: string;
  status?: "sent" | "delivered" | "read";
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

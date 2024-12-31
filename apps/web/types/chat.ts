import { ChatMessage } from "./websocket";

export interface ChatUser {
  id: string;
  username: string;
  isOnline: boolean;
}

export interface ChatRoom {
  id: string;
  name: string;
  description: string | null;
  createdBy: string;
  users: ChatUser[];
  messages: ChatMessage[];
}

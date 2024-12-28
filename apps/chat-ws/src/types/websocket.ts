import { WebSocket } from "ws";

export interface AuthenticatedWebSocket extends WebSocket {
  userId: string;
  isAlive: boolean;
  currentRoom: string | null;
  isTyping: Map<string, NodeJS.Timeout>;
}

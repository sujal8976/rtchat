import { WebSocket } from "ws";

export interface AuthenticatedWebSocket extends WebSocket {
  userId: string;
  isAlive: boolean;
  rooms: Set<string>;
  isTyping: Map<string, NodeJS.Timeout>;
}

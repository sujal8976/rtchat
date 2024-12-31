import { WebSocketMessage, WebSocketMessageType } from "@repo/common/types";
import {
  WS_URL,
  RECONNECT_INTERVAL,
  MAX_RECONNECT_ATTEMPTS,
  PING_INTERVAL,
} from "../config/websocket";
import { useChatStore } from "../store/chat";

class WebSocketService {
  private static instance: WebSocketService;
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private pingInterval: NodeJS.Timeout | null = null;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private initialized: boolean = false;
  private accessToken: string | null = null;

  private constructor() {}

  public static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  public setAccessToken(token: string | null) {
    this.accessToken = token;
    if (this.initialized && token) {
      this.reconnect();
    }

    return this;
  }

  public initialize() {
    if (this.initialized) {
      return this;
    }

    this.initialized = true;
    if (this.accessToken) {
      this.connect();
    }

    return this;
  }

  private connect() {
    if (!this.accessToken) {
      console.log("No accessToken provided");
    }
    try {
      useChatStore.getState().setConnectionStatus("connecting");
      this.ws = new WebSocket(`${WS_URL}?token=${this.accessToken}`);
      this.setupEventListners();
      this.setupPing();
    } catch (error) {
      console.error("WebSocket connection error:", error);
      this.handleReconnect();
    }
  }

  private setupEventListners() {
    if (!this.ws) return;

    this.ws.onopen = () => {
      console.log("Websocket connected");
      this.reconnectAttempts = 0;
      useChatStore.getState().setConnectionStatus("connected");

      // Rejoin rooms after reconnection
      const currentRoom = useChatStore.getState().currentRoom;
      if (currentRoom) {
        this.send({
          type: WebSocketMessageType.JOIN_ROOM,
          payload: { roomId: currentRoom },
        });
      }
    };

    this.ws.onclose = () => {
      console.log("WebSocket disconnected");
      useChatStore.getState().setConnectionStatus("disconnected");
      this.handleReconnect();
    };

    this.ws.onerror = (error) => {
      console.log("WebSocket error:", error);
      useChatStore.getState().setConnectionStatus("error");
    };

    this.ws.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        this.handleMessage(message);
      } catch (error) {
        console.log("Error passing WebSocket message:", error);
      }
    };
  }

  private handleMessage(message: WebSocketMessage) {
    const store = useChatStore.getState();

    switch (message.type) {
      case WebSocketMessageType.SEND_MESSAGE:
        store.addMessage(message.payload);
        break;

      case WebSocketMessageType.ERROR:
        console.error("WebSocket error message:", message.payload);
        store.setError(message.payload.message);
        break;

      case WebSocketMessageType.USER_STATUS:
        store.setRoomConnectionStatus(message.payload.status);
        break;

      default:
        console.log("Unhandled message type:", message.type);
    }
  }

  private setupPing() {
    this.pingInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: "ping" }));
      }
    }, PING_INTERVAL);
  }

  private handleReconnect() {
    if (this.reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
      console.error("Max reconnection attempts reached");
      useChatStore.getState().setError("Unable to connect to chat services");
      return;
    }

    this.reconnectTimeout = setTimeout(() => {
      console.log(`Reconnecting... Attempt ${this.reconnectAttempts + 1}`);
      this.reconnectAttempts++;
      this.connect();
    }, RECONNECT_INTERVAL);
  }

  public send(message: WebSocketMessage) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.error("WebSocket is not connected");
      useChatStore
        .getState()
        .setError("Connection lost. Trying to reconnect...");
    }
  }

  private reconnect() {
    this.reconnectAttempts = 0;
    this.cleanup();
    this.connect();
  }

  public cleanup() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export const wsService = WebSocketService.getInstance();

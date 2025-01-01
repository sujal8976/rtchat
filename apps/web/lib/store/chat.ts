import { create } from "zustand";
import { ChatMessage } from "../../types/websocket";
import { devtools } from "zustand/middleware";

interface ChatState {
  messages: ChatMessage[];
  currentRoom: string | null;
  connectionStatus: "connected" | "connecting" | "disconnected" | "error";
  error: string | null;
  roomConnectionStatus: "rejoined" | "joined" | "no room";

  // Actions
  setCurrentRoom: (roomId: string | null) => void;
  setMessages: (messages: ChatMessage[]) => void;
  addMessage: (message: ChatMessage) => void;
  setConnectionStatus: (
    status: "connected" | "connecting" | "disconnected" | "error"
  ) => void;
  setError: (error: string | null) => void;
  clearMessages: (roomId: string) => void;
  setRoomConnectionStatus: (status: "rejoined" | "joined" | "no room" ) => void;
}

export const useChatStore = create<ChatState>()(
  devtools((set, get) => ({
    messages: [],
    currentRoom: null,
    connectionStatus: "disconnected",
    error: null,

    setCurrentRoom: (roomId) => {
      if (!roomId) return;
      set({ currentRoom: roomId });
    },

    setMessages: (messages) => {
      set(() => ({
        messages: messages,
      }));
    },

    addMessage: (message) => {
      set((state) => ({
        messages: [...state.messages, message],
      }));
    },

    setConnectionStatus: (status) => {
      set({ connectionStatus: status });
    },

    setRoomConnectionStatus: (status) => {
      set({ roomConnectionStatus: status });
    },

    setError: (error) => {
      set({ error });
    },

    clearMessages: (roomId) => {
      if (!roomId) return;
      set((state) => ({
        messages: {
          ...state.messages,
          [roomId]: [],
        },
      }));
    },
  }))
);

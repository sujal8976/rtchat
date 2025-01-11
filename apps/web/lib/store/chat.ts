import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface ChatState {
  currentRoom: string | null;
  connectionStatus: "connected" | "connecting" | "disconnected" | "error";
  error: string | null;
  roomUpdates: {
    status: "rejoined" | "joined" | "left" | "offline" | null;
    username: string;
  };
  roomConnectionStatus: "connected" | "connecting" | "error" | "disconnected";

  // Actions
  setCurrentRoom: (roomId: string | null) => void;
  setConnectionStatus: (
    status: "connected" | "connecting" | "disconnected" | "error"
  ) => void;
  setError: (error: string | null) => void;
  setRoomUpdates: (statusData: {
    status: "rejoined" | "joined" | "left" | "offline" | null;
    username: string;
  }) => void;
  setRoomConnectionStatus: (
    status: "connected" | "connecting" | "error" | "disconnected"
  ) => void;
}

export const useChatStore = create<ChatState>()(
  devtools((set, get) => ({
    currentRoom: null,
    connectionStatus: "disconnected",
    error: null,
    roomConnectionStatus: "disconnected",

    setCurrentRoom: (roomId) => {
      if (!roomId) return;
      set({ currentRoom: roomId });
    },

    setConnectionStatus: (status) => {
      set({ connectionStatus: status });
    },

    setRoomUpdates: (statusData) => {
      set({
        roomUpdates: {
          status: statusData.status,
          username: statusData.username,
        },
      });
    },

    setRoomConnectionStatus: (status) => {
      set({ roomConnectionStatus: status });
    },

    setError: (error) => {
      set({ error });
    }
  }))
);

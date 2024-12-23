import { create } from "zustand";
import { ChatMessage, UserStatus, TypingStatus } from "../../types/websocket";

interface ChatState {
  messages: Record<string, ChatMessage[]>;
  userStatuses: Record<string, UserStatus>;
  typingStatuses: Record<string, TypingStatus[]>;
  currentRoom: string | null;
  connectionStatus: "connected" | "disconnected" | "error";
  error: string | null;

  //actions
  setCurrentRoom: (roomId: string) => void;
  addMessage: (message: ChatMessage) => void;
  updateMessage: (messageId: string, updates: Partial<ChatMessage>) => void;
  updateUserStatus: (status: UserStatus) => void;
  updateTypingStatus: (status: TypingStatus) => void;
  setConnectionStatus: (status: "connected" | "disconnected" | "error") => void;
  setError: (error: string | null) => void;
  clearMessages: (roomId: string) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: {},
  userStatuses: {},
  typingStatuses: {},
  currentRoom: null,
  connectionStatus: "disconnected",
  error: null,

  setCurrentRoom: (roomId) => {
    set({ currentRoom: roomId });
  },

  addMessage: (message) => {
    set((state) => ({
      messages: {
        ...state.messages,
        [message.roomId]: [...(state.messages[message.roomId] || []), message],
      },
    }));
  },

  updateMessage: (messageId, updates) => {
    set((state) => {
      const newMessages = { ...state.messages };

      Object.keys(newMessages).forEach((roomId) => {
        if (newMessages[roomId]) {
          newMessages[roomId] = newMessages[roomId].map((msg) =>
            msg.id === messageId ? { ...msg, ...updates } : msg
          );
        }
      });

      return { messages: newMessages };
    });
  },

  updateUserStatus: (status) => {
    set((state) => ({
      userStatuses: {
        ...state.userStatuses,
        [status.userId]: status,
      },
    }));
  },

  updateTypingStatus: (status) => {
    set((state) => {
      const roomTypingStatuses = state.typingStatuses[status.roomId] || [];
      const updatedStatuses = status.isTyping
        ? [...roomTypingStatuses, status]
        : roomTypingStatuses.filter((s) => s.userId !== status.userId);

      return {
        typingStatuses: {
          ...state.typingStatuses,
          [status.roomId]: updatedStatuses,
        },
      };
    });
  },

  setConnectionStatus: (status) => {
    set({ connectionStatus: status });
  },

  setError: (error) => {
    set({ error });
  },

  clearMessages: (roomId) => {
    set((state) => ({
      messages: {
        ...state.messages,
        [roomId]: [],
      },
    }));
  },
}));

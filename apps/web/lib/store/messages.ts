import { create } from "zustand";
import { ChatMessage, MessageResponse } from "../../types/messages";
import { BASE_URL } from "../config/websocket";
import { devtools } from "zustand/middleware";

interface MessagesStore {
  messages: ChatMessage[];
  hasMore: boolean;
  isLoading: boolean;
  fetchMessages: (roomId: string, page: number, limit: number) => Promise<void>;
  appendMessages: (messages: ChatMessage[]) => void;
  resetStore: () => void;
  addMessage: (message: ChatMessage) => void;
  replaceMessage: (tempId: string, message: ChatMessage) => void;
}

export const useMessagesStore = create<MessagesStore>()(
  devtools((set, get) => ({
    messages: [],
    hasMore: true,
    isLoading: false,

    fetchMessages: async (roomId: string, page: number, limit) => {
      if (get().isLoading || !get().hasMore) return;

      set({ isLoading: true });
      try {
        const res = await fetch(
          `${BASE_URL}/api/messages/getMessages?roomId=${roomId}&page=${page}&limit=${limit}`
        );
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to fetch messages");
        }

        const data: MessageResponse = await res.json();

        get().appendMessages(data.messages);
        set({ hasMore: data.hasMore });
      } catch (error) {
        throw new Error(
          error instanceof Error ? error.message : "Failed to fetch messages"
        );
      } finally {
        set({ isLoading: false });
      }
    },

    appendMessages: (newMessages: ChatMessage[]) =>
      set((state) => {
        const uniqueMessages = newMessages.filter(
          (newMsg) =>
            !state.messages.some((existingMsg) => existingMsg.id === newMsg.id)
        );
        return {
          messages: [...uniqueMessages, ...state.messages],
        };
      }),

    resetStore: () =>
      set({
        messages: [],
        hasMore: true,
        isLoading: false,
      }),

    addMessage: (message: ChatMessage) => {
      set((state) => {
        const messageExists = state.messages.some(
          (msg) => msg.id === message.id
        );
        if (messageExists) {
          return state;
        }
        return {
          messages: [...state.messages, message],
        };
      });
    },

    replaceMessage: (tempId: string, confirmedMessage: ChatMessage) => {
      if (!tempId) return;
      set((state) => {
        const messages = [...state.messages];
        if (messages.length === 0) {
          return { messages };
        }
        for (let i = messages.length - 1; i >= 0; i--) {
          const message = messages[i];
          if (message && message.id === tempId) {
            messages[i] = confirmedMessage;
            break;
          }
        }
        return { messages };
      });
    },
  }))
);

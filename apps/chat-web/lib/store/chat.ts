import { create } from "zustand";
import { ChatMessage, UserStatus, TypingStatus } from "../../types/websocket";
import { devtools } from "zustand/middleware";

interface ChatState {
  messages:  ChatMessage[];
  userStatuses: Record<string, UserStatus>;
  typingStatuses: Record<string, TypingStatus[]>;
  currentRoom: string | null;
  connectionStatus: "connected" | "disconnected" | "error";
  error: string | null;

  // Actions
  setCurrentRoom: (roomId: string) => void;
  setMessages:  (messages: ChatMessage[]) => void;
  addMessage: (message: ChatMessage) => void;
  updateMessage: (messageId: string, updates: Partial<ChatMessage>) => void;
  updateUserStatus: (status: UserStatus) => void;
  updateTypingStatus: (status: TypingStatus) => void;
  setConnectionStatus: (status: "connected" | "disconnected" | "error") => void;
  setError: (error: string | null) => void;
  clearMessages: (roomId: string) => void;
}

export const useChatStore = create<ChatState>()(devtools((set, get) => ({
  messages: [],
  userStatuses: {},
  typingStatuses: {},
  currentRoom: null,
  connectionStatus: "disconnected",
  error: null,

  setCurrentRoom: (roomId) => {
    if (!roomId) return;
    set({ currentRoom: roomId });
  },

  setMessages: (messages) => {
    set(() => ({
      messages: messages
    }));
  },

  addMessage: (message) => {
    set((state) => ({
      messages: [...state.messages, message]
    }));
  },

  // updateMessage: (messageId, updates) => {
  //   if (!messageId || !updates) return; // Validate inputs
  //   set((state) => {
  //     const updatedMessages = Object.keys(state.messages).reduce(
  //       (acc, roomId) => {
  //         const roomMessages = state.messages[roomId];
  //         if (!roomMessages) {
  //           acc[roomId] = []; // Ensure undefined rooms are not processed
  //           return acc;
  //         }
  
  //         const updatedRoomMessages = roomMessages.map((msg) =>
  //           msg.id === messageId ? { ...msg, ...updates } : msg
  //         );
  //         acc[roomId] = updatedRoomMessages;
  //         return acc;
  //       },
  //       {} as Record<string, ChatMessage[]>
  //     );
  
  //     return { messages: updatedMessages };
  //   });
  // },
  

  // updateUserStatus: (status) => {
  //   if (!status || !status.userId) return; // Validate user status
  //   set((state) => ({
  //     userStatuses: {
  //       ...state.userStatuses,
  //       [status.userId]: status,
  //     },
  //   }));
  // },

  // updateTypingStatus: (status) => {
  //   if (!status || !status.userId || !status.roomId) return; // Validate inputs
  //   set((state) => {
  //     const currentRoomStatuses = state.typingStatuses[status.roomId] || [];
  //     const updatedStatuses = status.isTyping
  //       ? [...currentRoomStatuses.filter((s) => s.userId !== status.userId), status]
  //       : currentRoomStatuses.filter((s) => s.userId !== status.userId);

  //     return {
  //       typingStatuses: {
  //         ...state.typingStatuses,
  //         [status.roomId]: updatedStatuses,
  //       },
  //     };
  //   });
  // },

  setConnectionStatus: (status) => {
    set({ connectionStatus: status });
  },

  setError: (error) => {
    set({ error });
  },

  clearMessages: (roomId) => {
    if (!roomId) return; // Validate roomId
    set((state) => ({
      messages: {
        ...state.messages,
        [roomId]: [],
      },
    }));
  },
})));

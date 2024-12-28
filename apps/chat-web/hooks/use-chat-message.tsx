import { useEffect } from "react";
import { useChatStore } from "../lib/store/chat";
import { ChatMessage } from "../types/websocket";

export function useChatMessages(messages: ChatMessage[]) {
  const setMessages = useChatStore().setMessages;

  useEffect(() => {
    setMessages(messages);
  }, [messages]);
}

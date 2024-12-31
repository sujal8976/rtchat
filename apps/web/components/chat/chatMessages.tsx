"use client";

import { forwardRef } from "react";
import { ChatUser } from "../../types/chat";
import { useSession } from "next-auth/react";
import { useChatStore } from "../../lib/store/chat";
import { MessageBubble } from "./messageBubble";
import { ChatMessage } from "../../types/websocket";

interface ChatMessagesProps {
  users: ChatUser[];
  messages: ChatMessage[]
}

const ChatMessages = forwardRef<HTMLDivElement, ChatMessagesProps>(
  ({ users, messages }, ref) => {
    const { data } = useSession();
    if (!data?.user && !data?.user?.id) return <div>User not logged In</div>;

    return (
      <div className="w-full h-[70vh] p-4 overflow-y-scroll">
        <div className="space-y-6">
          {messages.map((msg) => {
            const messageUser = users.find((user) => user.id === msg.userId);
            return (
              <MessageBubble
                key={msg.id}
                message={msg}
                isCurrentUser={msg.userId === data?.user?.id}
                messageUser={messageUser}
              />
            );
          })}
        </div>
        <div ref={ref} />
      </div>
    );
  }
);

ChatMessages.displayName = "ChatMessages";
export default ChatMessages;

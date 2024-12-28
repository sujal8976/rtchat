"use client";

import { MessageBubble } from "./messageBubble";
import { forwardRef } from "react";
import { useSession } from "next-auth/react";
import { ChatUser } from "../../types/chat";
import { useChatStore } from "../../lib/store/chat";

interface ChatMessagesProp {
  users: ChatUser[];
  roomId: string;
}

const ChatMessages = forwardRef<HTMLDivElement, ChatMessagesProp>(
  ({ users, roomId }, ref) => {
    
    const { data } = useSession();
    if (!data?.user && !data?.user?.id) return <div>User not logged In</div>;

    const { messages } = useChatStore();

    return (
      <div className="w-full max-h-[75vh] p-4 overflow-y-scroll scroll-area">
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

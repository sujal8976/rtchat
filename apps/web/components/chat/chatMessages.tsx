"use client";

import { forwardRef } from "react";
import { ChatUser } from "../../types/chat";
import { useSession } from "next-auth/react";
import { MessageBubble } from "./messageBubble";
import { ChatMessage } from "../../types/websocket";

interface ChatMessagesProps {
  users: ChatUser[];
  messages: ChatMessage[];
}

const ChatMessages = forwardRef<HTMLDivElement, ChatMessagesProps>(
  ({ users, messages }, ref) => {
    const { data } = useSession();

    return (
      <div className="w-full h-[calc(100svh-73px-81px-77px)] p-4 overflow-y-scroll">
        {data?.user?.id ? (
          <>
            {/* <div className="space-y-6"> */}
              {messages.map((msg) => {
                const messageUser = users.find(
                  (user) => user.id === msg.userId
                );
                return (
                  <MessageBubble
                    key={msg.id}
                    message={msg}
                    isCurrentUser={msg.userId === data?.user?.id}
                    messageUser={messageUser}
                  />
                );
              })}
            {/* </div> */}
            <div ref={ref} />
          </>
        ) : (
          <div className="text-center">
            <p>User is not Logged In</p>
          </div>
        )}
      </div>
    );
  }
);

ChatMessages.displayName = "ChatMessages";
export default ChatMessages;

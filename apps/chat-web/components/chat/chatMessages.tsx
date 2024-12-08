"use client";

import { ScrollArea } from "@repo/ui/components/ui/scroll-area";
import { DEMO_MESSAGES, DEMO_USERS } from "../../testData/chat";
import { MessageBubble } from "./messageBubble";
import { forwardRef } from "react";

const ChatMessages = forwardRef<HTMLDivElement, { roomId: string }>(
  ({ roomId }, ref) => {
    return (
      // <ScrollArea className="h-full max-h-[75vh] p-4 overflow-auto">
        <div className="w-full max-h-[75vh] p-4 overflow-y-scroll scroll-area">
          <div className="space-y-6">
            {DEMO_MESSAGES.map((msg) => {
              const user = DEMO_USERS.find((u) => u.id === msg.userId);
              if (!user) return null;
              const isCurrentUser = msg.userId === '1';
              return (
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  user={user}
                  isCurrentUser={isCurrentUser}
                />
              );
            })}
          </div>
          <div ref={ref} />
        </div>
      //</ScrollArea> 
    );
  }
);

ChatMessages.displayName = "ChatMessages";
export default ChatMessages;

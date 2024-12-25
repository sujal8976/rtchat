"use client";

import { useEffect, useRef } from "react";
import { ChatHeader } from "./chatHeader";
import { ChatMembers } from "./chatMembers";
import ChatMessages from "./chatMessages";
import ChatInput from "./chatInput";
import { ChatRoom as ChatRoomProps } from "../../types/chat";

export function ChatRoom(room: ChatRoomProps) {
  const messageEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, []);

  return (
    <div className="flex flex-1 ">
      <div className="flex-1 flex flex-col">
        <ChatHeader
          name={room.name}
          description={room.description}
          users={room.users}
        />
        <ChatMessages
          messages={room.messages}
          users={room.users}
          ref={messageEndRef}
        />
        <ChatInput roomId={room.id} />
      </div>
      <ChatMembers users={room.users} />
    </div>
  );
}

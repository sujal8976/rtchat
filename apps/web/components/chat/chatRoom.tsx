"use client";

import { useEffect, useRef } from "react";
import { ChatRoom as ChatRoomProps } from "../../types/chat";
import { ChatHeader } from "./chatHeader";
import { ChatInput } from "./chatInput";
import { ChatMembers } from "./chatMembers";
import ChatMessages from "./chatMessages";
import { useChatRoom } from "../../hooks/use-chat-room";

export function ChatRoom(room: ChatRoomProps) {
  const messageEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const {
    messages,
    setMessages,
    connectionStatus
  } = useChatRoom(room.id);

  useEffect(() => {
    setMessages(room.messages);
  }, [room]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if(connectionStatus === 'connecting'){
    return <div>
      connnecting To server....
    </div>
  }

  return (
    <div className="flex flex-1">
      <div className="flex-1 flex flex-col">
        <ChatHeader
          name={room.name}
          description={room.description}
          users={room.users}
        />
        <ChatMessages
          messages={messages}
          users={room.users}
          ref={messageEndRef}
        />
        <ChatInput roomId={room.id} />
      </div>
      <ChatMembers users={room.users} />
    </div>
  );
}

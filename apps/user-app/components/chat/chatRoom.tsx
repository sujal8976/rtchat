"use client";

import { useEffect, useRef } from "react";
import { ChatHeader } from "./chatHeader";
import { ChatMembers } from "./chatMembers";
import ChatMessages from "./chatMessages";
import ChatInput from "./chatInput";

export function ChatRoom() {
  const messageEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({behavior: 'smooth'})
  }

  useEffect(()=>{
    scrollToBottom();
  },[])
  const roomId = '1'

  return (
    <div className="flex flex-1 ">
      <div className="flex-1 flex flex-col">
        <ChatHeader />
        <ChatMessages  roomId={roomId} ref={messageEndRef} />
        <ChatInput roomId={roomId} />
      </div>
      <ChatMembers />
    </div>
  );
}

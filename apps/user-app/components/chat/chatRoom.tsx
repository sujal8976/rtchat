"use client";

import { ChatHeader } from "./chatHeader";
import { ChatMembers } from "./chatMembers";
import ChatMessages from "./chatMessages";

export function ChatRoom() {
  return (
    <div className="flex flex-1">
      <div className="flex-1 flex flex-col">
        <ChatHeader />
        <ChatMessages />
      </div>
      <ChatMembers />
    </div>
  );
}

"use client";

import { ChatHeader } from "./chatHeader";
import { ChatMembers } from "./chatMembers";

export function ChatRoom() {
  return (
    <div className="flex flex-1">
      <div className="flex-1 flex flex-col">
        <ChatHeader />
      </div>
      <ChatMembers />
    </div>
  );
}

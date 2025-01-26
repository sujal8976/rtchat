"use client";

import { ChatRoom as ChatRoomProps } from "../../types/chat";
import { ChatHeader } from "./chatHeader";
import { ChatInput } from "./chatInput";
import { ChatMembers } from "./chatMembers";
import { ChatMessages } from "./chatMessages";
import { useChatRoom } from "../../hooks/use-chat-room";
import Loading from "../loading/loading";

export function ChatRoom(room: ChatRoomProps) {
  const { connectionStatus, exitRoom, roomConnectionStatus, sendMessage } =
    useChatRoom(room.id, room.users);

  if (connectionStatus === "disconnected") {
    return (
      <Loading text="Try to refresh the page OR Check your network connection..." />
    );
  }

  if (roomConnectionStatus === "connecting") {
    return <Loading text={`Connecting to ${room.name} room...`} />;
  }

  if (
    connectionStatus === "connected" &&
    roomConnectionStatus === "connected"
  ) {
    return (
      <div className="flex-1 flex">
        <div className="flex-1 flex flex-col">
          <ChatHeader
            name={room.name}
            description={room.description}
            adminId={room.createdBy}
            exitRoom={exitRoom}
          />
          <ChatMessages roomId={room.id} />
          <ChatInput sendMessage={sendMessage} />
        </div>
        <ChatMembers adminId={room.createdBy} />
      </div>
    );
  } else {
    return <Loading text="Try to refresh the page and try again..." />;
  }
}

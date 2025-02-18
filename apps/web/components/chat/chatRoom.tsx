"use client";

import { ChatRoom as ChatRoomProps } from "../../types/chat";
import { ChatHeader } from "./chatHeader";
import { ChatInput } from "./chatInput";
import { ChatMembers } from "./chatMembers";
import { ChatMessages } from "./chatMessages";
import { useChatRoom } from "../../hooks/use-chat-room";
import Loading from "../loading/loading";

export function ChatRoom(room: ChatRoomProps) {
  const { exitRoom, roomConnectionStatus, sendMessage } = useChatRoom(
    room.id,
    room.users,
    room.createdBy
  );

  if (roomConnectionStatus === "connecting") {
    return <Loading text={`Connecting to ${room.name} room...`} />;
  }

  if (roomConnectionStatus === "connected") {
    return (
      <div className="flex-1 flex">
        <div className="flex-1 flex flex-col">
          <ChatHeader
            roomImage={room.roomImage}
            name={room.name}
            description={room.description}
            exitRoom={exitRoom}
          />
          <ChatMessages roomId={room.id} />
          <ChatInput sendMessage={sendMessage} />
        </div>
        <ChatMembers />
      </div>
    );
  } else {
    return <Loading text="Try to refresh the page and try again..." />;
  }
}

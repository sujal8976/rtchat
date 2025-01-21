"use client";

import { useCallback, useEffect, useRef } from "react";
import { useChatStore } from "../lib/store/chat";
import { wsService } from "../lib/services/websocket";
import { WebSocketMessageType } from "@repo/common/types";
import { useToast } from "@repo/ui/hooks/use-toast";
import { useSession } from "next-auth/react";

class RoomManager {
  private static instance: RoomManager;
  private activeRooms: Map<string, boolean> = new Map();

  private constructor() {}

  static getInstance(): RoomManager {
    if (!this.instance) {
      this.instance = new RoomManager();
    }
    return this.instance;
  }

  joinRoom(roomId: string) {
    if (!this.activeRooms.has(roomId)) {
      wsService.send({
        type: WebSocketMessageType.JOIN_ROOM,
        payload: { roomId },
      });
      this.activeRooms.set(roomId, true);
    }
  }

  closeRoom(roomId: string) {
    if (this.activeRooms.has(roomId)) {
      wsService.send({
        type: WebSocketMessageType.CLOSE_ROOM,
        payload: { roomId },
      });
      this.activeRooms.delete(roomId);
    }
  }

  isRoomActive(roomId: string): boolean {
    return this.activeRooms.has(roomId);
  }
}

export function useChatRoom(roomId: string) {
  const { toast } = useToast();
  const roomManager = useRef(RoomManager.getInstance());
  const {
    connectionStatus,
    error,
    setCurrentRoom,
    roomUpdates,
    setRoomConnectionStatus,
    roomConnectionStatus
  } = useChatStore();
  const { data } = useSession();

  // Handle room connection
  const connectToRoom = useCallback(() => {
    if (!roomId) {
      return;
    }

    try {
      setRoomConnectionStatus("connecting");
      roomManager.current.joinRoom(roomId);
    } catch (err) {
      toast({
        title: "Connection Error",
        description: err instanceof Error ? err.message : "Failed to join room",
        variant: "destructive",
      });
    }
  }, [roomId, toast, setCurrentRoom, setRoomConnectionStatus]);

  // Handle room disconnection
  const disconnectFromRoom = useCallback(() => {
    if (!roomId) return;

    try {
      roomManager.current.closeRoom(roomId);
      setRoomConnectionStatus("disconnected");
      setCurrentRoom(null);
      toast({
        title: "Disconnected",
        description: `Left room ${roomId}`,
      });
    } catch (err) {
      toast({
        title: "Disconnection Error",
        description:
          err instanceof Error ? err.message : "Failed to leave room",
        variant: "destructive",
      });
    }
  }, [roomId, toast, setCurrentRoom, setRoomConnectionStatus]);

  // Automatic cleanup on unmount
  useEffect(() => {
    setCurrentRoom(roomId);
    connectToRoom();

    return () => {
      if (roomManager.current.isRoomActive(roomId)) {
        disconnectFromRoom();
      }
    };
  }, [roomId, connectToRoom, disconnectFromRoom]);

  // Handle WebSocket errors and status message
  useEffect(() => {
    if (error) {
      toast({
        title: "WebSocket Error",
        description: error,
        variant: "destructive",
      });
    }

    if (!roomUpdates) return;

    if (roomUpdates.status === "rejoined") {
      if (roomUpdates.username === data?.user?.username) {
        setRoomConnectionStatus("connected");
      }
      toast({
        title:
          data?.user?.username === roomUpdates.username
            ? "You entered in the chat!"
            : `${roomUpdates.username} entered in the chat!`,
      });
    }

    if (roomUpdates.status === "joined") {
      if (roomUpdates.username === data?.user?.username) {
        setRoomConnectionStatus("connected");
      }
      toast({
        title:
          data?.user?.username === roomUpdates.username
            ? "You joined the room!"
            : `${roomUpdates.username} joined the room!`,
        description: "Member++ :)",
      });
    }

    if (roomUpdates.status === "offline") {
      toast({
        title: `${roomUpdates.username} Gone offline :(`,
      });
    }

    if (roomUpdates.status === "left") {
      toast({
        title: `${roomUpdates.username} left the room :(`,
      });
    }
  }, [error, toast, roomUpdates]);

  const sendMessage = useCallback(
    (message: string, tempId: string) => {
      wsService.send({
        type: WebSocketMessageType.SEND_MESSAGE,
        payload: {
          roomId,
          content: message,
          tempId
        },
      });
    },
    [roomId]
  );

  const exitRoom = useCallback(() => {
    wsService.send({
      type: WebSocketMessageType.LEAVE_ROOM,
      payload: {
        roomId,
      },
    });
  }, []);

  return {
    connectionStatus,
    roomUpdates,
    error,
    roomConnectionStatus,
    sendMessage,
    exitRoom,
    // Expose methods for manual control if needed
    connectToRoom,
    disconnectFromRoom,
  };
}

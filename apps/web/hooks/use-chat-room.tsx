"use client";

import { useCallback, useEffect, useRef } from "react";
import { useChatStore } from "../lib/store/chat";
import { wsService } from "../lib/services/websocket";
import { WebSocketMessageType } from "@repo/common/types";
import { useToast } from "@repo/ui/hooks/use-toast";
import { useSession } from "next-auth/react";
import { useMessagesStore } from "../lib/store/messages";
import { ChatUser } from "../types/chat";
import { useRoomMembersStore } from "../lib/store/roomMembers";

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

export function useChatRoom(roomId: string, roomMembers: ChatUser[], adminUserId: string) {
  const { toast } = useToast();
  const roomManager = useRef(RoomManager.getInstance());
  const {
    connectionStatus,
    error,
    setCurrentRoom,
    roomUpdates,
    setRoomConnectionStatus,
    roomConnectionStatus,
  } = useChatStore();
  const {
    setRoomMembers,
    addRoomMember,
    setOnlineRoomMember,
    setOfflineRoomMember,
    removeRoomMember,
  } = useRoomMembersStore();
  const addMessage = useMessagesStore().addMessage;
  const { data } = useSession();

  // Handle room connection
  const connectToRoom = useCallback(() => {
    if (!roomId) {
      return;
    }

    try {
      setRoomConnectionStatus("connecting");
      roomManager.current.joinRoom(roomId);
      setRoomMembers(roomMembers, adminUserId);
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
      setRoomMembers([], null);
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

    switch (roomUpdates.status) {
      case "rejoined":
        if (roomUpdates.username === data?.user?.username) {
          setRoomConnectionStatus("connected");
        }
        setOnlineRoomMember(roomUpdates.username);
        toast({
          title:
            data?.user?.username === roomUpdates.username
              ? "You entered in the chat!"
              : `${roomUpdates.username} entered in the chat!`,
        });
        break;

      case "joined":
        if (roomUpdates.username === data?.user?.username) {
          setRoomConnectionStatus("connected");
        }
        addRoomMember(roomUpdates.username);
        toast({
          title:
            data?.user?.username === roomUpdates.username
              ? "You joined the room!"
              : `${roomUpdates.username} joined the room!`,
          description: "Member++ :)",
        });
        break;

      case "offline":
        setOfflineRoomMember(roomUpdates.username);
        toast({
          title: `${roomUpdates.username} Gone offline :(`,
        });
        break;

      case "left":
        removeRoomMember(roomUpdates.username);
        toast({
          title: `${roomUpdates.username} left the room :(`,
        });
        break;

      default:
        break;
    }
  }, [error, toast, roomUpdates]);

  const sendMessage = useCallback(
    (message: string) => {
      const tempId = `temp-${Date.now().toString()}`;

      wsService.send({
        type: WebSocketMessageType.SEND_MESSAGE,
        payload: {
          roomId,
          content: message,
          tempId,
        },
      });

      addMessage({
        id: tempId,
        content: message,
        userId: data?.user?.id as string,
        roomId: roomId,
        createdAt: new Date(),
        user: {
          username: data?.user?.username as string,
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

"use client";

import { useEffect, useCallback } from "react";
import { useChatStore } from "../lib/store/chat";
import { wsService } from "../lib/services/websocket";
import { WebSocketMessageType } from "@repo/common/types";
import { useToast } from "@repo/ui/hooks/use-toast";

export function useChatRoom(roomId: string) {
  const { toast } = useToast();
  const { connectionStatus, error, setCurrentRoom, roomConnectionStatus } =
    useChatStore();

  useEffect(() => {
    setCurrentRoom(roomId);
    // Join room
    wsService.send({
      type: WebSocketMessageType.JOIN_ROOM,
      payload: { roomId },
    });
    return () => {
      // Close room
      wsService.send({
        type: WebSocketMessageType.CLOSE_ROOM,
        payload: { roomId },
      });
    };
  }, [roomId, setCurrentRoom]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    }
    if (roomConnectionStatus === "rejoined") {
      toast({
        title: "You entered in the chat",
      });
    }
  }, [error, connectionStatus, toast]);

  const sendMessage = useCallback(
    (message: string) => {
      wsService.send({
        type: WebSocketMessageType.SEND_MESSAGE,
        payload: {
          roomId,
          content: message,
        },
      });
    },
    [roomId]
  );

  return {
    connectionStatus,
    sendMessage,
  };
}

"use client";

import { useEffect, useCallback } from "react";
import { useChatStore } from "../lib/store/chat";
import { wsService } from "../lib/services/websocket";
import { WebSocketMessageType } from "@repo/common/types";
import { useToast } from "@repo/ui/hooks/use-toast";

export function useChatRoom(roomId: string) {
  const { toast } = useToast();
  const {
    // userStatuses,
    // typingStatuses,
    connectionStatus,
    error,
    setCurrentRoom,
  } = useChatStore();

  // const roomTypingStatuses = typingStatuses[roomId] || [];

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
        description: "error",
        variant: "destructive",
      });
    }
  }, [error, toast]);

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

  // const sendTypingStatus = useCallback(
  //   (isTyping: boolean) => {
  //     wsService.send({
  //       type: isTyping
  //         ? WebSocketMessageType.TYPING_START
  //         : WebSocketMessageType.TYPING_STOP,
  //       payload: {
  //         roomId,
  //       },
  //     });
  //   },
  //   [roomId]
  // );

  return {
    // typingUsers: roomTypingStatuses,
    // userStatuses,
    connectionStatus,
    sendMessage,
    // sendTypingStatus,
  };
}

"use client"

import { ReactNode, useEffect } from "react";
import { wsService } from "../lib/services/websocket";
import WebSocketInitializer from "./websocketInitializer";

export function WebSocketProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const cleanup = () => {
      wsService.cleanup();
    };

    return cleanup;
  }, []);

  return (
    <>
      <WebSocketInitializer />
      {children}
    </>
  );
}

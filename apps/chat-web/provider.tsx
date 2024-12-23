"use client";

import { ThemeProvider } from "@repo/ui/components/theme-provider";
import { Toaster } from "@repo/ui/components/ui/toaster";
import { SessionProvider } from "next-auth/react";
import WebSocketInitializer from "./components/initializer/websocketInitializer";
import { useEffect } from "react";
import { wsService } from "./lib/services/websocket";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    const cleanup = () => {
      wsService.cleanup();
    };

    return cleanup;
  }, []);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SessionProvider>
        <WebSocketInitializer />
        {children}
      </SessionProvider>
      <Toaster />
    </ThemeProvider>
  );
};

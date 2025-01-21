"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { wsService } from "../lib/services/websocket";

export default function WebSocketInitializer() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.accessToken && session.user.id) {
      wsService.setSession(session.user.accessToken, session.user.id).initialize();
    }
  }, [session?.user?.accessToken, session?.user?.id]);

  return null;
}

"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { wsService } from "../../lib/services/websocket";

export default function WebSocketInitializer() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.accessToken) {
      wsService.setAccessToken(session.user.accessToken).initialize();
    }
  }, [session?.user?.accessToken]);

  return null;
}

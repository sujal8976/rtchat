"use client";

import { ReactNode } from "react";
import { useChatStore } from "../../../lib/store/chat";
import Loading from "../../../components/loading/loading";

export default function ({ children }: { children: ReactNode }) {
  const connectionStatus = useChatStore().connectionStatus;

  if (connectionStatus === "connecting") {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Loading text="Connecting..." />
      </div>
    );
  }

  if (connectionStatus === "error" || connectionStatus === "disconnected") {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Loading text="Try to refresh the page OR Check your network connection..." />
      </div>
    );
  }

  if (connectionStatus === "connected") {
    return <>{children}</>;
  }
}

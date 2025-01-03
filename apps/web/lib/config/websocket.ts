import { auth } from "../auth";

export const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "wss://ws.rtchat.thesujal.buzz";
export const RECONNECT_INTERVAL = 3000;
export const MAX_RECONNECT_ATTEMPTS = 5;
export const PING_INTERVAL = 30000;

export const WS_EVENTS = {
  CONNECT: "connect",
  DISCONNECT: "disconnect",
  ERROR: "error",
  MESSAGE: "message",
  RECONNECT: "reconnect",
  RECONNECT_ATTEMPT: "reconnect_attempt",
  RECONNECT_ERROR: "reconnect_error",
  RECONNECT_FAILED: "reconnect_failed",
};

export const getSessionToken = async () => {
  const session = await auth();

  const accessToken = session?.user?.accessToken;
  return accessToken;
};

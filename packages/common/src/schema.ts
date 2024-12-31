import { z } from "zod";
import { WebSocketMessageType } from "./types";

export const joinRoomSchema = z.object({
  type: z.literal(WebSocketMessageType.JOIN_ROOM),
  payload: z.object({
    roomId: z.string(),
  }),
});

export const leaveRoomSchema = z.object({
  type: z.literal(WebSocketMessageType.LEAVE_ROOM),
  payload: z.object({
    roomId: z.string(),
  }),
});

export const closeRoomSchema = z.object({
  type: z.literal(WebSocketMessageType.CLOSE_ROOM),
  payload: z.object({
    roomId: z.string(),
  }),
});

export const sendMessageSchema = z.object({
  type: z.literal(WebSocketMessageType.SEND_MESSAGE),
  payload: z.object({
    roomId: z.string(),
    content: z.string().min(1),
  }),
});

export const privateMessageSchema = z.object({
  type: z.literal(WebSocketMessageType.PRIVATE_MESSAGE),
  payload: z.object({
    recipientId: z.string(),
    content: z.string().min(1),
  }),
});

export const typingSchema = z.object({
  type: z.union([
    z.literal(WebSocketMessageType.TYPING_START),
    z.literal(WebSocketMessageType.TYPING_STOP),
  ]),
  payload: z.object({
    roomId: z.string(),
  }),
});

export const registerSchema = z.object({
  username: z
    .string()
    .min(4, { message: "Username must be at least 4 characters long." })
    .max(12, { message: "Username must be at most 12 characters long." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long." })
    .regex(/^(?=.*[a-zA-Z])(?=.*\d)/, {
      message: "Password must contain at least one letter and one number.",
    }),
  email: z.string().email({ message: "Invalid email address." }),
});

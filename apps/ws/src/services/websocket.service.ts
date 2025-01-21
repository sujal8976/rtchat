import WebSocket, { WebSocketServer } from "ws";
import { AuthenticatedWebSocket } from "../types/websocket";
import { WebSocketMessage, WebSocketMessageType } from "@repo/common/types";
import { RoomService } from "./room.service";
import { MessageService } from "./message.service";
import * as schemas from "@repo/common/schema";
import { ErrorHandler } from "../utils/error-handler";
import prisma from "@repo/db/client";

export class WebSocketService {
  private wss: WebSocketServer;
  private clients: Map<string, AuthenticatedWebSocket>;

  constructor() {
    this.wss = new WebSocketServer({ noServer: true });
    this.clients = new Map();
    this.setupHeartbeat();
  }

  private setupHeartbeat() {
    setInterval(() => {
      this.wss.clients.forEach((ws) => {
        const authenticatedWs = ws as AuthenticatedWebSocket;
        if (!authenticatedWs.isAlive) {
          this.handleDisconnect(authenticatedWs);
          return authenticatedWs.terminate();
        }
        authenticatedWs.isAlive = false;
        authenticatedWs.ping();
      });
    }, 30000);
  }

  public async handleConnection(
    ws: AuthenticatedWebSocket,
    userData: { userId: string; username: string }
  ) {
    try {
      if (await prisma.user.findUnique({ where: { id: userData.userId } })) {
        ws.userId = userData.userId;
        ws.username = userData.username;
        ws.isAlive = true;
        ws.currentRoom = null;
        ws.isTyping = new Map();
        this.clients.set(userData.userId, ws);

        await this.updateUserStatus(userData.userId, true);
        this.setupWebSocketListeners(ws);
      } else {
        ErrorHandler.sendError(
          ws,
          "CONNECTION_FAILED",
          "Failed to establish connection"
        );
      }
    } catch (error) {
      console.log("Error in handleConnection:", error);
      ErrorHandler.sendError(
        ws,
        "CONNECTION_ERROR",
        "Failed to establish connection"
      );
    }
  }

  private setupWebSocketListeners(ws: AuthenticatedWebSocket) {
    ws.on("pong", () => {
      ws.isAlive = true;
    });

    ws.on("message", async (data: string) => {
      try {
        const message: WebSocketMessage = JSON.parse(data);
        await this.handleMessage(ws, message);
      } catch (error) {
        console.log("Error processing Message:", error);
        ErrorHandler.sendError(
          ws,
          "Message_Processing_Error",
          "Invalid message format"
        );
      }
    });

    ws.on("close", () => this.handleDisconnect(ws));

    ws.on("error", (error) => {
      console.log("Error in WebSocket:", error);
      ErrorHandler.sendError(
        ws,
        "Websocket_Error",
        "WebSocket connection Error"
      );
      ws.close();
    });
  }

  private async handleMessage(
    ws: AuthenticatedWebSocket,
    message: WebSocketMessage
  ) {
    try {
      switch (message.type) {
        case WebSocketMessageType.JOIN_ROOM:
          await this.handleJoinRoom(ws, message.payload);
          break;
        case WebSocketMessageType.LEAVE_ROOM:
          await this.handleLeaveRoom(ws, message.payload);
          break;
        case WebSocketMessageType.SEND_MESSAGE:
          await this.handleSendMessage(ws, message.payload);
          break;
        case WebSocketMessageType.CLOSE_ROOM:
          await this.handleCloseRoom(ws, message.payload);
          break;
        case WebSocketMessageType.PRIVATE_MESSAGE:
          await this.handlePrivateMessage(ws, message.payload);
          break;
        case WebSocketMessageType.TYPING_START:
        case WebSocketMessageType.TYPING_STOP:
          await this.handleTypingStatus(ws, message);
          break;
      }
    } catch (error) {
      console.log("Error in handleMessage:", error);
      ErrorHandler.sendError(
        ws,
        "Message_Handling_Error",
        "Failed to process message"
      );
    }
  }

  private async handleJoinRoom(ws: AuthenticatedWebSocket, payload: any) {
    try {
      const { roomId } = schemas.joinRoomSchema.parse({
        type: WebSocketMessageType.JOIN_ROOM,
        payload,
      }).payload;

      const result = await RoomService.addUserToRoom(ws.userId, roomId);

      if (result === "joined") {
        ws.currentRoom = roomId;
        this.broadcastToRoom(roomId, {
          type: WebSocketMessageType.USER_STATUS,
          payload: {
            userId: ws.userId,
            status: "joined",
            username: ws.username,
            roomId,
          },
        });
      } else if (result === "alreadyJoined") {
        ws.currentRoom = roomId;
        this.broadcastToRoom(roomId, {
          type: WebSocketMessageType.USER_STATUS,
          payload: {
            userId: ws.userId,
            status: "rejoined",
            username: ws.username,
            roomId,
          },
        });
      } else {
        ErrorHandler.sendError(ws, "ROOM_JOIN_ERROR", "Failed to join room");
      }
    } catch (error) {
      console.log("Error in handleJoinRoom", error);
      ErrorHandler.sendError(ws, "Room_Join_Error", "Failed to join room");
    }
  }

  private async handleLeaveRoom(ws: AuthenticatedWebSocket, payload: any) {
    try {
      const { roomId } = schemas.leaveRoomSchema.parse({
        type: WebSocketMessageType.LEAVE_ROOM,
        payload,
      }).payload;

      if (await RoomService.removeUserFromRoom(ws.userId, roomId)) {
        ws.currentRoom = null;
        this.broadcastToRoom(roomId, {
          type: WebSocketMessageType.USER_STATUS,
          payload: {
            userId: ws.userId,
            status: "left",
            username: ws.username,
            roomId,
          },
        });
      } else {
        ErrorHandler.sendError(ws, "Room_Leave_Error", "Failed to leave room");
      }
    } catch (error) {
      console.log("Error in handleLeaveRoom:", error);
      ErrorHandler.sendError(ws, "Room_Leave_Error", "Failed to leave room");
    }
  }

  private async handleSendMessage(ws: AuthenticatedWebSocket, payload: any) {
    try {
      const { roomId, content, tempId } = schemas.sendMessageSchema.parse({
        type: WebSocketMessageType.SEND_MESSAGE,
        payload,
      }).payload;

      if (ws.currentRoom !== roomId) {
        return ErrorHandler.sendError(
          ws,
          "NOT_CURRENT_ROOMID",
          "Provide a current roomId"
        );
      }

      if (!(await RoomService.validateRoomAccess(ws.userId, roomId))) {
        return ErrorHandler.sendError(
          ws,
          "UNAUTHORIZED",
          "Not a member of this room"
        );
      }

      const message = await MessageService.createMessage(
        ws.userId,
        roomId,
        content
      );
      this.broadcastToRoom(roomId, {
        type: WebSocketMessageType.SEND_MESSAGE,
        payload: {
          id: message.id,
          content: message.content,
          userId: message.userId,
          roomId: message.roomId,
          createdAt: message.createdAt,
          user: {
            username: message.user.username,
          },
          tempId: tempId || undefined,
        },
      });
    } catch (error) {
      console.log("Error in handleSendMessage:", error);
      ErrorHandler.sendError(
        ws,
        "ERROR_SEND_MESSAGE",
        "Failed to send message"
      );
    }
  }

  private async handleCloseRoom(ws: AuthenticatedWebSocket, payload: any) {
    try {
      const { roomId } = schemas.closeRoomSchema.parse({
        type: WebSocketMessageType.CLOSE_ROOM,
        payload,
      }).payload;

      if (ws.currentRoom === roomId) {
        ws.currentRoom = null;
      }
    } catch (error) {
      console.log("Error in handleCloseRoom:", error);
      ErrorHandler.sendError(ws, "ERROR_CLOSING_ROOM", "Failed to close room");
    }
  }

  private async handlePrivateMessage(ws: AuthenticatedWebSocket, payload: any) {
    try {
      const { recipientId, content } = schemas.privateMessageSchema.parse({
        type: WebSocketMessageType.PRIVATE_MESSAGE,
        payload,
      }).payload;

      const recipient = this.clients.get(recipientId);
      if (!recipient) {
        return ErrorHandler.sendError(
          ws,
          "Recipient_Not_Found",
          "Recipient not found or offline"
        );
      }

      const message = {
        type: WebSocketMessageType.PRIVATE_MESSAGE,
        payload: {
          content,
          senderId: ws.userId,
          timestamp: new Date(),
        },
      };
      recipient.send(JSON.stringify(message));
    } catch (error) {
      console.log("Error in handlePrivateMessage:", error);
      ErrorHandler.sendError(
        ws,
        "Private_Message_Error",
        "Failed to send private message"
      );
    }
  }

  private async handleTypingStatus(
    ws: AuthenticatedWebSocket,
    message: WebSocketMessage
  ) {
    try {
      const { roomId } = schemas.typingSchema.parse(message).payload;

      if (!(await RoomService.validateRoomAccess(ws.userId, roomId))) {
        return ErrorHandler.sendError(
          ws,
          "UNAUTHORIZED",
          "Not a member of this room"
        );
      }

      if (message.type === WebSocketMessageType.TYPING_START) {
        // clear existing timeout if any
        const existingTimeout = ws.isTyping.get(roomId);
        if (existingTimeout) clearTimeout(existingTimeout);

        const timeout = setTimeout(() => {
          this.broadcastTypingStatus(ws, roomId, false);
          ws.isTyping.delete(roomId);
        }, 3000);

        ws.isTyping.set(roomId, timeout);
        this.broadcastTypingStatus(ws, roomId, true);
      } else {
        const timeout = ws.isTyping.get(roomId);
        if (timeout) {
          clearTimeout(timeout);
          ws.isTyping.delete(roomId);
        }
        this.broadcastTypingStatus(ws, roomId, false);
      }
    } catch (error) {
      console.log("Error in handleTypingStatus:", error);
      ErrorHandler.sendError(
        ws,
        "Typing_Status_Error",
        "Failed to update typing status"
      );
    }
  }

  private broadcastTypingStatus(
    ws: AuthenticatedWebSocket,
    roomId: string,
    isTyping: boolean
  ) {
    this.broadcastToRoom(
      roomId,
      {
        type: isTyping
          ? WebSocketMessageType.TYPING_START
          : WebSocketMessageType.TYPING_STOP,
        payload: {
          userId: ws.userId,
          roomId,
        },
      },
      [ws.userId]
    );
  }

  private async handleDisconnect(ws: AuthenticatedWebSocket) {
    try {
      this.clients.delete(ws.userId);
      await this.updateUserStatus(ws.userId, false);

      ws.isTyping.forEach((timeout) => clearTimeout(timeout));
      ws.isTyping.clear();

      if (ws.currentRoom) {
        this.broadcastToRoom(ws.currentRoom, {
          type: WebSocketMessageType.USER_STATUS,
          payload: {
            userId: ws.userId,
            status: "offline",
            username: ws.username,
            roomId: ws.currentRoom,
          },
        });
        ws.currentRoom = null;
      }
    } catch (error) {
      console.log("Error in handleDisconnect:", error);
    }
  }

  private async updateUserStatus(userId: string, isOnline: boolean) {
    try {
      await prisma.user.update({
        where: { id: userId },
        data: { isOnline },
      });
    } catch (error) {
      console.log("Error updating user status:", error);
    }
  }

  private async broadcastToRoom(
    roomId: string,
    message: WebSocketMessage,
    excludeUserIds: string[] = []
  ) {
    try {
      const roomMembers = await RoomService.getRoomMembers(roomId);

      const onlineRoomMemberIds = roomMembers
        .filter((member) => member.user.isOnline)
        .map((member) => member.user.id);

      this.clients.forEach((client, userId) => {
        if (
          client.readyState === WebSocket.OPEN &&
          onlineRoomMemberIds.includes(userId) &&
          !excludeUserIds.includes(userId) &&
          client.currentRoom === roomId
        ) {
          client.send(JSON.stringify(message));
        }
      });
    } catch (error) {
      console.error("Error broadcasting to room:", error);
    }
  }

  public getWSServer() {
    return this.wss;
  }
}

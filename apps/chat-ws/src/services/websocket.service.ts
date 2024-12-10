import WebSocket, { WebSocketServer } from "ws";
import { AuthenticatedWebSocket } from "../types/websocket";
import { WebSocketMessage, WebSocketMessageType } from "@repo/common/types";
import { RoomService } from "./room.service";
import { MessageService } from "./message.service";
import * as schemas from '@repo/common/schema';
import { ErrorHandler } from "../utils/error-handler";
import prisma from "@repo/db/client";

export class WebSocketService {
    private wss: WebSocketServer;
    private clients: Map<string, AuthenticatedWebSocket>;

    constructor(){
        this.wss = new WebSocketServer({noServer: true});
        this.clients = new Map();
        // this.setupHeartbeat();
    }
}
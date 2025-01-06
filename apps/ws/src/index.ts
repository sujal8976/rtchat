import { createServer } from "http";
import { parse } from "url";
import { AuthService } from "./services/auth.service";
import { WebSocketService } from "./services/websocket.service";
import { AuthenticatedWebSocket } from "./types/websocket";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5000;
const wsService = new WebSocketService();
const server = createServer();

server.on("upgrade", async (request, socket, head) => {
  const { query } = parse(request.url || "", true);
  const token = query.token as string;

  if (!token) {
    socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
    socket.destroy();
    return;
  }

  const userData = await AuthService.validateToken(token);
  if (!userData?.userId && !userData?.username) {
    socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
    socket.destroy();
    return;
  }

  wsService.getWSServer().handleUpgrade(request, socket, head, (ws) => {
    const authenticatedWs = ws as AuthenticatedWebSocket;
    wsService.handleConnection(authenticatedWs, userData);
  });
});

server.listen(PORT, () => {
  console.log(`WebSocket server is running on port ${PORT}`);
});

import { WebSocket } from "ws";
import { WebSocketMessageType, ErrorResponse } from "@repo/common/types";

export class ErrorHandler {
  static sendError(
    ws: WebSocket,
    code: string,
    message: string,
    details?: any
  ) {
    const errorMessage: ErrorResponse = {
      code,
      message,
      details,
    };

    try {
      ws.send(
        JSON.stringify({
          type: WebSocketMessageType.ERROR,
          payload: errorMessage,
        })
      );
    } catch (error) {
      console.log("Error sending error message: ", error);
    }
  }
}

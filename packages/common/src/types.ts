export enum WebSocketMessageType {
  JOIN_ROOM = "JOIN_ROOM",
  LEAVE_ROOM = "LEAVE_ROOM",
  SEND_MESSAGE = "SEND_MESSAGE",
  PRIVATE_MESSAGE = "PRIVATE_MESSAGE",
  USER_STATUS = "USER_STATUS",
  TYPING_START = "TYPING_START",
  TYPING_STOP = "TYPING_STOP",
  ERROR = "ERROR",
}

export interface WebSocketMessage {
  type: WebSocketMessageType;
  payload: any;
}

export interface ErrorResponse {
  code: string;
  message: string;
  details?: string;
}

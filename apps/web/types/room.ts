export interface Room {
  id: string;
  name: string;
  description: string;
  isPrivate: boolean;
}

export interface UserJoinedRoom {
  room: Room;
}

export interface RoomWrapper {
  room: Room;
}

export interface JoinedRoomsResponse {
  rooms: RoomWrapper[];
  error?: string;
}

export interface SearchRoomsResponse {
  rooms: Room[];
  error?: string;
}

export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 400
  ) {
    super(message);
    this.name = "AppError";
  }
}

// Specific error types
export class RoomError extends AppError {
  constructor(message: string, code: string) {
    super(message, code, 400);
    this.name = "RoomError";
  }
}

export class AuthError extends AppError {
  constructor(message: string = "Authentication required") {
    super(message, "UNAUTHORIZED", 401);
    this.name = "AuthError";
  }
}

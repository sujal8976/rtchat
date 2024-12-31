export interface Room {
  id: string;
  name: string;
  description: string | null;
}

export interface UserJoinedRoom {
  room: Room;
}

export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 400
  ) {
    super(message);
    this.name = 'AppError';
  }
}

// Specific error types
export class RoomError extends AppError {
  constructor(message: string, code: string) {
    super(message, code, 400);
    this.name = 'RoomError';
  }
}

export class AuthError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 'UNAUTHORIZED', 401);
    this.name = 'AuthError';
  }
}
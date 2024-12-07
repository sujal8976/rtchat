export interface Room {
  id: string;
  name: string;
  description: string | null;
}

export interface UserJoinedRoom {
  room: Room;
}
export interface ChatUser {
  id: string;
  username: string;
  isOnline: boolean;
  image: string | null;
}

export interface ChatRoom {
  id: string;
  name: string;
  description: string | null;
  createdBy: string;
  users: ChatUser[];
  isPrivate: boolean;
  roomImage: string | null;
}

export interface ChatMessage {
  id: string;
  content: string;
  userId: string;
  roomId: string;
  createdAt: Date;
  user: {
    username: string;
  };
}

export interface MessageResponse {
  messages: ChatMessage[];
  totalCount: number;
  currentPage: number;
  totalPage: number;
  hasMore: boolean;
  error? : string;
}

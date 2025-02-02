export interface ChatMessage {
  id: string;
  message: string | null;
  userId: string;
  roomId: string;
  createdAt: Date;
  user: {
    username: string;
  };
  tempId?: string;
  mediaType: "image" | "video" | null;
  mediaUrl: string | null;
}

export interface MessageResponse {
  messages: ChatMessage[];
  totalCount: number;
  currentPage: number;
  totalPage: number;
  hasMore: boolean;
  error?: string;
}

export interface MediaFile {
  file: File;
  type: "image" | "video";
  preview: string;
}
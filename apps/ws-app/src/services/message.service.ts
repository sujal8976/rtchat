import prisma from "@repo/db/client";

export class MessageService {
  static async createMessage(
    userId: string,
    roomId: string,
    message: string | null,
    mediaType: "image" | "video" | null,
    mediaUrl: string | null
  ) {
    try {
      return await prisma.message.create({
        data: {
          message,
          userId,
          roomId,
          mediaType,
          mediaUrl,
        },
        include: {
          user: {
            select: {
              username: true,
            },
          },
        },
      });
    } catch (error) {
      console.log("Error creating message: ", error);
      throw new Error("Failed to create message");
    }
  }

  static async getRecentMessage(roomId: string, limit = 50) {
    try {
      return await prisma.message.findMany({
        where: { roomId },
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              username: true,
            },
          },
        },
      });
    } catch (error) {
      console.log("Error fetching recent messages:", error);
      throw new Error("Failed to fetch messages");
    }
  }
}

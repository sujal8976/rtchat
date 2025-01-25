import prisma from "@repo/db/client";

export class RoomService {
  static async validateRoomAccess(
    userId: string,
    roomId: string
  ): Promise<boolean> {
    try {
      const roomUser = await prisma.roomUser.findUnique({
        where: {
          userId_roomId: {
            userId,
            roomId,
          },
        },
      });
      return !!roomUser
    } catch (error) {
      console.log("Error validating room access:", error);
      return false;
    }
  }

  static async addUserToRoom(
    userId: string,
    roomId: string
  ): Promise<"alreadyJoined" | "joined" | "failed"> {
    try {
      const existingEntry = await prisma.roomUser.findFirst({
        where: { userId, roomId },
        select: {
          id: true,
          room: {
            select: {
              isPrivate: true,
            },
          },
        },
      });

      if (existingEntry?.id) {
        return "alreadyJoined";
      }

      if (existingEntry?.room.isPrivate) {
        const isUserJoined = await this.validateRoomAccess(userId, roomId);
        return isUserJoined ? "alreadyJoined" : "failed";
      }

      await prisma.roomUser.create({
        data: {
          userId,
          roomId,
        },
      });

      return "joined";
    } catch (error) {
      console.error("Error adding user to room:", error);
      return "failed";
    }
  }

  static async removeUserFromRoom(
    userId: string,
    roomId: string
  ): Promise<boolean> {
    try {
      await prisma.roomUser.delete({
        where: {
          userId_roomId: {
            userId,
            roomId,
          },
        },
      });
      return true;
    } catch (error) {
      console.log("Error removing user from room:", error);
      return false;
    }
  }

  static async getRoomMembers(roomId: string): Promise<GetRoomMembersProps[]> {
    try {
      const roomUsers = await prisma.roomUser.findMany({
        where: { roomId },
        select: {
          user: {
            select: {
              id: true,
              isOnline: true,
            },
          },
        },
      });
      return roomUsers;
    } catch (error) {
      console.error("Error getting room members:", error);
      return [];
    }
  }
}

interface GetRoomMembersProps {
  user: { id: string; isOnline: boolean };
}

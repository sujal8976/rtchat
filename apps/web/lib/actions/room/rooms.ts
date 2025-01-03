"use server";

import prisma from "@repo/db/client";
import { Room, UserJoinedRoom } from "../../../types/room";
import { auth } from "../../auth";
import { ChatRoom } from "../../../types/chat";

interface CreateRoomResponse {
  success: boolean;
  roomId?: string;
  error?: {
    code: string;
    message: string;
  };
}

export async function createRoom(
  name: string,
  description: string
): Promise<CreateRoomResponse> {
  const session = await auth();

  if (!session || !session.user?.id) {
    return {
      success: false,
      error: {
        code: "UNAUTHORIZED",
        message: "Please log in to create a room",
      },
    };
  }

  try {
    const existingRoom = await prisma.room.findFirst({
      where: { name },
    });

    if (existingRoom) {
      return {
        success: false,
        error: {
          code: "ROOM_EXISTS",
          message: "A room with this name already exists",
        },
      };
    }

    const newRoom = await prisma.room.create({
      data: {
        name,
        description,
        createdBy: session.user.id,
        users: {
          create: {
            userId: session.user.id,
          },
        },
      },
    });

    return {
      success: true,
      roomId: newRoom.id,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: "DATABASE_ERROR",
        message: "Failed to create the room. Please try again later.",
      },
    };
  }
}

export async function getRooms(query: string): Promise<Room[] | undefined> {
  try {
    if (query.length > 1) {
      const session = await auth();
      if (!session?.user && !session?.user?.id)
        throw new Error("User not logged in");

      const rooms = await prisma.room.findMany({
        where: {
          name: {
            contains: query,
            mode: "insensitive",
          },
        },
        select: {
          id: true,
          name: true,
          description: true,
        },
      });

      return rooms;
    } else return [];
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong");
  }
}

export async function fetchJoinedRooms(): Promise<
  UserJoinedRoom[] | undefined
> {
  try {
    const session = await auth();
    if (!session?.user && !session?.user?.id)
      throw new Error("User not logged in");

    const rooms = await prisma.roomUser.findMany({
      where: { userId: session.user.id },
      select: {
        room: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
    });

    return rooms;
  } catch (error) {
    console.log(error);
    throw new Error("failed to fetch joined rooms");
  }
}

export async function getRoom(roomId: string): Promise<ChatRoom | undefined> {
  const session = await auth();
  if (!session?.user && !session?.user?.id)
    throw new Error("User not logged in");

  if (!roomId) throw new Error("Provide Room Id");

  try {
    const room = await prisma.room.findUnique({
      where: {
        id: roomId,
      },
      select: {
        id: true,
        name: true,
        description: true,
        createdBy: true,
        users: {
          select: {
            user: {
              select: {
                username: true,
                id: true,
                isOnline: true,
              },
            },
          },
        },
        messages: true,
      },
    });
    if (!room) return undefined;

    const transformedRoom: ChatRoom = {
      id: room.id,
      name: room.name,
      description: room.description,
      createdBy: room.createdBy,
      users: room.users.map((u) => u.user), // Flatten the nested structure
      messages: room.messages,
    };
    return transformedRoom;
  } catch (error) {
    throw new Error("Failed to fetch Room");
  }
}

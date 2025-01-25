"use server";

import prisma from "@repo/db/client";
import { auth } from "../../auth";
import { ChatRoom } from "../../../types/chat";
import { compare, hash } from "bcryptjs";

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
  description: string,
  isPrivate: boolean,
  code: string | null
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

    const hashedCode = code ? (isPrivate ? await hash(code, 10) : null) : null;

    const newRoom = await prisma.room.create({
      data: {
        name,
        description,
        createdBy: session.user.id,
        isPrivate,
        privateCode: hashedCode,
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

export async function getRoom(roomId: string): Promise<ChatRoom | undefined> {
  const session = await auth();
  if (!session?.user || !session.user.id) {
    throw new Error("User not logged in");
  }

  if (!roomId) {
    throw new Error("Provide Room Id");
  }

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
        isPrivate: true,
        users: {
          select: {
            user: {
              select: {
                id: true,
                username: true,
                isOnline: true,
              },
            },
          },
        },
      },
    });

    if (!room) {
      return undefined;
    }

    const isUserInRoom = room.users.some(
      (u) => u.user.id === session?.user?.id
    );

    if (!isUserInRoom && room.isPrivate) {
      throw new Error("ACCESS_DENIED");
    }

    const transformedRoom: ChatRoom = {
      id: room.id,
      name: room.name,
      description: room.description,
      createdBy: room.createdBy,
      users: room.users.map((u) => u.user),
      isPrivate: room.isPrivate,
    };

    return transformedRoom;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to fetch Room");
  }
}

export async function validatePrivateRoomCode(
  roomId: string,
  privateCode: string
) {
  try {
    const room = await prisma.room.findUnique({
      where: {
        id: roomId,
      },
      select: {
        privateCode: true,
        isPrivate: true,
      },
    });

    if (!room || !room.isPrivate || !room.privateCode) {
      return false;
    }

    return await compare(privateCode, room.privateCode);
  } catch (error) {
    throw new Error("Failed to validate private key");
  }
}

export async function addUserToRoom(roomId: string) {
  try {
    const session = await auth();
    if (!session?.user || !session.user.id)
      throw new Error("User is not logged in");

    await prisma.roomUser.create({
      data: {
        userId: session.user.id,
        roomId,
      },
    });
    return "added";
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to add user to room"
    );
  }
}

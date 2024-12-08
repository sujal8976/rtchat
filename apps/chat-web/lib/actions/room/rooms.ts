"use server";

import prisma from "@repo/db/client";
import { Room, UserJoinedRoom } from "../../../types/room";
import { auth } from "../../auth";

export async function createRoom(name: string, description: string) {
  const session = await auth();
  if (!session?.user && !session?.user?.id) {
    throw new Error("User not logged in");
  }

  try {
    const room = await prisma.room.findFirst({
      where: {
        name,
      },
    });
    if (room) {
      throw new Error("Already room exists with this name");
    }

    const newRoom = await prisma.room.create({
      data: {
        name,
        description,
        createdBy: session.user.id as string,
        users: {
          create: {
            userId: session.user.id as string,
          },
        },
      },
    });

    return {
      success: true,
      roomId: newRoom.id
    };
  } catch (error) {
    throw new Error('Failed to create Room')
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

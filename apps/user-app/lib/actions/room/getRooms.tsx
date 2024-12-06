"use server";

import prisma from "@repo/db/client";
import { Room, UserJoinedRoom } from "../../../types/room";
import { auth } from "../../auth";

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

import { NextResponse } from "next/server";
import { auth } from "../../../../lib/auth";
import prisma from "@repo/db/client";

export const GET = auth(async function GET(req) {
  if (!req.auth || !req.auth.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const searchParams = req.nextUrl.searchParams;

  const roomId = searchParams.get("roomId");

  if (!roomId) {
    return NextResponse.json(
      { error: "Room ID is required to search for messages." },
      { status: 400 }
    );
  }

  const roomUser = await prisma.roomUser.findUnique({
    where: {
      userId_roomId: {
        userId: req.auth.user.id,
        roomId,
      },
    },
  });

  if (!roomUser) {
    return NextResponse.json(
      { error: "You not have the access for this room." },
      { status: 401 }
    );
  }

  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "40");
  const skip = (page - 1) * limit;

  try {
    const [messages, totalMessages] = await prisma.$transaction([
      prisma.message.findMany({
        where: {
          roomId: roomId,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: limit,
        skip,
        select: {
          id: true,
          content: true,
          roomId: true,
          userId: true,
          createdAt: true,
          user: {
            select: {
              username: true,
            },
          },
        },
      }),
      prisma.message.count({
        where: { roomId },
      }),
    ]);

    return NextResponse.json({
      messages: messages.reverse(),
      totalCount: totalMessages,
      currentPage: page,
      totalPage: Math.ceil(totalMessages / limit),
      hasMore: skip + messages.length < totalMessages,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch Messages" },
      { status: 500 }
    );
  }
});

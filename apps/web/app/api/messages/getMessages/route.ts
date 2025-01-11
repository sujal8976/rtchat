import { NextResponse } from "next/server";
import { auth } from "../../../../lib/auth";
import prisma from "@repo/db/client";

export const GET = auth(async function GET(req) {
  if (!req.auth) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const searchParams = req.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "40");
  const roomId = searchParams.get("roomId");
  const skip = (page - 1) * limit;

  if (!roomId) {
    return NextResponse.json(
      { error: "Room ID is required to search for messages." },
      { status: 400 }
    );
  }

  try {
    const [messages, totalMessages] = await prisma.$transaction([
      prisma.message.findMany({
        where: {
          roomId: roomId,
        },
        orderBy:{
          createdAt: 'desc'
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
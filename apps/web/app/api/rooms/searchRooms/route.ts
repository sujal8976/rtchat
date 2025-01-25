import { NextResponse } from "next/server";
import { auth } from "../../../../lib/auth";
import prisma from "@repo/db/client";

export const GET = auth(async function GET(req) {
  if (!req.auth) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  const searchParams = req.nextUrl.searchParams;
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json(
      { error: "Room search query not given" },
      { status: 200 }
    );
  }
  try {
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
        isPrivate: true
      },
    });

    return NextResponse.json({ rooms }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch rooms" },
      { status: 500 }
    );
  }
});

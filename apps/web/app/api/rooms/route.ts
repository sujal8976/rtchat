import prisma from "@repo/db/client";
import { auth } from "../../../lib/auth";
import { NextResponse } from "next/server";

export const GET = auth(async function GET(req) {
  if (!req.auth) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  try {
    const searchParams = req.nextUrl.searchParams;
    const query = searchParams.get("query");

    const rooms = await prisma.room.findMany({
      where: {
        name: {
          contains: query ? query : "",
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        name: true,
        description: true,
      },
    });

    if (!rooms) {
      return NextResponse.json({ error: "No rooms founds" }, { status: 404 });
    }

    return NextResponse.json({ rooms }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went werong" },
      { status: 500 }
    );
  }
});

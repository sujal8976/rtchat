import prisma from "@repo/db/client";
import { hash } from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

type RegisterRequestBody = {
  username: string;
  email: string;
  password: string;
  image?: string;
};

export async function POST(req: NextRequest) {
  try {
    const body: RegisterRequestBody = await req.json();

    if (!body.email || !body.username || !body.password) {
      return NextResponse.json(
        { error: "Provide all fields" },
        { status: 400 }
      );
    }

    const { username, email, password, image } = body;

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          error:
            existingUser.email === email
              ? "Email already in use"
              : "Username already in use",
        },
        { status: 400 }
      );
    }

    const hashedPassword = await hash(password, 10);

    await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        image: image || null,
      },
    });

    return NextResponse.json(
      {
        message: "User created successfully",
      },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

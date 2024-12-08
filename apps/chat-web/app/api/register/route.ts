import prisma from "@repo/db/client";
import { hash } from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

type RegisterRequestBody = {
  username: string;
  email: string;
  password: string;
};

export async function POST(req: NextRequest) {
  try {
    const body: RegisterRequestBody = await req.json();

    if (!body.email || !body.username || !body.password) {
      return NextResponse.json(
        { message: "Provide all fields" },
        { status: 400 }
      );
    }

    const { username, email, password } = body;

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          message:
            existingUser.email === email
              ? "Email already in use"
              : "Username already in use",
        },
        { status: 400 }
      );
    }

    const hashedPassword = await hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        message: "User created successfully",
        user,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Registration Error:", err);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

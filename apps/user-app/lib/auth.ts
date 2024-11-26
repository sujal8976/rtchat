import prisma from "@repo/db/client";
import { compare } from "bcrypt";
import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",

      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        const email = credentials.email as string | undefined;
        const password = credentials.password as string | undefined;

        if (!email || !password) {
          throw new CredentialsSignin("Provide email and password");
        }

        const user = await prisma.user.findUnique({
          where: {
            email,
          },
        });

        if (!user) {
          throw new CredentialsSignin("No User found");
        }

        const isPasswordValid = await compare(password, user.password);

        if (!isPasswordValid) {
          throw new CredentialsSignin("Invalid Password");
        }

        return {
          username: user.username,
          email: user.email,
          id: user.id,
          createdAt: user.createdAt,
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_URL || "secret",
});

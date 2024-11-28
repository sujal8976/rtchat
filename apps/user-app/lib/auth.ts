import prisma from "@repo/db/client";
import { compare } from "bcryptjs";
import NextAuth, { CredentialsSignin, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET || "secret",
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
          throw new Error("Provide email and password");
        }

        try {
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
            id: user.id,
            username: user.username,
            email: user.email,
          };
        } catch (error) {
          throw new Error("Something went wrong, SignIn failes");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({
      token,
      user,
    }: {
      token: JWT;
      user?: User & { username?: string };
    }) {
      if (user && user.username) token.username = user.username;
      return token;
    },
    async session({ session, token, user }: any) {
      if (session && session.user) {
        session.user.id = token.sub;
        session.user.usename = token.username as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
  trustHost: true,
});

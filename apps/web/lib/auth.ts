import prisma from "@repo/db/client";
import { compare } from "bcryptjs";
import NextAuth, { CredentialsSignin, Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";
import { JWTPayload, SignJWT, importJWK } from "jose";

const generateUUID = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const getSecretKey = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret || typeof secret !== "string") {
    throw new Error("JWT_SECRET is not configured");
  }

  // Convert string secret to Uint8Array
  return new TextEncoder().encode(secret);
};

const generateToken = async (payload: JWTPayload) => {
  const secretKey = await getSecretKey();

  const jwt = await new SignJWT({
    ...payload,
    iat: Math.floor(Date.now() / 1000),
    jti: generateUUID(),
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("365d")
    .sign(secretKey); // Use the Uint8Array secret directly

  return jwt;
};

export interface CustomUser extends User {
  username?: string;
  accessToken?: string;
}

export interface CustomJWT extends JWT {
  accessToken?: string;
}

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
          return null
        }

        try {
          const user = await prisma.user.findUnique({
            where: {
              email,
            },
          });

          if (!user) {
            throw new CredentialsSignin("Password or Email is wrong.")
          }

          const isPasswordValid = await compare(password, user.password);

          if (!isPasswordValid) {
            throw new CredentialsSignin("Password or Email is wrong.")
          }

          return {
            id: user.id,
            username: user.username,
            email: user.email,
          };
        } catch (error) {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: CustomJWT; user?: CustomUser }) {
      if (user) {
        const customToken = await generateToken({
          sub: user.id,
          username: user.username,
        });

        token.accessToken = customToken;
        token.username = user.username;
      }

      return token;
    },
    async session({ session, token, user }: any) {
      if (session && session.user) {
        session.user.id = token.sub;
        session.user.username = token.username as string;
        session.user.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
  trustHost: true,
});

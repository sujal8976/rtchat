"use client";

import { redirect } from "next/navigation";
import { signIn } from "next-auth/react";

export async function loginUser(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    redirect("/auth/login?error=Please provide both email and password");
  }

  try {
    const response = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (response?.ok) {
      // Refresh the session on the server
      await fetch("/api/auth/session", { cache: "no-cache" });
      redirect("/chat");
    } else {
      redirect("/auth/login?error=Invalid credentials");
    }
  } catch (err) {
    redirect("/auth/login?error=Something went wrong. Please try again.");
  }
}

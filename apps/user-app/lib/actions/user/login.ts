"use server";

import { redirect } from "next/navigation";
import { signIn } from "../../auth";

export async function loginUser(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    throw new Error("PRovide all fields");
  }

  try {
    await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
  } catch (err) {
    console.log(err);
  }

  redirect("/chat")
}

"use server";

import { redirect } from "next/navigation";
import { signIn } from "../../auth";
import { revalidatePath } from "next/cache";

export async function loginUser(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    redirect("/auth/login?error=Please provide both email and password");
  }

  try {
    await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
  } catch (err) {
    if (err instanceof Error) {
      if (err.name === "CredentialsSignin") {
        redirect("/auth/login?error=Provided Email or Password is wrong.");
      } else {
        redirect("/auth/login?error=Something Went Wrong, Please try again");
      }
    }
  }
  revalidatePath("/");
  redirect("/chat");
}

import { redirect } from "next/navigation";
import { auth } from "../lib/auth";

export default async function Home() {
  const session = await auth();

  if (session?.user && session.user.id) redirect("/chat");
  else {
    redirect("/auth/login");
  }

  return null;
}

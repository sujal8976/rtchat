import prisma from "@repo/db/client";
import { str } from "./new";

async function dbCall() {
  const users = await prisma.user.findMany();
  console.log(users);
}
console.log(str);
dbCall();

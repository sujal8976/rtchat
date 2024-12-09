import prisma from "@repo/db/client";

async function dbCall() {
  const users = await prisma.user.findMany();
  console.log(users);
}

dbCall();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.message.deleteMany({});
  await prisma.roomUser.deleteMany({});
  await prisma.room.deleteMany({});
  await prisma.user.deleteMany({});

  console.log("🗑️  Deleted existing data");

  // Test the simple hash/unhash
  const testPassword = "password123";
  const hashedPassword =
    "$2a$10$TmnA286.bblIXfMrgvS67uGRV2MgJ0RF5g8R7d1AVXosMd46MZfu2";
  console.log("Original password:", testPassword);
  console.log("Hashed password:", hashedPassword);
  console.log("Unhashed password:", testPassword);
  console.log("-------------------");

  // Create users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: "john@example.com",
        username: "john_doe",
        password: hashedPassword,
        isOnline: true,
        lastPing: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        email: "jane@example.com",
        username: "jane_smith",
        password: hashedPassword,
        isOnline: false,
        lastPing: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        email: "bob@example.com",
        username: "bob_wilson",
        password: hashedPassword,
        isOnline: true,
        lastPing: new Date(),
      },
    }),
  ]);

  console.log("\n👥 Created Users:");
  users.forEach((user) => {
    console.log(`
        ID: ${user.id}
        Username: ${user.username}
        Email: ${user.email}
        Online Status: ${user.isOnline ? "🟢 Online" : "⚪ Offline"}
        Last Ping: ${user.lastPing}
        Created At: ${user.createdAt}
        ------------------------`);
  });

  // Create rooms
  const rooms = await Promise.all([
    prisma.room.create({
      data: {
        name: "General",
        description: "General discussion room",
        createdBy: users[0].id,
        isPrivate: false,
      },
    }),
    prisma.room.create({
      data: {
        name: "Tech Talk",
        description: "Technology discussion room",
        createdBy: users[1].id,
        isPrivate: true,
        privateCode: "TECH123",
      },
    }),
  ]);

  console.log("\n🏠 Created Rooms:");
  rooms.forEach((room) => {
    console.log(`
        Name: ${room.name}
        Description: ${room.description}
        Created By: ${users.find((u) => u.id === room.createdBy)?.username}
        Private: ${room.isPrivate ? "🔒 Yes" : "🔓 No"}
        ${room.privateCode ? `Private Code: ${room.privateCode}` : ""}
        ------------------------`);
  });

  // Add users to rooms
  const roomUsers = await Promise.all([
    // Add all users to General room
    ...users.map((user) =>
      prisma.roomUser.create({
        data: {
          userId: user.id,
          roomId: rooms[0].id,
        },
      })
    ),
    // Add John and Jane to Tech Talk
    prisma.roomUser.create({
      data: {
        userId: users[0].id,
        roomId: rooms[1].id,
      },
    }),
    prisma.roomUser.create({
      data: {
        userId: users[1].id,
        roomId: rooms[1].id,
      },
    }),
  ]);

  // Create some messages
  const messages = await Promise.all([
    prisma.message.create({
      data: {
        message: "Welcome to the General room!",
        userId: users[0].id,
        roomId: rooms[0].id,
      },
    }),
    prisma.message.create({
      data: {
        message: "Hey everyone!",
        userId: users[1].id,
        roomId: rooms[0].id,
      },
    }),
    prisma.message.create({
      data: {
        message: "Let's talk about the latest tech news",
        userId: users[0].id,
        roomId: rooms[1].id,
      },
    }),
    // Add a message with media
    prisma.message.create({
      data: {
        message: "Check out this image!",
        mediaType: "image",
        mediaUrl: null, // You can add a real URL if needed
        userId: users[2].id,
        roomId: rooms[0].id,
      },
    }),
  ]);

  console.log("\n💬 Created Messages:");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

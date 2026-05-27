import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

await prisma.user.update({
  where: { id: "your-user-id-here" },
  data: { isAdmin: true },
});

await prisma.$disconnect();

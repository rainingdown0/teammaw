"use server";

import { prisma } from "@/lib/prisma";

export async function getUser(team) {
  const user = await prisma.user.findUnique({
    where: {
      id: team.userId,
    },
    select: {
      username: true,
    },
  });

  return user;
}

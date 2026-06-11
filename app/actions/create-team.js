"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export async function createTeamAction() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("You must be logged in to create a team.");
  }

  const newTeam = await prisma.team.create({
    data: {
      userId: session.user.id,
      name: "New team",
    },
  });

  redirect(`/teams?open=${newTeam.id}`);
}

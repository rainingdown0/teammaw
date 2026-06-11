"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function deleteTeamAction(teamId) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("You must be logged in to delete a team.");
    }

    const team = await prisma.team.findUnique({
      where: { id: teamId },
      select: { userId: true },
    });

    if (!team) {
      throw new Error("Team not found.");
    }

    if (team.userId !== session.user.id) {
      throw new Error("You do not have permission to delete this team.");
    }

    await prisma.team.delete({
      where: {
        id: teamId,
      },
    });

    revalidatePath("/teams");

    return { success: true };
  } catch (error) {
    console.error("Failed to delete team:", error);
    return { success: false, error: error.message };
  }
}

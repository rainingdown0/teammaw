"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { updateTag } from "next/cache";

export async function createTeam() {
  let newTeamId = null;
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const newTeam = await prisma.team.create({
      data: {
        userId: session.user.id,
        name: "New team",
      },
    });
    newTeamId = newTeam.id;
  } catch (error) {
    console.error("Failed:", error);
    return { success: false, error: error.message };
  }

  if (newTeamId) redirect(`/teams?open=${newTeamId}`);
}

export async function duplicateTeam(team) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const generatedName = `Copy of ${team.name}`;
    const safeName = generatedName.slice(0, 64);

    const newTeam = await prisma.team.create({
      data: {
        userId: session.user.id,
        replicaId: team.replicaId,
        name: safeName,
        notes: team.notes,
        isLegal: team.isLegal,
        format: team.format,
      },
    });
    redirect(`/teams?open=${newTeam.id}`);
  } catch (error) {
    console.error("Failed:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteTeam(teamId) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const team = await prisma.team.findUnique({
      where: { id: teamId },
      select: { userId: true },
    });
    if (!team) {
      throw new Error("Team not found");
    }
    if (team.userId !== session.user.id) {
      throw new Error("No permission");
    }

    await prisma.team.delete({
      where: { id: teamId },
    });

    updateTag(`team-${teamId}`);
    return { success: true };
  } catch (error) {
    console.error("Failed:", error);
    return { success: false, error: error.message };
  }
}

export async function updateTeam(teamId, teamData) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    // 1. Verify ownership safely
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      select: { userId: true },
    });

    if (!team) throw new Error("Team not found");
    if (team.userId !== session.user.id) throw new Error("No permission");

    // 2. The Ultimate Single-Query Update
    // This executes in ONE network round-trip.
    await prisma.team.update({
      where: { id: teamId },
      data: {
        name: teamData.name,
        replicaId: teamData.replicaId,
        isLegal: teamData.isLegal,
        // Delete all old pokemon, then seamlessly insert the fresh array
        pokemon: {
          deleteMany: {},
          create: teamData.pokemon.map((mon) => {
            const { id, teamId: frontendTeamId, moves, ...monData } = mon;
            const safeMoves = moves || [];

            return {
              ...monData,
              // Nested create for moves
              moves: {
                create: safeMoves.map((m) => ({
                  moveId: m.moveId,
                  slot: m.slot,
                })),
              },
            };
          }),
        },
      },
    });

    // 3. Clear cache and finish
    updateTag(`team-${teamId}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to update team:", error);
    return { success: false, error: error.message };
  }
}

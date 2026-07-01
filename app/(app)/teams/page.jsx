import { Team } from "@/app/ui/team";
import { CreateTeamButton } from "@/app/ui/util-button";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function Page() {
  const session = await auth();
  const teams = session?.user?.id
    ? await prisma.team.findMany({
        where: { userId: session.user.id },
        select: {
          id: true,
          userId: true,
          replicaId: true,
          name: true,
          notes: true,
          isPublic: true,
          isLegal: true,
          format: true,
          createdAt: true,
          updatedAt: true,
          likes: true, // <-- ADD THIS to display likes in the modal header
          pokemon: {
            select: {
              id: true,
              pokemonId: true, // <-- ADD all the missing stat fields below
              nickname: true,
              ability: true,
              nature: true,
              item: true,
              slot: true,
              evHp: true,
              evAtk: true,
              evDef: true,
              evSpa: true,
              evSpd: true,
              evSpe: true,
              moves: {
                select: {
                  moveId: true,
                  slot: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      })
    : [];
  return (
    <>
      {session ? (
        <>
          <div className="sticky top-0 flex w-full items-center justify-between">
            <div className="flex min-w-0 flex-1 items-center gap-8">
              <span className="cursor-pointer font-bold text-base-text-darker transition hover:text-base-text-dark">
                All teams
              </span>
              <span className="cursor-pointer font-bold text-base-text-darker transition hover:text-base-text-dark">
                Local teams
              </span>
              <span className="cursor-pointer font-bold text-base-text-darker transition hover:text-base-text-dark">
                Server teams
              </span>
            </div>
            <CreateTeamButton />
          </div>
          <div className="flex h-full flex-col gap-4 overflow-scroll pb-32">
            {teams.length > 0 ? (
              teams.map((team) => <Team key={team.id} team={team} />)
            ) : (
              <span className="flex h-full w-full items-center justify-center text-center text-base-text-darker">
                {"You don't have any teams"}
              </span>
            )}
          </div>
        </>
      ) : (
        <>
          <h1 className="text-hero font-bold">
            {"Seems like you're not signed in"}
          </h1>
          <Link href={"/sign-in"} className="font-medium">
            <span className="text-accent">Sign in</span>
            {" to view your teams"}
          </Link>
        </>
      )}
    </>
  );
}

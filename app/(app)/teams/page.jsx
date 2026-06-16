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
        orderBy: { createdAt: "desc" }, // Shows newest teams at the top
      })
    : [];
  return (
    <>
      {session ? (
        <>
          <div className="sticky top-0 flex w-full items-center justify-between">
            <div></div>
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

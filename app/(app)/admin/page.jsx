import AppStatCard from "@/app/ui/app-stats";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

async function getBackendStats() {
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const [users, teams, teamsToday] = await Promise.all([
    prisma.user.count(),
    prisma.team.count(),
    prisma.team.count({
      where: {
        createdAt: {
          gte: twentyFourHoursAgo,
        },
      },
    }),
  ]);

  return { users, teams, teamsToday };
}

export default async function Page() {
  const session = await auth();

  if (!session?.user?.isAdmin) {
    return <p className="p-4">bro is not admin nah get out 💀💀💀😳</p>;
  }

  const { users, teams, teamsToday } = await getBackendStats();

  return (
    <div className="flex w-full gap-4 p-4">
      <AppStatCard title="Users" value={users} />
      <AppStatCard title="Teams" value={teams} />
      <AppStatCard title="Teams created today" value={teamsToday} />
    </div>
  );
}

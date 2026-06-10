import { DiscoverTeam } from "@/app/ui/team";
import MOCKTEAMS from "@/data/MOCKTEAMS.json";

export default function Page() {
  return (
    <>
      {MOCKTEAMS.filter((team) => team.isPublic).map((team) => (
        <DiscoverTeam key={team.id} team={team} />
      ))}
    </>
  );
}

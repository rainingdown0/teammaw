import { Team } from "@/app/ui/team";
import MOCKTEAMS from "@/data/MOCKTEAMS.json";

export default function Page() {
  return (
    <>
      {MOCKTEAMS.filter((team) => team.isPublic).map((team) => (
        <Team key={team.id} team={team} isDiscover={true} />
      ))}
    </>
  );
}

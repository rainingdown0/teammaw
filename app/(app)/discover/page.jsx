import { Team } from "@/app/ui/team";

export default function Page() {
  return (
    <div className="flex h-full flex-col gap-4 overflow-scroll pb-32">
      {/* {MOCKTEAMS.filter((team) => team.isPublic).map((team) => (
        <Team key={team.id} team={team} isDiscover={true} />
      ))} */}
    </div>
  );
}

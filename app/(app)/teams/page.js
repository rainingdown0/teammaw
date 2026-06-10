import { Team } from "@/app/ui/team";
import Button from "@/app/ui/button";
import MOCKTEAMS from "@/data/MOCKTEAMS.json";

export default function Page() {
  return (
    <>
      <div className="sticky top-0 flex w-full items-center justify-between">
        <div></div>
        <Button text={"Build new"} color={"primary"} />
      </div>
      <div className="flex h-full flex-col gap-4 overflow-scroll">
        {MOCKTEAMS.map((team) => (
          <Team key={team.id} team={team} />
        ))}
      </div>
    </>
  );
}

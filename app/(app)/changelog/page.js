import ChangelogCard from "@/app/ui/changelog-card";
import Button from "@/app/ui/button";

export default function Page() {
  const isAdmin = false; // Placeholder for admin check

  return (
    <>
      <div className="sticky top-0">
        {isAdmin && <Button text={"Write new"} />}
      </div>
      <div className="flex min-h-0 flex-1 flex-col items-center gap-8 overflow-y-scroll">
        <ChangelogCard
          title={"random bs instead of actual announcement"}
          content={"this is text content"}
          date={"May 22, 2026"}
        />
        <ChangelogCard
          title={"Announcement"}
          content={"this is text content"}
          date={"May 19, 2026"}
        />
        <Button text={"Load More"} color={"ghost"} />
      </div>
    </>
  );
}

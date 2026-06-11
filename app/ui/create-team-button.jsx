"use client";

import { useTransition } from "react";
import Button from "@/app/ui/button";
import { createTeamAction } from "@/app/actions/create-team";

export function CreateTeamButton() {
  const [isPending, startTransition] = useTransition();

  const handleCreate = () => {
    startTransition(() => {
      createTeamAction();
    });
  };

  return (
    <div
      onClick={handleCreate}
      className={isPending ? "cursor-not-allowed" : ""}
    >
      <Button
        disabled={isPending}
        text={isPending ? "Creating..." : "New team"}
        color={"primary"}
      />
    </div>
  );
}

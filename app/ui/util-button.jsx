"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Button from "@/app/ui/button";
import Icon from "@/app/ui/icons";
import { createTeam, deleteArticle } from "@/lib/actions";

export function CreateTeamButton() {
  const [isPending, startTransition] = useTransition();
  const handleCreate = () => {
    startTransition(() => {
      createTeam();
    });
  };
  return (
    <div
      onClick={handleCreate}
      className={isPending ? "cursor-not-allowed" : ""}
    >
      <Button disabled={isPending} text={"New team"} color={"primary"} />
    </div>
  );
}

export function DeleteArticleButton({ articleId }) {
  const [isPending, startTransition] = useTransition();
  const handleDelete = () => {
    startTransition(() => {
      deleteArticle(articleId);
    });
  };
  return (
    <div
      onClick={handleDelete}
      className={isPending ? "cursor-not-allowed" : ""}
    >
      <Button disabled={isPending} text={"Delete"} />
    </div>
  );
}

export function GoBackButton() {
  const router = useRouter();
  return (
    <div
      onClick={router.back}
      className="flex w-fit cursor-pointer gap-2 rounded-full bg-base-base px-6 py-4 transition hover:bg-base-light"
    >
      <Icon name="back" />
      <span className="font-semibold">Go back</span>
    </div>
  );
}

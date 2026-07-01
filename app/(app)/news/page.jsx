"use client";

import { useSession } from "next-auth/react";
import { NewsList } from "@/app/ui/news";
import Button from "@/app/ui/button";
import NewsCreateModal from "@/app/ui/modals/news-create-modal";
import { useState } from "react";

export default function Page() {
  const { data: session, status } = useSession();
  const isAdmin = session?.user?.isAdmin || false;
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (status === "loading")
    return (
      <span className="flex h-full w-full items-center justify-center text-center text-base-text-darker">
        {"Loading articles..."}
      </span>
    );

  return (
    <>
      <div className="sticky top-0">
        <div
          className="flex h-full w-full justify-end"
          onClick={() => setIsModalOpen(true)}
        >
          {/* <div className="flex w-fit items-center gap-8"></div> */}
          {isAdmin && <Button text={"Write new"} />}
        </div>
      </div>
      <NewsList />

      {isModalOpen && <NewsCreateModal onClose={() => setIsModalOpen(false)} />}
    </>
  );
}

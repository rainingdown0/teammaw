"use client";

import AppStatCard from "@/app/ui/app-stats";
import { useSession } from "next-auth/react";

export default function Page() {
  const { data: session } = useSession();
  if (!session?.user?.isAdmin) {
    return <p>bro is not admin nah get out 💀💀💀😳</p>;
  }
  return (
    <>
      <div className="flex w-full gap-4 p-4">
        <AppStatCard title="Users" />
        <AppStatCard title="Teams" />
        <AppStatCard title="Teams created today" />
      </div>
    </>
  );
}

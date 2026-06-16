"use client";

import { useSession } from "next-auth/react";

export default function Page() {
  const { data: session } = useSession();
  if (!session?.user?.isAdmin) {
    return <p>bro is not admin nah get out 💀💀💀😳</p>;
  }
  return <h1>this is admin only</h1>;
}

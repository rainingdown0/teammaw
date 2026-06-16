"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Page() {
  const { data: session } = useSession();
  const username = session?.user?.username;

  const date = new Date(session?.user?.createdAt);
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  console.log(session);

  return (
    <>
      {session ? (
        <>
          <h1 className="text-hero font-bold">{`@${username}`}</h1>
          <p>Member since {formattedDate}</p>
        </>
      ) : (
        <>
          <h1 className="text-hero font-bold">
            {"Seems like you're not signed in"}
          </h1>
          <Link href={"/sign-in"} className="font-medium">
            <span className="text-accent">Sign in</span>
            {" to view your profile"}
          </Link>
        </>
      )}
    </>
  );
}

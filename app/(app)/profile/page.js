import { auth } from "@/auth";
import Link from "next/link";

export default async function Page() {
  const session = await auth();
  const username = session?.user?.username;

  return (
    <>
      {session && (
        <>
          <h1 className="text-hero font-bold">{`@${username}`}</h1>
          <p>Member since {session.user.createdAt}</p>
        </>
      )}
      {!session && (
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

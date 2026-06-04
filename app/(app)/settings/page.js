import { auth, signOut } from "@/auth";
import Button from "@/app/ui/button";
import Link from "next/link";

export default async function Page() {
  const session = await auth();
  if (!session) {
    return (
      <>
        <h1 className="text-hero font-bold">
          {"Seems like you're not signed in"}
        </h1>
        <Link href={"/sign-in"} className="font-medium">
          <span className="text-accent">Sign in</span>
          {" to view your profile"}
        </Link>
      </>
    );
  }

  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/sign-in" });
      }}
    >
      <Button type="submit" text="Log out" />
    </form>
  );
}

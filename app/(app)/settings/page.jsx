import { auth, signOut } from "@/auth";
import Button from "@/app/ui/button";

export default async function Page() {
  const session = await auth();

  return (
    <>
      <h1>this is settings</h1>
      {session && (
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/sign-in" });
          }}
        >
          <Button type="submit" text="Log out" />
        </form>
      )}
    </>
  );
}

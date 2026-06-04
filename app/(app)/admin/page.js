import { auth } from "@/auth";

export default async function Page() {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return <h1 className="font-medium">Hello. ur not admin. plz go away</h1>;
  }

  return <h1>this is admin only</h1>;
}

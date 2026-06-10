import { auth } from "@/auth";

export default async function Page() {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return <p>bro is not admin nah get out 💀💀💀😳</p>;
  }

  return <h1>this is admin only</h1>;
}

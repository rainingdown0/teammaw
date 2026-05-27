import { auth } from "@/auth";

export default async function Page() {
  const session = await auth();
  const username = session?.user?.username || "Unknown User";
  return (
    <>
      <span className="text-hero font-bold">{`@${username}`}</span>
    </>
  );
}

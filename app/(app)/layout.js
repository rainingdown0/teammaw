import { auth } from "@/auth";
import Navbar from "@/app/ui/navbar";

export default async function Layout({ children }) {
  const session = await auth();

  return (
    <div className="flex h-dvh w-dvw">
      <Navbar session={session} />
      <div className="flex h-full min-w-0 flex-1 flex-col gap-8 overflow-y-scroll px-4 pt-8">
        {children}
      </div>
    </div>
  );
}

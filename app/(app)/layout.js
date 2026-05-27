import Image from "next/image";
import Link from "next/link";
import Navbar from "@/app/ui/navbar";

export default function Layout({ children }) {
  return (
    <div className="flex h-dvh w-dvw">
      <Navbar />
      <div className="flex h-full min-w-0 flex-1 flex-col gap-8 overflow-y-scroll p-8">
        {children}
      </div>
    </div>
  );
}

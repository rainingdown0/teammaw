import Image from "next/image";
import Button from "@/app/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex h-dvh flex-col items-center justify-center gap-16">
      <Image
        className="h-auto"
        src="/maw.png"
        width={64}
        height={64}
        alt="Teammaw logo"
        loading="eager"
      />
      <div className="flex flex-col items-center">
        <span className="leading-none font-extrabold text-accent">TEAMMAW</span>
        <h1 className="text-hero leading-none font-extrabold text-primary">
          BUILD. SHARE. DISCOVER.
        </h1>
      </div>
      <p className="font-medium">The Pokémon VGC teambuilding community</p>
      <Link href={"/sign-in"}>
        <Button text="Start Building" />
      </Link>
    </div>
  );
}

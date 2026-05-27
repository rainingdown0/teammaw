"use client";

import Image from "next/image";
import Link from "next/link";
import Icon from "./icons";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export default function Navbar() {
  const isAdmin = false; // TODO: Get this from the user session

  return (
    <nav className="flex h-full w-60 flex-col justify-between gap-16 p-8 pb-16">
      <div className="flex h-fit w-full flex-col gap-4">
        <NavLogo />
        <NavTab name={"Home"} link={"/home"} icon={"home"} />
        <NavTab name={"Discover"} link={"/discover"} icon={"compass"} />
        <NavTab name={"Profile"} link={"/profile"} icon={"user"} />
        <NavTab name={"My Teams"} link={"/teams"} icon={"box"} />
        <NavTab name={"Build"} link={"/teams"} icon={"add"} />
      </div>
      <div className="flex h-fit w-full flex-col gap-4">
        {isAdmin && <NavTab name={"Admin"} link={"/admin"} icon={"terminal"} />}
        <NavTab name={"Donate"} link={"/donation"} icon={"donation"} />
        <NavTab name={"Changelog"} link={"/changelog"} icon={"megaphone"} />
        <NavTab name={"Settings"} link={"/settings"} icon={"gear"} />
      </div>
    </nav>
  );
}

export function NavTab({ name, link, icon }) {
  const pathname = usePathname();
  return (
    <Link
      href={link}
      className={clsx(
        "group flex items-center gap-3 py-3 transition",
        pathname.startsWith(link) && !["Build"].includes(name)
          ? "text-base-text"
          : "text-base-text-darker hover:text-base-text-dark",
      )}
    >
      <Icon
        name={icon}
        color={clsx(
          "transition",
          pathname.startsWith(link) && !["Build"].includes(name)
            ? "fill-base-text"
            : "fill-base-text-darker group-hover:fill-base-text-dark",
        )}
      />
      <span className="text-normal font-semibold">{name}</span>
    </Link>
  );
}

export function NavLogo() {
  return (
    <Link href={"/home"} className="flex h-fit w-40 font-extrabold">
      <p className="text-xs leading-0 text-accent">
        TEAM
        <br />
        <span className="text-4xl text-primary">MAW</span>
      </p>
      <Image
        className="relative right-8 bottom-3 h-auto"
        src="/maw.png"
        width={32}
        height={32}
        alt="Mega Mawile"
        loading="eager"
      />
    </Link>
  );
}

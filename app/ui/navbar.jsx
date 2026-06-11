"use client";

import Image from "next/image";
import Link from "next/link";
import Icon from "./icons";
import { usePathname } from "next/navigation";
import { createTeamAction } from "@/app/actions/create-team";
import clsx from "clsx";

export default function Navbar({ session }) {
  const isLoggedIn = !!session?.user;
  const isAdmin = session?.user?.isAdmin || false;

  return (
    <nav className="flex h-full w-60 flex-col justify-between gap-16 p-8 pb-16">
      <div className="flex h-fit w-full flex-col gap-4">
        <NavLogo />
        <NavTab name={"Home"} link={"/home"} icon={"home"} />
        <NavTab name={"Discover"} link={"/discover"} icon={"compass"} />
        <NavTab name={"Profile"} link={"/profile"} icon={"user"} />
        <NavTab name={"My Teams"} link={"/teams"} icon={"box"} />
        <div
          onClick={isLoggedIn ? createTeamAction : null}
          className={clsx(
            "group flex items-center gap-3 py-3 text-base-text-darker transition",
            isLoggedIn
              ? "cursor-pointer hover:text-base-text-dark"
              : "cursor-not-allowed",
          )}
        >
          <Icon
            name="add"
            color={clsx(
              "fill-base-text-darker",
              isLoggedIn ? "group-hover:fill-base-text-dark" : "",
            )}
          />
          <span className="font-semibold">Build</span>
        </div>
      </div>
      <div className="flex h-fit w-full flex-col gap-4">
        {!isLoggedIn && (
          <NavTab name={"Sign in"} link={"/sign-in"} icon={"login"} />
        )}
        {isAdmin && <NavTab name={"Admin"} link={"/admin"} icon={"terminal"} />}
        <NavTab name={"News"} link={"/news"} icon={"megaphone"} />
        <NavTab name={"About"} link={"/about"} icon={"info"} />
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
        pathname.startsWith(link)
          ? "text-base-text"
          : "text-base-text-darker hover:text-base-text-dark",
      )}
    >
      <Icon
        name={icon}
        color={clsx(
          pathname.startsWith(link)
            ? "fill-base-text"
            : "fill-base-text-darker group-hover:fill-base-text-dark",
        )}
      />
      <span className="font-semibold">{name}</span>
    </Link>
  );
}

export function NavLogo() {
  return (
    <Link
      href={"/home"}
      className="group flex h-fit w-40 font-extrabold transition"
    >
      <p className="text-xs leading-0 tracking-tighter text-accent transition group-hover:text-accent-light">
        TEAM
        <br />
        <span className="text-4xl tracking-tighter text-primary transition group-hover:text-primary-light">
          MAW
        </span>
      </p>
      <Image
        className="relative right-9 bottom-1.5 h-8 w-8"
        src="/maw.png"
        width={32}
        height={32}
        alt="Mega Mawile"
        loading="eager"
      />
    </Link>
  );
}

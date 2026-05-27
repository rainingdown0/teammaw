"use client";

import Link from "next/link";
import LoginField from "@/app/ui/login-field";
import { signIn } from "next-auth/react";

export default function Page() {
  async function handleSubmit(e) {
    e.preventDefault();
    const form = new FormData(e.target);
    await signIn("credentials", {
      username: form.get("username"),
      password: form.get("password"),
      redirectTo: "/",
    });
  }

  return (
    <div className="mt-16 flex min-h-dvh flex-col items-center justify-start gap-8">
      <h1 className="text-hero font-extrabold text-primary">SIGN IN</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <LoginField
          name={"username"}
          label="Username"
          placeholder={"Enter your username"}
        />
        <LoginField
          name={"password"}
          label="Password"
          placeholder={"Enter your password"}
          password
        />
        <div className="flex w-full items-center justify-center text-normal font-medium">
          <Link href={"/sign-up"}>
            {"Don't have an account? "}
            <span className="text-accent">Sign up</span>
          </Link>
        </div>
        <button
          type="submit"
          className="flex w-full cursor-pointer items-center justify-center rounded-full bg-primary py-4 text-normal font-semibold text-primary-text transition hover:bg-primary-light"
        >
          Confirm
        </button>
      </form>
    </div>
  );
}

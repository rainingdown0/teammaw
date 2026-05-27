"use client";

import Link from "next/link";
import LoginField from "@/app/ui/login-field";
import { signUp } from "@/app/actions/auth";

export default function Page() {
  async function handleSubmit(e) {
    e.preventDefault();
    await signUp(new FormData(e.target));
  }

  return (
    <div className="mt-16 flex min-h-dvh flex-col items-center justify-start gap-8">
      <h1 className="text-hero font-extrabold text-primary">SIGN UP</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <LoginField
          name={"username"}
          label="Username"
          placeholder={"Set your username"}
        />
        <LoginField
          name={"password"}
          label="Password"
          placeholder={"Set your password"}
          password
        />
        <LoginField
          name={"confirmPassword"}
          label="Confirm Password"
          placeholder={"Confirm your password"}
          password
        />
        <div className="flex w-full items-center justify-center text-normal font-medium">
          <Link href={"/sign-in"}>
            {"Already have an account? "}
            <span className="text-accent">Sign in</span>
          </Link>
        </div>
        <button
          type="submit"
          className="flex w-full cursor-pointer items-center justify-center rounded-full bg-primary py-4 text-normal font-semibold text-primary-text transition hover:bg-primary-light"
        >
          Create Account
        </button>
      </form>
    </div>
  );
}

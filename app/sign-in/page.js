"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import LoginField from "@/app/ui/login-field";
import { signIn } from "next-auth/react";

export default function Page() {
  const [errors, setErrors] = useState({});
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors({});
    setIsPending(true);

    const form = new FormData(e.target);

    const response = await signIn("credentials", {
      username: form.get("username"),
      password: form.get("password"),
      redirect: false,
    });

    if (response?.error) {
      // Attach the generic error to the password field
      setErrors({ password: "Invalid username or password." });
      setIsPending(false);
    } else if (response?.ok) {
      router.push("/home");
      router.refresh();
    }
  }

  return (
    <div className="mt-16 flex min-h-dvh w-full flex-col items-center justify-start gap-8">
      <h1 className="text-hero font-extrabold text-primary">SIGN IN</h1>

      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-xl flex-col gap-8"
      >
        <LoginField
          name="username"
          label="Username"
          placeholder="Enter your username"
          error={errors?.username}
        />
        <LoginField
          name="password"
          label="Password"
          placeholder="Enter your password"
          password
          error={errors?.password}
        />

        <div className="flex w-full items-center justify-center font-medium text-normal">
          <Link href="/sign-up">
            {"Don't have an account? "}
            <span className="text-accent">Sign up</span>
          </Link>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="flex w-full cursor-pointer items-center justify-center rounded-full bg-primary py-4 font-semibold text-normal text-primary-text transition hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isPending ? "Signing in..." : "Confirm"}
        </button>
      </form>
    </div>
  );
}

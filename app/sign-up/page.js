"use client";

import { useState } from "react";
import Link from "next/link";
import LoginField from "@/app/ui/login-field";
import { signUp } from "@/app/actions/auth";

export default function Page() {
  // 1. Change from a string to an object
  const [errors, setErrors] = useState({});
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors({}); // Clear old errors
    setIsPending(true);

    const formData = new FormData(e.target);
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    // 2. Client-side check mapping to the specific field
    if (password !== confirmPassword) {
      setErrors({ confirmPassword: ["Passwords do not match."] });
      setIsPending(false);
      return;
    }

    const result = await signUp(formData);

    // 3. Catch the structured errors object
    if (result?.errors) {
      setErrors(result.errors);
      setIsPending(false);
    }
  }

  return (
    <div className="mt-16 flex min-h-dvh w-full flex-col items-center justify-start gap-8">
      <h1 className="text-hero font-extrabold text-primary">SIGN UP</h1>

      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-xl flex-col gap-8"
      >
        {/* 4. Pass the specific error array's first item to each field */}
        <LoginField
          name="username"
          label="Username"
          placeholder="Set your username"
          error={errors?.username?.[0]}
        />
        <LoginField
          name="password"
          label="Password"
          placeholder="Set your password"
          password
          error={errors?.password?.[0]}
        />
        <LoginField
          name="confirmPassword"
          label="Confirm Password"
          placeholder="Confirm your password"
          password
          error={errors?.confirmPassword?.[0]}
        />

        <div className="flex w-full items-center justify-center font-medium text-normal">
          <Link href="/sign-in">
            {"Already have an account? "}
            <span className="text-accent">Sign in</span>
          </Link>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="flex w-full cursor-pointer items-center justify-center rounded-full bg-primary py-4 font-semibold text-normal text-primary-text transition hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isPending ? "Creating Account..." : "Create Account"}
        </button>
      </form>
    </div>
  );
}

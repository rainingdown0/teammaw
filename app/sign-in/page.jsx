"use client";

import { useState } from "react";
import Link from "next/link";
import LoginField from "@/app/ui/login-field";
import { signInAction } from "@/lib/actions/auth-actions";

export default function Page() {
  const [errors, setErrors] = useState({});
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors({});
    setIsPending(true);

    const formData = new FormData(e.target);

    try {
      const result = await signInAction(formData);

      if (result?.errors) {
        if (result.errors.form) {
          setErrors({ password: result.errors.form });
        } else {
          setErrors(result.errors);
        }
      }
    } catch (err) {
      console.error("Sign in failed:", err);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="mt-16 flex min-h-dvh w-full flex-col items-center justify-start gap-8">
      <h1 className="text-hero font-extrabold tracking-tighter text-primary">
        SIGN IN
      </h1>

      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-xl flex-col gap-8"
      >
        <LoginField
          name="username"
          label="Username"
          placeholder="Enter your username"
          error={errors?.username?.[0]}
        />
        <LoginField
          name="email"
          label="Email"
          placeholder="Enter your email"
          error={errors?.email?.[0]}
        />
        <LoginField
          name="password"
          label="Password"
          placeholder="Enter your password"
          password
          error={errors?.password?.[0]}
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
          className="flex w-full cursor-pointer items-center justify-center rounded-full bg-primary py-4 font-semibold text-primary-text transition hover:bg-primary-light disabled:cursor-not-allowed disabled:bg-primary-dark disabled:text-primary-lighter"
        >
          Confirm
        </button>
      </form>
    </div>
  );
}

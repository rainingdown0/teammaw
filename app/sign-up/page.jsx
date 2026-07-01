"use client";

import { useState } from "react";
import Link from "next/link";
import LoginField from "@/app/ui/login-field";
import { signUpAction } from "@/lib/actions/auth-actions";

export default function Page() {
  const [errors, setErrors] = useState({});
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors({});
    setIsPending(true);

    const formData = new FormData(e.target);
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    if (password !== confirmPassword) {
      setErrors({ confirmPassword: ["Password does not match"] });
      setIsPending(false);
      return;
    }

    try {
      const result = await signUpAction(formData);

      console.log("Server Action Raw Result:", result);

      if (result?.errors) {
        setErrors(result.errors);
      } else if (result?.errors) {
        setErrors({ username: [result.errors] });
      }
    } catch (err) {
      console.error("Server Action crashed completely:", err);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="mt-16 flex min-h-dvh w-full flex-col items-center justify-start gap-8">
      <h1 className="text-hero font-extrabold tracking-tighter text-primary">
        SIGN UP
      </h1>

      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-xl flex-col gap-8"
      >
        <LoginField
          name="username"
          label="Username"
          placeholder="Set your username"
          error={errors?.username?.[0]}
        />
        <LoginField
          name="email"
          label="Email"
          placeholder="Set your email"
          error={errors?.email?.[0]}
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
          className="flex w-full cursor-pointer items-center justify-center rounded-full bg-primary py-4 font-semibold text-primary-text transition hover:bg-primary-light disabled:cursor-not-allowed disabled:bg-primary-dark disabled:text-primary-lighter"
        >
          Create account
        </button>
      </form>
    </div>
  );
}

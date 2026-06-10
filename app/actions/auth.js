"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signIn } from "@/auth";
import { z } from "zod";

const SignUpSchema = z.object({
  username: z
    .string({ required_error: "Username is empty" })
    .trim()
    .min(1, "Username is empty")
    .min(4, "Username is too short")
    .max(30, "Username is too long")
    .regex(/^[a-zA-Z0-9_]+$/, "Invalid username"),
  password: z
    .string({ required_error: "Password is empty" })
    .min(1, "Password is empty")
    .min(8, "Password is too short")
    .max(100, "Password is too long"),
});

const SignInSchema = z.object({
  username: z
    .string({ required_error: "Username is empty" })
    .trim()
    .min(1, "Username is empty"),
  password: z
    .string({ required_error: "Password is empty" })
    .min(1, "Password is empty"),
});

export async function signUpAction(formData) {
  const username = formData.get("username");
  const password = formData.get("password");

  const validatedFields = SignUpSchema.safeParse({ username, password });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const hashed = await bcrypt.hash(password, 12);

    await prisma.user.create({
      data: {
        username: validatedFields.data.username,
        password: hashed,
      },
    });
  } catch (error) {
    if (error.code === "P2002") {
      return {
        errors: { username: ["Username is in use"] },
      };
    }
    return { errors: { form: ["An unexpected error occurred"] } };
  }

  try {
    await signIn("credentials", { username, password, redirectTo: "/home" });
  } catch (error) {
    if (error.name === "AuthError" || error.type === "CredentialsSignin") {
      return {
        errors: { form: ["Account created, but automatic sign-in failed"] },
      };
    }
    throw error;
  }
}

export async function signInAction(formData) {
  const username = formData.get("username");
  const password = formData.get("password");

  const validatedFields = SignInSchema.safeParse({ username, password });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    await signIn("credentials", { username, password, redirectTo: "/home" });
  } catch (error) {
    if (error.name === "AuthError" || error.type === "CredentialsSignin") {
      return {
        errors: { form: ["Invalid username or password"] },
      };
    }
    throw error;
  }
}

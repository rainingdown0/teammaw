"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signIn } from "@/auth";
import z from "zod";

export async function getUser(userId) {
  if (!userId) return null;
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      username: true,
    },
  });
  return user;
}

const SignUpSchema = z.object({
  username: z
    .string({ error: "Username is empty" })
    .trim()
    .min(1, "Username is empty")
    .min(4, "Username is too short")
    .max(30, "Username is too long")
    .regex(/^[a-zA-Z0-9_]+$/, "Invalid username"),
  email: z
    .string({ required_error: "Email is empty" })
    .trim()
    .min(1, "Email is empty")
    .pipe(z.email({ error: "Invalid email address" })),
  password: z
    .string({ required_error: "Password is empty" })
    .min(1, "Password is empty")
    .min(8, "Password is too short")
    .max(100, "Password is too long"),
});

const SignInSchema = z.object({
  email: z
    .string({ required_error: "Email is empty" })
    .trim()
    .min(1, "Email is empty")
    .pipe(z.email({ error: "Invalid email address" })),
  password: z
    .string({ required_error: "Password is empty" })
    .min(1, "Password is empty"),
});

export async function signUpAction(formData) {
  const username = formData.get("username");
  const email = formData.get("email");
  const password = formData.get("password");
  const validatedFields = SignUpSchema.safeParse({ username, email, password });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: validatedFields.data.email },
          { username: validatedFields.data.username },
        ],
      },
      select: { email: true, username: true },
    });

    if (existingUser) {
      if (existingUser.email === validatedFields.data.email) {
        return { errors: { email: ["Email is in use"] } };
      }
      if (existingUser.username === validatedFields.data.username) {
        return { errors: { username: ["Username is in use"] } };
      }
    }

    const hashed = await bcrypt.hash(password, 12);

    await prisma.user.create({
      data: {
        username: validatedFields.data.username,
        email: validatedFields.data.email,
        password: hashed,
      },
    });
  } catch (error) {
    console.error("Sign up failure:", error);
    return { errors: { form: ["An unexpected error occurred"] } };
  }

  try {
    await signIn("credentials", { email, password, redirectTo: "/home" });
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
  const email = formData.get("email");
  const password = formData.get("password");
  const validatedFields = SignInSchema.safeParse({ email, password });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    await signIn("credentials", { email, password, redirectTo: "/home" });
  } catch (error) {
    if (error.name === "AuthError" || error.type === "CredentialsSignin") {
      return {
        errors: { form: ["Invalid email or password"] },
      };
    }
    throw error;
  }
}

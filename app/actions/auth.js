"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signIn } from "@/auth";
import { z } from "zod";

const SignUpSchema = z.object({
  username: z
    .string()
    .min(4, "Username must be at least 4 characters.")
    .max(30, "Username cannot exceed 30 characters.")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores.",
    ),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(100, "Password is too long."),
});

export async function signUp(formData) {
  const username = formData.get("username");
  const password = formData.get("password");

  const validatedFields = SignUpSchema.safeParse({ username, password });

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
        errors: { username: ["This username is already taken."] },
      };
    }
    return { errors: { form: ["An unexpected error occurred."] } };
  }

  await signIn("credentials", { username, password, redirectTo: "/home" });
}

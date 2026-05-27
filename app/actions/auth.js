"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signIn } from "@/auth";

export async function signUp(formData) {
  const username = formData.get("username");
  const password = formData.get("password");

  const hashed = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: { username, password: hashed },
  });

  await signIn("credentials", { username, password, redirectTo: "/home" });
}

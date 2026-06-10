import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({
            username: z.string().min(4).max(30),
            password: z.string().min(8),
          })
          .safeParse(credentials);

        if (!parsedCredentials.success) return null;

        const { username, password } = parsedCredentials.data;

        const user = await prisma.user.findUnique({
          where: { username },
        });

        if (!user) return null;

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) return null;

        return user;
      },
    }),
  ],
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) return url;
      return baseUrl + "/home";
    },

    async jwt({ token, user }) {
      if (user) {
        token.username = user.username;
        token.isAdmin = user.isAdmin;
        token.createdAt = user.createdAt;
      }
      return token;
    },

    async session({ session, token }) {
      if (token?.username) {
        session.user.username = token.username;
        session.user.isAdmin = token.isAdmin;
        session.user.createdAt = token.createdAt;
      }
      return session;
    },
  },
});

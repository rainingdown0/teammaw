import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { username: credentials.username },
        });

        if (!user) return null;

        const passwordMatch = await bcrypt.compare(
          credentials.password,
          user.password,
        );

        if (!passwordMatch) return null;

        // Return the user object containing the username from Prisma
        return user;
      },
    }),
  ],
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      return baseUrl + "/home";
    },

    // 1. Grab the username from the authorized user object and save it to the JWT
    async jwt({ token, user }) {
      if (user) {
        token.username = user.username;
      }
      return token;
    },

    // 2. Read the username from the JWT and expose it to your frontend session
    async session({ session, token }) {
      if (token?.username) {
        session.user.username = token.username;
      }
      return session;
    },
  },
});

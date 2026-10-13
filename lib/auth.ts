import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

/**
 * Sign-in abuse limits. These values are documented in README.md ("Sign-in
 * lockout"); keep both in sync.
 */
export const LOGIN_MAX_ATTEMPTS = 5;
export const LOGIN_LOCK_WINDOW_MS = 15 * 60 * 1000;

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),

  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase() },
        });

        // A removed or disabled account cannot sign in. The result is the same as a
        // wrong credential so the response does not reveal whether the account exists.
        if (!user || !user.isActive || user.deletedAt) return null;

        const now = new Date();

        // Refuse inside the lockout window, even with the correct credential.
        if (user.lockedUntil && user.lockedUntil > now) return null;

        // A lock that has expired no longer counts against the account.
        const previousAttempts = user.lockedUntil ? 0 : user.loginAttempts;

        const valid = await bcrypt.compare(credentials.password, user.password);

        if (!valid) {
          const failedAttempts = previousAttempts + 1;

          await prisma.user.update({
            where: { id: user.id },
            data: {
              loginAttempts: failedAttempts,
              lockedUntil:
                failedAttempts >= LOGIN_MAX_ATTEMPTS
                  ? new Date(now.getTime() + LOGIN_LOCK_WINDOW_MS)
                  : null,
            },
          });

          return null;
        }

        // Successful sign-in clears the counters and records when it happened.
        await prisma.user.update({
          where: { id: user.id },
          data: { loginAttempts: 0, lockedUntil: null, lastLogin: now },
        });

        return {
          id: user.id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],

  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },

    session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
  },

  pages: {
    signIn: "/auth/login",
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";

const allowedUsers = (process.env.ALLOWED_GITHUB_USERS || "")
  .split(",")
  .map((u) => u.trim().toLowerCase())
  .filter(Boolean);

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GitHub],
  session: { strategy: "jwt" },
  callbacks: {
    async signIn({ user, profile }) {
      if (allowedUsers.length > 0) {
        const username = (profile?.login as string | undefined)?.toLowerCase();
        if (!username || !allowedUsers.includes(username)) return false;
      }

      if (user.email) {
        await db
          .insert(users)
          .values({
            email: user.email,
            name: user.name ?? null,
            image: user.image ?? null,
          })
          .onConflictDoUpdate({
            target: users.email,
            set: {
              name: user.name ?? null,
              image: user.image ?? null,
              updatedAt: new Date(),
            },
          });
      }

      return true;
    },

    async jwt({ token, trigger }) {
      if ((trigger === "signIn" || !token.dbId) && token.email) {
        const dbUser = await db.query.users.findFirst({
          where: eq(users.email, token.email),
        });
        if (dbUser) {
          token.dbId = dbUser.id;
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (token.dbId) {
        session.user.id = token.dbId as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});

import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

const allowedUsers = (process.env.ALLOWED_GITHUB_USERS || "")
  .split(",")
  .map((u) => u.trim().toLowerCase())
  .filter(Boolean);

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GitHub],
  callbacks: {
    async signIn({ profile }) {
      if (allowedUsers.length === 0) return true;
      const username = (profile?.login as string | undefined)?.toLowerCase();
      return !!username && allowedUsers.includes(username);
    },
  },
  pages: {
    signIn: "/login",
  },
});

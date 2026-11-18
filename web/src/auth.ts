import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { upsertGoogleUser } from "@/lib/users";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  callbacks: {
    // Only allow Google accounts with a verified email.
    async signIn({ account, profile }) {
      return (
        account?.provider === "google" &&
        !!profile?.email &&
        profile.email_verified === true
      );
    },
    // Runs at sign-in: save the user in MySQL and keep their id in the token.
    async jwt({ token, account, profile }) {
      if (account && profile?.sub && profile.email) {
        const user = await upsertGoogleUser({
          googleId: profile.sub,
          email: profile.email,
          name: profile.name,
          image: profile.picture,
        });
        token.uid = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = String(token.uid ?? "");
      session.user.role = (token.role as "user" | "admin" | undefined) ?? "user";
      return session;
    },
  },
});

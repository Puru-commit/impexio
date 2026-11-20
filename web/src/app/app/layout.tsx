import { Suspense } from "react";
import { connection } from "next/server";
import { auth, signOut } from "@/auth";
import { AppShell } from "@/components/app/app-shell";
import { isAdmin } from "@/lib/admin";

// Everything under /app needs a signed-in user. The proxy already redirects
// visitors who are not signed in; this reads who is signed in.
async function Gate({ children }: { children: React.ReactNode }) {
  await connection();
  const session = await auth();
  if (!session?.user) return null;

  let admin = false;
  try {
    admin = await isAdmin(Number(session.user.id));
  } catch {
    // Database offline: the app still opens, without the admin link.
  }

  async function logout() {
    "use server";
    await signOut({ redirectTo: "/" });
  }

  return (
    <AppShell user={session.user} logout={logout} isAdmin={admin}>
      {children}
    </AppShell>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-paper">
      <Suspense fallback={null}>
        <Gate>{children}</Gate>
      </Suspense>
    </div>
  );
}

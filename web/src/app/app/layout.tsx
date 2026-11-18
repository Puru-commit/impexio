import { Suspense } from "react";
import { connection } from "next/server";
import { auth } from "@/auth";

// Everything under /app needs a signed-in user.
async function Gate({ children }: { children: React.ReactNode }) {
  await connection();
  const session = await auth();
  if (!session?.user) return null; // the proxy already redirects
  return <>{children}</>;
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

import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminGuard } from "@/components/admin/admin-guard";
import { listUsers } from "@/lib/admin";
import { UsersTable } from "../users-table";

export const metadata: Metadata = { title: "Customers — IMPEXIO Admin" };

async function List() {
  const users = await listUsers(500);
  return (
    <div className="mx-auto max-w-7xl px-5 py-10 md:py-14">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#9a6f1f]">Admin</p>
      <h1 className="mt-2 text-3xl font-semibold md:text-4xl">Customers</h1>
      <p className="mt-2 text-sm text-muted-foreground">Click a customer&apos;s name to see everything about them.</p>
      <div className="mt-8"><UsersTable users={users} /></div>
    </div>
  );
}

export default function Page() {
  return <Suspense fallback={null}><AdminGuard><List /></AdminGuard></Suspense>;
}

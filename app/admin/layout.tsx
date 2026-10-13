// app/admin/layout.tsx
//
// The path guard (proxy.ts) only answers "is there a session at all", so every
// administrative page is additionally checked here against the stored role. Any
// account that is not an administrator is sent to sign-in instead of rendering
// administrative content.
import { redirect } from "next/navigation";

import { AdminLayoutClient } from "@/components/layout/AdminLayoutClient";
import { Toaster } from "@/components/ui/sonner";
import { requireAdmin } from "@/lib/api-error-handler";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    await requireAdmin();
  } catch {
    redirect("/auth/login");
  }

  return (
    <>
      <AdminLayoutClient>{children}</AdminLayoutClient>
      <Toaster />
    </>
  );
}

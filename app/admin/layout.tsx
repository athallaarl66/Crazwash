// src/app/(admin)/layout.tsx
import { AdminLayoutClient } from "@/components/layout/AdminLayoutClient";
import { Toaster } from "@/components/ui/sonner";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AdminLayoutClient>{children}</AdminLayoutClient>
      <Toaster />
    </>
  );
}

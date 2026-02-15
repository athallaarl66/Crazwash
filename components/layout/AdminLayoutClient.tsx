// components/layout/AdminLayoutClient.tsx
"use client";

import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { AdminHeader } from "@/components/layout/AdminHeader";
import { useState } from "react";

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AdminSidebar
        isMobileOpen={isMobileMenuOpen}
        setIsMobileOpen={setIsMobileMenuOpen} // Fix: Match dengan interface AdminSidebar
      />
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-64">
        <AdminHeader onMenuClick={() => setIsMobileMenuOpen(true)} />
        <main className="flex-1 overflow-y-auto bg-muted p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

// src/components/layout/AdminSidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  LogOut,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const menuItems = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Orders",
    href: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    title: "Inventory",
    href: "/admin/inventory",
    icon: Package,
  },
  {
    title: "Customers",
    href: "/admin/customers",
    icon: Users,
  },
];

interface AdminSidebarProps {
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export function AdminSidebar({
  isMobileOpen,
  setIsMobileOpen,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname, setIsMobileOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileOpen]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await signOut({ callbackUrl: "/auth/login" });
  };

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-6 justify-between">
        <Link href="/admin/dashboard" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">SW</span>
          </div>
          <span className="text-lg font-bold">Admin Panel</span>
        </Link>
        {/* Close button for mobile */}
        <button
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="border-t p-4 space-y-2">
        <Link href="/" target="_blank" className="block">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start cursor-pointer"
          >
            <LayoutDashboard className="h-4 w-4 mr-2" />
            Public Site
          </Button>
        </Link>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full justify-start cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50 disabled:cursor-not-allowed"
        >
          <LogOut className="h-4 w-4 mr-2" />
          {isLoggingOut ? "Logging out..." : "Logout"}
        </Button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 z-40 h-screen w-64 border-r bg-white flex-col">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              onClick={() => setIsMobileOpen(false)}
            />

            {/* Sidebar */}
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 z-50 h-screen w-64 border-r bg-white flex flex-col lg:hidden shadow-xl"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
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
import { Loader2 } from "lucide-react";

const menuItems = [
  { title: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { title: "Service", href: "/admin/service", icon: Package },
  { title: "Customers", href: "/admin/customers", icon: Users },
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

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname, setIsMobileOpen]);

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileOpen]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut({ callbackUrl: "/auth/login" });
    } catch (error) {
      console.error("Logout error:", error);
      setIsLoggingOut(false);
    }
  };

  const SidebarContent = () => (
    <>
      <div className="flex h-16 items-center border-b border-border px-6 justify-between bg-card">
        <Link href="/admin/dashboard" className="flex items-center space-x-2">
          <Image
            src="/crazwash.svg"
            alt="Crazwash Admin"
            width={62}
            height={62}
          />
          <span className="text-h6 text-card-foreground">Admin Panel</span>
        </Link>

        <button
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden p-2 hover:bg-muted rounded-lg transition-colors"
          aria-label="Close menu"
        >
          <X className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 p-4 overflow-y-auto bg-card">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg text-body font-medium transition-all duration-200 cursor-pointer",
                isActive
                  ? "bg-primary/10 text-primary shadow-soft"
                  : "text-card-foreground hover:bg-muted hover:text-primary",
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-4 space-y-2 bg-card">
        <Link href="/" target="_blank">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start cursor-pointer text-card-foreground hover:bg-muted hover:text-primary"
            suppressHydrationWarning
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
          className="w-full justify-start cursor-pointer text-destructive hover:text-destructive hover:bg-destructive/10 disabled:opacity-50"
          suppressHydrationWarning
        >
          {isLoggingOut ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <LogOut className="h-4 w-4 mr-2" />
          )}
          {isLoggingOut ? "Logging out..." : "Logout"}
        </Button>
      </div>
    </>
  );

  return (
    <>
      <aside className="hidden lg:flex fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-card flex-col shadow-soft">
        <SidebarContent />
      </aside>

      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-foreground/50 backdrop-blur-sm lg:hidden"
              onClick={() => setIsMobileOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.aside
              className="fixed left-0 top-0 z-50 h-screen w-64 border-r border-border bg-card flex-col lg:hidden shadow-soft-lg"
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

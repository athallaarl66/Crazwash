// components/layout/AdminHeader.tsx
"use client";

import { Bell, Search, Menu, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react"; // ← TAMBAH useEffect

interface AdminHeaderProps {
  onMenuClick: () => void;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

/**
 * How often an open console asks for new notifications. The console has a single
 * operator, so the indicator is eventually consistent within this window instead of
 * holding a websocket open on a serverless host.
 */
const NOTIFICATION_POLL_MS = 15000;

export function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  // Notifications arrive on the server (order creation), so the header refreshes the
  // list on a short interval and whenever the window regains focus. A refused request
  // means the session is gone: the operator is sent to sign-in, not to an API route.
  useEffect(() => {
    let cancelled = false;

    const fetchNotifications = async () => {
      try {
        const res = await fetch("/api/admin/notifications");

        if (res.status === 401) {
          router.replace("/auth/login");
          return;
        }

        if (!res.ok) return;

        const data = await res.json();
        if (cancelled) return;

        setNotifications(
          data.map((n: any) => ({
            id: n.id,
            title: n.title,
            message: n.message,
            timestamp: new Date(n.createdAt).toLocaleString("id-ID"),
            read: n.read,
          })),
        );
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };

    fetchNotifications();

    const interval = setInterval(fetchNotifications, NOTIFICATION_POLL_MS);
    const onFocus = () => fetchNotifications();
    window.addEventListener("focus", onFocus);

    return () => {
      cancelled = true;
      clearInterval(interval);
      window.removeEventListener("focus", onFocus);
    };
  }, [router]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // The console implements order search on its order list page; the header used to
      // push to a cross-entity search route the application never implemented.
      router.push(`/admin/orders?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // ← UPDATE: MARK AS READ WITH API CALL
  const markAsRead = async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "markAsRead", notificationId: id }),
      });
      if (res.status === 401) {
        router.replace("/auth/login");
        return;
      }
      if (res.ok) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
        );
      }
    } catch (error) {
      console.error("Failed to mark as read:", error);
    } finally {
      setLoading(false);
    }
  };

  // ← UPDATE: MARK ALL AS READ WITH API CALL
  const markAllAsRead = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "markAllAsRead" }),
      });
      if (res.status === 401) {
        router.replace("/auth/login");
        return;
      }
      if (res.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      }
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    } finally {
      setLoading(false);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-card px-4 lg:px-6 shadow-soft">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden hover:bg-muted"
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5 text-card-foreground" />
      </Button>

      <div className="flex-1 max-w-md">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-9 text-body bg-card border-border text-card-foreground
                     focus:border-primary focus:ring-2 focus:ring-primary/20
                     placeholder:text-muted-foreground"
          />
        </form>
      </div>


      <div className="flex items-center gap-2 md:gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative hover:bg-muted"
              aria-label="Notifications"
              suppressHydrationWarning
            >
              <Bell className="h-5 w-5 text-card-foreground" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-caption bg-destructive text-destructive-foreground border-0">
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="end">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="font-semibold text-foreground">Notifications</h3>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  disabled={loading}
                >
                  Mark all read
                </Button>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  No notifications
                </div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-4 border-b border-border last:border-0 hover:bg-muted/50 cursor-pointer ${
                      !notif.read ? "bg-primary/5" : ""
                    }`}
                    onClick={() => markAsRead(notif.id)}
                  >
                    <div className="flex items-start gap-3">
                      {!notif.read && (
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-foreground">
                          {notif.title}
                        </p>
                        <p className="text-body-sm text-muted-foreground">
                          {notif.message}
                        </p>
                        <p className="text-caption text-muted-foreground mt-1">
                          {notif.timestamp}
                        </p>
                      </div>
                      {notif.read && (
                        <Check className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </PopoverContent>
        </Popover>

        <div className="flex items-center gap-2 md:gap-3">
          <div className="text-right hidden md:block">
            <p className="text-body font-medium text-card-foreground">
              Crazwash Admin
            </p>
            <p className="text-body-sm text-muted-foreground">
              admin@shoeswash.com
            </p>
          </div>
          <div
            className="relative h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent 
                     flex items-center justify-center ring-2 ring-primary/20"
            style={{ boxShadow: "var(--shadow-md)" }}
          >
            <span className="text-primary-foreground font-semibold text-body tracking-wide">
              Cr
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

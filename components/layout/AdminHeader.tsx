// src/components/layout/AdminHeader.tsx
"use client";

import { Bell, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface AdminHeaderProps {
  onMenuClick: () => void;
}

export function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white px-4 lg:px-6">
      {/* Hamburger Menu - Mobile Only */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onMenuClick}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Search - Hidden on small mobile, visible on tablet+ */}
      <div className="flex-1 max-w-md hidden sm:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Search..."
            className="pl-10 h-9 text-sm"
          />
        </div>
      </div>

      {/* Mobile Search Button */}
      <Button variant="ghost" size="icon" className="sm:hidden">
        <Search className="h-5 w-5" />
      </Button>

      {/* Spacer for mobile */}
      <div className="flex-1 sm:hidden" />

      {/* Right Side */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
            3
          </Badge>
        </Button>

        {/* User Profile */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* User Info - Hidden on mobile */}
          <div className="text-right hidden md:block">
            <p className="text-sm font-medium">Admin User</p>
            <p className="text-xs text-gray-500">admin@shoeswash.com</p>
          </div>
          {/* Avatar */}
          <div className="h-9 w-9 md:h-10 md:w-10 rounded-full bg-blue-600 flex items-center justify-center">
            <span className="text-white font-medium text-sm">A</span>
          </div>
        </div>
      </div>
    </header>
  );
}

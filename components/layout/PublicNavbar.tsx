// src/components/layout/PublicNavbar.tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Menu, X, Shield } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function PublicNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Check if demo mode is enabled
  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <ShoppingBag className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">
              ShoesWash<span className="text-blue-600">.</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link
              href="/"
              className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-all duration-200 cursor-pointer relative group"
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-200"></span>
            </Link>
            <Link
              href="/services"
              className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-all duration-200 cursor-pointer relative group"
            >
              Layanan
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-200"></span>
            </Link>
          </div>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex md:items-center md:space-x-3">
            <Link href="/order" className="cursor-pointer">
              <Button
                size="sm"
                className="cursor-pointer hover:scale-105 transition-transform duration-200"
              >
                Pesan Sekarang
              </Button>
            </Link>

            {/* Conditional Button: Admin Demo or Login */}
            {isDemoMode ? (
              <Link href="/admin/dashboard" className="cursor-pointer">
                <Button
                  variant="outline"
                  size="sm"
                  className="cursor-pointer hover:scale-105 transition-transform duration-200 border-blue-600 text-blue-600 hover:bg-blue-50"
                >
                  <Shield className="h-4 w-4 mr-1.5" />
                  Admin Demo
                </Button>
              </Link>
            ) : (
              <Link href="/auth/login" className="cursor-pointer">
                <Button
                  variant="outline"
                  size="sm"
                  className="cursor-pointer hover:scale-105 transition-transform duration-200"
                >
                  Login
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="md:hidden cursor-pointer hover:bg-gray-100 rounded-lg p-2 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden border-t"
            >
              <div className="py-4 space-y-3">
                <Link
                  href="/"
                  className="block py-2 px-3 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all cursor-pointer"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/services"
                  className="block py-2 px-3 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all cursor-pointer"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Layanan
                </Link>

                <div className="pt-3 space-y-2">
                  <Link
                    href="/order"
                    className="block cursor-pointer"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Button size="sm" className="w-full cursor-pointer">
                      Pesan Sekarang
                    </Button>
                  </Link>

                  {/* Conditional Button: Admin Demo or Login */}
                  {isDemoMode ? (
                    <Link
                      href="/admin/dashboard"
                      className="block cursor-pointer"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full cursor-pointer border-blue-600 text-blue-600 hover:bg-blue-50"
                      >
                        <Shield className="h-4 w-4 mr-1.5" />
                        Admin Demo
                      </Button>
                    </Link>
                  ) : (
                    <Link
                      href="/auth/login"
                      className="block cursor-pointer"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full cursor-pointer"
                      >
                        Login
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}

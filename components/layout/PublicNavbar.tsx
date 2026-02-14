"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function PublicNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card shadow-soft">
      <div className="container-custom">
        <div className="flex h-16 items-center justify-between">
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2 group">
            <Image
              src="/crazwash.svg"
              alt="Crazwash"
              width={42}
              height={42}
              priority
              className="transition-transform group-hover:scale-110 duration-300"
            />
            <span className="text-h5 text-card-foreground">
              Crazwash<span className="text-accent">.</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-body font-medium text-card-foreground hover:text-accent transition-colors"
            >
              Home
            </Link>
            <Link
              href="/services"
              className="text-body font-medium text-card-foreground hover:text-accent transition-colors"
            >
              Layanan
            </Link>
            <Link href="/order">
              <Button
                size="sm"
                className="bg-primary text-primary-foreground hover:bg-accent transition-all duration-300"
              >
                Pesan Sekarang
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button
                variant="outline"
                size="sm"
                className="border-border text-card-foreground hover:bg-muted transition-all duration-300"
              >
                Login Admin
              </Button>
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? (
              <X className="h-6 w-6 text-card-foreground" />
            ) : (
              <Menu className="h-6 w-6 text-card-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-border py-4 space-y-3 overflow-hidden"
            >
              <Link
                href="/"
                className="block px-4 py-2 text-body font-medium text-card-foreground hover:bg-muted rounded-lg transition-colors"
                onClick={() => setOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/services"
                className="block px-4 py-2 text-body font-medium text-card-foreground hover:bg-muted rounded-lg transition-colors"
                onClick={() => setOpen(false)}
              >
                Layanan
              </Link>
              <div className="px-4">
                <Link href="/order" onClick={() => setOpen(false)}>
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-accent">
                    Pesan Sekarang
                  </Button>
                </Link>
              </div>
              <div className="px-4">
                <Link href="/auth/login" onClick={() => setOpen(false)}>
                  <Button
                    variant="outline"
                    className="w-full border-border text-card-foreground hover:bg-muted"
                  >
                    Login Admin
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}

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
    <nav className="sticky top-0 z-50 border-b bg-white">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/crazwash.svg"
              alt="Crazwash"
              width={62}
              height={62}
              priority
            />
            <span className="font-bold text-lg">
              Crazwash<span className="text-blue-600">.</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/">Home</Link>
            <Link href="/services">Layanan</Link>
            <Link href="/order">
              <Button size="sm">Pesan Sekarang</Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="outline" size="sm">
                Login Admin
              </Button>
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden cursor-pointer"
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t py-4 space-y-3"
            >
              <Link href="/">Home</Link>
              <Link href="/services">Layanan</Link>
              <Link href="/order">
                <Button className="w-full">Pesan Sekarang</Button>
              </Link>
              <Link href="/auth/login">
                <Button variant="outline" className="w-full">
                  Login Admin
                </Button>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}

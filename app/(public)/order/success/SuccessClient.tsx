"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Home, MessageCircle } from "lucide-react";

export default function SuccessClient() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber");

  // 🎉 CONFETTI
  useEffect(() => {
    const duration = 3000;
    const end = Date.now() + duration;

    const interval = setInterval(() => {
      if (Date.now() > end) return clearInterval(interval);

      confetti({
        particleCount: 40,
        spread: 360,
        origin: { x: Math.random(), y: Math.random() - 0.2 },
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  const ADMIN_PHONE = "6281234567890";
  const waLink = `https://wa.me/${ADMIN_PHONE}?text=${encodeURIComponent(
    `Halo Admin 👋\n\nOrder Number: ${orderNumber}`
  )}`;

  return (
    <div className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto text-center"
      >
        {/* HEADER */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="mb-6"
        >
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>

          <h1 className="text-3xl font-bold">Pesanan Berhasil 🎉</h1>
          <p className="text-gray-600 mt-2">
            Terima kasih telah memesan layanan kami
          </p>
        </motion.div>

        {/* ORDER NUMBER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="mb-6 shadow-lg border-2">
            <CardHeader>
              <CardTitle>Order Number</CardTitle>
            </CardHeader>
            <CardContent>
              <motion.p
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="text-3xl font-bold text-blue-600 break-all"
              >
                {orderNumber ?? "-"}
              </motion.p>
              <p className="text-sm text-gray-600 mt-2">
                Simpan nomor ini untuk konfirmasi
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* ACTIONS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-4"
        >
          <Button asChild className="w-full">
            <a href={waLink} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="mr-2 h-5 w-5" />
              Konfirmasi via WhatsApp
            </a>
          </Button>

          <Link href="/">
            <Button variant="outline" className="w-full">
              <Home className="mr-2 h-5 w-5" />
              Kembali ke Home
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}

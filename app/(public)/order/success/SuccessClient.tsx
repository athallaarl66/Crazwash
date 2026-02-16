// app/(public)/order/success/SuccessClient.tsx
"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Home, MessageCircle } from "lucide-react";

const ADMIN_PHONE = "6281234567890"; // ← GANTI NOMOR WA ADMIN LU!

export default function SuccessClient() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber");
  const customerName = searchParams.get("customerName");
  const totalPrice = searchParams.get("totalPrice");
  const paymentMethod = searchParams.get("paymentMethod");

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

  // Format payment method
  const formatPaymentMethod = (method: string | null) => {
    if (!method) return "N/A";
    const methods: Record<string, string> = {
      QRIS: "QRIS",
      E_WALLET: "E-Wallet (GoPay/DANA/OVO)",
      TRANSFER: "Transfer Bank",
    };
    return methods[method] || method;
  };

  // Format currency
  const formatCurrency = (value: string | null) => {
    if (!value) return "Rp 0";
    const num = parseFloat(value);
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(num);
  };

  // WhatsApp message dengan NAMA, bukan order number
  const waMessage = `Halo Admin 👋

Saya *${customerName || "Customer"}* sudah melakukan pembayaran untuk pesanan cuci sepatu:

💰 Total Pembayaran: *${formatCurrency(totalPrice)}*
💳 Metode Pembayaran: *${formatPaymentMethod(paymentMethod)}*
📋 Order Number: ${orderNumber || "-"}

Saya akan kirim bukti pembayaran di bawah ini. Mohon segera diproses ya. Terima kasih! 🙏`;

  const waLink = `https://wa.me/${ADMIN_PHONE}?text=${encodeURIComponent(waMessage)}`;

  return (
    <div className="container-custom py-8 md:py-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto text-center px-4"
      >
        {/* HEADER */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="mb-6"
        >
          <div className="mx-auto mb-4 flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-8 w-8 md:h-10 md:w-10 text-green-600" />
          </div>

          <h1 className="text-h2 md:text-3xl font-bold mb-2">
            Pesanan Berhasil Dibuat! 🎉
          </h1>
          <p className="text-body-sm md:text-base text-muted-foreground">
            Terima kasih <span className="font-semibold">{customerName}</span>,
            pesanan Anda sudah kami terima
          </p>
        </motion.div>

        {/* ORDER DETAILS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="mb-6 shadow-lg border-2">
            <CardHeader>
              <CardTitle className="text-h4">Detail Pesanan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-2 border-b">
                <span className="text-body-sm text-muted-foreground">
                  Order Number
                </span>
                <span className="font-mono font-bold text-blue-600 text-body-sm">
                  {orderNumber || "-"}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-2 border-b">
                <span className="text-body-sm text-muted-foreground">
                  Total Pembayaran
                </span>
                <span className="text-h4 md:text-xl font-bold text-green-600">
                  {formatCurrency(totalPrice)}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-2">
                <span className="text-body-sm text-muted-foreground">
                  Metode Pembayaran
                </span>
                <span className="font-semibold text-body-sm">
                  {formatPaymentMethod(paymentMethod)}
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* NEXT STEPS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
            <CardContent className="pt-6">
              <h3 className="font-bold text-body md:text-lg mb-3">
                📱 Langkah Selanjutnya:
              </h3>
              <ol className="text-left text-body-sm md:text-sm space-y-2 list-decimal list-inside text-muted-foreground">
                <li>Lakukan pembayaran sesuai metode yang dipilih</li>
                <li>Screenshot/foto bukti pembayaran Anda</li>
                <li>Klik tombol "Kirim Bukti Bayar" di bawah</li>
                <li>Upload bukti pembayaran di chat WhatsApp</li>
                <li>Tunggu konfirmasi dari admin kami</li>
              </ol>
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
          <Button asChild className="w-full h-12 text-base" size="lg">
            <a href={waLink} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="mr-2 h-5 w-5" />
              Kirim Bukti Bayar via WhatsApp
            </a>
          </Button>

          <Link href="/">
            <Button variant="outline" className="w-full h-12">
              <Home className="mr-2 h-5 w-5" />
              Kembali ke Home
            </Button>
          </Link>
        </motion.div>

        {/* INFO */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-8"
        >
          <p className="text-caption text-muted-foreground">
            💡 Pesanan akan diproses setelah pembayaran dikonfirmasi oleh admin
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

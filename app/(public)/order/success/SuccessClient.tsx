// app/(public)/order/success/SuccessClient.tsx
//
// Presentation only: every value it renders comes from the stored order passed by
// the server component, plus the configured contact destination.
"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, Home, MessageCircle } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface SuccessClientProps {
  order: {
    orderNumber: string;
    customerName: string;
    totalPrice: number;
    paymentMethodLabel: string;
  };
  /** Empty when the business contact is not configured. */
  whatsappNumber: string;
}

export default function SuccessClient({
  order,
  whatsappNumber,
}: SuccessClientProps) {
  const { orderNumber, customerName, totalPrice, paymentMethodLabel } = order;

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

  const waMessage = `Halo Admin 👋

Saya *${customerName}* sudah melakukan pembayaran untuk pesanan cuci sepatu:

💰 Total Pembayaran: *${formatCurrency(totalPrice)}*
💳 Metode Pembayaran: *${paymentMethodLabel || "-"}*
📋 Order Number: ${orderNumber}

Saya akan kirim bukti pembayaran di bawah ini. Mohon segera diproses ya. Terima kasih! 🙏`;

  const waLink = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(waMessage)}`
    : "";

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
                  {orderNumber}
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
                  {paymentMethodLabel || "-"}
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
          {waLink ? (
            <Button asChild className="w-full h-12 text-base" size="lg">
              <a href={waLink} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2 h-5 w-5" />
                Kirim Bukti Bayar via WhatsApp
              </a>
            </Button>
          ) : (
            <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg flex items-start gap-3 text-left">
              <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-body font-semibold text-destructive mb-1">
                  Kontak Admin Belum Dikonfigurasi
                </p>
                <p className="text-body-sm text-destructive/80">
                  Nomor WhatsApp tujuan belum diatur, jadi tombol kirim bukti
                  bayar belum bisa dipakai. Hubungi admin Crazwash melalui
                  kontak yang Anda kenal.
                </p>
              </div>
            </div>
          )}

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

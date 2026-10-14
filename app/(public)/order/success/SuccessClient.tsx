// app/(public)/order/success/SuccessClient.tsx
//
// Presentation only: every value it renders comes from the stored order passed by
// the server component, plus the configured contact destination.
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
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

  const waMessage = `Halo Admin

Saya *${customerName}* sudah melakukan pembayaran untuk pesanan cuci sepatu:

Total Pembayaran: *${formatCurrency(totalPrice)}*
Metode Pembayaran: *${paymentMethodLabel || "-"}*
Order Number: ${orderNumber}

Saya akan kirim bukti pembayaran di bawah ini. Mohon segera diproses ya. Terima kasih.`;

  const waLink = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(waMessage)}`
    : "";

  return (
    <div className="container-custom py-8 md:py-16">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto text-center px-4"
      >
        {/* HEADER */}
        <div className="mb-6">
          <div className="mx-auto mb-4 flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-full bg-success/10">
            <CheckCircle2 className="h-8 w-8 md:h-10 md:w-10 text-success" />
          </div>

          <h1 className="text-h2 md:text-3xl font-bold mb-2">
            Pesanan Berhasil Dibuat
          </h1>
          <p className="text-body-sm md:text-base text-muted-foreground">
            Terima kasih <span className="font-semibold">{customerName}</span>,
            pesanan Anda sudah kami terima
          </p>
        </div>

        {/* ORDER DETAILS */}
        <Card className="card-custom mb-6 text-left">
          <CardHeader>
            <CardTitle className="text-h4">Detail Pesanan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-2 border-b border-border">
              <span className="text-body-sm text-muted-foreground">
                Order Number
              </span>
              <span className="font-mono font-bold text-primary text-body-sm">
                {orderNumber}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-2 border-b border-border">
              <span className="text-body-sm text-muted-foreground">
                Total Pembayaran
              </span>
              <span className="text-h4 md:text-xl font-bold text-primary">
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

        {/* NEXT STEPS */}
        <Card className="card-custom mb-6 text-left">
          <CardContent className="pt-6">
            <h3 className="font-bold text-body md:text-lg mb-3">
              Langkah Selanjutnya
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

        {/* ACTIONS */}
        <div className="space-y-4">
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
        </div>

        {/* INFO */}
        <p className="text-caption text-muted-foreground mt-8">
          Pesanan akan diproses setelah pembayaran dikonfirmasi oleh admin
        </p>
      </motion.div>
    </div>
  );
}

// app/(public)/order/components/steps/Step4Payment.tsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
  ArrowLeft,
  CreditCard,
  Building2,
  Wallet,
  AlertCircle,
  Loader2,
  QrCode,
} from "lucide-react";
import type { PaymentDestination, PaymentMethodId } from "@/lib/business-config";

interface Step4Props {
  /** Destinations configured by the business; empty means checkout cannot be completed. */
  paymentDestinations: PaymentDestination[];
  paymentMethod: string;
  onPaymentMethodChange: (value: string) => void;
  onBack: () => void;
  onSubmit: () => void;
  loading: boolean;
  error: string;
  canSubmit: boolean;
}

const METHOD_ICONS: Record<PaymentMethodId, typeof Building2> = {
  TRANSFER: Building2,
  EWALLET: Wallet,
  QRIS: QrCode,
  COD: CreditCard,
};

function Step4Payment({
  paymentDestinations,
  paymentMethod,
  onPaymentMethodChange,
  onBack,
  onSubmit,
  loading,
  error,
  canSubmit,
}: Step4Props) {
  const selected = paymentDestinations.find(
    (destination) => destination.method === paymentMethod,
  );

  if (paymentDestinations.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="card-custom p-6 text-center"
      >
        <AlertCircle className="h-10 w-10 text-destructive mx-auto mb-3" />
        <h2 className="text-h4 mb-2">Pembayaran Belum Dikonfigurasi</h2>
        <p className="text-body text-muted-foreground">
          Metode pembayaran belum diatur. Hubungi admin untuk menyelesaikan
          pesanan Anda.
        </p>
        <button
          onClick={onBack}
          className="mt-6 h-12 px-6 rounded-lg border-2 border-border bg-card
                   text-card-foreground font-semibold hover:bg-primary/5
                   transition-all duration-200 inline-flex items-center justify-center gap-2"
        >
          <ArrowLeft className="h-5 w-5" />
          Kembali
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="card-custom p-4 md:p-6">
        <h2 className="text-h3 mb-2">Metode Pembayaran</h2>
        <p className="text-body text-muted-foreground">
          Pilih cara pembayaran yang Anda inginkan
        </p>
      </div>

      {/* Payment Methods */}
      <div className="space-y-4">
        {paymentDestinations.map((destination) => {
          const Icon = METHOD_ICONS[destination.method] ?? CreditCard;
          const isSelected = paymentMethod === destination.method;

          return (
            <motion.button
              key={destination.method}
              onClick={() => onPaymentMethodChange(destination.method)}
              className={`
                w-full p-4 md:p-5 rounded-xl border-2 transition-colors duration-200
                flex items-center gap-4 text-left
                ${
                  isSelected
                    ? "bg-card border-primary"
                    : "bg-card border-border hover:border-primary/40"
                }
              `}
              style={{
                boxShadow: isSelected ? "var(--shadow-md)" : "none",
              }}
            >
              {/* Radio Indicator */}
              <div
                className={`
                  h-6 w-6 rounded-full border-2 flex items-center justify-center flex-shrink-0
                  ${
                    isSelected
                      ? "border-primary bg-primary"
                      : "border-border bg-card"
                  }
                `}
              >
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="h-3 w-3 rounded-full bg-primary-foreground"
                  />
                )}
              </div>

              {/* Icon */}
              <div
                className={`
                  h-12 w-12 rounded-lg flex items-center justify-center
                  ${isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}
                `}
              >
                <Icon className="h-6 w-6" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-body-lg font-bold text-card-foreground">
                    {destination.name}
                  </h3>
                  {destination.badge && (
                    <span className="px-2 py-0.5 bg-success text-success-foreground rounded-full text-caption font-bold">
                      {destination.badge}
                    </span>
                  )}
                </div>
                <p className="text-body-sm text-muted-foreground">
                  {destination.description}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Payment Details (Muncul saat dipilih) */}
      {selected && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-custom p-4 md:p-6"
        >
          <h3 className="text-h4 mb-4 text-card-foreground">
            Detail Pembayaran
          </h3>

          {selected.accounts.length > 0 && (
            <div className="space-y-3">
              {selected.accounts.map((account) => (
                <div
                  key={`${account.label}-${account.value}`}
                  className="p-3 bg-card border border-border rounded-lg"
                >
                  <p className="text-body font-semibold text-card-foreground">
                    {account.label}
                  </p>
                  <p className="text-body-sm text-muted-foreground">
                    Nomor: <span className="font-mono">{account.value}</span>
                  </p>
                  {account.holder && (
                    <p className="text-body-sm text-muted-foreground">
                      Atas Nama: {account.holder}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {selected.qrImageUrl && (
            <div className="text-center">
              <Image
                src={selected.qrImageUrl}
                alt={`${selected.name} code`}
                width={192}
                height={192}
                className="mx-auto mb-4 border border-border rounded-lg"
              />
              {selected.description && (
                <p className="text-body-sm text-muted-foreground">
                  {selected.description}
                </p>
              )}
            </div>
          )}

          {selected.note && (
            <p className="text-body text-muted-foreground">{selected.note}</p>
          )}
        </motion.div>
      )}

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg flex items-start gap-3"
        >
          <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-body font-semibold text-destructive mb-1">
              Gagal Membuat Pesanan
            </p>
            <p className="text-body-sm text-destructive/80">{error}</p>
          </div>
        </motion.div>
      )}

      {/* Info Box */}
      <div className="p-4 bg-info/10 border border-info/30 rounded-lg">
        <p className="text-body-sm text-info">
        Konfirmasi pembayaran akan dikirim melalui WhatsApp setelah Anda
        menyelesaikan pesanan
        </p>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onBack}
          disabled={loading}
          className="flex-1 h-12 rounded-lg border-2 border-border bg-card
                   text-card-foreground font-semibold
                   hover:border-primary/40 hover:bg-primary/5
                   transition-all duration-200 flex items-center justify-center gap-2
                   disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="h-5 w-5" />
          Kembali
        </button>
        <button
          onClick={onSubmit}
          disabled={!canSubmit || loading}
          className={`
            flex-1 h-12 rounded-lg font-semibold
            flex items-center justify-center gap-2
            transition-all duration-200
            ${
              canSubmit && !loading
                ? "bg-success text-success-foreground hover:opacity-90"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            }
          `}
          style={{
            boxShadow: canSubmit && !loading ? "var(--shadow-md)" : "none",
          }}
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Memproses...
            </>
          ) : (
            <>
              <CreditCard className="h-5 w-5" />
              Buat Pesanan
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}

export { Step4Payment };

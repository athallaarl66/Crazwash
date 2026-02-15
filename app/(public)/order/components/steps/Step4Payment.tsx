// app/(public)/order/components/steps/Step4Payment.tsx
"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  CreditCard,
  Building2,
  Wallet,
  AlertCircle,
  Loader2,
} from "lucide-react";

interface Step4Props {
  paymentMethod: string;
  onPaymentMethodChange: (value: string) => void;
  onBack: () => void;
  onSubmit: () => void;
  loading: boolean;
  error: string;
  canSubmit: boolean;
}

const PAYMENT_METHODS = [
  {
    id: "TRANSFER",
    name: "Transfer Bank",
    icon: Building2,
    description: "BCA, Mandiri, BNI, BRI",
    badge: "Populer",
  },
  {
    id: "EWALLET",
    name: "E-Wallet",
    icon: Wallet,
    description: "GoPay, OVO, Dana, ShopeePay",
    badge: null,
  },
  {
    id: "COD",
    name: "Cash on Delivery",
    icon: CreditCard,
    description: "Bayar saat sepatu diambil",
    badge: "Praktis",
  },
];

function Step4Payment({
  paymentMethod,
  onPaymentMethodChange,
  onBack,
  onSubmit,
  loading,
  error,
  canSubmit,
}: Step4Props) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="card-custom p-6 bg-gradient-to-r from-primary/5 to-accent/5">
        <h2 className="text-h3 mb-2">Metode Pembayaran</h2>
        <p className="text-body text-muted-foreground">
          Pilih cara pembayaran yang Anda inginkan
        </p>
      </div>

      {/* Payment Methods */}
      <div className="space-y-4">
        {PAYMENT_METHODS.map((method) => {
          const Icon = method.icon;
          const isSelected = paymentMethod === method.id;

          return (
            <motion.button
              key={method.id}
              onClick={() => onPaymentMethodChange(method.id)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className={`
                w-full p-4 md:p-5 rounded-xl border-2 transition-all duration-200
                flex items-center gap-4 text-left
                ${
                  isSelected
                    ? "bg-gradient-to-r from-primary/10 to-accent/10 border-primary"
                    : "bg-card border-border hover:border-primary/40"
                }
              `}
              style={{
                boxShadow: isSelected ? "var(--shadow-lg)" : "var(--shadow-sm)",
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
                    {method.name}
                  </h3>
                  {method.badge && (
                    <span className="px-2 py-0.5 bg-success text-success-foreground rounded-full text-caption font-bold">
                      {method.badge}
                    </span>
                  )}
                </div>
                <p className="text-body-sm text-muted-foreground">
                  {method.description}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>

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
          ℹ️ Konfirmasi pembayaran akan dikirim melalui WhatsApp setelah Anda
          menyelesaikan pesanan
        </p>
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-3">
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
                ? "bg-gradient-to-r from-success to-success/80 text-success-foreground hover:opacity-90"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            }
          `}
          style={{
            boxShadow: canSubmit && !loading ? "var(--shadow-lg)" : "none",
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

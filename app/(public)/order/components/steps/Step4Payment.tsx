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
  QrCode,
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
    id: "QRIS",
    name: "QRIS",
    icon: QrCode,
    description: "Scan QR code untuk pembayaran",
    badge: "Cepat",
  },
  {
    id: "COD",
    name: "Cash on Delivery",
    icon: CreditCard,
    description: "Bayar saat sepatu diambil",
    badge: "Praktis",
  },
];

// DETAIL PEMBAYARAN (PLACEHOLDER RANDOM - GANTI DENGAN DATA REAL ANDA!)
const PAYMENT_DETAILS = {
  TRANSFER: [
    { bank: "BCA", account: "123456789012", name: "Crazwash Indonesia" },
    { bank: "Mandiri", account: "098765432109", name: "Crazwash Indonesia" },
    { bank: "BNI", account: "112233445566", name: "Crazwash Indonesia" },
    { bank: "BRI", account: "556677889900", name: "Crazwash Indonesia" },
  ],
  EWALLET: [
    {
      provider: "GoPay",
      number: "+62 812-3456-7890",
      name: "Crazwash Indonesia",
    },
    {
      provider: "OVO",
      number: "+62 813-4567-8901",
      name: "Crazwash Indonesia",
    },
    {
      provider: "Dana",
      number: "+62 814-5678-9012",
      name: "Crazwash Indonesia",
    },
    {
      provider: "ShopeePay",
      number: "+62 815-6789-0123",
      name: "Crazwash Indonesia",
    },
  ],
  QRIS: {
    qrCodeUrl:
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5RUklTIFBsYWNlaG9sZGVyPC90ZXh0Pjwvc3ZnPg==",
    description: "Scan QR code di aplikasi e-wallet atau mobile banking Anda",
  },
  COD: null,
};

function Step4Payment({
  paymentMethod,
  onPaymentMethodChange,
  onBack,
  onSubmit,
  loading,
  error,
  canSubmit,
}: Step4Props) {
  const selectedDetails =
    PAYMENT_DETAILS[paymentMethod as keyof typeof PAYMENT_DETAILS];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="card-custom p-4 md:p-6 bg-gradient-to-r from-primary/5 to-accent/5">
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

      {/* Payment Details (Muncul saat dipilih) */}
      {paymentMethod && selectedDetails && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-custom p-4 md:p-6 bg-gradient-to-r from-primary/5 to-accent/5"
        >
          <h3 className="text-h4 mb-4 text-card-foreground">
            Detail Pembayaran
          </h3>

          {paymentMethod === "TRANSFER" && Array.isArray(selectedDetails) && (
            <div className="space-y-3">
              {selectedDetails.map((detail: any, index: number) => (
                <div
                  key={index}
                  className="p-3 bg-card border border-border rounded-lg"
                >
                  <p className="text-body font-semibold text-card-foreground">
                    {detail.bank}
                  </p>
                  <p className="text-body-sm text-muted-foreground">
                    No. Rekening:{" "}
                    <span className="font-mono">{detail.account}</span>
                  </p>
                  <p className="text-body-sm text-muted-foreground">
                    Atas Nama: {detail.name}
                  </p>
                </div>
              ))}
            </div>
          )}

          {paymentMethod === "EWALLET" && Array.isArray(selectedDetails) && (
            <div className="space-y-3">
              {selectedDetails.map((detail: any, index: number) => (
                <div
                  key={index}
                  className="p-3 bg-card border border-border rounded-lg"
                >
                  <p className="text-body font-semibold text-card-foreground">
                    {detail.provider}
                  </p>
                  <p className="text-body-sm text-muted-foreground">
                    Nomor: <span className="font-mono">{detail.number}</span>
                  </p>
                  <p className="text-body-sm text-muted-foreground">
                    Atas Nama: {detail.name}
                  </p>
                </div>
              ))}
            </div>
          )}

          {paymentMethod === "QRIS" &&
            typeof selectedDetails === "object" &&
            selectedDetails &&
            "qrCodeUrl" in selectedDetails && (
              <div className="text-center">
                <img
                  src={selectedDetails.qrCodeUrl as string}
                  alt="QRIS Code"
                  className="w-48 h-48 mx-auto mb-4 border border-border rounded-lg"
                />
                <p className="text-body-sm text-muted-foreground">
                  {selectedDetails.description as string}
                </p>
              </div>
            )}

          {paymentMethod === "COD" && (
            <p className="text-body text-muted-foreground">
              Bayar langsung ke kurir saat sepatu diambil. Tidak ada biaya
              tambahan.
            </p>
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
          ℹ️ Konfirmasi pembayaran akan dikirim melalui WhatsApp setelah Anda
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

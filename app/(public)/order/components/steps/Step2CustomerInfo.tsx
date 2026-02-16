// app/(public)/order/components/steps/Step2CustomerInfo.tsx
"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, User, Phone, Mail } from "lucide-react";

interface Step2Props {
  formData: {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
  };
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  onBack: () => void;
  onNext: () => void;
  canProceed: boolean;
}

function Step2CustomerInfo({
  formData,
  onChange,
  onBack,
  onNext,
  canProceed,
}: Step2Props) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="card-custom p-4 md:p-6 bg-gradient-to-r from-primary/5 to-accent/5">
        <h2 className="text-h3 mb-2">Data Diri</h2>
        <p className="text-body text-muted-foreground">
          Isi data diri Anda untuk proses pesanan
        </p>
      </div>

      {/* Form */}
      <div className="card-custom p-4 md:p-6 space-y-5">
        {/* Nama Lengkap */}
        <div className="space-y-2">
          <label
            htmlFor="customerName"
            className="text-body font-semibold text-card-foreground flex items-center gap-2"
          >
            <User className="h-4 w-4 text-primary" />
            Nama Lengkap <span className="text-destructive">*</span>
          </label>
          <input
            type="text"
            id="customerName"
            name="customerName"
            value={formData.customerName}
            onChange={onChange}
            placeholder="Contoh: Budi Santoso"
            required
            className="w-full px-4 py-3 rounded-lg border-2 border-border
                     bg-card text-card-foreground
                     focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20
                     transition-all duration-200 text-body"
          />
        </div>

        {/* Nomor Telepon */}
        <div className="space-y-2">
          <label
            htmlFor="customerPhone"
            className="text-body font-semibold text-card-foreground flex items-center gap-2"
          >
            <Phone className="h-4 w-4 text-primary" />
            Nomor Telepon <span className="text-destructive">*</span>
          </label>
          <div className="flex gap-2">
            <div className="px-4 py-3 bg-muted rounded-lg border-2 border-border text-body font-semibold">
              +62
            </div>
            <input
              type="tel"
              id="customerPhone"
              name="customerPhone"
              value={formData.customerPhone}
              onChange={onChange}
              placeholder="8123456789"
              required
              className="flex-1 px-4 py-3 rounded-lg border-2 border-border
                       bg-card text-card-foreground
                       focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20
                       transition-all duration-200 text-body"
            />
          </div>
          <p className="text-body-sm text-muted-foreground">
            Format: 8xxxxxxxxx (tanpa 0 di depan)
          </p>
        </div>

        {/* Email (Optional) */}
        <div className="space-y-2">
          <label
            htmlFor="customerEmail"
            className="text-body font-semibold text-card-foreground flex items-center gap-2"
          >
            <Mail className="h-4 w-4 text-primary" />
            Email{" "}
            <span className="text-body-sm text-muted-foreground">
              (Opsional)
            </span>
          </label>
          <input
            type="email"
            id="customerEmail"
            name="customerEmail"
            value={formData.customerEmail}
            onChange={onChange}
            placeholder="contoh@email.com"
            className="w-full px-4 py-3 rounded-lg border-2 border-border
                     bg-card text-card-foreground
                     focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20
                     transition-all duration-200 text-body"
          />
        </div>

        {/* Info Box */}
        <div className="p-4 bg-info/10 border border-info/30 rounded-lg">
          <p className="text-body-sm text-info">
            ℹ️ Data Anda aman dan hanya digunakan untuk proses pemesanan
          </p>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onBack}
          className="flex-1 h-12 rounded-lg border-2 border-border bg-card
                   text-card-foreground font-semibold
                   hover:border-primary/40 hover:bg-primary/5
                   transition-all duration-200 flex items-center justify-center gap-2"
        >
          <ArrowLeft className="h-5 w-5" />
          Kembali
        </button>
        <button
          onClick={onNext}
          disabled={!canProceed}
          className={`
            flex-1 h-12 rounded-lg font-semibold
            flex items-center justify-center gap-2
            transition-all duration-200
            ${
              canProceed
                ? "bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            }
          `}
          style={{ boxShadow: canProceed ? "var(--shadow-md)" : "none" }}
        >
          Lanjut
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </motion.div>
  );
}

export { Step2CustomerInfo };

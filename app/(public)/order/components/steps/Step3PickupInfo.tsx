// app/(public)/order/components/steps/Step3PickupInfo.tsx
"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Calendar,
  MessageSquare,
} from "lucide-react";

interface Step3Props {
  formData: {
    address: string;
    pickupDate: string;
    notes: string;
  };
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  onBack: () => void;
  onNext: () => void;
  canProceed: boolean;
}

function Step3PickupInfo({
  formData,
  onChange,
  onBack,
  onNext,
  canProceed,
}: Step3Props) {
  // Get minimum date (tomorrow)
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateString = minDate.toISOString().split("T")[0];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="card-custom p-6 bg-gradient-to-r from-primary/5 to-accent/5">
        <h2 className="text-h3 mb-2">Informasi Pickup</h2>
        <p className="text-body text-muted-foreground">
          Tentukan lokasi dan waktu pengambilan sepatu
        </p>
      </div>

      {/* Form */}
      <div className="card-custom p-6 space-y-5">
        {/* Alamat */}
        <div className="space-y-2">
          <label
            htmlFor="address"
            className="text-body font-semibold text-card-foreground flex items-center gap-2"
          >
            <MapPin className="h-4 w-4 text-primary" />
            Alamat Lengkap <span className="text-destructive">*</span>
          </label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={onChange}
            placeholder="Contoh: Jl. Sudirman No. 123, RT 01/RW 02, Kebayoran Baru, Jakarta Selatan"
            required
            rows={4}
            className="w-full px-4 py-3 rounded-lg border-2 border-border
                     bg-card text-card-foreground
                     focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20
                     transition-all duration-200 text-body resize-none"
          />
          <p className="text-body-sm text-muted-foreground">
            Sertakan patokan untuk memudahkan kurir
          </p>
        </div>

        {/* Tanggal Pickup */}
        <div className="space-y-2">
          <label
            htmlFor="pickupDate"
            className="text-body font-semibold text-card-foreground flex items-center gap-2"
          >
            <Calendar className="h-4 w-4 text-primary" />
            Tanggal Pickup <span className="text-destructive">*</span>
          </label>
          <input
            type="date"
            id="pickupDate"
            name="pickupDate"
            value={formData.pickupDate}
            onChange={onChange}
            min={minDateString}
            required
            className="w-full px-4 py-3 rounded-lg border-2 border-border
                     bg-card text-card-foreground
                     focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20
                     transition-all duration-200 text-body"
          />
          <p className="text-body-sm text-muted-foreground">
            Pickup tersedia H+1 dari hari pemesanan
          </p>
        </div>

        {/* Catatan */}
        <div className="space-y-2">
          <label
            htmlFor="notes"
            className="text-body font-semibold text-card-foreground flex items-center gap-2"
          >
            <MessageSquare className="h-4 w-4 text-primary" />
            Catatan Tambahan{" "}
            <span className="text-body-sm text-muted-foreground">
              (Opsional)
            </span>
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={onChange}
            placeholder="Tambahkan catatan khusus untuk pesanan Anda (misal: kondisi sepatu, preferensi waktu pickup, dll)"
            rows={3}
            className="w-full px-4 py-3 rounded-lg border-2 border-border
                     bg-card text-card-foreground
                     focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20
                     transition-all duration-200 text-body resize-none"
          />
        </div>

        {/* Info Box */}
        <div className="p-4 bg-warning/10 border border-warning/30 rounded-lg">
          <p className="text-body-sm text-warning font-medium mb-2">
            ⏰ Jam Operasional Pickup
          </p>
          <p className="text-body-sm text-card-foreground">
            Senin - Sabtu: 09.00 - 17.00 WIB
            <br />
            Minggu & Libur: Tutup
          </p>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-3">
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

export { Step3PickupInfo };

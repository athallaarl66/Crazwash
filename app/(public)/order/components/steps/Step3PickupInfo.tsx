// app/(public)/order/components/steps/Step3PickupInfo.tsx
"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, ArrowRight } from "lucide-react";

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
  return (
    <motion.div
      key="step3"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl">
            Informasi Pickup
          </CardTitle>
          <CardDescription className="text-sm">
            Dimana kami harus menjemput sepatu Anda?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Label htmlFor="address" className="text-sm font-semibold">
              Alamat Lengkap *
            </Label>
            <Textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={onChange}
              rows={4}
              className="mt-2 resize-none"
              placeholder="Jl. Contoh No. 123, Kelurahan, Kecamatan, Bandung"
              required
            />
            <p className="text-xs text-gray-500 mt-1.5">
              Pastikan alamat lengkap agar kurir mudah menemukan lokasi
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Label htmlFor="pickupDate" className="text-sm font-semibold">
              Tanggal Pickup *
            </Label>
            <Input
              id="pickupDate"
              name="pickupDate"
              value={formData.pickupDate}
              onChange={onChange}
              type="date"
              required
              min={new Date().toISOString().split("T")[0]}
              className="mt-2 h-12"
            />
            <p className="text-xs text-gray-500 mt-1.5">
              Pilih tanggal minimal H+1 dari hari ini
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Label htmlFor="notes" className="text-sm font-semibold">
              Catatan Tambahan
            </Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={onChange}
              rows={3}
              className="mt-2 resize-none"
              placeholder="Contoh: Sepatu di lantai 2, bel tidak berfungsi, ambil jam 14:00"
            />
          </motion.div>

          {/* Navigation */}
          <div className="flex justify-between gap-4 pt-4">
            <Button type="button" variant="outline" onClick={onBack} size="lg">
              <ArrowLeft className="mr-2 h-5 w-5" />
              Kembali
            </Button>

            <Button
              type="button"
              onClick={onNext}
              disabled={!canProceed}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-indigo-600"
            >
              Selanjutnya
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export { Step3PickupInfo };

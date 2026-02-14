// app/(public)/order/components/steps/Step2CustomerInfo.tsx
"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface Step2Props {
  formData: {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
      key="step2"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl">Data Customer</CardTitle>
          <CardDescription className="text-sm">
            Isi data diri Anda untuk konfirmasi pesanan
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Label htmlFor="customerName" className="text-sm font-semibold">
              Nama Lengkap *
            </Label>
            <Input
              id="customerName"
              name="customerName"
              value={formData.customerName}
              onChange={onChange}
              placeholder="Masukkan nama lengkap"
              required
              className="mt-2 h-12"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Label htmlFor="customerPhone" className="text-sm font-semibold">
              No HP/WhatsApp *
            </Label>
            <Input
              id="customerPhone"
              name="customerPhone"
              value={formData.customerPhone}
              onChange={onChange}
              type="tel"
              placeholder="08xx xxxx xxxx"
              required
              className="mt-2 h-12"
            />
            <p className="text-xs text-gray-500 mt-1.5">
              Nomor ini akan digunakan untuk konfirmasi via WhatsApp
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Label htmlFor="customerEmail" className="text-sm font-semibold">
              Email (Opsional)
            </Label>
            <Input
              id="customerEmail"
              name="customerEmail"
              value={formData.customerEmail}
              onChange={onChange}
              type="email"
              placeholder="email@example.com"
              className="mt-2 h-12"
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

export { Step2CustomerInfo };

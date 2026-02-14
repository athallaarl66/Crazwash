// app/(public)/order/components/steps/Step4Payment.tsx
"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, Loader2 } from "lucide-react";
import Image from "next/image";

interface PaymentMethod {
  value: string;
  label: string;
  description: string;
}

const PAYMENT_METHODS: PaymentMethod[] = [
  {
    value: "QRIS",
    label: "QRIS",
    description: "Scan QR Code (Semua e-wallet & bank)",
  },
  {
    value: "E_WALLET",
    label: "E-Wallet",
    description: "GoPay, OVO, DANA, ShopeePay",
  },
  {
    value: "TRANSFER",
    label: "Transfer Bank",
    description: "BCA, Mandiri, BRI, BNI",
  },
];

interface Step4PaymentProps {
  paymentMethod: string;
  onPaymentMethodChange: (value: string) => void;
  onBack: () => void;
  onSubmit: () => void;
  loading: boolean;
  error: string;
  canSubmit: boolean;
}

export function Step4Payment({
  paymentMethod,
  onPaymentMethodChange,
  onBack,
  onSubmit,
  loading,
  error,
  canSubmit,
}: Step4PaymentProps) {
  return (
    <motion.div
      key="step4"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl">
            Metode Pembayaran
          </CardTitle>
          <CardDescription className="text-sm">
            Pilih metode pembayaran yang Anda inginkan
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Payment Method Selection */}
          <div>
            <Label className="text-sm font-semibold mb-3 block">
              Pilih Metode Pembayaran *
            </Label>
            <RadioGroup
              value={paymentMethod}
              onValueChange={onPaymentMethodChange}
              className="space-y-3"
            >
              {PAYMENT_METHODS.map((method) => (
                <div
                  key={method.value}
                  className={`
                    flex items-center space-x-3 p-4 border-2 rounded-xl cursor-pointer
                    transition-all duration-300
                    ${
                      paymentMethod === method.value
                        ? "border-blue-500 bg-blue-50 shadow-md"
                        : "border-gray-200 hover:border-blue-300"
                    }
                  `}
                  onClick={() => onPaymentMethodChange(method.value)}
                >
                  <RadioGroupItem value={method.value} id={method.value} />
                  <div className="flex-1">
                    <Label
                      htmlFor={method.value}
                      className="font-semibold cursor-pointer"
                    >
                      {method.label}
                    </Label>
                    <p className="text-sm text-gray-600">
                      {method.description}
                    </p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Payment Details */}
          {paymentMethod && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="space-y-4"
            >
              {/* QRIS */}
              {paymentMethod === "QRIS" && (
                <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl">
                  <div className="flex flex-col items-center">
                    <h3 className="text-lg font-bold text-blue-900 mb-3">
                      Scan QR Code untuk Bayar
                    </h3>
                    <div className="bg-white p-4 rounded-lg shadow-lg mb-4">
                      <Image
                        src="/qris-code.png"
                        width={250}
                        height={250}
                        alt="QRIS Code"
                        className="rounded"
                      />
                    </div>
                    <div className="text-center space-y-2">
                      <p className="text-sm text-blue-800 font-medium">
                        ✅ Bisa pakai semua e-wallet & mobile banking
                      </p>
                      <p className="text-xs text-gray-600">
                        GoPay, OVO, DANA, ShopeePay, BCA Mobile, dll
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* E-Wallet */}
              {paymentMethod === "E_WALLET" && (
                <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl">
                  <h3 className="text-lg font-bold text-green-900 mb-4">
                    💳 Transfer ke E-Wallet
                  </h3>
                  <div className="space-y-3">
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <p className="text-sm text-gray-600 mb-1">GoPay</p>
                      <p className="text-xl font-bold text-green-700">
                        0812-3456-7890
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        a.n. Toko Shoes Wash
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <p className="text-sm text-gray-600 mb-1">DANA / OVO</p>
                      <p className="text-xl font-bold text-green-700">
                        0812-3456-7890
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        a.n. Toko Shoes Wash
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Transfer Bank */}
              {paymentMethod === "TRANSFER" && (
                <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl">
                  <h3 className="text-lg font-bold text-purple-900 mb-4">
                    🏦 Transfer Bank
                  </h3>
                  <div className="space-y-3">
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <p className="text-sm text-gray-600 mb-1">BCA</p>
                      <p className="text-xl font-bold text-purple-700">
                        1234567890
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        a.n. Toko Shoes Wash
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <p className="text-sm text-gray-600 mb-1">Mandiri</p>
                      <p className="text-xl font-bold text-purple-700">
                        0987654321
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        a.n. Toko Shoes Wash
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Info Box */}
              <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg">
                <div className="flex items-start">
                  <span className="text-2xl mr-3">💡</span>
                  <div>
                    <p className="text-sm font-semibold text-yellow-900 mb-1">
                      Cara Konfirmasi Pembayaran:
                    </p>
                    <ol className="text-xs text-yellow-800 space-y-1 list-decimal list-inside">
                      <li>Lakukan pembayaran sesuai metode yang dipilih</li>
                      <li>Screenshot/foto bukti pembayaran</li>
                      <li>Klik tombol "Buat Pesanan" di bawah</li>
                      <li>Kirim bukti pembayaran via WhatsApp ke admin</li>
                      <li>Tunggu konfirmasi dari admin</li>
                    </ol>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border-l-4 border-red-400 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between gap-4 pt-4">
            <Button type="button" variant="outline" onClick={onBack} size="lg">
              <ArrowLeft className="mr-2 h-5 w-5" />
              Kembali
            </Button>

            <Button
              type="button"
              onClick={onSubmit}
              disabled={loading || !canSubmit}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 
                       hover:to-indigo-700 shadow-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Memproses...
                </>
              ) : (
                "Buat Pesanan"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

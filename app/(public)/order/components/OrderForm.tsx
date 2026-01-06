// src/app/(public)/order/components/OrderForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { createOrderAction } from "@/actions/orderActions";
import { formatCurrency } from "@/lib/utils";
import {
  CheckCircle2,
  Loader2,
  ShoppingBag,
  User,
  MapPin,
  ArrowRight,
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  category: string;
}

const STEPS = [
  { id: 1, name: "Layanan", icon: ShoppingBag },
  { id: 2, name: "Data Diri", icon: User },
  { id: 3, name: "Pickup", icon: MapPin },
];

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    BASIC: "bg-blue-100 text-blue-700 border-blue-200",
    TREATMENT: "bg-green-100 text-green-700 border-green-200",
    PREMIUM: "bg-purple-100 text-purple-700 border-purple-200",
    DEEP: "bg-orange-100 text-orange-700 border-orange-200",
  };
  return colors[category] || "bg-gray-100 text-gray-700";
};

export function OrderForm({ products }: { products: Product[] }) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSummary, setShowSummary] = useState(false);
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    address: "",
    pickupDate: "",
    notes: "",
  });

  const updateQuantity = (productId: number, change: number) => {
    setQuantities((prev) => {
      const currentQty = prev[productId] || 0;
      const newQty = Math.max(0, currentQty + change);

      if (newQty === 0) {
        const newQuantities = { ...prev };
        delete newQuantities[productId];
        return newQuantities;
      }

      return { ...prev, [productId]: newQty };
    });
  };

  const getQuantity = (productId: number) => quantities[productId] || 0;

  const totalPrice = products.reduce((sum, p) => {
    const qty = getQuantity(p.id);
    return sum + p.price * qty;
  }, 0);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const canProceed = () => {
    if (currentStep === 1) return Object.keys(quantities).length > 0;
    if (currentStep === 2)
      return formData.customerName && formData.customerPhone;
    if (currentStep === 3) return formData.address && formData.pickupDate;
    return false;
  };

  async function handleSubmit() {
    setLoading(true);
    setError("");

    const form = new FormData();
    form.append("customerName", formData.customerName);
    form.append("customerPhone", formData.customerPhone);
    form.append("customerEmail", formData.customerEmail);
    form.append("address", formData.address);
    form.append("pickupDate", formData.pickupDate);
    form.append("notes", formData.notes);

    Object.entries(quantities).forEach(([productId, quantity]) => {
      form.append("productId", productId);
      form.append("quantity", quantity.toString());
    });

    const result = await createOrderAction(form);

    if (result.success) {
      router.push(`/order/success?orderNumber=${result.orderNumber}`);
    } else {
      setError(result.error || "Terjadi kesalahan");
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Progress Steps - Responsive */}
      <div className="flex items-center justify-between">
        {STEPS.map((step, index) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;

          return (
            <div key={step.id} className="flex items-center flex-1">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-center"
              >
                <div
                  className={`
                    w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center
                    transition-all duration-300
                    ${
                      isCompleted
                        ? "bg-green-500"
                        : isActive
                        ? "bg-blue-600"
                        : "bg-gray-200"
                    }
                  `}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5 md:h-6 md:w-6 text-white" />
                  ) : (
                    <Icon
                      className={`h-5 w-5 md:h-6 md:w-6 ${
                        isActive ? "text-white" : "text-gray-400"
                      }`}
                    />
                  )}
                </div>
                <p
                  className={`text-xs md:text-sm mt-2 font-medium ${
                    isActive ? "text-blue-600" : "text-gray-500"
                  }`}
                >
                  {step.name}
                </p>
              </motion.div>

              {index < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-2 md:mx-4 transition-all duration-300 ${
                    currentStep > step.id ? "bg-green-500" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile Summary Toggle */}
      {Object.keys(quantities).length > 0 && (
        <div className="lg:hidden">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setShowSummary(!showSummary)}
          >
            <span>Ringkasan ({Object.keys(quantities).length} item)</span>
            <span className="ml-auto font-bold">
              {formatCurrency(totalPrice)}
            </span>
            {showSummary ? (
              <ChevronUp className="ml-2 h-4 w-4" />
            ) : (
              <ChevronDown className="ml-2 h-4 w-4" />
            )}
          </Button>

          <AnimatePresence>
            {showSummary && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3"
              >
                <Card>
                  <CardContent className="pt-4 space-y-3">
                    {products
                      .filter((p) => getQuantity(p.id) > 0)
                      .map((product) => {
                        const qty = getQuantity(product.id);
                        return (
                          <div
                            key={product.id}
                            className="py-2 border-b last:border-0"
                          >
                            <div className="flex justify-between text-sm mb-1">
                              <span className="font-medium">
                                {product.name}
                              </span>
                              <span className="text-gray-600">x{qty}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">
                                {formatCurrency(product.price)} × {qty}
                              </span>
                              <span className="font-semibold">
                                {formatCurrency(product.price * qty)}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence mode="wait">
            {/* STEP 1: Service Selection */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg md:text-xl">
                      Pilih Layanan
                    </CardTitle>
                    <CardDescription className="text-sm">
                      Pilih satu atau lebih layanan yang Anda butuhkan
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {products.map((product, index) => {
                      const quantity = getQuantity(product.id);
                      const isSelected = quantity > 0;

                      return (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`
                            p-3 md:p-4 border-2 rounded-lg transition-all
                            ${
                              isSelected
                                ? "border-blue-500 bg-blue-50 shadow-md"
                                : "border-gray-200 hover:border-blue-300 hover:shadow-sm"
                            }
                          `}
                        >
                          <div className="space-y-3">
                            <div className="flex items-start justify-between">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-semibold text-sm md:text-base truncate">
                                    {product.name}
                                  </h3>
                                  {isSelected && (
                                    <motion.div
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      transition={{
                                        type: "spring",
                                        stiffness: 500,
                                      }}
                                    >
                                      <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5 text-blue-600 flex-shrink-0" />
                                    </motion.div>
                                  )}
                                </div>
                                <p className="text-xs md:text-sm text-gray-600 mb-2 line-clamp-2">
                                  {product.description}
                                </p>
                                <Badge
                                  variant="secondary"
                                  className={`${getCategoryColor(
                                    product.category
                                  )} border text-xs`}
                                >
                                  {product.category}
                                </Badge>
                              </div>
                              <div className="text-right ml-3 flex-shrink-0">
                                <p className="text-base md:text-xl font-bold text-blue-600">
                                  {formatCurrency(product.price)}
                                </p>
                                <p className="text-xs text-gray-500">
                                  per pasang
                                </p>
                              </div>
                            </div>

                            {/* Counter */}
                            <div className="flex items-center justify-between pt-3 border-t">
                              <span className="text-xs md:text-sm font-medium text-gray-700">
                                Jumlah:
                              </span>
                              <div className="flex items-center gap-2 md:gap-3">
                                <motion.button
                                  whileTap={{ scale: 0.9 }}
                                  type="button"
                                  onClick={() => updateQuantity(product.id, -1)}
                                  disabled={quantity === 0}
                                  className={`
                                    w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center
                                    transition-all font-bold text-sm md:text-base
                                    ${
                                      quantity > 0
                                        ? "bg-blue-600 text-white hover:bg-blue-700"
                                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                    }
                                  `}
                                >
                                  −
                                </motion.button>

                                <motion.span
                                  key={quantity}
                                  initial={{ scale: 1.5, color: "#2563eb" }}
                                  animate={{ scale: 1, color: "#000" }}
                                  className="text-base md:text-lg font-bold w-6 md:w-8 text-center"
                                >
                                  {quantity}
                                </motion.span>

                                <motion.button
                                  whileTap={{ scale: 0.9 }}
                                  type="button"
                                  onClick={() => updateQuantity(product.id, 1)}
                                  className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-blue-600 text-white hover:bg-blue-700 
                                           flex items-center justify-center transition-all font-bold text-sm md:text-base"
                                >
                                  +
                                </motion.button>
                              </div>
                            </div>

                            {/* Subtotal */}
                            {isSelected && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                className="pt-2 border-t flex justify-between items-center"
                              >
                                <span className="text-xs md:text-sm text-gray-600">
                                  Subtotal:
                                </span>
                                <span className="text-base md:text-lg font-bold text-blue-600">
                                  {formatCurrency(product.price * quantity)}
                                </span>
                              </motion.div>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* STEP 2: Customer Info */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg md:text-xl">
                      Data Customer
                    </CardTitle>
                    <CardDescription className="text-sm">
                      Isi data diri Anda
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <Label htmlFor="customerName" className="text-sm">
                        Nama Lengkap *
                      </Label>
                      <Input
                        id="customerName"
                        name="customerName"
                        value={formData.customerName}
                        onChange={handleInputChange}
                        placeholder="Masukkan nama lengkap"
                        required
                        className="mt-1.5"
                      />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Label htmlFor="customerPhone" className="text-sm">
                        No HP/WhatsApp *
                      </Label>
                      <Input
                        id="customerPhone"
                        name="customerPhone"
                        value={formData.customerPhone}
                        onChange={handleInputChange}
                        type="tel"
                        placeholder="08xx xxxx xxxx"
                        required
                        className="mt-1.5"
                      />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Label htmlFor="customerEmail" className="text-sm">
                        Email (Opsional)
                      </Label>
                      <Input
                        id="customerEmail"
                        name="customerEmail"
                        value={formData.customerEmail}
                        onChange={handleInputChange}
                        type="email"
                        placeholder="email@example.com"
                        className="mt-1.5"
                      />
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* STEP 3: Pickup Info */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg md:text-xl">
                      Informasi Pickup
                    </CardTitle>
                    <CardDescription className="text-sm">
                      Dimana kami harus menjemput sepatu Anda?
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <Label htmlFor="address" className="text-sm">
                        Alamat Lengkap *
                      </Label>
                      <textarea
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        rows={3}
                        className="mt-1.5 w-full p-3 border rounded-lg text-sm"
                        placeholder="Jl. Contoh No. 123, Kelurahan, Kecamatan, Bandung"
                        required
                      />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Label htmlFor="pickupDate" className="text-sm">
                        Tanggal Pickup *
                      </Label>
                      <Input
                        id="pickupDate"
                        name="pickupDate"
                        value={formData.pickupDate}
                        onChange={handleInputChange}
                        type="date"
                        required
                        min={new Date().toISOString().split("T")[0]}
                        className="mt-1.5"
                      />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Label htmlFor="notes" className="text-sm">
                        Catatan Tambahan
                      </Label>
                      <textarea
                        id="notes"
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        rows={3}
                        className="mt-1.5 w-full p-3 border rounded-lg text-sm"
                        placeholder="Contoh: Sepatu di lantai 2, bel tidak berfungsi"
                      />
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons - FIXED */}
          <div className="flex justify-between gap-3 md:gap-4">
            {currentStep > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep((prev) => prev - 1)}
                className="text-sm md:text-base px-3 py-2 md:px-4 md:py-2"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Kembali</span>
                <span className="sm:hidden">Back</span>
              </Button>
            )}

            {currentStep < 3 ? (
              <Button
                type="button"
                onClick={() => setCurrentStep((prev) => prev + 1)}
                disabled={!canProceed()}
                className="ml-auto text-sm md:text-base px-3 py-2 md:px-4 md:py-2"
              >
                <span className="hidden sm:inline">Selanjutnya</span>
                <span className="sm:hidden">Next</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={loading || !canProceed()}
                className="ml-auto text-sm md:text-base px-3 py-2 md:px-4 md:py-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span className="hidden sm:inline">Memproses...</span>
                    <span className="sm:hidden">Loading...</span>
                  </>
                ) : (
                  <>
                    <span className="hidden sm:inline">Buat Pesanan</span>
                    <span className="sm:hidden">Order</span>
                  </>
                )}
              </Button>
            )}
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-red-50 border border-red-200 rounded-lg"
            >
              <p className="text-sm text-red-600">{error}</p>
            </motion.div>
          )}
        </div>

        {/* Desktop Summary Sidebar */}
        <div className="hidden lg:block lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="sticky top-20"
          >
            <Card className="shadow-lg border-2">
              <CardHeader>
                <CardTitle>Ringkasan Pesanan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.keys(quantities).length === 0 ? (
                  <p className="text-sm text-gray-500">
                    Belum ada layanan yang dipilih
                  </p>
                ) : (
                  <>
                    <AnimatePresence>
                      {products
                        .filter((p) => getQuantity(p.id) > 0)
                        .map((product) => {
                          const qty = getQuantity(product.id);
                          return (
                            <motion.div
                              key={product.id}
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="py-2 border-b"
                            >
                              <div className="flex justify-between text-sm mb-1">
                                <span className="font-medium">
                                  {product.name}
                                </span>
                                <span className="text-gray-600">x{qty}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">
                                  {formatCurrency(product.price)} × {qty}
                                </span>
                                <span className="font-semibold">
                                  {formatCurrency(product.price * qty)}
                                </span>
                              </div>
                            </motion.div>
                          );
                        })}
                    </AnimatePresence>

                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">Total</span>
                        <motion.span
                          key={totalPrice}
                          initial={{ scale: 1.2, color: "#2563eb" }}
                          animate={{ scale: 1, color: "#2563eb" }}
                          className="text-2xl font-bold"
                        >
                          {formatCurrency(totalPrice)}
                        </motion.span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-500 text-center mt-4">
                      Dengan memesan, Anda menyetujui syarat dan ketentuan kami
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

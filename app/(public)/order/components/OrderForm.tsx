// app/(public)/order/components/OrderForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { createOrderAction } from "@/actions/orderActions";
import { ProgressSteps } from "./shared/ProgressSteps";
import { Step1ServiceSelection } from "./steps/Step1ServiceSelection";
import { Step2CustomerInfo } from "./steps/Step2CustomerInfo";
import { Step3PickupInfo } from "./steps/Step3PickupInfo";
import { Step4Payment } from "./steps/Step4Payment";
import { CartSummary } from "./cart/CartSummary";
import { MobileCartSheet } from "./cart/MobileCartSheet";

interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  category: string;
}

interface OrderFormProps {
  products: Product[];
}

function OrderForm({ products }: OrderFormProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    address: "",
    pickupDate: "",
    notes: "",
    paymentMethod: "",
  });

  // ==================== HANDLERS ====================
  const updateQuantity = (productId: number, delta: number) => {
    setQuantities((prev) => {
      const current = prev[productId] || 0;
      const newQty = Math.max(0, current + delta);
      if (newQty === 0) {
        const { [productId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [productId]: newQty };
    });
  };

  const removeItem = (productId: number) => {
    const { [productId]: _, ...rest } = quantities;
    setQuantities(rest);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // ==================== VALIDATION ====================
  const canProceed = (): boolean => {
    if (currentStep === 1) return Object.keys(quantities).length > 0;
    if (currentStep === 2)
      return !!(formData.customerName && formData.customerPhone);
    if (currentStep === 3) return !!(formData.address && formData.pickupDate);
    if (currentStep === 4) return !!formData.paymentMethod;
    return false;
  };

  // ==================== SUBMIT ====================
  async function handleSubmit() {
    setLoading(true);
    setError("");

    try {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) =>
        form.append(key, value),
      );
      Object.entries(quantities).forEach(([productId, quantity]) => {
        form.append("productId[]", productId);
        form.append("shoesQty[]", quantity.toString());
      });

      const result = await createOrderAction(form);

      if (result.success) {
        const params = new URLSearchParams({
          orderNumber: result.orderNumber || "",
          customerName: result.customerName || formData.customerName,
          totalPrice: result.totalPrice?.toString() || "0",
          paymentMethod: result.paymentMethod || formData.paymentMethod,
        });
        router.push(`/order/success?${params.toString()}`);
      } else {
        setError(result.error || "Terjadi kesalahan saat membuat pesanan");
        setLoading(false);
      }
    } catch (err) {
      setError("Terjadi kesalahan yang tidak terduga. Silakan coba lagi.");
      setLoading(false);
    }
  }

  // ==================== CART DATA ====================
  const cartItems = products
    .filter((p) => quantities[p.id])
    .map((p) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      quantity: quantities[p.id],
      category: p.category,
    }));

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  // ==================== RENDER ====================
  return (
    <div className="space-y-6 pb-32 lg:pb-6">
      {/* Progress Steps */}
      <ProgressSteps currentStep={currentStep} />

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Form Steps (Left/Main Column) */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <Step1ServiceSelection
                key="step1"
                products={products}
                quantities={quantities}
                onQuantityChange={updateQuantity}
                onNext={() => setCurrentStep(2)}
                canProceed={canProceed()}
              />
            )}

            {currentStep === 2 && (
              <Step2CustomerInfo
                key="step2"
                formData={formData}
                onChange={handleInputChange}
                onBack={() => setCurrentStep(1)}
                onNext={() => setCurrentStep(3)}
                canProceed={canProceed()}
              />
            )}

            {currentStep === 3 && (
              <Step3PickupInfo
                key="step3"
                formData={formData}
                onChange={handleInputChange}
                onBack={() => setCurrentStep(2)}
                onNext={() => setCurrentStep(4)}
                canProceed={canProceed()}
              />
            )}

            {currentStep === 4 && (
              <Step4Payment
                key="step4"
                paymentMethod={formData.paymentMethod}
                onPaymentMethodChange={(value) =>
                  setFormData((prev) => ({ ...prev, paymentMethod: value }))
                }
                onBack={() => setCurrentStep(3)}
                onSubmit={handleSubmit}
                loading={loading}
                error={error}
                canSubmit={canProceed()}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Cart Summary (Right Sidebar - Desktop Only) */}
        <div className="hidden lg:block">
          <CartSummary
            items={cartItems}
            totalPrice={totalPrice}
            onRemoveItem={removeItem}
            onCheckout={() => setCurrentStep(2)}
            canCheckout={canProceed()}
            currentStep={currentStep}
          />
        </div>
      </div>

      {/* Mobile Cart Sheet */}
      <MobileCartSheet
        items={cartItems}
        totalPrice={totalPrice}
        onRemoveItem={removeItem}
        onCheckout={() => setCurrentStep(2)}
        canCheckout={canProceed()}
        currentStep={currentStep}
      />
    </div>
  );
}

export default OrderForm;

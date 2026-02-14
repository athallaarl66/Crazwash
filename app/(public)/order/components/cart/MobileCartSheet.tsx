// app/(public)/order/components/cart/MobileCartSheet.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import {
  ShoppingCart,
  ChevronUp,
  ChevronDown,
  ArrowRight,
  Sparkles,
  Trash2,
} from "lucide-react";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  category: string;
}

interface MobileCartSheetProps {
  items: CartItem[];
  totalPrice: number;
  onRemoveItem: (id: number) => void;
  onCheckout: () => void;
  canCheckout: boolean;
  currentStep: number;
}

function MobileCartSheet({
  items,
  totalPrice,
  onRemoveItem,
  onCheckout,
  canCheckout,
  currentStep,
}: MobileCartSheetProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  if (items.length === 0) return null;

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
      {/* Expanded Sheet */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsExpanded(false)}
          />
        )}

        {isExpanded && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25 }}
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl
                     max-h-[70vh] overflow-hidden"
          >
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 p-4">
              <div className="flex items-center justify-between text-white mb-2">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  <h3 className="font-bold text-lg">Keranjang Belanja</h3>
                </div>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <ChevronDown className="h-5 w-5" />
                </button>
              </div>
              <p className="text-blue-100 text-sm">{totalItems} item dipilih</p>
            </div>

            {/* Items */}
            <div className="p-4 space-y-3 overflow-y-auto max-h-[40vh]">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-100"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="font-bold text-sm">{item.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {item.category}
                        </Badge>
                        <span className="text-xs text-gray-600">
                          × {item.quantity}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="p-2 text-red-500 hover:bg-red-100 rounded-lg"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-xs text-gray-600">
                      {formatCurrency(item.price)} × {item.quantity}
                    </span>
                    <span className="font-bold text-blue-600">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Total & CTA */}
            <div className="sticky bottom-0 bg-white border-t-2 p-4 shadow-lg">
              <div className="flex justify-between items-center mb-3">
                <span className="font-semibold text-gray-700">Total Bayar</span>
                <span className="text-2xl font-bold text-blue-600">
                  {formatCurrency(totalPrice)}
                </span>
              </div>
              {currentStep === 1 && (
                <Button
                  onClick={() => {
                    setIsExpanded(false);
                    onCheckout();
                  }}
                  disabled={!canCheckout}
                  size="lg"
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 font-bold"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Lanjut ke Checkout
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapsed Bar */}
      {!isExpanded && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-2xl"
          onClick={() => setIsExpanded(true)}
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                <span className="font-bold">{totalItems} item</span>
              </div>
              <ChevronUp className="h-5 w-5" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-blue-100 mb-1">Total Bayar</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(totalPrice)}
                </p>
              </div>
              {currentStep === 1 && (
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCheckout();
                  }}
                  disabled={!canCheckout}
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-blue-50 font-bold"
                >
                  Lanjut
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export { MobileCartSheet };

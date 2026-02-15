// app/(public)/order/components/cart/MobileCartSheet.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
      {/* Backdrop */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-foreground/50 backdrop-blur-sm"
            onClick={() => setIsExpanded(false)}
          />
        )}

        {/* Expanded Sheet */}
        {isExpanded && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25 }}
            className="absolute bottom-0 left-0 right-0 bg-card rounded-t-3xl
                     max-h-[70vh] overflow-hidden"
            style={{ boxShadow: "var(--shadow-xl)" }}
          >
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-primary to-accent p-4">
              <div className="flex items-center justify-between text-primary-foreground mb-2">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  <h3 className="text-h5">Keranjang Belanja</h3>
                </div>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-2 hover:bg-primary-foreground/20 rounded-full transition-colors"
                >
                  <ChevronDown className="h-5 w-5" />
                </button>
              </div>
              <p className="text-body-sm text-primary-foreground/80">
                {totalItems} item dipilih
              </p>
            </div>

            {/* Items */}
            <div className="p-4 space-y-3 overflow-y-auto max-h-[40vh]">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="p-3 bg-gradient-to-r from-primary/5 to-accent/10 rounded-xl 
                           border-2 border-primary/20"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="text-body font-bold text-card-foreground">
                        {item.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-body-sm px-2 py-0.5 border border-border rounded bg-muted">
                          {item.category}
                        </span>
                        <span className="text-body-sm text-muted-foreground">
                          × {item.quantity}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-primary/20">
                    <span className="text-body-sm text-muted-foreground">
                      {formatCurrency(item.price)} × {item.quantity}
                    </span>
                    <span className="text-body-lg font-bold text-primary">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Total & CTA */}
            <div
              className="sticky bottom-0 bg-card border-t-2 border-border p-4"
              style={{ boxShadow: "var(--shadow-lg)" }}
            >
              <div className="flex justify-between items-center mb-3">
                <span className="text-body font-semibold text-card-foreground">
                  Total Bayar
                </span>
                <span className="text-h3 font-bold text-primary">
                  {formatCurrency(totalPrice)}
                </span>
              </div>
              {currentStep === 1 && (
                <button
                  onClick={() => {
                    setIsExpanded(false);
                    onCheckout();
                  }}
                  disabled={!canCheckout}
                  className="w-full h-12 bg-gradient-to-r from-primary to-accent 
                           text-primary-foreground font-bold rounded-lg
                           flex items-center justify-center gap-2
                           hover:opacity-90 transition-all
                           disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    boxShadow: canCheckout ? "var(--shadow-lg)" : "none",
                  }}
                >
                  <Sparkles className="h-5 w-5" />
                  Lanjut ke Checkout
                  <ArrowRight className="h-5 w-5" />
                </button>
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
          className="bg-gradient-to-r from-primary to-accent text-primary-foreground"
          style={{ boxShadow: "var(--shadow-xl)" }}
          onClick={() => setIsExpanded(true)}
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                <span className="text-body-lg font-bold">
                  {totalItems} item
                </span>
              </div>
              <ChevronUp className="h-5 w-5" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body-sm text-primary-foreground/80 mb-1">
                  Total Bayar
                </p>
                <p className="text-h3 font-bold">
                  {formatCurrency(totalPrice)}
                </p>
              </div>
              {currentStep === 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCheckout();
                  }}
                  disabled={!canCheckout}
                  className="px-6 py-3 bg-card text-primary hover:bg-card/90 
                           font-bold rounded-lg transition-all flex items-center gap-2
                           disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ boxShadow: "var(--shadow-md)" }}
                >
                  Lanjut
                  <ArrowRight className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export { MobileCartSheet };

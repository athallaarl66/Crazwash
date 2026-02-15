// app/(public)/order/components/cart/CartSummary.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { formatCurrency } from "@/lib/utils";
import {
  ShoppingCart,
  Trash2,
  Package,
  ArrowRight,
  Sparkles,
} from "lucide-react";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  category: string;
}

interface CartSummaryProps {
  items: CartItem[];
  totalPrice: number;
  onRemoveItem: (id: number) => void;
  onCheckout: () => void;
  canCheckout: boolean;
  currentStep: number;
}

function CartSummary({
  items,
  totalPrice,
  onRemoveItem,
  onCheckout,
  canCheckout,
  currentStep,
}: CartSummaryProps) {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className="sticky top-20"
    >
      <div className="card-custom overflow-hidden border-2 border-primary/20">
        {/* Header dengan gradient */}
        <div className="bg-gradient-to-r from-primary to-accent p-4">
          <div className="flex items-center justify-between text-primary-foreground">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              <h3 className="text-h5">Keranjang</h3>
            </div>
            <div className="bg-card text-primary px-3 py-1 rounded-full font-bold text-body-sm">
              {totalItems} item
            </div>
          </div>
        </div>

        <div className="p-0">
          {items.length === 0 ? (
            // Empty State
            <div className="p-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <Package className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-body font-medium text-card-foreground mb-1">
                Keranjang masih kosong
              </p>
              <p className="text-body-sm text-muted-foreground">
                Pilih layanan di sebelah kiri
              </p>
            </div>
          ) : (
            <>
              {/* Items List */}
              <div className="p-4 space-y-3 max-h-[400px] overflow-y-auto">
                <AnimatePresence>
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20, height: 0 }}
                      className="group relative p-3 bg-gradient-to-r from-primary/5 to-accent/10 
                               rounded-xl border-2 border-primary/20 hover:border-primary/40 
                               transition-all duration-300"
                    >
                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.id)}
                        className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-destructive 
                                 text-destructive-foreground flex items-center justify-center
                                 hover:opacity-90 transition-all opacity-0 group-hover:opacity-100"
                        style={{ boxShadow: "var(--shadow-lg)" }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>

                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0 mr-2">
                          <p className="text-body font-bold text-card-foreground truncate">
                            {item.name}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-body-sm px-2 py-0.5 border border-border rounded bg-muted text-muted-foreground">
                              {item.category}
                            </span>
                            <span className="text-body-sm text-muted-foreground">
                              × {item.quantity}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-primary/20">
                        <span className="text-body-sm text-muted-foreground">
                          {formatCurrency(item.price)} × {item.quantity}
                        </span>
                        <span className="text-body-lg font-bold text-primary">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Separator */}
              <div className="h-px bg-border mx-4" />

              {/* Total Section */}
              <div className="p-4 bg-gradient-to-b from-card to-primary/5">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-body text-muted-foreground">
                    <span>Subtotal ({totalItems} item)</span>
                    <span className="font-semibold text-card-foreground">
                      {formatCurrency(totalPrice)}
                    </span>
                  </div>
                </div>

                <div className="h-px bg-border my-3" />

                <div className="flex justify-between items-center mb-4">
                  <span className="text-h5 text-card-foreground">
                    Total Bayar
                  </span>
                  <motion.div
                    key={totalPrice}
                    initial={{ scale: 1.2, color: "var(--primary)" }}
                    animate={{ scale: 1, color: "var(--primary)" }}
                    className="text-h2 font-bold"
                  >
                    {formatCurrency(totalPrice)}
                  </motion.div>
                </div>

                {/* Checkout CTA */}
                {currentStep === 1 && (
                  <button
                    onClick={onCheckout}
                    disabled={!canCheckout}
                    className="w-full h-12 bg-gradient-to-r from-primary to-accent 
                             hover:opacity-90 text-primary-foreground font-bold rounded-lg
                             transition-all duration-300 flex items-center justify-center gap-2
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

              {/* Trust Badge */}
              <div className="px-4 pb-4">
                <div className="p-3 bg-success/10 border border-success/30 rounded-lg">
                  <p className="text-body-sm text-success text-center font-medium">
                    ✓ Pembayaran aman & terpercaya
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export { CartSummary };

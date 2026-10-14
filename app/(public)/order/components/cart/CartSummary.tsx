// app/(public)/order/components/cart/CartSummary.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { formatCurrency } from "@/lib/utils";
import { ShoppingCart, Trash2, Package } from "lucide-react";

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
}

// Summary only: advancing steps is Step 1's single "Selanjutnya" button, so this
// panel carries no second checkout affordance.
function CartSummary({ items, totalPrice, onRemoveItem }: CartSummaryProps) {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className="sticky top-20"
    >
      <div className="card-custom overflow-hidden border-2 border-border">
        {/* Header */}
        <div className="bg-primary p-4">
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
                      className="group relative p-3 bg-card rounded-xl border-2 border-border"
                    >
                      {/* Delete Button */}
                      <button
                        type="button"
                        aria-label={`Hapus ${item.name} dari keranjang`}
                        onClick={() => onRemoveItem(item.id)}
                        className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-destructive
                                 text-destructive-foreground flex items-center justify-center
                                 hover:opacity-90 transition-colors"
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

                      <div className="flex items-center justify-between pt-2 border-t border-border">
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

              {/* Total Section */}
              <div className="p-4 border-t-2 border-border">
                <div className="flex justify-between text-body text-muted-foreground">
                  <span>Subtotal ({totalItems} item)</span>
                  <span className="font-semibold text-card-foreground">
                    {formatCurrency(totalPrice)}
                  </span>
                </div>

                <div className="flex justify-between items-center mt-3 pt-3 border-t border-border">
                  <span className="text-h5 text-card-foreground">
                    Total Bayar
                  </span>
                  <span className="text-h4 font-bold text-primary tabular-nums">
                    {formatCurrency(totalPrice)}
                  </span>
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

// app/(public)/order/components/cart/CartSummary.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
      <Card className="shadow-xl border-2 border-blue-100 overflow-hidden">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              <h3 className="font-bold text-lg">Keranjang</h3>
            </div>
            <Badge
              variant="secondary"
              className="bg-white text-blue-600 font-bold"
            >
              {totalItems} item
            </Badge>
          </div>
        </div>

        <CardContent className="p-0">
          {items.length === 0 ? (
            // Empty State
            <div className="p-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <Package className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500 mb-1 font-medium">
                Keranjang masih kosong
              </p>
              <p className="text-xs text-gray-400">
                Pilih layanan di sebelah kiri
              </p>
            </div>
          ) : (
            <>
              {/* Items List */}
              <div className="p-4 space-y-3 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-100">
                <AnimatePresence>
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20, height: 0 }}
                      className="group relative p-3 bg-gradient-to-r from-blue-50 to-indigo-50 
                               rounded-xl border-2 border-blue-100 hover:border-blue-300 
                               transition-all duration-300"
                    >
                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.id)}
                        className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-red-500 
                                 text-white flex items-center justify-center shadow-lg
                                 hover:bg-red-600 transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>

                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0 mr-2">
                          <p className="font-bold text-sm text-gray-800 truncate">
                            {item.name}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs h-5">
                              {item.category}
                            </Badge>
                            <span className="text-xs text-gray-600">
                              × {item.quantity}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-blue-200">
                        <span className="text-xs text-gray-600">
                          {formatCurrency(item.price)} × {item.quantity}
                        </span>
                        <span className="text-base font-bold text-blue-600">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <Separator />

              {/* Total Section */}
              <div className="p-4 bg-gradient-to-b from-white to-blue-50">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal ({totalItems} item)</span>
                    <span className="font-semibold">
                      {formatCurrency(totalPrice)}
                    </span>
                  </div>
                </div>

                <Separator className="my-3" />

                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-bold text-gray-800">
                    Total Bayar
                  </span>
                  <motion.div
                    key={totalPrice}
                    initial={{ scale: 1.2, color: "#2563eb" }}
                    animate={{ scale: 1, color: "#2563eb" }}
                    className="text-3xl font-bold"
                  >
                    {formatCurrency(totalPrice)}
                  </motion.div>
                </div>

                {/* Checkout CTA */}
                {currentStep === 1 && (
                  <Button
                    onClick={onCheckout}
                    disabled={!canCheckout}
                    size="lg"
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 
                             hover:from-blue-700 hover:to-indigo-700 text-white font-bold
                             shadow-lg hover:shadow-xl transition-all duration-300
                             disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Sparkles className="mr-2 h-5 w-5" />
                    Lanjut ke Checkout
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                )}
              </div>

              {/* Trust Badge */}
              <div className="px-4 pb-4">
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-xs text-green-800 text-center font-medium">
                    ✓ Pembayaran aman & terpercaya
                  </p>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export { CartSummary };

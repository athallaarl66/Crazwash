// app/(public)/order/components/shared/ProductCard.tsx
"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { CheckCircle2, Minus, Plus } from "lucide-react";

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    description: string | null;
    price: number;
    category: string;
  };
  quantity: number;
  onQuantityChange: (id: number, delta: number) => void;
  index: number;
}

const CATEGORY_COLORS: Record<string, string> = {
  BASIC: "bg-blue-500",
  PREMIUM: "bg-purple-500",
  DEEP: "bg-orange-500",
  TREATMENT: "bg-green-500",
};

function ProductCard({
  product,
  quantity,
  onQuantityChange,
  index,
}: ProductCardProps) {
  const isSelected = quantity > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`
        relative p-4 rounded-2xl transition-all duration-300
        ${
          isSelected
            ? "bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-400 shadow-lg"
            : "bg-white border-2 border-gray-200 hover:border-blue-300 hover:shadow-md"
        }
      `}
    >
      {/* Category Badge */}
      <div className="absolute -top-2 -left-2">
        <div
          className={`${CATEGORY_COLORS[product.category]} h-8 w-8 rounded-full flex items-center justify-center shadow-lg`}
        >
          <span className="text-white text-xs font-bold">
            {product.category[0]}
          </span>
        </div>
      </div>

      {/* Selected Indicator */}
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2"
        >
          <CheckCircle2 className="h-7 w-7 text-green-500 bg-white rounded-full" />
        </motion.div>
      )}

      {/* Content */}
      <div className="space-y-3 pt-2">
        {/* Title & Price */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-base md:text-lg text-gray-900 mb-1">
              {product.name}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2">
              {product.description}
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-2xl font-bold text-blue-600">
              {formatCurrency(product.price)}
            </p>
            <p className="text-xs text-gray-500">per pasang</p>
          </div>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center justify-between pt-3 border-t-2">
          <span className="text-sm font-semibold text-gray-700">Jumlah:</span>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              size="icon"
              variant={quantity > 0 ? "default" : "outline"}
              onClick={() => onQuantityChange(product.id, -1)}
              disabled={quantity === 0}
              className="h-11 w-11 rounded-full shadow-md hover:shadow-lg transition-all"
            >
              <Minus className="h-5 w-5" />
            </Button>

            <motion.span
              key={quantity}
              initial={{ scale: 1.3 }}
              animate={{ scale: 1 }}
              className="text-2xl font-bold w-10 text-center text-blue-600"
            >
              {quantity}
            </motion.span>

            <Button
              type="button"
              size="icon"
              onClick={() => onQuantityChange(product.id, 1)}
              className="h-11 w-11 rounded-full shadow-md hover:shadow-lg transition-all
                       bg-gradient-to-r from-blue-600 to-indigo-600"
            >
              <Plus className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Subtotal */}
        {isSelected && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="pt-3 border-t-2 flex justify-between items-center bg-blue-100/50 -mx-4 -mb-4 px-4 py-3 rounded-b-xl"
          >
            <span className="text-sm font-semibold text-gray-700">
              Subtotal:
            </span>
            <span className="text-xl font-bold text-blue-600">
              {formatCurrency(product.price * quantity)}
            </span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export { ProductCard };

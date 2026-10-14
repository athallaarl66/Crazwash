// app/(public)/order/components/shared/ProductCard.tsx
"use client";

import { motion } from "framer-motion";
import { formatCurrency } from "@/lib/utils";
import type { ProductWithNumericPrice } from "@/lib/productService";
import { Minus, Plus } from "lucide-react";

interface ProductCardProps {
  product: ProductWithNumericPrice;
  quantity: number;
  onQuantityChange: (id: number, delta: number) => void;
  index: number;
}

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
        relative p-4 rounded-2xl transition-colors duration-200
        ${
          isSelected
            ? "bg-card border-2 border-primary shadow-soft"
            : "bg-card border-2 border-border hover:border-primary/40 card-custom"
        }
      `}
    >
      {/* Content */}
      <div className="space-y-3">
        {/* Title & Price */}
        <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-h5 text-card-foreground mb-1">
              {product.name}
            </h3>
            <p className="text-body-sm text-muted-foreground line-clamp-2">
              {product.description}
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-h4 text-primary">
              {formatCurrency(product.price)}
            </p>
            <p className="text-caption text-muted-foreground">per pasang</p>
          </div>
        </div>

        {/* Quantity Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-3 border-t-2 border-border gap-3">
          <span className="text-body font-semibold text-card-foreground">
            Jumlah:
          </span>
          <div className="flex items-center gap-2">
            {/* Minus Button */}
            <button
              type="button"
              aria-label={`Kurangi jumlah ${product.name}`}
              onClick={() => onQuantityChange(product.id, -1)}
              disabled={quantity === 0}
              className={`
                h-8 w-8 rounded-lg flex items-center justify-center
                transition-colors disabled:opacity-40 disabled:cursor-not-allowed
                ${
                  quantity > 0
                    ? "bg-primary text-primary-foreground hover:opacity-90"
                    : "bg-muted text-muted-foreground border border-border"
                }
              `}
            >
              <Minus className="h-4 w-4" />
            </button>

            {/* Quantity Display */}
            <span className="w-10 text-center text-body-lg font-bold tabular-nums text-primary">
              {quantity}
            </span>

            {/* Plus Button */}
            <button
              type="button"
              aria-label={`Tambah jumlah ${product.name}`}
              onClick={() => onQuantityChange(product.id, 1)}
              className="h-8 w-8 rounded-lg bg-primary text-primary-foreground
                       flex items-center justify-center hover:opacity-90 transition-colors"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Subtotal */}
        {isSelected && (
          <div className="pt-3 border-t-2 border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <span className="text-body font-semibold text-card-foreground">
              Subtotal:
            </span>
            <span className="text-h4 text-primary font-bold">
              {formatCurrency(product.price * quantity)}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export { ProductCard };

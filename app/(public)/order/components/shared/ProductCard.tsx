// app/(public)/order/components/shared/ProductCard.tsx
"use client";

import { motion } from "framer-motion";
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

const CATEGORY_CONFIG: Record<
  string,
  { color: string; bgColor: string; label: string }
> = {
  BASIC: {
    color: "text-info",
    bgColor: "bg-info",
    label: "B",
  },
  PREMIUM: {
    color: "text-accent",
    bgColor: "bg-accent",
    label: "P",
  },
  DEEP: {
    color: "text-warning",
    bgColor: "bg-warning",
    label: "D",
  },
  TREATMENT: {
    color: "text-success",
    bgColor: "bg-success",
    label: "T",
  },
};

function ProductCard({
  product,
  quantity,
  onQuantityChange,
  index,
}: ProductCardProps) {
  const isSelected = quantity > 0;
  const categoryConfig =
    CATEGORY_CONFIG[product.category] || CATEGORY_CONFIG.BASIC;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`
        relative p-4 rounded-2xl transition-all duration-300
        ${
          isSelected
            ? "bg-gradient-to-br from-primary/5 to-accent/10 border-2 border-primary shadow-soft-lg"
            : "bg-card border-2 border-border hover:border-primary/40 hover:shadow-soft card-custom"
        }
      `}
    >
      {/* Category Badge */}
      <div className="absolute -top-2 -left-2">
        <div
          className={`${categoryConfig.bgColor} h-8 w-8 rounded-full flex items-center justify-center`}
          style={{ boxShadow: "var(--shadow-md)" }}
        >
          <span className="text-white text-xs font-bold">
            {categoryConfig.label}
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
          <CheckCircle2 className="h-7 w-7 text-success bg-card rounded-full" />
        </motion.div>
      )}

      {/* Content */}
      <div className="space-y-3 pt-2">
        {/* Title & Price */}
        <div className="flex items-start justify-between gap-3">
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
        <div className="flex items-center justify-between pt-3 border-t-2 border-border">
          <span className="text-body font-semibold text-card-foreground">
            Jumlah:
          </span>
          <div className="flex items-center gap-3">
            {/* Minus Button */}
            <button
              type="button"
              onClick={() => onQuantityChange(product.id, -1)}
              disabled={quantity === 0}
              className={`
                h-11 w-11 rounded-full flex items-center justify-center
                transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed
                ${
                  quantity > 0
                    ? "bg-primary text-primary-foreground hover:opacity-90"
                    : "bg-muted text-muted-foreground border-2 border-border"
                }
              `}
              style={{ boxShadow: quantity > 0 ? "var(--shadow-md)" : "none" }}
            >
              <Minus className="h-5 w-5" />
            </button>

            {/* Quantity Display */}
            <motion.span
              key={quantity}
              initial={{ scale: 1.3 }}
              animate={{ scale: 1 }}
              className="text-h3 w-10 text-center text-primary font-bold"
            >
              {quantity}
            </motion.span>

            {/* Plus Button */}
            <button
              type="button"
              onClick={() => onQuantityChange(product.id, 1)}
              className="h-11 w-11 rounded-full bg-gradient-to-r from-primary to-accent 
                       text-primary-foreground flex items-center justify-center
                       hover:opacity-90 transition-all duration-200"
              style={{ boxShadow: "var(--shadow-md)" }}
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Subtotal */}
        {isSelected && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="pt-3 border-t-2 border-border flex justify-between items-center 
                     bg-primary/5 -mx-4 -mb-4 px-4 py-3 rounded-b-2xl"
          >
            <span className="text-body font-semibold text-card-foreground">
              Subtotal:
            </span>
            <span className="text-h4 text-primary font-bold">
              {formatCurrency(product.price * quantity)}
            </span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export { ProductCard };

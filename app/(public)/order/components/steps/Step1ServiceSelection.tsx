// app/(public)/order/components/steps/Step1ServiceSelection.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { CategoryTabs } from "../shared/CategoryTabs";
import { ProductCard } from "../shared/ProductCard";
import { ArrowRight } from "lucide-react";

interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  category: string;
}

interface Step1Props {
  products: Product[];
  quantities: Record<number, number>;
  onQuantityChange: (id: number, delta: number) => void;
  onNext: () => void;
  canProceed: boolean;
}

// ============================================
// MAPPING: Database Category → Display Info
// ============================================
// Ini sesuai dengan price list yang real

const CATEGORY_CONFIG = {
  BASIC: {
    label: "Cleaning Services",
    description:
      "Standard cleaning untuk sepatu, sandal, flatshoes, kids shoes",
  },
  PREMIUM: {
    label: "Premium Cleaning",
    description: "Fast cleaning & premium treatment",
  },
  DEEP: {
    label: "Deep Clean",
    description: "Pembersihan mendalam untuk hasil maksimal",
  },
  TREATMENT: {
    label: "Special Treatment",
    description:
      "Reglue, Repaint (Midsole/Upper), Unyellow - harga include deep clean",
  },
};

function Step1ServiceSelection({
  products,
  quantities,
  onQuantityChange,
  onNext,
  canProceed,
}: Step1Props) {
  const [activeCategory, setActiveCategory] = useState("BASIC");

  // Group products by category
  const productsByCategory = products.reduce(
    (acc, product) => {
      if (!acc[product.category]) acc[product.category] = [];
      acc[product.category].push(product);
      return acc;
    },
    {} as Record<string, Product[]>,
  );

  return (
    <motion.div
      key="step1"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-2 border-border bg-card text-card-foreground shadow-soft-lg">
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="text-h3 text-card-foreground">
            Pilih Layanan
          </CardTitle>
          <CardDescription className="text-body text-muted-foreground">
            Pilih kategori, lalu tambahkan layanan yang dibutuhkan
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <Tabs
            value={activeCategory}
            onValueChange={setActiveCategory}
            className="w-full"
          >
            {/* Category Tabs */}
            <CategoryTabs productsByCategory={productsByCategory} />

            {/* Products in Each Category */}
            {Object.entries(CATEGORY_CONFIG).map(([category, config]) => (
              <TabsContent
                key={category}
                value={category}
                className="space-y-4 mt-0"
              >
                {/* Category Description */}
                <div className="p-4 bg-gradient-to-r from-primary/5 to-accent/10 rounded-xl border-2 border-primary/20">
                  <p className="text-body text-card-foreground">
                    <strong className="text-primary font-bold">
                      {config.label}:
                    </strong>{" "}
                    {config.description}
                  </p>
                </div>

                {/* Product Grid */}
                <div className="grid gap-4 md:gap-6">
                  {productsByCategory[category]?.map((product, index) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      quantity={quantities[product.id] || 0}
                      onQuantityChange={onQuantityChange}
                      index={index}
                    />
                  ))}

                  {(!productsByCategory[category] ||
                    productsByCategory[category].length === 0) && (
                    <div className="text-center py-12 text-muted-foreground">
                      <p className="text-body">
                        Tidak ada layanan di kategori ini
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>

          {/* Navigation */}
          <div className="mt-6 flex justify-end">
            <Button
              type="button"
              onClick={onNext}
              disabled={!canProceed}
              size="lg"
              className="bg-gradient-to-r from-primary to-accent text-primary-foreground 
                       hover:opacity-90 transition-opacity shadow-soft-lg
                       disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto"
            >
              Selanjutnya
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export { Step1ServiceSelection };

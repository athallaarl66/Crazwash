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

const CATEGORY_CONFIG = {
  BASIC: {
    label: "Basic",
    description: "Cuci standar sepatu & aksesoris",
  },
  PREMIUM: {
    label: "Premium",
    description: "Layanan premium & express",
  },
  DEEP: {
    label: "Deep Clean",
    description: "Pembersihan mendalam",
  },
  TREATMENT: {
    label: "Treatment",
    description: "Perawatan & perbaikan khusus",
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
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl">Pilih Layanan</CardTitle>
          <CardDescription className="text-sm">
            Pilih kategori, lalu tambahkan layanan yang dibutuhkan
          </CardDescription>
        </CardHeader>
        <CardContent>
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
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
                  <p className="text-sm text-gray-700">
                    <strong className="text-blue-900">{config.label}:</strong>{" "}
                    {config.description}
                  </p>
                </div>

                {/* Product Grid */}
                <div className="grid gap-4">
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
                    <div className="text-center py-12 text-gray-400">
                      <p>Tidak ada layanan di kategori ini</p>
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
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 
                       hover:to-indigo-700 shadow-lg"
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

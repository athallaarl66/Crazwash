// app/(public)/order/components/shared/CategoryTabs.tsx
"use client";

import { TabsList, TabsTrigger } from "@/components/ui/tabs";

// ============================================
// MAPPING: Database Category → Display Label
// ============================================
// Database masih pakai: BASIC, PREMIUM, DEEP, TREATMENT
// Tapi frontend display sesuai price list

const CATEGORY_DISPLAY_CONFIG = {
  // Map BASIC & DEEP → "Cleaning Treatment"
  BASIC: {
    displayLabel: "Cleaning",
    icon: "🧼",
    description: "Standard cleaning services",
    sortOrder: 1,
  },

  // Map PREMIUM → juga masuk "Cleaning" (atau pisah kalau mau)
  PREMIUM: {
    displayLabel: "Premium Clean",
    icon: "✨",
    description: "Premium cleaning services",
    sortOrder: 2,
  },

  // Deep Clean
  DEEP: {
    displayLabel: "Deep Clean",
    icon: "💧",
    description: "Intensive deep cleaning",
    sortOrder: 3,
  },

  // Map TREATMENT → "Special Treatment"
  TREATMENT: {
    displayLabel: "Special Treatment",
    icon: "⚡",
    description: "Reglue, Repaint, Unyellow",
    sortOrder: 4,
  },
};

interface CategoryTabsProps {
  productsByCategory: Record<string, any[]>;
}

function CategoryTabs({ productsByCategory }: CategoryTabsProps) {
  // Get categories yang ada produknya
  const availableCategories = Object.keys(productsByCategory).filter(
    (cat) => productsByCategory[cat]?.length > 0,
  );

  return (
    <TabsList className="grid w-full mb-6 h-auto gap-2 bg-transparent grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {availableCategories
        .sort(
          (a, b) =>
            (CATEGORY_DISPLAY_CONFIG[a as keyof typeof CATEGORY_DISPLAY_CONFIG]
              ?.sortOrder || 99) -
            (CATEGORY_DISPLAY_CONFIG[b as keyof typeof CATEGORY_DISPLAY_CONFIG]
              ?.sortOrder || 99),
        )
        .map((category) => {
          const config =
            CATEGORY_DISPLAY_CONFIG[
              category as keyof typeof CATEGORY_DISPLAY_CONFIG
            ];
          const count = productsByCategory[category]?.length || 0;

          return (
            <TabsTrigger
              key={category}
              value={category}
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary 
                       data-[state=active]:to-accent data-[state=active]:text-primary-foreground
                       border-2 data-[state=active]:border-primary data-[state=active]:shadow-soft-lg
                       hover:border-primary/40 transition-all duration-300
                       flex flex-col items-center justify-center h-20 md:h-24 px-2"
            >
              {/* Icon */}
              <span className="text-2xl mb-1">{config?.icon || "📦"}</span>

              {/* Label */}
              <span className="text-body-sm md:text-body font-bold text-center leading-tight">
                {config?.displayLabel || category}
              </span>

              {/* Count */}
              <span className="text-caption opacity-80 mt-0.5">
                {count} item
              </span>
            </TabsTrigger>
          );
        })}
    </TabsList>
  );
}

export { CategoryTabs };

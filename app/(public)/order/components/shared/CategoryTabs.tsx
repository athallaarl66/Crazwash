// app/(public)/order/components/shared/CategoryTabs.tsx
"use client";

import { TabsList, TabsTrigger } from "@/components/ui/tabs";

// ============================================
// MAPPING: Database Category → Display Label
// ============================================
// Database still uses: BASIC, PREMIUM, DEEP, TREATMENT
// Labels follow the real price list. No icons: the label plus the item count
// already identify each tab without emoji or glyph noise.

const CATEGORY_DISPLAY_CONFIG = {
  BASIC: {
    displayLabel: "Cleaning",
    description: "Standard cleaning services",
    sortOrder: 1,
  },

  PREMIUM: {
    displayLabel: "Premium Clean",
    description: "Premium cleaning services",
    sortOrder: 2,
  },

  DEEP: {
    displayLabel: "Deep Clean",
    description: "Intensive deep cleaning",
    sortOrder: 3,
  },

  TREATMENT: {
    displayLabel: "Special Treatment",
    description: "Reglue, Repaint, Unyellow",
    sortOrder: 4,
  },
};

interface CategoryTabsProps {
  productsByCategory: Record<string, any[]>;
}

function CategoryTabs({ productsByCategory }: CategoryTabsProps) {
  // Only show categories that actually have products
  const availableCategories = Object.keys(productsByCategory)
    .filter((cat) => productsByCategory[cat]?.length > 0)
    .sort(
      (a, b) =>
        (CATEGORY_DISPLAY_CONFIG[a as keyof typeof CATEGORY_DISPLAY_CONFIG]
          ?.sortOrder || 99) -
        (CATEGORY_DISPLAY_CONFIG[b as keyof typeof CATEGORY_DISPLAY_CONFIG]
          ?.sortOrder || 99),
    );

  return (
    <TabsList className="grid w-full mb-6 h-auto gap-2 bg-transparent grid-cols-2 lg:grid-cols-4">
      {availableCategories.map((category) => {
        const config =
          CATEGORY_DISPLAY_CONFIG[
            category as keyof typeof CATEGORY_DISPLAY_CONFIG
          ];
        const count = productsByCategory[category]?.length || 0;

        return (
          <TabsTrigger
            key={category}
            value={category}
            className="flex h-11 items-center justify-center gap-2 rounded-lg border-2 border-border
                     bg-card px-3 text-card-foreground transition-colors
                     hover:border-primary/40
                     data-[state=active]:border-primary data-[state=active]:bg-primary
                     data-[state=active]:text-primary-foreground"
          >
            <span className="text-body font-semibold">
              {config?.displayLabel || category}
            </span>
            <span className="rounded-full bg-muted px-2 py-0.5 text-caption text-muted-foreground">
              {count}
            </span>
          </TabsTrigger>
        );
      })}
    </TabsList>
  );
}

export { CategoryTabs };

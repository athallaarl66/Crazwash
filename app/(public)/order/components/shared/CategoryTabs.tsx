// app/(public)/order/components/shared/CategoryTabs.tsx
"use client";

import { TabsList, TabsTrigger } from "@/components/ui/tabs";

const CATEGORY_CONFIG = {
  BASIC: { label: "Basic", count: 0 },
  PREMIUM: { label: "Premium", count: 0 },
  DEEP: { label: "Deep Clean", count: 0 },
  TREATMENT: { label: "Treatment", count: 0 },
};

interface CategoryTabsProps {
  productsByCategory: Record<string, any[]>;
}

function CategoryTabs({ productsByCategory }: CategoryTabsProps) {
  return (
    <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6 h-auto gap-2 bg-transparent">
      {Object.entries(CATEGORY_CONFIG).map(([key, config]) => {
        const count = productsByCategory[key]?.length || 0;
        return (
          <TabsTrigger
            key={key}
            value={key}
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 
                     data-[state=active]:to-indigo-600 data-[state=active]:text-white 
                     border-2 data-[state=active]:border-blue-600 data-[state=active]:shadow-lg
                     flex flex-col items-center justify-center h-16 md:h-20 
                     hover:border-blue-300 transition-all duration-300"
          >
            <span className="font-bold text-sm md:text-base">
              {config.label}
            </span>
            <span className="text-xs mt-1 opacity-80">{count} item</span>
          </TabsTrigger>
        );
      })}
    </TabsList>
  );
}

export { CategoryTabs };

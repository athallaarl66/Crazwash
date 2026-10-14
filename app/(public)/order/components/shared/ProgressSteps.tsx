// app/(public)/order/components/shared/ProgressSteps.tsx
"use client";

import { motion } from "framer-motion";
import { ShoppingBag, User, MapPin, CreditCard, Check } from "lucide-react";

const STEPS = [
  { id: 1, name: "Layanan", icon: ShoppingBag },
  { id: 2, name: "Data Diri", icon: User },
  { id: 3, name: "Pickup", icon: MapPin },
  { id: 4, name: "Pembayaran", icon: CreditCard },
];

interface ProgressStepsProps {
  currentStep: number;
}

function ProgressSteps({ currentStep }: ProgressStepsProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between max-w-3xl mx-auto mb-8 md:mb-12 gap-4">
      {STEPS.map((step, index) => {
        const Icon = step.icon;
        const isActive = currentStep === step.id;
        const isCompleted = currentStep > step.id;

        return (
          <div key={step.id} className="flex items-center flex-1">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center"
            >
              {/* Step Circle */}
              <div
                className={`
                  w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center
                  transition-colors duration-200
                  ${
                    isCompleted
                      ? "bg-success"
                      : isActive
                        ? "bg-primary"
                        : "bg-muted"
                  }
                `}
                style={{
                  boxShadow:
                    isCompleted || isActive ? "var(--shadow-md)" : "none",
                }}
              >
                {isCompleted ? (
                  <Check className="h-5 w-5 md:h-6 md:w-6 text-success-foreground" />
                ) : (
                  <Icon
                    className={`h-5 w-5 md:h-6 md:w-6 ${
                      isActive
                        ? "text-primary-foreground"
                        : "text-muted-foreground"
                    }`}
                  />
                )}
              </div>

              {/* Step Label */}
              <p
                className={`text-body-sm md:text-body mt-2 font-medium ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {step.name}
              </p>
            </motion.div>

            {/* Connector Line — horizontal only where the steps sit in a row,
                so the vertical mobile stack has no stray bars */}
            {index < STEPS.length - 1 && (
              <div
                className={`hidden sm:block flex-1 h-1 mx-2 md:mx-4 transition-colors duration-200 rounded-full ${
                  currentStep > step.id ? "bg-success" : "bg-border"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export { ProgressSteps };

"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { number: 1, label: "Shipping" },
  { number: 2, label: "Review" },
  { number: 3, label: "Confirmation" },
] as const;

interface StepIndicatorProps {
  currentStep: number;
}

export const StepIndicator = ({ currentStep }: StepIndicatorProps) => {
  return (
    <nav aria-label="Checkout progress" className="mb-8">
      <ol className="flex items-center justify-center gap-2 sm:gap-4">
        {STEPS.map((step, index) => {
          const isCompleted = currentStep > step.number;
          const isCurrent = currentStep === step.number;

          return (
            <li key={step.number} className="flex items-center gap-2 sm:gap-4">
              {/* Step circle */}
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors",
                    isCompleted &&
                      "border-primary bg-primary text-primary-foreground",
                    isCurrent &&
                      "border-primary bg-primary/10 text-primary",
                    !isCompleted &&
                      !isCurrent &&
                      "border-muted-foreground/30 text-muted-foreground/50"
                  )}
                  aria-current={isCurrent ? "step" : undefined}
                >
                  {isCompleted ? (
                    <Check className="size-4" />
                  ) : (
                    step.number
                  )}
                </div>
                {/* Label - hidden on mobile */}
                <span
                  className={cn(
                    "hidden text-sm font-medium sm:inline",
                    isCompleted && "text-primary",
                    isCurrent && "text-foreground",
                    !isCompleted && !isCurrent && "text-muted-foreground/50"
                  )}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector line (between steps) */}
              {index < STEPS.length - 1 && (
                <div
                  className={cn(
                    "h-px w-8 sm:w-16",
                    currentStep > step.number
                      ? "bg-primary"
                      : "bg-muted-foreground/30"
                  )}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

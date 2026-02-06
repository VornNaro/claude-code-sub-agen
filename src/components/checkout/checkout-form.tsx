"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { z } from "zod";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Package,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCartStore, type LocalCartItem } from "@/stores/cart-store";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const TAX_RATE = 0.0825;

const formatPrice = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

// ---------------------------------------------------------------------------
// Validation Schema
// ---------------------------------------------------------------------------

const shippingSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(
      /^[\d\s\-+()]+$/,
      "Phone number can only contain digits, spaces, dashes, and parentheses"
    ),
  address: z.string().min(5, "Please enter a valid street address"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zipCode: z
    .string()
    .min(5, "ZIP code must be at least 5 characters")
    .regex(/^\d{5}(-\d{4})?$/, "Please enter a valid ZIP code (e.g. 12345)"),
});

type ShippingFormData = z.infer<typeof shippingSchema>;

type FieldErrors = Partial<Record<keyof ShippingFormData, string>>;

const EMPTY_FORM: ShippingFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
};

// ---------------------------------------------------------------------------
// Generate a random order ID
// ---------------------------------------------------------------------------

const generateOrderId = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let id = "HYN-";
  for (let i = 0; i < 8; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
};

// ---------------------------------------------------------------------------
// Field Component (reduces repetition)
// ---------------------------------------------------------------------------

interface FormFieldProps {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}

const FormField = ({ id, label, error, children }: FormFieldProps) => (
  <div className="space-y-1.5">
    <label htmlFor={id} className="text-sm font-medium">
      {label}
    </label>
    {children}
    {error && (
      <p className="text-xs text-destructive" role="alert">
        {error}
      </p>
    )}
  </div>
);

// ---------------------------------------------------------------------------
// CheckoutForm
// ---------------------------------------------------------------------------

interface CheckoutFormProps {
  /** Callback when the internal step changes, so the parent can sync UI. */
  onStepChange?: (step: number) => void;
}

export const CheckoutForm = ({ onStepChange }: CheckoutFormProps) => {
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ShippingFormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  // Snapshot cart items before clearing so confirmation step can display them.
  const orderItemsRef = useRef<LocalCartItem[]>([]);

  // Notify parent of step changes
  useEffect(() => {
    onStepChange?.(currentStep);
  }, [currentStep, onStepChange]);

  // -------------------------------------------------------------------------
  // Handlers
  // -------------------------------------------------------------------------

  const handleChange = useCallback(
    (field: keyof ShippingFormData) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, [field]: e.target.value }));
        // Clear the field error on change
        setErrors((prev) => {
          if (!prev[field]) return prev;
          const next = { ...prev };
          delete next[field];
          return next;
        });
      },
    []
  );

  const validateShipping = useCallback((): boolean => {
    const result = shippingSchema.safeParse(formData);
    if (result.success) {
      setErrors({});
      return true;
    }
    const fieldErrors: FieldErrors = {};
    for (const issue of result.error.issues) {
      const field = issue.path[0] as keyof ShippingFormData;
      if (!fieldErrors[field]) {
        fieldErrors[field] = issue.message;
      }
    }
    setErrors(fieldErrors);
    return false;
  }, [formData]);

  const handleNext = useCallback(() => {
    if (currentStep === 1) {
      if (!validateShipping()) {
        toast.error("Please fix the errors in the form.");
        return;
      }
    }
    setCurrentStep((s) => Math.min(s + 1, 3));
  }, [currentStep, validateShipping]);

  const handleBack = useCallback(() => {
    setCurrentStep((s) => Math.max(s - 1, 1));
  }, []);

  const handlePlaceOrder = useCallback(async () => {
    setIsSubmitting(true);
    try {
      // Simulate network request
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const newOrderId = generateOrderId();
      setOrderId(newOrderId);
      // Snapshot items before clearing
      orderItemsRef.current = [...items];
      clearCart();
      setCurrentStep(3);
      toast.success("Order placed successfully!");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }, [items, clearCart]);

  // -------------------------------------------------------------------------
  // Step 1: Shipping Information
  // -------------------------------------------------------------------------

  const renderShippingStep = () => (
    <Card>
      <CardHeader>
        <CardTitle>Shipping Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField id="firstName" label="First Name" error={errors.firstName}>
            <Input
              id="firstName"
              placeholder="John"
              value={formData.firstName}
              onChange={handleChange("firstName")}
              aria-invalid={!!errors.firstName}
              autoComplete="given-name"
            />
          </FormField>

          <FormField id="lastName" label="Last Name" error={errors.lastName}>
            <Input
              id="lastName"
              placeholder="Doe"
              value={formData.lastName}
              onChange={handleChange("lastName")}
              aria-invalid={!!errors.lastName}
              autoComplete="family-name"
            />
          </FormField>

          <FormField id="email" label="Email" error={errors.email}>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleChange("email")}
              aria-invalid={!!errors.email}
              autoComplete="email"
            />
          </FormField>

          <FormField id="phone" label="Phone" error={errors.phone}>
            <Input
              id="phone"
              type="tel"
              placeholder="(555) 123-4567"
              value={formData.phone}
              onChange={handleChange("phone")}
              aria-invalid={!!errors.phone}
              autoComplete="tel"
            />
          </FormField>

          <div className="sm:col-span-2">
            <FormField
              id="address"
              label="Street Address"
              error={errors.address}
            >
              <Input
                id="address"
                placeholder="123 Main St"
                value={formData.address}
                onChange={handleChange("address")}
                aria-invalid={!!errors.address}
                autoComplete="street-address"
              />
            </FormField>
          </div>

          <FormField id="city" label="City" error={errors.city}>
            <Input
              id="city"
              placeholder="Los Angeles"
              value={formData.city}
              onChange={handleChange("city")}
              aria-invalid={!!errors.city}
              autoComplete="address-level2"
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField id="state" label="State" error={errors.state}>
              <Input
                id="state"
                placeholder="CA"
                value={formData.state}
                onChange={handleChange("state")}
                aria-invalid={!!errors.state}
                autoComplete="address-level1"
              />
            </FormField>

            <FormField id="zipCode" label="ZIP Code" error={errors.zipCode}>
              <Input
                id="zipCode"
                placeholder="90001"
                value={formData.zipCode}
                onChange={handleChange("zipCode")}
                aria-invalid={!!errors.zipCode}
                autoComplete="postal-code"
              />
            </FormField>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-6 flex justify-end">
          <Button onClick={handleNext}>
            Continue to Review
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  // -------------------------------------------------------------------------
  // Step 2: Order Review
  // -------------------------------------------------------------------------

  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const tax = Math.round(subtotal * TAX_RATE);
  const total = subtotal + tax;

  const renderReviewStep = () => (
    <div className="space-y-6">
      {/* Shipping address summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Shipping Address</CardTitle>
        </CardHeader>
        <CardContent>
          <address className="text-sm not-italic text-muted-foreground">
            <p className="font-medium text-foreground">
              {formData.firstName} {formData.lastName}
            </p>
            <p>{formData.address}</p>
            <p>
              {formData.city}, {formData.state} {formData.zipCode}
            </p>
            <p className="mt-1">{formData.email}</p>
            <p>{formData.phone}</p>
          </address>
        </CardContent>
      </Card>

      {/* Items */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Items ({items.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="divide-y">
            {items.map((item) => (
              <li
                key={item.vehicleId}
                className="flex items-center gap-4 py-3 first:pt-0 last:pb-0"
              >
                <div className="relative size-16 shrink-0 overflow-hidden rounded-md border bg-muted">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center">
                      <Package className="size-5 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex flex-1 items-center justify-between">
                  <span className="text-sm font-medium">{item.name}</span>
                  <span className="text-sm font-semibold">
                    {formatPrice(item.price)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Totals (visible on mobile where sidebar may be hidden) */}
      <Card className="lg:hidden">
        <CardContent className="pt-6">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Est. Tax</span>
              <span>{formatPrice(tax)}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-base font-semibold">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={handleBack}>
          <ArrowLeft className="size-4" />
          Back
        </Button>
        <Button onClick={handlePlaceOrder} disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Place Order
              <ShoppingBag className="size-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );

  // -------------------------------------------------------------------------
  // Step 3: Confirmation
  // -------------------------------------------------------------------------

  const renderConfirmationStep = () => {
    const confirmedItems = orderItemsRef.current;
    const confirmedSubtotal = confirmedItems.reduce(
      (sum, item) => sum + item.price,
      0
    );
    const confirmedTax = Math.round(confirmedSubtotal * TAX_RATE);
    const confirmedTotal = confirmedSubtotal + confirmedTax;

    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="flex flex-col items-center py-10 text-center">
            <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
              <CheckCircle2 className="size-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold">Order Confirmed!</h2>
            <p className="mt-2 text-muted-foreground">
              Thank you for your purchase. Your order has been placed
              successfully.
            </p>
            {orderId && (
              <p className="mt-3 text-sm">
                Order Number:{" "}
                <span className="font-mono font-semibold text-primary">
                  {orderId}
                </span>
              </p>
            )}
          </CardContent>
        </Card>

        {/* Order details recap */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Order Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Shipping */}
            <div>
              <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Shipping To
              </p>
              <address className="text-sm not-italic">
                <p className="font-medium">
                  {formData.firstName} {formData.lastName}
                </p>
                <p className="text-muted-foreground">
                  {formData.address}, {formData.city}, {formData.state}{" "}
                  {formData.zipCode}
                </p>
              </address>
            </div>

            <Separator />

            {/* Items recap */}
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Items
              </p>
              <ul className="space-y-2">
                {confirmedItems.map((item) => (
                  <li
                    key={item.vehicleId}
                    className="flex items-center justify-between text-sm"
                  >
                    <span>{item.name}</span>
                    <span className="font-medium">
                      {formatPrice(item.price)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <Separator />

            {/* Totals */}
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(confirmedSubtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span>{formatPrice(confirmedTax)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-base font-semibold">
                <span>Total</span>
                <span>{formatPrice(confirmedTotal)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="flex justify-center">
          <Button asChild size="lg">
            <Link href="/vehicles">
              <ShoppingBag className="size-4" />
              Continue Shopping
            </Link>
          </Button>
        </div>
      </div>
    );
  };

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  return (
    <div>
      {currentStep === 1 && renderShippingStep()}
      {currentStep === 2 && renderReviewStep()}
      {currentStep === 3 && renderConfirmationStep()}
    </div>
  );
};

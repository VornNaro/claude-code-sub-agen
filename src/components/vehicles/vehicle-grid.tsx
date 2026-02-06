import { cn } from "@/lib/utils";

interface VehicleGridProps {
  children: React.ReactNode;
  className?: string;
}

export function VehicleGrid({ children, className }: VehicleGridProps) {
  return (
    <div
      className={cn(
        "grid gap-4 sm:grid-cols-2 xl:grid-cols-3",
        className,
      )}
    >
      {children}
    </div>
  );
}

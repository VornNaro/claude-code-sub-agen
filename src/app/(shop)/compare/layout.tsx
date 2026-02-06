import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compare Vehicles",
  description: "Compare up to 4 Hyundai vehicles side by side.",
};

export default function CompareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

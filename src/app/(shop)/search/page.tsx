import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search",
  description: "Search for Hyundai vehicles by name, model, or features.",
};

export default function SearchPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">Search Vehicles</h1>
      <p className="mt-2 text-muted-foreground">
        Full-text search with Meilisearch integration will be built in Phase 4.
      </p>
    </div>
  );
}

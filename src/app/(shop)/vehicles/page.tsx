import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Vehicles",
  description: "Browse our complete lineup of Hyundai vehicles.",
};

export default function VehiclesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">All Vehicles</h1>
        <p className="mt-2 text-muted-foreground">
          Browse our complete Hyundai lineup. Scroll to load more.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        {/* Filter sidebar placeholder */}
        <aside className="hidden lg:block">
          <div className="rounded-lg border p-4">
            <h2 className="mb-4 font-semibold">Filters</h2>
            <p className="text-sm text-muted-foreground">
              Filter components will be added in Phase 3.
            </p>
          </div>
        </aside>

        {/* Vehicle grid placeholder */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Showing all vehicles</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <p className="col-span-full text-center text-muted-foreground py-12">
              Vehicle infinite scroll grid will be connected in Phase 3.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

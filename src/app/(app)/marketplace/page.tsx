import { Suspense } from "react";
import { getCurrentUser } from "@/lib/current-user";
import { listMarketplaceResources } from "@/services/resource.service";
import { MarketplaceCard } from "@/components/marketplace/marketplace-card";
import { MarketplaceFilters } from "@/components/marketplace/marketplace-filters";
import type { MarketplaceFilters as MarketplaceFiltersType } from "@/services/resource.service";

export const dynamic = "force-dynamic";

export default async function MarketplacePage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; q?: string; sort?: string }>;
}) {
  const params = await searchParams;
  const user = await getCurrentUser();

  const filters: MarketplaceFiltersType = {};
  if (params.type === "agent" || params.type === "skill" || params.type === "preset") {
    filters.type = params.type;
  }
  if (params.q) {
    filters.search = params.q;
  }
  if (params.sort === "recent" || params.sort === "popular") {
    filters.sort = params.sort;
  }

  const items = await listMarketplaceResources(filters);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Marketplace</h1>
        <p className="text-muted-foreground mt-1">
          Discover and install community resources
        </p>
      </div>

      <Suspense>
        <MarketplaceFilters />
      </Suspense>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-muted-foreground">
            No published resources yet. Be the first to share!
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <MarketplaceCard
              key={item.id}
              item={item}
              isAuthenticated={!!user}
            />
          ))}
        </div>
      )}
    </div>
  );
}

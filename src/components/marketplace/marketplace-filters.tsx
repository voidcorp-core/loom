"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const TYPES = [
  { value: "", label: "All" },
  { value: "agent", label: "Agents" },
  { value: "skill", label: "Skills" },
  { value: "preset", label: "Presets" },
];

const SORTS = [
  { value: "popular", label: "Popular" },
  { value: "recent", label: "Recent" },
];

export function MarketplaceFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentType = searchParams.get("type") ?? "";
  const currentSort = searchParams.get("sort") ?? "popular";
  const currentSearch = searchParams.get("q") ?? "";

  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`/marketplace?${params.toString()}`);
    },
    [router, searchParams]
  );

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search resources..."
          className="pl-9"
          defaultValue={currentSearch}
          onChange={(e) => {
            const value = e.target.value;
            // Debounce: update after user stops typing
            const timeout = setTimeout(() => updateParams("q", value), 300);
            return () => clearTimeout(timeout);
          }}
        />
      </div>
      <div className="flex gap-2">
        {TYPES.map((t) => (
          <Button
            key={t.value}
            variant={currentType === t.value ? "default" : "outline"}
            size="sm"
            onClick={() => updateParams("type", t.value)}
          >
            {t.label}
          </Button>
        ))}
      </div>
      <div className="flex gap-2">
        {SORTS.map((s) => (
          <Button
            key={s.value}
            variant={currentSort === s.value ? "default" : "outline"}
            size="sm"
            onClick={() => updateParams("sort", s.value)}
          >
            {s.label}
          </Button>
        ))}
      </div>
    </div>
  );
}

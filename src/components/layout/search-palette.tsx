"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Bot, Layers } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import type { SearchResult } from "@/types";
import { searchLibraryAction } from "@/actions/search.actions";

const iconMap = {
  skill: Sparkles,
  agent: Bot,
  preset: Layers,
};

const routeMap = {
  skill: "/skills",
  agent: "/agents",
  preset: "/presets",
};

export function SearchPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSearch = useCallback(async (value: string) => {
    setQuery(value);
    if (value.length < 2) {
      setResults([]);
      return;
    }
    const res = await searchLibraryAction(value);
    setResults(res);
  }, []);

  const handleSelect = (result: SearchResult) => {
    setOpen(false);
    router.push(`${routeMap[result.type]}/${result.slug}`);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen} shouldFilter={false}>
      <CommandInput
        placeholder="Search skills, agents, presets..."
        value={query}
        onValueChange={handleSearch}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {results.length > 0 && (
          <CommandGroup heading="Results">
            {results.map((r) => {
              const Icon = iconMap[r.type];
              return (
                <CommandItem
                  key={`${r.type}-${r.slug}`}
                  onSelect={() => handleSelect(r)}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  <div className="flex flex-col">
                    <span>{r.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {r.type} &mdash; {r.description}
                    </span>
                  </div>
                </CommandItem>
              );
            })}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}

import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PresetCard } from "@/components/library/preset-card";
import { listPresets } from "@/services/preset.service";

export default async function PresetsPage() {
  const presets = await listPresets();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Presets</h1>
          <p className="text-muted-foreground mt-1">
            Project scaffolding presets combining agents, skills, and boilerplate
          </p>
        </div>
        <Button asChild>
          <Link href="/presets/new">
            <Plus className="mr-2 h-4 w-4" />
            New Preset
          </Link>
        </Button>
      </div>

      {presets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-muted-foreground mb-4">
            No presets in your library yet
          </p>
          <Button asChild>
            <Link href="/presets/new">Create your first preset</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {presets.map((preset) => (
            <PresetCard key={preset.slug} preset={preset} />
          ))}
        </div>
      )}
    </div>
  );
}

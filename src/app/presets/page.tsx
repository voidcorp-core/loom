import { PresetCard } from "@/components/library/preset-card";
import { ResourceCreateButton } from "@/components/library/resource-create-button";
import { getCurrentUser } from "@/lib/current-user";
import { listPresetsForUser } from "@/services/preset.service";

export const dynamic = "force-dynamic";

export default async function PresetsPage() {
  const user = await getCurrentUser();
  const presets = await listPresetsForUser(user?.id ?? null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Presets</h1>
          <p className="text-muted-foreground mt-1">
            Project scaffolding presets combining agents, skills, and conventions
          </p>
        </div>
        {user && <ResourceCreateButton type="preset" label="Preset" />}
      </div>

      {presets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-muted-foreground">No presets in your library yet</p>
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

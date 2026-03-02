import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/current-user";
import { getPresetForUser } from "@/services/preset.service";
import { PresetDetail } from "./preset-detail";

export default async function PresetPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const user = await getCurrentUser();

  try {
    const preset = await getPresetForUser(slug, user?.id ?? null);
    return <PresetDetail preset={preset} isAuthenticated={!!user} />;
  } catch {
    notFound();
  }
}

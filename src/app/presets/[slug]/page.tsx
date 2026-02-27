import { notFound } from "next/navigation";
import { getPreset } from "@/services/preset.service";
import { PresetDetail } from "./preset-detail";

export default async function PresetPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  try {
    const preset = await getPreset(slug);
    return <PresetDetail preset={preset} />;
  } catch {
    notFound();
  }
}

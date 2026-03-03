import { NextRequest, NextResponse } from "next/server";
import { listMarketplaceResources } from "@/services/resource.service";

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const search = params.get("q") || undefined;
  const type = params.get("type") as "agent" | "skill" | "preset" | undefined;
  const sort = (params.get("sort") as "popular" | "recent") || undefined;

  const items = await listMarketplaceResources({ search, type, sort });

  return NextResponse.json({ items });
}

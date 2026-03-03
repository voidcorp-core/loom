import pc from "picocolors";
import { saveLocalAgent, saveLocalSkill, saveLocalPreset } from "../lib/local-library.js";
import type { SkillFile } from "../lib/library.js";

const DEFAULT_API_URL = "https://loom.voidcorp.io";

interface MarketplaceItem {
  id: string;
  type: string;
  slug: string;
  title: string;
  description: string;
  authorName: string | null;
  installCount: number;
}

interface ResourceFile {
  relativePath: string;
  content: string;
}

interface InstallResponse {
  resource: {
    id: string;
    type: string;
    slug: string;
    title: string;
    content: string;
    files: ResourceFile[] | null;
  };
}

function padEnd(str: string, len: number): string {
  return str + " ".repeat(Math.max(0, len - str.length));
}

function truncate(str: string, max: number): string {
  if (str.length <= max) return str;
  return str.slice(0, max - 1) + "…";
}

function getApiUrl(): string {
  return process.env.LOOM_API_URL ?? DEFAULT_API_URL;
}

export async function marketplaceSearchCommand(
  query?: string,
  opts?: { type?: string; sort?: string }
): Promise<void> {
  try {
    const url = new URL("/api/cli/marketplace", getApiUrl());
    if (query) url.searchParams.set("q", query);
    if (opts?.type) url.searchParams.set("type", opts.type);
    if (opts?.sort) url.searchParams.set("sort", opts.sort);

    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = (await res.json()) as { items: MarketplaceItem[] };

    if (data.items.length === 0) {
      console.log(pc.dim("\n  No results found.\n"));
      return;
    }

    console.log(
      pc.bold(pc.cyan(`\n  Marketplace${query ? ` — "${query}"` : ""}`))
    );
    console.log(pc.dim("  " + "─".repeat(70)));

    for (const item of data.items) {
      const type = pc.dim(`[${item.type}]`);
      const installs = pc.dim(`↓${item.installCount}`);
      const author = item.authorName ? pc.dim(`by ${item.authorName}`) : "";
      console.log(
        `  ${padEnd(pc.green(item.slug), 25)} ${padEnd(type, 14)} ${padEnd(truncate(item.title, 25), 27)} ${installs} ${author}`
      );
    }

    console.log(
      pc.dim(
        `\n  Install with: ${pc.reset("loom marketplace install <slug>")}\n`
      )
    );
  } catch (error) {
    if (error instanceof Error) {
      console.error(pc.red(`\n  ✗ ${error.message}\n`));
    } else {
      console.error(pc.red("\n  ✗ Could not reach the marketplace.\n"));
    }
    process.exit(1);
  }
}

export async function marketplaceInstallCommand(
  slug: string
): Promise<void> {
  try {
    const url = new URL("/api/cli/marketplace/install", getApiUrl());

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    });

    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      throw new Error(body.error ?? `HTTP ${res.status}`);
    }

    const data = (await res.json()) as InstallResponse;
    const r = data.resource;

    // Save to ~/.loom/library/
    if (r.type === "agent") {
      saveLocalAgent(r.slug, r.content);
    } else if (r.type === "skill") {
      const files: SkillFile[] = r.files?.length
        ? r.files.map((f) => ({ relativePath: f.relativePath, content: f.content }))
        : [{ relativePath: "SKILL.md", content: r.content }];
      saveLocalSkill(r.slug, files);
    } else if (r.type === "preset") {
      saveLocalPreset(r.slug, r.content);
    }

    console.log(
      pc.green(`\n  ✓ Installed "${r.title}" (${r.type}) to ~/.loom/library/\n`)
    );
    console.log(
      pc.dim(`  Use it: loom add ${r.type} ${r.slug}\n`)
    );
  } catch (error) {
    if (error instanceof Error) {
      console.error(pc.red(`\n  ✗ ${error.message}\n`));
    } else {
      console.error(pc.red("\n  ✗ Installation failed.\n"));
    }
    process.exit(1);
  }
}

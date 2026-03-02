import { config } from "dotenv";
config({ path: ".env.local" });
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { isNull } from "drizzle-orm";
import matter from "gray-matter";
import YAML from "yaml";
import * as schema from "./schema";

const LIBRARY_DIR = join(process.cwd(), "library");

async function seed() {
  const sql = neon(process.env.DATABASE_URL!);
  const db = drizzle(sql, { schema });

  console.log("Seeding database...\n");

  // Clear existing base resources (ownerId IS NULL)
  await db.delete(schema.resources).where(isNull(schema.resources.ownerId));
  console.log("Cleared existing base resources.\n");

  const inserted = { agents: 0, skills: 0, presets: 0 };

  // --- Agents ---
  const agentsDir = join(LIBRARY_DIR, "agents");
  const agentDirs = readdirSync(agentsDir).filter((d) =>
    statSync(join(agentsDir, d)).isDirectory()
  );

  for (const slug of agentDirs) {
    const filePath = join(agentsDir, slug, "AGENT.md");
    try {
      const raw = readFileSync(filePath, "utf-8");
      const { data } = matter(raw);

      await db.insert(schema.resources).values({
        type: "agent",
        slug,
        title: (data.name as string) || slug,
        content: raw,
        metadata: {
          name: data.name,
          description: data.description,
          role: data.role,
          color: data.color,
          tools: data.tools,
          skills: data.skills,
          model: data.model,
        },
        ownerId: null,
        isPublic: true,
      });
      inserted.agents++;
    } catch (err) {
      console.warn(`  Skipped agent ${slug}:`, (err as Error).message);
    }
  }
  console.log(`Inserted ${inserted.agents} agents.`);

  // --- Skills ---
  const skillsDir = join(LIBRARY_DIR, "skills");
  const skillDirs = readdirSync(skillsDir).filter((d) =>
    statSync(join(skillsDir, d)).isDirectory()
  );

  for (const slug of skillDirs) {
    const filePath = join(skillsDir, slug, "SKILL.md");
    try {
      const raw = readFileSync(filePath, "utf-8");
      const { data } = matter(raw);

      await db.insert(schema.resources).values({
        type: "skill",
        slug,
        title: (data.name as string) || slug,
        content: raw,
        metadata: {
          name: data.name,
          description: data.description,
        },
        ownerId: null,
        isPublic: true,
      });
      inserted.skills++;
    } catch (err) {
      console.warn(`  Skipped skill ${slug}:`, (err as Error).message);
    }
  }
  console.log(`Inserted ${inserted.skills} skills.`);

  // --- Presets ---
  const presetsDir = join(LIBRARY_DIR, "presets");
  const presetFiles = readdirSync(presetsDir).filter((f) =>
    f.endsWith(".yaml")
  );

  for (const fileName of presetFiles) {
    const slug = fileName.replace(/\.yaml$/, "");
    const filePath = join(presetsDir, fileName);
    try {
      const raw = readFileSync(filePath, "utf-8");
      const data = YAML.parse(raw);

      await db.insert(schema.resources).values({
        type: "preset",
        slug,
        title: (data.name as string) || slug,
        content: raw,
        metadata: {
          name: data.name,
          description: data.description,
          agentCount: data.agents?.length ?? 0,
          skillCount: data.skills?.length ?? 0,
        },
        ownerId: null,
        isPublic: true,
      });
      inserted.presets++;
    } catch (err) {
      console.warn(`  Skipped preset ${slug}:`, (err as Error).message);
    }
  }
  console.log(`Inserted ${inserted.presets} presets.`);

  console.log("\nSeed complete!");
  console.log(
    `Total: ${inserted.agents} agents, ${inserted.skills} skills, ${inserted.presets} presets`
  );
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});

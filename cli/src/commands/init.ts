import pc from "picocolors";
import matter from "gray-matter";
import {
  listPresets,
  getPreset,
  getAgent,
  getSkill,
  type Preset,
} from "../lib/library.js";
import { writeAgent, writeSkill, writeClaudeMd } from "../lib/writer.js";
import { generateClaudeMd } from "../lib/generator.js";

export async function initCommand(presetSlug?: string): Promise<void> {
  try {
    let preset: Preset;

    if (!presetSlug) {
      // Interactive: list presets and ask user to choose
      const presets = await listPresets();
      if (presets.length === 0) {
        console.error(pc.red("\n  No presets available.\n"));
        process.exit(1);
      }

      console.log(pc.bold(pc.cyan("\n  Available presets:\n")));
      presets.forEach((p, i) => {
        console.log(`  ${pc.bold(String(i + 1))}. ${pc.green(p.slug)} — ${p.description}`);
      });

      // Read from stdin
      const { createInterface } = await import("node:readline");
      const rl = createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      const answer = await new Promise<string>((resolve) => {
        rl.question(pc.cyan("\n  Choose a preset (number): "), (ans) => {
          rl.close();
          resolve(ans.trim());
        });
      });

      const index = parseInt(answer, 10) - 1;
      if (isNaN(index) || index < 0 || index >= presets.length) {
        console.error(pc.red("\n  Invalid selection.\n"));
        process.exit(1);
      }

      presetSlug = presets[index].slug;
      preset = await getPreset(presetSlug);
    } else {
      preset = await getPreset(presetSlug);
    }

    console.log(pc.bold(pc.cyan(`\n  Initializing preset "${preset.name}"...\n`)));

    // Fetch all agents and skills in parallel
    const agentResults = await Promise.allSettled(
      preset.agents.map((slug) => getAgent(slug))
    );
    const skillResults = await Promise.allSettled(
      preset.skills.map((slug) => getSkill(slug))
    );

    // Write agents
    const agentInfos: { slug: string; name: string; role: string }[] = [];
    for (let i = 0; i < preset.agents.length; i++) {
      const slug = preset.agents[i];
      const result = agentResults[i];
      if (result.status === "fulfilled") {
        writeAgent(slug, result.value.rawContent);
        const { data } = matter(result.value.rawContent);
        const fm = data as Record<string, string>;
        agentInfos.push({
          slug,
          name: fm.name || slug,
          role: fm.role || "",
        });
        console.log(pc.green(`  ✓ Agent: ${slug}`));
      } else {
        console.log(pc.yellow(`  ⚠ Agent "${slug}" skipped: ${result.reason}`));
      }
    }

    // Write skills
    for (let i = 0; i < preset.skills.length; i++) {
      const slug = preset.skills[i];
      const result = skillResults[i];
      if (result.status === "fulfilled") {
        writeSkill(slug, result.value.rawContent);
        console.log(pc.green(`  ✓ Skill: ${slug}`));
      } else {
        console.log(pc.yellow(`  ⚠ Skill "${slug}" skipped: ${result.reason}`));
      }
    }

    // Generate CLAUDE.md
    const claudeContent = generateClaudeMd(preset, agentInfos);
    writeClaudeMd(claudeContent);
    console.log(pc.green(`  ✓ CLAUDE.md generated`));

    // Recap
    const agentOk = agentResults.filter((r) => r.status === "fulfilled").length;
    const skillOk = skillResults.filter((r) => r.status === "fulfilled").length;
    console.log(
      pc.bold(
        pc.cyan(
          `\n  Done! ${agentOk} agent(s), ${skillOk} skill(s), CLAUDE.md ready.\n`
        )
      )
    );
  } catch (error) {
    if (error instanceof Error) {
      console.error(pc.red(`\n  Error: ${error.message}\n`));
    } else {
      console.error(pc.red("\n  An unknown error occurred.\n"));
    }
    process.exit(1);
  }
}

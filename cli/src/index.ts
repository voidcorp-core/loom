import { createRequire } from "node:module";
import { Command } from "commander";
import { listCommand } from "./commands/list.js";
import { addCommand } from "./commands/add.js";
import { initCommand } from "./commands/init.js";
import { resolveTarget, DEFAULT_TARGET, listTargetNames } from "./lib/target.js";

const require = createRequire(import.meta.url);
const { version } = require("../package.json");

const program = new Command();

program
  .name("loom")
  .description("Integrate Loom library (agents, skills, presets) into your project")
  .version(version);

program
  .command("list")
  .description("List available agents, skills, and presets")
  .argument("[type]", "Filter by type: agents, skills, or presets")
  .action(async (type?: string) => {
    await listCommand(type);
  });

program
  .command("add")
  .description("Download an agent or skill from the library")
  .argument("<type>", "Type: agent or skill")
  .argument("<slug>", "Slug of the agent or skill")
  .option("--target <name>", `Output target: ${[...listTargetNames(), "custom"].join(", ")}`, DEFAULT_TARGET)
  .option("--target-dir <dir>", "Custom target directory")
  .option("--context-file <file>", "Custom context file name")
  .action(async (type: string, slug: string, opts: Record<string, string>) => {
    const target = resolveTarget(opts.target, opts.targetDir, opts.contextFile);
    await addCommand(type, slug, target);
  });

program
  .command("init")
  .description("Initialize a project with a preset (agents + skills + context file)")
  .argument("[preset]", "Preset slug (interactive if omitted)")
  .option("--add-agent <slugs...>", "Add extra agents")
  .option("--remove-agent <slugs...>", "Remove agents from preset")
  .option("--add-skill <slugs...>", "Add extra skills")
  .option("--remove-skill <slugs...>", "Remove skills from preset")
  .option("--target <name>", `Output target: ${[...listTargetNames(), "custom"].join(", ")}`, DEFAULT_TARGET)
  .option("--target-dir <dir>", "Custom target directory")
  .option("--context-file <file>", "Custom context file name")
  .action(async (preset: string | undefined, opts: Record<string, unknown>) => {
    const target = resolveTarget(
      opts.target as string,
      opts.targetDir as string | undefined,
      opts.contextFile as string | undefined
    );
    await initCommand(preset, {
      addAgent: opts.addAgent as string[] | undefined,
      removeAgent: opts.removeAgent as string[] | undefined,
      addSkill: opts.addSkill as string[] | undefined,
      removeSkill: opts.removeSkill as string[] | undefined,
      target,
    });
  });

program.parse();

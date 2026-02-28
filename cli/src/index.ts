import { Command } from "commander";
import { listCommand } from "./commands/list.js";
import { addCommand } from "./commands/add.js";
import { initCommand } from "./commands/init.js";

const program = new Command();

program
  .name("loom")
  .description("Integrate Loom library (agents, skills, presets) into your project")
  .version("0.1.0");

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
  .action(async (type: string, slug: string) => {
    await addCommand(type, slug);
  });

program
  .command("init")
  .description("Initialize a project with a preset (agents + skills + CLAUDE.md)")
  .argument("[preset]", "Preset slug (interactive if omitted)")
  .option("--add-agent <slugs...>", "Add extra agents")
  .option("--remove-agent <slugs...>", "Remove agents from preset")
  .option("--add-skill <slugs...>", "Add extra skills")
  .option("--remove-skill <slugs...>", "Remove skills from preset")
  .action(async (preset: string | undefined, opts: Record<string, unknown>) => {
    await initCommand(preset, opts as import("./commands/init.js").InitOptions);
  });

program.parse();

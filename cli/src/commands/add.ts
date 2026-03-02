import pc from "picocolors";
import { getAgent, getSkill } from "../lib/library.js";
import { writeAgent, writeSkill } from "../lib/writer.js";
import type { TargetConfig } from "../lib/target.js";

export async function addCommand(
  type: string,
  slug: string,
  target: TargetConfig
): Promise<void> {
  if (type !== "agent" && type !== "skill") {
    console.error(pc.red(`\n  Error: Invalid type "${type}". Use "agent" or "skill".\n`));
    process.exit(1);
  }

  try {
    if (type === "agent") {
      const agent = await getAgent(slug);
      const filePath = writeAgent(target, slug, agent.rawContent);
      console.log(pc.green(`\n  ✓ Agent "${slug}" written to ${filePath}\n`));
    } else {
      const skill = await getSkill(slug);
      const filePath = writeSkill(target, slug, skill.rawContent);
      console.log(pc.green(`\n  ✓ Skill "${slug}" written to ${filePath}\n`));
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(pc.red(`\n  Error: ${error.message}\n`));
    } else {
      console.error(pc.red("\n  An unknown error occurred.\n"));
    }
    process.exit(1);
  }
}

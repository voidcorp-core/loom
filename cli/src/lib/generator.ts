import matter from "gray-matter";
import type { Preset } from "./library.js";

interface AgentInfo {
  slug: string;
  name: string;
  role: string;
}

export interface AgentWithSkills {
  slug: string;
  name: string;
  description: string;
  skills: string[];
}

export function generateClaudeMd(
  preset: Preset,
  agents: AgentInfo[]
): string {
  const lines: string[] = [];

  lines.push(`# ${preset.name}`);
  lines.push("");
  lines.push(preset.claudemd.projectDescription);
  lines.push("");

  // Principles
  if (preset.constitution.principles.length > 0) {
    lines.push("## Principles");
    for (const p of preset.constitution.principles) {
      lines.push(`- ${p}`);
    }
    lines.push("");
  }

  // Stack
  if (preset.constitution.stack.length > 0) {
    lines.push("## Stack");
    for (const s of preset.constitution.stack) {
      lines.push(`- ${s}`);
    }
    lines.push("");
  }

  // Conventions
  if (preset.constitution.conventions.length > 0) {
    lines.push("## Conventions");
    for (const c of preset.constitution.conventions) {
      lines.push(`- ${c}`);
    }
    lines.push("");
  }

  // Custom sections
  if (preset.constitution.customSections) {
    for (const [title, content] of Object.entries(preset.constitution.customSections)) {
      lines.push(`## ${title}`);
      lines.push(content);
      lines.push("");
    }
  }

  // Agents
  if (agents.length > 0) {
    lines.push("## Agents");
    for (const agent of agents) {
      lines.push(`- **${agent.slug}**: ${agent.name} — ${agent.role}`);
    }
    lines.push("");
  }

  // Orchestrator (always present)
  lines.push("## Orchestrator");
  lines.push("");
  lines.push("Use the orchestrator agent (`.claude/orchestrator.md`) as the main coordinator. It will analyze tasks, break them into subtasks, and delegate to the appropriate specialized agents listed above.");
  lines.push("");

  return lines.join("\n");
}

export function generateOrchestrator(
  templateContent: string,
  agents: AgentWithSkills[],
  presetSkills: string[]
): string {
  const { data: frontmatter, content } = matter(templateContent);

  // Build delegation rules
  const rules: string[] = [];
  const delegatesTo: string[] = [];

  for (const agent of agents) {
    if (agent.slug === "orchestrator") continue;

    delegatesTo.push(agent.slug);

    // Filter agent skills to only those present in the preset
    const relevantSkills = agent.skills.filter((s) => presetSkills.includes(s));

    let line = `- **${agent.slug}**: ${agent.description}`;
    if (relevantSkills.length > 0) {
      line += `. Skills: ${relevantSkills.join(", ")}`;
    }
    rules.push(line);
  }

  // Rebuild frontmatter with delegates-to
  const newFrontmatter = { ...frontmatter, "delegates-to": delegatesTo };

  // Replace placeholder in content
  const newContent = content.replace("{{DELEGATION_RULES}}", rules.join("\n"));

  // Reassemble with gray-matter
  return matter.stringify(newContent, newFrontmatter);
}

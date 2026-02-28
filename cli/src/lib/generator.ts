import type { Preset } from "./library.js";

interface AgentInfo {
  slug: string;
  name: string;
  role: string;
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

  // Orchestrator
  if (preset.claudemd.orchestratorRef) {
    lines.push("## Orchestrator");
    lines.push(preset.claudemd.orchestratorRef);
    lines.push("");
  }

  return lines.join("\n");
}

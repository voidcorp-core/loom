import pc from "picocolors";
import * as p from "@clack/prompts";
import matter from "gray-matter";
import {
  listPresets,
  listAgents,
  listSkills,
  getPreset,
  getAgent,
  getSkill,
  type Preset,
  type AgentSummary,
} from "../lib/library.js";
import { writeAgent, writeSkill, writeClaudeMd, writeOrchestrator } from "../lib/writer.js";
import { generateClaudeMd, generateOrchestrator, type AgentWithSkills } from "../lib/generator.js";

export interface InitOptions {
  addAgent?: string[];
  removeAgent?: string[];
  addSkill?: string[];
  removeSkill?: string[];
}

// --- Entry Point ---

export async function initCommand(presetSlug?: string, opts: InitOptions = {}): Promise<void> {
  try {
    const hasFlags = !!(opts.addAgent || opts.removeAgent || opts.addSkill || opts.removeSkill);

    if (!presetSlug && hasFlags) {
      console.error(pc.red("\n  Error: flags require a preset argument. Usage: loom init <preset> [flags]\n"));
      process.exit(1);
    }

    if (!presetSlug && !hasFlags) {
      await interactiveInit();
    } else {
      await nonInteractiveInit(presetSlug!, opts);
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

// --- Interactive Mode ---

async function interactiveInit(): Promise<void> {
  p.intro(pc.bgCyan(pc.black(" loom init ")));

  const presets = await listPresets();
  if (presets.length === 0) {
    p.cancel("No presets available.");
    process.exit(1);
  }

  const presetSlug = await p.select({
    message: "Choose a preset",
    options: presets.map((pr) => ({
      value: pr.slug,
      label: pr.name,
      hint: `${pr.agentCount} agents, ${pr.skillCount} skills`,
    })),
  });

  if (p.isCancel(presetSlug)) {
    p.cancel("Operation cancelled.");
    process.exit(0);
  }

  const preset = await getPreset(presetSlug as string);
  const allAgents = await listAgents();
  const allSkillSlugs = (await listSkills()).map((s) => s.slug);

  // Agent selection — orchestrator always included, not shown
  const nonOrchestratorAgents = allAgents.filter((a) => a.slug !== "orchestrator");
  const presetAgentSet = new Set(preset.agents);

  const selectedAgents = await p.multiselect({
    message: "Select agents",
    options: nonOrchestratorAgents.map((a) => ({
      value: a.slug,
      label: a.name,
      hint: a.description,
    })),
    initialValues: nonOrchestratorAgents
      .filter((a) => presetAgentSet.has(a.slug))
      .map((a) => a.slug),
    required: true,
  });

  if (p.isCancel(selectedAgents)) {
    p.cancel("Operation cancelled.");
    process.exit(0);
  }

  const agentSlugs = ["orchestrator", ...(selectedAgents as string[])];

  // Skill selection
  const skillOptions = computeAvailableSkills(preset, selectedAgents as string[], allAgents, allSkillSlugs);

  const selectedSkills = await p.multiselect({
    message: "Select skills",
    options: skillOptions.map((s) => ({
      value: s.slug,
      label: s.slug,
      hint: s.preSelected ? "recommended" : undefined,
    })),
    initialValues: skillOptions.filter((s) => s.preSelected).map((s) => s.slug),
    required: false,
  });

  if (p.isCancel(selectedSkills)) {
    p.cancel("Operation cancelled.");
    process.exit(0);
  }

  const skillSlugs = selectedSkills as string[];

  // Confirmation
  const confirmed = await p.confirm({
    message: `Scaffold with ${agentSlugs.length} agents and ${skillSlugs.length} skills?`,
  });

  if (p.isCancel(confirmed) || !confirmed) {
    p.cancel("Operation cancelled.");
    process.exit(0);
  }

  const s = p.spinner();
  s.start("Generating project files...");

  await generateAndWrite(preset, agentSlugs, skillSlugs);

  s.stop("Project files generated.");

  p.outro(pc.green(`Done! ${agentSlugs.length} agent(s), ${skillSlugs.length} skill(s), CLAUDE.md ready.`));
}

// --- Non-Interactive Mode ---

async function nonInteractiveInit(presetSlug: string, opts: InitOptions): Promise<void> {
  const preset = await getPreset(presetSlug);
  const allAgents = await listAgents();

  // Compute agents: preset ± flags (orchestrator always included)
  let agentSlugs = [...preset.agents];

  if (opts.addAgent) {
    for (const slug of opts.addAgent) {
      if (!agentSlugs.includes(slug)) agentSlugs.push(slug);
    }
  }

  if (opts.removeAgent) {
    agentSlugs = agentSlugs.filter(
      (s) => s === "orchestrator" || !opts.removeAgent!.includes(s)
    );
  }

  // Compute skills: remove orphans from removed agents, then apply flags
  const selectedNonOrch = agentSlugs.filter((s) => s !== "orchestrator");
  const linkedToSelected = new Set<string>();
  const linkedToRemoved = new Set<string>();

  for (const agent of allAgents) {
    if (selectedNonOrch.includes(agent.slug)) {
      for (const sk of agent.skills) linkedToSelected.add(sk);
    }
    if (opts.removeAgent?.includes(agent.slug)) {
      for (const sk of agent.skills) linkedToRemoved.add(sk);
    }
  }

  // Orphan skills: linked to a removed agent but NOT linked to any remaining agent
  const orphanSkills = new Set<string>();
  for (const sk of linkedToRemoved) {
    if (!linkedToSelected.has(sk)) orphanSkills.add(sk);
  }

  let skillSlugs = preset.skills.filter((s) => !orphanSkills.has(s));

  if (opts.addSkill) {
    for (const slug of opts.addSkill) {
      if (!skillSlugs.includes(slug)) skillSlugs.push(slug);
    }
  }

  if (opts.removeSkill) {
    skillSlugs = skillSlugs.filter((s) => !opts.removeSkill!.includes(s));
  }

  console.log(pc.bold(pc.cyan(`\n  Initializing preset "${preset.name}"...\n`)));

  await generateAndWrite(preset, agentSlugs, skillSlugs);

  console.log(
    pc.bold(
      pc.cyan(
        `\n  Done! ${agentSlugs.length} agent(s), ${skillSlugs.length} skill(s), CLAUDE.md ready.\n`
      )
    )
  );
}

// --- Shared Generation Logic ---

async function generateAndWrite(preset: Preset, agentSlugs: string[], skillSlugs: string[]): Promise<void> {
  // Fetch all agents and skills in parallel
  const agentResults = await Promise.allSettled(
    agentSlugs.map((slug) => getAgent(slug))
  );
  const skillResults = await Promise.allSettled(
    skillSlugs.map((slug) => getSkill(slug))
  );

  // Write agents (skip orchestrator — it will be generated separately)
  const agentInfos: { slug: string; name: string; role: string }[] = [];
  const agentsWithSkills: AgentWithSkills[] = [];
  let orchestratorTemplate: string | null = null;

  for (let i = 0; i < agentSlugs.length; i++) {
    const slug = agentSlugs[i];
    const result = agentResults[i];
    if (result.status === "fulfilled") {
      const { data } = matter(result.value.rawContent);
      const fm = data as Record<string, unknown>;

      if (slug === "orchestrator") {
        orchestratorTemplate = result.value.rawContent;
      } else {
        writeAgent(slug, result.value.rawContent);
        console.log(pc.green(`  ✓ Agent: ${slug}`));
      }

      agentInfos.push({
        slug,
        name: (fm.name as string) || slug,
        role: (fm.role as string) || "",
      });

      agentsWithSkills.push({
        slug,
        name: (fm.name as string) || slug,
        description: (fm.description as string) || "",
        skills: Array.isArray(fm.skills) ? (fm.skills as string[]) : [],
      });
    } else {
      console.log(pc.yellow(`  ⚠ Agent "${slug}" skipped: ${result.reason}`));
    }
  }

  // Generate and write orchestrator
  if (orchestratorTemplate) {
    const orchestratorContent = generateOrchestrator(
      orchestratorTemplate,
      agentsWithSkills,
      skillSlugs
    );
    writeOrchestrator(orchestratorContent);
    console.log(pc.green(`  ✓ orchestrator.md generated`));
  }

  // Write skills
  for (let i = 0; i < skillSlugs.length; i++) {
    const slug = skillSlugs[i];
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
}

// --- Skill Filtering Algorithm ---

interface SkillOption {
  slug: string;
  preSelected: boolean;
}

function computeAvailableSkills(
  preset: Preset,
  selectedAgentSlugs: string[],
  allAgents: AgentSummary[],
  allSkillSlugs: string[]
): SkillOption[] {
  // 1. Skills linked to selected agents
  const linkedToSelected = new Set<string>();
  for (const agent of allAgents) {
    if (selectedAgentSlugs.includes(agent.slug)) {
      for (const sk of agent.skills) linkedToSelected.add(sk);
    }
  }

  // 2. Skills linked to ANY agent
  const linkedToAny = new Set<string>();
  for (const agent of allAgents) {
    for (const sk of agent.skills) linkedToAny.add(sk);
  }

  const presetSkillSet = new Set(preset.skills);

  // 3. For each skill in the library
  return allSkillSlugs.map((slug) => {
    const preSelected =
      linkedToSelected.has(slug) ||
      (presetSkillSet.has(slug) && !linkedToAny.has(slug));

    return { slug, preSelected };
  });
}

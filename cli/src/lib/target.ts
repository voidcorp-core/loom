export interface TargetConfig {
  name: string;
  dir: string;
  agentsSubdir: string;
  skillsSubdir: string;
  orchestratorFile: string;
  contextFile: string;
}

export const CLAUDE_CODE_TARGET: TargetConfig = {
  name: "claude-code",
  dir: ".claude",
  agentsSubdir: "agents",
  skillsSubdir: "skills",
  orchestratorFile: "orchestrator.md",
  contextFile: "CLAUDE.md",
};

export function resolveTarget(
  targetName: string,
  customDir?: string,
  customContextFile?: string
): TargetConfig {
  if (targetName === "claude-code") return CLAUDE_CODE_TARGET;

  if (targetName === "custom") {
    if (!customDir || !customContextFile) {
      throw new Error(
        'Target "custom" requires --target-dir and --context-file.'
      );
    }
    return {
      name: "custom",
      dir: customDir,
      agentsSubdir: "agents",
      skillsSubdir: "skills",
      orchestratorFile: "orchestrator.md",
      contextFile: customContextFile,
    };
  }

  throw new Error(
    `Unknown target "${targetName}". Use "claude-code" or "custom".`
  );
}

export interface PresetBoilerplate {
  repo: string;
  branch?: string;
  shallow?: boolean;
}

export interface PresetConstitution {
  principles: string[];
  stack: string[];
  conventions: string[];
  customSections?: Record<string, string>;
}

export interface PresetClaudeMd {
  projectDescription: string;
  orchestratorRef: string;
}

export interface PresetSpecKit {
  enabled: boolean;
  aiFlag: string;
}

export interface Preset {
  slug: string;
  name: string;
  description: string;
  boilerplate: PresetBoilerplate;
  agents: string[];
  skills: string[];
  constitution: PresetConstitution;
  claudemd: PresetClaudeMd;
  specKit: PresetSpecKit;
  sha: string;
}

export interface PresetSummary {
  slug: string;
  name: string;
  description: string;
  agentCount: number;
  skillCount: number;
}

export interface CreatePresetInput {
  slug: string;
  name: string;
  description: string;
  boilerplate: PresetBoilerplate;
  agents: string[];
  skills: string[];
  constitution: PresetConstitution;
  claudemd: PresetClaudeMd;
  specKit: PresetSpecKit;
}

export type UpdatePresetInput = Partial<Omit<CreatePresetInput, "slug">>;

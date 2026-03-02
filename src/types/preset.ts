export interface PresetConstitution {
  principles: string[];
  stack: string[];
  conventions: string[];
  customSections?: Record<string, string>;
}

export interface PresetClaudeMd {
  projectDescription: string;
}

export interface Preset {
  slug: string;
  name: string;
  description: string;
  agents: string[];
  skills: string[];
  constitution: PresetConstitution;
  claudemd: PresetClaudeMd;
  sha: string;
}

export interface PresetSummary {
  slug: string;
  name: string;
  description: string;
  agentCount: number;
  skillCount: number;
}


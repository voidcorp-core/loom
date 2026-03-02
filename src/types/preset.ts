export interface PresetConstitution {
  principles: string[];
  conventions: string[];
  customSections?: Record<string, string>;
}

export interface PresetContext {
  projectDescription: string;
}

export interface Preset {
  slug: string;
  name: string;
  description: string;
  agents: string[];
  skills: string[];
  constitution: PresetConstitution;
  context: PresetContext;
  sha: string;
  rawContent?: string;
  resourceId?: string;
  isForked?: boolean;
  isPublic?: boolean;
}

export interface PresetSummary {
  slug: string;
  name: string;
  description: string;
  agentCount: number;
  skillCount: number;
  isForked?: boolean;
  resourceId?: string;
}


import { agentsPath } from "./library.service";
import { getFile, listDirectory, getTree } from "../lib/github";
import { parseFrontmatter } from "../lib/frontmatter";
import { NotFoundError } from "../lib/errors";
import type { Agent, AgentSummary, AgentFrontmatter } from "../types";

const AGENT_FILE = "AGENT.md";

export async function listAgents(): Promise<AgentSummary[]> {
  const dirs = await listDirectory(agentsPath());
  const summaries: AgentSummary[] = [];

  for (const dir of dirs) {
    const filePath = agentsPath(dir, AGENT_FILE);
    try {
      const file = await getFile(filePath);
      const { data } = parseFrontmatter<AgentFrontmatter>(file.content);
      summaries.push({
        slug: dir,
        name: data.name || dir,
        description: data.description || "",
        role: data.role || "general",
        color: data.color,
      });
    } catch {
      // skip malformed or missing entries
    }
  }

  return summaries.sort((a, b) => a.name.localeCompare(b.name));
}

export async function getAgent(slug: string): Promise<Agent> {
  const filePath = agentsPath(slug, AGENT_FILE);
  const dirPath = agentsPath(slug);

  let file;
  try {
    file = await getFile(filePath);
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw new NotFoundError("Agent", slug);
    }
    throw error;
  }

  const { data, content } = parseFrontmatter<AgentFrontmatter>(file.content);
  const files = await getTree(dirPath);

  return {
    slug,
    frontmatter: data,
    content,
    rawContent: file.content,
    path: filePath,
    directoryPath: dirPath,
    files,
    sha: file.sha,
  };
}

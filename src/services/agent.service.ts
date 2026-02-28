import { agentsPath } from "./library.service";
import {
  getFile,
  listDirectory,
  exists,
  putFile,
  getTree,
  deleteDirectory,
} from "../lib/github";
import { parseFrontmatter, serializeFrontmatter } from "../lib/frontmatter";
import { NotFoundError, ValidationError } from "../lib/errors";
import {
  Agent,
  AgentSummary,
  AgentFrontmatter,
  CreateAgentInput,
  UpdateAgentInput,
} from "../types";

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

export async function createAgent(input: CreateAgentInput): Promise<Agent> {
  const dirPath = agentsPath(input.slug);

  if (await exists(dirPath)) {
    throw new ValidationError(`Agent already exists: ${input.slug}`);
  }

  const raw = serializeFrontmatter(
    input.frontmatter as unknown as Record<string, unknown>,
    input.content
  );
  const filePath = agentsPath(input.slug, AGENT_FILE);
  await putFile(filePath, raw, `Create agent: ${input.slug}`);

  return getAgent(input.slug);
}

export async function updateAgent(
  slug: string,
  input: UpdateAgentInput
): Promise<Agent> {
  const existing = await getAgent(slug);

  const newFrontmatter = {
    ...existing.frontmatter,
    ...input.frontmatter,
  };
  const newContent =
    input.content !== undefined ? input.content : existing.content;

  const raw = serializeFrontmatter(
    newFrontmatter as unknown as Record<string, unknown>,
    newContent
  );
  await putFile(existing.path, raw, `Update agent: ${slug}`, existing.sha);

  return getAgent(slug);
}

export async function deleteAgent(slug: string): Promise<void> {
  const dirPath = agentsPath(slug);
  if (!(await exists(dirPath))) {
    throw new NotFoundError("Agent", slug);
  }
  await deleteDirectory(dirPath, `Delete agent: ${slug}`);
}

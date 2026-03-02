import { Octokit } from "octokit";
import { NotFoundError } from "./errors";
import { FileTreeNode } from "../types";

const owner = process.env.GITHUB_OWNER!;
const repo = process.env.GITHUB_REPO || "loom";
const branch = process.env.GITHUB_BRANCH || "main";
const libraryRoot = process.env.GITHUB_LIBRARY_PATH || "library";

let _octokit: Octokit | null = null;

function octokit(): Octokit {
  if (!_octokit) {
    _octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
  }
  return _octokit;
}

export function libraryPath(...segments: string[]): string {
  return [libraryRoot, ...segments].join("/");
}

export interface GitHubFile {
  content: string;
  sha: string;
  path: string;
}

export async function getFile(path: string): Promise<GitHubFile> {
  try {
    const { data } = await octokit().rest.repos.getContent({
      owner,
      repo,
      path,
      ref: branch,
    });

    if (Array.isArray(data) || data.type !== "file") {
      throw new Error(`Path is not a file: ${path}`);
    }

    const content = Buffer.from(data.content, "base64").toString("utf-8");
    return { content, sha: data.sha, path: data.path };
  } catch (error: unknown) {
    if (isGitHubError(error, 404)) {
      throw new NotFoundError("File", path);
    }
    throw error;
  }
}

export async function listDirectory(path: string): Promise<string[]> {
  try {
    const { data } = await octokit().rest.repos.getContent({
      owner,
      repo,
      path,
      ref: branch,
    });

    if (!Array.isArray(data)) {
      return [];
    }

    return data
      .map((entry) => entry.name)
      .sort();
  } catch (error: unknown) {
    if (isGitHubError(error, 404)) {
      return [];
    }
    throw error;
  }
}

export async function exists(path: string): Promise<boolean> {
  try {
    await octokit().rest.repos.getContent({
      owner,
      repo,
      path,
      ref: branch,
    });
    return true;
  } catch (error: unknown) {
    if (isGitHubError(error, 404)) {
      return false;
    }
    throw error;
  }
}

export async function getTree(path: string): Promise<FileTreeNode[]> {
  try {
    const { data } = await octokit().rest.repos.getContent({
      owner,
      repo,
      path,
      ref: branch,
    });

    if (!Array.isArray(data)) {
      return [];
    }

    const nodes: FileTreeNode[] = [];

    for (const entry of data.sort((a, b) => a.name.localeCompare(b.name))) {
      const relativePath = entry.path.replace(`${path}/`, "");

      if (entry.type === "dir") {
        nodes.push({
          name: entry.name,
          path: relativePath,
          type: "directory",
          children: await getTree(entry.path),
        });
      } else {
        nodes.push({
          name: entry.name,
          path: relativePath,
          type: "file",
        });
      }
    }

    return nodes;
  } catch (error: unknown) {
    if (isGitHubError(error, 404)) {
      return [];
    }
    throw error;
  }
}

function isGitHubError(error: unknown, status: number): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    (error as { status: number }).status === status
  );
}

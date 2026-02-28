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

export async function putFile(
  path: string,
  content: string,
  message: string,
  sha?: string
): Promise<string> {
  try {
    const { data } = await octokit().rest.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      message,
      content: Buffer.from(content).toString("base64"),
      branch,
      ...(sha ? { sha } : {}),
    });
    return data.content?.sha ?? "";
  } catch (error: unknown) {
    if (isGitHubError(error, 409)) {
      throw new Error(
        `Conflict updating ${path}. The file was modified by another process.`
      );
    }
    throw error;
  }
}

export async function deleteFile(
  path: string,
  sha: string,
  message: string
): Promise<void> {
  await octokit().rest.repos.deleteFile({
    owner,
    repo,
    path,
    message,
    sha,
    branch,
  });
}

export async function deleteDirectory(
  dirPath: string,
  message: string
): Promise<void> {
  const { data } = await octokit().rest.repos.getContent({
    owner,
    repo,
    path: dirPath,
    ref: branch,
  });

  if (!Array.isArray(data)) {
    throw new Error(`Path is not a directory: ${dirPath}`);
  }

  for (const entry of data) {
    if (entry.type === "dir") {
      await deleteDirectory(entry.path, message);
    } else {
      await deleteFile(entry.path, entry.sha!, message);
    }
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

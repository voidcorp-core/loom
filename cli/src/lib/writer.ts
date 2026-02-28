import fs from "node:fs";
import path from "node:path";

const CLAUDE_DIR = ".claude";

function ensureDir(dirPath: string): void {
  fs.mkdirSync(dirPath, { recursive: true });
}

export function writeAgent(slug: string, content: string, cwd = process.cwd()): string {
  const dir = path.join(cwd, CLAUDE_DIR, "agents");
  ensureDir(dir);
  const filePath = path.join(dir, `${slug}.md`);
  fs.writeFileSync(filePath, content, "utf-8");
  return filePath;
}

export function writeSkill(slug: string, content: string, cwd = process.cwd()): string {
  const dir = path.join(cwd, CLAUDE_DIR, "skills");
  ensureDir(dir);
  const filePath = path.join(dir, `${slug}.md`);
  fs.writeFileSync(filePath, content, "utf-8");
  return filePath;
}

export function writeClaudeMd(content: string, cwd = process.cwd()): string {
  const filePath = path.join(cwd, "CLAUDE.md");
  fs.writeFileSync(filePath, content, "utf-8");
  return filePath;
}

import fs from "node:fs";
import path from "node:path";
import type { TargetConfig } from "./target.js";

function ensureDir(dirPath: string): void {
  fs.mkdirSync(dirPath, { recursive: true });
}

export function writeAgent(target: TargetConfig, slug: string, content: string, cwd = process.cwd()): string {
  const dir = path.join(cwd, target.dir, target.agentsSubdir);
  ensureDir(dir);
  const filePath = path.join(dir, `${slug}.md`);
  fs.writeFileSync(filePath, content, "utf-8");
  return filePath;
}

export function writeSkill(target: TargetConfig, slug: string, content: string, cwd = process.cwd()): string {
  const dir = path.join(cwd, target.dir, target.skillsSubdir);
  ensureDir(dir);
  const filePath = path.join(dir, `${slug}.md`);
  fs.writeFileSync(filePath, content, "utf-8");
  return filePath;
}

export function writeOrchestrator(target: TargetConfig, content: string, cwd = process.cwd()): string {
  const filePath = path.join(cwd, target.dir, target.orchestratorFile);
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content, "utf-8");
  return filePath;
}

export function writeContextFile(target: TargetConfig, content: string, cwd = process.cwd()): string {
  const filePath = path.join(cwd, target.contextFile);
  fs.writeFileSync(filePath, content, "utf-8");
  return filePath;
}

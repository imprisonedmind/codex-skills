import { readdir } from "node:fs/promises";
import { join } from "node:path";

export async function findGitRepos(root: string, maxDepth = 5): Promise<string[]> {
  const repos: string[] = [];

  async function visit(current: string, depth: number): Promise<void> {
    if (depth > maxDepth) return;

    const entries = await readdir(current, { withFileTypes: true });
    const hasGitDir = entries.some((entry) => entry.name === ".git");
    if (hasGitDir) {
      repos.push(current);
      return;
    }

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      if (entry.name.startsWith(".")) continue;
      await visit(join(current, entry.name), depth + 1);
    }
  }

  await visit(root, 0);
  return repos;
}

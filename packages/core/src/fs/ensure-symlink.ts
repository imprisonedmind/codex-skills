import { lstat, rm, symlink } from "node:fs/promises";
import { dirname, relative } from "node:path";

import { ensureDir } from "./ensure-dir";

export async function ensureSymlink(target: string, linkPath: string): Promise<void> {
  await ensureDir(dirname(linkPath));

  try {
    const stat = await lstat(linkPath);
    if (stat.isSymbolicLink()) {
      await rm(linkPath);
    } else {
      throw new Error(`Refusing to replace non-symlink at ${linkPath}`);
    }
  } catch (error) {
    if (!(error instanceof Error) || !("code" in error) || error.code !== "ENOENT") {
      throw error;
    }
  }

  const relativeTarget = relative(dirname(linkPath), target);
  await symlink(relativeTarget, linkPath);
}

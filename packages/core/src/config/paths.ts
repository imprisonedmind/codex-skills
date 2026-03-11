import { homedir } from "node:os";
import { join } from "node:path";

export function homePath(...parts: string[]): string {
  return join(homedir(), ...parts);
}

export const repoRoot = join(import.meta.dir, "..", "..", "..", "..");

export function envPath(name: string, fallback: string): string {
  const value = process.env[name]?.trim();
  return value && value.length > 0 ? value : fallback;
}

export function codexHome(): string {
  return envPath("CODEX_HOME", homePath(".codex"));
}

export function codexBinDir(): string {
  return envPath("CODEX_BIN_DIR", homePath("bin"));
}

export function workspacesRoot(): string {
  return envPath("CODEX_SKILLS_WORKSPACES_ROOT", homePath("Workspaces"));
}

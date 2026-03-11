import { homedir } from "node:os";
import { basename, join } from "node:path";

import { fetchJson, findGitRepos, runCommand, workspacesRoot } from "@codex-skills/core";

const WAKATIME_API = "https://wakatime.com/api/v1/users/current";

export interface WakaTimeBranchRow {
  name?: string;
  text?: string;
  total_seconds?: number;
  percent?: number;
}

interface WakaTimeProjectsResponse {
  data: Array<{ name?: string }>;
}

interface WakaTimeSummaryDay {
  branches?: WakaTimeBranchRow[];
}

interface WakaTimeSummariesResponse {
  data?: WakaTimeSummaryDay[];
}

function encodeBasicAuth(apiKey: string): string {
  return Buffer.from(`${apiKey}:`, "utf8").toString("base64");
}

export function wakatimeConfigPath(): string {
  return process.env.WAKATIME_CONFIG?.trim() || join(homedir(), ".wakatime.cfg");
}

export function wakatimeCliPath(): string {
  return join(homedir(), ".wakatime", "wakatime-cli");
}

export async function readApiKey(): Promise<string> {
  const configText = await Bun.file(wakatimeConfigPath()).text();
  const match = configText.match(/^\s*api_key\s*=\s*(.+)\s*$/m);
  if (!match) {
    throw new Error(`WakaTime api_key is not configured in ${wakatimeConfigPath()}`);
  }
  return match[1].trim();
}

async function fetchWithRetry<T>(url: string, apiKey: string): Promise<T> {
  const headers = {
    Authorization: `Basic ${encodeBasicAuth(apiKey)}`,
  };

  let delayMs = 1_000;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    try {
      return await fetchJson<T>(new Request(url, { headers }));
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (!message.includes("HTTP 429") || attempt === 3) {
        throw error;
      }
      await Bun.sleep(delayMs);
      delayMs *= 2;
    }
  }

  throw new Error("WakaTime request failed after retries");
}

export async function projectNames(start: string, end: string): Promise<string[]> {
  const apiKey = await readApiKey();
  const params = new URLSearchParams({ start, end });
  const url = `${WAKATIME_API}/projects?${params.toString()}`;
  const payload = await fetchWithRetry<WakaTimeProjectsResponse>(url, apiKey);
  return payload.data.map((item) => item.name).filter((value): value is string => Boolean(value));
}

export async function localProjectNames(): Promise<Set<string>> {
  const repos = await findGitRepos(workspacesRoot());
  return new Set(repos.map((repo) => basename(repo)));
}

export async function branchesForProject(
  start: string,
  end: string,
  project: string,
): Promise<WakaTimeBranchRow[]> {
  const apiKey = await readApiKey();
  const params = new URLSearchParams({ start, end, project });
  const url = `${WAKATIME_API}/summaries?${params.toString()}`;
  const payload = await fetchWithRetry<WakaTimeSummariesResponse>(url, apiKey);
  return payload.data?.[0]?.branches ?? [];
}

export async function branchSummaryForProject(
  start: string,
  end: string,
  project: string,
  branch: string,
): Promise<WakaTimeBranchRow | null> {
  const rows = await branchesForProject(start, end, project);
  const branchLower = branch.toLowerCase();
  return rows.find((row) => row.name?.toLowerCase() === branchLower) ?? null;
}

export async function matchingBranches(
  ticket: string,
  searchRoot: string,
): Promise<Array<{ repo: string; project: string; branch: string }>> {
  const repos = await findGitRepos(searchRoot);
  const escaped = ticket.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(escaped);
  const matches: Array<{ repo: string; project: string; branch: string }> = [];

  for (const repo of repos) {
    try {
      const result = await runCommand([
        "git",
        "-C",
        repo,
        "for-each-ref",
        "refs/heads",
        "--format=%(refname:short)",
      ]);
      for (const branch of result.stdout.split("\n").map((line) => line.trim()).filter(Boolean)) {
        if (regex.test(branch.toLowerCase())) {
          matches.push({ repo, project: basename(repo), branch });
        }
      }
    } catch {
      // Ignore repos that fail git inspection.
    }
  }

  return matches;
}

export async function runWakatimeCli(args: string[]): Promise<number> {
  const proc = Bun.spawn({
    cmd: [wakatimeCliPath(), ...args],
    stdin: "inherit",
    stdout: "inherit",
    stderr: "inherit",
  });
  return await proc.exited;
}

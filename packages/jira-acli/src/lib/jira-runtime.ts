import { homedir } from "node:os";
import { join } from "node:path";

const DEFAULT_PATH = "/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin";
const ACLI_BIN = "/opt/homebrew/bin/acli";

function envWithPath(): Record<string, string> {
  return {
    ...process.env,
    PATH: process.env.PATH ? `${DEFAULT_PATH}:${process.env.PATH}` : DEFAULT_PATH,
  } as Record<string, string>;
}

export function jiraPrivateEnvPath(): string {
  return join(homedir(), ".zsh_private");
}

export function codexBinCommand(name: string): string {
  return join(homedir(), "bin", name);
}

async function text(stream: ReadableStream<Uint8Array> | null): Promise<string> {
  if (!stream) return "";
  return await new Response(stream).text();
}

export async function runAcli(args: string[]): Promise<number> {
  const proc = Bun.spawn({
    cmd: [ACLI_BIN, ...args],
    env: envWithPath(),
    stdin: "inherit",
    stdout: "inherit",
    stderr: "inherit",
  });
  return await proc.exited;
}

export async function acliStatusOk(args: string[]): Promise<boolean> {
  const proc = Bun.spawn({
    cmd: [ACLI_BIN, ...args],
    env: envWithPath(),
    stdin: "ignore",
    stdout: "ignore",
    stderr: "ignore",
  });
  return (await proc.exited) === 0;
}

export async function runZsh(command: string): Promise<{ stdout: string; stderr: string; exitCode: number }> {
  const proc = Bun.spawn({
    cmd: ["/bin/zsh", "-lc", command],
    env: envWithPath(),
    stdin: "ignore",
    stdout: "pipe",
    stderr: "pipe",
  });

  const [stdout, stderr, exitCode] = await Promise.all([
    text(proc.stdout),
    text(proc.stderr),
    proc.exited,
  ]);

  return { stdout, stderr, exitCode };
}

export function shouldSkipAuth(args: string[]): boolean {
  if (args.includes("--help") || args.includes("-h")) return true;
  return args[0] === "jira" && args[1] === "auth";
}

export async function ensureJiraAuth(): Promise<void> {
  const ok = await acliStatusOk(["jira", "auth", "status"]);
  if (ok) return;

  const privateEnv = jiraPrivateEnvPath();
  const loginCheck = await runZsh(`source ${privateEnv} >/dev/null 2>&1; whence -w jira-login`);
  if (loginCheck.exitCode !== 0) {
    console.error("jira-login is not available from ~/.zsh_private");
    process.exit(1);
  }

  const login = await runZsh(`source ${privateEnv} >/dev/null 2>&1; jira-login >/dev/null`);
  if (login.exitCode !== 0) {
    console.error("Jira authentication failed via jira-login from ~/.zsh_private");
    process.exit(1);
  }
}

export async function execAcliWithAuth(args: string[]): Promise<void> {
  if (!shouldSkipAuth(args)) {
    await ensureJiraAuth();
  }

  const exitCode = await runAcli(args);
  process.exit(exitCode);
}

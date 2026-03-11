import { AppError } from "../errors/app-error";

export interface RunCommandOptions {
  cwd?: string;
  env?: Record<string, string | undefined>;
  stdin?: string;
}

export interface CommandResult {
  stdout: string;
  stderr: string;
  exitCode: number;
}

export async function runCommand(
  cmd: string[],
  options: RunCommandOptions = {},
): Promise<CommandResult> {
  const proc = Bun.spawn({
    cmd,
    cwd: options.cwd,
    env: options.env,
    stdin: options.stdin ? "pipe" : undefined,
    stdout: "pipe",
    stderr: "pipe",
  });

  if (options.stdin) {
    if (proc.stdin) {
      proc.stdin.write(options.stdin);
      proc.stdin.end();
    }
  }

  const [stdout, stderr, exitCode] = await Promise.all([
    new Response(proc.stdout).text(),
    new Response(proc.stderr).text(),
    proc.exited,
  ]);

  if (exitCode !== 0) {
    throw new AppError("COMMAND_FAILED", stderr.trim() || `Command failed: ${cmd.join(" ")}`);
  }

  return { stdout, stderr, exitCode };
}

# codex-skills

Custom Codex skills and local helper wrappers.

## Layout

- `skills/` contains one self-contained folder per skill.
- each skill folder contains `SKILL.md` and `README.md`.
- `packages/` contains the Bun/TypeScript rewrite workspace.
- `packages/jira-acli` contains the live Jira command entrypoints.
- `packages/wakatime-cli` contains the live WakaTime command entrypoints.
- `scripts/` contains repo-level utility scripts such as symlink installation.

## Bun workspace

The live command layer runs as a Bun workspace.

Setup:

```bash
bun install
```

Useful commands:

```bash
bun run typecheck
bun run install:links
```

## Symlink setup

`bun run install:links` is the primary setup path.

Default targets:

```bash
~/.codex/skills
~/bin
```

Run:

```bash
bun run install:links
```

Optional environment overrides:

```bash
export CODEX_HOME="$HOME/.codex"
export CODEX_BIN_DIR="$HOME/bin"
export CODEX_SKILLS_WORKSPACES_ROOT="$HOME/Workspaces"
```

- `CODEX_HOME`
  Controls where skill symlinks are created. Default: `~/.codex`
- `CODEX_BIN_DIR`
  Controls where wrapper symlinks are created. Default: `~/bin`
- `CODEX_SKILLS_WORKSPACES_ROOT`
  Controls the default workspace root used by branch-discovery tooling. Default: `~/Workspaces`

Make sure `CODEX_BIN_DIR` is on your `PATH`.

## Current live paths

- `$CODEX_HOME/skills/jira-acli` -> `skills/jira-acli`
- `$CODEX_HOME/skills/wakatime-cli` -> `skills/wakatime-cli`
- `$CODEX_BIN_DIR/acli-codex` -> `packages/jira-acli/src/cli/acli-codex.ts`
- `$CODEX_BIN_DIR/jira-auth-refresh` -> `packages/jira-acli/src/cli/jira-auth-refresh.ts`
- `$CODEX_BIN_DIR/jira-search` -> `packages/jira-acli/src/cli/jira-search.ts`
- `$CODEX_BIN_DIR/jira-ticket` -> `packages/jira-acli/src/cli/jira-ticket.ts`
- `$CODEX_BIN_DIR/wakatime-branches` -> `packages/wakatime-cli/src/cli/wakatime-branches.ts`
- `$CODEX_BIN_DIR/wakatime-codex` -> `packages/wakatime-cli/src/cli/wakatime-codex.ts`
- `$CODEX_BIN_DIR/wakatime-status` -> `packages/wakatime-cli/src/cli/wakatime-status.ts`
- `$CODEX_BIN_DIR/wakatime-ticket-time` -> `packages/wakatime-cli/src/cli/wakatime-ticket-time.ts`
- `$CODEX_BIN_DIR/wakatime-today` -> `packages/wakatime-cli/src/cli/wakatime-today.ts`

## Combined example

Example prompt:

```text
$jira-acli what tickets have I worked on today?
and can you match those tickets with time using $wakatime-cli
```

Example response:

```text
For today, March 11, 2026, Jira shows two tickets you worked on:

- SOT-829 — Add settings toggle to disable map
- SOT-820 — Event comments

Matched against WakaTime branch time in soteria-django for March 11, 2026:

- SOT-829 -> branch sot-829-browser-map-toggle -> 1 hr 4 mins
- SOT-820 -> branch SOT-820-event-comments -> 15 min
```

This is the main intended workflow for these skills: use Jira to identify the
relevant tickets, use WakaTime to match branch time, then feed that combined
context back into Codex for Jira updates.

## Notes

- Secrets stay outside this repo in files like `~/.zsh_private` and `~/.wakatime.cfg`.
- The live commands are Bun/TypeScript entrypoints under `packages/`.
- Skill folders contain docs and Codex instructions only.

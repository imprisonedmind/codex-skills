# codex-skills

Custom Codex skills and local helper wrappers.

## Layout

- `skills/` contains one self-contained folder per skill.
- each skill folder contains its own:
  - `SKILL.md`
  - `README.md`
  - `bin/` wrappers
- `packages/` contains the Bun/TypeScript rewrite workspace.
- `scripts/` contains repo-level utility scripts such as symlink installation.

## Bun workspace

The TypeScript rewrite is being built as a Bun workspace.

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
- `$CODEX_BIN_DIR/jira-*` -> `skills/jira-acli/bin/*`
- `$CODEX_BIN_DIR/wakatime-*` -> `skills/wakatime-cli/bin/*`

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
- Wrapper scripts in this repo may read those external files, but must not contain secrets.

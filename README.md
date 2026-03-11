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

Codex reads skills from `~/.codex/skills`, and the shell entrypoints live in `~/bin`.

Create the skill symlinks:

```bash
mkdir -p ~/.codex/skills
ln -sfn ~/Workspaces/tools/codex-skills/skills/jira-acli ~/.codex/skills/jira-acli
ln -sfn ~/Workspaces/tools/codex-skills/skills/wakatime-cli ~/.codex/skills/wakatime-cli
```

Create the wrapper symlinks:

```bash
mkdir -p ~/bin
ln -sfn ~/Workspaces/tools/codex-skills/skills/jira-acli/bin/acli-codex ~/bin/acli-codex
ln -sfn ~/Workspaces/tools/codex-skills/skills/jira-acli/bin/jira-ticket ~/bin/jira-ticket
ln -sfn ~/Workspaces/tools/codex-skills/skills/jira-acli/bin/jira-search ~/bin/jira-search
ln -sfn ~/Workspaces/tools/codex-skills/skills/jira-acli/bin/jira-auth-refresh ~/bin/jira-auth-refresh
ln -sfn ~/Workspaces/tools/codex-skills/skills/wakatime-cli/bin/wakatime-branches ~/bin/wakatime-branches
ln -sfn ~/Workspaces/tools/codex-skills/skills/wakatime-cli/bin/wakatime-ticket-time ~/bin/wakatime-ticket-time
ln -sfn ~/Workspaces/tools/codex-skills/skills/wakatime-cli/bin/wakatime-codex ~/bin/wakatime-codex
ln -sfn ~/Workspaces/tools/codex-skills/skills/wakatime-cli/bin/wakatime-today ~/bin/wakatime-today
ln -sfn ~/Workspaces/tools/codex-skills/skills/wakatime-cli/bin/wakatime-status ~/bin/wakatime-status
```

Make sure `~/bin` is on your `PATH`.

## Current live paths

- `~/.codex/skills/jira-acli` -> `skills/jira-acli`
- `~/.codex/skills/wakatime-cli` -> `skills/wakatime-cli`
- `~/bin/jira-*` -> `skills/jira-acli/bin/*`
- `~/bin/wakatime-*` -> `skills/wakatime-cli/bin/*`

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

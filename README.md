# codex-skills

Custom Codex skills and local helper wrappers.

## Layout

- `skills/` contains one self-contained folder per skill.
- each skill folder contains its own:
  - `SKILL.md`
  - `README.md`
  - `bin/` wrappers

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

## Notes

- Secrets stay outside this repo in files like `~/.zsh_private` and `~/.wakatime.cfg`.
- Wrapper scripts in this repo may read those external files, but must not contain secrets.

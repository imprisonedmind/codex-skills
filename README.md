# codex-skills

Custom Codex skills and local helper wrappers.

## Layout

- `skills/` contains Codex `SKILL.md` folders.
- `bin/` contains executable wrappers used by those skills.

## Live paths

The active locations are symlinked:

- `~/.codex/skills/jira-acli` -> `skills/jira-acli`
- `~/.codex/skills/wakatime-cli` -> `skills/wakatime-cli`
- `~/bin/*` wrappers -> `bin/*`

## Notes

- Secrets stay outside this repo in files like `~/.zsh_private` and `~/.wakatime.cfg`.
- Wrapper scripts in this repo may read those external files, but must not contain secrets.

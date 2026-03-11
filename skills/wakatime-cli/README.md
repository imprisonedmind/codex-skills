# wakatime-cli

Codex skill and local wrappers for WakaTime branch-time lookups.

## Contents

- `SKILL.md`: Codex skill instructions
- `bin/wakatime-branches`: branch rows for a day or date range
- `bin/wakatime-ticket-time`: Jira-key-driven branch time lookup

## Setup

The wrappers read local WakaTime configuration but do not store secrets in this repo.

Required external pieces:

- `~/.wakatime/wakatime-cli`
- `~/.wakatime.cfg`

`~/.wakatime.cfg` must contain an API key in the `[settings]` section:

```ini
[settings]
api_key = waka_...
```

The branch-focused wrappers use two sources of truth:

- local git branches under `~/Workspaces` by default
- WakaTime summaries API with both `project` and `branches`

Project matching behavior:

- the wrapper scans local repos for branches containing the Jira key
- it infers the WakaTime project name from the repo folder name
- for example `.../soteria/soteria-django` maps to project `soteria-django`

If needed, you can override inference for ticket lookups with:

- `--branch <branch-name>`
- `--project <wakatime-project>`
- `--search-root <dir>`

## Usage

- `wakatime-branches`
- `wakatime-branches --project-match soteria`
- `wakatime-ticket-time SOT-829`
- `wakatime-ticket-time SOT-829 --json`

## Notes

- Do not commit the WakaTime API key.
- This skill is intentionally branch-focused.
- `wakatime-branches` is the default answer for prompts like `what branches did I work on today` or `what branches did I work on in soteria today`.
- `wakatime-ticket-time` is the default answer for prompts like `how much time did I spend on SOT-829`.

# jira-acli

Codex skill docs for Jira access through the Bun-backed `acli` wrappers.

## Contents

- `SKILL.md`: Codex skill instructions
- live command entrypoints:
- `packages/jira-acli/src/cli/acli-codex.ts`
- `packages/jira-acli/src/cli/jira-ticket.ts`
- `packages/jira-acli/src/cli/jira-search.ts`
- `packages/jira-acli/src/cli/jira-auth-refresh.ts`

## Setup

The wrappers do not store secrets in this repo. They expect Jira auth details to live outside the repo.

Required external pieces:

- `/opt/homebrew/bin/acli`
- `~/.zsh_private`

`~/.zsh_private` should define:

- `ATLASSIAN_JIRA_SITE`
- `ATLASSIAN_JIRA_EMAIL`
- `ATLASSIAN_API_TOKEN`
- `jira-login()`

Expected `jira-login()` shape:

```zsh
jira-login() {
  print -rn -- "$ATLASSIAN_API_TOKEN" | acli jira auth login \
    --site "$ATLASSIAN_JIRA_SITE" \
    --email "$ATLASSIAN_JIRA_EMAIL" \
    --token
}
```

`~/bin/acli-codex` points at the Bun entrypoint in `packages/jira-acli/src/cli/acli-codex.ts`. That command loads `~/.zsh_private`, checks `acli jira auth status`, and calls `jira-login` when needed.

## Usage

- `jira-ticket KEY-123`
- `jira-search 'project = TEAM ORDER BY updated DESC'`
- `jira-auth-refresh`

## Sprint assignment workflow

When a ticket needs to be created in a sprint or moved into a sprint, the reliable path is:

1. Create the issue with `~/bin/acli-codex jira workitem create ... --json`.
2. Resolve the board with `~/bin/acli-codex jira board search --project PROJECT_KEY --json`.
3. Resolve the sprint with `~/bin/acli-codex jira board list-sprints --id BOARD_ID --paginate --json`.
4. Add the issue to the sprint through Jira Agile REST:

```sh
source ~/.zsh_private >/dev/null 2>&1
curl -sS \
  -u "$ATLASSIAN_JIRA_EMAIL:$ATLASSIAN_API_TOKEN" \
  -H 'Content-Type: application/json' \
  -X POST \
  "https://$ATLASSIAN_JIRA_SITE/rest/agile/1.0/sprint/SPRINT_ID/issue" \
  -d '{"issues":["ISSUE_KEY"]}' \
  -w '%{http_code}'
```

Expected success status:

- `204`

Verify immediately on the issue itself:

```sh
~/bin/acli-codex jira workitem view ISSUE_KEY --fields '*all' --json
```

On this Jira instance, sprint membership appears in `customfield_10020`.

## Notes

- Do not commit Atlassian credentials.
- Auth stays in shell-private files outside this repo.
- Do not omit `https://` when constructing REST URLs from `ATLASSIAN_JIRA_SITE`.
- Do not use `--query` with `jira board search`; use `--project` or `--name`.
- Treat free-form phrases like `Simple Mon UAT feedback` as possible sprint names when the user is discussing placement or planning.

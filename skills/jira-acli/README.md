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

## Notes

- Do not commit Atlassian credentials.
- Auth stays in shell-private files outside this repo.

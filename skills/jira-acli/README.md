# jira-acli

Codex skill and local wrappers for Jira access through `acli`.

## Contents

- `SKILL.md`: Codex skill instructions
- `bin/acli-codex`: stable `acli` wrapper
- `bin/jira-ticket`: view a Jira ticket
- `bin/jira-search`: run a JQL search
- `bin/jira-auth-refresh`: refresh Jira auth with the browser flow

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

`bin/acli-codex` sources `~/.zsh_private`, checks `acli jira auth status`, and calls `jira-login` when needed.

## Usage

- `jira-ticket KEY-123`
- `jira-search 'project = TEAM ORDER BY updated DESC'`
- `jira-auth-refresh`

## Notes

- Do not commit Atlassian credentials.
- The repo only contains wrappers and skill instructions; auth stays in shell-private files.

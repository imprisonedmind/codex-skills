---
name: jira-acli
description: Use this skill when working with Jira tickets, JQL searches, Atlassian CLI (`acli`), or when the user asks to fetch, find, show, inspect, or search Jira work items from the local machine.
---

# Jira ACLI

Use the local wrapper commands instead of calling `acli` freehand. They are wired to the user's existing Jira auth setup in `~/.zsh_private`, including the `jira-login` function.

## Command map

- `~/bin/acli-codex ...`
  Stable wrapper around `/opt/homebrew/bin/acli`. For non-auth Jira commands it checks `acli jira auth status` and runs `jira-login` from `~/.zsh_private` if needed.
- `~/bin/jira-auth-refresh`
  Starts ACLI's browser-based Jira login flow. Use this when the wrapper reports unauthorized or `jira-login` fails.
- `~/bin/jira-ticket KEY-123 [extra args]`
  Shortcut for viewing a work item.
- `~/bin/jira-search 'JQL...' [extra args]`
  Shortcut for JQL searches.

## Intent mapping

- Requests like `fetch SOT-820`, `find ticket SOT-820`, `show SOT-820`, or `inspect SOT-820` should use `~/bin/jira-ticket SOT-820`.
- Requests for JQL or lists of tickets should use `~/bin/jira-search 'project = TEAM ORDER BY updated DESC'`.
- Requests for raw Jira CLI actions should go through `~/bin/acli-codex`.

## Output guidance

- For a single ticket, summarize `key`, `type`, `summary`, `status`, `assignee`, and the important part of the description.
- Keep ticket summaries concise unless the user asks for full detail.
- If the user asks for machine-readable output, use the raw wrapper with `--json`.

## Workflow

1. For a single ticket, run `~/bin/jira-ticket KEY-123`.
2. For a search, run `~/bin/jira-search 'project = TEAM ORDER BY updated DESC'`.
3. If you need a raw Atlassian CLI command, run it through `~/bin/acli-codex`.
4. If the wrapper reports unauthorized or `authentication failed`, stop and run `~/bin/jira-auth-refresh`, then retry the original command.

## Guardrails

- Do not print or echo secrets from `~/.zsh_private`.
- Do not bypass the wrapper unless debugging the wrapper itself.
- Prefer absolute command paths in terminal executions.
- If auth still fails, check `~/bin/acli-codex jira auth status` once. Do not loop through repeated auth probes.
- If `jira-login` fails or auth status is unauthorized, instruct the user to run `~/bin/jira-auth-refresh` and then retry.
- If the same Jira login works in the user's normal terminal but fails from Codex, treat it as an execution-environment limitation first, especially sandboxed network restrictions.
- Do not claim the API token is invalid unless the user confirms the same command fails outside Codex too.

## Useful raw commands

- `~/bin/acli-codex jira auth status`
- `~/bin/jira-auth-refresh`
- `~/bin/acli-codex jira workitem view KEY-123 --json`
- `~/bin/acli-codex jira workitem search --jql 'assignee = currentUser() AND resolution = Unresolved ORDER BY updated DESC' --limit 20`

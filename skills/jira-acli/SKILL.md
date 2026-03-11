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
- Requests to create a ticket in a sprint should treat the sprint name as a sprint target first, not as ticket title context, a parent issue, or an Epic.
- Requests to move a ticket into a sprint should use board lookup, sprint lookup, and the Agile REST sprint-membership endpoint.

## Output guidance

- For a single ticket, summarize `key`, `type`, `summary`, `status`, `assignee`, and the important part of the description.
- Keep ticket summaries concise unless the user asks for full detail.
- If the user asks for machine-readable output, use the raw wrapper with `--json`.

## Workflow

1. For a single ticket, run `~/bin/jira-ticket KEY-123`.
2. For a search, run `~/bin/jira-search 'project = TEAM ORDER BY updated DESC'`.
3. If you need a raw Atlassian CLI command, run it through `~/bin/acli-codex`.
4. If the wrapper reports unauthorized or `authentication failed`, stop and run `~/bin/jira-auth-refresh`, then retry the original command.

## Sprint workflow

Use this flow when the user asks to create a ticket in sprint `X`, move a ticket into sprint `X`, or when a free-form phrase may be a sprint name.

1. Create the issue first with `~/bin/acli-codex jira workitem create ... --json`.
2. Resolve the board with `~/bin/acli-codex jira board search --project PROJECT_KEY --json`.
3. Resolve the sprint with `~/bin/acli-codex jira board list-sprints --id BOARD_ID --paginate --json`.
4. Add the issue to the sprint with Jira Agile REST:
   `https://$ATLASSIAN_JIRA_SITE/rest/agile/1.0/sprint/SPRINT_ID/issue`
5. Verify on the issue itself with `~/bin/acli-codex jira workitem view ISSUE_KEY --fields '*all' --json`.

When creating and assigning in one pass, prefer this order:

1. Create the issue.
2. Resolve the board id for the project.
3. Resolve the sprint id by sprint name on that board.
4. POST the issue key into the sprint via Agile REST.
5. Verify sprint membership on the issue fields.

Immediate verification should prefer the issue field view over sprint listing output, because sprint listing can lag.

## Guardrails

- Do not print or echo secrets from `~/.zsh_private`.
- Do not bypass the wrapper unless debugging the wrapper itself.
- Prefer absolute command paths in terminal executions.
- If auth still fails, check `~/bin/acli-codex jira auth status` once. Do not loop through repeated auth probes.
- If `jira-login` fails or auth status is unauthorized, instruct the user to run `~/bin/jira-auth-refresh` and then retry.
- If the same Jira login works in the user's normal terminal but fails from Codex, treat it as an execution-environment limitation first, especially sandboxed network restrictions.
- Do not claim the API token is invalid unless the user confirms the same command fails outside Codex too.
- Do not assume a phrase like `Simple Mon UAT feedback` is a title, parent, or Epic. It may be a sprint name.
- Do not use `--query` with `jira board search`; use `--project` or `--name`.
- Do not expect `jira sprint update` to change sprint membership.
- Do not expect `jira workitem edit` to expose sprint assignment as a direct flag.
- Do not omit `https://` when building Jira REST URLs from `ATLASSIAN_JIRA_SITE`.
- Do not rely on sprint list output alone for immediate post-move verification.

## Sprint membership notes

- Board lookup:
  `~/bin/acli-codex jira board search --project SOT --json`
- Sprint lookup:
  `~/bin/acli-codex jira board list-sprints --id BOARD_ID --paginate --json`
- Membership update:
  `curl -sS -u "$ATLASSIAN_JIRA_EMAIL:$ATLASSIAN_API_TOKEN" -H 'Content-Type: application/json' -X POST "https://$ATLASSIAN_JIRA_SITE/rest/agile/1.0/sprint/SPRINT_ID/issue" -d '{"issues":["ISSUE_KEY"]}'`
- Success code for sprint membership update:
  `204`
- Immediate verification:
  `~/bin/acli-codex jira workitem view ISSUE_KEY --fields '*all' --json`
- Known sprint field on this Jira instance:
  `customfield_10020`

## Useful raw commands

- `~/bin/acli-codex jira auth status`
- `~/bin/jira-auth-refresh`
- `~/bin/acli-codex jira workitem view KEY-123 --json`
- `~/bin/acli-codex jira workitem search --jql 'assignee = currentUser() AND resolution = Unresolved ORDER BY updated DESC' --limit 20`
- `~/bin/acli-codex jira board search --project SOT --json`
- `~/bin/acli-codex jira board list-sprints --id BOARD_ID --paginate --json`
- `~/bin/acli-codex jira workitem view ISSUE_KEY --fields '*all' --json`

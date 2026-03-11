---
name: wakatime-cli
description: Use this skill when working with WakaTime branch time, Jira-key-to-branch time lookup, or when the user asks which branches they worked on today or in a specific project such as soteria.
---

# WakaTime CLI

Use the local wrapper commands instead of calling the WakaTime CLI freehand. They are wired to the installed CLI at `~/.wakatime/wakatime-cli`, the user's existing `~/.wakatime.cfg`, and the WakaTime summaries API.

## Command map

- `~/bin/wakatime-branches [extra args]`
  Lists branch time for the requested day or date range, optionally filtered by project name.
- `~/bin/wakatime-ticket-time KEY-123 [extra args]`
  Resolves local branches matching the Jira key, infers the WakaTime project from the repo name, and fetches branch-specific time from the summaries API using both `project` and `branches`.

## Intent mapping

- Requests like `what branches did I work on today` should use `~/bin/wakatime-branches`.
- Requests like `what branches did I work on in soteria today` should use `~/bin/wakatime-branches --project-match soteria`.
- Requests like `how much time did I spend on SOT-829` or `fetch WakaTime for SOT-829` should use `~/bin/wakatime-ticket-time SOT-829`.
- Requests for machine-readable ticket time should use `~/bin/wakatime-ticket-time SOT-829 --json`.
- Requests to prepare a Jira update from tracked time should use branch rows or ticket-specific branch time, then use the Jira skill or Jira wrappers to inspect the target ticket.

## Output guidance

- For branch-list summaries, report project, branch, and time, ordered by time descending.
- For ticket-related summaries, report the ticket key, project, matched branch, and time.
- If JSON is requested for ticket time, use `wakatime-ticket-time ... --json`.
- Do not print API keys or config secrets.

## Workflow

1. For branch discovery by day, run `~/bin/wakatime-branches`.
2. For branch discovery within a project, run `~/bin/wakatime-branches --project-match soteria`.
3. For ticket-specific time, run `~/bin/wakatime-ticket-time KEY-123`.
4. For structured ticket time, run `~/bin/wakatime-ticket-time KEY-123 --json`.
5. If the user wants the time reflected on Jira, pass the branch rows or ticket-specific branch time into the Jira workflow.

## Guardrails

- Do not read or print secret values from `~/.wakatime.cfg`.
- Prefer the wrapper commands over calling `~/.wakatime/wakatime-cli` directly.
- Ticket-to-time matching depends on branch names containing the Jira key, such as `sot-829-browser-map-toggle` for `SOT-829`.
- Branch-specific totals should be fetched with both `project` and `branches`; using only `branches` returned misleading results during verification.
- If the CLI is missing or errors, report that clearly and stop rather than guessing.

## Useful raw commands

- `~/bin/wakatime-branches`
- `~/bin/wakatime-branches --project-match soteria`
- `~/bin/wakatime-ticket-time SOT-829`
- `~/bin/wakatime-ticket-time SOT-829 --json`

#!/usr/bin/env bun

import { printJson, workspacesRoot } from "@codex-skills/core";

import { branchSummaryForProject, matchingBranches } from "../lib/wakatime-runtime";

const args = process.argv.slice(2);
if (args.length < 1) {
  console.error("Usage: wakatime-ticket-time SOT-829 [--start YYYY-MM-DD] [--end YYYY-MM-DD] [--json]");
  process.exit(2);
}

const ticket = args[0]!;
let start = new Date().toISOString().slice(0, 10);
let end = start;
let searchRoot = workspacesRoot();
let asJson = false;

for (let i = 1; i < args.length; i += 1) {
  const arg = args[i];
  if (arg === "--start") start = args[++i]!;
  else if (arg === "--end") end = args[++i]!;
  else if (arg === "--search-root") searchRoot = args[++i]!;
  else if (arg === "--json") asJson = true;
  else {
    console.error(`Unknown argument: ${arg}`);
    process.exit(2);
  }
}

const matches = await matchingBranches(ticket, searchRoot);
if (matches.length === 0) {
  console.error(`No local git branches matched ticket ${ticket.toUpperCase()} under ${searchRoot}`);
  process.exit(1);
}

const results: Array<{
  ticket: string;
  project: string;
  branch: string;
  repo: string;
  start: string;
  end: string;
  time_text: string;
  total_seconds: number;
  percent_of_project_day?: number;
}> = [];

for (const match of matches) {
  const row = await branchSummaryForProject(start, end, match.project, match.branch);
  if (!row) continue;
  results.push({
    ticket: ticket.toUpperCase(),
    project: match.project,
    branch: match.branch,
    repo: match.repo,
    start,
    end,
    time_text: row.text ?? "0 secs",
    total_seconds: row.total_seconds ?? 0,
    percent_of_project_day: row.percent,
  });
}

if (results.length === 0) {
  console.error(
    `Found local branches for ${ticket.toUpperCase()}, but WakaTime returned no matching branch stats.`,
  );
  process.exit(1);
}

if (asJson) {
  printJson(results);
  process.exit(0);
}

for (const result of results) {
  process.stdout.write(`ticket: ${result.ticket}\n`);
  process.stdout.write(`range: ${result.start} -> ${result.end}\n`);
  process.stdout.write(`project: ${result.project}\n`);
  process.stdout.write(`branch: ${result.branch}\n`);
  process.stdout.write(`time: ${result.time_text}\n`);
  process.stdout.write(`repo: ${result.repo}\n`);
}

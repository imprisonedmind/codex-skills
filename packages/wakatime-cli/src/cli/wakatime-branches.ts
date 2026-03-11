#!/usr/bin/env bun

import { printJson } from "@codex-skills/core";

import { branchesForProject, localProjectNames, projectNames } from "../lib/wakatime-runtime";

const args = process.argv.slice(2);
const projectFilters: string[] = [];
let start = new Date().toISOString().slice(0, 10);
let end = start;
let asJson = false;

for (let i = 0; i < args.length; i += 1) {
  const arg = args[i];
  if (arg === "--start") start = args[++i]!;
  else if (arg === "--end") end = args[++i]!;
  else if (arg === "--project-match") projectFilters.push(args[++i]!.toLowerCase());
  else if (arg === "--json") asJson = true;
  else {
    console.error(`Unknown argument: ${arg}`);
    process.exit(2);
  }
}

const activeProjects = await projectNames(start, end);
const localProjects = await localProjectNames();
const projects = activeProjects
  .filter((project) => localProjects.has(project))
  .filter((project) =>
    projectFilters.length === 0 || projectFilters.some((filter) => project.toLowerCase().includes(filter)),
  );

const rows: Array<{ project: string; branch: string; time_text: string; total_seconds: number }> = [];
for (const project of projects) {
  const branches = await branchesForProject(start, end, project);
  for (const branch of branches) {
    if (!branch.name || !branch.total_seconds) continue;
    rows.push({
      project,
      branch: branch.name,
      time_text: branch.text ?? "0 secs",
      total_seconds: branch.total_seconds,
    });
  }
}

rows.sort((a, b) => b.total_seconds - a.total_seconds);

if (asJson) {
  printJson({ start, end, rows });
  process.exit(0);
}

process.stdout.write(`range: ${start} -> ${end}\n`);
for (const row of rows) {
  process.stdout.write(`${row.time_text}\t${row.project}\t${row.branch}\n`);
}

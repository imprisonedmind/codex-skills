#!/usr/bin/env bun

import { execAcliWithAuth } from "../lib/jira-runtime";

const args = process.argv.slice(2);
if (args.length < 1) {
  console.error("Usage: jira-search 'project = TEAM ORDER BY updated DESC' [additional acli search args]");
  process.exit(2);
}

const [jql, ...rest] = args;
await execAcliWithAuth(["jira", "workitem", "search", "--jql", jql, ...rest]);

#!/usr/bin/env bun

import { execAcliWithAuth } from "../lib/jira-runtime";

const args = process.argv.slice(2);
if (args.length < 1) {
  console.error("Usage: jira-ticket KEY-123 [additional acli view args]");
  process.exit(2);
}

await execAcliWithAuth(["jira", "workitem", "view", ...args]);

#!/usr/bin/env bun

import { runAcli } from "../lib/jira-runtime";

const exitCode = await runAcli(["jira", "auth", "login", "--web", ...process.argv.slice(2)]);
process.exit(exitCode);

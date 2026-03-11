#!/usr/bin/env bun

import { execAcliWithAuth } from "../lib/jira-runtime";

await execAcliWithAuth(process.argv.slice(2));

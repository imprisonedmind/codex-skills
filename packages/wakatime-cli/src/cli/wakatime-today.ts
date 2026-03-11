#!/usr/bin/env bun

import { runWakatimeCli } from "../lib/wakatime-runtime";

const exitCode = await runWakatimeCli(["--today", ...process.argv.slice(2)]);
process.exit(exitCode);

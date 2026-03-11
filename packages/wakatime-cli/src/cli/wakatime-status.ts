#!/usr/bin/env bun

import { runWakatimeCli } from "../lib/wakatime-runtime";

process.stdout.write("today:\n");
let exitCode = await runWakatimeCli(["--today"]);
if (exitCode !== 0) process.exit(exitCode);

process.stdout.write("\noffline_heartbeats:\n");
exitCode = await runWakatimeCli(["--offline-count"]);
process.exit(exitCode);

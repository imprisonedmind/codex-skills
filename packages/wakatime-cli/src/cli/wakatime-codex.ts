#!/usr/bin/env bun

import { existsSync } from "node:fs";

import { runWakatimeCli, wakatimeCliPath } from "../lib/wakatime-runtime";

if (!existsSync(wakatimeCliPath())) {
  console.error(`WakaTime CLI not found at ${wakatimeCliPath()}`);
  process.exit(1);
}

const exitCode = await runWakatimeCli(process.argv.slice(2));
process.exit(exitCode);

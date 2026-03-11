import { join } from "node:path";

import { codexBinDir, codexHome, ensureSymlink, repoRoot } from "../packages/core/src/index";

const skillLinks = [
  {
    source: join(repoRoot, "skills", "jira-acli"),
    target: join(codexHome(), "skills", "jira-acli"),
  },
  {
    source: join(repoRoot, "skills", "wakatime-cli"),
    target: join(codexHome(), "skills", "wakatime-cli"),
  },
];

const binLinks = [
  "acli-codex",
  "jira-auth-refresh",
  "jira-search",
  "jira-ticket",
].map((name) => ({
  source: join(repoRoot, "packages", "jira-acli", "src", "cli", `${name}.ts`),
  target: join(codexBinDir(), name),
})).concat([
  "wakatime-branches",
  "wakatime-codex",
  "wakatime-status",
  "wakatime-ticket-time",
  "wakatime-today",
].map((name) => ({
  source: join(repoRoot, "packages", "wakatime-cli", "src", "cli", `${name}.ts`),
  target: join(codexBinDir(), name),
})));

for (const link of [...skillLinks, ...binLinks]) {
  await ensureSymlink(link.source, link.target);
  console.log(`${link.target} -> ${link.source}`);
}

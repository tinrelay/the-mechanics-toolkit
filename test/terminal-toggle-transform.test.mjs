#!/usr/bin/env node
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { build9922Contracts } from "../patches/terminal-toggle/profiles/build9922.mjs";
import { build10789Contracts } from "../patches/terminal-toggle/profiles/build10789.mjs";
import {
  linuxBuild9647Contracts,
  linuxBuild9771Contracts,
  linuxBuild10954Contracts
} from "../patches/terminal-toggle/profiles/linux.mjs";

const repository = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const toolkit = path.join(repository, "bin/toolkit.mjs");
const behavioralProbe = path.join(repository, "test/terminal-toggle.test.mjs");
runFixture("linux-9771", fixtureSource(linuxBuild9771Contracts));
runFixture("linux-9647", fixtureSource(linuxBuild9647Contracts));
runFixture("9922", fixtureSource(build9922Contracts));
runSplitFixture("10789", build10789Contracts);
runSplitFixture("linux-10954", linuxBuild10954Contracts);
process.stdout.write("terminal toggle transform probe passed\n");

function runFixture(label, fixture) {
  const scratch = fs.mkdtempSync(path.join(os.tmpdir(), `mechanics-toolkit-terminal-${label}-`));
  try {
  const assets = path.join(scratch, "webview/assets");
  fs.mkdirSync(assets, { recursive: true });
  const target = path.join(assets, "app-initial-fixture.js");
  fs.writeFileSync(target, fixture);

  assert.equal(runToolkit("check", scratch).state, "needs-apply");
  assert.equal(runToolkit("apply", scratch).state, "applied");
  const once = fs.readFileSync(target);
  assert.equal(runToolkit("check", scratch).state, "applied");

  const probe = spawnSync(process.execPath, [behavioralProbe, scratch], { encoding: "utf8" });
  assert.equal(probe.status, 0, probe.stderr || probe.stdout);

  assert.equal(runToolkit("apply", scratch).state, "applied");
  assert.deepEqual(fs.readFileSync(target), once, "second application is byte-identical");
  } finally {
    fs.rmSync(scratch, { recursive: true, force: true });
  }
}

function runToolkit(action, root) {
  const result = spawnSync(
    process.execPath,
    [toolkit, "patch", "terminal-toggle", action, root],
    { encoding: "utf8" }
  );
  assert.equal(result.status, 0, result.stderr || result.stdout);
  return JSON.parse(result.stdout);
}

function fixtureSource(contracts) {
  return `/*
{id:\`toggleTerminal\`,titleIntlId:\`codex.command.toggleTerminal\`,descriptionIntlId:\`codex.commandDescription.toggleTerminal\`,requiredAccess:\`codexLocal\`,commandMenuGroupKey:\`panels\`,commandMenu:!0,commandMenuFeature:\`codex\`,electron:{menuTitle:\`Open Terminal\`,menuTitleIntlId:\`codex.commandMenuTitle.toggleTerminal\`,
c=n===\`clearAllUnreads\`&&(r===\`Shift+Escape\`||r===\`Shift+Esc\`),l;
${contracts.join("\n")}
defaultKeybindings:[{key:"Control+\`"}]
*/
export const fixture = true;
`;
}

function runSplitFixture(label, contracts) {
  const scratch = fs.mkdtempSync(path.join(os.tmpdir(), `mechanics-toolkit-terminal-${label}-`));
  try {
    const assets = path.join(scratch, "webview/assets");
    const build = path.join(scratch, ".vite/build");
    fs.mkdirSync(assets, {recursive: true});
    fs.mkdirSync(build, {recursive: true});
    const app = path.join(assets, "app-initial-fixture.js");
    const shared = path.join(assets, "app-shared-fixture.js");
    const src = path.join(build, "src-fixture.js");
    const worker = path.join(build, "worker.js");
    fs.writeFileSync(app, `/*
c=n===\`clearAllUnreads\`&&(r===\`Shift+Escape\`||r===\`Shift+Esc\`),l;
${contracts.join("\n")}
*/export const fixture=true;`);
    const command = "/*{id:`toggleTerminal`,titleIntlId:`codex.command.toggleTerminal`,descriptionIntlId:`codex.commandDescription.toggleTerminal`,requiredAccess:`codexLocal`,commandMenuGroupKey:`panels`,commandMenu:!0,commandMenuFeature:`codex`,electron:{menuTitle:`Open Terminal`,menuTitleIntlId:`codex.commandMenuTitle.toggleTerminal`,defaultKeybindings:[{key:\"Control+`\"}]}}*/export const fixture=true;";
    fs.writeFileSync(shared, command);
    fs.writeFileSync(src, command);
    fs.writeFileSync(worker, command);

    assert.equal(runToolkit("check", scratch).state, "needs-apply");
    assert.equal(runToolkit("apply", scratch).state, "applied");
    const once = [app, shared, src, worker].map(file => fs.readFileSync(file));
    const probe = spawnSync(process.execPath, [behavioralProbe, scratch], {encoding: "utf8"});
    assert.equal(probe.status, 0, probe.stderr || probe.stdout);
    assert.equal(runToolkit("apply", scratch).state, "applied");
    assert.deepEqual([app, shared, src, worker].map(file => fs.readFileSync(file)), once);
  } finally {
    fs.rmSync(scratch, {recursive: true, force: true});
  }
}

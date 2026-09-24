#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { build9922Contracts } from "./profiles/build9922.mjs";
import { build10789Contracts } from "./profiles/build10789.mjs";
import { linuxBuild9647Contracts, linuxBuild9771Contracts, linuxBuild10954Contracts } from "./profiles/linux.mjs";

const command = process.argv[2];
const root = path.resolve(process.argv[3] ?? "");
if (!new Set(["check", "apply"]).has(command) || !process.argv[3]) {
  throw new Error("usage: terminal-toggle.mjs check|apply EXTRACTED_ASAR_ROOT");
}

const assets = path.join(root, "webview/assets");
const target = uniqueAsset(assets, /^app-initial-.*\.js$/);
const commandBefore =
  "{id:`toggleTerminal`,titleIntlId:`codex.command.toggleTerminal`," +
  "descriptionIntlId:`codex.commandDescription.toggleTerminal`,requiredAccess:`codexLocal`," +
  "commandMenuGroupKey:`panels`,commandMenu:!0,commandMenuFeature:`codex`," +
  "electron:{menuTitle:`Open Terminal`,menuTitleIntlId:`codex.commandMenuTitle.toggleTerminal`,";
const commandAfter = commandBefore.replace(
  "requiredAccess:`codexLocal`,commandMenuGroupKey",
  "requiredAccess:`codexLocal`,shortcutScope:`app`,commandMenuGroupKey"
);
const editableBefore =
  "c=n===`clearAllUnreads`&&(r===`Shift+Escape`||r===`Shift+Esc`),l;";
const editableAfter =
  "c=n===`toggleTerminal`||n===`clearAllUnreads`&&(r===`Shift+Escape`||r===`Shift+Esc`),l;";
const commandTargets = commandOwners();
let source = fs.readFileSync(target, "utf8");
let commandSources = commandTargets.map(file => fs.readFileSync(file, "utf8"));
let state = inspectState(source, commandSources);

if (command === "apply" && state === "needs-apply") {
  commandSources = commandSources.map(value =>
    replaceOnce(value, commandBefore, commandAfter, "terminal command scope"));
  const sharedIndex = commandTargets.indexOf(target);
  source = replaceOnce(sharedIndex < 0 ? source : commandSources[sharedIndex],
    editableBefore, editableAfter, "editable terminal shortcut permission");
  if (sharedIndex >= 0) commandSources[sharedIndex] = source;
  for (const [index, file] of commandTargets.entries()) {
    fs.writeFileSync(file, commandSources[index]);
    syntaxCheck(file);
  }
  if (sharedIndex < 0) {
    fs.writeFileSync(target, source);
    syntaxCheck(target);
  }
  state = inspectState(source, commandSources);
  if (state !== "applied") throw new Error("terminal toggle transform did not verify");
}

process.stdout.write(`${JSON.stringify({
  state,
  command: "toggleTerminal",
  targets: [...new Set([target, ...commandTargets])].map(file => path.relative(root, file))
}, null, 2)}\n`);

function inspectState(value, commands) {
  const commandRed = commands.map(source => count(source, commandBefore));
  const commandGreen = commands.map(source => count(source, commandAfter));
  const editableRed = count(value, editableBefore);
  const editableGreen = count(value, editableAfter);
  verifyOwnedBehavior(value);

  if (commandGreen.every(count => count === 1) && editableGreen === 1 &&
      commandRed.every(count => count === 0) && editableRed === 0) {
    return "applied";
  }
  if (commandRed.every(count => count === 1) && editableRed === 1 &&
      commandGreen.every(count => count === 0) && editableGreen === 0) {
    return "needs-apply";
  }
  throw new Error(
    `Upstream changed: terminal toggle seams red=${commandRed}/${editableRed} green=${commandGreen}/${editableGreen}`
  );
}

function verifyOwnedBehavior(value) {
  if (commandTargets.length === 3 &&
      build10789Contracts.every(contract => count(value, contract) === 1)) return;
  if (build9922Contracts.every(contract => count(value, contract) === 1)) return;
  if (linuxBuild9771Contracts.every(contract => count(value, contract) === 1)) return;
  if (linuxBuild10954Contracts.every(contract => count(value, contract) === 1)) return;
  if (linuxBuild9647Contracts.every(contract => count(value, contract) === 1)) return;
  throw new Error("Upstream changed: missing qualified terminal toggle contract");
}

function commandOwners() {
  if (count(fs.readFileSync(target, "utf8"), commandBefore) === 1 ||
      count(fs.readFileSync(target, "utf8"), commandAfter) === 1) return [target];
  const build = path.join(root, ".vite/build");
  const srcMatches = fs.readdirSync(build).filter(name => /^src-.*\.js$/.test(name) &&
    [commandBefore, commandAfter].some(seam => fs.readFileSync(path.join(build, name), "utf8").includes(seam)));
  if (srcMatches.length !== 1) {
    throw new Error(`Upstream changed: found ${srcMatches.length} terminal command source chunks`);
  }
  const src = path.join(build, srcMatches[0]);
  const worker = path.join(build, "worker.js");
  if (!fs.existsSync(worker) || !fs.statSync(worker).isFile()) {
    throw new Error("Upstream changed: terminal command worker owner is missing");
  }
  const shared = uniqueAsset(assets, /^app-shared-.*\.js$/);
  if (![commandBefore, commandAfter].some(seam => count(fs.readFileSync(shared, "utf8"), seam) === 1)) {
    throw new Error("Upstream changed: renderer terminal command owner is missing");
  }
  return [src, worker, shared];
}

function uniqueAsset(directory, pattern) {
  if (!fs.existsSync(directory) || !fs.statSync(directory).isDirectory()) {
    throw new Error(`Missing extracted assets directory: ${directory}`);
  }
  const matches = fs.readdirSync(directory).filter(name => pattern.test(name));
  if (matches.length !== 1) {
    throw new Error(`Upstream changed: found ${matches.length} assets matching ${pattern}`);
  }
  return path.join(directory, matches[0]);
}

function replaceOnce(value, before, after, label) {
  const first = value.indexOf(before);
  if (first < 0 || value.indexOf(before, first + before.length) >= 0) {
    throw new Error(`Upstream changed: ${label} is not unique`);
  }
  return value.slice(0, first) + after + value.slice(first + before.length);
}

function count(value, needle) {
  return value.split(needle).length - 1;
}

function syntaxCheck(file) {
  const result = spawnSync(process.execPath, ["--input-type=module", "--check"], {
    encoding: "utf8",
    input: fs.readFileSync(file),
    maxBuffer: 64 * 1024 * 1024
  });
  if (result.status !== 0) {
    const output = result.stderr || result.stdout;
    const summary = output.match(/SyntaxError:[^\n]*/)?.[0] ?? output.trim().slice(-1000);
    throw new Error(`module syntax check failed for ${path.relative(root, file)}: ${summary}`);
  }
}

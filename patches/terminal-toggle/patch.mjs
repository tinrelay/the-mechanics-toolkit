#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { build9922Contracts } from "./profiles/build9922.mjs";
import { build10789Contracts } from "./profiles/build10789.mjs";
import { build11645Contracts } from "./profiles/build11645.mjs";
import { build21421Contracts } from "./profiles/build21421.mjs";
import { build22943Contracts } from "./profiles/build22943.mjs";
import { linuxBuild9647Contracts, linuxBuild9771Contracts, linuxBuild10954Contracts } from "./profiles/linux.mjs";

const command = process.argv[2];
const root = path.resolve(process.argv[3] ?? "");
if (!new Set(["check", "apply"]).has(command) || !process.argv[3]) {
  throw new Error("usage: terminal-toggle.mjs check|apply EXTRACTED_ASAR_ROOT");
}

const assets = path.join(root, "webview/assets");
const runtime = fs.readdirSync(assets).filter(name => /^app-runtime-.*\.js$/.test(name) &&
  fs.readFileSync(path.join(assets, name), "utf8").includes(build22943Contracts[0]));
if (runtime.length > 1) throw new Error("Upstream changed: ambiguous terminal runtime");
const target = runtime.length === 1 ? path.join(assets, runtime[0]) : uniqueAsset(assets, /^app-initial-.*\.js$/);
const commandBefore =
  "{id:`toggleTerminal`,titleIntlId:`codex.command.toggleTerminal`," +
  "descriptionIntlId:`codex.commandDescription.toggleTerminal`,requiredAccess:`codexLocal`," +
  "commandMenuGroupKey:`panels`,commandMenu:!0,commandMenuFeature:`codex`," +
  "electron:{menuTitle:`Open Terminal`,menuTitleIntlId:`codex.commandMenuTitle.toggleTerminal`,";
const commandAfter = commandBefore.replace(
  "requiredAccess:`codexLocal`,commandMenuGroupKey",
  "requiredAccess:`codexLocal`,shortcutScope:`app`,commandMenuGroupKey"
);
const commandTargets = commandOwners();
let source = fs.readFileSync(target, "utf8");
const {editableBefore, editableAfter} = editableSeam(source);
let commandSources = commandTargets.map(file => fs.readFileSync(file, "utf8"));
let state = inspectState(source, commandSources);

if (command === "apply" && state === "needs-apply") {
  commandSources = commandSources.map(value =>
    replaceOnce(value, commandVariant(value, commandBefore), commandVariant(value, commandAfter), "terminal command scope"));
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
  const commandRed = commands.map(source => count(source, commandVariant(source, commandBefore)));
  const commandGreen = commands.map(source => count(source, commandVariant(source, commandAfter)));
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
  if (value.includes(build22943Contracts[0])) {
    const primary = fs.readFileSync(uniqueAsset(assets, /^app-primary-.*\.js$/), "utf8");
    const shared = fs.readFileSync(uniqueAsset(assets, /^app-shared-.*\.js$/), "utf8");
    if (build22943Contracts.slice(0, 3).every(contract => count(value, contract) === 1) &&
        count(primary, build22943Contracts[3]) === 1 && count(shared, build22943Contracts[4]) === 1) return;
    throw new Error("Upstream changed: build-22943 terminal ownership");
  }
  if (build21421Contracts.every(contract => count(value, contract) === 1)) return;
  if (build11645Contracts.every(contract => count(value, contract) === 1)) return;
  if (commandTargets.length === 3 &&
      build10789Contracts.every(contract => count(value, contract) === 1)) return;
  if (build9922Contracts.every(contract => count(value, contract) === 1)) return;
  if (linuxBuild9771Contracts.every(contract => count(value, contract) === 1)) return;
  if (linuxBuild10954Contracts.every(contract => count(value, contract) === 1)) return;
  if (linuxBuild9647Contracts.every(contract => count(value, contract) === 1)) return;
  throw new Error("Upstream changed: missing qualified terminal toggle contract");
}

function editableSeam(value) {
  const variants = [
    ["p=n===`focusPageBlockControls`||n===`copyPageLink`||n===`clearAllUnreads`&&(r===`Shift+Escape`||r===`Shift+Esc`),m=",
      "p=n===`toggleTerminal`||n===`focusPageBlockControls`||n===`copyPageLink`||n===`clearAllUnreads`&&(r===`Shift+Escape`||r===`Shift+Esc`),m="],
    ["h=n===`focusPageBlockControls`||n===`copyPageLink`||n===`clearAllUnreads`&&(r===`Shift+Escape`||r===`Shift+Esc`),g=",
      "h=n===`toggleTerminal`||n===`focusPageBlockControls`||n===`copyPageLink`||n===`clearAllUnreads`&&(r===`Shift+Escape`||r===`Shift+Esc`),g="],
    ["c=n===`clearAllUnreads`&&(r===`Shift+Escape`||r===`Shift+Esc`),l;",
      "c=n===`toggleTerminal`||n===`clearAllUnreads`&&(r===`Shift+Escape`||r===`Shift+Esc`),l;"],
    ["l=n===`clearAllUnreads`&&(r===`Shift+Escape`||r===`Shift+Esc`),u;",
      "l=n===`toggleTerminal`||n===`clearAllUnreads`&&(r===`Shift+Escape`||r===`Shift+Esc`),u;"],
    ["f=n===`focusPageBlockControls`||n===`copyPageLink`||n===`clearAllUnreads`&&(r===`Shift+Escape`||r===`Shift+Esc`),p;",
      "f=n===`toggleTerminal`||n===`focusPageBlockControls`||n===`copyPageLink`||n===`clearAllUnreads`&&(r===`Shift+Escape`||r===`Shift+Esc`),p;"]
  ].filter(([before, after]) => count(value, before) + count(value, after) === 1);
  if (variants.length !== 1) throw new Error("Upstream changed: editable terminal shortcut owner is not unique");
  return {editableBefore: variants[0][0], editableAfter: variants[0][1]};
}

function commandVariant(source, seam) {
  return source.startsWith("exports.ids=[339],exports.modules={") ||
    source.startsWith("(()=>{") && source.includes('titleIntlId:"codex.command.toggleTerminal"')
    ? seam.replaceAll("`", '"') : seam;
}

function commandOwners() {
  if (count(fs.readFileSync(target, "utf8"), commandBefore) === 1 ||
      count(fs.readFileSync(target, "utf8"), commandAfter) === 1) return [target];
  const build = path.join(root, ".vite/build");
  const srcMatches = fs.readdirSync(build).filter(name => (/^src-.*\.js$/.test(name) || name === "early-bootstrap-339-aea964a206c655e4.js") &&
    [commandBefore, commandAfter].some(seam => fs.readFileSync(path.join(build, name), "utf8").includes(commandVariant(fs.readFileSync(path.join(build, name), "utf8"), seam))));
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

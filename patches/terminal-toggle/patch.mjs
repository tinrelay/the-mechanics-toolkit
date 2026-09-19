#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { build9922Contracts } from "./profiles/build9922.mjs";
import { linuxBuild9647Contracts, linuxBuild9771Contracts } from "./profiles/linux.mjs";

const command = process.argv[2];
const root = path.resolve(process.argv[3] ?? "");
if (!new Set(["check", "apply"]).has(command) || !process.argv[3]) {
  throw new Error("usage: terminal-toggle.mjs check|apply EXTRACTED_ASAR_ROOT");
}

const assets = path.join(root, "webview/assets");
const target = uniqueAsset(/^app-initial-.*\.js$/);
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
let source = fs.readFileSync(target, "utf8");
let state = inspectState(source);

if (command === "apply" && state === "needs-apply") {
  source = patchSource(source);
  fs.writeFileSync(target, source);
  syntaxCheck(target);
  state = inspectState(source);
  if (state !== "applied") throw new Error("terminal toggle transform did not verify");
}

process.stdout.write(`${JSON.stringify({
  state,
  command: "toggleTerminal",
  target: path.relative(root, target)
}, null, 2)}\n`);

function inspectState(value) {
  const commandRed = count(value, commandBefore);
  const commandGreen = count(value, commandAfter);
  const editableRed = count(value, editableBefore);
  const editableGreen = count(value, editableAfter);
  verifyOwnedBehavior(value);

  if (commandGreen === 1 && editableGreen === 1 && commandRed === 0 && editableRed === 0) {
    return "applied";
  }
  if (commandRed === 1 && editableRed === 1 && commandGreen === 0 && editableGreen === 0) {
    return "needs-apply";
  }
  throw new Error(
    `Upstream changed: terminal toggle seams red=${commandRed}/${editableRed} green=${commandGreen}/${editableGreen}`
  );
}

function verifyOwnedBehavior(value) {
  if (build9922Contracts.every(contract => count(value, contract) === 1)) return;
  if (linuxBuild9771Contracts.every(contract => count(value, contract) === 1)) return;
  if (linuxBuild9647Contracts.every(contract => count(value, contract) === 1)) return;
  throw new Error("Upstream changed: missing qualified terminal toggle contract");
}

function patchSource(value) {
  let patched = replaceOnce(value, commandBefore, commandAfter, "terminal command scope");
  patched = replaceOnce(
    patched,
    editableBefore,
    editableAfter,
    "editable terminal shortcut permission"
  );
  return patched;
}

function uniqueAsset(pattern) {
  if (!fs.existsSync(assets) || !fs.statSync(assets).isDirectory()) {
    throw new Error(`Missing extracted assets directory: ${assets}`);
  }
  const matches = fs.readdirSync(assets).filter(name => pattern.test(name));
  if (matches.length !== 1) {
    throw new Error(`Upstream changed: found ${matches.length} assets matching ${pattern}`);
  }
  return path.join(assets, matches[0]);
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

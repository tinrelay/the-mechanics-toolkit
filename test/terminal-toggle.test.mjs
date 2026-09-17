#!/usr/bin/env node
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { linuxBuild9647Contracts } from "../patches/terminal-toggle/profiles/linux.mjs";

const root = path.resolve(process.argv[2] ?? "");
if (!process.argv[2]) throw new Error("usage: terminal-toggle.test.mjs EXTRACTED_ASAR_ROOT");

const assets = path.join(root, "webview/assets");
const names = fs.readdirSync(assets);
const matches = names.filter(name => /^app-initial-.*\.js$/.test(name));
assert.equal(matches.length, 1, "unique app-initial asset");
const source = fs.readFileSync(path.join(assets, matches[0]), "utf8");

assert.equal(
  count(source, "{id:`toggleTerminal`,titleIntlId:`codex.command.toggleTerminal`,descriptionIntlId:`codex.commandDescription.toggleTerminal`,requiredAccess:`codexLocal`,shortcutScope:`app`,commandMenuGroupKey:`panels`"),
  1,
  "the existing configurable terminal command is app-scoped"
);
assert.equal(
  count(source, "c=n===`toggleTerminal`||n===`clearAllUnreads`&&(r===`Shift+Escape`||r===`Shift+Esc`),l;"),
  1,
  "the terminal command is allowed while the composer or xterm editable owns focus"
);
const build9647 = source.includes("$wi=()=>{fen.run({action:{type:`windows.terminal.toggle`,windowId:bv}})");
const build9647Linux = source.includes(linuxBuild9647Contracts[2]);
assert.ok(build9647Linux || build9647, "the current build-9647 terminal owner is present");
assert.equal(
  count(source, "accelerators:i,allowRepeat:d,enabled:f,onlyWithin:p,yieldToSelectedText:u"),
  1,
  "the configured accelerators feed the existing hotkey dispatcher"
);
assert.equal(
  count(source, "allowWithinEditable:c,enabled:a,onKeyDown:l"),
  1,
  "editable permission reaches the existing hotkey hook"
);
if (build9647Linux) {
  assert.equal(count(source, linuxBuild9647Contracts[2]), 1,
    "the Linux command keeps the stock terminal action owner");
  assert.equal(count(source, linuxBuild9647Contracts[3]), 1,
    "the Linux configurable command remains routed through the stock terminal toggle action");
} else if (build9647) {
  assert.equal(count(source, "$wi=()=>{fen.run({action:{type:`windows.terminal.toggle`,windowId:bv}})"), 1,
    "the command keeps the stock terminal action owner");
  assert.equal(count(source, "[`toggleTerminal`,$wi]"), 1,
    "the configurable command remains routed through the stock terminal toggle action");
}
assert.equal(
  count(source, 'defaultKeybindings:[{key:"Control+`"}]'),
  1,
  "the stock default remains data, not patch logic"
);

process.stdout.write(`${JSON.stringify({
  state: "green",
  command: "toggleTerminal",
  acceleratorOwner: "configured-keymap",
  composerFocused: "opens-terminal",
  terminalFocused: "stock-terminal-toggle-action",
  hardcodedShortcutAdded: false
}, null, 2)}\n`);

function count(haystack, needle) {
  return haystack.split(needle).length - 1;
}

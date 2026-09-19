#!/usr/bin/env node
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { build9922Contracts } from "../patches/terminal-toggle/profiles/build9922.mjs";
import {
  linuxBuild9647Contracts,
  linuxBuild9771Contracts
} from "../patches/terminal-toggle/profiles/linux.mjs";

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
const build9771Linux = source.includes(linuxBuild9771Contracts[3]);
const build9647Linux = source.includes(linuxBuild9647Contracts[2]);
const build9922 = source.includes(build9922Contracts[3]);
assert.ok(build9922 || build9771Linux || build9647Linux, "the qualified terminal owner is present");
const contracts = build9922 ? build9922Contracts : build9771Linux ? linuxBuild9771Contracts : linuxBuild9647Contracts;
assert.equal(
  count(source, contracts[1]),
  1,
  "the configured accelerators feed the existing hotkey dispatcher"
);
assert.equal(
  count(source, "allowWithinEditable:c,enabled:a,onKeyDown:l"),
  1,
  "editable permission reaches the existing hotkey hook"
);
if (build9922) {
  assert.equal(count(source, build9922Contracts[3]), 1,
    "the build-9922 command keeps the stock terminal action owner");
  assert.equal(count(source, build9922Contracts[4]), 1,
    "the build-9922 configurable command remains routed through the stock terminal toggle action");
} else if (build9771Linux) {
  assert.equal(count(source, linuxBuild9771Contracts[3]), 1,
    "the Linux command keeps the stock terminal action owner");
  assert.equal(count(source, linuxBuild9771Contracts[4]), 1,
    "the Linux configurable command remains routed through the stock terminal toggle action");
} else {
  assert.equal(count(source, linuxBuild9647Contracts[2]), 1,
    "the Linux build-9647 command keeps the stock terminal action owner");
  assert.equal(count(source, linuxBuild9647Contracts[3]), 1,
    "the Linux build-9647 configurable command remains routed through the stock terminal toggle action");
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

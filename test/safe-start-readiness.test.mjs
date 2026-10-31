#!/usr/bin/env node
import assert from "node:assert/strict";
import fs from "node:fs";
import {mainProcessAsset} from "../src/main-process-asset.mjs";
import path from "node:path";

const root = path.resolve(process.argv[2] ?? "");
if (!process.argv[2]) throw new Error("usage: safe-start-readiness.test.mjs EXTRACTED_ASAR_ROOT");
const assets = path.join(root, "webview/assets");
const build = path.join(root, ".vite/build");
const main = fs.readFileSync(mainProcessAsset(root), "utf8");
const renderer = fs.readFileSync(uniqueAsset(assets,
  main.includes('v=require("./bootstrap-BLyztc2V.js")') || main.startsWith("exports.ids=[916],exports.modules={") ? /^app-primary-.*\.js$/ : /^app-initial-.*\.js$/), "utf8");

assert.ok(main.includes("--tmtk-safe-start-marker="),
  "the trusted stock ready message invokes Codex's existing relaunch-marker writer");
assert.ok(main.includes("e.startsWith(`--tmtk-safe-start-marker=`)"),
  "Windows activation can carry its launch-only marker without an inherited environment");
assert.ok(main.includes("i.startsWith(r)&&n.length===2&&/^[0-9a-z-]+$/.test(n[0])"),
  "the Windows marker is bounded to one of this user's TMTK rescue incidents");
const markerOwner = main.startsWith("exports.ids=[916],exports.modules={")
  ? fs.readFileSync(path.join(build, "early-bootstrap-339-aea964a206c655e4.js"), "utf8")
  : main.includes('v=require("./bootstrap-BLyztc2V.js")')
  ? fs.readFileSync(path.join(build, "bootstrap-BLyztc2V.js"), "utf8")
  : main;
assert.ok(/[$A-Z_a-z][$\w]*=`CODEX_ELECTRON_DEV_RELAUNCH_MARKER_PATH`/.test(markerOwner) ||
  markerOwner.includes("markerPath:t=process.env.CODEX_ELECTRON_DEV_RELAUNCH_MARKER_PATH?.trim()"),
  "readiness uses the existing per-launch marker path environment boundary");
assert.equal([
  "qn.dispatchMessage(`ready`,{persistedStateResponsePriority:V9?`critical`:void 0})",
  "g.dispatchMessage(`ready`,{persistedStateResponsePriority:R9?`critical`:void 0})",
  "Dr.dispatchMessage(`ready`,{persistedStateResponsePriority:B9?`critical`:void 0})",
  "Jn.dispatchMessage(`ready`,{persistedStateResponsePriority:R9?`critical`:void 0})",
  "ur.dispatchMessage(`ready`,{persistedStateResponsePriority:R9?`critical`:void 0})",
  "aa.dispatchMessage(`ready`,{persistedStateResponsePriority:reo?`critical`:void 0})",
  "mh.dispatchMessage(`ready`,{persistedStateResponsePriority:fgc?`critical`:void 0})",
  "Lu.dispatchMessage(`ready`,{})",
  "hp.dispatchMessage(`ready`,{})"
].reduce((total, contract) => total + count(renderer, contract), 0), 1,
"the renderer retains its unique stock AppRoutes-mount readiness event");
assert.equal(renderer.includes("mtk-safe-start-ready"), false, "the patch does not invent a second renderer lifecycle");
process.stdout.write("safe-start readiness probe passed\n");

function uniqueAsset(directory, pattern) {
  const matches = fs.readdirSync(directory).filter(name => pattern.test(name));
  assert.equal(matches.length, 1, `unique asset matching ${pattern}`);
  return path.join(directory, matches[0]);
}

function count(value, needle) {
  return value.split(needle).length - 1;
}

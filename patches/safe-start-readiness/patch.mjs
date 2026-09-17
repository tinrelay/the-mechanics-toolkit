#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const command = process.argv[2];
const root = path.resolve(process.argv[3] ?? "");
if (!new Set(["check", "apply"]).has(command) || !process.argv[3]) {
  throw new Error("usage: safe-start-readiness/patch.mjs check|apply EXTRACTED_ASAR_ROOT");
}

const mainTarget = uniqueAsset(path.join(root, ".vite/build"), /^main-.*\.js$/);
const rendererTarget = uniqueAsset(path.join(root, "webview/assets"), /^app-initial-.*\.js$/);
let mainSource = fs.readFileSync(mainTarget, "utf8");
const rendererSource = fs.readFileSync(rendererTarget, "utf8");
let state = inspectState(mainSource, rendererSource);

if (command === "apply" && state === "needs-apply") {
  mainSource = patchMain(mainSource);
  fs.writeFileSync(mainTarget, mainSource);
  syntaxCheck(mainTarget);
  state = inspectState(mainSource, rendererSource);
  if (state !== "applied") throw new Error("safe-start readiness transform did not verify");
}

process.stdout.write(`${JSON.stringify({
  state,
  markerEnvironment: "CODEX_ELECTRON_DEV_RELAUNCH_MARKER_PATH",
  readinessMessage: "ready",
  targets: [mainTarget].map(target => path.relative(root, target))
}, null, 2)}\n`);

function inspectState(mainValue, rendererValue) {
  verifyStockContracts(mainValue, rendererValue);
  const profile = safeStartProfile(mainValue);
  return mainValue.includes(readinessStatement(profile.marker, profile.writer))
    ? "applied"
    : "needs-apply";
}

function verifyStockContracts(mainValue, rendererValue) {
  const rendererReady = "g.dispatchMessage(`ready`,{persistedStateResponsePriority:R9?`critical`:void 0})";
  const profile = safeStartProfile(mainValue);
  const contractFamilies = [
    ["relaunch marker environment", [`${profile.marker}=\`CODEX_ELECTRON_DEV_RELAUNCH_MARKER_PATH\``]],
    ["development relaunch writer", [`function ${profile.writer}(`]],
    ["trusted renderer message guard", ["if(!N(t))return;"]]
  ];
  for (const [label, variants] of contractFamilies) {
    if (variants.reduce((total, contract) => total + count(mainValue, contract), 0) !== 1) {
      throw new Error(`Upstream changed: safe-start ${label} is not unique`);
    }
  }
  if (count(rendererValue, rendererReady) !== 1) {
    throw new Error("Upstream changed: safe-start renderer readiness contract is not recognized");
  }
}

function patchMain(value) {
  const {marker, writer} = safeStartProfile(value);
  return replaceOnce(
    value,
    "if(!N(t))return;",
    readinessStatement(marker, writer),
    "trusted stock renderer readiness message"
  );
}

function safeStartProfile(value) {
  const marker = "vae";
  if (count(value, `${marker}=\`CODEX_ELECTRON_DEV_RELAUNCH_MARKER_PATH\``) !== 1) {
    throw new Error("Upstream changed: safe-start relaunch marker environment is not unique");
  }
  const match = [...value.matchAll(new RegExp(
    `function (?<writer>[$A-Z_a-z][$\\w]*)\\(\\{markerPath:e=process\\.env\\[${marker}\\]\\?\\.trim\\(\\),writeMarker:t=`, "g"
  ))];
  if (match.length !== 1) throw new Error("Upstream changed: safe-start relaunch writer is not unique");
  return {marker, writer: match[0].groups.writer};
}

function readinessStatement(marker, writer) {
  return "if(!N(t))return;s.type===`ready`&&(()=>{" +
    "let e=process.argv.filter(e=>e.startsWith(`--tmtk-safe-start-marker=`));" +
    "if(e.length===1){let t=Buffer.from(e[0].slice(`--tmtk-safe-start-marker=`.length)," +
    "`base64url`).toString(`utf8`),r=(process.env.USERPROFILE+" +
    "`\\\\.codex\\\\tmtk-rescue\\\\`).toLowerCase(),i=t.toLowerCase()," +
    "n=i.slice(r.length).split(`\\\\`);" +
    `i.startsWith(r)&&n.length===2&&/^[0-9a-z-]+$/.test(n[0])&&` +
    `n[1]===\`renderer.ready\`&&(process.env[${marker}]=t)}` +
    `${writer}()})();`;
}

function uniqueAsset(directory, pattern) {
  if (!fs.existsSync(directory) || !fs.statSync(directory).isDirectory()) {
    throw new Error(`Missing extracted asset directory: ${directory}`);
  }
  const matches = fs.readdirSync(directory).filter(name => pattern.test(name));
  if (matches.length !== 1) throw new Error(`Upstream changed: found ${matches.length} assets matching ${pattern}`);
  return path.join(directory, matches[0]);
}

function replaceOnce(value, before, after, label) {
  if (count(value, before) !== 1) throw new Error(`Upstream changed: ${label} is not unique`);
  return value.replace(before, after);
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

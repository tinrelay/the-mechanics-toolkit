#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const command = process.argv[2];
const root = path.resolve(process.argv[3] ?? "");
if (!new Set(["check", "apply"]).has(command) || !process.argv[3]) {
  throw new Error("usage: runtime-json-reload/patch.mjs check|apply EXTRACTED_ASAR_ROOT");
}

const assets = path.join(root, "webview/assets");
const renderer = rendererFile(assets);
const main = uniqueFile(/^main-.*\.js$/, path.join(root, ".vite/build"));
const runtimeFiles = Object.freeze([
  "agent-roster.json"
]);
let rendererSource = fs.readFileSync(renderer, "utf8");
let mainSource = fs.readFileSync(main, "utf8");
let state = inspectState();

if (command === "apply" && state === "needs-apply") {
  rendererSource = patchRenderer(rendererSource);
  mainSource = patchMain(mainSource);
  fs.writeFileSync(renderer, rendererSource);
  fs.writeFileSync(main, mainSource);
  syntaxCheck(renderer);
  syntaxCheck(main);
  state = inspectState();
  if (state !== "applied") throw new Error("runtime JSON reload transform did not verify");
}

process.stdout.write(`${JSON.stringify({
  state,
  directory: ".codex",
  files: runtimeFiles,
  targets: [renderer, main].map(file => path.relative(root, file)).sort()
}, null, 2)}\n`);

function inspectState() {
  const rendererMarkers = [
    'const MTKruntimeJsonFiles=new Set(["agent-roster.json"])',
    "function MTKruntimeJsonRegister(",
    "function MTKinstallRuntimeJsonReload(",
    '.subscribe("mtk-runtime-json-changed"',
    '.dispatchMessage("mtk-runtime-json-watch",{roots:'
  ];
  const mainMarkers = [
    "const MTKruntimeJsonFs=require(\"node:fs\")",
    "function MTKstartRuntimeJsonWatch(",
    "function MTKcloseRuntimeJsonWatch(",
    'MTKruntimeJsonFs.watch(n,{persistent:!1}',
    'type:"mtk-runtime-json-changed"',
    'case`mtk-runtime-json-watch`:MTKstartRuntimeJsonWatch(e,this.windowManager,t.roots);break'
  ];
  const rendererInstalled = rendererSource.includes("MTKinstallRuntimeJsonReload(),") ||
    rendererSource.includes("MTKinstallRuntimeJsonReload();export{");
  const rendererApplied = rendererMarkers.every(marker => rendererSource.includes(marker)) && rendererInstalled;
  const mainApplied = mainMarkers.every(marker => mainSource.includes(marker));
  if (rendererApplied && mainApplied) {
    inspectAppliedRenderer();
    return "applied";
  }
  if (rendererMarkers.some(marker => rendererSource.includes(marker)) ||
      rendererInstalled || mainMarkers.some(marker => mainSource.includes(marker))) {
    throw new Error("Upstream changed: runtime JSON reload patch is partial");
  }
  inspectPristineRenderer();
  inspectPristineMain();
  return "needs-apply";
}

function inspectAppliedRenderer() {
  const profile = rendererProfile(rendererSource);
  const subscribers = [...rendererSource.matchAll(/(?<bus>[$A-Z_a-z][$\w]*)\.subscribe\("mtk-runtime-json-changed"/g)];
  const dispatchers = [...rendererSource.matchAll(/(?<bus>[$A-Z_a-z][$\w]*)\.dispatchMessage\("mtk-runtime-json-watch"/g)];
  if (subscribers.length !== 1 || dispatchers.length !== 2 ||
      subscribers[0].groups.bus !== profile.bus || dispatchers.some(match => match.groups.bus !== profile.bus)) {
    throw new Error("Upstream changed: runtime JSON renderer host bus wiring is inconsistent");
  }
  if (profile.kind === "local") {
    if (!profile.contract.includes(",MTKinstallRuntimeJsonReload(),")) {
      throw new Error("Upstream changed: runtime JSON renderer local installation is missing");
    }
  } else if (count(rendererSource, "MTKinstallRuntimeJsonReload();export{") !== 1) {
    throw new Error("Upstream changed: runtime JSON renderer imported installation is not unique");
  }
}

function inspectPristineRenderer() {
  const profile = rendererProfile(rendererSource);
  if (count(rendererSource, "export{") !== 1) {
    throw new Error("Upstream changed: runtime JSON renderer export list is not unique");
  }
  if (profile.kind === "local" &&
      !new RegExp(`(?:\\{|,)${profile.bus} as [$A-Z_a-z][$\\w]*(?=,|})`).test(rendererSource.slice(rendererSource.lastIndexOf("export{")))) {
    throw new Error("Upstream changed: renderer host bus is not exported from app-initial");
  }
}

function inspectPristineMain() {
  const owner = mainSource.match(/var [$\w]+=[$\w]+\.i\(`electron-message-handler`\)/g) ?? [];
  if (owner.length !== 1) {
    throw new Error("Upstream changed: runtime JSON main-process owner is not unique");
  }
  for (const contract of [
    "case`show-plan-summary`:break;case`update-diff-if-open`:break;",
    "case`electron-add-new-workspace-root-option`:"
  ]) {
    if (count(mainSource, contract) !== 1) {
      throw new Error(`Upstream changed: runtime JSON main-process contract is not unique: ${contract}`);
    }
  }
}

function patchRenderer(value) {
  const profile = rendererProfile(value);
  const helper = rendererHelper(profile.bus);
  let patched = helper + value;
  if (profile.kind === "local") {
    patched = replaceOnce(
      patched,
      profile.contract,
      profile.contract.replace(",", ",MTKinstallRuntimeJsonReload(),"),
      "renderer host-bus initialization"
    );
  } else {
    patched = replaceOnce(
      patched,
      "export{",
      "MTKinstallRuntimeJsonReload();export{",
      "renderer imported host-bus initialization"
    );
  }
  return patched;
}

function rendererHelper(bus) {
  return String.raw`const MTKruntimeJsonFiles=new Set(["agent-roster.json"]),MTKruntimeJsonAcceptors=new Map;let MTKruntimeJsonInstalled=!1;function MTKruntimeJsonQueue(e,t=!1){let n=MTKruntimeJsonAcceptors.get(e);if(n!=null)if(n.running)n.queued=!0,n.initial=n.initial||t;else{n.running=!0;let r=t;Promise.resolve().then(()=>n.accept(Object.freeze({initial:r}))).catch(()=>!1).finally(()=>{n.running=!1;if(MTKruntimeJsonAcceptors.get(e)!==n)return;if(n.queued){let t=n.initial;n.queued=!1,n.initial=!1,MTKruntimeJsonQueue(e,t)}})}}function MTKruntimeJsonRoots(e){return[...new Set((Array.isArray(e)?e:[]).filter(e=>typeof e==="string"&&e.length>0))].sort()}function MTKruntimeJsonRegister(e,t,n){if(!MTKruntimeJsonFiles.has(e)||typeof n!=="function")return null;let r={accept:n,roots:MTKruntimeJsonRoots(t),running:!1,queued:!1,initial:!1};MTKruntimeJsonAcceptors.set(e,r),${bus}.dispatchMessage("mtk-runtime-json-watch",{roots:r.roots}),queueMicrotask(()=>{MTKruntimeJsonAcceptors.get(e)===r&&MTKruntimeJsonQueue(e,!0)});return()=>{MTKruntimeJsonAcceptors.get(e)===r&&(MTKruntimeJsonAcceptors.delete(e),${bus}.dispatchMessage("mtk-runtime-json-watch",{roots:[]}))}}function MTKinstallRuntimeJsonReload(){if(MTKruntimeJsonInstalled)return;MTKruntimeJsonInstalled=!0;let e=globalThis.__MTK_RUNTIME_JSON_RELOAD__;if(e!==void 0&&e?.version!==2)return;globalThis.__MTK_RUNTIME_JSON_RELOAD__=Object.freeze({version:2,register:MTKruntimeJsonRegister}),${bus}.subscribe("mtk-runtime-json-changed",e=>{MTKruntimeJsonFiles.has(e?.fileName)&&MTKruntimeJsonQueue(e.fileName,!1)})}`;
}

function rendererProfile(value) {
  const matches = [...value.matchAll(/(?<bus>[$A-Z_a-z][$\w]*)=(?<owner>[$A-Z_a-z][$\w]*)\.getInstance\(\),(?:MTKinstallRuntimeJsonReload\(\),)?(?<bridge>[$A-Z_a-z][$\w]*)\(\(e,t\)=>\{\k<bus>\.dispatchMessage\(e,t\)\}\)/g)];
  if (matches.length === 1) return {kind: "local", bus: matches[0].groups.bus, contract: matches[0][0]};
  if (matches.length > 1) throw new Error("Upstream changed: runtime JSON renderer host-bus owner is not unique");
  const imports = [...value.matchAll(/import\{(?<bindings>[^}]+)\}from"\.\/app-shared-[0-9a-f]+\.js";/g)];
  if (imports.length !== 1) throw new Error("Upstream changed: runtime JSON renderer shared import is not unique");
  const buses = [...imports[0].groups.bindings.matchAll(/(?:^|,)[$A-Z_a-z][$\w]* as (?<bus>[$A-Z_a-z][$\w]*)(?=,|$)/g)]
    .map(match => match.groups.bus)
    .filter(bus => count(value, `${bus}.dispatchMessage(`) >= 1 && count(value, `${bus}.subscribe(`) >= 1);
  if (buses.length !== 1) throw new Error("Upstream changed: runtime JSON imported host bus is not unique");
  return {kind: "imported-current", bus: buses[0]};
}

function patchMain(value) {
  const owners = value.match(/var [$\w]+=[$\w]+\.i\(`electron-message-handler`\)/g) ?? [];
  if (owners.length !== 1) throw new Error("Upstream changed: main-process runtime JSON helper owner is not unique");
  let patched = replaceOnce(value, owners[0], mainHelper() + owners[0],
    "main-process runtime JSON helper owner");
  patched = replaceOnce(
    patched,
    "case`electron-add-new-workspace-root-option`:",
    "case`mtk-runtime-json-watch`:MTKstartRuntimeJsonWatch(e,this.windowManager,t.roots);break;case`electron-add-new-workspace-root-option`:",
    "main-process runtime JSON message handler"
  );
  return patched;
}

function mainHelper() {
  return String.raw`const MTKruntimeJsonFs=require("node:fs"),MTKruntimeJsonPath=require("node:path"),MTKruntimeJsonNames=new Set(["agent-roster.json"]),MTKruntimeJsonWatchers=new Map;function MTKcloseRuntimeJsonWatch(e){let t=MTKruntimeJsonWatchers.get(e);if(t!=null){MTKruntimeJsonWatchers.delete(e);for(let e of t.timers.values())clearTimeout(e);t.timers.clear();for(let e of t.watchers.values())try{e.close()}catch{}t.watchers.clear()}}function MTKscheduleRuntimeJsonChange(e,t){let n=e.timers.get(t);n!==void 0&&clearTimeout(n),e.timers.set(t,setTimeout(()=>{e.timers.delete(t);try{e.windowManager.sendMessageToWebContents(e.webContents,{type:"mtk-runtime-json-changed",fileName:t})}catch{}},180))}function MTKvalidRuntimeJsonRoots(e){if(!Array.isArray(e)||e.length>128)return[];let t=[];for(let n of e){if(typeof n!=="string"||n.length===0||n.length>4096||n.includes("\0")||!MTKruntimeJsonPath.isAbsolute(n))continue;let e=MTKruntimeJsonPath.normalize(n);if(e===MTKruntimeJsonPath.parse(e).root||t.includes(e))continue;t.push(e)}return t.sort()}function MTKstartRuntimeJsonWatch(e,t,n){if(e==null||!Number.isInteger(e.id))return;MTKcloseRuntimeJsonWatch(e.id);let r={webContents:e,windowManager:t,watchers:new Map,timers:new Map};MTKruntimeJsonWatchers.set(e.id,r);for(let t of MTKvalidRuntimeJsonRoots(n)){let n=MTKruntimeJsonPath.join(t,".codex");try{let t=MTKruntimeJsonFs.lstatSync(n);if(!t.isDirectory()||t.isSymbolicLink())continue;let i=MTKruntimeJsonFs.watch(n,{persistent:!1},(e,t)=>{let n=t==null?null:Buffer.isBuffer(t)?t.toString("utf8"):String(t);(n==null||MTKruntimeJsonNames.has(n))&&MTKscheduleRuntimeJsonChange(r,"agent-roster.json")});r.watchers.set(n,i),i.on("error",()=>{if(r.watchers.get(n)!==i)return;try{i.close()}catch{}r.watchers.delete(n)})}catch{}}e.once("destroyed",()=>MTKcloseRuntimeJsonWatch(e.id))}`;
}

function uniqueFile(pattern, directory) {
  if (!fs.existsSync(directory) || !fs.statSync(directory).isDirectory()) {
    throw new Error(`Missing extracted directory: ${directory}`);
  }
  const matches = fs.readdirSync(directory).filter(name => pattern.test(name));
  if (matches.length !== 1) throw new Error(`Upstream changed: found ${matches.length} files matching ${pattern}`);
  return path.join(directory, matches[0]);
}

function rendererFile(directory) {
  const messageBus = fs.readdirSync(directory).filter(name => /^message-bus-.*\.js$/.test(name));
  if (messageBus.length === 1) return path.join(directory, messageBus[0]);
  if (messageBus.length > 1) {
    throw new Error("Upstream changed: renderer message-bus owner is not unique");
  }
  return uniqueFile(/^app-initial-.*\.js$/, directory);
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

#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const command = process.argv[2];
const root = path.resolve(process.argv[3] ?? "");
const bootstrap = String.raw`const MTKpatchRegistryKey="__MTK_PATCH_REGISTRY__",MTKpatchRegistry=(()=>{let e=globalThis[MTKpatchRegistryKey];if(e===void 0){let t={};e={apiVersion:1,packages:t,register(e,n){if(typeof e!=="string"||!/^[a-z][A-Za-z0-9]*$/.test(e)||n==null||typeof n!=="object"||Array.isArray(n)||!Number.isInteger(n.version)||n.version<1)return!1;let r=t[e];return r!=null&&r.version!==n.version?!1:(t[e]=Object.freeze({...n}),!0)}};globalThis[MTKpatchRegistryKey]=e}return e?.apiVersion===1&&e.packages!=null&&typeof e.packages==="object"&&!Array.isArray(e.packages)&&typeof e.register==="function"?e:null})();`;
if (!new Set(["check", "apply"]).has(command) || !process.argv[3]) {
  throw new Error("usage: renderer-patch-registry/patch.mjs check|apply EXTRACTED_ASAR_ROOT");
}

const assets = path.join(root, "webview/assets");
const build = path.join(root, ".vite/build");
const appInitial = uniqueAsset(/^app-initial-.*\.js$/);
const mainProcess = uniqueMainAsset(/^main-.*\.js$/);
const sidebarActionCollapseMarker =
  'const MTK_SIDEBAR_ACTIONS_STORAGE_KEY="the-mechanics-toolkit:sidebar-global-actions-collapsed:v1"';
const taskAttentionPolicyMarkers = [
  "const MTKattentionRosterBridge=1",
  'const MTKattentionRelativePath=".codex/task-attention-policy.json"'
];
const safeStartReadinessMarker = "--tmtk-safe-start-marker=";
const terminalToggleMarker = 'requiredAccess:`codexLocal`,shortcutScope:`app`,commandMenuGroupKey:`panels`';
let state = inspectState();
if (command === "apply" && state === "needs-apply") {
  applyRegistry();
  syntaxCheckChanged();
  state = inspectState();
  if (state !== "applied") throw new Error("renderer patch registry transform did not verify");
}

const packages = activePackages().map(entry => entry.name).sort();
process.stdout.write(`${JSON.stringify({
  state,
  apiVersion: 1,
  packages,
  targets: registryTargets().map(file => path.relative(root, file)).sort()
}, null, 2)}\n`);

function activePackages() {
  const appSource = fs.readFileSync(appInitial, "utf8");
  const mainSource = fs.readFileSync(mainProcess, "utf8");
  const packages = [];
  addIf(packages, appSource.includes("function MTKusePaletteBootstrap("), {
    name: "taskVisualPalette",
    file: appInitial,
    call: `MTKpatchRegistry?.register("taskVisualPalette",{version:1,resolveTaskColor(e){try{let t=MTKmatchPalette(MTKsidebarPalette,e?.title,e?.taskId);return t?.color??null}catch{return null}}});`
  });
  addIf(packages, appSource.includes("function MTKinstallRuntimeJsonReload("), {
    name: "runtimeJsonReload",
    file: appInitial,
    call: `MTKpatchRegistry?.register("runtimeJsonReload",{version:2,files:["agent-roster.json"]});`
  });
  addIf(packages, appSource.includes("globalThis.__MTK_AGENT_ROSTER__=Object.freeze("), {
    name: "agentRoster",
    file: appInitial,
    call: `MTKpatchRegistry?.register("agentRoster",{version:1,file:"agent-roster.json",discovery:"registered-local-project-roots"});`
  });
  addIf(packages, appSource.includes("function MTKreasoningShouldStayOpen("), {
    name: "reasoningRetention",
    file: appInitial,
    call: `MTKpatchRegistry?.register("reasoningRetention",{version:1,policy:"exact-task-opt-in"});`
  });
  addIf(packages, appSource.includes(sidebarActionCollapseMarker), {
    name: "sidebarActionCollapse",
    file: appInitial,
    call: `MTKpatchRegistry?.register("sidebarActionCollapse",{version:1});`
  });
  addIf(packages, taskAttentionPolicyMarkers.some(marker => appSource.includes(marker)), {
    name: "taskAttentionPolicy",
    file: appInitial,
    call: `MTKpatchRegistry?.register("taskAttentionPolicy",{version:1});`
  });
  addIf(packages, assetFiles().some(file => fs.readFileSync(file, "utf8").includes(terminalToggleMarker)), {
    name: "terminalToggle",
    file: appInitial,
    call: `MTKpatchRegistry?.register("terminalToggle",{version:1});`
  });
  addIf(packages, mainSource.includes("function MTKnativeAppToolsPeerAuthorizer("), {
    name: "nativeAppToolsPeerAuthorization",
    file: appInitial,
    call: `MTKpatchRegistry?.register("nativeAppToolsPeerAuthorization",{version:1,policy:"immediate-codex-node-peer"});`
  });
  addIf(packages, mainSource.includes('const MTKobserveContract="tmtk-codex-observability-v1"'), {
    name: "codexObservability",
    file: appInitial,
    call: `MTKpatchRegistry?.register("codexObservability",{version:1,transport:"private-local",capabilities:["targets","metrics","devtools","cdp","cpu-profile","trace"]});`
  });
  addIf(packages, mainSource.includes(safeStartReadinessMarker), {
    name: "safeStartReadiness",
    file: appInitial,
    call: `MTKpatchRegistry?.register("safeStartReadiness",{version:1,signal:"trusted-renderer-ready"});`
  });

  for (const file of assetFiles()) {
    if (file === appInitial) continue;
    const source = fs.readFileSync(file, "utf8");
    addIf(packages, source.includes("function MTKinstallRuntimeJsonReload("), {
      name: "runtimeJsonReload",
      file,
      anchor: "function MTKinstallRuntimeJsonReload(",
      call: `globalThis.__MTK_PATCH_REGISTRY__?.register?.("runtimeJsonReload",{version:2,files:["agent-roster.json"]});`
    });
    addIf(packages, source.includes("function MTKreasoningRosterValue("), {
      name: "reasoningRetention",
      file,
      anchor: "function MTKreasoningRosterValue(",
      call: `globalThis.__MTK_PATCH_REGISTRY__?.register?.("reasoningRetention",{version:1,policy:"exact-task-opt-in"});`
    });
    addIf(packages, source.includes(sidebarActionCollapseMarker), {
      name: "sidebarActionCollapse",
      file,
      anchor: sidebarActionCollapseMarker,
      call: `globalThis.__MTK_PATCH_REGISTRY__?.register?.("sidebarActionCollapse",{version:1});`
    });
    addIf(packages, source.includes("function MTKinstallModelIdentityGuard(") &&
      source.includes("data-mtk-model-guard-mismatch"), {
      name: "modelIdentityGuard",
      file,
      anchor: 'const MTKmodelGuardStyleId=',
      call: `globalThis.__MTK_PATCH_REGISTRY__?.register?.("modelIdentityGuard",{version:1,policy:"exact-task-model-and-effort-pin",mismatch:"red-selector-and-locked-composer"});`
    });
    addIf(packages, source.includes("function MTKsender(") && source.includes("messageBubbleStyle:MTKdelegatedBubbleStyle"), {
      name: "crossTaskAttribution",
      file,
      anchor: "var MTKdelegatedBubbleStyle=",
      call: source.includes("function MTKshortTaskTitle(")
        ? `globalThis.__MTK_PATCH_REGISTRY__?.register?.("crossTaskAttribution",{version:3,resolveTaskLabel(e){try{return MTKsender(e?.title,e?.projectName??MTKprojectFromCwd(e?.cwd,e?.workspaceKind))}catch{return null}}});`
        : `globalThis.__MTK_PATCH_REGISTRY__?.register?.("crossTaskAttribution",{version:1});`
    });
    addIf(packages, source.includes("function MTKrenderWaitThreads(") && source.includes("data-mtk-wait-thread-roster"), {
      name: "waitThreadRoster",
      file,
      anchor: "function MTKwaitTargets(",
      call: `globalThis.__MTK_PATCH_REGISTRY__?.register?.("waitThreadRoster",{version:1,names:"hydrated-task-titles",links:"known-tasks",colors:"optional-task-visual-palette"});`
    });
    addIf(packages, source.includes("function MTKOutboundMessageReceipt("), {
      name: "outgoingMessageReceipt",
      file,
      anchor: "function MTKoutboundArguments(",
      call: `globalThis.__MTK_PATCH_REGISTRY__?.register?.("outgoingMessageReceipt",{version:5,persistence:"acknowledged-private-task-buckets",visibility:"persistent-after-restart-and-collapse",preview:"stock-hover",messageRendering:"recipient-user-message"});`
    });
    addIf(packages, source.includes("function MTKtinrelayPointerFromMessage(") &&
      source.includes("data-mtk-tinrelay-pointer"), {
      name: "tinrelayPointerPresentation",
      file,
      anchor: "function MTKtinrelayShip(",
      call: `globalThis.__MTK_PATCH_REGISTRY__?.register?.("tinrelayPointerPresentation",{version:3,contract:"tinrelay-local-pointer-v1",disclosure:"automatic-local-inspection",rendering:"stock-safe-markdown",outgoingContinuity:"private-task-turn-anchors",shipIdentity:"runtime-message-and-observer-config"});`
    });
  }
  const names = packages.map(entry => entry.name);
  if (new Set(names).size !== names.length) throw new Error(`Active package ownership is ambiguous: ${names.join(",")}`);
  return packages;
}

function inspectState() {
  const packages = activePackages();
  const files = new Map(registryTargets(packages).map(file => [file, fs.readFileSync(file, "utf8")]));
  const appSource = files.get(appInitial);
  const bootstrapCount = count(appSource, bootstrap);
  const packageCounts = packages.map(entry => count(files.get(entry.file), entry.call));
  const knownNames = new Set(packages.map(entry => entry.name));
  const registrations = [];
  for (const file of assetFiles()) {
    const source = files.get(file) ?? fs.readFileSync(file, "utf8");
    for (const match of source.matchAll(/(?:MTKpatchRegistry\?\.register|globalThis\.__MTK_PATCH_REGISTRY__\?\.register\?\.)\("(?<name>[A-Za-z][A-Za-z0-9]*)"/g)) {
      if (!knownNames.has(match.groups.name)) throw new Error(`Orphaned patch registration ${match.groups.name} in ${path.basename(file)}`);
      registrations.push(match.groups.name);
    }
  }
  for (const entry of packages) {
    const nameCount = registrations.filter(name => name === entry.name).length;
    const exactCount = count(files.get(entry.file), entry.call);
    if (nameCount > 1 || (nameCount === 1 && exactCount !== 1)) {
      throw new Error(`Unrecognized ${entry.name} registration: names=${nameCount} exact=${exactCount}`);
    }
  }
  if (bootstrapCount === 1 && packageCounts.every(value => value === 1)) return "applied";
  if (bootstrapCount <= 1 && packageCounts.every(value => value === 0 || value === 1)) return "needs-apply";
  throw new Error(`Unrecognized registry state: bootstrap=${bootstrapCount} packages=${packageCounts.join(",")}`);
}

function applyRegistry() {
  const packages = activePackages();
  let appSource = fs.readFileSync(appInitial, "utf8");
  if (!appSource.includes(bootstrap)) {
    appSource = `${bootstrap}${appSource}`;
  }
  for (const entry of packages.filter(entry => entry.file === appInitial)) {
    if (!appSource.includes(entry.call)) {
      appSource = replaceOnce(appSource, bootstrap, `${bootstrap}${entry.call}`, `${entry.name} registration`);
    }
  }
  fs.writeFileSync(appInitial, appSource);

  for (const entry of packages.filter(entry => entry.file !== appInitial)) {
    let source = fs.readFileSync(entry.file, "utf8");
    if (!source.includes(entry.call)) {
      source = replaceOnce(source, entry.anchor, `${entry.call}${entry.anchor}`, `${entry.name} registration`);
      fs.writeFileSync(entry.file, source);
    }
  }
}

function registryTargets(packages = activePackages()) {
  return [...new Set([appInitial, ...packages.map(entry => entry.file)])];
}

function syntaxCheckChanged() {
  for (const file of registryTargets()) syntaxCheck(file);
}

function addIf(entries, condition, entry) {
  if (condition) entries.push(entry);
}

function assetFiles() {
  if (!fs.existsSync(assets) || !fs.statSync(assets).isDirectory()) {
    throw new Error(`Missing extracted assets directory: ${assets}`);
  }
  return fs.readdirSync(assets).filter(name => name.endsWith(".js")).map(name => path.join(assets, name));
}

function uniqueAsset(pattern) {
  const matches = assetFiles().filter(file => pattern.test(path.basename(file)));
  if (matches.length !== 1) throw new Error(`Upstream changed: found ${matches.length} assets matching ${pattern}`);
  return matches[0];
}

function uniqueMainAsset(pattern) {
  if (!fs.existsSync(build) || !fs.statSync(build).isDirectory()) {
    throw new Error(`Missing extracted main-process directory: ${build}`);
  }
  const matches = fs.readdirSync(build).filter(name => pattern.test(name));
  if (matches.length !== 1) throw new Error(`Upstream changed: found ${matches.length} main-process assets matching ${pattern}`);
  return path.join(build, matches[0]);
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

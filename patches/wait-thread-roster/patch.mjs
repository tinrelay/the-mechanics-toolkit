#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { linuxBuild9647, linuxBuild9771 } from "./profiles/linux.mjs";
import { build9922 } from "./profiles/build9922.mjs";
import { build10789 } from "./profiles/build10789.mjs";

const command = process.argv[2];
const root = path.resolve(process.argv[3] ?? "");
const id = "[$A-Z_a-z][$\\w]*";
const taskColorFunction = 'function MTKwaitTaskColor(e,t){try{let n=globalThis.__MTK_PATCH_REGISTRY__;if(n?.apiVersion!==1)return null;let r=n.packages?.taskVisualPalette;if(r?.version!==1||typeof r.resolveTaskColor!=="function")return null;let i=r.resolveTaskColor({taskId:e,title:t});return typeof i==="string"&&/^#[0-9A-Fa-f]{6}$/.test(i)?i.toUpperCase():null}catch{return null}}';
const taskColorFunctions = `${taskColorFunction}function MTKwaitParseHex(e){return{r:parseInt(e.slice(1,3),16),g:parseInt(e.slice(3,5),16),b:parseInt(e.slice(5,7),16)}}function MTKwaitMix(e,t,n){let r=MTKwaitParseHex(e),i=MTKwaitParseHex(t),a=e=>Math.round(e).toString(16).padStart(2,"0");return("#"+a(r.r+(i.r-r.r)*n)+a(r.g+(i.g-r.g)*n)+a(r.b+(i.b-r.b)*n)).toUpperCase()}function MTKwaitLum(e){let t=Object.values(MTKwaitParseHex(e)).map(e=>{let t=e/255;return t<=.04045?t/12.92:((t+.055)/1.055)**2.4});return.2126*t[0]+.7152*t[1]+.0722*t[2]}function MTKwaitContrast(e,t){let n=MTKwaitLum(e),r=MTKwaitLum(t);return(Math.max(n,r)+.05)/(Math.min(n,r)+.05)}function MTKwaitLabelColor(e,t){let n=t?.38:.34,r=t?"#FFFFFF":"#111318",i=t?"#101114":"#FFFFFF";for(;n<=1.001;n+=.08){let t=MTKwaitMix(e,r,Math.min(1,n));if(MTKwaitContrast(t,i)>=4.5)return t}return r}`;
const taskColorStyle = 'let n=t.color==null?void 0:{color:"light-dark("+MTKwaitLabelColor(t.color,!1)+","+MTKwaitLabelColor(t.color,!0)+")"},r=';
if (!new Set(["check", "apply"]).has(command) || !process.argv[3]) {
  throw new Error("usage: wait-thread-roster/patch.mjs check|apply EXTRACTED_ASAR_ROOT");
}

const assets = path.join(root, "webview/assets");
const target = uniqueOwner();
let source = fs.readFileSync(target, "utf8");
let state = inspectState(source);

if (command === "apply" && state === "needs-apply") {
  source = patchSource(source);
  fs.writeFileSync(target, source);
  syntaxCheck(target);
  state = inspectState(source);
  if (state !== "applied") throw new Error("wait-thread roster transform did not verify");
}

process.stdout.write(`${JSON.stringify({
  state,
  names: "hydrated-task-titles",
  links: "known-tasks",
  colors: "optional-task-visual-palette",
  targets: [path.relative(root, target)]
}, null, 2)}\n`);

function inspectState(value) {
  const markers = [
    "function MTKwaitTargets(",
    "function MTKwaitTaskLabel(",
    "function MTKwaitResolvedTarget(",
    "function MTKrenderWaitThreads(",
    "data-mtk-wait-thread-roster",
    "let r=n.packages?.crossTaskAttribution",
    "tool:`wait_threads`"
  ];
  const present = markers.map(marker => value.includes(marker));
  if (present.every(Boolean)) {
    if (count(value, "function MTKrenderWaitThreads(") !== 1 || count(value, "tool:`wait_threads`") !== 1) {
      throw new Error("Unrecognized wait-thread roster patch: renderer ownership is ambiguous");
    }
    if (!value.includes('children:MTKwaitStatusLabel})," ",...l,e.completed?null:"…"]})')) {
      throw new Error("Unrecognized wait-thread roster patch: first-target spacing is missing");
    }
    if (!value.includes('className:"cursor-pointer rounded-sm align-baseline font-medium text-text-secondary')) {
      throw new Error("Unrecognized wait-thread roster patch: link baseline or cursor is missing");
    }
    if (!value.includes(taskColorFunctions) || !value.includes(taskColorStyle)) {
      throw new Error("Unrecognized wait-thread roster patch: theme-aware label color is missing");
    }
    if (requiresDedicatedTitleSelector(value) && !value.includes("MTKwaitTitleAtom")) {
      throw new Error("Unrecognized wait-thread roster patch: live-title selector is missing");
    }
    if (resolveTaskImports(value).summaryImport && !value.includes("MTKwaitSummaryAtom")) {
      throw new Error("Unrecognized wait-thread roster patch: direct thread-summary selector is missing");
    }
    return "applied";
  }
  if (present.some(Boolean)) throw new Error("Unrecognized wait-thread roster patch: partial markers");
  inspectPristine(value);
  return "needs-apply";
}

function inspectPristine(value) {
  const profile = rendererProfile(value);
  if (value.includes("wait_threads") || value.includes("tool:`wait_threads`")) {
    throw new Error("Upstream changed: wait_threads already has renderer-local ownership");
  }
  if (!value.includes('e.tool===`read_thread`') || !value.includes('e.tool===`send_message_to_thread`')) {
    throw new Error("Upstream changed: app-control renderer tool family is incomplete");
  }
  resolveTaskImports(value);
}

function patchSource(value) {
  const profile = rendererProfile(value);
  const imports = resolveTaskImports(value);
  const helper = buildHelper(profile, imports.titleImport != null, imports.summaryImport);
  const waitEntry = `{namespace:${profile.namespace},render:MTKrenderWaitThreads,renderAgentActivityIcon:${profile.icon},tool:\`wait_threads\`}`;
  let patched = replaceOnce(value, profile.functionText, `${helper}${profile.functionText}`, "wait roster helper");
  patched = replaceOnce(patched, profile.sendEntry, `${waitEntry},${profile.sendEntry}`, "wait roster registry entry");
  patched = replaceOnce(patched, imports.before, imports.after, "wait roster task imports");
  if (imports.sharedImport != null) {
    patched = replaceOnce(patched, imports.sharedImport.before, imports.sharedImport.after,
      "wait roster shared store import");
  }
  if (imports.titleImport != null) {
    patched = replaceOnce(
      patched,
      imports.titleImport.before,
      imports.titleImport.after,
      "wait roster stock live-title selector import"
    );
  }
  return patched;
}

function buildHelper(profile, useDedicatedTitleSelector = false, useDirectSummarySelector = false) {
  let helper = String.raw`
function MTKwaitTargets(e){if(e==null||typeof e!=="object"||Array.isArray(e)||!Array.isArray(e.targets)||e.targets.length<1||e.targets.length>8)return null;let t=[];for(let n of e.targets){if(n==null||typeof n!=="object"||Array.isArray(n)||typeof n.threadId!=="string"||n.threadId.length<1||n.threadId.length>256||n.hostId!==void 0&&(typeof n.hostId!=="string"||n.hostId.length<1||n.hostId.length>256))return null;t.push({hostId:n.hostId??"local",threadId:n.threadId})}return t}function MTKwaitFallbackLabel(e){if(typeof e!=="string")return null;let t=e.trim();if(t.length===0)return null;let n=t.indexOf(" — ");return n>0?t.slice(0,n).trim():t}function MTKwaitTaskLabel(e){let t=MTKwaitFallbackLabel(e);if(t==null)return null;try{let n=globalThis.__MTK_PATCH_REGISTRY__;if(n?.apiVersion!==1)return t;let r=n.packages?.crossTaskAttribution;if(r?.version!==2||typeof r.resolveTaskLabel!=="function")return t;let i=r.resolveTaskLabel({title:e});return typeof i==="string"&&i.trim().length>0?i.trim():t}catch{return t}}function MTKwaitTaskColor(e,t){try{let n=globalThis.__MTK_PATCH_REGISTRY__;if(n?.apiVersion!==1)return null;let r=n.packages?.taskVisualPalette;if(r?.version!==1||typeof r.resolveTaskColor!=="function")return null;let i=r.resolveTaskColor({taskId:e,title:t});return typeof i==="string"&&/^#[0-9A-Fa-f]{6}$/.test(i)?i.toUpperCase():null}catch{return null}}function MTKwaitResolvedTarget(e,t){let n=t?.kind==="local"?(t.conversation?.title??t.catalogTitle??t.summary?.title):t?.kind==="remote"?t.task?.title:null;return{color:MTKwaitTaskColor(e.threadId,n),known:t!=null,label:MTKwaitTaskLabel(n)??"Task "+e.threadId.slice(0,8)+"…",target:e,title:n}}function MTKwaitNavigate(e){let t=${profile.normalize}(e);${profile.hostBridge}.dispatchHostMessage({type:"navigate-to-route",path:${profile.routeFlag}()?${profile.newRoute}(t):${profile.oldRoute}(t)})}function MTKWaitThreadRoster({item:e,variant:t,agentActivityIcon:n}){let r=MTKwaitStoreHook(MTKwaitStoreScope),i=MTKwaitTargets(e.arguments);if(i==null)return null;let a=i.map(e=>{let t=e.hostId==="local"?MTKwaitLocalThreadKey(e.threadId):MTKwaitRemoteThreadKey(e.threadId);return MTKwaitResolvedTarget(e,r.get(MTKwaitTaskAtom,t))}),MTKwaitStatusLabel=e.completed?e.success===!1?"Wait failed for":"Waited for":"Waiting for",MTKwaitSummaryMode=t==="row"&&n!==void 0,c=MTKwaitSummaryMode?"summary-text":t,l=[];for(let e=0;e<a.length;e++){let t=a[e];e>0&&l.push((0,${profile.jsx}.jsx)("span",{className:"text-text-tertiary/70",children:e===a.length-1&&a.length>2?", and ":a.length===2?" and ":", "},"separator-"+e));let n=t.color==null?void 0:{color:"color-mix(in srgb, "+t.color+" 68%, var(--color-text) 32%)"},r=t.target.hostId+":"+t.target.threadId+":"+e;l.push(t.known?(0,${profile.jsx}.jsx)("button",{"aria-label":"Open "+(t.title??t.label),className:"cursor-pointer rounded-sm align-baseline font-medium text-text-secondary hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",onClick:e=>{e.preventDefault(),e.stopPropagation(),MTKwaitNavigate(t.target.threadId)},style:n,type:"button",children:t.label},r):(0,${profile.jsx}.jsx)("span",{className:"font-medium text-text-secondary",style:n,children:t.label},r))}let u=(0,${profile.jsx}.jsxs)(${profile.container},{"data-mtk-wait-thread-roster":!0,className:${profile.classNames}("text-size-chat",c==="row"?"text-text-tertiary/90":"text-text/40 group-hover/activity-header:text-default"),children:[c==="summary-text"?null:${profile.iconFunction}(e),(0,${profile.jsx}.jsxs)("span",{className:${profile.classNames}(c!=="summary-text"&&"min-w-0"),children:[(0,${profile.jsx}.jsx)(${profile.spinner},{active:!e.completed,children:MTKwaitStatusLabel})," ",...l,e.completed?null:"…"]})]});return MTKwaitSummaryMode?(0,${profile.jsx}.jsx)(${profile.summaryWrapper},{icon:n,summary:u}):u}function MTKrenderWaitThreads(e,t,n){return(0,${profile.jsx}.jsx)(MTKWaitThreadRoster,{agentActivityIcon:n,item:e,variant:t})}
`;
  helper = replaceOnce(helper,
    'function MTKwaitTaskLabel(e){let t=MTKwaitFallbackLabel(e);if(t==null)return null;try{let n=globalThis.__MTK_PATCH_REGISTRY__;if(n?.apiVersion!==1)return t;let r=n.packages?.crossTaskAttribution;if(r?.version!==2||typeof r.resolveTaskLabel!=="function")return t;let i=r.resolveTaskLabel({title:e});return typeof i==="string"&&i.trim().length>0?i.trim():t}catch{return t}}',
    'function MTKwaitTaskLabel(e,o,s){let t=MTKwaitFallbackLabel(e);if(t==null)return null;try{let n=globalThis.__MTK_PATCH_REGISTRY__;if(n?.apiVersion!==1)return t;let r=n.packages?.crossTaskAttribution;if(r?.version!==3||typeof r.resolveTaskLabel!=="function")return t;let i=r.resolveTaskLabel({title:e,cwd:o,workspaceKind:s});return typeof i==="string"&&i.trim().length>0?i.trim():t}catch{return t}}',
    "shared wait label capability");
  helper = replaceOnce(helper,
    'label:MTKwaitTaskLabel(n)??"Task "+e.threadId.slice(0,8)+"…"',
    'label:MTKwaitTaskLabel(n,t?.kind==="local"?(t.conversation?.cwd??t.cwd??t.summary?.cwd):void 0,t?.conversation?.workspaceKind??t?.summary?.workspaceKind)??"Task "+e.threadId.slice(0,8)+"…"',
    "wait task project metadata");
  if (useDedicatedTitleSelector) {
    helper = replaceOnce(
      helper,
      'function MTKwaitResolvedTarget(e,t){let n=t?.kind==="local"?(t.conversation?.title??t.catalogTitle??t.summary?.title):t?.kind==="remote"?t.task?.title:null;return{color:MTKwaitTaskColor(e.threadId,n),known:t!=null,label:MTKwaitTaskLabel(n,t?.kind==="local"?(t.conversation?.cwd??t.cwd??t.summary?.cwd):void 0,t?.conversation?.workspaceKind??t?.summary?.workspaceKind)??"Task "+e.threadId.slice(0,8)+"…",target:e,title:n}}',
      'function MTKwaitResolvedTarget(e,t,n){let r=n??(t?.kind==="local"?(t.conversation?.title??t.catalogTitle??t.summary?.title):t?.kind==="remote"?t.task?.title:null);return{color:MTKwaitTaskColor(e.threadId,r),known:t!=null||n!=null,label:MTKwaitTaskLabel(r)??"Task "+e.threadId.slice(0,8)+"…",target:e,title:r}}',
      'function MTKwaitResolvedTarget(e,t,n){let r=n??(t?.kind==="local"?(t.conversation?.title??t.catalogTitle??t.summary?.title):t?.kind==="remote"?t.task?.title:null);return{color:MTKwaitTaskColor(e.threadId,r),known:t!=null||n!=null,label:MTKwaitTaskLabel(r,t?.kind==="local"?(t.conversation?.cwd??t.cwd??t.summary?.cwd):void 0,t?.conversation?.workspaceKind??t?.summary?.workspaceKind)??"Task "+e.threadId.slice(0,8)+"…",target:e,title:r}}',
      "wait title resolver"
    );
    helper = replaceOnce(
      helper,
      "return MTKwaitResolvedTarget(e,r.get(MTKwaitTaskAtom,t))",
      'return MTKwaitResolvedTarget(e,r.get(MTKwaitTaskAtom,t),r.get(MTKwaitTitleAtom,{hostId:e.hostId,threadId:e.threadId}))',
      "wait title lookup"
    );
  }
  if (useDirectSummarySelector) {
    helper = replaceOnce(helper,
      'function MTKwaitResolvedTarget(e,t){let n=t?.kind==="local"?(t.conversation?.title??t.catalogTitle??t.summary?.title):t?.kind==="remote"?t.task?.title:null;return{color:MTKwaitTaskColor(e.threadId,n),known:t!=null,label:MTKwaitTaskLabel(n,t?.kind==="local"?(t.conversation?.cwd??t.cwd??t.summary?.cwd):void 0,t?.conversation?.workspaceKind??t?.summary?.workspaceKind)??"Task "+e.threadId.slice(0,8)+"…",target:e,title:n}}',
      'function MTKwaitResolvedTarget(e,t,n){let r=n?.title??(t?.kind==="local"?(t.conversation?.title??t.catalogTitle??t.summary?.title):t?.kind==="remote"?t.task?.title:null),o=n?.cwd??(t?.kind==="local"?(t.conversation?.cwd??t.cwd??t.summary?.cwd):void 0);return{color:MTKwaitTaskColor(e.threadId,r),known:t!=null||n!=null,label:MTKwaitTaskLabel(r,o,t?.conversation?.workspaceKind??t?.summary?.workspaceKind)??"Task "+e.threadId.slice(0,8)+"…",target:e,title:r}}',
      "wait direct thread summary");
    helper = replaceOnce(helper,
      "return MTKwaitResolvedTarget(e,r.get(MTKwaitTaskAtom,t))",
      'return MTKwaitResolvedTarget(e,r.get(MTKwaitTaskAtom,t),r.get(MTKwaitSummaryAtom,{hostId:e.hostId,conversationId:e.threadId}))',
      "wait direct summary lookup");
  }
  const themed = helper.replace(taskColorFunction, taskColorFunctions)
    .replace('let n=t.color==null?void 0:{color:"color-mix(in srgb, "+t.color+" 68%, var(--color-text) 32%)"},r=', taskColorStyle);
  if (!themed.includes(taskColorFunctions) || !themed.includes(taskColorStyle)) {
    throw new Error("unrecognized wait roster theme-color seam");
  }
  return themed;
}

function rendererProfile(value) {
  const statusOwners = [...value.matchAll(
    /case (?<sendTool>[$A-Z_a-z][$\w]*):return e\.completed\?`threadsSendMessageCompleted`:`threadsSendMessageActive`/g
  )];
  const sendTool = statusOwners.length === 1
    ? statusOwners[0].groups.sendTool
    : importedToolConstant(value, "send_message_to_thread");
  const position = value.indexOf('e.tool===`read_thread`');
  const owner = containingFunction(value, position);
  const header = uniqueMatch(
    owner.text,
    new RegExp(`function (?<genericRender>${id})\\(${id},${id},${id},${id}=!0\\)\\{`, "g"),
    "generic app-control renderer"
  ).groups;
  const render = uniqueMatch(
    owner.text,
    new RegExp(
      `(?<node>${id})=\\(0,(?<jsx>${id})\\.jsxs\\)\\((?<container>${id}),\\{className:(?<classNames>${id})\\([\\s\\S]{0,500}?` +
        `children:\\[[^\\]]{0,120}?(?<iconFunction>${id})\\(e\\),\\(0,\\k<jsx>\\.jsx\\)\\((?<spinner>${id}),[\\s\\S]{0,700}?` +
        `return ${id}\\?\\(0,\\k<jsx>\\.jsx\\)\\((?<summaryWrapper>${id}),\\{icon:${id},summary:${id}\\}\\):${id}`,
      "g"
    ),
    "generic app-control presentation"
  ).groups;
  const navigation = uniqueMatch(
    owner.text,
    new RegExp(
      `let e=(?<normalize>${id})\\(${id}\\);(?<hostBridge>${id})\\.dispatchHostMessage\\(\\{type:\`navigate-to-route\`,path:(?<routeFlag>${id})\\(\\)\\?(?<newRoute>${id})\\(e\\):(?<oldRoute>${id})\\(e\\)\\}\\)`,
      "g"
    ),
    "existing task navigation owner"
  ).groups;
  const registry = uniqueMatch(
    value,
    new RegExp(
      `(?<sendEntry>\\{namespace:(?<namespace>${id}),(?:persistentInCollapsedConversation:!0,)?render:(?:${header.genericRender}|MTKrenderOutboundMessage),` +
        `renderAgentActivityIcon:(?<icon>${id}),(?:standaloneInConversation:!0,)?tool:${sendTool}\\})`,
      "g"
    ),
    "send-message registry entry"
  ).groups;
  return {...header, ...render, ...navigation, ...registry, sendTool, functionText: owner.text};
}

function importedToolConstant(value, toolName) {
  const imported = uniqueMatch(value, /import\{(?<specifiers>[^}]+)\}from"(?<relative>\.\/app-initial-[^"]+\.js)";/g, "app-initial tool import");
  const moduleSource = fs.readFileSync(path.resolve(path.dirname(target), imported.groups.relative), "utf8");
  const internal = uniqueMatch(
    moduleSource,
    new RegExp("(?<internal>" + id + ")=`" + escapeRegExp(toolName) + "`", "g"),
    `${toolName} constant`
  ).groups.internal;
  const exported = exportedAs(moduleSource, internal);
  return uniqueMatch(
    imported.groups.specifiers,
    new RegExp(`(?:^|,)${escapeRegExp(exported)} as (?<local>${id})(?=,|$)`, "g"),
    `${toolName} imported binding`
  ).groups.local;
}

function resolveTaskImports(ownerSource) {
  const importMatch = uniqueMatch(
    ownerSource,
    /import\{(?<specifiers>[^}]+)\}from"(?<relative>\.\/app-initial-[^"]+\.js)";/g,
    "app-initial import"
  );
  const appInitialFile = path.resolve(path.dirname(target), importMatch.groups.relative);
  if (!appInitialFile.startsWith(path.resolve(root) + path.sep)) throw new Error("App import escaped extraction root");
  const appInitial = fs.readFileSync(appInitialFile, "utf8");
  const profiles = [
    taskImportProfile(build10789.taskImports),
    taskImportProfile(build9922.taskImports),
    taskImportProfile(linuxBuild9771.taskImports),
    {
      ...taskImportProfile(linuxBuild9647.taskImports),
      platformMarker: linuxBuild9647.platformMarker
    }
  ];
  const normalizedProfiles = profiles.map(profile => Array.isArray(profile) ? taskImportProfile(profile) : profile);
  const match = normalizedProfiles.find(profile => appInitial.includes(profile.owner) &&
    appInitial.includes(profile.atom) &&
    (profile.platformMarker == null || appInitial.includes(profile.platformMarker)));
  if (match == null) throw new Error("Upstream changed: wait roster task metadata family is unknown");
  const aliases = ["MTKwaitStoreHook", "MTKwaitStoreScope", "MTKwaitTaskAtom", "MTKwaitLocalThreadKey", "MTKwaitRemoteThreadKey"];
  const additions = match.internals.map((internal, index) =>
    `${exportedAs(appInitial, internal)} as ${aliases[index + (match.sharedStore == null ? 0 : 2)]}`
  );
  if (match.summarySelector != null) {
    if (!appInitial.includes(match.summarySelector.owner)) {
      throw new Error("Upstream changed: wait direct thread-summary owner is missing");
    }
    additions.push(`${exportedAs(appInitial, match.summarySelector.internal)} as MTKwaitSummaryAtom`);
  }
  let sharedImport = null;
  if (match.sharedStore != null) {
    if (!match.sharedStore.requiredBindings.every(binding => appInitial.includes(binding))) {
      throw new Error("Upstream changed: shared store binding is not owned by the app root");
    }
    const imported = uniqueMatch(ownerSource,
      /import\{(?<specifiers>[^}]+)\}from"(?<relative>\.\/app-shared-[^"]+\.js)";/g,
      "app-shared import");
    sharedImport = {
      before: imported[0],
      after: `import{${imported.groups.specifiers},${match.sharedStore.hookExport} as ${aliases[0]},` +
        `${match.sharedStore.scopeExport} as ${aliases[1]}}from"${imported.groups.relative}";`
    };
  }
  let titleImport = null;
  if (match.titleSelector != null) {
    const imported = uniqueMatch(
      ownerSource,
      /import\{(?<specifiers>[^}]+)\}from"(?<relative>\.\/app-primary-[^"]+\.js)";/g,
      "app-primary import"
    );
    const appPrimaryFile = path.resolve(path.dirname(target), imported.groups.relative);
    if (!appPrimaryFile.startsWith(path.resolve(root) + path.sep)) throw new Error("App import escaped extraction root");
    const appPrimary = fs.readFileSync(appPrimaryFile, "utf8");
    if (!appPrimary.includes(match.titleSelector.owner) || !appPrimary.includes(match.titleSelector.helper)) {
      throw new Error("Upstream changed: live-title selector owner is not recognized");
    }
    titleImport = {
      before: imported[0],
      after: `import{${imported.groups.specifiers},${exportedAs(appPrimary, match.titleSelector.internal)} as MTKwaitTitleAtom}from"${imported.groups.relative}";`
    };
  }
  return {
    before: importMatch[0],
    after: `import{${importMatch.groups.specifiers},${additions.join(",")}}from"${importMatch.groups.relative}";`,
    sharedImport,
    titleImport,
    summaryImport: match.summarySelector != null
  };
}

function requiresDedicatedTitleSelector(ownerSource) {
  return resolveTaskImports(ownerSource).titleImport != null;
}

function taskImportProfile(profile) {
  if (!Array.isArray(profile)) return profile;
  const [owner, atom, internals] = profile;
  return {owner, atom, internals};
}

function uniqueOwner() {
  if (!fs.existsSync(assets) || !fs.statSync(assets).isDirectory()) {
    throw new Error(`Missing extracted assets directory: ${assets}`);
  }
  const matches = fs.readdirSync(assets).filter(name => {
    if (!name.endsWith(".js")) return false;
    const value = fs.readFileSync(path.join(assets, name), "utf8");
    return value.includes('e.tool===`read_thread`') && value.includes('e.tool===`send_message_to_thread`') &&
      value.includes("renderAgentActivityIcon:");
  });
  if (matches.length !== 1) throw new Error(`Upstream changed: found ${matches.length} wait roster owners`);
  return path.join(assets, matches[0]);
}

function exportedAs(sourceValue, internal) {
  const specifiers = uniqueMatch(sourceValue, /export\{(?<specifiers>[^}]+)\}/g, "module export list").groups.specifiers;
  return uniqueMatch(specifiers, new RegExp(`(?:^|,)${escapeRegExp(internal)} as (?<export>${id})(?=,|$)`, "g"), `export for ${internal}`).groups.export;
}

function containingFunction(value, position) {
  let start = value.lastIndexOf("function ", position);
  while (start >= 0) {
    const candidate = functionAt(value, start);
    if (position < candidate.end) return candidate;
    start = value.lastIndexOf("function ", start - 1);
  }
  throw new Error("Could not locate containing function");
}

function functionAt(value, start) {
  if (start < 0 || !value.startsWith("function ", start)) throw new Error("Function start is missing");
  const open = value.indexOf("{", start);
  let quote = null, escaped = false, depth = 1;
  for (let index = open + 1; index < value.length; index += 1) {
    const character = value[index];
    if (quote != null) {
      if (escaped) escaped = false;
      else if (character === "\\") escaped = true;
      else if (character === quote) quote = null;
      continue;
    }
    if (character === "'" || character === '"' || character === "`") quote = character;
    else if (character === "{") depth += 1;
    else if (character === "}" && --depth === 0) return {start, end: index + 1, text: value.slice(start, index + 1)};
  }
  throw new Error("Function did not terminate");
}

function uniqueMatch(value, pattern, label) {
  const regex = pattern.global ? pattern : new RegExp(pattern.source, pattern.flags + "g");
  const matches = [...value.matchAll(regex)];
  if (matches.length !== 1) throw new Error(`Upstream changed: found ${matches.length} matches for ${label}`);
  return matches[0];
}

function replaceOnce(value, before, after, label) {
  const first = value.indexOf(before);
  if (first < 0 || value.indexOf(before, first + before.length) >= 0) {
    throw new Error(`Upstream changed: ${label} is not unique`);
  }
  return value.slice(0, first) + after + value.slice(first + before.length);
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

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function count(value, needle) {
  return value.split(needle).length - 1;
}

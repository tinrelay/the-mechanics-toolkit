#!/usr/bin/env node
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { linuxBuild9771, linuxBuild10954 } from "../patches/cross-task-attribution/profiles/linux.mjs";

const root = path.resolve(process.argv[2] ?? "");
if (!process.argv[2]) throw new Error("usage: cross-task-attribution.test.mjs EXTRACTED_ASAR_ROOT");

const assets = path.join(root, "webview/assets");
const owners = fs.readdirSync(assets).filter(name => {
  if (!name.endsWith(".js")) return false;
  const source = fs.readFileSync(path.join(assets, name), "utf8");
  return source.includes("localConversation.codexDelegationUserMessage.app") &&
    source.includes("function MTKsender(");
});
assert.equal(owners.length, 1, "unique patched cross-task attribution owner");
const ownerPath = path.join(assets, owners[0]);
const source = fs.readFileSync(ownerPath, "utf8");
const nativeAligned = source.includes("function Lx(e){") &&
  source.includes('alignment:`end`,accentColor:MTKdelegatedAccentColor');
const externalBubbleImport = source.match(
  /import\{[^}]*\bt as [$A-Z_a-z][$\w]*[^}]*\}from"(?<relative>\.\/user-message-[^"]+\.js)";/
);
const completeSource = externalBubbleImport?.groups?.relative == null
  ? source
  : source + fs.readFileSync(path.resolve(path.dirname(ownerPath), externalBubbleImport.groups.relative), "utf8");

const helperStart = source.indexOf("var MTKdelegatedBubbleStyle=");
const helperTail = source.slice(helperStart);
const componentBoundary = helperTail.match(/function [$A-Z_a-z][$\w]*\(e\)\{let t=/);
assert.ok(helperStart >= 0 && componentBoundary, "attribution helper seam");
const bindingStart = helperTail.indexOf("const MTKcrossTaskStoreHook=");
const sharedStoreImported = source.includes("LX as MTKcrossTaskStoreHook,ZI as MTKcrossTaskStoreScope") ||
  source.includes("PX as MTKcrossTaskStoreHook,XI as MTKcrossTaskStoreScope") ||
  source.includes("cUt as MTKcrossTaskStoreHook,tSt as MTKcrossTaskStoreScope") ||
  source.includes("A5t as MTKcrossTaskStoreHook,dJt as MTKcrossTaskStoreScope");
assert.ok((bindingStart >= 0 && bindingStart < componentBoundary.index) || sharedStoreImported,
  "stock store bindings are captured outside the component");
const helperEnd = [bindingStart, componentBoundary.index,
  helperTail.indexOf("globalThis.__MTK_PATCH_REGISTRY__"),
  helperTail.indexOf("function MTKtinrelayShip(")].filter(index => index >= 0);
const helper = helperTail.slice(0, Math.min(...helperEnd));
const api = Function(`${helper};return {MTKsender,MTKsenderFromSource,MTKshortTaskTitle,MTKprojectFromCwd,MTKdelegatedBubbleStyle}`)();

assert.equal(api.MTKshortTaskTitle("Bridge Keeper — Coordination"), "Bridge Keeper");
assert.equal(api.MTKshortTaskTitle("documentation-research"), "documentation-research");
assert.equal(api.MTKsender("Bridge Keeper — Coordination", "Example Ship"), "Bridge Keeper");
assert.equal(api.MTKsender("Index repair", "Archive Engine"), "Archive Engine/Index repair");
assert.equal(api.MTKsender("ticket-inbox", api.MTKprojectFromCwd("/Users/mike/LocalProjects/ganglion")), "ganglion/ticket-inbox");
assert.equal(api.MTKsender("Ganglion runner and senses", api.MTKprojectFromCwd("/Users/mike/LocalProjects/ganglion")), "ganglion/Ganglion runner and senses");
assert.equal(api.MTKsenderFromSource("cc-search implementation agent", {
  kind: "local", cwd: "/Users/mike/LocalProjects/quarkable-search"
}), "quarkable-search/cc-search implementation agent", "incoming attribution uses the sender task project");
assert.equal(api.MTKsenderFromSource("cc-search implementation agent", null),
  "cc-search implementation agent", "missing sender project never borrows the receiving project");
assert.equal(api.MTKprojectFromCwd("/Users/mike/LocalProjects/ganglion", "projectless"), null);
assert.equal(api.MTKsender("Index repair", null), "Index repair", "plain task title survives without project metadata");
assert.equal(api.MTKsender(null, "Archive Engine"), null, "missing task metadata retains generic attribution");
globalThis.__MTK_DOT_POLICY__={nameForThread(id,title){return id==="example-dot-thread"?title:null}};
assert.equal(api.MTKsender("Example Dot","Receiving Project","example-dot-thread"),"Example Dot",
  "an identified dot uses its native name rather than the viewing project");
assert.equal(api.MTKsenderFromSource("Example Dot",{kind:"local",cwd:"/projects/receiving"},"example-dot-thread"),"Example Dot");
assert.equal(api.MTKsender("Example Dot","Receiving Project","ordinary-thread"),"Receiving Project/Example Dot",
  "a matching title alone does not turn a task into a dot");
delete globalThis.__MTK_DOT_POLICY__;
assert.ok(api.MTKdelegatedBubbleStyle.backgroundColor.includes("interactive-bg-accent-muted-context"),
  "unmapped delegation keeps the existing semantic accent fallback");

const capturedStore = sharedStoreImported ? null : uniqueMatch(source,
  /const MTKcrossTaskStoreHook=(?<store>[$A-Z_a-z][$\w]*),MTKcrossTaskStoreScope=(?<scope>[$A-Z_a-z][$\w]*);/g,
  "component-external renderer store bindings").groups;
const titleImport = uniqueMatch(
  source,
  /import\{(?<specifiers>[^}]*MTKtitleAtom[^}]*)\}from"(?<relative>\.\/app-(?:primary|initial)-[^"]+\.js)";/g,
  "title atom import"
).groups;
const titleOwner = fs.readFileSync(path.resolve(path.dirname(ownerPath), titleImport.relative), "utf8");
const titleExport = importedExport(titleImport.specifiers, "MTKtitleAtom");
const titleInternal = exportedInternal(titleOwner, titleExport);
const linuxSelector = linuxBuild9771.titleSelector;
if (titleInternal === linuxBuild10954.titleSelector.atom &&
    titleOwner.includes(linuxBuild10954.titleSelector.atomOwner)) {
  assert.ok(titleOwner.includes(linuxBuild10954.titleSelector.helperOwner),
    "Linux build-10954 title atom retains its stock selector owner");
} else if (titleInternal === linuxSelector.atom && titleOwner.includes(linuxSelector.atomOwner)) {
  assert.ok(titleOwner.includes(linuxSelector.helperOwner),
    "Linux build-9771 title atom retains its stock selector owner");
} else if (titleInternal === "uyc" && titleOwner.includes("uyc=uf($,")) {
  assert.ok(titleOwner.includes("cyc({...n,localTitle:r})"),
    "build-9922 title atom retains its stock selector owner");
} else if (titleInternal === "yBs" && titleOwner.includes("yBs=ns(X,")) {
  assert.ok(titleOwner.includes("_Bs({...n,localTitle:r})"),
    "build-10789 title atom retains its stock selector owner");
} else if (titleInternal === "l2i" && titleOwner.includes("l2i=to(Q,")) {
  assert.ok(titleOwner.includes("s2i({...n,localTitle:r})"),
    "build-11645 title atom retains its stock selector owner");
} else if (titleInternal === "Hbo" && titleOwner.includes("Hbo=fl(Z,")) {
  assert.ok(titleOwner.includes("Bbo({...r,localTitle:i})"),
    "build-12404 title atom retains its stock selector owner");
} else assert.fail("title atom is not owned by a current qualified profile");
assert.ok(titleOwner.includes("hasConversation") && titleOwner.includes("liveTitle") &&
  (titleOwner.includes("localTitle:r") || titleOwner.includes("localTitle:i")),
"title selector retains its stock task metadata");

const metadata = uniqueMatch(
  source,
  /MTKstore=(?<store>[$A-Z_a-z][$\w]*)\((?<scope>[$A-Z_a-z][$\w]*)\),MTKtitle=MTKstore\.get\(MTKtitleAtom,\{hostId:/g,
  "renderer-store title lookup"
).groups;
assert.equal(metadata.store, "MTKcrossTaskStoreHook", "component uses the collision-proof store binding");
assert.equal(metadata.scope, "MTKcrossTaskStoreScope", "component uses the collision-proof scope binding");
assert.ok(source.includes("MTKstore.get(MTKsourceTaskAtom,MTKsourceLocalKey(r))"),
  "incoming attribution looks up the source task by sourceThreadId");
assert.ok(source.includes("MTKsenderFromSource(MTKtitle,MTKsourceTask,r)"),
  "incoming attribution uses the source task's project-qualified label");
const initialImport = uniqueMatch(
  source,
  /import\{(?<specifiers>[^}]+)\}from"(?<relative>\.\/app-initial-[^"]+\.js)";/g,
  "app-initial import"
).groups;
const appInitial = fs.readFileSync(path.resolve(path.dirname(ownerPath), initialImport.relative), "utf8");
if (sharedStoreImported) {
  assert.ok(appInitial.includes("LX as jr") && appInitial.includes("ZI as X") && appInitial.includes("t=jr(X)") ||
    appInitial.includes("PX as Qr") && appInitial.includes("XI as X") && appInitial.includes("t=Qr(X)") ||
    appInitial.includes("cUt as Jl") && appInitial.includes("tSt as Q") && appInitial.includes("t=Jl(Q)") ||
    appInitial.includes("A5t as Fe") && appInitial.includes("dJt as Z") && appInitial.includes("t=Fe(Z)"),
  "metadata uses the qualified shared stock store and scope");
} else {
  const storeInternal = exportedInternal(appInitial, importedExport(initialImport.specifiers, capturedStore.store));
  const scopeInternal = exportedInternal(appInitial, importedExport(initialImport.specifiers, capturedStore.scope));
  const storeFunction = functionSource(appInitial, storeInternal);
  assert.ok(storeFunction.includes(".useContext") && storeFunction.includes(".useRef") &&
    storeFunction.includes("get queryClient"), "metadata uses the stock renderer store hook");
  assert.equal(scopeInternal, "$", "metadata uses the stock renderer store scope");
}

for (const contract of [
  "MTKstore.get(MTKtitleAtom,{hostId:",
  "defaultMessage:`Sent by {appName} from another task`",
  '"data-mtk-palette-attribution-name":!0'
]) assert.equal(count(completeSource, contract), 1, `attribution contract: ${contract}`);
if (nativeAligned) {
  assert.equal(count(source, 'alignment:`end`,accentColor:MTKdelegatedAccentColor'), 1,
    "delegated message uses native right alignment, constrained width, and accent");
  assert.ok(source.includes("function bv(e){let t=(0,xv.c)(") &&
    source.includes("g=f===`start`?`items-start`:`items-end`"),
  "native wrapper aligns both label and bubble");
  assert.ok(source.includes("_g,{alignment:f,accentColor:i,message:o"),
    "native user-message bubble receives alignment and accent");
} else {
  for (const contract of ["messageBubbleStyle:MTKdelegatedBubbleStyle",
    '"data-user-message-bubble":!0,style:MTKbubbleStyleOverride']) {
    assert.equal(count(completeSource, contract), 1, `attribution contract: ${contract}`);
  }
}
assert.ok(!source.includes("MTKselectorStateInit") && !source.includes("MTKstoreStateInit") &&
  !source.includes("MTKtaskStateInit") && !source.includes("MTKprojectStateInit") &&
  !source.includes("zm(MTKtaskAtom"), "attribution imports no private selector hook or injected initializer");
assert.ok(source.includes("onLabelClick:"), "source-task click-through remains present");

process.stdout.write(`${JSON.stringify({
  state: "green",
  labels: ["Name", "Project/Task title", "generic fallback"],
  metadata: "stock-renderer-store-title-atom",
  clickThroughPreserved: true,
  delegatedBubbleOnly: true,
  privateSelectorHookImported: false
}, null, 2)}\n`);

function importedExport(specifiers, local) {
  return uniqueMatch(
    specifiers,
    new RegExp(`(?:^|,)(?<export>[$A-Z_a-z][$\\w]*) as ${escapeRegExp(local)}(?=,|$)`, "g"),
    `import for ${local}`
  ).groups.export;
}

function exportedInternal(sourceText, exported) {
  const specifiers = uniqueMatch(sourceText, /export\{(?<specifiers>[^}]+)\}/g, "module export list").groups.specifiers;
  return uniqueMatch(
    specifiers,
    new RegExp(`(?:^|,)(?<internal>[$A-Z_a-z][$\\w]*) as ${escapeRegExp(exported)}(?=,|$)`, "g"),
    `export ${exported}`
  ).groups.internal;
}

function functionSource(sourceText, name) {
  const start = sourceText.indexOf(`function ${name}(`);
  assert.ok(start >= 0, `function ${name}`);
  const next = sourceText.indexOf("function ", start + name.length + 10);
  return sourceText.slice(start, next < 0 ? sourceText.length : next);
}

function uniqueMatch(text, pattern, label) {
  const matches = [...text.matchAll(pattern)];
  assert.equal(matches.length, 1, label);
  return matches[0];
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function count(haystack, needle) {
  return haystack.split(needle).length - 1;
}

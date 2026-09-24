#!/usr/bin/env node
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const extractedRoot = path.resolve(process.argv[2] ?? "");
if (!process.argv[2]) throw new Error("usage: task-visual-palette.test.mjs EXTRACTED_ASAR_ROOT");
const assets = path.join(extractedRoot, "webview/assets");
const assetNames = fs.readdirSync(assets);
const appInitial = uniqueAsset(/^app-initial-.*\.js$/);
const localPage = uniqueAsset(/^local-conversation-page-.*\.js$/, '"data-mtk-palette-room-host":!0');
const delegation = uniqueAsset(/^(?:subagent-activity-chip-group|conversation-blocks)-.*\.js$/);
const source = readAsset(appInitial);
if (source.includes("function pWs(e){let MTKsidebarArchiveEpoch=")) {
  assert.equal(count(source, "function MTKuseSidebarArchivePolicy("), 1,
    "build-10789 mounted archive rows have their subscription hook");
}
const rosterConsumer = source.includes("const MTKpaletteRosterConsumer=1");
const helperStart = source.indexOf("const MTKpaletteRelativePath=");
const rootProfiles = [
  {start: "function PYs(){", owner: "let e=(0,LYs.c)(12),"},
  {start: "function Bzc(){", owner: "let e=(0,Uzc.c)(12),"},
  {start: "function xyl(){", owner: "let e=(0,wyl.c)(12),"},
  {start: "function Vvl(){", owner: "let e=(0,Wvl.c)(12),"}
].map(profile => {
  const index = source.indexOf(profile.start, helperStart);
  const ownerIndex = index < 0 ? -1 : source.indexOf(profile.owner, index + profile.start.length);
  const nextFunction = index < 0 ? -1 : source.indexOf("function ", index + profile.start.length);
  return {...profile, index, ownerIndex, nextFunction};
}).filter(profile => profile.index >= 0 && profile.ownerIndex >= 0 &&
  (profile.nextFunction < 0 || profile.ownerIndex < profile.nextFunction));
assert.equal(rootProfiles.length, 1, "unique qualified application root");
const rootBoundary = rootProfiles[0].index;
const rootOwnerEnd = rootProfiles[0].ownerIndex;
assert.ok(rootOwnerEnd > rootBoundary, "qualified application root owner");
const rootBootstrap = source.slice(rootBoundary, rootOwnerEnd);
assert.equal(count(rootBootstrap, "MTKuseAgentRoster();"), 1, "agent roster bootstrap is composed once");
assert.equal(count(rootBootstrap, "MTKusePaletteBootstrap();"), 1, "palette bootstrap is composed once");
assert.ok(rootBootstrap.indexOf("MTKuseAgentRoster();") < rootBootstrap.indexOf("MTKusePaletteBootstrap();"),
  "agent roster initializes before its palette consumer");
const attentionBoundaries = [
  source.indexOf('const MTKattentionRelativePath=', helperStart),
  source.indexOf("const MTKattentionRosterBridge=1", helperStart)
].filter(index => index >= 0);
const attentionBoundary = attentionBoundaries.length === 0 ? -1 : Math.min(...attentionBoundaries);
const helperEnd = attentionBoundary >= 0 && attentionBoundary < rootBoundary ? attentionBoundary : rootBoundary;
assert.ok(helperStart >= 0 && helperEnd > helperStart, "palette helper seam");
const helper = source.slice(helperStart, helperEnd);
assert.equal(rosterConsumer, true, "palette uses the shared agent roster");
await testRosterConsumer(helper, source);
process.stdout.write("task visual palette roster behavioral probe passed\n");
function uniqueAsset(pattern, marker = null) {
  const matches = assetNames.filter(name => pattern.test(name) &&
    (marker == null || readAsset(name).includes(marker)));
  assert.equal(matches.length, 1, `unique asset ${pattern}`);
  return matches[0];
}

async function testRosterConsumer(helperSource, appSource) {
  const exactId = "11111111-1111-4111-8111-111111111111";
  const titleRule = Object.freeze({
    key: "temporary-tamsin-color",
    kind: "task",
    ownerRoot: "/ship",
    taskId: null,
    pattern: /^Tamsin/,
    data: Object.freeze({titlePattern: "^Tamsin", color: "#CC0000"})
  });
  const exactAgent = Object.freeze({
    key: "tamsin",
    kind: "agent",
    ownerRoot: "/office",
    taskId: exactId,
    pattern: /^Tamsin(?:\s+—\s+.+)?$/,
    data: Object.freeze({name: "Tamsin", taskId: exactId, color: "#55AA77", mark: ".codex/marks/tamsin.svg", protectSidebarArchive: true})
  });
  const snapshot = Object.freeze({
    sources: Object.freeze([{ownerRoot: "/office", data: Object.freeze({calibration: {sidebar: 20}})}]),
    entries: Object.freeze([titleRule, exactAgent])
  });
  const diagnostics = [];
  const realm = {
    __MTK_AGENT_ROSTER__: {
      current: () => snapshot,
      readAsset: async entry => entry === exactAgent ? Buffer.from("<svg/>").toString("base64") : null,
      subscribe: () => () => {},
      diagnose: (code, detail) => { diagnostics.push({code, detail}); return null; }
    }
  };
  const api = Function("globalThis", `${helperSource};return {load:MTKloadPalette,match:MTKmatchPalette,archive:MTKsidebarArchiveProtected}`)(realm);
  const loaded = await api.load();
  assert.ok(loaded, "roster visual entries load");
  assert.equal(loaded.rules.length, 2);
  assert.equal(api.match(loaded, "Tamsin — Portfolio Secretary", exactId).color, "#55AA77",
    "exact task identity wins over an earlier matching title rule");
  assert.equal(api.match(loaded, "Tamsin — Temporary", "unrelated").color, "#CC0000",
    "title-only visual rules remain available for ordinary tasks");
  assert.equal(api.archive(exactId, loaded), true, "exact roster identity can protect archive");
  assert.equal(api.archive(`local:${exactId}`, loaded), true,
    "stock local sidebar identity can protect archive");
  assert.equal(api.archive(`remote:${exactId}`, loaded), false,
    "other task-key envelopes cannot protect archive");
  assert.equal(api.archive("Tamsin — Portfolio Secretary", loaded), false,
    "matching names alone cannot protect archive");
  assert.match(api.match(loaded, "Tamsin", exactId).markDataUrl, /^data:image\/svg\+xml;base64,/,
    "mark bytes resolve through the roster owner");
  assert.deepEqual(diagnostics, []);
  assert.ok(appSource.includes("MTKuseAgentRoster();MTKusePaletteBootstrap();"),
    "palette bootstrap follows roster bootstrap");
  for (const contract of [
    "data-mtk-palette-room-host",
    "data-mtk-palette-delegation",
    "data-mtk-palette-sidebar-context",
    "--mtk-sidebar-chip",
    "MTKapplyPaletteSurfaces",
    "MTKclearPaletteSurfaces"
  ]) assert.ok(appSource.includes(contract), `roster palette surface contract: ${contract}`);
}

function readAsset(name) {
  return fs.readFileSync(path.join(assets, name), "utf8");
}

function element(attributes = {}, children = []) {
  const values = new Map(Object.entries(attributes));
  const properties = new Map();
  const entry = {
    nodeType: 1,
    parentElement: null,
    attributes: values,
    children,
    style: {
      setProperty(name, value) { properties.set(name, value); },
      removeProperty(name) { properties.delete(name); },
      get(name) { return properties.get(name); },
      has(name) { return properties.has(name); }
    },
    getAttribute(name) { return values.get(name) ?? null; },
    setAttribute(name, value) { values.set(name, String(value)); },
    removeAttribute(name) { values.delete(name); },
    matches(selector) { return selectorAttributes(selector).some(name => values.has(name)); },
    closest(selector) {
      for (let current = this; current != null; current = current.parentElement) {
        if (current.matches?.(selector)) return current;
      }
      return null;
    },
    querySelector(selector) {
      for (const child of children) {
        if (child.matches?.(selector)) return child;
        const nested = child.querySelector?.(selector);
        if (nested) return nested;
      }
      return null;
    }
  };
  for (const child of children) child.parentElement = entry;
  return entry;
}

function mutation(type, overrides = {}) {
  return { type, addedNodes: [], removedNodes: [], ...overrides };
}

function selectorAttributes(selector) {
  return [...selector.matchAll(/\[([^\]=]+)/g)].map(match => match[1]);
}

function has(name) {
  return entry => entry.attributes.has(name);
}

function count(haystack, needle) {
  return haystack.split(needle).length - 1;
}

function contrast(first, second) {
  const a = luminance(first);
  const b = luminance(second);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

function luminance(hex) {
  const channels = [1, 3, 5].map(index => parseInt(hex.slice(index, index + 2), 16) / 255);
  const linear = channels.map(value => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

function directory(target) {
  files.set(target, { metadata: { isDirectory: true, isFile: false, isSymlink: false }, contents: "" });
}

function file(target, contents) {
  files.set(target, { metadata: { isDirectory: false, isFile: true, isSymlink: false }, contents });
}

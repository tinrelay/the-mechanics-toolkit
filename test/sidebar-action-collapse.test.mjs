#!/usr/bin/env node
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { linuxBuild9647 } from "../patches/sidebar-action-collapse/profiles/linux.mjs";

const root = path.resolve(process.argv[2] ?? "");
if (!process.argv[2]) throw new Error("usage: sidebar-action-collapse.test.mjs EXTRACTED_ASAR_ROOT");

const assets = path.join(root, "webview/assets");
const matches = fs.readdirSync(assets).filter(name => name.endsWith(".js") &&
  fs.readFileSync(path.join(assets, name), "utf8").includes('const MTK_SIDEBAR_ACTIONS_STORAGE_KEY='));
assert.equal(matches.length, 1, "unique sidebar-collapse owner");
const source = fs.readFileSync(path.join(assets, matches[0]), "utf8");
const helperStart = source.indexOf('const MTK_SIDEBAR_ACTIONS_STORAGE_KEY=');
const helperEnd = source.indexOf("function KKn(e){", helperStart);
assert.ok(helperStart >= 0 && helperEnd > helperStart, "sidebar helper seam");
const rawHelper = source.slice(helperStart, helperEnd);
const linux = rawHelper.includes(`function MTKuseSidebarActionCollapse${linuxBuild9647.suffix}(`);
const generic = rawHelper.includes("function MTKuseSidebarActionCollapse9647(");
assert.notEqual(linux, generic, "exactly one current build-9647 sidebar profile");

const suffix = linux ? linuxBuild9647.suffix : "9647";
const reactOwner = linux ? linuxBuild9647.react : "X0";
const jsxOwner = linux ? linuxBuild9647.jsx : "Z0";
const intlOwner = linux ? linuxBuild9647.intl : "ch";
assert.ok(rawHelper.includes(`(0,${reactOwner}.useState)(MTKreadSidebarActionsCollapsed${suffix})`),
  "state hook uses the current sidebar owner's React namespace");
assert.ok(rawHelper.includes(`${reactOwner}.useEffect(`) && rawHelper.includes(`${reactOwner}.useCallback(`),
  "effects and callbacks use the current sidebar owner's React namespace");

const helper = rawHelper
  .replaceAll(suffix, "")
  .replaceAll(`(0,${reactOwner}.useState)`, "(0,React.useState)")
  .replaceAll(`${reactOwner}.useEffect`, "React.useEffect")
  .replaceAll(`${reactOwner}.useCallback`, "React.useCallback")
  .replaceAll(`(0,${jsxOwner}.jsx)`, "(0,JSX.jsx)")
  .replaceAll(`${intlOwner}()`, "useIntl()");

const storage = new Map();
let state;
let storageListener;
const localStorage = {
  getItem: key => storage.get(key) ?? null,
  setItem: (key, value) => storage.set(key, value)
};
const React = {
  useState(initializer) {
    state ??= initializer();
    return [state, update => { state = typeof update === "function" ? update(state) : update; }];
  },
  useEffect(callback) { return callback(); },
  useCallback(callback) { return callback; }
};
const JSX = {jsx: (component, props) => ({component, props})};
const api = Function(
  "React", "localStorage", "addEventListener", "removeEventListener", "useIntl", "JSX",
  `${helper};return {MTKreadSidebarActionsCollapsed,MTKuseSidebarActionCollapse,MTKsidebarActionDisclosure,MTKsidebarCollapsedDestinations}`
)(
  React,
  localStorage,
  (type, listener) => { assert.equal(type, "storage"); storageListener = listener; },
  () => {},
  () => ({formatMessage: message => message.defaultMessage}),
  JSX
);

assert.equal(api.MTKreadSidebarActionsCollapsed(), false, "first use defaults expanded");
let [collapsed, toggle] = api.MTKuseSidebarActionCollapse();
assert.equal(collapsed, false);
toggle();
assert.equal(storage.get("the-mechanics-toolkit:sidebar-global-actions-collapsed:v1"), "1");
[collapsed, toggle] = api.MTKuseSidebarActionCollapse();
assert.equal(collapsed, true);
storage.set("the-mechanics-toolkit:sidebar-global-actions-collapsed:v1", "0");
storageListener({key: "the-mechanics-toolkit:sidebar-global-actions-collapsed:v1"});
[collapsed] = api.MTKuseSidebarActionCollapse();
assert.equal(collapsed, false, "another-window storage event updates renderer state");

const collapsedDisclosure = api.MTKsidebarActionDisclosure({collapsed: true, onToggle: toggle});
assert.equal(collapsedDisclosure.component, "button");
assert.equal(collapsedDisclosure.props.title, "Show navigation actions");
assert.equal(collapsedDisclosure.props["aria-expanded"], false);
assert.equal(collapsedDisclosure.props["aria-label"], "Show navigation actions");
assert.ok(collapsedDisclosure.props.className.includes("cursor-pointer"));
assert.equal(collapsedDisclosure.props.children.component, "svg");
assert.equal(collapsedDisclosure.props.children.props.children.component, "path");
assert.equal(collapsedDisclosure.props.children.props.children.props.stroke, "currentColor");
assert.equal(collapsedDisclosure.props.children.props.className.includes("rotate-90"), false);

const expandedDisclosure = api.MTKsidebarActionDisclosure({collapsed: false, onToggle: toggle});
assert.equal(expandedDisclosure.props["aria-expanded"], true);
assert.equal(expandedDisclosure.props["aria-label"], "Hide navigation actions");
assert.equal(expandedDisclosure.props.children.props.className.includes("rotate-90"), true);

const destinations = [
  {id: "projects"},
  {id: "pull-requests"},
  {id: "scheduled"},
  {id: "plugins"},
  {id: "explore"}
];
assert.strictEqual(api.MTKsidebarCollapsedDestinations(false, destinations, "projects"), destinations);
assert.deepEqual(api.MTKsidebarCollapsedDestinations(true, destinations, "projects"), [{id: "projects"}]);

for (const label of ["New chat", "Pull requests", "Sites", "Scheduled", "Plugins", "Projects"]) {
  assert.ok(source.includes(`defaultMessage:\`${label}\``), `stock Codex-mode label remains: ${label}`);
}
assert.equal(count(source, `function MTKuseSidebarActionCollapse${suffix}(`), 1);
assert.equal(count(source, `function MTKsidebarActionDisclosure${suffix}(`), 1);
if (linux) {
  for (const marker of linuxBuild9647.applied) {
    assert.ok(source.includes(marker), `Linux build-9647 sidebar contract: ${marker}`);
  }
} else {
  assert.ok(source.includes("ge=MTKsidebarCollapsedDestinations9647(MTKsidebarActionsCollapsed,ge,IT.projects);let _e=ge.length>0"));
  assert.ok(source.includes("MTKsidebarActionsCollapsed?null:(0,Z0.jsx)(ACn,"));
  assert.ok(source.includes("(0,Z0.jsx)(MTKsidebarActionDisclosure9647,{collapsed:MTKsidebarActionsCollapsed,onToggle:MTKtoggleSidebarActions})"));
  assert.ok(source.includes("t[133]!==MTKsidebarActionsCollapsed") && source.includes("t[133]=MTKsidebarActionsCollapsed"));
}

process.stdout.write(`${JSON.stringify({
  state: "green",
  surface: "codex-sidebar",
  firstRun: "expanded",
  persistence: "renderer-localStorage-with-cross-window-storage-event",
  collapsedRows: ["New chat", "Pull requests", "Sites", "Scheduled", "Plugins"],
  projectsPreserved: true,
  disclosure: "native-button-with-owned-inline-svg-tooltip-and-aria-expanded"
}, null, 2)}\n`);

function count(haystack, needle) {
  return haystack.split(needle).length - 1;
}

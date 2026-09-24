#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { build9922 } from "./profiles/build9922.mjs";
import { build10789 } from "./profiles/build10789.mjs";
import { linuxBuild9647, linuxBuild9771 } from "./profiles/linux.mjs";

const command = process.argv[2];
const linuxProfiles = [linuxBuild9771, linuxBuild9647];
const root = path.resolve(process.argv[3] ?? "");
if (!new Set(["check", "apply"]).has(command) || !process.argv[3]) {
  throw new Error("usage: sidebar-action-collapse.mjs check|apply EXTRACTED_ASAR_ROOT");
}

const assets = path.join(root, "webview/assets");
const target = uniqueOwnershipAsset();
let source = fs.readFileSync(target, "utf8");
let state = inspectState(source);

if (command === "apply" && state === "needs-apply") {
  source = patchSource(source);
  fs.writeFileSync(target, source);
  syntaxCheck(target);
  state = inspectState(source);
  if (state !== "applied") throw new Error("sidebar action collapse transform did not verify");
}

process.stdout.write(`${JSON.stringify({
  state,
  storageKey: "the-mechanics-toolkit:sidebar-global-actions-collapsed:v1",
  target: path.relative(root, target)
}, null, 2)}\n`);

function inspectState(value) {
  const genericMarkers = [
    'const MTK_SIDEBAR_ACTIONS_STORAGE_KEY="the-mechanics-toolkit:sidebar-global-actions-collapsed:v1"',
    "function MTKuseSidebarActionCollapse9647()",
    "function MTKsidebarActionDisclosure9647(",
    "function MTKsidebarCollapsedDestinations9647(",
    'className:"flex size-8 items-center justify-center rounded-md text-secondary hover:bg-tertiary hover:text-primary cursor-pointer"',
    "function KKn(e){let t=(0,XKn.c)(134),",
    "[MTKsidebarActionsCollapsed,MTKtoggleSidebarActions]=MTKuseSidebarActionCollapse9647()",
    "ge=MTKsidebarCollapsedDestinations9647(MTKsidebarActionsCollapsed,ge,IT.projects);let _e=ge.length>0",
    "MTKsidebarActionsCollapsed?null:(0,Z0.jsx)(ACn,",
    '!T&&le===`header_icon`?(0,Z0.jsx)(UCn,{sidebarMode:X}):null,(0,Z0.jsx)(MTKsidebarActionDisclosure9647,{collapsed:MTKsidebarActionsCollapsed,onToggle:MTKtoggleSidebarActions})]})',
    "t[133]!==MTKsidebarActionsCollapsed",
    "t[133]=MTKsidebarActionsCollapsed,t[92]=Ne"
  ];
  const linuxMarkerSets = linuxProfiles.map(appliedMarkers);
  const build9922Markers = appliedMarkers(build9922);
  const build10789Markers = appliedMarkers(build10789);
  const genericPresent = genericMarkers.map(marker => value.includes(marker));
  const linuxPresent = linuxMarkerSets.map(markers => markers.map(marker => value.includes(marker)));
  const build9922Present = build9922Markers.map(marker => value.includes(marker));
  const build10789Present = build10789Markers.map(marker => value.includes(marker));
  if (genericPresent.every(Boolean)) return "applied";
  if (linuxPresent.some(markers => markers.every(Boolean))) return "applied";
  if (build9922Present.every(Boolean)) return "applied";
  if (build10789Present.every(Boolean)) return "applied";
  if (genericPresent.some(Boolean) || linuxPresent.some(markers => markers.some(Boolean)) ||
      build9922Present.some(Boolean) || build10789Present.some(Boolean)) {
    throw new Error("Unrecognized build-9647 sidebar collapse patch: partial markers");
  }
  const genericPristine = current9647Contracts().every(contract => value.includes(contract));
  const linuxPristine = linuxProfiles.filter(profile =>
    contracts(profile).every(contract => value.includes(contract)));
  const build9922Pristine = contracts(build9922).every(contract => value.includes(contract));
  const build10789Pristine = contracts(build10789).every(contract => value.includes(contract));
  const profileCount = Number(genericPristine) + linuxPristine.length + Number(build9922Pristine) + Number(build10789Pristine);
  if (profileCount !== 1) {
    throw new Error(`Upstream changed: found ${profileCount} sidebar ownership profiles`);
  }
  return "needs-apply";
}

function patchSource(value) {
  if (current9647Contracts().every(contract => value.includes(contract))) return patch9647(value);
  const linux = linuxProfiles.find(profile => contracts(profile).every(contract => value.includes(contract)));
  if (linux != null) return patchProfile(value, linux);
  if (contracts(build9922).every(contract => value.includes(contract))) return patchProfile(value, build9922);
  if (contracts(build10789).every(contract => value.includes(contract))) return patchProfile(value, build10789);
  throw new Error("Upstream changed: missing qualified sidebar ownership contract");
}

function contracts(profile) {
  return [profile.ownerBefore, profile.stateBefore, profile.destinationBefore, profile.headerBefore,
    profile.actionBefore, profile.memoBefore, profile.assignmentBefore];
}

function appliedMarkers(profile) {
  return [
    'const MTK_SIDEBAR_ACTIONS_STORAGE_KEY="the-mechanics-toolkit:sidebar-global-actions-collapsed:v1"',
    `function MTKuseSidebarActionCollapse${profile.suffix}()`,
    `function MTKsidebarActionDisclosure${profile.suffix}(`,
    `function MTKsidebarCollapsedDestinations${profile.suffix}(`,
    profile.ownerAfter,
    `[MTKsidebarActionsCollapsed,MTKtoggleSidebarActions]=MTKuseSidebarActionCollapse${profile.suffix}()`,
    profile.destinationAfter,
    `MTKsidebarActionsCollapsed?null:${profile.actionBefore}`,
    profile.headerAfter,
    profile.memoAfter,
    profile.assignmentAfter
  ];
}

function patchProfile(value, profile) {
  const helper = `const MTK_SIDEBAR_ACTIONS_STORAGE_KEY="the-mechanics-toolkit:sidebar-global-actions-collapsed:v1";function MTKreadSidebarActionsCollapsed${profile.suffix}(){try{return localStorage.getItem(MTK_SIDEBAR_ACTIONS_STORAGE_KEY)==="1"}catch{return!1}}function MTKuseSidebarActionCollapse${profile.suffix}(){let[e,t]=(0,${profile.react}.useState)(MTKreadSidebarActionsCollapsed${profile.suffix});return ${profile.react}.useEffect(()=>{let e=e=>{e.key===MTK_SIDEBAR_ACTIONS_STORAGE_KEY&&t(MTKreadSidebarActionsCollapsed${profile.suffix}())};return addEventListener("storage",e),()=>removeEventListener("storage",e)},[]),[e,${profile.react}.useCallback(()=>{t(e=>{let t=!e;try{localStorage.setItem(MTK_SIDEBAR_ACTIONS_STORAGE_KEY,t?"1":"0")}catch{}return t})},[])]}function MTKsidebarCollapsedDestinations${profile.suffix}(e,t,n){return e?t.filter(e=>e.id===n):t}function MTKsidebarActionDisclosure${profile.suffix}({collapsed:e,onToggle:t}){let n=${profile.intl}(),r=n.formatMessage(e?{id:"sidebarElectron.globalActions.show",defaultMessage:"Show navigation actions",description:"Accessible label for expanding the sidebar navigation action group"}:{id:"sidebarElectron.globalActions.hide",defaultMessage:"Hide navigation actions",description:"Accessible label for collapsing the sidebar navigation action group"});return(0,${profile.jsx}.jsx)("button",{type:"button",title:r,"aria-label":r,"aria-expanded":!e,className:"flex size-8 items-center justify-center rounded-md text-secondary hover:bg-tertiary hover:text-primary cursor-pointer",onClick:t,children:(0,${profile.jsx}.jsx)("svg",{"aria-hidden":!0,className:"icon-xs transition-transform "+(e?"":"rotate-90"),viewBox:"0 0 16 16",fill:"none",children:(0,${profile.jsx}.jsx)("path",{d:"M6 3.5 10.5 8 6 12.5",stroke:"currentColor",strokeWidth:1.5,strokeLinecap:"round",strokeLinejoin:"round"})})})}`;
  let patched = replaceOnce(value, profile.ownerBefore, `${helper}${profile.ownerAfter}`, `${profile.name} sidebar owner`);
  patched = replaceOnce(patched, profile.stateBefore, `${profile.stateBefore}[MTKsidebarActionsCollapsed,MTKtoggleSidebarActions]=MTKuseSidebarActionCollapse${profile.suffix}(),`, `${profile.name} sidebar state`);
  patched = replaceOnce(patched, profile.destinationBefore, profile.destinationAfter, `${profile.name} destination projection`);
  patched = replaceOnce(patched, profile.headerBefore, profile.headerAfter, `${profile.name} header disclosure`);
  patched = replaceOnce(patched, profile.actionBefore, `MTKsidebarActionsCollapsed?null:${profile.actionBefore}`, `${profile.name} action block`);
  patched = replaceOnce(patched, profile.memoBefore, profile.memoAfter, `${profile.name} memo dependency`);
  return replaceOnce(patched, profile.assignmentBefore, profile.assignmentAfter, `${profile.name} memo assignment`);
}

function current9647Contracts() {
  return [
    "function KKn(e){let t=(0,XKn.c)(133),",
    "{desktopNavItemsEnabled:n,sidebarTriggerState:r}=e,",
    "}else ge=t[51];let _e=ge.length>0",
    '(0,Z0.jsxs)(`div`,{className:`ms-auto flex items-center gap-1`,children:[(0,Z0.jsx)(o_n,{}),(0,Z0.jsx)(vJ,{showCustomizeSidebarAction:Se,children:(0,Z0.jsx)(iCn,{})}),!T&&le===`header_icon`?(0,Z0.jsx)(UCn,{sidebarMode:X}):null]})',
    '(0,Z0.jsx)(ACn,{showCustomizeSidebarAction:Se,sidebarMode:X,showSearchNavItem:!1})',
    "t[84]!==p||t[85]!==_||t[86]!==T||t[87]!==le||t[88]!==q||t[89]!==Ce||t[90]!==Se||t[91]!==X?(",
    "t[84]=p,t[85]=_,t[86]=T,t[87]=le,t[88]=q,t[89]=Ce,t[90]=Se,t[91]=X,t[92]=Ne):Ne=t[92]"
  ];
}

function patch9647(value) {
  const helper = String.raw`const MTK_SIDEBAR_ACTIONS_STORAGE_KEY="the-mechanics-toolkit:sidebar-global-actions-collapsed:v1";function MTKreadSidebarActionsCollapsed9647(){try{return localStorage.getItem(MTK_SIDEBAR_ACTIONS_STORAGE_KEY)==="1"}catch{return!1}}function MTKuseSidebarActionCollapse9647(){let[e,t]=(0,X0.useState)(MTKreadSidebarActionsCollapsed9647);return X0.useEffect(()=>{let e=e=>{e.key===MTK_SIDEBAR_ACTIONS_STORAGE_KEY&&t(MTKreadSidebarActionsCollapsed9647())};return addEventListener("storage",e),()=>removeEventListener("storage",e)},[]),[e,X0.useCallback(()=>{t(e=>{let t=!e;try{localStorage.setItem(MTK_SIDEBAR_ACTIONS_STORAGE_KEY,t?"1":"0")}catch{}return t})},[])]}function MTKsidebarCollapsedDestinations9647(e,t,n){return e?t.filter(e=>e.id===n):t}function MTKsidebarActionDisclosure9647({collapsed:e,onToggle:t}){let n=ch(),r=n.formatMessage(e?{id:"sidebarElectron.globalActions.show",defaultMessage:"Show navigation actions",description:"Accessible label for expanding the sidebar navigation action group"}:{id:"sidebarElectron.globalActions.hide",defaultMessage:"Hide navigation actions",description:"Accessible label for collapsing the sidebar navigation action group"});return(0,Z0.jsx)("button",{type:"button",title:r,"aria-label":r,"aria-expanded":!e,className:"flex size-8 items-center justify-center rounded-md text-secondary hover:bg-tertiary hover:text-primary cursor-pointer",onClick:t,children:(0,Z0.jsx)("svg",{"aria-hidden":!0,className:"icon-xs transition-transform "+(e?"":"rotate-90"),viewBox:"0 0 16 16",fill:"none",children:(0,Z0.jsx)("path",{d:"M6 3.5 10.5 8 6 12.5",stroke:"currentColor",strokeWidth:1.5,strokeLinecap:"round",strokeLinejoin:"round"})})})}`;
  let patched = replaceOnce(value, "function KKn(e){let t=(0,XKn.c)(133),", `${helper}function KKn(e){let t=(0,XKn.c)(134),`, "build-9647 sidebar owner");
  patched = replaceOnce(patched, "{desktopNavItemsEnabled:n,sidebarTriggerState:r}=e,", "{desktopNavItemsEnabled:n,sidebarTriggerState:r}=e,[MTKsidebarActionsCollapsed,MTKtoggleSidebarActions]=MTKuseSidebarActionCollapse9647(),", "build-9647 sidebar state");
  patched = replaceOnce(patched, "}else ge=t[51];let _e=ge.length>0", "}else ge=t[51];ge=MTKsidebarCollapsedDestinations9647(MTKsidebarActionsCollapsed,ge,IT.projects);let _e=ge.length>0", "build-9647 global destination projection");
  patched = replaceOnce(
    patched,
    '(0,Z0.jsxs)(`div`,{className:`ms-auto flex items-center gap-1`,children:[(0,Z0.jsx)(o_n,{}),(0,Z0.jsx)(vJ,{showCustomizeSidebarAction:Se,children:(0,Z0.jsx)(iCn,{})}),!T&&le===`header_icon`?(0,Z0.jsx)(UCn,{sidebarMode:X}):null]})',
    '(0,Z0.jsxs)(`div`,{className:`ms-auto flex items-center gap-1`,children:[(0,Z0.jsx)(o_n,{}),(0,Z0.jsx)(vJ,{showCustomizeSidebarAction:Se,children:(0,Z0.jsx)(iCn,{})}),!T&&le===`header_icon`?(0,Z0.jsx)(UCn,{sidebarMode:X}):null,(0,Z0.jsx)(MTKsidebarActionDisclosure9647,{collapsed:MTKsidebarActionsCollapsed,onToggle:MTKtoggleSidebarActions})]})',
    "build-9647 header disclosure"
  );
  patched = replaceOnce(patched, '(0,Z0.jsx)(ACn,{showCustomizeSidebarAction:Se,sidebarMode:X,showSearchNavItem:!1})', 'MTKsidebarActionsCollapsed?null:(0,Z0.jsx)(ACn,{showCustomizeSidebarAction:Se,sidebarMode:X,showSearchNavItem:!1})', "build-9647 global action block");
  patched = replaceOnce(patched, "t[84]!==p||t[85]!==_||t[86]!==T||t[87]!==le||t[88]!==q||t[89]!==Ce||t[90]!==Se||t[91]!==X?(", "t[84]!==p||t[85]!==_||t[86]!==T||t[87]!==le||t[88]!==q||t[89]!==Ce||t[90]!==Se||t[91]!==X||t[133]!==MTKsidebarActionsCollapsed?(", "build-9647 header memo dependency");
  return replaceOnce(patched, "t[84]=p,t[85]=_,t[86]=T,t[87]=le,t[88]=q,t[89]=Ce,t[90]=Se,t[91]=X,t[92]=Ne):Ne=t[92]", "t[84]=p,t[85]=_,t[86]=T,t[87]=le,t[88]=q,t[89]=Ce,t[90]=Se,t[91]=X,t[133]=MTKsidebarActionsCollapsed,t[92]=Ne):Ne=t[92]", "build-9647 header memo assignment");
}

function uniqueOwnershipAsset() {
  if (!fs.existsSync(assets) || !fs.statSync(assets).isDirectory()) {
    throw new Error(`Missing extracted assets directory: ${assets}`);
  }
  const matches = fs.readdirSync(assets)
    .filter(name => /^app-(?:initial|primary)-.*\.js$/.test(name))
    .filter(name => {
      const value = fs.readFileSync(path.join(assets, name), "utf8");
      return current9647Contracts().every(contract => value.includes(contract)) ||
        linuxProfiles.some(profile => contracts(profile).every(contract => value.includes(contract))) ||
        contracts(build9922).every(contract => value.includes(contract)) ||
        contracts(build10789).every(contract => value.includes(contract)) ||
        value.includes("function MTKuseSidebarActionCollapse9647()") ||
        linuxProfiles.some(profile => value.includes(`function MTKuseSidebarActionCollapse${profile.suffix}()`)) ||
        value.includes(`function MTKuseSidebarActionCollapse${build9922.suffix}()`) ||
        value.includes(`function MTKuseSidebarActionCollapse${build10789.suffix}()`);
    });
  if (matches.length !== 1) throw new Error(`Upstream changed: found ${matches.length} sidebar ownership assets`);
  return path.join(assets, matches[0]);
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

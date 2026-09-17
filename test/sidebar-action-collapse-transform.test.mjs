#!/usr/bin/env node
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const repository = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const toolkit = path.join(repository, "bin/toolkit.mjs");
const behavioralProbe = path.join(repository, "test/sidebar-action-collapse.test.mjs");
const scratch = fs.mkdtempSync(path.join(os.tmpdir(), "mechanics-toolkit-sidebar-test-"));

try {
  const assets = path.join(scratch, "webview/assets");
  fs.mkdirSync(assets, { recursive: true });
  const target = path.join(assets, "app-primary-fixture.js");
  fs.writeFileSync(target, fixtureSource());

  assert.equal(runToolkit("check", scratch).state, "needs-apply");
  assert.equal(runToolkit("apply", scratch).state, "applied");
  const once = fs.readFileSync(target);
  assert.equal(runToolkit("check", scratch).state, "applied");

  const probe = spawnSync(process.execPath, [behavioralProbe, scratch], { encoding: "utf8" });
  assert.equal(probe.status, 0, probe.stderr || probe.stdout);

  assert.equal(runToolkit("apply", scratch).state, "applied");
  assert.deepEqual(fs.readFileSync(target), once, "second application is byte-identical");
  process.stdout.write("sidebar action collapse transform probe passed\n");

  fs.writeFileSync(target, linux9647FixtureSource());
  assert.equal(runToolkit("check", scratch).state, "needs-apply");
  assert.equal(runToolkit("apply", scratch).state, "applied");
  const linuxOnce = fs.readFileSync(target);
  const linuxProbe = spawnSync(process.execPath, [behavioralProbe, scratch], { encoding: "utf8" });
  assert.equal(linuxProbe.status, 0, linuxProbe.stderr || linuxProbe.stdout);
  const linuxSource = linuxOnce.toString();
  assert.match(linuxSource, /MTKsidebarCollapsedDestinations9647Linux\(MTKsidebarActionsCollapsed,ge,FT\.projects\)/);
  assert.match(linuxSource, /function MTKsidebarActionDisclosure9647Linux\([^]*?let n=il\(\),r=n\.formatMessage/);
  assert.doesNotMatch(linuxSource, /function MTKsidebarActionDisclosure9647Linux\([^]*?let n=ch\(\),r=n\.formatMessage/);
  assert.doesNotMatch(linuxSource, /MTKsidebarCollapsedDestinations9647\(MTKsidebarActionsCollapsed,ge,IT\.projects\)/);
  assert.match(linuxSource, /macDecoy="sidebarMode:X"/);
  assert.equal(runToolkit("apply", scratch).state, "applied");
  assert.deepEqual(fs.readFileSync(target), linuxOnce, "Linux second application is byte-identical");
  process.stdout.write("sidebar action collapse Linux build-9647 transform probe passed\n");
} finally {
  fs.rmSync(scratch, { recursive: true, force: true });
}

function runToolkit(action, root) {
  const result = spawnSync(
    process.execPath,
    [toolkit, "patch", "sidebar-action-collapse", action, root],
    { encoding: "utf8" }
  );
  assert.equal(result.status, 0, result.stderr || result.stdout);
  return JSON.parse(result.stdout);
}

function fixtureSource() {
  return [
    "function KKn(e){let t=(0,XKn.c)(133),Ne=0,{desktopNavItemsEnabled:n,sidebarTriggerState:r}=e,placeholder=0;",
    "let ge;if(flag){ge=[]}else ge=t[51];let _e=ge.length>0;",
    '(0,Z0.jsxs)(`div`,{className:`ms-auto flex items-center gap-1`,children:[(0,Z0.jsx)(o_n,{}),(0,Z0.jsx)(vJ,{showCustomizeSidebarAction:Se,children:(0,Z0.jsx)(iCn,{})}),!T&&le===`header_icon`?(0,Z0.jsx)(UCn,{sidebarMode:X}):null]});',
    '(0,Z0.jsx)(ACn,{showCustomizeSidebarAction:Se,sidebarMode:X,showSearchNavItem:!1});',
    "t[84]!==p||t[85]!==_||t[86]!==T||t[87]!==le||t[88]!==q||t[89]!==Ce||t[90]!==Se||t[91]!==X?(Ne=1,t[84]=p,t[85]=_,t[86]=T,t[87]=le,t[88]=q,t[89]=Ce,t[90]=Se,t[91]=X,t[92]=Ne):Ne=t[92];",
    "return Ne}",
    "const labels=[",
    "{defaultMessage:`New chat`},{defaultMessage:`Pull requests`},{defaultMessage:`Sites`},",
    "{defaultMessage:`Scheduled`},{defaultMessage:`Plugins`},{defaultMessage:`Projects`}",
    "];",
    "export const fixture=true;"
  ].join("");
}

function linux9647FixtureSource() {
  return [
    "function KKn(e){let t=(0,XKn.c)(133),Ne=0,{desktopNavItemsEnabled:n,sidebarTriggerState:r}=e,placeholder=0;",
    "let [x,S]=(0,X0.useState)(0),C=il(),w=Rb(Zae),initializerDecoy=ch();",
    "let ge;if(flag){ge=[]}else ge=t[51];let _e=ge.length>0;",
    '(0,Z0.jsxs)(`div`,{className:`ms-auto flex items-center gap-1`,children:[(0,Z0.jsx)(o_n,{}),(0,Z0.jsx)(vJ,{showCustomizeSidebarAction:Se,children:(0,Z0.jsx)(iCn,{})}),!T&&le===`header_icon`?(0,Z0.jsx)(UCn,{sidebarMode:Z}):null]});',
    '(0,Z0.jsx)(ACn,{showCustomizeSidebarAction:Se,sidebarMode:Z,showSearchNavItem:!1});',
    "t[84]!==p||t[85]!==_||t[86]!==T||t[87]!==le||t[88]!==q||t[89]!==Ce||t[90]!==Se||t[91]!==Z?(Ne=1,t[84]=p,t[85]=_,t[86]=T,t[87]=le,t[88]=q,t[89]=Ce,t[90]=Se,t[91]=Z,t[92]=Ne):Ne=t[92];",
    "return Ne}",
    'const macDecoy="sidebarMode:X";',
    "const labels=[",
    "{defaultMessage:`New chat`},{defaultMessage:`Pull requests`},{defaultMessage:`Sites`},",
    "{defaultMessage:`Scheduled`},{defaultMessage:`Plugins`},{defaultMessage:`Projects`}",
    "];",
    "export const fixture=true;"
  ].join("");
}

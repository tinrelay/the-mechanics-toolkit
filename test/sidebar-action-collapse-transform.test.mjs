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
  fs.writeFileSync(target, linux10954FixtureSource());
  assert.equal(runToolkit("check", scratch).state, "needs-apply");
  assert.equal(runToolkit("apply", scratch).state, "applied");
  const linux10954Once = fs.readFileSync(target);
  const linux10954Source = linux10954Once.toString();
  assert.match(linux10954Source, /O=s\(\),k=Us\(cus\)/);
  assert.match(linux10954Source, /label:O\.formatMessage\(/);
  assert.match(linux10954Source,
    /function MTKsidebarActionDisclosure10954Linux\([^]*?let n=s\(\),r=n\.formatMessage/);
  assert.doesNotMatch(linux10954Source,
    /function MTKsidebarActionDisclosure10954Linux\([^]*?let n=Ao\(\),r=n\.formatMessage/);
  assert.equal(runToolkit("apply", scratch).state, "applied");
  assert.deepEqual(fs.readFileSync(target), linux10954Once,
    "Linux build-10954 second application is byte-identical");
  fs.writeFileSync(target, linux10954Source.replace(
    "let n=s(),r=n.formatMessage(", "let n=Ao(),r=n.formatMessage("));
  const wrongIntl = spawnSync(process.execPath,
    [toolkit, "patch", "sidebar-action-collapse", "check", scratch], {encoding: "utf8"});
  assert.notEqual(wrongIntl.status, 0, "wrong applied intl owner must fail closed");
  process.stdout.write("sidebar action collapse Linux build-10954 transform probe passed\n");

  fs.writeFileSync(target, linux9771FixtureSource());
  assert.equal(runToolkit("check", scratch).state, "needs-apply");
  assert.equal(runToolkit("apply", scratch).state, "applied");
  const linuxOnce = fs.readFileSync(target);
  const linuxProbe = spawnSync(process.execPath, [behavioralProbe, scratch], { encoding: "utf8" });
  assert.equal(linuxProbe.status, 0, linuxProbe.stderr || linuxProbe.stdout);
  const linuxSource = linuxOnce.toString();
  assert.match(linuxSource, /MTKsidebarCollapsedDestinations9771Linux\(MTKsidebarActionsCollapsed,Me,m3\.projects\)/);
  assert.match(linuxSource, /function MTKsidebarActionDisclosure9771Linux\([^]*?let n=Ir\(\),r=n\.formatMessage/);
  assert.doesNotMatch(linuxSource, /function MTKsidebarActionDisclosure9771Linux\([^]*?let n=V5\(\),r=n\.formatMessage/);
  assert.doesNotMatch(linuxSource, /MTKsidebarCollapsedDestinations9922\(MTKsidebarActionsCollapsed,Me,j3\.projects\)/);
  assert.match(linuxSource, /macDecoy="j3\.projects"/);
  assert.equal(runToolkit("apply", scratch).state, "applied");
  assert.deepEqual(fs.readFileSync(target), linuxOnce, "Linux second application is byte-identical");
  process.stdout.write("sidebar action collapse Linux build-9771 transform probe passed\n");

  fs.writeFileSync(target, linux9647FixtureSource());
  assert.equal(runToolkit("check", scratch).state, "needs-apply");
  assert.equal(runToolkit("apply", scratch).state, "applied");
  const linux9647Once = fs.readFileSync(target);
  const linux9647Probe = spawnSync(process.execPath, [behavioralProbe, scratch], { encoding: "utf8" });
  assert.equal(linux9647Probe.status, 0, linux9647Probe.stderr || linux9647Probe.stdout);
  const linux9647Source = linux9647Once.toString();
  assert.match(linux9647Source,
    /MTKsidebarCollapsedDestinations9647Linux\(MTKsidebarActionsCollapsed,ge,FT\.projects\)/);
  assert.match(linux9647Source,
    /function MTKsidebarActionDisclosure9647Linux\([^]*?let n=il\(\),r=n\.formatMessage/);
  assert.doesNotMatch(linux9647Source,
    /function MTKsidebarActionDisclosure9647Linux\([^]*?let n=ch\(\),r=n\.formatMessage/);
  assert.match(linux9647Source, /macDecoy="sidebarMode:X"/);
  assert.equal(runToolkit("apply", scratch).state, "applied");
  assert.deepEqual(fs.readFileSync(target), linux9647Once,
    "Linux build-9647 second application is byte-identical");
  process.stdout.write("sidebar action collapse Linux build-9647 transform probe passed\n");

  fs.writeFileSync(target, build9922FixtureSource());
  assert.equal(runToolkit("check", scratch).state, "needs-apply");
  assert.equal(runToolkit("apply", scratch).state, "applied");
  const build9922Once = fs.readFileSync(target);
  const build9922Probe = spawnSync(process.execPath, [behavioralProbe, scratch], { encoding: "utf8" });
  assert.equal(build9922Probe.status, 0, build9922Probe.stderr || build9922Probe.stdout);
  assert.equal(runToolkit("apply", scratch).state, "applied");
  assert.deepEqual(fs.readFileSync(target), build9922Once, "build-9922 second application is byte-identical");
  process.stdout.write("sidebar action collapse build-9922 transform probe passed\n");

  fs.writeFileSync(target, build10789FixtureSource());
  assert.equal(runToolkit("check", scratch).state, "needs-apply");
  assert.equal(runToolkit("apply", scratch).state, "applied");
  const build10789Once = fs.readFileSync(target);
  assert.match(build10789Once.toString(), /MTKsidebarCollapsedDestinations10789\(MTKsidebarActionsCollapsed,je,B2\.projects\)/);
  assert.match(build10789Once.toString(), /t\[177\]=MTKsidebarActionsCollapsed/);
  assert.equal(runToolkit("apply", scratch).state, "applied");
  assert.deepEqual(fs.readFileSync(target), build10789Once);
  process.stdout.write("sidebar action collapse build-10789 transform probe passed\n");
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

function linux10954FixtureSource() {
  return [
    "function t9s(e){let t=(0,i9s.c)(177),Ye=0,{desktopNavItemsEnabled:n,sidebarTriggerState:r,contextualNavigation:i}=e,O=s(),k=Us(cus),placeholder=0;",
    "let Me=[];t[58];let Ne=Me.length>0;",
    'const nav={label:O.formatMessage({defaultMessage:"Projects"})};',
    '(0,f5.jsxs)(f5.Fragment,{children:[(0,f5.jsx)(Q5s,{}),(!A||j)&&Te===`header_icon`?(0,f5.jsx)(vLs,{sidebarMode:he}):null]});',
    '(0,f5.jsx)(rLs,{showCustomizeSidebarAction:Re,sidebarMode:he,showSearchNavItem:!1});',
    "t[108]!==_||t[109]!==x||t[110]!==j||t[111]!==A||t[112]!==Te||t[113]!==de||t[114]!==null||t[115]!==ze||t[116]!==!1||t[117]!==Re||t[118]!==R||t[119]!==he?(Ye=1,t[108]=_,t[109]=x,t[110]=j,t[111]=A,t[112]=Te,t[113]=de,t[114]=null,t[115]=ze,t[116]=!1,t[117]=Re,t[118]=R,t[119]=he,t[120]=Ye):Ye=t[120];return Ye}",
    "const wrongIntl=Ao;",
    "export const fixture=true;"
  ].join("");
}

function linux9771FixtureSource() {
  return [
    "function zVc(e){let t=(0,UVc.c)(181),Xe=0,{desktopNavItemsEnabled:n,sidebarTriggerState:r,contextualNavigation:i}=e,placeholder=0;",
    "let Me=[];t[58];let Ne=Me.length>0;",
    '(0,X5.jsxs)(X5.Fragment,{children:[(0,X5.jsx)(Q5s,{}),(0,X5.jsx)(g7s,{showCustomizeSidebarAction:Re,children:(0,X5.jsx)(pfc,{})}),(!A||j)&&Te===`header_icon`?(0,X5.jsx)(fhc,{sidebarMode:he}):null]});',
    '(0,X5.jsx)(Xmc,{showCustomizeSidebarAction:Re,sidebarMode:he,showSearchNavItem:!1});',
    "t[108]!==g||t[109]!==b||t[110]!==j||t[111]!==A||t[112]!==Te||t[113]!==de||t[114]!==null||t[115]!==ze||t[116]!==!1||t[117]!==Re||t[118]!==R||t[119]!==he?(Xe=1,t[108]=g,t[109]=b,t[110]=j,t[111]=A,t[112]=Te,t[113]=de,t[114]=null,t[115]=ze,t[116]=!1,t[117]=Re,t[118]=R,t[119]=he,t[120]=Xe):Xe=t[120];return Xe}",
    'const macDecoy="j3.projects";',
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

function build9922FixtureSource() {
  return [
    "function zVc(e){let t=(0,UVc.c)(181),Xe=0,{desktopNavItemsEnabled:n,sidebarTriggerState:r,contextualNavigation:i}=e,placeholder=0;",
    "let Me=[];t[58];let Ne=Me.length>0;",
    '(0,Z5.jsxs)(Z5.Fragment,{children:[(0,Z5.jsx)(Q5s,{}),(0,Z5.jsx)(g7s,{showCustomizeSidebarAction:Re,children:(0,Z5.jsx)(pfc,{})}),(!A||j)&&Te===`header_icon`?(0,Z5.jsx)(fhc,{sidebarMode:he}):null]});',
    '(0,Z5.jsx)(Xmc,{showCustomizeSidebarAction:Re,sidebarMode:he,showSearchNavItem:!1});',
    "t[108]!==g||t[109]!==b||t[110]!==j||t[111]!==A||t[112]!==Te||t[113]!==de||t[114]!==null||t[115]!==ze||t[116]!==!1||t[117]!==Re||t[118]!==R||t[119]!==he?(Xe=1,t[108]=g,t[109]=b,t[110]=j,t[111]=A,t[112]=Te,t[113]=de,t[114]=null,t[115]=ze,t[116]=!1,t[117]=Re,t[118]=R,t[119]=he,t[120]=Xe):Xe=t[120];return Xe}",
    "const labels=[{defaultMessage:`New chat`},{defaultMessage:`Pull requests`},{defaultMessage:`Sites`},{defaultMessage:`Scheduled`},{defaultMessage:`Plugins`},{defaultMessage:`Projects`}];"
  ].join("");
}

function build10789FixtureSource() {
  return [
    "function t9s(e){let t=(0,i9s.c)(177),Ye=0,{desktopNavItemsEnabled:n,sidebarTriggerState:r,contextualNavigation:i}=e,placeholder=0;",
    "let je=[];t[58];let Me=je.length>0;",
    '(0,f5.jsxs)(f5.Fragment,{children:[(0,f5.jsx)(Obs,{}),(0,f5.jsx)(B4,{showCustomizeSidebarAction:Le,children:(0,f5.jsx)(vPs,{})}),(!k||A)&&we===`header_icon`?(0,f5.jsx)(vLs,{sidebarMode:me}):null]});',
    '(0,f5.jsx)(rLs,{showCustomizeSidebarAction:Le,sidebarMode:me,showSearchNavItem:!1});',
    "t[108]!==g||t[109]!==b||t[110]!==A||t[111]!==k||t[112]!==we||t[113]!==ue||t[114]!==null||t[115]!==Re||t[116]!==!1||t[117]!==Le||t[118]!==L||t[119]!==me?(Ye=1,t[108]=g,t[109]=b,t[110]=A,t[111]=k,t[112]=we,t[113]=ue,t[114]=null,t[115]=Re,t[116]=!1,t[117]=Le,t[118]=L,t[119]=me,t[120]=Ye):Ye=t[120];return Ye}",
    "const labels=[{defaultMessage:`New chat`},{defaultMessage:`Pull requests`},{defaultMessage:`Sites`},{defaultMessage:`Scheduled`},{defaultMessage:`Plugins`},{defaultMessage:`Projects`}];"
  ].join("");
}

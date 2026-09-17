#!/usr/bin/env node
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const repository = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const toolkit = path.join(repository, "bin/toolkit.mjs");
const behavioralProbe = path.join(repository, "test/task-attention-policy.test.mjs");

testMac9647Profile();
testLinux9647Profile();

function testMac9647Profile() {
  const profileScratch = fs.mkdtempSync(path.join(os.tmpdir(), "mechanics-toolkit-attention-mac-9647-"));
  try {
    const extracted = path.join(profileScratch, "extracted");
    const assets = path.join(extracted, "webview/assets");
    fs.mkdirSync(assets, { recursive: true });
    const initialTarget = path.join(assets, "app-initial-mac.js");
    const primaryTarget = path.join(assets, "app-primary-mac.js");
    fs.writeFileSync(initialTarget, mac9647InitialFixture());
    fs.writeFileSync(primaryTarget, mac9647PrimaryFixture());

    assert.equal(runProfile("check").state, "needs-apply");
    assert.equal(runProfile("apply").state, "applied");
    const initialOnce = fs.readFileSync(initialTarget);
    const primaryOnce = fs.readFileSync(primaryTarget);
    const atomOwner = initialOnce.toString().match(/MTKattentionPolicyAtom=([$\w]+)\(Q,0\)/)?.[1];
    assert.equal(atomOwner, "Ip", "macOS build-9647 uses its exact stock writable signal factory");
    const attentionAtom = Function("Ip", "Y", "Q", `return ${atomOwner}(Q,0)`)(
      (scope, value) => ({scope, value}),
      () => { throw new Error("derived atom factory cannot initialize writable state"); },
      Symbol("scope")
    );
    assert.equal(attentionAtom.value, 0, "attention policy state is initialized as writable state");
    assert.ok(!initialOnce.includes("MTKattentionPolicyAtom=Y(Q,0)"),
      "the derived atom factory is never used for writable attention state");

    const probe = spawnSync(process.execPath, [behavioralProbe, extracted], { encoding: "utf8" });
    assert.equal(probe.status, 0, probe.stderr || probe.stdout);
    assert.equal(runProfile("apply").state, "applied");
    assert.deepEqual(fs.readFileSync(initialTarget), initialOnce,
      "macOS build-9647 app-initial second application is byte-identical");
    assert.deepEqual(fs.readFileSync(primaryTarget), primaryOnce,
      "macOS build-9647 app-primary second application is byte-identical");

    function runProfile(action) {
      const result = spawnSync(
        process.execPath,
        [toolkit, "patch", "task-attention-policy", action, extracted],
        { encoding: "utf8" }
      );
      assert.equal(result.status, 0, result.stderr || result.stdout);
      return JSON.parse(result.stdout);
    }
  } finally {
    fs.rmSync(profileScratch, { recursive: true, force: true });
  }
}

function testLinux9647Profile() {
  const linuxScratch = fs.mkdtempSync(path.join(os.tmpdir(), "mechanics-toolkit-attention-linux-9647-"));
  try {
    const extracted = path.join(linuxScratch, "extracted");
    const assets = path.join(extracted, "webview/assets");
    fs.mkdirSync(assets, { recursive: true });
    const initialTarget = path.join(assets, "app-initial-linux.js");
    const primaryTarget = path.join(assets, "app-primary-linux.js");
    fs.writeFileSync(initialTarget, linux9647InitialFixture());
    fs.writeFileSync(primaryTarget, linux9647PrimaryFixture());

    assert.equal(runLinux("check").state, "needs-apply");
    assert.equal(runLinux("apply").state, "applied");
    const initialOnce = fs.readFileSync(initialTarget);
    const primaryOnce = fs.readFileSync(primaryTarget);
    assert.ok(initialOnce.includes("function MTKuseAttentionBootstrap9647Linux()"));
    const atomOwner = initialOnce.toString().match(/MTKattentionPolicyAtom=([$\w]+)\(Q,0\)/)?.[1];
    assert.equal(atomOwner, "Fp", "Linux build-9647 uses the stock writable signal factory");
    const attentionAtom = Function("Fp", "Y", "Q", `return ${atomOwner}(Q,0)`)(
      (scope, value) => ({scope, value}),
      () => { throw new Error("derived atom factory cannot initialize writable state"); },
      Symbol("scope")
    );
    assert.equal(attentionAtom.value, 0, "attention policy state is initialized as writable state");
    assert.ok(initialOnce.includes("let e=tm(Q)"), "Linux state scope owns roster invalidation");
    assert.ok(!initialOnce.includes("let e=nm(Q)"), "macOS state scope is not injected on Linux");
    for (const marker of [
      "MTKattentionIgnoredForTask=MTKuseTaskAttention9647Linux(gt,n)",
      "let It=MTKattentionIgnoredForTask?{...Ft,unread:!1,unreadCount:0}:Ft",
      "Bt=MTKattentionIgnoredForTask?[]:zt==null?[]:[zt]",
      "let Kt=MTKattentionIgnoredForTask?void 0:Gt",
      "hasUnreadTurn:!MTKattentionIgnoredForTask&&!kt&&et===!0"
    ]) assert.ok(primaryOnce.includes(marker), `Linux build-9647 row contract: ${marker}`);
    assert.ok(!primaryOnce.includes("MTKuseTaskAttention9647(_t,n)"),
      "macOS build-9647 task-row aliases are not injected on Linux");

    const probe = spawnSync(process.execPath, [behavioralProbe, extracted], { encoding: "utf8" });
    assert.equal(probe.status, 0, probe.stderr || probe.stdout);
    assert.equal(runLinux("apply").state, "applied");
    assert.deepEqual(fs.readFileSync(initialTarget), initialOnce,
      "Linux build-9647 app-initial second application is byte-identical");
    assert.deepEqual(fs.readFileSync(primaryTarget), primaryOnce,
      "Linux build-9647 app-primary second application is byte-identical");

    function runLinux(action) {
      const result = spawnSync(
        process.execPath,
        [toolkit, "patch", "task-attention-policy", action, extracted],
        { encoding: "utf8" }
      );
      assert.equal(result.status, 0, result.stderr || result.stdout);
      return JSON.parse(result.stdout);
    }
  } finally {
    fs.rmSync(linuxScratch, { recursive: true, force: true });
  }
}


function mac9647InitialFixture() {
  return [
    "globalThis.__MTK_AGENT_ROSTER__=Object.freeze({});",
    "function Ip(e,t,n){let r=Pp(`signal`,e,t);return r}",
    "function PYs(){MTKuseAgentRoster();MTKusePaletteBootstrap();let e=(0,LYs.c)(12),x;return e}",
    "function uHs(e,t){l.info(`[desktop-notifications] service starting`);",
    "let a=VR(e.getConversation(t.conversationId)),{navigationPath:o,navigateToNotification:s}=g(t.conversationId);return a}",
    "let U3a,W3a=t((()=>{X(),dT(),WL(),$(),IO(),iNi(),m$(),uM(),FH(),Fj(),WH(),U3a=Y(Q,({get:e})=>e)}));",
    "function unreadBadge(e,t,o,r,i){let s=t===`work`?Wxr({cloudThreadsAllowed:i,localThreadsAllowed:nM(e(aT)),threadKeys:o}):o;return r+s}",
    "export const fixture=true;"
  ].join("");
}

function linux9647InitialFixture() {
  return [
    "globalThis.__MTK_AGENT_ROSTER__=Object.freeze({});",
    "function Fp(e,t,n){let r=Np(`signal`,e,t);return r}",
    "function PYs(){MTKuseAgentRoster();MTKusePaletteBootstrap();let e=(0,LYs.c)(12),x;return e}",
    "function uHs(e,t){l.info(`[desktop-notifications] service starting`);",
    "let a=VR(e.getConversation(t.conversationId)),{navigationPath:o,navigateToNotification:s}=g(t.conversationId);return a}",
    "let U3a,W3a=t((()=>{X(),dT(),WL(),$(),IO(),iNi(),m$(),uM(),FH(),Fj(),WH(),U3a=Y(Q,({get:e})=>e)}));",
    "function unreadBadge(e,t,o,r,i){let s=t===`work`?Wxr({cloudThreadsAllowed:i,localThreadsAllowed:nM(e(aT)),threadKeys:o}):o;return r+s}",
    "export const fixture=true;"
  ].join("");
}

function mac9647PrimaryFixture() {
  return [
    "var MDn,NDn,PDn=t((()=>{MDn=a(),NDn=n(i(),1)}));",
    "function FDn(e){let t=(0,LDn.c)(146),Lt,qt,Vt;",
    "let _t=Fy(GEn,{hostId:Ke??`local`,threadId:n})??Be?.title??null,vt=Fy(qT,n)??Be?.threadSource;",
    "flag?(Lt={type:`idle`,unread:!1,unreadCount:0}):Lt=t[25];let Rt=Lt,zt;t[26];",
    "Ht=Vt==null?[]:[Vt];",
    "flag?(qt=1):qt=t[45];let Jt=qt,Yt;t[46];",
    "let hover={hasUnreadTurn:!At&&tt===!0,hasSystemError:Rt.type===`error`};return hover}",
    "export const fixture=true;"
  ].join("");
}

function linux9647PrimaryFixture() {
  return [
    "var MDn,NDn,PDn=t((()=>{MDn=a(),NDn=n(i(),1)}));",
    "function FDn(e){let t=(0,LDn.c)(146),Ft,Gt,zt;",
    "let gt=CC(GEn,{hostId:Ge??`local`,threadId:n})??ze?.title??null,_t=CC(qT,n)??ze?.threadSource;",
    "flag?(Ft={type:`idle`,unread:!1,unreadCount:0}):Ft=t[25];let It=Ft,Lt;t[26];",
    "Bt=zt==null?[]:[zt];",
    "flag?(Gt=1):Gt=t[45];let Kt=Gt,qt;t[46];",
    "let hover={hasUnreadTurn:!kt&&et===!0,hasSystemError:It.type===`error`};return hover}",
    "export const fixture=true;"
  ].join("");
}

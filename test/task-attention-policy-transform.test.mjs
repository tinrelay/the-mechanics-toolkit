#!/usr/bin/env node
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {spawnSync} from "node:child_process";
import {fileURLToPath} from "node:url";
import {build9922} from "../patches/task-attention-policy/profiles/build9922.mjs";
import {
  linuxBuild9647,
  linuxBuild9771
} from "../patches/task-attention-policy/profiles/linux.mjs";

const repository = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const toolkit = path.join(repository, "bin/toolkit.mjs");
const probe = path.join(repository, "test/task-attention-policy.test.mjs");

verifyProfile(build9922, build9922InitialFixture(), primaryFixture(), "build 9922");
verifyProfile(linuxBuild9771, linux9771InitialFixture(), primaryFixture(), "Linux build 9771");
verifyProfile(linuxBuild9647, linux9647InitialFixture(), linux9647PrimaryFixture(), "Linux build 9647");
process.stdout.write("task attention policy current-build transform probe passed\n");

function verifyProfile(profile, initialFixture, primarySource, label) {
  const scratch = fs.mkdtempSync(path.join(os.tmpdir(), "mechanics-toolkit-attention-"));
  try {
    const assets = path.join(scratch, "webview/assets");
    fs.mkdirSync(assets, {recursive: true});
    const initial = path.join(assets, "app-initial-fixture.js");
    const primary = path.join(assets, "app-primary-fixture.js");
    fs.writeFileSync(initial, initialFixture);
    fs.writeFileSync(primary, primarySource);

    assert.equal(run("check").state, "needs-apply");
    assert.equal(run("apply").state, "applied");
    const initialOnce = fs.readFileSync(initial);
    const primaryOnce = fs.readFileSync(primary);
    for (const marker of profile.applied.app) {
      assert.ok(initialOnce.includes(marker), `${label} app contract: ${marker}`);
    }
    for (const marker of profile.applied.primary) {
      assert.ok(primaryOnce.includes(marker), `${label} row contract: ${marker}`);
    }
    const behavior = spawnSync(process.execPath, [probe, scratch], {encoding: "utf8"});
    assert.equal(behavior.status, 0, behavior.stderr || behavior.stdout);
    assert.equal(run("apply").state, "applied");
    assert.deepEqual(fs.readFileSync(initial), initialOnce, `${label} app is byte-identical`);
    assert.deepEqual(fs.readFileSync(primary), primaryOnce, `${label} rows are byte-identical`);

    function run(action) {
      const result = spawnSync(process.execPath,
        [toolkit, "patch", "task-attention-policy", action, scratch], {encoding: "utf8"});
      assert.equal(result.status, 0, result.stderr || result.stdout);
      return JSON.parse(result.stdout);
    }
  } finally {
    fs.rmSync(scratch, {recursive: true, force: true});
  }
}

function build9922InitialFixture() {
  return [
    "globalThis.__MTK_AGENT_ROSTER__=Object.freeze({});",
    "const $=Symbol(`scope`),Gvl={useEffect(){}};function xf(e){return e}",
    "function rf(e,t,n){let r=tf(`signal`,e,t);return r}",
    "function IT(e){return e.startsWith(`local:`)?{kind:`local`,threadId:e.slice(6)}:{kind:`remote`,taskId:e.slice(7)}}",
    "function Vvl(){MTKuseAgentRoster();MTKusePaletteBootstrap();let e=(0,Wvl.c)(12);return e}",
    "function rfl(e,t){$t.info(`[desktop-notifications] service starting`);let n=t.scope;",
    "let a=uYr(e.getConversation(t.conversationId)),{navigationPath:o,navigateToNotification:s}=h(t.conversationId);return a}",
    "var fOa;function pOa(){return(pOa=n((()=>{fOa=sf($,({get:e})=>e)})))}",
    "function unreadBadge(e,t,o,r,i){let s=t===`work`?qQn({cloudThreadsAllowed:i,localThreadsAllowed:aE(e(vy)),threadKeys:o}):o;return r+s}"
  ].join("");
}

function linux9771InitialFixture() {
  return [
    "globalThis.__MTK_AGENT_ROSTER__=Object.freeze({});",
    "const $=Symbol(`scope`),Tyl={useEffect(){}};function xf(e){return e}",
    "function nf(e,t,n){let r=ef(`signal`,e,t);return r}",
    "function dT(e){return e.startsWith(`local:`)?{kind:`local`,threadId:e.slice(6)}:{kind:`remote`,taskId:e.slice(7)}}",
    "function xyl(){MTKuseAgentRoster();MTKusePaletteBootstrap();let e=(0,wyl.c)(12);return e}",
    "function rfl(e,t){Ir.info(`[desktop-notifications] service starting`);let n=t.scope;",
    "let a=dYr(e.getConversation(t.conversationId)),{navigationPath:o,navigateToNotification:s}=h(t.conversationId);return a}",
    "var AOa;function init(){AOa=of($,({get:e})=>e)}",
    "function unreadBadge(e,t,o,r,i){let s=t===`work`?v$n({cloudThreadsAllowed:i,localThreadsAllowed:PT(e(cy)),threadKeys:o}):o;return r+s}"
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

function primaryFixture() {
  return [
    "const vbc={useSyncExternalStore(){return!1}},uyc=Symbol(),bf=()=>null;",
    "function hbc(e){let t=(0,_bc.c)(148),Wt,en,Jt,n=e.conversationId,et=`local`,Je={},Tt=bf(uyc,{hostId:et??`local`,threadId:n})??Je?.title??null,Et=1;",
    "flag?(Wt={type:`idle`,unread:!1,unreadCount:0}):Wt=t[25];let Gt=Wt,Kt;t[26];",
    "let Yt=Jt==null?[]:[Jt];flag?(en=1):en=t[45];let tn=en,nn;t[46];",
    "let hover={hasUnreadTurn:!Rt&&lt===!0};return hover}"
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

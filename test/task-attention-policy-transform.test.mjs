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
const scratch = fs.mkdtempSync(path.join(os.tmpdir(), "mechanics-toolkit-attention-test-"));
const workspaceName = platformWorkspaceName();

try {
  const assets = path.join(scratch, "extracted/webview/assets");
  const workspace = path.join(scratch, workspaceName);
  const policyDirectory = path.join(workspace, ".codex");
  fs.mkdirSync(assets, { recursive: true });
  fs.mkdirSync(policyDirectory, { recursive: true });
  const initialTarget = path.join(assets, "app-initial-fixture.js");
  const primaryTarget = path.join(assets, "app-primary-fixture.js");
  const config = path.join(scratch, "toolkit.json");
  fs.writeFileSync(initialTarget, initialFixture());
  fs.writeFileSync(primaryTarget, primaryFixture());
  fs.writeFileSync(config, `${JSON.stringify({ workspaceRoot: workspace }, null, 2)}\n`);
  fs.writeFileSync(path.join(policyDirectory, "task-attention-policy.json"), `${JSON.stringify({
    ignore: ["^task-local-ignore$", "^research-desk$", "^radio-room$"]
  }, null, 2)}\n`);

  assert.equal(runToolkit("check").state, "needs-apply");
  const withoutConfig = spawnSync(
    process.execPath,
    [toolkit, "patch", "task-attention-policy", "apply", path.join(scratch, "extracted")],
    { encoding: "utf8" }
  );
  assert.notEqual(withoutConfig.status, 0, "apply refuses to bake an implicit workspace owner");
  assert.match(withoutConfig.stderr, /requires --config/);

  const applied = runToolkit("apply");
  assert.equal(applied.state, "applied");
  const initialOnce = fs.readFileSync(initialTarget);
  const primaryOnce = fs.readFileSync(primaryTarget);
  assert.ok(initialOnce.includes(`t=${JSON.stringify(workspace)}`), "configured workspace root is embedded as a quoted literal");

  const probe = spawnSync(
    process.execPath,
    [behavioralProbe, path.join(scratch, "extracted"), workspace],
    { encoding: "utf8" }
  );
  assert.equal(probe.status, 0, probe.stderr || probe.stdout);

  assert.equal(runToolkit("apply").state, "applied");
  assert.deepEqual(fs.readFileSync(initialTarget), initialOnce, "app-initial second application is byte-identical");
  assert.deepEqual(fs.readFileSync(primaryTarget), primaryOnce, "app-primary second application is byte-identical");
  process.stdout.write("task attention policy transform probe passed\n");

  function runToolkit(action) {
    const result = spawnSync(
      process.execPath,
      [toolkit, "patch", "task-attention-policy", action, path.join(scratch, "extracted"), "--config", config],
      { encoding: "utf8" }
    );
    assert.equal(result.status, 0, result.stderr || result.stdout);
    return JSON.parse(result.stdout);
  }
} finally {
  fs.rmSync(scratch, { recursive: true, force: true });
}

testMac9647Profile();

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

function platformWorkspaceName() {
  if (process.platform === "win32") return "workspace with spaces";
  if (process.platform === "darwin" || process.platform === "linux") return 'workspace "quoted"';
  throw new Error(`unsupported platform: ${process.platform}`);
}

function initialFixture() {
  return [
    "let eqa,tqa=t((()=>{Z(),eqa=Iy(Q,({get:e})=>e)}));",
    "function Oks(){let e=(0,jks.c)(12),value=0;return e}",
    "function Nhs(e,t){T.info(`[desktop-notifications] service starting`);",
    "let a=RB(e.getConversation(t.conversationId)),{navigationPath:o,navigateToNotification:s}=h(t.conversationId);return a}",
    "function unreadBadge(e,t,o,r,i){let s=t===`work`?_fr({cloudThreadsAllowed:i,localThreadsAllowed:_F(e(VO)),threadKeys:o}):o;return r+s}",
    "const stockMarkers=[`[desktop-notifications] show question`,`[desktop-notifications] show approval`,`electron-set-badge-count`];",
    "const stockAutomation={unreadRunCount:r};",
    "export const fixture=true;"
  ].join("");
}

function primaryFixture() {
  return [
    "function Fjn(e){let t=(0,Ljn.c)(151),Ot,Rt,Mt,Nt,ft,pt;",
    "ft=qw($Dn,{hostId:qe??`local`,threadId:n})??He?.title??null,pt=qw(gwe,n)??He?.threadSource;",
    "let stockStatus=Ot=je?{type:`loading`}:{type:`idle`};",
    "flag?(Ot=stockStatus):Ot=t[25];let kt=Ot,At;t[26];",
    "Nt=Mt==null?[]:[Mt];",
    "flag?(Rt=1):Rt=t[45];let zt=Rt,Bt;t[46];",
    "let hover={hasUnreadTurn:!Tt&&$e===!0,hasSystemError:kt.type===`error`};return hover}",
    "export const fixture=true;"
  ].join("");
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

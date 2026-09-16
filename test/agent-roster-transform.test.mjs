#!/usr/bin/env node
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const repository = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const patch = path.join(repository, "patches/agent-roster/patch.mjs");
const probe = path.join(repository, "test/agent-roster.test.mjs");
const scratch = fs.mkdtempSync(path.join(os.tmpdir(), "mechanics-toolkit-agent-roster-"));

try {
  const extracted = path.join(scratch, "extracted");
  const assets = path.join(extracted, "webview/assets");
  fs.mkdirSync(assets, { recursive: true });
  const target = path.join(assets, "app-initial-fixture.js");
  fs.writeFileSync(target, [
    "const Q=Symbol(`scope`),tV=Symbol(`projects`),Om=Symbol(`ready`);",
    "const gm=e=>e,Qcs={useEffect(){}},Dm=()=>null;",
    "function Jcs(){let e=(0,Zcs.c)(12),value=0;return e}",
    "export const fixture=true;"
  ].join(""));
  fs.writeFileSync(path.join(assets, "message-bus-fixture.js"),
    "globalThis.__MTK_RUNTIME_JSON_RELOAD__=Object.freeze({version:2});export const fixture=true;");

  assert.equal(run("check").state, "needs-apply");
  const applied = run("apply");
  assert.equal(applied.state, "applied");
  assert.equal(applied.roster, ".codex/agent-roster.json");
  const once = fs.readFileSync(target);
  const text = once.toString("utf8");
  assert.ok(text.includes("function Jcs(){MTKuseAgentRoster();"));
  assert.ok(!text.includes(scratch), "no build-time project root is embedded");

  const behavior = spawnSync(process.execPath, [probe, extracted], { encoding: "utf8" });
  assert.equal(behavior.status, 0, behavior.stderr || behavior.stdout);

  assert.equal(run("apply").state, "applied");
  assert.deepEqual(fs.readFileSync(target), once, "second application is byte-identical");

  fs.writeFileSync(target, [
    "const Q=Symbol(`scope`),tV=Symbol(`projects`),b6=Symbol(`ready`);",
    "const gm=e=>e,Qcs={useEffect(){}},P6=()=>null,hV=wm(Q,()=>{});",
    "function Jcs(){let e=(0,Zcs.c)(12),value=0;return e}",
    "export const fixture=true;"
  ].join(""));
  assert.equal(run("check").state, "needs-apply");
  assert.equal(run("apply").state, "applied");
  const linuxOnce = fs.readFileSync(target);
  const linuxBehavior = spawnSync(process.execPath, [probe, extracted], { encoding: "utf8" });
  assert.equal(linuxBehavior.status, 0, linuxBehavior.stderr || linuxBehavior.stdout);
  assert.equal(run("apply").state, "applied");
  assert.deepEqual(fs.readFileSync(target), linuxOnce, "Linux second application is byte-identical");

  fs.writeFileSync(target, [
    "const Q=Symbol(`scope`),Am=Symbol(`context`),T7r=X(Q,({get:e})=>e),Ym=vm(Q,()=>null);",
    "const qCt={useContext(){},useRef(){},useEffect(){}},Qcs={useEffect(){}};",
    "function Lm(e){let t=(0,qCt.useContext)(Am),n={},r={},i={current:null};",
    "let a={};function o(){}function s(){}function c(){}function l(){}",
    "a.get=o,a.query=Xxt(a),a.set=l,a.watch=s,a.when=c,i.current=a;return i.current}",
    "function Jm(e,t){let n=e.get(Ym);if(n==null)throw Error(`AppServerManager RPC is not connected`);return n.forHost(t)}",
    "const gm=e=>e,tV=Symbol(`mac-projects`),b6=Symbol(`mac-ready`),P6=()=>null,hV=wm(Q,()=>{});",
    "function Jcs(){let e=(0,Zcs.c)(12),t=Lm(Q),value=0;return e}",
    "export const fixture=true;"
  ].join(""));
  assert.equal(run("check").state, "needs-apply");
  assert.equal(run("apply").state, "applied");
  const linux9275 = fs.readFileSync(target, "utf8");
  assert.ok(linux9275.includes("function MTKuseAgentRoster(){let e=Lm(Q);"));
  assert.ok(linux9275.includes("return qCt.useEffect("));
  assert.ok(linux9275.includes("let a=i(T7r);"));
  assert.ok(linux9275.includes("e.get(Ym)==null&&await e.when(({get:e})=>e(Ym)!=null)"));
  assert.ok(linux9275.includes('let n=Jm(e,"local")'));
  for (const macosDecoy of ["let e=gm(Q);", "let a=i(tV);", "e.get(b6)", 'let n=P6(e,"local")']) {
    assert.ok(!linux9275.includes(macosDecoy), `Linux build 9275 excludes ${macosDecoy}`);
  }
  process.stdout.write("agent roster transform probe passed\n");

  function run(action) {
    const result = spawnSync(process.execPath, [patch, action, extracted], { encoding: "utf8" });
    assert.equal(result.status, 0, result.stderr || result.stdout);
    return JSON.parse(result.stdout);
  }
} finally {
  fs.rmSync(scratch, { recursive: true, force: true });
}

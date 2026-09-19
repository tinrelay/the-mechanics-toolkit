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
  fs.writeFileSync(
    path.join(assets, "message-bus-fixture.js"),
    "globalThis.__MTK_RUNTIME_JSON_RELOAD__=Object.freeze({version:2});export const fixture=true;"
  );

  verifyProfile(target, linuxFixture(), [
    "function MTKuseAgentRoster(){let e=xf($);",
    "return Tyl.useEffect(",
    "let a=i(woi);",
    "e.get(ip)==null&&await e.when(({get:e})=>e(ip)!=null)",
    'let n=rp(e,"local")'
  ], "Linux build 9771");

  verifyProfile(target, linux9647Fixture(), [
    "function MTKuseAgentRoster(){let e=tm(Q);",
    "return RYs.useEffect(",
    "let a=i(VFi);",
    "e.get(C_)==null&&await e.when(({get:e})=>e(C_)!=null)",
    'let n=S_(e,"local")'
  ], "Linux build 9647");

  verifyProfile(target, build9922Fixture(), [
    "function MTKuseAgentRoster(){let e=xf($);",
    "return Gvl.useEffect(",
    "let a=i(woi);",
    "e.get(tp)==null&&await e.when(({get:e})=>e(tp)!=null)",
    'let n=ep(e,"local")'
  ], "generic build 9922");

  process.stdout.write("agent roster current-build transform probe passed\n");

  function verifyProfile(target, fixture, expected, label) {
    fs.writeFileSync(target, fixture);
    assert.equal(run("check").state, "needs-apply");
    assert.equal(run("apply").state, "applied");
    const applied = fs.readFileSync(target);
    const text = applied.toString("utf8");
    for (const contract of expected) assert.ok(text.includes(contract), `${label}: ${contract}`);
    assert.ok(!text.includes(scratch), `${label} does not embed the build-time project root`);
    const behavior = spawnSync(process.execPath, [probe, extracted], { encoding: "utf8" });
    assert.equal(behavior.status, 0, behavior.stderr || behavior.stdout);
    assert.equal(run("apply").state, "applied");
    assert.deepEqual(fs.readFileSync(target), applied, `${label} second application is byte-identical`);
  }

  function run(action) {
    const result = spawnSync(process.execPath, [patch, action, extracted], { encoding: "utf8" });
    assert.equal(result.status, 0, result.stderr || result.stdout);
    return JSON.parse(result.stdout);
  }
} finally {
  fs.rmSync(scratch, { recursive: true, force: true });
}

function linuxFixture() {
  return [
    "const $=Symbol(`scope`),woi=of($,({get:e})=>e),ip=nf($,()=>null);",
    "const pNt={useContext(){},useRef(){},useEffect(){}},Tyl={useEffect(){}};",
    "function xf(e){let t=(0,pNt.useContext)(qp),n={},r={},i={current:null};",
    "let a={};function o(){}function s(){}function c(){}function l(){}",
    "a.get=o,a.query=qgt(a),a.set=l,a.watch=s,a.when=c,i.current=a;return i.current}",
    "function rp(e,t){let n=e.get(ip);if(n==null)throw Error(`AppServerManager RPC is not connected`);return n.forHost(t)}",
    "function xyl(){let e=(0,wyl.c)(12),t=xf($),value=0;return e}",
    "export const fixture=true;"
  ].join("");
}

function linux9647Fixture() {
  return [
    "const Q=Symbol(`scope`),qp=Symbol(`context`),VFi=Y(Q,({get:e})=>e),C_=Fp(Q,()=>null);",
    "const pNt={useContext(){},useRef(){},useEffect(){}},RYs={useEffect(){}};",
    "function tm(e){let t=(0,pNt.useContext)(qp),n={},r={},i={current:null};",
    "let a={};function o(){}function s(){}function c(){}function l(){}",
    "a.get=o,a.query=vjt(a),a.set=l,a.watch=s,a.when=c,i.current=a;return i.current}",
    "function S_(e,t){let n=e.get(C_);if(n==null)throw Error(`AppServerManager RPC is not connected`);return n.forHost(t)}",
    "function PYs(){let e=(0,LYs.c)(12),t=tm(Q),value=0;return e}",
    "export const fixture=true;"
  ].join("");
}

function build9922Fixture() {
  return [
    "const $=Symbol(`scope`),woi=sf($,({get:e})=>e),tp=rf($,()=>null);",
    "const Gvl={useEffect(){}},xf=e=>e;",
    "function store(){let a={},i={current:null};function o(){}function s(){}function c(){}function l(){}",
    "a.get=o,a.query=Ggt(a),a.set=l,a.watch=s,a.when=c,i.current=a;return i.current}",
    "function ep(e,t){let n=e.get(tp);if(n==null)throw Error(`AppServerManager RPC is not connected`);return n.forHost(t)}",
    "function Vvl(){let e=(0,Wvl.c)(12),t=xf($),value=0;return e}",
    "export const fixture=true;"
  ].join("");
}

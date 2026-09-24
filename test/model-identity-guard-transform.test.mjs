#!/usr/bin/env node
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const repository = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const toolkit = path.join(repository, "bin/toolkit.mjs");
const probe = path.join(repository, "test/model-identity-guard.test.mjs");
const scratch = fs.mkdtempSync(path.join(os.tmpdir(), "mechanics-toolkit-model-guard-"));

try {
  const extracted = path.join(scratch, "extracted");
  const assets = path.join(extracted, "webview/assets");
  fs.mkdirSync(assets, {recursive: true});
  const palette = path.join(assets, "app-initial-fixture.js");
  const owner = path.join(assets, "app-primary-fixture.js");
  fs.writeFileSync(palette, paletteFixture(false));
  fs.writeFileSync(owner, build9922OwnerFixture());

  assert.equal(run("check").state, "needs-apply");
  const refused = raw("apply");
  assert.notEqual(refused.status, 0, "guard refuses a palette without the exact pin bridge");
  assert.match(refused.stderr, /requires the current task-visual-palette patch first/);

  fs.writeFileSync(palette, paletteFixture(true));
  assert.equal(run("apply").state, "applied");
  const once = fs.readFileSync(owner);
  const behavior = spawnSync(process.execPath, [probe, extracted], {encoding: "utf8"});
  assert.equal(behavior.status, 0, behavior.stderr || behavior.stdout);
  assert.equal(run("apply").state, "applied");
  assert.deepEqual(fs.readFileSync(owner), once, "second application is byte-identical");

  process.stdout.write("model identity guard transform probe passed\n");

  fs.writeFileSync(owner, linux9771OwnerFixture());
  assert.equal(run("check").state, "needs-apply");
  assert.equal(run("apply").state, "applied");
  const linuxOnce = fs.readFileSync(owner);
  const linuxSource = linuxOnce.toString();
  assert.match(linuxSource, /MTKuseModelIdentityGuard\(r,Ce,\$e\)/);
  assert.doesNotMatch(linuxSource, /MTKuseModelIdentityGuard\(r,Te,\$e\)/);
  assert.match(linuxSource, /macDecoy="\$e=\$A\(ie\.reasoningEffort,Ye\),et="/);
  assert.equal(run("apply").state, "applied");
  assert.deepEqual(fs.readFileSync(owner), linuxOnce, "Linux second application is byte-identical");
  process.stdout.write("model identity guard Linux build-9771 transform probe passed\n");

  fs.writeFileSync(owner, linux10954OwnerFixture());
  assert.equal(run("check").state, "needs-apply");
  assert.equal(run("apply").state, "applied");
  const linux10954Once = fs.readFileSync(owner);
  assert.match(linux10954Once.toString(), /MTKuseModelIdentityGuard\(r,Ee,nt\)/);
  assert.match(linux10954Once.toString(), /return y3\.useEffect\(/);
  assert.equal(run("apply").state, "applied");
  assert.deepEqual(fs.readFileSync(owner), linux10954Once,
    "Linux build-10954 second application is byte-identical");

  fs.writeFileSync(owner, linux9647OwnerFixture());
  assert.equal(run("check").state, "needs-apply");
  assert.equal(run("apply").state, "applied");
  const linux9647Once = fs.readFileSync(owner);
  const linux9647Source = linux9647Once.toString();
  assert.match(linux9647Source, /MTKuseModelIdentityGuard\(r,be,Xe\)/);
  assert.doesNotMatch(linux9647Source, /MTKuseModelIdentityGuard\(r,ve,Xe\)/);
  assert.match(linux9647Source, /macDecoy="Xe=TH\(q\.reasoningEffort,Ke\),Ze="/);
  assert.equal(run("apply").state, "applied");
  assert.deepEqual(fs.readFileSync(owner), linux9647Once,
    "Linux build-9647 second application is byte-identical");
  process.stdout.write("model identity guard Linux build-9647 transform probe passed\n");

  fs.writeFileSync(owner, build9922OwnerFixture());
  assert.equal(run("check").state, "needs-apply");
  assert.equal(run("apply").state, "applied");
  const build9922Once = fs.readFileSync(owner);
  assert.match(build9922Once.toString(), /MTKuseModelIdentityGuard\(r,Te,\$e\)/);
  assert.equal(run("apply").state, "applied");
  assert.deepEqual(fs.readFileSync(owner), build9922Once, "build-9922 second application is byte-identical");
  process.stdout.write("model identity guard build-9922 transform probe passed\n");

  fs.writeFileSync(owner, build10789OwnerFixture());
  assert.equal(run("check").state, "needs-apply");
  assert.equal(run("apply").state, "applied");
  const build10789Once = fs.readFileSync(owner);
  assert.match(build10789Once.toString(), /MTKuseModelIdentityGuard\(r,Se,Ze\)/);
  assert.equal(run("apply").state, "applied");
  assert.deepEqual(fs.readFileSync(owner), build10789Once);

  function raw(action) {
    return spawnSync(process.execPath, [toolkit, "patch", "model-identity-guard", action, extracted], {encoding: "utf8"});
  }
  function run(action) {
    const result = raw(action);
    assert.equal(result.status, 0, result.stderr || result.stdout);
    return JSON.parse(result.stdout);
  }
} finally {
  fs.rmSync(scratch, {recursive: true, force: true});
}

function paletteFixture(withBridge) {
  return [
    'const MTKpaletteRelativePath=".codex/task-visual-palette.json";',
    withBridge ? 'function MTKmodelPinForTask(){}function MTKmodelPinSubscribe(){}globalThis.__MTKmodelPinForTask=MTKmodelPinForTask;globalThis.__MTKmodelPinSubscribe=MTKmodelPinSubscribe;' : '',
    'export const fixture=true;'
  ].join("");
}

function linux9771OwnerFixture() {
  return [
    'const C3={useEffect:e=>e()},YA=e=>e;',
    'const selector={"data-codex-intelligence-trigger":true};',
    'function S3(e){let t=(0,AXe.c)(242),r=e.conversationId,Ce=e.model,K={reasoningEffort:e.reasoningEffort},Ye=[];',
    'let $e=YA(K.reasoningEffort,Ye),et=true;return{t,r,Ce,K,$e,et}}',
    'export const macDecoy="$e=$A(ie.reasoningEffort,Ye),et=";'
  ].join("");
}

function linux10954OwnerFixture() {
  return [
    'const y3={useEffect:e=>e()},RM=e=>e;',
    'const selector={"data-codex-intelligence-trigger":true};',
    'function v3(e){let t=(0,aat.c)(242),r=e.conversationId,Ee=e.model,re={reasoningEffort:e.reasoningEffort},Qe=[];',
    'let nt=RM(re.reasoningEffort,Qe),rt=true;return{t,r,Ee,re,nt,rt}}'
  ].join("");
}

function linux9647OwnerFixture() {
  return [
    'const L5={useEffect:e=>e()},OH=e=>e;',
    'const selector={"data-codex-intelligence-trigger":true};',
    'function Hcr(e){let t=(0,$cr.c)(242),r=e.conversationId,be=e.model,Y={reasoningEffort:e.reasoningEffort},Ke=[],Xe=OH(Y.reasoningEffort,Ke),Ze=true;return{t,r,be,Y,Xe,Ze}}',
    'export const macDecoy="Xe=TH(q.reasoningEffort,Ke),Ze=";'
  ].join("");
}

function build9922OwnerFixture() {
  return [
    'const w3={useEffect:e=>e()},$A=e=>e;',
    'const selector={"data-codex-intelligence-trigger":true};',
    'function C3(e){let t=(0,kXe.c)(242),r=e.conversationId,Te=e.model,ie={reasoningEffort:e.reasoningEffort},Ye=[];',
    'let $e=$A(ie.reasoningEffort,Ye),et=true;return{t,r,Te,ie,$e,et}}'
  ].join("");
}

function build10789OwnerFixture() {
  return [
    'const b3={useEffect:e=>e()},HM=e=>e;',
    'const selector={"data-codex-intelligence-trigger":true};',
    'function y3(e){let t=(0,iat.c)(242),r=e.conversationId,Se=e.model,K={reasoningEffort:e.reasoningEffort},qe=[];',
    'let Ze=HM(K.reasoningEffort,qe),Qe=true;return{t,r,Se,K,Ze,Qe}}'
  ].join("");
}

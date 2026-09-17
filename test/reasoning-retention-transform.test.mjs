#!/usr/bin/env node
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const repository = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const toolkit = path.join(repository, "bin/toolkit.mjs");
const probe = path.join(repository, "test/reasoning-retention.test.mjs");
const scratch = fs.mkdtempSync(path.join(os.tmpdir(), "mechanics-toolkit-reasoning-transform-"));

try {
  const extracted = path.join(scratch, "extracted");
  const assets = path.join(extracted, "webview/assets");
  fs.mkdirSync(assets, {recursive: true});
  const roster = path.join(assets, "app-initial-fixture.js");
  const turn = path.join(assets, "local-conversation-turn-fixture.js");
  const thread = path.join(assets, "local-conversation-thread-fixture.js");
  const activity = path.join(assets, "subagent-activity-chip-group-fixture.js");
  fs.writeFileSync(roster, rosterFixture());
  fs.writeFileSync(turn, build9647TurnFixture());
  fs.writeFileSync(thread, build9647ThreadFixture());
  fs.writeFileSync(activity, build9647CollapseFixture());

  assert.equal(run("check").state, "needs-apply");
  assert.equal(run("apply").state, "applied");
  const once = [roster, turn, thread, activity].map(file => fs.readFileSync(file));

  const result = spawnSync(process.execPath, [probe, extracted], {encoding: "utf8"});
  assert.equal(result.status, 0, result.stderr || result.stdout);

  assert.equal(run("apply").state, "applied");
  for (const [index, file] of [roster, turn, thread, activity].entries()) {
    assert.deepEqual(fs.readFileSync(file), once[index], `${path.basename(file)} second application is byte-identical`);
  }
  process.stdout.write("reasoning retention transform probe passed\n");

  fs.writeFileSync(turn, linux9647TurnFixture());
  fs.writeFileSync(thread, linux9647ThreadFixture());
  fs.writeFileSync(activity, linux9647CollapseFixture());
  assert.equal(run("check").state, "needs-apply");
  assert.equal(run("apply").state, "applied");
  const linuxOnce = [roster, turn, thread, activity].map(file => fs.readFileSync(file));
  assert.match(fs.readFileSync(turn, "utf8"), /MTKuseReasoningRetention\(l\).*preventAutoCollapse:St\|\|ir\|\|MTKreasoningRetained/);
  assert.doesNotMatch(fs.readFileSync(turn, "utf8"), /preventAutoCollapse:Ct\|\|ir\|\|MTKreasoningRetained/);
  assert.match(fs.readFileSync(thread, "utf8"), /gA\(b,\{conversationId:e,turnSearchKey:t\},!0\);Ge\.current=le/);
  assert.match(fs.readFileSync(thread, "utf8"), /gA\(y,\{conversationId:e,turnSearchKey:t\},!0\);Ve\.current=le/);
  assert.doesNotMatch(fs.readFileSync(thread, "utf8"), /MTKreasoningThreadRetained\)for\(let t of i\)gA\(y/);
  assert.equal(run("apply").state, "applied");
  for (const [index, file] of [roster, turn, thread, activity].entries()) {
    assert.deepEqual(fs.readFileSync(file), linuxOnce[index], `${path.basename(file)} Linux second application is byte-identical`);
  }
  process.stdout.write("reasoning retention Linux build-9647 transform probe passed\n");

  function run(action) {
    const result = spawnSync(process.execPath, [toolkit, "patch", "reasoning-retention", action, extracted], {encoding: "utf8"});
    assert.equal(result.status, 0, result.stderr || result.stdout);
    return JSON.parse(result.stdout);
  }
} finally {
  fs.rmSync(scratch, {recursive: true, force: true});
}

function rosterFixture() {
  return 'globalThis.__MTK_AGENT_ROSTER__=Object.freeze({});export const fixture=true;';
}

function build9647TurnFixture() {
  return [
    'const Ha={useSyncExternalStore(){return false}},I=()=>null;',
    'function Z(e){let t=(0,Ba.c)(182),{conversationId:l,turn:v}=e,L="turn",xt=L==null?void 0:Ra(l,L);',
    'let R=xt,Ct=I(Ir,R);return {preventAutoCollapse:Ct||ir}}',
    'export const fixture=true;'
  ].join("");
}

function build9647ThreadFixture() {
  return [
    'const wM={useEffect(){},useSyncExternalStore(){return false}},_s=()=>({}),qn={},gA=()=>{};',
    'function bM({conversationId:e,isBackgroundSubagentsEnabled:l,usesUnifiedTimeline:v}){let y=_s(qn),le=null,fe=[],Ve={current:null};',
    '(0,wM.useEffect)(()=>{let i=new Set;for(let t of i)gA(y,{conversationId:e,turnSearchKey:t},!0);Ve.current=le},[e,l,le,y,fe]);return v}',
    'export const fixture=true;'
  ].join("");
}

function build9647CollapseFixture() {
  return [
    'function pk({hasFinalAssistantStarted:e,isTurnCancelled:t,hasRenderableAgentItems:n,forceExpanded:r=!1,preventAutoCollapse:i,persistedCollapsed:a}){return e&&!t&&n?{shouldAllowCollapse:!0,isCollapsed:!r&&(a??!i)}:{shouldAllowCollapse:!1,isCollapsed:!1}}',
    'function toggle(){let K=false,M={current:null},d=null,A=()=>{};return {onToggle:e=>{let t=!K;if(M.current=e,d==null){A(t);return}d(t)}}}',
    'export{pk,toggle};'
  ].join("");
}

function linux9647TurnFixture() {
  return [
    'const K={useSyncExternalStore(){return false}},H=()=>null;',
    'function Z(e){let t=(0,Ba.c)(182),{conversationId:l,turn:v}=e,L="turn",yt=L==null?void 0:Ra(l,L);',
    'let R=yt,St=H(Ir,R);return {preventAutoCollapse:St||ir}}',
    'export const macDecoy="preventAutoCollapse:Ct||ir";'
  ].join("");
}

function linux9647ThreadFixture() {
  return [
    'const wM={useEffect(){},useSyncExternalStore(){return false}},Sc=()=>({}),Hc={},gA=()=>{};',
    'function bM({conversationId:e,isBackgroundSubagentsEnabled:l,usesUnifiedTimeline:y}){let b=Sc(Hc),le=null,fe=[],Ge={current:null};',
    '(0,wM.useEffect)(()=>{let i=new Set;for(let t of i)gA(b,{conversationId:e,turnSearchKey:t},!0);Ge.current=le},[e,l,le,b,fe]);return y}',
    'export const macDecoy="for(let t of i)gA(y,{conversationId:e,turnSearchKey:t},!0);Ve.current=le";'
  ].join("");
}

function linux9647CollapseFixture() {
  return [
    'function pk({hasFinalAssistantStarted:e,isTurnCancelled:t,hasRenderableAgentItems:n,forceExpanded:r=!1,preventAutoCollapse:i,persistedCollapsed:a}){return e&&!t&&n?{shouldAllowCollapse:!0,isCollapsed:!r&&(a??!i)}:{shouldAllowCollapse:!1,isCollapsed:!1}}',
    'function toggle(){let J=false,M={current:null},d=null,A=()=>{};return {onToggle:e=>{let t=!J;if(M.current=e,d==null){A(t);return}d(t)}}}',
    'export{pk,toggle};'
  ].join("");
}

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
  fs.writeFileSync(turn, linux9771TurnFixture());
  fs.writeFileSync(thread, linux9771ThreadFixture());
  fs.writeFileSync(activity, linux9771CollapseFixture());

  assert.equal(run("check").state, "needs-apply");
  assert.equal(run("apply").state, "applied");
  const once = [roster, turn, thread, activity].map(file => fs.readFileSync(file));

  const result = spawnSync(process.execPath, [probe, extracted], {encoding: "utf8"});
  assert.equal(result.status, 0, result.stderr || result.stdout);

  assert.equal(run("apply").state, "applied");
  for (const [index, file] of [roster, turn, thread, activity].entries()) {
    assert.deepEqual(fs.readFileSync(file), once[index], `${path.basename(file)} second application is byte-identical`);
  }
  assert.match(fs.readFileSync(turn, "utf8"), /MTKuseReasoningRetention\(c\).*preventAutoCollapse:Ge\|\|In\|\|MTKreasoningRetained/);
  assert.match(fs.readFileSync(thread, "utf8"), /!MTKreasoningThreadRetained&&Fk\(y,\{conversationId:e,turnSearchKey:n\},!0\)/);
  process.stdout.write("reasoning retention Linux build-9771 transform probe passed\n");

  fs.writeFileSync(turn, linux10954TurnFixture());
  fs.writeFileSync(thread, linux10954ThreadFixture());
  fs.writeFileSync(activity, linux10954CollapseFixture());
  assert.equal(run("check").state, "needs-apply");
  assert.equal(run("apply").state, "applied");
  const linux10954Once = [roster, turn, thread, activity].map(file => fs.readFileSync(file));
  assert.match(fs.readFileSync(turn, "utf8"), /return z\(\)\.useSyncExternalStore\(/);
  assert.match(fs.readFileSync(turn, "utf8"),
    /MTKuseReasoningRetention\(s\).*preventAutoCollapse:Ue\|\|In\|\|MTKreasoningRetained/);
  assert.match(fs.readFileSync(thread, "utf8"),
    /!MTKreasoningThreadRetained&&fA\(S,\{conversationId:e,turnSearchKey:n\},!0\)/);
  assert.equal(run("apply").state, "applied");
  for (const [index, file] of [roster, turn, thread, activity].entries()) {
    assert.deepEqual(fs.readFileSync(file), linux10954Once[index],
      `${path.basename(file)} Linux build-10954 second application is byte-identical`);
  }
  process.stdout.write("reasoning retention Linux build-10954 transform probe passed\n");

  fs.writeFileSync(turn, linux9647TurnFixture());
  fs.writeFileSync(thread, linux9647ThreadFixture());
  fs.writeFileSync(activity, linux9647CollapseFixture());
  assert.equal(run("check").state, "needs-apply");
  assert.equal(run("apply").state, "applied");
  const linux9647Once = [roster, turn, thread, activity].map(file => fs.readFileSync(file));
  assert.match(fs.readFileSync(turn, "utf8"),
    /MTKuseReasoningRetention\(l\).*preventAutoCollapse:St\|\|ir\|\|MTKreasoningRetained/);
  assert.match(fs.readFileSync(thread, "utf8"),
    /gA\(b,\{conversationId:e,turnSearchKey:t\},!0\);Ge\.current=le/);
  assert.match(fs.readFileSync(thread, "utf8"),
    /gA\(y,\{conversationId:e,turnSearchKey:t\},!0\);Ve\.current=le/);
  assert.equal(run("apply").state, "applied");
  for (const [index, file] of [roster, turn, thread, activity].entries()) {
    assert.deepEqual(fs.readFileSync(file), linux9647Once[index],
      `${path.basename(file)} Linux build-9647 second application is byte-identical`);
  }
  process.stdout.write("reasoning retention Linux build-9647 transform probe passed\n");

  fs.writeFileSync(turn, build9922TurnFixture());
  fs.writeFileSync(thread, build9922ThreadFixture());
  fs.writeFileSync(activity, build9922CollapseFixture());
  assert.equal(run("check").state, "needs-apply");
  assert.equal(run("apply").state, "applied");
  const build9922Once = [roster, turn, thread, activity].map(file => fs.readFileSync(file));
  assert.match(fs.readFileSync(turn, "utf8"), /MTKuseReasoningRetention\(d\).*preventAutoCollapse:Ke\|\|Pn\|\|MTKreasoningRetained/);
  assert.match(fs.readFileSync(thread, "utf8"), /n!=null&&n!==ue&&!fj\(r\)&&!MTKreasoningThreadRetained&&Fk\(b,\{conversationId:e,turnSearchKey:n\},!0\)/);
  verifyBuild9922ThreadGuard(fs.readFileSync(thread, "utf8"));
  assert.equal(run("apply").state, "applied");
  for (const [index, file] of [roster, turn, thread, activity].entries()) {
    assert.deepEqual(fs.readFileSync(file), build9922Once[index], `${path.basename(file)} build-9922 second application is byte-identical`);
  }
  process.stdout.write("reasoning retention build-9922 transform probe passed\n");

  fs.writeFileSync(turn, build10789TurnFixture());
  fs.writeFileSync(thread, build10789ThreadFixture());
  fs.writeFileSync(activity, build10789CollapseFixture());
  assert.equal(run("check").state, "needs-apply");
  assert.equal(run("apply").state, "applied");
  const build10789Once = [roster, turn, thread, activity].map(file => fs.readFileSync(file));
  assert.match(fs.readFileSync(turn, "utf8"), /return de\(\)\.useSyncExternalStore\(/,
    "build-10789 turn hook uses the stock React provider, not the non-React Al binding");
  assert.match(fs.readFileSync(turn, "utf8"), /MTKuseReasoningRetention\(c\).*preventAutoCollapse:Ue\|\|zn\|\|MTKreasoningRetained/);
  assert.match(fs.readFileSync(thread, "utf8"), /!MTKreasoningThreadRetained&&fA\(x,\{conversationId:e,turnSearchKey:n\},!0\)/);
  assert.equal(run("apply").state, "applied");
  for (const [index, file] of [roster, turn, thread, activity].entries()) {
    assert.deepEqual(fs.readFileSync(file), build10789Once[index]);
  }

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

function linux9771TurnFixture() {
  return [
    'const _l={useSyncExternalStore(){return false}},q=()=>null;',
    'function Uc(e){let t=(0,hl.c)(189),{conversationId:c}=e,Ue="turn";',
    'let We=Ue,Ge=q(Dt,We),In=false;return {preventAutoCollapse:Ge||In}}',
    'export const fixture=true;'
  ].join("");
}

function linux9771ThreadFixture() {
  return [
    'const hj={useEffect(){},useSyncExternalStore(){return false}},Ai=()=>({}),Td={},Fk=()=>{},fj=()=>false;',
    'function dj({conversationId:e,isBackgroundSubagentsEnabled:c,usesUnifiedTimeline:v}){let y=Ai(Td),fe=null,Y=[],qe={current:null},r=null;',
    '(0,hj.useEffect)(()=>{let n="turn";n!=null&&n!==fe&&!fj(r)&&Fk(y,{conversationId:e,turnSearchKey:n},!0),qe.current=fe},[e,c,fe,y,Y]);return v}',
    'export const fixture=true;'
  ].join("");
}

function linux9771CollapseFixture() {
  return [
    'function pk({hasFinalAssistantStarted:e,isTurnCancelled:t,hasRenderableAgentItems:n,forceExpanded:r=!1,preventAutoCollapse:i,persistedCollapsed:a}){return e&&!t&&n?{shouldAllowCollapse:!0,isCollapsed:!r&&(a??!i)}:{shouldAllowCollapse:!1,isCollapsed:!1}}',
    'function toggle(){let ae=false,M={current:null},d=null,A=()=>{};return {onToggle:e=>{let t=!ae;if(M.current=e,d==null){A(t);return}d(t)}}}',
    'export{pk,toggle};'
  ].join("");
}

function linux10954TurnFixture() {
  return [
    'const z=()=>({useSyncExternalStore(){return false}}),x=()=>null;',
    'function rl(e){let t=(0,kl.c)(189),{conversationId:s,hostId:c}=e,Ve="turn";',
    'let He=Ve,Ue=x(ut,He),In=false;return {preventAutoCollapse:Ue||In}}',
    'export const fixture=true;'
  ].join("");
}

function linux10954ThreadFixture() {
  return [
    'const Vj={useEffect(){},useSyncExternalStore(){return false}},ge=()=>({get(){return[]}}),sa={},fA=()=>{},Rj=()=>false,rd={};',
    'function Lj({conversationId:e,isBackgroundSubagentsEnabled:u,usesUnifiedTimeline:x}){let S=ge(sa),fe="turn",X=[],We={current:"turn"};',
    '(0,Vj.useEffect)(()=>{let t=S.get(rd,{conversationId:e,isBackgroundSubagentsEnabled:u}).visibleTurnEntries,n=We.current,r=t.find(e=>e.turnId===n);n!=null&&n!==fe&&!Rj(r)&&fA(S,{conversationId:e,turnSearchKey:n},!0),We.current=fe},[e,u,fe,S,X]);return x}',
    'export const fixture=true;'
  ].join("");
}

function linux10954CollapseFixture() {
  return [
    'function Ww({hasFinalAssistantStarted:e,isTurnCancelled:t,hasRenderableAgentItems:n,forceExpanded:r=!1,preventAutoCollapse:i,persistedCollapsed:a}){return e&&!t&&n?{shouldAllowCollapse:!0,isCollapsed:!r&&(a??!i)}:{shouldAllowCollapse:!1,isCollapsed:!1}}',
    'function toggle(){let G=false,N={current:null},f=null,j=()=>{};return {onToggle:e=>{let t=!G;if(N.current=e,f==null){j(t);return}f(t)}}}',
    'export{Ww,toggle};'
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

function build9922TurnFixture() {
  return [
    'const _l={useSyncExternalStore(){return false}},J=()=>null;',
    'function Uc(e){let t=(0,hl.c)(189),{conversationId:d}=e,We="turn";',
    'let Ge=We,Ke=J(Be,Ge),Pn=false;return {preventAutoCollapse:Ke||Pn}}',
    'export const fixture=true;'
  ].join("");
}

function build9922ThreadFixture() {
  return [
    'const hj={useEffect(){},useSyncExternalStore(){return false}},ju=()=>({get(){return[]}}),il={},Fk=()=>{},fj=()=>false,mf={};',
    'function dj({conversationId:e,isBackgroundSubagentsEnabled:c,usesUnifiedTimeline:y}){let b=ju(il),ue="turn",fe=[],Ke={current:"turn"};',
    '(0,hj.useEffect)(()=>{let t=b.get(mf,{conversationId:e,isBackgroundSubagentsEnabled:c}),n=Ke.current,r=t.find(e=>e.turnId===n);n!=null&&n!==ue&&!fj(r)&&Fk(b,{conversationId:e,turnSearchKey:n},!0),Ke.current=ue},[e,c,ue,b,fe]);return y}',
    'export const fixture=true;'
  ].join("");
}

function verifyBuild9922ThreadGuard(source) {
  const start = source.indexOf("n!=null&&n!==ue&&!fj(r)&&");
  const end = source.indexOf(",Ke.current=ue", start);
  assert.ok(start >= 0 && end > start, "build-9922 thread auto-collapse guard seam");
  const guard = Function(
    "n", "ue", "r", "MTKreasoningThreadRetained", "Fk", "fj", "b", "e",
    `${source.slice(start, end)};`
  );
  let collapses = 0;
  const Fk = () => { collapses += 1; };
  const fj = () => false;
  guard("turn", "turn", null, true, Fk, fj, {}, "task");
  assert.equal(collapses, 0, "an opted-in completed turn does not collapse when its ID is unchanged");
  guard("previous", "current", {}, true, Fk, fj, {}, "task");
  assert.equal(collapses, 0, "an opted-in previous turn does not auto-collapse when a new turn starts");
  guard("previous", "current", {}, false, Fk, fj, {}, "task");
  assert.equal(collapses, 1, "an ordinary previous turn retains stock auto-collapse behavior");
}

function build9922CollapseFixture() {
  return [
    'function NT({hasFinalAssistantStarted:e,isTurnCancelled:t,hasRenderableAgentItems:n,forceExpanded:r=!1,preventAutoCollapse:i,persistedCollapsed:a}){return e&&!t&&n?{shouldAllowCollapse:!0,isCollapsed:!r&&(a??!i)}:{shouldAllowCollapse:!1,isCollapsed:!1}}',
    'function toggle(){let ne=false,M={current:null},d=null,A=()=>{};return {onToggle:e=>{let t=!ne;if(M.current=e,d==null){A(t);return}d(t)}}}',
    'export{NT,toggle};'
  ].join("");
}

function build10789TurnFixture() {
  return [
    'const Al={},de=()=>({useSyncExternalStore(){return false}}),Ao=de(),o=()=>null;',
    'function rl(e){let t=(0,kl.c)(189),{conversationId:c}=e,Ve="turn";',
    'let He=Ve,Ue=o(Pt,He),zn=false;return {preventAutoCollapse:Ue||zn}}',
    'export const fixture=true;'
  ].join("");
}

function build10789ThreadFixture() {
  return [
    'const Vj={useEffect(){},useSyncExternalStore(){return false}},J=()=>({get(){return[]}}),Gn={},fA=()=>{},Rj=()=>false,Xu={};',
    'function Lj({conversationId:e,isBackgroundSubagentsEnabled:l,usesUnifiedTimeline:b}){let x=J(Gn),fe="turn",he=[],qe={current:"turn"};',
    '(0,Vj.useEffect)(()=>{let t=x.get(Xu,{conversationId:e,isBackgroundSubagentsEnabled:l}).visibleTurnEntries,n=qe.current,r=t.find(e=>e.turnId===n);n!=null&&n!==fe&&!Rj(r)&&fA(x,{conversationId:e,turnSearchKey:n},!0),qe.current=fe},[e,l,fe,x,he]);return b}',
    'export const fixture=true;'
  ].join("");
}

function build10789CollapseFixture() {
  return [
    'function Gw({hasFinalAssistantStarted:e,isTurnCancelled:t,hasRenderableAgentItems:n,forceExpanded:r=!1,preventAutoCollapse:i,persistedCollapsed:a}){return e&&!t&&n?{shouldAllowCollapse:!0,isCollapsed:!r&&(a??!i)}:{shouldAllowCollapse:!1,isCollapsed:!1}}',
    'function toggle(){let ie=false,N={current:null},f=null,j=()=>{};return {onToggle:e=>{let t=!ie;if(N.current=e,f==null){j(t);return}f(t)}}}',
    'export{Gw,toggle};'
  ].join("");
}

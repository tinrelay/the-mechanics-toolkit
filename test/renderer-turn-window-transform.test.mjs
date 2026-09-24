#!/usr/bin/env node
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const repository = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const toolkit = path.join(repository, "bin/toolkit.mjs");
const probe = path.join(repository, "test/renderer-turn-window.test.mjs");
const scratch = fs.mkdtempSync(path.join(os.tmpdir(), "mechanics-toolkit-renderer-window-"));

try {
  const extracted = path.join(scratch, "extracted");
  const assets = path.join(extracted, "webview/assets");
  fs.mkdirSync(assets, { recursive: true });
  const app = path.join(assets, "app-initial-fixture.js");
  const local = path.join(assets, "local-conversation-thread-fixture.js");
  fs.writeFileSync(app, build9647AppFixture());
  fs.writeFileSync(local, localFixture("qCs"));

  assert.equal(run("check").state, "needs-apply");
  assert.equal(run("apply").state, "applied");
  const once = [fs.readFileSync(app), fs.readFileSync(local)];
  const behavior = spawnSync(process.execPath, [probe, extracted], { encoding: "utf8" });
  assert.equal(behavior.status, 0, behavior.stderr || behavior.stdout);
  const evidence = JSON.parse(behavior.stdout);
  assert.equal(evidence.nativeTurnLimit, 200);
  assert.equal(evidence.longTaskMaterializations, 200);
  assert.equal(evidence.parentAndCurrentShareLimit, true);
  assert.equal(evidence.transcriptExportScope, "full");

  assert.equal(run("apply").state, "applied");
  assert.deepEqual(fs.readFileSync(app), once[0], "app selector is byte-identical after second application");
  assert.deepEqual(fs.readFileSync(local), once[1], "renderer is byte-identical after second application");

  fs.writeFileSync(app, upstreamAppFixture());
  fs.writeFileSync(local, localFixture("gLo"));
  const stockBefore = [fs.readFileSync(app), fs.readFileSync(local)];
  assert.equal(run("check").state, "upstream-owned");
  assert.equal(run("apply").state, "upstream-owned");
  assert.deepEqual(fs.readFileSync(app), stockBefore[0], "upstream-owned selector is read-only");
  assert.deepEqual(fs.readFileSync(local), stockBefore[1], "upstream-owned renderer is read-only");
  const stockProbe = spawnSync(process.execPath, [probe, extracted], { encoding: "utf8" });
  assert.equal(stockProbe.status, 0, stockProbe.stderr || stockProbe.stdout);
  assert.equal(JSON.parse(stockProbe.stdout).ownership, "upstream-paginated-renderer");

  fs.writeFileSync(app, upstream10789Fixture());
  fs.writeFileSync(local, localFixture("Qjs"));
  const frontierBefore = [fs.readFileSync(app), fs.readFileSync(local)];
  assert.equal(run("check").state, "upstream-owned");
  assert.equal(run("apply").state, "upstream-owned");
  assert.deepEqual(fs.readFileSync(app), frontierBefore[0]);
  assert.deepEqual(fs.readFileSync(local), frontierBefore[1]);

  fs.writeFileSync(app, upstreamAppFixture().replace("thread/turns/list", "thread/turns/missing"));
  fs.writeFileSync(local, localFixture("gLo"));
  const partial = spawnSync(process.execPath,
    [toolkit, "patch", "renderer-turn-window", "check", extracted], { encoding: "utf8" });
  assert.notEqual(partial.status, 0, "partial upstream ownership fails closed");

  process.stdout.write("renderer turn window transform probe passed\n");

  function run(action) {
    const result = spawnSync(process.execPath,
      [toolkit, "patch", "renderer-turn-window", action, extracted], { encoding: "utf8" });
    assert.equal(result.status, 0, result.stderr || result.stdout);
    return JSON.parse(result.stdout);
  }
} finally {
  fs.rmSync(scratch, { recursive: true, force: true });
}

function build9647AppFixture() {
  return [
    "const Q=Symbol('scope'),eN={},lN={},NOr={},pN={},bN={},cU={},lU={},uU={},sU={},tfs=[],nfs=[];",
    "function init(e){return e}function factory(e,t){return t}",
    "function gRi(e,t){return t}function Aer(e){return e}function Uds(e){return e}function Bds(e){return e}function fpo(e){return e}function output(e){return e}",
    "var before,qCs,after=init((()=>{qCs=factory(Q,({conversationId:e,isBackgroundSubagentsEnabled:t},{get:n})=>{",
    "if(e==null)return{visibleTurnEntries:[]};let i=n(eN,e)??!1,a=n(lN,e)??tfs;n(NOr,e);let o=t?n(pN,e)??null:null,",
    "s={hostId:n(bN,e),threadId:e},c=null,l=fpo(c),u=null,d=fpo(u),f=n(cU,s),",
    "p=f?.flatMap(e=>{n(lU,e)?.status,n(uU,e);let i=gRi(r,e);if(i==null)return[];i.turnId;let a=Aer(i,[],{isAeonThread:!1,isBackgroundSubagentsEnabled:t,shouldHideUserMessage:void 0});if(!a)for(let t of i.items)t!=null&&!a&&n(sU,{...e,itemId:t.id});return[i]})??nfs,",
    "m=l?.length===p.length&&(o==null||d!=null)&&!0,h=m&&o!=null&&l!=null&&c!=null&&d!=null&&u!=null?Bds({conversationId:e,getTurn:(e,t)=>gRi(r,{hostId:n(bN,e),threadId:e,entityKey:t}),historyEntries:l,historyTimeline:c,parentConversationId:o,parentHistoryEntries:d,parentHistoryTimeline:u}):void 0,",
    "g=n(cU,o==null?null:{hostId:n(bN,o),threadId:o}),_=o!=null&&h==null?g?.flatMap(e=>{let t=gRi(r,e);return t==null?[]:[t]})??nfs:nfs;",
    "return Uds({conversationRequests:a,isAeonThread:!1,visibleTurnEntries:p,historyTimeline:c,parentConversationTurns:_,",
    "turnEntityKeys:f?.map(({entityKey:e})=>e)})});return qCs})());",
    "async function renderMarkdown(client,{conversationId:e,isBackgroundSubagentsEnabled:t,markdownLimit:m}){",
    "let {visibleTurnEntries:v}=client.get(qCs,{conversationId:e,isBackgroundSubagentsEnabled:t});return output(v)}",
    "function loadOlderConversationHistoryPage(){}",
    "const request={initialTurnsPage:{limit:5}},endpoint='thread/turns/list';"
  ].join("");
}

function upstreamAppFixture() {
  return [
    "const Q=Symbol('scope'),II={},zI={};function Iy(e,t){return t}",
    "const gLo=Iy(Q,({conversationId:e,isBackgroundSubagentsEnabled:t},{get:n})=>{",
    "let a=null,o={hostId:n(zI,e),threadId:e},d=n(II,o),f=d?.flatMap(x=>x),m=null,",
    "h=n(II,a==null?null:{hostId:n(zI,a),threadId:a}),g=a!=null&&m==null?h?.flatMap(x=>x):null;",
    "return {visibleTurnEntries:f,historyTimeline:g,turnEntityKeys:d?.map(({entityKey:e})=>e)}});",
    "function loadOlderConversationHistoryPage(){}",
    "const request={initialTurnsPage:{limit:5,itemsView:`full`,sortDirection:`desc`}},",
    "endpoint='thread/turns/list';"
  ].join("");
}

function upstream10789Fixture() {
  return [
    "const X=Symbol('scope'),bR={},FE={};function ns(e,t){return t}",
    "const Qjs=ns(X,({conversationId:e,isBackgroundSubagentsEnabled:t},{get:n,scope:r})=>{",
    "let o=null,s={hostId:n(FE,e),threadId:e},f=n(bR,s),p=f?.flatMap(x=>x),h=null,",
    "g=o==null?null:{hostId:n(FE,o),threadId:o},_=n(bR,g),v=o!=null&&h==null?_?.flatMap(x=>x):null;",
    "return {visibleTurnEntries:p,historyTimeline:v,turnEntityKeys:f?.map(({entityKey:e})=>e)}});",
    "function loadOlderConversationHistoryPage(){}",
    "const request={initialTurnsPage:{limit:5,itemsView:`full`,sortDirection:`desc`}},",
    "endpoint='thread/turns/list';"
  ].join("");
}

function localFixture(selector) {
  return [
    "function use(e,t){return {visibleTurnEntries:[]}}",
    `function localConversation(e,t){let a=use(${selector},{conversationId:e,isBackgroundSubagentsEnabled:t}),`,
    `b=use(${selector},{conversationId:e,isBackgroundSubagentsEnabled:t}),`,
    `c=use(${selector},{conversationId:e,isBackgroundSubagentsEnabled:t}),`,
    `d=use(${selector},{conversationId:e,isBackgroundSubagentsEnabled:t});`,
    "function loadOlderConversationHistoryPage(){}",
    "return {renderEntries:[a,b,c,d],visibleTurnEntries:a.visibleTurnEntries,",
    "searchPersisted:true,getConversationState:()=>a}}"
  ].join("");
}

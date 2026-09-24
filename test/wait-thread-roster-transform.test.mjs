#!/usr/bin/env node
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const repository = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const toolkit = path.join(repository, "bin/toolkit.mjs");
const behavioralProbe = path.join(repository, "test/wait-thread-roster.test.mjs");
runFixture("linux-9771", initialFixture(), /Bpn as MTKwaitStoreScope/);
runFixture("linux-9647", linux9647InitialFixture(), /q as MTKwaitStoreScope/);
runFixture("macos-10789", build10789InitialFixture(), /ZI as MTKwaitStoreScope/, true);
process.stdout.write("wait-thread roster transform probe passed\n");

function runFixture(label, initialSource, expectedScope, splitStore = false) {
  const scratch = fs.mkdtempSync(path.join(os.tmpdir(), `mechanics-toolkit-wait-roster-${label}-`));
  try {
  const extracted = path.join(scratch, "extracted");
  const assets = path.join(extracted, "webview/assets");
  fs.mkdirSync(assets, {recursive: true});
  const initialTarget = path.join(assets, "app-initial-fixture.js");
  const ownerTarget = path.join(assets, "agent-activity-item-fixture.js");
  fs.writeFileSync(initialTarget, initialSource);
  if (splitStore) fs.writeFileSync(path.join(assets, "app-shared-fixture.js"),
    "const LX=e=>e,ZI=Symbol(`scope`);export{LX,ZI};");
  fs.writeFileSync(ownerTarget, ownerFixture(splitStore));

  assert.equal(runToolkit("check").state, "needs-apply");
  const applied = runToolkit("apply");
  assert.equal(applied.state, "applied");
  assert.deepEqual(applied.targets, [path.join("webview", "assets", "agent-activity-item-fixture.js")]);
  const once = fs.readFileSync(ownerTarget);
  assert.match(once.toString(), expectedScope, `${label} imports the task selector's scope`);

  const probe = spawnSync(process.execPath, [behavioralProbe, extracted], {encoding: "utf8"});
  assert.equal(probe.status, 0, probe.stderr || probe.stdout);

  assert.equal(runToolkit("apply").state, "applied");
  assert.deepEqual(fs.readFileSync(ownerTarget), once, "second application is byte-identical");

  for (const partial of [
    once.toString().replace("cursor-pointer rounded-sm", "rounded-sm"),
    once.toString().replace("rounded-sm align-baseline", "rounded-sm"),
    once.toString().replace("function MTKwaitLabelColor(", "function MTKwaitLabelColorMissing(")
  ]) {
    fs.writeFileSync(ownerTarget, partial);
    const rejected = spawnSync(process.execPath, [toolkit, "patch", "wait-thread-roster", "check", extracted], {encoding: "utf8"});
    assert.notEqual(rejected.status, 0, "partial current wait-roster state fails closed");
    fs.writeFileSync(ownerTarget, once);
  }

  assert.deepEqual(fs.readFileSync(initialTarget), Buffer.from(initialSource),
    "task metadata owner stays untouched");

  function runToolkit(action) {
    const result = spawnSync(process.execPath, [toolkit, "patch", "wait-thread-roster", action, extracted], {encoding: "utf8"});
    assert.equal(result.status, 0, result.stderr || result.stdout);
    return JSON.parse(result.stdout);
  }
  } finally {
    fs.rmSync(scratch, {recursive: true, force: true});
  }
}

function initialFixture() {
  return [
    "const x=0,$=Symbol(`scope`);",
    "function xf(e){return e}",
    "function cT(e){return `local:${e}`}",
    "function lT(e){return `remote:${e}`}",
    "const lf=(...e)=>e,JF=lf($,0);",
    "function xyl(){}",
    "export{x as x,xf as kmn,$ as Bpn,JF as task,cT as local,lT as remote};"
  ].join("");
}

function linux9647InitialFixture() {
  return [
    "const x=0,Q=Symbol(`scope`),qp=Symbol(`context`),pNt={useContext(){}};",
    "function tm(e){let t=(0,pNt.useContext)(qp),n={};return e}",
    "function jj(e){return `local:${e}`}",
    "function Mj(e){return `remote:${e}`}",
    "const Vp=(...e)=>e,AH=Vp(Q,0);",
    "function PYs(){}",
    "export{x as x,tm as h,Q as q,AH as task,jj as local,Mj as remote};"
  ].join("");
}

function build10789InitialFixture() {
  return [
    'import{LX as jr,ZI as X}from"./app-shared-fixture.js";',
    "const x=0;function Hw(e){return `local:${e}`}function Uw(e){return `remote:${e}`}",
    "const ns=(...e)=>e,OF=ns(X,0);function Bzc(){}",
    "const eo=(...e)=>e,fE=0,vE=eo(X,({hostId:e,conversationId:t},{get:n})=>n(fE,e)?.getThreadSummary(t)??null,0);",
    "export{x as x,OF as task,Hw as local,Uw as remote,vE as summary};"
  ].join("");
}

function ownerFixture(splitStore = false) {
  return [
    'import{x as P}from"./app-initial-fixture.js";',
    ...(splitStore ? ['import{LX as hook,ZI as scope}from"./app-shared-fixture.js";'] : []),
    "const L=0,Send=0,X={jsx(){},jsxs(){}},C=`container`,j=`spinner`,ye=`summary`;",
    "const F=(...e)=>e.filter(Boolean).join(` `),J=()=>`tool-icon`,ee=e=>`normalized:${e}`;",
    "const _={dispatchHostMessage(){}},Oe=()=>!1,m=e=>`/new/${e}`,te=e=>`/local/${e}`;",
    "function Kt(e){switch(e.tool){case Send:return e.completed?`threadsSendMessageCompleted`:`threadsSendMessageActive`;case 1:return`threadsReadActive`}}",
    "function Y(e,t,n,r=!0){let i=Kt(e);if(i==null)return null;let a=r?i:i,o=e.tool===`create_thread`&&e.completed&&e.success===!0&&t===`row`?null:null,s=t===`row`&&(e.tool===`read_thread`||e.tool===`send_message_to_thread`)?{success:!1}:null,c=s?.success===!0?s.data.threadId:null,l=t===`row`&&n!==void 0,u=l?`summary-text`:t,d=(0,X.jsxs)(C,{className:F(`text-size-chat`,u===`row`?`text-text-tertiary/90`:`text-text/40 group-hover/activity-header:text-default`),children:[u===`summary-text`?null:J(e),(0,X.jsx)(j,{active:!e.completed,className:F(u!==`summary-text`&&`min-w-0 truncate`,c!=null&&`group-hover:!text-default`),children:i})]}),f=c==null?d:(0,X.jsx)(`button`,{type:`button`,className:`group`,onClick:()=>{let e=ee(c);_.dispatchHostMessage({type:`navigate-to-route`,path:Oe()?m(e):te(e)})},children:d});return l?(0,X.jsx)(ye,{icon:n,summary:f}):f}",
    "const entries=[{namespace:L,render:Y,renderAgentActivityIcon:J,tool:Send}];",
    "const label=`localConversation.appControlToolCall.threadsSendMessage.active`;",
    "export const fixture=true;"
  ].join("");
}

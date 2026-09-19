#!/usr/bin/env node
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { build9922 } from "../patches/outgoing-message-receipt/profiles/build9922.mjs";
import {
  linuxBuild9647,
  linuxBuild9771
} from "../patches/outgoing-message-receipt/profiles/linux.mjs";

const repository = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const toolkit = path.join(repository, "bin/toolkit.mjs");
const behavioralProbe = path.join(repository, "test/outgoing-message-receipt.test.mjs");
const scratch = fs.mkdtempSync(path.join(os.tmpdir(), "mechanics-toolkit-outgoing-receipt-test-"));

try {
  const extracted = path.join(scratch, "extracted");
  const assets = path.join(extracted, "webview/assets");
  const mainDirectory = path.join(extracted, ".vite/build");
  fs.mkdirSync(assets, { recursive: true });
  fs.mkdirSync(mainDirectory, { recursive: true });
  const initialTarget = path.join(assets, "app-initial-fixture.js");
  const projectionTarget = path.join(assets, "dynamic-projection-fixture.js");
  const ownerTarget = path.join(assets, "app-control-fixture.js");
  const conversationTarget = path.join(assets, "conversation-fixture.js");
  const conversationTurnTarget = path.join(assets, "conversation-turn-fixture.js");
  const activityTarget = path.join(assets, "activity-fixture.js");
  const formatterTarget = path.join(assets, "message-fixture.js");
  const consumerTarget = path.join(assets, "message-consumer-fixture.js");
  const styleTarget = path.join(assets, "styles-fixture.css");
  const mainTarget = path.join(mainDirectory, "main-fixture.js");
  fs.writeFileSync(initialTarget, initialFixture());
  fs.writeFileSync(projectionTarget, projectionFixture());
  fs.writeFileSync(ownerTarget, ownerFixture());
  fs.writeFileSync(conversationTarget, conversationFixture());
  fs.writeFileSync(conversationTurnTarget, conversationTurnFixture());
  fs.writeFileSync(activityTarget, activityFixture());
  fs.writeFileSync(formatterTarget, formatterFixture());
  fs.writeFileSync(consumerTarget, consumerFixture());
  fs.writeFileSync(styleTarget, styleFixture());
  fs.writeFileSync(mainTarget, mainFixture());
  const linuxPristine = path.join(scratch, "linux-pristine");
  fs.cpSync(extracted, linuxPristine, { recursive: true });
  fs.writeFileSync(
    path.join(linuxPristine, "webview/assets/conversation-fixture.js"),
    linuxConversationFixture()
  );
  fs.writeFileSync(
    path.join(linuxPristine, "webview/assets/conversation-turn-fixture.js"),
    linuxTurnFixture()
  );
  const build9922Pristine = path.join(scratch, "build-9922-pristine");
  fs.cpSync(extracted, build9922Pristine, { recursive: true });
  fs.writeFileSync(
    path.join(build9922Pristine, "webview/assets/conversation-fixture.js"),
    build9922ConversationFixture()
  );
  fs.writeFileSync(
    path.join(build9922Pristine, "webview/assets/conversation-turn-fixture.js"),
    build9922TurnFixture()
  );
  const linux9647Pristine = path.join(scratch, "linux-9647-pristine");
  fs.cpSync(extracted, linux9647Pristine, { recursive: true });
  fs.writeFileSync(path.join(linux9647Pristine, "webview/assets/app-initial-fixture.js"),
    linux9647InitialFixture());
  fs.writeFileSync(path.join(linux9647Pristine, "webview/assets/app-control-fixture.js"),
    linux9647OwnerFixture());
  fs.writeFileSync(path.join(linux9647Pristine, "webview/assets/app-primary-fixture.js"),
    linux9647TitleFixture());
  fs.writeFileSync(path.join(linux9647Pristine, "webview/assets/conversation-fixture.js"),
    linux9647ConversationFixture());
  fs.writeFileSync(path.join(linux9647Pristine, "webview/assets/conversation-turn-fixture.js"),
    linux9647TurnFixture());

  assert.equal(runToolkit(extracted, "check").state, "needs-apply");
  const applied = runToolkit(extracted, "apply");
  assert.equal(applied.state, "applied");
  assert.deepEqual(applied.targets, [
    path.join("webview", "assets", "app-control-fixture.js"),
    path.join("webview", "assets", "dynamic-projection-fixture.js"),
    path.join("webview", "assets", "conversation-fixture.js"),
    path.join("webview", "assets", "conversation-turn-fixture.js"),
    path.join(".vite", "build", "main-fixture.js")
  ]);
  assert.equal(applied.collapseOwner, path.join("webview", "assets", "activity-fixture.js"));
  assert.equal(applied.formatterOwner, path.join("webview", "assets", "message-fixture.js"));
  const once = fs.readFileSync(ownerTarget);
  const projectionOnce = fs.readFileSync(projectionTarget);
  assert.match(projectionOnce.toString(),
    /n\.tool===`send_message_to_thread`&&\(t\.success=n\.success\)/,
    "completed send projection preserves the raw success result");
  assert.match(once.toString(), /Bpn as MTKoutboundStoreScope/,
    "build 9771 imports the task selector's scope, not an unrelated export");
  assert.doesNotMatch(once.toString(), /BR as MTKoutboundStoreScope/,
    "build 9771 does not confuse another export with the task scope");
  const conversationOnce = fs.readFileSync(conversationTarget);
  const conversationTurnOnce = fs.readFileSync(conversationTurnTarget);
  const mainOnce = fs.readFileSync(mainTarget);

  const probe = spawnSync(process.execPath, [behavioralProbe, extracted], { encoding: "utf8" });
  assert.equal(probe.status, 0, probe.stderr || probe.stdout);

  assert.equal(runToolkit(extracted, "apply").state, "applied");
  assert.deepEqual(fs.readFileSync(ownerTarget), once, "second application is byte-identical");
  assert.deepEqual(fs.readFileSync(projectionTarget), projectionOnce,
    "second success-projection application is byte-identical");
  assert.deepEqual(fs.readFileSync(conversationTarget), conversationOnce, "second conversation application is byte-identical");
  assert.deepEqual(fs.readFileSync(conversationTurnTarget), conversationTurnOnce,
    "second turn application is byte-identical");
  assert.deepEqual(fs.readFileSync(mainTarget), mainOnce, "second main application is byte-identical");
  assert.deepEqual(fs.readFileSync(initialTarget), Buffer.from(initialFixture()), "task and hover owner stays untouched");
  assert.deepEqual(fs.readFileSync(activityTarget), Buffer.from(activityFixture()), "collapsed-activity owner stays untouched");
  assert.deepEqual(fs.readFileSync(formatterTarget), Buffer.from(formatterFixture()), "message formatter owner stays untouched");
  assert.deepEqual(fs.readFileSync(consumerTarget), Buffer.from(consumerFixture()), "message formatter consumer stays untouched");
  assert.deepEqual(fs.readFileSync(styleTarget), Buffer.from(styleFixture()), "stylesheet stays untouched");
  assertLinuxAppliedInspection(linuxPristine);
  assertLinux9647AppliedInspection(linux9647Pristine);
  assertBuild9922AppliedInspection(build9922Pristine);

  const registry = spawnSync(process.execPath, [toolkit, "patch", "renderer-patch-registry", "apply", extracted], { encoding: "utf8" });
  assert.equal(registry.status, 0, registry.stderr || registry.stdout);
  assert.deepEqual(JSON.parse(registry.stdout).packages, ["outgoingMessageReceipt"], "registry discovers the applied receipt");
  const registryProbe = spawnSync(process.execPath, [path.join(repository, "test/renderer-patch-registry.test.mjs"), extracted], { encoding: "utf8" });
  assert.equal(registryProbe.status, 0, registryProbe.stderr || registryProbe.stdout);
  process.stdout.write("outgoing message receipt transform probe passed\n");

} finally {
  fs.rmSync(scratch, { recursive: true, force: true });
}

function runToolkit(root, action, expectedStatus = 0) {
  const result = spawnSync(
    process.execPath,
    [toolkit, "patch", "outgoing-message-receipt", action, root],
    { encoding: "utf8" }
  );
  assert.equal(result.status, expectedStatus, result.stderr || result.stdout);
  return expectedStatus === 0 ? JSON.parse(result.stdout) : result;
}

function assertLinuxAppliedInspection(pristineRoot) {
  assert.equal(runToolkit(pristineRoot, "check").state, "needs-apply");
  assert.equal(runToolkit(pristineRoot, "apply").state, "applied");
  assert.equal(runToolkit(pristineRoot, "check").state, "applied");

  const missingHandoff = path.join(scratch, "missing-linux-lifecycle-handoff");
  fs.cpSync(pristineRoot, missingHandoff, { recursive: true });
  replaceInFixture(
    path.join(missingHandoff, "webview/assets/conversation-fixture.js"),
    "ReceiptLifecycle:MTKOutboundReceiptLifecycle,",
    "",
    "Linux lifecycle handoff"
  );
  assert.match(runToolkit(missingHandoff, "check", 1).stderr, /Upstream changed/,
    "an applied Linux tree missing its lifecycle handoff fails closed");

  const missingOwnerBranch = path.join(scratch, "missing-owner-lifecycle-branch");
  fs.cpSync(pristineRoot, missingOwnerBranch, { recursive: true });
  replaceInFixture(
    path.join(missingOwnerBranch, "webview/assets/app-control-fixture.js"),
    'if(typeof i.ReceiptLifecycle==="function")return(0,Z.jsx)(i.ReceiptLifecycle,{item:e,record:t});if(globalThis.__MTK_OUTBOUND_REMEMBER__(t)===!0)return null',
    'if(globalThis.__MTK_OUTBOUND_REMEMBER__(t)===!0)return null',
    "owner lifecycle branch"
  );
  assert.match(runToolkit(missingOwnerBranch, "check", 1).stderr, /Upstream changed/,
    "an applied tree missing the owner lifecycle branch fails closed");

}

function assertLinux9647AppliedInspection(pristineRoot) {
  assert.equal(runToolkit(pristineRoot, "check").state, "needs-apply");
  assert.equal(runToolkit(pristineRoot, "apply").state, "applied");
  assert.equal(runToolkit(pristineRoot, "check").state, "applied");
  const owner = fs.readFileSync(path.join(pristineRoot, "webview/assets/app-control-fixture.js"), "utf8");
  assert.match(owner, /q as MTKoutboundStoreScope/,
    "Linux build-9647 imports the exact task selector scope");
  assert.match(owner, /title as MTKoutboundTitleAtom/,
    "Linux build-9647 retains its dedicated live-title selector");
  const conversation = fs.readFileSync(
    path.join(pristineRoot, "webview/assets/conversation-fixture.js"), "utf8"
  );
  assert.ok(conversation.includes("ReceiptLifecycle:MTKOutboundReceiptLifecycle,"),
    "Linux build-9647 wires the durable receipt lifecycle");
  const behavior = spawnSync(process.execPath, [behavioralProbe, pristineRoot], {encoding: "utf8"});
  assert.equal(behavior.status, 0, behavior.stderr || behavior.stdout);
  const once = [
    "app-control-fixture.js",
    "dynamic-projection-fixture.js",
    "conversation-fixture.js",
    "conversation-turn-fixture.js"
  ].map(name => fs.readFileSync(path.join(pristineRoot, "webview/assets", name)));
  const mainOnce = fs.readFileSync(path.join(pristineRoot, ".vite/build/main-fixture.js"));
  assert.equal(runToolkit(pristineRoot, "apply").state, "applied");
  for (const [index, name] of [
    "app-control-fixture.js",
    "dynamic-projection-fixture.js",
    "conversation-fixture.js",
    "conversation-turn-fixture.js"
  ].entries()) {
    assert.deepEqual(fs.readFileSync(path.join(pristineRoot, "webview/assets", name)), once[index],
      `${name} Linux build-9647 second application is byte-identical`);
  }
  assert.deepEqual(fs.readFileSync(path.join(pristineRoot, ".vite/build/main-fixture.js")), mainOnce,
    "main Linux build-9647 second application is byte-identical");
}

function assertBuild9922AppliedInspection(pristineRoot) {
  assert.equal(runToolkit(pristineRoot, "check").state, "needs-apply");
  assert.equal(runToolkit(pristineRoot, "apply").state, "applied");
  assert.equal(runToolkit(pristineRoot, "check").state, "applied");
  const conversation = fs.readFileSync(
    path.join(pristineRoot, "webview/assets/conversation-fixture.js"),
    "utf8"
  );
  const reactBinding = conversation.match(
    /const MTKOutboundReceiptReact=(?<expression>[^;]+);const MTKoutboundReceiptContract=/
  );
  assert.equal(reactBinding?.groups.expression, "ot()",
    "build-9922 resolves React at module evaluation instead of capturing a lazy alias before initialization");

  const missingHandoff = path.join(scratch, "missing-build-9922-lifecycle-handoff");
  fs.cpSync(pristineRoot, missingHandoff, { recursive: true });
  replaceInFixture(
    path.join(missingHandoff, "webview/assets/conversation-fixture.js"),
    "ReceiptLifecycle:MTKOutboundReceiptLifecycle,",
    "",
    "build-9922 lifecycle handoff"
  );
  assert.match(runToolkit(missingHandoff, "check", 1).stderr, /Upstream changed/,
    "an applied build-9922 tree missing its lifecycle handoff fails closed");
}

function replaceInFixture(file, before, after, label) {
  const value = fs.readFileSync(file, "utf8");
  assert.equal(value.split(before).length - 1, 1, `${label} is unique`);
  fs.writeFileSync(file, value.replace(before, after));
}

function initialFixture() {
  return [
    "const x=0,$=Symbol(`scope`),LQ=Symbol(`unrelated`);",
    "const U={subscribe(){return()=>{}},dispatchMessage(){}};",
    "const Kvt={useContext(){},useRef(){}};function hvt(e){return e}",
    "function xf(e){let t=(0,Kvt.useContext)(hvt(e)),n=t,r=t,i=(0,Kvt.useRef)(null);return i.current??e}",
    "function cT(e){return `local:${e}`}",
    "function lT(e){return `remote:${e}`}",
    "const lf=(...e)=>e,JF=lf($,0),Delay=800,J={jsx(){}};",
    "function xyl(){}",
    "function Hover(e){return e}",
    "const preview=(0,J.jsx)(Hover,{align:`center`,closeOnTriggerBlur:!1,delayDuration:Delay,children:0,interactive:!0,skipDelayKey:`diff-preview`,tooltipContent:0,variant:`unstyled`});",
    "export{x as x,xf as kmn,$ as Bpn,LQ as BR,JF as task,cT as local,lT as remote,Hover as hover,U as bus};"
  ].join("");
}

function linux9647InitialFixture() {
  return [
    "const x=0,Q=Symbol(`scope`),qp=Symbol(`context`),LQ=Symbol(`unrelated`);",
    "const U={subscribe(){return()=>{}},dispatchMessage(){}},pNt={useContext(){},useRef(){}};",
    "function tm(e){let t=(0,pNt.useContext)(qp),n=t,r=t,i=(0,pNt.useRef)(null);return i.current??e}",
    "function jj(e){return `local:${e}`}",
    "function Mj(e){return `remote:${e}`}",
    "const Vp=(...e)=>e,AH=Vp(Q,0),Delay=800,J={jsx(){}};",
    "function PYs(){}",
    "function Hover(e){return e}",
    "const preview=(0,J.jsx)(Hover,{align:`center`,closeOnTriggerBlur:!1,delayDuration:Delay,children:0,interactive:!0,skipDelayKey:`diff-preview`,tooltipContent:0,variant:`unstyled`});",
    "export{x as x,tm as h,Q as q,LQ as BR,AH as task,jj as local,Mj as remote,Hover as hover,U as bus};"
  ].join("");
}

function ownerFixture() {
  return [
    'import{x as P}from"./app-initial-fixture.js";',
    "const x=0,N=0,I=0,Send=0,Z={jsx(){},jsxs(){}};",
    "function CFG(e){return e}",
    "function PC(e){return CFG(e)?.persistentInCollapsedConversation===!0}",
    "function r(e){return e}",
    "const ae={dispatchHostMessage(){}},Ee=()=>!1,A=e=>`/new/${e}`,p=e=>`/local/${e}`;",
    "function X(e,t,n,u=!0){let l=e.threadId;",
    "if(e.tool===`send_message_to_thread`){let e=r(l);ae.dispatchHostMessage({type:`navigate-to-route`,path:Ee()?A(e):p(e)})}",
    "switch(e.tool){case Send:return e.completed?`threadsSendMessageCompleted`:`threadsSendMessageActive`}",
    "return null}",
    "const registry={namespace:N,render:X,renderAgentActivityIcon:I,tool:Send};",
    "const label=`localConversation.appControlToolCall.threadsSendMessage.active`;",
    "export{x as x,PC as persistent};"
  ].join("");
}

function linux9647OwnerFixture() {
  return ownerFixture().replace(
    'import{x as P}from"./app-initial-fixture.js";',
    'import{x as P}from"./app-initial-fixture.js";import{title as ExistingTitle}from"./app-primary-fixture.js";'
  );
}

function linux9647TitleFixture() {
  return [
    "const Rg=Symbol(),ip=(...e)=>e;",
    "function UEn(e){return e}",
    "const GEn=ip(Rg,(e,{get:t})=>{let r=`title`,n={};return UEn({...n,localTitle:r})});",
    "export{GEn as title};"
  ].join("");
}

function projectionFixture() {
  return [
    "function project(n,e){let T=[];",
    "let t={type:`dynamic-tool-call`,callId:n.id,namespace:n.namespace,tool:n.tool,arguments:n.arguments,completed:n.status===`completed`||n.status===`failed`||!1};",
    "(n.tool===`create_thread`||n.tool===`handoff_thread`)&&(t.contentItems=e,t.success=n.success),T.push(t);",
    "return T}",
    "export const fixture=true;"
  ].join("");
}

function conversationFixture() {
  return [
    'import{x as x,persistent as bh}from"./app-control-fixture.js";',
    'import{bus as HostBus}from"./app-initial-fixture.js";',
    "const t=e=>e,r=()=>0,$={jsx(){return{}},jsxs(){return{}}},$S={c(){return[]}},wO=$S;",
    'function NativeActions(e){let{copyText:t,sentAtMs:n,timestampHoverOnly:r}=e;return(0,$.jsx)("span",{"data-assistant-message-sent-time":!0,children:"Copy response"})}',
    'function Ra(){return"running"}',
    "function QS(e){let t=(0,$S.c)(17),{conversationId:n,enableTimelineTargets:r,agentActivityIcon:i,isLeadingSummaryPart:a,item:o,variant:s}=e,c=a===void 0||a,l=s===void 0?`row`:s;if(Ra(`off`,n)===`stopped`)return null;let u,d;if(t[0]!==i||t[1]!==c||t[2]!==o||t[3]!==l){d=Symbol.for(`react.early_return_sentinel`);bb0:{let e=bh(o);if(e?.hiddenInConversation===!0){d=null;break bb0}u=e?.render?.(o,l,i,c)}t[0]=i,t[1]=c,t[2]=o,t[3]=l,t[4]=u,t[5]=d}else u=t[4],d=t[5];return u}",
    "function Oy(e){let t=(0,$S.c)(195),{turnId:o,conversationId:p}=e,Ze=null,Qe=!1,ft,Rr=()=>null;return ft=Qe?(0,$.jsx)(`div`,{className:`flex w-full items-center justify-center pt-8`,children:(0,$.jsx)(Rr,{className:`icon-sm`})}):(0,$.jsxs)($.Fragment,{children:[Ze,null]}),ft}",
    "function cO(e){let t=(0,wO.c)(392),{conversationId:f,toolActivityTurnKey:R,turnId:w,hostId:H}=e,J=null,Oe=!1,n={type:`dynamic-tool-call`};switch(n.type){case`dynamic-tool-call`:{let e;return t[375]!==J||t[376]!==f||t[377]!==Oe||t[378]!==n?(e=(0,$.jsx)(QS,{agentActivityIcon:J,conversationId:f,enableTimelineTargets:Oe,item:n}),t[375]=J,t[376]=f,t[377]=Oe,t[378]=n,t[379]=e):e=t[379]}}}",
    "const toolActivityTurnKey=true;export{cO};"
  ].join("");
}

function conversationTurnFixture() {
  return [
    'import{x as x}from"./conversation-fixture.js";',
    "const Ba={c(){return[]}},Q={jsx(){return{}}};",
    "function Z(e){let t=(0,Ba.c)(182),{conversationId:l,turnId:_,hostId:c}=e,Qa=[],$=(e,t,n)=>Qa.push({key:e,node:t,options:n});",
    '$(`user-item-${_}`,USER,{canOwnLatestTurnFollowContent:!1});',
    "let to=Qa.length,no={};return null}",
    "export{Z};"
  ].join("");
}

function linuxConversationFixture() {
  const linux = linuxBuild9771.dynamic;
  return [
    'import{x as x,persistent as Cp}from"./app-control-fixture.js";',
    'import{bus as HostBus}from"./app-initial-fixture.js";',
    "const t=e=>e,r=()=>0,$={jsx(){return{}},jsxs(){return{}}},Dy={c(){return[]}},Ww=Dy,us={useState(e){return[typeof e===`function`?e():e,()=>{}]},useEffect(){}};",
    'function NativeActions(e){let{copyText:t,sentAtMs:n,timestampHoverOnly:r}=e;return(0,$.jsx)("span",{"data-assistant-message-sent-time":!0,children:"Copy response"})}',
    'function hr(){return"running"}',
    linux.before,
    ";return u}",
    linux.parentBefore,
    '{conversationId:f,toolActivityTurnKey:R,turnId:w,hostId:H}=e,Ue=null,Oe=!1,n={type:`dynamic-tool-call`};switch(n.type){case`dynamic-tool-call`:{let e;return ',
    "t[377]!==Ue||t[378]!==f||t[379]!==Oe||t[380]!==n?",
    linux.call,
    ":e=t[381]}}}",
    "const toolActivityTurnKey=true;export{Ow};"
  ].join("");
}

function linux9647ConversationFixture() {
  const linux = linuxBuild9647.dynamic;
  return [
    'import{x as x,persistent as bh}from"./app-control-fixture.js";',
    'import{bus as HostBus}from"./app-initial-fixture.js";',
    "const t=e=>e,r=()=>0,$={jsx(){return{}},jsxs(){return{}}},$S={c(){return[]}},wO=$S;",
    'function NativeActions(e){let{copyText:t,sentAtMs:n,timestampHoverOnly:r}=e;return(0,$.jsx)("span",{"data-assistant-message-sent-time":!0,children:"Copy response"})}',
    'function uc(){return"running"}',
    linux.before,
    ";return u}",
    linux.parentBefore,
    '{conversationId:f,toolActivityTurnKey:R,turnId:w,hostId:H}=e,Ke=null,ke=!1,n={type:`dynamic-tool-call`};switch(n.type){case`dynamic-tool-call`:{let e;return ',
    "t[375]!==Ke||t[376]!==f||t[377]!==ke||t[378]!==n?",
    linux.call,
    ":e=t[379]}}}",
    "const toolActivityTurnKey=true;export{cO};"
  ].join("");
}

function linuxTurnFixture() {
  return [
    'import{x as x}from"./conversation-fixture.js";',
    "const hl={c(){return[]}},$={jsx(){return{}}};",
    "function Uc(e){let t=(0,hl.c)(189),{conversationId:d,turnId:f,hostId:c}=e,Xi=[],Zi=(e,t,n)=>Xi.push({key:e,node:t,options:n});",
    "let ea=Xi.length,ta={};return null}",
    "export{Uc};"
  ].join("");
}

function linux9647TurnFixture() {
  return [
    'import{x as x}from"./conversation-fixture.js";',
    "const Ba={c(){return[]}},Q={jsx(){return{}}};",
    "function Z(e){let t=(0,Ba.c)(182),{conversationId:l,turnId:p,hostId:c}=e,Qa=[],$=(e,t,n)=>Qa.push({key:e,node:t,options:n});",
    '$(`user-item-${p}`,USER,{canOwnLatestTurnFollowContent:!1});',
    "let to=Qa.length,no={};return null}",
    "export{Z};"
  ].join("");
}

function build9922ConversationFixture() {
  const current = build9922.dynamic;
  return [
    'import{x as x,persistent as Cp}from"./app-control-fixture.js";',
    'import{bus as HostBus}from"./app-initial-fixture.js";',
    "const e=x=>x,$={jsx(){return{}},jsxs(){return{}}},Dy={c(){return[]}},Ww=Dy,Db={useState(e){return[typeof e===`function`?e():e,()=>{}]},useEffect(){}};function ot(){return Db}",
    'function NativeActions(e){let{copyText:t,sentAtMs:n,timestampHoverOnly:r}=e;return(0,$.jsx)("span",{"data-assistant-message-sent-time":!0,children:"Copy response"})}',
    'function Lr(){return"running"}',
    current.before,
    ";return u}",
    current.parentBefore,
    '{conversationId:f,toolActivityTurnKey:R,turnId:w,hostId:H}=e,Y=null,De=!1,n={type:`dynamic-tool-call`};switch(n.type){case`dynamic-tool-call`:{let e;return ',
    "t[377]!==Y||t[378]!==f||t[379]!==De||t[380]!==n?",
    current.call,
    ":e=t[381]}}}",
    "const toolActivityTurnKey=true;export{Ow};"
  ].join("");
}

function build9922TurnFixture() {
  return [
    'import{x as x}from"./conversation-fixture.js";',
    "const hl={c(){return[]}},$={jsx(){return{}}};",
    "function Uc(e){let t=(0,hl.c)(189),{conversationId:d,turnId:h,hostId:f}=e,Xi=[],Zi=(e,t,n)=>Xi.push({key:e,node:t,options:n});",
    "let ea=Xi.length,ta={};return null}",
    "export{Uc};"
  ].join("");
}

function activityFixture() {
  return [
    'import{x as x,persistent as L}from"./app-control-fixture.js";',
    "const keepMcpAppEntriesPersistent=true,J={jsx(){}},K=()=>null;",
    "function render(x,i){if(i.type===`dynamic-tool-call`&&L(i))return i;let o=x!=null&&x.isCollapsed?x.persistentUnits:[],F=o.length===0?null:(0,J.jsx)(K,{units:o}),view={children:[F]};return view}",
    "export const fixture=true;"
  ].join("");
}

function formatterFixture() {
  return [
    "const x=0,C={c(){return null}},style=`whitespace-pre-wrap`;",
    "function Fmt(e){let t=(0,C.c)(24),{text:a,ref:b,className:c,components:d,directives:f,externalLinkContextMenuConversationId:g,markdownClassName:h,cwd:i,hostId:j,pluginMentionPresentation:k,variant:l}=e;return t}",
    "export{x as x,Fmt as formatted};"
  ].join("");
}

function consumerFixture() {
  return [
    'import{formatted as FM}from"./message-fixture.js";',
    "const J={jsx(){}},o=null,d=null,i=null,h=null,m=`message`,collapsedLineCount=1;",
    "const rendered=(0,J.jsx)(FM,{cwd:o,directives:d,externalLinkContextMenuConversationId:i,hostId:h,text:m,variant:`user-message`});",
    "export const fixture=true;"
  ].join("");
}

function styleFixture() {
  return "bg-surface-secondary\\/40 border-border\\/70 text-text-tertiary\\/90 focus-visible\\:ring-ring";
}

function mainFixture() {
  return [
    "const l={app:{getPath(){return `/tmp/user-data`},whenReady(){return Promise.resolve()}}};",
    "const i={i(){return{}}};",
    "var mQ=i.i(`electron-message-handler`);",
    "async function ready(){await l.app.whenReady()}",
    "class Handler{handle(e,t){switch(t.type){case`electron-add-new-workspace-root-option`:break}}}",
    "export{Handler};"
  ].join("");
}

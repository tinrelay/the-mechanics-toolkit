#!/usr/bin/env node
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const repository = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const toolkit = path.join(repository, "bin/toolkit.mjs");
const behavioralProbe = path.join(repository, "test/tinrelay-presentation.test.mjs");
const outgoingTransform = path.join(repository, "patches/tinrelay-pointer-presentation/outgoing-transform.mjs");
const scratch = fs.mkdtempSync(path.join(os.tmpdir(), "mechanics-toolkit-tinrelay-test-"));

try {
  const extracted = path.join(scratch, "extracted");
  const assets = path.join(extracted, "webview/assets");
  const build = path.join(extracted, ".vite/build");
  fs.mkdirSync(assets, { recursive: true });
  fs.mkdirSync(build, { recursive: true });
  const initialTarget = path.join(assets, "app-initial-fixture.js");
  const rendererTarget = path.join(assets, "conversation-blocks-fixture.js");
  const turnTarget = path.join(assets, "local-conversation-turn-fixture.js");
  const activityTarget = path.join(assets, "agent-activity-item-fixture.js");
  const mainTarget = path.join(build, "main-fixture.js");
  const config = path.join(scratch, "toolkit.json");
  fs.writeFileSync(initialTarget, initialFixture());
  fs.writeFileSync(rendererTarget, rendererFixture());
  fs.writeFileSync(turnTarget, turnFixture());
  fs.writeFileSync(activityTarget, activityFixture());
  fs.writeFileSync(mainTarget, mainFixture());
  fs.writeFileSync(config, JSON.stringify({
    workspaceRoot: "/srv/example-workspace",
    tinrelay: {client: "/opt/tinrelay/bin/tinrelay"}
  }));

  assert.equal(runToolkit("check").state, "needs-apply");
  const runtimeApplied = runPatch("runtime-json-reload", "apply", true);
  assert.equal(runtimeApplied.state, "applied", "the earlier runtime watcher owns the shared main-process seam first");
  const initialAfterRuntime = fs.readFileSync(initialTarget);
  assert.equal(runToolkit("check").state, "needs-apply", "Tinrelay remains applicable after runtime watcher composition");
  const missingConfig = spawnSync(process.execPath, [toolkit, "patch", "tinrelay-pointer-presentation", "apply", extracted], { encoding: "utf8" });
  assert.notEqual(missingConfig.status, 0);
  assert.match(missingConfig.stderr, /requires --config/);
  for (const [label, tinrelay, expected] of [
    ["relative client", {client: "bin/tinrelay"}, /absolute non-root path/],
    ["embedded ship", {client: "/opt/tinrelay/bin/tinrelay", localShip: "sample-ship"}, /contain only client/]
  ]) {
    fs.writeFileSync(config, JSON.stringify({tinrelay}));
    const rejected = spawnSync(
      process.execPath,
      [toolkit, "patch", "tinrelay-pointer-presentation", "apply", extracted, "--config", config],
      { encoding: "utf8" }
    );
    assert.notEqual(rejected.status, 0, label);
    assert.match(rejected.stderr, expected, label);
  }
  fs.writeFileSync(config, JSON.stringify({
    workspaceRoot: "/srv/example-workspace",
    tinrelay: {client: "/opt/tinrelay/bin/tinrelay"}
  }));

  const applied = runToolkit("apply", true);
  assert.equal(applied.state, "applied");
  assert.equal(applied.client, path.resolve("/opt/tinrelay/bin/tinrelay"));
  assert.equal(applied.localShip, null);
  assert.equal(applied.shipResolution, "runtime-message-and-observer-config");
  const rendererOnce = fs.readFileSync(rendererTarget);
  const activityOnce = fs.readFileSync(activityTarget);
  const turnOnce = fs.readFileSync(turnTarget);
  const mainOnce = fs.readFileSync(mainTarget);
  const mainText = mainOnce.toString("utf8");
  assert.ok(mainText.includes('await d.app.whenReady(),L.add(await MTKtinrelayStartOutgoingObserver(d.app.getPath("userData")))'),
    "outgoing observer startup reuses the Electron binding from its exact app-ready owner");
  assert.ok(!mainText.includes('MTKtinrelayStartOutgoingObserver(l.app.getPath("userData"))'),
    "an unrelated Electron-shaped binding cannot capture outgoing observer startup");
  const mismatchedStartup = mainText.replace(
    'MTKtinrelayStartOutgoingObserver(d.app.getPath("userData"))',
    'MTKtinrelayStartOutgoingObserver(l.app.getPath("userData"))'
  );
  fs.writeFileSync(mainTarget, mismatchedStartup);
  const mismatchedStartupResult = runOutgoingTransformFailure("apply");
  assert.match(mismatchedStartupResult.stderr, /does not use its app-ready owner bindings/,
    "an observer wired to a different Electron binding fails closed");
  assert.equal(fs.readFileSync(mainTarget, "utf8"), mismatchedStartup,
    "a mismatched observer binding fails before mutation");
  fs.writeFileSync(mainTarget, mainOnce);
  const rendererText = rendererOnce.toString("utf8");
  const durableSourceTurn = 'sourceThreadId:d,sourceTurnId:typeof R==="string"&&R.startsWith(d+"\\0")?R.slice(d.length+1):void 0';
  assert.ok(rendererText.includes(durableSourceTurn),
    "ordinary exec decodes the actual turn ID from Codex's tool-activity key");
  assert.ok(!rendererText.includes("sourceThreadId:d,sourceTurnId:S"),
    "ordinary exec does not use the unrelated turnId prop that its caller leaves undefined");
  assert.ok(turnOnce.toString("utf8").includes("MTKtinrelayOutgoingTurnPresentations,{conversationId:s,turnId:d"),
    "durable Tinrelay replies are mounted in the current split-turn renderer");

  const visualMatch = /function MTKtinrelayEnsureStyle\(\)\{.*?e\.textContent=(?<css>"(?:\\.|[^"\\])*")\,document/.exec(rendererText);
  assert.ok(visualMatch, "localized Tinrelay visual stylesheet");
  const currentVisualCss = JSON.parse(visualMatch.groups.css);
  assert.ok(currentVisualCss.includes("[data-user-message-bubble]"),
    "Tinrelay decorates Codex's stock user-message bubble");
  assert.ok(!currentVisualCss.includes("padding-top:"),
    "Tinrelay does not maintain a second vertical-padding system");

  const probe = spawnSync(process.execPath, [behavioralProbe, extracted], { encoding: "utf8" });
  assert.equal(probe.status, 0, probe.stderr || probe.stdout);

  assert.equal(runToolkit("apply").state, "applied", "an applied tree needs no config to verify");
  assert.deepEqual(fs.readFileSync(rendererTarget), rendererOnce, "renderer is byte-identical after second application");
  assert.deepEqual(fs.readFileSync(activityTarget), activityOnce, "activity classifier is byte-identical after second application");
  assert.deepEqual(fs.readFileSync(turnTarget), turnOnce, "turn renderer is byte-identical after second application");
  assert.deepEqual(fs.readFileSync(mainTarget), mainOnce, "main process is byte-identical after second application");
  assert.deepEqual(fs.readFileSync(initialTarget), initialAfterRuntime, "Tinrelay leaves the composed host-bus owner untouched");
  assertSplitTurnPresentationOrdering();
  process.stdout.write("unified Tinrelay presentation transform probe passed\n");

  function runToolkit(action, withConfig = false) {
    return runPatch("tinrelay-pointer-presentation", action, withConfig);
  }

  function runOutgoingTransformFailure(action) {
    const result = spawnSync(process.execPath, [outgoingTransform, action, extracted], { encoding: "utf8" });
    assert.notEqual(result.status, 0, result.stdout);
    return result;
  }

  function runPatch(name, action, withConfig = false) {
    const args = [toolkit, "patch", name, action, extracted];
    if (withConfig) args.push("--config", config);
    const result = spawnSync(process.execPath, args, { encoding: "utf8" });
    assert.equal(result.status, 0, result.stderr || result.stdout);
    return JSON.parse(result.stdout);
  }
} finally {
  fs.rmSync(scratch, { recursive: true, force: true });
}

function assertSplitTurnPresentationOrdering() {
  const transform = fs.readFileSync(outgoingTransform, "utf8");
  const patchPresentations = sourceBetween(transform, "function patchAssistantPresentations(", "function helperSlice(");
  const turnCompletionExpression = sourceBetween(transform, "function turnCompletionExpression(", "function patchAssistantPresentations(");
  const uniqueMatch = sourceBetween(transform, "function uniqueMatch(", "function containingFunction(");
  const functionOwnership = sourceBetween(transform, "function containingFunction(", "function replaceOnce(");
  const replaceOnce = sourceBetween(transform, "function replaceOnce(", "function escapeRegExp(");
  const escapeRegExp = sourceBetween(transform, "function escapeRegExp(", "function count(");
  const count = sourceBetween(transform, "function count(", "function countMatches(");
  const api = Function("path", "renderer", "id",
    `${uniqueMatch};${functionOwnership};${replaceOnce};${escapeRegExp};${count};${turnCompletionExpression};${patchPresentations};return patchAssistantPresentations`)(
      path,
      "/tmp/conversation-blocks-fixture.js",
      "[$A-Z_a-z][$\\w]*"
    );
  const renderer = "MTKtinrelayReact=t(r(),1);function MS(){}export{x as x}";
  const turn = [
    'import{MTKOutboundTurnReceipts as MTKOutboundTurnReceipts}from"./conversation-blocks-fixture.js";',
    "function turn(e){let{turn:u,isTurnInProgress:L}=e,{userItems:J,assistantItem:K,systemEventItem:G,agentItems:A}=e,Fa=[],$=(e,t,n)=>Fa.push({key:e,node:t,options:n});",
    '$(`user-item`,USER,{canOwnLatestTurnFollowContent:!1});',
    '$(`mtk-outbound-turn-receipts`,(0,Q.jsx)(MTKOutboundTurnReceipts,{conversationId:s,turnId:d}),{canOwnLatestTurnFollowContent:!1});',
    "let Ra=Fa.length,za={}}"
  ].join("");
  const patched = api(renderer, turn, {splitTurn: true});
  const userAt = patched.turnSource.indexOf('$(`user-item`');
  const taskAt = patched.turnSource.indexOf('$(`mtk-outbound-turn-receipts`');
  const tinrelayAt = patched.turnSource.indexOf('$(`mtk-tinrelay-outgoing-turn`');
  const activityAt = patched.turnSource.indexOf("let Ra=Fa.length");
  assert.ok(userAt >= 0 && taskAt > userAt && tinrelayAt > taskAt && tinrelayAt < activityAt,
    "split turn hoists task and Tinrelay sends after the initiating user request and before activity");
  assert.ok(patched.turnSource.includes("turnFinished:!L&&(u.status===`cancelled`||K?.completed===!0&&K?.phase===`final_answer`)"),
    "split turn delays promotion until the final assistant item completes");
  const syntax = spawnSync(process.execPath, ["--input-type=module", "--check"], {
    encoding: "utf8",
    input: patched.turnSource
  });
  assert.equal(syntax.status, 0, syntax.stderr || syntax.stdout);
}

function sourceBetween(value, startMarker, endMarker) {
  const start = value.indexOf(startMarker);
  const end = value.indexOf(endMarker, start + startMarker.length);
  assert.ok(start >= 0 && end > start, `${startMarker} source boundary`);
  return value.slice(start, end);
}

function initialFixture() {
  return [
    "const x=0,H={getInstance(){return U}},y=e=>e;let U={subscribe(){},dispatchMessage(){}};",
    "U=H.getInstance(),y((e,t)=>{U.dispatchMessage(e,t)});",
    "export{x as x,U as host};"
  ].join("");
}

function rendererFixture() {
  return [
    'import{x as X,host as Bus}from"./app-initial-fixture.js";',
    "const e=e=>e,t=e=>e,i=()=>({c(){}}),Fl=()=>null,oh=()=>null,Y=()=>({jsx(){},jsxs(){}}),r=()=>({}),At=(...e)=>e.join(` `),PS={jsx(){},jsxs(){}},cE=e=>e,rg=e=>e,Ne=!1,Ae=!1;",
    "var wS,TS,ES,DS=e((()=>{wS=i(),Fl(),oh(),TS=Y(),ES=2}));",
    "function uh(e){return e}",
    "function CS(e){let t=(0,wS.c)(16),{label:n,conversationId:r,message:i,sentAtMs:a,cwd:o,hostId:s,compactActions:c,onLabelClick:l}=e,f=!0,u=c,m,p;",
    "t[2]!==n||t[3]!==l?(p=l?(0,TS.jsx)(`button`,{type:`button`,className:At(`text-size-chat-sm flex max-w-full items-center gap-1 px-1 py-0.5 text-codex-description`,`cursor-interaction rounded-md hover:text-default`),onClick:l,children:n}):(0,TS.jsx)(`div`,{className:`text-size-chat-sm flex max-w-full items-center gap-1 px-1 py-0.5 text-codex-description`,children:n}),t[2]=n,t[3]=l,t[4]=p):p=t[4];",
    "t[5]!==u?(m=f?(0,TS.jsx)(uh,{message:i,sentAtMs:a,collapsedLineCount:ES,compactActions:u,cwd:o,hostId:s,threadId:r}):null,t[5]=u):m=t[5];return m}",
    "function MS(e){let t=(0,wS.c)(13),{conversationId:n,sourceThreadId:r,message:i,sentAtMs:a,cwd:o,hostId:s,compactActions:c}=e,l,p,m;",
    "m=(0,PS.jsx)(CS,{conversationId:n,label:p,message:i,sentAtMs:a,cwd:o,hostId:s,compactActions:l,onLabelClick:null});return m}",
    "function tx(e){return e}",
    "function Render(e){let{conversationId:d,turnId:S,item:n,toolActivityTurnKey:R}=e,m=!1,p=`default`,v=`local`,ve=`default`,ye=!0,r=null,je=!1;switch(n.type){case`exec`:{let e=cE(n);if(!Ne&&Ae&&!e||(n.parsedCmd.type===`read`||n.parsedCmd.type===`search`||n.parsedCmd.type===`list_files`)&&!n.parsedCmd.isFinished&&!e)return null;return(0,PS.jsx)(tx,{item:n,isTurnInProgress:m,threadDetailLevel:p,hostId:v,summaryTone:ve,showSummaryIcon:ye,summaryIcon:r,hideRawCommand:je,toolActivityTurnKey:R})}}}",
    "function Oy(e){let{conversationId:p,turnId:o,turn:u,isTurnInProgress:L}=e,{userItems:J,assistantItem:K,systemEventItem:G,agentItems:A}=e,Ze=null;return(0,PS.jsx)(`div`,{turn:u,isTurnInProgress:L,assistantItem:K,children:[Ze,null]})}",
    "function GE(e,{keepMcpAppEntriesPersistent:t=!1,mcpServerStatuses:n,renderMcpApps:r=!1}={}){let i=[],a=[],o=[],s=[],c=null;for(let l of e){if(l.kind===`standalone`&&l.item.item.type===`worked-for`){c=l.item.item;continue}if(l.kind===`standalone`&&l.item.item.type===`realtime-transcript`){a.length===0?s.push(l):(a.push(l),o.push(l));continue}a.push(l),KE({unit:l,keepMcpAppEntriesPersistent:t,mcpServerStatuses:n,renderMcpApps:r})?o.push(l):i.push(l)}return{collapsibleUnits:i,expandedUnits:a,persistentUnits:o,preToggleUnits:s,workedForItem:c}}",
    "function KE({unit:e,keepMcpAppEntriesPersistent:t,mcpServerStatuses:n,renderMcpApps:r}){if(e.kind!==`standalone`)return!1;let i=e.item.item;return i.type===`dynamic-tool-call`&&Zm(i)||t&&r&&i.type===`mcp-tool-call`&&qE({item:i,mcpServerStatuses:n})?!0:i.type===`user-message`&&(i.steeringStatus!=null||i.hookFeedback===!0)}",
    "function qE(){return!1}var JE=0;",
    "const x=0;export{x as x}"
  ].join("");
}

function turnFixture() {
  return [
    'import{MTKOutboundTurnReceipts as MTKOutboundTurnReceipts}from"./conversation-blocks-fixture.js";',
    "function turn(e){let{turn:u,isTurnInProgress:L}=e,{userItems:J,assistantItem:K,systemEventItem:G,agentItems:A}=e,Fa=[],$=(e,t,n)=>Fa.push({key:e,node:t,options:n});",
    '$(`user-item`,USER,{canOwnLatestTurnFollowContent:!1});',
    '$(`mtk-outbound-turn-receipts`,(0,Q.jsx)(MTKOutboundTurnReceipts,{conversationId:s,turnId:d}),{canOwnLatestTurnFollowContent:!1});',
    "let Ra=Fa.length,za={}}export const fixture=true;"
  ].join("");
}

function activityFixture() {
  return [
    "const Je=e=>false,$=(e,t)=>({item:e,grouping:t}),dn=e=>e;",
    "function ln(e){switch(e.type){case`external-event`:return null;case`exec`:case`patch`:return $(dn(e),Je(e)?`standalone`:`groupable`);case`user-message`:return $(e,`standalone`)}}",
    "export{ln};"
  ].join("");
}

function mainFixture() {
  return [
    'let x=require("node:child_process");',
    "const i={i(){return null}};",
    "const d={app:{whenReady(){return Promise.resolve()},getPath(e){return `/app/${e}`}}},l={app:void 0},q={Set:class{}},P=()=>{},R=0;",
    "var mQ=i.i(`electron-message-handler`);",
    "async function handler(e,t){switch(t.type){case`show-plan-summary`:break;case`update-diff-if-open`:break;case`electron-add-new-workspace-root-option`:break}}",
    "async function startup(){let L=new q.Set;L.add(()=>{});await d.app.whenReady(),P(`main app.whenReady resolved`,R)}",
    "export const fixture=true;"
  ].join("");
}

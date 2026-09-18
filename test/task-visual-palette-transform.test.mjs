#!/usr/bin/env node
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import {
  applyBuild9647ArchiveRuntime,
  inspectBuild9647ArchiveRuntime
} from "../patches/task-visual-palette/profiles/build9647.mjs";
import { linuxBuild9647 } from "../patches/task-visual-palette/profiles/linux.mjs";

const repository = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const toolkit = path.join(repository, "bin/toolkit.mjs");
const rosterPatch = path.join(repository, "patches/agent-roster/patch.mjs");
const behavioralProbe = path.join(repository, "test/task-visual-palette.test.mjs");
const scratch = fs.mkdtempSync(path.join(os.tmpdir(), "mechanics-toolkit-palette-test-"));

testArchiveRuntime();
testLinuxArchiveRuntime();

try {
  const extracted = path.join(scratch, "extracted");
  const assets = path.join(extracted, "webview/assets");
  fs.mkdirSync(assets, {recursive: true});
  const initialTarget = path.join(assets, "app-initial-fixture.js");
  const primaryTarget = path.join(assets, "app-primary-fixture.js");
  const localTarget = path.join(assets, "local-conversation-page-fixture.js");
  const delegationTarget = path.join(assets, "conversation-blocks-fixture.js");
  fs.writeFileSync(initialTarget, initialFixture());
  fs.writeFileSync(primaryTarget, primaryFixture());
  fs.writeFileSync(localTarget, localFixture());
  fs.writeFileSync(delegationTarget, delegationFixture());
  fs.writeFileSync(path.join(assets, "message-bus-fixture.js"),
    "globalThis.__MTK_RUNTIME_JSON_RELOAD__=Object.freeze({version:2});export const fixture=true;");

  assert.equal(runRoster("check").state, "needs-apply");
  assert.equal(runRoster("apply").state, "applied");
  const scorpioExtracted = path.join(scratch, "scorpio-extracted");
  fs.cpSync(extracted, scorpioExtracted, {recursive: true});
  const scorpioPrimary = path.join(scorpioExtracted, "webview/assets/app-primary-fixture.js");
  const scorpioSource = fs.readFileSync(scorpioPrimary, "utf8")
    .replace("(0,h3.jsx)(`div`", "(0,g9.jsx)(`div`");
  assert.ok(scorpioSource.includes("(0,g9.jsx)(`div`"));
  assert.equal(scorpioSource.includes("(0,h3.jsx)(`div`"), false);
  fs.writeFileSync(scorpioPrimary, scorpioSource);
  const ambiguousExtracted = path.join(scratch, "ambiguous-extracted");
  fs.cpSync(extracted, ambiguousExtracted, {recursive: true});
  const ambiguousPrimary = path.join(ambiguousExtracted, "webview/assets/app-primary-fixture.js");
  const alternateFade = primaryFixture().split("function fade(){return ")[1]?.split("}export const")[0];
  assert.ok(alternateFade);
  fs.appendFileSync(ambiguousPrimary, `function duplicateFade(){return ${alternateFade.replace("h3.jsx", "g9.jsx")}}`);
  const ambiguousBefore = fs.readFileSync(ambiguousPrimary);
  assert.throws(() => runPalette("check", ambiguousExtracted), /Unrecognized palette patch state/);
  assert.deepEqual(fs.readFileSync(ambiguousPrimary), ambiguousBefore,
    "ambiguous current owners fail before mutation");
  assert.equal(runPalette("check").state, "needs-apply");
  assert.equal(runPalette("check", scorpioExtracted).state, "needs-apply");
  const applied = runPalette("apply");
  assert.equal(applied.state, "applied");
  assert.equal(runPalette("apply", scorpioExtracted).state, "applied");
  assert.deepEqual(applied.targets.sort(), [
    path.join("webview", "assets", "app-initial-fixture.js"),
    path.join("webview", "assets", "app-primary-fixture.js"),
    path.join("webview", "assets", "conversation-blocks-fixture.js"),
    path.join("webview", "assets", "local-conversation-page-fixture.js")
  ]);

  const once = [initialTarget, primaryTarget, localTarget, delegationTarget].map(file => fs.readFileSync(file));
  const probe = spawnSync(process.execPath, [behavioralProbe, extracted], {encoding: "utf8"});
  assert.equal(probe.status, 0, probe.stderr || probe.stdout);
  const scorpioProbe = spawnSync(process.execPath, [behavioralProbe, scorpioExtracted], {encoding: "utf8"});
  assert.equal(scorpioProbe.status, 0, scorpioProbe.stderr || scorpioProbe.stdout);
  const composedExtracted = path.join(scratch, "composed-extracted");
  fs.cpSync(extracted, composedExtracted, {recursive: true});
  const composedInitial = path.join(composedExtracted, "webview/assets/app-initial-fixture.js");
  fs.writeFileSync(composedInitial, fs.readFileSync(composedInitial, "utf8").replace(
    "function PYs(){MTKuseAgentRoster();MTKusePaletteBootstrap();",
    "const MTKattentionRosterBridge=1;function MTKuseAttentionBootstrap9647(){}" +
      "function PYs(){MTKuseAttentionBootstrap9647();MTKuseAgentRoster();MTKusePaletteBootstrap();"
  ));
  const composedProbe = spawnSync(process.execPath, [behavioralProbe, composedExtracted], {encoding: "utf8"});
  assert.equal(composedProbe.status, 0, composedProbe.stderr || composedProbe.stdout);

  assert.equal(runPalette("apply").state, "applied");
  const scorpioOnce = fs.readFileSync(scorpioPrimary);
  assert.equal(runPalette("apply", scorpioExtracted).state, "applied");
  assert.deepEqual(fs.readFileSync(scorpioPrimary), scorpioOnce,
    "Scorpio official archive is byte-identical after second application");
  for (const [index, file] of [initialTarget, primaryTarget, localTarget, delegationTarget].entries()) {
    assert.deepEqual(fs.readFileSync(file), once[index], `${path.basename(file)} second application is byte-identical`);
  }
  process.stdout.write("task visual palette build-9647 transform probe passed\n");

  function runRoster(action) {
    const result = spawnSync(process.execPath, [rosterPatch, action, extracted], {encoding: "utf8"});
    assert.equal(result.status, 0, result.stderr || result.stdout);
    return JSON.parse(result.stdout);
  }

  function runPalette(action, root = extracted) {
    const result = spawnSync(process.execPath, [toolkit, "patch", "task-visual-palette", action, root], {encoding: "utf8"});
    assert.equal(result.status, 0, result.stderr || result.stdout);
    return JSON.parse(result.stdout);
  }
} finally {
  fs.rmSync(scratch, {recursive: true, force: true});
}

function initialFixture() {
  return [
    "const Q=Symbol(`scope`),VFi=Symbol(`projects`),w_=Symbol(`ready`);",
    "const RYs={useEffect(){}},nm=e=>e,r=e=>e;",
    "function C_(e,t){let n=e.get(w_);if(n==null)throw Error(`AppServerManager RPC is not connected`);return n.forHost(t)}",
    "function owner(){return r(VFi)}",
    "function PYs(){let e=(0,LYs.c)(12),t=nm(Q),value=0;return e}",
    "export const fixture=true;"
  ].join("");
}

function primaryFixture() {
  return [
    "function mkn({scope:e,target:t,actions:n,onRename:r,onArchive:i,x}){let _=`task`,D=false;return {archive:D?void 0:{id:`archive-thread`,message:void 0,onSelect:()=>{i()}}}}",
    "function Akn({items:e,onArchive:t,onSelect:n,selectedThreadKeys:r,threadKey:i}){return r.length<2?e:e.filter(e=>e.id!==`rename-thread`)}",
    "function localSelection(T,r){return Akn({items:[],onArchive:null,onSelect:null,selectedThreadKeys:fwn(T,r),threadKey:r})}",
    "function unifiedSelection(K,e){return Akn({items:[],onArchive:null,onSelect:null,selectedThreadKeys:fwn(K,e),threadKey:e})}",
    "function aAn(e){let t=(0,wQ.c)(154),x=0,g=0,w=0,n=`task`,S=false,Ze;",
    "t[71]!==x?(Ze=1,t[88]=w,t[89]=Ze):Ze=t[89];let Qe=oD(Ze),$e=S&&x,et;",
    "t[90]!==n?(et={archive:t!=null&&(Oe||V)?Pe:t,getMenuItems:null},t[100]=$e,t[101]=et):et=t[101];return et}",
    "var mAn,OQ,kQ,hAn=t((()=>{mAn=a(),OQ=0,kQ=0,hAn=0}));",
    "function fAn(e){let t=(0,mAn.c)(89),xe=true,ae=`task`,Ae=1,L=0;if(xe&&e.push({id:`archive-task`,label:`Archive`}));let Be=xe?Ae:null;let Je;",
    "t[78]!==xe?(Je=Be,t[84]=L,t[85]=Je):Je=t[85];return Je}",
    "function AAn(e){let t=(0,NQ.c)(177),u=0,O=0,et=0,n=1,q=true;let tt=et,nt;",
    "t[77]!==u?(nt={archive:n,getMenuItems:q?e=>d([e]):null},t[111]=O,t[112]=nt):nt=t[112];return nt}",
    "function fade(){return (0,h3.jsx)(`div`,{\"aria-hidden\":!0,className:`pointer-events-none absolute inset-x-0 bottom-0 z-0 h-full bg-gradient-to-t from-surface via-surface extension:from-surface-secondary extension:via-surface-secondary`})}",
    "export const fixture=true;"
  ].join("");
}

function localFixture() {
  return [
    "function hu(e){let t=(0,Su.c)(91),r=e,he;",
    "t[75]!==te||t[76]!==q||t[77]!==ne||t[78]!==re||t[79]!==oe||t[80]!==se||t[81]!==ce||t[82]!==le||t[83]!==ue||t[84]!==de||t[85]!==pe||t[86]!==me?(he=(0,Q.jsxs)(`div`,{ref:j,className:`relative h-full min-h-0`,children:[te,q,ne,re,ae,oe,se,ce,le,ue,de,pe,me]}),t[75]=te,t[76]=q,t[77]=ne,t[78]=re,t[79]=oe,t[80]=se,t[81]=ce,t[82]=le,t[83]=ue,t[84]=de,t[85]=pe,t[86]=me,t[87]=he):he=t[87];",
    "return he}",
    "export const fixture=true;"
  ].join("");
}

function delegationFixture() {
  return [
    "var MTKdelegatedBubbleStyle={backgroundColor:`var(--color-token-interactive-bg-accent-muted-context,rgba(51,156,255,.1))`};",
    "function MTKsender(e){return e}function marker(){return messageBubbleStyle=MTKdelegatedBubbleStyle}",
    "const stock={defaultMessage:`localConversation.codexDelegationUserMessage.app`};",
    "function MS(e){let t=(0,NS.c)(14),{conversationId:n,sourceThreadId:r,message:i,sentAtMs:a,cwd:o,hostId:s,compactActions:c}=e,l,p,f,m,h;",
    "t[5]!==l||t[6]!==n||t[7]!==o||t[8]!==s||t[9]!==i||t[10]!==a||t[11]!==m||t[13]!==p?(h=(0,PS.jsx)(CS,{conversationId:n,label:p,message:i,sentAtMs:a,cwd:o,hostId:s,compactActions:l,onLabelClick:m,messageBubbleStyle:MTKdelegatedBubbleStyle}),t[5]=l,t[6]=n,t[7]=o,t[8]=s,t[9]=i,t[10]=a,t[11]=m,t[13]=p,t[12]=h):h=t[12];return h}",
    "function CS(e){let t=(0,wS.c)(17),{label:n,conversationId:r,message:i,sentAtMs:a,cwd:o,hostId:s,compactActions:c,onLabelClick:l,messageBubbleStyle:MTKbubbleStyleOverride}=e,f=true,u=c,m,p,h;",
    "m=f?(0,TS.jsx)(bt,{message:i,sentAtMs:a,collapsedLineCount:ES,compactActions:u,cwd:o,hostId:s,threadId:r,messageBubbleStyle:MTKbubbleStyleOverride}):null;",
    "t[13]!==p||t[14]!==m?(h=(0,TS.jsxs)(`div`,{className:`flex w-full flex-col items-end justify-end gap-1`,children:[p,m]}),t[13]=p,t[14]=m,t[15]=h):h=t[15];return h}",
    "export const fixture=true;"
  ].join("");
}

function testArchiveRuntime() {
  const source = archiveRuntimeFixture();
  assert.equal(inspectBuild9647ArchiveRuntime(source), "needs-apply");
  assert.equal(inspectBuild9647ArchiveRuntime(applyBuild9647ArchiveRuntime(source)), "applied");
}

function testLinuxArchiveRuntime() {
  const source = archiveRuntimeFixture("Xe", "let Ze=sD(Xe),Qe=S&&x,$e", "Qe", "$e");
  assert.equal(inspectBuild9647ArchiveRuntime(source, linuxBuild9647.archive.runtime), "needs-apply");
  assert.equal(inspectBuild9647ArchiveRuntime(
    applyBuild9647ArchiveRuntime(source, linuxBuild9647.archive.runtime),
    linuxBuild9647.archive.runtime
  ), "applied");
}

function archiveRuntimeFixture(result = "Ze", inline = "let Qe=oD(Ze),$e=S&&x,et", pin = "$e", inlineResult = "et") {
  return [
    "const MTKsidebarArchiveProtected=e=>globalThis.__MTKsidebarArchiveProtected?.(e)===!0;function mkn(",
    "function aAn(e){let t=(0,wQ.c)(154),",
    `,${result};t[71]!==x`,
    `t[88]=w,t[89]=${result}):${result}=t[89]`,
    `${inline};t[90]!==n`,
    `t[100]=${pin},t[101]=${inlineResult}):${inlineResult}=t[101]`,
    "var mAn,OQ,kQ,hAn=t((()=>{mAn=a(),",
    "function fAn(e){let t=(0,mAn.c)(89),",
    "let Je;t[78]!==xe",
    "t[84]=L,t[85]=Je):Je=t[85]",
    "function AAn(e){let t=(0,NQ.c)(177),",
    "let tt=et,nt;t[77]!==u",
    "t[111]=O,t[112]=nt):nt=t[112]"
  ].join("\n");
}

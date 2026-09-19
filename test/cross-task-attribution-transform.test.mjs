#!/usr/bin/env node
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const repository = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const toolkit = path.join(repository, "bin/toolkit.mjs");
const behavioralProbe = path.join(repository, "test/cross-task-attribution.test.mjs");
const scratch = fs.mkdtempSync(path.join(os.tmpdir(), "mechanics-toolkit-attribution-test-"));

try {
  verifyProfile("generic build 9647", genericInitialFixture(), genericPrimaryFixture(), genericBubbleFixture());
  verifyProfile("Linux build 9647", linuxInitialFixture(), linuxPrimaryFixture(), linuxBubbleFixture());
  verifyProfile("generic build 9922", build9922InitialFixture(), build9922PrimaryFixture(),
    build9922BubbleFixture(), build9922OwnerFixture());
  process.stdout.write("cross-task attribution current-build transform probe passed\n");

  function verifyProfile(label, initialFixture, primaryFixture, bubbleFixture, ownerSource = ownerFixture()) {
    const extracted = path.join(scratch, label.replaceAll(" ", "-"));
    const assets = path.join(extracted, "webview/assets");
    fs.mkdirSync(assets, { recursive: true });
    const initialTarget = path.join(assets, "app-initial-fixture.js");
    const primaryTarget = path.join(assets, "app-primary-fixture.js");
    const ownerTarget = path.join(assets, "conversation-blocks-fixture.js");
    const bubbleTarget = path.join(assets, "user-message-fixture.js");
    fs.writeFileSync(initialTarget, initialFixture);
    fs.writeFileSync(primaryTarget, primaryFixture);
    fs.writeFileSync(ownerTarget, ownerSource);
    fs.writeFileSync(bubbleTarget, bubbleFixture);

    assert.equal(runToolkit("check", extracted).state, "needs-apply");
    const applied = runToolkit("apply", extracted);
    assert.equal(applied.state, "applied");
    assert.deepEqual(applied.targets, [
      path.join("webview", "assets", "conversation-blocks-fixture.js"),
      path.join("webview", "assets", "user-message-fixture.js")
    ]);
    const ownerOnce = fs.readFileSync(ownerTarget);
    const bubbleOnce = fs.readFileSync(bubbleTarget);

    const probe = spawnSync(process.execPath, [behavioralProbe, extracted], { encoding: "utf8" });
    assert.equal(probe.status, 0, probe.stderr || probe.stdout);
    assert.equal(runToolkit("apply", extracted).state, "applied");
    assert.deepEqual(fs.readFileSync(ownerTarget), ownerOnce, `${label} owner is byte-identical`);
    assert.deepEqual(fs.readFileSync(bubbleTarget), bubbleOnce, `${label} bubble is byte-identical`);
    assert.deepEqual(fs.readFileSync(initialTarget), Buffer.from(initialFixture), `${label} store owner stays untouched`);
    assert.deepEqual(fs.readFileSync(primaryTarget), Buffer.from(primaryFixture), `${label} title owner stays untouched`);
  }

  function runToolkit(action, extracted) {
    const result = spawnSync(process.execPath, [toolkit, "patch", "cross-task-attribution", action, extracted], { encoding: "utf8" });
    assert.equal(result.status, 0, result.stderr || result.stdout);
    return JSON.parse(result.stdout);
  }
} finally {
  fs.rmSync(scratch, { recursive: true, force: true });
}

function genericInitialFixture() {
  return [
    "const Q=Symbol(`scope`),qp=Symbol(`context`),React={useContext(){},useRef(){}};",
    "function nm(e){let t=React.useContext(qp),n=React.useRef(null);return{get queryClient(){return t},get(){},watch(){}}}",
    "function PYs(){let e=(0,LYs.c)(12),t=nm(Q),n=`sidebarElectron.recentChats`;return n}",
    "export{nm as h,Q as q};"
  ].join("");
}

function linuxInitialFixture() {
  return [
    "const Q=Symbol(`scope`),qp=Symbol(`context`),React={useContext(){},useRef(){}};",
    "function tm(e){let t=React.useContext(qp),n=React.useRef(null);return{get queryClient(){return t},get(){},watch(){}}}",
    "function PYs(){let e=(0,LYs.c)(12),t=tm(Q),n=`sidebarElectron.recentChats`;return n}",
    "export{tm as h,Q as q};"
  ].join("");
}

function genericPrimaryFixture() {
  return [
    "const ns=Symbol(`scope`);function UEn(e){return e}",
    "var GEn,owner=t((()=>{GEn=Rt(ns,(e,{get:t})=>{let n={hasConversation:true,liveTitle:null,summaryTitle:null},r=null;return UEn({...n,localTitle:r})})}));",
    "function titleUse(){let _t=Fy(GEn,{hostId:Ke??`local`,threadId:n})??Be?.title??null;return _t}",
    "export{GEn as title};"
  ].join("");
}

function linuxPrimaryFixture() {
  return [
    "const Rg=Symbol(`scope`);function UEn(e){return e}",
    "var GEn,owner=t((()=>{GEn=ip(Rg,(e,{get:t})=>{let n={hasConversation:true,liveTitle:null},r=null;return UEn({...n,localTitle:r})})}));",
    "function titleUse(){let gt=CC(GEn,{hostId:Ge??`local`,threadId:n})??ze?.title??null;return gt}",
    "export{GEn as title};"
  ].join("");
}

function build9922InitialFixture() {
  return [
    "const $=Symbol(`scope`),qp=Symbol(`context`),React={useContext(){},useRef(){}};",
    "function xf(e){let t=React.useContext(qp),n=React.useRef(null);return{get queryClient(){return t},get(){},watch(){}}}",
    "function Vvl(){let e=(0,Wvl.c)(12),t=xf($),n=`sidebarElectron.recentChats`;return n}",
    "function cyc({hasConversation:e,liveTitle:t,localTitle:n,summaryTitle:r}){return e?n??r:null}",
    "var uyc;function dyc(){return(dyc=n((()=>{uyc=uf($,(e,{get:t})=>{let n={hasConversation:true,liveTitle:null,summaryTitle:null},r=null;return cyc({...n,localTitle:r})})})))()}",
    "export{xf as kmn,$ as Bpn,uyc as fm};"
  ].join("");
}

function build9922PrimaryFixture() {
  return "const noop=true;export{noop as z};";
}

function build9922OwnerFixture() {
  return [
    'import{z as P}from"./app-primary-fixture.js";',
    'import{kmn as _c,Bpn as Xt}from"./app-initial-fixture.js";',
    'import{t as pp}from"./user-message-fixture.js";',
    "const stock={defaultMessage:`Sent by {appName} from another task`};",
    "function Zv(e){let t=(0,Qv.c)(16),{label:n,conversationId:r,message:i,sentAtMs:a,cwd:o,hostId:s,compactActions:c,onLabelClick:l}=e,u=c!==void 0&&c,d=i.trim(),f=d.length>0,p=n,m;",
    "t[5]!==u||t[6]!==r||t[7]!==o||t[8]!==s||t[9]!==i||t[10]!==a||t[11]!==f?(m=f?(0,$v.jsx)(pp,{message:i,sentAtMs:a,collapsedLineCount:ey,compactActions:u,cwd:o,hostId:s,threadId:r}):null,t[5]=u,t[6]=r,t[7]=o,t[8]=s,t[9]=i,t[10]=a,t[11]=f,t[12]=m):m=t[12];return m}",
    "function oy(e){let t=(0,sy.c)(13),{conversationId:n,sourceThreadId:r,message:i,sentAtMs:a,cwd:o,hostId:s,compactActions:c}=e,l=c!==void 0&&c,u=Zi(),d=ii()?`/hotkey-window/thread/${r}`:`/local/${r}`,p,f,m,h;",
    "t[1]!==f?(p=(0,cy.jsx)(Fmt,{id:`localConversation.codexDelegationUserMessage.app`}),t[1]=p):p=t[1];",
    "t[5]!==l||t[6]!==n||t[7]!==o||t[8]!==s||t[9]!==i||t[10]!==a||t[11]!==m?(h=(0,cy.jsx)(Zv,{conversationId:n,label:p,message:i,sentAtMs:a,cwd:o,hostId:s,compactActions:l,onLabelClick:m}),t[5]=l,t[6]=n,t[7]=o,t[8]=s,t[9]=i,t[10]=a,t[11]=m,t[12]=h):h=t[12];return h}",
    "export const fixture=true;"
  ].join("");
}

function ownerFixture() {
  return [
    'import{title as P}from"./app-primary-fixture.js";',
    'import{h as H,q as S}from"./app-initial-fixture.js";',
    'import{t as uh}from"./user-message-fixture.js";',
    "const stock={defaultMessage:`Sent by {appName} from another task`};",
    "function MS(e){let t=(0,NS.c)(13),{conversationId:n,sourceThreadId:r,message:i,sentAtMs:a,cwd:o,hostId:s,compactActions:c}=e,l,p,f,m,h,d=go()?`/hotkey-window/thread/${r}`:`/local/${r}`;",
    "t[1]!==f?(p=(0,PS.jsx)(Fmt,{id:`localConversation.codexDelegationUserMessage.app`}),t[1]=p):p=t[1];",
    "t[5]!==l||t[6]!==n||t[7]!==o||t[8]!==s||t[9]!==i||t[10]!==a||t[11]!==m?(h=(0,PS.jsx)(CS,{conversationId:n,label:p,message:i,sentAtMs:a,cwd:o,hostId:s,compactActions:l,onLabelClick:m}),t[5]=l,t[6]=n,t[7]=o,t[8]=s,t[9]=i,t[10]=a,t[11]=m,t[12]=h):h=t[12];return h}",
    "function CS(e){let t=(0,wS.c)(16),{label:n,conversationId:r,message:i,sentAtMs:a,cwd:o,hostId:s,compactActions:c,onLabelClick:l}=e,f=true,u=c,m,p;",
    "m=f?(0,TS.jsx)(uh,{message:i,sentAtMs:a,collapsedLineCount:ES,compactActions:u,cwd:o,hostId:s,threadId:r}):null;",
    "t[5]!==u||t[6]!==r||t[7]!==o||t[8]!==s||t[9]!==i||t[10]!==a||t[11]!==f?(p=m,t[5]=u,t[6]=r,t[7]=o,t[8]=s,t[9]=i,t[10]=a,t[11]=f,t[12]=m):p=t[12];return p}",
    "export const fixture=true;"
  ].join("");
}

function genericBubbleFixture() {
  return [
    "function bt(e){let t=(0,St.c)(152),{message:n,turnId:C,cwd:w,hostId:T}=e,G,U,Ke,q;",
    "if(t[45]!==G||t[46]!==U||t[47]!==Ke){q=(0,Z.jsx)(`div`,{\"data-user-message-bubble\":!0,className:`max-w-full`}),t[45]=G,t[46]=U,t[47]=Ke,t[48]=q}return q}",
    "export{bt as t};"
  ].join("");
}

function linuxBubbleFixture() {
  return [
    "function bt(e){let t=(0,St.c)(152),{message:n,turnId:w,cwd:T,hostId:E}=e,K,G,Ke,q;",
    "if(t[45]!==K||t[46]!==G||t[47]!==Ke){q=(0,Z.jsx)(`div`,{\"data-user-message-bubble\":!0,className:`max-w-full`}),t[45]=K,t[46]=G,t[47]=Ke,t[48]=q}return q}",
    "export{bt as t};"
  ].join("");
}

function build9922BubbleFixture() {
  return [
    "function yt(e){let t=(0,xt.c)(153),{message:r,turnId:C,cwd:w,hostId:T}=e,F,I,K,W,Ke,J,qe;",
    "if(t[30]!==F||t[45]!==I||t[46]!==K||t[47]!==W||t[48]!==Ke){qe=(0,$.jsx)(`div`,{\"data-user-message-bubble\":!0,className:`max-w-full`}),t[30]=F,t[45]=I,t[46]=K,t[47]=W,t[48]=Ke,t[49]=J,t[50]=qe}return qe}",
    "export{yt as t};"
  ].join("");
}

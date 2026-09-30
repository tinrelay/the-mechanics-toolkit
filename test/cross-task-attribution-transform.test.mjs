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
  verifyProfile("Linux build 10954", linux10954InitialFixture(), build9922PrimaryFixture(),
    linux10954BubbleFixture(), linux10954OwnerFixture());
  verifyProfile("Linux build 9771", linux9771InitialFixture(), linux9771PrimaryFixture(),
    linux9771BubbleFixture(), build9922OwnerFixture());
  verifyProfile("generic build 9922", build9922InitialFixture(), build9922PrimaryFixture(),
    build9922BubbleFixture(), build9922OwnerFixture());
  verifyProfile("build 10789", build10789InitialFixture(), build9922PrimaryFixture(),
    build10789BubbleFixture(), build10789OwnerFixture());
  verifyProfile("build 11645", build11645InitialFixture(), build9922PrimaryFixture(),
    build11645BubbleFixture(), build11645OwnerFixture());
  verifyNative12246();
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
    fs.writeFileSync(path.join(assets, "app-shared-fixture.js"),
      'function u8(e){return `local:${e}`}export{u8 as Tk};');

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

  function verifyNative12246() {
    const extracted = path.join(scratch, "build-12246");
    const assets = path.join(extracted, "webview/assets");
    fs.mkdirSync(assets, {recursive: true});
    const ownerTarget = path.join(assets, "sites-end-resource-fixture.js");
    const initialTarget = path.join(assets, "app-initial-fixture.js");
    fs.writeFileSync(initialTarget, [
      'import{A5t as Pe,dJt as Z,OI as Yo}from"./app-shared-fixture.js";',
      'function B_o(e){return e.localTitle}var H_o;H_o=dl(Z,(e,{get:t})=>{if(e==null)return null;let r={hasConversation:true,liveTitle:null},i=null;return B_o({...r,localTitle:i})});',
      'function u6s(){let e=(0,p6s.c)(12),t=Pe(Z),n=`sidebarElectron.recentChats`;return n}',
      'var mj;mj=dl(Z,(e,{get:t})=>{let n=ls(e);switch(n?.kind){case`local`:return{kind:`local`,cwd:n.cwd}}});',
      'export{H_o as QW,mj as nhn};'
    ].join(""));
    fs.writeFileSync(path.join(assets, "app-primary-fixture.js"), 'export const noop=true;');
    fs.writeFileSync(path.join(assets, "app-shared-fixture.js"), 'export const noop=true;');
    fs.writeFileSync(ownerTarget, [
      'import{noop as P}from"./app-primary-fixture.js";',
      'import{QW as T}from"./app-initial-fixture.js";',
      'import{noop as G}from"./app-shared-fixture.js";',
      'function bv(e){let t=(0,xv.c)(21),{label:n,alignment:r,accentColor:i,conversationId:a,message:o,sentAtMs:s,cwd:c,hostId:l,compactActions:u,onLabelClick:d}=e,f=r===void 0?`end`:r,g=f===`start`?`items-start`:`items-end`;return(0,Sv.jsx)(_g,{alignment:f,accentColor:i,message:o})}',
      'function Lx(e){let t=(0,Rx.c)(13),{conversationId:n,sourceThreadId:r,message:i,sentAtMs:a,cwd:o,hostId:s,compactActions:c}=e,l=c!==void 0&&c,u=Er(),d=Oe()?`/hotkey-window/thread/${r}`:`/local/${r}`,f=null;',
      'let p;t[1]===Symbol.for(`react.memo_cache_sentinel`)?(p=(0,zx.jsx)(G,{id:`localConversation.codexDelegationUserMessage.app`,defaultMessage:`Sent by {appName} from another task`}),t[1]=p):p=t[1];',
      'let m=()=>u(d),h;return t[5]!==l||t[6]!==n||t[7]!==o||t[8]!==s||t[9]!==i||t[10]!==a||t[11]!==m?(h=(0,zx.jsx)(bv,{conversationId:n,label:p,message:i,sentAtMs:a,cwd:o,hostId:s,compactActions:l,onLabelClick:m}),t[5]=l,t[6]=n,t[7]=o,t[8]=s,t[9]=i,t[10]=a,t[11]=m,t[12]=h):h=t[12],h}',
      'export const fixture=true;'
    ].join(""));
    assert.equal(runToolkit("check", extracted).state, "needs-apply");
    assert.equal(runToolkit("apply", extracted).state, "applied");
    const once = fs.readFileSync(ownerTarget);
    const probe = spawnSync(process.execPath, [behavioralProbe, extracted], {encoding: "utf8"});
    assert.equal(probe.status, 0, probe.stderr || probe.stdout);
    assert.equal(runToolkit("apply", extracted).state, "applied");
    assert.deepEqual(fs.readFileSync(ownerTarget), once);
  }

  function runToolkit(action, extracted) {
    const result = spawnSync(process.execPath, [toolkit, "patch", "cross-task-attribution", action, extracted], { encoding: "utf8" });
    assert.equal(result.status, 0, result.stderr || result.stdout);
    return JSON.parse(result.stdout);
  }
} finally {
  fs.rmSync(scratch, { recursive: true, force: true });
}

function linux9771PrimaryFixture() {
  return [
    "const $=Symbol(`scope`);function cyc(e){return e}",
    "var uyc,owner=t((()=>{uyc=lf($,(e,{get:t})=>{let n={hasConversation:true,liveTitle:null,summaryTitle:null},r=null;return cyc({...n,localTitle:r})})}));",
    "export{uyc as fm};"
  ].join("");
}

function build9922InitialFixture() {
  return [
    "const $=Symbol(`scope`),qp=Symbol(`context`),React={useContext(){},useRef(){}};",
    "function xf(e){let t=React.useContext(qp),n=React.useRef(null);return{get queryClient(){return t},get(){},watch(){}}}",
    "function Vvl(){let e=(0,Wvl.c)(12),t=xf($),n=`sidebarElectron.recentChats`;return n}",
    "function cyc({hasConversation:e,liveTitle:t,localTitle:n,summaryTitle:r}){return e?n??r:null}",
    "var uyc;function dyc(){return(dyc=n((()=>{uyc=uf($,(e,{get:t})=>{let n={hasConversation:true,liveTitle:null,summaryTitle:null},r=null;return cyc({...n,localTitle:r})})})))()}",
    "var JF;JF=uf($,(e,{get:t})=>{let n=e;return{kind:`local`,cwd:n.cwd}});function PT(e){return `local:${e}`}",
    "export{xf as kmn,$ as Bpn,uyc as fm,JF as jF,PT as pT};"
  ].join("");
}

function linux9771InitialFixture() {
  return build9922InitialFixture()
    .replace("uyc=uf($,", "uyc=lf($,")
    .replace("function Vvl(){let e=(0,Wvl.c)(12),", "function xyl(){let e=(0,wyl.c)(12),")
    .replace("JF=uf($,", "JF=lf($,")
    .replace("function PT(", "function cT(")
    .replace("PT as pT", "cT as pT");
}

function build9922PrimaryFixture() {
  return "const noop=true;export{noop as z};";
}

function build10789InitialFixture() {
  return [
    'import{LX as jr,ZI as X}from"./app-shared-fixture.js";',
    'function _Bs(e){return e.localTitle}var yBs;function bBs(){yBs=ns(X,(e,{get:t})=>{let n={hasConversation:true,liveTitle:null},r=null;return _Bs({...n,localTitle:r})})}',
    'function Bzc(){let e=(0,Uzc.c)(12),t=jr(X),n=Ao();return n}',
    'var kF;kF=ns(X,(e,{get:t})=>({kind:`local`,cwd:e.cwd}));function Hw(e){return `local:${e}`}',
    'export{yBs as x7,kF as k7,Hw as h7};'
  ].join("");
}

function linux10954InitialFixture() {
  return [
    'import{PX as Qr,XI as X}from"./app-shared-fixture.js";',
    'function _Bs(e){return e.localTitle}var yBs;function bBs(){yBs=Ia(X,(e,{get:t})=>{let n={hasConversation:true,liveTitle:null},r=null;return _Bs({...n,localTitle:r})})}',
    'function Bzc(){let e=(0,Uzc.c)(12),t=Qr(X),n=`sidebarElectron.recentChats`;return n}',
    'var pF;pF=Ia(X,(e,{get:t})=>({kind:`local`,cwd:e.cwd}));function Aw(e){return `local:${e}`}',
    'export{yBs as x7,pF as p7,Aw as a7};'
  ].join("");
}

function build11645InitialFixture() {
  return [
    'import{cUt as Jl,tSt as Q}from"./app-shared-fixture.js";',
    'function s2i(e){return e.localTitle}var l2i;function u2i(){l2i=to(Q,(e,{get:t})=>{if(e==null)return null;let n={hasConversation:true,liveTitle:null},r=null;return s2i({...n,localTitle:r})})}',
    'function _0a(){let e=(0,b0a.c)(12),t=Jl(Q),n=`sidebarElectron.recentChats`;return n}',
    'var zA;zA=to(Q,(e,{get:t})=>{let n=zd(e);switch(n?.kind){case`local`:return{kind:`local`,cwd:n.cwd}}});',
    'export{l2i as wS,zA as zS};'
  ].join("");
}

function build11645OwnerFixture() {
  return [
    'import{z as P}from"./app-primary-fixture.js";',
    'import{wS as T}from"./app-initial-fixture.js";',
    'import{L1t as G}from"./app-shared-fixture.js";',
    'import{t as Bf}from"./user-message-fixture.js";',
    'const stock={defaultMessage:`Sent by {appName} from another task`};',
    'function iy(e){let t=(0,ay.c)(16),{label:n,conversationId:r,message:i,sentAtMs:a,cwd:o,hostId:s,compactActions:c,onLabelClick:l}=e,u=c!==void 0&&c,d=i.trim(),f=d.length>0,p=n,m;',
    't[5]!==u||t[6]!==r||t[7]!==o||t[8]!==s||t[9]!==i||t[10]!==a||t[11]!==f?(m=f?(0,oy.jsx)(Bf,{message:i,sentAtMs:a,collapsedLineCount:sy,compactActions:u,cwd:o,hostId:s,threadId:r}):null,t[5]=u,t[6]=r,t[7]=o,t[8]=s,t[9]=i,t[10]=a,t[11]=f,t[12]=m):m=t[12];return m}',
    'function _y(e){let t=(0,vy.c)(13),{conversationId:n,sourceThreadId:r,message:i,sentAtMs:a,cwd:o,hostId:s,compactActions:c}=e,l,p,m,h,g,d=go()?`/hotkey-window/thread/${r}`:`/local/${r}`;',
    't[1]!==p?(m=(0,yy.jsx)(Fmt,{id:`localConversation.codexDelegationUserMessage.app`}),t[1]=m):m=t[1];',
    't[5]!==l||t[6]!==n||t[7]!==o||t[8]!==s||t[9]!==i||t[10]!==a||t[11]!==h?(g=(0,yy.jsx)(iy,{conversationId:n,label:m,message:i,sentAtMs:a,cwd:o,hostId:s,compactActions:l,onLabelClick:h}),t[5]=l,t[6]=n,t[7]=o,t[8]=s,t[9]=i,t[10]=a,t[11]=h,t[12]=g):g=t[12];return g}',
    'export const fixture=true;'
  ].join("");
}

function build11645BubbleFixture() {
  return [
    'function Ot(e){let t=(0,At.c)(160),{message:n,turnId:E,cwd:D,hostId:we}=e,foo=0;',
    'return(0,$.jsx)(`div`,{"data-user-message-bubble":!0,className:`max-w-full`})}',
    'export{Ot as t};'
  ].join("");
}

function linux10954OwnerFixture() {
  return build10789OwnerFixture().replace('t as jf', 't as Mf').replace('(jf,{message:', '(Mf,{message:');
}

function linux10954BubbleFixture() {
  return [
    'function yt(e){let n=(0,xt.c)(153),{message:r,turnId:O,cwd:k,hostId:A}=e,F,Re,Ye,J;',
    'if(n[47]!==Re||n[48]!==Ye){J=(0,$.jsx)(`div`,{"data-user-message-bubble":!0,className:`max-w-full`}),n[47]=Re,n[48]=Ye,n[49]=J}return J}',
    'export{yt as t};'
  ].join("");
}

function build10789OwnerFixture() {
  return [
    'import{z as P}from"./app-primary-fixture.js";',
    'import{x7 as T}from"./app-initial-fixture.js";',
    'import{Q as q}from"./app-shared-fixture.js";',
    'import{t as jf}from"./user-message-fixture.js";',
    'const stock={defaultMessage:`Sent by {appName} from another task`};',
    'function cv(e){let t=(0,lv.c)(16),{label:n,conversationId:r,message:i,sentAtMs:a,cwd:o,hostId:s,compactActions:c,onLabelClick:l}=e,u=c!==void 0&&c,d=i.trim(),f=d.length>0,p=n,m;',
    't[5]!==u||t[6]!==r||t[7]!==o||t[8]!==s||t[9]!==i||t[10]!==a||t[11]!==f?(m=f?(0,uv.jsx)(jf,{message:i,sentAtMs:a,collapsedLineCount:dv,compactActions:u,cwd:o,hostId:s,threadId:r}):null,t[5]=u,t[6]=r,t[7]=o,t[8]=s,t[9]=i,t[10]=a,t[11]=f,t[12]=m):m=t[12];return m}',
    'function _v(e){let t=(0,vv.c)(13),{conversationId:n,sourceThreadId:r,message:i,sentAtMs:a,cwd:o,hostId:s,compactActions:c}=e,l,p,f,m,h,d=go()?`/hotkey-window/thread/${r}`:`/local/${r}`;',
    't[1]!==f?(p=(0,yv.jsx)(Fmt,{id:`localConversation.codexDelegationUserMessage.app`}),t[1]=p):p=t[1];',
    't[5]!==l||t[6]!==n||t[7]!==o||t[8]!==s||t[9]!==i||t[10]!==a||t[11]!==m?(h=(0,yv.jsx)(cv,{conversationId:n,label:p,message:i,sentAtMs:a,cwd:o,hostId:s,compactActions:l,onLabelClick:m}),t[5]=l,t[6]=n,t[7]=o,t[8]=s,t[9]=i,t[10]=a,t[11]=m,t[12]=h):h=t[12];return h}',
    'export const fixture=true;'
  ].join("");
}

function build10789BubbleFixture() {
  return [
    'function yt(e){let t=(0,xt.c)(153),{message:r,turnId:D,cwd:O,hostId:k}=e,F,ze,Xe,q;',
    'if(t[47]!==ze||t[48]!==Xe){q=(0,$.jsx)(`div`,{"data-user-message-bubble":!0,className:`max-w-full`}),t[47]=ze,t[48]=Xe,t[49]=q}return q}',
    'export{yt as t};'
  ].join("");
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

function linux9771BubbleFixture() {
  return [
    "function yt(e){let t=(0,xt.c)(153),{message:r,turnId:S,cwd:C,hostId:w}=e,F,I,K,W,Ke,J,qe;",
    "if(t[30]!==F||t[45]!==I||t[46]!==K||t[47]!==W||t[48]!==Ke){qe=(0,$.jsx)(`div`,{\"data-user-message-bubble\":!0,className:`max-w-full`}),t[45]=I,t[46]=K,t[47]=W,t[48]=Ke,t[49]=J,t[50]=qe}return qe}",
    "export{yt as t};"
  ].join("");
}

function build9922BubbleFixture() {
  return [
    "function yt(e){let t=(0,xt.c)(153),{message:r,turnId:C,cwd:w,hostId:T}=e,F,I,K,W,Ke,J,qe;",
    "if(t[30]!==F||t[45]!==I||t[46]!==K||t[47]!==W||t[48]!==Ke){qe=(0,$.jsx)(`div`,{\"data-user-message-bubble\":!0,className:`max-w-full`}),t[30]=F,t[45]=I,t[46]=K,t[47]=W,t[48]=Ke,t[49]=J,t[50]=qe}return qe}",
    "export{yt as t};"
  ].join("");
}

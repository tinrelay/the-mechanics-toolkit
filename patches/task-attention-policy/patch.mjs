#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { build9922 } from "./profiles/build9922.mjs";
import { linuxBuild9647 } from "./profiles/linux.mjs";

const command = process.argv[2];
const root = path.resolve(process.argv[3] ?? "");
if (!new Set(["check", "apply"]).has(command) || !process.argv[3]) {
  throw new Error("usage: task-attention-policy.mjs check|apply EXTRACTED_ASAR_ROOT");
}

const assets = path.join(root, "webview/assets");
const target = uniqueAsset(/^app-initial-.*\.js$/);
const primaryTarget = uniqueAsset(/^app-primary-.*\.js$/);
let source = fs.readFileSync(target, "utf8");
const rowTarget = source.includes(build9922.primaryOwner) || source.includes(`function MTKuseTaskAttention${build9922.suffix}(`)
  ? target : primaryTarget;
let primarySource = fs.readFileSync(rowTarget, "utf8");
let state = inspectState(source, primarySource);

if (command === "apply" && state === "needs-apply") {
  if (!source.includes("globalThis.__MTK_AGENT_ROSTER__=Object.freeze(")) {
    throw new Error("task-attention-policy requires agent-roster first");
  }
  if (linux9647Contracts(source, primarySource).every(Boolean)) {
    ({ appSource: source, primarySource } = patchLinux9647(source, primarySource));
  } else if (build9922Contracts(source, primarySource).every(Boolean)) {
    source = patchBuild9922(source);
    primarySource = source;
  } else if (current9647Contracts(source, primarySource).every(Boolean)) {
    ({ appSource: source, primarySource } = patch9647(source, primarySource));
  } else {
    throw new Error("Upstream changed: missing build-9647 task attention contract");
  }
  fs.writeFileSync(target, source);
  if (rowTarget !== target) fs.writeFileSync(rowTarget, primarySource);
  syntaxCheck(target);
  if (rowTarget !== target) syntaxCheck(rowTarget);
  state = inspectState(source, primarySource);
  if (state !== "applied") throw new Error("task attention policy transform did not verify");
}

process.stdout.write(`${JSON.stringify({
  state,
  policy: ".codex/agent-roster.json",
  targets: [...new Set([target, rowTarget])].map(file => path.relative(root, file))
}, null, 2)}\n`);

function inspectState(value, primaryValue) {
  const build9922Markers = [
    ...build9922.applied.app.map(marker => value.includes(marker)),
    ...build9922.applied.primary.map(marker => primaryValue.includes(marker))
  ];
  const linuxMarkers = [
    ...linuxBuild9647.applied.app.map(marker => value.includes(marker)),
    ...linuxBuild9647.applied.primary.map(marker => primaryValue.includes(marker))
  ];
  const currentMarkers = [
    value.includes("const MTKattentionRosterBridge=1"),
    value.includes("MTKattentionPolicyAtom=Ip(Q,0)"),
    value.includes("function MTKattentionIgnoredThread9647("),
    value.includes("function MTKattentionSubscribe9647("),
    value.includes("function MTKuseAttentionBootstrap9647("),
    value.includes("function PYs(){MTKuseAttentionBootstrap9647();MTKuseAgentRoster();MTKusePaletteBootstrap();"),
    primaryValue.includes("function MTKuseTaskAttention9647("),
    primaryValue.includes("MTKattentionIgnoredForTask=MTKuseTaskAttention9647(_t,n)"),
    primaryValue.includes("let Rt=MTKattentionIgnoredForTask?{...Lt,unread:!1,unreadCount:0}:Lt"),
    primaryValue.includes("Ht=MTKattentionIgnoredForTask?[]:Vt==null?[]:[Vt]"),
    primaryValue.includes("let Jt=MTKattentionIgnoredForTask?void 0:qt"),
    primaryValue.includes("hasUnreadTurn:!MTKattentionIgnoredForTask&&!At&&tt===!0"),
    value.includes("s=s.filter(t=>!MTKattentionIgnoredThread9647(e,t))"),
    value.includes("[desktop-notifications] suppressed task-attention-policy turn-complete")
  ];
  const hasLinux = value.includes(`function MTKuseAttentionBootstrap${linuxBuild9647.suffix}(`) ||
    primaryValue.includes(`function MTKuseTaskAttention${linuxBuild9647.suffix}(`);
  const hasCurrent = value.includes("function MTKuseAttentionBootstrap9647(") ||
    primaryValue.includes("function MTKuseTaskAttention9647(");
  const hasBuild9922 = value.includes(`function MTKuseAttentionBootstrap${build9922.suffix}(`) ||
    primaryValue.includes(`function MTKuseTaskAttention${build9922.suffix}(`);
  if (hasBuild9922) {
    if (!build9922Markers.every(Boolean)) throw new Error("Unrecognized build-9922 task attention patch: partial markers");
    return "applied";
  }
  if (hasLinux) {
    if (!linuxMarkers.every(Boolean)) throw new Error("Unrecognized Linux build-9647 task attention patch: partial markers");
    return "applied";
  }
  if (hasCurrent) {
    if (!currentMarkers.every(Boolean)) throw new Error("Unrecognized build-9647 task attention patch: partial markers");
    return "applied";
  }
  if (value.includes("MTKattention") || primaryValue.includes("MTKattention")) {
    throw new Error("Unrecognized build-9647 task attention patch: partial markers");
  }
  if (linux9647Contracts(value, primaryValue).every(Boolean) ||
      current9647Contracts(value, primaryValue).every(Boolean) ||
      build9922Contracts(value, primaryValue).every(Boolean)) {
    return "needs-apply";
  }
  throw new Error("Upstream changed: missing qualified task attention contract");
}

function build9922Contracts(appValue, primaryValue) {
  return [
    [build9922.pristineAppRoot, build9922.appRootBefore]
      .some(contract => appValue.includes(contract)),
    appValue.includes(build9922.notificationOwner),
    appValue.includes(build9922.notificationBefore),
    appValue.includes(build9922.atomFactoryContract),
    appValue.includes(build9922.atomBefore),
    appValue.includes(build9922.dockBefore),
    primaryValue.includes(build9922.primaryOwner),
    primaryValue.includes(build9922.titleBefore),
    ...build9922.pristinePrimary.map(contract => primaryValue.includes(contract))
  ];
}

function patchBuild9922(value) {
  const suffix = build9922.suffix;
  const helper = `const MTKattentionRosterBridge=1;var MTKattentionPolicyAtom;function MTKattentionMatch${suffix}(e,t){let n=globalThis.__MTK_AGENT_ROSTER__,r=n?.matches(e,t)??[],i=!1;for(let e of r){let t=e.data.muteCompletion;if(t===void 0)continue;if(typeof t!=="boolean"){n?.diagnose("invalid-mute-completion",{ownerRoot:e.ownerRoot,key:e.key});continue}t&&(i=!0)}return i}function MTKattentionIgnored${suffix}(e,t){return MTKattentionMatch${suffix}(e,t)}function MTKattentionIgnoredThread${suffix}(e,t){let n=${build9922.decoder}(t);return n?.kind==="local"?MTKattentionMatch${suffix}(null,n.threadId):n?.kind==="remote"?MTKattentionMatch${suffix}(null,n.taskId):!1}function MTKattentionSubscribe${suffix}(e){return globalThis.__MTK_AGENT_ROSTER__?.subscribe(e)??(()=>{})}function MTKuseAttentionBootstrap${suffix}(){let e=${build9922.scopeAfter};return ${build9922.react}.useEffect(()=>MTKattentionSubscribe${suffix}(()=>e.set(MTKattentionPolicyAtom,e=>(e??0)+1)),[e]),globalThis.__MTKattentionIgnored=MTKattentionIgnored${suffix},globalThis.__MTKattentionSubscribe=MTKattentionSubscribe${suffix},null}`;
  let patched = replaceOnce(value, build9922.appRootBefore, helper + build9922.appRootAfter, "build-9922 attention bootstrap");
  patched = replaceOnce(patched, build9922.atomBefore, build9922.atomAfter, "build-9922 attention atom");
  patched = replaceOnce(patched, build9922.dockBefore, build9922.dockAfter, "build-9922 Dock badge projection");
  patched = replaceOnce(patched, build9922.notificationBefore,
    `let a=uYr(e.getConversation(t.conversationId));if(MTKattentionIgnored${suffix}(a,t.conversationId)){$t.debug(\`[desktop-notifications] suppressed task-attention-policy turn-complete\`,{safe:{conversationId:t.conversationId},sensitive:{}});return}let{navigationPath:o,navigateToNotification:s}=h(t.conversationId)`,
    "build-9922 native notification projection");
  const rowHelper = `function MTKuseTaskAttention${suffix}(e,t){let n=globalThis.__MTKattentionSubscribe??(()=>()=>{});return ${build9922.primaryReact}.useSyncExternalStore(n,()=>globalThis.__MTKattentionIgnored?.(e,t)===!0,()=>!1)}`;
  patched = replaceOnce(patched, build9922.primaryOwner, rowHelper + build9922.primaryOwner, "build-9922 task attention hook");
  patched = replaceOnce(patched, build9922.titleBefore, build9922.titleAfter, "build-9922 local title");
  patched = replaceOnce(patched, build9922.pristinePrimary[0], "):Wt=t[25];let Gt=MTKattentionIgnoredForTask?{...Wt,unread:!1,unreadCount:0}:Wt,Kt;t[26]", "build-9922 status projection");
  patched = replaceOnce(patched, build9922.pristinePrimary[1], "Yt=MTKattentionIgnoredForTask?[]:Jt==null?[]:[Jt]", "build-9922 approval projection");
  patched = replaceOnce(patched, build9922.pristinePrimary[2], "):en=t[45];let tn=MTKattentionIgnoredForTask?void 0:en,nn;t[46]", "build-9922 waiting projection");
  return replaceOnce(patched, build9922.pristinePrimary[3], "hasUnreadTurn:!MTKattentionIgnoredForTask&&!Rt&&lt===!0", "build-9922 hover-card unread projection");
}

function current9647Contracts(appValue, primaryValue) {
  return [
    [
      "function PYs(){MTKuseAgentRoster();MTKusePaletteBootstrap();let e=(0,LYs.c)(12),",
      "function PYs(){MTKuseAgentRoster();let e=(0,LYs.c)(12),",
      "function PYs(){MTKusePaletteBootstrap();let e=(0,LYs.c)(12),",
      "function PYs(){let e=(0,LYs.c)(12),"
    ].some(contract => appValue.includes(contract)),
    appValue.includes("function uHs(e,t){l.info(`[desktop-notifications] service starting`)"),
    appValue.includes("let a=VR(e.getConversation(t.conversationId)),{navigationPath:o,navigateToNotification:s}=g(t.conversationId)"),
    appValue.includes("function Ip(e,t,n){let r=Pp(`signal`,e,"),
    appValue.includes("U3a,W3a=t((()=>{X(),dT(),WL(),$(),IO(),iNi(),m$(),uM(),FH(),Fj(),WH(),U3a=Y(Q,({get:e})=>"),
    appValue.includes("s=t===`work`?Wxr({cloudThreadsAllowed:i,localThreadsAllowed:nM(e(aT)),threadKeys:o}):o;return r+"),
    primaryValue.includes("function FDn(e){let t=(0,LDn.c)(146),"),
    primaryValue.includes("_t=Fy(GEn,{hostId:Ke??`local`,threadId:n})??Be?.title??null,vt="),
    primaryValue.includes("):Lt=t[25];let Rt=Lt,zt;t[26]"),
    primaryValue.includes("Ht=Vt==null?[]:[Vt]"),
    primaryValue.includes("):qt=t[45];let Jt=qt,Yt;t[46]"),
    primaryValue.includes("hasUnreadTurn:!At&&tt===!0")
  ];
}

function patch9647(appValue, primaryValue) {
  const helper = String.raw`const MTKattentionRosterBridge=1;var MTKattentionPolicyAtom;function MTKattentionMatch9647(e,t){let n=globalThis.__MTK_AGENT_ROSTER__,r=n?.matches(e,t)??[],i=!1;for(let e of r){let t=e.data.muteCompletion;if(t===void 0)continue;if(typeof t!=="boolean"){n?.diagnose("invalid-mute-completion",{ownerRoot:e.ownerRoot,key:e.key});continue}t&&(i=!0)}return i}function MTKattentionIgnored9647(e,t){return MTKattentionMatch9647(e,t)}function MTKattentionIgnoredThread9647(e,t){let n=Nj(t);return n?.kind==="local"?MTKattentionMatch9647(null,n.conversationId??n.threadId):n?.kind==="remote"?MTKattentionMatch9647(n.task?.title,n.task?.id):!1}function MTKattentionSubscribe9647(e){return globalThis.__MTK_AGENT_ROSTER__?.subscribe(e)??(()=>{})}function MTKuseAttentionBootstrap9647(){let e=nm(Q);return RYs.useEffect(()=>MTKattentionSubscribe9647(()=>e.set(MTKattentionPolicyAtom,e=>(e??0)+1)),[e]),globalThis.__MTKattentionIgnored=MTKattentionIgnored9647,globalThis.__MTKattentionSubscribe=MTKattentionSubscribe9647,null}`;
  let appPatched = replaceOnce(appValue, "function PYs(){MTKuseAgentRoster();MTKusePaletteBootstrap();let e=(0,LYs.c)(12),", `${helper}function PYs(){MTKuseAttentionBootstrap9647();MTKuseAgentRoster();MTKusePaletteBootstrap();let e=(0,LYs.c)(12),`, "build-9647 attention bootstrap");
  appPatched = replaceOnce(appPatched, "U3a,W3a=t((()=>{X(),dT(),WL(),$(),IO(),iNi(),m$(),uM(),FH(),Fj(),WH(),U3a=Y(Q,({get:e})=>", "U3a,W3a=t((()=>{X(),dT(),WL(),$(),IO(),iNi(),m$(),uM(),FH(),Fj(),WH(),MTKattentionPolicyAtom=Ip(Q,0),U3a=Y(Q,({get:e})=>", "build-9647 attention atom");
  appPatched = replaceOnce(appPatched, "s=t===`work`?Wxr({cloudThreadsAllowed:i,localThreadsAllowed:nM(e(aT)),threadKeys:o}):o;return r+", "s=t===`work`?Wxr({cloudThreadsAllowed:i,localThreadsAllowed:nM(e(aT)),threadKeys:o}):o,c=e(MTKattentionPolicyAtom);c!=null&&(s=s.filter(t=>!MTKattentionIgnoredThread9647(e,t)));return r+", "build-9647 Dock badge projection");
  appPatched = replaceOnce(appPatched, "let a=VR(e.getConversation(t.conversationId)),{navigationPath:o,navigateToNotification:s}=g(t.conversationId)", "let a=VR(e.getConversation(t.conversationId));if(MTKattentionIgnored9647(a,t.conversationId)){l.debug(`[desktop-notifications] suppressed task-attention-policy turn-complete`,{safe:{conversationId:t.conversationId},sensitive:{}});return}let{navigationPath:o,navigateToNotification:s}=g(t.conversationId)", "build-9647 native notification projection");

  const primaryHelper = 'function MTKuseTaskAttention9647(e,t){let n=globalThis.__MTKattentionSubscribe??(()=>()=>{});return RDn.useSyncExternalStore(n,()=>globalThis.__MTKattentionIgnored?.(e,t)===!0,()=>!1)}';
  let primaryPatched = replaceOnce(primaryValue, "function FDn(e){let t=(0,LDn.c)(146),", `${primaryHelper}function FDn(e){let t=(0,LDn.c)(146),`, "build-9647 task attention hook");
  primaryPatched = replaceOnce(primaryPatched, "_t=Fy(GEn,{hostId:Ke??`local`,threadId:n})??Be?.title??null,vt=", "_t=Fy(GEn,{hostId:Ke??`local`,threadId:n})??Be?.title??null,MTKattentionIgnoredForTask=MTKuseTaskAttention9647(_t,n),vt=", "build-9647 local title");
  primaryPatched = replaceOnce(primaryPatched, "):Lt=t[25];let Rt=Lt,zt;t[26]", "):Lt=t[25];let Rt=MTKattentionIgnoredForTask?{...Lt,unread:!1,unreadCount:0}:Lt,zt;t[26]", "build-9647 status projection");
  primaryPatched = replaceOnce(primaryPatched, "Ht=Vt==null?[]:[Vt]", "Ht=MTKattentionIgnoredForTask?[]:Vt==null?[]:[Vt]", "build-9647 approval projection");
  primaryPatched = replaceOnce(primaryPatched, "):qt=t[45];let Jt=qt,Yt;t[46]", "):qt=t[45];let Jt=MTKattentionIgnoredForTask?void 0:qt,Yt;t[46]", "build-9647 waiting projection");
  primaryPatched = replaceOnce(primaryPatched, "hasUnreadTurn:!At&&tt===!0", "hasUnreadTurn:!MTKattentionIgnoredForTask&&!At&&tt===!0", "build-9647 hover-card unread projection");
  return { appSource: appPatched, primarySource: primaryPatched };
}

function linux9647Contracts(appValue, primaryValue) {
  return [
    [
      "function PYs(){MTKuseAgentRoster();MTKusePaletteBootstrap();let e=(0,LYs.c)(12),",
      "function PYs(){MTKuseAgentRoster();let e=(0,LYs.c)(12),",
      "function PYs(){MTKusePaletteBootstrap();let e=(0,LYs.c)(12),",
      "function PYs(){let e=(0,LYs.c)(12),"
    ].some(contract => appValue.includes(contract)),
    appValue.includes(linuxBuild9647.notificationOwner),
    appValue.includes(linuxBuild9647.notificationBefore),
    appValue.includes(linuxBuild9647.atomFactoryContract),
    appValue.includes(linuxBuild9647.atomBefore),
    appValue.includes(linuxBuild9647.dockBefore),
    primaryValue.includes(linuxBuild9647.primaryOwner),
    primaryValue.includes(linuxBuild9647.titleBefore),
    ...linuxBuild9647.pristinePrimary.map(contract => primaryValue.includes(contract))
  ];
}

function patchLinux9647(appValue, primaryValue) {
  const suffix = linuxBuild9647.suffix;
  const helper = String.raw`const MTKattentionRosterBridge=1;var MTKattentionPolicyAtom;function MTKattentionMatch9647(e,t){let n=globalThis.__MTK_AGENT_ROSTER__,r=n?.matches(e,t)??[],i=!1;for(let e of r){let t=e.data.muteCompletion;if(t===void 0)continue;if(typeof t!=="boolean"){n?.diagnose("invalid-mute-completion",{ownerRoot:e.ownerRoot,key:e.key});continue}t&&(i=!0)}return i}function MTKattentionIgnored9647(e,t){return MTKattentionMatch9647(e,t)}function MTKattentionIgnoredThread9647(e,t){let n=Nj(t);return n?.kind==="local"?MTKattentionMatch9647(null,n.conversationId??n.threadId):n?.kind==="remote"?MTKattentionMatch9647(n.task?.title,n.task?.id):!1}function MTKattentionSubscribe9647(e){return globalThis.__MTK_AGENT_ROSTER__?.subscribe(e)??(()=>{})}function MTKuseAttentionBootstrap9647(){let e=nm(Q);return RYs.useEffect(()=>MTKattentionSubscribe9647(()=>e.set(MTKattentionPolicyAtom,e=>(e??0)+1)),[e]),globalThis.__MTKattentionIgnored=MTKattentionIgnored9647,globalThis.__MTKattentionSubscribe=MTKattentionSubscribe9647,null}`
    .replaceAll("9647", suffix)
    .replace(...linuxBuild9647.scope);
  const roots = [
    "function PYs(){MTKuseAgentRoster();MTKusePaletteBootstrap();let e=(0,LYs.c)(12),",
    "function PYs(){MTKuseAgentRoster();let e=(0,LYs.c)(12),",
    "function PYs(){MTKusePaletteBootstrap();let e=(0,LYs.c)(12),",
    "function PYs(){let e=(0,LYs.c)(12),"
  ];
  const root = roots.find(contract => appValue.includes(contract));
  if (root == null) throw new Error("Upstream changed: Linux build-9647 attention bootstrap owner is unrecognized");
  let appPatched = replaceOnce(
    appValue,
    root,
    helper + root.replace(linuxBuild9647.appRoot, `${linuxBuild9647.appRoot}MTKuseAttentionBootstrap${suffix}();`),
    "Linux build-9647 attention bootstrap"
  );
  appPatched = replaceOnce(appPatched, linuxBuild9647.atomBefore, linuxBuild9647.atomAfter, "Linux build-9647 attention atom");
  appPatched = replaceOnce(appPatched, linuxBuild9647.dockBefore, linuxBuild9647.dockAfter, "Linux build-9647 Dock badge projection");
  const notificationAfter = `let a=VR(e.getConversation(t.conversationId));if(MTKattentionIgnored${suffix}(a,t.conversationId)){l.debug(\`[desktop-notifications] suppressed task-attention-policy turn-complete\`,{safe:{conversationId:t.conversationId},sensitive:{}});return}let{navigationPath:o,navigateToNotification:s}=g(t.conversationId)`;
  appPatched = replaceOnce(appPatched, linuxBuild9647.notificationBefore, notificationAfter, "Linux build-9647 native notification projection");

  const primaryHelper = `function MTKuseTaskAttention${suffix}(e,t){let n=globalThis.__MTKattentionSubscribe??(()=>()=>{});return ${linuxBuild9647.primaryReact}.useSyncExternalStore(n,()=>globalThis.__MTKattentionIgnored?.(e,t)===!0,()=>!1)}`;
  let primaryPatched = replaceOnce(primaryValue, linuxBuild9647.primaryOwner, primaryHelper + linuxBuild9647.primaryOwner, "Linux build-9647 task attention hook");
  primaryPatched = replaceOnce(primaryPatched, linuxBuild9647.titleBefore, linuxBuild9647.titleAfter, "Linux build-9647 local title");
  primaryPatched = replaceOnce(primaryPatched, linuxBuild9647.pristinePrimary[0], "):Ft=t[25];let It=MTKattentionIgnoredForTask?{...Ft,unread:!1,unreadCount:0}:Ft,Lt;t[26]", "Linux build-9647 status projection");
  primaryPatched = replaceOnce(primaryPatched, linuxBuild9647.pristinePrimary[1], "Bt=MTKattentionIgnoredForTask?[]:zt==null?[]:[zt]", "Linux build-9647 approval projection");
  primaryPatched = replaceOnce(primaryPatched, linuxBuild9647.pristinePrimary[2], "):Gt=t[45];let Kt=MTKattentionIgnoredForTask?void 0:Gt,qt;t[46]", "Linux build-9647 waiting projection");
  primaryPatched = replaceOnce(primaryPatched, linuxBuild9647.pristinePrimary[3], "hasUnreadTurn:!MTKattentionIgnoredForTask&&!kt&&et===!0", "Linux build-9647 hover-card unread projection");
  return { appSource: appPatched, primarySource: primaryPatched };
}



function uniqueAsset(pattern) {
  if (!fs.existsSync(assets) || !fs.statSync(assets).isDirectory()) {
    throw new Error(`Missing extracted assets directory: ${assets}`);
  }
  const matches = fs.readdirSync(assets).filter(name => pattern.test(name));
  if (matches.length !== 1) throw new Error(`Upstream changed: found ${matches.length} assets matching ${pattern}`);
  return path.join(assets, matches[0]);
}

function replaceOnce(value, before, after, label) {
  const first = value.indexOf(before);
  if (first < 0 || value.indexOf(before, first + before.length) >= 0) {
    throw new Error(`Upstream changed: ${label} is not unique`);
  }
  return value.slice(0, first) + after + value.slice(first + before.length);
}

function count(value, needle) {
  return value.split(needle).length - 1;
}

function syntaxCheck(file) {
  const result = spawnSync(process.execPath, ["--input-type=module", "--check"], {
    encoding: "utf8",
    input: fs.readFileSync(file),
    maxBuffer: 64 * 1024 * 1024
  });
  if (result.status !== 0) {
    const output = result.stderr || result.stdout;
    const summary = output.match(/SyntaxError:[^\n]*/)?.[0] ?? output.trim().slice(-1000);
    throw new Error(`module syntax check failed for ${path.relative(root, file)}: ${summary}`);
  }
}

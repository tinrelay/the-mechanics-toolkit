#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { applyBuild9647ArchiveRuntime, inspectBuild9647ArchiveRuntime } from "./profiles/build9647.mjs";
import { build9922, applyBuild9922ArchiveRuntime, inspectBuild9922ArchiveRuntime } from "./profiles/build9922.mjs";
import { linuxBuild9647 } from "./profiles/linux.mjs";

const command = process.argv[2];
const root = path.resolve(process.argv[3] ?? "");
const configPath = readOption("--config");
if (!new Set(["check", "apply"]).has(command) || !process.argv[3]) {
  throw new Error("usage: task-visual-palette.mjs check|apply EXTRACTED_ASAR_ROOT [--config TOOLKIT_CONFIG]");
}

const assets = path.join(root, "webview/assets");
const appInitial = uniqueFile(/^app-initial-.*\.js$/);
const appPrimary = uniqueFile(/^app-primary-.*\.js$/);
const localPage = uniqueFile(
  /^local-conversation-page-.*\.js$/,
  source => source.includes("relative h-full min-h-0")
);
const delegation = uniqueFile(/^(?:subagent-activity-chip-group|conversation-blocks)-.*\.js$/);
const observerGateHelper = String.raw`const MTKpaletteSurfaceSelector="[data-app-action-sidebar-thread-row],[data-mtk-palette-room-host],[data-mtk-palette-source-id]";function MTKpaletteMutationRelevant(e){for(let t of e){if(t.type==="attributes")return!0;for(let e of[...t.addedNodes,...t.removedNodes])if((e.nodeType===1||e.nodeType===11)&&(e.nodeType===1&&e.matches(MTKpaletteSurfaceSelector)||e.querySelector?.(MTKpaletteSurfaceSelector)))return!0}return!1}`;
const universalSelectionOutlineCss = "[data-app-action-sidebar-thread-row][data-app-action-sidebar-thread-selected=true],[data-app-action-sidebar-thread-row][data-app-action-sidebar-thread-active=true]{box-shadow:inset 0 0 0 1px var(--color-token-text-tertiary)!important}";
const previousThemeDerive = 'function MTKderive(e,t,n){let r=n?1:.72,i=n?"#101114":"#FAFAFA",a=n?"#282A30":"#E7E9ED",o=n?"#14161A":"#ECEEF1",s=n?"#F2F3F5":"#18191C"';
const currentThemeDerive = 'function MTKderive(e,t,n){let r=n?1:.56,i=n?"#101114":"#FCFCFD",a=n?"#282A30":"#F4F5F7",o=n?"#14161A":"#F7F8FA",s=n?"#F2F3F5":"#17191C"';
const readableLabelHelper = 'function MTKreadableLabel(e,t,n){let r=n?"#FFFFFF":"#111318";for(let i=0;i<=20;i++){let a=MTKmix(e,r,i/20);if(MTKcontrast(a,t)>=4.5)return a}return r}';
const neutralLabelExpression = "label:MTKcontrast(m,l)>=4.5?m:s";
const readableLabelExpression = "label:MTKreadableLabel(e,l,n)";
const canonicalArchiveClassifier = 'function MTKsidebarArchiveTaskId(e){if(typeof e!=="string")return null;let t=e.startsWith("local:")?e.slice(6):e;return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(t)?t:null}function MTKsidebarArchiveProtected(e,t=MTKsidebarPalette){let n=MTKsidebarArchiveTaskId(e);return n!==null&&t!=null&&t.rules.some(e=>e.protectSidebarArchive&&e.taskId===n)}const MTKsidebarArchiveListeners=new Set;let MTKsidebarArchiveEpoch=0;function MTKsidebarArchiveSubscribe(e){return MTKsidebarArchiveListeners.add(e),()=>MTKsidebarArchiveListeners.delete(e)}function MTKsidebarArchiveSnapshot(){return MTKsidebarArchiveEpoch}function MTKsidebarArchiveNotify(){MTKsidebarArchiveEpoch++;for(let e of MTKsidebarArchiveListeners)e()}globalThis.__MTKsidebarArchiveProtected=MTKsidebarArchiveProtected;globalThis.__MTKsidebarArchiveSubscribe=MTKsidebarArchiveSubscribe;globalThis.__MTKsidebarArchiveSnapshot=MTKsidebarArchiveSnapshot;';

let state = inspectState();
if (command === "apply" && state === "needs-apply") {
  const attributionSource = fs.readFileSync(delegation, "utf8");
  if (!attributionSource.includes("function MTKsender(") || !attributionSource.includes("messageBubbleStyle:MTKdelegatedBubbleStyle")) {
    throw new Error("Palette apply requires the cross-task attribution mitigation first");
  }
  patchAppInitial(appInitial, configuredWorkspaceRoot(false));
  patchBottomFade(appInitial, appPrimary);
  patchSidebarArchiveAffordances(appInitial, appPrimary);
  patchLocalPage(localPage);
  patchDelegation(delegation);
  for (const file of [appInitial, appPrimary, localPage, delegation]) {
    moduleSyntaxCheck(file);
  }
  state = inspectState();
  if (state !== "applied") throw new Error("palette transform did not verify");
}

process.stdout.write(`${JSON.stringify({
  state,
  targets: [appInitial, appPrimary, localPage, delegation].map(file => path.relative(root, file))
}, null, 2)}\n`);

function moduleSyntaxCheck(file) {
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

function inspectState() {
  const appSource = fs.readFileSync(appInitial, "utf8");
  const appPrimarySource = fs.readFileSync(appPrimary, "utf8");
  const localSource = fs.readFileSync(localPage, "utf8");
  const delegationSource = fs.readFileSync(delegation, "utf8");
  for (const rejected of ["function MTKRoomSurface(", "MTKpaletteVisual=", "box-shadow:inset 1px 0 0", "[data-mtk-palette-mark=true]{background-color"]) {
    if (appSource.includes(rejected) || localSource.includes(rejected) || delegationSource.includes(rejected)) {
      throw new Error(`Unrecognized palette patch: rejected prototype marker ${rejected}`);
    }
  }
  if (appSource.includes("JSON.parse(k9e(e))") && appSource.includes("function k9e(e){j9e=e}")) {
    throw new Error("Unrecognized palette patch: captured minified decoder binding is present");
  }
  const rosterConsumer = appSource.includes("const MTKpaletteRosterConsumer=1");
  const loaderApplied = rosterConsumer
    ? appSource.includes("globalThis.__MTK_AGENT_ROSTER__") &&
      appSource.includes(".current?.()") &&
      appSource.includes(".readAsset(") &&
      !appSource.includes("MTKloadPaletteWhenReady")
    : appSource.includes("function MTKloadPaletteWhenReady(") &&
      appSource.includes('__MTK_RUNTIME_JSON_RELOAD__?.register("task-visual-palette.json"') &&
      appSource.includes("JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(e),e=>e.charCodeAt(0))))") &&
      !appSource.includes("JSON.parse(k9e(e))") && appSource.includes(".when(({get:");
  const applied = [
    appSource.includes("function MTKusePaletteBootstrap(") && appSource.includes("function MTKacceptPaletteReload(") &&
      (rosterConsumer ? appSource.includes('__MTK_AGENT_ROSTER__?.subscribe(') : true) && loaderApplied &&
      appSource.includes("function MTKapplyPaletteSurfaces(") && appSource.includes("position:absolute;z-index:-1") &&
      appSource.includes("opacity:var(--mtk-watermark-dark-opacity)") && appSource.includes("opacity:var(--mtk-watermark-light-opacity)") &&
      appSource.includes("--mtk-user-bubble-strength") && appSource.includes("--mtk-generic-bubble-strength") &&
      appSource.includes("selection:n?MTKmix") && appSource.includes("[data-user-message-bubble] *::selection") &&
      appSource.includes("box-shadow:inset 0 0 0 1px var(--mtk-accent-dark)") &&
      (appSource.includes('"data-mtk-palette-bottom-fade":!0') || appPrimarySource.includes('"data-mtk-palette-bottom-fade":!0')),
    localSource.includes('"data-mtk-palette-room-host":!0') && localSource.includes('"data-mtk-palette-thread-id"'),
    delegationSource.includes('"data-mtk-palette-source-title"') && delegationSource.includes('"data-mtk-palette-source-id"') && delegationSource.includes("messageBubbleStyle:MTKdelegatedBubbleStyle")
  ];
  if (applied.every(Boolean)) {
    if (!appSource.includes(currentThemeDerive)) {
      throw new Error("Unrecognized palette patch: light-theme derivation is missing or changed");
    }
    if (!appSource.includes(readableLabelHelper) || !appSource.includes(readableLabelExpression)) {
      throw new Error("Unrecognized palette patch: attribution label derivation is partial or changed");
    }
    const archiveProtection = inspectSidebarArchiveProtection(appSource, appPrimarySource);
    if (
      appSource.includes("function MTKqueueSidebar(e){if(!MTKpaletteMutationRelevant(e))return;") &&
      appSource.includes("const MTKpaletteSurfaceSelector=")
    ) {
      if (archiveProtection !== "applied") {
        throw new Error("Unrecognized palette patch: archive protection is missing or changed");
      }
      if (!appSource.includes("const MTKpaletteRosterConsumer=1") &&
          (!appSource.includes("function MTKreasoningShouldStayOpen(") ||
          !appSource.includes("globalThis.__MTKreasoningShouldStayOpen=MTKreasoningShouldStayOpen") ||
          !appSource.includes("globalThis.__MTKreasoningSubscribe=MTKreasoningSubscribe"))) {
        throw new Error("Unrecognized palette patch: reasoning policy bridge is missing");
      }
      if (!appSource.includes("const MTKpaletteRosterConsumer=1") &&
          (!appSource.includes("function MTKmodelPinForTask(") ||
          !appSource.includes("globalThis.__MTKmodelPinForTask=MTKmodelPinForTask") ||
          !appSource.includes("globalThis.__MTKmodelPinSubscribe=MTKmodelPinSubscribe"))) {
        throw new Error("Unrecognized palette patch: model-pin bridge is missing");
      }
      inspectArchiveIdentity(appSource);
      if (!appSource.includes("function MTKinstallSidebar(e){MTKsidebarPalette=e;MTKsidebarArchiveNotify();")) {
        throw new Error("Unrecognized palette patch: archive reload notification is missing");
      }
      if (!appSource.includes(universalSelectionOutlineCss)) {
        throw new Error("Unrecognized palette patch: universal selection outline is missing");
      }
      return "applied";
    }
    throw new Error("Unrecognized palette patch: observer gate is partial or changed");
  }
  const pristine = [
    (appProfile(appSource) != null || appSource.includes("function Jcs(){let e=(0,Zcs.c)(12),")) &&
      bottomFadeProfile(appSource, appPrimarySource) != null &&
      !appSource.includes('"data-mtk-palette-bottom-fade":!0') &&
      !appPrimarySource.includes('"data-mtk-palette-bottom-fade":!0'),
    localProfile(localSource) != null,
    !delegationSource.includes('"data-mtk-palette-source-id"') && delegationSource.includes("localConversation.codexDelegationUserMessage.app") && delegationSource.includes("sourceThreadId")
  ];
  if (pristine.every(Boolean) && inspectSidebarArchiveProtection(appSource, appPrimarySource) === "needs-apply") {
    return "needs-apply";
  }
  throw new Error(`Unrecognized palette patch state: applied=${applied.join(",")} pristine=${pristine.join(",")}`);
}

function uniqueFile(pattern, owns = () => true) {
  const found = fs.readdirSync(assets).filter(name => {
    if (!pattern.test(name)) return false;
    return owns(fs.readFileSync(path.join(assets, name), "utf8"));
  });
  if (found.length !== 1) throw new Error(`expected one ${pattern}, found ${found.length}`);
  return path.join(assets, found[0]);
}

function inspectArchiveIdentity(source) {
  const canonical = source.split(canonicalArchiveClassifier).length - 1;
  if (canonical === 1) return;
  throw new Error(`Unrecognized palette archive identity: canonical=${canonical}`);
}

function inspectSidebarArchiveProtection(source, primarySource) {
  if (primarySource == null) throw new Error("sidebar archive owner is missing");

  if (build9922.archive.applied.every(contract => source.includes(contract))) {
    if (inspectBuild9922ArchiveRuntime(source) !== "applied") {
      throw new Error("Unrecognized build-9922 archive runtime reload");
    }
    return "applied";
  }
  if (build9922.archive.pristine.every(contract => source.includes(contract))) return "needs-apply";

  if (linuxBuild9647.archive.applied.every(contract => source.includes(contract) || primarySource.includes(contract))) {
    if (inspectBuild9647ArchiveRuntime(primarySource, linuxBuild9647.archive.runtime) !== "applied") {
      throw new Error("Unrecognized Linux build-9647 archive runtime reload");
    }
    return "applied";
  }
  if (linuxBuild9647.archive.pristine.every(contract => primarySource.includes(contract))) return "needs-apply";

  const applied = [
    "globalThis.__MTKsidebarArchiveProtected=MTKsidebarArchiveProtected",
    "archive:D||MTKsidebarArchiveProtected(_)?void 0:{id:`archive-thread`,message:void 0,onSelect:()=>{i()}}",
    "function Akn({items:e,onArchive:t,onSelect:n,selectedThreadKeys:r,threadKey:i,archiveProtected:a}){return a&&(e=e.filter(e=>e.id!==`archive-thread`&&e.id!==`archive-task`)),r.length<2?e:",
    "archiveProtected:fwn(T,r).some(e=>{let t=T.get(iS,e),n=t?.kind===`local`?t.conversationId:t?.kind===`remote`?t.task.id:null;return MTKsidebarArchiveProtected(n)})",
    "archiveProtected:fwn(K,e).some(e=>{let t=K.get(iS,e),n=t?.kind===`local`?t.conversationId:t?.kind===`remote`?t.task.id:null;return MTKsidebarArchiveProtected(n)})",
    "archive:MTKsidebarArchiveProtected(n)?null:t!=null&&(Oe||V)?Pe:t",
    "Be=xe&&!MTKsidebarArchiveProtected(ae)?Ae:null",
    "if(xe&&!MTKsidebarArchiveProtected(ae)&&e.push({id:`archive-task`",
    "archive:MTKsidebarArchiveProtected(e.task.id)?null:n,getMenuItems:q&&!MTKsidebarArchiveProtected(e.task.id)?e=>d(["
  ];
  if (applied.every(contract => source.includes(contract) || primarySource.includes(contract))) {
    if (inspectBuild9647ArchiveRuntime(primarySource) !== "applied") {
      throw new Error("Unrecognized build-9647 archive runtime reload");
    }
    return "applied";
  }

  const pristine = [
    "archive:D?void 0:{id:`archive-thread`,message:void 0,onSelect:()=>{i()}}",
    "function Akn({items:e,onArchive:t,onSelect:n,selectedThreadKeys:r,threadKey:i}){return r.length<2?e:",
    "selectedThreadKeys:fwn(T,r),threadKey:r})",
    "selectedThreadKeys:fwn(K,e),threadKey:e})",
    "archive:t!=null&&(Oe||V)?Pe:t",
    "Be=xe?Ae:null",
    "if(xe&&e.push({id:`archive-task`",
    "archive:n,getMenuItems:q?e=>d(["
  ];
  if (pristine.every(contract => primarySource.includes(contract))) return "needs-apply";

  throw new Error("Unrecognized build-9647 sidebar archive-protection state");
}
function appProfile(source) {
  const profiles = [
    build9922.app,
    linuxBuild9647.app,
    {
      name: "26.911.61220-9647",
      pristineSeam: "function PYs(){let e=(0,LYs.c)(12),t=nm(Q),",
      seam: "function PYs(){MTKuseAgentRoster();let e=(0,LYs.c)(12),t=nm(Q),",
      patchedSeam: "function PYs(){MTKuseAgentRoster();MTKusePaletteBootstrap();let e=(0,LYs.c)(12),t=nm(Q),",
      agentRoster: true,
      helperReplacements: [["QSl.useEffect", "RYs.useEffect"]],
      bottomFadeBefore: null,
      bottomFadeAfter: null
    }
  ];
  const matches = profiles.filter(profile =>
    source.includes(profile.pristineSeam ?? profile.seam) ||
    source.includes(profile.seam) ||
    source.includes(profile.patchedSeam)
  );
  return matches.length === 1 ? matches[0] : null;
}
function bottomFadeProfile(_appSource, primarySource) {
  const profiles = [
    build9922.bottomFade,
    ...["h3", "g9"].map(jsx => ({
    file: "app-primary",
    before: `(0,${jsx}.jsx)(\`div\`,{"aria-hidden":!0,className:\`pointer-events-none absolute inset-x-0 bottom-0 z-0 h-full bg-gradient-to-t from-surface via-surface extension:from-surface-secondary extension:via-surface-secondary\`})`,
    after: `(0,${jsx}.jsx)(\`div\`,{"aria-hidden":!0,"data-mtk-palette-bottom-fade":!0,className:\`pointer-events-none absolute inset-x-0 bottom-0 z-0 h-full bg-gradient-to-t from-surface via-surface extension:from-surface-secondary extension:via-surface-secondary\`})`
    }))
  ];
  const matches = profiles.filter(profile => primarySource.includes(profile.before));
  return matches.length === 1 ? matches[0] : null;
}
function localProfile(source) {
  const profiles = [
    build9922.local,
    linuxBuild9647.local,
    {
      name: "26.911.61220-9647",
      cacheBefore: "function hu(e){let t=(0,Su.c)(91),",
      cacheAfter: "function hu(e){let t=(0,Su.c)(92),",
      rootBefore: 't[75]!==te||t[76]!==q||t[77]!==ne||t[78]!==re||t[79]!==oe||t[80]!==se||t[81]!==ce||t[82]!==le||t[83]!==ue||t[84]!==de||t[85]!==pe||t[86]!==me?(he=(0,Q.jsxs)(`div`,{ref:j,className:`relative h-full min-h-0`,children:[te,q,ne,re,ae,oe,se,ce,le,ue,de,pe,me]}),t[75]=te,t[76]=q,t[77]=ne,t[78]=re,t[79]=oe,t[80]=se,t[81]=ce,t[82]=le,t[83]=ue,t[84]=de,t[85]=pe,t[86]=me,t[87]=he):he=t[87];',
      rootAfter: 't[75]!==te||t[76]!==q||t[77]!==ne||t[78]!==re||t[79]!==oe||t[80]!==se||t[81]!==ce||t[82]!==le||t[83]!==ue||t[84]!==de||t[85]!==pe||t[86]!==me||t[91]!==r?(he=(0,Q.jsxs)(`div`,{ref:j,"data-mtk-palette-room-host":!0,"data-mtk-palette-thread-id":r,className:`relative h-full min-h-0`,children:[te,q,ne,re,ae,oe,se,ce,le,ue,de,pe,me]}),t[75]=te,t[76]=q,t[77]=ne,t[78]=re,t[79]=oe,t[80]=se,t[81]=ce,t[82]=le,t[83]=ue,t[84]=de,t[85]=pe,t[86]=me,t[91]=r,t[87]=he):he=t[87];'
    }
  ];
  const matches = profiles.filter(profile => source.includes(profile.cacheBefore) && source.includes(profile.rootBefore));
  return matches.length === 1 ? matches[0] : null;
}
function replaceOnce(source, before, after, label) {
  const first = source.indexOf(before);
  if (first < 0) throw new Error(`missing ${label}`);
  if (source.indexOf(before, first + before.length) >= 0) throw new Error(`ambiguous ${label}`);
  return source.slice(0, first) + after + source.slice(first + before.length);
}

function patchAppInitial(file, workspaceRoot) {
  let source = fs.readFileSync(file, "utf8");
  if (source.includes("function MTKuseTaskVisual(")) throw new Error("palette prototype already applied");
  const profile = appProfile(source);
  if (profile == null) throw new Error("unrecognized sidebar/bottom-fade ownership profile");

  let helper = String.raw`
const MTKpaletteRelativePath=".codex/task-visual-palette.json",MTKpaletteDefaults={canvas:11,userBubble:8,mappedBubble:40,genericBubble:16,sidebar:15,watermarkDark:9,watermarkLight:6},MTKpaletteRanges={canvas:[0,30],userBubble:[0,20],mappedBubble:[0,60],genericBubble:[0,30],sidebar:[0,35],watermarkDark:[0,20],watermarkLight:[0,20]};let MTKpalettePromiseKey=null,MTKpalettePromise=null,MTKsidebarObserver=null,MTKsidebarPalette=null,MTKsidebarQueued=!1;function MTKplainObject(e){return e!=null&&typeof e==="object"&&!Array.isArray(e)&&Object.getPrototypeOf(e)===Object.prototype}function MTKjoinPath(e,t){return e.replace(/[\\/]+$/,"")+"/"+t}function MTKmissingFile(e){return e instanceof Error&&("code"in e&&e.code==="ENOENT"||e.message.includes("No such file or directory")||e.message.includes("(os error 2)"))}function MTKbase64Size(e){return Math.floor(e.length*3/4)-(e.endsWith("==")?2:+e.endsWith("="))}function MTKparseHex(e){return{r:parseInt(e.slice(1,3),16),g:parseInt(e.slice(3,5),16),b:parseInt(e.slice(5,7),16)}}function MTKhex(e){let t=n=>Math.round(Math.max(0,Math.min(255,n))).toString(16).padStart(2,"0");return("#"+t(e.r)+t(e.g)+t(e.b)).toUpperCase()}function MTKmix(e,t,n){let r=MTKparseHex(e),i=MTKparseHex(t);return MTKhex({r:r.r+(i.r-r.r)*n,g:r.g+(i.g-r.g)*n,b:r.b+(i.b-r.b)*n})}function MTKlum(e){let t=Object.values(MTKparseHex(e)).map(e=>{let t=e/255;return t<=.04045?t/12.92:((t+.055)/1.055)**2.4});return.2126*t[0]+.7152*t[1]+.0722*t[2]}function MTKcontrast(e,t){let n=MTKlum(e),r=MTKlum(t);return(Math.max(n,r)+.05)/(Math.min(n,r)+.05)}function MTKderive(e,t,n){let r=n?1:.72,i=n?"#101114":"#FAFAFA",a=n?"#282A30":"#E7E9ED",o=n?"#14161A":"#ECEEF1",s=n?"#F2F3F5":"#18191C",c=MTKmix(i,e,t.canvas/100*r),l=MTKmix(a,e,t.mappedBubble/100*r),u=MTKmix(o,e,t.sidebar/100*r),d=MTKmix(o,e,(t.sidebar+5)/100*r),f=MTKmix(o,e,(t.sidebar+10)/100*r),p=n?MTKmix(e,"#FFFFFF",.19):MTKmix(e,"#111318",.18),m=n?MTKmix(e,"#FFFFFF",.38):MTKmix(e,"#111318",.34);return{canvas:c,bubble:l,row:u,hover:d,selected:f,accent:p,label:MTKcontrast(m,l)>=4.5?m:s,text:s}}function MTKvisualRule(e,t,n){let r=MTKderive(t.color,e,!0),i=MTKderive(t.color,e,!1);return{pattern:n,color:t.color,markDataUrl:t.markDataUrl??null,taskId:t.taskId??null,protectSidebarArchive:t.protectSidebarArchive===!0,dark:r,light:i,bubbleStyle:{backgroundColor:r.bubble,background:"light-dark("+i.bubble+","+r.bubble+")",boxShadow:"0 1px 8px color-mix(in srgb, "+r.accent+" 12%, transparent)"},attributionStyle:{color:"color-mix(in srgb, "+t.color+" 62%, var(--color-text) 38%)"}}}function MTKcalibration(e){if(e===void 0)return{...MTKpaletteDefaults};if(!MTKplainObject(e)||Object.keys(e).some(e=>!(e in MTKpaletteDefaults)))return null;let t={...MTKpaletteDefaults};for(let n of Object.keys(MTKpaletteDefaults)){if(e[n]===void 0)continue;let r=e[n],i=MTKpaletteRanges[n];if(typeof r!=="number"||!Number.isFinite(r)||r<i[0]||r>i[1])return null;t[n]=r}return t}async function MTKreadSafeFile(e,t,n,r){if(typeof n!=="string"||n.length===0||n.length>512||n.startsWith("/")||n.startsWith("\\")||/^[A-Za-z]:/.test(n)||n.includes("://")||n.includes("\\"))return null;let i=n.split("/");if(i.some(e=>e===""||e==="."||e===".."))return null;let a=t;try{for(let t=0;t<i.length;t++){a=MTKjoinPath(a,i[t]);let n=await e.sendRequest("fs/getMetadata",{path:a}),r=t===i.length-1;if(n.isSymlink||(r?!n.isFile:!n.isDirectory))return null}let{dataBase64:t}=await e.sendRequest("fs/readFile",{path:a});return MTKbase64Size(t)>r?null:t}catch{return null}}async function MTKfindPaletteFile(e,t){let n=MTKjoinPath(t,".codex"),r=MTKjoinPath(t,MTKpaletteRelativePath);try{let i=await e.sendRequest("fs/getMetadata",{path:n});if(!i.isDirectory||i.isSymlink)throw Error("unsafe palette directory");let a=await e.sendRequest("fs/getMetadata",{path:r});if(!a.isFile||a.isSymlink)throw Error("unsafe palette file");let{dataBase64:o}=await e.sendRequest("fs/readFile",{path:r});if(MTKbase64Size(o)>65536)throw Error("palette too large");return{ownerRoot:t,path:r,dataBase64:o}}catch(e){if(MTKmissingFile(e))return null;throw e}}async function MTKparsePalette(e,t,n){let r;try{r=JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(e),e=>e.charCodeAt(0))))}catch{return null}if(!MTKplainObject(r)||Object.keys(r).some(e=>e!=="calibration"&&e!=="rules"))return null;let i=MTKcalibration(r.calibration);if(i==null||!MTKplainObject(r.rules))return null;let a=Object.entries(r.rules);if(a.length===0||a.length>64)return null;let o=[],s=new Set;for(let[e,r]of a){if(typeof e!=="string"||e.length===0||e.length>512||!MTKplainObject(r)||Object.keys(r).some(e=>e!=="color"&&e!=="mark"&&e!=="taskId"&&e!=="protectSidebarArchive")||typeof r.color!=="string"||!/^#[0-9A-Fa-f]{6}$/.test(r.color)||r.mark!==void 0&&typeof r.mark!=="string"||r.taskId!==void 0&&(typeof r.taskId!=="string"||!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(r.taskId))||r.protectSidebarArchive!==void 0&&typeof r.protectSidebarArchive!=="boolean"||r.protectSidebarArchive===!0&&r.taskId===void 0)return null;let a;try{a=new RegExp(e)}catch{return null}if(r.taskId!==void 0&&(!a.test(r.taskId)||s.has(r.taskId)))return null;r.taskId!==void 0&&s.add(r.taskId);let c=null;if(r.mark!==void 0){if(!/\.svg$/i.test(r.mark))return null;let e=await MTKreadSafeFile(t,n,r.mark,65536);e!=null&&(c="data:image/svg+xml;base64,"+e)}o.push(MTKvisualRule(i,{color:r.color.toUpperCase(),markDataUrl:c,taskId:r.taskId,protectSidebarArchive:r.protectSidebarArchive},a))}return{calibration:i,rules:o,ownerRoot:n}}async function MTKloadPalette(e,t){try{let n=[...new Set(t.filter(e=>typeof e==="string"&&e.length>0))],r=[];for(let t of n){let n=await MTKfindPaletteFile(e,t);n!=null&&r.push(n)}if(r.length!==1)return null;let i=r[0];return await MTKparsePalette(i.dataBase64,e,i.ownerRoot)}catch{return null}}function MTKpaletteKey(e){return e.filter(e=>e.projectKind==="local").flatMap(e=>e.rootPaths??[]).filter(e=>typeof e==="string").sort().join("\0")}function MTKmatchPalette(e,t,n){if(e==null)return null;let r=typeof t==="string"?t:"",i=typeof n==="string"?n:"";for(let t of e.rules)if(t.pattern.test(r)||t.pattern.test(i))return t;return null}function MTKsidebarArchiveProtected(e,t=MTKsidebarPalette){return typeof e==="string"&&t!=null&&t.rules.some(t=>t.protectSidebarArchive&&t.taskId===e)}function MTKensurePaletteStyle(){if(document.getElementById("mtk-task-visual-palette-style"))return;let e=document.createElement("style");e.id="mtk-task-visual-palette-style",e.textContent="[data-mtk-palette-room=true]{background-color:var(--mtk-room-dark)!important;isolation:isolate}[data-mtk-palette-mark=true]{background-color:var(--mtk-mark-dark);opacity:.075;filter:drop-shadow(0 1px 1px rgba(0,0,0,.35))}[data-mtk-palette-row=true]{background-color:var(--mtk-row-dark)!important;box-shadow:inset 1px 0 0 var(--mtk-accent-dark)}[data-mtk-palette-row=true]:hover{background-color:var(--mtk-row-hover-dark)!important}[data-mtk-palette-row=true][data-app-action-sidebar-thread-selected=true],[data-mtk-palette-row=true][data-app-action-sidebar-thread-active=true]{background-color:var(--mtk-row-selected-dark)!important}html.electron-light [data-mtk-palette-room=true]{background-color:var(--mtk-room-light)!important}html.electron-light [data-mtk-palette-mark=true]{background-color:var(--mtk-mark-light);opacity:.05;filter:drop-shadow(0 1px 1px rgba(255,255,255,.5))}html.electron-light [data-mtk-palette-row=true]{background-color:var(--mtk-row-light)!important;box-shadow:inset 1px 0 0 var(--mtk-accent-light)}html.electron-light [data-mtk-palette-row=true]:hover{background-color:var(--mtk-row-hover-light)!important}html.electron-light [data-mtk-palette-row=true][data-app-action-sidebar-thread-selected=true],html.electron-light [data-mtk-palette-row=true][data-app-action-sidebar-thread-active=true]{background-color:var(--mtk-row-selected-light)!important}",document.head.appendChild(e)}function MTKclearSidebarRow(e){e.removeAttribute("data-mtk-palette-row");for(let t of["--mtk-row-dark","--mtk-row-light","--mtk-row-hover-dark","--mtk-row-hover-light","--mtk-row-selected-dark","--mtk-row-selected-light","--mtk-accent-dark","--mtk-accent-light"])e.style.removeProperty(t)}function MTKapplySidebar(e){for(let t of document.querySelectorAll("[data-app-action-sidebar-thread-row]")){let n=MTKmatchPalette(e,t.getAttribute("data-app-action-sidebar-thread-title"),t.getAttribute("data-app-action-sidebar-thread-id"));if(n==null){MTKclearSidebarRow(t);continue}t.setAttribute("data-mtk-palette-row","true"),t.style.setProperty("--mtk-row-dark",n.dark.row),t.style.setProperty("--mtk-row-light",n.light.row),t.style.setProperty("--mtk-row-hover-dark",n.dark.hover),t.style.setProperty("--mtk-row-hover-light",n.light.hover),t.style.setProperty("--mtk-row-selected-dark",n.dark.selected),t.style.setProperty("--mtk-row-selected-light",n.light.selected),t.style.setProperty("--mtk-accent-dark",n.dark.accent),t.style.setProperty("--mtk-accent-light",n.light.accent)}}function MTKqueueSidebar(){MTKsidebarQueued||(MTKsidebarQueued=!0,queueMicrotask(()=>{MTKsidebarQueued=!1,MTKsidebarPalette!=null&&MTKapplySidebar(MTKsidebarPalette)}))}function MTKinstallSidebar(e){if(e==null)return;MTKensurePaletteStyle(),MTKsidebarPalette=e,MTKapplySidebar(e),MTKsidebarObserver==null&&(MTKsidebarObserver=new MutationObserver(MTKqueueSidebar),MTKsidebarObserver.observe(document.body,{subtree:!0,childList:!0,attributes:!0,attributeFilter:["data-app-action-sidebar-thread-title","data-app-action-sidebar-thread-id","data-app-action-sidebar-thread-active","data-app-action-sidebar-thread-selected"]}))}function MTKuseTaskVisual(e,t){let n=Ss(Q),r=Y(Can),i=MTKpaletteKey(r),[a,o]=QSl.useState(null);return QSl.useEffect(()=>{let e=!1;if(i.length===0)return o(null),()=>{e=!0};let t=r.filter(e=>e.projectKind==="local").flatMap(e=>e.rootPaths??[]);return MTKpalettePromiseKey!==i&&(MTKpalettePromiseKey=i,MTKpalettePromise=MTKloadPalette(Qg(n,"local"),t)),MTKpalettePromise.then(t=>{e||(o(t),MTKinstallSidebar(t))}),()=>{e=!0}},[n,i]),MTKmatchPalette(a,e,t)}function MTKuseThreadVisual(e){let t=typeof e==="string"?Iy(e):null,n=bs(Zx,t),r=n?.kind==="local"?n.conversation?.title:n?.kind==="remote"?n.task?.title:null;return MTKuseTaskVisual(r,e)}
`;
  helper = helper.replace(previousThemeDerive, currentThemeDerive);
  if (!helper.includes(currentThemeDerive) || helper.includes(previousThemeDerive)) {
    throw new Error("unrecognized palette theme derivation");
  }
  let sidebarNullSafeHelper = helper
    .replace(
      'attributionStyle:{color:"color-mix(in srgb, "+t.color+" 62%, var(--color-text) 38%)"}',
      'attributionStyle:{color:"light-dark("+i.label+","+r.label+")"}'
    )
    .replace(
      'function MTKinstallSidebar(e){if(e==null)return;MTKensurePaletteStyle(),MTKsidebarPalette=e,MTKapplySidebar(e),',
      'function MTKinstallSidebar(e){if(MTKsidebarPalette=e,e==null){for(let e of document.querySelectorAll("[data-mtk-palette-row=true]"))MTKclearSidebarRow(e);return}MTKensurePaletteStyle(),MTKapplySidebar(e),'
    )
    .replace(
      'if(i.length===0)return o(null),()=>{e=!0};',
      'if(i.length===0)return o(null),MTKinstallSidebar(null),()=>{e=!0};'
    );
  if (
    sidebarNullSafeHelper === helper ||
    sidebarNullSafeHelper.includes("62%, var(--color-text)") ||
    sidebarNullSafeHelper.includes("function MTKinstallSidebar(e){if(e==null)return") ||
    !sidebarNullSafeHelper.includes("MTKinstallSidebar(null)")
  ) {
    throw new Error("unrecognized sidebar null-state helper");
  }
  if (profile.agentRoster === true) sidebarNullSafeHelper = agentRosterConsumer(sidebarNullSafeHelper);

  const surfaceCss =
    '[data-user-message-bubble]{background-color:color-mix(in oklab,var(--color-text) var(--mtk-user-bubble-strength),transparent)!important}' +
    '[data-mtk-palette-source-id]:not([data-mtk-palette-delegation=true]) [data-user-message-bubble]{background-color:color-mix(in srgb,var(--color-token-interactive-label-accent-default,var(--color-token-text-link-foreground,#339cff)) var(--mtk-generic-bubble-strength),transparent)!important}' +
    universalSelectionOutlineCss +
    '[data-mtk-palette-row=true][data-app-action-sidebar-thread-selected=true],[data-mtk-palette-row=true][data-app-action-sidebar-thread-active=true]{box-shadow:inset 0 0 0 1px var(--mtk-accent-dark)!important}' +
    '[data-mtk-palette-room=true] ::selection{background-color:var(--mtk-selection-dark)}' +
    '[data-mtk-palette-room=true] [data-mtk-palette-bottom-fade]{--tw-gradient-from:var(--mtk-room-dark)!important;--tw-gradient-via:var(--mtk-room-dark)!important}' +
    '[data-mtk-palette-room=true][data-mtk-palette-mark=true]::before{content:"";position:absolute;z-index:-1;left:50%;top:48%;width:min(62vw,760px);height:min(62vw,760px);transform:translate(-50%,-50%);pointer-events:none;background-color:var(--mtk-mark-dark);opacity:var(--mtk-watermark-dark-opacity);-webkit-mask-image:var(--mtk-mark-image);mask-image:var(--mtk-mark-image);-webkit-mask-position:center;mask-position:center;-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;-webkit-mask-size:contain;mask-size:contain;filter:drop-shadow(0 1px 1px rgba(0,0,0,.35))}' +
    '[data-mtk-palette-delegation=true] [data-mtk-palette-attribution-name]{color:var(--mtk-label-dark)!important}' +
    '[data-mtk-palette-delegation=true] [data-user-message-bubble]{background:var(--mtk-bubble-dark)!important;box-shadow:0 1px 8px color-mix(in srgb,var(--mtk-delegated-accent-dark) 12%,transparent)}' +
    '[data-mtk-palette-delegation=true] [data-user-message-bubble]::selection,[data-mtk-palette-delegation=true] [data-user-message-bubble] *::selection{background-color:var(--mtk-selection-dark)}' +
    'html.electron-light [data-mtk-palette-row=true][data-app-action-sidebar-thread-selected=true],html.electron-light [data-mtk-palette-row=true][data-app-action-sidebar-thread-active=true]{box-shadow:inset 0 0 0 1px var(--mtk-accent-light)!important}' +
    'html.electron-light [data-mtk-palette-room=true] ::selection{background-color:var(--mtk-selection-light)}' +
    'html.electron-light [data-mtk-palette-room=true] [data-mtk-palette-bottom-fade]{--tw-gradient-from:var(--mtk-room-light)!important;--tw-gradient-via:var(--mtk-room-light)!important}' +
    'html.electron-light [data-mtk-palette-room=true][data-mtk-palette-mark=true]::before{background-color:var(--mtk-mark-light);opacity:var(--mtk-watermark-light-opacity);filter:drop-shadow(0 1px 1px rgba(255,255,255,.5))}' +
    'html.electron-light [data-mtk-palette-delegation=true] [data-mtk-palette-attribution-name]{color:var(--mtk-label-light)!important}' +
    'html.electron-light [data-mtk-palette-delegation=true] [data-user-message-bubble]{background:var(--mtk-bubble-light)!important;box-shadow:0 1px 8px color-mix(in srgb,var(--mtk-delegated-accent-light) 12%,transparent)}' +
    'html.electron-light [data-mtk-palette-delegation=true] [data-user-message-bubble]::selection,html.electron-light [data-mtk-palette-delegation=true] [data-user-message-bubble] *::selection{background-color:var(--mtk-selection-light)}';
  const surfaceObserver = observerGateHelper + String.raw`function MTKremoveProperties(e,t){for(let n of t)e.style.removeProperty(n)}function MTKapplyCalibration(e){let t=document.documentElement;t.style.setProperty("--mtk-user-bubble-strength",e.calibration.userBubble+"%"),t.style.setProperty("--mtk-generic-bubble-strength",e.calibration.genericBubble+"%"),t.style.setProperty("--mtk-watermark-dark-opacity",e.calibration.watermarkDark/100),t.style.setProperty("--mtk-watermark-light-opacity",e.calibration.watermarkLight/100)}function MTKclearCalibration(){MTKremoveProperties(document.documentElement,["--mtk-user-bubble-strength","--mtk-generic-bubble-strength","--mtk-watermark-dark-opacity","--mtk-watermark-light-opacity"])}function MTKclearRoom(e){e.removeAttribute("data-mtk-palette-room"),e.removeAttribute("data-mtk-palette-mark"),MTKremoveProperties(e,["--mtk-room-dark","--mtk-room-light","--mtk-mark-dark","--mtk-mark-light","--mtk-mark-image"])}function MTKclearDelegation(e){e.removeAttribute("data-mtk-palette-delegation"),MTKremoveProperties(e,["--mtk-bubble-dark","--mtk-bubble-light","--mtk-label-dark","--mtk-label-light","--mtk-delegated-accent-dark","--mtk-delegated-accent-light"])}function MTKsidebarMetadata(e){for(let t of document.querySelectorAll("[data-app-action-sidebar-thread-row]"))if(t.getAttribute("data-app-action-sidebar-thread-id")===e)return{title:t.getAttribute("data-app-action-sidebar-thread-title"),id:e};return{title:null,id:e}}function MTKapplyPaletteSurfaces(e){MTKapplyCalibration(e),MTKapplySidebar(e);for(let t of document.querySelectorAll("[data-mtk-palette-room-host]")){let n=t.getAttribute("data-mtk-palette-thread-id"),r=MTKsidebarMetadata(n),i=MTKmatchPalette(e,r.title,r.id);if(i==null){MTKclearRoom(t);continue}t.setAttribute("data-mtk-palette-room","true"),t.style.setProperty("--mtk-room-dark",i.dark.canvas),t.style.setProperty("--mtk-room-light",i.light.canvas);if(i.markDataUrl==null)t.removeAttribute("data-mtk-palette-mark"),t.style.removeProperty("--mtk-mark-image");else{t.setAttribute("data-mtk-palette-mark","true"),t.style.setProperty("--mtk-mark-image",'url("'+i.markDataUrl+'")')}t.style.setProperty("--mtk-mark-dark",i.dark.accent),t.style.setProperty("--mtk-mark-light",i.light.accent)}for(let t of document.querySelectorAll("[data-mtk-palette-source-id]")){let n=MTKmatchPalette(e,t.getAttribute("data-mtk-palette-source-title"),t.getAttribute("data-mtk-palette-source-id"));if(n==null){MTKclearDelegation(t);continue}t.setAttribute("data-mtk-palette-delegation","true"),t.style.setProperty("--mtk-bubble-dark",n.dark.bubble),t.style.setProperty("--mtk-bubble-light",n.light.bubble),t.style.setProperty("--mtk-label-dark",n.dark.label),t.style.setProperty("--mtk-label-light",n.light.label),t.style.setProperty("--mtk-delegated-accent-dark",n.dark.accent),t.style.setProperty("--mtk-delegated-accent-light",n.light.accent)}}function MTKclearPaletteSurfaces(){MTKclearCalibration();for(let e of document.querySelectorAll("[data-mtk-palette-row=true]"))MTKclearSidebarRow(e);for(let e of document.querySelectorAll("[data-mtk-palette-room-host]"))MTKclearRoom(e);for(let e of document.querySelectorAll("[data-mtk-palette-source-id]"))MTKclearDelegation(e)}`;

  let domOnlyHelper = sidebarNullSafeHelper
    .replace(
      'label:MTKcontrast(m,l)>=4.5?m:s,text:s}}function MTKvisualRule',
      'label:MTKcontrast(m,l)>=4.5?m:s,selection:n?MTKmix("#20232A",e,.4):MTKmix("#F2F4F7",e,.34),text:s}}function MTKvisualRule'
    )
    .replace(
      ',bubbleStyle:{backgroundColor:r.bubble,background:"light-dark("+i.bubble+","+r.bubble+")",boxShadow:"0 1px 8px color-mix(in srgb, "+r.accent+" 12%, transparent)"},attributionStyle:{color:"light-dark("+i.label+","+r.label+")"}',
      ""
    )
    .replaceAll(";box-shadow:inset 1px 0 0 var(--mtk-accent-dark)", "")
    .replaceAll(";box-shadow:inset 1px 0 0 var(--mtk-accent-light)", "")
    .replace(
      '[data-mtk-palette-row=true]{background-color:var(--mtk-row-dark)!important}[data-mtk-palette-row=true]:hover{background-color:var(--mtk-row-hover-dark)!important}',
      '[data-mtk-palette-row=true]{position:relative}[data-mtk-palette-row=true]::before{content:\\\"\\\";position:absolute;z-index:1;inset-inline-start:12px;top:50%;width:9px;height:9px;border-radius:999px;transform:translateY(-50%);background-color:var(--mtk-sidebar-chip);box-shadow:0 0 0 1px color-mix(in srgb,var(--color-text) 18%,transparent);pointer-events:none}[data-mtk-palette-row=true][data-mtk-palette-sidebar-context=loose]{padding-inline-start:calc(var(--padding-row-cell-x,var(--padding-row-x)) + 14px)!important}[data-mtk-palette-row=true][data-mtk-palette-sidebar-context=loose]::before{inset-inline-start:8px}'
    )
    .replace(
      'html.electron-light [data-mtk-palette-row=true]{background-color:var(--mtk-row-light)!important}html.electron-light [data-mtk-palette-row=true]:hover{background-color:var(--mtk-row-hover-light)!important}',
      ""
    )
    .replace(
      'function MTKclearSidebarRow(e){e.removeAttribute("data-mtk-palette-row");for(let t of["--mtk-row-dark","--mtk-row-light","--mtk-row-hover-dark","--mtk-row-hover-light","--mtk-row-selected-dark","--mtk-row-selected-light","--mtk-accent-dark","--mtk-accent-light"])e.style.removeProperty(t)}',
      'function MTKclearSidebarRow(e){e.removeAttribute("data-mtk-palette-row"),e.removeAttribute("data-mtk-palette-sidebar-context");for(let t of["--mtk-row-selected-dark","--mtk-row-selected-light","--mtk-accent-dark","--mtk-accent-light","--mtk-sidebar-chip"])e.style.removeProperty(t)}'
    )
    .replace(
      't.setAttribute("data-mtk-palette-row","true"),t.style.setProperty("--mtk-row-dark",n.dark.row),t.style.setProperty("--mtk-row-light",n.light.row),t.style.setProperty("--mtk-row-hover-dark",n.dark.hover),t.style.setProperty("--mtk-row-hover-light",n.light.hover),t.style.setProperty("--mtk-row-selected-dark",n.dark.selected),t.style.setProperty("--mtk-row-selected-light",n.light.selected),t.style.setProperty("--mtk-accent-dark",n.dark.accent),t.style.setProperty("--mtk-accent-light",n.light.accent)',
      't.setAttribute("data-mtk-palette-row","true"),t.setAttribute("data-mtk-palette-sidebar-context",t.closest("[data-app-action-sidebar-project-list-id]")!=null?"project":"loose"),t.style.setProperty("--mtk-row-selected-dark",n.dark.selected),t.style.setProperty("--mtk-row-selected-light",n.light.selected),t.style.setProperty("--mtk-accent-dark",n.dark.accent),t.style.setProperty("--mtk-accent-light",n.light.accent),t.style.setProperty("--mtk-sidebar-chip",n.color)'
    )
    .replace('[data-mtk-palette-mark=true]{background-color:var(--mtk-mark-dark);opacity:.075;filter:drop-shadow(0 1px 1px rgba(0,0,0,.35))}', "")
    .replace('html.electron-light [data-mtk-palette-mark=true]{background-color:var(--mtk-mark-light);opacity:.05;filter:drop-shadow(0 1px 1px rgba(255,255,255,.5))}', "")
    .replace(
      '",document.head.appendChild(e)}function MTKclearSidebarRow',
      `"+${JSON.stringify(surfaceCss)},document.head.appendChild(e)}function MTKclearSidebarRow`
    )
    .replace("function MTKqueueSidebar", surfaceObserver + "function MTKqueueSidebar")
    .replace(
      "function MTKqueueSidebar(){",
      "function MTKqueueSidebar(e){if(!MTKpaletteMutationRelevant(e))return;"
    )
    .replace(
      '["--mtk-room-dark","--mtk-room-light","--mtk-mark-dark","--mtk-mark-light","--mtk-mark-image"]',
      '["--mtk-room-dark","--mtk-room-light","--mtk-selection-dark","--mtk-selection-light","--mtk-mark-dark","--mtk-mark-light","--mtk-mark-image"]'
    )
    .replace(
      't.style.setProperty("--mtk-room-light",i.light.canvas);if',
      't.style.setProperty("--mtk-room-light",i.light.canvas),t.style.setProperty("--mtk-selection-dark",i.dark.selection),t.style.setProperty("--mtk-selection-light",i.light.selection);if'
    )
    .replace(
      '["--mtk-bubble-dark","--mtk-bubble-light","--mtk-label-dark","--mtk-label-light","--mtk-delegated-accent-dark","--mtk-delegated-accent-light"]',
      '["--mtk-bubble-dark","--mtk-bubble-light","--mtk-selection-dark","--mtk-selection-light","--mtk-label-dark","--mtk-label-light","--mtk-delegated-accent-dark","--mtk-delegated-accent-light"]'
    )
    .replace(
      't.style.setProperty("--mtk-bubble-light",n.light.bubble),t.style.setProperty("--mtk-label-dark"',
      't.style.setProperty("--mtk-bubble-light",n.light.bubble),t.style.setProperty("--mtk-selection-dark",n.dark.selection),t.style.setProperty("--mtk-selection-light",n.light.selection),t.style.setProperty("--mtk-label-dark"'
    )
    .replace("MTKsidebarPalette!=null&&MTKapplySidebar(MTKsidebarPalette)", "MTKsidebarPalette!=null&&MTKapplyPaletteSurfaces(MTKsidebarPalette)")
    .replace("MTKensurePaletteStyle(),MTKapplySidebar(e),", "MTKensurePaletteStyle(),MTKapplyPaletteSurfaces(e),")
    .replace(
      'if(MTKsidebarPalette=e,e==null){for(let e of document.querySelectorAll("[data-mtk-palette-row=true]"))MTKclearSidebarRow(e);return}',
      "if(MTKsidebarPalette=e,e==null){MTKclearPaletteSurfaces();return}"
    )
    .replace(
      'function MTKuseTaskVisual(e,t){let n=Ss(Q),r=Y(Can),i=MTKpaletteKey(r),[a,o]=QSl.useState(null);return QSl.useEffect(()=>{let e=!1;if(i.length===0)return o(null),MTKinstallSidebar(null),()=>{e=!0};let t=r.filter(e=>e.projectKind==="local").flatMap(e=>e.rootPaths??[]);return MTKpalettePromiseKey!==i&&(MTKpalettePromiseKey=i,MTKpalettePromise=MTKloadPalette(Qg(n,"local"),t)),MTKpalettePromise.then(t=>{e||(o(t),MTKinstallSidebar(t))}),()=>{e=!0}},[n,i]),MTKmatchPalette(a,e,t)}function MTKuseThreadVisual(e){let t=typeof e==="string"?Iy(e):null,n=bs(Zx,t),r=n?.kind==="local"?n.conversation?.title:n?.kind==="remote"?n.task?.title:null;return MTKuseTaskVisual(r,e)}',
      'async function MTKloadPaletteWhenReady(e,t){try{return e.get($g)==null&&await e.when(({get:e})=>e($g)!=null),await MTKloadPalette(Qg(e,"local"),t)}catch{return null}}function MTKusePaletteBootstrap(){let e=Ss(Q),t=Y(Can),n=MTKpaletteKey(t);return QSl.useEffect(()=>{let r=!1;if(n.length===0)return MTKinstallSidebar(null),()=>{r=!0};let i=t.filter(e=>e.projectKind==="local").flatMap(e=>e.rootPaths??[]);return MTKpalettePromiseKey!==n&&(MTKpalettePromiseKey=n,MTKpalettePromise=MTKloadPaletteWhenReady(e,i)),MTKpalettePromise.then(e=>{r||MTKinstallSidebar(e)}),()=>{r=!0}},[e,n]),null}'
    );
  domOnlyHelper = readableAttributionSource(domOnlyHelper);
  for (const contract of ["MTKapplyPaletteSurfaces", "data-mtk-palette-delegation", "data-mtk-palette-sidebar-context", "--mtk-sidebar-chip", "::before", "::selection", "selection:n?MTKmix", "MTKclearPaletteSurfaces"]) {
    if (!domOnlyHelper.includes(contract)) throw new Error(`missing DOM-only palette contract ${contract}`);
  }
  if (domOnlyHelper.includes("box-shadow:inset 1px 0 0")) throw new Error("rejected sidebar accent remains");
  if (domOnlyHelper.includes("[data-mtk-palette-mark=true]{background-color")) {
    throw new Error("rejected whole-room mark opacity remains");
  }

  if (profile.agentRoster !== true &&
      (domOnlyHelper.includes("MTKuseTaskVisual") || domOnlyHelper.includes("MTKuseThreadVisual"))) {
    throw new Error("obsolete palette React hooks remain");
  }
  domOnlyHelper = replaceOnce(
    domOnlyHelper,
    'function MTKsidebarArchiveProtected(e,t=MTKsidebarPalette){return typeof e==="string"&&t!=null&&t.rules.some(t=>t.protectSidebarArchive&&t.taskId===e)}function MTKensurePaletteStyle()',
    canonicalArchiveClassifier + 'function MTKensurePaletteStyle()',
    "palette archive classifier bridge"
  );
  domOnlyHelper = addArchiveReloadNotification(domOnlyHelper, "MTK");
  if (profile.agentRoster !== true) {
    domOnlyHelper = addReasoningPolicyBridge(domOnlyHelper, "MTK");
    domOnlyHelper = addModelPinPolicyBridge(domOnlyHelper, "MTK");
  }
  if (profile.fixedOwnerRoot === true) {
    if (workspaceRoot == null) throw new Error(`${profile.name} requires --config with workspaceRoot`);
    const bootstrap = /function MTKusePaletteBootstrap\(\)\{let e=Ss\(Q\),t=Y\(Can\),n=MTKpaletteKey\(t\);return QSl\.useEffect\(\(\)=>\{let r=!1;if\(n\.length===0\)return MTKinstallSidebar\(null\),\(\)=>\{r=!0\};let i=t\.filter\(e=>e\.projectKind==="local"\)\.flatMap\(e=>e\.rootPaths\?\?\[\]\);return MTKpalettePromiseKey!==n&&\(MTKpalettePromiseKey=n,MTKpalettePromise=MTKloadPaletteWhenReady\(e,i\)\),MTKpalettePromise\.then\(e=>\{r\|\|MTKinstallSidebar\(e\)\}\),\(\)=>\{r=!0\}\},\[e,n\]\),null\}/;
    const replacement = `function MTKusePaletteBootstrap(){let e=A_($),t=${JSON.stringify(workspaceRoot)};return x$c.useEffect(()=>{let n=!1;return MTKpalettePromiseKey!==t&&(MTKpalettePromiseKey=t,MTKpalettePromise=MTKloadPaletteWhenReady(e,[t])),MTKpalettePromise.then(e=>{n||MTKinstallSidebar(e)}),()=>{n=!0}},[e]),null}`;
    const matches = domOnlyHelper.match(bootstrap);
    if (matches == null) throw new Error(`${profile.name} fixed palette owner bootstrap is missing`);
    domOnlyHelper = domOnlyHelper.replace(bootstrap, replacement);
  }
  domOnlyHelper = addPaletteRuntimeReload(domOnlyHelper, profile.fixedOwnerRoot === true, workspaceRoot, profile.agentRoster === true);
  for (const [before, after] of profile.helperReplacements) {
    domOnlyHelper = replaceOnce(domOnlyHelper, before, after, `${profile.name} helper alias ${before}`);
  }
  source = replaceOnce(source, profile.seam, domOnlyHelper + profile.patchedSeam, "sidebar palette bootstrap");
  fs.writeFileSync(file, source);
}

function readableAttributionSource(source) {
  source = replaceOnce(source, "function MTKderive(", readableLabelHelper + "function MTKderive(", "readable attribution helper");
  return replaceOnce(source, neutralLabelExpression, readableLabelExpression, "readable attribution color");
}

function addPaletteRuntimeReload(source, fixedOwnerRoot, workspaceRoot, agentRoster = false) {
  if (agentRoster) {
    const before = 'function MTKusePaletteBootstrap(){let e=Ss(Q),t=Y(Can),n=MTKpaletteKey(t);return QSl.useEffect(()=>{let r=!1;if(n.length===0)return MTKinstallSidebar(null),()=>{r=!0};let i=t.filter(e=>e.projectKind==="local").flatMap(e=>e.rootPaths??[]);return MTKpalettePromiseKey!==n&&(MTKpalettePromiseKey=n,MTKpalettePromise=MTKloadPaletteWhenReady(e,i)),MTKpalettePromise.then(e=>{r||MTKinstallSidebar(e)}),()=>{r=!0}},[e,n]),null}';
    const after = 'async function MTKacceptPaletteReload(e){let t=await MTKloadPalette();return e()?(MTKinstallSidebar(t),t!=null):!1}function MTKusePaletteBootstrap(){return QSl.useEffect(()=>{let e=!1,t=()=>MTKacceptPaletteReload(()=>!e),n=globalThis.__MTK_AGENT_ROSTER__?.subscribe(t);return t(),()=>{e=!0,n?.()}},[]),null}';
    return replaceOnce(source, before, after, "agent roster palette subscription");
  }
  const dynamicBefore = 'function MTKusePaletteBootstrap(){let e=Ss(Q),t=Y(Can),n=MTKpaletteKey(t);return QSl.useEffect(()=>{let r=!1;if(n.length===0)return MTKinstallSidebar(null),()=>{r=!0};let i=t.filter(e=>e.projectKind==="local").flatMap(e=>e.rootPaths??[]);return MTKpalettePromiseKey!==n&&(MTKpalettePromiseKey=n,MTKpalettePromise=MTKloadPaletteWhenReady(e,i)),MTKpalettePromise.then(e=>{r||MTKinstallSidebar(e)}),()=>{r=!0}},[e,n]),null}';
  const dynamicAfter = 'async function MTKacceptPaletteReload(e,t,n,r){let i=await MTKloadPaletteWhenReady(e,t);return r()&&(i!=null||n?.initial===!0)?(MTKinstallSidebar(i),i!=null):!1}function MTKusePaletteBootstrap(){let e=Ss(Q),t=Y(Can),n=MTKpaletteKey(t);return QSl.useEffect(()=>{let r=!1;if(n.length===0)return MTKinstallSidebar(null),()=>{r=!0};let i=t.filter(e=>e.projectKind==="local").flatMap(e=>e.rootPaths??[]),a=globalThis.__MTK_RUNTIME_JSON_RELOAD__?.register("task-visual-palette.json",t=>MTKacceptPaletteReload(e,i,t,()=>!r));if(typeof a==="function")return()=>{r=!0,a()};return MTKpalettePromiseKey!==n&&(MTKpalettePromiseKey=n,MTKpalettePromise=MTKloadPaletteWhenReady(e,i)),MTKpalettePromise.then(e=>{r||MTKinstallSidebar(e)}),()=>{r=!0}},[e,n]),null}';
  if (!fixedOwnerRoot) return replaceOnce(source, dynamicBefore, dynamicAfter, "palette runtime reload callback");

  const fixedBefore = `function MTKusePaletteBootstrap(){let e=A_($),t=${JSON.stringify(workspaceRoot)};return x$c.useEffect(()=>{let n=!1;return MTKpalettePromiseKey!==t&&(MTKpalettePromiseKey=t,MTKpalettePromise=MTKloadPaletteWhenReady(e,[t])),MTKpalettePromise.then(e=>{n||MTKinstallSidebar(e)}),()=>{n=!0}},[e]),null}`;
  const fixedAfter = `async function MTKacceptPaletteReload(e,t,n,r){let i=await MTKloadPaletteWhenReady(e,t);return r()&&(i!=null||n?.initial===!0)?(MTKinstallSidebar(i),i!=null):!1}function MTKusePaletteBootstrap(){let e=A_($),t=${JSON.stringify(workspaceRoot)};return x$c.useEffect(()=>{let n=!1,r=globalThis.__MTK_RUNTIME_JSON_RELOAD__?.register("task-visual-palette.json",r=>MTKacceptPaletteReload(e,[t],r,()=>!n));if(typeof r==="function")return()=>{n=!0,r()};return MTKpalettePromiseKey!==t&&(MTKpalettePromiseKey=t,MTKpalettePromise=MTKloadPaletteWhenReady(e,[t])),MTKpalettePromise.then(e=>{n||MTKinstallSidebar(e)}),()=>{n=!0}},[e]),null}`;
  return replaceOnce(source, fixedBefore, fixedAfter, "fixed-owner palette runtime reload callback");
}

function agentRosterConsumer(source) {
  source = "const MTKpaletteRosterConsumer=1;" + source;
  source = replaceOnce(source,
    'const MTKpaletteRelativePath=".codex/task-visual-palette.json"',
    'const MTKpaletteRelativePath=".codex/agent-roster.json"',
    "agent roster filename");
  const loadStart = source.indexOf("async function MTKloadPalette(");
  const loadEnd = source.indexOf("function MTKpaletteKey(", loadStart);
  if (loadStart < 0 || loadEnd < 0) throw new Error("agent roster palette loader boundary is missing");
  const loader = String.raw`async function MTKloadPalette(){let e=globalThis.__MTK_AGENT_ROSTER__,t=e?.current?.();if(t==null)return null;let n=t.sources.filter(e=>e.data.calibration!==void 0);if(n.length>1)return e.diagnose("multiple-palette-calibrations",n.map(e=>e.ownerRoot));let r=MTKcalibration(n[0]?.data.calibration);if(r==null)return e.diagnose("invalid-palette-calibration",n[0]?.ownerRoot);let i=[];for(let n of t.entries){let t=n.data;if(t.color===void 0)continue;if(typeof t.color!=="string"||!/^#[0-9A-Fa-f]{6}$/.test(t.color)||t.mark!==void 0&&(typeof t.mark!=="string"||!/\.svg$/i.test(t.mark))||t.protectSidebarArchive!==void 0&&typeof t.protectSidebarArchive!=="boolean"||t.protectSidebarArchive===!0&&n.taskId==null)return e.diagnose("invalid-palette-entry",{ownerRoot:n.ownerRoot,key:n.key});let a=null;t.mark!==void 0&&(a=await e.readAsset(n,t.mark,65536),a!=null&&(a="data:image/svg+xml;base64,"+a));let o=n.pattern??new RegExp("^(?:"+n.taskId+")$");i.push(MTKvisualRule(r,{color:t.color.toUpperCase(),markDataUrl:a,taskId:n.taskId,protectSidebarArchive:t.protectSidebarArchive},o))}return{calibration:r,rules:i}}`;
  source = source.slice(0, loadStart) + loader + source.slice(loadEnd);
  source = replaceOnce(
    source,
    'function MTKmatchPalette(e,t,n){if(e==null)return null;let r=typeof t==="string"?t:"",i=typeof n==="string"?n:"";for(let t of e.rules)if(t.pattern.test(r)||t.pattern.test(i))return t;return null}',
    'function MTKmatchPalette(e,t,n){if(e==null)return null;let r=typeof t==="string"?t:"",i=typeof n==="string"?n:"",a=i.length>0?e.rules.find(e=>e.taskId===i):null;if(a!=null)return a;for(let t of e.rules)if(t.pattern.test(r))return t;return null}',
    "agent roster exact visual identity priority"
  );
  const visualStart = source.indexOf("function MTKuseTaskVisual(");
  if (visualStart < 0) throw new Error("agent roster visual hook boundary is missing");
  const bootstrap = 'function MTKusePaletteBootstrap(){let e=Ss(Q),t=Y(Can),n=MTKpaletteKey(t);return QSl.useEffect(()=>{let r=!1;if(n.length===0)return MTKinstallSidebar(null),()=>{r=!0};let i=t.filter(e=>e.projectKind==="local").flatMap(e=>e.rootPaths??[]);return MTKpalettePromiseKey!==n&&(MTKpalettePromiseKey=n,MTKpalettePromise=MTKloadPaletteWhenReady(e,i)),MTKpalettePromise.then(e=>{r||MTKinstallSidebar(e)}),()=>{r=!0}},[e,n]),null}';
  return source.slice(0, visualStart) + bootstrap;
}

function patchBottomFade(appFile, primaryFile) {
  let appSource = fs.readFileSync(appFile, "utf8");
  let primarySource = fs.readFileSync(primaryFile, "utf8");
  const profile = bottomFadeProfile(appSource, primarySource);
  if (profile == null) throw new Error("unrecognized thread footer bottom-fade ownership profile");
  if (profile.file === "app-initial") {
    appSource = replaceOnce(appSource, profile.before, profile.after, "thread footer bottom fade");
    fs.writeFileSync(appFile, appSource);
  } else {
    primarySource = replaceOnce(primarySource, profile.before, profile.after, "thread footer bottom fade");
    fs.writeFileSync(primaryFile, primarySource);
  }
}

function addReasoningPolicyBridge(source, prefix) {
  source = requireCanonicalArchiveClassifier(source, prefix);
  source = addArchiveReloadNotification(source, prefix);
  const visualRuleBefore = `return{pattern:n,color:t.color,markDataUrl:t.markDataUrl??null,taskId:t.taskId??null,protectSidebarArchive:t.protectSidebarArchive===!0,dark:r,light:i}`;
  const visualRuleAfter = `return{pattern:n,color:t.color,markDataUrl:t.markDataUrl??null,taskId:t.taskId??null,protectSidebarArchive:t.protectSidebarArchive===!0,keepReasoningOpen:t.keepReasoningOpen===!0,dark:r,light:i}`;
  source = replaceOnce(source, visualRuleBefore, visualRuleAfter, "palette reasoning metadata");
  source = replaceOnce(
    source,
    'e!=="taskId"&&e!=="protectSidebarArchive")',
    'e!=="taskId"&&e!=="protectSidebarArchive"&&e!=="keepReasoningOpen")',
    "palette reasoning key"
  );
  source = replaceOnce(
    source,
    'r.protectSidebarArchive!==void 0&&typeof r.protectSidebarArchive!=="boolean"||r.protectSidebarArchive===!0&&r.taskId===void 0',
    'r.protectSidebarArchive!==void 0&&typeof r.protectSidebarArchive!=="boolean"||r.protectSidebarArchive===!0&&r.taskId===void 0||r.keepReasoningOpen!==void 0&&typeof r.keepReasoningOpen!=="boolean"||r.keepReasoningOpen===!0&&r.taskId===void 0',
    "palette reasoning validation"
  );
  source = replaceOnce(
    source,
    'protectSidebarArchive:r.protectSidebarArchive},a))',
    'protectSidebarArchive:r.protectSidebarArchive,keepReasoningOpen:r.keepReasoningOpen},a))',
    "palette reasoning projection"
  );
  const archiveBridge = currentArchiveClassifier(prefix);
  const reasoningBridge = `const ${prefix}reasoningListeners=new Set;function MTKreasoningShouldStayOpen(e,t=${prefix}sidebarPalette){return typeof e==="string"&&t!=null&&t.rules.some(t=>t.keepReasoningOpen===!0&&t.taskId===e)}function ${prefix}reasoningSubscribe(e){return ${prefix}reasoningListeners.add(e),()=>${prefix}reasoningListeners.delete(e)}globalThis.__MTKreasoningShouldStayOpen=MTKreasoningShouldStayOpen;globalThis.__MTKreasoningSubscribe=${prefix}reasoningSubscribe;`;
  source = replaceOnce(source, archiveBridge, archiveBridge + reasoningBridge, "palette reasoning bridge");
  source = replaceOnce(
    source,
    `function ${prefix}installSidebar(e){${prefix}sidebarPalette=e;${prefix}sidebarArchiveNotify();if(e==null){`,
    `function ${prefix}installSidebar(e){${prefix}sidebarPalette=e;${prefix}sidebarArchiveNotify();for(let t of ${prefix}reasoningListeners)t();if(e==null){`,
    "palette reasoning update notification"
  );
  return source;
}

function addModelPinPolicyBridge(source, prefix) {
  source = requireCanonicalArchiveClassifier(source, prefix);
  const visualRuleBefore = `return{pattern:n,color:t.color,markDataUrl:t.markDataUrl??null,taskId:t.taskId??null,protectSidebarArchive:t.protectSidebarArchive===!0,keepReasoningOpen:t.keepReasoningOpen===!0,dark:r,light:i}`;
  const visualRuleAfter = `return{pattern:n,color:t.color,markDataUrl:t.markDataUrl??null,taskId:t.taskId??null,protectSidebarArchive:t.protectSidebarArchive===!0,keepReasoningOpen:t.keepReasoningOpen===!0,modelPin:t.modelPin??null,dark:r,light:i}`;
  source = replaceOnce(source, visualRuleBefore, visualRuleAfter, "palette model-pin metadata");
  source = replaceOnce(
    source,
    'e!=="taskId"&&e!=="protectSidebarArchive"&&e!=="keepReasoningOpen")',
    'e!=="taskId"&&e!=="protectSidebarArchive"&&e!=="keepReasoningOpen"&&e!=="modelPin")',
    "palette model-pin key"
  );
  source = replaceOnce(
    source,
    'r.keepReasoningOpen!==void 0&&typeof r.keepReasoningOpen!=="boolean"||r.keepReasoningOpen===!0&&r.taskId===void 0',
    'r.keepReasoningOpen!==void 0&&typeof r.keepReasoningOpen!=="boolean"||r.keepReasoningOpen===!0&&r.taskId===void 0||r.modelPin!==void 0&&(!MTKplainObject(r.modelPin)||Object.keys(r.modelPin).some(e=>e!=="model"&&e!=="reasoningEffort")||typeof r.modelPin.model!=="string"||r.modelPin.model.length===0||r.modelPin.model.length>128||typeof r.modelPin.reasoningEffort!=="string"||!MTKmodelPinEfforts.has(r.modelPin.reasoningEffort)||r.taskId===void 0)',
    "palette model-pin validation"
  );
  source = replaceOnce(
    source,
    'protectSidebarArchive:r.protectSidebarArchive,keepReasoningOpen:r.keepReasoningOpen},a))',
    'protectSidebarArchive:r.protectSidebarArchive,keepReasoningOpen:r.keepReasoningOpen,modelPin:r.modelPin},a))',
    "palette model-pin projection"
  );
  const reasoningBridge = `const ${prefix}reasoningListeners=new Set;function MTKreasoningShouldStayOpen(e,t=${prefix}sidebarPalette){return typeof e==="string"&&t!=null&&t.rules.some(t=>t.keepReasoningOpen===!0&&t.taskId===e)}function ${prefix}reasoningSubscribe(e){return ${prefix}reasoningListeners.add(e),()=>${prefix}reasoningListeners.delete(e)}globalThis.__MTKreasoningShouldStayOpen=MTKreasoningShouldStayOpen;globalThis.__MTKreasoningSubscribe=${prefix}reasoningSubscribe;`;
  const modelPinBridge = `const ${prefix}modelPinEfforts=new Set(["none","minimal","low","medium","high","xhigh","max","ultra","persistent"]),${prefix}modelPinListeners=new Set;function MTKmodelPinForTask(e,t=${prefix}sidebarPalette){if(typeof e!=="string"||t==null)return null;let n=t.rules.find(t=>t.taskId===e);return n?.modelPin??null}function ${prefix}modelPinSubscribe(e){return ${prefix}modelPinListeners.add(e),()=>${prefix}modelPinListeners.delete(e)}globalThis.__MTKmodelPinForTask=MTKmodelPinForTask;globalThis.__MTKmodelPinSubscribe=${prefix}modelPinSubscribe;`;
  source = replaceOnce(source, reasoningBridge, reasoningBridge + modelPinBridge, "palette model-pin bridge");
  source = replaceOnce(
    source,
    `function ${prefix}installSidebar(e){${prefix}sidebarPalette=e;${prefix}sidebarArchiveNotify();for(let t of ${prefix}reasoningListeners)t();if(e==null){`,
    `function ${prefix}installSidebar(e){${prefix}sidebarPalette=e;${prefix}sidebarArchiveNotify();for(let t of ${prefix}reasoningListeners)t();for(let t of ${prefix}modelPinListeners)t();if(e==null){`,
    "palette model-pin update notification"
  );
  return source;
}

function currentArchiveClassifier(prefix) {
  return `function ${prefix}sidebarArchiveTaskId(e){if(typeof e!=="string")return null;let t=e.startsWith("local:")?e.slice(6):e;return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(t)?t:null}function ${prefix}sidebarArchiveProtected(e,t=${prefix}sidebarPalette){let n=${prefix}sidebarArchiveTaskId(e);return n!==null&&t!=null&&t.rules.some(e=>e.protectSidebarArchive&&e.taskId===n)}const ${prefix}sidebarArchiveListeners=new Set;let ${prefix}sidebarArchiveEpoch=0;function ${prefix}sidebarArchiveSubscribe(e){return ${prefix}sidebarArchiveListeners.add(e),()=>${prefix}sidebarArchiveListeners.delete(e)}function ${prefix}sidebarArchiveSnapshot(){return ${prefix}sidebarArchiveEpoch}function ${prefix}sidebarArchiveNotify(){${prefix}sidebarArchiveEpoch++;for(let e of ${prefix}sidebarArchiveListeners)e()}globalThis.__MTKsidebarArchiveProtected=${prefix}sidebarArchiveProtected;globalThis.__MTKsidebarArchiveSubscribe=${prefix}sidebarArchiveSubscribe;globalThis.__MTKsidebarArchiveSnapshot=${prefix}sidebarArchiveSnapshot;`;
}

function requireCanonicalArchiveClassifier(source, prefix) {
  const classifier = currentArchiveClassifier(prefix);
  const count = source.split(classifier).length - 1;
  if (count !== 1) throw new Error(`Unrecognized palette archive identity: canonical=${count}`);
  return source;
}

function addArchiveReloadNotification(source, prefix) {
  const before = `function ${prefix}installSidebar(e){if(${prefix}sidebarPalette=e,e==null){`;
  const after = `function ${prefix}installSidebar(e){${prefix}sidebarPalette=e;${prefix}sidebarArchiveNotify();if(e==null){`;
  const beforeCount = source.split(before).length - 1;
  const afterCount = source.split(after).length - 1;
  if (beforeCount === 1 && afterCount === 0) {
    return replaceOnce(source, before, after, "palette archive reload notification");
  }
  if (beforeCount === 0 && afterCount === 1) return source;
  throw new Error(`Unrecognized palette archive reload notification: before=${beforeCount} after=${afterCount}`);
}

function patchSidebarArchiveAffordances(file, primaryFile) {
  let source = fs.readFileSync(file, "utf8");
  if (build9922.archive.pristine.every(contract => source.includes(contract))) {
    for (const replacement of build9922.archive.replacements) {
      source = replaceOnce(source, ...replacement);
    }
    source = applyBuild9922ArchiveRuntime(source);
    fs.writeFileSync(file, source);
    return;
  }
  let primarySource = fs.readFileSync(primaryFile, "utf8");
  if (linuxBuild9647.archive.pristine.every(contract => primarySource.includes(contract))) {
    for (const replacement of linuxBuild9647.archive.replacements) {
      primarySource = replaceOnce(primarySource, ...replacement);
    }
    primarySource = applyBuild9647ArchiveRuntime(primarySource, linuxBuild9647.archive.runtime);
    fs.writeFileSync(primaryFile, primarySource);
    return;
  }
  if (!primarySource.includes("function mkn({scope:e,target:t,actions:n,onRename:r,onArchive:i,")) {
    throw new Error("unrecognized build-9647 sidebar archive ownership profile");
  }
  primarySource = replaceOnce(
    primarySource,
    "function mkn({scope:e,target:t,actions:n,onRename:r,onArchive:i,",
    "const MTKsidebarArchiveProtected=e=>globalThis.__MTKsidebarArchiveProtected?.(e)===!0;function mkn({scope:e,target:t,actions:n,onRename:r,onArchive:i,",
    "build-9647 archive classifier bridge"
  );
  primarySource = replaceOnce(primarySource, "archive:D?void 0:{id:`archive-thread`,message:void 0,onSelect:()=>{i()}}", "archive:D||MTKsidebarArchiveProtected(_)?void 0:{id:`archive-thread`,message:void 0,onSelect:()=>{i()}}", "build-9647 local context archive item");
  primarySource = replaceOnce(
    primarySource,
    "function Akn({items:e,onArchive:t,onSelect:n,selectedThreadKeys:r,threadKey:i}){return r.length<2?e:",
    "function Akn({items:e,onArchive:t,onSelect:n,selectedThreadKeys:r,threadKey:i,archiveProtected:a}){return a&&(e=e.filter(e=>e.id!==`archive-thread`&&e.id!==`archive-task`)),r.length<2?e:",
    "build-9647 bulk archive filter"
  );
  primarySource = replaceOnce(
    primarySource,
    "selectedThreadKeys:fwn(T,r),threadKey:r})",
    "selectedThreadKeys:fwn(T,r),threadKey:r,archiveProtected:fwn(T,r).some(e=>{let t=T.get(iS,e),n=t?.kind===`local`?t.conversationId:t?.kind===`remote`?t.task.id:null;return MTKsidebarArchiveProtected(n)})})",
    "build-9647 local protected selection"
  );
  primarySource = replaceOnce(
    primarySource,
    "selectedThreadKeys:fwn(K,e),threadKey:e})",
    "selectedThreadKeys:fwn(K,e),threadKey:e,archiveProtected:fwn(K,e).some(e=>{let t=K.get(iS,e),n=t?.kind===`local`?t.conversationId:t?.kind===`remote`?t.task.id:null;return MTKsidebarArchiveProtected(n)})})",
    "build-9647 unified protected selection"
  );
  primarySource = replaceOnce(primarySource, "archive:t!=null&&(Oe||V)?Pe:t,getMenuItems:", "archive:MTKsidebarArchiveProtected(n)?null:t!=null&&(Oe||V)?Pe:t,getMenuItems:", "build-9647 local inline archive");
  primarySource = replaceOnce(primarySource, "Be=xe?Ae:null", "Be=xe&&!MTKsidebarArchiveProtected(ae)?Ae:null", "build-9647 cloud inline archive");
  primarySource = replaceOnce(primarySource, "if(xe&&e.push({id:`archive-task`", "if(xe&&!MTKsidebarArchiveProtected(ae)&&e.push({id:`archive-task`", "build-9647 cloud context archive item");
  primarySource = replaceOnce(
    primarySource,
    "archive:n,getMenuItems:q?e=>d([",
    "archive:MTKsidebarArchiveProtected(e.task.id)?null:n,getMenuItems:q&&!MTKsidebarArchiveProtected(e.task.id)?e=>d([",
    "build-9647 remote row archive"
  );
  primarySource = applyBuild9647ArchiveRuntime(primarySource);
  fs.writeFileSync(primaryFile, primarySource);
}
function patchLocalPage(file) {
  let source = fs.readFileSync(file, "utf8");
  if (source.includes("data-mtk-palette-room-host")) throw new Error("room prototype already applied");
  const profile = localProfile(source);
  if (profile == null) throw new Error("unrecognized local conversation page-shell ownership profile");
  source = replaceOnce(source, profile.cacheBefore, profile.cacheAfter, "local page memo cache size");
  source = replaceOnce(source, profile.rootBefore, profile.rootAfter, "local page root surface");
  fs.writeFileSync(file, source);
}

function patchDelegation(file) {
  let source = fs.readFileSync(file, "utf8");
  if (source.includes("data-mtk-palette-source-id")) throw new Error("delegation palette prototype already applied");
  if (source.includes(build9922.delegation.owner)) {
    for (const replacement of build9922.delegation.replacements) {
      source = replaceOnce(source, ...replacement);
    }
    fs.writeFileSync(file, source);
    return;
  }
  if (!source.includes("function MS(e){let t=(0,NS.c)(14),")) {
    throw new Error("unrecognized build-9647 delegation provenance ownership profile");
  }
  source = replaceOnce(source, "function MS(e){let t=(0,NS.c)(14),", "function MS(e){let t=(0,NS.c)(16),", "build-9647 delegation palette cache size");
  source = replaceOnce(
    source,
    "t[5]!==l||t[6]!==n||t[7]!==o||t[8]!==s||t[9]!==i||t[10]!==a||t[11]!==m||t[13]!==p?(h=(0,PS.jsx)(CS,{conversationId:n,label:p,message:i,sentAtMs:a,cwd:o,hostId:s,compactActions:l,onLabelClick:m,messageBubbleStyle:MTKdelegatedBubbleStyle}),t[5]=l,t[6]=n,t[7]=o,t[8]=s,t[9]=i,t[10]=a,t[11]=m,t[13]=p,t[12]=h):h=t[12]",
    "t[5]!==l||t[6]!==n||t[7]!==o||t[8]!==s||t[9]!==i||t[10]!==a||t[11]!==m||t[13]!==p||t[14]!==MTKtitle||t[15]!==r?(h=(0,PS.jsx)(CS,{conversationId:n,label:p,message:i,sentAtMs:a,cwd:o,hostId:s,compactActions:l,onLabelClick:m,messageBubbleStyle:MTKdelegatedBubbleStyle,paletteSourceTitle:MTKtitle,paletteSourceId:r}),t[5]=l,t[6]=n,t[7]=o,t[8]=s,t[9]=i,t[10]=a,t[11]=m,t[13]=p,t[14]=MTKtitle,t[15]=r,t[12]=h):h=t[12]",
    "build-9647 delegated provenance attributes handoff"
  );
  source = replaceOnce(source, "function CS(e){let t=(0,wS.c)(17),", "function CS(e){let t=(0,wS.c)(19),", "build-9647 delegation wrapper palette cache size");
  source = replaceOnce(source, "onLabelClick:l,messageBubbleStyle:MTKbubbleStyleOverride}=e,", "onLabelClick:l,messageBubbleStyle:MTKbubbleStyleOverride,paletteSourceTitle:MTKsourceTitle,paletteSourceId:MTKsourceId}=e,", "build-9647 delegation provenance props");
  source = replaceOnce(
    source,
    "t[13]!==p||t[14]!==m?(h=(0,TS.jsxs)(`div`,{className:`flex w-full flex-col items-end justify-end gap-1`,children:[p,m]}),t[13]=p,t[14]=m,t[15]=h):h=t[15]",
    "t[13]!==p||t[14]!==m||t[17]!==MTKsourceTitle||t[18]!==MTKsourceId?(h=(0,TS.jsxs)(`div`,{\"data-mtk-palette-source-title\":MTKsourceTitle??void 0,\"data-mtk-palette-source-id\":MTKsourceId??void 0,className:`flex w-full flex-col items-end justify-end gap-1`,children:[p,m]}),t[13]=p,t[14]=m,t[17]=MTKsourceTitle,t[18]=MTKsourceId,t[15]=h):h=t[15]",
    "build-9647 delegation provenance DOM surface"
  );
  fs.writeFileSync(file, source);
}
function readOption(name) {
  const index = process.argv.indexOf(name, 4);
  if (index < 0) return null;
  if (index !== process.argv.length - 2 || !process.argv[index + 1]) {
    throw new Error(`usage: ${name} must be followed by one value`);
  }
  return path.resolve(process.argv[index + 1]);
}

function configuredWorkspaceRoot(required = true) {
  if (configPath == null) {
    if (required) throw new Error("task-visual-palette apply requires --config TOOLKIT_CONFIG");
    return null;
  }
  let config;
  try {
    config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  } catch (error) {
    throw new Error(`Cannot read toolkit config: ${error.message}`);
  }
  if (config == null || typeof config !== "object" || Array.isArray(config)) {
    throw new Error("Toolkit config must be a JSON object");
  }
  const workspaceRoot = config.workspaceRoot;
  if (typeof workspaceRoot !== "string" || !path.isAbsolute(workspaceRoot) || path.parse(workspaceRoot).root === path.resolve(workspaceRoot)) {
    throw new Error("Toolkit config workspaceRoot must be an absolute non-root path");
  }
  return path.resolve(workspaceRoot);
}

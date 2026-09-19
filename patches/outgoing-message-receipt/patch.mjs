#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { build9922 } from "./profiles/build9922.mjs";
import { linuxBuild9647, linuxBuild9771 } from "./profiles/linux.mjs";

const command = process.argv[2];
const root = path.resolve(process.argv[3] ?? "");
const id = "[$A-Z_a-z][$\\w]*";
const currentRegistryCall = 'globalThis.__MTK_PATCH_REGISTRY__?.register?.("outgoingMessageReceipt",{version:5,persistence:"acknowledged-private-task-buckets",visibility:"persistent-after-restart-and-collapse",preview:"stock-hover",messageRendering:"recipient-user-message"});';
const taskColorFunction = 'function MTKoutboundTaskColor(e,t){try{let n=globalThis.__MTK_PATCH_REGISTRY__;if(n?.apiVersion!==1)return null;let r=n.packages?.taskVisualPalette;if(r?.version!==1||typeof r.resolveTaskColor!=="function")return null;let i=r.resolveTaskColor({taskId:e,title:t});return typeof i==="string"&&/^#[0-9A-Fa-f]{6}$/.test(i)?i.toUpperCase():null}catch{return null}}';
const taskColorFunctions = `${taskColorFunction}function MTKoutboundParseHex(e){return{r:parseInt(e.slice(1,3),16),g:parseInt(e.slice(3,5),16),b:parseInt(e.slice(5,7),16)}}function MTKoutboundMix(e,t,n){let r=MTKoutboundParseHex(e),i=MTKoutboundParseHex(t),a=e=>Math.round(e).toString(16).padStart(2,"0");return("#"+a(r.r+(i.r-r.r)*n)+a(r.g+(i.g-r.g)*n)+a(r.b+(i.b-r.b)*n)).toUpperCase()}function MTKoutboundLum(e){let t=Object.values(MTKoutboundParseHex(e)).map(e=>{let t=e/255;return t<=.04045?t/12.92:((t+.055)/1.055)**2.4});return.2126*t[0]+.7152*t[1]+.0722*t[2]}function MTKoutboundContrast(e,t){let n=MTKoutboundLum(e),r=MTKoutboundLum(t);return(Math.max(n,r)+.05)/(Math.min(n,r)+.05)}function MTKoutboundLabelColor(e,t){let n=t?.38:.34,r=t?"#FFFFFF":"#111318",i=t?"#101114":"#FFFFFF";for(;n<=1.001;n+=.08){let t=MTKoutboundMix(e,r,Math.min(1,n));if(MTKoutboundContrast(t,i)>=4.5)return t}return r}`;
const taskColorStyle = 'l=c==null?void 0:{color:"light-dark("+MTKoutboundLabelColor(c,!1)+","+MTKoutboundLabelColor(c,!0)+")"},u=';
if (!new Set(["check", "apply"]).has(command) || !process.argv[3]) {
  throw new Error("usage: outgoing-message-receipt/patch.mjs check|apply EXTRACTED_ASAR_ROOT");
}

const assets = path.join(root, "webview/assets");
assertStockStyles();
const target = uniqueOwner();
const projectionTarget = uniqueProjectionOwner();
const conversationTarget = uniqueConversationOwner();
const conversationTurnTarget = uniqueConversationTurnOwner(conversationTarget);
const mainTarget = uniqueMainOwner();
let source = fs.readFileSync(target, "utf8");
let projectionSource = fs.readFileSync(projectionTarget, "utf8");
let conversationSource = fs.readFileSync(conversationTarget, "utf8");
let conversationTurnSource = conversationTurnTarget === conversationTarget
  ? conversationSource : fs.readFileSync(conversationTurnTarget, "utf8");
let mainSource = fs.readFileSync(mainTarget, "utf8");
const collapseOwner = assertPersistentActivityContract(source);
const presentation = resolvePresentationOwners(source);
let state = inspectState();

if (command === "apply" && state === "needs-apply") {
  source = patchSource(source);
  projectionSource = patchSuccessProjection(projectionSource);
  ({conversationSource, conversationTurnSource} = patchConversation(conversationSource, conversationTurnSource));
  mainSource = patchMain(mainSource);
  fs.writeFileSync(target, source);
  fs.writeFileSync(projectionTarget, projectionSource);
  fs.writeFileSync(conversationTarget, conversationSource);
  if (conversationTurnTarget !== conversationTarget) fs.writeFileSync(conversationTurnTarget, conversationTurnSource);
  fs.writeFileSync(mainTarget, mainSource);
  syntaxCheck(target);
  syntaxCheck(projectionTarget);
  syntaxCheck(conversationTarget);
  if (conversationTurnTarget !== conversationTarget) syntaxCheck(conversationTurnTarget);
  syntaxCheck(mainTarget);
  state = inspectState();
  if (state !== "applied") throw new Error("outgoing receipt transform did not verify");
}

process.stdout.write(`${JSON.stringify({
  state,
  persistence: "acknowledged-private-task-buckets",
  collapsedVisibility: "persistent",
  preview: "stock-interactive-hover",
  messageRendering: "stock-recipient-user-message-formatter",
  collapseOwner: path.relative(root, collapseOwner),
  formatterOwner: path.relative(root, presentation.formatterFile),
  targets: [...new Set([target, projectionTarget, conversationTarget, conversationTurnTarget, mainTarget])].map(file => path.relative(root, file))
}, null, 2)}\n`);

function inspectState() {
  const send = sendProfile(source);
  const red = `{namespace:${send.namespace},render:${send.genericRender},renderAgentActivityIcon:${send.icon},tool:${send.sendTool}}`;
  const green = `{namespace:${send.namespace},persistentInCollapsedConversation:!0,render:MTKrenderOutboundMessage,renderAgentActivityIcon:${send.icon},standaloneInConversation:!0,tool:${send.sendTool}}`;
  const ownerLifecycleBranch = `if(typeof i.ReceiptLifecycle==="function")return(0,${send.jsx}.jsx)(i.ReceiptLifecycle,{item:e,record:t});if(globalThis.__MTK_OUTBOUND_REMEMBER__(t)===!0)return null`;
  const ownerMarkers = [
    "function MTKOutboundMessageReceipt(",
    "function MTKoutboundTaskColor(",
    "globalThis.__MTK_OUTBOUND_REMEMBER__",
    "MTKOutboundMessageReceipt as MTKoutboundReceipt",
    "MTKoutboundStoreHook(MTKoutboundStoreScope)",
    ".get(MTKoutboundTaskAtom,",
    "n.packages?.taskVisualPalette",
    "MTKoutboundHover",
    "MTKoutboundFormattedText",
    "Actions:MTKactions",
    "timestampHoverOnly:!0",
    "interactive:!0",
    "delayDuration:800",
    'maxHeight:"min(420px, var(--radix-tooltip-content-available-height, 420px), calc(100vh - 16px))"',
    'overflowY:"auto"',
    'padding:"0.75rem"',
    "data-mtk-outgoing-message-receipt",
    ownerLifecycleBranch
  ];
  if (requiresDedicatedTitleSelector(source)) ownerMarkers.push("MTKoutboundTitleAtom");
  const conversationMarkers = [
    "const MTKoutboundReceiptContract=",
    "function MTKoutboundRemember(",
    "function MTKOutboundTurnReceipts(",
    'dispatchMessage("mtk-outbound-receipt-remember"',
    'subscribe("mtk-outbound-receipt-remember-result"',
    'dispatchMessage("mtk-outbound-receipts-list"',
    'subscribe("mtk-outbound-receipts-result"',
    "MTKoutboundReceipt as MTKoutboundReceipt",
    "recordedAtMs:e.recordedAtMs",
    "Actions:",
    "function MTKOutboundReceiptLifecycle("
  ];
  const mainMarkers = [
    "const MTKoutboundReceiptContract=",
    "function MTKoutboundReceiptWrite(",
    "function MTKoutboundReceiptList(",
    '"mechanics-toolkit","task-message-receipts"',
    "MTKoutboundReceiptLimit=256",
    "case`mtk-outbound-receipt-remember`:",
    "type:`mtk-outbound-receipt-remember-result`",
    "case`mtk-outbound-receipts-list`:"
  ];
  const combinedConversationSource = conversationTurnTarget === conversationTarget
    ? conversationSource : `${conversationSource}\n${conversationTurnSource}`;
  const ownerApplied = ownerMarkers.every(marker => source.includes(marker));
  const linux = [linuxBuild9771.dynamic, linuxBuild9647.dynamic].find(profile =>
    (conversationSource.includes(profile.before) || conversationSource.includes(profile.after)) &&
      conversationSource.includes(profile.parentTurn)
  );
  const current = build9922.dynamic;
  const currentConversation = (conversationSource.includes(current.before) || conversationSource.includes(current.after)) &&
    conversationSource.includes(current.parentTurn);
  const currentLifecycleApplied = count(conversationSource, current.after) === 1 &&
    count(conversationSource, current.parentAfter) === 1 &&
    count(conversationSource, `const MTKOutboundReceiptReact=${current.react};`) === 1 &&
    count(conversationSource, current.callDependencyAfter) === 1 &&
    count(conversationSource, current.callBodyAfter) === 1 &&
    count(conversationSource, current.callStorageAfter) === 1 &&
    count(conversationSource, "ReceiptLifecycle:MTKOutboundReceiptLifecycle,") === 1 &&
    count(conversationTurnSource, `${build9922.turn.register}(\`mtk-outbound-turn-receipts\``) === 1;
  const linuxConversation = linux != null;
  const linuxLifecycleApplied = linux != null && count(conversationSource, linux.after) === 1 &&
    count(conversationSource, linux.parentAfter) === 1 &&
    count(conversationSource, linux.callDependencyAfter) === 1 &&
    count(conversationSource, linux.callBodyAfter) === 1 &&
    count(conversationSource, linux.callStorageAfter) === 1 &&
    count(conversationSource, "ReceiptLifecycle:MTKOutboundReceiptLifecycle,") === 1;
  const sourceTurnApplied = currentConversation ? currentLifecycleApplied : linuxConversation ? linuxLifecycleApplied :
    conversationSource.includes("sourceTurnId:w");
  const conversationApplied = conversationMarkers.every(marker => combinedConversationSource.includes(marker)) &&
    sourceTurnApplied;
  const mainApplied = mainMarkers.every(marker => mainSource.includes(marker));
  const successProjectionApplied = successProjectionProfile(projectionSource).state === "applied";
  const conversationCacheStart = conversationSource.indexOf("const MTKoutboundReceiptContract=");
  const conversationCacheEnd = conversationSource.indexOf(conversationHelperBoundary(conversationSource), conversationCacheStart);
  const conversationCache = conversationCacheStart >= 0 && conversationCacheEnd > conversationCacheStart
    ? conversationSource.slice(conversationCacheStart, conversationCacheEnd) : "";
  const taskBucketConversationApplied = conversationCache.includes("function MTKOutboundTurnReceipts(") &&
    !conversationCache.includes("flatMap");
  const taskBucketMainApplied = mainSource.includes("MTKoutboundReceiptTaskBucketLimit=64") &&
    mainSource.includes("function MTKoutboundReceiptTaskDir(") && mainSource.includes("function MTKoutboundReceiptMigrateLegacy(");
  const anyApplied = source.includes("function MTKOutboundMessageReceipt(") ||
    source.includes('register?.("outgoingMessageReceipt"') ||
    combinedConversationSource.includes("const MTKoutboundReceiptContract=") ||
    mainSource.includes("const MTKoutboundReceiptContract=");
  if (count(source, green) === 1 && count(source, red) === 0 && ownerApplied && conversationApplied && mainApplied &&
      taskBucketConversationApplied && taskBucketMainApplied && successProjectionApplied &&
      source.includes(taskColorFunctions) && source.includes(taskColorStyle) &&
      (source.includes(currentRegistryCall) || !source.includes('register?.("outgoingMessageReceipt"'))) {
    return "applied";
  }
  if (count(source, red) === 1 && count(source, green) === 0 && !anyApplied) {
    inspectPristineConversation(conversationSource);
    inspectPristineMain(mainSource);
    return "needs-apply";
  }
  throw new Error(
    `Upstream changed: outgoing receipt seam red=${count(source, red)} green=${count(source, green)} ` +
      `owner=${ownerApplied} conversation=${conversationApplied} main=${mainApplied}`
  );
}

function patchSource(value) {
  const send = sendProfile(value);
  const imports = resolveTaskImports(value);
  const red = `{namespace:${send.namespace},render:${send.genericRender},renderAgentActivityIcon:${send.icon},tool:${send.sendTool}}`;
  const green = `{namespace:${send.namespace},persistentInCollapsedConversation:!0,render:MTKrenderOutboundMessage,renderAgentActivityIcon:${send.icon},standaloneInConversation:!0,tool:${send.sendTool}}`;
  const helper = buildHelper(send, imports.titleImport != null);

  let patched = replaceOnce(value, send.functionText, `${helper}${send.functionText}`, "outbound renderer helper");
  patched = replaceOnce(patched, red, green, "send-message registry entry");
  patched = replaceOnce(patched, imports.before, imports.after, "outbound task imports");
  if (imports.titleImport != null) {
    patched = addImportSpecifier(
      patched,
      imports.titleImport.relative,
      `${imports.titleImport.exported} as MTKoutboundTitleAtom`,
      "stock live-title selector import"
    );
  }
  patched = addImportSpecifier(patched, presentation.appRelative, `${presentation.tooltipExport} as MTKoutboundHover`, "stock hover import");
  patched = addImportSpecifier(patched, presentation.formatterRelative, `${presentation.formatterExport} as MTKoutboundFormattedText`, "stock message formatter import");
  patched = replaceOnce(patched, "export{", "export{MTKOutboundMessageReceipt as MTKoutboundReceipt,", "outbound receipt export");
  return patched;
}

function buildHelper(send, useDedicatedTitleSelector = false) {
  const title = useDedicatedTitleSelector
    ? 't.get(MTKoutboundTitleAtom,{hostId:n.hostId??"local",threadId:n.threadId})??('
    : "";
  const titleEnd = useDedicatedTitleSelector ? ")" : "";
  const helper = String.raw`
function MTKoutboundArguments(e){return e!=null&&typeof e==="object"&&!Array.isArray(e)&&typeof e.threadId==="string"&&e.threadId.length>0&&typeof e.prompt==="string"&&(e.hostId===void 0||typeof e.hostId==="string")?e:null}function MTKoutboundLabel(e){if(typeof e!=="string"||e.trim().length===0)return null;let t=e.trim(),n=t.indexOf(" — ");return n>0?t.slice(0,n).trim():t}function MTKoutboundPreview(e){let t=e.split(/\r?\n/).map(e=>e.trim()).find(e=>e.length>0)??"(empty message)";return t.length<=180?t:t.slice(0,179)+"…"}function MTKoutboundTaskColor(e,t){try{let n=globalThis.__MTK_PATCH_REGISTRY__;if(n?.apiVersion!==1)return null;let r=n.packages?.taskVisualPalette;if(r?.version!==1||typeof r.resolveTaskColor!=="function")return null;let i=r.resolveTaskColor({taskId:e,title:t});return typeof i==="string"&&/^#[0-9A-Fa-f]{6}$/.test(i)?i.toUpperCase():null}catch{return null}}function MTKoutboundNavigate(e){let t=${send.normalize}(e);${send.hostBridge}.dispatchHostMessage({type:"navigate-to-route",path:${send.routeFlag}()?${send.newRoute}(t):${send.oldRoute}(t)})}function MTKOutboundMessageReceipt({item:e}){let t=MTKoutboundStoreHook(MTKoutboundStoreScope),n=MTKoutboundArguments(e.arguments);if(n==null)return null;let r=n.hostId==null||n.hostId==="local"?MTKoutboundLocalThreadKey(n.threadId):MTKoutboundRemoteThreadKey(n.threadId),i=t.get(MTKoutboundTaskAtom,r),a=${title}i?.kind==="local"?(i.conversation?.title??i.catalogTitle??i.summary?.title):i?.kind==="remote"?i.task?.title:null${titleEnd},o=i?.kind==="local"?(i.conversation?.cwd??i.cwd??i.summary?.cwd):void 0,s=MTKoutboundLabel(a)??"Task "+n.threadId.slice(0,8)+"…",c=MTKoutboundTaskColor(n.threadId,a),l=c==null?void 0:{color:"color-mix(in srgb, "+c+" 68%, var(--color-text) 32%)"},u=e.completed?e.success===!1?"Failed to send to":"Sent to":"Sending to",d=MTKoutboundPreview(n.prompt),f=e=>{e.preventDefault(),e.stopPropagation(),MTKoutboundNavigate(n.threadId)},p=(0,${send.jsx}.jsxs)("div",{"data-mtk-outgoing-message-receipt":!0,className:"self-start flex min-w-0 items-center gap-1.5 rounded-lg border border-border/70 bg-surface-secondary/40 px-3 py-2 text-size-chat text-text-tertiary",style:{maxWidth:"min(42rem,92%)"},children:[(0,${send.jsx}.jsx)("span",{"aria-hidden":!0,className:"shrink-0",children:"↗"}),(0,${send.jsx}.jsx)("span",{className:"shrink-0",children:u}),(0,${send.jsx}.jsx)("button",{"aria-label":"Open "+(a??s),className:"min-w-0 shrink-0 rounded-sm font-medium text-text-secondary hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",onClick:f,style:l,type:"button",children:s}),(0,${send.jsx}.jsx)("span",{"aria-hidden":!0,className:"shrink-0",children:"·"}),(0,${send.jsx}.jsx)("span",{className:"min-w-0 flex-1 truncate text-text-tertiary/90",children:d})]});return(0,${send.jsx}.jsx)(MTKoutboundHover,{align:"start",closeOnTriggerBlur:!1,delayDuration:800,interactive:!0,side:"top",sideOffset:6,skipDelayKey:"outbound-message-preview",tooltipMaxWidth:"min(42rem, var(--radix-tooltip-content-available-width), calc(100vw - 16px))",variant:"rich",tooltipContent:(0,${send.jsx}.jsx)("div",{className:"min-w-0 text-start",style:{maxHeight:"min(420px, var(--radix-tooltip-content-available-height, 420px), calc(100vh - 16px))",overflowY:"auto",padding:"0.75rem",userSelect:"text"},children:(0,${send.jsx}.jsx)(MTKoutboundFormattedText,{cwd:o,externalLinkContextMenuConversationId:n.threadId,hostId:n.hostId??"local",text:n.prompt})}),children:p})}function MTKrenderOutboundMessage(e,t,n,r=!0,i){let a=MTKoutboundArguments(e.arguments);if(t==="row"&&a!=null){if(e.completed&&e.success===!0&&typeof e.callId==="string"&&e.callId.length>0&&i!=null&&typeof i.conversationId==="string"&&i.conversationId.length>0&&typeof i.turnId==="string"&&i.turnId.length>0&&typeof globalThis.__MTK_OUTBOUND_REMEMBER__==="function"){let t={callId:e.callId,contract:"outgoing-message-receipt-v1",prompt:a.prompt,recordedAtMs:Date.now(),sourceThreadId:i.conversationId,sourceTurnId:i.turnId,targetHostId:a.hostId??"local",targetThreadId:a.threadId};if(typeof i.ReceiptLifecycle==="function")return(0,${send.jsx}.jsx)(i.ReceiptLifecycle,{item:e,record:t});if(globalThis.__MTK_OUTBOUND_REMEMBER__(t)===!0)return null}return(0,${send.jsx}.jsx)(MTKOutboundMessageReceipt,{item:e})}return ${send.genericRender}(e,t,n,r)}
`;
  const withActions = helper
    .replace(
      "function MTKOutboundMessageReceipt({item:e})",
      "function MTKOutboundMessageReceipt({item:e,Actions:MTKactions})"
    )
    .replace(
      `;return(0,${send.jsx}.jsx)(MTKoutboundHover,{`,
      `;let h=(0,${send.jsx}.jsx)(MTKoutboundHover,{`
    )
    .replace(
      `children:p})}function MTKrenderOutboundMessage`,
      `children:p});return MTKactions==null?h:(0,${send.jsx}.jsxs)("div",{className:"group flex min-w-0 flex-col items-start",children:[h,(0,${send.jsx}.jsx)(MTKactions,{copyText:n.prompt,sentAtMs:e.recordedAtMs,timestampHoverOnly:!0})]})}function MTKrenderOutboundMessage`
    );
  const themed = withActions.replace(taskColorFunction, taskColorFunctions)
    .replace('l=c==null?void 0:{color:"color-mix(in srgb, "+c+" 68%, var(--color-text) 32%)"},u=', taskColorStyle);
  if (!themed.includes(taskColorFunctions) || !themed.includes(taskColorStyle)) {
    throw new Error("unrecognized outgoing receipt theme-color seam");
  }
  return themed;
}

function inspectPristineConversation(value, turnValue = conversationTurnSource) {
  const ownerImport = ownerImportProfile(value);
  if (ownerImport.specifiers.includes("MTKoutboundReceipt")) {
    throw new Error("Upstream changed: outgoing receipt import is unexpectedly present");
  }
  const dynamic = dynamicRendererProfile(value);
  if (dynamic.variant.startsWith("split-")) {
    splitTurnProfile(turnValue, dynamic.turn);
  } else {
    assistantProfile(value);
  }
}

function inspectPristineMain(value) {
  if (count(value, "case`electron-add-new-workspace-root-option`:") !== 1) {
    throw new Error("Upstream changed: outgoing receipt main message seam is not unique");
  }
  mainHelperOwner(value);
  uniqueMatch(value, new RegExp(`await (?<electron>${id})\\.app\\.whenReady\\(\\)`, "g"), "Electron app owner");
}

function patchConversation(value, turnValue) {
  const ownerImport = ownerImportProfile(value);
  const hostBus = resolveHostBus(value);
  const nativeActions = nativeActionsProfile(value);
  const dynamic = dynamicRendererProfile(value);
  let patched = replaceOnce(
    value,
    ownerImport.text,
    `import{${ownerImport.specifiers},MTKoutboundReceipt as MTKoutboundReceipt}from"${ownerImport.relative}";`,
    "outbound receipt component import"
  );
  patched = replaceOnce(patched, dynamic.functionText, dynamic.patchedFunction, "dynamic renderer context");
  patched = replaceOnce(
    patched,
    dynamic.callText,
    dynamic.patchedCallText,
    "outbound source turn context"
  );
  if (dynamic.variant.startsWith("split-")) {
    const turn = splitTurnProfile(turnValue, dynamic.turn);
    patched = replaceOnce(
      patched,
      "export{",
      "export{MTKOutboundTurnReceipts as MTKOutboundTurnReceipts,",
      "durable receipt component export"
    );
    let patchedTurn = replaceOnce(
      turnValue,
      turn.importText,
      `import{${turn.specifiers},MTKOutboundTurnReceipts as MTKOutboundTurnReceipts}from"${turn.relative}";`,
      "durable receipt component import"
    );
    patchedTurn = replaceOnce(patchedTurn, turn.before, turn.after, "durable outbound turn receipts");
    const insertion = patched.indexOf(dynamic.helperBoundary);
    if (insertion < 0) throw new Error("Upstream changed: split dynamic renderer owner is missing");
    patched = patched.slice(0, insertion) +
      `const MTKOutboundReceiptReact=${dynamic.react};` +
      conversationHelpers(hostBus, "MTKOutboundReceiptReact", dynamic.jsx, nativeActions) +
      patched.slice(insertion);
    return {conversationSource: patched, conversationTurnSource: patchedTurn};
  }
  const assistant = assistantProfile(value);
  patched = replaceOnce(
    patched,
    assistant.children,
    assistant.children.replace("children:[Ze,", "children:[(0,Yy.jsx)(MTKOutboundTurnReceipts,{conversationId:p,turnId:o}),Ze,"),
    "durable outbound turn receipts"
  );
  const insertion = patched.indexOf("function Oy(");
  if (insertion < 0) throw new Error("Upstream changed: assistant renderer owner is missing");
  patched = patched.slice(0, insertion) + conversationHelpers(hostBus, "Jy", "Yy", nativeActions) + patched.slice(insertion);
  return {conversationSource: patched, conversationTurnSource: patched};
}

function ownerImportProfile(value) {
  const relative = `./${path.basename(target)}`;
  const match = uniqueMatch(
    value,
    new RegExp(`import\\{(?<specifiers>[^}]+)\\}from"${escapeRegExp(relative)}";`, "g"),
    "outbound owner import"
  );
  return {text: match[0], specifiers: match.groups.specifiers, relative};
}

function dynamicRendererProfile(value) {
  const current9922 = build9922.dynamic;
  if (value.includes(current9922.before) && value.includes(current9922.call) &&
      value.includes(current9922.parentBefore)) {
    const start = value.indexOf(current9922.owner);
    const owner = functionAt(value, start);
    const patchedFunction = replaceOnce(
      owner.text,
      current9922.before,
      current9922.after,
      "build-9922 dynamic renderer context body"
    );
    const callIndex = value.indexOf(current9922.call);
    const parent = containingFunction(value, callIndex);
    if (!parent.text.startsWith(current9922.parentBefore) ||
        !parent.text.includes(current9922.parentTurn)) {
      throw new Error("Upstream changed: build-9922 source-turn owner is ambiguous");
    }
    let patchedParent = replaceOnce(
      parent.text,
      current9922.parentBefore,
      current9922.parentAfter,
      "build-9922 source-turn cache size"
    );
    patchedParent = replaceOnce(
      patchedParent,
      current9922.callDependencyBefore,
      current9922.callDependencyAfter,
      "build-9922 source-turn call dependency"
    );
    const patchedCall = current9922.call
      .replace(current9922.callBodyBefore, current9922.callBodyAfter)
      .replace(current9922.callStorageBefore, current9922.callStorageAfter);
    return {
      variant: "split-9922",
      functionText: owner.text,
      patchedFunction,
      callText: parent.text,
      patchedCallText: replaceOnce(
        patchedParent,
        current9922.call,
        patchedCall,
        "build-9922 source-turn call"
      ),
      helperBoundary: current9922.helperBoundary,
      react: current9922.react,
      jsx: current9922.jsx,
      turn: build9922.turn
    };
  }
  for (const [label, profile, build] of [
    ["Linux build-9771", linuxBuild9771.dynamic, linuxBuild9771],
    ["Linux build-9647", linuxBuild9647.dynamic, linuxBuild9647]
  ]) {
    if (!value.includes(profile.before) || !value.includes(profile.call) ||
        !value.includes(profile.parentBefore)) continue;
    const start = value.indexOf(profile.owner);
    const owner = functionAt(value, start);
    const patchedFunction = replaceOnce(
      owner.text,
      profile.before,
      profile.after,
      `${label} dynamic renderer context body`
    );
    const callIndex = value.indexOf(profile.call);
    const parent = containingFunction(value, callIndex);
    if (!parent.text.startsWith(profile.parentBefore) ||
        !parent.text.includes(profile.parentTurn)) {
      throw new Error(`Upstream changed: ${label} source-turn owner is ambiguous`);
    }
    let patchedParent = replaceOnce(
      parent.text,
      profile.parentBefore,
      profile.parentAfter,
      `${label} source-turn cache size`
    );
    patchedParent = replaceOnce(
      patchedParent,
      profile.callDependencyBefore,
      profile.callDependencyAfter,
      `${label} source-turn call dependency`
    );
    const patchedCall = profile.call
      .replace(profile.callBodyBefore, profile.callBodyAfter)
      .replace(profile.callStorageBefore, profile.callStorageAfter);
    return {
      variant: `split-${label.slice(-4)}-linux`,
      functionText: owner.text,
      patchedFunction,
      callText: parent.text,
      patchedCallText: replaceOnce(
        patchedParent,
        profile.call,
        patchedCall,
        `${label} source-turn call`
      ),
      helperBoundary: profile.helperBoundary,
      react: profile.react,
      jsx: profile.jsx,
      turn: build.turn
    };
  }
  if (value.includes("function QS(") && value.includes("bh(o)") && value.includes("e?.render?.(o,l,i,c)")) {
    const start = value.indexOf("function QS(");
    const owner = functionAt(value, start);
    const patchedFunction = replaceOnce(
      owner.text,
      "function QS(e){let t=(0,$S.c)(17),{conversationId:n,enableTimelineTargets:r,agentActivityIcon:i,isLeadingSummaryPart:a,item:o,variant:s}=e,c=a===void 0||a,l=s===void 0?`row`:s;if(Ra(`off`,n)===`stopped`)return null;let u,d;if(t[0]!==i||t[1]!==c||t[2]!==o||t[3]!==l){d=Symbol.for(`react.early_return_sentinel`);bb0:{let e=bh(o);if(e?.hiddenInConversation===!0){d=null;break bb0}u=e?.render?.(o,l,i,c)}t[0]=i,t[1]=c,t[2]=o,t[3]=l,t[4]=u,t[5]=d}else u=t[4],d=t[5]",
      "function QS(e){let t=(0,$S.c)(18),{conversationId:n,enableTimelineTargets:r,agentActivityIcon:i,isLeadingSummaryPart:a,item:o,variant:s,sourceTurnId:h}=e,c=a===void 0||a,l=s===void 0?`row`:s;if(Ra(`off`,n)===`stopped`)return null;let u,d;if(t[0]!==i||t[1]!==c||t[2]!==o||t[3]!==l||t[17]!==h){d=Symbol.for(`react.early_return_sentinel`);bb0:{let e=bh(o);if(e?.hiddenInConversation===!0){d=null;break bb0}u=e?.render?.(o,l,i,c,{conversationId:n,turnId:h})}t[0]=i,t[1]=c,t[2]=o,t[3]=l,t[17]=h,t[4]=u,t[5]=d}else u=t[4],d=t[5]",
      "build-9647 dynamic renderer context body"
    );
    const call = uniqueMatch(
      value,
      /\(e=\(0,\$\.jsx\)\(QS,\{agentActivityIcon:J,conversationId:f,enableTimelineTargets:Oe,item:n\}\),t\[375\]=J,t\[376\]=f,t\[377\]=Oe,t\[378\]=n,t\[379\]=e\)/g,
      "build-9647 conversation dynamic renderer call"
    );
    const parent = containingFunction(value, call.index);
    if (!parent.text.startsWith("function cO(e){let t=(0,wO.c)(392),") || !parent.text.includes("turnId:w,")) {
      throw new Error("Upstream changed: build-9647 source-turn owner is ambiguous");
    }
    const patchedParent = replaceOnce(
      parent.text,
      "function cO(e){let t=(0,wO.c)(392),",
      "function cO(e){let t=(0,wO.c)(393),",
      "build-9647 source-turn cache size"
    );
    const patchedCall = call[0]
      .replace("t[378]!==n?", "t[378]!==n||t[392]!==w?")
      .replace("enableTimelineTargets:Oe,item:n}", "enableTimelineTargets:Oe,item:n,sourceTurnId:w}")
      .replace("t[378]=n,t[379]=e", "t[378]=n,t[392]=w,t[379]=e");
    return {
      variant: "split-9647",
      functionText: owner.text,
      patchedFunction,
      callText: parent.text,
      patchedCallText: replaceOnce(patchedParent, call[0], patchedCall, "build-9647 source-turn call"),
      helperBoundary: "function QS(",
      react: "t(r(),1)",
      jsx: "$"
    };
  }
  throw new Error("Upstream changed: build-9647 dynamic renderer ownership is missing");
}

function splitTurnProfile(value, linux) {
  const relative = `./${path.basename(conversationTarget)}`;
  const imported = uniqueMatch(
    value,
    new RegExp(`import\\{(?<specifiers>[^}]+)\\}from"${escapeRegExp(relative)}";`, "g"),
    "split conversation renderer import"
  );
  if (linux != null && value.includes(linux.owner) && value.includes(linux.marker) && value.includes(linux.boundary)) {
    const before = linux.boundary;
    const jsx = linux.jsx ?? "Q";
    const register = linux.register ?? "$";
    return {
      importText: imported[0], specifiers: imported.groups.specifiers, relative,
      before,
      after: `${register}(\`mtk-outbound-turn-receipts\`,(0,${jsx}.jsx)(MTKOutboundTurnReceipts,{conversationId:${linux.conversationId},turnId:${linux.turnId}}),{canOwnLatestTurnFollowContent:!1});${before}`
    };
  }
  if (value.includes("function Z(e){let t=(0,Ba.c)(182),") && value.includes("conversationId:l") &&
      value.includes("turnId:_,") && value.includes("let to=Qa.length,no={")) {
    const before = "let to=Qa.length,no={";
    return {
      importText: imported[0], specifiers: imported.groups.specifiers, relative,
      before,
      after: '$(\`mtk-outbound-turn-receipts\`,(0,Q.jsx)(MTKOutboundTurnReceipts,{conversationId:l,turnId:_}),{canOwnLatestTurnFollowContent:!1});let to=Qa.length,no={'
    };
  }
  throw new Error("Upstream changed: build-9647 turn renderer ownership is missing");
}

function assistantProfile(value) {
  const start = value.indexOf("function Oy(");
  const owner = functionAt(value, start);
  const children = uniqueMatch(
    owner.text,
    /children:\[Ze,/g,
    "assistant message children"
  );
  return {children: children[0]};
}

function nativeActionsProfile(value) {
  const marker = uniqueMatch(value, /"data-assistant-message-sent-time":!0/g, "native assistant timestamp");
  const owner = containingFunction(value, marker.index);
  for (const expected of ["copyText:", "sentAtMs:", "timestampHoverOnly:", "Copy response"]) {
    if (!owner.text.includes(expected)) throw new Error(`Upstream changed: native assistant actions omit ${expected}`);
  }
  return uniqueMatch(owner.text, new RegExp(`^function (?<name>${id})\\(`, "g"), "native assistant action component").groups.name;
}

function conversationHelperBoundary(value) {
  if (value.includes("function Ey(")) return "function Ey(";
  if (value.includes("function QS(")) return "function QS(";
  throw new Error("Upstream changed: build-9647 outgoing receipt helper boundary is missing");
}

function resolveHostBus(value) {
  const busImports = [...value.matchAll(/import\{(?<specifiers>[^}]+)\}from"(?<relative>\.\/message-bus-[^"]+\.js)";/g)];
  if (busImports.length === 1) {
    const busSource = fs.readFileSync(path.resolve(path.dirname(conversationTarget), busImports[0].groups.relative), "utf8");
    const singleton = uniqueMatch(busSource, new RegExp(`,(?<internal>${id})=${id}\\.getInstance\\(\\),`, "g"), "message bus singleton").groups.internal;
    const exported = exportedAs(busSource, singleton);
    return uniqueMatch(
      busImports[0].groups.specifiers,
      new RegExp(`(?:^|,)${escapeRegExp(exported)} as (?<local>${id})(?=,|$)`, "g"),
      "conversation message bus import"
    ).groups.local;
  }
  const currentShared = [...value.matchAll(/import\{(?<specifiers>[^}]+)\}from"(?<relative>\.\/app-shared-[^"]+\.js)";/g)];
  if (currentShared.length === 1) {
    const source = fs.readFileSync(path.resolve(path.dirname(conversationTarget), currentShared[0].groups.relative), "utf8");
    const exportList = uniqueMatch(source, /export\{(?<specifiers>[^}]+)\}/g, "app-shared export list").groups.specifiers;
    const profiles = [build9922.hostBus, linuxBuild9771.hostBus];
    const buses = profiles.flatMap(profile => {
      const internal = [...exportList.matchAll(
        new RegExp(`(?:^|,)(?<internal>${id}) as ${escapeRegExp(profile.exported)}(?=,|$)`, "g")
      )];
      if (internal.length !== 1 || !source.includes(`${internal[0].groups.internal}=ce.getInstance()`) ||
          !source.includes("dispatchMessage(e,t)") || !source.includes("subscribe(e,t)")) return [];
      return [...currentShared[0].groups.specifiers.matchAll(
        new RegExp(`(?:^|,)${escapeRegExp(profile.exported)} as (?<local>${id})(?=,|$)`, "g")
      )].map(match => match.groups.local);
    });
    if (buses.length !== 1) throw new Error("Upstream changed: imported conversation host bus is not unique");
    return buses[0];
  }
  const imported = uniqueMatch(value, /import\{(?<specifiers>[^}]+)\}from"(?<relative>\.\/app-initial-[^"]+\.js)";/g, "conversation app-initial import");
  const appInitial = fs.readFileSync(path.resolve(path.dirname(conversationTarget), imported.groups.relative), "utf8");
  const exported = exportedAs(appInitial, "U");
  return uniqueMatch(
    imported.groups.specifiers,
    new RegExp(`(?:^|,)${escapeRegExp(exported)} as (?<local>${id})(?=,|$)`, "g"),
    "conversation host bus import"
  ).groups.local;
}

function baseConversationHelpers(hostBus, react = "Jy", jsx = "Yy") {
  return String.raw`const MTKoutboundReceiptContract="outgoing-message-receipt-v1",MTKoutboundReceiptLimit=256,MTKoutboundReceiptStates=new Map,MTKoutboundReceiptRequests=new Map;function MTKoutboundReceiptRecord(e){if(e==null||typeof e!=="object"||Array.isArray(e)||Object.keys(e).sort().join("\0")!=="callId\0contract\0prompt\0recordedAtMs\0sourceThreadId\0sourceTurnId\0targetHostId\0targetThreadId"||e.contract!==MTKoutboundReceiptContract||typeof e.callId!=="string"||e.callId.length===0||e.callId.length>256||typeof e.sourceThreadId!=="string"||e.sourceThreadId.length===0||typeof e.sourceTurnId!=="string"||e.sourceTurnId.length===0||typeof e.targetThreadId!=="string"||e.targetThreadId.length===0||typeof e.targetHostId!=="string"||e.targetHostId.length===0||typeof e.prompt!=="string"||!Number.isSafeInteger(e.recordedAtMs)||e.recordedAtMs<=0)return null;return e}function MTKoutboundReceiptState(e){let t=MTKoutboundReceiptStates.get(e);return t==null&&(t={loaded:!1,loading:!1,records:new Map,listeners:new Set},MTKoutboundReceiptStates.set(e,t)),t}function MTKoutboundReceiptValues(e){return[...e.records.values()].sort((e,t)=>e.recordedAtMs-t.recordedAtMs||e.callId.localeCompare(t.callId))}function MTKoutboundReceiptNotify(e){let t=MTKoutboundReceiptValues(e);for(let n of e.listeners)n(t)}function MTKoutboundRemember(e){if((e=MTKoutboundReceiptRecord(e))==null)return!1;let t=MTKoutboundReceiptState(e.sourceThreadId),n=t.records.get(e.callId);if(n!=null)return JSON.stringify(n)===JSON.stringify(e);t.records.set(e.callId,e);let r=MTKoutboundReceiptValues(t);for(let e of r.slice(0,Math.max(0,r.length-MTKoutboundReceiptLimit)))t.records.delete(e.callId);MTKoutboundReceiptNotify(t),${hostBus}.dispatchMessage("mtk-outbound-receipt-remember",{record:e});return!0}function MTKoutboundLoad(e){let t=MTKoutboundReceiptState(e);if(t.loaded||t.loading)return;t.loading=!0;let n=crypto.randomUUID();MTKoutboundReceiptRequests.set(n,e),${hostBus}.dispatchMessage("mtk-outbound-receipts-list",{requestId:n,sourceThreadId:e})}globalThis.__MTK_OUTBOUND_REMEMBER__=MTKoutboundRemember;${hostBus}.subscribe("mtk-outbound-receipts-result",e=>{if(typeof e?.requestId!=="string")return;let t=MTKoutboundReceiptRequests.get(e.requestId);if(t==null)return;MTKoutboundReceiptRequests.delete(e.requestId);let n=MTKoutboundReceiptState(t);n.loading=!1,n.loaded=!0;if(e.ok===!0&&Array.isArray(e.records))for(let r of e.records){r=MTKoutboundReceiptRecord(r);r!=null&&r.sourceThreadId===t&&!n.records.has(r.callId)&&n.records.set(r.callId,r)}MTKoutboundReceiptNotify(n)});function MTKOutboundTurnReceipts({conversationId:e,turnId:t}){let n=typeof e==="string"&&e.length>0&&typeof t==="string"&&t.length>0,r=n?MTKoutboundReceiptState(e):null,[i,a]=${react}.useState(()=>r==null?[]:MTKoutboundReceiptValues(r).filter(e=>e.sourceTurnId===t));return ${react}.useEffect(()=>{if(r==null)return;let n=e=>a(e.filter(e=>e.sourceTurnId===t));return r.listeners.add(n),MTKoutboundLoad(e),n(MTKoutboundReceiptValues(r)),()=>r.listeners.delete(n)},[e,t,r]),i.length===0?null:(0,${jsx}.jsx)("div",{"data-mtk-outgoing-message-receipts":!0,className:"mb-3 flex min-w-0 flex-col items-start gap-2",children:i.map(e=>(0,${jsx}.jsx)(MTKoutboundReceipt,{item:{arguments:{hostId:e.targetHostId,prompt:e.prompt,threadId:e.targetThreadId},completed:!0,success:!0}},e.callId))})}`;
}

function conversationHelpers(hostBus, react = "Jy", jsx = "Yy", actions) {
  if (!new RegExp(`^${id}$`).test(actions)) throw new Error("native assistant action component is missing");
  const base = baseConversationHelpers(hostBus, react, jsx);
  const current = base
    .replace(
      "MTKoutboundReceiptStates=new Map,MTKoutboundReceiptRequests=new Map;",
      "MTKoutboundReceiptStates=new Map,MTKoutboundReceiptRequests=new Map,MTKoutboundReceiptRememberRequests=new Map;"
    )
    .replace(
      `function MTKoutboundRemember(e){if((e=MTKoutboundReceiptRecord(e))==null)return!1;let t=MTKoutboundReceiptState(e.sourceThreadId),n=t.records.get(e.callId);if(n!=null)return JSON.stringify(n)===JSON.stringify(e);t.records.set(e.callId,e);let r=MTKoutboundReceiptValues(t);for(let e of r.slice(0,Math.max(0,r.length-MTKoutboundReceiptLimit)))t.records.delete(e.callId);MTKoutboundReceiptNotify(t),${hostBus}.dispatchMessage("mtk-outbound-receipt-remember",{record:e});return!0}`,
      `function MTKoutboundRemember(e){if((e=MTKoutboundReceiptRecord(e))==null)return!1;let t=MTKoutboundReceiptState(e.sourceThreadId),n=t.records.get(e.callId);if(n!=null)return JSON.stringify(n)===JSON.stringify(e);for(let t of MTKoutboundReceiptRememberRequests.values())if(t.sourceThreadId===e.sourceThreadId&&t.callId===e.callId)return!1;let r=crypto.randomUUID();return MTKoutboundReceiptRememberRequests.set(r,e),${hostBus}.dispatchMessage("mtk-outbound-receipt-remember",{requestId:r,record:e}),!1}`
    )
    .replace(
      `globalThis.__MTK_OUTBOUND_REMEMBER__=MTKoutboundRemember;${hostBus}.subscribe("mtk-outbound-receipts-result"`,
      `globalThis.__MTK_OUTBOUND_REMEMBER__=MTKoutboundRemember;${hostBus}.subscribe("mtk-outbound-receipt-remember-result",e=>{if(typeof e?.requestId!=="string")return;let t=MTKoutboundReceiptRememberRequests.get(e.requestId);if(t==null)return;MTKoutboundReceiptRememberRequests.delete(e.requestId);let n=MTKoutboundReceiptRecord(e.record);if(e.ok!==!0||n==null||JSON.stringify(n)!==JSON.stringify(t))return;let r=MTKoutboundReceiptState(t.sourceThreadId);r.records.set(n.callId,n);let i=MTKoutboundReceiptValues(r);for(let e of i.slice(0,Math.max(0,i.length-MTKoutboundReceiptLimit)))r.records.delete(e.callId);MTKoutboundReceiptNotify(r)});${hostBus}.subscribe("mtk-outbound-receipts-result"`
    );
  const withLifecycle = current.replace(
    "function MTKOutboundTurnReceipts(",
    `function MTKOutboundReceiptLifecycle({item:e,record:t}){let n=MTKoutboundReceiptState(t.sourceThreadId),r=MTKoutboundReceiptRecord(n.records.get(t.callId)),[i,a]=${react}.useState(0),o=r!=null;return ${react}.useEffect(()=>{let e=()=>a(e=>e+1);return n.listeners.add(e),()=>n.listeners.delete(e)},[n]),${react}.useEffect(()=>{o||MTKoutboundRemember(t)},[o,t.callId,t.sourceThreadId]),o?null:(0,${jsx}.jsx)(MTKoutboundReceipt,{Actions:${actions},item:{...e,recordedAtMs:t.recordedAtMs}})}function MTKOutboundTurnReceipts(`
  );
  const withActions = withLifecycle.replace(
    `MTKoutboundReceipt,{item:{arguments:{hostId:e.targetHostId,prompt:e.prompt,threadId:e.targetThreadId},completed:!0,success:!0}}`,
    `MTKoutboundReceipt,{Actions:${actions},item:{arguments:{hostId:e.targetHostId,prompt:e.prompt,threadId:e.targetThreadId},completed:!0,recordedAtMs:e.recordedAtMs,success:!0}}`
  );
  if (withLifecycle === current || withActions === withLifecycle ||
      !withActions.includes('subscribe("mtk-outbound-receipt-remember-result"') ||
      !withActions.includes("function MTKOutboundReceiptLifecycle(") ||
      !withActions.includes(`Actions:${actions}`)) {
    throw new Error("acknowledged outgoing receipt renderer helper construction failed");
  }
  return withActions;
}

function patchMain(value) {
  const electron = uniqueMatch(value, new RegExp(`await (?<electron>${id})\\.app\\.whenReady\\(\\)`, "g"), "Electron app owner").groups.electron;
  const helperOwner = mainHelperOwner(value)[0];
  let patched = replaceOnce(value, helperOwner, `${mainHelpers(electron)}${helperOwner}`, "outgoing receipt main helper owner");
  return replaceOnce(
    patched,
    "case`electron-add-new-workspace-root-option`:",
    `${currentMainHandlers()}case\`electron-add-new-workspace-root-option\`:`,
    "outgoing receipt main message handler"
  );
}

function mainHelperOwner(value) {
  return uniqueMatch(
    value,
    new RegExp("var (?<helper>" + id + ")=" + id + "\\.i\\(`electron-message-handler`\\)", "g"),
    "outgoing receipt main helper owner"
  );
}

function currentMainHandlers() {
  return "case`mtk-outbound-receipt-remember`:{let n=MTKoutboundReceiptRemember(t?.record);this.windowManager.sendMessageToWebContents(e,{type:`mtk-outbound-receipt-remember-result`,requestId:typeof t?.requestId===`string`?t.requestId:``,ok:n!=null,record:n});break}case`mtk-outbound-receipts-list`:{let n=MTKoutboundReceiptList(t?.sourceThreadId);this.windowManager.sendMessageToWebContents(e,{type:`mtk-outbound-receipts-result`,requestId:typeof t?.requestId===`string`?t.requestId:``,ok:n!=null,records:n??[]});break}";
}

function mainHelpers(electron) {
  return String.raw`
const MTKoutboundReceiptContract="outgoing-message-receipt-v1";
const MTKoutboundReceiptLimit=256;
const MTKoutboundReceiptMaxBytes=131072;
const MTKoutboundReceiptTaskMaxBytes=8388608;
const MTKoutboundReceiptTaskBucketLimit=64;
const MTKoutboundReceiptFs=require("node:fs");
const MTKoutboundReceiptPath=require("node:path");
const MTKoutboundReceiptCrypto=require("node:crypto");
let MTKoutboundReceiptDir=null;
let MTKoutboundReceiptMigrating=!1;
function MTKoutboundReceiptRecord(e){
  if(e==null||typeof e!=="object"||Array.isArray(e)||Object.keys(e).sort().join("\0")!=="callId\0contract\0prompt\0recordedAtMs\0sourceThreadId\0sourceTurnId\0targetHostId\0targetThreadId"||e.contract!==MTKoutboundReceiptContract||typeof e.callId!=="string"||e.callId.length===0||e.callId.length>256||typeof e.sourceThreadId!=="string"||e.sourceThreadId.length===0||typeof e.sourceTurnId!=="string"||e.sourceTurnId.length===0||typeof e.targetThreadId!=="string"||e.targetThreadId.length===0||typeof e.targetHostId!=="string"||e.targetHostId.length===0||typeof e.prompt!=="string"||!Number.isSafeInteger(e.recordedAtMs)||e.recordedAtMs<=0)return null;
  return e;
}
function MTKoutboundReceiptHash(e){return MTKoutboundReceiptCrypto.createHash("sha256").update(e).digest("hex")}
function MTKoutboundReceiptPrivate(e){return process.platform==="win32"||(e.mode&63)===0}
function MTKoutboundReceiptPrepare(){
  if(MTKoutboundReceiptDir!=null)return!0;
  try{
    let e=MTKoutboundReceiptPath.join(${electron}.app.getPath("userData"),"mechanics-toolkit","task-message-receipts");
    MTKoutboundReceiptFs.mkdirSync(e,{recursive:!0,mode:448});
    MTKoutboundReceiptFs.chmodSync(e,448);
    let t=MTKoutboundReceiptFs.lstatSync(e);
    if(!t.isDirectory()||!MTKoutboundReceiptPrivate(t))return!1;
    MTKoutboundReceiptDir=e;
    MTKoutboundReceiptMigrating=!0;
    MTKoutboundReceiptMigrateLegacy();
    MTKoutboundReceiptMigrating=!1;
    MTKoutboundReceiptPruneBuckets(null);
    return!0;
  }catch{
    MTKoutboundReceiptMigrating=!1;
    MTKoutboundReceiptDir=null;
    return!1;
  }
}
function MTKoutboundReceiptTaskDir(e,t){
  if(!MTKoutboundReceiptPrepare()||typeof e!=="string"||e.length===0)return null;
  let n=MTKoutboundReceiptPath.join(MTKoutboundReceiptDir,MTKoutboundReceiptHash(e)),r=!1,i;
  try{i=MTKoutboundReceiptFs.lstatSync(n)}catch(e){
    if(!t||e?.code!=="ENOENT")return null;
    try{MTKoutboundReceiptFs.mkdirSync(n,{mode:448}),r=!0,i=MTKoutboundReceiptFs.lstatSync(n)}catch{return null}
  }
  try{MTKoutboundReceiptFs.chmodSync(n,448),i=MTKoutboundReceiptFs.lstatSync(n)}catch{return null}
  if(!i.isDirectory()||!MTKoutboundReceiptPrivate(i))return null;
  if(r&&!MTKoutboundReceiptMigrating)MTKoutboundReceiptPruneBuckets(n);
  return n;
}
function MTKoutboundReceiptFile(e,t,n){
  let r=MTKoutboundReceiptTaskDir(e,n);
  return r==null||typeof t!=="string"?null:MTKoutboundReceiptPath.join(r,MTKoutboundReceiptHash(t)+".json");
}
function MTKoutboundReceiptReadFile(e){
  let t,n;
  try{
    t=MTKoutboundReceiptFs.lstatSync(e);
    if(!t.isFile()||!MTKoutboundReceiptPrivate(t)||t.size<2||t.size>MTKoutboundReceiptMaxBytes)return null;
    n=MTKoutboundReceiptFs.readFileSync(e,"utf8");
  }catch{return null}
  if(!n.endsWith("\n")||n.slice(0,-1).includes("\n")||n.includes("\r"))return null;
  let r;
  try{r=JSON.parse(n.slice(0,-1))}catch{return null}
  return MTKoutboundReceiptRecord(r);
}
function MTKoutboundReceiptEntries(e){
  let t=[];
  try{
    for(let n of MTKoutboundReceiptFs.readdirSync(e)){
      if(!/^[0-9a-f]{64}\.json$/.test(n))continue;
      let r=MTKoutboundReceiptPath.join(e,n),i=MTKoutboundReceiptFs.lstatSync(r);
      if(i.isFile())t.push({path:r,mtime:i.mtimeMs,size:i.size});
    }
  }catch{}
  return t;
}
function MTKoutboundReceiptPruneTask(e,t){
  let n=MTKoutboundReceiptEntries(e),r=n.reduce((e,t)=>e+t.size,0);
  n.sort((e,n)=>e.path===t?1:n.path===t?-1:e.mtime-n.mtime||e.path.localeCompare(n.path));
  while(n.length>MTKoutboundReceiptLimit||r>MTKoutboundReceiptTaskMaxBytes){
    let e=n.shift();
    if(e==null)break;
    try{MTKoutboundReceiptFs.unlinkSync(e.path),r-=e.size}catch{}
  }
}
function MTKoutboundReceiptRemoveBucket(e){
  let t;
  try{
    t=MTKoutboundReceiptFs.lstatSync(e);
    if(!t.isDirectory()||!MTKoutboundReceiptPrivate(t))return!1;
    let n=MTKoutboundReceiptFs.readdirSync(e);
    if(n.some(e=>!/^[0-9a-f]{64}\.json$/.test(e)))return!1;
    for(let t of n){let n=MTKoutboundReceiptPath.join(e,t),r=MTKoutboundReceiptFs.lstatSync(n);if(!r.isFile())return!1}
    for(let t of n)MTKoutboundReceiptFs.unlinkSync(MTKoutboundReceiptPath.join(e,t));
    MTKoutboundReceiptFs.rmdirSync(e);
    return!0;
  }catch{return!1}
}
function MTKoutboundReceiptPruneBuckets(e){
  if(MTKoutboundReceiptDir==null)return;
  let t=[];
  try{
    for(let n of MTKoutboundReceiptFs.readdirSync(MTKoutboundReceiptDir)){
      if(!/^[0-9a-f]{64}$/.test(n))continue;
      let r=MTKoutboundReceiptPath.join(MTKoutboundReceiptDir,n),i=MTKoutboundReceiptFs.lstatSync(r);
      i.isDirectory()&&MTKoutboundReceiptPrivate(i)&&t.push({path:r,mtime:i.mtimeMs});
    }
  }catch{return}
  t.sort((t,n)=>t.path===e?1:n.path===e?-1:t.mtime-n.mtime||t.path.localeCompare(n.path));
  while(t.length>MTKoutboundReceiptTaskBucketLimit){
    let e=t.shift();
    if(e==null)break;
    MTKoutboundReceiptRemoveBucket(e.path);
  }
}
function MTKoutboundReceiptMigrateLegacy(){
  if(MTKoutboundReceiptDir==null)return;
  let e=[];
  try{e=MTKoutboundReceiptFs.readdirSync(MTKoutboundReceiptDir)}catch{return}
  for(let t of e){
    if(!/^[0-9a-f]{64}\.json$/.test(t))continue;
    let n=MTKoutboundReceiptPath.join(MTKoutboundReceiptDir,t),r=MTKoutboundReceiptReadFile(n);
    if(r==null)continue;
    let i=MTKoutboundReceiptFile(r.sourceThreadId,r.callId,!0);
    if(i==null)continue;
    let a=MTKoutboundReceiptReadFile(i);
    try{
      if(a==null)MTKoutboundReceiptFs.renameSync(n,i);
      else MTKoutboundReceiptFs.unlinkSync(n);
      MTKoutboundReceiptPruneTask(MTKoutboundReceiptPath.dirname(i),i);
    }catch{}
  }
}
function MTKoutboundReceiptWrite(e){
  if((e=MTKoutboundReceiptRecord(e))==null)return null;
  let t=MTKoutboundReceiptFile(e.sourceThreadId,e.callId,!0);
  if(t==null)return null;
  let n=MTKoutboundReceiptReadFile(t);
  if(n!=null)return n;
  let r=JSON.stringify(e)+"\n";
  if(Buffer.byteLength(r,"utf8")>MTKoutboundReceiptMaxBytes)return null;
  let i=MTKoutboundReceiptPath.join(MTKoutboundReceiptPath.dirname(t),"."+process.pid+"."+MTKoutboundReceiptCrypto.randomUUID()+".tmp");
  try{
    MTKoutboundReceiptFs.writeFileSync(i,r,{encoding:"utf8",mode:384,flag:"wx"});
    MTKoutboundReceiptFs.renameSync(i,t);
    MTKoutboundReceiptPruneTask(MTKoutboundReceiptPath.dirname(t),t);
    return MTKoutboundReceiptReadFile(t);
  }catch{
    try{MTKoutboundReceiptFs.unlinkSync(i)}catch{}
    return null;
  }
}
function MTKoutboundReceiptRemember(e){return MTKoutboundReceiptWrite(e)}
function MTKoutboundReceiptList(e){
  if(typeof e!=="string"||e.length===0||!MTKoutboundReceiptPrepare())return null;
  let t=MTKoutboundReceiptTaskDir(e,!1);
  if(t==null)return[];
  let n=[];
  for(let r of MTKoutboundReceiptEntries(t)){let t=MTKoutboundReceiptReadFile(r.path);t?.sourceThreadId===e&&n.push(t)}
  return n.sort((e,t)=>e.recordedAtMs-t.recordedAtMs||e.callId.localeCompare(t.callId));
}
`;
}

function sendProfile(value) {
  const statusOwners = [...value.matchAll(
    /case (?<sendTool>[$A-Z_a-z][$\w]*):return e\.completed\?`threadsSendMessageCompleted`:`threadsSendMessageActive`/g
  )];
  const sendTool = statusOwners.length === 1
    ? statusOwners[0].groups.sendTool
    : importedToolConstant(value, "send_message_to_thread");
  const functionAt = value.indexOf('e.tool===`send_message_to_thread`');
  const owner = containingFunction(value, functionAt);
  const header = uniqueMatch(
    owner.text,
    new RegExp(`function (?<genericRender>${id})\\(${id},${id},${id},${id}=!0\\)\\{`, "g"),
    "generic app-control renderer"
  ).groups;
  const render = header.genericRender === "X" && owner.text.includes("let e=r(l);ae.dispatchHostMessage({type:`navigate-to-route`,path:Ee()?A(e):p(e)})")
    ? {jsx: "Z", normalize: "r", hostBridge: "ae", routeFlag: "Ee", newRoute: "A", oldRoute: "p"}
    : uniqueMatch(
      owner.text,
      new RegExp(`${id}=\\(0,(?<jsx>${id})\\.jsxs\\)[\\s\\S]*?let e=(?<normalize>${id})\\(${id}\\);(?<hostBridge>${id})\\.dispatchHostMessage\\(\\{type:\`navigate-to-route\`,path:(?<routeFlag>${id})\\(\\)\\?(?<newRoute>${id})\\(e\\):(?<oldRoute>${id})\\(e\\)\\}\\)`, "g"),
      "existing task navigation owner"
    ).groups;
  const registry = uniqueMatch(
    value,
    new RegExp(
      `\\{namespace:(?<namespace>[$A-Z_a-z][$\\w]*),(?:persistentInCollapsedConversation:!0,)?render:(?:${header.genericRender}|MTKrenderOutboundMessage),` +
        `renderAgentActivityIcon:(?<icon>[$A-Z_a-z][$\\w]*),(?:standaloneInConversation:!0,)?tool:${sendTool}\\}`,
      "g"
    ),
    "send-message registry entry"
  ).groups;
  return {sendTool, ...header, ...render, ...registry, functionText: owner.text};
}

function importedToolConstant(value, toolName) {
  const imports = [...value.matchAll(/import\{(?<specifiers>[^}]+)\}from"(?<relative>\.\/app-initial-[^"]+\.js)";/g)];
  if (imports.length !== 1) throw new Error("Upstream changed: app-initial tool import is not unique");
  const moduleSource = fs.readFileSync(path.resolve(path.dirname(target), imports[0].groups.relative), "utf8");
  const internal = uniqueMatch(
    moduleSource,
    new RegExp("(?<internal>" + id + ")=`" + escapeRegExp(toolName) + "`", "g"),
    `${toolName} constant`
  ).groups.internal;
  const exported = exportedAs(moduleSource, internal);
  return uniqueMatch(
    imports[0].groups.specifiers,
    new RegExp(`(?:^|,)${escapeRegExp(exported)} as (?<local>${id})(?=,|$)`, "g"),
    `${toolName} imported binding`
  ).groups.local;
}

function assertPersistentActivityContract(activitySource) {
  const persistentFunction = uniqueMatch(
    activitySource,
    new RegExp(`function (?<fn>${id})\\(e\\)\\{return ${id}\\(e\\)\\?\\.persistentInCollapsedConversation===!0\\}`, "g"),
    "collapsed-activity persistence classifier"
  ).groups.fn;
  const persistentExport = exportedAs(activitySource, persistentFunction);
  const ownerFiles = fs.readdirSync(assets).filter(name => {
    if (!name.endsWith(".js") || name === path.basename(target)) return false;
    const value = fs.readFileSync(path.join(assets, name), "utf8");
    return value.includes("persistentUnits") && value.includes("keepMcpAppEntriesPersistent") &&
      value.includes(`from\"./${path.basename(target)}\"`);
  });
  if (ownerFiles.length !== 1) {
    throw new Error(`Upstream changed: found ${ownerFiles.length} collapsed-activity owners`);
  }
  const owner = path.join(assets, ownerFiles[0]);
  const value = fs.readFileSync(owner, "utf8");
  const imported = uniqueMatch(
    value,
    new RegExp(
      `import\\{(?<specifiers>[^}]+)\\}from\"\\./${escapeRegExp(path.basename(target))}\";`,
      "g"
    ),
    "activity classifier import"
  ).groups.specifiers;
  const localClassifier = uniqueMatch(
    imported,
    new RegExp(`(?:^|,)${escapeRegExp(persistentExport)} as (?<local>${id})(?=,|$)`, "g"),
    "local persistence classifier"
  ).groups.local;
  if (!value.includes(`i.type===\`dynamic-tool-call\`&&${localClassifier}(i)`)) {
    throw new Error("Upstream changed: dynamic tools no longer consult the persistence classifier");
  }
  const build9647Contracts = [
    "let ee=H,te;",
    "se=ee.length===0?null:(0,yk.jsx)(BO,{...i,units:ee})",
    "let ce=se,le;",
    "children:[oe,de,fe,pe,ce,he]"
  ];
  if (build9922.persistentActivity.every(contract => value.includes(contract))) return owner;
  if (linuxBuild9771.persistentActivity.every(contract => value.includes(contract))) return owner;
  if (linuxBuild9647.persistentActivity.every(contract => value.includes(contract))) return owner;
  if (build9647Contracts.every(contract => value.includes(contract))) return owner;
  const persistentUnits = uniqueMatch(
    value,
    new RegExp(`(?<units>${id})=${id}!=null&&${id}\\.isCollapsed\\?${id}\\.persistentUnits:\\[\\]`, "g"),
    "collapsed persistent-unit projection"
  ).groups.units;
  const rendered = uniqueMatch(
    value,
    new RegExp(`(?<node>${id})=${escapeRegExp(persistentUnits)}\\.length===0\\?null:\\(0,${id}\\.jsx\\)\\(${id},\\{[\\s\\S]{0,300}?units:${escapeRegExp(persistentUnits)}\\}\\)`, "g"),
    "persistent-unit renderer"
  ).groups.node;
  if (![...value.matchAll(/children:\[(?<children>[^\]]{0,240})\]/g)].some(match =>
    match.groups.children.split(",").includes(rendered)
  )) {
    throw new Error("Upstream changed: persistent units are not returned outside the collapsed activity body");
  }
  return owner;
}

function resolveTaskImports(ownerSource) {
  const importMatch = uniqueMatch(
    ownerSource,
    /import\{(?<specifiers>[^}]+)\}from"(?<relative>\.\/app-initial-[^"]+\.js)";/g,
    "app-initial import"
  );
  const appInitialFile = path.resolve(path.dirname(target), importMatch.groups.relative);
  if (!appInitialFile.startsWith(path.resolve(root) + path.sep)) throw new Error("App import escaped extraction root");
  const appInitial = fs.readFileSync(appInitialFile, "utf8");
  const current9922 = build9922.taskImports;
  if (appInitial.includes(current9922.appRoot) && appInitial.includes(current9922.taskOwner) &&
      appInitial.includes("function xf(e){let t=(0,Kvt.useContext)(hvt(e)),")) {
    const additions = [
      `${exportedAs(appInitial, current9922.storeHook)} as MTKoutboundStoreHook`,
      `${exportedAs(appInitial, current9922.storeScope)} as MTKoutboundStoreScope`,
      `${exportedAs(appInitial, current9922.taskAtom)} as MTKoutboundTaskAtom`,
      `${exportedAs(appInitial, current9922.localThreadKey)} as MTKoutboundLocalThreadKey`,
      `${exportedAs(appInitial, current9922.remoteThreadKey)} as MTKoutboundRemoteThreadKey`
    ];
    return {
      before: importMatch[0],
      after: `import{${importMatch.groups.specifiers},${additions.join(",")}}from"${importMatch.groups.relative}";`,
      storeHook: "MTKoutboundStoreHook",
      storeScope: "MTKoutboundStoreScope"
    };
  }
  const linux9771 = linuxBuild9771.taskImports;
  if (appInitial.includes(linux9771.appRoot) && appInitial.includes(linux9771.taskOwner)) {
    const additions = [
      `${exportedAs(appInitial, linux9771.storeHook)} as MTKoutboundStoreHook`,
      `${exportedAs(appInitial, linux9771.storeScope)} as MTKoutboundStoreScope`,
      `${exportedAs(appInitial, linux9771.taskAtom)} as MTKoutboundTaskAtom`,
      `${exportedAs(appInitial, linux9771.localThreadKey)} as MTKoutboundLocalThreadKey`,
      `${exportedAs(appInitial, linux9771.remoteThreadKey)} as MTKoutboundRemoteThreadKey`
    ];
    return {
      before: importMatch[0],
      after: `import{${importMatch.groups.specifiers},${additions.join(",")}}from"${importMatch.groups.relative}";`,
      storeHook: "MTKoutboundStoreHook",
      storeScope: "MTKoutboundStoreScope"
    };
  }
  const linux9647 = linuxBuild9647.taskImports;
  if (appInitial.includes(linux9647.appRoot) && appInitial.includes(linux9647.taskOwner) &&
      appInitial.includes("function tm(e){let t=(0,pNt.useContext)(qp),")) {
    const titleImport = uniqueMatch(
      ownerSource,
      /import\{(?<specifiers>[^}]+)\}from"(?<relative>\.\/app-primary-[^"]+\.js)";/g,
      "app-primary import"
    );
    const appPrimaryFile = path.resolve(path.dirname(target), titleImport.groups.relative);
    if (!appPrimaryFile.startsWith(path.resolve(root) + path.sep)) {
      throw new Error("App import escaped extraction root");
    }
    const appPrimary = fs.readFileSync(appPrimaryFile, "utf8");
    if (!appPrimary.includes(linux9647.titleOwner) || !appPrimary.includes(linux9647.titleHelper)) {
      throw new Error("Upstream changed: Linux build-9647 live-title selector owner is not recognized");
    }
    const additions = [
      `${exportedAs(appInitial, linux9647.storeHook)} as MTKoutboundStoreHook`,
      `${exportedAs(appInitial, linux9647.storeScope)} as MTKoutboundStoreScope`,
      `${exportedAs(appInitial, linux9647.taskAtom)} as MTKoutboundTaskAtom`,
      `${exportedAs(appInitial, linux9647.localThreadKey)} as MTKoutboundLocalThreadKey`,
      `${exportedAs(appInitial, linux9647.remoteThreadKey)} as MTKoutboundRemoteThreadKey`
    ];
    return {
      before: importMatch[0],
      after: `import{${importMatch.groups.specifiers},${additions.join(",")}}from"${importMatch.groups.relative}";`,
      titleImport: {
        relative: titleImport.groups.relative,
        exported: exportedAs(appPrimary, linux9647.titleAtom)
      },
      storeHook: "MTKoutboundStoreHook",
      storeScope: "MTKoutboundStoreScope"
    };
  }
  if (appInitial.includes("function PYs(){") && appInitial.includes("AH=Hp(Q,")) {
    const additions = [
      `${exportedAs(appInitial, "nm")} as MTKoutboundStoreHook`,
      `${exportedAs(appInitial, "Q")} as MTKoutboundStoreScope`,
      `${exportedAs(appInitial, "AH")} as MTKoutboundTaskAtom`,
      `${exportedAs(appInitial, "jj")} as MTKoutboundLocalThreadKey`,
      `${exportedAs(appInitial, "Mj")} as MTKoutboundRemoteThreadKey`
    ];
    return {
      before: importMatch[0],
      after: `import{${importMatch.groups.specifiers},${additions.join(",")}}from"${importMatch.groups.relative}";`,
      storeHook: "MTKoutboundStoreHook",
      storeScope: "MTKoutboundStoreScope"
    };
  }
  const projectUse = uniqueMatch(
    appInitial,
    new RegExp(`projectId:${id}\\.get\\((?<project>${id}),(?<keyForHost>${id})\\(${id}\\.id,${id}\\.hostId\\)\\)\\?\\.projectId\\?\\?null`, "g"),
    "thread project selector ownership"
  ).groups;
  const keyFunction = uniqueMatch(
    appInitial,
    new RegExp(
      "function " + projectUse.keyForHost + "\\((?<thread>" + id + "),(?<host>" + id +
        ")\\)\\{return \\k<host>===`local`\\?(?<local>" + id + ")\\((?<normalize>" + id +
        ")\\(\\k<thread>\\)\\):(?<remote>" + id + ")\\(\\k<thread>\\)\\}",
      "g"
    ),
    "thread key ownership"
  ).groups;
  const task = uniqueMatch(
    appInitial,
    new RegExp(
      "(?<task>" + id + ")=" + id + "\\(" + id + ",\\((?<key>" + id + "),\\{get:(?<get>" + id +
        ")\\}\\)=>\\{let (?<parsed>" + id + ")=" + id + "\\(\\k<key>\\);switch\\(\\k<parsed>\\?\\.kind\\)" +
        "\\{case`local`:\\{let " + id + "=" + id + "\\(\\k<get>,\\k<parsed>\\.threadId\\);if\\(" + id +
        "!=null\\)return \\k<get>\\(" + id + "," + id + "\\.clientThreadId\\);[\\s\\S]{0,600}?" +
        "case`remote`:return \\k<get>\\(" + id + ",\\k<parsed>\\.taskId\\);case void 0:return null\\}\\}\\)",
      "g"
    ),
    "thread task selector ownership"
  ).groups.task;
  const scope = uniqueMatch(appInitial, new RegExp(`${task}=${id}\\((?<scope>${id}),`, "g"), "task selector scope").groups.scope;
  const storeOwner = uniqueMatch(
    appInitial,
    new RegExp(
      `function (?<hook>${id})\\(e\\)\\{let t=\\(0,${id}\\.useContext\\)\\(${id}\\),n=${id}\\(t,e\\),` +
        `r=${id}\\(n\\),i=\\(0,${id}\\.useRef\\)\\(null\\);`,
      "g"
    ),
    "renderer store hook ownership"
  ).groups.hook;
  const additions = [
    `${exportedAs(appInitial, storeOwner)} as MTKoutboundStoreHook`,
    `${exportedAs(appInitial, scope)} as MTKoutboundStoreScope`,
    `${exportedAs(appInitial, task)} as MTKoutboundTaskAtom`,
    `${exportedAs(appInitial, keyFunction.local)} as MTKoutboundLocalThreadKey`,
    `${exportedAs(appInitial, keyFunction.remote)} as MTKoutboundRemoteThreadKey`
  ];
  return {
    before: importMatch[0],
    after: `import{${importMatch.groups.specifiers},${additions.join(",")}}from"${importMatch.groups.relative}";`,
    storeHook: "MTKoutboundStoreHook",
    storeScope: "MTKoutboundStoreScope"
  };
}

function requiresDedicatedTitleSelector(ownerSource) {
  const importMatch = uniqueMatch(
    ownerSource,
    /import\{(?<specifiers>[^}]+)\}from"(?<relative>\.\/app-initial-[^"]+\.js)";/g,
    "app-initial import"
  );
  const appInitialFile = path.resolve(path.dirname(target), importMatch.groups.relative);
  if (!appInitialFile.startsWith(path.resolve(root) + path.sep)) throw new Error("App import escaped extraction root");
  const appInitial = fs.readFileSync(appInitialFile, "utf8");
  const linux9647 = linuxBuild9647.taskImports;
  return appInitial.includes(linux9647.appRoot) && appInitial.includes(linux9647.taskOwner) &&
    appInitial.includes("function tm(e){let t=(0,pNt.useContext)(qp),");
}

function resolvePresentationOwners(ownerSource) {
  const imports = [...ownerSource.matchAll(/import\{(?<specifiers>[^}]+)\}from"(?<relative>\.\/[^"]+\.js)";/g)];
  let hoverOwners = imports.map(appImport => {
    const file = path.resolve(path.dirname(target), appImport.groups.relative);
    if (!file.startsWith(path.resolve(root) + path.sep)) throw new Error("App import escaped extraction root");
    return { appImport, file, source: fs.readFileSync(file, "utf8") };
  }).filter(owner => owner.source.includes("skipDelayKey:`diff-preview`"));
  if (hoverOwners.length === 0) {
    hoverOwners = assetFiles().filter(file => fs.readFileSync(file, "utf8").includes("skipDelayKey:`diff-preview`")).map(file => ({
      appImport: { groups: { relative: `./${path.basename(file)}` } },
      file,
      source: fs.readFileSync(file, "utf8")
    }));
  }
  if (hoverOwners.length !== 1) throw new Error(`Upstream changed: found ${hoverOwners.length} imported native diff hover owners`);
  const { appImport, source: appInitial } = hoverOwners[0];
  const diffPreview = uniqueMatch(
    appInitial,
    new RegExp(
      `\\(0,${id}\\.jsx\\)\\((?<tooltip>${id}),\\{align:\`center\`,closeOnTriggerBlur:!1,` +
        `delayDuration:(?<delay>${id}),[\\s\\S]{0,900}?interactive:!0,[\\s\\S]{0,900}?` +
        `skipDelayKey:\`diff-preview\`,[\\s\\S]{0,1200}?variant:\`unstyled\``,
      "g"
    ),
    "native diff hover owner"
  ).groups;
  if (!appInitial.includes(`${diffPreview.delay}=800`)) {
    throw new Error("Upstream changed: native diff hover delay is no longer 800ms");
  }
  let tooltipRelative = appImport.groups.relative;
  let tooltipExport;
  const appExports = uniqueMatch(appInitial, /export\{(?<specifiers>[^}]+)\}/g, "module export list").groups.specifiers;
  const localTooltipExports = [...appExports.matchAll(new RegExp(`(?:^|,)${escapeRegExp(diffPreview.tooltip)} as (?<export>${id})(?=,|$)`, "g"))];
  if (localTooltipExports.length === 1) {
    tooltipExport = exportedAs(appInitial, diffPreview.tooltip);
  } else {
    const imports = [...appInitial.matchAll(/import\{(?<specifiers>[^}]+)\}from"(?<relative>[^"]+)";/g)];
    const matches = imports.map(match => {
      const binding = new RegExp(`(?:^|,)(?<export>${id}) as ${escapeRegExp(diffPreview.tooltip)}(?=,|$)`).exec(match.groups.specifiers);
      return binding == null ? null : { match, binding };
    }).filter(Boolean);
    if (matches.length !== 1) throw new Error(`Upstream changed: found ${matches.length} native hover import owners`);
    tooltipRelative = matches[0].match.groups.relative;
    tooltipExport = matches[0].binding.groups.export;
  }

  const formatterFiles = assetFiles().filter(file => {
    const value = fs.readFileSync(file, "utf8");
    return value.includes("pluginMentionPresentation") && value.includes("externalLinkContextMenuConversationId") &&
      value.includes("whitespace-pre-wrap") && value.includes("markdownClassName");
  });
  if (formatterFiles.length !== 1) {
    throw new Error(`Upstream changed: found ${formatterFiles.length} recipient message formatter owners`);
  }
  const formatterFile = formatterFiles[0];
  const formatterSource = fs.readFileSync(formatterFile, "utf8");
  const formatterInternal = uniqueMatch(
    formatterSource,
    new RegExp(
      `function (?<formatter>${id})\\(e\\)\\{let ${id}=\\(0,${id}\\.c\\)\\((?:20|23|24)\\),` +
        `\\{text:${id},ref:${id},className:${id},components:${id},(?:directives:${id},)?externalLinkContextMenuConversationId:${id},` +
        `markdownClassName:${id},cwd:${id},hostId:${id},pluginMentionPresentation:${id},variant:${id}\\}=e`,
      "g"
    ),
    "recipient user-message formatter"
  ).groups.formatter;
  const formatterExports = [...uniqueMatch(formatterSource, /export\{(?<specifiers>[^}]+)\}/g, "formatter export list")
    .groups.specifiers.matchAll(new RegExp(`(?:^|,)${escapeRegExp(formatterInternal)} as (?<export>${id})(?=,|$)`, "g"))]
    .map(match => match.groups.export);
  if (formatterExports.length === 0) throw new Error("Upstream changed: recipient formatter is not exported");
  const formatterBasename = path.basename(formatterFile);
  const consumers = assetFiles().filter(file => {
    if (file === formatterFile) return false;
    const value = fs.readFileSync(file, "utf8");
    return value.includes(`from"./${formatterBasename}"`) && value.includes("collapsedLineCount") &&
      value.includes("externalLinkContextMenuConversationId");
  });
  if (consumers.length !== 1) {
    throw new Error(`Upstream changed: found ${consumers.length} recipient user-message consumers`);
  }
  const consumerSource = fs.readFileSync(consumers[0], "utf8");
  const consumerImport = uniqueMatch(
    consumerSource,
    new RegExp(`import\\{(?<specifiers>[^}]+)\\}from"\\./${escapeRegExp(formatterBasename)}";`, "g"),
    "recipient formatter import"
  ).groups.specifiers;
  const formatterBinding = uniqueMatch(
    consumerImport,
    new RegExp(`(?:^|,)(?<export>${formatterExports.map(escapeRegExp).join("|")}) as (?<local>${id})(?=,|$)`, "g"),
    "recipient formatter local binding"
  ).groups;
  const formatterExport = formatterBinding.export;
  const formatterLocal = formatterBinding.local;
  uniqueMatch(
    consumerSource,
    new RegExp(
      `\\(0,${id}\\.jsx\\)\\(${escapeRegExp(formatterLocal)},\\{cwd:${id},` +
        `(?:directives:${id},)?externalLinkContextMenuConversationId:${id},hostId:${id},text:${id}(?:,variant:\`user-message\`)?\\}\\)`,
      "g"
    ),
    "recipient user-message formatter call"
  );
  return {
    appRelative: tooltipRelative,
    tooltipExport,
    formatterFile,
    formatterRelative: `./${formatterBasename}`,
    formatterExport
  };
}

function addImportSpecifier(value, relative, specifier, label) {
  if (value.includes(`,${specifier}}from"${relative}";`) || value.includes(`{${specifier}}from"${relative}";`)) return value;
  const pattern = new RegExp(`import\\{(?<specifiers>[^}]+)\\}from"${escapeRegExp(relative)}";`, "g");
  const matches = [...value.matchAll(pattern)];
  if (matches.length === 1) {
    return replaceOnce(value, matches[0][0], `import{${matches[0].groups.specifiers},${specifier}}from"${relative}";`, label);
  }
  if (matches.length !== 0) throw new Error(`Upstream changed: ${label} owner is ambiguous`);
  const appImport = uniqueMatch(value, /import\{[^}]+\}from"\.\/app-initial-[^"]+\.js";/g, "app-initial import insertion point");
  return replaceOnce(value, appImport[0], `${appImport[0]}import{${specifier}}from"${relative}";`, label);
}

function assetFiles() {
  if (!fs.existsSync(assets) || !fs.statSync(assets).isDirectory()) {
    throw new Error(`Missing extracted assets directory: ${assets}`);
  }
  return fs.readdirSync(assets).filter(name => name.endsWith(".js")).map(name => path.join(assets, name));
}

function uniqueOwner() {
  if (!fs.existsSync(assets) || !fs.statSync(assets).isDirectory()) {
    throw new Error(`Missing extracted assets directory: ${assets}`);
  }
  const matches = fs.readdirSync(assets).filter(name => {
    if (!name.endsWith(".js")) return false;
    const value = fs.readFileSync(path.join(assets, name), "utf8");
    return value.includes('e.tool===`send_message_to_thread`') &&
      (value.includes("localConversation.appControlToolCall.threadsSendMessage.active") ||
       value.includes("standaloneInConversation:!0") && value.includes("renderAgentActivityIcon:"));
  });
  if (matches.length !== 1) throw new Error(`Upstream changed: found ${matches.length} outbound-message owners`);
  return path.join(assets, matches[0]);
}

function uniqueProjectionOwner() {
  const matches = assetFiles().filter(file => {
    const value = fs.readFileSync(file, "utf8");
    return value.includes("type:`dynamic-tool-call`,callId:") &&
      value.includes("`create_thread`") && value.includes("`handoff_thread`") &&
      successProjectionProfile(value, {required: false}) != null;
  });
  if (matches.length !== 1) {
    throw new Error(`Upstream changed: found ${matches.length} dynamic-tool success projection owners`);
  }
  return matches[0];
}

function patchSuccessProjection(value) {
  const profile = successProjectionProfile(value);
  return profile.state === "applied"
    ? value
    : replaceOnce(value, profile.before, profile.after, "send-message success projection");
}

function successProjectionProfile(value, {required = true} = {}) {
  const matches = [...value.matchAll(new RegExp(
    `\\((?<raw>${id})\\.tool===\`create_thread\`\\|\\|\\k<raw>\\.tool===\`handoff_thread\`\\)&&` +
      `\\((?<item>${id})\\.contentItems=(?<content>${id}),\\k<item>\\.success=\\k<raw>\\.success\\)`,
    "g"
  ))];
  if (matches.length !== 1) {
    if (!required && matches.length === 0) return null;
    throw new Error(`Upstream changed: found ${matches.length} dynamic-tool success projections`);
  }
  const {raw, item} = matches[0].groups;
  const marker = `${raw}.tool===\`send_message_to_thread\`&&(${item}.success=${raw}.success),`;
  return {
    state: value.slice(Math.max(0, matches[0].index - marker.length), matches[0].index) === marker
      ? "applied" : "needs-apply",
    before: matches[0][0],
    after: marker + matches[0][0]
  };
}

function uniqueConversationOwner() {
  const matches = fs.readdirSync(assets).filter(name => {
    if (!name.endsWith(".js")) return false;
    const value = fs.readFileSync(path.join(assets, name), "utf8");
    const split = (value.includes("function Ow(") && value.includes("let e=Cp(o)") && value.includes("u=e?.render?.(o,l,i,c)")) ||
      (value.includes("function cO(") && value.includes("let e=bh(o)") && value.includes("u=e?.render?.(o,l,i,c)")) ||
      value.includes("function MTKOutboundTurnReceipts(");
    return split && value.includes("toolActivityTurnKey") &&
      value.includes(`from"./${path.basename(target)}"`);
  });
  if (matches.length !== 1) throw new Error(`Upstream changed: found ${matches.length} conversation renderer owners`);
  return path.join(assets, matches[0]);
}

function uniqueConversationTurnOwner(owner) {
  const basename = path.basename(owner);
  const matches = fs.readdirSync(assets).filter(name => {
    if (!name.endsWith(".js") || name === basename) return false;
    const value = fs.readFileSync(path.join(assets, name), "utf8");
    return (value.includes("function Uc(e){let t=(0,hl.c)(189),") || value.includes("function Z(e){let t=(0,")) &&
      (value.includes("let ea=Xi.length,ta={") || value.includes("let to=Qa.length,no={") ||
       value.includes("MTKOutboundTurnReceipts,{conversationId:l,turnId:")) &&
      value.includes(`from"./${basename}"`);
  });
  if (matches.length !== 1) throw new Error(`Upstream changed: found ${matches.length} conversation turn owners`);
  return path.join(assets, matches[0]);
}

function uniqueMainOwner() {
  const directory = path.join(root, ".vite/build");
  if (!fs.existsSync(directory) || !fs.statSync(directory).isDirectory()) {
    throw new Error(`Missing extracted main directory: ${directory}`);
  }
  const matches = fs.readdirSync(directory).filter(name => /^main-.*\.js$/.test(name));
  if (matches.length !== 1) throw new Error(`Upstream changed: found ${matches.length} main owners`);
  return path.join(directory, matches[0]);
}

function assertStockStyles() {
  const styles = fs.readdirSync(assets).filter(name => name.endsWith(".css"))
    .map(name => fs.readFileSync(path.join(assets, name), "utf8")).join("\n");
  for (const token of [
    "bg-surface-secondary\\/40",
    "border-border\\/70",
    "text-text-tertiary\\/90",
    "focus-visible\\:ring-ring"
  ]) {
    if (!styles.includes(token)) throw new Error(`Upstream changed: missing stock receipt style ${token}`);
  }
}

function containingFunction(value, position) {
  if (position < 0) throw new Error("send-message renderer seam is missing");
  let start = value.lastIndexOf("function ", position);
  while (start >= 0) {
    const candidate = functionAt(value, start);
    if (position < candidate.end) return candidate;
    start = value.lastIndexOf("function ", start - 1);
  }
  throw new Error("could not locate send-message renderer function");
}

function functionAt(value, start) {
  const open = value.indexOf("{", start);
  let quote = null, escaped = false, depth = 1;
  for (let index = open + 1; index < value.length; index += 1) {
    const character = value[index];
    if (quote != null) {
      if (escaped) escaped = false;
      else if (character === "\\") escaped = true;
      else if (character === quote) quote = null;
      continue;
    }
    if (character === "'" || character === '"' || character === "`") quote = character;
    else if (character === "{") depth += 1;
    else if (character === "}" && --depth === 0) return {start, end: index + 1, text: value.slice(start, index + 1)};
  }
  throw new Error("function did not terminate");
}

function exportedAs(value, internal) {
  const specifiers = uniqueMatch(value, /export\{(?<specifiers>[^}]+)\}/g, "module export list").groups.specifiers;
  return uniqueMatch(
    specifiers,
    new RegExp(`(?:^|,)${escapeRegExp(internal)} as (?<export>${id})(?=,|$)`, "g"),
    `export for ${internal}`
  ).groups.export;
}

function uniqueMatch(value, pattern, label) {
  const matches = [...value.matchAll(pattern)];
  if (matches.length !== 1) throw new Error(`Upstream changed: found ${matches.length} matches for ${label}`);
  return matches[0];
}

function replaceOnce(value, before, after, label) {
  const first = value.indexOf(before);
  if (first < 0 || value.indexOf(before, first + before.length) >= 0) {
    throw new Error(`Upstream changed: ${label} is not unique`);
  }
  return value.slice(0, first) + after + value.slice(first + before.length);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
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

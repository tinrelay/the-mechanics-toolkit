#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { build9922 } from "./profiles/build9922.mjs";
import { linuxBuild9647, linuxBuild9771 } from "./profiles/linux.mjs";

const command = process.argv[2];
const root = path.resolve(process.argv[3] ?? "");
if (!new Set(["check", "apply"]).has(command) || !process.argv[3]) {
  throw new Error("usage: reasoning-retention.mjs check|apply EXTRACTED_ASAR_ROOT");
}

const assets = path.join(root, "webview/assets");
const linuxProfiles = [linuxBuild9771, linuxBuild9647];
const turn = uniqueOwner(source =>
  source.includes("preventAutoCollapse:Ct||ir") ||
    linuxProfiles.some(profile => source.includes(profile.turn.owner)) ||
    source.includes(build9922.turn.owner) || source.includes("function MTKuseReasoningRetention("),
  "local reasoning-collapse owner"
);
const thread = uniqueOwner(source =>
  source.includes("Ve.current=le},[e,l,le,y,fe])") ||
    linuxProfiles.some(profile => source.includes(profile.thread.owner)) ||
    source.includes(build9922.thread.owner) || source.includes("function MTKuseReasoningThreadRetention("),
  "local thread auto-collapse owner"
);
const collapse = uniqueOwner(source =>
  source.includes("preventAutoCollapse:i,persistedCollapsed:a") &&
    source.includes("isCollapsed:!r&&(a??!i)"),
  "agent-activity collapse contract"
);

let state = inspectState();
if (command === "apply" && state === "needs-apply") {
  const policy = policyOwner();
  patchTurn(turn.file);
  patchThread(thread.file);
  syntaxCheck(policy.file);
  syntaxCheck(turn.file);
  syntaxCheck(thread.file);
  state = inspectState();
  if (state !== "applied") throw new Error("reasoning retention transform did not verify");
}

const policy = policyOwner(false);
process.stdout.write(`${JSON.stringify({
  state,
  policy: ".codex/agent-roster.json",
  targets: [policy?.file, turn.file, thread.file].filter(Boolean).map(file => path.relative(root, file))
}, null, 2)}\n`);

function inspectState() {
  const source = fs.readFileSync(turn.file, "utf8");
  const threadSource = fs.readFileSync(thread.file, "utf8");
  const turnMarkers = [
    source.includes("function MTKuseReasoningRetention("),
    source.includes("MTKreasoningRetained=MTKuseReasoningRetention(l)") ||
      source.includes("MTKreasoningRetained=MTKuseReasoningRetention(d)") ||
      source.includes("MTKreasoningRetained=MTKuseReasoningRetention(c)"),
    source.includes("preventAutoCollapse:Ct||ir||MTKreasoningRetained") ||
      linuxProfiles.some(profile => source.includes(profile.turn.appliedOwner)) ||
      source.includes(build9922.turn.appliedOwner)
  ];
  const threadMarkers = [
    threadSource.includes("function MTKuseReasoningThreadRetention("),
    threadSource.includes("MTKreasoningThreadRetained=MTKuseReasoningThreadRetention(e)"),
    threadSource.includes("if(!MTKreasoningThreadRetained)for(let t of i)gA(y,{conversationId:e,turnSearchKey:t},!0)") ||
      linuxProfiles.some(profile => threadSource.includes(profile.thread.appliedCollapse)) ||
      threadSource.includes(build9922.thread.appliedCollapse),
    threadSource.includes("[e,l,le,y,fe,MTKreasoningThreadRetained]") ||
      linuxProfiles.some(profile => threadSource.includes(profile.thread.appliedDependencies)) ||
      threadSource.includes(build9922.thread.appliedDependencies)
  ];
  const turnApplied = turnMarkers.every(Boolean);
  const threadApplied = threadMarkers.every(Boolean);
  if (turnMarkers.some(Boolean) && !turnApplied) throw new Error("Unrecognized reasoning retention patch: partial turn markers");
  if (threadMarkers.some(Boolean) && !threadApplied) throw new Error("Unrecognized reasoning retention patch: partial thread markers");
  if (turnApplied) {
    policyOwner();
    verifyCollapseContract();
    return threadApplied ? "applied" : "needs-apply";
  }
  if (threadApplied) throw new Error("Unrecognized reasoning retention patch: thread guard without turn retention");
  const turnCurrent = source.includes("function Z(e){let t=(0,Ba.c)(182),") &&
    (source.includes("preventAutoCollapse:Ct||ir") || source.includes(linuxBuild9647.turn.owner));
  const turn9922 = source.includes(build9922.turn.ownerFunction) && source.includes(build9922.turn.owner);
  const turnLinux = linuxProfiles.some(profile =>
    source.includes(profile.turn.ownerFunction) && source.includes(profile.turn.owner));
  const threadCurrent = threadSource.includes("function bM({conversationId:e,") &&
    (threadSource.includes("Ve.current=le},[e,l,le,y,fe])") || threadSource.includes(linuxBuild9647.thread.owner));
  const thread9922 = threadSource.includes(build9922.thread.ownerFunction) && threadSource.includes(build9922.thread.owner);
  const threadLinux = linuxProfiles.some(profile =>
    threadSource.includes(profile.thread.ownerFunction) && threadSource.includes(profile.thread.owner));
  if (!(turnCurrent && threadCurrent) && !(turn9922 && thread9922) && !(turnLinux && threadLinux)) {
    throw new Error("Upstream changed: missing qualified reasoning retention contract");
  }
  verifyCollapseContract();
  return "needs-apply";
}

function verifyCollapseContract() {
  const source = fs.readFileSync(collapse.file, "utf8");
  for (const contract of ["preventAutoCollapse:i,persistedCollapsed:a", "isCollapsed:!r&&(a??!i)"]) {
    if (!source.includes(contract)) throw new Error(`Upstream changed: missing agent-activity contract ${contract}`);
  }
  if (!source.includes("onToggle:e=>{let t=!K;if(M.current=e,d==null){A(t);return}d(t)}") &&
      !linuxProfiles.some(profile => source.includes(profile.activityToggle)) &&
      !source.includes(build9922.activityToggle)) {
    throw new Error("Upstream changed: missing agent-activity toggle contract");
  }
}

function policyOwner(required = true) {
  const owners = [];
  for (const name of fs.readdirSync(assets)) {
    if (!name.endsWith(".js")) continue;
    const file = path.join(assets, name);
    const source = fs.readFileSync(file, "utf8");
    if (source.includes("globalThis.__MTK_AGENT_ROSTER__=Object.freeze(")) owners.push({file, source});
  }
  if (!required && owners.length === 0) return null;
  if (owners.length !== 1) throw new Error(`Reasoning retention requires exactly one agent roster owner; found ${owners.length}`);
  return owners[0];
}

function reasoningHook(react) {
  return `const MTKreasoningNoopSubscribe=()=>()=>{};function MTKreasoningRosterValue(e){let t=globalThis.__MTK_AGENT_ROSTER__,n=t?.match?.(null,e)?.data.keepReasoningOpen;if(n===void 0)return!1;if(typeof n!=="boolean")return t?.diagnose("invalid-keep-reasoning-open",{taskId:e}),!1;return n}function MTKuseReasoningRetention(e){let t=globalThis.__MTK_AGENT_ROSTER__?.subscribe??MTKreasoningNoopSubscribe;return ${react}.useSyncExternalStore(t,()=>MTKreasoningRosterValue(e),()=>!1)}`;
}

function reasoningThreadHook(react) {
  return `const MTKreasoningThreadNoopSubscribe=()=>()=>{};function MTKreasoningThreadRosterValue(e){let t=globalThis.__MTK_AGENT_ROSTER__,n=t?.match?.(null,e)?.data.keepReasoningOpen;if(n===void 0)return!1;if(typeof n!=="boolean")return t?.diagnose("invalid-keep-reasoning-open",{taskId:e}),!1;return n}function MTKuseReasoningThreadRetention(e){let t=globalThis.__MTK_AGENT_ROSTER__?.subscribe??MTKreasoningThreadNoopSubscribe;return ${react}.useSyncExternalStore(t,()=>MTKreasoningThreadRosterValue(e),()=>!1)}`;
}

function patchTurn(file) {
  let source = fs.readFileSync(file, "utf8");
  if (source.includes("function MTKuseReasoningRetention(")) return;
  const linux = linuxProfiles.find(candidate => source.includes(candidate.turn.owner));
  const current9922 = source.includes(build9922.turn.owner);
  const profile = current9922 ? build9922.turn : linux?.turn ?? null;
  const ownerFunction = profile?.ownerFunction ?? "function Z(e){let t=(0,Ba.c)(182),";
  const helper = reasoningHook(profile?.react ?? "Ha");
  source = replaceOnce(source, ownerFunction, `${helper}${ownerFunction}`, "reasoning turn hook");
  source = replaceOnce(source, ...(profile
    ? [profile.decisionBefore, profile.decisionAfter]
    : linux
    ? [linux.turn.decisionBefore, linux.turn.decisionAfter]
    : ["let R=xt,Ct=I(Ir,R)", "let R=xt,MTKreasoningRetained=MTKuseReasoningRetention(l),Ct=I(Ir,R)"]), "build-9647 reasoning task decision");
  source = replaceOnce(source, ...(profile
    ? [profile.owner, profile.appliedOwner]
    : ["preventAutoCollapse:Ct||ir", "preventAutoCollapse:Ct||ir||MTKreasoningRetained"]), "build-9647 reasoning auto-collapse gate");
  fs.writeFileSync(file, source);
}

function patchThread(file) {
  let source = fs.readFileSync(file, "utf8");
  if (source.includes("function MTKuseReasoningThreadRetention(")) return;
  const linux = linuxProfiles.find(candidate => source.includes(candidate.thread.owner));
  const current9922 = source.includes(build9922.thread.owner);
  const profile = current9922 ? build9922.thread : linux?.thread ?? null;
  const ownerFunction = profile?.ownerFunction ?? "function bM({conversationId:e,";
  const helper = reasoningThreadHook(profile?.react ?? "wM");
  source = replaceOnce(source, ownerFunction, `${helper}${ownerFunction}`, "reasoning thread hook");
  source = replaceOnce(source, ...(profile
    ? [profile.decisionBefore, profile.decisionAfter]
    : ["usesUnifiedTimeline:v}){let y=_s(qn)", "usesUnifiedTimeline:v}){let MTKreasoningThreadRetained=MTKuseReasoningThreadRetention(e),y=_s(qn)"]), "build-9647 reasoning thread decision");
  source = replaceOnce(source, ...(profile
    ? [profile.collapseBefore, profile.collapseAfter]
    : ["for(let t of i)gA(y,{conversationId:e,turnSearchKey:t},!0);Ve.current=le},[e,l,le,y,fe])", "if(!MTKreasoningThreadRetained)for(let t of i)gA(y,{conversationId:e,turnSearchKey:t},!0);Ve.current=le},[e,l,le,y,fe,MTKreasoningThreadRetained])"]), "build-9647 next-turn auto-collapse gate");
  fs.writeFileSync(file, source);
}

function uniqueOwner(predicate, label) {
  if (!fs.existsSync(assets) || !fs.statSync(assets).isDirectory()) {
    throw new Error(`Missing extracted assets directory: ${assets}`);
  }
  const owners = [];
  for (const name of fs.readdirSync(assets)) {
    if (!name.endsWith(".js")) continue;
    const file = path.join(assets, name);
    const source = fs.readFileSync(file, "utf8");
    if (predicate(source)) owners.push({file, source});
  }
  if (owners.length !== 1) throw new Error(`Upstream changed: found ${owners.length} ${label}s`);
  return owners[0];
}

function replaceOnce(source, before, after, label) {
  const first = source.indexOf(before);
  if (first < 0) throw new Error(`missing ${label}`);
  if (source.indexOf(before, first + before.length) >= 0) throw new Error(`ambiguous ${label}`);
  return source.slice(0, first) + after + source.slice(first + before.length);
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

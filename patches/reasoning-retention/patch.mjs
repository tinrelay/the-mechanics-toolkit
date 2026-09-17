#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { linuxBuild9647 } from "./profiles/linux.mjs";

const command = process.argv[2];
const root = path.resolve(process.argv[3] ?? "");
if (!new Set(["check", "apply"]).has(command) || !process.argv[3]) {
  throw new Error("usage: reasoning-retention.mjs check|apply EXTRACTED_ASAR_ROOT");
}

const assets = path.join(root, "webview/assets");
const turn = uniqueOwner(source =>
  source.includes("preventAutoCollapse:Ct||ir") || source.includes(linuxBuild9647.turn.owner) || source.includes("function MTKuseReasoningRetention("),
  "local reasoning-collapse owner"
);
const thread = uniqueOwner(source =>
  source.includes("Ve.current=le},[e,l,le,y,fe])") || source.includes(linuxBuild9647.thread.owner) || source.includes("function MTKuseReasoningThreadRetention("),
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
    source.includes("MTKreasoningRetained=MTKuseReasoningRetention(l)"),
    source.includes("preventAutoCollapse:Ct||ir||MTKreasoningRetained") || source.includes(linuxBuild9647.turn.appliedOwner)
  ];
  const threadMarkers = [
    threadSource.includes("function MTKuseReasoningThreadRetention("),
    threadSource.includes("MTKreasoningThreadRetained=MTKuseReasoningThreadRetention(e)"),
    threadSource.includes("if(!MTKreasoningThreadRetained)for(let t of i)gA(y,{conversationId:e,turnSearchKey:t},!0)") || threadSource.includes(linuxBuild9647.thread.appliedCollapse),
    threadSource.includes("[e,l,le,y,fe,MTKreasoningThreadRetained]") || threadSource.includes(linuxBuild9647.thread.appliedDependencies)
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
  const threadCurrent = threadSource.includes("function bM({conversationId:e,") &&
    (threadSource.includes("Ve.current=le},[e,l,le,y,fe])") || threadSource.includes(linuxBuild9647.thread.owner));
  if (!turnCurrent || !threadCurrent) throw new Error("Upstream changed: missing build-9647 reasoning retention contract");
  verifyCollapseContract();
  return "needs-apply";
}

function verifyCollapseContract() {
  const source = fs.readFileSync(collapse.file, "utf8");
  for (const contract of ["preventAutoCollapse:i,persistedCollapsed:a", "isCollapsed:!r&&(a??!i)"]) {
    if (!source.includes(contract)) throw new Error(`Upstream changed: missing agent-activity contract ${contract}`);
  }
  if (!source.includes("onToggle:e=>{let t=!K;if(M.current=e,d==null){A(t);return}d(t)}") &&
      !source.includes(linuxBuild9647.activityToggle)) {
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
  const linux = source.includes(linuxBuild9647.turn.owner);
  const helper = reasoningHook(linux ? linuxBuild9647.turn.react : "Ha");
  source = replaceOnce(source, "function Z(e){let t=(0,Ba.c)(182),", `${helper}function Z(e){let t=(0,Ba.c)(182),`, "build-9647 reasoning turn hook");
  source = replaceOnce(source, ...(linux
    ? [linuxBuild9647.turn.decisionBefore, linuxBuild9647.turn.decisionAfter]
    : ["let R=xt,Ct=I(Ir,R)", "let R=xt,MTKreasoningRetained=MTKuseReasoningRetention(l),Ct=I(Ir,R)"]), "build-9647 reasoning task decision");
  source = replaceOnce(source, ...(linux
    ? [linuxBuild9647.turn.owner, linuxBuild9647.turn.appliedOwner]
    : ["preventAutoCollapse:Ct||ir", "preventAutoCollapse:Ct||ir||MTKreasoningRetained"]), "build-9647 reasoning auto-collapse gate");
  fs.writeFileSync(file, source);
}

function patchThread(file) {
  let source = fs.readFileSync(file, "utf8");
  if (source.includes("function MTKuseReasoningThreadRetention(")) return;
  const linux = source.includes(linuxBuild9647.thread.owner);
  const helper = reasoningThreadHook(linux ? linuxBuild9647.thread.react : "wM");
  source = replaceOnce(source, "function bM({conversationId:e,", `${helper}function bM({conversationId:e,`, "build-9647 reasoning thread hook");
  source = replaceOnce(source, ...(linux
    ? [linuxBuild9647.thread.decisionBefore, linuxBuild9647.thread.decisionAfter]
    : ["usesUnifiedTimeline:v}){let y=_s(qn)", "usesUnifiedTimeline:v}){let MTKreasoningThreadRetained=MTKuseReasoningThreadRetention(e),y=_s(qn)"]), "build-9647 reasoning thread decision");
  source = replaceOnce(source, ...(linux
    ? [linuxBuild9647.thread.collapseBefore, linuxBuild9647.thread.collapseAfter]
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

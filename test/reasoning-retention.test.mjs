#!/usr/bin/env node
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { build9922 } from "../patches/reasoning-retention/profiles/build9922.mjs";
import { build10789 } from "../patches/reasoning-retention/profiles/build10789.mjs";
import { linuxBuild9771 } from "../patches/reasoning-retention/profiles/linux.mjs";

const extracted = path.resolve(process.argv[2] ?? "");
if (!process.argv[2]) throw new Error("usage: reasoning-retention.test.mjs EXTRACTED_ASAR_ROOT");
const assets = path.join(extracted, "webview/assets");

const turn = uniqueSource(source => source.includes("function MTKuseReasoningRetention("), "reasoning turn owner");
const thread = uniqueSource(source => source.includes("function MTKuseReasoningThreadRetention("), "reasoning thread owner");
const activity = uniqueSource(source => source.includes("isCollapsed:!r&&(a??!i)"), "stock collapse owner");
const rosterPolicy = turn.source.includes("function MTKreasoningRosterValue(");
assert.equal(rosterPolicy, true, "build-9771 reasoning retention uses the shared agent roster");
const policyOwner = turn;

const decisionName = "MTKreasoningRosterValue";
const decisionText = functionAt(policyOwner.source, policyOwner.source.indexOf(`function ${decisionName}(`));
const kept = "22222222-2222-4222-8222-222222222222";
const ordinary = "33333333-3333-4333-8333-333333333333";
const policy = {rules: [
  {taskId: kept, keepReasoningOpen: true},
  {taskId: ordinary, keepReasoningOpen: false}
]};
let subscribed = false;
const diagnostics = [];
const roster = {
  match(_title, taskId) {
    const rule = policy.rules.find(candidate => candidate.taskId === taskId);
    return rule == null ? null : {data: rule};
  },
  subscribe(listener) {
    subscribed = typeof listener === "function";
    return () => {};
  },
  diagnose(code, detail) { diagnostics.push({code, detail}); }
};
const realm = {__MTK_AGENT_ROSTER__: roster};
const decision = Function("globalThis", `${decisionText};return ${decisionName}`)(realm);
assert.equal(decision(kept, policy), true, "an exact opted-in task retains reasoning");
assert.equal(decision(ordinary, policy), false, "an ordinary task keeps stock behavior");
assert.equal(decision("Engine Tender — Repairs", policy), false, "a title cannot opt a task into retention");

const helperStart = turn.source.indexOf("const MTKreasoningNoopSubscribe=");
const helperOwner = turn.source.indexOf("function MTKuseReasoningRetention(", helperStart);
const helperEnd = turn.source.indexOf("function ", helperOwner + "function MTKuseReasoningRetention(".length);
assert.ok(helperStart >= 0 && helperEnd > helperStart, "turn hook helper seam");
const hookText = turn.source.slice(helperStart, helperEnd);
const Ui = {
  useSyncExternalStore(subscribe, snapshot) {
    subscribe(() => {});
    return snapshot();
  }
};
const hookReact = hookText.match(/return ([A-Za-z_$][\w$]*)(\(\))?\.useSyncExternalStore\(/);
assert.ok(hookReact, "turn hook names its React owner");
if (turn.source.includes(build10789.turn.ownerFunction)) {
  assert.equal(hookReact[1], "de", "build-10789 uses the stock React provider");
  assert.equal(hookReact[2], "()");
  assert.ok(turn.source.includes("Ao=de()") && turn.source.includes("(0,Ao.useState)"),
    "the same owner uses that provider for stock React hooks");
}
const hook = Function(hookReact[1], "globalThis", `${hookText};return MTKuseReasoningRetention`)(
  hookReact[2] ? () => Ui : Ui, realm);
assert.equal(hook(kept), true);
assert.equal(hook(ordinary), false);
assert.equal(subscribed, true, "the turn rerenders when the roster changes");
policy.rules[0].keepReasoningOpen = "yes";
assert.equal(hook(kept), false, "an invalid roster extension value keeps stock collapse behavior");
assert.equal(diagnostics.at(-1)?.code, "invalid-keep-reasoning-open");
policy.rules[0].keepReasoningOpen = true;
assert.ok(thread.source.includes("function MTKreasoningThreadRosterValue("),
  "thread transitions validate the same roster extension boundary");

assert.equal(
  /if\(!MTKreasoningThreadRetained\)for\(let t of i\)[A-Za-z_$][\w$]*\([A-Za-z_$][\w$]*,\{conversationId:e,turnSearchKey:t\},!0\)/.test(thread.source) ||
    thread.source.includes(linuxBuild9771.thread.appliedCollapse) ||
    thread.source.includes(build9922.thread.appliedCollapse) ||
    thread.source.includes(build10789.thread.appliedCollapse),
  true,
  "the next-turn transition does not persist an automatic collapse for an opted-in task"
);
assert.ok(
  /(?:\[e,[A-Za-z_$][\w$]*,G,[A-Za-z_$][\w$]*,[A-Za-z_$][\w$]*|\[e,u,ue,x,pe|\[e,l,ce,x,q|\[e,l,le,y,fe),MTKreasoningThreadRetained\]/.test(thread.source) ||
    thread.source.includes(linuxBuild9771.thread.appliedDependencies) ||
    thread.source.includes(build9922.thread.appliedDependencies) ||
    thread.source.includes(build10789.thread.appliedDependencies),
  "the auto-collapse effect follows live retention-policy changes"
);

const collapseText = functionAt(activity.source, containingFunctionStart(activity.source, activity.source.indexOf("isCollapsed:!r&&(a??!i)")));
const collapse = Function(`${collapseText};return ${functionName(collapseText)}`)();
const base = {hasFinalAssistantStarted: true, isTurnCancelled: false, hasRenderableAgentItems: true};
assert.deepEqual(collapse({...base, preventAutoCollapse: true}), {shouldAllowCollapse: true, isCollapsed: false});
assert.deepEqual(collapse({...base, preventAutoCollapse: false}), {shouldAllowCollapse: true, isCollapsed: true});
assert.deepEqual(collapse({...base, preventAutoCollapse: true, persistedCollapsed: true}), {shouldAllowCollapse: true, isCollapsed: true}, "manual collapse still wins");
assert.deepEqual(collapse({...base, preventAutoCollapse: true, persistedCollapsed: false}), {shouldAllowCollapse: true, isCollapsed: false}, "manual reopen still wins");
assert.equal(
    turn.source.includes("preventAutoCollapse:Ct||ir||MTKreasoningRetained") ||
    turn.source.includes(linuxBuild9771.turn.appliedOwner) ||
    turn.source.includes(build9922.turn.appliedOwner) ||
    turn.source.includes(build10789.turn.appliedOwner),
  true,
  "selected policy reaches the stock collapse decision"
);

process.stdout.write("reasoning retention behavioral probe passed\n");

function uniqueSource(predicate, label) {
  const found = [];
  for (const name of fs.readdirSync(assets)) {
    if (!name.endsWith(".js")) continue;
    const file = path.join(assets, name);
    const source = fs.readFileSync(file, "utf8");
    if (predicate(source)) found.push({file, source});
  }
  if (found.length !== 1) throw new Error(`expected one ${label}, found ${found.length}`);
  return found[0];
}

function containingFunctionStart(source, position) {
  let start = source.lastIndexOf("function ", position);
  while (start >= 0) {
    const text = functionAt(source, start);
    if (position < start + text.length) return start;
    start = source.lastIndexOf("function ", start - 1);
  }
  throw new Error("function owner not found");
}

function functionAt(source, start) {
  if (start < 0 || !source.startsWith("function ", start)) throw new Error("function start missing");
  const open = functionBodyOpen(source, start);
  let quote = null;
  let escaped = false;
  let depth = 1;
  for (let index = open + 1; index < source.length; index += 1) {
    const char = source[index];
    if (quote != null) {
      if (escaped) escaped = false;
      else if (char === "\\") escaped = true;
      else if (char === quote) quote = null;
      continue;
    }
    if (char === '"' || char === "'" || char === "`") quote = char;
    else if (char === "{") depth += 1;
    else if (char === "}" && --depth === 0) return source.slice(start, index + 1);
  }
  throw new Error("unterminated function");
}

function functionBodyOpen(source, start) {
  const parameters = source.indexOf("(", start);
  let quote = null;
  let escaped = false;
  let depth = 0;
  for (let index = parameters; index < source.length; index += 1) {
    const char = source[index];
    if (quote != null) {
      if (escaped) escaped = false;
      else if (char === "\\") escaped = true;
      else if (char === quote) quote = null;
      continue;
    }
    if (char === '"' || char === "'" || char === "`") quote = char;
    else if (char === "(") depth += 1;
    else if (char === ")") depth -= 1;
    else if (char === "{" && depth === 0) return index;
  }
  throw new Error("function body missing");
}

function functionName(source) {
  const match = source.match(/^function\s+([$\w]+)/);
  if (!match) throw new Error("named function missing");
  return match[1];
}

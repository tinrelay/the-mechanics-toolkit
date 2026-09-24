#!/usr/bin/env node
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { build9922 } from "../patches/task-attention-policy/profiles/build9922.mjs";
import { build10789 } from "../patches/task-attention-policy/profiles/build10789.mjs";
import {
  linuxBuild9647,
  linuxBuild9771
} from "../patches/task-attention-policy/profiles/linux.mjs";

const root = path.resolve(process.argv[2] ?? "");
if (!process.argv[2]) throw new Error("usage: task-attention-policy.test.mjs EXTRACTED_ASAR_ROOT");
const assets = path.join(root, "webview/assets");
const names = fs.readdirSync(assets);
const appName = names.filter(name => /^app-initial-.*\.js$/.test(name));
const primaryName = names.filter(name => /^app-primary-.*\.js$/.test(name));
assert.equal(appName.length, 1, "unique app-initial asset");
assert.equal(primaryName.length, 1, "unique app-primary asset");
const app = fs.readFileSync(path.join(assets, appName[0]), "utf8");
const primary = fs.readFileSync(path.join(assets, primaryName[0]), "utf8");
testRosterAttention(app, `${primary}${app}`);
process.stdout.write("task attention roster behavioral probe passed\n");

function testRosterAttention(appSource, appPrimarySource) {
  const start = appSource.indexOf("const MTKattentionRosterBridge=1");
  const linuxProfile = [linuxBuild9771, linuxBuild9647].find(profile =>
    appSource.includes(`function MTKuseAttentionBootstrap${profile.suffix}(`)
  );
  const macProfile = [build10789, build9922].find(candidate =>
    appSource.includes(`function MTKuseAttentionBootstrap${candidate.suffix}(`)
  );
  const profile = macProfile ?? linuxProfile;
  assert.ok(profile != null, "qualified task-attention profile");
  const suffix = profile.suffix;
  const boundary = appSource.indexOf(profile.appRootAfter, start);
  assert.ok(start >= 0 && boundary > start, "roster attention helper seam");
  const helper = appSource.slice(start, boundary).replaceAll(suffix, "");
  const diagnostics = [];
  const exact = {key: "tamsin", ownerRoot: "/office", data: {name: "Tamsin"}};
  const muted = {key: "mute-tamsin-for-the-day", ownerRoot: "/office", data: {muteCompletion: true}};
  const invalid = {key: "bad", ownerRoot: "/ship", data: {muteCompletion: "yes"}};
  const roster = {
    matches(title, taskId) {
      if (taskId === "tamsin-id") return [exact, muted];
      if (title === "Invalid") return [invalid];
      return [];
    },
    subscribe: () => () => {},
    diagnose: (code, detail) => diagnostics.push({code, detail})
  };
  const entries = new Map([
    ["local", {kind: "local", catalogTitle: "Tamsin — Portfolio Secretary", conversationId: "tamsin-id", threadId: "tamsin-id"}],
    ["remote", {kind: "remote", task: {title: "Tamsin — Remote", id: "tamsin-id"}, taskId: "tamsin-id"}]
  ]);
  const taskAtom = Symbol.for("current-task-atom");
  const select = (atom, key) => {
    assert.equal(atom, taskAtom);
    return entries.get(key);
  };
  const api = Function(
    "globalThis", "Nj", "IT", "dT", "Y", "nm", "tm", "xf", "Q", "$", "RYs", "Gvl", "Tyl", "Ww",
    `${helper};return {ignored:MTKattentionIgnored,thread:MTKattentionIgnoredThread}`
  )(
    {__MTK_AGENT_ROSTER__: roster},
    key => entries.get(key) ?? null,
    key => entries.get(key) ?? null,
    key => entries.get(key) ?? null,
    () => taskAtom,
    () => ({set() {}}),
    () => ({set() {}}),
    () => ({set() {}}),
    Symbol("scope"),
    Symbol("scope"),
    {useEffect() {}},
    {useEffect() {}},
    {useEffect() {}},
    key => entries.get(key) ?? null
  );
  assert.equal(api.ignored("Tamsin — Portfolio Secretary", "tamsin-id"), true);
  assert.equal(api.ignored("Tamsin — Portfolio Secretary", "other-id"), false);
  assert.equal(api.ignored("Invalid", "other-id"), false);
  assert.equal(diagnostics[0]?.code, "invalid-mute-completion");
  assert.equal(api.thread(select, "local"), true);
  assert.equal(api.thread(select, "remote"), true);

  for (const contract of [
    `MTKattentionPolicyAtom=${macProfile === build10789 ? "Go" : macProfile === build9922 ? "rf" : profile === linuxBuild9771 ? "nf" : "Fp"}(${macProfile === build10789 ? "X" : macProfile === build9922 || profile === linuxBuild9771 ? "$" : "Q"},0)`,
    `s=s.filter(t=>!MTKattentionIgnoredThread${suffix}(e,t))`,
    "[desktop-notifications] suppressed task-attention-policy turn-complete"
  ]) assert.ok(appSource.includes(contract), `roster attention app contract: ${contract}`);
  const rowContracts = profile.applied.primary;
  for (const contract of rowContracts) assert.ok(appPrimarySource.includes(contract), `roster attention row contract: ${contract}`);
}

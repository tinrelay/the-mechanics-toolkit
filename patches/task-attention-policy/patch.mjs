#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { build9922 } from "./profiles/build9922.mjs";
import { build10789 } from "./profiles/build10789.mjs";
import { linuxBuild9647, linuxBuild9771, linuxBuild10954 } from "./profiles/linux.mjs";

const command = process.argv[2];
const root = path.resolve(process.argv[3] ?? "");
if (!new Set(["check", "apply"]).has(command) || !process.argv[3]) {
  throw new Error("usage: task-attention-policy.mjs check|apply EXTRACTED_ASAR_ROOT");
}

const profiles = [linuxBuild10954, build10789, build9922, linuxBuild9771, linuxBuild9647];
const assets = path.join(root, "webview/assets");
const target = uniqueAsset(/^app-initial-.*\.js$/);
const primaryTarget = uniqueAsset(/^app-primary-.*\.js$/);
let source = fs.readFileSync(target, "utf8");
const rowTarget = profiles.some(profile =>
  source.includes(profile.primaryOwner) || source.includes(`function MTKuseTaskAttention${profile.suffix}(`))
  ? target : primaryTarget;
let primarySource = fs.readFileSync(rowTarget, "utf8");
let state = inspectState(source, primarySource);

if (command === "apply" && state === "needs-apply") {
  if (!source.includes("globalThis.__MTK_AGENT_ROSTER__=Object.freeze(")) {
    throw new Error("task-attention-policy requires agent-roster first");
  }
  const matches = profiles.filter(profile => profileContracts(source, primarySource, profile).every(Boolean));
  if (matches.length !== 1) {
    throw new Error(`Upstream changed: found ${matches.length} qualified task attention profiles`);
  }
  ({ appSource: source, primarySource } = patchProfile(
    source,
    primarySource,
    matches[0],
    rowTarget === target
  ));
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
  for (const profile of profiles) {
    const present = value.includes(`function MTKuseAttentionBootstrap${profile.suffix}(`) ||
      primaryValue.includes(`function MTKuseTaskAttention${profile.suffix}(`);
    if (!present) continue;
    const markers = [
      ...profile.applied.app.map(marker => value.includes(marker)),
      ...profile.applied.primary.map(marker => primaryValue.includes(marker))
    ];
    if (!markers.every(Boolean)) {
      throw new Error(`Unrecognized build-${profile.suffix} task attention patch: partial markers`);
    }
    return "applied";
  }
  if (value.includes("MTKattention") || primaryValue.includes("MTKattention")) {
    throw new Error("Unrecognized task attention patch: partial markers");
  }
  const matches = profiles.filter(profile => profileContracts(value, primaryValue, profile).every(Boolean));
  if (matches.length === 1) return "needs-apply";
  throw new Error(`Upstream changed: found ${matches.length} qualified task attention profiles`);
}

function profileContracts(appValue, primaryValue, profile) {
  return [
    [profile.pristineAppRoot, profile.appRootBefore].some(contract => appValue.includes(contract)),
    appValue.includes(profile.notificationOwner),
    appValue.includes(profile.notificationBefore),
    appValue.includes(profile.atomFactoryContract),
    appValue.includes(profile.atomBefore),
    appValue.includes(profile.dockBefore),
    primaryValue.includes(profile.primaryOwner),
    primaryValue.includes(profile.titleBefore),
    ...profile.pristinePrimary.map(contract => primaryValue.includes(contract))
  ];
}

function patchProfile(appValue, primaryValue, profile, sameTarget) {
  const suffix = profile.suffix;
  const helper = `const MTKattentionRosterBridge=1;var MTKattentionPolicyAtom;function MTKattentionMatch${suffix}(e,t){let n=globalThis.__MTK_AGENT_ROSTER__,r=n?.matches(e,t)??[],i=!1;for(let e of r){let t=e.data.muteCompletion;if(t===void 0)continue;if(typeof t!=="boolean"){n?.diagnose("invalid-mute-completion",{ownerRoot:e.ownerRoot,key:e.key});continue}t&&(i=!0)}return i}function MTKattentionIgnored${suffix}(e,t){return MTKattentionMatch${suffix}(e,t)}function MTKattentionIgnoredThread${suffix}(e,t){let n=${profile.decoder}(t);return n?.kind==="local"?MTKattentionMatch${suffix}(${profile.localMatch}):n?.kind==="remote"?MTKattentionMatch${suffix}(${profile.remoteMatch}):!1}function MTKattentionSubscribe${suffix}(e){return globalThis.__MTK_AGENT_ROSTER__?.subscribe(e)??(()=>{})}function MTKuseAttentionBootstrap${suffix}(){let e=${profile.scopeAfter};return ${profile.react}.useEffect(()=>MTKattentionSubscribe${suffix}(()=>e.set(MTKattentionPolicyAtom,e=>(e??0)+1)),[e]),globalThis.__MTKattentionIgnored=MTKattentionIgnored${suffix},globalThis.__MTKattentionSubscribe=MTKattentionSubscribe${suffix},null}`;
  let appPatched = replaceOnce(appValue, profile.appRootBefore, helper + profile.appRootAfter, `build-${suffix} attention bootstrap`);
  appPatched = replaceOnce(appPatched, profile.atomBefore, profile.atomAfter, `build-${suffix} attention atom`);
  appPatched = replaceOnce(appPatched, profile.dockBefore, profile.dockAfter, `build-${suffix} Dock badge projection`);
  appPatched = replaceOnce(appPatched, profile.notificationBefore, profile.notificationAfter, `build-${suffix} native notification projection`);

  const rowHelper = `function MTKuseTaskAttention${suffix}(e,t){let n=globalThis.__MTKattentionSubscribe??(()=>()=>{});return ${profile.primaryReact}.useSyncExternalStore(n,()=>globalThis.__MTKattentionIgnored?.(e,t)===!0,()=>!1)}`;
  let primaryPatched = replaceOnce(sameTarget ? appPatched : primaryValue, profile.primaryOwner, rowHelper + profile.primaryOwner, `build-${suffix} task attention hook`);
  primaryPatched = replaceOnce(primaryPatched, profile.titleBefore, profile.titleAfter, `build-${suffix} local title`);
  for (let index = 0; index < profile.pristinePrimary.length; index += 1) {
    primaryPatched = replaceOnce(primaryPatched, profile.pristinePrimary[index], profile.patchedPrimary[index], `build-${suffix} row projection ${index + 1}`);
  }
  return {
    appSource: sameTarget ? primaryPatched : appPatched,
    primarySource: primaryPatched
  };
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

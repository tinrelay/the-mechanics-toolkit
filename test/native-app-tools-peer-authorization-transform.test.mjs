#!/usr/bin/env node
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const repository = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const toolkit = path.join(repository, "bin/toolkit.mjs");
const behavioralProbe = path.join(repository, "test/native-app-tools-peer-authorization.test.mjs");
const scratch = fs.mkdtempSync(path.join(os.tmpdir(), "mechanics-toolkit-native-peer-test-"));

try {
  for (const profile of [
    {owner: "cB", authorizer: "cR", addon: "e", authParam: "o", current: true},
    {owner: "$ce", authorizer: "kl", envConst: "Kce", addonConst: "qce"},
    {owner: "zie", authorizer: "nd", envConst: "Mie", addonConst: "Nie"},
    {owner: "mie", authorizer: "Tf", envConst: "sie", addonConst: "cie"},
    {owner: "Hse", authorizer: "Ql", envConst: "Fse", addonConst: "Ise"},
    {owner: "_ce", authorizer: "pu", envConst: "uce", addonConst: "dce"},
    {owner: "doe", authorizer: "gf", envConst: "noe", addonConst: "roe",
      ownerPrefix: "callTool:e,listTools:t,readBrowserAccess:n,prepareTaskWorkspace:r,pipePath:i,socketPeerAuthorizer:a=",
      ownerReturn: "a"},
    {owner: "Rae", authorizer: "cp", envConst: "Dae", addonConst: "Oae",
      ownerPrefix: "callTool:e,listTools:t,readBrowserAccess:n,prepareTaskWorkspace:r,assignTaskProject:i,listTaskProjects:a,pipePath:o,socketPeerAuthorizer:s=",
      ownerReturn: "s"},
    {owner: "Zue", authorizer: "od", envConst: "Bue", addonConst: "Vue", addon: "a", devVar: "r",
      ownerPrefix: "callTool:e,listTools:t,readBrowserAccess:n,prepareTaskWorkspace:r,assignTaskProject:i,listTaskProjects:a,pipePath:o,socketPeerAuthorizer:s=",
      ownerReturn: "s"}
  ]) {
    const extracted = path.join(scratch, profile.owner);
    const build = path.join(extracted, ".vite/build");
    const target = path.join(build, "main-fixture.js");
    fs.mkdirSync(build, {recursive: true});
    fs.writeFileSync(target, fixture(profile));

    assert.equal(runToolkit("check", extracted).state, "needs-apply");
    const applied = runToolkit("apply", extracted);
    assert.equal(applied.state, "applied");
    assert.deepEqual(applied.fallback, {
      stockReason: "missing-code-signing-identity",
      immediatePeerTeamId: "2DC432GLL2",
      immediatePeerSigningIdentifiers: ["node", "node_repl"]
    });
    const once = fs.readFileSync(target);
    const probe = spawnSync(process.execPath, [behavioralProbe, extracted], {encoding: "utf8"});
    assert.equal(probe.status, 0, probe.stderr || probe.stdout);

    assert.equal(runToolkit("apply", extracted).state, "applied");
    assert.deepEqual(fs.readFileSync(target), once, `${profile.owner} second application is byte-identical`);
  }
  process.stdout.write("native app-tools peer authorization transform probe passed\n");
} finally {
  fs.rmSync(scratch, {recursive: true, force: true});
}

function runToolkit(action, extracted) {
  const result = spawnSync(
    process.execPath,
    [toolkit, "patch", "native-app-tools-peer-authorization", action, extracted],
    {encoding: "utf8"}
  );
  assert.equal(result.status, 0, result.stderr || result.stdout);
  return JSON.parse(result.stdout);
}

function fixture(profile) {
  if (profile.current) return [
    'function cR(){let n=!r&&"1"===process.env.CODEX_BROWSER_USE_PEER_AUTHORIZATION;let e=cP((0,en.join)(i,"native","browser-use-peer-authorization.node"));return s=>e.authorizeSocketPeer(s,n)}',
    "async function cB({callTool:e,listTools:t,readBrowserAccess:r,prepareTaskWorkspace:n,assignTaskProject:i,listTaskProjects:s,pipePath:a,socketPeerAuthorizer:o=cR()}){return o}",
    "async function ZC({apiImpl:e,nativePipeDirectory:t,maxOutgoingFrameBytes:r=0x4000000,pipePath:n,socketPeerAuthorizer:i=cR()}){return i}",
    "async function uv({services:e,pipePath:t=`/tmp/codex-host-services-${(0,tb.randomUUID)()}.sock`,socketPeerAuthorizer:r=cR()}){return r}",
    "async function apps(){let y=await cy({maxIncomingFrameBytes:8388608,maxOutgoingFrameBytes:0x4000000,socketPeerAuthorizer:cR()});return y}",
    "async function lD({sourceServiceAppPath:e,codexHome:t}){if(\"darwin\"!==process.platform||process.env.CODEX_ELECTRON_SKIP_COMPUTER_USE_CANONICAL_REFRESH?.trim()===\"1\"||null==e)return;}async function lM(){}",
    "function runtime(){return true?function({nativePipeDirectory:e,nativePipeEnabled:t=!1,serviceAppPath:r,serviceNativePipePath:n}={}){return{...null==r?{}:{[rW]:r},...null==n?{}:{[rN]:n},...t?{SKY_CUA_NATIVE_PIPE: \"1\",SKY_CUA_NATIVE_PIPE_DIRECTORY:e??rq}:{}}}({nativePipeDirectory:l,nativePipeEnabled:\"win32\"===h.platform,serviceAppPath:\"darwin\"===h.platform?c.serviceAppPath:null,serviceNativePipePath:\"darwin\"===h.platform&&u?eq().env[rN]:null}):{}}",
    "const reasons=[`dynamic_app_tools_peer_rejected`,`missing-socket-file-descriptor`];"
  ].join("");
  return [
    `const ${profile.envConst}=\`CODEX_BROWSER_USE_PEER_AUTHORIZATION\`,${profile.addonConst}=\`browser-use-peer-authorization.node\`;`,
    `const ${profile.addon ?? "i"}={authorizeSocketPeer(){}};function ${profile.authorizer}(){return()=>({authorized:false})}`,
    `function stock(t,${profile.devVar ?? "n"}){return ${profile.addon ?? "i"}.authorizeSocketPeer(t,${profile.devVar ?? "n"})}`,
    `async function ${profile.owner}({${profile.ownerPrefix ?? "callTool:e,listTools:t,pipePath:n,socketPeerAuthorizer:r="}${profile.authorizer}()}){return ${profile.ownerReturn ?? "r"}}`,
    "const reasons=[`dynamic_app_tools_peer_rejected`,`missing-socket-file-descriptor`];",
    "export const fixture=true;"
  ].join("");
}

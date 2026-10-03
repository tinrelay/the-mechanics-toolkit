#!/usr/bin/env node
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const repository = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const toolkit = path.join(repository, "bin/toolkit.mjs");
const probe = path.join(repository, "test/safe-start-readiness.test.mjs");
const scratch = fs.mkdtempSync(path.join(os.tmpdir(), "mechanics-toolkit-safe-start-patch-test-"));
try {
  const extracted = path.join(scratch, "extracted");
  const build = path.join(extracted, ".vite/build");
  const assets = path.join(extracted, "webview/assets");
  fs.mkdirSync(build, {recursive: true});
  fs.mkdirSync(assets, {recursive: true});
  const main = path.join(build, "main-fixture.js");
  const renderer = path.join(assets, "app-initial-fixture.js");
  fs.writeFileSync(main, "var vae=`CODEX_ELECTRON_DEV_RELAUNCH_MARKER_PATH`;" +
    "globalThis.__handler=null;function Cae({markerPath:e=process.env[vae]?.trim(),writeMarker:t=e=>{globalThis.__marker=e}}={}){if(!e)return!1;return t(e),!0}" +
    "function owner(){let N=()=>true,r={lt:1}," +
    "l={ipcMain:{handle(k,h){globalThis.__handler=h}}};" +
    "l.ipcMain.handle(r.lt,async(t,s)=>{if(!N(t))return;" +
    "if(s.type===`electron-avatar-overlay-restore-ready`)return})}" +
    "owner();await globalThis.__handler(null,{type:`ready`});" +
    "process.stdout.write(globalThis.__marker??``)");
  fs.writeFileSync(renderer, "const g={dispatchMessage(){}};function MHs(){g.dispatchMessage(`ready`,{persistedStateResponsePriority:R9?`critical`:void 0})}");

  assert.equal(run("check", extracted).state, "needs-apply");
  assert.equal(run("apply", extracted).state, "applied");
  const once = [fs.readFileSync(main), fs.readFileSync(renderer)];
  const behavior = spawnSync(process.execPath, [probe, extracted], {encoding: "utf8"});
  assert.equal(behavior.status, 0, behavior.stderr || behavior.stdout);
  const marker = String.raw`C:\Users\Mike\.codex\tmtk-rescue\incident\renderer.ready`;
  const markerArgument = `--tmtk-safe-start-marker=${Buffer.from(marker).toString("base64url")}`;
  const windowsEnvironment = {...process.env, USERPROFILE: String.raw`C:\Users\Mike`};
  delete windowsEnvironment.CODEX_ELECTRON_DEV_RELAUNCH_MARKER_PATH;
  const windowsReady = spawnSync(process.execPath, [main, markerArgument], {
    encoding: "utf8",
    env: windowsEnvironment
  });
  assert.equal(windowsReady.status, 0, windowsReady.stderr || windowsReady.stdout);
  assert.equal(windowsReady.stdout, marker);
  const outside = String.raw`C:\Users\Mike\Desktop\renderer.ready`;
  const refused = spawnSync(process.execPath, [main,
    `--tmtk-safe-start-marker=${Buffer.from(outside).toString("base64url")}`], {
    encoding: "utf8",
    env: windowsEnvironment
  });
  assert.equal(refused.status, 0, refused.stderr || refused.stdout);
  assert.equal(refused.stdout, "");
  const traversing = String.raw`C:\Users\Mike\.codex\tmtk-rescue\incident\..\..\Desktop\renderer.ready`;
  const traversalRefused = spawnSync(process.execPath, [main,
    `--tmtk-safe-start-marker=${Buffer.from(traversing).toString("base64url")}`], {
    encoding: "utf8",
    env: windowsEnvironment
  });
  assert.equal(traversalRefused.status, 0, traversalRefused.stderr || traversalRefused.stdout);
  assert.equal(traversalRefused.stdout, "");
  assert.equal(run("apply", extracted).state, "applied");
  assert.deepEqual(fs.readFileSync(main), once[0]);
  assert.deepEqual(fs.readFileSync(renderer), once[1]);

  const currentExtracted = path.join(scratch, "current-extracted");
  const currentBuild = path.join(currentExtracted, ".vite/build");
  const currentAssets = path.join(currentExtracted, "webview/assets");
  fs.mkdirSync(currentBuild, {recursive: true});
  fs.mkdirSync(currentAssets, {recursive: true});
  const currentMain = path.join(currentBuild, "main-current.js");
  const currentRenderer = path.join(currentAssets, "app-initial-current.js");
  fs.writeFileSync(currentMain, "var ece=`CODEX_ELECTRON_DEV_RELAUNCH_MARKER_PATH`;" +
    "globalThis.__handler=null;function ace({markerPath:e=process.env[ece]?.trim(),writeMarker:t=e=>{globalThis.__marker=e}}={}){if(!e)return!1;return t(e),!0}" +
    "class Owner{async handleMessage(e,t){switch(t.type){case`ready`:{this.windowManager.markWebContentsReady(e),globalThis.__ready=true;break}case`other`:break}}}" +
    "let owner=new Owner;owner.windowManager={markWebContentsReady(){},getRendererWindowLogFields(){return{rendererWindowAppearance:`primary`}}};await owner.handleMessage(null,{type:`ready`});" +
    "process.stdout.write(globalThis.__marker??``)");
  fs.writeFileSync(currentRenderer,
    "const Dr={dispatchMessage(){}};function qTl(){Dr.dispatchMessage(`ready`,{persistedStateResponsePriority:B9?`critical`:void 0})}");
  assert.equal(run("check", currentExtracted).state, "needs-apply");
  assert.equal(run("apply", currentExtracted).state, "applied");
  const currentOnce = fs.readFileSync(currentMain);
  const currentReady = spawnSync(process.execPath, [currentMain], {
    encoding: "utf8",
    env: {...process.env, CODEX_ELECTRON_DEV_RELAUNCH_MARKER_PATH: "/tmp/renderer.ready"}
  });
  assert.equal(currentReady.status, 0, currentReady.stderr || currentReady.stdout);
  assert.equal(currentReady.stdout, "/tmp/renderer.ready");
  assert.equal(run("apply", currentExtracted).state, "applied");
  assert.deepEqual(fs.readFileSync(currentMain), currentOnce);

  const frontierExtracted = path.join(scratch, "frontier-extracted");
  const frontierBuild = path.join(frontierExtracted, ".vite/build");
  const frontierAssets = path.join(frontierExtracted, "webview/assets");
  fs.mkdirSync(frontierBuild, {recursive: true});
  fs.mkdirSync(frontierAssets, {recursive: true});
  const frontierMain = path.join(frontierBuild, "main-frontier.js");
  const frontierPristine =
    "var Woe=`CODEX_ELECTRON_DEV_RELAUNCH_MARKER_PATH`;" +
    "function Yoe({markerPath:e=process.env[Woe]?.trim(),writeMarker:t=e=>{globalThis.__marker=e}}={}){if(!e)return!1;return t(e),!0}" +
    "class Owner{async handleMessage(e,t){switch(t.type){case`ready`:{this.windowManager.markWebContentsReady(e),globalThis.__ready=true;break}case`other`:break}}}" +
    "let owner=new Owner;owner.windowManager={markWebContentsReady(){},getRendererWindowLogFields(e){return{rendererWindowAppearance:e.appearance}}};" +
    "await owner.handleMessage({appearance:process.argv[2]},{type:`ready`});process.stdout.write(globalThis.__marker??``)";
  fs.writeFileSync(frontierMain, frontierPristine);
  fs.writeFileSync(path.join(frontierAssets, "app-initial-frontier.js"),
    "const Jn={dispatchMessage(){}};function routes(){Jn.dispatchMessage(`ready`,{persistedStateResponsePriority:R9?`critical`:void 0})}");
  assert.equal(run("check", frontierExtracted).state, "needs-apply");
  assert.equal(run("apply", frontierExtracted).state, "applied");
  const frontierOnce = fs.readFileSync(frontierMain);
  for (const [appearance, expected] of [["globalDictation", ""], ["primary", "/tmp/renderer.ready"]]) {
    const result = spawnSync(process.execPath, [frontierMain, appearance], {
      encoding: "utf8",
      env: {...process.env, CODEX_ELECTRON_DEV_RELAUNCH_MARKER_PATH: "/tmp/renderer.ready"}
    });
    assert.equal(result.status, 0, result.stderr || result.stdout);
    assert.equal(result.stdout, expected, `${appearance} readiness marker`);
  }
  assert.equal(run("apply", frontierExtracted).state, "applied");
  assert.deepEqual(fs.readFileSync(frontierMain), frontierOnce);

  const linuxExtracted = path.join(scratch, "linux-10954-extracted");
  const linuxBuild = path.join(linuxExtracted, ".vite/build");
  const linuxAssets = path.join(linuxExtracted, "webview/assets");
  fs.mkdirSync(linuxBuild, {recursive: true});
  fs.mkdirSync(linuxAssets, {recursive: true});
  const linuxMain = path.join(linuxBuild, "main-linux.js");
  fs.writeFileSync(linuxMain, frontierPristine);
  fs.writeFileSync(path.join(linuxAssets, "app-initial-linux.js"),
    "const ur={dispatchMessage(){}};function routes(){ur.dispatchMessage(`ready`,{persistedStateResponsePriority:R9?`critical`:void 0})}");
  assert.equal(run("check", linuxExtracted).state, "needs-apply");
  assert.equal(run("apply", linuxExtracted).state, "applied");
  const linuxOnce = fs.readFileSync(linuxMain);
  assert.equal(run("apply", linuxExtracted).state, "applied");
  assert.deepEqual(fs.readFileSync(linuxMain), linuxOnce);

  const build11645 = path.join(scratch, "build-11645");
  fs.mkdirSync(path.join(build11645, ".vite/build"), {recursive: true});
  fs.mkdirSync(path.join(build11645, "webview/assets"), {recursive: true});
  const build11645Main = path.join(build11645, ".vite/build/main-build11645.js");
  fs.writeFileSync(build11645Main,
    "var yse=`CODEX_ELECTRON_DEV_RELAUNCH_MARKER_PATH`;" +
    "function wse({markerPath:e=process.env[yse]?.trim(),writeMarker:t=e=>{globalThis.__marker=e}}={}){if(!e)return!1;return t(e),!0}" +
    "class Owner{async handleMessage(e,t){switch(t.type){case`ready`:{t.initializationOnly||(this.windowManager.markWebContentsReady(e),this.avatarOverlayManager.handleRendererReady(e.id));break}}}};" +
    "let owner=new Owner;owner.windowManager={markWebContentsReady(){},getRendererWindowLogFields(e){return{rendererWindowAppearance:e.appearance}}};" +
    "owner.avatarOverlayManager={handleRendererReady(){}};" +
    "await owner.handleMessage({id:1,appearance:process.argv[2]},{type:`ready`,initializationOnly:process.argv[3]===`initialization`});" +
    "process.stdout.write(globalThis.__marker??``)");
  fs.writeFileSync(path.join(build11645, "webview/assets/app-initial-build11645.js"),
    "const aa={dispatchMessage(){}};function routes(){aa.dispatchMessage(`ready`,{persistedStateResponsePriority:reo?`critical`:void 0})}");
  assert.equal(run("check", build11645).state, "needs-apply");
  assert.equal(run("apply", build11645).state, "applied");
  const build11645Once = fs.readFileSync(build11645Main);
  for (const [appearance, initialization, expected] of [
    ["primary", "ready", "/tmp/renderer.ready"],
    ["globalDictation", "ready", ""],
    ["primary", "initialization", ""]
  ]) {
    const result = spawnSync(process.execPath, [build11645Main, appearance, initialization], {
      encoding: "utf8",
      env: {...process.env, CODEX_ELECTRON_DEV_RELAUNCH_MARKER_PATH: "/tmp/renderer.ready"}
    });
    assert.equal(result.status, 0, result.stderr || result.stdout);
    assert.equal(result.stdout, expected, `${appearance}/${initialization} readiness marker`);
  }
  assert.equal(run("apply", build11645).state, "applied");
  assert.deepEqual(fs.readFileSync(build11645Main), build11645Once);

  const build12404 = path.join(scratch, "build-12404");
  fs.mkdirSync(path.join(build12404, ".vite/build"), {recursive: true});
  fs.mkdirSync(path.join(build12404, "webview/assets"), {recursive: true});
  const build12404Main = path.join(build12404, ".vite/build/main-build12404.js");
  fs.writeFileSync(build12404Main,
    "var sie=`CODEX_ELECTRON_DEV_RELAUNCH_MARKER_PATH`,l={n:`background`};" +
    "function Kf({browserBackgroundNetworkingDisabled:e=process.argv.some(e=>e.split(`=`,1)[0]===`--${l.n}`)," +
    "markerPath:t=process.env[sie]?.trim(),writeMarker:n=(e,t)=>{globalThis.__marker=e}}={}){" +
    "if(!t)return!1;return n(t,{browserBackgroundNetworkingDisabled:e}),!0}" +
    "class Owner{async handleMessage(e,t){switch(t.type){case`ready`:{t.initializationOnly||" +
    "(this.windowManager.markWebContentsReady(e),this.avatarOverlayManager.handleRendererReady(e.id));break}}}};" +
    "let owner=new Owner;owner.windowManager={markWebContentsReady(){}," +
    "getRendererWindowLogFields(e){return{rendererWindowAppearance:e.appearance}}};" +
    "owner.avatarOverlayManager={handleRendererReady(){}};" +
    "await owner.handleMessage({id:1,appearance:process.argv[2]},{type:`ready`," +
    "initializationOnly:process.argv[3]===`initialization`});" +
    "process.stdout.write(globalThis.__marker??``)");
  fs.writeFileSync(path.join(build12404, "webview/assets/app-initial-build12404.js"),
    "const Nd={dispatchMessage(){}};function routes(){Nd.dispatchMessage(`ready`," +
    "{persistedStateResponsePriority:pfc?`critical`:void 0})}");
  assert.equal(run("check", build12404).state, "needs-apply");
  assert.equal(run("apply", build12404).state, "applied");
  const build12404Once = fs.readFileSync(build12404Main);
  for (const [appearance, initialization, expected] of [
    ["primary", "ready", "/tmp/renderer.ready"],
    ["globalDictation", "ready", ""],
    ["primary", "initialization", ""]
  ]) {
    const result = spawnSync(process.execPath, [build12404Main, appearance, initialization], {
      encoding: "utf8",
      env: {...process.env, CODEX_ELECTRON_DEV_RELAUNCH_MARKER_PATH: "/tmp/renderer.ready"}
    });
    assert.equal(result.status, 0, result.stderr || result.stdout);
    assert.equal(result.stdout, expected, `${appearance}/${initialization} readiness marker`);
  }
  assert.equal(run("apply", build12404).state, "applied");
  assert.deepEqual(fs.readFileSync(build12404Main), build12404Once);
  process.stdout.write("safe-start readiness transform probe passed\n");
} finally {
  fs.rmSync(scratch, {recursive: true, force: true});
}

function run(action, extracted) {
  const result = spawnSync(process.execPath, [toolkit, "patch", "safe-start-readiness", action, extracted], {encoding: "utf8"});
  assert.equal(result.status, 0, result.stderr || result.stdout);
  return JSON.parse(result.stdout);
}

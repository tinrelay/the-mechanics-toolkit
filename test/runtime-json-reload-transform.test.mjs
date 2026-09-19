#!/usr/bin/env node
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const repository = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const toolkit = path.join(repository, "bin/toolkit.mjs");
const behavioralProbe = path.join(repository, "test/runtime-json-reload.test.mjs");
const scratch = fs.mkdtempSync(path.join(os.tmpdir(), "mechanics-toolkit-json-reload-test-"));

try {
  exercise("local", rendererFixture());
  exercise("imported-9922", importedRendererFixture());
  process.stdout.write("runtime JSON reload transform probe passed\n");

  function exercise(name, rendererSource) {
    const extracted = path.join(scratch, name);
    const assets = path.join(extracted, "webview/assets");
    const mainDirectory = path.join(extracted, ".vite/build");
    fs.mkdirSync(assets, { recursive: true });
    fs.mkdirSync(mainDirectory, { recursive: true });
    const renderer = path.join(assets, "app-initial-fixture.js");
    const main = path.join(mainDirectory, "main-fixture.js");
    fs.writeFileSync(renderer, rendererSource);
    fs.writeFileSync(main, mainFixture());

    assert.equal(runToolkit("check", extracted).state, "needs-apply");

    const applied = runToolkit("apply", extracted);
    assert.equal(applied.state, "applied");
    assert.deepEqual(applied.files, ["agent-roster.json"]);
    assert.deepEqual(applied.targets, [
      path.join(".vite", "build", "main-fixture.js"),
      path.join("webview", "assets", "app-initial-fixture.js")
    ]);
    assert.ok(!fs.readFileSync(renderer, "utf8").includes("workspaceRoot:"));
    assert.ok(!fs.readFileSync(main, "utf8").includes("MTKruntimeJsonRoot="));

    const once = [fs.readFileSync(renderer), fs.readFileSync(main)];
    const probe = spawnSync(process.execPath, [behavioralProbe, extracted], { encoding: "utf8" });
    assert.equal(probe.status, 0, probe.stderr || probe.stdout);

    assert.equal(runToolkit("apply", extracted).state, "applied");
    assert.deepEqual(fs.readFileSync(renderer), once[0], "renderer second application is byte-identical");
    assert.deepEqual(fs.readFileSync(main), once[1], "main second application is byte-identical");
  }

  function runToolkit(action, extracted) {
    const args = [toolkit, "patch", "runtime-json-reload", action, extracted];
    const result = spawnSync(process.execPath, args, { encoding: "utf8" });
    assert.equal(result.status, 0, result.stderr || result.stdout);
    return JSON.parse(result.stdout);
  }
} finally {
  fs.rmSync(scratch, { recursive: true, force: true });
}

function rendererFixture() {
  return [
    "var H={getInstance(){return null}},U,y=e=>e;",
    "U=H.getInstance(),y((e,t)=>{U.dispatchMessage(e,t)});",
    "export{U as hostBus};"
  ].join("");
}

function importedRendererFixture() {
  return [
    'import{RB as U}from"./app-shared-deadbeef.js";',
    "U.dispatchMessage(`fixture`,{});U.subscribe(`fixture`,()=>{});",
    "export{U as hostBus};"
  ].join("");
}

function mainFixture() {
  return [
    "var i={i(){return()=>({})}};var pQ=i.i(`electron-message-handler`);",
    "class App{async handleMessage(e,t){switch(t.type){",
    "case`show-plan-summary`:break;case`update-diff-if-open`:break;case`electron-add-new-workspace-root-option`:break;",
    "}}}",
    "export{App};"
  ].join("");
}

#!/usr/bin/env node
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {spawnSync} from "node:child_process";
import {fileURLToPath} from "node:url";

const repository = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const patch = path.join(repository, "patches/codex-observability/patch.mjs");
const scratch = fs.mkdtempSync(path.join(os.tmpdir(), "tmtk-observability-transform-"));
const build = path.join(scratch, ".vite", "build");
const main = path.join(build, "main-current.js");

try {
  fs.mkdirSync(build, {recursive: true});
  fs.writeFileSync(main,
    "const i={i:e=>e},l={app:{whenReady:async()=>{},getPath:()=>``},webContents:{}},n={Ur:class{add(){}}};" +
    "var dQ=i.i(`electron-message-handler`);" +
    "async function boot(){let L=new n.Ur;L.add(()=>{});let R=Date.now();" +
    "await l.app.whenReady(),L.add(await MTKtinrelayStartOutgoingObserver(``)),N(`main app.whenReady resolved`,R),I&&after()}" +
    "async function MTKtinrelayStartOutgoingObserver(){}function N(){}const I=false;function after(){}\n"
  );

  assert.equal(run("check").state, "needs-apply");
  const applied = run("apply");
  assert.equal(applied.state, "applied");
  assert.equal(applied.target, path.join(".vite", "build", "main-current.js"));

  const source = fs.readFileSync(main, "utf8");
  assert.equal(count(source, 'const MTKobserveContract="tmtk-codex-observability-v1"'), 1);
  assert.equal(count(source, "L.add(await MTKobserveStart(l.webContents))"), 1);
  assert.ok(source.indexOf("const MTKobserveContract=") < source.indexOf("var dQ="));
  assert.ok(source.includes('.attach("1.3")'));
  assert.ok(source.includes('case"cpu-profile"'));
  assert.ok(source.includes('case"trace"'));
  assert.ok(source.includes('case"cdp"'));
  assert.ok(source.includes('case"devtools"'));
  assert.ok(source.includes("getAllWebContents"));
  assert.ok(source.includes("fromId"));

  const first = fs.readFileSync(main);
  assert.equal(run("apply").state, "applied");
  assert.deepEqual(fs.readFileSync(main), first, "second apply is byte-identical");

  fs.writeFileSync(main, source.replace('case"trace"', 'case"broken-trace"'));
  const partial = spawnSync(process.execPath, [patch, "check", scratch], {encoding: "utf8"});
  assert.notEqual(partial.status, 0, "partial helper state fails closed");
  assert.match(partial.stderr, /partial|changed/i);
} finally {
  fs.rmSync(scratch, {recursive: true, force: true});
}

function run(command) {
  const result = spawnSync(process.execPath, [patch, command, scratch], {encoding: "utf8"});
  assert.equal(result.status, 0, result.stderr || result.stdout);
  return JSON.parse(result.stdout);
}

function count(value, needle) {
  return value.split(needle).length - 1;
}

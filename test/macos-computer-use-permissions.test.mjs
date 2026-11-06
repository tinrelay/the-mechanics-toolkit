import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {persistentComputerUseSigningIdentity, resetComputerUsePermissionsForSignerChange} from "../src/platforms/macos-computer-use.mjs";
import {launchApplication} from "../src/platforms/macos.mjs";

for (const value of [undefined, null, "", " ", "-", " - "]) {
  assert.throws(() => persistentComputerUseSigningIdentity(value), /persistent signingIdentity/);
}
assert.equal(persistentComputerUseSigningIdentity("Local Signing Certificate"), "Local Signing Certificate");

const local = 'identifier "com.openai.sky.CUAService" and certificate root = H"LOCAL_A"';
const vendor = 'identifier "com.openai.sky.CUAService" and anchor apple generic and certificate leaf[subject.OU] = "VENDOR"';
const calls = [];
const processRunner = (command, args) => {calls.push([command, args]);return {status:0}};
assert.deepEqual(resetComputerUsePermissionsForSignerChange({previousRequirement:local,nextRequirement:local,processRunner}), {state:"preserved"});
assert.deepEqual(calls, [], "updates/restarts with the same certificate preserve every privacy grant");
assert.deepEqual(resetComputerUsePermissionsForSignerChange({previousRequirement:vendor,nextRequirement:local,processRunner}), {state:"reset"});
assert.deepEqual(calls, [
  ["/usr/bin/tccutil",["reset","ScreenCapture","com.openai.sky.CUAService"]],
  ["/usr/bin/tccutil",["reset","Accessibility","com.openai.sky.CUAService"]]
], "a signer transition clears only the helper's two stale grants");
calls.length = 0;
for (const [label, previousRequirement] of [
  ["no previously installed helper", null],
  ["older ad-hoc TMTK helper", 'identifier "com.openai.sky.CUAService" and cdhash H"OLD_BUILD"']
]) {
  assert.deepEqual(resetComputerUsePermissionsForSignerChange({previousRequirement,nextRequirement:local,processRunner}),
    {state:"reset"}, label);
  assert.deepEqual(calls, [
    ["/usr/bin/tccutil",["reset","ScreenCapture","com.openai.sky.CUAService"]],
    ["/usr/bin/tccutil",["reset","Accessibility","com.openai.sky.CUAService"]]
  ], `${label} receives the same scoped first-transition handling`);
  calls.length = 0;
}
resetComputerUsePermissionsForSignerChange({previousRequirement:local,nextRequirement:local,processRunner});
assert.equal(calls.length,0,"the next launch after canonical helper refresh does not repeat the reset");
resetComputerUsePermissionsForSignerChange({previousRequirement:local,nextRequirement:local.replace("LOCAL_A","LOCAL_B"),processRunner});
assert.equal(calls.length,2,"changing the actual signing certificate requires a fresh grant");
calls.length = 0;
assert.throws(() => resetComputerUsePermissionsForSignerChange({previousRequirement:local,nextRequirement:'identifier "com.openai.sky.CUAService" and cdhash H"BUILD"',processRunner}), /stable certificate/);
assert.throws(() => resetComputerUsePermissionsForSignerChange({previousRequirement:local,nextRequirement:'identifier "another.helper" and certificate root = H"LOCAL_A"',processRunner}), /signing identifier changed/);
assert.equal(calls.length,0,"ad-hoc candidates are refused without touching privacy state");
assert.throws(() => resetComputerUsePermissionsForSignerChange({previousRequirement:vendor,nextRequirement:local,
  processRunner(){return {status:1,stderr:"reset denied"}}}), /ScreenCapture.*reset denied/);
const scratch = fs.mkdtempSync(path.join(os.tmpdir(),"tmtk-cua-permission-test-"));
try {
  const log = path.join(scratch,"app.log");let launched = false;
  launchApplication({app:"/example/Codex.app",marker:"/example/ready",appLog:log,codexHome:"/example/codex",
    preparePermissions(){throw new Error("reset denied")},
    processLauncher(command){assert.equal(command,"/usr/bin/open");launched=true;return {unref(){}}}
  });
  assert.ok(launched,"optional Computer Use permission failure does not block Desktop launch");
  assert.match(fs.readFileSync(log,"utf8"),/Computer Use permission preparation failed: reset denied/,
    "failed migration remains visible instead of claiming Computer Use readiness");
} finally {fs.rmSync(scratch,{recursive:true,force:true})}
console.log("Computer Use persistent identity and permission transition probe passed");

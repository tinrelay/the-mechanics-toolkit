#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import {spawnSync} from "node:child_process";
import {helperState, repairHelper} from "./transform.mjs";
import {persistentComputerUseSigningIdentity} from "../../src/platforms/macos-computer-use.mjs";

const [command, root, flag, configFile] = process.argv.slice(2);
if (!["check", "apply"].includes(command) || !root || flag !== "--config" || !configFile) {
  throw new Error("usage: macos-computer-use-service/patch.mjs check|apply STAGED_APP --config TOOLKIT_CONFIG");
}
if (process.platform !== "darwin") throw new Error("Computer Use service repair requires macOS");
const config = JSON.parse(fs.readFileSync(configFile, "utf8"));
const identity = persistentComputerUseSigningIdentity(config.signingIdentity);
const relative = "Contents/Resources/cua_node/lib/node_modules/@oai/sky/Codex Computer Use.app";
const helper = path.join(path.resolve(root), relative);
const executable = path.join(helper, "Contents/MacOS/SkyComputerUseService");
let state = helperState(fs.readFileSync(executable));
if (command === "apply" && state === "needs-apply") {
  const entitlements = readEntitlements(helper);
  // A local certificate cannot claim the vendor's restricted identity/keychain entitlements.
  for (const key of ["com.apple.application-identifier", "com.apple.developer.team-identifier", "keychain-access-groups"]) {
    delete entitlements[key];
  }
  const scratch = fs.mkdtempSync(path.join(os.tmpdir(), "tmtk-cua-sign-"));
  try {
    const plist = path.join(scratch, "entitlements.plist");
    fs.writeFileSync(plist, JSON.stringify(entitlements));
    run("/usr/bin/plutil", ["-convert", "xml1", plist]);
    fs.writeFileSync(executable, repairHelper(fs.readFileSync(executable)));
    run("/usr/bin/codesign", ["--force", "--sign", identity, "--entitlements", plist, "--options", "runtime", helper]);
  } finally {
    fs.rmSync(scratch, {recursive: true, force: true});
  }
  state = helperState(fs.readFileSync(executable));
}
run("/usr/bin/codesign", ["--verify", "--deep", "--strict", helper]);
if (state === "applied") {
  const entitlements = readEntitlements(helper);
  for (const key of ["com.apple.application-identifier", "com.apple.developer.team-identifier", "keychain-access-groups"]) {
    if (key in entitlements) throw new Error(`Locally signed helper retains restricted entitlement: ${key}`);
  }
}
process.stdout.write(JSON.stringify({state, targets: [
  `${relative}/Contents/MacOS/SkyComputerUseService`,
  `${relative}/Contents/_CodeSignature/CodeResources`
], immediatePeerVendorSignatureRequired: true, parentSignatureRequired: state !== "applied"}) + "\n");

function run(command, args, input) {
  const result = spawnSync(command, args, {encoding: "utf8", input, maxBuffer: 4 * 1024 * 1024});
  if (result.status !== 0) throw new Error(`${path.basename(command)} failed: ${result.stderr || result.error?.message}`);
  return result.stdout;
}

function readEntitlements(app) {
  const plist = run("/usr/bin/codesign", ["--display", "--entitlements", ":-", app]);
  return JSON.parse(run("/usr/bin/plutil", ["-convert", "json", "-o", "-", "-"], plist));
}

import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {spawnSync} from "node:child_process";
import {helperState, repairHelper} from "../patches/macos-computer-use-service/transform.mjs";

if (!process.argv[2]) throw new Error("usage: macos-computer-use-service.test.mjs STAGED_APP");
const app = path.join(process.argv[2], "Contents/Resources/cua_node/lib/node_modules/@oai/sky/Codex Computer Use.app");
const bytes = fs.readFileSync(path.join(app, "Contents/MacOS/SkyComputerUseService"));
assert.equal(helperState(bytes), "applied");
assert.deepEqual(repairHelper(bytes), bytes, "reapplication preserves signed bytes");
const altered = Buffer.from(bytes); altered[0x180b70] ^= 1;
assert.throws(() => helperState(altered), /Upstream changed/, "partial or changed native repair fails closed");
const verified = spawnSync("/usr/bin/codesign", ["--verify", "--deep", "--strict", app], {encoding: "utf8"});
assert.equal(verified.status, 0, verified.stderr);
process.stdout.write("Computer Use service image and signature probe passed\n");

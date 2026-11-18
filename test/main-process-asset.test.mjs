import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {mainProcessAsset} from "../src/main-process-asset.mjs";

const root = fs.mkdtempSync(path.join(os.tmpdir(), "tmtk-main-owner-"));
try {
  const build = path.join(root, ".vite/build");
  fs.mkdirSync(build, {recursive: true});
  const legacy = path.join(build, "main-fixture.js");
  fs.writeFileSync(legacy, "export const fixture=true;");
  assert.equal(mainProcessAsset(root), legacy);
  const current = path.join(build, "early-bootstrap-916-2f6483d5bfd826f1.js");
  fs.writeFileSync(current, 'exports.ids=[916],exports.modules={};let eeC=(0,em.vB9)("electron-message-handler");');
  fs.writeFileSync(path.join(root, "package.json"), JSON.stringify({main: ".vite/build/early-bootstrap.js", version: "26.1027.30824", codexBuildNumber: "22943"}));
  fs.writeFileSync(path.join(build, "early-bootstrap.js"), '339:"aea964a206c655e4",916:"2f6483d5bfd826f1"');
  fs.writeFileSync(path.join(build, "early-bootstrap-339-aea964a206c655e4.js"), 'let{runMainAppStartup:e}=await Promise.all([n.e(419),n.e(916)]).then(n.bind(n,61071));await e()');
  assert.throws(() => mainProcessAsset(root), /ambiguous/, "mixed package owners are rejected");
  fs.rmSync(legacy);
  assert.equal(mainProcessAsset(root), current);
  fs.writeFileSync(path.join(root, "package.json"), JSON.stringify({main: "other.js", version: "26.1027.30824", codexBuildNumber: "22943"}));
  assert.throws(() => mainProcessAsset(root), /unrecognized/, "an orphaned familiar chunk is not the entry owner");
  fs.rmSync(current);
  const next = path.join(build, "early-bootstrap-100-449e39ca9c7eadbd.js");
  fs.writeFileSync(next, 'exports.ids=[100],exports.modules={};let erS=(0,e6.vB9)("electron-message-handler");');
  fs.writeFileSync(path.join(root, "package.json"), JSON.stringify({main: ".vite/build/early-bootstrap.js", version: "26.1111.71025", codexBuildNumber: "28661"}));
  fs.writeFileSync(path.join(build, "early-bootstrap.js"), '631:"9c86108a3befe979",100:"449e39ca9c7eadbd"');
  fs.writeFileSync(path.join(build, "early-bootstrap-631-9c86108a3befe979.js"), 'let{runMainAppStartup:e}=await Promise.all([n.e(419),n.e(100)]).then(n.bind(n,22423));await e()');
  assert.equal(mainProcessAsset(root), next);
  console.log("main-process asset ownership probe passed");
} finally {
  fs.rmSync(root, {recursive: true, force: true});
}

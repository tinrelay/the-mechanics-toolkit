#!/usr/bin/env node
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {spawnSync} from "node:child_process";
import {fileURLToPath} from "node:url";
import {sha256File} from "../src/app-bundle.mjs";
import {stageRpm} from "../src/stage-rpm.mjs";

if (process.platform !== "linux" || !commandAvailable("/usr/bin/rpmbuild") ||
    !commandAvailable("/usr/bin/rpm2cpio") || !commandAvailable("/usr/bin/cpio")) {
  process.stdout.write("Linux production RPM staging fixture skipped on this platform\n");
  process.exit(0);
}

const repository = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const scratch = fs.mkdtempSync(path.join(os.tmpdir(), "mechanics-toolkit-stage-rpm-test-"));
try {
  const source = path.join(scratch, "chatgpt-fixture.rpm");
  const destination = path.join(scratch, "chatgpt-fixture-tmtk.rpm");
  const config = path.join(scratch, "toolkit.json");
  buildSourceRpm(source);
  fs.writeFileSync(config, `${JSON.stringify({
    enabledPatches: ["safe-start-readiness", "renderer-patch-registry"]
  })}\n`);
  const sourceSha256 = sha256File(source);
  const result = stageRpm({
    sourceRpm: source,
    destinationRpm: destination,
    configPath: config,
    repositoryRoot: repository,
    scratchParent: scratch,
    sourceInspector: authenticatedFixtureSource
  });
  assert.equal(result.state, "staged-rpm-static-proof-green");
  assert.deepEqual(result.patches, ["safe-start-readiness", "renderer-patch-registry"]);
  assert.equal(result.source.sha256, sourceSha256);
  assert.equal(sha256File(source), sourceSha256, "production staging leaves its source byte-identical");
  assert.equal(fs.existsSync(destination), true);
  assert.equal(query(destination, "%{VERSION}-%{RELEASE}"), "26.911.61220-1.tmtk1");
  assert.equal(query(destination, "[%{FILENAMES}\\n]").includes("/usr\n"), false,
    "rebuilt RPM must not claim the filesystem-owned /usr directory");
  assert.equal(query(destination, "[%{FILENAMES}\\n]").includes("/usr/lib\n"), false,
    "rebuilt RPM must not claim the filesystem-owned /usr/lib directory");
  assert.deepEqual(stageScratchDirectories(), [], "successful staging removes its scratch tree");

  const refused = path.join(scratch, "refused.rpm");
  const refusedConfig = path.join(scratch, "refused-toolkit.json");
  fs.writeFileSync(refusedConfig, `${JSON.stringify({
    enabledPatches: [
      "terminal-toggle",
      "safe-start-readiness",
      "renderer-patch-registry"
    ]
  })}\n`);
  assert.throws(() => stageRpm({
    sourceRpm: source,
    destinationRpm: refused,
    configPath: refusedConfig,
    repositoryRoot: repository,
    scratchParent: scratch,
    sourceInspector: authenticatedFixtureSource
  }), /terminal-toggle[\\/]patch\.mjs check/);
  assert.equal(fs.existsSync(refused), false);
  assert.deepEqual(stageScratchDirectories(), [], "refusal leaves no staging scratch tree");
  process.stdout.write("Linux production RPM staging fixture passed\n");
} finally {
  fs.rmSync(scratch, {recursive: true, force: true});
}

function buildSourceRpm(destination) {
  const payload = path.join(scratch, "source-payload");
  const buildRoot = path.join(scratch, "source-root");
  const app = path.join(payload, "usr/lib/chatgpt");
  const resources = path.join(app, "resources");
  const asarRoot = path.join(scratch, "asar-root");
  const spec = path.join(scratch, "fixture.spec");
  const topdir = path.join(scratch, "fixture-rpmbuild");
  fs.mkdirSync(path.join(asarRoot, ".vite/build"), {recursive: true});
  fs.mkdirSync(path.join(asarRoot, "webview/assets"), {recursive: true});
  fs.mkdirSync(path.join(asarRoot, "node_modules/native"), {recursive: true});
  fs.mkdirSync(path.join(asarRoot, "node_modules/@parcel/watcher-linux-arm64-glibc"), {
    recursive: true
  });
  fs.mkdirSync(resources, {recursive: true});
  fs.writeFileSync(path.join(asarRoot, "package.json"), `${JSON.stringify({
    name: "openai-codex-electron",
    desktopName: "chatgpt.desktop",
    version: "26.911.61220",
    codexBuildNumber: "9647"
  })}\n`);
  fs.writeFileSync(path.join(asarRoot, ".vite/build/main-fixture.js"),
    "var vae=`CODEX_ELECTRON_DEV_RELAUNCH_MARKER_PATH`;function Cae({markerPath:e=process.env[vae]?.trim(),writeMarker:t=()=>{}}={}){return t(e),!0}function owner(){let N=()=>true,r={lt:1},l={ipcMain:{handle(){}}};l.ipcMain.handle(r.lt,async(t,s)=>{if(!N(t))return;if(s.type===`electron-avatar-overlay-restore-ready`)return})}");
  fs.writeFileSync(path.join(asarRoot, "webview/assets/app-initial-fixture.js"),
    "const g={dispatchMessage(){}};function MHs(){g.dispatchMessage(`ready`,{persistedStateResponsePriority:R9?`critical`:void 0})}");
  fs.writeFileSync(path.join(asarRoot, "node_modules/native/addon.node"), "native-fixture");
  fs.writeFileSync(path.join(asarRoot,
    "node_modules/@parcel/watcher-linux-arm64-glibc/watcher.node"), "standalone-native-fixture");
  fs.writeFileSync(path.join(resources, "linux-package-metadata.json"), `${JSON.stringify({
    codexAppBrand: "chatgpt",
    codexBuildFlavor: "prod",
    version: "26.911.61220"
  })}\n`);
  for (const executable of [path.join(app, "ChatGPT"), path.join(resources, "codex")]) {
    fs.writeFileSync(executable, "#!/bin/sh\nexit 0\n");
    fs.chmodSync(executable, 0o755);
  }
  run(path.join(repository, "node_modules/.bin/asar"), [
    "pack", asarRoot, path.join(resources, "app.asar"),
    "--unpack-dir", "node_modules/native", "--unpack", "watcher.node"
  ]);
  const architecture = process.arch === "arm64" ? "aarch64" : "x86_64";
  fs.writeFileSync(spec, [
    "%global debug_package %{nil}",
    "%global __os_install_post %{nil}",
    "Name: chatgpt",
    "Version: 26.911.61220",
    "Release: 1",
    "Summary: fixture ChatGPT package",
    "License: Proprietary",
    "URL: https://example.invalid",
    `BuildArch: ${architecture}`,
    "AutoReqProv: no",
    "",
    "%description",
    "fixture ChatGPT package",
    "",
    "%prep",
    "%build",
    "%install",
    `cp -a ${payload}/. %{buildroot}`,
    "",
    "%files",
    "/usr/lib/chatgpt",
    ""
  ].join("\n"));
  run("/usr/bin/rpmbuild", [
    "-bb", spec,
    "--buildroot", buildRoot,
    "--target", architecture,
    "--noclean",
    "--define", `_topdir ${topdir}`,
    "--define", `_rpmdir ${path.join(scratch, "fixture-RPMS")}`
  ]);
  const built = findRpm(path.join(scratch, "fixture-RPMS"));
  fs.renameSync(built, destination);
  fs.rmSync(payload, {recursive: true, force: true});
  fs.rmSync(buildRoot, {recursive: true, force: true});
  fs.rmSync(asarRoot, {recursive: true, force: true});
  fs.rmSync(topdir, {recursive: true, force: true});
  fs.rmSync(path.join(scratch, "fixture-RPMS"), {recursive: true, force: true});
}

function authenticatedFixtureSource(file) {
  return {
    packageKind: "vendor",
    originSignature: {state: "valid", fingerprint: "3".repeat(40)},
    rpmSha256: sha256File(file),
    package: "chatgpt",
    version: "26.911.61220",
    release: "1",
    packageVersion: "26.911.61220-1",
    architecture: process.arch === "arm64" ? "aarch64" : "x86_64"
  };
}

function query(file, format) {
  return run("/usr/bin/rpm", ["--query", "--package", file, "--queryformat", format]).stdout;
}

function findRpm(root) {
  const found = [];
  walk(root, file => {
    if (fs.lstatSync(file).isFile() && file.endsWith(".rpm")) found.push(file);
  });
  assert.equal(found.length, 1);
  return found[0];
}

function stageScratchDirectories() {
  return fs.readdirSync(scratch).filter(name => name.startsWith("mechanics-toolkit-rpm-"));
}

function commandAvailable(command) {
  try {
    fs.accessSync(command, fs.constants.X_OK);
    return true;
  } catch {
    return false;
  }
}

function run(command, arguments_) {
  const result = spawnSync(command, arguments_, {encoding: "utf8", maxBuffer: 64 * 1024 * 1024});
  assert.equal(result.status, 0, result.stderr || result.stdout);
  return result;
}

function walk(root, visit, current = root) {
  const relative = path.relative(root, current);
  if (relative !== "") visit(current);
  if (!fs.lstatSync(current).isDirectory()) return;
  for (const entry of fs.readdirSync(current).sort()) walk(root, visit, path.join(current, entry));
}

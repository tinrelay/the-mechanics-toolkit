#!/usr/bin/env node
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {spawnSync} from "node:child_process";
import {fileURLToPath} from "node:url";
import {sha256File} from "../src/app-bundle.mjs";
import {
  compareMsixVersions,
  stageMsix,
  temporaryPackagePath,
  windowsConfig
} from "../src/stage-msix.mjs";

assert.equal(compareMsixVersions("26.908.4834.1", "26.908.4834.0"), 1);
assert.equal(compareMsixVersions("26.908.4834.1", "26.908.4834.1"), 0);
assert.equal(compareMsixVersions("26.908.4833.65535", "26.908.4834.0"), -1);
assert.throws(() => compareMsixVersions("26.908.4834", "26.908.4834.0"),
  /Invalid MSIX package version/);
assert.throws(() => compareMsixVersions("26.908.4834.65536", "26.908.4834.0"),
  /out of range/);

const windows = {
  candidateVersion: "26.908.4834.6",
  knownGoodVersion: "26.908.4834.7",
  makeAppx: String.raw`C:\tools\makeappx.exe`,
  signTool: String.raw`C:\tools\signtool.exe`,
  signingCertificateThumbprint: "B3521CC4DA7ED2BB47F0C0A43109428A634109B2",
  codexBinaries: {
    native: String.raw`C:\build\codex.exe`,
    wsl: String.raw`C:\build\codex`
  }
};
assert.equal(windowsConfig(windows), windows);
assert.throws(() => windowsConfig({...windows, candidateVersion: "1.2.3"}),
  /Invalid MSIX package version/);
assert.throws(() => windowsConfig({...windows, makeAppx: "makeappx.exe"}),
  /absolute Windows path/);
assert.throws(() => windowsConfig({...windows, surprise: true}),
  /Unknown toolkit config windows keys/);
assert.throws(() => windowsConfig({...windows, signingCertificateThumbprint: "short"}),
  /SHA-1 thumbprint/);
assert.throws(() => stageMsix({platform: "darwin"}), /must run on Windows/);
assert.match(temporaryPackagePath("candidate.msix"),
  /^candidate\.tmp-\d+-[0-9a-f-]{36}\.msix$/,
  "temporary package names retain the MSIX extension required by SignTool");

const repository = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const scratch = fs.mkdtempSync(path.join(os.tmpdir(), "mechanics-toolkit-stage-msix-test-"));
try {
  const candidateSource = path.join(scratch,
    "OpenAI.Codex_26.908.4834.0_arm64__2p2nqsd0c76g0");
  const knownGoodSource = path.join(scratch,
    "OpenAI.Codex_26.908.4834.5_arm64__2p2nqsd0c76g0");
  const candidate = path.join(scratch, "candidate.msix");
  const knownGood = path.join(scratch, "known-good.msix");
  const config = path.join(scratch, "toolkit.json");
  buildSourceApplication(candidateSource, "26.908.4834.0", "pristine-candidate");
  buildSourceApplication(knownGoodSource, "26.908.4834.5", "live-known-good");
  writeConfig(config, ["safe-start-readiness", "renderer-patch-registry"]);
  const candidateSourceBefore = installedInspection(candidateSource);
  const knownGoodSourceBefore = installedInspection(knownGoodSource);
  assert.notEqual(candidateSourceBefore.archive.sha256, knownGoodSourceBefore.archive.sha256,
    "fixture sources deliberately have different ASARs");
  const packageContents = new Map();
  const result = stageMsix({
    candidateSourceApp: candidateSource,
    knownGoodSourceApp: knownGoodSource,
    candidateMsix: candidate,
    knownGoodMsix: knownGood,
    configPath: config,
    repositoryRoot: repository,
    platform: "win32",
    processRunner: fixtureRunner(packageContents),
    sourceInspector: source => packageContents.has(path.resolve(source))
      ? packageInspection(source, packageContents)
      : installedInspection(source),
    scratchParent: scratch
  });
  assert.equal(result.state, "staged-msix-static-proof-green");
  assert.deepEqual(result.patches, ["safe-start-readiness", "renderer-patch-registry"]);
  assert.equal(result.candidateSource.asarSha256, candidateSourceBefore.archive.sha256);
  assert.equal(result.knownGoodSource.asarSha256, knownGoodSourceBefore.archive.sha256);
  assert.equal(result.knownGood.asarSha256, knownGoodSourceBefore.archive.sha256);
  assert.notEqual(result.candidate.asarSha256, candidateSourceBefore.archive.sha256);
  assert.equal(fs.existsSync(candidate), true);
  assert.equal(fs.existsSync(knownGood), true);
  assert.deepEqual(stageScratchDirectories(), [], "successful staging removes its scratch tree");

  const refused = path.join(scratch, "refused.msix");
  const refusedKnownGood = path.join(scratch, "refused-known-good.msix");
  const refusedConfig = path.join(scratch, "refused-toolkit.json");
  writeConfig(refusedConfig, [
    "terminal-toggle",
    "safe-start-readiness",
    "renderer-patch-registry"
  ]);
  const refusedContents = new Map();
  assert.throws(() => stageMsix({
    candidateSourceApp: candidateSource,
    knownGoodSourceApp: knownGoodSource,
    candidateMsix: refused,
    knownGoodMsix: refusedKnownGood,
    configPath: refusedConfig,
    repositoryRoot: repository,
    platform: "win32",
    processRunner: fixtureRunner(refusedContents),
    sourceInspector: source => refusedContents.has(path.resolve(source))
      ? packageInspection(source, refusedContents)
      : installedInspection(source),
    scratchParent: scratch
  }), /terminal-toggle[\\/]patch\.mjs check/);
  assert.equal(fs.existsSync(refused), false);
  assert.equal(fs.existsSync(refusedKnownGood), false);
  assert.deepEqual(stageScratchDirectories(), [], "refusal leaves no staging scratch tree");

  for (const [label, mismatch] of [
    ["identity", inspection => ({
      ...inspection,
      package: {...inspection.package, familyName: "Different.Package_family"}
    })],
    ["inner-build", inspection => ({...inspection, build: "different-build"})]
  ]) {
    const mismatchedCandidate = path.join(scratch, `${label}-mismatched-candidate.msix`);
    const mismatchedKnownGood = path.join(scratch, `${label}-mismatched-known-good.msix`);
    assert.throws(() => stageMsix({
      candidateSourceApp: candidateSource,
      knownGoodSourceApp: knownGoodSource,
      candidateMsix: mismatchedCandidate,
      knownGoodMsix: mismatchedKnownGood,
      configPath: config,
      repositoryRoot: repository,
      platform: "win32",
      processRunner: fixtureRunner(new Map()),
      sourceInspector: source => {
        const inspection = installedInspection(source);
        return source === knownGoodSource ? mismatch(inspection) : inspection;
      },
      scratchParent: scratch
    }), /do not share the exact inner identity/);
    assert.equal(fs.existsSync(mismatchedCandidate), false);
    assert.equal(fs.existsSync(mismatchedKnownGood), false);
  }

  const manifestCandidate = path.join(scratch, "manifest-corruption-candidate.msix");
  const manifestKnownGood = path.join(scratch, "manifest-corruption-known-good.msix");
  const manifestContents = new Map();
  assert.throws(() => stageMsix({
    candidateSourceApp: candidateSource,
    knownGoodSourceApp: knownGoodSource,
    candidateMsix: manifestCandidate,
    knownGoodMsix: manifestKnownGood,
    configPath: config,
    repositoryRoot: repository,
    platform: "win32",
    processRunner: fixtureRunner(manifestContents, {corruptManifestSource: knownGoodSource}),
    sourceInspector: source => manifestContents.has(path.resolve(source))
      ? packageInspection(source, manifestContents)
      : installedInspection(source),
    scratchParent: scratch
  }), /does not preserve the exact source identity/);
  assert.equal(fs.existsSync(manifestCandidate), false);
  assert.equal(fs.existsSync(manifestKnownGood), false);

  const diagnosticCandidate = path.join(scratch, "diagnostic-candidate.msix");
  const diagnosticKnownGood = path.join(scratch, "diagnostic-known-good.msix");
  const diagnosticContents = new Map();
  assert.throws(() => stageMsix({
    candidateSourceApp: candidateSource,
    knownGoodSourceApp: knownGoodSource,
    candidateMsix: diagnosticCandidate,
    knownGoodMsix: diagnosticKnownGood,
    configPath: config,
    repositoryRoot: repository,
    platform: "win32",
    processRunner: fixtureRunner(diagnosticContents, {failSecondExtract: true}),
    sourceInspector: source => diagnosticContents.has(path.resolve(source))
      ? packageInspection(source, diagnosticContents)
      : installedInspection(source),
    scratchParent: scratch
  }), /DISTINCTIVE-MAKEAPPX-UNPACK-DIAGNOSTIC/);
  assert.equal(fs.existsSync(diagnosticCandidate), false);
  assert.equal(fs.existsSync(diagnosticKnownGood), false);
  assert.deepEqual(stageScratchDirectories(), [], "diagnostic failure cleans staging scratch");

  verifyChangingSourceFails({candidateSource, knownGoodSource, config});
  process.stdout.write("Windows production MSIX staging fixture passed\n");
} finally {
  fs.rmSync(scratch, {recursive: true, force: true});
}

function verifyChangingSourceFails({candidateSource, knownGoodSource, config}) {
  for (const [label, changedSource] of [
    ["candidate", candidateSource],
    ["known-good", knownGoodSource]
  ]) {
    const candidate = path.join(scratch, `${label}-changed-candidate.msix`);
    const knownGood = path.join(scratch, `${label}-changed-known-good.msix`);
    const packageContents = new Map();
    const runFixture = fixtureRunner(packageContents);
    const changedFile = path.join(changedSource, "changed-during-staging.txt");
    let changed = false;
    try {
      assert.throws(() => stageMsix({
        candidateSourceApp: candidateSource,
        knownGoodSourceApp: knownGoodSource,
        candidateMsix: candidate,
        knownGoodMsix: knownGood,
        configPath: config,
        repositoryRoot: repository,
        platform: "win32",
        processRunner(program, arguments_, options) {
          const action = arguments_[arguments_.indexOf("-File") + 2];
          if (!changed && action === "build-package") {
            fs.writeFileSync(changedFile, "changed");
            changed = true;
          }
          return runFixture(program, arguments_, options);
        },
        sourceInspector: source => packageContents.has(path.resolve(source))
          ? packageInspection(source, packageContents)
          : installedInspection(source),
        scratchParent: scratch
      }), new RegExp(`${label === "candidate" ? "Candidate" : "Known-good"} source bytes`));
      assert.equal(fs.existsSync(candidate), false);
      assert.equal(fs.existsSync(knownGood), false);
    } finally {
      fs.rmSync(changedFile, {force: true});
    }
  }
}

function buildSourceApplication(source, outerVersion, marker) {
  const resources = path.join(source, "app/resources");
  const asarRoot = fs.mkdtempSync(path.join(scratch, "asar-root-"));
  fs.mkdirSync(resources, {recursive: true});
  fs.mkdirSync(path.join(asarRoot, ".vite/build"), {recursive: true});
  fs.mkdirSync(path.join(asarRoot, "webview/assets"), {recursive: true});
  fs.mkdirSync(path.join(asarRoot, "node_modules/native"), {recursive: true});
  fs.writeFileSync(path.join(source, "AppxManifest.xml"), manifest(outerVersion, marker));
  fs.writeFileSync(path.join(source, "app/ChatGPT.exe"), "signed-executable-fixture");
  fs.writeFileSync(path.join(resources, "codex.exe"), "native-codex-fixture");
  fs.writeFileSync(path.join(resources, "codex"), "wsl-codex-fixture");
  fs.writeFileSync(path.join(asarRoot, "package.json"), `${JSON.stringify({
    name: "openai-codex-electron",
    version: "26.911.61220",
    codexBuildNumber: "9647",
    devDependencies: {electron: "42.3.0"}
  })}\n`);
  fs.writeFileSync(path.join(asarRoot, ".vite/build/main-fixture.js"),
    "var vae=`CODEX_ELECTRON_DEV_RELAUNCH_MARKER_PATH`;function Cae({markerPath:e=process.env[vae]?.trim(),writeMarker:t=()=>{}}={}){return t(e),!0}function owner(){let N=()=>true,r={lt:1},l={ipcMain:{handle(){}}};l.ipcMain.handle(r.lt,async(t,s)=>{if(!N(t))return;if(s.type===`electron-avatar-overlay-restore-ready`)return})}");
  fs.writeFileSync(path.join(asarRoot, "webview/assets/app-initial-fixture.js"),
    "const g={dispatchMessage(){}};function MHs(){g.dispatchMessage(`ready`,{persistedStateResponsePriority:R9?`critical`:void 0})}");
  fs.writeFileSync(path.join(asarRoot, "node_modules/native/addon.node"), "native-fixture");
  fs.writeFileSync(path.join(asarRoot, "source-marker.txt"), marker);
  run(process.execPath, [
    path.join(repository, "node_modules/@electron/asar/bin/asar.mjs"),
    "pack", asarRoot, path.join(resources, "app.asar"),
    "--unpack-dir", "node_modules/native"
  ]);
  fs.rmSync(asarRoot, {recursive: true, force: true});
}

function writeConfig(file, enabledPatches) {
  fs.writeFileSync(file, `${JSON.stringify({enabledPatches, windows})}\n`);
}

function fixtureRunner(packageContents, {
  corruptManifestSource = null,
  failSecondExtract = false
} = {}) {
  let extractionCount = 0;
  return (program, arguments_, options) => {
    if (program === process.execPath) return spawnSync(program, arguments_, options);
    assert.equal(program, "powershell.exe");
    const actionIndex = arguments_.indexOf("-File") + 2;
    const action = arguments_[actionIndex];
    const values = arguments_.slice(actionIndex + 1);
    if (action === "validate-tools") {
      return ok({
        certificate: {thumbprint: windows.signingCertificateThumbprint.toLowerCase()}
      });
    }
    if (action === "copy-package-content") {
      const [source, destination, version] = values;
      fs.cpSync(source, destination, {recursive: true, preserveTimestamps: true});
      const sourceManifest = fs.readFileSync(path.join(source, "AppxManifest.xml"), "utf8");
      const expectedManifest = replaceManifestVersion(sourceManifest, version);
      const copiedManifest = source === corruptManifestSource
        ? expectedManifest.replace("internetClient", "privateNetworkClientServer")
        : expectedManifest;
      fs.writeFileSync(path.join(destination, "AppxManifest.xml"), copiedManifest);
      return ok({
        sourceVersion: installedInspection(source).package.outerVersion,
        manifest: fixtureManifestIdentity(version),
        manifestPreserved: copiedManifest === expectedManifest,
        normalizedManifestSha256: "0".repeat(64)
      });
    }
    if (action === "build-package") {
      const [content, output] = values;
      const version = manifestVersion(path.join(content, "AppxManifest.xml"));
      fs.writeFileSync(output, `fixture-msix:${version}:${sha256File(path.join(
        content, "app/resources/app.asar"))}\n`);
      packageContents.set(path.resolve(output), {content, version});
      return ok({
        sha256: sha256File(output),
        signature: "Valid",
        signerThumbprint: windows.signingCertificateThumbprint.toLowerCase()
      });
    }
    if (action === "extract-package") {
      extractionCount += 1;
      if (failSecondExtract && extractionCount === 2) {
        return failed("MakeAppx unpack failed: 1\nDISTINCTIVE-MAKEAPPX-UNPACK-DIAGNOSTIC");
      }
      const [packageFile, destination] = values;
      const built = packageContents.get(path.resolve(packageFile));
      assert.ok(built, `missing fixture package content for ${packageFile}`);
      fs.cpSync(built.content, destination, {recursive: true, preserveTimestamps: true});
      return ok({content: destination, manifest: fixtureManifestIdentity(built.version)});
    }
    throw new Error(`unexpected Windows staging helper action: ${action}`);
  };
}

function installedInspection(source) {
  const outerVersion = manifestVersion(path.join(source, "AppxManifest.xml"));
  return {
    app: source,
    identifier: "OpenAI.Codex",
    version: "26.911.61220",
    build: "9647",
    electron: "42.3.0",
    package: {
      fullName: path.basename(source),
      familyName: "OpenAI.Codex_2p2nqsd0c76g0",
      publisher: "CN=50BDFD77-8903-4850-9FFE-6E8522F64D5B",
      outerVersion,
      architecture: "arm64",
      status: "Ok",
      signatureKind: "Store",
      applicationId: "OpenAI.Codex_2p2nqsd0c76g0!App"
    },
    archive: {
      path: path.join(source, "app/resources/app.asar"),
      sha256: sha256File(path.join(source, "app/resources/app.asar"))
    },
    asarIntegrity: {state: "not-present"},
    signature: {state: "valid", executable: "Valid"}
  };
}

function packageInspection(packageFile, packageContents) {
  const built = packageContents.get(path.resolve(packageFile));
  assert.ok(built, `missing fixture inspection content for ${packageFile}`);
  const archive = path.join(built.content, "app/resources/app.asar");
  return {
    app: packageFile,
    identifier: "OpenAI.Codex",
    version: "26.911.61220",
    build: "9647",
    electron: "42.3.0",
    package: {
      fullName: `OpenAI.Codex_${built.version}_arm64__2p2nqsd0c76g0`,
      familyName: "OpenAI.Codex_2p2nqsd0c76g0",
      publisher: "CN=50BDFD77-8903-4850-9FFE-6E8522F64D5B",
      outerVersion: built.version,
      architecture: "arm64",
      status: "Ok",
      signatureKind: "PackageFile",
      applicationId: "OpenAI.Codex_2p2nqsd0c76g0!App"
    },
    artifact: {path: packageFile, sha256: sha256File(packageFile)},
    archive: {path: "app/resources/app.asar", sha256: sha256File(archive)},
    asarIntegrity: {state: "not-present"},
    signature: {state: "valid", package: "Valid", executable: "Valid"}
  };
}

function fixtureManifestIdentity(version) {
  return {
    name: "OpenAI.Codex",
    publisher: "CN=50BDFD77-8903-4850-9FFE-6E8522F64D5B",
    version,
    architecture: "arm64",
    resourceId: "",
    applicationId: "OpenAI.Codex_2p2nqsd0c76g0!App"
  };
}

function manifest(version, marker = "fixture") {
  return `<?xml version="1.0" encoding="utf-8"?>\n<Package xmlns="http://schemas.microsoft.com/appx/manifest/foundation/windows10" xmlns:uap="http://schemas.microsoft.com/appx/manifest/uap/windows10"><Identity Name="OpenAI.Codex" Publisher="CN=50BDFD77-8903-4850-9FFE-6E8522F64D5B" Version="${version}" ProcessorArchitecture="arm64" ResourceId=""/><Applications><Application Id="App" Executable="app\\ChatGPT.exe" EntryPoint="Windows.FullTrustApplication" StartPage="${marker}.html"><Extensions><uap:Extension Category="windows.appService"><uap:AppService Name="${marker}.service"/></uap:Extension></Extensions></Application></Applications><Capabilities><Capability Name="internetClient"/></Capabilities></Package>\n`;
}

function replaceManifestVersion(value, version) {
  return value.replace(/\bVersion="[^"]+"/, `Version="${version}"`);
}

function manifestVersion(file) {
  const match = fs.readFileSync(file, "utf8").match(/\bVersion="([^"]+)"/);
  assert.ok(match);
  return match[1];
}

function stageScratchDirectories() {
  return fs.readdirSync(scratch).filter(name => name.startsWith("mechanics-toolkit-msix-"));
}

function ok(value) {
  return {status: 0, stdout: `${JSON.stringify(value)}\n`, stderr: "", error: null};
}

function failed(message) {
  return {status: 1, stdout: "", stderr: message, error: null};
}

function run(program, arguments_) {
  const result = spawnSync(program, arguments_, {encoding: "utf8"});
  assert.equal(result.status, 0, result.stderr || result.stdout);
  return result;
}

import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {spawnSync} from "node:child_process";
import {fileURLToPath} from "node:url";
import {listPackage} from "@electron/asar";
import {sha256File} from "./app-bundle.mjs";
import {inspectApplicationSource} from "./platforms/windows.mjs";
import {
  applyPatchFleet,
  equalRecords,
  readToolkitConfig,
  recordDifferences,
  selectedPatches,
  treeSnapshot,
  verifyPatchFleet
} from "./stage-patch-fleet.mjs";

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const windowsHelper = path.join(currentDirectory, "windows-msix.ps1");
const powershell = "powershell.exe";
const generatedPackagePaths = new Set([
  "AppxBlockMap.xml",
  "AppxSignature.p7x",
  "AppxMetadata",
  "microsoft.system.package.metadata"
]);
const standaloneTargets = new Set([
  "app/resources/codex",
  "app/resources/codex.exe"
]);

export function stageMsix({
  candidateSourceApp,
  knownGoodSourceApp,
  candidateMsix,
  knownGoodMsix,
  configPath,
  repositoryRoot,
  platform = process.platform,
  processRunner = spawnSync,
  sourceInspector = inspectApplicationSource,
  scratchParent = os.tmpdir()
}) {
  if (platform !== "win32") throw new Error("MSIX staging must run on Windows");
  const candidateSource = path.resolve(candidateSourceApp);
  const knownGoodSource = path.resolve(knownGoodSourceApp);
  const candidate = path.resolve(candidateMsix);
  const knownGood = path.resolve(knownGoodMsix);
  const configFile = path.resolve(configPath);
  const repository = path.resolve(repositoryRoot);
  const asar = path.join(repository, "node_modules/@electron/asar/bin/asar.mjs");
  requireFile(asar, "repository-local asar CLI; run npm install");
  validateDestinations(candidateSource, knownGoodSource, candidate, knownGood);

  const config = readToolkitConfig(configFile, {platformKeys: ["windows"]});
  const windows = windowsConfig(config.windows);
  const selected = selectedPatches(config.enabledPatches);
  validatePatchScopes(selected);
  const hasAsarPatches = selected.some(definition => definition.scope === "asar");
  const hasStandaloneRepair = selected.some(definition =>
    definition.name === "standalone-output-compaction"
  );

  const candidateSourceBefore = sourceInspector(candidateSource);
  const knownGoodSourceBefore = sourceInspector(knownGoodSource);
  requireValidSource(candidateSourceBefore);
  requireValidSource(knownGoodSourceBefore);
  requireMatchingSources(candidateSourceBefore, knownGoodSourceBefore);
  if (compareMsixVersions(windows.candidateVersion,
    candidateSourceBefore.package.outerVersion) <= 0 ||
      compareMsixVersions(windows.candidateVersion,
        knownGoodSourceBefore.package.outerVersion) <= 0) {
    throw new Error("Windows candidate MSIX version must be newer than both source packages");
  }
  if (compareMsixVersions(windows.knownGoodVersion, windows.candidateVersion) <= 0) {
    throw new Error("Windows known-good MSIX version must be newer than the candidate package");
  }

  const prerequisites = helperJson("validate-tools", [
    windows.makeAppx,
    windows.signTool,
    windows.signingCertificateThumbprint
  ], processRunner);
  requirePrerequisiteMatch(prerequisites, windows);

  const scratch = fs.mkdtempSync(path.join(scratchParent, "mechanics-toolkit-msix-"));
  const temporaryCandidate = temporaryPackagePath(candidate);
  const temporaryKnownGood = temporaryPackagePath(knownGood);
  let candidateCreated = false;
  let knownGoodCreated = false;
  let complete = false;
  try {
    const candidateSourceContent = materializeSource({
      source: candidateSource,
      destination: path.join(scratch, "candidate-source"),
      makeAppx: windows.makeAppx,
      processRunner
    });
    const knownGoodSourceContent = materializeSource({
      source: knownGoodSource,
      destination: path.join(scratch, "known-good-source"),
      makeAppx: windows.makeAppx,
      processRunner
    });
    const candidateSourceSnapshot = sourceSnapshot(candidateSource);
    const knownGoodSourceSnapshot = sourceSnapshot(knownGoodSource);
    const candidateContent = path.join(scratch, "candidate-content");
    const knownGoodContent = path.join(scratch, "known-good-content");
    const candidateCopy = helperJson("copy-package-content", [
      candidateSourceContent, candidateContent, windows.candidateVersion
    ], processRunner);
    const knownGoodCopy = helperJson("copy-package-content", [
      knownGoodSourceContent, knownGoodContent, windows.knownGoodVersion
    ], processRunner);
    requireCopiedIdentity(candidateCopy, candidateSourceBefore, windows.candidateVersion);
    requireCopiedIdentity(knownGoodCopy, knownGoodSourceBefore, windows.knownGoodVersion);

    const candidateBefore = treeSnapshot(candidateContent);
    const knownGoodBefore = treeSnapshot(knownGoodContent);
    requireSourceCopy(treeSnapshot(candidateSourceContent), candidateBefore, "Candidate",
      candidateCopy.manifestPreserved);
    requireSourceCopy(treeSnapshot(knownGoodSourceContent), knownGoodBefore, "Known-good",
      knownGoodCopy.manifestPreserved);
    const sourceResources = path.join(candidateSourceContent, "app/resources");
    const candidateResources = path.join(candidateContent, "app/resources");
    const sourceArchive = path.join(sourceResources, "app.asar");
    const candidateArchive = path.join(candidateResources, "app.asar");
    const sourceUnpacked = `${sourceArchive}.unpacked`;
    const candidateUnpacked = `${candidateArchive}.unpacked`;
    requireDirectory(sourceUnpacked, "source unpacked native-module directory");
    requireDirectory(candidateUnpacked, "copied unpacked native-module directory");
    const sourceNative = treeSnapshot(sourceUnpacked);
    if (!equalRecords(sourceNative, treeSnapshot(candidateUnpacked))) {
      throw new Error("Candidate content copy did not preserve the source native-module tree");
    }
    const unpackedPaths = asarUnpackedPaths(sourceArchive);
    const unpackRules = deriveUnpackRules(unpackedPaths, sourceUnpacked);

    const extracted = path.join(scratch, "candidate-asar");
    run(process.execPath, [asar, "extract", candidateArchive, extracted], processRunner);
    const fleet = applyPatchFleet({
      selected,
      roots: {app: candidateContent, asar: extracted},
      configFile,
      config,
      repository,
      sourceLabel: "Pristine candidate source package"
    });

    if (hasAsarPatches) {
      const newArchive = `${candidateArchive}.tmtk-new`;
      const newUnpacked = `${newArchive}.unpacked`;
      fs.rmSync(newArchive, {force: true});
      fs.rmSync(newUnpacked, {recursive: true, force: true});
      run(process.execPath, [asar, "pack", extracted, newArchive, ...unpackArguments(unpackRules)],
        processRunner);
      if (!equalRecords(unpackedPaths, asarUnpackedPaths(newArchive))) {
        throw new Error("ASAR repack did not preserve the source unpacked-header paths");
      }
      requireDirectory(newUnpacked, "repacked native-module directory");
      fs.cpSync(sourceUnpacked, newUnpacked, {
        recursive: true,
        force: true,
        preserveTimestamps: true,
        verbatimSymlinks: true
      });
      if (!equalRecords(sourceNative, treeSnapshot(newUnpacked))) {
        throw new Error(`ASAR repack did not preserve the native-module tree: ${
          recordDifferences(sourceNative, treeSnapshot(newUnpacked))}`);
      }
      fs.rmSync(candidateArchive, {force: true});
      fs.rmSync(candidateUnpacked, {recursive: true, force: true});
      fs.renameSync(newArchive, candidateArchive);
      fs.renameSync(newUnpacked, candidateUnpacked);
    }

    verifyAllowedContentChanges(candidateBefore, treeSnapshot(candidateContent), {
      standaloneRepair: hasStandaloneRepair
    });
    if (!equalRecords(knownGoodBefore, treeSnapshot(knownGoodContent))) {
      throw new Error("Known-good package content changed before packaging");
    }

    const candidateBuild = helperJson("build-package", [
      candidateContent,
      temporaryCandidate,
      windows.makeAppx,
      windows.signTool,
      windows.signingCertificateThumbprint
    ], processRunner);
    const knownGoodBuild = helperJson("build-package", [
      knownGoodContent,
      temporaryKnownGood,
      windows.makeAppx,
      windows.signTool,
      windows.signingCertificateThumbprint
    ], processRunner);

    const candidateInspection = sourceInspector(temporaryCandidate);
    const knownGoodInspection = sourceInspector(temporaryKnownGood);
    requireBuiltPackage(candidateInspection, candidateBuild, candidateSourceBefore,
      windows.candidateVersion);
    requireBuiltPackage(knownGoodInspection, knownGoodBuild, knownGoodSourceBefore,
      windows.knownGoodVersion);
    if (knownGoodInspection.archive.sha256 !== knownGoodSourceBefore.archive.sha256) {
      throw new Error("Known-good package did not preserve its source app.asar");
    }

    const verifiedCandidate = path.join(scratch, "verified-candidate");
    const verifiedKnownGood = path.join(scratch, "verified-known-good");
    helperJson("extract-package", [temporaryCandidate, verifiedCandidate, windows.makeAppx],
      processRunner);
    helperJson("extract-package", [temporaryKnownGood, verifiedKnownGood, windows.makeAppx],
      processRunner);
    if (!equalRecords(treeSnapshot(candidateContent), treeSnapshot(verifiedCandidate))) {
      throw new Error(`Final candidate MSIX changed package content: ${recordDifferences(
        treeSnapshot(candidateContent), treeSnapshot(verifiedCandidate))}`);
    }
    if (!equalRecords(treeSnapshot(knownGoodContent), treeSnapshot(verifiedKnownGood))) {
      throw new Error(`Final known-good MSIX changed package content: ${recordDifferences(
        treeSnapshot(knownGoodContent), treeSnapshot(verifiedKnownGood))}`);
    }
    if (!equalRecords(sourceNative, treeSnapshot(path.join(
      verifiedCandidate, "app/resources/app.asar.unpacked"
    )))) {
      throw new Error("Final candidate MSIX did not preserve the source native-module tree");
    }

    const verifiedAsar = path.join(scratch, "verified-asar");
    run(process.execPath, [
      asar,
      "extract",
      path.join(verifiedCandidate, "app/resources/app.asar"),
      verifiedAsar
    ], processRunner);
    const finalChecks = verifyPatchFleet({
      selected,
      roots: {app: verifiedCandidate, asar: verifiedAsar},
      configFile,
      config,
      repository
    });

    requireSourceUnchanged({
      label: "Candidate source",
      source: candidateSource,
      before: candidateSourceBefore,
      after: sourceInspector(candidateSource),
      snapshot: candidateSourceSnapshot
    });
    requireSourceUnchanged({
      label: "Known-good source",
      source: knownGoodSource,
      before: knownGoodSourceBefore,
      after: sourceInspector(knownGoodSource),
      snapshot: knownGoodSourceSnapshot
    });

    fs.renameSync(temporaryCandidate, candidate);
    candidateCreated = true;
    fs.renameSync(temporaryKnownGood, knownGood);
    knownGoodCreated = true;
    complete = true;
    return {
      state: "staged-msix-static-proof-green",
      candidateSource: sourceReceipt(candidateSource, candidateSourceBefore),
      knownGoodSource: sourceReceipt(knownGoodSource, knownGoodSourceBefore),
      candidate: {
        path: candidate,
        packageFullName: candidateInspection.package.fullName,
        outerVersion: windows.candidateVersion,
        sha256: candidateBuild.sha256,
        asarSha256: candidateInspection.archive.sha256
      },
      knownGood: {
        path: knownGood,
        packageFullName: knownGoodInspection.package.fullName,
        outerVersion: windows.knownGoodVersion,
        sha256: knownGoodBuild.sha256,
        asarSha256: knownGoodInspection.archive.sha256,
        sourcePayloadPreserved: true
      },
      patches: finalChecks.map(result => result.name),
      changedTargets: fleet.changedTargets,
      secondApplyByteIdentical: true,
      probesPassedAfterRepack: true,
      nativePayloadPreserved: true,
      packageIdentity: "same-family-locally-signed-msix-update",
      signingCertificateThumbprint: candidateBuild.signerThumbprint,
      liveAppTouched: false,
      installed: false,
      launched: false
    };
  } finally {
    fs.rmSync(scratch, {recursive: true, force: true});
    fs.rmSync(temporaryCandidate, {force: true});
    fs.rmSync(temporaryKnownGood, {force: true});
    if (!complete) {
      if (candidateCreated) fs.rmSync(candidate, {force: true});
      if (knownGoodCreated) fs.rmSync(knownGood, {force: true});
    }
  }
}

export function compareMsixVersions(left, right) {
  const leftParts = msixVersionParts(left);
  const rightParts = msixVersionParts(right);
  for (let index = 0; index < 4; index += 1) {
    if (leftParts[index] !== rightParts[index]) return leftParts[index] - rightParts[index];
  }
  return 0;
}

export function windowsConfig(value) {
  if (value == null || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("Toolkit config windows must be an object");
  }
  const allowed = new Set([
    "candidateVersion",
    "knownGoodVersion",
    "makeAppx",
    "signTool",
    "signingCertificateThumbprint",
    "codexBinaries"
  ]);
  const unknown = Object.keys(value).filter(key => !allowed.has(key));
  if (unknown.length > 0) throw new Error(`Unknown toolkit config windows keys: ${unknown.join(", ")}`);
  for (const name of ["candidateVersion", "knownGoodVersion"]) msixVersionParts(value[name]);
  for (const name of ["makeAppx", "signTool"]) {
    if (typeof value[name] !== "string" || !path.win32.isAbsolute(value[name])) {
      throw new Error(`Toolkit config windows.${name} must be an absolute Windows path`);
    }
  }
  if (typeof value.signingCertificateThumbprint !== "string" ||
      !/^[0-9a-f]{40}$/i.test(value.signingCertificateThumbprint.replaceAll(" ", ""))) {
    throw new Error("Toolkit config windows.signingCertificateThumbprint must be a SHA-1 thumbprint");
  }
  return value;
}

function msixVersionParts(value) {
  if (typeof value !== "string" || !/^\d+(?:\.\d+){3}$/.test(value)) {
    throw new Error(`Invalid MSIX package version: ${JSON.stringify(value)}`);
  }
  const parts = value.split(".").map(Number);
  if (parts.some(part => !Number.isInteger(part) || part < 0 || part > 65535)) {
    throw new Error(`MSIX package version component is out of range: ${value}`);
  }
  return parts;
}

function validateDestinations(candidateSource, knownGoodSource, candidate, knownGood) {
  requireSource(candidateSource, "candidate source application");
  requireSource(knownGoodSource, "known-good source application");
  for (const [label, target] of [["candidate", candidate], ["known-good", knownGood]]) {
    if (!/\.msix$/i.test(target)) throw new Error(`Windows ${label} destination must end in .msix`);
    if (fs.existsSync(target)) throw new Error(`Windows ${label} destination already exists: ${target}`);
    requireDirectory(path.dirname(target), `Windows ${label} destination parent`);
  }
  const normalized = [candidateSource, knownGoodSource, candidate, knownGood]
    .map(value => value.toLowerCase());
  if (new Set(normalized).size !== normalized.length) {
    throw new Error("Windows source and destination paths must differ");
  }
}

function requireSource(value, label) {
  if (!fs.existsSync(value) || (!fs.statSync(value).isDirectory() && !fs.statSync(value).isFile())) {
    throw new Error(`Missing ${label}: ${value}`);
  }
}

function materializeSource({source, destination, makeAppx, processRunner}) {
  if (fs.statSync(source).isDirectory()) return source;
  helperJson("extract-package", [source, destination, makeAppx], processRunner);
  return destination;
}

function sourceSnapshot(source) {
  return fs.statSync(source).isDirectory()
    ? {type: "directory", records: treeSnapshot(source)}
    : {type: "file", sha256: sha256File(source)};
}

function sourceReceipt(source, inspection) {
  return {
    app: source,
    packageFullName: inspection.package.fullName,
    outerVersion: inspection.package.outerVersion,
    version: inspection.version,
    build: inspection.build,
    electron: inspection.electron,
    packageSha256: inspection.artifact?.sha256 ?? null,
    asarSha256: inspection.archive.sha256,
    untouched: true
  };
}

function requireMatchingSources(candidate, knownGood) {
  if (JSON.stringify(sourceCompatibility(candidate)) !==
      JSON.stringify(sourceCompatibility(knownGood))) {
    throw new Error("Windows candidate and known-good sources do not share the exact inner identity");
  }
}

function sourceCompatibility(source) {
  return {
    identifier: source.identifier,
    familyName: source.package?.familyName,
    publisher: source.package?.publisher,
    architecture: source.package?.architecture?.toLowerCase(),
    applicationId: source.package?.applicationId,
    version: source.version,
    build: source.build,
    electron: source.electron
  };
}

function requireSourceUnchanged({label, source, before, after, snapshot}) {
  if (JSON.stringify(sourceReceipt(source, before)) !== JSON.stringify(sourceReceipt(source, after)) ||
      after.signature?.state !== "valid") {
    throw new Error(`${label} identity or signed payload changed while staging`);
  }
  const unchanged = snapshot.type === "directory"
    ? equalRecords(snapshot.records, treeSnapshot(source))
    : snapshot.sha256 === sha256File(source);
  if (!unchanged) throw new Error(`${label} bytes changed while staging`);
}

function validatePatchScopes(selected) {
  const unsupported = selected.filter(definition =>
    definition.scope === "app" && definition.name !== "standalone-output-compaction"
  );
  if (unsupported.length > 0) {
    throw new Error(`Windows MSIX staging does not support app-scope patches: ${
      unsupported.map(definition => definition.name).join(", ")}`);
  }
}

function requireValidSource(inspection) {
  if (inspection.signature?.state !== "valid" ||
      !new Set(["valid", "not-present"]).has(inspection.asarIntegrity?.state) ||
      inspection.package?.status !== "Ok" ||
      !new Set(["Store", "Developer", "PackageFile"]).has(inspection.package?.signatureKind)) {
    throw new Error("Windows source package failed identity, signature, or integrity validation");
  }
}

function requirePrerequisiteMatch(result, windows) {
  if (result?.certificate?.thumbprint !== windows.signingCertificateThumbprint
        .replaceAll(" ", "").toLowerCase()) {
    throw new Error("Windows package tools do not match the configured signing certificate");
  }
}

function requireCopiedIdentity(copy, source, version) {
  const manifest = copy?.manifest;
  if (copy?.sourceVersion !== source.package.outerVersion || manifest?.version !== version ||
      manifest?.name !== source.identifier || manifest?.publisher !== source.package.publisher ||
      manifest?.architecture !== source.package.architecture.toLowerCase() ||
      manifest?.applicationId !== source.package.applicationId || copy?.manifestPreserved !== true ||
      !/^[0-9a-f]{64}$/.test(copy?.normalizedManifestSha256 ?? "")) {
    throw new Error("Copied package content does not preserve the exact source identity");
  }
}

function requireBuiltPackage(inspection, build, source, version) {
  if (inspection.signature?.state !== "valid" || inspection.package?.status !== "Ok" ||
      inspection.package?.outerVersion !== version || inspection.version !== source.version ||
      inspection.build !== source.build || inspection.electron !== source.electron ||
      inspection.package?.familyName !== source.package.familyName ||
      inspection.package?.publisher !== source.package.publisher ||
      inspection.package?.architecture !== source.package.architecture.toLowerCase() ||
      inspection.package?.applicationId !== source.package.applicationId ||
      inspection.artifact?.sha256 !== build?.sha256 || build?.signature !== "Valid") {
    throw new Error("Built MSIX failed package, application, or signature verification");
  }
}

function requireSourceCopy(source, copy, label, manifestPreserved) {
  const names = [...new Set([...Object.keys(source), ...Object.keys(copy)])].sort();
  const unexpected = names.filter(name => {
    const relative = normalizedRelative(name);
    if (relative === "AppxManifest.xml") return manifestPreserved !== true;
    return !isGeneratedPackagePath(relative) &&
      JSON.stringify(source[name]) !== JSON.stringify(copy[name]);
  });
  if (unexpected.length > 0) {
    throw new Error(`${label} package copy changed source payloads: ${
      unexpected.slice(0, 8).join(", ")}`);
  }
}

function isGeneratedPackagePath(relative) {
  return [...generatedPackagePaths].some(value =>
    relative === value || relative.startsWith(`${value}/`));
}

function verifyAllowedContentChanges(before, after, {standaloneRepair}) {
  const allowed = new Set(["app/resources/app.asar"]);
  if (standaloneRepair) for (const target of standaloneTargets) allowed.add(target);
  const names = [...new Set([...Object.keys(before), ...Object.keys(after)])].sort();
  const unexpected = names.filter(name => !allowed.has(normalizedRelative(name)) &&
    JSON.stringify(before[name]) !== JSON.stringify(after[name]));
  if (unexpected.length > 0) {
    throw new Error(`Candidate package changed non-owned payloads: ${unexpected.slice(0, 8).join(", ")}`);
  }
}

function asarUnpackedPaths(archive) {
  return listPackage(archive, {isPack: true})
    .filter(value => value.startsWith("unpack : "))
    .map(value => value.replace(/^unpack\s*:\s*[\\/]/, "").replaceAll("\\", "/"))
    .sort();
}

function deriveUnpackRules(headerPaths, unpackedRoot) {
  if (headerPaths.length === 0) throw new Error("Source application has no unpacked ASAR entries");
  const directories = headerPaths.filter(relative =>
    fs.statSync(path.join(unpackedRoot, relative)).isDirectory()
  ).sort((left, right) => left.length - right.length || left.localeCompare(right));
  const roots = [];
  for (const relative of directories) {
    if (!roots.some(root => relative === root || relative.startsWith(`${root}/`))) roots.push(relative);
  }
  const files = headerPaths.filter(relative =>
    !fs.statSync(path.join(unpackedRoot, relative)).isDirectory()
  ).filter(relative => !roots.some(root => relative.startsWith(`${root}/`)));
  return {directories: roots.sort(), files: files.sort()};
}

function exactGlob(values, prefix = "") {
  if (values.length === 0) return null;
  const unsafe = values.find(value => /[{},!\[\]*?\\]/.test(value));
  if (unsafe != null) throw new Error(`Cannot preserve unsafe unpacked ASAR path: ${unsafe}`);
  return values.length === 1 ? `${prefix}${values[0]}` : `${prefix}{${values.join(",")}}`;
}

function unpackArguments({directories, files}) {
  const result = [];
  const directoryGlob = exactGlob(directories);
  const fileGlob = exactGlob(files, "**/");
  if (directoryGlob != null) result.push("--unpack-dir", directoryGlob);
  if (fileGlob != null) result.push("--unpack", fileGlob);
  return result;
}

function helperJson(action, arguments_, processRunner) {
  const result = run(powershell, [
    "-NoLogo", "-NoProfile", "-NonInteractive", "-WindowStyle", "Hidden",
    "-ExecutionPolicy", "Bypass", "-File", windowsHelper, action, ...arguments_
  ], processRunner, {windowsHide: true});
  try {
    return JSON.parse(result.stdout.trim());
  } catch (error) {
    throw new Error(`Windows ${action} helper returned invalid JSON: ${error.message}`);
  }
}

function run(program, arguments_, processRunner, options = {}) {
  const result = processRunner(program, arguments_, {
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
    ...options
  });
  if (result.error != null) throw result.error;
  if (result.status !== 0) {
    const cause = (result.stderr || result.stdout).trim();
    throw new Error(`${path.basename(program)} ${arguments_.join(" ")} failed: ${cause}`);
  }
  return result;
}

export function temporaryPackagePath(destination) {
  const parsed = path.parse(destination);
  return path.join(parsed.dir, `${parsed.name}.tmp-${process.pid}-${crypto.randomUUID()}${parsed.ext}`);
}

function normalizedRelative(value) {
  return value.replaceAll("\\", "/");
}

function requireDirectory(value, label) {
  if (!fs.existsSync(value) || !fs.statSync(value).isDirectory()) {
    throw new Error(`Missing ${label}: ${value}`);
  }
}

function requireFile(value, label) {
  if (!fs.existsSync(value) || !fs.statSync(value).isFile()) {
    throw new Error(`Missing ${label}: ${value}`);
  }
}

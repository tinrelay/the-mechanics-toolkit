import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {spawnSync} from "node:child_process";
import {inspectAppBundle, sha256File} from "./app-bundle.mjs";

const applicationRelative = "usr/lib/chatgpt";
const packageName = "chatgpt";
const toolkitReceiptRelative = "resources/tmtk-package.json";

export function inspectLinuxRpm(rpmArgument, {
  processRunner = spawnSync,
  packageExtractor = extractLinuxRpm,
  appInspector = inspectAppBundle,
  scratchParent = os.tmpdir(),
  vendorKey = "/etc/pki/rpm-gpg/RPM-GPG-KEY-chatgpt-3BFA0E4AE8B8CC16A2D9BA684A3B4A566C4660E4.asc"
} = {}) {
  const rpm = path.resolve(rpmArgument);
  requireFile(rpm, "RPM package");
  if (path.extname(rpm) !== ".rpm") throw new Error(`Linux package is not an .rpm: ${rpm}`);
  const fields = rpmFields(rpm, processRunner);
  requirePackageFields(fields);
  const scratch = fs.mkdtempSync(path.join(scratchParent, "mechanics-toolkit-inspect-rpm-"));
  try {
    const root = path.join(scratch, "package");
    fs.mkdirSync(root);
    packageExtractor(rpm, root, {processRunner, scratch});
    const application = appInspector(path.join(root, applicationRelative), {platform: "linux"});
    const receiptFile = path.join(application.app, toolkitReceiptRelative);
    const receipt = fs.existsSync(receiptFile) ? readJson(receiptFile, "TMTK package receipt") : null;
    const kind = receipt == null ? "vendor" : "tmtk";
    if (application.version !== fields.Version) {
      throw new Error("RPM and inner application versions disagree");
    }
    if (kind === "tmtk" && fields.Signature !== "(none)") {
      throw new Error("Local TMTK rebuild misleadingly retains a package signature");
    }
    if (kind === "tmtk") validateToolkitReceipt(receipt, fields, application);
    const originSignature = kind === "vendor"
      ? verifyVendorSignature({rpm, processRunner, vendorKey})
      : {state: "absent-local-rebuild"};
    return {
      kind: "rpm",
      packageKind: kind,
      rpm,
      rpmSha256: sha256File(rpm),
      package: packageName,
      version: fields.Version,
      release: fields.Release,
      packageVersion: `${fields.Version}-${fields.Release}`,
      architecture: fields.Architecture,
      build: application.build,
      archiveSha256: application.archive.sha256,
      executableSha256: application.executable.sha256,
      cliSha256: application.cli.sha256,
      originSignature,
      receipt
    };
  } finally {
    fs.rmSync(scratch, {recursive: true, force: true});
  }
}

export function prepareLinuxRpmCandidateAdoption({
  candidatePath,
  candidateSourcePath,
  knownGoodPath,
  targetApp,
  incidentDirectory,
  rpmInspector = inspectLinuxRpm,
  appInspector = inspectAppBundle
}) {
  if (typeof candidateSourcePath !== "string" || candidateSourcePath.trim() === "") {
    throw new Error("Linux candidate adoption requires --candidate-source with its pristine source RPM");
  }
  if (typeof knownGoodPath !== "string" || knownGoodPath.trim() === "") {
    throw new Error("Linux candidate adoption requires --known-good with the currently installed known-working RPM");
  }
  const inspectionOptions = {scratchParent: incidentDirectory};
  const candidate = rpmInspector(candidatePath, inspectionOptions);
  const candidateSource = rpmInspector(candidateSourcePath, inspectionOptions);
  const knownGood = rpmInspector(knownGoodPath, inspectionOptions);
  requireCandidateSource(candidate, candidateSource);
  requireRollbackPair(candidate, knownGood);
  requireInstalledMatch(appInspector(targetApp, {platform: "linux"}), knownGood,
    "currently installed application");

  const candidateCopy = path.join(incidentDirectory, "candidate.rpm");
  const knownGoodCopy = path.join(incidentDirectory, "known-good.rpm");
  try {
    fs.copyFileSync(candidate.rpm, candidateCopy, fs.constants.COPYFILE_EXCL);
    fs.copyFileSync(knownGood.rpm, knownGoodCopy, fs.constants.COPYFILE_EXCL);
    const copiedCandidate = rpmInspector(candidateCopy, inspectionOptions);
    const copiedKnownGood = rpmInspector(knownGoodCopy, inspectionOptions);
    requireSourceMatch(copiedCandidate, candidate, "copied candidate RPM");
    requireSourceMatch(copiedKnownGood, knownGood, "copied known-good RPM");
    return {candidate: copiedCandidate, knownGood: copiedKnownGood};
  } catch (error) {
    fs.rmSync(candidateCopy, {force: true});
    fs.rmSync(knownGoodCopy, {force: true});
    throw error;
  }
}

export function installLinuxRpm({
  targetApp,
  source,
  processRunner = spawnSync,
  sourceInspector = inspectLinuxRpm,
  appInspector = inspectAppBundle,
  effectiveUserId = process.getuid?.() ?? -1,
  environment = process.env
}) {
  const verified = sourceInspector(source?.rpm, {scratchParent: path.dirname(source.rpm)});
  requireSourceMatch(verified, source, "RPM selected when restart was armed");
  const rpmArguments = ["--upgrade", "--replacepkgs", "--oldpackage", verified.rpm];
  if (effectiveUserId === 0) {
    run(processRunner, "/usr/bin/rpm", rpmArguments);
  } else {
    if (typeof environment.SUDO_ASKPASS !== "string" || environment.SUDO_ASKPASS.trim() === "") {
      throw new Error("Linux RPM installation requires SUDO_ASKPASS for non-root adoption");
    }
    run(processRunner, "/usr/bin/sudo", ["-A", "/usr/bin/rpm", ...rpmArguments], {
      env: environment
    });
  }

  const installed = appInspector(targetApp, {platform: "linux"});
  requireInstalledMatch(installed, verified, "installed application");
  const identity = run(processRunner, "/usr/bin/rpm", [
    "--query", packageName, "--queryformat", "%{VERSION}\t%{RELEASE}\t%{ARCH}\n"
  ]).stdout.trim().split("\t");
  if (identity.length !== 3 || identity[0] !== verified.version ||
      identity[1] !== verified.release || identity[2] !== verified.architecture) {
    throw new Error("installed RPM identity does not match the verified package");
  }
  return {
    app: path.resolve(targetApp),
    package: verified.package,
    packageVersion: verified.packageVersion,
    architecture: verified.architecture,
    version: verified.version,
    build: verified.build,
    archiveSha256: verified.archiveSha256,
    executableSha256: verified.executableSha256,
    cliSha256: verified.cliSha256
  };
}

function verifyVendorSignature({rpm, processRunner, vendorKey}) {
  requireFile(vendorKey, "trusted ChatGPT RPM key");
  const checked = run(processRunner, "/usr/bin/rpmkeys", ["--checksig", "--verbose", rpm]);
  const checkedFingerprint = checked.stdout.match(/key fingerprint:\s*([0-9a-f]{40})/i)?.[1]?.toLowerCase();
  if (checkedFingerprint == null) {
    throw new Error("rpmkeys did not report the vendor signature fingerprint");
  }
  const key = run(processRunner, "/usr/bin/gpg", [
    "--batch", "--with-colons", "--show-keys", vendorKey
  ]);
  const trustedFingerprint = key.stdout.split("\n")
    .find(line => line.startsWith("fpr:"))?.split(":")?.[9]?.toLowerCase();
  if (!/^[0-9a-f]{40}$/.test(trustedFingerprint ?? "")) {
    throw new Error("trusted ChatGPT RPM key has no usable fingerprint");
  }
  if (checkedFingerprint !== trustedFingerprint) {
    throw new Error("RPM signature does not match the trusted ChatGPT RPM key");
  }
  return {state: "valid", fingerprint: trustedFingerprint, key: path.resolve(vendorKey)};
}

function requireCandidateSource(candidate, source) {
  if (candidate.packageKind !== "tmtk") {
    throw new Error("Linux candidate RPM has no TMTK package receipt");
  }
  if (source.packageKind !== "vendor" || source.originSignature?.state !== "valid") {
    throw new Error("Linux candidate source RPM must be an authenticated vendor package");
  }
  if (candidate.package !== packageName || source.package !== packageName ||
      candidate.architecture !== source.architecture || candidate.version !== source.version ||
      candidate.build !== source.build || candidate.executableSha256 !== source.executableSha256 ||
      candidate.cliSha256 !== source.cliSha256) {
    throw new Error("candidate and candidate-source RPMs do not describe the same application build");
  }
  if (candidate.receipt?.source?.version !== source.version ||
      candidate.receipt?.source?.release !== source.release ||
      candidate.receipt?.source?.sha256 !== source.rpmSha256 ||
      candidate.receipt?.source?.architecture !== source.architecture) {
    throw new Error("candidate receipt does not identify the supplied candidate-source RPM");
  }
}

function requireRollbackPair(candidate, knownGood) {
  const authenticatedVendor = knownGood.packageKind === "vendor" &&
    knownGood.originSignature?.state === "valid";
  const receiptedToolkit = knownGood.packageKind === "tmtk" && knownGood.receipt != null &&
    knownGood.originSignature?.state === "absent-local-rebuild";
  if (!authenticatedVendor && !receiptedToolkit) {
    throw new Error("Linux known-good RPM must be an authenticated vendor or verified TMTK package");
  }
  if (candidate.package !== packageName || knownGood.package !== packageName ||
      candidate.architecture !== knownGood.architecture) {
    throw new Error("candidate and known-good RPMs do not describe the same package architecture");
  }
}

function requireInstalledMatch(actual, expected, label) {
  const values = {
    version: actual.version,
    build: actual.build,
    archiveSha256: actual.archive?.sha256,
    executableSha256: actual.executable?.sha256,
    cliSha256: actual.cli?.sha256
  };
  for (const [name, value] of Object.entries(values)) {
    if (typeof expected?.[name] !== "string" || value !== expected[name]) {
      throw new Error(`${label} does not match the known package (${name})`);
    }
  }
}

function requireSourceMatch(actual, expected, label) {
  for (const name of [
    "packageKind", "rpmSha256", "package", "version", "release", "packageVersion",
    "architecture", "build", "archiveSha256", "executableSha256", "cliSha256"
  ]) {
    if (actual?.[name] !== expected?.[name]) {
      throw new Error(`${label} no longer matches its verified identity (${name})`);
    }
  }
}

function validateToolkitReceipt(receipt, fields, application) {
  if (receipt?.schemaVersion !== 1 || receipt?.source?.package !== packageName ||
      !/^[0-9a-f]{64}$/.test(receipt?.source?.sha256 ?? "") ||
      receipt?.source?.architecture !== fields.Architecture ||
      receipt?.source?.version !== fields.Version ||
      fields.Release !== `${receipt?.source?.release}.tmtk1` ||
      !Array.isArray(receipt?.patches) || !receipt.patches.includes("safe-start-readiness") ||
      !receipt.patches.includes("renderer-patch-registry") ||
      !/^[0-9a-f]{40}$/.test(receipt?.toolkit?.commit ?? "") ||
      typeof receipt?.toolkit?.dirty !== "boolean" ||
      receipt?.application?.version !== application.version ||
      String(receipt?.application?.build) !== application.build ||
      receipt?.application?.asarSha256 !== application.archive.sha256) {
    throw new Error("TMTK package receipt does not match the rebuilt RPM");
  }
}

function rpmFields(file, processRunner) {
  const format = "%{NAME}\n%{VERSION}\n%{RELEASE}\n%{ARCH}\n%{RSAHEADER:pgpsig}\n";
  const lines = run(processRunner, "/usr/bin/rpm", [
    "--query", "--package", file, "--queryformat", format
  ]).stdout.trimEnd().split("\n");
  if (lines.length !== 5) throw new Error("RPM package fields are incomplete");
  const [Package, Version, Release, Architecture, Signature] = lines;
  return {Package, Version, Release, Architecture, Signature};
}

function requirePackageFields(fields) {
  if (fields.Package !== packageName) throw new Error(`Refusing non-ChatGPT RPM: ${fields.Package}`);
  if (!new Set(["aarch64", "x86_64"]).has(fields.Architecture)) {
    throw new Error(`Unsupported ChatGPT RPM architecture: ${fields.Architecture}`);
  }
  if (fields.Version === "" || fields.Release === "") {
    throw new Error("RPM package version or release is missing");
  }
}

export function extractLinuxRpm(source, root, {
  processRunner = spawnSync,
  scratch = path.dirname(root)
} = {}) {
  const payload = path.join(scratch, "payload.cpio");
  let output;
  try {
    output = fs.openSync(payload, "wx", 0o600);
    const unpack = processRunner("/usr/bin/rpm2cpio", [source], {
      stdio: ["ignore", output, "pipe"], encoding: "utf8"
    });
    fs.closeSync(output);
    output = null;
    requireSuccess(unpack, "/usr/bin/rpm2cpio", [source]);
    const input = fs.openSync(payload, "r");
    const extracted = processRunner("/usr/bin/cpio", [
      "--extract", "--make-directories", "--preserve-modification-time", "--no-absolute-filenames"
    ], {cwd: root, stdio: [input, "pipe", "pipe"], encoding: "utf8"});
    fs.closeSync(input);
    requireSuccess(extracted, "/usr/bin/cpio", ["--extract"]);
  } finally {
    if (output != null) fs.closeSync(output);
    fs.rmSync(payload, {force: true});
  }
}

function run(processRunner, command, arguments_, options = {}) {
  const result = processRunner(command, arguments_, {
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
    ...options
  });
  requireSuccess(result, command, arguments_);
  return result;
}

function requireSuccess(result, command, arguments_) {
  if (result.error != null || result.status !== 0) {
    const cause = result.error?.message ?? (result.stderr || result.stdout || "").trim();
    throw new Error(`${path.basename(command)} ${arguments_.join(" ")} failed: ${cause}`);
  }
}

function readJson(file, label) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (error) {
    throw new Error(`Could not read ${label}: ${error.message}`);
  }
}

function requireFile(file, label) {
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) throw new Error(`Missing ${label}: ${file}`);
}

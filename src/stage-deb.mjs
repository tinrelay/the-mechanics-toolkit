import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {spawnSync} from "node:child_process";
import {sha256File} from "./app-bundle.mjs";
import {inspectLinuxDeb} from "./linux-deb.mjs";
import {
  installedSize,
  patchLinuxPackageRoot,
  toolkitIdentity,
  verifyLinuxPackageRoot
} from "./stage-linux-package.mjs";
import {
  readToolkitConfig,
  selectedPatches
} from "./stage-patch-fleet.mjs";

export function stageDeb({
  sourceDeb,
  destinationDeb,
  configPath,
  repositoryRoot,
  sourceInspector = inspectLinuxDeb,
  scratchParent = os.tmpdir()
}) {
  const source = path.resolve(sourceDeb);
  const destination = path.resolve(destinationDeb);
  const configFile = path.resolve(configPath);
  const repository = path.resolve(repositoryRoot);
  const asar = path.join(repository, "node_modules/.bin/asar");
  requireFile(source, "source DEB");
  requireFile(asar, "repository-local asar CLI; run npm install");
  validateDestination(source, destination);

  const config = readToolkitConfig(configFile);
  const selected = selectedPatches(config.enabledPatches);
  const sourceSha256 = sha256File(source);
  const sourcePackage = debFields(source);
  requireSourcePackage(sourcePackage);
  requireAuthenticatedSource(sourceInspector(source, {scratchParent}), sourceSha256, sourcePackage);
  const toolkit = toolkitIdentity(repository);
  const scratch = fs.mkdtempSync(path.join(scratchParent, "mechanics-toolkit-deb-"));
  let destinationCreated = false;
  let complete = false;
  let temporaryDestination = null;
  try {
    const packageRoot = path.join(scratch, "package");
    run("/usr/bin/dpkg-deb", ["--raw-extract", source, packageRoot]);
    const patched = patchLinuxPackageRoot({
      packageRoot,
      sourceLabel: "Source DEB",
      sourcePackage: {
        package: sourcePackage.Package,
        version: sourcePackage.Version,
        architecture: sourcePackage.Architecture
      },
      sourceSha256,
      selected,
      configFile,
      config,
      repository,
      asar,
      toolkit
    });
    const rebuiltVersion = `${sourcePackage.Version}+tmtk1`;
    writeControl(path.join(packageRoot, "DEBIAN/control"), {
      version: rebuiltVersion,
      installedSize: installedSize(packageRoot),
      sourcePackage,
      sourceSha256,
      toolkit,
      patches: patched.metadata.patches
    });

    temporaryDestination = `${destination}.tmp-${process.pid}-${crypto.randomUUID()}`;
    run("/usr/bin/dpkg-deb", ["--root-owner-group", "--build", packageRoot, temporaryDestination]);
    fs.renameSync(temporaryDestination, destination);
    destinationCreated = true;

    const finalPackage = debFields(destination);
    if (finalPackage.Package !== "chatgpt" || finalPackage.Version !== rebuiltVersion ||
        finalPackage.Architecture !== sourcePackage.Architecture) {
      throw new Error("Rebuilt DEB does not preserve its expected package identity");
    }
    const verifiedRoot = path.join(scratch, "verified-package");
    run("/usr/bin/dpkg-deb", ["--raw-extract", destination, verifiedRoot]);
    const finalInspection = verifyLinuxPackageRoot({
      packageRoot: verifiedRoot,
      sourceData: patched.sourceData,
      metadata: patched.metadata,
      selected,
      configFile,
      config,
      repository,
      asar
    });
    if (sha256File(source) !== sourceSha256) throw new Error("Source DEB changed while staging");

    complete = true;
    return {
      state: "staged-deb-static-proof-green",
      source: {...sourcePackage, sha256: sourceSha256, untouched: true},
      candidate: {...finalPackage, path: destination, sha256: sha256File(destination)},
      application: {
        version: finalInspection.version,
        build: finalInspection.build,
        asarSha256: finalInspection.archive.sha256
      },
      patches: patched.metadata.patches,
      changedTargets: patched.changedTargets,
      secondApplyByteIdentical: true,
      probesPassedAfterRepack: true,
      nativePayloadPreserved: true,
      packageIdentity: "local-tmtk-rebuild",
      updateBehavior: "a higher vendor repository version may replace this local rebuild",
      liveAppTouched: false,
      installed: false,
      launched: false
    };
  } finally {
    fs.rmSync(scratch, {recursive: true, force: true});
    if (temporaryDestination != null) fs.rmSync(temporaryDestination, {force: true});
    if (destinationCreated && !complete) fs.rmSync(destination, {force: true});
  }
}

function requireAuthenticatedSource(inspection, sourceSha256, sourcePackage) {
  if (inspection?.packageKind !== "vendor" || inspection?.originSignature?.state !== "valid") {
    throw new Error("Source DEB is not authenticated by the trusted ChatGPT APT keyring");
  }
  if (inspection.debSha256 !== sourceSha256 || inspection.package !== sourcePackage.Package ||
      inspection.packageVersion !== sourcePackage.Version ||
      inspection.architecture !== sourcePackage.Architecture) {
    throw new Error("Authenticated source DEB identity changed before staging");
  }
}

function debFields(file) {
  const names = ["Package", "Version", "Architecture", "Maintainer", "Installed-Size"];
  const result = run("/usr/bin/dpkg-deb", ["--field", file, ...names]);
  const fields = {};
  for (const line of result.stdout.trimEnd().split("\n")) {
    const match = line.match(/^([^:]+):\s*(.*)$/);
    if (match != null) fields[match[1]] = match[2];
  }
  if (names.some(name => typeof fields[name] !== "string" || fields[name] === "")) {
    throw new Error("DEB package fields are incomplete");
  }
  return Object.fromEntries(names.map(name => [name, fields[name]]));
}

function requireSourcePackage(fields) {
  if (fields.Package !== "chatgpt") throw new Error(`Refusing non-ChatGPT DEB package: ${fields.Package}`);
  if (!new Set(["amd64", "arm64"]).has(fields.Architecture)) {
    throw new Error(`Unsupported ChatGPT DEB architecture: ${fields.Architecture}`);
  }
  if (fields.Version.includes("+tmtk")) throw new Error("Source DEB is already a TMTK rebuild");
}

function writeControl(file, {version, installedSize, sourcePackage, sourceSha256, toolkit, patches}) {
  let control = fs.readFileSync(file, "utf8");
  control = replaceControlField(control, "Version", version);
  control = replaceControlField(control, "Installed-Size", String(installedSize));
  control = replaceControlField(control, "Maintainer", "The Mechanic's Toolkit <noreply@localhost>");
  const fields = [
    ["Original-Maintainer", sourcePackage.Maintainer],
    ["X-TMTK-Rebuild", "yes"],
    ["X-TMTK-Source-Version", sourcePackage.Version],
    ["X-TMTK-Source-SHA256", sourceSha256],
    ["X-TMTK-Toolkit-Commit", toolkit.commit],
    ["X-TMTK-Toolkit-Dirty", String(toolkit.dirty)],
    ["X-TMTK-Patches", patches.join(", ")]
  ];
  const description = control.search(/^Description:/m);
  if (description < 0) throw new Error("DEB control file has no Description field");
  const additions = fields.map(([name, value]) => `${name}: ${value}`).join("\n");
  control = `${control.slice(0, description)}${additions}\n${control.slice(description)}`;
  fs.writeFileSync(file, control, {encoding: "utf8", mode: 0o644});
}

function replaceControlField(control, name, value) {
  const pattern = new RegExp(`^${name}:.*$`, "m");
  if (!pattern.test(control)) throw new Error(`DEB control file has no ${name} field`);
  return control.replace(pattern, `${name}: ${value}`);
}

function run(program, args) {
  const result = spawnSync(program, args, {encoding: "utf8", maxBuffer: 64 * 1024 * 1024});
  if (result.error != null || result.status !== 0) {
    const cause = result.error?.message ?? (result.stderr || result.stdout).trim();
    throw new Error(`${path.basename(program)} ${args.join(" ")} failed: ${cause}`);
  }
  return result;
}

function validateDestination(source, destination) {
  if (source === destination) throw new Error("Source and destination DEBs must differ");
  if (fs.existsSync(destination)) throw new Error(`Staging destination already exists: ${destination}`);
  requireDirectory(path.dirname(destination), "staging destination parent");
  if (path.extname(source) !== ".deb" || path.extname(destination) !== ".deb") {
    throw new Error("Linux package staging requires .deb source and destination paths");
  }
}

function requireDirectory(target, label) {
  if (!fs.existsSync(target) || !fs.statSync(target).isDirectory()) {
    throw new Error(`Missing ${label}: ${target}`);
  }
}

function requireFile(target, label) {
  if (!fs.existsSync(target) || !fs.statSync(target).isFile()) {
    throw new Error(`Missing ${label}: ${target}`);
  }
}

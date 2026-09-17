import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {spawnSync} from "node:child_process";
import {sha256File} from "./app-bundle.mjs";
import {extractLinuxRpm, inspectLinuxRpm} from "./linux-rpm.mjs";
import {
  patchLinuxPackageRoot,
  toolkitIdentity,
  verifyLinuxPackageRoot
} from "./stage-linux-package.mjs";
import {readToolkitConfig, selectedPatches} from "./stage-patch-fleet.mjs";

export function stageRpm({
  sourceRpm,
  destinationRpm,
  configPath,
  repositoryRoot,
  sourceInspector = inspectLinuxRpm,
  scratchParent = os.tmpdir()
}) {
  const source = path.resolve(sourceRpm);
  const destination = path.resolve(destinationRpm);
  const configFile = path.resolve(configPath);
  const repository = path.resolve(repositoryRoot);
  const asar = path.join(repository, "node_modules/.bin/asar");
  requireFile(source, "source RPM");
  requireFile(asar, "repository-local asar CLI; run npm install");
  validateDestination(source, destination);

  const config = readToolkitConfig(configFile);
  const selected = selectedPatches(config.enabledPatches);
  const sourceSha256 = sha256File(source);
  const sourceInspection = sourceInspector(source, {scratchParent});
  requireAuthenticatedSource(sourceInspection, sourceSha256);
  const sourceMetadata = rpmMetadata(source);
  requireSourcePackage(sourceInspection, sourceMetadata);
  const toolkit = toolkitIdentity(repository);
  const scratch = fs.mkdtempSync(path.join(scratchParent, "mechanics-toolkit-rpm-"));
  let destinationCreated = false;
  let complete = false;
  let temporaryDestination = null;
  try {
    const packageRoot = path.join(scratch, "package");
    fs.mkdirSync(packageRoot);
    extractLinuxRpm(source, packageRoot, {scratch});
    const packageSource = {
      package: sourceInspection.package,
      version: sourceInspection.version,
      release: sourceInspection.release,
      architecture: sourceInspection.architecture
    };
    const patched = patchLinuxPackageRoot({
      packageRoot,
      sourceLabel: "Source RPM",
      sourcePackage: packageSource,
      sourceSha256,
      selected,
      configFile,
      config,
      repository,
      asar,
      toolkit
    });

    const candidateRelease = `${sourceInspection.release}.tmtk1`;
    const spec = path.join(scratch, "chatgpt-tmtk.spec");
    const fileList = path.join(scratch, "chatgpt-tmtk.files");
    writeFileList(fileList, packageRoot, sourceMetadata.fileFlags, sourceMetadata.fileNames);
    writeSpec(spec, {
      ...sourceMetadata,
      release: candidateRelease,
      fileList,
      payloadRoot: packageRoot
    });
    const topdir = path.join(scratch, "rpmbuild");
    const buildRoot = path.join(scratch, "buildroot");
    fs.mkdirSync(topdir);
    run("/usr/bin/rpmbuild", [
      "-bb", spec,
      "--buildroot", buildRoot,
      "--target", sourceInspection.architecture,
      "--noclean",
      "--define", `_topdir ${topdir}`,
      "--define", `_rpmdir ${path.join(scratch, "RPMS")}`
    ]);
    const built = builtRpm(path.join(scratch, "RPMS"));
    temporaryDestination = `${destination}.tmp-${process.pid}-${crypto.randomUUID()}`;
    fs.copyFileSync(built, temporaryDestination, fs.constants.COPYFILE_EXCL);
    fs.renameSync(temporaryDestination, destination);
    temporaryDestination = null;
    destinationCreated = true;

    const candidate = inspectLinuxRpm(destination, {scratchParent});
    if (candidate.packageKind !== "tmtk" || candidate.version !== sourceInspection.version ||
        candidate.release !== candidateRelease ||
        candidate.architecture !== sourceInspection.architecture) {
      throw new Error("Rebuilt RPM does not preserve its expected package identity");
    }
    const verifiedRoot = path.join(scratch, "verified-package");
    fs.mkdirSync(verifiedRoot);
    const verifiedScratch = path.join(scratch, "verified-rpm");
    fs.mkdirSync(verifiedScratch);
    extractLinuxRpm(destination, verifiedRoot, {scratch: verifiedScratch});
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
    if (sha256File(source) !== sourceSha256) throw new Error("Source RPM changed while staging");

    complete = true;
    return {
      state: "staged-rpm-static-proof-green",
      source: {
        Package: sourceInspection.package,
        Version: sourceInspection.version,
        Release: sourceInspection.release,
        Architecture: sourceInspection.architecture,
        sha256: sourceSha256,
        untouched: true
      },
      candidate: {
        Package: candidate.package,
        Version: candidate.version,
        Release: candidate.release,
        Architecture: candidate.architecture,
        path: destination,
        sha256: sha256File(destination)
      },
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

function requireAuthenticatedSource(inspection, sourceSha256) {
  if (inspection?.packageKind !== "vendor" || inspection?.originSignature?.state !== "valid") {
    throw new Error("Source RPM is not authenticated by the trusted ChatGPT RPM key");
  }
  if (inspection.rpmSha256 !== sourceSha256) {
    throw new Error("Authenticated source RPM identity changed before staging");
  }
}

function requireSourcePackage(inspection, metadata) {
  if (inspection.package !== "chatgpt" || metadata.name !== "chatgpt") {
    throw new Error(`Refusing non-ChatGPT RPM package: ${metadata.name}`);
  }
  if (!new Set(["aarch64", "x86_64"]).has(inspection.architecture)) {
    throw new Error(`Unsupported ChatGPT RPM architecture: ${inspection.architecture}`);
  }
  if (inspection.release.includes("tmtk") || metadata.release.includes("tmtk")) {
    throw new Error("Source RPM is already a TMTK rebuild");
  }
  for (const [name, left, right] of [
    ["version", inspection.version, metadata.version],
    ["release", inspection.release, metadata.release],
    ["architecture", inspection.architecture, metadata.architecture]
  ]) {
    if (left !== right) throw new Error(`Authenticated source RPM ${name} changed before staging`);
  }
}

function rpmMetadata(source) {
  const field = name => run("/usr/bin/rpm", [
    "--query", "--package", source, "--queryformat", `%{${name}}`
  ]).stdout;
  const lines = option => run("/usr/bin/rpm", [
    "--query", "--package", source, option
  ]).stdout.split("\n").map(value => value.trim()).filter(Boolean);
  const packageFiles = run("/usr/bin/rpm", [
    "--query", "--package", source, "--queryformat", "[%{FILENAMES}\t%{FILEFLAGS}\n]"
  ]).stdout.trimEnd().split("\n").filter(Boolean).map(line => {
    const separator = line.lastIndexOf("\t");
    return [line.slice(0, separator), Number(line.slice(separator + 1))];
  });
  return {
    name: field("NAME"),
    version: field("VERSION"),
    release: field("RELEASE"),
    architecture: field("ARCH"),
    summary: field("SUMMARY"),
    license: field("LICENSE"),
    url: field("URL"),
    description: field("DESCRIPTION"),
    requirements: [...new Set(lines("--requires"))]
      .filter(value => !value.startsWith("rpmlib(")),
    recommends: [...new Set(lines("--recommends"))],
    scripts: Object.fromEntries([
      ["pretrans", "PRETRANS"],
      ["post", "POSTIN"],
      ["preun", "PREUN"],
      ["postun", "POSTUN"]
    ].map(([section, tag]) => [section, {
      body: field(tag),
      program: field(`${tag}PROG`)
    }])),
    fileFlags: new Map(packageFiles),
    fileNames: new Set(packageFiles.map(([name]) => name))
  };
}

function writeSpec(file, metadata) {
  const dependencies = metadata.requirements.map(value => `Requires: ${value}`);
  const recommendations = metadata.recommends.map(value => `Recommends: ${value}`);
  const scripts = Object.entries(metadata.scripts).flatMap(([section, script]) => {
    if (script.body === "(none)" || script.body.trim() === "") return [];
    const program = script.program === "(none)" || script.program.trim() === ""
      ? "" : ` -p ${script.program}`;
    return [`%${section}${program}`, script.body.trimEnd(), ""];
  });
  fs.writeFileSync(file, [
    "%global debug_package %{nil}",
    "%global __os_install_post %{nil}",
    `Name: ${metadata.name}`,
    `Version: ${metadata.version}`,
    `Release: ${metadata.release}`,
    `Summary: ${metadata.summary}`,
    `License: ${metadata.license}`,
    `URL: ${metadata.url}`,
    `BuildArch: ${metadata.architecture}`,
    "AutoReqProv: no",
    ...dependencies,
    ...recommendations,
    "",
    "%description",
    metadata.description.trimEnd(),
    "",
    "%prep",
    "%build",
    "%install",
    `cp -a ${specShellArgument(metadata.payloadRoot)}/. "%{buildroot}/"`,
    "",
    ...scripts,
    `%files -f ${metadata.fileList}`,
    "%defattr(-,root,root,-)",
    ""
  ].join("\n"), {encoding: "utf8", mode: 0o600});
}

function writeFileList(file, packageRoot, sourceFlags, sourceFiles) {
  const lines = [];
  walk(packageRoot, (entry, relative) => {
    const absolute = `/${relative.split(path.sep).join("/")}`;
    if (absolute.includes("\n") || absolute.includes("\r")) {
      throw new Error("RPM payload contains an unsafe filename");
    }
    if (fs.lstatSync(entry).isDirectory() && !sourceFiles.has(absolute)) return;
    const flags = sourceFlags.get(absolute) ?? 0;
    const directives = [];
    if ((flags & 1) !== 0) {
      const options = [];
      if ((flags & 8) !== 0) options.push("missingok");
      if ((flags & 16) !== 0) options.push("noreplace");
      directives.push(`%config${options.length > 0 ? `(${options.join(",")})` : ""}`);
    } else if ((flags & 128) !== 0) {
      directives.push("%license");
    } else if ((flags & 2) !== 0) {
      directives.push("%doc");
    }
    if (fs.lstatSync(entry).isDirectory()) directives.push("%dir");
    lines.push(`${directives.length > 0 ? `${directives.join(" ")} ` : ""}${escapeSpecPath(absolute)}`);
  });
  fs.writeFileSync(file, `${lines.join("\n")}\n`, {encoding: "utf8", mode: 0o600});
}

function escapeSpecPath(value) {
  return value.replaceAll("%", "%%");
}

function specShellArgument(value) {
  return `'${escapeSpecPath(value).replaceAll("'", `'"'"'`)}'`;
}

function builtRpm(root) {
  const packages = [];
  walk(root, file => {
    if (fs.lstatSync(file).isFile() && file.endsWith(".rpm") && !file.endsWith(".src.rpm")) {
      packages.push(file);
    }
  });
  if (packages.length !== 1) throw new Error(`rpmbuild produced ${packages.length} binary packages`);
  return packages[0];
}

function validateDestination(source, destination) {
  if (source === destination) throw new Error("Source and destination RPMs must differ");
  if (fs.existsSync(destination)) throw new Error(`Staging destination already exists: ${destination}`);
  requireDirectory(path.dirname(destination), "staging destination parent");
  if (path.extname(source) !== ".rpm" || path.extname(destination) !== ".rpm") {
    throw new Error("Linux RPM staging requires .rpm source and destination paths");
  }
}

function run(program, args) {
  const result = spawnSync(program, args, {encoding: "utf8", maxBuffer: 64 * 1024 * 1024});
  if (result.error != null || result.status !== 0) {
    const cause = result.error?.message ?? (result.stderr || result.stdout).trim();
    throw new Error(`${path.basename(program)} ${args.join(" ")} failed: ${cause}`);
  }
  return result;
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

function walk(root, visit, current = root) {
  if (!fs.existsSync(root)) return;
  const relative = path.relative(root, current);
  if (relative !== "") visit(current, relative);
  if (!fs.lstatSync(current).isDirectory()) return;
  for (const entry of fs.readdirSync(current).sort()) walk(root, visit, path.join(current, entry));
}

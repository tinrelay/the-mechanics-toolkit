import fs from "node:fs";
import path from "node:path";
import {spawnSync} from "node:child_process";
import {inspectAppBundle, sha256File} from "./app-bundle.mjs";
import {
  applyPatchFleet,
  equalRecords,
  recordDifferences,
  treeSnapshot,
  verifyPatchFleet
} from "./stage-patch-fleet.mjs";

const applicationRelative = "usr/lib/chatgpt";
const toolkitMetadataRelative = "resources/tmtk-package.json";

export function patchLinuxPackageRoot({
  packageRoot,
  sourceLabel,
  sourcePackage,
  sourceSha256,
  selected,
  configFile,
  config,
  repository,
  asar,
  toolkit
}) {
  validatePatchScopes(selected, sourceLabel);
  const app = path.join(packageRoot, applicationRelative);
  const sourceApplication = inspectAppBundle(app, {platform: "linux"});
  if (sourceApplication.version !== sourcePackage.version) {
    throw new Error(`${sourceLabel} and inner application versions disagree`);
  }
  const sourceData = packageTreeSnapshot(packageRoot, {excludeDebianControl: true});
  const sourceUnpacked = `${sourceApplication.archive.path}.unpacked`;
  requireDirectory(sourceUnpacked, "unpacked native-module directory");
  const sourceNative = treeSnapshot(sourceUnpacked);
  const unpackedPaths = asarUnpackedPaths(asar, sourceApplication.archive.path);
  const unpackRules = deriveUnpackRules(unpackedPaths, sourceUnpacked);

  const extracted = path.join(path.dirname(packageRoot), "asar");
  run(asar, ["extract", sourceApplication.archive.path, extracted]);
  const fleet = applyPatchFleet({
    selected,
    roots: {asar: extracted},
    configFile,
    config,
    repository,
    sourceLabel
  });

  const newArchive = `${sourceApplication.archive.path}.tmtk-new`;
  const newUnpacked = `${newArchive}.unpacked`;
  const standaloneStates = unpackRules.files.map(relative => {
    const target = path.join(extracted, relative);
    if (!fs.existsSync(target)) throw new Error(`ASAR extraction lost unpacked path: ${relative}`);
    const stat = fs.lstatSync(target);
    return {relative, file: stat.isFile(), symlink: stat.isSymbolicLink(), mode: stat.mode & 0o777};
  });
  run(asar, ["pack", extracted, newArchive, ...unpackArguments(unpackRules)]);
  const repackedPaths = asarUnpackedPaths(asar, newArchive);
  if (!equalRecords(unpackedPaths, repackedPaths)) {
    const sourceSet = new Set(unpackedPaths);
    const repackedSet = new Set(repackedPaths);
    const missing = unpackedPaths.filter(name => !repackedSet.has(name)).slice(0, 20);
    const added = repackedPaths.filter(name => !sourceSet.has(name)).slice(0, 20);
    throw new Error("ASAR repack did not preserve the source unpacked-header paths " +
      `(missing ${JSON.stringify(missing)}, added ${JSON.stringify(added)}, ` +
      `standalone ${JSON.stringify(standaloneStates)})`);
  }
  requireDirectory(newUnpacked, "repacked native-module directory");
  fs.cpSync(sourceUnpacked, newUnpacked, {
    recursive: true,
    force: true,
    preserveTimestamps: true,
    verbatimSymlinks: true
  });
  restoreTreeModes(sourceUnpacked, newUnpacked);
  if (!equalRecords(sourceNative, treeSnapshot(newUnpacked))) {
    throw new Error("ASAR repack did not preserve the source native-module tree");
  }
  fs.renameSync(newArchive, sourceApplication.archive.path);
  fs.rmSync(sourceUnpacked, {recursive: true, force: true});
  fs.renameSync(newUnpacked, sourceUnpacked);

  const stagedApplication = inspectAppBundle(app, {platform: "linux"});
  if (stagedApplication.version !== sourceApplication.version ||
      stagedApplication.build !== sourceApplication.build) {
    throw new Error("Staging changed the inner application version or build");
  }
  const metadata = {
    schemaVersion: 1,
    source: {...sourcePackage, sha256: sourceSha256},
    toolkit,
    patches: selected.map(definition => definition.name),
    application: {
      version: stagedApplication.version,
      build: stagedApplication.build,
      asarSha256: stagedApplication.archive.sha256
    }
  };
  fs.writeFileSync(path.join(app, toolkitMetadataRelative), `${JSON.stringify(metadata, null, 2)}\n`, {
    encoding: "utf8",
    mode: 0o644
  });
  return {
    metadata,
    changedTargets: fleet.changedTargets,
    sourceData,
    sourceApplication,
    stagedApplication
  };
}

export function verifyLinuxPackageRoot({
  packageRoot,
  sourceData,
  metadata,
  selected,
  configFile,
  config,
  repository,
  asar
}) {
  verifyDataChanges(sourceData, packageTreeSnapshot(packageRoot, {excludeDebianControl: true}));
  const app = path.join(packageRoot, applicationRelative);
  const finalInspection = inspectAppBundle(app, {platform: "linux"});
  const finalMetadata = readJson(path.join(app, toolkitMetadataRelative));
  if (!equalRecords(finalMetadata, metadata)) {
    throw new Error("Rebuilt Linux package did not preserve its toolkit metadata");
  }
  const verifiedAsar = path.join(path.dirname(packageRoot), "verified-asar");
  run(asar, ["extract", finalInspection.archive.path, verifiedAsar]);
  verifyPatchFleet({selected, roots: {asar: verifiedAsar}, configFile, config, repository});
  return finalInspection;
}

export function toolkitIdentity(repository) {
  const commit = run("/usr/bin/git", ["-C", repository, "rev-parse", "HEAD"]).stdout.trim();
  const dirty = run("/usr/bin/git", ["-C", repository, "status", "--porcelain"]).stdout !== "";
  return {commit, dirty};
}

export function packageTreeSnapshot(root, {excludeDebianControl = false} = {}) {
  const snapshot = {};
  walk(root, (file, relative) => {
    if (excludeDebianControl && (relative === "DEBIAN" || relative.startsWith("DEBIAN/"))) return;
    const stat = fs.lstatSync(file);
    snapshot[relative] = stat.isSymbolicLink()
      ? {type: "symlink", target: fs.readlinkSync(file)}
      : stat.isFile()
        ? {type: "file", sha256: sha256File(file), mode: stat.mode & 0o777}
        : {type: "directory", mode: stat.mode & 0o777};
  });
  return snapshot;
}

export function installedSize(packageRoot) {
  let bytes = 0;
  walk(packageRoot, (file, relative) => {
    if (relative === "DEBIAN" || relative.startsWith("DEBIAN/")) return;
    const stat = fs.lstatSync(file);
    if (stat.isFile()) bytes += stat.size;
  });
  return Math.ceil(bytes / 1024);
}

function validatePatchScopes(selected, sourceLabel) {
  const appPatches = selected.filter(definition => definition.scope === "app");
  if (appPatches.length > 0) {
    throw new Error(`${sourceLabel} staging does not support app-scope patches: ` +
      appPatches.map(patch => patch.name).join(", "));
  }
}

function verifyDataChanges(before, after) {
  const allowed = new Set([
    `${applicationRelative}/resources/app.asar`,
    `${applicationRelative}/${toolkitMetadataRelative}`
  ]);
  const names = [...new Set([...Object.keys(before), ...Object.keys(after)])].sort();
  const unexpected = names.filter(name => !allowed.has(name) &&
    JSON.stringify(before[name]) !== JSON.stringify(after[name]));
  if (unexpected.length > 0) {
    throw new Error(`Rebuilt Linux package changed non-owned payloads: ${recordDifferences(
      Object.fromEntries(unexpected.map(name => [name, before[name]])),
      Object.fromEntries(unexpected.map(name => [name, after[name]]))
    )}`);
  }
}

function restoreTreeModes(source, destination) {
  fs.chmodSync(destination, fs.lstatSync(source).mode & 0o777);
  walk(source, (file, relative) => {
    const stat = fs.lstatSync(file);
    if (!stat.isSymbolicLink()) fs.chmodSync(path.join(destination, relative), stat.mode & 0o777);
  });
}

function asarUnpackedPaths(asar, archive) {
  const prefix = "unpack : /";
  return run(asar, ["list", "--is-pack", archive]).stdout.split("\n")
    .filter(line => line.startsWith(prefix))
    .map(line => line.slice(prefix.length))
    .sort();
}

function deriveUnpackRules(headerPaths, unpackedRoot) {
  if (headerPaths.length === 0) throw new Error("Source application has no unpacked ASAR entries");
  const directories = headerPaths.filter(relative => fs.statSync(path.join(unpackedRoot, relative)).isDirectory())
    .sort((left, right) => left.length - right.length || left.localeCompare(right));
  const roots = [];
  for (const relative of directories) {
    if (!roots.some(root => relative === root || relative.startsWith(`${root}/`))) roots.push(relative);
  }
  const files = headerPaths.filter(relative => !fs.statSync(path.join(unpackedRoot, relative)).isDirectory())
    .filter(relative => !roots.some(root => relative.startsWith(`${root}/`)));
  return {directories: roots.sort(), files: files.sort()};
}

function unpackArguments({directories, files}) {
  const args = [];
  const directoryGlob = exactGlob(directories);
  const basenames = files.map(file => path.posix.basename(file));
  if (new Set(basenames).size !== basenames.length) {
    throw new Error("Cannot preserve standalone unpacked ASAR files with duplicate basenames");
  }
  const fileGlob = exactGlob(basenames);
  if (directoryGlob) args.push("--unpack-dir", directoryGlob);
  if (fileGlob) args.push("--unpack", fileGlob);
  return args;
}

function exactGlob(paths) {
  if (paths.length === 0) return null;
  const unsafe = paths.find(file => /[{},!\[\]*?\\]/.test(file));
  if (unsafe) throw new Error(`Cannot safely preserve unpacked ASAR path in a glob: ${unsafe}`);
  return paths.length === 1 ? paths[0] : `{${paths.join(",")}}`;
}

function run(program, args) {
  const result = spawnSync(program, args, {encoding: "utf8", maxBuffer: 64 * 1024 * 1024});
  if (result.error != null || result.status !== 0) {
    const cause = result.error?.message ?? (result.stderr || result.stdout).trim();
    throw new Error(`${path.basename(program)} ${args.join(" ")} failed: ${cause}`);
  }
  return result;
}

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (error) {
    throw new Error(`Cannot read ${path.basename(file)}: ${error.message}`);
  }
}

function requireDirectory(target, label) {
  if (!fs.existsSync(target) || !fs.statSync(target).isDirectory()) {
    throw new Error(`Missing ${label}: ${target}`);
  }
}

function walk(root, visit, current = root) {
  const relative = path.relative(root, current);
  if (relative !== "") visit(current, relative);
  if (!fs.lstatSync(current).isDirectory()) return;
  for (const entry of fs.readdirSync(current).sort()) walk(root, visit, path.join(current, entry));
}

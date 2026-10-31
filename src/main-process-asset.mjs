import fs from "node:fs";
import path from "node:path";

export function mainProcessAsset(root) {
  const build = path.join(root, ".vite/build");
  const legacy = fs.readdirSync(build).filter(name => /^main-.*\.js$/.test(name));
  const current = "early-bootstrap-916-2f6483d5bfd826f1.js";
  const currentFile = path.join(build, current);
  if (legacy.length === 1 && !fs.existsSync(currentFile)) return path.join(build, legacy[0]);
  if (legacy.length !== 0) throw new Error("Upstream changed: ambiguous main-process assets");
  const manifest = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
  const entry = fs.readFileSync(path.join(build, "early-bootstrap.js"), "utf8");
  const bootstrap = fs.readFileSync(path.join(build, "early-bootstrap-339-aea964a206c655e4.js"), "utf8");
  const source = fs.readFileSync(currentFile, "utf8");
  if (manifest.main !== ".vite/build/early-bootstrap.js" || manifest.version !== "26.1027.30824" ||
      String(manifest.codexBuildNumber) !== "22943" ||
      !entry.includes('339:"aea964a206c655e4"') || !entry.includes('916:"2f6483d5bfd826f1"') ||
      !bootstrap.includes('let{runMainAppStartup:e}=await Promise.all([n.e(419),n.e(916)]).then(n.bind(n,61071));await e()') ||
      !source.startsWith("exports.ids=[916],exports.modules={") ||
      !source.includes('let eeC=(0,em.vB9)("electron-message-handler")')) {
    throw new Error("Upstream changed: unrecognized main-process bootstrap owner");
  }
  return currentFile;
}

export function mainMessageAnchor(source) {
  return source.startsWith("exports.ids=[916],exports.modules={")
    ? 'case"electron-add-new-workspace-root-option":'
    : "case`electron-add-new-workspace-root-option`:";
}

export function mainLoggerOwner(source) {
  const pattern = source.startsWith("exports.ids=[916],exports.modules={")
    ? /let eeC=\(0,em\.vB9\)\("electron-message-handler"\)/g
    : /var [$\w]+=[$\w]+\.(?:i|Lt|a)\(`electron-message-handler`\)/g;
  const owners = [...source.matchAll(pattern)];
  if (owners.length !== 1) throw new Error("Upstream changed: main logger owner is not unique");
  return owners[0];
}

import fs from "node:fs";
import path from "node:path";

export function mainProcessAsset(root) {
  const build = path.join(root, ".vite/build");
  const legacy = fs.readdirSync(build).filter(name => /^main-.*\.js$/.test(name));
  const profiles = [
    {version: "26.1103.41825", build: "25679", chunk: 854, hash: "5239e17d5abd99b3", bootstrap: "8cdc01c6be3ea2a7", module: 60357, logger: "ze", logging: "ed"},
    {version: "26.1027.30824", build: "22943", chunk: 916, hash: "2f6483d5bfd826f1", bootstrap: "aea964a206c655e4", module: 61071, logger: "eeC"}
  ];
  if (legacy.length === 1 && !profiles.some(profile => fs.existsSync(path.join(build, `early-bootstrap-${profile.chunk}-${profile.hash}.js`)))) return path.join(build, legacy[0]);
  if (legacy.length !== 0) throw new Error("Upstream changed: ambiguous main-process assets");
  const manifest = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
  const profile = profiles.find(profile => profile.version === manifest.version && profile.build === String(manifest.codexBuildNumber));
  if (profile == null) throw new Error("Upstream changed: unrecognized main-process package");
  const currentFile = path.join(build, `early-bootstrap-${profile.chunk}-${profile.hash}.js`);
  const entry = fs.readFileSync(path.join(build, "early-bootstrap.js"), "utf8");
  const bootstrap = fs.readFileSync(path.join(build, `early-bootstrap-339-${profile.bootstrap}.js`), "utf8");
  const source = fs.readFileSync(currentFile, "utf8");
  if (manifest.main !== ".vite/build/early-bootstrap.js" ||
      !entry.includes(`339:"${profile.bootstrap}"`) || !entry.includes(`${profile.chunk}:"${profile.hash}"`) ||
      !bootstrap.includes(`let{runMainAppStartup:e}=await Promise.all([n.e(419),n.e(${profile.chunk})]).then(n.bind(n,${profile.module}));await e()`) ||
      !source.startsWith(`exports.ids=[${profile.chunk}],exports.modules={`) ||
      !source.includes(`let ${profile.logger}=(0,${profile.logging ?? "em"}.vB9)("electron-message-handler")`)) {
    throw new Error("Upstream changed: unrecognized main-process bootstrap owner");
  }
  return currentFile;
}

export function mainMessageAnchor(source) {
  return isWebpackMain(source)
    ? 'case"electron-add-new-workspace-root-option":'
    : "case`electron-add-new-workspace-root-option`:";
}

export function mainLoggerOwner(source) {
  const pattern = isWebpackMain(source)
    ? /let (?:eeC|ze)=\(0,(?:em|ed)\.vB9\)\("electron-message-handler"\)/g
    : /var [$\w]+=[$\w]+\.(?:i|Lt|a)\(`electron-message-handler`\)/g;
  const owners = [...source.matchAll(pattern)];
  if (owners.length !== 1) throw new Error("Upstream changed: main logger owner is not unique");
  return owners[0];
}

export function isWebpackMain(source) {
  return source.startsWith("exports.ids=[854],exports.modules={") || source.startsWith("exports.ids=[916],exports.modules={");
}

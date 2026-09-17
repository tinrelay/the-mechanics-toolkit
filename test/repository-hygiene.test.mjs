import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";

import {sourcePatchDefinitions} from "../src/source-patch-catalog.mjs";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function read(relativePath) {
  return fs.readFileSync(path.join(repositoryRoot, relativePath), "utf8");
}

function readJson(relativePath) {
  return JSON.parse(read(relativePath));
}

function filesBelow(relativeDirectory, predicate = () => true) {
  const root = path.join(repositoryRoot, relativeDirectory);
  const found = [];

  function visit(directory) {
    for (const entry of fs.readdirSync(directory, {withFileTypes: true})) {
      if ([".git", ".work", "node_modules"].includes(entry.name)) continue;
      const absolute = path.join(directory, entry.name);
      if (entry.isDirectory()) visit(absolute);
      if (entry.isFile() && predicate(absolute)) {
        found.push(path.relative(repositoryRoot, absolute));
      }
    }
  }

  visit(root);
  return found.sort();
}

const packageJson = readJson("package.json");
const packageLock = readJson("package-lock.json");
assert.equal(packageLock.version, packageJson.version, "package-lock version matches package.json");
assert.equal(
  packageLock.packages[""].version,
  packageJson.version,
  "package-lock root package version matches package.json"
);

const upgrading = read("UPGRADING.md");
const currentUpgrade = upgrading.match(/^## (\d+\.\d+\.\d+)$/m)?.[1];
assert.equal(currentUpgrade, packageJson.version, "UPGRADING starts with the current package version");

const requiredExamples = [
  "examples/rescue-agent.example.json",
  "examples/toolkit.linux.example.json",
  "examples/toolkit.macos.example.json",
  "examples/toolkit.windows.example.json"
];
for (const example of requiredExamples) readJson(example);

const obsoleteRootPaths = [
  "rescue-agent.example.json",
  "toolkit.example.json",
  "toolkit.linux.example.json",
  "toolkit.windows.example.json",
  "docs/local-signing.md",
  "docs/update-workflow.md",
  "src/stage-app.mjs",
  "test/stage-app.test.mjs"
];
for (const obsoletePath of obsoleteRootPaths) {
  assert.ok(!fs.existsSync(path.join(repositoryRoot, obsoletePath)), `${obsoletePath} stays retired`);
}

const markdownFiles = filesBelow(".", file => file.endsWith(".md"));
for (const markdownFile of markdownFiles) {
  const markdown = read(markdownFile);

  for (const match of markdown.matchAll(/```json\s*\n([\s\S]*?)```/g)) {
    assert.doesNotThrow(() => JSON.parse(match[1]), `${markdownFile} contains valid fenced JSON`);
  }

  for (const match of markdown.matchAll(/!?\[[^\]]*\]\(([^)]+)\)/g)) {
    let target = match[1].trim();
    if (target.startsWith("<") && target.endsWith(">")) target = target.slice(1, -1);
    else target = target.split(/\s+["']/u, 1)[0];
    if (!target || target.startsWith("#") || /^[a-z][a-z0-9+.-]*:/iu.test(target)) continue;

    const relativeTarget = decodeURI(target.split("#", 1)[0]);
    if (!relativeTarget) continue;
    const absoluteTarget = path.resolve(repositoryRoot, path.dirname(markdownFile), relativeTarget);
    assert.ok(fs.existsSync(absoluteTarget), `${markdownFile} links to existing ${relativeTarget}`);
  }
}

for (const patchReadme of filesBelow("patches", file => path.basename(file) === "README.md")) {
  const markdown = read(patchReadme);
  assert.doesNotMatch(markdown, /\bbuild[- ]?\d{4,}\b/iu, `${patchReadme} defers builds to the ledger`);
  assert.doesNotMatch(markdown, /\b26\.\d{3}\.\d+\b/u, `${patchReadme} defers versions to the ledger`);
}

const catalogPatches = sourcePatchDefinitions.map(definition => definition.patch).sort();
const storedPatches = filesBelow("source-patches", file => file.endsWith(".patch"));
assert.deepEqual(storedPatches, catalogPatches, "source-patches retains only cataloged current diffs");

for (const document of [read("README.md"), upgrading]) {
  assert.match(document, /Ubuntu/u, "current release documentation names Ubuntu");
  assert.match(document, /Fedora/u, "current release documentation names Fedora");
  assert.match(document, /amd64/u, "current release documentation names DEB AMD64 support");
  assert.match(document, /x86_64/u, "current release documentation names RPM AMD64 support");
}

console.log("repository hygiene probe passed");

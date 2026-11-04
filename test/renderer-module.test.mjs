import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {readRendererModule, writeRendererModule} from "../src/renderer-module.mjs";

const root = fs.mkdtempSync(path.join(os.tmpdir(), "tmtk-renderer-module-"));
try {
  const file = path.join(root, "chunk.js");
  const untouched = 'other(e,t,n){const label="},target(e,t,n){";t.value=label}';
  fs.writeFileSync(file, `export const __webpack_modules__={target(e,t,n){t.value="old"},${untouched}};`);
  const owner = {file, id: "target", parameters: ["e", "t", "n"]};
  const source = readRendererModule(owner);
  assert.equal(source, 't.value="old"');
  writeRendererModule(owner, 't.value="new"');
  assert.equal(readRendererModule(owner), 't.value="new"');
  assert.ok(fs.readFileSync(file, "utf8").includes(untouched), "editing one module preserves its sibling and string contents");
  assert.throws(() => readRendererModule({...owner, parameters: ["a", "b", "c"]}), /parameters/, "imports must use the actual module's require binding");
  assert.throws(() => readRendererModule({...owner, id: "absent"}), /unique/, "missing owners fail closed");
  fs.writeFileSync(file, 'export const __webpack_modules__={target(e,t,n){},target(e,t,n){}};');
  assert.throws(() => readRendererModule(owner), /unique/, "duplicated module IDs fail closed");
  fs.writeFileSync(file, 'var ignored={},u={bus(e,a,c){a.value="ready"}};');
  assert.equal(readRendererModule({file, id: "bus", parameters: ["e", "a", "c"], registry: "u"}), 'a.value="ready"');
  console.log("renderer module ownership probe passed");
} finally {
  fs.rmSync(root, {recursive: true, force: true});
}

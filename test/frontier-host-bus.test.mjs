import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {incomingBuild20156} from "../patches/tinrelay-pointer-presentation/profiles/build20156.mjs";
import {build20156} from "../patches/outgoing-message-receipt/profiles/build20156.mjs";

const repository = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const scratch = fs.mkdtempSync(path.join(os.tmpdir(), "tmtk-frontier-bus-"));
const renderer = path.join(scratch, "conversation.js");
const shared = path.join(scratch, "app-shared-8bd9d0399038.js");
const source = 'import{Nvn as Bus}from"./app-shared-8bd9d0399038.js";';
const id = "[$A-Z_a-z][$\\w]*";
const escapeRegExp = value => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const uniqueMatch = (value, pattern, label) => {
  const matches = [...value.matchAll(pattern)];
  if (matches.length !== 1) throw new Error(`Upstream changed: ${label}`);
  return matches[0];
};
function functionSource(file, name) {
  const text = fs.readFileSync(path.join(repository, file), "utf8");
  const start = text.indexOf(`function ${name}(`);
  assert.ok(start >= 0, `${name} exists`);
  const end = text.indexOf("\nfunction ", start + 1);
  return text.slice(start, end < 0 ? undefined : end);
}
try {
  fs.writeFileSync(shared, 'const Hf=Vf.getInstance();const methods={dispatchMessage(e,t){},subscribe(e,t){}};export{Hf as Nvn};');
  const incoming = Function("fs", "path", "renderer", "incomingRendererProfile", "uniqueMatch", "escapeRegExp",
    `${functionSource("patches/tinrelay-pointer-presentation/incoming-transform.mjs", "resolveHostBus")};return resolveHostBus`)(
    fs, path, renderer, () => incomingBuild20156, uniqueMatch, escapeRegExp);
  assert.equal(incoming(source), "MTKtinrelayBus", "incoming correspondence uses the actual frontier singleton");
  const other = {dynamic: {before: "legacy-owner"}, hostBus: {exported: "Other"}};
  const outgoing = Function("fs", "path", "conversationTarget", "build20156", "build11645", "build10789", "build9922", "linuxBuild9771", "linuxBuild10954", "uniqueMatch", "escapeRegExp", "id",
    `${functionSource("patches/outgoing-message-receipt/patch.mjs", "exportedAs")};${functionSource("patches/outgoing-message-receipt/patch.mjs", "resolveHostBus")};return resolveHostBus`)(
    fs, path, renderer, build20156, other, other, other, other, other, uniqueMatch, escapeRegExp, id);
  assert.equal(outgoing(source + build20156.dynamic.before), "MTKoutboundHostBus",
    "outgoing receipts use the same real host bus");
} finally {
  fs.rmSync(scratch, {recursive: true, force: true});
}
console.log("frontier host-bus probe passed");

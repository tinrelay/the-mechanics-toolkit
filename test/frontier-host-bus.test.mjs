import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {incomingBuild20586} from "../patches/tinrelay-pointer-presentation/profiles/build20586.mjs";
import {build20586} from "../patches/outgoing-message-receipt/profiles/build20586.mjs";

const repository = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const scratch = fs.mkdtempSync(path.join(os.tmpdir(), "tmtk-frontier-bus-"));
const renderer = path.join(scratch, "conversation.js");
const shared = path.join(scratch, "app-shared-52443cbe9ac4.js");
const source = 'import{gPt as Bus}from"./app-shared-52443cbe9ac4.js";';
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
  fs.writeFileSync(shared, 'const $m=Qm.getInstance();const methods={dispatchMessage(e,t){},subscribe(e,t){}};export{$m as gPt};');
  const incoming = Function("fs", "path", "renderer", "incomingRendererProfile", "uniqueMatch", "escapeRegExp",
    `${functionSource("patches/tinrelay-pointer-presentation/incoming-transform.mjs", "resolveHostBus")};return resolveHostBus`)(
    fs, path, renderer, () => incomingBuild20586, uniqueMatch, escapeRegExp);
  assert.equal(incoming(source), "MTKtinrelayBus", "incoming correspondence uses the actual frontier singleton");
  const other = {dynamic: {before: "legacy-owner"}, hostBus: {exported: "Other"}};
  const outgoing = Function("fs", "path", "conversationTarget", "build20586", "build11645", "build10789", "build9922", "linuxBuild9771", "linuxBuild10954", "uniqueMatch", "escapeRegExp", "id",
    `${functionSource("patches/outgoing-message-receipt/patch.mjs", "exportedAs")};${functionSource("patches/outgoing-message-receipt/patch.mjs", "resolveHostBus")};return resolveHostBus`)(
    fs, path, renderer, build20586, other, other, other, other, other, uniqueMatch, escapeRegExp, id);
  assert.equal(outgoing(source + build20586.dynamic.before), "MTKoutboundHostBus",
    "outgoing receipts use the same real host bus");

  const classifier = 'function Ak({unit:e,hasFollowingFinalAnswer:t,keepMcpAppEntriesPersistent:n,mcpServerStatuses:r,renderMcpApps:i}){if(e.kind!==`standalone`)return!1;let a=e.item.item;return a.type===`user-input-response`?!a.completed:a.type===`mcp-tool-call`&&lg(a)||a.type===`assistant-message`&&ki(a)||a.type===`dynamic-tool-call`&&Eg(a)||n&&i&&a.type===`mcp-tool-call`&&jk({item:a,mcpServerStatuses:r})?!0:a.type===`user-message`&&(a.steeringStatus===`pending`||a.deliveryStatus===`not-sent`||a.hookFeedback===!0||!t)}';
  const selectClassifier = Function("uniqueMatch",
    `${functionSource("patches/tinrelay-pointer-presentation/outgoing-transform.mjs", "persistentClassifier")};return persistentClassifier`)(uniqueMatch);
  assert.equal(selectClassifier(classifier).groups.item, "a");
  const patched = classifier.replace('a.type===`dynamic-tool-call`',
    'a.type===`exec`&&MTKtinrelayOutgoingAcceptance(a)!=null||a.type===`dynamic-tool-call`');
  assert.equal(selectClassifier(patched)[0], patched, "complete current classifier is recognized after application");
  const persistent = Function("MTKtinrelayOutgoingAcceptance", "lg", "ki", "Eg", "jk",
    `${patched};return Ak`)(item => item.accepted ? {} : null, () => false, () => false,
    () => false, () => false);
  const unit = item => ({kind: "standalone", item: {item}});
  assert.equal(persistent({unit: unit({type: "exec", accepted: true}), hasFollowingFinalAnswer: true}), true);
  assert.equal(persistent({unit: unit({type: "exec"}), hasFollowingFinalAnswer: true}), false);
  assert.equal(persistent({unit: unit({type: "user-input-response", completed: false})}), true,
    "new native pending-response behavior survives composition");
  assert.equal(persistent({unit: unit({type: "user-message"}), hasFollowingFinalAnswer: false}), true);
  assert.equal(persistent({unit: unit({type: "user-message"}), hasFollowingFinalAnswer: true}), false);
  assert.equal(persistent({unit: unit({type: "user-message", deliveryStatus: "not-sent"}), hasFollowingFinalAnswer: true}), true);
} finally {
  fs.rmSync(scratch, {recursive: true, force: true});
}
console.log("frontier host-bus probe passed");

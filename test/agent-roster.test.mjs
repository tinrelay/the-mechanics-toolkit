#!/usr/bin/env node
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(process.argv[2] ?? "");
if (!process.argv[2]) throw new Error("usage: agent-roster.test.mjs EXTRACTED_ASAR_ROOT");
const assets = path.join(root, "webview/assets");
const target = uniqueFile(/^app-initial-.*\.js$/, assets);
const source = fs.readFileSync(target, "utf8");
const start = source.indexOf('const MTKagentRosterRelativePath=');
const end = source.indexOf("function MTKuseAgentRoster()", start);
assert.ok(start >= 0 && end > start, "agent roster helper boundary");
const helper = source.slice(start, end);

const files = new Map();
const metadata = new Map();
const file = (name, value) => {
  files.set(name, Buffer.from(value).toString("base64"));
  metadata.set(name, { isFile: true, isDirectory: false, isSymlink: false });
};
const directory = name => metadata.set(name, { isFile: false, isDirectory: true, isSymlink: false });
const client = {
  async sendRequest(type, { path: target }) {
    if (type === "fs/getMetadata") {
      const value = metadata.get(target);
      if (value == null) throw Object.assign(new Error("No such file or directory"), { code: "ENOENT" });
      return value;
    }
    if (type === "fs/readFile") return { dataBase64: files.get(target) };
    throw new Error(`unexpected request ${type}`);
  }
};
const state = { get: () => true, when: async () => {} };
const realm = {};
const quietConsole = { error() {} };
const api = Function(
  "globalThis", "atob", "TextDecoder", "console", "Om", "Dm", "b6", "P6", "Ym", "Jm",
  `${helper};return {parse:MTKparseAgentRoster,load:MTKloadAgentRoster,install:MTKinstallAgentRoster,reload:MTKreloadAgentRoster,service:globalThis.__MTK_AGENT_ROSTER__}`
)(
  realm,
  atob,
  TextDecoder,
  quietConsole,
  Symbol("ready"),
  () => client,
  Symbol("ready"),
  () => client,
  Symbol("ready"),
  () => client
);

const tamsinId = "11111111-1111-4111-8111-111111111111";
const otherId = "22222222-2222-4222-8222-222222222222";
directory("/office/.codex");
directory("/ship/.codex");
directory("/office/.codex/marks");
file("/office/.codex/marks/tamsin.svg", "<svg/>");
file("/office/.codex/agent-roster.json", JSON.stringify({
  version: 1,
  officeExtension: { accepted: true },
  agents: {
    tamsin: {
      name: "Tamsin",
      taskId: tamsinId,
      color: "#AABBCC",
      mark: ".codex/marks/tamsin.svg",
      pluginOwnedField: "preserved"
    }
  },
  tasks: {
    muteTamsinForTheDay: { titlePattern: "^Tamsin", muteCompletion: true }
  }
}));
file("/ship/.codex/agent-roster.json", JSON.stringify({
  version: 1,
  agents: {},
  tasks: { green: { taskId: otherId, color: "#00AA44" } },
  foreignPlugin: { enabled: true }
}));

const loaded = await api.load(state, ["/ship", "/office", "/office"]);
assert.equal(loaded.state, "valid");
api.install(loaded.snapshot);
assert.equal(api.service.current().sources.length, 2, "multiple project rosters aggregate");
assert.equal(api.service.match("Tamsin — Portfolio Secretary", tamsinId).kind, "agent",
  "exact identity wins over an additive title rule");
const tamsinMatches = api.service.matches("Tamsin — Portfolio Secretary", tamsinId);
assert.deepEqual(tamsinMatches.map(entry => entry.key).sort(), ["muteTamsinForTheDay", "tamsin"]);
assert.equal(tamsinMatches.some(entry => entry.data.muteCompletion === true), true,
  "a title rule can mute a named agent without replacing identity");
assert.equal(api.service.match("Other title", otherId).key, "green");
assert.equal(api.service.match("Tamsin", tamsinId).data.pluginOwnedField, "preserved",
  "unknown entry keys survive for independent consumers");
assert.equal(await api.service.readAsset(api.service.match("Tamsin", tamsinId), ".codex/marks/tamsin.svg"),
  Buffer.from("<svg/>").toString("base64"), "marks resolve from the owning roster root");
assert.equal(await api.service.readAsset(api.service.match("Tamsin", tamsinId), "../secret"), null,
  "asset traversal is refused");

const validSnapshot = api.service.current();
file("/ship/.codex/agent-roster.json", JSON.stringify({
  version: 1,
  agents: {},
  tasks: { duplicate: { taskId: tamsinId, muteCompletion: true } }
}));
assert.equal(await api.reload(state, ["/office", "/ship"], { initial: false }, () => true), false,
  "duplicate task identity rejects the aggregate");
assert.equal(api.service.current(), validSnapshot, "invalid reload preserves the last valid aggregate");
assert.equal(api.service.diagnostic().code, "duplicate-task-id");

file("/ship/.codex/agent-roster.json", "{broken");
assert.equal(await api.reload(state, ["/office", "/ship"], { initial: false }, () => true), false);
assert.equal(api.service.current(), validSnapshot, "malformed reload preserves the last valid aggregate");

metadata.delete("/office/.codex/agent-roster.json");
metadata.delete("/ship/.codex/agent-roster.json");
assert.equal(await api.reload(state, ["/office", "/ship"], { initial: false }, () => true), true);
assert.equal(api.service.current(), null, "removing all rosters disables roster effects");

process.stdout.write(`${JSON.stringify({
  state: "green",
  discovery: "registered-local-project-roots",
  conflict: "duplicate-task-id-fails-closed",
  reload: "last-valid-aggregate",
  attention: "exact-plus-title-rules"
}, null, 2)}\n`);

function uniqueFile(pattern, directoryName) {
  const matches = fs.readdirSync(directoryName).filter(name => pattern.test(name));
  assert.equal(matches.length, 1, `unique file ${pattern}`);
  return path.join(directoryName, matches[0]);
}

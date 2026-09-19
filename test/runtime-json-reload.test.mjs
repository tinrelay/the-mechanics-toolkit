#!/usr/bin/env node
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(process.argv[2] ?? "");
if (!process.argv[2]) throw new Error("usage: runtime-json-reload.test.mjs EXTRACTED_ASAR_ROOT");
const assets = path.join(root, "webview/assets");
const mainDirectory = path.join(root, ".vite/build");
const renderer = rendererFile(assets);
const main = uniqueFile(/^main-.*\.js$/, mainDirectory);
const rendererSource = fs.readFileSync(renderer, "utf8");
const mainSource = fs.readFileSync(main, "utf8");

const rendererStart = rendererSource.indexOf('const MTKruntimeJsonFiles=');
const rendererTail = rendererSource.slice(rendererStart);
const rendererTerminator = /(?<bus>[$A-Z_a-z][$\w]*)\.subscribe\("mtk-runtime-json-changed",e=>\{MTKruntimeJsonFiles\.has\(e\?\.fileName\)&&MTKruntimeJsonQueue\(e\.fileName,!1\)\}\)\}/.exec(rendererTail);
const rendererEnd = rendererTerminator == null ? -1 : rendererStart + rendererTerminator.index + rendererTerminator[0].length;
assert.ok(rendererStart >= 0 && rendererTerminator != null && rendererEnd > rendererStart, "renderer helper boundary");
const rendererHelper = rendererSource.slice(rendererStart, rendererEnd);
const subscriptions = new Map();
const dispatches = [];
const hostBus = {
  subscribe(type, callback) {
    subscriptions.set(type, callback);
    return () => subscriptions.delete(type);
  },
  dispatchMessage(type, payload) {
    dispatches.push({ type, payload });
  }
};
const realm = {};
const rendererApi = Function(
  "globalThis", rendererTerminator.groups.bus, "queueMicrotask",
  `${rendererHelper};return {install:MTKinstallRuntimeJsonReload,register:MTKruntimeJsonRegister}`
)(realm, hostBus, queueMicrotask);
rendererApi.install();
rendererApi.install();
assert.equal(realm.__MTK_RUNTIME_JSON_RELOAD__.version, 2);
assert.deepEqual(dispatches, [], "watch roots are supplied by the roster owner");
assert.equal(subscriptions.size, 1, "one renderer change subscription");

const accepted = [];
const officeRoot = process.platform === "win32"
  ? String.raw`C:\projects\office`
  : "/projects/office";
const otherRoot = process.platform === "win32"
  ? String.raw`C:\projects\other`
  : "/projects/other";
const roots = [officeRoot, otherRoot, officeRoot];
const unregister = realm.__MTK_RUNTIME_JSON_RELOAD__.register("agent-roster.json", roots, async metadata => {
  accepted.push(metadata);
  return true;
});
assert.equal(typeof unregister, "function");
assert.equal(realm.__MTK_RUNTIME_JSON_RELOAD__.register("not-owned.json", roots, () => true), null);
assert.deepEqual(dispatches, [{
  type: "mtk-runtime-json-watch",
  payload: { roots: [officeRoot, otherRoot] }
}], "one normalized watch request for the active project roots");
await drainMicrotasks();
assert.deepEqual(accepted, [{ initial: true }], "registration performs one initial acceptance pass");
subscriptions.get("mtk-runtime-json-changed")({ fileName: "not-owned.json" });
await drainMicrotasks();
assert.equal(accepted.length, 1, "unknown filenames do not reach consumers");
subscriptions.get("mtk-runtime-json-changed")({ fileName: "agent-roster.json" });
await drainMicrotasks();
assert.deepEqual(accepted, [{ initial: true }, { initial: false }], "watched change reaches the owning acceptance callback");
unregister();
subscriptions.get("mtk-runtime-json-changed")({ fileName: "agent-roster.json" });
await drainMicrotasks();
assert.equal(accepted.length, 2, "unregistered consumers receive no later changes");

let releaseAcceptance;
let activeAcceptances = 0;
let maximumConcurrentAcceptances = 0;
const serialized = [];
realm.__MTK_RUNTIME_JSON_RELOAD__.register("agent-roster.json", [officeRoot], async metadata => {
  activeAcceptances += 1;
  maximumConcurrentAcceptances = Math.max(maximumConcurrentAcceptances, activeAcceptances);
  serialized.push(metadata);
  if (serialized.length === 1) await new Promise(resolve => { releaseAcceptance = resolve; });
  activeAcceptances -= 1;
  return true;
});
await drainMicrotasks();
subscriptions.get("mtk-runtime-json-changed")({ fileName: "agent-roster.json" });
subscriptions.get("mtk-runtime-json-changed")({ fileName: "agent-roster.json" });
releaseAcceptance();
await drainMicrotasks();
await drainMicrotasks();
assert.equal(maximumConcurrentAcceptances, 1, "acceptance callbacks never overlap");
assert.deepEqual(serialized, [{ initial: true }, { initial: false }],
  "changes during validation coalesce into one later acceptance pass");

const mainStart = mainSource.indexOf('const MTKruntimeJsonFs=');
const mainOwner = mainSource.slice(mainStart).match(/var [$\w]+=[$\w]+\.i\(`electron-message-handler`\)/);
const mainEnd = mainOwner == null ? -1 : mainStart + mainOwner.index;
assert.ok(mainStart >= 0 && mainEnd > mainStart, "main helper boundary");
const mainHelper = mainSource.slice(mainStart, mainEnd);
const watchCallbacks = new Map();
let watchCount = 0;
let closeCount = 0;
let errorCallback = null;
const fakeFs = {
  lstatSync() {
    return { isDirectory: () => true, isSymbolicLink: () => false };
  },
  watch(_directory, options, callback) {
    watchCount += 1;
    assert.deepEqual(options, { persistent: false });
    watchCallbacks.set(_directory, callback);
    return {
      close() { closeCount += 1; },
      on(type, handler) {
        assert.equal(type, "error");
        errorCallback = handler;
      }
    };
  }
};
let timerId = 0;
const timers = new Map();
const setTimer = callback => {
  const id = ++timerId;
  timers.set(id, callback);
  return id;
};
const clearTimer = id => timers.delete(id);
const mainApi = Function(
  "require", "setTimeout", "clearTimeout", "Buffer",
  `${mainHelper};return {start:MTKstartRuntimeJsonWatch,close:MTKcloseRuntimeJsonWatch}`
)(name => name === "node:fs" ? fakeFs : path, setTimer, clearTimer, Buffer);
let destroyed = null;
const webContents = {
  id: 41,
  once(type, callback) {
    assert.equal(type, "destroyed");
    destroyed = callback;
  }
};
const messages = [];
const windowManager = {
  sendMessageToWebContents(target, message) {
    assert.equal(target, webContents);
    messages.push(message);
  }
};
mainApi.start(webContents, windowManager, [officeRoot, otherRoot]);
assert.equal(watchCount, 2, "one directory watcher per project root");
watchCallbacks.get(path.join(officeRoot, ".codex"))("change", "unrelated.json");
runTimers();
assert.deepEqual(messages, [], "irrelevant directory changes stay local");
watchCallbacks.get(path.join(otherRoot, ".codex"))("rename", Buffer.from("agent-roster.json"));
runTimers();
assert.deepEqual(messages, [{ type: "mtk-runtime-json-changed", fileName: "agent-roster.json" }]);
watchCallbacks.get(path.join(officeRoot, ".codex"))("rename", null);
runTimers();
assert.deepEqual(messages.slice(1).map(message => message.fileName), ["agent-roster.json"],
  "filename-less directory events conservatively refresh the roster");
destroyed();
assert.equal(closeCount, 2, "all project-root watchers close with their renderer");
assert.doesNotThrow(() => errorCallback(), "late watcher error cleanup is idempotent");
assert.equal(closeCount, 2);

assert.ok(mainSource.includes('case`mtk-runtime-json-watch`:MTKstartRuntimeJsonWatch(e,this.windowManager,t.roots);break'));
assert.ok(
  new RegExp(`${rendererTerminator.groups.bus}=[$A-Z_a-z][$\\w]*\\.getInstance\\(\\),MTKinstallRuntimeJsonReload\\(\\),`).test(rendererSource) ||
  rendererSource.includes("MTKinstallRuntimeJsonReload();export{"),
  "runtime reload installs after the host bus is available"
);
process.stdout.write(`${JSON.stringify({
  state: "green",
  watchedDirectory: ".codex",
  files: ["agent-roster.json"],
  consumerBoundary: "per-file acceptance callback",
  invalidation: "debounced-and-serialized",
  cleanup: "web-contents-destroyed"
}, null, 2)}\n`);

function uniqueFile(pattern, directory) {
  const matches = fs.readdirSync(directory).filter(name => pattern.test(name));
  assert.equal(matches.length, 1, `unique file ${pattern}`);
  return path.join(directory, matches[0]);
}

function rendererFile(directory) {
  const messageBus = fs.readdirSync(directory).filter(name => /^message-bus-.*\.js$/.test(name));
  if (messageBus.length === 1) return path.join(directory, messageBus[0]);
  assert.equal(messageBus.length, 0, "unique renderer message-bus owner");
  return uniqueFile(/^app-initial-.*\.js$/, directory);
}

async function drainMicrotasks() {
  await new Promise(resolve => setImmediate(resolve));
}

function runTimers() {
  const callbacks = [...timers.values()];
  timers.clear();
  for (const callback of callbacks) callback();
}

#!/usr/bin/env node
import assert from "node:assert/strict";
import fs from "node:fs";
import net from "node:net";
import os from "node:os";
import path from "node:path";
import {spawnSync} from "node:child_process";
import {fileURLToPath} from "node:url";

const repository = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const patch = path.join(repository, "patches/codex-observability/patch.mjs");
const suppliedRoot = process.argv[2] == null ? null : path.resolve(process.argv[2]);
const scratch = fs.mkdtempSync(path.join(os.tmpdir(), "tmtk-observability-probe-"));
const fakeHome = fs.mkdtempSync(path.join(os.tmpdir(), "to-"));
const build = path.join(scratch, ".vite", "build");
const main = path.join(build, "main-current.js");

try {
  if (suppliedRoot != null) {
    const suppliedBuild = path.join(suppliedRoot, ".vite", "build");
    const suppliedMains = fs.readdirSync(suppliedBuild).filter(name => /^main-.*\.js$/.test(name));
    assert.equal(suppliedMains.length, 1, "production probe has one main-process owner");
    const suppliedSource = fs.readFileSync(path.join(suppliedBuild, suppliedMains[0]), "utf8");
    assert.equal(suppliedSource.split('const MTKobserveContract="tmtk-codex-observability-v1"').length - 1, 1,
      "production main process contains one observability bridge");
    assert.equal(suppliedSource.split(".add(await MTKobserveStart(").length - 1, 1,
      "production main process starts one observability bridge at app readiness");
  }
  fs.mkdirSync(build, {recursive: true});
  fs.writeFileSync(main,
    "const i={i:e=>e},l={app:{whenReady:async()=>{}},webContents:{}},n={Ur:class{add(){}}};" +
    "var dQ=i.i(`electron-message-handler`);" +
    "async function boot(){let L=new n.Ur;L.add(()=>{});let R=Date.now();" +
    "await l.app.whenReady(),L.add(await MTKtinrelayStartOutgoingObserver(``)),N(`main app.whenReady resolved`,R),I&&after()}" +
    "async function MTKtinrelayStartOutgoingObserver(){}function N(){}const I=false;function after(){}\n"
  );
  const apply = spawnSync(process.execPath, [patch, "apply", scratch], {encoding: "utf8"});
  assert.equal(apply.status, 0, apply.stderr || apply.stdout);

  const source = fs.readFileSync(main, "utf8");
  const start = source.indexOf('const MTKobserveContract="tmtk-codex-observability-v1"');
  const end = source.indexOf("var dQ=", start);
  assert.ok(start >= 0 && end > start, "main helper is localized");
  const localRequire = await import("node:module").then(({createRequire}) => createRequire(import.meta.url));
  const api = Function("require", `${source.slice(start, end)};return {start:MTKobserveStart,endpoint:MTKobserveEndpoint}`)(localRequire);

  const calls = [];
  const listeners = new Map();
  let traceRead = false;
  let attached = false;
  let devtoolsOpened = false;
  const debuggerApi = {
    attach(version) { assert.equal(version, "1.3"); attached = true; },
    detach() { attached = false; },
    isAttached() { return attached; },
    on(name, callback) { listeners.set(name, callback); },
    off(name, callback) { if (listeners.get(name) === callback) listeners.delete(name); },
    async sendCommand(method, params) {
      calls.push({method, params});
      if (method === "Performance.getMetrics") return {metrics: [{name: "TaskDuration", value: 12.5}]};
      if (method === "Runtime.evaluate") return {result: {type: "number", value: 42}};
      if (method === "Profiler.stop") return {profile: {nodes: [{id: 1}], startTime: 1, endTime: 2, samples: [1], timeDeltas: [1000]}};
      if (method === "Tracing.start") return {};
      if (method === "Tracing.end") {
        queueMicrotask(() => listeners.get("message")?.({}, "Tracing.tracingComplete", {stream: "trace-stream"}));
        return {};
      }
      if (method === "IO.read") {
        assert.deepEqual(params, {handle: "trace-stream", size: 1048576});
        if (traceRead) return {data: "", eof: true};
        traceRead = true;
        return {data: '{"traceEvents":[{"name":"RunTask","ts":1}]}', eof: true};
      }
      return {};
    }
  };
  const target = {
    id: 7,
    debugger: debuggerApi,
    getType: () => "window",
    getTitle: () => "Vera",
    getURL: () => "file:///codex.html",
    getOSProcessId: () => 4321,
    isDestroyed: () => false,
    isFocused: () => true,
    isLoading: () => false,
    isDevToolsOpened: () => devtoolsOpened,
    openDevTools(options) { assert.deepEqual(options, {mode: "detach", activate: true, title: "Codex Observability"}); devtoolsOpened = true; }
  };
  const webContents = {
    getAllWebContents: () => [target],
    fromId: id => id === 7 ? target : undefined
  };

  const previousHome = process.env.HOME;
  const previousProfile = process.env.USERPROFILE;
  process.env.HOME = fakeHome;
  process.env.USERPROFILE = fakeHome;
  try {
    const dispose = await api.start(webContents);
    const endpoint = api.endpoint();
    if (process.platform !== "win32") {
      assert.equal(fs.statSync(path.dirname(endpoint)).mode & 0o777, 0o700);
      assert.equal(fs.lstatSync(endpoint).isSocket(), true);
      assert.equal(fs.statSync(endpoint).mode & 0o777, 0o600);
    }

    const listed = await request(endpoint, {contract: "tmtk-codex-observability-v1", action: "list"});
    assert.deepEqual(listed.at(-1).result, [{
      id: 7, type: "window", title: "Vera", url: "file:///codex.html", processId: 4321,
      focused: true, loading: false, devToolsOpened: false
    }]);

    const metrics = await request(endpoint, {contract: "tmtk-codex-observability-v1", action: "metrics", targetId: 7});
    assert.equal(metrics.at(-1).result.metrics[0].name, "TaskDuration");
    assert.equal(attached, false, "metrics detaches after success");

    const cdp = await request(endpoint, {contract: "tmtk-codex-observability-v1", action: "cdp", targetId: 7,
      method: "Runtime.evaluate", params: {expression: "6*7", returnByValue: true}});
    assert.equal(cdp.at(-1).result.result.value, 42);
    assert.equal(attached, false, "generic CDP detaches after success");

    const profile = await request(endpoint, {contract: "tmtk-codex-observability-v1", action: "cpu-profile",
      targetId: 7, durationMs: 1, samplingIntervalUs: 1000});
    assert.equal(profile.at(-1).result.profile.nodes[0].id, 1);
    assert.equal(attached, false, "CPU profiling detaches after success");

    const trace = await request(endpoint, {contract: "tmtk-codex-observability-v1", action: "trace",
      targetId: 7, durationMs: 1});
    assert.equal(trace.filter(frame => frame.type === "trace-chunk").map(frame => frame.data).join(""),
      '{"traceEvents":[{"name":"RunTask","ts":1}]}');
    assert.deepEqual(trace.at(-1).result, {bytes: 43}, JSON.stringify(trace));
    assert.equal(attached, false, "tracing detaches after success");

    const devtools = await request(endpoint, {contract: "tmtk-codex-observability-v1", action: "devtools", targetId: 7});
    assert.equal(devtools.at(-1).result.opened, true);

    const extended = await request(endpoint,
      {contract: "tmtk-codex-observability-v1", action: "list", futureMetadata: {version: 2}});
    assert.equal(extended.at(-1).ok, true, "additive request fields do not invalidate required fields");
    assert.equal(extended.at(-1).result[0].id, 7);

    dispose();
    await new Promise(resolve => setTimeout(resolve, 10));
    if (process.platform !== "win32") assert.equal(fs.existsSync(endpoint), false);
  } finally {
    process.env.HOME = previousHome;
    process.env.USERPROFILE = previousProfile;
  }

  assert.ok(calls.some(call => call.method === "Profiler.start"));
  assert.ok(calls.some(call => call.method === "Profiler.stop"));
  assert.ok(calls.some(call => call.method === "Tracing.start"));
  assert.ok(calls.some(call => call.method === "Tracing.end"));
  assert.ok(calls.some(call => call.method === "IO.close"));
} finally {
  fs.rmSync(scratch, {recursive: true, force: true});
  fs.rmSync(fakeHome, {recursive: true, force: true});
}

function request(endpoint, payload) {
  return new Promise((resolve, reject) => {
    const frames = [];
    let buffer = "";
    const socket = net.createConnection(endpoint);
    socket.setEncoding("utf8");
    socket.on("connect", () => socket.write(`${JSON.stringify(payload)}\n`));
    socket.on("data", chunk => {
      buffer += chunk;
      for (;;) {
        const newline = buffer.indexOf("\n");
        if (newline < 0) break;
        frames.push(JSON.parse(buffer.slice(0, newline)));
        buffer = buffer.slice(newline + 1);
      }
    });
    socket.on("end", () => resolve(frames));
    socket.on("error", reject);
  });
}

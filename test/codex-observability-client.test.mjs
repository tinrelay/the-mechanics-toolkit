#!/usr/bin/env node
import assert from "node:assert/strict";
import fs from "node:fs";
import net from "node:net";
import os from "node:os";
import path from "node:path";
import {observabilityContract, observabilityEndpoint, runObservabilityCli} from "../src/codex-observability-client.mjs";

const scratch = fs.mkdtempSync(path.join(os.tmpdir(), "tmtk-observe-client-"));
const endpoint = process.platform === "win32"
  ? `\\\\.\\pipe\\tmtk-observe-client-${process.pid}-${path.basename(scratch)}`
  : path.join(scratch, "control.sock");
const output = {value: ""};
const stdout = {write(value) { output.value += value; }};
const requests = [];
const server = net.createServer(socket => {
  socket.setEncoding("utf8");
  let buffer = "";
  socket.on("data", chunk => {
    buffer += chunk;
    const newline = buffer.indexOf("\n");
    if (newline < 0) return;
    const request = JSON.parse(buffer.slice(0, newline));
    requests.push(request);
    if (request.action === "list") {
      respond(socket, {ok: true, result: [{id: 7, title: "Vera"}]});
    } else if (request.action === "cpu-profile") {
      respond(socket, {ok: true, result: {profile: {nodes: [{id: 1}]}}});
    } else if (request.action === "trace") {
      respond(socket, {type: "trace-chunk", data: '{"traceEvents":[{"name":"RunTask"},'}, false);
      respond(socket, {type: "trace-chunk", data: '{"name":"Layout"}]}'}, false);
      respond(socket, {ok: true, result: {bytes: 54}});
    } else {
      respond(socket, {ok: true, result: {method: request.method ?? request.action}});
    }
  });
});

try {
  await new Promise((resolve, reject) => server.listen(endpoint, resolve).once("error", reject));
  assert.equal(observabilityEndpoint({home: "/Users/example", platform: "darwin"}),
    "/Users/example/.codex/tmtk-observability/control.sock");
  assert.match(observabilityEndpoint({home: "C:\\Users\\Example", platform: "win32"}),
    /^\\\\\.\\pipe\\tmtk-codex-observability-[0-9a-f]{24}$/);

  await runObservabilityCli(["list"], {endpoint, stdout});
  assert.match(output.value, /"Vera"/);

  const cpuFile = path.join(scratch, "vera.cpuprofile");
  await runObservabilityCli(["cpu-profile", "7", "0.001", cpuFile], {endpoint, stdout});
  assert.deepEqual(JSON.parse(fs.readFileSync(cpuFile, "utf8")), {nodes: [{id: 1}]});
  if (process.platform !== "win32") assert.equal(fs.statSync(cpuFile).mode & 0o777, 0o600);
  await assert.rejects(runObservabilityCli(["cpu-profile", "7", "1", cpuFile], {endpoint, stdout}), /exist/i);

  const traceFile = path.join(scratch, "vera-trace.json");
  await runObservabilityCli(["trace", "7", "0.001", traceFile], {endpoint, stdout});
  assert.deepEqual(JSON.parse(fs.readFileSync(traceFile, "utf8")), {
    traceEvents: [{name: "RunTask"}, {name: "Layout"}]
  });

  await runObservabilityCli(["cdp", "7", "Runtime.evaluate", '{"expression":"6*7"}'], {endpoint, stdout});
  assert.equal(requests.at(-1).method, "Runtime.evaluate");
  assert.equal(requests.every(request => request.contract === observabilityContract), true);
  await assert.rejects(runObservabilityCli(["trace", "wrong", "1", path.join(scratch, "bad.json")],
    {endpoint, stdout}), /TARGET_ID/);
} finally {
  await new Promise(resolve => server.close(resolve));
  fs.rmSync(scratch, {recursive: true, force: true});
}

function respond(socket, frame, end = true) {
  socket.write(`${JSON.stringify({contract: observabilityContract, ...frame})}\n`, () => {
    if (end) socket.end();
  });
}

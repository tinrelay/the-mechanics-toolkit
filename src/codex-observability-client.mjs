import fs from "node:fs";
import net from "node:net";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";

export const observabilityContract = "tmtk-codex-observability-v1";

export function observabilityEndpoint({home = os.homedir(), platform = process.platform} = {}) {
  if (platform === "win32") {
    const suffix = crypto.createHash("sha256").update(home.toLowerCase()).digest("hex").slice(0, 24);
    return `\\\\.\\pipe\\tmtk-codex-observability-${suffix}`;
  }
  return path.posix.join(home, ".codex", "tmtk-observability", "control.sock");
}

export function requestObservability(payload, {
  endpoint = observabilityEndpoint(),
  onFrame = () => {},
  timeoutMs = 15_000
} = {}) {
  return new Promise((resolve, reject) => {
    let settled = false;
    let buffer = "";
    let terminal = null;
    const socket = net.createConnection(endpoint);
    const timer = setTimeout(() => finish(new Error(`Observability request timed out after ${timeoutMs} ms`)), timeoutMs);

    function finish(error) {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      socket.destroy();
      if (error) reject(error);
      else if (terminal?.ok !== true) reject(new Error(terminal?.error ?? "Observability bridge returned no result"));
      else resolve(terminal.result);
    }

    socket.setEncoding("utf8");
    socket.once("connect", () => socket.write(`${JSON.stringify({contract: observabilityContract, ...payload})}\n`));
    socket.on("data", chunk => {
      buffer += chunk;
      if (Buffer.byteLength(buffer, "utf8") > 256 * 1024 * 1024) {
        finish(new Error("Observability response frame is too large"));
        return;
      }
      for (;;) {
        const newline = buffer.indexOf("\n");
        if (newline < 0) break;
        const line = buffer.slice(0, newline);
        buffer = buffer.slice(newline + 1);
        let frame;
        try {
          frame = JSON.parse(line);
        } catch {
          finish(new Error("Observability bridge returned invalid JSON"));
          return;
        }
        if (frame?.contract !== observabilityContract) {
          finish(new Error("Observability bridge returned the wrong contract"));
          return;
        }
        if (typeof frame.ok === "boolean") terminal = frame;
        else {
          try {
            onFrame(frame);
          } catch (error) {
            finish(error);
            return;
          }
        }
      }
    });
    socket.once("end", () => {
      if (buffer.length !== 0) finish(new Error("Observability bridge returned an incomplete frame"));
      else finish();
    });
    socket.once("error", error => finish(new Error(`Cannot reach Codex observability bridge at ${endpoint}: ${error.message}`)));
  });
}

export async function runObservabilityCli(args, {
  endpoint = observabilityEndpoint(),
  stdout = process.stdout
} = {}) {
  const [command, ...rest] = args;
  if (command === "list" && rest.length === 0) {
    return print(stdout, await requestObservability({action: "list"}, {endpoint}));
  }
  if (command === "metrics" && rest.length === 1) {
    return print(stdout, await requestObservability({action: "metrics", targetId: targetId(rest[0])}, {endpoint}));
  }
  if (command === "devtools" && rest.length === 1) {
    return print(stdout, await requestObservability({action: "devtools", targetId: targetId(rest[0])}, {endpoint}));
  }
  if (command === "cdp" && (rest.length === 2 || rest.length === 3)) {
    let params = {};
    if (rest[2] != null) {
      try {
        params = JSON.parse(rest[2]);
      } catch (error) {
        throw new Error(`CDP params must be a JSON object: ${error.message}`);
      }
      if (params == null || typeof params !== "object" || Array.isArray(params)) {
        throw new Error("CDP params must be a JSON object");
      }
    }
    return print(stdout, await requestObservability({
      action: "cdp", targetId: targetId(rest[0]), method: rest[1], params
    }, {endpoint}));
  }
  if (command === "cpu-profile" && (rest.length === 3 || rest.length === 4)) {
    const output = path.resolve(rest[2]);
    const result = await requestObservability({
      action: "cpu-profile",
      targetId: targetId(rest[0]),
      durationMs: durationMs(rest[1]),
      ...(rest[3] == null ? {} : {samplingIntervalUs: samplingIntervalUs(rest[3])})
    }, {endpoint, timeoutMs: durationMs(rest[1]) + 15_000});
    writeNewJson(output, result.profile);
    return print(stdout, {output, nodes: result.profile?.nodes?.length ?? null});
  }
  if (command === "trace" && rest.length === 3) {
    const output = path.resolve(rest[2]);
    const duration = durationMs(rest[1]);
    return captureTrace({endpoint, targetId: targetId(rest[0]), duration, output, stdout});
  }
  throw new Error(
    "usage:\n" +
    "  tmtk-observe list\n" +
    "  tmtk-observe metrics TARGET_ID\n" +
    "  tmtk-observe devtools TARGET_ID\n" +
    "  tmtk-observe cdp TARGET_ID METHOD [PARAMS_JSON]\n" +
    "  tmtk-observe cpu-profile TARGET_ID SECONDS OUTPUT.cpuprofile [SAMPLING_INTERVAL_US]\n" +
    "  tmtk-observe trace TARGET_ID SECONDS OUTPUT.json"
  );
}

async function captureTrace({endpoint, targetId: id, duration, output, stdout}) {
  const descriptor = fs.openSync(output, "wx", 0o600);
  let bytes = 0;
  let chunks = 0;
  try {
    const result = await requestObservability({action: "trace", targetId: id, durationMs: duration}, {
      endpoint,
      timeoutMs: duration + 45_000,
      onFrame(frame) {
        if (frame?.type !== "trace-chunk" || typeof frame.data !== "string") {
          throw new Error("Observability bridge returned an unknown trace frame");
        }
        bytes += fs.writeSync(descriptor, frame.data);
        chunks += 1;
      }
    });
    if (chunks === 0) throw new Error("Observability bridge returned an empty trace stream");
    if (!Number.isSafeInteger(result.bytes) || result.bytes !== bytes) {
      throw new Error(`Observability trace byte count mismatch (bridge ${result.bytes}, client ${bytes})`);
    }
    fs.closeSync(descriptor);
    return print(stdout, {output, bytes});
  } catch (error) {
    try { fs.closeSync(descriptor); } catch {}
    try { fs.unlinkSync(output); } catch {}
    throw error;
  }
}

function writeNewJson(file, value) {
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, {encoding: "utf8", mode: 0o600, flag: "wx"});
}

function targetId(value) {
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed <= 0) throw new Error("TARGET_ID must be a positive integer");
  return parsed;
}

function durationMs(value) {
  const seconds = Number(value);
  const milliseconds = Math.round(seconds * 1000);
  if (!Number.isFinite(seconds) || seconds <= 0 || milliseconds < 1 || milliseconds > 60_000) {
    throw new Error("SECONDS must be greater than zero and at most 60");
  }
  return milliseconds;
}

function samplingIntervalUs(value) {
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed < 100 || parsed > 10_000) {
    throw new Error("SAMPLING_INTERVAL_US must be an integer from 100 through 10000");
  }
  return parsed;
}

function print(stream, value) {
  stream.write(`${JSON.stringify(value, null, 2)}\n`);
  return value;
}

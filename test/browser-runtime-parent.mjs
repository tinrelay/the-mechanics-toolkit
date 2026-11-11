import assert from "node:assert/strict";
import {spawn} from "node:child_process";
import {parse} from "acorn";

export async function probeBrowserRuntimeParent(source) {
  const tree = parse(source, {ecmaVersion: "latest", sourceType: "module"});
  let helper, config;
  walk(tree, node => {
    if (node.type !== "FunctionDeclaration") return;
    if (node.id.name === "MTKbrowserRuntimeLaunch") helper = node;
    if (node.id.name === "r3") config = node;
  });
  assert.ok(helper, "browser MCP launcher retains a vendor runtime parent");
  assert.ok(config);
  const configSource = source.slice(config.start, config.end);
  assert.ok(configSource.includes("...MTKbrowserRuntimeLaunch(n,i),env:"),
    "the generated MCP configuration actually selects the launch helper");
  const create = platform => Function("process", "es",
    source.slice(helper.start, helper.end) + ";return MTKbrowserRuntimeLaunch;")(
      {platform}, {wLF: "NODE_REPL_NODE_PATH"});
  const child = {
    command: process.execPath,
    args: ["-e", "process.stderr.write(JSON.stringify({parent:process.ppid,executor:process.env.BROWSER_USE_ACCESS_EXECUTOR_ID}));process.stdin.pipe(process.stdout);process.stdin.on('end',()=>process.exitCode=17)"],
    env: {NODE_REPL_NODE_PATH: process.execPath}
  };
  const launch = create("darwin")(child, "/bootstrap.mjs");
  const payload = Buffer.from([0, 1, 2, 3, 10, 65, 0, 255]);
  for (const executor of [undefined, "existing-executor"]) {
    const env = {...process.env};
    if (executor === undefined) delete env.BROWSER_USE_ACCESS_EXECUTOR_ID;
    else env.BROWSER_USE_ACCESS_EXECUTOR_ID = executor;
    const result = await run(launch, payload, env);
    assert.equal(result.code, 17, "child exit status reaches the MCP owner");
    assert.equal(result.signal, null);
    assert.deepEqual(result.stdout, payload, "MCP framing passes through untouched");
    assert.deepEqual(JSON.parse(result.stderr), {parent: result.pid, executor: executor ?? ""});
  }
  const waiting = create("darwin")({...child, args: ["-e",
    "console.log(JSON.stringify({pid:process.pid,parent:process.ppid}));setInterval(()=>{},1000)"
  ]}, "/bootstrap.mjs");
  const parent = spawn(waiting.command, waiting.args, {stdio: ["pipe", "pipe", "pipe"]});
  const exited = new Promise(resolve => parent.once("close", (code, signal) => resolve({code, signal})));
  const ready = await new Promise((resolve, reject) => {
    let data = "";
    const timeout = setTimeout(() => reject(Error("MCP child did not start")), 5000);
    parent.stdout.on("data", chunk => {
      data += chunk;
      if (data.includes("\n")) { clearTimeout(timeout); resolve(JSON.parse(data)); }
    });
    parent.once("error", reject);
  });
  assert.equal(ready.parent, parent.pid);
  parent.kill("SIGTERM");
  assert.deepEqual(await exited, {code: null, signal: "SIGTERM"});
  assert.throws(() => process.kill(ready.pid, 0), {code: "ESRCH"}, "MCP stop leaves no child running");
  for (const platform of ["linux", "win32"]) {
    assert.deepEqual(create(platform)(child, null), {});
    const stock = create(platform)(child, "/bootstrap.mjs");
    assert.equal(stock.command, "/bin/sh");
    assert.deepEqual(stock.args.slice(-child.args.length - 1), [child.command, ...child.args]);
  }
  console.log("browser runtime parent: stdio, environment, exit and stop probes passed");
}

async function run(launch, input, env) {
  const child = spawn(launch.command, launch.args, {env, stdio: ["pipe", "pipe", "pipe"]});
  const out = [], errors = [];
  child.stdout.on("data", chunk => out.push(chunk));
  child.stderr.on("data", chunk => errors.push(chunk));
  const finished = new Promise((resolve, reject) => {
    child.once("error", reject);
    child.once("close", (code, signal) => resolve({pid: child.pid, code, signal,
      stdout: Buffer.concat(out), stderr: Buffer.concat(errors).toString()}));
  });
  child.stdin.end(input);
  return finished;
}

function walk(node, visit) {
  if (!node || typeof node !== "object") return;
  if (node.type) visit(node);
  for (const value of Object.values(node)) {
    if (Array.isArray(value)) value.forEach(child => walk(child, visit));
    else if (value && typeof value === "object") walk(value, visit);
  }
}

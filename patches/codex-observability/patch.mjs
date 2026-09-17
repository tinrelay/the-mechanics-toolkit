#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import {spawnSync} from "node:child_process";

const command = process.argv[2];
const root = path.resolve(process.argv[3] ?? "");
if (!new Set(["check", "apply"]).has(command) || !process.argv[3]) {
  throw new Error("usage: codex-observability/patch.mjs check|apply EXTRACTED_ASAR_ROOT");
}

const build = path.join(root, ".vite", "build");
const target = uniqueAsset(build, /^main-.*\.js$/);
let source = fs.readFileSync(target, "utf8");
let state = inspectState(source);

if (command === "apply" && state === "needs-apply") {
  source = patchMain(source);
  fs.writeFileSync(target, source);
  syntaxCheck(target);
  state = inspectState(source);
  if (state !== "applied") throw new Error("Codex observability transform did not verify");
}

process.stdout.write(`${JSON.stringify({
  state,
  contract: "tmtk-codex-observability-v1",
  target: path.relative(root, target)
}, null, 2)}\n`);

function inspectState(value) {
  const profile = mainProfile(value);
  const markers = [
    'const MTKobserveContract="tmtk-codex-observability-v1"',
    "function MTKobserveEndpoint(",
    "function MTKobserveStart(",
    'case"cpu-profile"',
    'case"trace"',
    'case"cdp"',
    'case"devtools"',
    `${profile.disposers}.add(await MTKobserveStart(${profile.electron}.webContents))`
  ];
  const counts = markers.map(marker => count(value, marker));
  if (counts.every(result => result === 0)) return "needs-apply";
  if (counts.every(result => result === 1)) return "applied";
  throw new Error(`Upstream changed: Codex observability patch is partial (${counts.join(",")})`);
}

function patchMain(value) {
  const profile = mainProfile(value);
  let patched = replaceOnce(value, profile.helperOwner, `${mainHelpers()}${profile.helperOwner}`,
    "Codex observability main helper owner");
  return replaceOnce(
    patched,
    profile.startup,
    `${profile.startup},${profile.disposers}.add(await MTKobserveStart(${profile.electron}.webContents))`,
    "Codex observability app-ready startup"
  );
}

function mainProfile(value) {
  const id = "[$A-Z_a-z][$\\w]*";
  const helperOwner = uniqueMatch(
    value,
    new RegExp("var " + id + "=i\\.i\\(`electron-message-handler`\\)", "g"),
    "Codex observability main helper owner"
  );
  const startup = uniqueMatch(
    value,
    new RegExp("(?<log>" + id + "\\(`main app\\.whenReady resolved`," + id + "\\))", "g"),
    "Codex observability app-ready startup"
  );
  const before = value.slice(0, startup.index);
  const readinessOwners = [...before.slice(-1000).matchAll(new RegExp(`await (?<electron>${id})\\.app\\.whenReady\\(\\),`, "g"))];
  if (readinessOwners.length !== 1) {
    throw new Error(`Upstream changed: found ${readinessOwners.length} adjacent Electron app-ready owners`);
  }
  const candidates = [...before.matchAll(new RegExp(`(?:let |,)(?<disposers>${id})=new ${id}\\.${id};`, "g"))]
    .filter(match => before.slice(match.index, match.index + 300).includes(`${match.groups.disposers}.add(`));
  const owner = candidates.at(-1);
  if (owner == null || startup.index - owner.index > 5000) {
    throw new Error("Upstream changed: Codex observability disposer owner is not adjacent to app readiness");
  }
  return {
    helperOwner: helperOwner[0],
    startup: startup.groups.log,
    electron: readinessOwners[0].groups.electron,
    disposers: owner.groups.disposers
  };
}

function mainHelpers() {
  return String.raw`const MTKobserveContract="tmtk-codex-observability-v1",MTKobserveMaxRequestBytes=1048576,MTKobserveFs=require("node:fs"),MTKobserveNet=require("node:net"),MTKobserveOs=require("node:os"),MTKobservePath=require("node:path"),MTKobserveCrypto=require("node:crypto");let MTKobserveTracing=false;
function MTKobservePrivate(e){return process.platform==="win32"||(e.mode&63)===0}
function MTKobserveEndpoint(){let e=MTKobserveOs.homedir();if(process.platform==="win32")return"\\\\.\\pipe\\tmtk-codex-observability-"+MTKobserveCrypto.createHash("sha256").update(e.toLowerCase()).digest("hex").slice(0,24);let t=MTKobservePath.join(e,".codex","tmtk-observability");try{MTKobserveFs.mkdirSync(t,{recursive:true,mode:448}),MTKobserveFs.chmodSync(t,448);let e=MTKobserveFs.lstatSync(t);if(!e.isDirectory()||!MTKobservePrivate(e)||typeof process.getuid==="function"&&e.uid!==process.getuid())return null}catch{return null}return MTKobservePath.join(t,"control.sock")}
function MTKobserveKeys(e,t){return e!=null&&typeof e==="object"&&!Array.isArray(e)&&Object.keys(e).sort().join("\0")===t.slice().sort().join("\0")}
function MTKobserveError(e){return e instanceof Error?e.message:String(e)}
function MTKobserveSend(e,t){if(e.destroyed)return false;try{return e.write(JSON.stringify({contract:MTKobserveContract,...t})+"\n")}catch{return false}}
function MTKobserveWrite(e,t){return new Promise((n,r)=>{if(e.destroyed){r(Error("observability client disconnected"));return}let i=()=>{a(),n()},o=()=>{a(),r(Error("observability client disconnected"))},a=()=>{e.off("drain",i),e.off("close",o)};try{if(e.write(JSON.stringify({contract:MTKobserveContract,...t})+"\n")){n();return}e.once("drain",i),e.once("close",o)}catch(e){a(),r(e)}})}
function MTKobserveTarget(e,t){if(!Number.isSafeInteger(t)||t<=0)throw Error("targetId must be a positive integer");let n=e.fromId(t);if(n==null||n.isDestroyed())throw Error("target is unavailable");return n}
function MTKobserveTargets(e){return e.getAllWebContents().filter(e=>!e.isDestroyed()).map(e=>({id:e.id,type:e.getType(),title:e.getTitle(),url:e.getURL(),processId:e.getOSProcessId(),focused:e.isFocused(),loading:e.isLoading(),devToolsOpened:e.isDevToolsOpened()})).sort((e,t)=>e.id-t.id)}
function MTKobserveDuration(e){if(!Number.isSafeInteger(e)||e<1||e>60000)throw Error("durationMs must be an integer from 1 through 60000");return e}
function MTKobserveWait(e,t){return new Promise((n,r)=>{let i=setTimeout(()=>{a(),n()},e),o=()=>{a(),r(Error("observability client disconnected"))},a=()=>{clearTimeout(i),t.off("close",o)};t.once("close",o)})}
async function MTKobserveDebugger(e,t){let n=e.debugger;if(n.isAttached())throw Error("target already has a debugger attached");try{n.attach("1.3")}catch(e){throw Error("debugger attach failed: "+MTKobserveError(e))}try{return await t(n)}finally{try{n.isAttached()&&n.detach()}catch{}}}
async function MTKobserveMetrics(e){return MTKobserveDebugger(e,async e=>{let t=false;try{await e.sendCommand("Performance.enable"),t=true;return await e.sendCommand("Performance.getMetrics")}finally{if(t)try{await e.sendCommand("Performance.disable")}catch{}}})}
async function MTKobserveCpuProfile(e,t,n,r){let i=MTKobserveDuration(t),o=Number.isSafeInteger(n)&&n>=100&&n<=10000?n:1000;return MTKobserveDebugger(e,async e=>{let t=false,n=false;try{await e.sendCommand("Profiler.enable"),t=true,await e.sendCommand("Profiler.setSamplingInterval",{interval:o}),await e.sendCommand("Profiler.start"),n=true,await MTKobserveWait(i,r);let a=await e.sendCommand("Profiler.stop");return n=false,a}finally{if(n)try{await e.sendCommand("Profiler.stop")}catch{}if(t)try{await e.sendCommand("Profiler.disable")}catch{}}})}
async function MTKobserveTrace(e,t,n){if(MTKobserveTracing)throw Error("another trace is already active");MTKobserveTracing=true;let r=MTKobserveDuration(t),i=Promise.withResolvers(),o=(e,t,n)=>{t==="Tracing.tracingComplete"&&i.resolve(n?.stream)};try{return await MTKobserveDebugger(e,async e=>{e.on("message",o);let t=false,a=null;try{await e.sendCommand("Tracing.start",{categories:"devtools.timeline,disabled-by-default-devtools.timeline,disabled-by-default-v8.cpu_profiler,disabled-by-default-v8.cpu_profiler.hires,v8,v8.execute,blink,blink.user_timing,cc,gpu",options:"record-continuously",transferMode:"ReturnAsStream",streamFormat:"json",streamCompression:"none"}),t=true,await MTKobserveWait(r,n),await e.sendCommand("Tracing.end"),t=false;let s=setTimeout(()=>i.reject(Error("trace completion timed out")),30000);try{a=await i.promise}finally{clearTimeout(s)}if(typeof a!=="string"||a.length===0)throw Error("trace completed without a stream");let q=0;try{for(;;){let t=await e.sendCommand("IO.read",{handle:a,size:1048576});if(typeof t?.data!=="string"||typeof t?.eof!=="boolean"||t.base64Encoded===true)throw Error("trace stream returned an unsupported chunk");if(t.data.length>0)await MTKobserveWrite(n,{type:"trace-chunk",data:t.data}),q+=Buffer.byteLength(t.data,"utf8");if(t.eof)break}}finally{try{await e.sendCommand("IO.close",{handle:a})}catch{}a=null}return{bytes:q}}finally{e.off("message",o);if(t)try{await e.sendCommand("Tracing.end")}catch{}if(a!=null)try{await e.sendCommand("IO.close",{handle:a})}catch{}}})}finally{MTKobserveTracing=false}}
async function MTKobserveRequest(e,t,n){if(!MTKobserveKeys(t,["contract","action"])&&!MTKobserveKeys(t,["contract","action","targetId"])&&!MTKobserveKeys(t,["contract","action","targetId","method","params"])&&!MTKobserveKeys(t,["contract","action","targetId","durationMs"])&&!MTKobserveKeys(t,["contract","action","targetId","durationMs","samplingIntervalUs"]))throw Error("request shape is invalid");if(t.contract!==MTKobserveContract)throw Error("observability contract is invalid");switch(t.action){case"list":if(!MTKobserveKeys(t,["contract","action"]))throw Error("list request shape is invalid");return MTKobserveTargets(e);case"devtools":{if(!MTKobserveKeys(t,["contract","action","targetId"]))throw Error("devtools request shape is invalid");let n=MTKobserveTarget(e,t.targetId);n.openDevTools({mode:"detach",activate:true,title:"Codex Observability"});return{opened:n.isDevToolsOpened()}}case"metrics":if(!MTKobserveKeys(t,["contract","action","targetId"]))throw Error("metrics request shape is invalid");return MTKobserveMetrics(MTKobserveTarget(e,t.targetId));case"cdp":if(!MTKobserveKeys(t,["contract","action","targetId","method","params"])||typeof t.method!=="string"||t.method.length<1||t.method.length>256||t.params==null||typeof t.params!=="object"||Array.isArray(t.params))throw Error("cdp request shape is invalid");return MTKobserveDebugger(MTKobserveTarget(e,t.targetId),e=>e.sendCommand(t.method,t.params));case"cpu-profile":if(!MTKobserveKeys(t,["contract","action","targetId","durationMs"])&&!MTKobserveKeys(t,["contract","action","targetId","durationMs","samplingIntervalUs"]))throw Error("cpu-profile request shape is invalid");return MTKobserveCpuProfile(MTKobserveTarget(e,t.targetId),t.durationMs,t.samplingIntervalUs,n);case"trace":if(!MTKobserveKeys(t,["contract","action","targetId","durationMs"]))throw Error("trace request shape is invalid");return MTKobserveTrace(MTKobserveTarget(e,t.targetId),t.durationMs,n);default:throw Error("unknown observability action")}}
function MTKobserveConnection(e,t){e.setEncoding("utf8");let n="",r=false,i=async()=>{if(r)return;let i=n.indexOf("\n");if(i<0)return;if(r=true,e.pause(),n.slice(i+1).length!==0){MTKobserveSend(e,{ok:false,error:"request must contain one line"}),e.end();return}let o;try{o=JSON.parse(n.slice(0,i))}catch{MTKobserveSend(e,{ok:false,error:"request JSON is invalid"}),e.end();return}try{let n=await MTKobserveRequest(t,o,e);MTKobserveSend(e,{ok:true,result:n})}catch(t){MTKobserveSend(e,{ok:false,error:MTKobserveError(t)})}finally{e.end()}};e.on("data",e=>{if(r)return;n+=e;if(Buffer.byteLength(n,"utf8")>MTKobserveMaxRequestBytes){r=true,MTKobserveSend(e,{ok:false,error:"request is too large"}),e.end();return}i()}),e.on("error",()=>{})}
function MTKobserveProbe(e){return new Promise(t=>{let n=MTKobserveNet.createConnection(e),r=false,i=e=>{if(r)return;r=true,n.destroy(),t(e)};n.once("connect",()=>i("live")),n.once("error",()=>i("stale")),n.setTimeout(250,()=>i("stale"))})}
async function MTKobserveStart(e){let t=MTKobserveEndpoint();if(t==null)return()=>{};let n;if(process.platform!=="win32"){try{n=MTKobserveFs.lstatSync(t)}catch(e){if(e?.code!=="ENOENT")return()=>{}}if(n!=null){if(!n.isSocket()||typeof process.getuid==="function"&&n.uid!==process.getuid()||await MTKobserveProbe(t)!=="stale")return()=>{};try{MTKobserveFs.unlinkSync(t)}catch{return()=>{}}}}return new Promise(n=>{let r=MTKobserveNet.createServer(n=>MTKobserveConnection(n,e)),i=false,o=null,a=()=>{if(i)return;i=true,r.close(()=>{});if(process.platform==="win32")return;if(o!=null)try{let e=MTKobserveFs.lstatSync(t);e.isSocket()&&e.dev===o.dev&&e.ino===o.ino&&MTKobserveFs.unlinkSync(t)}catch{}};r.on("error",()=>n(()=>{})),r.listen(t,()=>{if(process.platform!=="win32")try{MTKobserveFs.chmodSync(t,384);let e=MTKobserveFs.lstatSync(t);if(!e.isSocket()||!MTKobservePrivate(e)){r.close(()=>{}),n(()=>{});return}o={dev:e.dev,ino:e.ino}}catch{r.close(()=>{}),n(()=>{});return}r.unref(),n(a)})})}
`;
}

function uniqueAsset(directory, pattern) {
  if (!fs.existsSync(directory) || !fs.statSync(directory).isDirectory()) {
    throw new Error(`Missing extracted asset directory: ${directory}`);
  }
  const matches = fs.readdirSync(directory).filter(name => pattern.test(name));
  if (matches.length !== 1) throw new Error(`Upstream changed: found ${matches.length} assets matching ${pattern}`);
  return path.join(directory, matches[0]);
}

function uniqueMatch(value, pattern, label) {
  const matches = [...value.matchAll(pattern)];
  if (matches.length !== 1) throw new Error(`Upstream changed: found ${matches.length} ${label} matches`);
  return matches[0];
}

function replaceOnce(value, before, after, label) {
  if (count(value, before) !== 1) throw new Error(`Upstream changed: ${label} is not unique`);
  return value.replace(before, after);
}

function count(value, needle) {
  return value.split(needle).length - 1;
}

function syntaxCheck(file) {
  const result = spawnSync(process.execPath, ["--input-type=module", "--check"], {
    encoding: "utf8",
    input: fs.readFileSync(file),
    maxBuffer: 64 * 1024 * 1024
  });
  if (result.status !== 0) {
    const output = result.stderr || result.stdout;
    const summary = output.match(/SyntaxError:[^\n]*/)?.[0] ?? output.trim().slice(-1000);
    throw new Error(`module syntax check failed for ${path.relative(root, file)}: ${summary}`);
  }
}

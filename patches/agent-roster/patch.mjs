#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { linuxBuild9647 } from "./profiles/linux.mjs";

const command = process.argv[2];
const root = path.resolve(process.argv[3] ?? "");
if (!new Set(["check", "apply"]).has(command) || !process.argv[3]) {
  throw new Error("usage: agent-roster/patch.mjs check|apply EXTRACTED_ASAR_ROOT");
}

const assets = path.join(root, "webview/assets");
const target = uniqueFile(/^app-initial-.*\.js$/, assets);
let source = fs.readFileSync(target, "utf8");
let state = inspectState(source);

if (command === "apply" && state === "needs-apply") {
  const runtimeOwner = fs.readdirSync(assets)
    .filter(name => /^(?:message-bus|app-initial)-.*\.js$/.test(name))
    .map(name => fs.readFileSync(path.join(assets, name), "utf8"))
    .find(value => value.includes("__MTK_RUNTIME_JSON_RELOAD__"));
  if (runtimeOwner == null) throw new Error("agent-roster requires runtime-json-reload first");
  const profile = currentProfile(source);
  if (profile == null) throw new Error("Upstream changed: agent roster owner is not recognized");
  const helper = rosterHelper(profile);
  const bootstrap = profile.seam.replace(/^(function [$\w]+\(\)\{)/, "$1MTKuseAgentRoster();");
  source = replaceOnce(
    source,
    profile.seam,
    helper + bootstrap,
    "agent roster bootstrap"
  );
  fs.writeFileSync(target, source);
  syntaxCheck(target);
  state = inspectState(source);
  if (state !== "applied") throw new Error("agent roster transform did not verify");
}

process.stdout.write(`${JSON.stringify({
  state,
  roster: ".codex/agent-roster.json",
  targets: [path.relative(root, target)]
}, null, 2)}\n`);

function inspectState(value) {
  const markers = [
    'const MTKagentRosterRelativePath=".codex/agent-roster.json"',
    "function MTKparseAgentRoster(",
    "function MTKloadAgentRoster(",
    "function MTKmatchAgentRoster(",
    "function MTKuseAgentRoster(",
    "globalThis.__MTK_AGENT_ROSTER__=Object.freeze(",
    'l?.register("agent-roster.json"',
    "MTKuseAgentRoster();"
  ];
  const present = markers.map(marker => value.includes(marker));
  if (present.every(Boolean)) return "applied";
  if (present.some(Boolean)) throw new Error("Upstream changed: agent roster patch is partial");
  if (currentProfile(value) == null) throw new Error("Upstream changed: agent roster owner is not recognized");
  return "needs-apply";
}

function currentProfile(value) {
  if (value.includes(linuxBuild9647.selector)) {
    for (const contract of [linuxBuild9647.selector, ...linuxBuild9647.required]) {
      if (count(value, contract) !== 1) {
        throw new Error(`Upstream changed: ${linuxBuild9647.name} owner is not unique: ${contract}`);
      }
    }
    return linuxBuild9647.profile;
  }
  const build9922Seam = "function Vvl(){let e=(0,Wvl.c)(12),t=xf($),";
  if (value.includes(build9922Seam)) {
    const contracts = [
      build9922Seam,
      "function ep(e,t){let n=e.get(tp);if(n==null)throw Error(`AppServerManager RPC is not connected`);return n.forHost(t)}",
      "woi=sf($,",
      "a.get=o,a.query=Ggt(a),a.set=l,a.watch=s,a.when=c"
    ];
    if (!contracts.every(contract => count(value, contract) === 1)) {
      throw new Error("Upstream changed: build-9922 agent roster owner is not unique");
    }
    return {
      seam: build9922Seam,
      scope: "xf($)",
      react: "Gvl",
      projectsAtom: "woi",
      readyAtom: "tp",
      client: "ep"
    };
  }
  const build9647Seam = "function PYs(){let e=(0,LYs.c)(12),t=nm(Q),";
  if (value.includes(build9647Seam)) {
    const contracts = [
      build9647Seam,
      "function C_(e,t){let n=e.get(w_);if(n==null)throw Error(`AppServerManager RPC is not connected`);return n.forHost(t)}",
      "r(VFi)"
    ];
    if (!contracts.every(contract => count(value, contract) === 1)) {
      throw new Error("Upstream changed: build-9647 agent roster owner is not unique");
    }
    return {
      seam: build9647Seam,
      scope: "nm(Q)",
      react: "RYs",
      projectsAtom: "VFi",
      readyAtom: "w_",
      client: "C_"
    };
  }
  return null;
}

function rosterHelper(profile) {
  return String.raw`const MTKagentRosterRelativePath=".codex/agent-roster.json",MTKagentRosterListeners=new Set,MTKagentRosterTaskId=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;let MTKagentRosterSnapshot=null,MTKagentRosterDiagnostic=null;function MTKagentRosterPlainObject(e){return e!=null&&typeof e==="object"&&!Array.isArray(e)&&Object.getPrototypeOf(e)===Object.prototype}function MTKagentRosterJoin(e,t){return e.replace(/[\\/]+$/,"" )+"/"+t}function MTKagentRosterMissing(e){return e instanceof Error&&("code"in e&&e.code==="ENOENT"||e.message.includes("No such file or directory")||e.message.includes("(os error 2)"))}function MTKagentRosterSize(e){return Math.floor(e.length*3/4)-(e.endsWith("==")?2:+e.endsWith("="))}function MTKagentRosterDiagnose(e,t){let n=Object.freeze({code:e,detail:t??null});MTKagentRosterDiagnostic=n,globalThis.__MTK_AGENT_ROSTER_DIAGNOSTIC__=n,console.error("[TMTK agent roster] "+e,t??"");return null}function MTKagentRosterClearDiagnostic(){MTKagentRosterDiagnostic=null,globalThis.__MTK_AGENT_ROSTER_DIAGNOSTIC__=null}function MTKagentRosterEscape(e){return e.replace(/[.*+?^$(){}|[\]\\]/g,"\\$&")}function MTKparseAgentRoster(e,t){let n;try{n=JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(e),e=>e.charCodeAt(0))))}catch{return MTKagentRosterDiagnose("invalid-json",t)}if(!MTKagentRosterPlainObject(n)||n.version!==1||!MTKagentRosterPlainObject(n.agents)||!MTKagentRosterPlainObject(n.tasks))return MTKagentRosterDiagnose("invalid-roster",t);let r=Object.entries(n.agents),i=Object.entries(n.tasks);if(r.length>128||i.length>128)return MTKagentRosterDiagnose("invalid-roster-cardinality",t);let a=[];for(let[e,n]of r){if(typeof e!=="string"||e.length===0||e.length>128||!MTKagentRosterPlainObject(n)||typeof n.name!=="string"||n.name.length===0||n.name.length>128||typeof n.taskId!=="string"||!MTKagentRosterTaskId.test(n.taskId))return MTKagentRosterDiagnose("invalid-agent",{ownerRoot:t,key:e});let r=new RegExp("^(?:"+MTKagentRosterEscape(n.name)+"(?:\\s+—\\s+.+)?)$");a.push(Object.freeze({key:e,kind:"agent",ownerRoot:t,taskId:n.taskId,pattern:r,data:Object.freeze({...n})}))}for(let[e,n]of i){if(typeof e!=="string"||e.length===0||e.length>128||!MTKagentRosterPlainObject(n)||n.taskId===void 0&&n.titlePattern===void 0||n.taskId!==void 0&&(typeof n.taskId!=="string"||!MTKagentRosterTaskId.test(n.taskId))||n.titlePattern!==void 0&&(typeof n.titlePattern!=="string"||n.titlePattern.length===0||n.titlePattern.length>512))return MTKagentRosterDiagnose("invalid-task",{ownerRoot:t,key:e});let r;try{r=n.titlePattern===void 0?null:new RegExp(n.titlePattern)}catch{return MTKagentRosterDiagnose("invalid-task-pattern",{ownerRoot:t,key:e})}a.push(Object.freeze({key:e,kind:"task",ownerRoot:t,taskId:n.taskId??null,pattern:r,data:Object.freeze({...n})}))}return Object.freeze({ownerRoot:t,data:Object.freeze(n),entries:Object.freeze(a)})}async function MTKfindAgentRoster(e,t){let n=MTKagentRosterJoin(t,".codex"),r=MTKagentRosterJoin(t,MTKagentRosterRelativePath);try{let i=await e.sendRequest("fs/getMetadata",{path:n});if(!i.isDirectory||i.isSymlink)throw Error("unsafe agent roster directory");let a=await e.sendRequest("fs/getMetadata",{path:r});if(!a.isFile||a.isSymlink)throw Error("unsafe agent roster file");let{dataBase64:o}=await e.sendRequest("fs/readFile",{path:r});if(MTKagentRosterSize(o)>65536)throw Error("agent roster too large");return{ownerRoot:t,dataBase64:o}}catch(e){if(MTKagentRosterMissing(e))return null;throw e}}async function MTKloadAgentRoster(e,t){try{e.get(${profile.readyAtom})==null&&await e.when(({get:e})=>e(${profile.readyAtom})!=null);let n=${profile.client}(e,"local"),r=[];for(let i of[...new Set(t)].sort()){let t=await MTKfindAgentRoster(n,i);if(t==null)continue;let e=MTKparseAgentRoster(t.dataBase64,t.ownerRoot);if(e==null)return{state:"invalid",snapshot:null};r.push(e)}if(r.length===0)return MTKagentRosterClearDiagnostic(),{state:"missing",snapshot:null};let i=r.flatMap(e=>e.entries),a=new Map;for(let e of i)if(e.taskId!=null){let t=a.get(e.taskId);if(t!=null)return MTKagentRosterDiagnose("duplicate-task-id",{taskId:e.taskId,owners:[t.ownerRoot,e.ownerRoot]}),{state:"invalid",snapshot:null};a.set(e.taskId,e)}MTKagentRosterClearDiagnostic();return{state:"valid",snapshot:Object.freeze({version:1,sources:Object.freeze(r),entries:Object.freeze(i),client:n})}}catch(e){return MTKagentRosterDiagnose("load-failed",String(e?.message??e)),{state:"invalid",snapshot:null}}}function MTKinstallAgentRoster(e){MTKagentRosterSnapshot=e;for(let e of MTKagentRosterListeners)e()}function MTKmatchesAgentRoster(e,t,n=MTKagentRosterSnapshot){if(n==null)return[];let r=typeof e==="string"?e:"",i=typeof t==="string"?t:"";return n.entries.filter(e=>i.length>0&&e.taskId===i||e.pattern?.test(r))}function MTKmatchAgentRoster(e,t,n=MTKagentRosterSnapshot){if(n==null)return null;let r=MTKmatchesAgentRoster(e,t,n),i=typeof t==="string"&&t.length>0?r.find(e=>e.taskId===t):null;return i??r[0]??null}async function MTKagentRosterReadAsset(e,t,n=65536,r=MTKagentRosterSnapshot){if(r==null||e==null||typeof e.ownerRoot!=="string"||typeof t!=="string"||t.length===0||t.length>512||t.startsWith("/")||t.startsWith("\\")||/^[A-Za-z]:/.test(t)||t.includes("://")||t.includes("\\"))return null;let i=t.split("/");if(i.some(e=>e===""||e==="."||e===".."))return null;let a=e.ownerRoot;try{for(let e=0;e<i.length;e++){a=MTKagentRosterJoin(a,i[e]);let t=await r.client.sendRequest("fs/getMetadata",{path:a}),n=e===i.length-1;if(t.isSymlink||(n?!t.isFile:!t.isDirectory))return null}let{dataBase64:e}=await r.client.sendRequest("fs/readFile",{path:a});return MTKagentRosterSize(e)>n?null:e}catch{return null}}function MTKagentRosterSubscribe(e){return MTKagentRosterListeners.add(e),()=>MTKagentRosterListeners.delete(e)}async function MTKreloadAgentRoster(e,t,n,r){let i=await MTKloadAgentRoster(e,t);return r()&&i.state!=="invalid"?(MTKinstallAgentRoster(i.snapshot),!0):!1}globalThis.__MTK_AGENT_ROSTER__=Object.freeze({version:1,current:()=>MTKagentRosterSnapshot,diagnostic:()=>MTKagentRosterDiagnostic,match:MTKmatchAgentRoster,matches:MTKmatchesAgentRoster,readAsset:MTKagentRosterReadAsset,subscribe:MTKagentRosterSubscribe,diagnose:MTKagentRosterDiagnose});function MTKuseAgentRoster(){let e=${profile.scope};return ${profile.react}.useEffect(()=>{let t=!1,n=null,r=null,i=e.watch(({get:i})=>{let a=i(${profile.projectsAtom});if(a?.isWorkspaceRootOptionsLoading)return;let o=(a?.groups??[]).filter(e=>e?.projectKind==="local").flatMap(e=>e.rootPaths??[]).filter(e=>typeof e==="string"),s=[...new Set(o)].sort(),c=s.join("\\0");if(c===n)return;n=c,r?.();let l=globalThis.__MTK_RUNTIME_JSON_RELOAD__;r=l?.register("agent-roster.json",s,n=>MTKreloadAgentRoster(e,s,n,()=>!t))??null,typeof r!=="function"&&MTKreloadAgentRoster(e,s,{initial:!0},()=>!t)});return()=>{t=!0,r?.(),i()}},[e]),null}`;
}

function uniqueFile(pattern, directory) {
  if (!fs.existsSync(directory) || !fs.statSync(directory).isDirectory()) {
    throw new Error(`Missing extracted directory: ${directory}`);
  }
  const matches = fs.readdirSync(directory).filter(name => pattern.test(name));
  if (matches.length !== 1) throw new Error(`Upstream changed: found ${matches.length} files matching ${pattern}`);
  return path.join(directory, matches[0]);
}

function replaceOnce(value, before, after, label) {
  const first = value.indexOf(before);
  if (first < 0 || value.indexOf(before, first + before.length) >= 0) {
    throw new Error(`Upstream changed: ${label} is not unique`);
  }
  return value.slice(0, first) + after + value.slice(first + before.length);
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

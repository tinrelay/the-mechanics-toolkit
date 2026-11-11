#!/usr/bin/env node
import {parse} from "acorn";
import {probeBrowserRuntimeParent} from "./browser-runtime-parent.mjs";
import assert from "node:assert/strict";
import fs from "node:fs";
import {mainProcessAsset} from "../src/main-process-asset.mjs";
import path from "node:path";

const root = path.resolve(process.argv[2] ?? "");
if (!process.argv[2]) throw new Error("usage: native-app-tools-peer-authorization.test.mjs EXTRACTED_ASAR_ROOT");

const build = path.join(root, ".vite/build");
const source = fs.readFileSync(mainProcessAsset(root), "utf8");
const start = source.indexOf("function MTKnativeAppToolsPeerAuthorizer()");
const current=source.startsWith("exports.ids=[615],exports.modules={");
let helperNode;const ast=parse(source,{ecmaVersion:"latest",sourceType:"module"});walk(ast,x=>{if(x.type==="FunctionDeclaration"&&x.id?.name==="MTKnativeAppToolsPeerAuthorizer")helperNode=x});
const end = helperNode?.end??source.indexOf("async function ", start);
const owner = current ? "26605" : source.slice(end).match(/^async function ([A-Za-z_$][\w$]*)\(/)?.[1];
const profiles = {
  "26605": {authorizer:"lV",addon:"e",socketVar:"s",authParam:"l"},
  cB: {authorizer: "cR", addon: "e", socketVar: "s", authParam: "o"},
  c$: {authorizer: "cF", addon: "e", socketVar: "s", authParam: "o"},
  $ce: {authorizer: "kl", addon: "i"},
  _ce: {authorizer: "pu", addon: "i"},
  Hse: {authorizer: "Ql", addon: "i"},
  goe: {authorizer: "Gu", addon: "i"},
  Tse: {authorizer: "Dl", addon: "i"},
  mie: {authorizer: "Tf", addon: "i"},
  Cae: {authorizer: "gd", addon: "i"},
  doe: {authorizer: "gf", addon: "i", authParam: "a"},
  Rae: {authorizer: "cp", addon: "i", authParam: "s"},
  Zue: {authorizer: "od", addon: "a", devVar: "r", authParam: "s"},
  zie: {authorizer: "nd", addon: "i"}
};
const profile = Object.hasOwn(profiles, owner) ? profiles[owner] : null;
assert.ok(profile, "known native app-tools owner");
assert.ok(start >= 0 && end > start, "localized native app-tools peer helper");
const helperSource = source.slice(start, end);
const loadHelper = new Function(profile.authorizer, `${helperSource};return MTKnativeAppToolsPeerAuthorizer`);

const authorize = result => loadHelper(() => () => result)()({});
const stockPass = { authorized: true, teamId: "2DC432GLL2", signingIdentifier: "node" };
assert.deepEqual(authorize(stockPass), stockPass, "stock authorization remains authoritative");
assert.deepEqual(
  authorize({
    authorized: false,
    reason: "missing-code-signing-identity",
    teamId: "2DC432GLL2",
    signingIdentifier: "node"
  }),
  { authorized: true, reason: undefined, teamId: "2DC432GLL2", signingIdentifier: "node" },
  "the exact OpenAI Node peer survives a locally re-signed ancestor"
);
for (const result of [
  { authorized: false, reason: "untrusted-code-signing-identity", teamId: "2DC432GLL2", signingIdentifier: "node" },
  { authorized: false, reason: "missing-code-signing-identity", teamId: "OTHERTEAM1", signingIdentifier: "node" },
  { authorized: false, reason: "missing-code-signing-identity", teamId: "OTHERTEAM1", signingIdentifier: "node_repl" },
  { authorized: false, reason: "untrusted-process-ancestry", teamId: "2DC432GLL2", signingIdentifier: "node_repl" },
  { authorized: false, reason: "missing-code-signing-identity", teamId: "2DC432GLL2", signingIdentifier: "codex" }
]) {
  assert.deepEqual(authorize(result), result, "every non-exact peer rejection remains rejected");
}
assert.equal(authorize({authorized:false,reason:"missing-code-signing-identity",teamId:"2DC432GLL2",signingIdentifier:"node_repl"}).authorized,
  true, "the vendor-signed Computer Use runtime survives locally signed ancestry");
assert.equal(
  count(source, `socketPeerAuthorizer:${profile.authParam ?? "r"}=MTKnativeAppToolsPeerAuthorizer()`),
  1,
  "the native app-tools pipe retains its exact authorizer binding"
);
if (owner === "cB") {
  for (const seam of [
    "async function ZC({apiImpl:e,nativePipeDirectory:t,maxOutgoingFrameBytes:r=0x4000000,pipePath:n,socketPeerAuthorizer:i=MTKnativeAppToolsPeerAuthorizer()})",
    "async function uv({services:e,pipePath:t=`/tmp/codex-host-services-${(0,tb.randomUUID)()}.sock`,socketPeerAuthorizer:r=MTKnativeAppToolsPeerAuthorizer()})",
    "y=await cy({maxIncomingFrameBytes:8388608,maxOutgoingFrameBytes:0x4000000,socketPeerAuthorizer:MTKnativeAppToolsPeerAuthorizer()})"
  ]) assert.equal(count(source,seam),1,"the exact browser/host-service owner uses the signed-runtime fallback");
  const setupStart = source.indexOf("async function lD(");
  const setupEnd = source.indexOf("async function lM(", setupStart);
  assert.ok(setupStart >= 0 && setupEnd > setupStart, "known canonical helper startup owner");
  const processStub = {platform:"darwin",env:{CODEX_ELECTRON_SKIP_COMPUTER_USE_CANONICAL_REFRESH:"1"}};
  const directoryCalls = [];
  const initialize = new Function("process", "ei", "rN", "ek", `${source.slice(setupStart,setupEnd)};return lD`)(
    processStub, () => path.posix, "SKY_CUA_SERVICE_NATIVE_PIPE_PATH",()=>({
      async mkdir(p,options){directoryCalls.push(["mkdir",p,options])},
      async chmod(p,mode){directoryCalls.push(["chmod",p,mode])}
    }));
  await initialize({sourceServiceAppPath:"/unused",codexHome:"/private/codex"});
  assert.equal(processStub.env.SKY_CUA_SERVICE_NATIVE_PIPE_PATH,"/private/codex/computer-use/tmtk-ipc/computeruse.sock",
    "managed helper uses a Codex-owned socket rather than the vendor-protected group container");
  assert.deepEqual(directoryCalls, [
    ["mkdir","/private/codex/computer-use/tmtk-ipc",{recursive:true,mode:0o700}],
    ["chmod","/private/codex/computer-use/tmtk-ipc",0o700]
  ],"the dedicated IPC directory is private on creation and reuse");
  processStub.env.SKY_CUA_SERVICE_NATIVE_PIPE_PATH = "/private/explicit.sock";
  await initialize({sourceServiceAppPath:"/unused",codexHome:"/private/codex"});
  assert.equal(processStub.env.SKY_CUA_SERVICE_NATIVE_PIPE_PATH,"/private/explicit.sock","explicit socket remains authoritative");
  assert.equal(directoryCalls.length,2,"an explicit path does not change another directory's permissions");
  const forwardingStart = source.indexOf("function({nativePipeDirectory:e,nativePipeEnabled:t=!1,serviceAppPath:r,serviceNativePipePath:n}={})");
  const forwardingEnd = source.indexOf("):{}",forwardingStart)+1;
  assert.ok(forwardingStart >= 0 && forwardingEnd > forwardingStart,"known runtime pipe forwarding owner");
  const runtime = env => new Function("h","u","eq","c","l","rW","rN","rq","ei","t",`return (${source.slice(forwardingStart,forwardingEnd)})`)(
    {platform:"darwin"},false,()=>({env}),{serviceAppPath:"/helper.app"},null,
    "SKY_CUA_SERVICE_PATH","SKY_CUA_SERVICE_NATIVE_PIPE_PATH","unused",()=>path.posix,"/private/codex");
  assert.equal(runtime(processStub.env).SKY_CUA_SERVICE_NATIVE_PIPE_PATH,"/private/explicit.sock",
    "packaged Computer Use runtime receives the same socket without development mode");
  assert.equal(runtime({}).SKY_CUA_SERVICE_NATIVE_PIPE_PATH,"/private/codex/computer-use/tmtk-ipc/computeruse.sock",
    "client and helper select the same private socket regardless of initialization order");
}
if(current){
 await probeBrowserRuntimeParent(source);
 for(const seam of ['async function({apiImpl:e,nativePipeDirectory:t,maxOutgoingFrameBytes:r=0x4000000,pipePath:n,socketPeerAuthorizer:i=MTKnativeAppToolsPeerAuthorizer()})','async function({services:e,pipePath:t=`/tmp/codex-host-services-${(0,tf.randomUUID)()}.sock`,socketPeerAuthorizer:r=MTKnativeAppToolsPeerAuthorizer()})','y=await lA({maxIncomingFrameBytes:8388608,maxOutgoingFrameBytes:0x4000000,socketPeerAuthorizer:MTKnativeAppToolsPeerAuthorizer()})'])assert.equal(count(source,seam),1);
 let initializer;walk(ast,node=>{if(node.type==='FunctionExpression'&&source.slice(node.start,node.start+65).startsWith('async function({sourceServiceAppPath:e,codexHome:t})'))initializer=node});assert.ok(initializer);
 const env={CODEX_ELECTRON_SKIP_COMPUTER_USE_CANONICAL_REFRESH:'1'},calls=[],processStub={platform:'darwin',env};
 const initialize=Function('process','et','rz','ew','return ('+source.slice(initializer.start,initializer.end)+')')(processStub,()=>path.posix,'SKY_CUA_SERVICE_NATIVE_PIPE_PATH',()=>({async mkdir(p,o){calls.push(['mkdir',p,o])},async chmod(p,m){calls.push(['chmod',p,m])}}));
 await initialize({sourceServiceAppPath:'/unused',codexHome:'/private/codex'});assert.equal(env.SKY_CUA_SERVICE_NATIVE_PIPE_PATH,'/private/codex/computer-use/tmtk-ipc/computeruse.sock');assert.deepEqual(calls,[['mkdir','/private/codex/computer-use/tmtk-ipc',{recursive:true,mode:448}],['chmod','/private/codex/computer-use/tmtk-ipc',448]]);
 env.SKY_CUA_SERVICE_NATIVE_PIPE_PATH='/private/explicit.sock';await initialize({sourceServiceAppPath:'/unused',codexHome:'/private/codex'});assert.equal(calls.length,2);assert.equal(env.SKY_CUA_SERVICE_NATIVE_PIPE_PATH,'/private/explicit.sock');
 const begin=source.indexOf('function({nativePipeDirectory:e,nativePipeEnabled:t=!1,serviceAppPath:r,serviceNativePipePath:n}={})'),end=source.indexOf('):{}',begin)+1;assert.ok(begin>=0&&end>begin);
 const runtime=env=>Function('h','u','eM','c','l','rQ','rz','rK','et','t','return ('+source.slice(begin,end)+')')({platform:'darwin'},false,()=>({env}),{serviceAppPath:'/helper.app'},null,'SKY_CUA_SERVICE_PATH','SKY_CUA_SERVICE_NATIVE_PIPE_PATH','unused',()=>path.posix,'/private/codex');
 assert.equal(runtime(env).SKY_CUA_SERVICE_NATIVE_PIPE_PATH,'/private/explicit.sock');assert.equal(runtime({}).SKY_CUA_SERVICE_NATIVE_PIPE_PATH,'/private/codex/computer-use/tmtk-ipc/computeruse.sock');
}
assert.equal(count(source, `${profile.addon}.authorizeSocketPeer(${profile.socketVar ?? "t"},${profile.devVar ?? "n"})`), 1, "the native stock authorizer remains installed");

process.stdout.write(`${JSON.stringify({
  state: "green",
  stockFullChainAuthorizationPreserved: true,
  exactFallback: { teamId: "2DC432GLL2", signingIdentifier: "node", reason: "missing-code-signing-identity" },
  computerUsePipes: current || owner === "cB"
}, null, 2)}\n`);

function count(haystack, needle) {
  return haystack.split(needle).length - 1;
}

function walk(n,f){if(!n||typeof n!=="object")return;if(n.type)f(n);for(const v of Object.values(n))if(Array.isArray(v))v.forEach(x=>walk(x,f));else if(v&&typeof v==="object")walk(v,f)}

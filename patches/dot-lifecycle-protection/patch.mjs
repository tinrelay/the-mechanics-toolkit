#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import {spawnSync} from "node:child_process";

const command=process.argv[2],root=path.resolve(process.argv[3]??"");
if(!["check","apply"].includes(command)||!process.argv[3])throw Error("usage: dot-lifecycle-protection/patch.mjs check|apply EXTRACTED_ASAR_ROOT");
const assets=path.join(root,"webview/assets");
function unique(pattern) {
  const names=fs.readdirSync(assets).filter(n=>pattern.test(n));
  if(names.length!==1)throw Error(`Upstream changed: dot owner files=${names.length} (${pattern})`);
  return path.join(assets,names[0]);
}
const initial=unique(/^app-initial-.*\.js$/),reboot=unique(/^reboot-dialog-.*\.js$/);
const helper=String.raw`const MTKdotLifecyclePolicy=1;function MTKdotEntries(){let e=globalThis.__MTK_AGENT_ROSTER__?.current()?.entries??[],t=[];for(let n of e){let r=n.data;if(n.kind!=="agent"||r?.orbitId===void 0)continue;if(typeof r.orbitId!=="string"||r.orbitId.length===0||r.orbitId.length>512||["protectDeletion","protectReboot"].some(e=>r[e]!==void 0&&typeof r[e]!=="boolean"))throw Error("Invalid TMTK dot policy");t.push(n)}return t}function MTKdotProtected(e,t,n){let r=e==="delete"?"protectDeletion":e==="reboot"?"protectReboot":null;return r!==null&&MTKdotEntries().some(e=>(typeof t==="string"?e.data.orbitId===t:typeof n==="string"&&e.taskId===n)&&e.data[r]===!0)}function MTKdotRebootProtected(e,t){return MTKdotProtected("reboot",e.query.getData(uw,t)?.id,t)}globalThis.__MTK_DOT_POLICY__=Object.freeze({version:1,protected:MTKdotProtected,rebootProtected:MTKdotRebootProtected,assertReboot(e,t){if(MTKdotRebootProtected(e,t))throw Error("This dot is protected from reboot by TMTK")},nameForThread(e,t){try{let n=MTKdotEntries().find(t=>t.taskId===e);return n==null?null:typeof t==="string"&&t.trim().length>0?t.trim():n.data.name}catch{return null}}});`;
const initialPairs=[
  ['function Wra(e,t,n,r){let i=',helper+'function Wra(e,t,n,r){if(MTKdotProtected("delete",t))return;let i='],
  ['if(!d()||e.get(zC,i).has(n.threadId))return;','if(MTKdotProtected("delete",t)||!d()||e.get(zC,i).has(n.threadId))return;'],
  ['function bps(e,t,n=e.get(Kw,t)){if(cw(e,t)==null)return;','function bps(e,t,n=e.get(Kw,t)){if(cw(e,t)==null||MTKdotProtected("delete",cw(e,t)?.id,t))return;'],
  ['function xps(e,t,n){return cw(e,t)==null?null:{id:`delete-orbit`,','function xps(e,t,n){if(MTKdotProtected("delete",e.query.getData(uw,t)?.id,t))return null;return cw(e,t)==null?null:{id:`delete-orbit`,'],

];
const rebootPairs=[
  ['u=async()=>{await(await k.postResponse(`/cloud-aeons/primary/reboot`,','u=async()=>{globalThis.__MTK_DOT_POLICY__.assertReboot(c,i);await(await k.postResponse(`/cloud-aeons/primary/reboot`,'],
  ['assertRequestCurrent:()=>{if(!c.get(D,`970190263`)||c.get(M)||c.get(j)!==i)throw Error(`The selected dot cannot be rebooted`)','assertRequestCurrent:()=>{globalThis.__MTK_DOT_POLICY__.assertReboot(c,i);if(!c.get(D,`970190263`)||c.get(M)||c.get(j)!==i)throw Error(`The selected dot cannot be rebooted`)']
];
const primary=unique(/^app-primary-.*\.js$/);
const primaryPairs=[[
  'function VJn(e,t){if(!e.get(z_,`970190263`))return null;',
  'function VJn(e,t){if(globalThis.__MTK_DOT_POLICY__.rebootProtected(e,t)||!e.get(z_,`970190263`))return null;'
]];
const files=[{file:initial,pairs:initialPairs},{file:primary,pairs:primaryPairs},{file:reboot,pairs:rebootPairs}];
const count=(s,v)=>s.split(v).length-1;
function inspect() {
  const initialSource=fs.readFileSync(initial,"utf8");
  if(count(initialSource,'function cw(e,t){let n=e.query.getData(uw,t);')!==1||
      count(initialSource,'if(cw(e,n.threadId)?.id!==t)throw Error(`The Dot deletion target is no longer current`)')!==1) {
    throw Error("Upstream changed: dot metadata or request-time target owner is unknown");
  }
  const vectors=files.flatMap(({file,pairs})=>{const s=fs.readFileSync(file,"utf8");return pairs.map(([before,after])=>({before:count(s,before),after:count(s,after)}))});
  // Some pristine prefixes remain inside the complete replacement; canonical bytes own applied state.
  if(vectors.every(v=>v.after===1&&v.before===0))return "applied";
  if(vectors.every(v=>v.before===1&&v.after===0)&&!fs.readFileSync(initial,"utf8").includes("MTKdotLifecyclePolicy"))return "needs-apply";
  throw Error("Upstream changed: dot lifecycle owners are unknown or partial");
}
let state=inspect();
if(command==="apply"&&state==="needs-apply") {
  const rosterOwners=fs.readdirSync(assets).filter(name=>/^app-(?:initial|runtime)-.*\.js$/.test(name)&&
    fs.readFileSync(path.join(assets,name),"utf8").includes("globalThis.__MTK_AGENT_ROSTER__=Object.freeze("));
  if(rosterOwners.length!==1)throw Error("dot-lifecycle-protection requires one agent-roster owner first");
  const changed=files.map(({file,pairs})=>{
    let s=fs.readFileSync(file,"utf8");
    for(const [before,after] of pairs)s=s.replace(before,after);
    const result=spawnSync(process.execPath,["--input-type=module","--check"],{input:s,encoding:"utf8",maxBuffer:64*1024*1024});
    if(result.status!==0)throw Error(`Dot module syntax failed: ${result.stderr.match(/SyntaxError:[^\n]*/)?.[0]??result.stderr.slice(-600)}`);
    return {file,source:s};
  });
  for(const {file,source} of changed)fs.writeFileSync(file,source);
  state=inspect();
}
console.log(JSON.stringify({state,targets:files.map(({file})=>path.relative(root,file))}));

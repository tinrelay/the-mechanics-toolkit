import path from 'node:path';import{readRendererModule,writeRendererModule}from '../../../src/renderer-module.mjs';import{rosterOwner30607}from '../../agent-roster/profiles/build30607.mjs';
const owner=(root,file,id,parameters=['e','t','n'])=>({file:path.join(root,'webview/assets/async',file),id,parameters});
export function dotOwners30607(root){return{policy:rosterOwner30607(root),deletion:owner(root,'49792.ab5b643c25.js','tLki'),menus:['948973.ab8f9e03bc.js','209376.5a23cae0f4.js'].map((f,i)=>owner(root,f,'SeWp',['e','t','n'])),rebootMenus:['948973.ab8f9e03bc.js'].map((f,i)=>owner(root,f,'eP5h',['e','t','n'])),reboot:owner(root,'775336.2a9893bf83.js','PSog',['e','t','o'])}}
export function dotHelper30607(helper){return helper.replace('e.query.getData(UC,t)?.id','e.query.getData(MTKdotMetadata,MTKdotNormalize(t))?.id')}
export function runBuild30607({root,command,helper}){
 const o=dotOwners30607(root),h=dotHelper30607(helper),entries=[];
 const policy=readRendererModule(o.policy),binding=';const MTKdotMetadata=n("TYK1").cloudAeonByThreadId$,MTKdotNormalize=n("DBCl").JXB;';
 if(command==='apply'&&!policy.includes('globalThis.__MTK_AGENT_ROSTER__=Object.freeze('))throw Error('Dot protection requires roster');
 entries.push({owner:o.policy,source:policy,pairs:[[null,binding+h]]});
 const deletion=readRendererModule(o.deletion);
 one(deletion,'if((0,m.rf)(e,n.threadId)?.id!==t)throw Error("The Dot deletion target is no longer current")');
 entries.push({owner:o.deletion,source:deletion,pairs:[["function I(e,t,n,I){","function I(e,t,n,I){if(globalThis.__MTK_DOT_POLICY__.protected(\"delete\",t))return;"],["if(!P()||e.get(g.kO,E).has(n.threadId))return;","if(globalThis.__MTK_DOT_POLICY__.protected(\"delete\",t)||!P()||e.get(g.kO,E).has(n.threadId))return;"]]});
 for(const [index,target]of o.menus.entries()){
  const source=readRendererModule(target),names=[['u','i','o','d'],['c','a','l','s']][index];
  const [open,param,thread,metadata]=names;
  one(source,`${metadata}=${target.parameters.at(-1)}("TYK1")`);
  const before=`async function ${open}(e,t,${param}=e.get(${thread}.qX,t)){`,menuBefore=`bo:function(e,t,n,{hidePrimaryPersonalDot:${index===0?"i":"a"}=!1}={}){`;
  entries.push({owner:target,source,pairs:[[before,before+`if(globalThis.__MTK_DOT_POLICY__.protected("delete",(0,${metadata}.rf)(e,t)?.id,t))return;`],[menuBefore,menuBefore+`if(globalThis.__MTK_DOT_POLICY__.protected("delete",(0,${metadata}.rf)(e,t)?.id,t))return null;`]]});
 }
 for(const[index,target]of o.rebootMenus.entries()){
  const source=readRendererModule(target);
  // Both generated copies share the exact native primary-dot eligibility check.
  const canonical=source.replace('function(e,t){if(globalThis.__MTK_DOT_POLICY__.rebootProtected(e,t)||!e.get(', 'function(e,t){if(!e.get(');
  const matches=[...canonical.matchAll(/function\(e,t\)\{if\(!e.get\(([A-Za-z_$][\w$]*)\.JW,"970190263"\)\)return null;/g)];if(matches.length!==1)throw Error('Unknown dot reboot menu owner');
  const before=matches[0][0];entries.push({owner:target,source,pairs:[[before,before.replace('if(!e.get(', 'if(globalThis.__MTK_DOT_POLICY__.rebootProtected(e,t)||!e.get(')]]});
 }
 const reboot=readRendererModule(o.reboot);entries.push({owner:o.reboot,source:reboot,pairs:[["t=async()=>{let e=await i.Request.postResponse(\"/cloud-aeons/primary/reboot\",","t=async()=>{globalThis.__MTK_DOT_POLICY__.assertReboot(I,v);let e=await i.Request.postResponse(\"/cloud-aeons/primary/reboot\","],["assertRequestCurrent:()=>{if(!I.get(y.JW,\"970190263\")","assertRequestCurrent:()=>{globalThis.__MTK_DOT_POLICY__.assertReboot(I,v);if(!I.get(y.JW,\"970190263\")"]]});
 const vectors=entries.flatMap(e=>e.pairs.map(([before,after])=>({green:count(e.source,after)===1,red:before===null?!e.source.includes('MTKdotLifecyclePolicy'):count(e.source,before)===1&&!e.source.includes(after)})));
 const applied=vectors.every(x=>x.green);if(!applied&&!vectors.every(x=>x.red))throw Error('Partial dot lifecycle module patch: '+entries.flatMap(e=>e.pairs.filter(([b,a])=>b!==null&&count(e.source,b)!==1&&count(e.source,a)!==1).map(([b])=>e.owner.id+': '+b)).join('; '));
 if(command==='apply'&&!applied)for(const e of entries){let s=e.source;for(const[before,after]of e.pairs)s=before===null?s+after:s.replace(before,()=>after);writeRendererModule(e.owner,s);}
 return{state:applied||command==='apply'?'applied':'needs-apply',targets:[...new Set(entries.map(e=>path.relative(root,e.owner.file)))]};
}
function count(s,v){return s.split(v).length-1}function one(s,v){if(count(s,v)!==1)throw Error('Upstream changed: dot module contract '+v)}

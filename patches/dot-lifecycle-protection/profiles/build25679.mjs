import path from 'node:path';import{readRendererModule,writeRendererModule}from '../../../src/renderer-module.mjs';import{rosterOwner25679}from '../../agent-roster/profiles/build25679.mjs';
const owner=(root,file,id,parameters=['e','t','n'])=>({file:path.join(root,'webview/assets/async',file),id,parameters});
export function dotOwners25679(root){return{policy:rosterOwner25679(root),deletion:owner(root,'182735.d1916dd704.js','tLki'),menus:['209376.a537101e3b.js','8916.ffeb3129a1.js','99588.01cccd6b1f.js'].map(f=>owner(root,f,'SeWp')),rebootMenus:['8916.ffeb3129a1.js','99588.01cccd6b1f.js'].map(f=>owner(root,f,'GgrI')),reboot:owner(root,'775336.2821fcd293.js','PSog',['e','t','r'])}}
export function dotHelper25679(helper){return helper.replace('e.query.getData(UC,t)?.id','e.query.getData(MTKdotMetadata,MTKdotNormalize(t))?.id')}
export function runBuild25679({root,command,helper}){
 const o=dotOwners25679(root),h=dotHelper25679(helper),entries=[];
 const policy=readRendererModule(o.policy),binding=';const MTKdotMetadata=n("TYK1").cloudAeonByThreadId$,MTKdotNormalize=n("DBCl").JXB;';
 if(command==='apply'&&!policy.includes('globalThis.__MTK_AGENT_ROSTER__=Object.freeze('))throw Error('Dot protection requires roster');
 entries.push({owner:o.policy,source:policy,pairs:[[null,binding+h]]});
 const deletion=readRendererModule(o.deletion);
 one(deletion,'if((0,m.rf)(e,n.threadId)?.id!==t)throw Error("The Dot deletion target is no longer current")');
 entries.push({owner:o.deletion,source:deletion,pairs:[['function E(e,t,n,E){','function E(e,t,n,E){if(globalThis.__MTK_DOT_POLICY__.protected("delete",t))return;'],['if(!O()||e.get(_.kO,I).has(n.threadId))return;','if(globalThis.__MTK_DOT_POLICY__.protected("delete",t)||!O()||e.get(_.kO,I).has(n.threadId))return;']]});
 for(const [index,target]of o.menus.entries()){
  const source=readRendererModule(target),names=[['s','a','r','l'],['l','a','i','s'],['s','a','r','l']][index];
  const [open,param,thread,metadata]=names;
  one(source,`${metadata}=n("TYK1")`);
  const before=`async function ${open}(e,t,${param}=e.get(${thread}.qX,t)){`,menuBefore=`b:function(e,t,n){return`;
  entries.push({owner:target,source,pairs:[[before,before+`if(globalThis.__MTK_DOT_POLICY__.protected("delete",(0,${metadata}.rf)(e,t)?.id,t))return;`],[menuBefore,`b:function(e,t,n){if(globalThis.__MTK_DOT_POLICY__.protected("delete",(0,${metadata}.rf)(e,t)?.id,t))return null;return`]]});
 }
 for(const[index,target]of o.rebootMenus.entries()){
  const source=readRendererModule(target);
  // Three generated copies share the exact native primary-dot eligibility check.
  const canonical=source.replace('function(e,t){if(globalThis.__MTK_DOT_POLICY__.rebootProtected(e,t)||!e.get(', 'function(e,t){if(!e.get(');
  const matches=[...canonical.matchAll(/function\(e,t\)\{if\(!e.get\(([A-Za-z_$][\w$]*)\.JW,"970190263"\)\)return null;/g)];if(matches.length!==1)throw Error('Unknown dot reboot menu owner');
  const before=matches[0][0];entries.push({owner:target,source,pairs:[[before,before.replace('if(!e.get(', 'if(globalThis.__MTK_DOT_POLICY__.rebootProtected(e,t)||!e.get(')]]});
 }
 const reboot=readRendererModule(o.reboot);entries.push({owner:o.reboot,source:reboot,pairs:[['t=async()=>{let e=await l.Request.postResponse("/cloud-aeons/primary/reboot",','t=async()=>{globalThis.__MTK_DOT_POLICY__.assertReboot(z,D);let e=await l.Request.postResponse("/cloud-aeons/primary/reboot",'],['assertRequestCurrent:()=>{if(!z.get(y.JW,"970190263")','assertRequestCurrent:()=>{globalThis.__MTK_DOT_POLICY__.assertReboot(z,D);if(!z.get(y.JW,"970190263")']]});
 const vectors=entries.flatMap(e=>e.pairs.map(([before,after])=>({green:count(e.source,after)===1,red:before===null?!e.source.includes('MTKdotLifecyclePolicy'):count(e.source,before)===1&&!e.source.includes(after)})));
 const applied=vectors.every(x=>x.green);if(!applied&&!vectors.every(x=>x.red))throw Error('Partial dot lifecycle module patch');
 if(command==='apply'&&!applied)for(const e of entries){let s=e.source;for(const[before,after]of e.pairs)s=before===null?s+after:s.replace(before,()=>after);writeRendererModule(e.owner,s);}
 return{state:applied||command==='apply'?'applied':'needs-apply',targets:[...new Set(entries.map(e=>path.relative(root,e.owner.file)))]};
}
function count(s,v){return s.split(v).length-1}function one(s,v){if(count(s,v)!==1)throw Error('Upstream changed: dot module contract '+v)}

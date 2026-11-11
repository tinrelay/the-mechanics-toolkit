import path from 'node:path';import{readRendererModule,writeRendererModule}from '../../../src/renderer-module.mjs';import{rosterOwner26605}from '../../agent-roster/profiles/build26605.mjs';import{attributionOwner26605}from '../../cross-task-attribution/profiles/build26605.mjs';
const owner=(root,file,id,parameters=['e','t','n'])=>({file:path.join(root,'webview/assets/async',file),id,parameters});
export const paletteOwners26605=root=>({app:rosterOwner26605(root),room:owner(root,'625050.ae2e2342b3.js','ZhUU'),fade:owner(root,'739301.37a39f26d6.js','KkZX'),delegation:attributionOwner26605(root),group:owner(root,'86296.b4b4b7b00b.js','eQ5p',['e','t','a']),local:owner(root,'86296.b4b4b7b00b.js','oprL',['e','t','a']),remote:owner(root,'86296.b4b4b7b00b.js','ypQm',['e','t','a']),localMenu:owner(root,'86296.b4b4b7b00b.js','JbIn',['e','t','a']),remoteActions:owner(root,'903643.bfea3ecf93.js','qK2L'),menus:['345848.bbe6bc3831.js','539687.6e6228eef0.js'].map((f,i)=>owner(root,f,'GgrI',i===0?['e','t','a']:['e','t','r']))});
export function runBuild26605({root,command,buildPaletteHelper}){
 const o=paletteOwners26605(root);let helper=buildPaletteHelper({name:'build-26605',agentRoster:true,helperReplacements:[['QSl.useEffect','u.useEffect']]});
 helper=helper.replace('t.getAttribute("data-app-action-sidebar-thread-id")', 'MTKpaletteNativeTaskId(t.getAttribute("data-app-action-sidebar-thread-id"))').replace('function MTKusePaletteBootstrap(', 'function MTKpaletteNativeTaskId(e){let t=MTKpaletteKeyDecode(e);return t?.kind==="local"?t.threadId:t?.kind==="remote"?t.taskId:e}function MTKusePaletteBootstrap(');
 const entries=[],add=(target,pairs)=>entries.push({owner:target,pairs,source:readRendererModule(target)});
 add(o.app,[["function mD(){MTKuseAgentRoster();","function mD(){MTKuseAgentRoster();MTKusePaletteBootstrap();"],[null,';const MTKpaletteKeyDecode=n("d6Ff").Pc;'+helper]]);
 add(o.room,[['M=(0,r.c)(100),','M=(0,r.c)(102),'],['||M[95]!==S?(U=(0,a.jsxs)("div",{ref:eW,className:"relative h-full min-h-0",','||M[95]!==S||M[100]!==P||M[101]!==T?(U=(0,a.jsxs)("div",{ref:eW,"data-mtk-palette-room-host":!0,"data-mtk-palette-thread-id":P??T,className:"relative h-full min-h-0",'],['M[95]=S,M[96]=U','M[95]=S,M[100]=P,M[101]=T,M[96]=U']]);
 add(o.fade,[['(0,r.jsx)("div",{"aria-hidden":!0,className:t})','(0,r.jsx)("div",{"aria-hidden":!0,"data-mtk-palette-bottom-fade":!0,className:t})']]);
 add(o.delegation,[['function tn(e){let t,n,i,l,o=(0,s.c)(14),','function tn(e){let t,n,i,l,o=(0,s.c)(16),'],['o[13]!==n?(l=(0,a.jsx)(ee,','o[13]!==n||o[14]!==MTKtitle||o[15]!==c?(l=(0,a.jsx)(ee,'],['alignment:`end`,accentColor:MTKdelegatedAccentColor','alignment:`end`,accentColor:MTKdelegatedAccentColor,paletteSourceTitle:MTKtitle,paletteSourceId:c'],['o[13]=n,o[12]=l','o[13]=n,o[14]=MTKtitle,o[15]=c,o[12]=l'],['r=(0,s.c)(21),{label:c,alignment:d','r=(0,s.c)(23),{label:c,alignment:d'],['onLabelClick:v}=e,y=','onLabelClick:v,paletteSourceTitle:MTKsourceTitle,paletteSourceId:MTKsourceId}=e,y='],['r[19]!==l?(o=(0,a.jsxs)("div",{className:n,children:[i,l]}),','r[19]!==l||r[21]!==MTKsourceTitle||r[22]!==MTKsourceId?(o=(0,a.jsxs)("div",{"data-mtk-palette-source-title":MTKsourceTitle??void 0,"data-mtk-palette-source-id":MTKsourceId??void 0,className:n,children:[i,l]}),'],['r[19]=l,r[20]=o','r[19]=l,r[21]=MTKsourceTitle,r[22]=MTKsourceId,r[20]=o']]);
 const protect='globalThis.__MTKsidebarArchiveProtected?.';
 add(o.group,[['selectedThreadKeys:g,threadKey:I}){if(g.length<2)return t;',`selectedThreadKeys:g,threadKey:I}){if(g.some(e=>${protect}(e)===!0))t=t.filter(e=>e.id!=="archive-thread"&&e.id!=="archive-task");if(g.length<2)return t;`]]);
 add(o.local,[['tN?[{id:"archive-task"',`tN&&!MTKsidebarArchiveProtected(r)?[{id:"archive-task"`],['archive:null!=t&&(am||tX)?()=>ag(!1):t,getMenuItems:', 'archive:MTKsidebarArchiveProtected(r)?null:null!=t&&(am||tX)?()=>ag(!1):t,getMenuItems:']]);
 add(o.localMenu,[[',{id:"archive-task",message:v.tD.archiveThread,onSelect:en}',',...MTKsidebarArchiveProtected(J)?[]:[{id:"archive-task",message:v.tD.archiveThread,onSelect:en}]']]);
 add(o.remote,[['if(tl&&e.push({id:"archive-task"','if(tl&&!MTKsidebarArchiveProtected(t)&&e.push({id:"archive-task"'],['$=eC??(ty?e=>','$=eC??(ty&&!MTKsidebarArchiveProtected(t)?e=>']]);
 add(o.remoteActions,[['ew=function(e){let t=(0,Z.Wz)(e.task.id),','ew=function(e){const MTKarchiveTaskId=e.task.id;let t=(0,Z.Wz)(e.task.id),'],['{archive:t,getMenuItems:tv?p:void 0,','{archive:MTKsidebarArchiveProtected(MTKarchiveTaskId)?null:t,getMenuItems:tv&&!MTKsidebarArchiveProtected(MTKarchiveTaskId)?p:void 0,'],['{archive:n,getMenuItems:tv?e=>','{archive:MTKsidebarArchiveProtected(MTKarchiveTaskId)?null:n,getMenuItems:tv&&!MTKsidebarArchiveProtected(MTKarchiveTaskId)?e=>']]);
 for(const[index,target]of o.menus.entries()){
  const before=['let eD=e_?(0,D.b)(e,ew,eS):{id:"archive-thread",onSelect:b}', 'let e_=eK?(0,_.b)(e,ek,ey):{id:"archive-thread",onSelect:j}'][index];
  const id=index===1?'ek':'ew';add(target,[[before,before.replace('=',`=${protect}(${id})===!0?null:`)]]);
 }
 // Policy reload invalidates the stock compiler memo cache at each sidebar action owner.
 for(const[key,fn,cache,size]of[['local','eU','tv',249],['remote','_','et',124],['remoteActions','es','eA',197],['localMenu','k','F',81]]){
  const entry=entries.find(e=>e.owner===o[key]);const tail=['local','localMenu'].includes(key)?';':',',before=`${cache}=(0,${key==='remoteActions'?'a':'o'}.c)(${size})${tail}`;
  entry.pairs.push([`function ${fn}(e){`,`function ${fn}(e){const MTKarchiveEpoch=MTKuseSidebarArchivePolicy();`],[before,`${cache}=(0,${key==='remoteActions'?'a':'o'}.c)(${size+1})${tail}${['local','localMenu'].includes(key)?'const ':''}MTKarchiveCache=${cache}[${size}]!==MTKarchiveEpoch&&(${cache}.fill(Symbol.for("react.memo_cache_sentinel")),${cache}[${size}]=MTKarchiveEpoch)${tail}`],[null,';const MTKarchiveReact='+(['local','remote','localMenu'].includes(key)?'a':'n')+'("zd8w"),MTKsidebarArchiveProtected=e=>globalThis.__MTKsidebarArchiveProtected?.(e)===!0;function MTKuseSidebarArchivePolicy(){return MTKarchiveReact.useSyncExternalStore(globalThis.__MTKsidebarArchiveSubscribe,globalThis.__MTKsidebarArchiveSnapshot,globalThis.__MTKsidebarArchiveSnapshot)}']);
 }
 if(command==='check'&&!entries[0].source.includes('MTKuseAgentRoster();')){
  const app=entries[0].source,delegation=readRendererModule(o.delegation);
  for(const fragment of ['function mD(){let e,t,n,a,i=(0,c.c)(11),','u=n("zd8w")'])if(count(app,fragment)!==1)throw Error('Unknown pristine palette bootstrap');
  for(const fragment of ['function tn(e){let t,n,i,l,o=(0,s.c)(13),','function ee(e){let t,n,i,l,o,r=(0,s.c)(21),','compactActions:x,onLabelClick:v}=e,y='])if(count(delegation,fragment)!==1)throw Error('Unknown pristine delegated palette owner');
  for(const e of entries.filter(e=>e.owner!==o.app&&e.owner!==o.delegation))for(const[b]of e.pairs)if(b!==null&&count(e.source,b)!==1)throw Error('Unknown pristine palette module '+e.owner.id+': '+b);
  return{state:'needs-apply',targets:[...new Set(entries.map(e=>path.relative(root,e.owner.file)))]};
 }
 const vectors=entries.flatMap(e=>e.pairs.map(([before,after])=>({green:count(paletteCanonical(e.source),after)===1,red:before===null?!e.source.includes(after):count(e.source,before)===1&&!e.source.includes(after)})));
 const applied=vectors.every(x=>x.green);if(!applied&&!vectors.every(x=>x.red)){
  const failed=entries.flatMap(e=>e.pairs.filter(([b,a])=>count(e.source,a)!==1&&(b===null?e.source.includes(a):count(e.source,b)!==1)).map(([b])=>e.owner.id+': '+b));throw Error('Unknown/partial palette module owners: '+failed.join('; '));
 }
 if(command==='apply'&&!applied)for(const e of entries){let s=e.source;for(const[b,a]of e.pairs)s=b===null?s+a:s.replace(b,()=>a);writeRendererModule(e.owner,s);}
 return{state:applied||command==='apply'?'applied':'needs-apply',targets:[...new Set(entries.map(e=>path.relative(root,e.owner.file)))]};
}
function count(s,v){return s.split(v).length-1}

// Incoming TinRelay owns the optional replacement bubble on this same wrapper.
function paletteCanonical(source){
 source=source.replace("function mD(){MTKuseAttentionBootstrap26605();","function mD(){");
 if(!source.includes('messageNode:MTKmessageNode}=e,y='))return source;
 return source.replace("r=(0,s.c)(25),{label:c,alignment:d","r=(0,s.c)(23),{label:c,alignment:d").replace('paletteSourceTitle:MTKsourceTitle,paletteSourceId:MTKsourceId,messageNode:MTKmessageNode}=e,y=','paletteSourceTitle:MTKsourceTitle,paletteSourceId:MTKsourceId}=e,y=');
}

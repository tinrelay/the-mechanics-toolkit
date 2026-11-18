import path from 'node:path';import{readRendererModule,writeRendererModule}from '../../../src/renderer-module.mjs';import{rosterOwner28661}from '../../agent-roster/profiles/build28661.mjs';import{attributionOwner28661}from '../../cross-task-attribution/profiles/build28661.mjs';
const owner=(root,file,id,parameters=['e','t','n'])=>({file:path.join(root,'webview/assets/async',file),id,parameters});
export const paletteOwners28661=root=>({app:rosterOwner28661(root),room:owner(root,'669098.3a1fc59edc.js','njHN'),fade:owner(root,'907538.91f2a19777.js','KkZX'),footer:owner(root,'344734.3322725bda.js','Jg9v',['e','t','r']),delegation:attributionOwner28661(root),group:owner(root,'364303.020d70cb36.js','eQ5p',['e','t','n']),local:owner(root,'364303.020d70cb36.js','oprL',['e','t','n']),localMenu:owner(root,'364303.020d70cb36.js','JbIn',['e','t','n']),remoteActions:owner(root,'903643.9dbc99d7cb.js','qK2L'),menus:['729482.95b603b8bb.js','588201.00897288bb.js'].map((f,i)=>owner(root,f,'GgrI',i===0?['e','t','a']:['e','t','n']))});
export function runBuild28661({root,command,buildPaletteHelper}){
 const decoder=readRendererModule(owner(root,'907538.91f2a19777.js','d6Ff'));if(count(decoder,'Pc:l,Wz:o,z3:s')!==1)throw Error('Unknown sidebar key decoder export');
 const o=paletteOwners28661(root);let helper=buildPaletteHelper({name:'build-28661',agentRoster:true,helperReplacements:[['QSl.useEffect','u.useEffect']]});
 helper=helper.replace('t.getAttribute("data-app-action-sidebar-thread-id")', 'MTKpaletteNativeTaskId(t.getAttribute("data-app-action-sidebar-thread-id"))').replace('function MTKusePaletteBootstrap(', 'function MTKpaletteNativeTaskId(e){let t=MTKpaletteKeyDecode(e);return t?.kind==="local"?t.threadId:t?.kind==="remote"?t.taskId:e}function MTKusePaletteBootstrap(');
 const entries=[],add=(target,pairs)=>entries.push({owner:target,pairs,source:readRendererModule(target)});
 add(o.app,[["function mV(){MTKuseAgentRoster();","function mV(){MTKuseAgentRoster();MTKusePaletteBootstrap();"],[null,';const MTKpaletteKeyDecode=n("d6Ff").Pc;'+helper]]);
 add(o.room,[['M=(0,r.c)(101),','M=(0,r.c)(103),'],['||M[96]!==S?(U=(0,a.jsxs)("div",{ref:eG,className:"relative h-full min-h-0",','||M[96]!==S||M[101]!==N||M[102]!==T?(U=(0,a.jsxs)("div",{ref:eG,"data-mtk-palette-room-host":!0,"data-mtk-palette-thread-id":N??T,className:"relative h-full min-h-0",'],['M[96]=S,M[97]=U','M[96]=S,M[101]=N,M[102]=T,M[97]=U']]);
 add(o.fade,[['(0,r.jsx)("div",{"aria-hidden":!0,className:t})','(0,r.jsx)("div",{"aria-hidden":!0,"data-mtk-palette-bottom-fade":!0,className:t})']]);
 // The current composer paints its backdrop on footer pseudo-elements, independently of KkZX.
 add(o.footer,[['"data-thread-end-fade":tF||void 0,className:(0,o.A)("footer-A8ZvKV",','"data-thread-end-fade":tF||void 0,"data-mtk-palette-bottom-fade":!0,className:(0,o.A)("footer-A8ZvKV",']]);
 add(o.delegation,[['function tt(e){let t,n,s,l,r=(0,i.c)(14),','function tt(e){let t,n,s,l,r=(0,i.c)(16),'],['r[13]!==n?(l=(0,a.jsx)(ee,','r[13]!==n||r[14]!==MTKtitle||r[15]!==c?(l=(0,a.jsx)(ee,'],['alignment:`end`,accentColor:MTKdelegatedAccentColor','alignment:`end`,accentColor:MTKdelegatedAccentColor,paletteSourceTitle:MTKtitle,paletteSourceId:c'],['r[13]=n,r[12]=l','r[13]=n,r[14]=MTKtitle,r[15]=c,r[12]=l'],['o=(0,i.c)(21),{label:c,alignment:d','o=(0,i.c)(23),{label:c,alignment:d'],['onLabelClick:v}=e,y=','onLabelClick:v,paletteSourceTitle:MTKsourceTitle,paletteSourceId:MTKsourceId}=e,y='],['o[19]!==l?(r=(0,a.jsxs)("div",{className:n,children:[s,l]}),','o[19]!==l||o[21]!==MTKsourceTitle||o[22]!==MTKsourceId?(r=(0,a.jsxs)("div",{"data-mtk-palette-source-title":MTKsourceTitle??void 0,"data-mtk-palette-source-id":MTKsourceId??void 0,className:n,children:[s,l]}),'],['o[19]=l,o[20]=r','o[19]=l,o[21]=MTKsourceTitle,o[22]=MTKsourceId,o[20]=r']]);
 const protect='globalThis.__MTKsidebarArchiveProtected?.';
 add(o.group,[['selectedThreadKeys:g,threadKey:b}){if(g.length<2)return t;',`selectedThreadKeys:g,threadKey:b}){if(g.some(e=>${protect}(e)===!0))t=t.filter(e=>e.id!=="archive-thread"&&e.id!=="archive-task");if(g.length<2)return t;`]]);
 add(o.local,[['tE?[{id:"archive-task"',`tE&&!MTKsidebarArchiveProtected(r)?[{id:"archive-task"`],['archive:null!=t&&(np||tG)?()=>ng(!1):t,getMenuItems:', 'archive:MTKsidebarArchiveProtected(r)?null:null!=t&&(np||tG)?()=>ng(!1):t,getMenuItems:']]);
 add(o.localMenu,[[',{id:"archive-task",message:v.tD.archiveThread,onSelect:ea}',',...MTKsidebarArchiveProtected(J)?[]:[{id:"archive-task",message:v.tD.archiveThread,onSelect:ea}]']]);
 add(o.remoteActions,[['{archive:t,getMenuItems:tt?p:void 0,','{archive:MTKsidebarArchiveProtected(tp??ev.key)?null:t,getMenuItems:tt&&!MTKsidebarArchiveProtected(tp??ev.key)?p:void 0,']]);
 for(const[index,target]of o.menus.entries()){
  const before=['let eP=eO?(0,D.b)(e,eA,ej):{id:"archive-thread",onSelect:b}', 'let e_=eD?(0,R.b)(e,ek,eS):{id:"archive-thread",onSelect:v}'][index];
  const id=index===1?'ek':'eA';add(target,[[before,before.replace('=',`=${protect}(${id})===!0?null:`)]]);
 }
 // Policy reload invalidates the stock compiler memo cache at each sidebar action owner.
 for(const[key,fn,cache,size]of[['local','e_','tp',247],['remoteActions','en','ef',150],['localMenu','x','F',81]]){
  const entry=entries.find(e=>e.owner===o[key]);const tail=['local','localMenu'].includes(key)?';':',',before=`${cache}=(0,${key==='remoteActions'?'a':'o'}.c)(${size})${tail}`;
  entry.pairs.push([`function ${fn}(e){`,`function ${fn}(e){const MTKarchiveEpoch=MTKuseSidebarArchivePolicy();`],[before,`${cache}=(0,${key==='remoteActions'?'a':'o'}.c)(${size+1})${tail}${['local','localMenu'].includes(key)?'const ':''}MTKarchiveCache=${cache}[${size}]!==MTKarchiveEpoch&&(${cache}.fill(Symbol.for("react.memo_cache_sentinel")),${cache}[${size}]=MTKarchiveEpoch)${tail}`],[null,';const MTKarchiveReact='+'n'+'("zd8w"),MTKsidebarArchiveProtected=e=>globalThis.__MTKsidebarArchiveProtected?.(e)===!0;function MTKuseSidebarArchivePolicy(){return MTKarchiveReact.useSyncExternalStore(globalThis.__MTKsidebarArchiveSubscribe,globalThis.__MTKsidebarArchiveSnapshot,globalThis.__MTKsidebarArchiveSnapshot)}']);
 }
 if(command==='check'&&!entries[0].source.includes('MTKuseAgentRoster();')){
  const app=entries[0].source,delegation=readRendererModule(o.delegation);
  for(const fragment of ['function mV(){let e,t,n,a,i=(0,c.c)(11),','u=n("zd8w")'])if(count(app,fragment)!==1)throw Error('Unknown pristine palette bootstrap');
  for(const fragment of ['function tt(e){let t,n,s,l,r=(0,i.c)(13),','function ee(e){let t,n,s,l,r,o=(0,i.c)(21),','compactActions:x,onLabelClick:v}=e,y='])if(count(delegation,fragment)!==1)throw Error('Unknown pristine delegated palette owner');
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
 source=source.replace("function mV(){MTKuseAttentionBootstrap28661();","function mV(){");
 if(!source.includes('messageNode:MTKmessageNode}=e,y='))return source;
 return source.replace("o=(0,i.c)(25),{label:c,alignment:d","o=(0,i.c)(23),{label:c,alignment:d").replace('paletteSourceTitle:MTKsourceTitle,paletteSourceId:MTKsourceId,messageNode:MTKmessageNode}=e,y=','paletteSourceTitle:MTKsourceTitle,paletteSourceId:MTKsourceId}=e,y=');
}

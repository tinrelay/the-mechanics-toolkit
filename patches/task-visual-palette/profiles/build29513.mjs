import path from 'node:path';import{readRendererModule,writeRendererModule}from '../../../src/renderer-module.mjs';import{rosterOwner29513}from '../../agent-roster/profiles/build29513.mjs';import{attributionOwner29513}from '../../cross-task-attribution/profiles/build29513.mjs';
const owner=(root,file,id,parameters=['e','t','n'])=>({file:path.join(root,'webview/assets/async',file),id,parameters});
export const paletteOwners29513=root=>({app:rosterOwner29513(root),room:owner(root,'933709.f71ee84c90.js','sI7L',['e','t','l']),fade:owner(root,'184275.20e43740ee.js','KkZX'),footer:owner(root,'632620.48ff231b29.js','Gjet',['e','t','r']),delegation:attributionOwner29513(root),group:owner(root,'364303.ba663c573e.js','eQ5p',['e','t','n']),local:owner(root,'364303.ba663c573e.js','oprL',['e','t','n']),localMenu:owner(root,'364303.ba663c573e.js','JbIn',['e','t','n']),remoteActions:owner(root,'175259.3a81dd9db4.js','qK2L'),menus:['145109.1a6a21379d.js'].map((f,i)=>owner(root,f,'eP5h',['e','t','n']))});
export function runBuild29513({root,command,buildPaletteHelper}){
 const decoder=readRendererModule(owner(root,'364313.d749d31da5.js','d6Ff'));if(count(decoder,"Pc:l,Wz:s,z3:a")!==1)throw Error('Unknown sidebar key decoder export');
 const o=paletteOwners29513(root);let helper=buildPaletteHelper({name:'build-29513',agentRoster:true,helperReplacements:[['QSl.useEffect','u.useEffect']]});
 helper=helper.replace('t.getAttribute("data-app-action-sidebar-thread-id")', 'MTKpaletteNativeTaskId(t.getAttribute("data-app-action-sidebar-thread-id"))').replace('function MTKusePaletteBootstrap(', 'function MTKpaletteNativeTaskId(e){let t=MTKpaletteKeyDecode(e);return t?.kind==="local"?t.threadId:t?.kind==="remote"?t.taskId:e}function MTKusePaletteBootstrap(');
 const entries=[],add=(target,pairs)=>entries.push({owner:target,pairs,source:readRendererModule(target)});
 add(o.app,[["function fg(){MTKuseAgentRoster();","function fg(){MTKuseAgentRoster();MTKusePaletteBootstrap();"],[null,';const MTKpaletteKeyDecode=n("d6Ff").Pc;'+helper]]);
 add(o.room,[['k=(0,r.c)(99),','k=(0,r.c)(101),'],["||k[94]!==A?(T=(0,n.jsxs)(\"div\",{ref:eW,className:\"relative h-full min-h-0\",","||k[94]!==A||k[99]!==R||k[100]!==M?(T=(0,n.jsxs)(\"div\",{ref:eW,\"data-mtk-palette-room-host\":!0,\"data-mtk-palette-thread-id\":R??M,className:\"relative h-full min-h-0\","],['k[94]=A,k[95]=T','k[94]=A,k[99]=R,k[100]=M,k[95]=T']]);
 add(o.fade,[['(0,o.jsx)("div",{"aria-hidden":!0,className:t})','(0,o.jsx)("div",{"aria-hidden":!0,"data-mtk-palette-bottom-fade":!0,className:t})']]);
 // The current composer paints its backdrop on footer pseudo-elements, independently of KkZX.
 add(o.footer,[['(0,l.jsx)("div",{className:(0,o.A)("footer-A8ZvKV",','(0,l.jsx)("div",{"data-mtk-palette-bottom-fade":!0,className:(0,o.A)("footer-A8ZvKV",']]);
 add(o.delegation,[['function eX(e){let t,n,l,s,r=(0,i.c)(14),','function eX(e){let t,n,l,s,r=(0,i.c)(16),'],['r[13]!==n?(s=(0,a.jsx)(Y,','r[13]!==n||r[14]!==MTKtitle||r[15]!==c?(s=(0,a.jsx)(Y,'],['alignment:`end`,accentColor:MTKdelegatedAccentColor','alignment:`end`,accentColor:MTKdelegatedAccentColor,paletteSourceTitle:MTKtitle,paletteSourceId:c'],['r[13]=n,r[12]=s','r[13]=n,r[14]=MTKtitle,r[15]=c,r[12]=s'],['o=(0,i.c)(21),{label:c,alignment:d','o=(0,i.c)(23),{label:c,alignment:d'],['onLabelClick:v}=e,y=','onLabelClick:v,paletteSourceTitle:MTKsourceTitle,paletteSourceId:MTKsourceId}=e,y='],['o[19]!==s?(r=(0,a.jsxs)("div",{className:n,children:[l,s]}),','o[19]!==s||o[21]!==MTKsourceTitle||o[22]!==MTKsourceId?(r=(0,a.jsxs)("div",{"data-mtk-palette-source-title":MTKsourceTitle??void 0,"data-mtk-palette-source-id":MTKsourceId??void 0,className:n,children:[l,s]}),'],['o[19]=s,o[20]=r','o[19]=s,o[21]=MTKsourceTitle,o[22]=MTKsourceId,o[20]=r']]);
 const protect='globalThis.__MTKsidebarArchiveProtected?.';
 add(o.group,[["selectedThreadKeys:p,threadKey:I}){if(p.length<2)return t;",`selectedThreadKeys:p,threadKey:I}){if(p.some(e=>${protect}(e)===!0))t=t.filter(e=>e.id!=="archive-thread"&&e.id!=="archive-task");if(p.length<2)return t;`]]);
 add(o.local,[["tz?[{id:\"archive-task\"",`tz&&!MTKsidebarArchiveProtected(o)?[{id:"archive-task"`],["archive:null!=t&&(nk||t5)?()=>nM(!1):t,getMenuItems:", "archive:MTKsidebarArchiveProtected(o)?null:null!=t&&(nk||t5)?()=>nM(!1):t,getMenuItems:"]]);
 add(o.localMenu,[[",{id:\"archive-task\",message:g.tD.archiveThread,onSelect:ea}",",...MTKsidebarArchiveProtected(J)?[]:[{id:\"archive-task\",message:g.tD.archiveThread,onSelect:ea}]"]]);
 add(o.remoteActions,[['{archive:t,nativeTooltipPopover:n,getMenuItems:tt?p:void 0,','{archive:MTKsidebarArchiveProtected(tp??eg.key)?null:t,nativeTooltipPopover:n,getMenuItems:tt&&!MTKsidebarArchiveProtected(tp??eg.key)?p:void 0,']]);
 for(const[index,target]of o.menus.entries()){
  const before=['let ez=eO?(0,_.bo)(e,eM,ex,{hidePrimaryPersonalDot:"header"===q}):{id:"archive-thread",onSelect:H}', 'let e_=eD?(0,R.b)(e,ek,eS):{id:"archive-thread",onSelect:v}'][index];
  const id='eM';add(target,[[before,before.replace('=',`=${protect}(${id})===!0?null:`)]]);
 }
 // Policy reload invalidates the stock compiler memo cache at each sidebar action owner.
 for(const[key,fn,cache,size]of[['local','eq','tb',254],['remoteActions','Z','ep',151],['localMenu','x','W',81]]){
  const entry=entries.find(e=>e.owner===o[key]);const tail=['local','localMenu'].includes(key)?';':',',before=`${cache}=(0,${key==='remoteActions'?'i':'r'}.c)(${size})${tail}`;
  entry.pairs.push([`function ${fn}(e){`,`function ${fn}(e){const MTKarchiveEpoch=MTKuseSidebarArchivePolicy();`],[before,`${cache}=(0,${key==='remoteActions'?'i':'r'}.c)(${size+1})${tail}${['local','localMenu'].includes(key)?'const ':''}MTKarchiveCache=${cache}[${size}]!==MTKarchiveEpoch&&(${cache}.fill(Symbol.for("react.memo_cache_sentinel")),${cache}[${size}]=MTKarchiveEpoch)${tail}`],[null,';const MTKarchiveReact='+'n'+'("zd8w"),MTKsidebarArchiveProtected=e=>globalThis.__MTKsidebarArchiveProtected?.(e)===!0;function MTKuseSidebarArchivePolicy(){return MTKarchiveReact.useSyncExternalStore(globalThis.__MTKsidebarArchiveSubscribe,globalThis.__MTKsidebarArchiveSnapshot,globalThis.__MTKsidebarArchiveSnapshot)}']);
 }
 if(command==='check'&&!entries[0].source.includes('MTKuseAgentRoster();')){
  const app=entries[0].source,delegation=readRendererModule(o.delegation);
  for(const fragment of ['function fg(){let e,t,n,a,r=(0,c.c)(11),','u=n("zd8w")'])if(count(app,fragment)!==1)throw Error('Unknown pristine palette bootstrap');
  for(const fragment of ['function eX(e){let t,n,l,s,r=(0,i.c)(13),','function Y(e){let t,n,l,s,r,o=(0,i.c)(21),','compactActions:x,onLabelClick:v}=e,y='])if(count(delegation,fragment)!==1)throw Error('Unknown pristine delegated palette owner');
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
 source=source.replace("function fg(){MTKuseAttentionBootstrap29513();","function fg(){");
 if(!source.includes('messageNode:MTKmessageNode}=e,y='))return source;
 return source.replace("o=(0,i.c)(25),{label:c,alignment:d","o=(0,i.c)(23),{label:c,alignment:d").replace('paletteSourceTitle:MTKsourceTitle,paletteSourceId:MTKsourceId,messageNode:MTKmessageNode}=e,y=','paletteSourceTitle:MTKsourceTitle,paletteSourceId:MTKsourceId}=e,y=');
}

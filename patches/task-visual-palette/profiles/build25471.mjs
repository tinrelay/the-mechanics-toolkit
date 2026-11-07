import path from 'node:path';import{readRendererModule,writeRendererModule}from '../../../src/renderer-module.mjs';import{rosterOwner25471}from '../../agent-roster/profiles/build25471.mjs';import{attributionOwner25471}from '../../cross-task-attribution/profiles/build25471.mjs';
const owner=(root,file,id,parameters=['e','t','n'])=>({file:path.join(root,'webview/assets/async',file),id,parameters});
export const paletteOwners25471=root=>({app:rosterOwner25471(root),room:owner(root,'596785.beac9065c9.js','xzfb'),fade:owner(root,'182735.bb2cb0d2af.js','KkZX'),delegation:attributionOwner25471(root),group:owner(root,'86296.6305cfdd6d.js','eQ5p',['e','t','a']),local:owner(root,'86296.6305cfdd6d.js','oprL',['e','t','a']),remote:owner(root,'86296.6305cfdd6d.js','ypQm',['e','t','a']),localMenu:owner(root,'86296.6305cfdd6d.js','JbIn',['e','t','a']),remoteActions:owner(root,'927552.2a3666383e.js','qK2L'),menus:['8916.ffeb3129a1.js','99588.01cccd6b1f.js'].map(f=>owner(root,f,'GgrI'))});
export function runBuild25471({root,command,buildPaletteHelper}){
 const o=paletteOwners25471(root);let helper=buildPaletteHelper({name:'build-25471',agentRoster:true,helperReplacements:[['QSl.useEffect','u.useEffect']]});
 helper=helper.replace('t.getAttribute("data-app-action-sidebar-thread-id")', 'MTKpaletteNativeTaskId(t.getAttribute("data-app-action-sidebar-thread-id"))').replace('function MTKusePaletteBootstrap(', 'function MTKpaletteNativeTaskId(e){let t=MTKpaletteKeyDecode(e);return t?.kind==="local"?t.threadId:t?.kind==="remote"?t.taskId:e}function MTKusePaletteBootstrap(');
 const entries=[],add=(target,pairs)=>entries.push({owner:target,pairs,source:readRendererModule(target)});
 add(o.app,[["function mq(){MTKuseAgentRoster();","function mq(){MTKuseAgentRoster();MTKusePaletteBootstrap();"],[null,';const MTKpaletteKeyDecode=n("d6Ff").Pc;'+helper]]);
 add(o.room,[['M=(0,r.c)(100),','M=(0,r.c)(102),'],['||M[95]!==S?(U=(0,a.jsxs)("div",{ref:eW,className:"relative h-full min-h-0",','||M[95]!==S||M[100]!==P||M[101]!==T?(U=(0,a.jsxs)("div",{ref:eW,"data-mtk-palette-room-host":!0,"data-mtk-palette-thread-id":P??T,className:"relative h-full min-h-0",'],['M[95]=S,M[96]=U','M[95]=S,M[100]=P,M[101]=T,M[96]=U']]);
 add(o.fade,[['(0,r.jsx)("div",{"aria-hidden":!0,className:t})','(0,r.jsx)("div",{"aria-hidden":!0,"data-mtk-palette-bottom-fade":!0,className:t})']]);
 add(o.delegation,[['function e5(e){let t,n,i,l,o=(0,s.c)(14),','function e5(e){let t,n,i,l,o=(0,s.c)(16),'],['o[13]!==n?(l=(0,a.jsx)(J,','o[13]!==n||o[14]!==MTKtitle||o[15]!==c?(l=(0,a.jsx)(J,'],['alignment:`end`,accentColor:MTKdelegatedAccentColor','alignment:`end`,accentColor:MTKdelegatedAccentColor,paletteSourceTitle:MTKtitle,paletteSourceId:c'],['o[13]=n,o[12]=l','o[13]=n,o[14]=MTKtitle,o[15]=c,o[12]=l'],['r=(0,s.c)(21),{label:c,alignment:d','r=(0,s.c)(23),{label:c,alignment:d'],['onLabelClick:v}=e,y=','onLabelClick:v,paletteSourceTitle:MTKsourceTitle,paletteSourceId:MTKsourceId}=e,y='],['r[19]!==l?(o=(0,a.jsxs)("div",{className:n,children:[i,l]}),','r[19]!==l||r[21]!==MTKsourceTitle||r[22]!==MTKsourceId?(o=(0,a.jsxs)("div",{"data-mtk-palette-source-title":MTKsourceTitle??void 0,"data-mtk-palette-source-id":MTKsourceId??void 0,className:n,children:[i,l]}),'],['r[19]=l,r[20]=o','r[19]=l,r[21]=MTKsourceTitle,r[22]=MTKsourceId,r[20]=o']]);
 const protect='globalThis.__MTKsidebarArchiveProtected?.';
 add(o.group,[['selectedThreadKeys:l,threadKey:v}){if(l.length<2)return t;',`selectedThreadKeys:l,threadKey:v}){if(l.some(e=>${protect}(e)===!0))t=t.filter(e=>e.id!=="archive-thread"&&e.id!=="archive-task");if(l.length<2)return t;`]]);
 add(o.local,[['tT?[{id:"archive-task"',`tT&&!MTKsidebarArchiveProtected(eG)?[{id:"archive-task"`],['archive:null!=t&&(au||tO)?()=>am(!1):t,getMenuItems:', 'archive:MTKsidebarArchiveProtected(eG)?null:null!=t&&(au||tO)?()=>am(!1):t,getMenuItems:']]);
 add(o.localMenu,[[',{id:"archive-task",message:v.tD.archiveThread,onSelect:er}',',...MTKsidebarArchiveProtected(J)?[]:[{id:"archive-task",message:v.tD.archiveThread,onSelect:er}]']]);
 add(o.remote,[['if(tl&&e.push({id:"archive-task"','if(tl&&!MTKsidebarArchiveProtected(t)&&e.push({id:"archive-task"'],['J=eC??(ty?e=>','J=eC??(ty&&!MTKsidebarArchiveProtected(t)?e=>']]);
 add(o.remoteActions,[['{archive:t,getMenuItems:ty?p:void 0,','{archive:MTKsidebarArchiveProtected(e.task.id)?null:t,getMenuItems:ty&&!MTKsidebarArchiveProtected(e.task.id)?p:void 0,'],['{archive:n,getMenuItems:ty?e=>','{archive:MTKsidebarArchiveProtected(e.task.id)?null:n,getMenuItems:ty&&!MTKsidebarArchiveProtected(e.task.id)?e=>']]);
 for(const[index,target]of o.menus.entries()){
  const before=['let eO=eE?(0,_.b)(e,ey,ek):{id:"archive-thread",onSelect:b}', 'let ej=ek?(0,D.b)(e,eI,eS):{id:"archive-thread",onSelect:_}'][index];
  const id=index===1?'eI':'ey';add(target,[[before,before.replace('=',`=${protect}(${id})===!0?null:`)]]);
 }
 // Policy reload invalidates the stock compiler memo cache at each sidebar action owner.
 for(const[key,fn,cache,size]of[['local','eU','ez',199],['remote','_','et',124],['remoteActions','es','eA',200],['localMenu','k','K',85]]){
  const entry=entries.find(e=>e.owner===o[key]);const tail=key==='localMenu'?';':',',before=`${cache}=(0,${key==='remoteActions'?'a':'o'}.c)(${size})${tail}`;
  entry.pairs.push([`function ${fn}(e){`,`function ${fn}(e){const MTKarchiveEpoch=MTKuseSidebarArchivePolicy();`],[before,`${cache}=(0,${key==='remoteActions'?'a':'o'}.c)(${size+1})${tail}${key==='localMenu'?'const ':''}MTKarchiveCache=${cache}[${size}]!==MTKarchiveEpoch&&(${cache}.fill(Symbol.for("react.memo_cache_sentinel")),${cache}[${size}]=MTKarchiveEpoch)${tail}`],[null,';const MTKarchiveReact='+(['local','remote','localMenu'].includes(key)?'a':'n')+'("zd8w"),MTKsidebarArchiveProtected=e=>globalThis.__MTKsidebarArchiveProtected?.(e)===!0;function MTKuseSidebarArchivePolicy(){return MTKarchiveReact.useSyncExternalStore(globalThis.__MTKsidebarArchiveSubscribe,globalThis.__MTKsidebarArchiveSnapshot,globalThis.__MTKsidebarArchiveSnapshot)}']);
 }
 if(command==='check'&&!entries[0].source.includes('MTKuseAgentRoster();')){
  const app=entries[0].source,delegation=readRendererModule(o.delegation);
  for(const fragment of ['function mq(){let e,t,n,a,i=(0,c.c)(12),','u=n("zd8w")'])if(count(app,fragment)!==1)throw Error('Unknown pristine palette bootstrap');
  for(const fragment of ['function e5(e){let t,n,i,l,o=(0,s.c)(13),','function J(e){let t,n,i,l,o,r=(0,s.c)(21),','compactActions:x,onLabelClick:v}=e,y='])if(count(delegation,fragment)!==1)throw Error('Unknown pristine delegated palette owner');
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
 source=source.replace("function mq(){MTKuseAttentionBootstrap25471();","function mq(){");
 if(!source.includes('messageNode:MTKmessageNode}=e,y='))return source;
 return source.replace("r=(0,s.c)(25),{label:c,alignment:d","r=(0,s.c)(23),{label:c,alignment:d").replace('paletteSourceTitle:MTKsourceTitle,paletteSourceId:MTKsourceId,messageNode:MTKmessageNode}=e,y=','paletteSourceTitle:MTKsourceTitle,paletteSourceId:MTKsourceId}=e,y=');
}

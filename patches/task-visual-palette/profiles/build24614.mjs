import path from 'node:path';import{readRendererModule,writeRendererModule}from '../../../src/renderer-module.mjs';import{rosterOwner24614}from '../../agent-roster/profiles/build24614.mjs';import{attributionOwner24614}from '../../cross-task-attribution/profiles/build24614.mjs';
const owner=(root,file,id)=>({file:path.join(root,'webview/assets/async',file),id,parameters:['e','t','n']});
export const paletteOwners24614=root=>({app:rosterOwner24614(root),room:owner(root,'953502.b1de81879b.js','slr1'),fade:owner(root,'24191.589dcc9878.js','KkZX'),delegation:attributionOwner24614(root),group:owner(root,'86296.cc31aba811.js','eQ5p'),local:owner(root,'86296.cc31aba811.js','uMkb'),remote:owner(root,'86296.cc31aba811.js','ypQm'),remoteActions:owner(root,'968918.7aa8e43105.js','qK2L'),menus:['410335.1b8ebdd9cf.js','843073.4bf64d9a98.js','86296.cc31aba811.js'].map(f=>owner(root,f,'H5Lf'))});
export function runBuild24614({root,command,buildPaletteHelper}){
 const o=paletteOwners24614(root);let helper=buildPaletteHelper({name:'build-24614',agentRoster:true,helperReplacements:[['QSl.useEffect','u.useEffect']]});
 helper=helper.replace('t.getAttribute("data-app-action-sidebar-thread-id")', 'MTKpaletteNativeTaskId(t.getAttribute("data-app-action-sidebar-thread-id"))').replace('function MTKusePaletteBootstrap(', 'function MTKpaletteNativeTaskId(e){let t=MTKpaletteKeyDecode(e);return t?.kind==="local"?t.threadId:t?.kind==="remote"?t.taskId:e}function MTKusePaletteBootstrap(');
 const entries=[],add=(target,pairs)=>entries.push({owner:target,pairs,source:readRendererModule(target)});
 add(o.app,[['function mD(){MTKuseAgentRoster();','function mD(){MTKuseAgentRoster();MTKusePaletteBootstrap();'],[null,';const MTKpaletteKeyDecode=n("d6Ff").Pc;'+helper]]);
 add(o.room,[['U=(0,r.c)(95),','U=(0,r.c)(97),'],['||U[90]!==p?(k=(0,a.jsxs)("div",{ref:eS,className:"relative h-full min-h-0",','||U[90]!==p||U[95]!==M||U[96]!==A?(k=(0,a.jsxs)("div",{ref:eS,"data-mtk-palette-room-host":!0,"data-mtk-palette-thread-id":M??A,className:"relative h-full min-h-0",'],['U[90]=p,U[91]=k','U[90]=p,U[95]=M,U[96]=A,U[91]=k']]);
 add(o.fade,[['(0,r.jsx)("div",{"aria-hidden":!0,className:t})','(0,r.jsx)("div",{"aria-hidden":!0,"data-mtk-palette-bottom-fade":!0,className:t})']]);
 add(o.delegation,[['function eX(e){let t,n,i,o,l=(0,a.c)(14),','function eX(e){let t,n,i,o,l=(0,a.c)(16),'],['l[13]!==n?(o=(0,s.jsx)(Z,','l[13]!==n||l[14]!==MTKtitle||l[15]!==c?(o=(0,s.jsx)(Z,'],['alignment:`end`,accentColor:MTKdelegatedAccentColor','alignment:`end`,accentColor:MTKdelegatedAccentColor,paletteSourceTitle:MTKtitle,paletteSourceId:c'],['l[13]=n,l[12]=o','l[13]=n,l[14]=MTKtitle,l[15]=c,l[12]=o'],['r=(0,a.c)(21),{label:c,alignment:d','r=(0,a.c)(23),{label:c,alignment:d'],['onLabelClick:v}=e,y=','onLabelClick:v,paletteSourceTitle:MTKsourceTitle,paletteSourceId:MTKsourceId}=e,y='],['r[19]!==o?(l=(0,s.jsxs)("div",{className:n,children:[i,o]}),','r[19]!==o||r[21]!==MTKsourceTitle||r[22]!==MTKsourceId?(l=(0,s.jsxs)("div",{"data-mtk-palette-source-title":MTKsourceTitle??void 0,"data-mtk-palette-source-id":MTKsourceId??void 0,className:n,children:[i,o]}),'],['r[19]=o,r[20]=l','r[19]=o,r[21]=MTKsourceTitle,r[22]=MTKsourceId,r[20]=l']]);
 const protect='globalThis.__MTKsidebarArchiveProtected?.';
 add(o.group,[['selectedThreadKeys:s,threadKey:f}){if(s.length<2)return t;',`selectedThreadKeys:s,threadKey:f}){if(s.some(e=>${protect}(e)===!0))t=t.filter(e=>e.id!=="archive-thread"&&e.id!=="archive-task");if(s.length<2)return t;`]]);
 add(o.local,[['tS?[{id:"archive-task"',`tS&&!MTKsidebarArchiveProtected(eV)?[{id:"archive-task"`],['archive:null!=t&&(nu||tF)?nf:t,getMenuItems:', 'archive:MTKsidebarArchiveProtected(eV)?null:null!=t&&(nu||tF)?nf:t,getMenuItems:']]);
 add(o.remote,[['if(ts&&e.push({id:"archive-task"','if(ts&&!MTKsidebarArchiveProtected(t)&&e.push({id:"archive-task"'],['Y=ey??(tw?e=>','Y=ey??(tw&&!MTKsidebarArchiveProtected(t)?e=>']]);
 add(o.remoteActions,[['{archive:t,getMenuItems:ty?p:void 0,','{archive:MTKsidebarArchiveProtected(e.task.id)?null:t,getMenuItems:ty&&!MTKsidebarArchiveProtected(e.task.id)?p:void 0,'],['{archive:n,getMenuItems:ty?e=>','{archive:MTKsidebarArchiveProtected(e.task.id)?null:n,getMenuItems:ty&&!MTKsidebarArchiveProtected(e.task.id)?e=>']]);
 for(const[index,target]of o.menus.entries()){
  const before=['let eE=eT?(0,R.b)(e,eC,ex):{id:"archive-thread",onSelect:y}', 'let e_=eE?(0,T.b)(e,ew,ej):{id:"archive-thread",onSelect:b}', 'let eL=eP?(0,R.b)(e,eC,ex):{id:"archive-thread",onSelect:b}'][index];
  const id=index===1?'ew':'eC';add(target,[[before,before.replace('=',`=${protect}(${id})===!0?null:`)]]);
 }
 // Policy reload invalidates the stock compiler memo cache at each sidebar action owner.
 for(const[key,fn,cache,size]of[['local','eU','ez',197],['remote','P','et',124],['remoteActions','es','eA',198]]){
  const entry=entries.find(e=>e.owner===o[key]);const before=`${cache}=(0,${key==='remoteActions'?'a':'o'}.c)(${size}),`;
  entry.pairs.push([`function ${fn}(e){`,`function ${fn}(e){const MTKarchiveEpoch=MTKuseSidebarArchivePolicy();`],[before,`${cache}=(0,${key==='remoteActions'?'a':'o'}.c)(${size+1}),MTKarchiveCache=${cache}[${size}]!==MTKarchiveEpoch&&(${cache}.fill(Symbol.for("react.memo_cache_sentinel")),${cache}[${size}]=MTKarchiveEpoch),`],[null,';const MTKarchiveReact=n("zd8w"),MTKsidebarArchiveProtected=e=>globalThis.__MTKsidebarArchiveProtected?.(e)===!0;function MTKuseSidebarArchivePolicy(){return MTKarchiveReact.useSyncExternalStore(globalThis.__MTKsidebarArchiveSubscribe,globalThis.__MTKsidebarArchiveSnapshot,globalThis.__MTKsidebarArchiveSnapshot)}']);
 }
 if(command==='check'&&!entries[0].source.includes('MTKuseAgentRoster();')){
  const app=entries[0].source,delegation=readRendererModule(o.delegation);
  for(const fragment of ['function mD(){let e,t,n,a,i=(0,c.c)(12),','u=n("zd8w")'])if(count(app,fragment)!==1)throw Error('Unknown pristine palette bootstrap');
  for(const fragment of ['function eX(e){let t,n,i,o,l=(0,a.c)(13),','function Z(e){let t,n,i,o,l,r=(0,a.c)(21),','compactActions:x,onLabelClick:v}=e,y='])if(count(delegation,fragment)!==1)throw Error('Unknown pristine delegated palette owner');
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
 source=source.replace("function mD(){MTKuseAttentionBootstrap24614();","function mD(){");
 if(!source.includes('messageNode:MTKmessageNode}=e,y='))return source;
 return source.replace('r=(0,a.c)(25),{label:c,alignment:d','r=(0,a.c)(23),{label:c,alignment:d').replace('paletteSourceTitle:MTKsourceTitle,paletteSourceId:MTKsourceId,messageNode:MTKmessageNode}=e,y=','paletteSourceTitle:MTKsourceTitle,paletteSourceId:MTKsourceId}=e,y=');
}

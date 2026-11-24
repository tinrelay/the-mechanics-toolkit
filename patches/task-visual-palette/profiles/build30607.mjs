import path from 'node:path';import{readRendererModule,writeRendererModule}from '../../../src/renderer-module.mjs';import{rosterOwner30607}from '../../agent-roster/profiles/build30607.mjs';import{attributionOwner30607}from '../../cross-task-attribution/profiles/build30607.mjs';
const owner=(root,file,id,parameters=['e','t','n'])=>({file:path.join(root,'webview/assets/async',file),id,parameters});
export const paletteOwners30607=root=>({app:rosterOwner30607(root),room:owner(root,'808229.99ba78abf5.js','sI7L',['e','t','l']),fade:owner(root,'594142.dda4eb2e6f.js','KkZX'),footer:owner(root,'632620.3703d3cbed.js','Gjet',['e','t','r']),delegation:attributionOwner30607(root),group:owner(root,'364303.2eba5f3e06.js','eQ5p',['e','t','n']),local:owner(root,'364303.2eba5f3e06.js','oprL',['e','t','n']),localMenu:owner(root,'364303.2eba5f3e06.js','JbIn',['e','t','n']),remoteActions:owner(root,'175259.32b1343fc9.js','qK2L'),menus:['948973.ab8f9e03bc.js'].map((f,i)=>owner(root,f,'eP5h',['e','t','n']))});
export function runBuild30607({root,command,buildPaletteHelper}){
 const decoder=readRendererModule(owner(root,'366996.9782070574.js','d6Ff'));if(count(decoder,"Pc:l,Wz:s,z3:a")!==1)throw Error('Unknown sidebar key decoder export');
 const o=paletteOwners30607(root);let helper=buildPaletteHelper({name:'build-30607',agentRoster:true,helperReplacements:[['QSl.useEffect','h.useEffect']]});
 helper=helper.replace('t.getAttribute("data-app-action-sidebar-thread-id")', 'MTKpaletteNativeTaskId(t.getAttribute("data-app-action-sidebar-thread-id"))').replace('function MTKusePaletteBootstrap(', 'function MTKpaletteNativeTaskId(e){let t=MTKpaletteKeyDecode(e);return t?.kind==="local"?t.threadId:t?.kind==="remote"?t.taskId:e}function MTKusePaletteBootstrap(');
 const entries=[],add=(target,pairs)=>entries.push({owner:target,pairs,source:readRendererModule(target)});
 add(o.app,[["function mA(){MTKuseAgentRoster();","function mA(){MTKuseAgentRoster();MTKusePaletteBootstrap();"],[null,';const MTKpaletteKeyDecode=n("d6Ff").Pc;'+helper]]);
 add(o.room,[['k=(0,a.c)(99),','k=(0,a.c)(101),'],["||k[94]!==A?(P=(0,n.jsxs)(\"div\",{ref:e$,className:\"relative h-full min-h-0\",","||k[94]!==A||k[99]!==R||k[100]!==M?(P=(0,n.jsxs)(\"div\",{ref:e$,\"data-mtk-palette-room-host\":!0,\"data-mtk-palette-thread-id\":R??M,className:\"relative h-full min-h-0\","],['k[94]=A,k[95]=P','k[94]=A,k[99]=R,k[100]=M,k[95]=P']]);
 add(o.fade,[['(0,a.jsx)("div",{"aria-hidden":!0,className:t})','(0,a.jsx)("div",{"aria-hidden":!0,"data-mtk-palette-bottom-fade":!0,className:t})']]);
 // The current composer paints its backdrop on footer pseudo-elements, independently of KkZX.
 add(o.footer,[['(0,l.jsx)("div",{className:(0,o.A)("footer-A8ZvKV",','(0,l.jsx)("div",{"data-mtk-palette-bottom-fade":!0,className:(0,o.A)("footer-A8ZvKV",']]);
 add(o.delegation,[['function eX(e){let t,n,l,s,r=(0,i.c)(14),','function eX(e){let t,n,l,s,r=(0,i.c)(16),'],['r[13]!==n?(s=(0,a.jsx)(Y,','r[13]!==n||r[14]!==MTKtitle||r[15]!==c?(s=(0,a.jsx)(Y,'],['alignment:`end`,accentColor:MTKdelegatedAccentColor','alignment:`end`,accentColor:MTKdelegatedAccentColor,paletteSourceTitle:MTKtitle,paletteSourceId:c'],['r[13]=n,r[12]=s','r[13]=n,r[14]=MTKtitle,r[15]=c,r[12]=s'],['o=(0,i.c)(21),{label:c,alignment:d','o=(0,i.c)(23),{label:c,alignment:d'],['onLabelClick:v}=e,y=','onLabelClick:v,paletteSourceTitle:MTKsourceTitle,paletteSourceId:MTKsourceId}=e,y='],['o[19]!==s?(r=(0,a.jsxs)("div",{className:n,children:[l,s]}),','o[19]!==s||o[21]!==MTKsourceTitle||o[22]!==MTKsourceId?(r=(0,a.jsxs)("div",{"data-mtk-palette-source-title":MTKsourceTitle??void 0,"data-mtk-palette-source-id":MTKsourceId??void 0,className:n,children:[l,s]}),'],['o[19]=s,o[20]=r','o[19]=s,o[21]=MTKsourceTitle,o[22]=MTKsourceId,o[20]=r']]);
 const protect='globalThis.__MTKsidebarArchiveProtected?.';
 add(o.group,[["selectedThreadKeys:p,threadKey:I}){if(p.length<2)return t;",`selectedThreadKeys:p,threadKey:I}){if(p.some(e=>${protect}(e)===!0))t=t.filter(e=>e.id!=="archive-thread"&&e.id!=="archive-task"&&e.id!=="delete-thread");if(p.length<2)return t;`]]);
 add(o.local,[["tZ?[{id:\"archive-task\"",`tZ&&!MTKsidebarArchiveProtected(o)?[{id:"archive-task"`],["archive:null!=t&&(nM||t9)?()=>nR(!1):t,getMenuItems:", "archive:MTKsidebarArchiveProtected(o)?null:null!=t&&(nM||t9)?()=>nR(!1):t,getMenuItems:"]]);
 add(o.localMenu,[[",{id:\"archive-task\",menuShortcut:b.UT.archiveThread,message:g.tD.archiveThread,onSelect:er}",",...MTKsidebarArchiveProtected(Y)?[]:[{id:\"archive-task\",menuShortcut:b.UT.archiveThread,message:g.tD.archiveThread,onSelect:er}]"]]);
 add(o.remoteActions,[['{archive:t,nativeTooltipPopover:n,getMenuItems:ti?p:void 0,','{archive:MTKsidebarArchiveProtected(tf??ev.key)?null:t,nativeTooltipPopover:n,getMenuItems:ti&&!MTKsidebarArchiveProtected(tf??ev.key)?p:void 0,']]);
 for(const[index,target]of o.menus.entries()){
  const before='let ez=eO?(0,L.bo)(e,eM,ek):{id:"archive-thread",onSelect:H}';
  const id='eM',deleteBefore='("sidebar"===V||eA)&&e.get(x.x,{hostId:ek,threadId:eM})&&eK.push({id:"delete-thread"';
  add(target,[[before,before.replace('=',`=${protect}(${id})===!0?null:`)],[deleteBefore,deleteBefore.replace('&&e.get(',`&&${protect}(${id})!==!0&&e.get(`)]]);
 }
 // Policy reload invalidates the stock compiler memo cache at each sidebar action owner.
 for(const[key,fn,cache,size]of[['local','eq','tC',257],['remoteActions','en','ef',153],['localMenu','w','K',81]]){
  const entry=entries.find(e=>e.owner===o[key]);const tail=['local','localMenu'].includes(key)?';':',',before=`${cache}=(0,${key==='remoteActions'?'i':'r'}.c)(${size})${tail}`;
  entry.pairs.push([`function ${fn}(e){`,`function ${fn}(e){const MTKarchiveEpoch=MTKuseSidebarArchivePolicy();`],[before,`${cache}=(0,${key==='remoteActions'?'i':'r'}.c)(${size+1})${tail}${['local','localMenu'].includes(key)?'const ':''}MTKarchiveCache=${cache}[${size}]!==MTKarchiveEpoch&&(${cache}.fill(Symbol.for("react.memo_cache_sentinel")),${cache}[${size}]=MTKarchiveEpoch)${tail}`],[null,';const MTKarchiveReact='+'n'+'("zd8w"),MTKsidebarArchiveProtected=e=>globalThis.__MTKsidebarArchiveProtected?.(e)===!0;function MTKuseSidebarArchivePolicy(){return MTKarchiveReact.useSyncExternalStore(globalThis.__MTKsidebarArchiveSubscribe,globalThis.__MTKsidebarArchiveSnapshot,globalThis.__MTKsidebarArchiveSnapshot)}']);
 }
 if(command==='check'&&!entries[0].source.includes('MTKuseAgentRoster();')){
  const app=entries[0].source,delegation=readRendererModule(o.delegation);
  for(const fragment of ['function mA(){let e,t,n,a,r=(0,d.c)(11),','h=n("zd8w")'])if(count(app,fragment)!==1)throw Error('Unknown pristine palette bootstrap');
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
 source=source.replace("function mA(){MTKuseAttentionBootstrap30607();","function mA(){");
 if(!source.includes('messageNode:MTKmessageNode}=e,y='))return source;
 return source.replace("o=(0,i.c)(25),{label:c,alignment:d","o=(0,i.c)(23),{label:c,alignment:d").replace('paletteSourceTitle:MTKsourceTitle,paletteSourceId:MTKsourceId,messageNode:MTKmessageNode}=e,y=','paletteSourceTitle:MTKsourceTitle,paletteSourceId:MTKsourceId}=e,y=');
}

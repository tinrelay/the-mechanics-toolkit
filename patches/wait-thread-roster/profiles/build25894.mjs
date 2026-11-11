import path from 'node:path';
import {readRendererModule,writeRendererModule} from '../../../src/renderer-module.mjs';
export const waitOwners25894=root=>[
 {file:'411497.79254b62eb.js',parameters:['e','t','n']},
 {file:'899308.f1ada0bc90.js',parameters:['e','t','n']},
 {file:'306206.c4732aab1e.js',parameters:['e','t','a']}
].map(({file,parameters})=>({file:path.join(root,'webview/assets/async',file),id:'acby',parameters}));
export const waitProfiles25894=[
 {loader:'n',namespace:'s.PD',genericRender:'N',icon:'k',jsx:'a',container:'p.F',classNames:'(0,r.A)',spinner:'d.N',iconFunction:'k',summaryWrapper:'C.o',normalize:'(0,h.JXB)',hostBridge:'x.O1',routeFlag:'(0,A.OX)',newRoute:'(0,h.Cv$)',oldRoute:'(0,h._RT)',sendTool:'y.vN'},
 {loader:'n',namespace:'o.PD',genericRender:'_',icon:'j',jsx:'a',container:'p.F',classNames:'(0,r.A)',spinner:'d.N',iconFunction:'j',summaryWrapper:'b.o',normalize:'(0,v.JXB)',hostBridge:'w.O1',routeFlag:'(0,x.OX)',newRoute:'(0,v.Cv$)',oldRoute:'(0,v._RT)',sendTool:'y.vN'},
 {loader:'a',namespace:'r.PD',genericRender:'P',icon:'_',jsx:'n',container:'m.F',classNames:'(0,s.A)',spinner:'u.N',iconFunction:'_',summaryWrapper:'b.o',normalize:'(0,h.JXB)',hostBridge:'C.O1',routeFlag:'(0,w.OX)',newRoute:'(0,h.Cv$)',oldRoute:'(0,h._RT)',sendTool:'y.vN'}
];
export function runBuild25894({root,command,buildHelper}){
 const owners=waitOwners25894(root),targets=[];let states=[];
 for(let index=0;index<owners.length;index++){
  const owner=owners[index],p=waitProfiles25894[index];let source=readRendererModule(owner);
  const entry=`{namespace:${p.namespace},render:${p.genericRender},renderAgentActivityIcon:${p.icon},tool:${p.sendTool}}`;
  const receiptEntry=`{namespace:${p.namespace},persistentInCollapsedConversation:!0,render:MTKrenderOutboundMessage,renderAgentActivityIcon:${p.icon},standaloneInConversation:!0,tool:${p.sendTool}}`;
  const sendEntry=source.includes(entry)?entry:receiptEntry;
  const added=`{namespace:${p.namespace},render:MTKrenderWaitThreads,renderAgentActivityIcon:${p.icon},tool:"wait_threads"}`;
  for(const fragment of [`y=${p.loader}("MCYz")`,`${p.hostBridge.split('.')[0]}=${p.loader}("TL6G")`,`${p.summaryWrapper.split('.')[0]}=${p.loader}("BI7J")`])requireOne(source,fragment);
  const helperProfile={jsx:'MTKwaitJsx',container:'MTKwaitContainer',classNames:'MTKwaitClasses',spinner:'MTKwaitSpinner',iconFunction:'MTKwaitIcon',summaryWrapper:'MTKwaitSummary',normalize:'MTKwaitNormalize',hostBridge:'MTKwaitBus',routeFlag:'MTKwaitRouteFlag',newRoute:'MTKwaitNewRoute',oldRoute:'MTKwaitOldRoute'};
  let helper=buildHelper(helperProfile,true);
  const before='let r=MTKwaitStoreHook(MTKwaitStoreScope),i=MTKwaitTargets(e.arguments);if(i==null)return null;let a=i.map(e=>{let t=e.hostId==="local"?MTKwaitLocalThreadKey(e.threadId):MTKwaitRemoteThreadKey(e.threadId);return MTKwaitResolvedTarget(e,r.get(MTKwaitTaskAtom,t),r.get(MTKwaitTitleAtom,{hostId:e.hostId,threadId:e.threadId}))})';
  const after='let r=MTKwaitStoreHook(MTKwaitStoreScope),i=MTKwaitTargets(e.arguments);if(i==null)return null;let a=i.map(e=>{let t=r.get(MTKwaitThreadAtom,{hostId:e.hostId,threadId:e.threadId}),n=t==null?null:{kind:"local",summary:t.summary};return MTKwaitResolvedTarget(e,n,r.get(MTKwaitTitleAtom,{hostId:e.hostId,threadId:e.threadId}))})';
  requireOne(helper,before);helper=helper.replace(before,()=>after);
  const bindings=`const MTKwaitStoreHook=${p.loader}("zTeN").gh,MTKwaitStoreScope=${p.loader}("OWtl").u,MTKwaitTitleAtom=${p.loader}("tl5a").HX,MTKwaitThreadAtom=${p.loader}("tl5a").ok,MTKwaitJsx=${p.jsx},MTKwaitContainer=${p.container},MTKwaitClasses=${p.classNames},MTKwaitSpinner=${p.spinner},MTKwaitIcon=${p.iconFunction},MTKwaitSummary=${p.summaryWrapper},MTKwaitNormalize=${p.normalize},MTKwaitBus=${p.hostBridge},MTKwaitRouteFlag=${p.routeFlag},MTKwaitNewRoute=${p.newRoute},MTKwaitOldRoute=${p.oldRoute};`;
  const applied=source.includes(helper)&&source.includes(bindings)&&source.includes(added) && (source.includes(entry) || source.includes(`{namespace:${p.namespace},persistentInCollapsedConversation:!0,render:MTKrenderOutboundMessage,renderAgentActivityIcon:${p.icon},standaloneInConversation:!0,tool:${p.sendTool}}`));
  if(!applied){if(source.includes('MTKrenderWaitThreads'))throw Error('Partial wait module patch');requireOne(source,sendEntry);if(command==='apply'){source=source.replace(sendEntry,()=>added+','+sendEntry)+bindings+helper;writeRendererModule(owner,source);}}
  states.push(applied);targets.push(path.relative(root,owner.file));
 }
 if(states.some(Boolean)&&!states.every(Boolean))throw Error('Partial wait module variants');
 return{state:states.every(Boolean)||command==='apply'?'applied':'needs-apply',targets};
}
function requireOne(s,v){if(s.split(v).length!==2)throw Error('Upstream changed: wait module contract '+v)}

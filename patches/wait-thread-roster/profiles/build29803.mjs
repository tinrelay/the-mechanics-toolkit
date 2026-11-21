import path from 'node:path';
import {readRendererModule,writeRendererModule} from '../../../src/renderer-module.mjs';
export const waitOwners29803=root=>[{"file": "202588.8d9d3f9fe3.js", "parameters": ["e", "t", "a"]}, {"file": "205407.0c3eb42862.js", "parameters": ["e", "t", "n"]}, {"file": "306206.a3e28f9779.js", "parameters": ["e", "t", "a"]}, {"file": "523436.13a8e37dc4.js", "parameters": ["e", "t", "n"]}, {"file": "713407.8df9f6d0d8.js", "parameters": ["e", "t", "a"]}].map(({file,parameters})=>({file:path.join(root,'webview/assets/async',file),id:'acby',parameters}));
export const waitProfiles29803=[
  {
    "loader": "a",
    "namespace": "o.PD",
    "genericRender": "O",
    "icon": "N",
    "jsx": "r",
    "container": "u.F",
    "classNames": "(0,l.A)",
    "spinner": "p.N",
    "iconFunction": "N",
    "summaryWrapper": "C.o",
    "normalize": "(0,A.JXB)",
    "hostBridge": "y.O1",
    "routeFlag": "(()=>false)",
    "newRoute": "(0,A.Cv$)",
    "oldRoute": "(0,A._RT)",
    "sendTool": "h.vN"
  },
  {
    "loader": "n",
    "namespace": "r.PD",
    "genericRender": "T",
    "icon": "E",
    "jsx": "l",
    "container": "u.F",
    "classNames": "(0,i.A)",
    "spinner": "f.N",
    "iconFunction": "E",
    "summaryWrapper": "b.o",
    "normalize": "(0,h.JXB)",
    "hostBridge": "I.O1",
    "routeFlag": "(()=>false)",
    "newRoute": "(0,h.Cv$)",
    "oldRoute": "(0,h._RT)",
    "sendTool": "y.vN"
  },
  {
    "loader": "a",
    "namespace": "o.PD",
    "genericRender": "P",
    "icon": "N",
    "jsx": "i",
    "container": "u.F",
    "classNames": "(0,s.A)",
    "spinner": "p.N",
    "iconFunction": "N",
    "summaryWrapper": "C.o",
    "normalize": "(0,h.JXB)",
    "hostBridge": "A.O1",
    "routeFlag": "(()=>false)",
    "newRoute": "(0,h.Cv$)",
    "oldRoute": "(0,h._RT)",
    "sendTool": "y.vN"
  },
  {
    "loader": "n",
    "namespace": "s.PD",
    "genericRender": "T",
    "icon": "P",
    "jsx": "r",
    "container": "c.F",
    "classNames": "(0,o.A)",
    "spinner": "g.N",
    "iconFunction": "P",
    "summaryWrapper": "w.o",
    "normalize": "(0,v.JXB)",
    "hostBridge": "C.O1",
    "routeFlag": "(()=>false)",
    "newRoute": "(0,v.Cv$)",
    "oldRoute": "(0,v._RT)",
    "sendTool": "y.vN"
  },
  {
    "loader": "a",
    "namespace": "l.PD",
    "genericRender": "P",
    "icon": "O",
    "jsx": "i",
    "container": "d.F",
    "classNames": "(0,o.A)",
    "spinner": "p.N",
    "iconFunction": "O",
    "summaryWrapper": "I.o",
    "normalize": "(0,A.JXB)",
    "hostBridge": "h.O1",
    "routeFlag": "(()=>false)",
    "newRoute": "(0,A.Cv$)",
    "oldRoute": "(0,A._RT)",
    "sendTool": "C.vN"
  }
];
export function runBuild29803({root,command,buildHelper}){
 const owners=waitOwners29803(root),targets=[];let states=[];
 for(let index=0;index<owners.length;index++){
  const owner=owners[index],p=waitProfiles29803[index];let source=readRendererModule(owner);
  const entry=`{namespace:${p.namespace},render:${p.genericRender},renderAgentActivityIcon:${p.icon},tool:${p.sendTool}}`;
  const receiptEntry=`{namespace:${p.namespace},persistentInCollapsedConversation:!0,render:MTKrenderOutboundMessage,renderAgentActivityIcon:${p.icon},standaloneInConversation:!0,tool:${p.sendTool}}`;
  const sendEntry=source.includes(entry)?entry:receiptEntry;
  const added=`{namespace:${p.namespace},render:MTKrenderWaitThreads,renderAgentActivityIcon:${p.icon},tool:"wait_threads"}`;
  for(const fragment of [`${p.sendTool.split('.')[0]}=${p.loader}("MCYz")`,`${p.hostBridge.split('.')[0]}=${p.loader}("TL6G")`,`${p.summaryWrapper.split('.')[0]}=${p.loader}("MFk9")`])requireOne(source,fragment);
  const helperProfile={jsx:'MTKwaitJsx',container:'MTKwaitContainer',classNames:'MTKwaitClasses',spinner:'MTKwaitSpinner',iconFunction:'MTKwaitIcon',summaryWrapper:'MTKwaitSummary',normalize:'MTKwaitNormalize',hostBridge:'MTKwaitBus',routeFlag:'MTKwaitRouteFlag',newRoute:'MTKwaitNewRoute',oldRoute:'MTKwaitOldRoute'};
  let helper=buildHelper(helperProfile,true);
  const before='let r=MTKwaitStoreHook(MTKwaitStoreScope),i=MTKwaitTargets(e.arguments);if(i==null)return null;let a=i.map(e=>{let t=e.hostId==="local"?MTKwaitLocalThreadKey(e.threadId):MTKwaitRemoteThreadKey(e.threadId);return MTKwaitResolvedTarget(e,r.get(MTKwaitTaskAtom,t),r.get(MTKwaitTitleAtom,{hostId:e.hostId,threadId:e.threadId}))})';
  const after='let r=MTKwaitStoreHook(MTKwaitStoreScope),i=MTKwaitTargets(e.arguments);if(i==null)return null;let a=i.map(e=>{let t=r.get(MTKwaitThreadAtom,{hostId:e.hostId,threadId:e.threadId}),n=t==null?null:{kind:"local",summary:t.summary};return MTKwaitResolvedTarget(e,n,r.get(MTKwaitTitleAtom,{hostId:e.hostId,threadId:e.threadId}))})';
  requireOne(helper,before);helper=helper.replace(before,()=>after);
  const bindings=`const MTKwaitStoreHook=${p.loader}("qmMi").gh,MTKwaitStoreScope=${p.loader}("OWtl").u,MTKwaitTitleAtom=${p.loader}("tl5a").HX,MTKwaitThreadAtom=${p.loader}("tl5a").ok,MTKwaitJsx=${p.jsx},MTKwaitContainer=${p.container},MTKwaitClasses=${p.classNames},MTKwaitSpinner=${p.spinner},MTKwaitIcon=${p.iconFunction},MTKwaitSummary=${p.summaryWrapper},MTKwaitNormalize=${p.normalize},MTKwaitBus=${p.hostBridge},MTKwaitRouteFlag=${p.routeFlag},MTKwaitNewRoute=${p.newRoute},MTKwaitOldRoute=${p.oldRoute};`;
  const applied=source.includes(helper)&&source.includes(bindings)&&source.includes(added) && (source.includes(entry) || source.includes(`{namespace:${p.namespace},persistentInCollapsedConversation:!0,render:MTKrenderOutboundMessage,renderAgentActivityIcon:${p.icon},standaloneInConversation:!0,tool:${p.sendTool}}`));
  if(!applied){if(source.includes('MTKrenderWaitThreads'))throw Error('Partial wait module patch');requireOne(source,sendEntry);if(command==='apply'){source=source.replace(sendEntry,()=>added+','+sendEntry)+bindings+helper;writeRendererModule(owner,source);}}
  states.push(applied);targets.push(path.relative(root,owner.file));
 }
 if(states.some(Boolean)&&!states.every(Boolean))throw Error('Partial wait module variants');
 return{state:states.every(Boolean)||command==='apply'?'applied':'needs-apply',targets};
}
function requireOne(s,v){if(s.split(v).length!==2)throw Error('Upstream changed: wait module contract '+v)}

import path from 'node:path';
import {readRendererModule,writeRendererModule} from '../../../src/renderer-module.mjs';
export const waitOwners30607=root=>[{file:path.join(root,'webview/assets/async/990214.12d3fdf6e7.js'),id:'acby',parameters:['e','t','a']}];
export const waitProfiles30607=[{loader:'a',namespace:'o.PD',genericRender:'z',icon:'N',jsx:'r',container:'u.F',classNames:'(0,s.A)',spinner:'m.N',iconFunction:'N',summaryWrapper:'A.o',normalize:'(0,h.JXB)',hostBridge:'b.O1',routeFlag:'(()=>false)',newRoute:'(0,h.Cv$)',oldRoute:'(0,h._RT)',sendTool:'x.vN'}];
export function runBuild30607({root,command,buildHelper}){
 const owners=waitOwners30607(root),targets=[];let states=[];
 for(let index=0;index<owners.length;index++){
  const owner=owners[index],p=waitProfiles30607[index];let source=readRendererModule(owner);
  const entry=`{namespace:${p.namespace},render:${p.genericRender},renderAgentActivityIcon:${p.icon},tool:${p.sendTool}}`;
  const receiptEntry=`{namespace:${p.namespace},persistentInCollapsedConversation:!0,render:MTKrenderOutboundMessage,renderAgentActivityIcon:${p.icon},standaloneInConversation:!0,tool:${p.sendTool}}`;
  const sendEntry=source.includes(entry)?entry:receiptEntry;
  const added=`{namespace:${p.namespace},render:MTKrenderWaitThreads,renderAgentActivityIcon:${p.icon},tool:"wait_threads"}`;
  for(const fragment of [`${p.container.split('.')[0]}=${p.loader}("dqpP")`,`${p.sendTool.split('.')[0]}=${p.loader}("MCYz")`,`${p.hostBridge.split('.')[0]}=${p.loader}("TL6G")`,`${p.summaryWrapper.split('.')[0]}=${p.loader}("MFk9")`])requireOne(source,fragment);
  const helperProfile={jsx:'MTKwaitJsx',container:'MTKwaitContainer',classNames:'MTKwaitClasses',spinner:'MTKwaitSpinner',iconFunction:'MTKwaitIcon',summaryWrapper:'MTKwaitSummary',normalize:'MTKwaitNormalize',hostBridge:'MTKwaitBus',routeFlag:'MTKwaitRouteFlag',newRoute:'MTKwaitNewRoute',oldRoute:'MTKwaitOldRoute'};
  let helper=buildHelper(helperProfile,true);
  const before='let r=MTKwaitStoreHook(MTKwaitStoreScope),i=MTKwaitTargets(e.arguments);if(i==null)return null;let a=i.map(e=>{let t=e.hostId==="local"?MTKwaitLocalThreadKey(e.threadId):MTKwaitRemoteThreadKey(e.threadId);return MTKwaitResolvedTarget(e,r.get(MTKwaitTaskAtom,t),r.get(MTKwaitTitleAtom,{hostId:e.hostId,threadId:e.threadId}))})';
  const after='let r=MTKwaitStoreHook(MTKwaitStoreScope),i=MTKwaitTargets(e.arguments);if(i==null)return null;let a=i.map(e=>{let t=r.get(MTKwaitThreadAtom,{hostId:e.hostId,threadId:e.threadId}),n=t==null?null:{kind:"local",summary:t.summary};return MTKwaitResolvedTarget(e,n,r.get(MTKwaitTitleAtom,{hostId:e.hostId,threadId:e.threadId}))})';
  requireOne(helper,before);helper=helper.replace(before,()=>after);
  const colorBefore='let n=t.color==null?void 0:{color:"light-dark("+MTKwaitLabelColor(t.color,!1)+","+MTKwaitLabelColor(t.color,!0)+")"},r=';
  const colorAfter='let MTKwaitColor=t.color==null?null:"light-dark("+MTKwaitLabelColor(t.color,!1)+","+MTKwaitLabelColor(t.color,!0)+")",n=MTKwaitColor==null?void 0:{color:MTKwaitColor,WebkitTextFillColor:MTKwaitColor},r=';
  requireOne(helper,colorBefore);helper=helper.replace(colorBefore,colorAfter);
  const bindings=`const MTKwaitStoreHook=${p.loader}("Q840").gh,MTKwaitStoreScope=${p.loader}("OWtl").u,MTKwaitTitleAtom=${p.loader}("tl5a").HX,MTKwaitThreadAtom=${p.loader}("tl5a").ok,MTKwaitJsx=${p.jsx},MTKwaitContainer=${p.container},MTKwaitClasses=${p.classNames},MTKwaitSpinner=${p.spinner},MTKwaitIcon=${p.iconFunction},MTKwaitSummary=${p.summaryWrapper},MTKwaitNormalize=${p.normalize},MTKwaitBus=${p.hostBridge},MTKwaitRouteFlag=${p.routeFlag},MTKwaitNewRoute=${p.newRoute},MTKwaitOldRoute=${p.oldRoute};`;
  const applied=source.includes(helper)&&source.includes(bindings)&&source.includes(added) && (source.includes(entry) || source.includes(`{namespace:${p.namespace},persistentInCollapsedConversation:!0,render:MTKrenderOutboundMessage,renderAgentActivityIcon:${p.icon},standaloneInConversation:!0,tool:${p.sendTool}}`));
  if(!applied){if(source.includes('MTKrenderWaitThreads'))throw Error('Partial wait module patch');requireOne(source,sendEntry);if(command==='apply'){source=source.replace(sendEntry,()=>added+','+sendEntry)+bindings+helper;writeRendererModule(owner,source);}}
  states.push(applied);targets.push(path.relative(root,owner.file));
 }
 if(states.some(Boolean)&&!states.every(Boolean))throw Error('Partial wait module variants');
 return{state:states.every(Boolean)||command==='apply'?'applied':'needs-apply',targets};
}
function requireOne(s,v){if(s.split(v).length!==2)throw Error('Upstream changed: wait module contract '+v)}

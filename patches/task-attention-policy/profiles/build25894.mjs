import path from 'node:path';import{readRendererModule,writeRendererModule}from '../../../src/renderer-module.mjs';import{rosterOwner25894}from '../../agent-roster/profiles/build25894.mjs';
export const attentionRow25894=root=>({file:path.join(root,'webview/assets/async/86296.6305cfdd6d.js'),id:'FeCP',parameters:['e','t','a']});
export const attention25894={suffix:'25894',appRootBefore:'function mG(){MTKuseAgentRoster();',appRootAfter:'function mG(){MTKuseAttentionBootstrap25894();MTKuseAgentRoster();',scopeAfter:'(0,E.gh)(j.u)',react:'u',decoder:'MTKattentionDecode',localMatch:'null,n.threadId',remoteMatch:'null,n.taskId',
 atomBefore:'hS=(0,E.un)(j.u,({get:e})=>{let',atomAfter:'hS=(0,E.un)(j.u,({get:e})=>{e(MTKattentionPolicyAtom);let',
 dockBefore:"c=\"work\"===t?(0,iz.FT)({cloudThreadsAllowed:r,localThreadsAllowed:(0,iz.sV)(e(ez.rQ)),threadKeys:l}):l;return i+",
 dockAfter:'c="work"===t?(0,iz.FT)({cloudThreadsAllowed:r,localThreadsAllowed:(0,iz.sV)(e(ez.rQ)),threadKeys:l}):l;c=c.filter(t=>!MTKattentionIgnoredThread25894(e,t));return i+',
 notificationBefore:"event:\"turn-completed\",listener:n}),(a,i)=>{var r,s,o;",notificationAfter:'event:"turn-completed",listener:n}),(a,i)=>{if(MTKattentionIgnored25894((0,hO.NY)(i),a.conversationId))return;var r,s,o;',
 primaryOwner:'function eP(e){',primaryReact:'s',titleBefore:"aQ=aA?\"loading\":aW,aF=",titleAfter:'MTKattentionIgnoredForTask=MTKuseTaskAttention25894(t7,eM),aQ=aA?"loading":aW,aF=',
 pristinePrimary:["aF=!aB&&(tS??!0===am),aK=aB||null!=av?0:ap??0","hasUnreadTurn:!aB&&!0===am"],patchedPrimary:['aF=!MTKattentionIgnoredForTask&&!aB&&(tS??!0===am),aK=MTKattentionIgnoredForTask||aB||null!=av?0:ap??0','hasUnreadTurn:!MTKattentionIgnoredForTask&&!aB&&!0===am']};
export function runBuild25894({root,command,patchProfile}){
 const app=rosterOwner25894(root),row=attentionRow25894(root);let source=readRendererModule(app),primary=readRendererModule(row);const p=attention25894;
 if(command==='check'&&!source.includes('globalThis.__MTK_AGENT_ROSTER__=Object.freeze(')){
  for(const fragment of ['function mG(){let e,t,n,a,i=(0,c.c)(12),',p.atomBefore,p.dockBefore,p.notificationBefore,'let c=(0,hO.NY)(i),d=b(a.conversationId,i)'])one(source,fragment);
  for(const fragment of[p.primaryOwner,p.titleBefore,...p.pristinePrimary])one(primary,fragment);
  return{state:'needs-apply',targets:[app.file,row.file].map(f=>path.relative(root,f))};
 }
 for(const s of ['E=n("zTeN")','u=n("zd8w")','j=n("OWtl")','globalThis.__MTK_AGENT_ROSTER__=Object.freeze('])one(source,s);
 one(primary,'s=a("zd8w")');one(primary,'conversationId:eM,hostId:eP');
 const binding=';const MTKattentionDecode=n("d6Ff").Pc;';
 const applied=source.includes(p.appRootAfter)&&source.includes(p.dockAfter)&&source.includes(p.notificationAfter)&&source.includes(p.atomAfter)&&source.includes(binding)&&primary.includes(p.titleAfter)&&p.patchedPrimary.every(s=>primary.includes(s));
 if(!applied){if(source.includes('MTKattentionRosterBridge')||primary.includes('MTKuseTaskAttention'))throw Error('Partial attention module patch');for(const s of [p.appRootBefore,p.atomBefore,p.dockBefore,p.notificationBefore,'let c=(0,hO.NY)(i),d=b(a.conversationId,i)'])one(source,s);for(const s of[p.primaryOwner,p.titleBefore,...p.pristinePrimary])one(primary,s);
  if(command==='apply'){
   const changed=patchProfile(source,primary,p,false);source=changed.appSource.replace('var MTKattentionPolicyAtom;','var MTKattentionPolicyAtom=(0,E.vP)(j.u,0);')+binding;primary=changed.primarySource;
   writeRendererModule(app,source);writeRendererModule(row,primary);
  }
 }
 return{state:applied||command==='apply'?'applied':'needs-apply',targets:[app.file,row.file].map(f=>path.relative(root,f))};
}
function one(s,v){if(s.split(v).length!==2)throw Error('Upstream changed: attention module contract '+v)}

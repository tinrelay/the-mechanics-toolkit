import path from 'node:path';import{readRendererModule,writeRendererModule}from '../../../src/renderer-module.mjs';import{rosterOwner24614}from '../../agent-roster/profiles/build24614.mjs';
export const attentionRow24614=root=>({file:path.join(root,'webview/assets/async/86296.cc31aba811.js'),id:'FeCP',parameters:['e','t','n']});
export const attention24614={suffix:'24614',appRootBefore:'function mD(){MTKuseAgentRoster();',appRootAfter:'function mD(){MTKuseAttentionBootstrap24614();MTKuseAgentRoster();',scopeAfter:'(0,E.gh)(P.u)',react:'u',decoder:'MTKattentionDecode',localMatch:'null,n.threadId',remoteMatch:'null,n.taskId',
 atomBefore:'hm=(0,E.un)(P.u,({get:e})=>{let',atomAfter:'hm=(0,E.un)(P.u,({get:e})=>{e(MTKattentionPolicyAtom);let',
 dockBefore:'c="work"===t?(0,iG.FT)({cloudThreadsAllowed:s,localThreadsAllowed:(0,iG.sV)(e(e0.rQ)),threadKeys:l}):l;return i+',
 dockAfter:'c="work"===t?(0,iG.FT)({cloudThreadsAllowed:s,localThreadsAllowed:(0,iG.sV)(e(e0.rQ)),threadKeys:l}):l;c=c.filter(t=>!MTKattentionIgnoredThread24614(e,t));return i+',
 notificationBefore:'event:"turn-completed",listener:n}),(a,i)=>{var s,r,o;',notificationAfter:'event:"turn-completed",listener:n}),(a,i)=>{if(MTKattentionIgnored24614((0,hS.NY)(i),a.conversationId))return;var s,r,o;',
 primaryOwner:'function eE(e){',primaryReact:'d',titleBefore:'nQ=nS?"loading":nB,nz=',titleAfter:'MTKattentionIgnoredForTask=MTKuseTaskAttention24614(nK,eU),nQ=nS?"loading":nB,nz=',
 pristinePrimary:['nz=!nF&&(t_??!0===nb),nq=nF||null!=nv?0:nI??0','hasUnreadTurn:!nF&&!0===nb'],patchedPrimary:['nz=!MTKattentionIgnoredForTask&&!nF&&(t_??!0===nb),nq=MTKattentionIgnoredForTask||nF||null!=nv?0:nI??0','hasUnreadTurn:!MTKattentionIgnoredForTask&&!nF&&!0===nb']};
export function runBuild24614({root,command,patchProfile}){
 const app=rosterOwner24614(root),row=attentionRow24614(root);let source=readRendererModule(app),primary=readRendererModule(row);const p=attention24614;
 if(command==='check'&&!source.includes('globalThis.__MTK_AGENT_ROSTER__=Object.freeze(')){
  for(const fragment of ['function mD(){let e,t,n,a,i=(0,c.c)(12),',p.atomBefore,p.dockBefore,p.notificationBefore])one(source,fragment);
  for(const fragment of[p.primaryOwner,p.titleBefore,...p.pristinePrimary])one(primary,fragment);
  return{state:'needs-apply',targets:[app.file,row.file].map(f=>path.relative(root,f))};
 }
 for(const s of ['E=n("y5DF")','u=n("zd8w")','P=n("OWtl")','globalThis.__MTK_AGENT_ROSTER__=Object.freeze('])one(source,s);
 one(primary,'d=n("zd8w")');one(primary,'conversationId:eU,hostId:eH');
 const binding=';const MTKattentionDecode=n("d6Ff").Pc;';
 const applied=source.includes(p.appRootAfter)&&source.includes(p.dockAfter)&&source.includes(p.notificationAfter)&&source.includes(p.atomAfter)&&source.includes(binding)&&primary.includes(p.titleAfter)&&p.patchedPrimary.every(s=>primary.includes(s));
 if(!applied){if(source.includes('MTKattentionRosterBridge')||primary.includes('MTKuseTaskAttention'))throw Error('Partial attention module patch');for(const s of [p.appRootBefore,p.atomBefore,p.dockBefore,p.notificationBefore])one(source,s);for(const s of[p.primaryOwner,p.titleBefore,...p.pristinePrimary])one(primary,s);
  if(command==='apply'){
   const changed=patchProfile(source,primary,p,false);source=changed.appSource.replace('var MTKattentionPolicyAtom;','var MTKattentionPolicyAtom=(0,E.vP)(P.u,0);')+binding;primary=changed.primarySource;
   writeRendererModule(app,source);writeRendererModule(row,primary);
  }
 }
 return{state:applied||command==='apply'?'applied':'needs-apply',targets:[app.file,row.file].map(f=>path.relative(root,f))};
}
function one(s,v){if(s.split(v).length!==2)throw Error('Upstream changed: attention module contract '+v)}

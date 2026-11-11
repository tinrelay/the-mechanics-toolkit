import path from 'node:path';import{readRendererModule,writeRendererModule}from '../../../src/renderer-module.mjs';import{rosterOwner26605}from '../../agent-roster/profiles/build26605.mjs';
export const attentionRow26605=root=>({file:path.join(root,'webview/assets/async/86296.b4b4b7b00b.js'),id:'FeCP',parameters:['e','t','a']});
export const attention26605={suffix:'26605',appRootBefore:'function mD(){MTKuseAgentRoster();',appRootAfter:'function mD(){MTKuseAttentionBootstrap26605();MTKuseAgentRoster();',scopeAfter:'(0,E.gh)(T.u)',react:'u',decoder:'MTKattentionDecode',localMatch:'null,n.threadId',remoteMatch:'null,n.taskId',
 atomBefore:'hs=(0,E.un)(T.u,({get:e})=>{if',atomAfter:'hs=(0,E.un)(T.u,({get:e})=>{e(MTKattentionPolicyAtom);if',
 dockBefore:"c=\"work\"===t?(0,iJ.FT)({cloudThreadsAllowed:r,localThreadsAllowed:(0,iJ.sV)(e(ez.rQ)),threadKeys:l}):l;return i+",
 dockAfter:'c="work"===t?(0,iJ.FT)({cloudThreadsAllowed:r,localThreadsAllowed:(0,iJ.sV)(e(ez.rQ)),threadKeys:l}):l;c=c.filter(t=>!MTKattentionIgnoredThread26605(e,t));return i+',
 notificationBefore:"event:\"turn-completed\",listener:n}),(a,i)=>{var r,s,o;",notificationAfter:'event:"turn-completed",listener:n}),(a,i)=>{if(MTKattentionIgnored26605((0,hf.NY)(i),a.conversationId))return;var r,s,o;',
 primaryOwner:'function eP(e){',primaryReact:'s',titleBefore:"aQ=aA?\"loading\":aB,aF=",titleAfter:'MTKattentionIgnoredForTask=MTKuseTaskAttention26605(t7,eM),aQ=aA?"loading":aB,aF=',
 pristinePrimary:["aF=!aW&&(tS??!0===am),aO=aW||null!=av?0:ap??0","hasUnreadTurn:!aW&&!0===am"],patchedPrimary:['aF=!MTKattentionIgnoredForTask&&!aW&&(tS??!0===am),aO=MTKattentionIgnoredForTask||aW||null!=av?0:ap??0','hasUnreadTurn:!MTKattentionIgnoredForTask&&!aW&&!0===am']};
export function runBuild26605({root,command,patchProfile}){
 const app=rosterOwner26605(root),row=attentionRow26605(root);let source=readRendererModule(app),primary=readRendererModule(row);const p=attention26605;
 if(command==='check'&&!source.includes('globalThis.__MTK_AGENT_ROSTER__=Object.freeze(')){
  for(const fragment of ['function mD(){let e,t,n,a,i=(0,c.c)(11),',p.atomBefore,p.dockBefore,p.notificationBefore,'let c=(0,hf.NY)(i),d=g(a.conversationId,i)'])one(source,fragment);
  for(const fragment of[p.primaryOwner,p.titleBefore,...p.pristinePrimary])one(primary,fragment);
  return{state:'needs-apply',targets:[app.file,row.file].map(f=>path.relative(root,f))};
 }
 for(const s of ['E=n("zTeN")','u=n("zd8w")','T=n("OWtl")','globalThis.__MTK_AGENT_ROSTER__=Object.freeze('])one(source,s);
 one(primary,'s=a("zd8w")');one(primary,'conversationId:eM,hostId:eP');
 const binding=';const MTKattentionDecode=n("d6Ff").Pc;';
 const applied=source.includes(p.appRootAfter)&&source.includes(p.dockAfter)&&source.includes(p.notificationAfter)&&source.includes(p.atomAfter)&&source.includes(binding)&&primary.includes(p.titleAfter)&&p.patchedPrimary.every(s=>primary.includes(s));
 if(!applied){if(source.includes('MTKattentionRosterBridge')||primary.includes('MTKuseTaskAttention'))throw Error('Partial attention module patch');for(const s of [p.appRootBefore,p.atomBefore,p.dockBefore,p.notificationBefore,'let c=(0,hf.NY)(i),d=g(a.conversationId,i)'])one(source,s);for(const s of[p.primaryOwner,p.titleBefore,...p.pristinePrimary])one(primary,s);
  if(command==='apply'){
   const changed=patchProfile(source,primary,p,false);source=changed.appSource.replace('var MTKattentionPolicyAtom;','var MTKattentionPolicyAtom=(0,E.vP)(T.u,0);')+binding;primary=changed.primarySource;
   writeRendererModule(app,source);writeRendererModule(row,primary);
  }
 }
 return{state:applied||command==='apply'?'applied':'needs-apply',targets:[app.file,row.file].map(f=>path.relative(root,f))};
}
function one(s,v){if(s.split(v).length!==2)throw Error('Upstream changed: attention module contract '+v)}

import path from 'node:path';import{readRendererModule,writeRendererModule}from '../../../src/renderer-module.mjs';import{rosterOwner28661}from '../../agent-roster/profiles/build28661.mjs';
export const attentionRow28661=root=>({file:path.join(root,'webview/assets/async/364303.020d70cb36.js'),id:'CGsD',parameters:['e','t','n']});
export const attention28661={suffix:'28661',appRootBefore:'function mV(){MTKuseAgentRoster();',appRootAfter:'function mV(){MTKuseAttentionBootstrap28661();MTKuseAgentRoster();',scopeAfter:'(0,E.gh)(T.u)',react:'u',decoder:'MTKattentionDecode',localMatch:'null,n.threadId',remoteMatch:'null,n.taskId',
 atomBefore:'hl=(0,E.un)(T.u,({get:e})=>{if',atomAfter:'hl=(0,E.un)(T.u,({get:e})=>{e(MTKattentionPolicyAtom);if',
 dockBefore:"c=\"work\"===t?(0,i3.FT)({cloudThreadsAllowed:r,localThreadsAllowed:(0,i3.sV)(e(e$.rQ)),threadKeys:l}):l;return i+",
 dockAfter:'c="work"===t?(0,i3.FT)({cloudThreadsAllowed:r,localThreadsAllowed:(0,i3.sV)(e(e$.rQ)),threadKeys:l}):l;c=c.filter(t=>!MTKattentionIgnoredThread28661(e,t));return i+',
 notificationBefore:"event:\"turn-completed\",listener:n}),(t,a,i)=>{var s;",notificationAfter:'event:"turn-completed",listener:n}),(t,a,i)=>{if(MTKattentionIgnored28661((0,hx.NY)(a),t.conversationId))return;var s;',
 primaryOwner:'function eF(e){',primaryReact:'s',titleBefore:"nP=ng?\"loading\":n_,nN=",titleAfter:'MTKattentionIgnoredForTask=MTKuseTaskAttention28661(t7,eS),nP=ng?"loading":n_,nN=',
 pristinePrimary:["nN=!nU&&(tA??!0===nl),nE=nU||null!=ni?0:ns??0","hasUnreadTurn:!nU&&!0===nl"],patchedPrimary:['nN=!MTKattentionIgnoredForTask&&!nU&&(tA??!0===nl),nE=MTKattentionIgnoredForTask||nU||null!=ni?0:ns??0','hasUnreadTurn:!MTKattentionIgnoredForTask&&!nU&&!0===nl']};
export function runBuild28661({root,command,patchProfile}){
 const decoder=readRendererModule({file:path.join(root,'webview/assets/async/907538.91f2a19777.js'),id:'d6Ff',parameters:['e','t','n']});one(decoder,'Pc:l,Wz:o,z3:s');one(decoder,'return{kind:"local",key:s(n),threadId:n}');
 const app=rosterOwner28661(root),row=attentionRow28661(root);let source=readRendererModule(app),primary=readRendererModule(row);const p=attention28661;
 if(command==='check'&&!source.includes('globalThis.__MTK_AGENT_ROSTER__=Object.freeze(')){
  for(const fragment of ['function mV(){let e,t,n,a,i=(0,c.c)(11),',p.atomBefore,p.dockBefore,p.notificationBefore,'let l=(0,hx.NY)(a),c=_(t.conversationId,a)'])one(source,fragment);
  for(const fragment of[p.primaryOwner,p.titleBefore,...p.pristinePrimary])one(primary,fragment);
  return{state:'needs-apply',targets:[app.file,row.file].map(f=>path.relative(root,f))};
 }
 for(const s of ['E=n("zTeN")','u=n("zd8w")','T=n("OWtl")','globalThis.__MTK_AGENT_ROSTER__=Object.freeze('])one(source,s);
 one(primary,'s=n("zd8w")');one(primary,'conversationId:eS,hostId:eM');
 const binding=';const MTKattentionDecode=n("d6Ff").Pc;';
 const applied=source.includes(p.appRootAfter)&&source.includes(p.dockAfter)&&source.includes(p.notificationAfter)&&source.includes(p.atomAfter)&&source.includes(binding)&&primary.includes(p.titleAfter)&&p.patchedPrimary.every(s=>primary.includes(s));
 if(!applied){if(source.includes('MTKattentionRosterBridge')||primary.includes('MTKuseTaskAttention'))throw Error('Partial attention module patch');for(const s of [p.appRootBefore,p.atomBefore,p.dockBefore,p.notificationBefore,'let l=(0,hx.NY)(a),c=_(t.conversationId,a)'])one(source,s);for(const s of[p.primaryOwner,p.titleBefore,...p.pristinePrimary])one(primary,s);
  if(command==='apply'){
   const changed=patchProfile(source,primary,p,false);source=changed.appSource.replace('var MTKattentionPolicyAtom;','var MTKattentionPolicyAtom=(0,E.vP)(T.u,0);')+binding;primary=changed.primarySource;
   writeRendererModule(app,source);writeRendererModule(row,primary);
  }
 }
 return{state:applied||command==='apply'?'applied':'needs-apply',targets:[app.file,row.file].map(f=>path.relative(root,f))};
}
function one(s,v){if(s.split(v).length!==2)throw Error('Upstream changed: attention module contract '+v)}

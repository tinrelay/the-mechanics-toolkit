import path from 'node:path';import{readRendererModule,writeRendererModule}from '../../../src/renderer-module.mjs';import{rosterOwner30866}from '../../agent-roster/profiles/build30866.mjs';
export const attentionRow30866=root=>({file:path.join(root,'webview/assets/async/364303.2eba5f3e06.js'),id:'CGsD',parameters:['e','t','n']});
export const attention30866={
  "suffix": "30866",
  "appRootBefore": "function mA(){MTKuseAgentRoster();",
  "appRootAfter": "function mA(){MTKuseAttentionBootstrap30866();MTKuseAgentRoster();",
  "scopeAfter": "(0,C.gh)(k.u)",
  "react": "h",
  "decoder": "MTKattentionDecode",
  "localMatch": "null,n.threadId",
  "remoteMatch": "null,n.taskId",
  "atomBefore": "hY=(0,C.un)(k.u,({get:e})=>{if",
  "atomAfter": "hY=(0,C.un)(k.u,({get:e})=>{e(MTKattentionPolicyAtom);if",
  "dockBefore": "o=\"work\"===t?(0,sa.FT)({cloudThreadsAllowed:s,localThreadsAllowed:(0,sa.sV)(e(eZ.rQ)),threadKeys:l}):l;return r+",
  "dockAfter": "o=\"work\"===t?(0,sa.FT)({cloudThreadsAllowed:s,localThreadsAllowed:(0,sa.sV)(e(eZ.rQ)),threadKeys:l}):l;o=o.filter(t=>!MTKattentionIgnoredThread30866(e,t));return r+",
  "notificationBefore": "event:\"turn-completed\",listener:n}),(t,a,r)=>{var s;",
  "notificationAfter": "event:\"turn-completed\",listener:n}),(t,a,r)=>{if(MTKattentionIgnored30866((0,pu.W$)(a),t.conversationId))return;var s;",
  "primaryOwner": "function eF(e){",
  "primaryReact": "s",
  "titleBefore": "nV=nT?\"loading\":nH,nq=",
  "titleAfter": "MTKattentionIgnoredForTask=MTKuseTaskAttention30866(eN,eL),nV=nT?\"loading\":nH,nq=",
  "pristinePrimary": [
    "nq=!nO&&(tU??!0===nI)",
    "hasUnreadTurn:!nO&&!0===nI"
  ],
  "patchedPrimary": [
    "nq=!MTKattentionIgnoredForTask&&!nO&&(tU??!0===nI)",
    "hasUnreadTurn:!MTKattentionIgnoredForTask&&!nO&&!0===nI"
  ]
};
export function runBuild30866({root,command,patchProfile}){
 const decoder=readRendererModule({file:path.join(root,'webview/assets/async/366996.9782070574.js'),id:'d6Ff',parameters:['e','t','n']});one(decoder,"Pc:l,Wz:s,z3:a");one(decoder,"return{kind:\"local\",key:a(n),threadId:n}");
 const app=rosterOwner30866(root),row=attentionRow30866(root);let source=readRendererModule(app),primary=readRendererModule(row);const p=attention30866;
 if(command==='check'&&!source.includes('globalThis.__MTK_AGENT_ROSTER__=Object.freeze(')){
  for(const fragment of ['function mA(){let e,t,n,a,r=(0,d.c)(11),',p.atomBefore,p.dockBefore,p.notificationBefore,"let o=(0,pu.W$)(a),c=_(t.conversationId,a)"])one(source,fragment);
  for(const fragment of[p.primaryOwner,p.titleBefore,...p.pristinePrimary])one(primary,fragment);
  return{state:'needs-apply',targets:[app.file,row.file].map(f=>path.relative(root,f))};
 }
 for(const s of ["C=n(\"Q840\")",'h=n("zd8w")','k=n("OWtl")','globalThis.__MTK_AGENT_ROSTER__=Object.freeze('])one(source,s);
 one(primary,'s=n("zd8w")');one(primary,'conversationId:eL,hostId:eN');
 const binding=';const MTKattentionDecode=n("d6Ff").Pc;';
 const applied=source.includes(p.appRootAfter)&&source.includes(p.dockAfter)&&source.includes(p.notificationAfter)&&source.includes(p.atomAfter)&&source.includes(binding)&&primary.includes(p.titleAfter)&&p.patchedPrimary.every(s=>primary.includes(s));
 if(!applied){if(source.includes('MTKattentionRosterBridge')||primary.includes('MTKuseTaskAttention'))throw Error('Partial attention module patch');for(const s of [p.appRootBefore,p.atomBefore,p.dockBefore,p.notificationBefore,"let o=(0,pu.W$)(a),c=_(t.conversationId,a)"])one(source,s);for(const s of[p.primaryOwner,p.titleBefore,...p.pristinePrimary])one(primary,s);
  if(command==='apply'){
   const changed=patchProfile(source,primary,p,false);source=changed.appSource.replace('var MTKattentionPolicyAtom;','var MTKattentionPolicyAtom=(0,C.vP)(k.u,0);')+binding;primary=changed.primarySource;
   writeRendererModule(app,source);writeRendererModule(row,primary);
  }
 }
 return{state:applied||command==='apply'?'applied':'needs-apply',targets:[app.file,row.file].map(f=>path.relative(root,f))};
}
function one(s,v){if(s.split(v).length!==2)throw Error('Upstream changed: attention module contract '+v)}

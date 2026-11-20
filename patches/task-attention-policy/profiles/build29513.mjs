import path from 'node:path';import{readRendererModule,writeRendererModule}from '../../../src/renderer-module.mjs';import{rosterOwner29513}from '../../agent-roster/profiles/build29513.mjs';
export const attentionRow29513=root=>({file:path.join(root,'webview/assets/async/364303.ba663c573e.js'),id:'CGsD',parameters:['e','t','n']});
export const attention29513={
  "suffix": "29513",
  "appRootBefore": "function fg(){MTKuseAgentRoster();",
  "appRootAfter": "function fg(){MTKuseAttentionBootstrap29513();MTKuseAgentRoster();",
  "scopeAfter": "(0,A.gh)(O.u)",
  "react": "u",
  "decoder": "MTKattentionDecode",
  "localMatch": "null,n.threadId",
  "remoteMatch": "null,n.taskId",
  "atomBefore": "hF=(0,A.un)(O.u,({get:e})=>{if",
  "atomAfter": "hF=(0,A.un)(O.u,({get:e})=>{e(MTKattentionPolicyAtom);if",
  "dockBefore": "o=\"work\"===t?(0,io.FT)({cloudThreadsAllowed:i,localThreadsAllowed:(0,io.sV)(e(e1.rQ)),threadKeys:l}):l;return r+",
  "dockAfter": "o=\"work\"===t?(0,io.FT)({cloudThreadsAllowed:i,localThreadsAllowed:(0,io.sV)(e(e1.rQ)),threadKeys:l}):l;o=o.filter(t=>!MTKattentionIgnoredThread29513(e,t));return r+",
  "notificationBefore": "event:\"turn-completed\",listener:n}),(t,a,r)=>{var s;",
  "notificationAfter": "event:\"turn-completed\",listener:n}),(t,a,r)=>{if(MTKattentionIgnored29513((0,pt.W$)(a),t.conversationId))return;var s;",
  "primaryOwner": "function eF(e){",
  "primaryReact": "s",
  "titleBefore": "nK=nP?\"loading\":nW,nF=",
  "titleAfter": "MTKattentionIgnoredForTask=MTKuseTaskAttention29513(eN,eL),nK=nP?\"loading\":nW,nF=",
  "pristinePrimary": [
    "nF=!nH&&(tU??!0===nx),nz=nH||null!=nb?0:nC??0",
    "hasUnreadTurn:!nH&&!0===nx"
  ],
  "patchedPrimary": [
    "nF=!MTKattentionIgnoredForTask&&!nH&&(tU??!0===nx),nz=MTKattentionIgnoredForTask||nH||null!=nb?0:nC??0",
    "hasUnreadTurn:!MTKattentionIgnoredForTask&&!nH&&!0===nx"
  ]
};
export function runBuild29513({root,command,patchProfile}){
 const decoder=readRendererModule({file:path.join(root,'webview/assets/async/364313.d749d31da5.js'),id:'d6Ff',parameters:['e','t','n']});one(decoder,"Pc:l,Wz:s,z3:a");one(decoder,"return{kind:\"local\",key:a(n),threadId:n}");
 const app=rosterOwner29513(root),row=attentionRow29513(root);let source=readRendererModule(app),primary=readRendererModule(row);const p=attention29513;
 if(command==='check'&&!source.includes('globalThis.__MTK_AGENT_ROSTER__=Object.freeze(')){
  for(const fragment of ['function fg(){let e,t,n,a,r=(0,c.c)(11),',p.atomBefore,p.dockBefore,p.notificationBefore,"let o=(0,pt.W$)(a),c=_(t.conversationId,a)"])one(source,fragment);
  for(const fragment of[p.primaryOwner,p.titleBefore,...p.pristinePrimary])one(primary,fragment);
  return{state:'needs-apply',targets:[app.file,row.file].map(f=>path.relative(root,f))};
 }
 for(const s of ["A=n(\"qmMi\")",'u=n("zd8w")','O=n("OWtl")','globalThis.__MTK_AGENT_ROSTER__=Object.freeze('])one(source,s);
 one(primary,'s=n("zd8w")');one(primary,'conversationId:eL,hostId:eN');
 const binding=';const MTKattentionDecode=n("d6Ff").Pc;';
 const applied=source.includes(p.appRootAfter)&&source.includes(p.dockAfter)&&source.includes(p.notificationAfter)&&source.includes(p.atomAfter)&&source.includes(binding)&&primary.includes(p.titleAfter)&&p.patchedPrimary.every(s=>primary.includes(s));
 if(!applied){if(source.includes('MTKattentionRosterBridge')||primary.includes('MTKuseTaskAttention'))throw Error('Partial attention module patch');for(const s of [p.appRootBefore,p.atomBefore,p.dockBefore,p.notificationBefore,"let o=(0,pt.W$)(a),c=_(t.conversationId,a)"])one(source,s);for(const s of[p.primaryOwner,p.titleBefore,...p.pristinePrimary])one(primary,s);
  if(command==='apply'){
   const changed=patchProfile(source,primary,p,false);source=changed.appSource.replace('var MTKattentionPolicyAtom;','var MTKattentionPolicyAtom=(0,A.vP)(O.u,0);')+binding;primary=changed.primarySource;
   writeRendererModule(app,source);writeRendererModule(row,primary);
  }
 }
 return{state:applied||command==='apply'?'applied':'needs-apply',targets:[app.file,row.file].map(f=>path.relative(root,f))};
}
function one(s,v){if(s.split(v).length!==2)throw Error('Upstream changed: attention module contract '+v)}

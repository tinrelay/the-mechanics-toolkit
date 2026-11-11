import fs from 'node:fs';import path from 'node:path';import{readRendererModule,writeRendererModule}from '../../../src/renderer-module.mjs';import{mainProcessAsset,mainLoggerOwner,mainMessageAnchor}from '../../../src/main-process-asset.mjs';import{waitOwners26605}from '../../wait-thread-roster/profiles/build26605.mjs';import{mainMessageBinding}from '../main-message-binding.mjs';import{attributionOwner26605}from '../../cross-task-attribution/profiles/build26605.mjs';import{reasoningOwners26605}from '../../reasoning-retention/profiles/build26605.mjs';
export function tinrelayOwners26605(root){return{renderer:attributionOwner26605(root),turn:reasoningOwners26605(root).turn,activity:{file:path.join(root,"webview/assets/async/720744.158c9ed7b0.js"),id:"BpQb",parameters:["e","t","n"]},classifiers:waitOwners26605(root).map(o=>({...o,id:'NQNw'}))}}
export function runIncoming26605({root,command,rendererHelpers,patchMain,getConfig}){
 const target=attributionOwner26605(root),main=mainProcessAsset(root),source=readRendererModule(target),native=fs.readFileSync(main,'utf8');
 for(const contract of ['L=n("y5H2")','(0,a.jsx)(L.R,{alignment:y,accentColor:u,message:p,'])one(source,contract);
 const helper=';const MTKtinrelayReact=n("zd8w"),MTKtinrelayJsx=n("ABep"),MTKtinrelayBus=n("TL6G").O1,MTKtinrelayMessageComponent=L.R;'+rendererHelpers('MTKtinrelayBus',{helperJsx:'MTKtinrelayJsx',messageComponent:'MTKtinrelayMessageComponent'});
 const pairs=[['r=(0,s.c)(23),{label:c,alignment:d','r=(0,s.c)(25),{label:c,alignment:d'],['paletteSourceTitle:MTKsourceTitle,paletteSourceId:MTKsourceId}=e,y=','paletteSourceTitle:MTKsourceTitle,paletteSourceId:MTKsourceId,messageNode:MTKmessageNode}=e,y='],['r[4]!==c||r[5]!==v?(i=v?','r[4]!==c||r[5]!==v||r[24]!==MTKmessageNode?(i=MTKmessageNode?null:v?'],['r[4]=c,r[5]=v,r[6]=i','r[4]=c,r[5]=v,r[24]=MTKmessageNode,r[6]=i'],['r[15]!==b?(l=b?','r[15]!==b||r[23]!==MTKmessageNode?(l=MTKmessageNode??(b?'],['threadId:m}):null,r[7]=u,','threadId:m}):null),r[7]=u,'],['r[15]=b,r[16]=l','r[15]=b,r[23]=MTKmessageNode,r[16]=l'],['(ee,{conversationId:r,label:n,message:d,','(ee,{conversationId:r,label:n,message:d,messageNode:MTKtinrelayPointerNode(d,u),']];
 if(command==='check'&&!source.includes('MTKsourceTitle')){
  for(const fragment of ['function tn(e){let t,n,i,l,o=(0,s.c)(13),','function ee(e){let t,n,i,l,o,r=(0,s.c)(21),','compactActions:x,onLabelClick:v}=e,y='])one(source,fragment);
  mainMessageBinding(native);
  return{state:'needs-apply',client:null,localShip:null,shipResolution:null,targets:[target.file,main].map(f=>path.relative(root,f))};
 }
 const applied=source.includes(helper)&&pairs.every(([,a])=>count(source,a)===1)&&native.includes('function MTKtinrelayInspect(')&&native.includes('case`mtk-tinrelay-pointer-inspect`:');
 if(!applied){if(source.includes('MTKtinrelayPointerNode')||native.includes('function MTKtinrelayInspect('))throw Error('Partial Tinrelay incoming module patch');for(const[b]of pairs)one(source,b);if(command==='apply'){let patched=source;for(const[b,a]of pairs)patched=patched.replace(b,()=>a);writeRendererModule(target,patched+helper);fs.writeFileSync(main,patchMain(native,getConfig()));}}
 return{state:applied||command==='apply'?'applied':'needs-apply',client:null,localShip:null,shipResolution:'runtime-message-and-observer-config',targets:[target.file,main].map(f=>path.relative(root,f))};
}
export function runOutgoing26605({root,command,rendererHelpers,acceptanceParser,patchMain}){
 const o=tinrelayOwners26605(root),entries=[],add=(owner,pairs)=>entries.push({owner,source:readRendererModule(owner),pairs});
 if(command==='check'&&!readRendererModule(o.renderer).includes('function MTKtinrelayPointerNode(')){
  const source=readRendererModule(o.renderer),turn=readRendererModule(o.turn),activity=readRendererModule(o.activity);
  for(const fragment of [source.includes('function MTKOutboundTurnReceipts(')?'W=(0,s.c)(493),':'W=(0,s.c)(492),','(0,a.jsx)(tF,{conversationId:eo,isReadOnly:eu,item:J,','hideRawCommand:s,toolActivityTurnKey:e2}'])one(source,fragment);
  one(turn,'turnId:tx,clientUserMessageId:tI');one(activity,'"dynamic-tool-call"===i.type&&(0,c.Q1)(i)');
  for(const[index,target]of o.classifiers.entries())one(readRendererModule(target),classifier26605(index));
  return{state:'needs-apply',localShip:null,shipResolution:null,targets:[o.renderer.file,o.turn.file,o.activity.file,...o.classifiers.map(x=>x.file),mainProcessAsset(root)].map(f=>path.relative(root,f))};
 }
 const helper=';'+rendererHelpers('MTKtinrelayBus','MTKtinrelayJsx')+'n.d(t,{MTKtinrelayOutgoingTurnPresentations:()=>MTKtinrelayOutgoingTurnPresentations});';
 add(o.renderer,[['W=(0,s.c)(493),','W=(0,s.c)(494),'],['W[327]!==s||W[328]!==e2?(e=(0,a.jsx)(tF,{','W[327]!==s||W[328]!==e2||W[493]!==eA?(e=(0,a.jsx)(MTKtinrelayOutgoingExec,{Component:tF,'],['hideRawCommand:s,toolActivityTurnKey:e2}','hideRawCommand:s,toolActivityTurnKey:e2,sourceThreadId:eo,sourceTurnId:eA}'],['W[327]=s,W[328]=e2,W[329]=e','W[327]=s,W[328]=e2,W[493]=eA,W[329]=e'],[null,helper]]);
 for(const[index,target]of o.classifiers.entries()){
  const before=classifier26605(index),call=index===0?'u(d(e),(0,r.LS)(e)?"standalone":"groupable");':'c(d(e),(0,r.LS)(e)?"standalone":"groupable");',
    after='case"exec":return '+call.replace('?"standalone"','?"standalone"').replace('(0,r.LS)(e)?','MTKtinrelayOutgoingAcceptance(e)!=null?"standalone":'+('(0,r.LS)(e)?'))+'case"patch":return '+call;
  add(target,[[before,after],[null,';'+acceptanceParser()]]);
 }
 add(o.activity,[['"dynamic-tool-call"===i.type&&(0,c.Q1)(i)','"exec"===i.type&&MTKtinrelayOutgoingAcceptance(i)!=null||"dynamic-tool-call"===i.type&&(0,c.Q1)(i)'],[null,';'+acceptanceParser()]]);
 const finished='!s_&&(tS.status==="cancelled"||rO?.completed===!0&&rO?.phase==="final_answer")';
 add(o.turn,[['iT("mtk-outbound-turn-receipts",','iT("mtk-tinrelay-outgoing-turn-presentations",(0,s.jsx)(MTKtinrelayOutgoingTurnPresentations,{conversationId:to,turnId:tx,turnFinished:'+finished+'}),{canOwnLatestTurnFollowContent:!1});iT("mtk-outbound-turn-receipts",'],['conversationId:to,sourceTurnId:tx,','conversationId:to,sourceTurnId:tx,sourceTurnFinished:'+finished+','],['n=(0,r.c)(53),{messageActions:','n=(0,r.c)(54),{messageActions:'],['conversationId:p,sourceTurnId:MTKsourceTurnId,','conversationId:p,sourceTurnId:MTKsourceTurnId,sourceTurnFinished:MTKsourceTurnFinished,'],['n[52]!==MTKsourceTurnId){let e=[],r=G,','n[52]!==MTKsourceTurnId||n[53]!==MTKsourceTurnFinished){let e=[],r=G,'],[',o("mtk-outbound-turn-receipts",',',o("mtk-tinrelay-outgoing-turn-presentations",(0,s.jsx)(MTKtinrelayOutgoingTurnPresentations,{conversationId:p,turnId:MTKsourceTurnId,turnFinished:MTKsourceTurnFinished}),{canOwnLatestTurnFollowContent:!1,isResponseContent:!1}),o("mtk-outbound-turn-receipts",'],['n[52]=MTKsourceTurnId,n[51]=t','n[52]=MTKsourceTurnId,n[53]=MTKsourceTurnFinished,n[51]=t'],[null,';const MTKtinrelayOutgoingTurnPresentations=n("kaM7").MTKtinrelayOutgoingTurnPresentations;']]);
 const main=mainProcessAsset(root),native=fs.readFileSync(main,'utf8');const applied=entries.every(e=>e.pairs.every(([,a])=>count(e.source,a)===1))&&native.includes('function MTKtinrelayStartOutgoingObserver(')&&native.includes('case`mtk-tinrelay-outgoing-lookup`:');
 if(!applied){for(const e of entries){if(e.source.includes('MTKtinrelayOutgoingAcceptance'))throw Error('Partial Tinrelay outgoing modules');for(const[b]of e.pairs)if(b!==null)one(e.source,b);}if(command==='apply'){for(const e of entries){let s=e.source;for(const[b,a]of e.pairs)s=b===null?s+a:s.replace(b,()=>a);writeRendererModule(e.owner,s);}fs.writeFileSync(main,patchMain(native));}}
 return{state:applied||command==='apply'?'applied':'needs-apply',localShip:null,shipResolution:'runtime-observer-config',targets:[...new Set([...entries.map(e=>e.owner.file),main])].map(f=>path.relative(root,f))};
}
function count(s,v){return s.split(v).length-1}function one(s,v){if(count(s,v)!==1)throw Error('Upstream changed: Tinrelay module contract '+v)}

function classifier26605(index){return index===0?'case"exec":case"patch":return u(d(e),(0,r.LS)(e)?"standalone":"groupable");':'case"exec":case"patch":return c(d(e),(0,r.LS)(e)?"standalone":"groupable");'}

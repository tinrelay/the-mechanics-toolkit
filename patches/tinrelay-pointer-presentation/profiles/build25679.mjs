import fs from 'node:fs';import path from 'node:path';import{readRendererModule,writeRendererModule}from '../../../src/renderer-module.mjs';import{mainProcessAsset,mainLoggerOwner,mainMessageAnchor}from '../../../src/main-process-asset.mjs';import{waitOwners25679}from '../../wait-thread-roster/profiles/build25679.mjs';import{mainMessageBinding}from '../main-message-binding.mjs';import{attributionOwner25679}from '../../cross-task-attribution/profiles/build25679.mjs';import{reasoningOwners25679}from '../../reasoning-retention/profiles/build25679.mjs';
export function tinrelayOwners25679(root){return{renderer:attributionOwner25679(root),turn:reasoningOwners25679(root).turn,activity:reasoningOwners25679(root).toggle,classifiers:waitOwners25679(root).map(o=>({...o,id:'NQNw'}))}}
export function runIncoming25679({root,command,rendererHelpers,patchMain,getConfig}){
 const target=attributionOwner25679(root),main=mainProcessAsset(root),source=readRendererModule(target),native=fs.readFileSync(main,'utf8');
 for(const contract of ['_=n("y5H2")','(0,a.jsx)(_.R,{alignment:y,accentColor:u,message:p,'])one(source,contract);
 const helper=';const MTKtinrelayReact=n("zd8w"),MTKtinrelayJsx=n("ABep"),MTKtinrelayBus=n("TL6G").O1,MTKtinrelayMessageComponent=_.R;'+rendererHelpers('MTKtinrelayBus',{helperJsx:'MTKtinrelayJsx',messageComponent:'MTKtinrelayMessageComponent'});
 const pairs=[['r=(0,s.c)(23),{label:c,alignment:d','r=(0,s.c)(25),{label:c,alignment:d'],['paletteSourceTitle:MTKsourceTitle,paletteSourceId:MTKsourceId}=e,y=','paletteSourceTitle:MTKsourceTitle,paletteSourceId:MTKsourceId,messageNode:MTKmessageNode}=e,y='],['r[4]!==c||r[5]!==v?(i=v?','r[4]!==c||r[5]!==v||r[24]!==MTKmessageNode?(i=MTKmessageNode?null:v?'],['r[4]=c,r[5]=v,r[6]=i','r[4]=c,r[5]=v,r[24]=MTKmessageNode,r[6]=i'],['r[15]!==w?(l=w?','r[15]!==w||r[23]!==MTKmessageNode?(l=MTKmessageNode??(w?'],['threadId:m}):null,r[7]=u,','threadId:m}):null),r[7]=u,'],['r[15]=w,r[16]=l','r[15]=w,r[23]=MTKmessageNode,r[16]=l'],['(J,{conversationId:r,label:n,message:d,','(J,{conversationId:r,label:n,message:d,messageNode:MTKtinrelayPointerNode(d,u),']];
 if(command==='check'&&!source.includes('MTKsourceTitle')){
  for(const fragment of ['function e5(e){let t,n,i,l,o=(0,s.c)(13),','function J(e){let t,n,i,l,o,r=(0,s.c)(21),','compactActions:x,onLabelClick:v}=e,y='])one(source,fragment);
  mainMessageBinding(native);
  return{state:'needs-apply',client:null,localShip:null,shipResolution:null,targets:[target.file,main].map(f=>path.relative(root,f))};
 }
 const applied=source.includes(helper)&&pairs.every(([,a])=>count(source,a)===1)&&native.includes('function MTKtinrelayInspect(')&&native.includes('case`mtk-tinrelay-pointer-inspect`:');
 if(!applied){if(source.includes('MTKtinrelayPointerNode')||native.includes('function MTKtinrelayInspect('))throw Error('Partial Tinrelay incoming module patch');for(const[b]of pairs)one(source,b);if(command==='apply'){let patched=source;for(const[b,a]of pairs)patched=patched.replace(b,()=>a);writeRendererModule(target,patched+helper);fs.writeFileSync(main,patchMain(native,getConfig()));}}
 return{state:applied||command==='apply'?'applied':'needs-apply',client:null,localShip:null,shipResolution:'runtime-message-and-observer-config',targets:[target.file,main].map(f=>path.relative(root,f))};
}
export function runOutgoing25679({root,command,rendererHelpers,acceptanceParser,patchMain}){
 const o=tinrelayOwners25679(root),entries=[],add=(owner,pairs)=>entries.push({owner,source:readRendererModule(owner),pairs});
 if(command==='check'&&!readRendererModule(o.renderer).includes('function MTKtinrelayPointerNode(')){
  const source=readRendererModule(o.renderer),turn=readRendererModule(o.turn),activity=readRendererModule(o.activity);
  for(const fragment of [source.includes('function MTKOutboundTurnReceipts(')?'B=(0,s.c)(437),':'B=(0,s.c)(436),','(0,a.jsx)(tN,{conversationId:es,isReadOnly:er,item:Z,','hideRawCommand:tG,toolActivityTurnKey:eY}'])one(source,fragment);
  one(turn,'turnId:tg,clientUserMessageId:th');one(activity,'"dynamic-tool-call"===l.type&&(0,p.Q1)(l)');
  for(const[index,target]of o.classifiers.entries())one(readRendererModule(target),classifier25679(index));
  return{state:'needs-apply',localShip:null,shipResolution:null,targets:[o.renderer.file,o.turn.file,o.activity.file,...o.classifiers.map(x=>x.file),mainProcessAsset(root)].map(f=>path.relative(root,f))};
 }
 const helper=';'+rendererHelpers('MTKtinrelayBus','MTKtinrelayJsx')+'n.d(t,{MTKtinrelayOutgoingTurnPresentations:()=>MTKtinrelayOutgoingTurnPresentations});';
 add(o.renderer,[['B=(0,s.c)(437),','B=(0,s.c)(438),'],['B[321]!==tG?(e=(0,a.jsx)(tN,{','B[321]!==tG||B[437]!==ew?(e=(0,a.jsx)(MTKtinrelayOutgoingExec,{Component:tN,'],['hideRawCommand:tG,toolActivityTurnKey:eY}','hideRawCommand:tG,toolActivityTurnKey:eY,sourceThreadId:es,sourceTurnId:ew}'],['B[321]=tG,B[322]=e','B[321]=tG,B[437]=ew,B[322]=e'],[null,helper]]);
 for(const[index,target]of o.classifiers.entries()){
  const before=classifier25679(index),call=index===2?'d(u(e),(0,s.LS)(e)?"standalone":"groupable");':'c(d(e),(0,r.LS)(e)?"standalone":"groupable");',
    after='case"exec":return '+call.replace('?"standalone"','?"standalone"').replace(index===2?'(0,s.LS)(e)?':'(0,r.LS)(e)?','MTKtinrelayOutgoingAcceptance(e)!=null?"standalone":'+(index===2?'(0,s.LS)(e)?':'(0,r.LS)(e)?'))+'case"patch":return '+call;
  add(target,[[before,after],[null,';'+acceptanceParser()]]);
 }
 add(o.activity,[['"dynamic-tool-call"===l.type&&(0,p.Q1)(l)','"exec"===l.type&&MTKtinrelayOutgoingAcceptance(l)!=null||"dynamic-tool-call"===l.type&&(0,p.Q1)(l)'],[null,';'+acceptanceParser()]]);
 const finished='!sp&&(ty.status==="cancelled"||rg?.completed===!0&&rg?.phase==="final_answer")';
 add(o.turn,[['i9("mtk-outbound-turn-receipts",','i9("mtk-tinrelay-outgoing-turn-presentations",(0,s.jsx)(MTKtinrelayOutgoingTurnPresentations,{conversationId:tc,turnId:tg,turnFinished:'+finished+'}),{canOwnLatestTurnFollowContent:!1});i9("mtk-outbound-turn-receipts",'],['conversationId:tc,sourceTurnId:tg,','conversationId:tc,sourceTurnId:tg,sourceTurnFinished:'+finished+','],['n=(0,r.c)(52),{messageActions:','n=(0,r.c)(53),{messageActions:'],['conversationId:u,sourceTurnId:MTKsourceTurnId,','conversationId:u,sourceTurnId:MTKsourceTurnId,sourceTurnFinished:MTKsourceTurnFinished,'],['n[51]!==MTKsourceTurnId){let e=[],r=G,','n[51]!==MTKsourceTurnId||n[52]!==MTKsourceTurnFinished){let e=[],r=G,'],[',c("mtk-outbound-turn-receipts",',',c("mtk-tinrelay-outgoing-turn-presentations",(0,s.jsx)(MTKtinrelayOutgoingTurnPresentations,{conversationId:u,turnId:MTKsourceTurnId,turnFinished:MTKsourceTurnFinished}),{canOwnLatestTurnFollowContent:!1,isResponseContent:!1}),c("mtk-outbound-turn-receipts",'],['n[51]=MTKsourceTurnId,n[50]=t','n[51]=MTKsourceTurnId,n[52]=MTKsourceTurnFinished,n[50]=t'],[null,';const MTKtinrelayOutgoingTurnPresentations=n("O3Io").MTKtinrelayOutgoingTurnPresentations;']]);
 const main=mainProcessAsset(root),native=fs.readFileSync(main,'utf8');const applied=entries.every(e=>e.pairs.every(([,a])=>count(e.source,a)===1))&&native.includes('function MTKtinrelayStartOutgoingObserver(')&&native.includes('case`mtk-tinrelay-outgoing-lookup`:');
 if(!applied){for(const e of entries){if(e.source.includes('MTKtinrelayOutgoingAcceptance'))throw Error('Partial Tinrelay outgoing modules');for(const[b]of e.pairs)if(b!==null)one(e.source,b);}if(command==='apply'){for(const e of entries){let s=e.source;for(const[b,a]of e.pairs)s=b===null?s+a:s.replace(b,()=>a);writeRendererModule(e.owner,s);}fs.writeFileSync(main,patchMain(native));}}
 return{state:applied||command==='apply'?'applied':'needs-apply',localShip:null,shipResolution:'runtime-observer-config',targets:[...new Set([...entries.map(e=>e.owner.file),main])].map(f=>path.relative(root,f))};
}
function count(s,v){return s.split(v).length-1}function one(s,v){if(count(s,v)!==1)throw Error('Upstream changed: Tinrelay module contract '+v)}

function classifier25679(index){return index===2?'case"exec":case"patch":return d(u(e),(0,s.LS)(e)?"standalone":"groupable");':'case"exec":case"patch":return c(d(e),(0,r.LS)(e)?"standalone":"groupable");'}

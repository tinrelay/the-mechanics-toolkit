import fs from 'node:fs';import path from 'node:path';import{readRendererModule,writeRendererModule}from '../../../src/renderer-module.mjs';import{mainProcessAsset,mainLoggerOwner,mainMessageAnchor}from '../../../src/main-process-asset.mjs';import{waitOwners28661}from '../../wait-thread-roster/profiles/build28661.mjs';import{mainMessageBinding}from '../main-message-binding.mjs';import{attributionOwner28661}from '../../cross-task-attribution/profiles/build28661.mjs';import{reasoningOwners28661}from '../../reasoning-retention/profiles/build28661.mjs';
export function tinrelayOwners28661(root){return{renderer:attributionOwner28661(root),turn:reasoningOwners28661(root).turn,activity:{file:path.join(root,"webview/assets/async/461952.e510c5b516.js"),id:"QypQ",parameters:["e","t","n"]},classifiers:waitOwners28661(root).map(o=>({...o,id:'NQNw'}))}}
export function runIncoming28661({root,command,rendererHelpers,patchMain,getConfig}){
 const target=attributionOwner28661(root),main=mainProcessAsset(root),source=readRendererModule(target),native=fs.readFileSync(main,'utf8');
 for(const contract of ['R=n("y5H2")',"(0,a.jsx)(R.R,{alignment:y,accentColor:u,message:p,"])one(source,contract);
 const helper=';const MTKtinrelayReact=n("zd8w"),MTKtinrelayJsx=n("ABep"),MTKtinrelayBus=n("TL6G").O1,MTKtinrelayMessageComponent=R.R;'+rendererHelpers('MTKtinrelayBus',{helperJsx:'MTKtinrelayJsx',messageComponent:'MTKtinrelayMessageComponent'});
 const pairs=[['o=(0,i.c)(23),{label:c,alignment:d','o=(0,i.c)(25),{label:c,alignment:d'],['paletteSourceTitle:MTKsourceTitle,paletteSourceId:MTKsourceId}=e,y=','paletteSourceTitle:MTKsourceTitle,paletteSourceId:MTKsourceId,messageNode:MTKmessageNode}=e,y='],['o[4]!==c||o[5]!==v?(s=v?','o[4]!==c||o[5]!==v||o[24]!==MTKmessageNode?(s=MTKmessageNode?null:v?'],['o[4]=c,o[5]=v,o[6]=s','o[4]=c,o[5]=v,o[24]=MTKmessageNode,o[6]=s'],['o[15]!==b?(l=b?','o[15]!==b||o[23]!==MTKmessageNode?(l=MTKmessageNode??(b?'],['threadId:m}):null,o[7]=u,','threadId:m}):null),o[7]=u,'],['o[15]=b,o[16]=l','o[15]=b,o[23]=MTKmessageNode,o[16]=l'],['(ee,{conversationId:o,label:n,message:d,','(ee,{conversationId:o,label:n,message:d,messageNode:MTKtinrelayPointerNode(d,u),']];
 if(command==='check'&&!source.includes('MTKsourceTitle')){
  for(const fragment of ['function tt(e){let t,n,s,l,r=(0,i.c)(13),','function ee(e){let t,n,s,l,r,o=(0,i.c)(21),','compactActions:x,onLabelClick:v}=e,y='])one(source,fragment);
  mainMessageBinding(native);
  return{state:'needs-apply',client:null,localShip:null,shipResolution:null,targets:[target.file,main].map(f=>path.relative(root,f))};
 }
 const applied=source.includes(helper)&&pairs.every(([,a])=>count(source,a)===1)&&native.includes('function MTKtinrelayInspect(')&&native.includes('case`mtk-tinrelay-pointer-inspect`:');
 if(!applied){if(source.includes('MTKtinrelayPointerNode')||native.includes('function MTKtinrelayInspect('))throw Error('Partial Tinrelay incoming module patch');for(const[b]of pairs)one(source,b);if(command==='apply'){let patched=source;for(const[b,a]of pairs)patched=patched.replace(b,()=>a);writeRendererModule(target,patched+helper);fs.writeFileSync(main,patchMain(native,getConfig()));}}
 return{state:applied||command==='apply'?'applied':'needs-apply',client:null,localShip:null,shipResolution:'runtime-message-and-observer-config',targets:[target.file,main].map(f=>path.relative(root,f))};
}
export function runOutgoing28661({root,command,rendererHelpers,acceptanceParser,patchMain}){
 const o=tinrelayOwners28661(root),entries=[],add=(owner,pairs)=>entries.push({owner,source:readRendererModule(owner),pairs});
 if(command==='check'&&!readRendererModule(o.renderer).includes('function MTKtinrelayPointerNode(')){
  const source=readRendererModule(o.renderer),turn=readRendererModule(o.turn),activity=readRendererModule(o.activity);
  for(const fragment of [source.includes('function MTKOutboundTurnReceipts(')?'B=(0,i.c)(452),':'B=(0,i.c)(451),','(0,a.jsx)(t_,{nestedInActivityGroup:tk,conversationId:er,isReadOnly:eu,item:Q,','hideRawCommand:t$,toolActivityTurnKey:e1}'])one(source,fragment);
  one(turn,'turnId:k,clientUserMessageId:C');one(activity,'"dynamic-tool-call"===s.type&&(0,h.Q1)(s)');
  for(const[index,target]of o.classifiers.entries())one(readRendererModule(target),classifier28661(index));
  return{state:'needs-apply',localShip:null,shipResolution:null,targets:[o.renderer.file,o.turn.file,o.activity.file,...o.classifiers.map(x=>x.file),mainProcessAsset(root)].map(f=>path.relative(root,f))};
 }
 const helper=';'+rendererHelpers('MTKtinrelayBus','MTKtinrelayJsx')+'n.d(t,{MTKtinrelayOutgoingTurnPresentations:()=>MTKtinrelayOutgoingTurnPresentations});';
 add(o.renderer,[['B=(0,i.c)(452),','B=(0,i.c)(453),'],['B[338]!==t$?(e=(0,a.jsx)(t_,{','B[338]!==t$||B[452]!==eI?(e=(0,a.jsx)(MTKtinrelayOutgoingExec,{Component:t_,'],['hideRawCommand:t$,toolActivityTurnKey:e1}','hideRawCommand:t$,toolActivityTurnKey:e1,sourceThreadId:er,sourceTurnId:eI}'],['B[338]=t$,B[339]=e','B[338]=t$,B[452]=eI,B[339]=e'],[null,helper]]);
 for(const[index,target]of o.classifiers.entries()){
  const before=classifier28661(index),call='u(d(e),(0,r.LS)(e)?"standalone":"groupable");',
    after='case"exec":return '+call.replace('?"standalone"','?"standalone"').replace('(0,r.LS)(e)?','MTKtinrelayOutgoingAcceptance(e)!=null?"standalone":'+('(0,r.LS)(e)?'))+'case"patch":return '+call;
  add(target,[[before,after],[null,';'+acceptanceParser()]]);
 }
 add(o.activity,[["\"dynamic-tool-call\"===s.type&&(0,h.Q1)(s)","\"exec\"===s.type&&MTKtinrelayOutgoingAcceptance(s)!=null||\"dynamic-tool-call\"===s.type&&(0,h.Q1)(s)"],[null,';'+acceptanceParser()]]);
 const finished='!eG&&(T.status==="cancelled"||nQ?.completed===!0&&nQ?.phase==="final_answer")';
 add(o.turn,[['rF("mtk-outbound-turn-receipts",','rF("mtk-tinrelay-outgoing-turn-presentations",(0,s.jsx)(MTKtinrelayOutgoingTurnPresentations,{conversationId:x,turnId:k,turnFinished:'+finished+'}),{canOwnLatestTurnFollowContent:!1});rF("mtk-outbound-turn-receipts",'],['conversationId:x,sourceTurnId:k,','conversationId:x,sourceTurnId:k,sourceTurnFinished:'+finished+','],['n=(0,r.c)(51),{messageActions:','n=(0,r.c)(52),{messageActions:'],['conversationId:p,sourceTurnId:MTKsourceTurnId,','conversationId:p,sourceTurnId:MTKsourceTurnId,sourceTurnFinished:MTKsourceTurnFinished,'],['n[50]!==MTKsourceTurnId){let e=[],r=G,','n[50]!==MTKsourceTurnId||n[51]!==MTKsourceTurnFinished){let e=[],r=G,'],['l("mtk-outbound-turn-receipts",','l("mtk-tinrelay-outgoing-turn-presentations",(0,s.jsx)(MTKtinrelayOutgoingTurnPresentations,{conversationId:p,turnId:MTKsourceTurnId,turnFinished:MTKsourceTurnFinished}),{canOwnLatestTurnFollowContent:!1,isResponseContent:!1}),l("mtk-outbound-turn-receipts",'],['n[50]=MTKsourceTurnId,n[49]=t','n[50]=MTKsourceTurnId,n[51]=MTKsourceTurnFinished,n[49]=t'],[null,';const MTKtinrelayOutgoingTurnPresentations=n("nZSc").MTKtinrelayOutgoingTurnPresentations;']]);
 const main=mainProcessAsset(root),native=fs.readFileSync(main,'utf8');const applied=entries.every(e=>e.pairs.every(([,a])=>count(e.source,a)===1))&&native.includes('function MTKtinrelayStartOutgoingObserver(')&&native.includes('case`mtk-tinrelay-outgoing-lookup`:');
 if(!applied){for(const e of entries){if(e.source.includes('MTKtinrelayOutgoingAcceptance'))throw Error('Partial Tinrelay outgoing modules');for(const[b]of e.pairs)if(b!==null)one(e.source,b);}if(command==='apply'){for(const e of entries){let s=e.source;for(const[b,a]of e.pairs)s=b===null?s+a:s.replace(b,()=>a);writeRendererModule(e.owner,s);}fs.writeFileSync(main,patchMain(native));}}
 return{state:applied||command==='apply'?'applied':'needs-apply',localShip:null,shipResolution:'runtime-observer-config',targets:[...new Set([...entries.map(e=>e.owner.file),main])].map(f=>path.relative(root,f))};
}
function count(s,v){return s.split(v).length-1}function one(s,v){if(count(s,v)!==1)throw Error('Upstream changed: Tinrelay module contract '+v)}

function classifier28661(){return 'case"exec":case"patch":return u(d(e),(0,r.LS)(e)?"standalone":"groupable");'}

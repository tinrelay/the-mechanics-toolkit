import fs from 'node:fs';import path from 'node:path';import{readRendererModule,writeRendererModule}from '../../../src/renderer-module.mjs';import{mainProcessAsset,mainLoggerOwner,mainMessageAnchor}from '../../../src/main-process-asset.mjs';import{waitOwners29513}from '../../wait-thread-roster/profiles/build29513.mjs';import{mainMessageBinding}from '../main-message-binding.mjs';import{attributionOwner29513}from '../../cross-task-attribution/profiles/build29513.mjs';import{reasoningOwners29513}from '../../reasoning-retention/profiles/build29513.mjs';
export function tinrelayOwners29513(root){return{renderer:attributionOwner29513(root),history:{file:attributionOwner29513(root).file,id:"fw8Z",parameters:["e","t","n"]},turn:reasoningOwners29513(root).turn,activity:{file:path.join(root,"webview/assets/async/154721.eecc3b7249.js"),id:"lAsD",parameters:["e","t","n"]},classifiers:waitOwners29513(root).map(o=>({...o,id:'NQNw'}))}}
export function runIncoming29513({root,command,rendererHelpers,patchMain,getConfig}){
 const target=attributionOwner29513(root),main=mainProcessAsset(root),source=readRendererModule(target),native=fs.readFileSync(main,'utf8');
 for(const contract of ['R=n("y5H2")',"(0,a.jsx)(R.R,{alignment:y,accentColor:u,message:p,"])one(source,contract);
 const helper=';const MTKtinrelayReact=n("zd8w"),MTKtinrelayJsx=n("ABep"),MTKtinrelayBus=n("TL6G").O1,MTKtinrelayMessageComponent=R.R;'+rendererHelpers('MTKtinrelayBus',{helperJsx:'MTKtinrelayJsx',messageComponent:'MTKtinrelayMessageComponent'});
 const pairs=[["o=(0,i.c)(23),{label:c,alignment:d", "o=(0,i.c)(25),{label:c,alignment:d"], ["paletteSourceTitle:MTKsourceTitle,paletteSourceId:MTKsourceId}=e,y=", "paletteSourceTitle:MTKsourceTitle,paletteSourceId:MTKsourceId,messageNode:MTKmessageNode}=e,y="], ["o[4]!==c||o[5]!==v?(l=v?", "o[4]!==c||o[5]!==v||o[24]!==MTKmessageNode?(l=MTKmessageNode?null:v?"], ["o[4]=c,o[5]=v,o[6]=l", "o[4]=c,o[5]=v,o[24]=MTKmessageNode,o[6]=l"], ["o[15]!==b?(s=b?", "o[15]!==b||o[23]!==MTKmessageNode?(s=MTKmessageNode??(b?"], ["threadId:m}):null,o[7]=u,", "threadId:m}):null),o[7]=u,"], ["o[15]=b,o[16]=s", "o[15]=b,o[23]=MTKmessageNode,o[16]=s"], ["(Y,{conversationId:o,label:n,message:d,", "(Y,{conversationId:o,label:n,message:d,messageNode:MTKtinrelayPointerNode(d,u),"]];
 if(command==='check'&&!source.includes('MTKsourceTitle')){
  for(const fragment of ['function eX(e){let t,n,l,s,r=(0,i.c)(13),','function Y(e){let t,n,l,s,r,o=(0,i.c)(21),','compactActions:x,onLabelClick:v}=e,y='])one(source,fragment);
  mainMessageBinding(native);
  return{state:'needs-apply',client:null,localShip:null,shipResolution:null,targets:[target.file,main].map(f=>path.relative(root,f))};
 }
 const applied=source.includes(helper)&&pairs.every(([,a])=>count(source,a)===1)&&native.includes('function MTKtinrelayInspect(')&&native.includes('case`mtk-tinrelay-pointer-inspect`:');
 if(!applied){if(source.includes('MTKtinrelayPointerNode')||native.includes('function MTKtinrelayInspect('))throw Error('Partial Tinrelay incoming module patch');for(const[b]of pairs)one(source,b);if(command==='apply'){let patched=source;for(const[b,a]of pairs)patched=patched.replace(b,()=>a);writeRendererModule(target,patched+helper);fs.writeFileSync(main,patchMain(native,getConfig()));}}
 return{state:applied||command==='apply'?'applied':'needs-apply',client:null,localShip:null,shipResolution:'runtime-message-and-observer-config',targets:[target.file,main].map(f=>path.relative(root,f))};
}
export function runOutgoing29513({root,command,rendererHelpers,acceptanceParser,patchMain}){
 const o=tinrelayOwners29513(root),entries=[],add=(owner,pairs)=>entries.push({owner,source:readRendererModule(owner),pairs});
 if(command==='check'&&!readRendererModule(o.renderer).includes('function MTKtinrelayPointerNode(')){
  const source=readRendererModule(o.renderer),turn=readRendererModule(o.turn),activity=readRendererModule(o.activity);
  for(const fragment of [source.includes('function MTKOutboundTurnReceipts(')?'B=(0,i.c)(459),':'B=(0,i.c)(458),',"(0,a.jsx)(tw,{nestedInActivityGroup:tC,conversationId:ei,isReadOnly:er,item:q,",'hideRawCommand:tF,activityDisclosureScope:e2,toolActivityTurnKey:e0}'])one(source,fragment);
  const history=readRendererModule(o.history);for(const contract of ['n.d(t,{SY:()=>C,wZ:()=>k})','y=n("z9Cz")','function C(e){var t;let n,l,s,r,o,c,d,u,m,p=(0,i.c)(30);','outputKey:j,output:n','aggregatedOutput:"",exitCode:k.exitCode'])one(history,contract);
  one(turn,"turnId:ty,clientUserMessageId:tv");one(activity,'(0,m.Gx)(a.item.item,u)');
  for(const[index,target]of o.classifiers.entries())one(readRendererModule(target),classifier29513(index));
  return{state:'needs-apply',localShip:null,shipResolution:null,targets:[o.renderer.file,o.turn.file,o.activity.file,...o.classifiers.map(x=>x.file),mainProcessAsset(root)].map(f=>path.relative(root,f))};
 }
 const helper=';'+rendererHelpers('MTKtinrelayBus','MTKtinrelayJsx')+'n.d(t,{MTKtinrelayOutgoingTurnPresentations:()=>MTKtinrelayOutgoingTurnPresentations,MTKtinrelayOutgoingExec:()=>MTKtinrelayOutgoingExec});';
 add(o.renderer,[[null,helper]]);
 const historyOwner='function C(e){var t;let n,l,s,r,o,c,d,u,m,p=(0,i.c)(30);';
 const historyWrapper='function C(e){return "exec"===e.item.type?(0,a.jsx)(y.MTKtinrelayOutgoingExec,{...e,Component:MTKtinrelayNativeHistoryItem,sourceThreadId:e.conversationId,sourceTurnId:typeof e.toolActivityTurnKey==="string"&&e.toolActivityTurnKey.startsWith(e.conversationId+"\\0")?e.toolActivityTurnKey.slice(e.conversationId.length+1):void 0}):(0,a.jsx)(MTKtinrelayNativeHistoryItem,e)}';
 add(o.history,[[historyOwner,historyOwner.replace('function C(', 'function MTKtinrelayNativeHistoryItem(')],[null,historyWrapper]]);
 for(const[index,target]of o.classifiers.entries()){
  const before=classifier29513(index),call=before.slice('case"exec":case"patch":return '.length),
    after='case"exec":return '+call.replace(/(\(0,[\w$]+\.LS\)\(e\))\?/, 'MTKtinrelayOutgoingAcceptance(e)!=null?"standalone":$1?')+'case"patch":return '+call;
  add(target,[[before,after],[null,';'+acceptanceParser()]]);
 }
 add(o.activity,[["(0,m.Gx)(a.item.item,u)","MTKtinrelayOutgoingAcceptance(a.item.item)!=null||(0,m.Gx)(a.item.item,u)"],[null,';'+acceptanceParser()]]);
 const finished='!sr&&(tx.status==="cancelled"||lr?.completed===!0&&lr?.phase==="final_answer")';
 add(o.turn,[['r6("mtk-outbound-turn-receipts",','r6("mtk-tinrelay-outgoing-turn-presentations",(0,s.jsx)(MTKtinrelayOutgoingTurnPresentations,{conversationId:tm,turnId:ty,turnFinished:'+finished+'}),{canOwnLatestTurnFollowContent:!1,isResponseContent:!1});r6("mtk-outbound-turn-receipts",'],[null,';const MTKtinrelayOutgoingTurnPresentations=n("z9Cz").MTKtinrelayOutgoingTurnPresentations;']]);
 const main=mainProcessAsset(root),native=fs.readFileSync(main,'utf8');const applied=entries.every(e=>e.pairs.every(([,a])=>count(e.source,a)===1))&&native.includes('function MTKtinrelayStartOutgoingObserver(')&&native.includes('case`mtk-tinrelay-outgoing-lookup`:');
 if(!applied){for(const e of entries){if(e.source.includes('MTKtinrelayOutgoingAcceptance'))throw Error('Partial Tinrelay outgoing modules');for(const[b]of e.pairs)if(b!==null)one(e.source,b);}if(command==='apply'){for(const e of entries){let s=e.source;for(const[b,a]of e.pairs)s=b===null?s+a:s.replace(b,()=>a);writeRendererModule(e.owner,s);}fs.writeFileSync(main,patchMain(native));}}
 return{state:applied||command==='apply'?'applied':'needs-apply',localShip:null,shipResolution:'runtime-observer-config',targets:[...new Set([...entries.map(e=>e.owner.file),main])].map(f=>path.relative(root,f))};
}
function count(s,v){return s.split(v).length-1}function one(s,v){if(count(s,v)!==1)throw Error('Upstream changed: Tinrelay module contract '+v)}

function classifier29513(index){return ["case\"exec\":case\"patch\":return u(d(e),(0,i.LS)(e)?\"standalone\":\"groupable\");", "case\"exec\":case\"patch\":return u(c(e),(0,o.LS)(e)?\"standalone\":\"groupable\");", "case\"exec\":case\"patch\":return u(d(e),(0,r.LS)(e)?\"standalone\":\"groupable\");", "case\"exec\":case\"patch\":return c(u(e),(0,i.LS)(e)?\"standalone\":\"groupable\");", "case\"exec\":case\"patch\":return d(u(e),(0,r.LS)(e)?\"standalone\":\"groupable\");"][index];}

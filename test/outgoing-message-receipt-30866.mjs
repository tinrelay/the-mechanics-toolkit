import assert from 'node:assert/strict';import fs from 'node:fs';import os from 'node:os';import path from 'node:path';import{createRequire}from'node:module';import{randomUUID}from'node:crypto';import{parse}from'acorn';
import{readRendererModule}from'../src/renderer-module.mjs';import{mainProcessAsset}from'../src/main-process-asset.mjs';import{receiptOwners30866}from'../patches/outgoing-message-receipt/profiles/build30866.mjs';import{waitProfiles30866}from'../patches/wait-thread-roster/profiles/build30866.mjs';
export async function probeReceipts30866(root){
 const o=receiptOwners30866(root),jsx={jsx:(type,props,key)=>({type,props,key}),jsxs:(type,props,key)=>({type,props,key})};function Receipt(){}function Actions(){}
 const packagedExports=new Map,forwardedExports=new Map;
 for(const file of ['../727403.b9dd20a8a9.js','../348410.f0081c7d18.js','142457.040a30ed8d.js','366996.9782070574.js','49792.d8d33ace73.js','407859.bb57f12697.js','990214.12d3fdf6e7.js']){
  const source=fs.readFileSync(path.join(root,'webview/assets/async',file),'utf8');
  const tree=parse(source,{ecmaVersion:'latest',sourceType:'module'});
  const modules=tree.body.flatMap(node=>node.declaration?.declarations??node.declarations??[]).find(node=>node.id.name===(file.includes('348410.')?'l':'__webpack_modules__')).init.properties;
  for(const module of modules){
   const exports=new Set;
   walk(module.value.body,call=>{
    if(call.type==='AssignmentExpression'&&call.left?.object?.name===module.value.params[1]?.name&&call.left.property?.type==='Identifier')exports.add(call.left.property.name);
    if(call.type==='AssignmentExpression'&&call.left?.object?.name===module.value.params[0]?.name&&call.left.property?.name==='exports'&&call.right?.type==='CallExpression'&&call.right.callee?.name===module.value.params[2]?.name)forwardedExports.set(module.key.name??module.key.value,call.right.arguments[0]?.value);
    if(call.type==='CallExpression'&&call.callee?.property?.name==='d'&&call.arguments[0]?.name===module.value.params[1]?.name)
     for(const argument of call.arguments.slice(1).filter(value=>value.type==='ObjectExpression'))
      for(const property of argument.properties)exports.add(property.key.name??property.key.value);
   });
   packagedExports.set(module.key.name??module.key.value,exports);
  }
 }
 assert.equal(forwardedExports.get('zd8w'),'Vlts','React wrapper forwards to the packaged implementation');assert.ok(packagedExports.get('Vlts').has('useState'));packagedExports.set('zd8w',packagedExports.get('Vlts'));
 assert.equal(forwardedExports.get('ABep'),'eKDk','JSX wrapper forwards to the packaged implementation');packagedExports.set('ABep',packagedExports.get('eKDk'));
 const conversation=readRendererModule(o.conversation),start=conversation.indexOf('const MTKoutboundReceiptContract='),end=conversation.indexOf('n.d(t,{MTKOutboundTurnReceipts:',start);assert.ok(end>start);
 const listeners=new Map,dispatches=[],effects=[],realm={},react={useState:x=>[typeof x==='function'?x():x,()=>{}],useEffect:f=>effects.push(f)};
 const injectedStart=conversation.indexOf('const MTKoutboundReceipt='),injectedEnd=conversation.indexOf('const MTKoutboundReceiptContract=',injectedStart);
 assert.ok(injectedStart>=0&&injectedEnd>injectedStart,'actual conversation initializer is present');
 const initialImports={acby:{MTKoutboundReceipt:Receipt},zd8w:react,ABep:jsx,TL6G:{O1:{}},yQHm:{m:Actions}};
 const loadInitial=id=>{
  assert.ok(packagedExports.has(id),'conversation initializer requires a real packaged module: '+id);
  return new Proxy(initialImports[id]??{}, {get(value,key){assert.ok(packagedExports.get(id).has(key),'conversation initializer requires a real export: '+id+'.'+String(key));return value[key]}});
 };
 const nativeActions=readRendererModule({file:o.conversation.file,id:'yQHm',parameters:['e','t','n']});
 assert.ok(conversation.includes('ev=n("yQHm")'),'receipt reuses the existing native actions import');
 assert.ok(nativeActions.includes('m:()=>nb')&&nativeActions.includes('copyText:T')&&nativeActions.includes('sentAtMs:U')&&nativeActions.includes('timestampHoverOnly:V'),'native action component retains the receipt props');
 const initialized=Function('n','ev',conversation.slice(injectedStart,injectedEnd)+';return {Receipt:MTKoutboundReceipt,Actions:MTKReceiptActions};')(loadInitial,loadInitial('yQHm'));
 assert.equal(initialized.Receipt,Receipt);assert.equal(initialized.Actions,Actions);
 const api=Function('MTKReceiptBus','MTKOutboundReceiptReact','MTKReceiptJsx','MTKReceiptActions','MTKoutboundReceipt','globalThis','crypto',conversation.slice(start,end)+';return {remember:MTKoutboundRemember,list:MTKoutboundReceiptValues,state:MTKoutboundReceiptState,lifecycle:MTKOutboundReceiptLifecycle,view:MTKOutboundTurnReceipts};')({subscribe:(k,f)=>listeners.set(k,f),dispatchMessage:(type,payload)=>dispatches.push({type,payload})},react,jsx,Actions,Receipt,realm,{randomUUID});
 const scratch=fs.mkdtempSync(path.join(os.tmpdir(),'tmtk-receipt-30866-'));try{
  const native=fs.readFileSync(mainProcessAsset(root),'utf8'),begin=native.indexOf('const MTKoutboundReceiptContract='),ast=parse(native,{ecmaVersion:'latest',sourceType:'module'});let last;
  walk(ast,x=>{if(x.type==='FunctionDeclaration'&&x.id?.name==='MTKoutboundReceiptList')last=x});assert.ok(last&&last.end>begin);
  const makeCache=()=>Function('require','process','Buffer','td',native.slice(begin,last.end)+';return {remember:MTKoutboundReceiptRemember,list:MTKoutboundReceiptList};')(createRequire(import.meta.url),process,Buffer,{app:{getPath:()=>scratch}});
  const cache=makeCache(),record={callId:'accepted-call',contract:'outgoing-message-receipt-v1',prompt:'Coordinator → Engineer — hello',recordedAtMs:100,sourceThreadId:'source',sourceTurnId:'turn',targetHostId:'local',targetThreadId:'ada'};
  const live=api.lifecycle({item:{completed:true,success:true},record});assert.equal(live.type,Receipt);assert.equal(live.props.Actions,Actions);for(const f of effects.splice(0))f();assert.equal(dispatches.length,1);assert.equal(api.remember(record),false);assert.equal(dispatches.length,1);assert.deepEqual(api.list(api.state('source')),[]);
  const saved=cache.remember(record);assert.deepEqual(saved,record);assert.deepEqual(makeCache().list('source'),[record],'receipt survives a new native helper realm');
  listeners.get('mtk-outbound-receipt-remember-result')({requestId:dispatches[0].payload.requestId,ok:true,record:saved});assert.equal(api.lifecycle({item:{},record}),null);const view=api.view({conversationId:'source',turnId:'turn'});assert.equal(view.props.children.length,1);assert.equal(view.props.children[0].props.item.recordedAtMs,100);
  assert.deepEqual(cache.remember({...record,prompt:'different'}),record,'same call identity returns its first durable record');assert.deepEqual(makeCache().list('source'),[record]);
  for(const[index,target]of o.send.entries()){
   const source=readRendererModule(target),p=waitProfiles30866[index],nodes=parse(source,{ecmaVersion:'latest',sourceType:'module'}).body;
   const helper=nodes.filter(x=>x.type==='FunctionDeclaration'&&/^MTK(?:outbound|Outbound|renderOutbound)/.test(x.id.name)).map(x=>source.slice(x.start,x.end)).join('');
   const begin=source.indexOf('const MTKoutboundStoreHook='),end=source.indexOf(`;${p.loader}.d(t,{MTKoutboundReceipt:`,begin)+1,bindings=source.slice(begin,end);assert.ok(end>begin);
   const titleAtom={},threadAtom={};let title=null;const routed=[];const imports=id=>({'Q840':{gh:()=>({}),_U:(atom,key)=>{if(atom===titleAtom)return title;if(atom===threadAtom)return{summary:{title,cwd:'/projects/example-search'}};assert.fail('unknown title binding')}},'OWtl':{u:{}},'tl5a':{HX:titleAtom,ok:threadAtom},'slpy':{m:{Root:'tooltip-root',Content:'tooltip-content',Trigger:'tooltip-trigger'}},'zd8w':react,'jHtb':{J:'formatter'}}[id]??assert.fail('unknown import '+id));
   const values={[p.jsx]:jsx,[p.normalize.match(/,([\w$]+)\./)[1]]:{JXB:x=>x,Cv$:x=>'/new/'+x,_RT:x=>'/local/'+x},[p.hostBridge.split('.')[0]]:{O1:{dispatchHostMessage:m=>routed.push(m)}},[p.genericRender]:()=>null};
   const features={__MTK_PATCH_REGISTRY__:{apiVersion:1,packages:{crossTaskAttribution:{version:3,resolveTaskLabel:({title,cwd})=>title?.includes(' — ')?title.split(' — ')[0]:title?cwd.split('/').at(-1)+'/'+title:null},taskVisualPalette:{version:1,resolveTaskColor:()=> '#22AA44'}}}};
   let formatterLoaded=false,formatterAvailable=false;
   const packagedImports=id=>{
    if(id==='jHtb'){assert.equal(formatterAvailable,true,'formatter is required only while rendering the preview');formatterLoaded=true;}
    assert.ok(packagedExports.has(id),'receipt initializer requires a packaged module: '+id);
    const stub=imports(id);
    return new Proxy(stub,{get(value,key){assert.ok(packagedExports.get(id).has(key),'packaged export '+id+'.'+String(key));return value[key]}});
   };
   const render=Function(p.loader,'globalThis',...Object.keys(values),bindings+helper+';return MTKOutboundMessageReceipt;')(packagedImports,features,...Object.values(values));
   assert.equal(formatterLoaded,false,'cold tool initializer does not require the conversation formatter');formatterAvailable=true;
   const item={arguments:{threadId:'ada',hostId:'local',prompt:'hello'},completed:true,success:true};const collect=n=>n==null?[]:typeof n==='object'?[n,...Object.values(n.props??{}).flatMap(x=>Array.isArray(x)?x.flatMap(collect):collect(x))]:[];
   let output=render({item}),button=collect(output).find(x=>x.type==='button');assert.match(button.props.children,/^Task ada/);title='Ada — Coordinator';output=render({item});button=collect(output).find(x=>x.type==='button');assert.equal(button.props.children,'Ada','title resolves after first render');button.props.onClick({preventDefault(){},stopPropagation(){}});assert.equal(routed[0].path,'/local/ada');assert.equal(typeof output.type,'function');
   const hover=output.type(output.props);assert.equal(hover.type,'tooltip-root');assert.equal(hover.props.open,false);assert.equal(typeof hover.props.onOpenChange,'function');assert.equal(hover.props.interactive,true);assert.equal(hover.props.delayDuration,800);
   const trigger=hover.props.children[0],content=hover.props.children[1];assert.equal(trigger.type,'tooltip-trigger');assert.equal(trigger.props.children,output.props.children);assert.equal(content.type,'tooltip-content');assert.equal(content.props.maxWidth,'none');assert.equal(content.props.style.padding,0);assert.equal(content.props.children.props.style.maxWidth,output.props.tooltipMaxWidth);
   const formatted=collect(hover).find(x=>typeof x.type==='function');assert.ok(formatted,'hover contains deferred native formatted text');assert.equal(formatted.type(formatted.props).type,'formatter');assert.equal(formatterLoaded,true);
   title='ticket-inbox';button=collect(render({item})).find(x=>x.type==='button');assert.equal(button.props.children,'example-search/ticket-inbox','project comes from recipient summary');
  }
  const turn=readRendererModule(o.turn),dynamic=readRendererModule(o.dynamic);assert.ok(turn.includes('canOwnLatestTurnFollowContent:!1,isResponseContent:!1'));assert.ok(turn.includes('conversationId:ty,turnId:tw'));assert.ok(dynamic.includes('turnId:MTKsourceTurnId,ReceiptLifecycle:MTKReceiptLifecycle'));
  console.log('outgoing receipts 30866 behavior and persistence probe passed');
 }finally{fs.rmSync(scratch,{recursive:true,force:true})}
}

function walk(node,visit){if(node==null||typeof node!=='object')return;if(typeof node.type==='string')visit(node);for(const value of Object.values(node)){if(Array.isArray(value))for(const child of value)walk(child,visit);else if(value&&typeof value==='object')walk(value,visit)}}

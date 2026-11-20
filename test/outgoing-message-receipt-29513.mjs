import assert from 'node:assert/strict';import fs from 'node:fs';import os from 'node:os';import path from 'node:path';import{createRequire}from'node:module';import{randomUUID}from'node:crypto';import{parse}from'acorn';
import{readRendererModule}from'../src/renderer-module.mjs';import{mainProcessAsset}from'../src/main-process-asset.mjs';import{receiptOwners29513}from'../patches/outgoing-message-receipt/profiles/build29513.mjs';import{waitProfiles29513}from'../patches/wait-thread-roster/profiles/build29513.mjs';
export async function probeReceipts29513(root){
 const o=receiptOwners29513(root),jsx={jsx:(type,props,key)=>({type,props,key}),jsxs:(type,props,key)=>({type,props,key})};function Receipt(){}function Actions(){}
 const packagedExports=new Map,forwardedExports=new Map;
 for(const file of ['../727403.b9dd20a8a9.js','364313.d749d31da5.js','911644.2b086ab057.js','154721.eecc3b7249.js']){
  const source=fs.readFileSync(path.join(root,'webview/assets/async',file),'utf8');
  const tree=parse(source,{ecmaVersion:'latest',sourceType:'module'});
  const modules=tree.body.flatMap(node=>node.declaration?.declarations??[]).find(node=>node.id.name==='__webpack_modules__').init.properties;
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
 const conversation=readRendererModule(o.conversation),start=conversation.indexOf('const MTKoutboundReceiptContract='),end=conversation.indexOf('n.d(t,{MTKOutboundTurnReceipts:',start);assert.ok(end>start);
 const listeners=new Map,dispatches=[],effects=[],realm={},react={useState:x=>[typeof x==='function'?x():x,()=>{}],useEffect:f=>effects.push(f)};
 const api=Function('MTKReceiptBus','MTKOutboundReceiptReact','MTKReceiptJsx','MTKReceiptActions','MTKoutboundReceipt','globalThis','crypto',conversation.slice(start,end)+';return {remember:MTKoutboundRemember,list:MTKoutboundReceiptValues,state:MTKoutboundReceiptState,lifecycle:MTKOutboundReceiptLifecycle,view:MTKOutboundTurnReceipts};')({subscribe:(k,f)=>listeners.set(k,f),dispatchMessage:(type,payload)=>dispatches.push({type,payload})},react,jsx,Actions,Receipt,realm,{randomUUID});
 const scratch=fs.mkdtempSync(path.join(os.tmpdir(),'tmtk-receipt-29513-'));try{
  const native=fs.readFileSync(mainProcessAsset(root),'utf8'),begin=native.indexOf('const MTKoutboundReceiptContract='),ast=parse(native,{ecmaVersion:'latest',sourceType:'module'});let last;
  walk(ast,x=>{if(x.type==='FunctionDeclaration'&&x.id?.name==='MTKoutboundReceiptList')last=x});assert.ok(last&&last.end>begin);
  const makeCache=()=>Function('require','process','Buffer','tg',native.slice(begin,last.end)+';return {remember:MTKoutboundReceiptRemember,list:MTKoutboundReceiptList};')(createRequire(import.meta.url),process,Buffer,{app:{getPath:()=>scratch}});
  const cache=makeCache(),record={callId:'accepted-call',contract:'outgoing-message-receipt-v1',prompt:'Coordinator → Engineer — hello',recordedAtMs:100,sourceThreadId:'source',sourceTurnId:'turn',targetHostId:'local',targetThreadId:'ada'};
  const live=api.lifecycle({item:{completed:true,success:true},record});assert.equal(live.type,Receipt);assert.equal(live.props.Actions,Actions);for(const f of effects.splice(0))f();assert.equal(dispatches.length,1);assert.equal(api.remember(record),false);assert.equal(dispatches.length,1);assert.deepEqual(api.list(api.state('source')),[]);
  const saved=cache.remember(record);assert.deepEqual(saved,record);assert.deepEqual(makeCache().list('source'),[record],'receipt survives a new native helper realm');
  listeners.get('mtk-outbound-receipt-remember-result')({requestId:dispatches[0].payload.requestId,ok:true,record:saved});assert.equal(api.lifecycle({item:{},record}),null);const view=api.view({conversationId:'source',turnId:'turn'});assert.equal(view.props.children.length,1);assert.equal(view.props.children[0].props.item.recordedAtMs,100);
  assert.deepEqual(cache.remember({...record,prompt:'different'}),record,'same call identity returns its first durable record');assert.deepEqual(makeCache().list('source'),[record]);
  for(const[index,target]of o.send.entries()){
   const source=readRendererModule(target),p=waitProfiles29513[index],nodes=parse(source,{ecmaVersion:'latest',sourceType:'module'}).body;
   const helper=nodes.filter(x=>x.type==='FunctionDeclaration'&&/^MTK(?:outbound|Outbound|renderOutbound)/.test(x.id.name)).map(x=>source.slice(x.start,x.end)).join('');
   const begin=source.indexOf('const MTKoutboundStoreHook='),end=source.indexOf(`;${p.loader}.d(t,{MTKoutboundReceipt:`,begin)+1,bindings=source.slice(begin,end);assert.ok(end>begin);
   const titleAtom={},threadAtom={};let title=null;const routed=[];const imports=id=>({'qmMi':{gh:()=>({}),_U:(atom,key)=>{if(atom===titleAtom)return title;if(atom===threadAtom)return{summary:{title,cwd:'/projects/example-search'}};assert.fail('unknown title binding')}},'OWtl':{u:{}},'tl5a':{HX:titleAtom,ok:threadAtom},'slpy':{m:{Root:'tooltip-root',Content:'tooltip-content',Trigger:'tooltip-trigger'}},'zd8w':react,'jHtb':{J:'formatter'}}[id]??assert.fail('unknown import '+id));
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
  const turn=readRendererModule(o.turn),dynamic=readRendererModule(o.dynamic);assert.ok(turn.includes('canOwnLatestTurnFollowContent:!1,isResponseContent:!1'));assert.ok(turn.includes('conversationId:tm,turnId:ty'));assert.ok(dynamic.includes('turnId:MTKsourceTurnId,ReceiptLifecycle:MTKReceiptLifecycle'));
  console.log('outgoing receipts 29513 behavior and persistence probe passed');
 }finally{fs.rmSync(scratch,{recursive:true,force:true})}
}

function walk(node,visit){if(node==null||typeof node!=='object')return;if(typeof node.type==='string')visit(node);for(const value of Object.values(node)){if(Array.isArray(value))for(const child of value)walk(child,visit);else if(value&&typeof value==='object')walk(value,visit)}}

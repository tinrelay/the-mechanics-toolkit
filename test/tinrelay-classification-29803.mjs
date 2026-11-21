import assert from 'node:assert/strict';import{parse}from'acorn';import{readRendererModule}from'../src/renderer-module.mjs';import{tinrelayOwners29803}from'../patches/tinrelay-pointer-presentation/profiles/build29803.mjs';
export function probeClassification29803(root,item,acceptance){
 const o=tinrelayOwners29803(root),shape=(item,kind)=>({item,kind}),identity=e=>e,ordinary={LS:()=>false};
 const bindings=[{u:shape,d:identity,i:ordinary},{u:shape,c:identity,o:ordinary},{u:shape,d:identity,r:ordinary},{c:shape,u:identity,i:ordinary},{d:shape,u:identity,r:ordinary}];
 for(const[index,target]of o.classifiers.entries()){
  const source=readRendererModule(target),nodes=[];walk(parse(source,{ecmaVersion:'latest',sourceType:'module'}),n=>{if(['FunctionDeclaration','FunctionExpression'].includes(n.type)&&source.slice(n.start,n.end).includes('case"exec":return'))nodes.push(n)});const node=nodes.at(-1);assert.ok(node);
  const values=bindings[index],api=Function('MTKtinrelayOutgoingAcceptance',...Object.keys(values),'return ('+source.slice(node.start,node.end)+');')(acceptance,...Object.values(values));
  assert.equal(api(item).kind,'standalone');assert.equal(api({...item,output:'not a receipt'}).kind,'groupable');
 }
 const source=readRendererModule(o.activity);let node;walk(parse(source,{ecmaVersion:'latest',sourceType:'module'}),x=>{if(x.type==='FunctionExpression'&&source.slice(x.start,x.end).includes('return{collapsibleUnits:s,expandedUnits:r,persistentUnits:o,'))node=x});assert.ok(node);
 const partition=Function('MTKtinrelayOutgoingAcceptance','m','h','p','return ('+source.slice(node.start,node.end)+');')(acceptance,{HC:()=>false,Gx:()=>false},{Q1:()=>false},{Yr:()=>false});
 const unit=item=>({kind:'standalone',item:{item}}),options={hasFollowingFinalAnswer:true,keepMcpAppEntriesPersistent:false};
 assert.deepEqual(partition([unit(item)],options).persistentUnits,[unit(item)]);
 assert.deepEqual(partition([unit({...item,output:'not a receipt'})],options).persistentUnits,[]);
 const history=readRendererModule({file:o.renderer.file,id:'fw8Z',parameters:['e','t','n']});let wrapper;
 walk(parse(history,{ecmaVersion:'latest',sourceType:'module'}),n=>{if(n.type==='FunctionDeclaration'&&n.id?.name==='C')wrapper=n});assert.ok(wrapper);
 const jsx={jsx:(type,props)=>({type,props})},native=()=>{},outgoing=()=>{},original={...item,callId:'send-call'};
 const render=Function('a','i','y','A','MTKtinrelayNativeHistoryItem','return ('+history.slice(wrapper.start,wrapper.end)+');')(jsx,{c:n=>Array(n).fill(Symbol.for('react.memo_cache_sentinel'))},{F:native,MTKtinrelayOutgoingExec:outgoing},native,native);
 const input={conversationId:'source-task',historyEntityKey:'history',toolActivityTurnKey:'source-task'+String.fromCharCode(0)+'source-turn',item:original,isReadOnly:false};
 const result=render(input);assert.equal(result.type,outgoing,'the original command output reaches presentation before native deferral');
 assert.equal(result.props.item,original);assert.deepEqual(acceptance(result.props.item),acceptance(item));
 assert.equal(result.props.sourceThreadId,'source-task');assert.equal(result.props.sourceTurnId,'source-turn','derive the actual missing turnId from the native activity key');
 assert.equal(result.props.Component,native);assert.equal(render({...input,item:{type:'reasoning'}}).type,native);
 assert.equal(render({...input,toolActivityTurnKey:'another-task'+String.fromCharCode(0)+'turn'}).props.sourceTurnId,undefined,'a foreign activity key supplies no source turn');
 const turn=readRendererModule(o.turn);assert.ok(turn.includes('turnFinished:!sd&&(t_.status==="cancelled"||ld?.completed===!0&&ld?.phase==="final_answer")'));assert.ok(turn.includes('isResponseContent:!1});or("mtk-outbound-turn-receipts"'));
}
function walk(n,f){if(!n||typeof n!=='object')return;if(typeof n.type==='string')f(n);for(const x of Object.values(n)){if(Array.isArray(x)){for(const y of x)walk(y,f);}else if(x&&typeof x==='object')walk(x,f)}}

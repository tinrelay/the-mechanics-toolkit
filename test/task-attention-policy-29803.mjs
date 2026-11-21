import assert from 'node:assert/strict';import path from 'node:path';import{readRendererModule}from '../src/renderer-module.mjs';import{rosterOwner29803}from '../patches/agent-roster/profiles/build29803.mjs';import{attentionRow29803,attention29803 as p}from '../patches/task-attention-policy/profiles/build29803.mjs';
export function probeAttention29803(root){
 const app=readRendererModule(rosterOwner29803(root)),row=readRendererModule(attentionRow29803(root)),start=app.indexOf('const MTKattentionRosterBridge=1'),end=app.indexOf('function fg(){',start),helper=app.slice(start,end);let muted=true,subscriber;const diagnostics=[];
 const realm={__MTK_AGENT_ROSTER__:{matches:(title,id)=>id==='ada'?[{data:{muteCompletion:muted}}]:title==='Invalid'?[{data:{muteCompletion:'yes'}}]:[],diagnose:x=>diagnostics.push(x),subscribe:f=>(subscriber=f,()=>{})}};
 const decoderSource=readRendererModule({file:path.join(root,'webview/assets/async/364313.d749d31da5.js'),id:'d6Ff',parameters:['e','t','n']}),nativeExports={};
 const load=id=>{assert.equal(id,'DBCl');return {L$F:()=>false,JXB:x=>x.toLowerCase(),_RT:x=>'/local/'+x,FVI:x=>'/remote/'+x}};
 load.d=(target,getters,values)=>Object.assign(target,values);
 Function('n','t',decoderSource)(load,nativeExports);
 const resolve=id=>id==='d6Ff'?nativeExports:load(id);
 const bindings={};
 for(const name of ['MTKattentionDecode','MTKpaletteKeyDecode']){
  const expression=app.match(new RegExp('const '+name+'=([^;]+);'))?.[1];assert.ok(expression,'native decoder binding is present');
  bindings[name]=Function('n','return '+expression)(resolve);
  assert.equal(typeof bindings[name],'function',name+' must resolve a real packaged export');
  assert.deepEqual(bindings[name]('local:ADA'),{kind:'local',key:'local:ada',threadId:'ada'});
  assert.deepEqual(bindings[name]('remote:ada'),{kind:'remote',key:'remote:ada',taskId:'ada'});
  assert.equal(bindings[name]('unknown'),null);
 }
 const atom={},updates=[],scope={set:(a,f)=>{assert.equal(a,atom);updates.push(f(0))}};
 const api=Function('globalThis','A','O','u','MTKattentionDecode',helper+';return {ignored:MTKattentionIgnored29803,thread:MTKattentionIgnoredThread29803,bootstrap:MTKuseAttentionBootstrap29803};')(realm,{vP:()=>atom,gh:()=>scope},{u:scope},{useEffect:f=>f()},bindings.MTKattentionDecode);
 assert.equal(api.ignored(null,'ada'),true);assert.equal(api.ignored('Invalid','other'),false);assert.deepEqual(diagnostics,['invalid-mute-completion']);assert.equal(api.thread(()=>{},'local:ada'),true);assert.equal(api.thread(()=>{},'remote:ada'),true);assert.equal(api.thread(()=>{},'other'),false);
 api.bootstrap();subscriber();assert.deepEqual(updates,[1]);muted=false;assert.equal(api.ignored(null,'ada'),false);
 for(const x of[p.dockAfter,p.notificationAfter,p.atomAfter])assert.ok(app.includes(x));for(const x of[p.titleAfter,...p.patchedPrimary])assert.ok(row.includes(x));
 const expressions=p.patchedPrimary[0].split(',').map(x=>x.slice(x.indexOf('=')+1));const decide=Function('MTKattentionIgnoredForTask','nH','tU','nx','nb','nC',`return [${expressions.join(',')}]`);assert.deepEqual(decide(true,false,true,true,null,3),[false,0]);assert.deepEqual(decide(false,false,true,true,null,3),[true,3]);
 console.log('task attention 29803 behavior probe passed');
}

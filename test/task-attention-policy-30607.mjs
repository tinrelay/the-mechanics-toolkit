import assert from 'node:assert/strict';import path from 'node:path';import{readRendererModule}from '../src/renderer-module.mjs';import{rosterOwner30607}from '../patches/agent-roster/profiles/build30607.mjs';import{attentionRow30607,attention30607 as p}from '../patches/task-attention-policy/profiles/build30607.mjs';
export function probeAttention30607(root){
 const app=readRendererModule(rosterOwner30607(root)),row=readRendererModule(attentionRow30607(root)),start=app.indexOf('const MTKattentionRosterBridge=1'),end=app.indexOf('function mA(){',start),helper=app.slice(start,end);let muted=true,subscriber;const diagnostics=[];
 const realm={__MTK_AGENT_ROSTER__:{matches:(title,id)=>id==='ada'?[{data:{muteCompletion:muted}}]:title==='Invalid'?[{data:{muteCompletion:'yes'}}]:[],diagnose:x=>diagnostics.push(x),subscribe:f=>(subscriber=f,()=>{})}};
 const decoderSource=readRendererModule({file:path.join(root,'webview/assets/async/366996.9782070574.js'),id:'d6Ff',parameters:['e','t','n']}),nativeExports={};
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
 const api=Function('globalThis','C','k','h','MTKattentionDecode',helper+';return {ignored:MTKattentionIgnored30607,thread:MTKattentionIgnoredThread30607,bootstrap:MTKuseAttentionBootstrap30607};')(realm,{vP:()=>atom,gh:()=>scope},{u:scope},{useEffect:f=>f()},bindings.MTKattentionDecode);
 assert.equal(api.ignored(null,'ada'),true);assert.equal(api.ignored('Invalid','other'),false);assert.deepEqual(diagnostics,['invalid-mute-completion']);assert.equal(api.thread(()=>{},'local:ada'),true);assert.equal(api.thread(()=>{},'remote:ada'),true);assert.equal(api.thread(()=>{},'other'),false);
 api.bootstrap();subscriber();assert.deepEqual(updates,[1]);muted=false;assert.equal(api.ignored(null,'ada'),false);
 for(const x of[p.dockAfter,p.notificationAfter,p.atomAfter])assert.ok(app.includes(x));for(const x of[p.titleAfter,...p.patchedPrimary])assert.ok(row.includes(x));
 const expression=p.patchedPrimary[0].slice(p.patchedPrimary[0].indexOf('=')+1),decide=Function('MTKattentionIgnoredForTask','nO','tU','nI',`return ${expression}`);assert.equal(decide(true,false,true,true),false);assert.equal(decide(false,false,true,true),true);assert.equal(decide(false,true,true,true),false);assert.equal(decide(false,false,false,true),false);assert.equal(decide(false,false,null,true),true);
 console.log('task attention 30607 behavior probe passed');
}

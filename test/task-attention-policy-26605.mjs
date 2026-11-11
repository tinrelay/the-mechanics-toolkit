import assert from 'node:assert/strict';import{readRendererModule}from '../src/renderer-module.mjs';import{rosterOwner26605}from '../patches/agent-roster/profiles/build26605.mjs';import{attentionRow26605,attention26605 as p}from '../patches/task-attention-policy/profiles/build26605.mjs';
export function probeAttention26605(root){
 const app=readRendererModule(rosterOwner26605(root)),row=readRendererModule(attentionRow26605(root)),start=app.indexOf('const MTKattentionRosterBridge=1'),end=app.indexOf('function mD(){',start),helper=app.slice(start,end);let muted=true,subscriber;const diagnostics=[];
 const realm={__MTK_AGENT_ROSTER__:{matches:(title,id)=>id==='ada'?[{data:{muteCompletion:muted}}]:title==='Invalid'?[{data:{muteCompletion:'yes'}}]:[],diagnose:x=>diagnostics.push(x),subscribe:f=>(subscriber=f,()=>{})}};
 const atom={},updates=[],scope={set:(a,f)=>{assert.equal(a,atom);updates.push(f(0))}};
 const api=Function('globalThis','E','T','u','MTKattentionDecode',helper+';return {ignored:MTKattentionIgnored26605,thread:MTKattentionIgnoredThread26605,bootstrap:MTKuseAttentionBootstrap26605};')(realm,{vP:()=>atom,gh:()=>scope},{u:scope},{useEffect:f=>f()},key=>key==='local:ada'?{kind:'local',threadId:'ada'}:key==='remote:ada'?{kind:'remote',taskId:'ada'}:null);
 assert.equal(api.ignored(null,'ada'),true);assert.equal(api.ignored('Invalid','other'),false);assert.deepEqual(diagnostics,['invalid-mute-completion']);assert.equal(api.thread(()=>{},'local:ada'),true);assert.equal(api.thread(()=>{},'remote:ada'),true);assert.equal(api.thread(()=>{},'other'),false);
 api.bootstrap();subscriber();assert.deepEqual(updates,[1]);muted=false;assert.equal(api.ignored(null,'ada'),false);
 for(const x of[p.dockAfter,p.notificationAfter,p.atomAfter])assert.ok(app.includes(x));for(const x of[p.titleAfter,...p.patchedPrimary])assert.ok(row.includes(x));
 const expressions=p.patchedPrimary[0].split(',').map(x=>x.slice(x.indexOf('=')+1));const decide=Function('MTKattentionIgnoredForTask','aW','tS','am','av','ap',`return [${expressions.join(',')}]`);assert.deepEqual(decide(true,false,true,true,null,3),[false,0]);assert.deepEqual(decide(false,false,true,true,null,3),[true,3]);
 console.log('task attention 26605 behavior probe passed');
}

import assert from 'node:assert/strict';import{parse}from'acorn';import{readRendererModule}from'../src/renderer-module.mjs';import{rosterClient24614}from'../patches/agent-roster/profiles/build24614.mjs';
export async function probeRosterFactory24614(root){
 const source=readRendererModule(rosterClient24614(root)),node=parse(source,{ecmaVersion:'latest',sourceType:'module'}).body.find(x=>x.type==='FunctionDeclaration'&&x.id.name==='p');assert.ok(node);
 const managerAtom={},cacheAtom={},connectionAtom={},hostsAtom={},cached=new Map;let manager=null,connection={status:'connecting',client:null},hosts=['local'],watcher,unsubscribed=0;
 const scope={get(atom,key){if(atom===managerAtom)return manager;if(atom===cacheAtom)return cached.get(key)??null;if(atom===connectionAtom){assert.equal(key,'local');return connection;}if(atom===hostsAtom)return hosts;assert.fail('unknown RPC selector')},set(atom,key,value){assert.equal(atom,cacheAtom);cached.set(key,typeof value==='function'?value():value)},watch(fn){watcher=fn;fn({get:this.get.bind(this)});return()=>unsubscribed++}};
 const deferred=()=>{let resolve,reject;const promise=new Promise((a,b)=>{resolve=a;reject=b});return{promise,resolve,reject}};
 const lazy=(provider)=>({sendRequest:async(...args)=>(await provider()).sendRequest(...args),dup(){return this},onRpcBroken(){},[Symbol.dispose](){}});
 function AX(provider){const client=lazy(provider);return()=>client}
 const getClient=Function('d','c','o','l','s','r','i',source.slice(node.start,node.end)+';return p;')(managerAtom,cacheAtom,{M4:connectionAtom},{D:hostsAtom},{udX:deferred},{mS:(_stack,value)=>value,hk(){}},{AX});
 const ready={sendRequest:async(method,args)=>({method,args}),dup(){return this}};
 const pending=getClient(scope,'local');assert.equal(getClient(scope,'local'),pending,'pending native client is cached while the manager hydrates');const response=pending.sendRequest('fs/readFile',{path:'/example/agent-roster.json'});
 connection={status:'connected',client:{rpc:ready}};watcher({get:scope.get.bind(scope)});assert.deepEqual(await response,{method:'fs/readFile',args:{path:'/example/agent-roster.json'}});assert.equal(cached.get('local'),null);assert.equal(unsubscribed,0,'native watcher tracks the selected client after hydration');connection={status:'connected',client:{rpc:ready}};watcher({get:scope.get.bind(scope)});assert.ok(unsubscribed>0,'replacement of the hydrated client retires its old watcher');
 manager={forHost(host){assert.equal(host,'local');return ready}};assert.equal(getClient(scope,'local'),ready,'hydrated manager owns the normal path');
 manager={forHost(){throw Error('not yet attached')}};assert.equal(getClient(scope,'local'),ready,'native connected client remains the supported fallback');
 connection={status:'disconnected',client:null};manager=null;hosts=[];cached.clear();const missing=getClient(scope,'local');await assert.rejects(missing.sendRequest('fs/readFile',{}),/RPC is unavailable/);
 console.log('roster native ready/deferred RPC transition probe passed');
}

import assert from 'node:assert/strict';
import path from 'node:path';
import {readRendererModule} from '../src/renderer-module.mjs';

// Exercise the packaged sender and its real capability/version comparator. No model call.
export function probeDelegationRetention29513(root) {
  const factories = new Map();
  const file = path.join(root, 'webview/assets/async/911644.2b086ab057.js');
  for (const id of ['KBsB', 'Ehlj', 'ldD6']) factories.set(id, readRendererModule({file:id==='KBsB'?file:path.join(root,'webview/assets/async/976185.5c5ffe91ef.js'), id, parameters:['e','t','n']}));
  const cache = new Map([['N2rm', {iw:'remote'}], ['DBCl', {}]]);
  const load = id => {
    if (cache.has(id)) return cache.get(id);
    assert.ok(factories.has(id), 'known dependency of the packaged sender: '+id);
    const exports = {}; cache.set(id, exports);
    Function('e','t','n', factories.get(id))({exports}, exports, load);
    return exports;
  };
  load.j = '348410';
  load.d = (target, getters, values) => {
    for (const [key,get] of Object.entries(getters)) Object.defineProperty(target,key,{get,enumerable:true});
    Object.assign(target,values);
  };
  const sender = load('KBsB');
  for (const toolName of ['send_message_to_thread','create_thread']) {
    const request=sender.on({appServerVersion:'0.171.0-alpha.13',sourceThreadId:'source',input:'current <task>',toolName});
    assert.deepEqual(request.input,[]);
    assert.equal(request.toolOutput.retain,true);
    assert.equal(request.toolOutput.name,toolName);
    assert.equal(request.toolOutput.namespace,'codex_app');
    assert.match(request.toolOutput.output,/<source_thread_id>source<\/source_thread_id>/);
    assert.match(request.toolOutput.output,/current &lt;task&gt;/);
  }
  const older=sender.on({appServerVersion:'0.162.0',input:'task',toolName:'send_message_to_thread'});
  assert.equal(older.toolOutput.retain,undefined,'retention is gated by the actual server version');
  console.log('packaged Desktop delegation retention contract passed');
}

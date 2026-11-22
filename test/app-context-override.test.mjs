import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {createRequire} from 'node:module';
import {parse} from 'acorn';
import {mainProcessAsset} from '../src/main-process-asset.mjs';
import {instructionAsset} from '../patches/app-context-override/transform.mjs';

if(!process.argv[2])throw Error('usage: app-context-override.test.mjs EXTRACTED_ASAR_ROOT');
const source=fs.readFileSync(path.join(process.argv[2],instructionAsset),'utf8'),tree=parse(source,{ecmaVersion:'latest',sourceType:'module'});
const startup=fs.readFileSync(mainProcessAsset(path.resolve(process.argv[2])),'utf8');
const bootstrap=fs.readFileSync(path.join(process.argv[2],'.vite/build/early-bootstrap.js'),'utf8');
const bootstrapTree=parse(bootstrap,{ecmaVersion:'latest',sourceType:'module'});
// Resolve the actual bundled externals instead of pretending a minified variable is fs.
const require=createRequire(import.meta.url),externals=new Map();
walk(bootstrapTree,n=>{if(n.type==='Property'&&[78335,89477,86697].includes(n.key?.value))externals.set(n.key.value,Function('require','const e={};(function'+bootstrap.slice(n.value.start,n.value.end)+')(e);return e.exports')(require))});
assert.equal(externals.get(78335),require('node:crypto'));
assert.equal(externals.get(89477),fs);
assert.equal(externals.get(86697),path);
assert.ok(startup.includes('var tI=r(73488)')&&startup.includes('tg=r(4482)'),'startup uses the packaged native utility and Electron bindings');
const ready='await tg.app.whenReady(),tI.MTKcheckAppContextDefaults(tg.dialog),';
assert.equal(startup.split(ready).length,2,'one app-ready notice call');
const order=[],dialogToken={};
const start=Function('return Object.getPrototypeOf(async function(){}).constructor')()('tg','tI','return ('+ready+'"continued")');
assert.equal(await start({app:{async whenReady(){order.push('ready')}},dialog:dialogToken},{MTKcheckAppContextDefaults(dialog){assert.equal(dialog,dialogToken);order.push('notice');return new Promise(()=>{})}}),'continued','an open notice does not block startup');
assert.deepEqual(order,['ready','notice']);

let factory,adapter;
walk(tree,n=>{if(n.type==='Property'&&n.key?.value===73488)factory=n.value;if(n.type==='Property'&&n.key?.value===71530)adapter=n.value});
assert.ok(factory&&adapter,'actual packaged instruction owners');
const declarations=factory.body.body,functions=new Map(declarations.filter(n=>n.type==='FunctionDeclaration').map(n=>[n.id.name,n]));
assert.ok(functions.has('MTKappContextFromFile'),'the packaged builder must read the local override');
const variables=new Map(declarations.filter(n=>n.type==='VariableDeclaration').flatMap(n=>n.declarations).map(n=>[n.id.name,n.init]));
const text=n=>source.slice(n.start,n.end),literal=n=>Function('return ('+text(n)+')')();
const adapterVariables=new Map(adapter.body.body.filter(n=>n.type==='VariableDeclaration').flatMap(n=>n.declarations).map(n=>[n.id.name,n.init]));
let rewrite;
walk(adapter,n=>{if(n.type==='Property'&&n.key?.name==='W_')rewrite=n.value});
const hosted=Function('n','i','return ('+text(rewrite)+')')(literal(adapterVariables.get('n')),literal(adapterVariables.get('i')));
const rV={YU:literal(adapterVariables.get('n')),W_:hosted},y={H43:10000};
const values=Object.fromEntries(['rK','r$','rq','rz','rQ','rJ','rZ'].map(k=>[k,Function('y','rV','return ('+text(variables.get(k))+')')(y,rV)]));
values.rV=rV;values.rH={W:()=>'<heartbeat_instructions>Existing heartbeat policy</heartbeat_instructions>'};
values.rX=literal(functions.get('rX'));
const scratch=fs.mkdtempSync(path.join(os.tmpdir(),'tmtk-app-context-'));
try{
  values.P=externals.get(78335);values.x=externals.get(89477);values.D=externals.get(86697);values._={D:()=>scratch};values.console={warn(){}};
  const helper=['MTKappContextWrite','MTKappContextFromFile','MTKcheckAppContextDefaults'].map(k=>text(functions.get(k))).join('\n');
  const api=Function(...Object.keys(values),helper+'\n'+text(functions.get('r0'))+';return {build:r0,notice:MTKcheckAppContextDefaults};')(...Object.values(values));
  const nativeText=text(functions.get('r0')).replace('${MTKappContextFromFile(h?(0,rV.W_)(f.trim()):f.trim())}','${f.trim()}').replace('E=rX(h?(0,rV.W_)(r??""):r??"",_);return E','E=rX(r??"",_);return h?(0,rV.W_)(E):E');
  const native=Function(...Object.keys(values),'return ('+nativeText+')')(...Object.values(values));
  const custom=path.join(scratch,'app-context.md'),snapshot=path.join(scratch,'app-context.default.md');
  for(const hostedAutomationsEnabled of [false,true])for(const heartbeatEnabled of [false,true])for(const includeAutomationsSection of [false,true]){
    const options={baseInstructions:'Base instructions outside the app block.',hostedAutomationsEnabled,heartbeatEnabled,includeAutomationsSection,threadToolsEnabled:true,worktreeToolsEnabled:true,workspaceDependenciesEnabled:true,instructionOverrides:{worktreeInstructionsIncluded:true},gitSettings:{branchPrefix:'example/'}};
    assert.equal(api.build(options),native(options),'missing file is byte-identical to the bundled builder');
    const baseline=fs.readFileSync(snapshot,'utf8');
    const replacement='# My app context\nLiteral ${never_execute_this} and automation_update.\n';fs.writeFileSync(custom,replacement);
    const changed=api.build(options);
    assert.ok(changed.startsWith(options.baseInstructions));
    assert.equal(changed.slice(changed.indexOf('<app-context>')+14,changed.lastIndexOf('\n</app-context>')),replacement,'override stays literal, including hosted mode');
    assert.equal(fs.readFileSync(snapshot,'utf8'),baseline,'custom text never replaces the default snapshot');
    assert.equal(fs.readFileSync(custom,'utf8'),replacement,'app never rewrites the user file');
    fs.writeFileSync(custom,'');assert.match(api.build(options),/<app-context>\n\n<\/app-context>/,'an explicitly empty override is respected');
    fs.unlinkSync(custom);assert.equal(api.build(options),native(options),'removing the file restores stock output without rebuilding');
  }
  let notices=0;const dialog={async showMessageBox(o){notices++;assert.equal(o.message,'App instructions changed')}};
  await api.notice(dialog);assert.equal(notices,0,'first run establishes a baseline');
  const state=path.join(scratch,'app-context.state.json'),current=fs.readFileSync(state,'utf8');
  assert.equal(JSON.parse(current).version,1,'the persisted launch baseline is valid JSON');
  assert.match(JSON.parse(current).defaultsFingerprint,/^[a-f0-9]{64}$/);
  await api.notice(dialog);assert.equal(notices,0,'same defaults do not notify');
  fs.writeFileSync(state,JSON.stringify({version:1,defaultsFingerprint:'old'}));
  await api.notice(dialog);assert.equal(notices,1,'new bundled instruction text notifies');
  assert.equal(fs.readFileSync(state,'utf8'),current);
  await api.notice(dialog);assert.equal(notices,1,'acknowledged change does not repeat next launch');
  fs.writeFileSync(state,JSON.stringify({version:1,defaultsFingerprint:'old'}));
  await api.notice({async showMessageBox(){throw Error('dialog unavailable')}});
  assert.equal(JSON.parse(fs.readFileSync(state)).defaultsFingerprint,'old','failed notification is not acknowledged');
  fs.mkdirSync(custom);assert.throws(()=>api.build({}),/Cannot read app-context override/,'unreadable override has an explicit error');
  console.log('app context: actual builder, literal overrides, reload, stock fallback, snapshots and launch notice passed');
}finally{fs.rmSync(scratch,{recursive:true,force:true})}
function walk(n,f){if(!n||typeof n!=='object')return;f(n);for(const v of Object.values(n))Array.isArray(v)?v.forEach(x=>walk(x,f)):typeof v==='object'&&walk(v,f)}

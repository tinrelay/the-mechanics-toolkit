import assert from 'node:assert/strict';import fs from 'node:fs';import path from 'node:path';import {parse} from 'acorn';
import {readRendererModule} from '../src/renderer-module.mjs';import {rosterOwner24614} from '../patches/agent-roster/profiles/build24614.mjs';import {terminalCommandOwner24614,terminal24614} from '../patches/terminal-toggle/profiles/build24614.mjs';
export function probeTerminal24614(root){
 const source=readRendererModule(rosterOwner24614(root)),catalogs=[readRendererModule(terminalCommandOwner24614(root)),...['early-bootstrap-339-a1c76730c29ac8b1.js','worker.js'].map(f=>fs.readFileSync(path.join(root,'.vite/build',f),'utf8'))];
 for(const s of catalogs){assert.equal(s.split(terminal24614.commandAfter).length,2);assert.ok(s.includes('defaultKeybindings:[{key:"Control+`"}]'));}
 const node=parse(source,{ecmaVersion:'latest',sourceType:'module'}).body.find(x=>x.type==='FunctionDeclaration'&&x.id.name==='lh');assert.ok(node);const text=source.slice(node.start,node.end);
 let options,dispatched=0;class Element{};
 const fn=Function('c','la','li','lo','Element',text+';return lh')({c:n=>Array(n).fill(Symbol())},{QR:()=>false,TY:()=>true},{EE:e=>options=e},{aP:()=>false,W7:id=>{assert.equal(id,'toggleTerminal');dispatched++;return true}},Element);
 fn({id:'toggleTerminal',accelerator:'Control+`',allowRepeat:false,capture:true,runInRenderer:true,isMacOS:true});
 assert.equal(options.allowWithinEditable,true);assert.equal(options.enabled,true);
 let prevented=0,stopped=0;options.onKeyDown({target:new Element,defaultPrevented:false,isComposing:false,key:'`',repeat:false,getModifierState:()=>false,preventDefault(){prevented++},stopPropagation(){stopped++}});
 assert.equal(dispatched,1);assert.equal(prevented,1);assert.equal(stopped,1);
 options.onKeyDown({target:new Element,defaultPrevented:false,isComposing:true,key:'Process',getModifierState:()=>false});assert.equal(dispatched,1,'IME composition does not toggle');
 console.log('terminal toggle 24614 behavior probe passed');
}

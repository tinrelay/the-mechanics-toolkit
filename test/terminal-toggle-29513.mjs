import assert from 'node:assert/strict';import fs from 'node:fs';import path from 'node:path';import {parse} from 'acorn';
import {readRendererModule} from '../src/renderer-module.mjs';import {terminalCommandOwner29513,terminal29513,terminalKeyboardOwners29513} from '../patches/terminal-toggle/profiles/build29513.mjs';
export function probeTerminal29513(root){
 const catalogs=[readRendererModule(terminalCommandOwner29513(root)),...['early-bootstrap-7-ce4a67f0257ee973.js','worker.js'].map(f=>fs.readFileSync(path.join(root,'.vite/build',f),'utf8'))];
 for(const s of catalogs){assert.equal(s.split(terminal29513.commandAfter).length,2);assert.ok(s.includes('defaultKeybindings:[{key:"Control+`"}]'));}
 for(const owner of terminalKeyboardOwners29513(root)){
 const source=readRendererModule(owner);
 const node=parse(source,{ecmaVersion:'latest',sourceType:'module'}).body.find(x=>x.type==='FunctionDeclaration'&&x.id.name===owner.functionName);assert.ok(node);const text=source.slice(node.start,node.end);
 let options,dispatched=0;class Element{};
 const fn=Function(owner.cache,owner.classifier,owner.dispatcher,owner.commandBus,'Element',text+';return '+owner.functionName)({c:n=>Array(n).fill(Symbol())},{QR:()=>false,TY:()=>true},{ho:()=>false,EE:e=>options=e},{aP:()=>false,W7:id=>{assert.equal(id,'toggleTerminal');dispatched++;return true}},Element);
 fn({id:'toggleTerminal',accelerator:'Control+`',allowRepeat:false,capture:true,runInRenderer:true,isMacOS:true});
 assert.equal(options.allowWithinEditable,true);assert.equal(options.enabled,true);
 let prevented=0,stopped=0;options.onKeyDown({target:new Element,defaultPrevented:false,isComposing:false,key:'`',repeat:false,getModifierState:()=>false,preventDefault(){prevented++},stopPropagation(){stopped++}});
 assert.equal(dispatched,1);assert.equal(prevented,1);assert.equal(stopped,1);
 options.onKeyDown({target:new Element,defaultPrevented:false,isComposing:true,key:'Process',getModifierState:()=>false});assert.equal(dispatched,1,'IME composition does not toggle');
 }
 console.log('terminal toggle 29513 behavior probe passed');
}

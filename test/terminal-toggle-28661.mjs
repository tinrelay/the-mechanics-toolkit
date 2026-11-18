import assert from 'node:assert/strict';import fs from 'node:fs';import path from 'node:path';import {parse} from 'acorn';
import {readRendererModule} from '../src/renderer-module.mjs';import {terminalCommandOwner28661,terminal28661,terminalKeyboardOwners28661} from '../patches/terminal-toggle/profiles/build28661.mjs';
export function probeTerminal28661(root){
 const catalogs=[readRendererModule(terminalCommandOwner28661(root)),...['early-bootstrap-631-9c86108a3befe979.js','worker.js'].map(f=>fs.readFileSync(path.join(root,'.vite/build',f),'utf8'))];
 for(const s of catalogs){assert.equal(s.split(terminal28661.commandAfter).length,2);assert.ok(s.includes('defaultKeybindings:[{key:"Control+`"}]'));}
 for(const owner of terminalKeyboardOwners28661(root)){
 const source=readRendererModule(owner);
 const node=parse(source,{ecmaVersion:'latest',sourceType:'module'}).body.find(x=>x.type==='FunctionDeclaration'&&x.id.name===owner.functionName);assert.ok(node);const text=source.slice(node.start,node.end);
 let options,dispatched=0;class Element{};
 const fn=Function(owner.cache,owner.classifier,owner.dispatcher,'g','Element',text+';return '+owner.functionName)({c:n=>Array(n).fill(Symbol())},{QR:()=>false,TY:()=>true},{ho:()=>false,EE:e=>options=e},{aP:()=>false,W7:id=>{assert.equal(id,'toggleTerminal');dispatched++;return true}},Element);
 fn({id:'toggleTerminal',accelerator:'Control+`',allowRepeat:false,capture:true,runInRenderer:true,isMacOS:true});
 assert.equal(options.allowWithinEditable,true);assert.equal(options.enabled,true);
 let prevented=0,stopped=0;options.onKeyDown({target:new Element,defaultPrevented:false,isComposing:false,key:'`',repeat:false,getModifierState:()=>false,preventDefault(){prevented++},stopPropagation(){stopped++}});
 assert.equal(dispatched,1);assert.equal(prevented,1);assert.equal(stopped,1);
 options.onKeyDown({target:new Element,defaultPrevented:false,isComposing:true,key:'Process',getModifierState:()=>false});assert.equal(dispatched,1,'IME composition does not toggle');
 }
 console.log('terminal toggle 28661 behavior probe passed');
}

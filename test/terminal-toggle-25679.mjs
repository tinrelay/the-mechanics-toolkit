import assert from 'node:assert/strict';import fs from 'node:fs';import path from 'node:path';import {parse} from 'acorn';
import {readRendererModule} from '../src/renderer-module.mjs';import {rosterOwner25679} from '../patches/agent-roster/profiles/build25679.mjs';import {terminalCommandOwner25679,terminal25679} from '../patches/terminal-toggle/profiles/build25679.mjs';
export function probeTerminal25679(root){
 const source=readRendererModule(rosterOwner25679(root)),catalogs=[readRendererModule(terminalCommandOwner25679(root)),...['early-bootstrap-339-8cdc01c6be3ea2a7.js','worker.js'].map(f=>fs.readFileSync(path.join(root,'.vite/build',f),'utf8'))];
 for(const s of catalogs){assert.equal(s.split(terminal25679.commandAfter).length,2);assert.ok(s.includes('defaultKeybindings:[{key:"Control+`"}]'));}
 const node=parse(source,{ecmaVersion:'latest',sourceType:'module'}).body.find(x=>x.type==='FunctionDeclaration'&&x.id.name==='lA');assert.ok(node);const text=source.slice(node.start,node.end);
 let options,dispatched=0;class Element{};
 const fn=Function('c','ly','lb','lw','Element',text+';return lA')({c:n=>Array(n).fill(Symbol())},{QR:()=>false,TY:()=>true},{EE:e=>options=e},{aP:()=>false,W7:id=>{assert.equal(id,'toggleTerminal');dispatched++;return true}},Element);
 fn({id:'toggleTerminal',accelerator:'Control+`',allowRepeat:false,capture:true,runInRenderer:true,isMacOS:true});
 assert.equal(options.allowWithinEditable,true);assert.equal(options.enabled,true);
 let prevented=0,stopped=0;options.onKeyDown({target:new Element,defaultPrevented:false,isComposing:false,key:'`',repeat:false,getModifierState:()=>false,preventDefault(){prevented++},stopPropagation(){stopped++}});
 assert.equal(dispatched,1);assert.equal(prevented,1);assert.equal(stopped,1);
 options.onKeyDown({target:new Element,defaultPrevented:false,isComposing:true,key:'Process',getModifierState:()=>false});assert.equal(dispatched,1,'IME composition does not toggle');
 console.log('terminal toggle 25679 behavior probe passed');
}

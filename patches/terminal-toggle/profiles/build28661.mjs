import fs from 'node:fs';import path from 'node:path';
import {readRendererModule,writeRendererModule} from '../../../src/renderer-module.mjs';
import {rosterOwner28661} from '../../agent-roster/profiles/build28661.mjs';
export const terminalCommandOwner28661=root=>({file:path.join(root,'webview/assets/async/956370.aff5cce818.js'),id:'Qph1',parameters:['e','t','n']});
export const terminal28661={
 commandBefore:'id:"toggleTerminal",titleIntlId:"codex.command.toggleTerminal",descriptionIntlId:"codex.commandDescription.toggleTerminal",requiredAccess:"codexLocal",unifiedSearchGroupKey:"panels",',
 editableBefore:"I=\"composer.toggleDictation\"===l||_&&\"[data-codex-composer]\"||\"exitWorkspaceFullView\"===l||\"focusPageBlockControls\"===l||\"copyPageLink\"===l||\"clearAllUnreads\"===l&&(\"Shift+Escape\"===c||\"Shift+Esc\"===c)",
 editableAfter:"I=\"toggleTerminal\"===l||\"composer.toggleDictation\"===l||_&&\"[data-codex-composer]\"||\"exitWorkspaceFullView\"===l||\"focusPageBlockControls\"===l||\"copyPageLink\"===l||\"clearAllUnreads\"===l&&(\"Shift+Escape\"===c||\"Shift+Esc\"===c)"
};
terminal28661.commandAfter=terminal28661.commandBefore.replace('unifiedSearchGroupKey:','shortcutScope:"app",unifiedSearchGroupKey:');
export const terminalKeyboardOwners28661=root=>[
 {file:path.join(root,'webview/assets/async/195836.c6296fd869.js'),id:'ITUJ',parameters:['e','t','n'],functionName:'b',cache:'i',classifier:'h',dispatcher:'p',binding:'p=n("tO3J")',props:'{id:l,accelerator:c,allowRepeat:d,capture:u,runInRenderer:m,isMacOS:f,keyboardEventTarget:v}=e',before:terminal28661.editableBefore,after:terminal28661.editableAfter},
 {file:path.join(root,'webview/assets/async/898116.e8bd108c3e.js'),id:'ITUJ',parameters:['e','t','r'],functionName:'E',cache:'o',classifier:'p',dispatcher:'f',binding:'f=r("tO3J")',props:'{id:l,accelerator:d,allowRepeat:c,capture:u,runInRenderer:m,isMacOS:h,keyboardEventTarget:b}=e',before:terminal28661.editableBefore.replaceAll('I=','_=').replace('||_&&','||v&&').replaceAll('===c','===d'),after:terminal28661.editableAfter.replaceAll('I=','_=').replace('||_&&','||v&&').replaceAll('===c','===d')}
];
export function runBuild28661({root,command}){
 const keyboards=terminalKeyboardOwners28661(root).map(owner=>({owner,source:readRendererModule(owner)})),renderer=terminalCommandOwner28661(root),native=['early-bootstrap-631-9c86108a3befe979.js','worker.js'].map(file=>path.join(root,'.vite/build',file));
 for(const {source,owner} of keyboards)for(const text of [`function ${owner.functionName}(e){`,owner.props,owner.binding])one(source,text);
 const targets=[{owner:renderer,source:readRendererModule(renderer)},...native.map(file=>({file,source:fs.readFileSync(file,'utf8')}))];
 const green=targets.every(x=>x.source.includes(terminal28661.commandAfter))&&keyboards.every(x=>x.source.includes(x.owner.after));
 if(!green){for(const x of keyboards)one(x.source,x.owner.before);for(const x of targets)one(x.source,terminal28661.commandBefore);
  if(command==='apply'){
   for(const x of targets){const changed=x.source.replace(terminal28661.commandBefore,()=>terminal28661.commandAfter);if(x.owner)writeRendererModule(x.owner,changed);else fs.writeFileSync(x.file,changed);}
   for(const x of keyboards)writeRendererModule(x.owner,x.source.replace(x.owner.before,()=>x.owner.after));
  }
 }
 return{state:green||command==='apply'?'applied':'needs-apply',targets:[...keyboards.map(x=>x.owner.file),renderer.file,...native].map(file=>path.relative(root,file))};
}
function one(s,v){if(s.split(v).length!==2)throw Error('Upstream changed: terminal module contract '+v)}

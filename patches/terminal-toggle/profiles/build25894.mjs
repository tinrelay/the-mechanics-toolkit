import fs from 'node:fs';import path from 'node:path';
import {readRendererModule,writeRendererModule} from '../../../src/renderer-module.mjs';
import {rosterOwner25894} from '../../agent-roster/profiles/build25894.mjs';
export const terminalCommandOwner25894=root=>({file:path.join(root,'webview/assets/async/189497.7105543924.js'),id:'Qph1',parameters:['e','t','n']});
export const terminal25894={
 commandBefore:'id:"toggleTerminal",titleIntlId:"codex.command.toggleTerminal",descriptionIntlId:"codex.commandDescription.toggleTerminal",requiredAccess:"codexLocal",commandMenuGroupKey:"panels",',
 editableBefore:'v="exitWorkspaceFullView"===r||"focusPageBlockControls"===r||"copyPageLink"===r||"clearAllUnreads"===r&&("Shift+Escape"===s||"Shift+Esc"===s),y=',
 editableAfter:'v="toggleTerminal"===r||"exitWorkspaceFullView"===r||"focusPageBlockControls"===r||"copyPageLink"===r||"clearAllUnreads"===r&&("Shift+Escape"===s||"Shift+Esc"===s),y='
};
terminal25894.commandAfter=terminal25894.commandBefore.replace('commandMenuGroupKey:','shortcutScope:"app",commandMenuGroupKey:');
export function runBuild25894({root,command}){
 const owner=rosterOwner25894(root),renderer=terminalCommandOwner25894(root),native=['early-bootstrap-339-cb7e73ca5a71df7c.js','worker.js'].map(file=>path.join(root,'.vite/build',file));
 let source=readRendererModule(owner);for(const text of ['function lC(e){','{id:r,accelerator:s,allowRepeat:o,capture:l,runInRenderer:d,isMacOS:u}=e','allowWithinEditable:v,enabled:y,onKeyDown:n','ly=n("hGgS")'])one(source,text);
 const targets=[{owner:renderer,source:readRendererModule(renderer)},...native.map(file=>({file,source:fs.readFileSync(file,'utf8')}))];
 const green=targets.every(x=>x.source.includes(terminal25894.commandAfter))&&source.includes(terminal25894.editableAfter);
 if(!green){one(source,terminal25894.editableBefore);for(const x of targets)one(x.source,terminal25894.commandBefore);
  if(command==='apply'){
   for(const x of targets){const changed=x.source.replace(terminal25894.commandBefore,()=>terminal25894.commandAfter);if(x.owner)writeRendererModule(x.owner,changed);else fs.writeFileSync(x.file,changed);}
   writeRendererModule(owner,source.replace(terminal25894.editableBefore,()=>terminal25894.editableAfter));
  }
 }
 return{state:green||command==='apply'?'applied':'needs-apply',targets:[owner.file,renderer.file,...native].map(file=>path.relative(root,file))};
}
function one(s,v){if(s.split(v).length!==2)throw Error('Upstream changed: terminal module contract '+v)}

import fs from 'node:fs';import path from 'node:path';
import {readRendererModule,writeRendererModule} from '../../../src/renderer-module.mjs';
import {rosterOwner25471} from '../../agent-roster/profiles/build25471.mjs';
export const terminalCommandOwner25471=root=>({file:path.join(root,'webview/assets/async/189497.6182e00931.js'),id:'Qph1',parameters:['e','t','n']});
export const terminal25471={
 commandBefore:'id:"toggleTerminal",titleIntlId:"codex.command.toggleTerminal",descriptionIntlId:"codex.commandDescription.toggleTerminal",requiredAccess:"codexLocal",commandMenuGroupKey:"panels",',
 editableBefore:'v="exitWorkspaceFullView"===r||"focusPageBlockControls"===r||"copyPageLink"===r||"clearAllUnreads"===r&&("Shift+Escape"===s||"Shift+Esc"===s),y=',
 editableAfter:'v="toggleTerminal"===r||"exitWorkspaceFullView"===r||"focusPageBlockControls"===r||"copyPageLink"===r||"clearAllUnreads"===r&&("Shift+Escape"===s||"Shift+Esc"===s),y='
};
terminal25471.commandAfter=terminal25471.commandBefore.replace('commandMenuGroupKey:','shortcutScope:"app",commandMenuGroupKey:');
export function runBuild25471({root,command}){
 const owner=rosterOwner25471(root),renderer=terminalCommandOwner25471(root),native=['early-bootstrap-339-dd3f3328d53d7b14.js','worker.js'].map(file=>path.join(root,'.vite/build',file));
 let source=readRendererModule(owner);for(const text of ['function lA(e){','{id:r,accelerator:s,allowRepeat:o,capture:l,runInRenderer:d,isMacOS:u}=e','allowWithinEditable:v,enabled:y,onKeyDown:n','lb=n("hGgS")'])one(source,text);
 const targets=[{owner:renderer,source:readRendererModule(renderer)},...native.map(file=>({file,source:fs.readFileSync(file,'utf8')}))];
 const green=targets.every(x=>x.source.includes(terminal25471.commandAfter))&&source.includes(terminal25471.editableAfter);
 if(!green){one(source,terminal25471.editableBefore);for(const x of targets)one(x.source,terminal25471.commandBefore);
  if(command==='apply'){
   for(const x of targets){const changed=x.source.replace(terminal25471.commandBefore,()=>terminal25471.commandAfter);if(x.owner)writeRendererModule(x.owner,changed);else fs.writeFileSync(x.file,changed);}
   writeRendererModule(owner,source.replace(terminal25471.editableBefore,()=>terminal25471.editableAfter));
  }
 }
 return{state:green||command==='apply'?'applied':'needs-apply',targets:[owner.file,renderer.file,...native].map(file=>path.relative(root,file))};
}
function one(s,v){if(s.split(v).length!==2)throw Error('Upstream changed: terminal module contract '+v)}

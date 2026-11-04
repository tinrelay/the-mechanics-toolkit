import fs from 'node:fs';import path from 'node:path';
import {readRendererModule,writeRendererModule} from '../../../src/renderer-module.mjs';
import {rosterOwner24614} from '../../agent-roster/profiles/build24614.mjs';
export const terminalCommandOwner24614=root=>({file:path.join(root,'webview/assets/async/265651.3442ea834c.js'),id:'Qph1',parameters:['e','t','n']});
export const terminal24614={
 commandBefore:'id:"toggleTerminal",titleIntlId:"codex.command.toggleTerminal",descriptionIntlId:"codex.commandDescription.toggleTerminal",requiredAccess:"codexLocal",commandMenuGroupKey:"panels",',
 editableBefore:'g="focusPageBlockControls"===s||"copyPageLink"===s||"clearAllUnreads"===s&&("Shift+Escape"===r||"Shift+Esc"===r),y=',
 editableAfter:'g="toggleTerminal"===s||"focusPageBlockControls"===s||"copyPageLink"===s||"clearAllUnreads"===s&&("Shift+Escape"===r||"Shift+Esc"===r),y='
};
terminal24614.commandAfter=terminal24614.commandBefore.replace('commandMenuGroupKey:','shortcutScope:"app",commandMenuGroupKey:');
export function runBuild24614({root,command}){
 const owner=rosterOwner24614(root),renderer=terminalCommandOwner24614(root),native=['early-bootstrap-339-a1c76730c29ac8b1.js','worker.js'].map(file=>path.join(root,'.vite/build',file));
 let source=readRendererModule(owner);for(const text of ['function lh(e){','{id:s,accelerator:r,allowRepeat:o,capture:l,runInRenderer:d,isMacOS:u}=e','allowWithinEditable:g,enabled:y,onKeyDown:n','li=n("hGgS")'])one(source,text);
 const targets=[{owner:renderer,source:readRendererModule(renderer)},...native.map(file=>({file,source:fs.readFileSync(file,'utf8')}))];
 const green=targets.every(x=>x.source.includes(terminal24614.commandAfter))&&source.includes(terminal24614.editableAfter);
 if(!green){one(source,terminal24614.editableBefore);for(const x of targets)one(x.source,terminal24614.commandBefore);
  if(command==='apply'){
   for(const x of targets){const changed=x.source.replace(terminal24614.commandBefore,()=>terminal24614.commandAfter);if(x.owner)writeRendererModule(x.owner,changed);else fs.writeFileSync(x.file,changed);}
   writeRendererModule(owner,source.replace(terminal24614.editableBefore,()=>terminal24614.editableAfter));
  }
 }
 return{state:green||command==='apply'?'applied':'needs-apply',targets:[owner.file,renderer.file,...native].map(file=>path.relative(root,file))};
}
function one(s,v){if(s.split(v).length!==2)throw Error('Upstream changed: terminal module contract '+v)}

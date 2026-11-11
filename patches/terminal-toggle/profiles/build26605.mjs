import fs from 'node:fs';import path from 'node:path';
import {readRendererModule,writeRendererModule} from '../../../src/renderer-module.mjs';
import {rosterOwner26605} from '../../agent-roster/profiles/build26605.mjs';
export const terminalCommandOwner26605=root=>({file:path.join(root,'webview/assets/async/514766.2d2f1ddc86.js'),id:'Qph1',parameters:['e','t','n']});
export const terminal26605={
 commandBefore:'id:"toggleTerminal",titleIntlId:"codex.command.toggleTerminal",descriptionIntlId:"codex.commandDescription.toggleTerminal",requiredAccess:"codexLocal",unifiedSearchGroupKey:"panels",',
 editableBefore:'x=m&&"[data-codex-composer]"||"exitWorkspaceFullView"===s||"focusPageBlockControls"===s||"copyPageLink"===s||"clearAllUnreads"===s&&("Shift+Escape"===o||"Shift+Esc"===o),w=',
 editableAfter:'x="toggleTerminal"===s||m&&"[data-codex-composer]"||"exitWorkspaceFullView"===s||"focusPageBlockControls"===s||"copyPageLink"===s||"clearAllUnreads"===s&&("Shift+Escape"===o||"Shift+Esc"===o),w='
};
terminal26605.commandAfter=terminal26605.commandBefore.replace('unifiedSearchGroupKey:','shortcutScope:"app",unifiedSearchGroupKey:');
export function runBuild26605({root,command}){
 const owner=rosterOwner26605(root),renderer=terminalCommandOwner26605(root),native=['early-bootstrap-631-9880b56d55f301d1.js','worker.js'].map(file=>path.join(root,'.vite/build',file));
 let source=readRendererModule(owner);for(const text of ['function lh(e){','{id:s,accelerator:o,allowRepeat:l,capture:d,runInRenderer:u,isMacOS:h}=e','allowWithinEditable:x,enabled:w,onKeyDown:a','li=n("hGgS")'])one(source,text);
 const targets=[{owner:renderer,source:readRendererModule(renderer)},...native.map(file=>({file,source:fs.readFileSync(file,'utf8')}))];
 const green=targets.every(x=>x.source.includes(terminal26605.commandAfter))&&source.includes(terminal26605.editableAfter);
 if(!green){one(source,terminal26605.editableBefore);for(const x of targets)one(x.source,terminal26605.commandBefore);
  if(command==='apply'){
   for(const x of targets){const changed=x.source.replace(terminal26605.commandBefore,()=>terminal26605.commandAfter);if(x.owner)writeRendererModule(x.owner,changed);else fs.writeFileSync(x.file,changed);}
   writeRendererModule(owner,source.replace(terminal26605.editableBefore,()=>terminal26605.editableAfter));
  }
 }
 return{state:green||command==='apply'?'applied':'needs-apply',targets:[owner.file,renderer.file,...native].map(file=>path.relative(root,file))};
}
function one(s,v){if(s.split(v).length!==2)throw Error('Upstream changed: terminal module contract '+v)}

import fs from 'node:fs';import path from 'node:path';
import {readRendererModule,writeRendererModule} from '../../../src/renderer-module.mjs';
import {rosterOwner29513} from '../../agent-roster/profiles/build29513.mjs';
export const terminalCommandOwner29513=root=>({file:path.join(root,'webview/assets/async/364313.d749d31da5.js'),id:'Qph1',parameters:['e','t','n']});
export const terminal29513={
 commandBefore:'id:"toggleTerminal",titleIntlId:"codex.command.toggleTerminal",descriptionIntlId:"codex.commandDescription.toggleTerminal",requiredAccess:"codexLocal",unifiedSearchGroupKey:"panels",',
 editableBefore:"I=\"composer.toggleDictation\"===l||_&&\"[data-codex-composer]\"||\"exitWorkspaceFullView\"===l||\"focusPageBlockControls\"===l||\"copyPageLink\"===l||\"clearAllUnreads\"===l&&(\"Shift+Escape\"===c||\"Shift+Esc\"===c)",
 editableAfter:"I=\"toggleTerminal\"===l||\"composer.toggleDictation\"===l||_&&\"[data-codex-composer]\"||\"exitWorkspaceFullView\"===l||\"focusPageBlockControls\"===l||\"copyPageLink\"===l||\"clearAllUnreads\"===l&&(\"Shift+Escape\"===c||\"Shift+Esc\"===c)"
};
terminal29513.commandAfter=terminal29513.commandBefore.replace('unifiedSearchGroupKey:','shortcutScope:"app",unifiedSearchGroupKey:');
export const terminalKeyboardOwners29513=root=>[
  {
    "file": "191628.72f208c924.js",
    "id": "EOr7",
    "parameters": [
      "e",
      "t",
      "n"
    ],
    "functionName": "j",
    "cache": "r",
    "classifier": "x",
    "commandBus":"h",
    "dispatcher": "b",
    "binding": "b=n(\"tO3J\")",
    "props": "{id:o,accelerator:c,allowRepeat:d,capture:u,runInRenderer:p,isMacOS:m,keyboardEventTarget:f}=e",
    "before": "w=\"composer.toggleDictation\"===o||v&&\"[data-codex-composer]\"||\"focusPageBlockControls\"===o||\"copyPageLink\"===o||\"clearAllUnreads\"===o&&(\"Shift+Escape\"===c||\"Shift+Esc\"===c)",
    "after": "w=\"toggleTerminal\"===o||\"composer.toggleDictation\"===o||v&&\"[data-codex-composer]\"||\"focusPageBlockControls\"===o||\"copyPageLink\"===o||\"clearAllUnreads\"===o&&(\"Shift+Escape\"===c||\"Shift+Esc\"===c)"
  },
  {
    "file": "21395.7ba02bc63b.js",
    "id": "EOr7",
    "parameters": [
      "e",
      "t",
      "r"
    ],
    "functionName": "T",
    "cache": "o",
    "classifier": "C",
    "commandBus":"m",
    "dispatcher": "y",
    "binding": "y=r(\"tO3J\")",
    "props": "{id:l,accelerator:d,allowRepeat:u,capture:c,runInRenderer:p,isMacOS:f,keyboardEventTarget:h}=e",
    "before": "S=\"composer.toggleDictation\"===l||b&&\"[data-codex-composer]\"||\"focusPageBlockControls\"===l||\"copyPageLink\"===l||\"clearAllUnreads\"===l&&(\"Shift+Escape\"===d||\"Shift+Esc\"===d)",
    "after": "S=\"toggleTerminal\"===l||\"composer.toggleDictation\"===l||b&&\"[data-codex-composer]\"||\"focusPageBlockControls\"===l||\"copyPageLink\"===l||\"clearAllUnreads\"===l&&(\"Shift+Escape\"===d||\"Shift+Esc\"===d)"
  }
].map(o=>({...o,file:path.join(root,'webview/assets/async',o.file)}));
export function runBuild29513({root,command}){
 const keyboards=terminalKeyboardOwners29513(root).map(owner=>({owner,source:readRendererModule(owner)})),renderer=terminalCommandOwner29513(root),native=["worker.js", "app-server-host.js", "process-telemetry-worker.js", "early-bootstrap-7-ce4a67f0257ee973.js"].map(file=>path.join(root,'.vite/build',file));
 for(const {source,owner} of keyboards)for(const text of [`function ${owner.functionName}(e){`,owner.props,owner.binding])one(source,text);
 const targets=[{owner:renderer,source:readRendererModule(renderer)},...native.map(file=>({file,source:fs.readFileSync(file,'utf8')}))];
 const green=targets.every(x=>x.source.includes(terminal29513.commandAfter))&&keyboards.every(x=>x.source.includes(x.owner.after));
 if(!green){for(const x of keyboards)one(x.source,x.owner.before);for(const x of targets)one(x.source,terminal29513.commandBefore);
  if(command==='apply'){
   for(const x of targets){const changed=x.source.replace(terminal29513.commandBefore,()=>terminal29513.commandAfter);if(x.owner)writeRendererModule(x.owner,changed);else fs.writeFileSync(x.file,changed);}
   for(const x of keyboards)writeRendererModule(x.owner,x.source.replace(x.owner.before,()=>x.owner.after));
  }
 }
 return{state:green||command==='apply'?'applied':'needs-apply',targets:[...keyboards.map(x=>x.owner.file),renderer.file,...native].map(file=>path.relative(root,file))};
}
function one(s,v){if(s.split(v).length!==2)throw Error('Upstream changed: terminal module contract '+v)}

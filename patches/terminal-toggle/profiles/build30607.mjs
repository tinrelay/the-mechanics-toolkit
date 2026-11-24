import fs from 'node:fs';import path from 'node:path';
import {readRendererModule,writeRendererModule} from '../../../src/renderer-module.mjs';
import {rosterOwner30607} from '../../agent-roster/profiles/build30607.mjs';
export const terminalCommandOwner30607=root=>({file:path.join(root,'webview/assets/async/366996.9782070574.js'),id:'Qph1',parameters:['e','t','n']});
export const terminal30607={
 commandBefore:'id:"toggleTerminal",titleIntlId:"codex.command.toggleTerminal",descriptionIntlId:"codex.commandDescription.toggleTerminal",requiredAccess:"codexLocal",unifiedSearchGroupKey:"panels",',
 editableBefore:"I=\"composer.toggleDictation\"===l||_&&\"[data-codex-composer]\"||\"exitWorkspaceFullView\"===l||\"focusPageBlockControls\"===l||\"copyPageLink\"===l||\"clearAllUnreads\"===l&&(\"Shift+Escape\"===c||\"Shift+Esc\"===c)",
 editableAfter:"I=\"toggleTerminal\"===l||\"composer.toggleDictation\"===l||_&&\"[data-codex-composer]\"||\"exitWorkspaceFullView\"===l||\"focusPageBlockControls\"===l||\"copyPageLink\"===l||\"clearAllUnreads\"===l&&(\"Shift+Escape\"===c||\"Shift+Esc\"===c)"
};
terminal30607.commandAfter=terminal30607.commandBefore.replace('unifiedSearchGroupKey:','shortcutScope:"app",unifiedSearchGroupKey:');
export const terminalKeyboardOwners30607=root=>[
  {
    "file": "886197.66245499ac.js",
    "id": "EOr7",
    "parameters": [
      "e",
      "t",
      "n"
    ],
    "functionName": "j",
    "cache": "r",
    "classifier": "I",
    "commandBus":"h",
    "dispatcher": "x",
    "binding": "x=n(\"tO3J\")",
    "props": "{id:o,accelerator:c,allowRepeat:d,capture:u,runInRenderer:p,isMacOS:f,keyboardEventTarget:m}=e",
    "before": "w=\"composer.toggleDictation\"===o||v&&\"[data-codex-composer]\"||\"focusPageBlockControls\"===o||\"copyPageLink\"===o||\"clearAllUnreads\"===o&&(\"Shift+Escape\"===c||\"Shift+Esc\"===c)",
    "after": "w=\"toggleTerminal\"===o||\"composer.toggleDictation\"===o||v&&\"[data-codex-composer]\"||\"focusPageBlockControls\"===o||\"copyPageLink\"===o||\"clearAllUnreads\"===o&&(\"Shift+Escape\"===c||\"Shift+Esc\"===c)"
  },
  {
    "file": "557371.75f7e88c1a.js",
    "id": "EOr7",
    "parameters": [
      "e",
      "t",
      "r"
    ],
    "functionName": "T",
    "cache": "o",
    "classifier": "C",
    "commandBus":"p",
    "dispatcher": "E",
    "binding": "E=r(\"tO3J\")",
    "props": "{id:i,accelerator:u,allowRepeat:d,capture:c,runInRenderer:m,isMacOS:f,keyboardEventTarget:g}=e",
    "before": "x=\"composer.toggleDictation\"===i||b&&\"[data-codex-composer]\"||\"focusPageBlockControls\"===i||\"copyPageLink\"===i||\"clearAllUnreads\"===i&&(\"Shift+Escape\"===u||\"Shift+Esc\"===u)",
    "after": "x=\"toggleTerminal\"===i||\"composer.toggleDictation\"===i||b&&\"[data-codex-composer]\"||\"focusPageBlockControls\"===i||\"copyPageLink\"===i||\"clearAllUnreads\"===i&&(\"Shift+Escape\"===u||\"Shift+Esc\"===u)"
  }
].map(o=>({...o,file:path.join(root,'webview/assets/async',o.file)}));
export function runBuild30607({root,command}){
 const keyboards=terminalKeyboardOwners30607(root).map(owner=>({owner,source:readRendererModule(owner)})),renderer=terminalCommandOwner30607(root),native=["app-server-host.js", "early-bootstrap-7-6ca1370a6a70ee99.js"].map(file=>path.join(root,'.vite/build',file));
 for(const {source,owner} of keyboards)for(const text of [`function ${owner.functionName}(e){`,owner.props,owner.binding])one(source,text);
 const targets=[{owner:renderer,source:readRendererModule(renderer)},...native.map(file=>({file,source:fs.readFileSync(file,'utf8')}))];
 const green=targets.every(x=>x.source.includes(terminal30607.commandAfter))&&keyboards.every(x=>x.source.includes(x.owner.after));
 if(!green){for(const x of keyboards)one(x.source,x.owner.before);for(const x of targets)one(x.source,terminal30607.commandBefore);
  if(command==='apply'){
   for(const x of targets){const changed=x.source.replace(terminal30607.commandBefore,()=>terminal30607.commandAfter);if(x.owner)writeRendererModule(x.owner,changed);else fs.writeFileSync(x.file,changed);}
   for(const x of keyboards)writeRendererModule(x.owner,x.source.replace(x.owner.before,()=>x.owner.after));
  }
 }
 return{state:green||command==='apply'?'applied':'needs-apply',targets:[...keyboards.map(x=>x.owner.file),renderer.file,...native].map(file=>path.relative(root,file))};
}
function one(s,v){if(s.split(v).length!==2)throw Error('Upstream changed: terminal module contract '+v)}

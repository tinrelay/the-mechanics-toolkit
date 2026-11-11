import path from "node:path";
import {readRendererModule, writeRendererModule} from "../../../src/renderer-module.mjs";
import {rosterOwner26605} from "../../agent-roster/profiles/build26605.mjs";
const owner=(root,file,id)=>({file:path.join(root,"webview/assets/async",file),id,parameters:["e","t","n"]});
export const reasoningOwners26605=root=>({turn:owner(root,"413566.34706e9cd0.js","FyzF"),activity:owner(root,"720744.158c9ed7b0.js","wGAn"),toggle:owner(root,"720744.158c9ed7b0.js","KMtq")});
export const build26605={turn:{ownerFunction:"function nj(e){",decisionBefore:"function nj(e){var t,n,a,u;",decisionAfter:"function nj(e){let MTKreasoningRetained=MTKuseReasoningRetention(e.conversationId);var t,n,a,u;",owner:'preventAutoCollapse:null!=rm||s5&&s_||sL&&(su||tS.items.some(nM))||rW',appliedOwner:'preventAutoCollapse:null!=rm||s5&&s_||sL&&(su||tS.items.some(nM))||rW||MTKreasoningRetained'},collapseMarker:'isCollapsed:o&&!s&&(l??!i)'};
export function runBuild26605({root,command,reasoningHook}){
 const o=reasoningOwners26605(root),p=build26605.turn;
 const activity=readRendererModule(o.activity),toggle=readRendererModule(o.toggle);
 one(activity,build26605.collapseMarker);one(activity,'preventAutoCollapse:i,persistedCollapsed:l');
 one(toggle,'onToggle:e=>{let t=!M;E.current=E.current+1,_.current=e,N(t?"collapsed":"expanded"),(w??k)(t)}');
 let source=readRendererModule(o.turn);one(source,'h=n("zd8w")');one(source,'voiceWorkActivity:ta,conversationId:to,hostId:tp,historyEntityKey:th');
 const helper=reasoningHook('h'),applied=source.includes(helper)&&source.includes(p.decisionAfter)&&source.includes(p.appliedOwner);
 if(!applied){if(source.includes('MTKuseReasoning'))throw Error('Partial reasoning module patch');for(const fragment of[p.ownerFunction,p.decisionBefore,p.owner])one(source,fragment);
 if(command==='apply'){if(!readRendererModule(rosterOwner26605(root)).includes('globalThis.__MTK_AGENT_ROSTER__=Object.freeze('))throw Error('Reasoning retention requires agent-roster');source=source.replace(p.decisionBefore,()=>helper+p.decisionAfter).replace(p.owner,()=>p.appliedOwner);writeRendererModule(o.turn,source)}}
 return{state:applied||command==='apply'?'applied':'needs-apply',policy:'.codex/agent-roster.json',targets:[path.relative(root,o.turn.file)]};
}
function one(s,v){if(s.split(v).length!==2)throw Error('Upstream changed: reasoning module contract '+v)}

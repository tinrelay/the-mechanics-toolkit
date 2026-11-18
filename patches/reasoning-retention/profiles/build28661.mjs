import path from "node:path";
import {readRendererModule, writeRendererModule} from "../../../src/renderer-module.mjs";
import {rosterOwner28661} from "../../agent-roster/profiles/build28661.mjs";
const owner=(root,file,id)=>({file:path.join(root,"webview/assets/async",file),id,parameters:["e","t","n"]});
export const reasoningOwners28661=root=>({turn:owner(root,"690365.bfe8283bb2.js","fCqg"),activity:owner(root,"461952.e510c5b516.js","SISf"),toggle:owner(root,"461952.e510c5b516.js","QypQ")});
export const build28661={turn:{ownerFunction:"function nE({",decisionBefore:"showFullTranscript:eC=!1}){var ej,eT,eS;",decisionAfter:"showFullTranscript:eC=!1}){let MTKreasoningRetained=MTKuseReasoningRetention(x);var ej,eT,eS;",owner:'preventAutoCollapse:null!=nc||t1&&eG||tn&&(P||T.items.some(e=>\"mcp-tool-call\"===e.type&&null!=e.mcpAppResourceUri))||n5',appliedOwner:'preventAutoCollapse:null!=nc||t1&&eG||tn&&(P||T.items.some(e=>\"mcp-tool-call\"===e.type&&null!=e.mcpAppResourceUri))||n5||MTKreasoningRetained'},collapseMarker:'isCollapsed:!i&&(l??!s)'};
export function runBuild28661({root,command,reasoningHook}){
 const o=reasoningOwners28661(root),p=build28661.turn;
 const activity=readRendererModule(o.activity),toggle=readRendererModule(o.toggle);
 one(activity,build28661.collapseMarker);one(activity,'preventAutoCollapse:s,persistedCollapsed:l');
 one(toggle,'onToggle:e=>{let t=!k;E.current=E.current+1,T.current=e,M(t?"collapsed":"expanded"),(x??I)(t)}');
 let source=readRendererModule(o.turn);one(source,'g=n("zd8w")');one(source,'voiceWorkActivity:v,conversationId:x,hostId:w,historyEntityKey:_');
 const helper=reasoningHook('g'),applied=source.includes(helper)&&source.includes(p.decisionAfter)&&source.includes(p.appliedOwner);
 if(!applied){if(source.includes('MTKuseReasoning'))throw Error('Partial reasoning module patch');for(const fragment of[p.ownerFunction,p.decisionBefore,p.owner])one(source,fragment);
 if(command==='apply'){if(!readRendererModule(rosterOwner28661(root)).includes('globalThis.__MTK_AGENT_ROSTER__=Object.freeze('))throw Error('Reasoning retention requires agent-roster');source=source.replace(p.ownerFunction,()=>helper+p.ownerFunction).replace(p.decisionBefore,()=>p.decisionAfter).replace(p.owner,()=>p.appliedOwner);writeRendererModule(o.turn,source)}}
 return{state:applied||command==='apply'?'applied':'needs-apply',policy:'.codex/agent-roster.json',targets:[path.relative(root,o.turn.file)]};
}
function one(s,v){if(s.split(v).length!==2)throw Error('Upstream changed: reasoning module contract '+v)}

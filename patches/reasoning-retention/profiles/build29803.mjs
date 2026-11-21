import path from "node:path";
import {readRendererModule, writeRendererModule} from "../../../src/renderer-module.mjs";
import {rosterOwner29803} from "../../agent-roster/profiles/build29803.mjs";
const owner=(root,file,id)=>({file:path.join(root,"webview/assets/async",file),id,parameters:["e","t","n"]});
export const reasoningOwners29803=root=>({turn:owner(root,"215774.99f7b9c141.js","bry6"),activity:owner(root,"154721.0941ae2da5.js","SISf"),toggle:owner(root,"154721.0941ae2da5.js","lAsD")});
export const build29803={turn:{ownerFunction:"function nh(e){",decisionBefore:"function nh(e){var t,n;",decisionAfter:"function nh(e){let MTKreasoningRetained=MTKuseReasoningRetention(e.conversationId);var t,n;",owner:'preventAutoCollapse:null!=s2||sB&&sd||sS&&(n3||t_.items.some(nw))',appliedOwner:'preventAutoCollapse:null!=s2||sB&&sd||sS&&(n3||t_.items.some(nw))||MTKreasoningRetained'},collapseMarker:'isCollapsed:!i&&(s??!l)'};
export function runBuild29803({root,command,reasoningHook}){
 const o=reasoningOwners29803(root),p=build29803.turn;
 const activity=readRendererModule(o.activity),toggle=readRendererModule(o.toggle);
 one(activity,build29803.collapseMarker);one(activity,'preventAutoCollapse:l,persistedCollapsed:s');
 one(toggle,"onToggle:e=>{let t=!M;E.current=E.current+1,_.current=e,N(t?\"collapsed\":\"expanded\"),(y??I)(t)}");
 let source=readRendererModule(o.turn);one(source,"c=n(\"zd8w\")");one(source,'voiceWorkActivity:h,conversationId:y,hostId:v,historyEntityKey:I,turnSearchKey:x,turn:w,turnState:b,turnRequests:_,preserveServerUserMessages:k');
 const helper=reasoningHook('c'),applied=source.includes(helper)&&source.includes(p.decisionAfter)&&source.includes(p.appliedOwner);
 if(!applied){if(source.includes('MTKuseReasoning'))throw Error('Partial reasoning module patch');for(const fragment of[p.ownerFunction,p.decisionBefore,p.owner])one(source,fragment);
 if(command==='apply'){if(!readRendererModule(rosterOwner29803(root)).includes('globalThis.__MTK_AGENT_ROSTER__=Object.freeze('))throw Error('Reasoning retention requires agent-roster');source=source.replace(p.ownerFunction,()=>helper+p.ownerFunction).replace(p.decisionBefore,()=>p.decisionAfter).replace(p.owner,()=>p.appliedOwner);writeRendererModule(o.turn,source)}}
 return{state:applied||command==='apply'?'applied':'needs-apply',policy:'.codex/agent-roster.json',targets:[path.relative(root,o.turn.file)]};
}
function one(s,v){if(s.split(v).length!==2)throw Error('Upstream changed: reasoning module contract '+v)}

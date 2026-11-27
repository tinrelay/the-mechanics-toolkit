import path from "node:path";
import {readRendererModule, writeRendererModule} from "../../../src/renderer-module.mjs";
import {rosterOwner30866} from "../../agent-roster/profiles/build30866.mjs";
const owner=(root,file,id)=>({file:path.join(root,"webview/assets/async",file),id,parameters:["e","t","n"]});
export const reasoningOwners30866=root=>({turn:owner(root,"761057.71d417d957.js","TPH0"),activity:owner(root,"407859.bb57f12697.js","SISf"),toggle:owner(root,"407859.bb57f12697.js","lAsD")});
export const build30866={turn:{ownerFunction:"function np(e){",decisionBefore:"function np(e){var t,n;",decisionAfter:"function np(e){let MTKreasoningRetained=MTKuseReasoningRetention(e.conversationId);var t,n;",owner:'preventAutoCollapse:null!=s6||sG&&sg||sT&&(n6||tC.items.some(ny))',appliedOwner:'preventAutoCollapse:null!=s6||sG&&sg||sT&&(n6||tC.items.some(ny))||MTKreasoningRetained'},collapseMarker:'isCollapsed:!i&&(s??!l)'};
export function runBuild30866({root,command,reasoningHook}){
 const o=reasoningOwners30866(root),p=build30866.turn;
 const activity=readRendererModule(o.activity),toggle=readRendererModule(o.toggle);
 one(activity,build30866.collapseMarker);one(activity,'preventAutoCollapse:l,persistedCollapsed:s');
 one(toggle,"onToggle:e=>{let t=!M;E.current=E.current+1,_.current=e,N(t?\"collapsed\":\"expanded\"),(y??I)(t)}");
 let source=readRendererModule(o.turn);one(source,"c=n(\"zd8w\")");one(source,'voiceWorkActivity:h,conversationId:y,hostId:v,historyEntityKey:x,turnSearchKey:I,turn:_,turnState:w,turnRequests:b,preserveServerUserMessages:k');
 const helper=reasoningHook('c'),applied=source.includes(helper)&&source.includes(p.decisionAfter)&&source.includes(p.appliedOwner);
 if(!applied){if(source.includes('MTKuseReasoning'))throw Error('Partial reasoning module patch');for(const fragment of[p.ownerFunction,p.decisionBefore,p.owner])one(source,fragment);
 if(command==='apply'){if(!readRendererModule(rosterOwner30866(root)).includes('globalThis.__MTK_AGENT_ROSTER__=Object.freeze('))throw Error('Reasoning retention requires agent-roster');source=source.replace(p.ownerFunction,()=>helper+p.ownerFunction).replace(p.decisionBefore,()=>p.decisionAfter).replace(p.owner,()=>p.appliedOwner);writeRendererModule(o.turn,source)}}
 return{state:applied||command==='apply'?'applied':'needs-apply',policy:'.codex/agent-roster.json',targets:[path.relative(root,o.turn.file)]};
}
function one(s,v){if(s.split(v).length!==2)throw Error('Upstream changed: reasoning module contract '+v)}

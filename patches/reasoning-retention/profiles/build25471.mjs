import path from "node:path";
import {readRendererModule, writeRendererModule} from "../../../src/renderer-module.mjs";
import {rosterOwner25471} from "../../agent-roster/profiles/build25471.mjs";
const owner=(root,file,id)=>({file:path.join(root,"webview/assets/async",file),id,parameters:["e","t","n"]});
export const reasoningOwners25471=root=>({turn:owner(root,"34052.444925845b.js","d159"),thread:owner(root,"884779.bf167971f9.js","KVWT"),activity:owner(root,"225284.63835849b6.js","SISf"),toggle:owner(root,"225284.63835849b6.js","QypQ")});
export const build25471={turn:{ownerFunction:"function nt(e){",decisionBefore:"function nt(e){var t,n,a,u;",decisionAfter:"function nt(e){let MTKreasoningRetained=MTKuseReasoningRetention(e.conversationId);var t,n,a,u;",owner:'preventAutoCollapse:null!=s5||sG&&sp||sw&&(n6||ty.items.some(nl))||rj',appliedOwner:'preventAutoCollapse:null!=s5||sG&&sp||sw&&(n6||ty.items.some(nl))||rj||MTKreasoningRetained'},collapseMarker:'isCollapsed:!s&&(l??!i)'};
export function runBuild25471({root,command,reasoningHook}){
 const o=reasoningOwners25471(root),p=build25471.turn;
 const activity=readRendererModule(o.activity),toggle=readRendererModule(o.toggle);
 one(activity,build25471.collapseMarker);one(activity,'preventAutoCollapse:i,persistedCollapsed:l');
 one(toggle,'onToggle:e=>{let t=!k;F.current=F.current+1,_.current=e,S(t?"collapsed":"expanded"),(x??I)(t)}');
 let source=readRendererModule(o.turn);one(source,'g=n("zd8w")');one(source,'voiceWorkActivity:tl,conversationId:tc,hostId:td,historyEntityKey:tu');
 const helper=reasoningHook('g'),applied=source.includes(helper)&&source.includes(p.decisionAfter)&&source.includes(p.appliedOwner);
 if(!applied){if(source.includes('MTKuseReasoning'))throw Error('Partial reasoning module patch');for(const fragment of[p.ownerFunction,p.decisionBefore,p.owner])one(source,fragment);
 if(command==='apply'){if(!readRendererModule(rosterOwner25471(root)).includes('globalThis.__MTK_AGENT_ROSTER__=Object.freeze('))throw Error('Reasoning retention requires agent-roster');source=source.replace(p.decisionBefore,()=>helper+p.decisionAfter).replace(p.owner,()=>p.appliedOwner);writeRendererModule(o.turn,source)}}
 return{state:applied||command==='apply'?'applied':'needs-apply',policy:'.codex/agent-roster.json',targets:[path.relative(root,o.turn.file)]};
}
function one(s,v){if(s.split(v).length!==2)throw Error('Upstream changed: reasoning module contract '+v)}

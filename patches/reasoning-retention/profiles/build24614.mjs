import path from 'node:path';
import {readRendererModule,writeRendererModule} from '../../../src/renderer-module.mjs';
import {rosterOwner24614} from '../../agent-roster/profiles/build24614.mjs';
const moduleOwner=(root,file,id)=>({file:path.join(root,'webview/assets/async',file),id,parameters:['e','t','n']});
export const reasoningOwners24614=root=>({turn:moduleOwner(root,'612929.9c0e0b234e.js','xcHM'),thread:moduleOwner(root,'357959.de4ec41383.js','zOSz'),activity:moduleOwner(root,'366297.f0d89078fe.js','SISf'),toggle:moduleOwner(root,'366297.f0d89078fe.js','QypQ')});
export const build24614={
 turn:{ownerFunction:'function tJ(e){',decisionBefore:'function tJ(e){var t,n,a,d;',decisionAfter:'function tJ(e){let MTKreasoningRetained=MTKuseReasoningRetention(e.conversationId);var t,n,a,d;',owner:'preventAutoCollapse:null!=sB||sk&&st||sc||ro',appliedOwner:'preventAutoCollapse:null!=sB||sk&&st||sc||ro||MTKreasoningRetained'},
 thread:{ownerFunction:'function sE({ref:e,conversationId:t,',decisionBefore:'usesUnifiedTimeline:N}){var L;let D=',decisionAfter:'usesUnifiedTimeline:N}){var L;let MTKreasoningThreadRetained=MTKuseReasoningThreadRetention(t),D=',collapse:'&&r2(D,{conversationId:t,turnSearchKey:r},!0),nW.current=eQ',appliedCollapse:'&&!MTKreasoningThreadRetained&&r2(D,{conversationId:t,turnSearchKey:r},!0),nW.current=eQ',dependencies:'[t,j,eQ,D,e1]);',appliedDependencies:'[t,j,eQ,D,e1,MTKreasoningThreadRetained]);'},
 collapseMarker:'isCollapsed:!i&&(l??!o)'
};
export function runBuild24614({root,command,reasoningHook,reasoningThreadHook}){
 const owners=reasoningOwners24614(root),p=build24614;
 const activity=readRendererModule(owners.activity),toggle=readRendererModule(owners.toggle);
 requireOne(activity,p.collapseMarker);requireOne(activity,'preventAutoCollapse:o,persistedCollapsed:l');
 requireOne(toggle,'onToggle:e=>{let t=!N;q.current=q.current+1,L.current=e,D(t),R(!t),(b??S)(t)}');
 const sources={turn:readRendererModule(owners.turn),thread:readRendererModule(owners.thread)};
 requireOne(sources.turn,'g=n("zd8w")'); requireOne(sources.turn,'voiceWorkActivity:e4,conversationId:e9,hostId:tt,historyEntityKey:ts');
 requireOne(sources.thread,'o=n("zd8w")');
 const helpers={turn:reasoningHook('g'),thread:reasoningThreadHook('o')};
 const applied=Object.keys(sources).map(key=>sources[key].includes(helpers[key])&&sources[key].includes(p[key].decisionAfter)&&sources[key].includes(p[key].appliedOwner??p[key].appliedCollapse)&&(key!=='thread'||sources[key].includes(p.thread.appliedDependencies)));
 if(applied.some(Boolean)&&!applied.every(Boolean))throw Error('Partial reasoning module patch');
 if(!applied.every(Boolean)){
  for(const key of Object.keys(sources)){
   if(sources[key].includes('MTKuseReasoning'))throw Error('Unknown reasoning module patch');
   for(const fragment of [p[key].ownerFunction,p[key].decisionBefore,p[key].owner??p[key].collapse,...(key==='thread'?[p.thread.dependencies]:[])])requireOne(sources[key],fragment);
  }
  if(command==='apply'){
   if(!readRendererModule(rosterOwner24614(root)).includes('globalThis.__MTK_AGENT_ROSTER__=Object.freeze('))throw Error('Reasoning retention requires agent-roster');
   for(const key of Object.keys(sources)){
    let source=sources[key].replace(p[key].ownerFunction,()=>helpers[key]+p[key].ownerFunction).replace(p[key].decisionBefore,()=>p[key].decisionAfter).replace(p[key].owner??p[key].collapse,()=>p[key].appliedOwner??p[key].appliedCollapse);
    if(key==='thread')source=source.replace(p.thread.dependencies,()=>p.thread.appliedDependencies);
    writeRendererModule(owners[key],source);
   }
  }
 }
 return{state:applied.every(Boolean)||command==='apply'?'applied':'needs-apply',policy:'.codex/agent-roster.json',targets:[...new Set(Object.values(owners).map(o=>path.relative(root,o.file)))]};
}
function requireOne(source,fragment){if(source.split(fragment).length!==2)throw Error('Upstream changed: reasoning module contract '+fragment)}

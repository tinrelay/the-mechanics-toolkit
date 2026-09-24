const app = {
  name: "26.917.62051-10789",
  pristineSeam: "function Bzc(){let e=(0,Uzc.c)(12),t=jr(X),",
  seam: "function Bzc(){MTKuseAgentRoster();let e=(0,Uzc.c)(12),t=jr(X),",
  patchedSeam: "function Bzc(){MTKuseAgentRoster();MTKusePaletteBootstrap();let e=(0,Uzc.c)(12),t=jr(X),",
  agentRoster: true,
  helperReplacements: [["QSl.useEffect", "Wzc.useEffect"]],
  bottomFadeBefore: null,
  bottomFadeAfter: null
};

const local = {
  name: "26.917.62051-10789",
  cacheBefore: "function hl(e){let t=(0,Sl.c)(98),",
  cacheAfter: "function hl(e){let t=(0,Sl.c)(99),",
  rootBefore: 't[78]!==J||t[79]!==re||t[80]!==ie||t[81]!==Y||t[82]!==oe||t[83]!==se||t[84]!==ce||t[85]!==le||t[86]!==ue||t[87]!==de||t[88]!==fe||t[89]!==pe?(he=(0,Q.jsxs)(`div`,{ref:P,className:`relative h-full min-h-0`,children:[J,re,ie,Y,ae,oe,se,ce,le,ue,de,fe,pe]}),t[78]=J,t[79]=re,t[80]=ie,t[81]=Y,t[82]=oe,t[83]=se,t[84]=ce,t[85]=le,t[86]=ue,t[87]=de,t[88]=fe,t[89]=pe,t[90]=he):he=t[90];',
  rootAfter: 't[78]!==J||t[79]!==re||t[80]!==ie||t[81]!==Y||t[82]!==oe||t[83]!==se||t[84]!==ce||t[85]!==le||t[86]!==ue||t[87]!==de||t[88]!==fe||t[89]!==pe||t[98]!==r?(he=(0,Q.jsxs)(`div`,{ref:P,"data-mtk-palette-room-host":!0,"data-mtk-palette-thread-id":r,className:`relative h-full min-h-0`,children:[J,re,ie,Y,ae,oe,se,ce,le,ue,de,fe,pe]}),t[78]=J,t[79]=re,t[80]=ie,t[81]=Y,t[82]=oe,t[83]=se,t[84]=ce,t[85]=le,t[86]=ue,t[87]=de,t[88]=fe,t[89]=pe,t[98]=r,t[90]=he):he=t[90];'
};

const bottomFade = {
  file: "app-primary",
  before: '(0,C7.jsx)(`div`,{"aria-hidden":!0,className:`pointer-events-none absolute inset-x-0 bottom-0 z-0 h-full bg-gradient-to-t from-surface via-surface extension:from-surface-secondary extension:via-surface-secondary`})',
  after: '(0,C7.jsx)(`div`,{"aria-hidden":!0,"data-mtk-palette-bottom-fade":!0,className:`pointer-events-none absolute inset-x-0 bottom-0 z-0 h-full bg-gradient-to-t from-surface via-surface extension:from-surface-secondary extension:via-surface-secondary`})'
};

const delegation = {
  owner: "function _v(e){let t=(0,vv.c)(14),",
  replacements: [
    ["function _v(e){let t=(0,vv.c)(14),", "function _v(e){let t=(0,vv.c)(16),", "build-10789 delegation palette cache size"],
    [
      "t[5]!==l||t[6]!==n||t[7]!==o||t[8]!==s||t[9]!==i||t[10]!==a||t[11]!==m||t[13]!==p?(h=(0,yv.jsx)(cv,{conversationId:n,label:p,message:i,sentAtMs:a,cwd:o,hostId:s,compactActions:l,onLabelClick:m,messageBubbleStyle:MTKdelegatedBubbleStyle}),t[5]=l,t[6]=n,t[7]=o,t[8]=s,t[9]=i,t[10]=a,t[11]=m,t[13]=p,t[12]=h):h=t[12]",
      "t[5]!==l||t[6]!==n||t[7]!==o||t[8]!==s||t[9]!==i||t[10]!==a||t[11]!==m||t[13]!==p||t[14]!==MTKtitle||t[15]!==r?(h=(0,yv.jsx)(cv,{conversationId:n,label:p,message:i,sentAtMs:a,cwd:o,hostId:s,compactActions:l,onLabelClick:m,messageBubbleStyle:MTKdelegatedBubbleStyle,paletteSourceTitle:MTKtitle,paletteSourceId:r}),t[5]=l,t[6]=n,t[7]=o,t[8]=s,t[9]=i,t[10]=a,t[11]=m,t[13]=p,t[14]=MTKtitle,t[15]=r,t[12]=h):h=t[12]",
      "build-10789 delegated provenance attributes handoff"
    ],
    ["function cv(e){let t=(0,lv.c)(17),", "function cv(e){let t=(0,lv.c)(19),", "build-10789 delegation wrapper palette cache size"],
    [
      "onLabelClick:l,messageBubbleStyle:MTKbubbleStyleOverride}=e,",
      "onLabelClick:l,messageBubbleStyle:MTKbubbleStyleOverride,paletteSourceTitle:MTKsourceTitle,paletteSourceId:MTKsourceId}=e,",
      "build-10789 delegation provenance props"
    ],
    [
      "t[13]!==p||t[14]!==m?(h=(0,uv.jsxs)(`div`,{className:`flex w-full flex-col items-end justify-end gap-1`,children:[p,m]}),t[13]=p,t[14]=m,t[15]=h):h=t[15]",
      "t[13]!==p||t[14]!==m||t[17]!==MTKsourceTitle||t[18]!==MTKsourceId?(h=(0,uv.jsxs)(`div`,{\"data-mtk-palette-source-title\":MTKsourceTitle??void 0,\"data-mtk-palette-source-id\":MTKsourceId??void 0,className:`flex w-full flex-col items-end justify-end gap-1`,children:[p,m]}),t[13]=p,t[14]=m,t[17]=MTKsourceTitle,t[18]=MTKsourceId,t[15]=h):h=t[15]",
      "build-10789 delegation provenance DOM surface"
    ]
  ]
};

const archiveBehaviorReplacements = [
  [
    "function PUs(",
    "function MTKuseSidebarArchivePolicy(e){return e.useSyncExternalStore(MTKsidebarArchiveSubscribe,MTKsidebarArchiveSnapshot,MTKsidebarArchiveSnapshot)}function PUs(",
    "build-10789 archive reload subscription hook"
  ],
  [
    "archive:T?void 0:{id:`archive-thread`,message:void 0,onSelect:()=>{i()}}",
    "archive:T||MTKsidebarArchiveProtected(h)?void 0:{id:`archive-thread`,message:void 0,onSelect:()=>{i()}}",
    "build-10789 local context archive item"
  ],
  [
    "function PUs({items:e,onArchive:t,onSelect:n,selectedThreadKeys:r,threadKey:i}){return r.length<2?e:",
    "function PUs({items:e,onArchive:t,onSelect:n,selectedThreadKeys:r,threadKey:i,archiveProtected:a}){return a&&(e=e.filter(e=>e.id!==`archive-thread`&&e.id!==`archive-task`)),r.length<2?e:",
    "build-10789 bulk archive filter"
  ],
  [
    "selectedThreadKeys:HLs(T,r),threadKey:r})",
    "selectedThreadKeys:HLs(T,r),threadKey:r,archiveProtected:HLs(T,r).some(e=>MTKsidebarArchiveProtected(NUs(T.get(kF,e))))})",
    "build-10789 local protected selection"
  ],
  [
    "selectedThreadKeys:HLs(ne,e),threadKey:e})",
    "selectedThreadKeys:HLs(ne,e),threadKey:e,archiveProtected:HLs(ne,e).some(e=>MTKsidebarArchiveProtected(NUs(ne.get(kF,e))))})",
    "build-10789 unified protected selection"
  ],
  [
    "archive:t!=null&&(Ye||ae)?tt:t,getMenuItems:",
    "archive:MTKsidebarArchiveProtected(n)?null:t!=null&&(Ye||ae)?tt:t,getMenuItems:",
    "build-10789 local inline archive"
  ],
  ["let Ye=ke?Re:null", "let Ye=ke&&!MTKsidebarArchiveProtected(pe)?Re:null", "build-10789 cloud inline archive"],
  [
    "if(ke&&e.push({id:`archive-task`",
    "if(ke&&!MTKsidebarArchiveProtected(pe)&&e.push({id:`archive-task`",
    "build-10789 cloud context archive item"
  ],
  [
    "archive:n,getMenuItems:oe?e=>d([",
    "archive:MTKsidebarArchiveProtected(e.task.id)?null:n,getMenuItems:oe&&!MTKsidebarArchiveProtected(e.task.id)?e=>d([",
    "build-10789 remote row archive"
  ]
];

const archiveRuntimeReplacements = [
  [
    "var hWs,gWs,H6;function _Ws(){return(_Ws=n((()=>{hWs=c(),W(),Cs(),gWs=Z(),",
    "var MTKarchiveReact,hWs,gWs,H6;function _Ws(){return(_Ws=n((()=>{hWs=c(),W(),Cs(),gWs=Z(),MTKarchiveReact=gWs,",
    "build-10789 sidebar React owner"
  ],
  ["function pWs(e){let t=(0,hWs.c)(171),", "function pWs(e){let MTKsidebarArchiveEpoch=MTKuseSidebarArchivePolicy(MTKarchiveReact),t=(0,hWs.c)(173),", "build-10789 local row archive subscription"],
  ["let _t=ta(gt),vt;t[83]!==x", "let _t=ta(gt),vt;t[171]!==MTKsidebarArchiveEpoch||t[83]!==x", "build-10789 local context archive invalidation"],
  ["t[100]=w,t[101]=vt):vt=t[101]", "t[100]=w,t[171]=MTKsidebarArchiveEpoch,t[101]=vt):vt=t[101]", "build-10789 local context archive snapshot"],
  ["let yt=ta(vt),bt=S&&x,xt;t[102]!==n", "let yt=ta(vt),bt=S&&x,xt;t[172]!==MTKsidebarArchiveEpoch||t[102]!==n", "build-10789 local inline archive invalidation"],
  ["t[112]=bt,t[113]=xt):xt=t[113]", "t[112]=bt,t[172]=MTKsidebarArchiveEpoch,t[113]=xt):xt=t[113]", "build-10789 local inline archive snapshot"],
  ["function $qs(e){let t=(0,tJs.c)(89),", "function $qs(e){let MTKsidebarArchiveEpoch=MTKuseSidebarArchivePolicy(MTKarchiveReact),t=(0,tJs.c)(90),", "build-10789 cloud row archive subscription"],
  ["let rt;t[78]!==ke", "let rt;t[89]!==MTKsidebarArchiveEpoch||t[78]!==ke", "build-10789 cloud context archive invalidation"],
  ["t[84]=L,t[85]=rt):rt=t[85]", "t[84]=L,t[89]=MTKsidebarArchiveEpoch,t[85]=rt):rt=t[85]", "build-10789 cloud context archive snapshot"],
  ["function MYs(e){let t=(0,BYs.c)(181),", "function MYs(e){let MTKsidebarArchiveEpoch=MTKuseSidebarArchivePolicy(MTKarchiveReact),t=(0,BYs.c)(182),", "build-10789 unified row archive subscription"],
  ["let vt=_t,yt;t[83]!==u", "let vt=_t,yt;t[181]!==MTKsidebarArchiveEpoch||t[83]!==u", "build-10789 remote archive invalidation"],
  ["t[116]=O,t[117]=yt):yt=t[117]", "t[116]=O,t[181]=MTKsidebarArchiveEpoch,t[117]=yt):yt=t[117]", "build-10789 remote archive snapshot"]
];

const archive = {
  pristine: archiveBehaviorReplacements.map(([before]) => before),
  applied: archiveBehaviorReplacements.map(([, after]) => after),
  replacements: archiveBehaviorReplacements,
  runtimePristine: archiveRuntimeReplacements.map(([before]) => before),
  runtimeApplied: archiveRuntimeReplacements.map(([, after]) => after)
};

function replaceOnce(source, before, after, label) {
  const first = source.indexOf(before);
  if (first < 0 || source.indexOf(before, first + before.length) >= 0) throw new Error(`missing or ambiguous ${label}`);
  return source.slice(0, first) + after + source.slice(first + before.length);
}

export function applyBuild10789ArchiveRuntime(source) {
  for (const replacement of archiveRuntimeReplacements) source = replaceOnce(source, ...replacement);
  return source;
}

export function inspectBuild10789ArchiveRuntime(source) {
  const before = archive.runtimePristine.filter(value => source.includes(value)).length;
  const after = archive.runtimeApplied.filter(value => source.includes(value)).length;
  if (before === archiveRuntimeReplacements.length && after === 0) return "needs-apply";
  if (before === 0 && after === archiveRuntimeReplacements.length) return "applied";
  throw new Error(`Unrecognized build-10789 archive runtime state: before=${before} after=${after}`);
}

export const build10789 = { app, local, bottomFade, delegation, archive };

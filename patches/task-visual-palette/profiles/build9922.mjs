const app = {
  name: "26.915.31945-9922",
  pristineSeam: "function Vvl(){let e=(0,Wvl.c)(12),t=xf($),",
  seam: "function Vvl(){MTKuseAgentRoster();let e=(0,Wvl.c)(12),t=xf($),",
  patchedSeam: "function Vvl(){MTKuseAgentRoster();MTKusePaletteBootstrap();let e=(0,Wvl.c)(12),t=xf($),",
  agentRoster: true,
  helperReplacements: [["QSl.useEffect", "Gvl.useEffect"]],
  bottomFadeBefore: null,
  bottomFadeAfter: null
};

const local = {
  name: "26.915.31945-9922",
  cacheBefore: "function pl(e){let t=(0,bl.c)(99),",
  cacheAfter: "function pl(e){let t=(0,bl.c)(100),",
  rootBefore: 't[79]!==G||t[80]!==K||t[81]!==q||t[82]!==ie||t[83]!==oe||t[84]!==se||t[85]!==ce||t[86]!==le||t[87]!==ue||t[88]!==de||t[89]!==fe||t[90]!==pe?(me=(0,Q.jsxs)(`div`,{ref:N,className:`relative h-full min-h-0`,children:[G,K,q,ie,ae,oe,se,ce,le,ue,de,fe,pe]}),t[79]=G,t[80]=K,t[81]=q,t[82]=ie,t[83]=oe,t[84]=se,t[85]=ce,t[86]=le,t[87]=ue,t[88]=de,t[89]=fe,t[90]=pe,t[91]=me):me=t[91];',
  rootAfter: 't[79]!==G||t[80]!==K||t[81]!==q||t[82]!==ie||t[83]!==oe||t[84]!==se||t[85]!==ce||t[86]!==le||t[87]!==ue||t[88]!==de||t[89]!==fe||t[90]!==pe||t[99]!==r?(me=(0,Q.jsxs)(`div`,{ref:N,"data-mtk-palette-room-host":!0,"data-mtk-palette-thread-id":r,className:`relative h-full min-h-0`,children:[G,K,q,ie,ae,oe,se,ce,le,ue,de,fe,pe]}),t[79]=G,t[80]=K,t[81]=q,t[82]=ie,t[83]=oe,t[84]=se,t[85]=ce,t[86]=le,t[87]=ue,t[88]=de,t[89]=fe,t[90]=pe,t[99]=r,t[91]=me):me=t[91];'
};

const bottomFade = {
  file: "app-primary",
  before: '(0,w7.jsx)(`div`,{"aria-hidden":!0,className:`pointer-events-none absolute inset-x-0 bottom-0 z-0 h-full bg-gradient-to-t from-surface via-surface extension:from-surface-secondary extension:via-surface-secondary`})',
  after: '(0,w7.jsx)(`div`,{"aria-hidden":!0,"data-mtk-palette-bottom-fade":!0,className:`pointer-events-none absolute inset-x-0 bottom-0 z-0 h-full bg-gradient-to-t from-surface via-surface extension:from-surface-secondary extension:via-surface-secondary`})'
};

const delegation = {
  owner: "function oy(e){let t=(0,sy.c)(14),",
  replacements: [
    ["function oy(e){let t=(0,sy.c)(14),", "function oy(e){let t=(0,sy.c)(16),", "build-9922 delegation palette cache size"],
    [
      "t[5]!==l||t[6]!==n||t[7]!==o||t[8]!==s||t[9]!==i||t[10]!==a||t[11]!==m||t[13]!==p?(h=(0,cy.jsx)(Zv,{conversationId:n,label:p,message:i,sentAtMs:a,cwd:o,hostId:s,compactActions:l,onLabelClick:m,messageBubbleStyle:MTKdelegatedBubbleStyle}),t[5]=l,t[6]=n,t[7]=o,t[8]=s,t[9]=i,t[10]=a,t[11]=m,t[13]=p,t[12]=h):h=t[12]",
      "t[5]!==l||t[6]!==n||t[7]!==o||t[8]!==s||t[9]!==i||t[10]!==a||t[11]!==m||t[13]!==p||t[14]!==MTKtitle||t[15]!==r?(h=(0,cy.jsx)(Zv,{conversationId:n,label:p,message:i,sentAtMs:a,cwd:o,hostId:s,compactActions:l,onLabelClick:m,messageBubbleStyle:MTKdelegatedBubbleStyle,paletteSourceTitle:MTKtitle,paletteSourceId:r}),t[5]=l,t[6]=n,t[7]=o,t[8]=s,t[9]=i,t[10]=a,t[11]=m,t[13]=p,t[14]=MTKtitle,t[15]=r,t[12]=h):h=t[12]",
      "build-9922 delegated provenance attributes handoff"
    ],
    ["function Zv(e){let t=(0,Qv.c)(17),", "function Zv(e){let t=(0,Qv.c)(19),", "build-9922 delegation wrapper palette cache size"],
    [
      "onLabelClick:l,messageBubbleStyle:MTKbubbleStyleOverride}=e,",
      "onLabelClick:l,messageBubbleStyle:MTKbubbleStyleOverride,paletteSourceTitle:MTKsourceTitle,paletteSourceId:MTKsourceId}=e,",
      "build-9922 delegation provenance props"
    ],
    [
      "t[13]!==p||t[14]!==m?(h=(0,$v.jsxs)(`div`,{className:`flex w-full flex-col items-end justify-end gap-1`,children:[p,m]}),t[13]=p,t[14]=m,t[15]=h):h=t[15]",
      "t[13]!==p||t[14]!==m||t[17]!==MTKsourceTitle||t[18]!==MTKsourceId?(h=(0,$v.jsxs)(`div`,{\"data-mtk-palette-source-title\":MTKsourceTitle??void 0,\"data-mtk-palette-source-id\":MTKsourceId??void 0,className:`flex w-full flex-col items-end justify-end gap-1`,children:[p,m]}),t[13]=p,t[14]=m,t[17]=MTKsourceTitle,t[18]=MTKsourceId,t[15]=h):h=t[15]",
      "build-9922 delegation provenance DOM surface"
    ]
  ]
};

const archiveBehaviorReplacements = [
  [
    "function nSc({scope:e,target:t,actions:n,onRename:r,onArchive:i,",
    "function MTKuseSidebarArchivePolicy(e){return e.useSyncExternalStore(MTKsidebarArchiveSubscribe,MTKsidebarArchiveSnapshot,MTKsidebarArchiveSnapshot)}function nSc({scope:e,target:t,actions:n,onRename:r,onArchive:i,",
    "build-9922 archive reload hook"
  ],
  [
    "archive:T?void 0:{id:`archive-thread`,message:void 0,onSelect:()=>{i()}}",
    "archive:T||MTKsidebarArchiveProtected(h)?void 0:{id:`archive-thread`,message:void 0,onSelect:()=>{i()}}",
    "build-9922 local context archive item"
  ],
  [
    "function ySc({items:e,onArchive:t,onSelect:n,selectedThreadKeys:r,threadKey:i}){return r.length<2?e:",
    "function ySc({items:e,onArchive:t,onSelect:n,selectedThreadKeys:r,threadKey:i,archiveProtected:a}){return a&&(e=e.filter(e=>e.id!==`archive-thread`&&e.id!==`archive-task`)),r.length<2?e:",
    "build-9922 bulk archive filter"
  ],
  [
    "selectedThreadKeys:Lhc(T,r),threadKey:r})",
    "selectedThreadKeys:Lhc(T,r),threadKey:r,archiveProtected:Lhc(T,r).some(e=>{let t=T.get(YF,e),n=t?.kind===`local`?t.conversationId:t?.kind===`remote`?t.task.id:null;return MTKsidebarArchiveProtected(n)})})",
    "build-9922 local protected selection"
  ],
  [
    "selectedThreadKeys:Lhc(ne,e),threadKey:e})",
    "selectedThreadKeys:Lhc(ne,e),threadKey:e,archiveProtected:Lhc(ne,e).some(e=>{let t=ne.get(YF,e),n=t?.kind===`local`?t.conversationId:t?.kind===`remote`?t.task.id:null;return MTKsidebarArchiveProtected(n)})})",
    "build-9922 unified protected selection"
  ],
  [
    "archive:t!=null&&(Fe||V)?Ve:t,getMenuItems:",
    "archive:MTKsidebarArchiveProtected(n)?null:t!=null&&(Fe||V)?Ve:t,getMenuItems:",
    "build-9922 local inline archive"
  ],
  ["let Je=ke?Re:null", "let Je=ke&&!MTKsidebarArchiveProtected(pe)?Re:null", "build-9922 cloud inline archive"],
  [
    "if(ke&&e.push({id:`archive-task`",
    "if(ke&&!MTKsidebarArchiveProtected(pe)&&e.push({id:`archive-task`",
    "build-9922 cloud context archive item"
  ],
  [
    "archive:n,getMenuItems:oe?e=>d([",
    "archive:MTKsidebarArchiveProtected(e.task.id)?null:n,getMenuItems:oe&&!MTKsidebarArchiveProtected(e.task.id)?e=>d([",
    "build-9922 remote row archive"
  ]
];

const archiveRuntimeReplacements = [
  [
    "var Xwc,Zwc,X8,Qwc;function $wc(){return($wc=n((()=>{Xwc=G(),Gi(),Q(),Br(),Zwc=X(),",
    "var MTKarchiveReact,Xwc,Zwc,X8,Qwc;function $wc(){return($wc=n((()=>{Xwc=G(),Gi(),Q(),Br(),Zwc=X(),MTKarchiveReact=Zwc,",
    "build-9922 sidebar React owner"
  ],
  [
    "function QSc(e){let t=(0,eCc.c)(154),",
    "function QSc(e){let MTKsidebarArchiveEpoch=MTKuseSidebarArchivePolicy(MTKarchiveReact),t=(0,eCc.c)(156),",
    "build-9922 local row archive subscription"
  ],
  ["let rt=ct(nt),it;t[71]!==x", "let rt=ct(nt),it;t[154]!==MTKsidebarArchiveEpoch||t[71]!==x", "build-9922 local context archive invalidation"],
  [
    "t[88]=w,t[89]=it):it=t[89]",
    "t[88]=w,t[154]=MTKsidebarArchiveEpoch,t[89]=it):it=t[89]",
    "build-9922 local context archive snapshot"
  ],
  [
    "let at=ct(it),ot=S&&x,st;t[90]!==n",
    "let at=ct(it),ot=S&&x,st;t[155]!==MTKsidebarArchiveEpoch||t[90]!==n",
    "build-9922 local inline archive invalidation"
  ],
  [
    "t[100]=ot,t[101]=st):st=t[101]",
    "t[100]=ot,t[155]=MTKsidebarArchiveEpoch,t[101]=st):st=t[101]",
    "build-9922 local inline archive snapshot"
  ],
  [
    "function cCc(e){let t=(0,uCc.c)(89),",
    "function cCc(e){let MTKsidebarArchiveEpoch=MTKuseSidebarArchivePolicy(MTKarchiveReact),t=(0,uCc.c)(90),",
    "build-9922 cloud row archive subscription"
  ],
  ["let nt;t[78]!==ke", "let nt;t[89]!==MTKsidebarArchiveEpoch||t[78]!==ke", "build-9922 cloud context archive invalidation"],
  [
    "t[84]=L,t[85]=nt):nt=t[85]",
    "t[84]=L,t[89]=MTKsidebarArchiveEpoch,t[85]=nt):nt=t[85]",
    "build-9922 cloud context archive snapshot"
  ],
  [
    "function Hwc(e){let t=(0,Xwc.c)(178),",
    "function Hwc(e){let MTKsidebarArchiveEpoch=MTKuseSidebarArchivePolicy(MTKarchiveReact),t=(0,Xwc.c)(179),",
    "build-9922 unified row archive subscription"
  ],
  ["let ft=dt,pt;t[80]!==u", "let ft=dt,pt;t[178]!==MTKsidebarArchiveEpoch||t[80]!==u", "build-9922 remote archive invalidation"],
  [
    "t[113]=O,t[114]=pt):pt=t[114]",
    "t[113]=O,t[178]=MTKsidebarArchiveEpoch,t[114]=pt):pt=t[114]",
    "build-9922 remote archive snapshot"
  ]
];

export const build9922 = {
  app,
  local,
  bottomFade,
  delegation,
  archive: {
    applied: archiveBehaviorReplacements.map(([, after]) => after),
    pristine: archiveBehaviorReplacements.map(([before]) => before),
    replacements: archiveBehaviorReplacements,
    runtimeApplied: archiveRuntimeReplacements.map(([, after]) => after),
    runtimePristine: archiveRuntimeReplacements.map(([before]) => before)
  }
};

function runtimeReplacements(profile) {
  const owner = Array.isArray(profile) ? profile : profile?.owner;
  const localMemo = Array.isArray(profile) ? "ct" : profile?.localMemo ?? "ct";
  return [owner ?? archiveRuntimeReplacements[0], ...archiveRuntimeReplacements.slice(1)].map(replacement =>
    replacement.map(value => value.replaceAll("=ct(nt)", `=${localMemo}(nt)`).replaceAll("=ct(it)", `=${localMemo}(it)`))
  );
}

export function applyBuild9922ArchiveRuntime(source, profile) {
  for (const replacement of runtimeReplacements(profile)) source = replaceOnce(source, ...replacement);
  return source;
}

export function inspectBuild9922ArchiveRuntime(source, profile) {
  const replacements = runtimeReplacements(profile);
  const before = replacements.filter(([value]) => source.includes(value)).length;
  const after = replacements.filter(([, value]) => source.includes(value)).length;
  if (before === replacements.length && after === 0) return "needs-apply";
  if (before === 0 && after === replacements.length) return "applied";
  throw new Error(`Unrecognized build-9922 archive runtime state: before=${before} after=${after}`);
}

function replaceOnce(source, before, after, label) {
  const first = source.indexOf(before);
  if (first < 0) throw new Error(`missing ${label}`);
  if (source.indexOf(before, first + before.length) >= 0) throw new Error(`ambiguous ${label}`);
  return source.slice(0, first) + after + source.slice(first + before.length);
}

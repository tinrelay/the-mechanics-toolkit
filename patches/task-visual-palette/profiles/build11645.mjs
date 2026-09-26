const app = {
  name: "26.924.22138-11645",
  pristineSeam: "function _0a(){let e=(0,b0a.c)(12),t=Jl(Q),",
  seam: "function _0a(){MTKuseAgentRoster();let e=(0,b0a.c)(12),t=Jl(Q),",
  patchedSeam: "function _0a(){MTKuseAgentRoster();MTKusePaletteBootstrap();let e=(0,b0a.c)(12),t=Jl(Q),",
  agentRoster: true,
  helperReplacements: [["QSl.useEffect", "x0a.useEffect"]]
};

const local = {
  name: app.name,
  cacheBefore: "function Gl(e){let t=(0,Ql.c)(109),",
  cacheAfter: "function Gl(e){let t=(0,Ql.c)(110),",
  rootBefore: 't[88]!==de||t[89]!==fe||t[90]!==pe||t[91]!==he||t[92]!==_e||t[93]!==ve||t[94]!==ye||t[95]!==be||t[96]!==xe||t[97]!==Se||t[98]!==Ce||t[99]!==we?(Te=(0,Q.jsxs)(`div`,{ref:R,className:`relative h-full min-h-0`,children:[de,fe,pe,he,_e,ve,ye,be,xe,Se,Ce,we]}),t[88]=de,t[89]=fe,t[90]=pe,t[91]=he,t[92]=_e,t[93]=ve,t[94]=ye,t[95]=be,t[96]=xe,t[97]=Se,t[98]=Ce,t[99]=we,t[100]=Te):Te=t[100];',
  rootAfter: 't[88]!==de||t[89]!==fe||t[90]!==pe||t[91]!==he||t[92]!==_e||t[93]!==ve||t[94]!==ye||t[95]!==be||t[96]!==xe||t[97]!==Se||t[98]!==Ce||t[99]!==we||t[109]!==i?(Te=(0,Q.jsxs)(`div`,{ref:R,"data-mtk-palette-room-host":!0,"data-mtk-palette-thread-id":i,className:`relative h-full min-h-0`,children:[de,fe,pe,he,_e,ve,ye,be,xe,Se,Ce,we]}),t[88]=de,t[89]=fe,t[90]=pe,t[91]=he,t[92]=_e,t[93]=ve,t[94]=ye,t[95]=be,t[96]=xe,t[97]=Se,t[98]=Ce,t[99]=we,t[109]=i,t[100]=Te):Te=t[100];'
};

const bottomFade = {
  file: "app-primary",
  before: '(0,t9.jsx)(`div`,{"aria-hidden":!0,className:`pointer-events-none absolute inset-x-0 -top-8 bottom-0 z-0 bg-gradient-to-t from-surface via-surface via-[calc(100%-var(--spacing)*8)] group-has-[[data-conversation-followup-reserved-hidden=true]]/thread-scroll-layout:top-6 extension:from-surface-secondary extension:via-surface-secondary`})',
  after: '(0,t9.jsx)(`div`,{"aria-hidden":!0,"data-mtk-palette-bottom-fade":!0,className:`pointer-events-none absolute inset-x-0 -top-8 bottom-0 z-0 bg-gradient-to-t from-surface via-surface via-[calc(100%-var(--spacing)*8)] group-has-[[data-conversation-followup-reserved-hidden=true]]/thread-scroll-layout:top-6 extension:from-surface-secondary extension:via-surface-secondary`})'
};

const delegation = {
  owner: "function _y(e){let t=(0,vy.c)(14),",
  replacements: [
    ["function _y(e){let t=(0,vy.c)(14),", "function _y(e){let t=(0,vy.c)(16),"],
    [
      "t[5]!==l||t[6]!==n||t[7]!==o||t[8]!==s||t[9]!==i||t[10]!==a||t[11]!==h||t[13]!==m?(g=(0,yy.jsx)(iy,{conversationId:n,label:m,message:i,sentAtMs:a,cwd:o,hostId:s,compactActions:l,onLabelClick:h,messageBubbleStyle:MTKdelegatedBubbleStyle}),t[5]=l,t[6]=n,t[7]=o,t[8]=s,t[9]=i,t[10]=a,t[11]=h,t[13]=m,t[12]=g):g=t[12]",
      "t[5]!==l||t[6]!==n||t[7]!==o||t[8]!==s||t[9]!==i||t[10]!==a||t[11]!==h||t[13]!==m||t[14]!==MTKtitle||t[15]!==r?(g=(0,yy.jsx)(iy,{conversationId:n,label:m,message:i,sentAtMs:a,cwd:o,hostId:s,compactActions:l,onLabelClick:h,messageBubbleStyle:MTKdelegatedBubbleStyle,paletteSourceTitle:MTKtitle,paletteSourceId:r}),t[5]=l,t[6]=n,t[7]=o,t[8]=s,t[9]=i,t[10]=a,t[11]=h,t[13]=m,t[14]=MTKtitle,t[15]=r,t[12]=g):g=t[12]"
    ],
    ["function iy(e){let t=(0,ay.c)(17),", "function iy(e){let t=(0,ay.c)(19),"],
    [
      "onLabelClick:l,messageBubbleStyle:MTKbubbleStyleOverride}=e,",
      "onLabelClick:l,messageBubbleStyle:MTKbubbleStyleOverride,paletteSourceTitle:MTKsourceTitle,paletteSourceId:MTKsourceId}=e,"
    ],
    [
      "t[13]!==p||t[14]!==m?(h=(0,oy.jsxs)(`div`,{className:`flex w-full flex-col items-end justify-end gap-1`,children:[p,m]}),t[13]=p,t[14]=m,t[15]=h):h=t[15]",
      "t[13]!==p||t[14]!==m||t[17]!==MTKsourceTitle||t[18]!==MTKsourceId?(h=(0,oy.jsxs)(`div`,{\"data-mtk-palette-source-title\":MTKsourceTitle??void 0,\"data-mtk-palette-source-id\":MTKsourceId??void 0,className:`flex w-full flex-col items-end justify-end gap-1`,children:[p,m]}),t[13]=p,t[14]=m,t[17]=MTKsourceTitle,t[18]=MTKsourceId,t[15]=h):h=t[15]"
    ]
  ]
};

const archiveBehaviorReplacements = [
  [
    "function CQi({items:e,onArchive:t,onSelect:n,selectedThreadKeys:r,threadKey:i}){return r.length<2?e:",
    "function CQi({items:e,onArchive:t,onSelect:n,selectedThreadKeys:r,threadKey:i,archiveProtected:a}){return a&&(e=e.filter(e=>e.id!==`archive-thread`&&e.id!==`archive-task`)),r.length<2?e:"
  ],
  [
    "archive:T?void 0:E});o===`sidebar`",
    "archive:T||MTKsidebarArchiveProtected(h)?void 0:E});o===`sidebar`"
  ],
  [
    "selectedThreadKeys:EJi(T,r),threadKey:r})",
    "selectedThreadKeys:EJi(T,r),threadKey:r,archiveProtected:EJi(T,r).some(e=>{let t=T.get(zA,e);return MTKsidebarArchiveProtected(t?.kind===`local`?t.conversationId:t?.kind===`remote`?t.task.id:null)})})"
  ],
  [
    "selectedThreadKeys:EJi(re,e),threadKey:e})",
    "selectedThreadKeys:EJi(re,e),threadKey:e,archiveProtected:EJi(re,e).some(e=>{let t=re.get(zA,e);return MTKsidebarArchiveProtected(t?.kind===`local`?t.conversationId:t?.kind===`remote`?t.task.id:null)})})"
  ],
  [
    "archive:t!=null&&($e||ue)?at:t,getMenuItems:",
    "archive:MTKsidebarArchiveProtected(n)?null:t!=null&&($e||ue)?at:t,getMenuItems:"
  ],
  ["let Je=ke?Re:null", "let Je=ke&&!MTKsidebarArchiveProtected(pe)?Re:null"],
  [
    "if(ke&&e.push({id:`archive-task`,message:pQi.archiveTask,onSelect:Re})",
    "if(ke&&!MTKsidebarArchiveProtected(pe)&&e.push({id:`archive-task`,message:pQi.archiveTask,onSelect:Re})"
  ],
  [
    "archive:n,getMenuItems:ae?e=>u([...c,...e==null?[]:[{id:`archive-task`",
    "archive:MTKsidebarArchiveProtected(e.task.id)?null:n,getMenuItems:ae&&!MTKsidebarArchiveProtected(e.task.id)?e=>u([...c,...e==null?[]:[{id:`archive-task`"
  ]
];

const archiveRuntimeReplacements = [
  [
    "function CQi({items:e,",
    "function MTKuseSidebarArchivePolicy(){return x0a.useSyncExternalStore(MTKsidebarArchiveSubscribe,MTKsidebarArchiveSnapshot,MTKsidebarArchiveSnapshot)}function CQi({items:e,"
  ],
  [
    "function b3i(e){let t=(0,S3i.c)(175),",
    "function b3i(e){let MTKsidebarArchiveEpoch=MTKuseSidebarArchivePolicy(),t=(0,S3i.c)(177),"
  ],
  ["let xt=Tr(bt),St;t[83]!==F", "let xt=Tr(bt),St;t[175]!==MTKsidebarArchiveEpoch||t[83]!==F"],
  ["t[104]=w,t[105]=St):St=t[105]", "t[104]=w,t[175]=MTKsidebarArchiveEpoch,t[105]=St):St=t[105]"],
  ["let Ct=Tr(St),wt=S&&ae,Tt;t[106]!==n", "let Ct=Tr(St),wt=S&&ae,Tt;t[176]!==MTKsidebarArchiveEpoch||t[106]!==n"],
  ["t[117]=wt,t[118]=Tt):Tt=t[118]", "t[117]=wt,t[176]=MTKsidebarArchiveEpoch,t[118]=Tt):Tt=t[118]"],
  [
    "function uQi(e){let t=(0,fQi.c)(89),",
    "function uQi(e){let MTKsidebarArchiveEpoch=MTKuseSidebarArchivePolicy(),t=(0,fQi.c)(90),"
  ],
  ["let rt=nt,it;return t[86]!==rt", "let rt=nt,it;return t[89]!==MTKsidebarArchiveEpoch||t[86]!==rt"],
  ["t[87]=tt,t[88]=it):it=t[88]", "t[87]=tt,t[89]=MTKsidebarArchiveEpoch,t[88]=it):it=t[88]"],
  [
    "function L3i(e){let t=(0,G3i.c)(183),",
    "function L3i(e){let MTKsidebarArchiveEpoch=MTKuseSidebarArchivePolicy(),t=(0,G3i.c)(184),"
  ],
  ["let yt=vt,bt;t[82]!==De", "let yt=vt,bt;t[183]!==MTKsidebarArchiveEpoch||t[82]!==De"],
  ["t[116]=O,t[117]=bt):bt=t[117]", "t[116]=O,t[183]=MTKsidebarArchiveEpoch,t[117]=bt):bt=t[117]"]
];

const archive = {
  pristine: archiveBehaviorReplacements.map(([before]) => before),
  applied: archiveBehaviorReplacements.map(([, after]) => after),
  replacements: archiveBehaviorReplacements,
  runtimePristine: archiveRuntimeReplacements.map(([before]) => before),
  runtimeApplied: archiveRuntimeReplacements.map(([, after]) => after),
  runtimeReplacements: archiveRuntimeReplacements
};

export const build11645 = {app, local, bottomFade, delegation, archive};

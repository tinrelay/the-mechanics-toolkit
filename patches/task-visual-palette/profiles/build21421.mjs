const archiveBehaviorReplacements = [
  [
    "function bKc({scope:e,items:t,onArchive:n,onSelect:r,selectedThreadKeys:i,threadKey:a}){if(i.length<2)return t;",
    "function bKc({scope:e,items:t,onArchive:n,onSelect:r,selectedThreadKeys:i,threadKey:a}){if(i.some(t=>{let n=e.get(WB,t);return MTKsidebarArchiveProtected(n?.kind===`local`?n.conversationId:n?.kind===`remote`?n.task.id:null)}))t=t.filter(e=>e.id!==`archive-thread`&&e.id!==`archive-task`);if(i.length<2)return t;"
  ],
  [
    "let O=D?IHc(e,g,_):{id:`archive-thread`,onSelect:i}",
    "let O=MTKsidebarArchiveProtected(g)?null:D?IHc(e,g,_):{id:`archive-thread`,onSelect:i}"
  ],
  ["let I=[],L=[],R=E?[]:[O]", "let I=[],L=[],R=E||O==null?[]:[O]"],
  [
    "archive:t!=null&&(ht||Ee)?xt:t,getMenuItems:",
    "archive:MTKsidebarArchiveProtected(r)?null:t!=null&&(ht||Ee)?xt:t,getMenuItems:"
  ],
  ["yt=Re?qe:null", "yt=Re&&!MTKsidebarArchiveProtected(Se)?qe:null"],
  [
    "if(Re&&e.push({id:`archive-task`",
    "if(Re&&!MTKsidebarArchiveProtected(Se)&&e.push({id:`archive-task`"
  ],
  [
    "archive:n,getMenuItems:he?e=>f([",
    "archive:MTKsidebarArchiveProtected(e.task.id)?null:n,getMenuItems:he&&!MTKsidebarArchiveProtected(e.task.id)?e=>f(["
  ]
];

const archiveRuntimeReplacements = [
  [
    "function bKc({scope:e,",
    "function MTKuseSidebarArchivePolicy(){return jr().useSyncExternalStore(MTKsidebarArchiveSubscribe,MTKsidebarArchiveSnapshot,MTKsidebarArchiveSnapshot)}function bKc({scope:e,"
  ],
  [
    "function bqc(e){let t=(0,Sqc.c)(194),",
    "function bqc(e){let MTKsidebarArchiveEpoch=MTKuseSidebarArchivePolicy();let t=(0,Sqc.c)(195),MTKsidebarArchiveCache=t[194]!==MTKsidebarArchiveEpoch&&(t.fill(Symbol.for(`react.memo_cache_sentinel`)),t[194]=MTKsidebarArchiveEpoch),"
  ],
  [
    "function Oqc(e){let t=(0,Aqc.c)(116),",
    "function Oqc(e){let MTKsidebarArchiveEpoch=MTKuseSidebarArchivePolicy();let t=(0,Aqc.c)(117),MTKsidebarArchiveCache=t[116]!==MTKsidebarArchiveEpoch&&(t.fill(Symbol.for(`react.memo_cache_sentinel`)),t[116]=MTKsidebarArchiveEpoch),"
  ],
  [
    "function rXc(e){let t=(0,dXc.c)(199),",
    "function rXc(e){let MTKsidebarArchiveEpoch=MTKuseSidebarArchivePolicy();let t=(0,dXc.c)(200),MTKsidebarArchiveCache=t[199]!==MTKsidebarArchiveEpoch&&(t.fill(Symbol.for(`react.memo_cache_sentinel`)),t[199]=MTKsidebarArchiveEpoch),"
  ]
];

const delegationReplacements = [
  ["function NS(e){let t=(0,PS.c)(14),", "function NS(e){let t=(0,PS.c)(16),"],
  [
    "t[5]!==l||t[6]!==n||t[7]!==o||t[8]!==s||t[9]!==i||t[10]!==a||t[11]!==m||t[13]!==p?(h=(0,FS.jsx)(ey,{conversationId:n,label:p,message:i,sentAtMs:a,cwd:o,hostId:s,compactActions:l,onLabelClick:m,alignment:`end`,accentColor:MTKdelegatedAccentColor}),t[5]=l,t[6]=n,t[7]=o,t[8]=s,t[9]=i,t[10]=a,t[11]=m,t[13]=p,t[12]=h):h=t[12]",
    "t[5]!==l||t[6]!==n||t[7]!==o||t[8]!==s||t[9]!==i||t[10]!==a||t[11]!==m||t[13]!==p||t[14]!==MTKtitle||t[15]!==r?(h=(0,FS.jsx)(ey,{conversationId:n,label:p,message:i,sentAtMs:a,cwd:o,hostId:s,compactActions:l,onLabelClick:m,alignment:`end`,accentColor:MTKdelegatedAccentColor,paletteSourceTitle:MTKtitle,paletteSourceId:r}),t[5]=l,t[6]=n,t[7]=o,t[8]=s,t[9]=i,t[10]=a,t[11]=m,t[13]=p,t[14]=MTKtitle,t[15]=r,t[12]=h):h=t[12]"
  ],
  ["function ey(e){let t=(0,ty.c)(21),", "function ey(e){let t=(0,ty.c)(23),"],
  [
    "onLabelClick:d}=e,f=r===void 0?`end`:r,",
    "onLabelClick:d,paletteSourceTitle:MTKsourceTitle,paletteSourceId:MTKsourceId}=e,f=r===void 0?`end`:r,"
  ],
  [
    "t[17]!==_||t[18]!==v||t[19]!==y?(b=(0,ny.jsxs)(`div`,{className:_,children:[v,y]}),t[17]=_,t[18]=v,t[19]=y,t[20]=b):b=t[20]",
    "t[17]!==_||t[18]!==v||t[19]!==y||t[21]!==MTKsourceTitle||t[22]!==MTKsourceId?(b=(0,ny.jsxs)(`div`,{\"data-mtk-palette-source-title\":MTKsourceTitle??void 0,\"data-mtk-palette-source-id\":MTKsourceId??void 0,className:_,children:[v,y]}),t[17]=_,t[18]=v,t[19]=y,t[21]=MTKsourceTitle,t[22]=MTKsourceId,t[20]=b):b=t[20]"
  ]
];

export const build21421 = {
  app: {
    name: "26.1016.61520-21421",
    pristineSeam: "function Dbu(){let e=(0,Abu.c)(12),t=E(J),",
    seam: "function Dbu(){MTKuseAgentRoster();let e=(0,Abu.c)(12),t=E(J),",
    patchedSeam: "function Dbu(){MTKuseAgentRoster();MTKusePaletteBootstrap();let e=(0,Abu.c)(12),t=E(J),",
    agentRoster: true,
    helperReplacements: [["QSl.useEffect", "jbu.useEffect"]]
  },
  local: {
    name: "26.1016.61520-21421",
    cacheBefore: "function ms(e){let n=(0,xs.c)(104),",
    cacheAfter: "function ms(e){let n=(0,xs.c)(106),",
    rootBefore: "n[88]!==V||n[89]!==me||n[90]!==he||n[91]!==ge||n[92]!==ve||n[93]!==be||n[94]!==xe||n[95]!==Se||n[96]!==Ce||n[97]!==we||n[98]!==Te||n[99]!==Ee?(De=(0,Q.jsxs)(`div`,{ref:V,className:`relative h-full min-h-0`,children:[me,he,ge,ve,be,xe,Se,Ce,we,Te,Ee]}),n[88]=V,n[89]=me,n[90]=he,n[91]=ge,n[92]=ve,n[93]=be,n[94]=xe,n[95]=Se,n[96]=Ce,n[97]=we,n[98]=Te,n[99]=Ee,n[100]=De):De=n[100];",
    rootAfter: "n[88]!==V||n[89]!==me||n[90]!==he||n[91]!==ge||n[92]!==ve||n[93]!==be||n[94]!==xe||n[95]!==Se||n[96]!==Ce||n[97]!==we||n[98]!==Te||n[99]!==Ee||n[104]!==i||n[105]!==f?(De=(0,Q.jsxs)(`div`,{ref:V,\"data-mtk-palette-room-host\":!0,\"data-mtk-palette-thread-id\":i??f,className:`relative h-full min-h-0`,children:[me,he,ge,ve,be,xe,Se,Ce,we,Te,Ee]}),n[88]=V,n[89]=me,n[90]=he,n[91]=ge,n[92]=ve,n[93]=be,n[94]=xe,n[95]=Se,n[96]=Ce,n[97]=we,n[98]=Te,n[99]=Ee,n[104]=i,n[105]=f,n[100]=De):De=n[100];"
  },
  bottomFade: {
    file: "app-initial",
    before: '(0,Hbi.jsx)(`div`,{"aria-hidden":!0,className:s})',
    after: '(0,Hbi.jsx)(`div`,{"aria-hidden":!0,"data-mtk-palette-bottom-fade":!0,className:s})'
  },
  delegation: {
    owner: "function NS(e){let t=(0,PS.c)(14),",
    replacements: delegationReplacements
  },
  archive: {
    pristine: archiveBehaviorReplacements.map(([before]) => before),
    applied: archiveBehaviorReplacements.map(([, after]) => after),
    replacements: archiveBehaviorReplacements,
    runtimePristine: archiveRuntimeReplacements.map(([before]) => before),
    runtimeApplied: archiveRuntimeReplacements.map(([, after]) => after),
    runtimeReplacements: archiveRuntimeReplacements
  }
};

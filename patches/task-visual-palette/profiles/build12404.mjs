const archiveBehaviorReplacements = [
  [
    "function oho({items:e,onArchive:t,onSelect:n,selectedThreadKeys:r,threadKey:i}){return r.length<2?e:",
    "function oho({items:e,onArchive:t,onSelect:n,selectedThreadKeys:r,threadKey:i,archiveProtected:a}){return a&&(e=e.filter(e=>e.id!==`archive-thread`&&e.id!==`archive-task`)),r.length<2?e:"
  ],
  [
    "let O=D?Jxo(e,g,_):{id:`archive-thread`,onSelect:i}",
    "let O=MTKsidebarArchiveProtected(g)?null:D?Jxo(e,g,_):{id:`archive-thread`,onSelect:i}"
  ],
  ["let I=[],L=[],R=E?[]:[O]", "let I=[],L=[],R=E||O==null?[]:[O]"],
  [
    "selectedThreadKeys:xwo(E,r),threadKey:r})",
    "selectedThreadKeys:xwo(E,r),threadKey:r,archiveProtected:xwo(E,r).some(e=>{let t=E.get(GO,e);return MTKsidebarArchiveProtected(t?.kind===`local`?t.conversationId:t?.kind===`remote`?t.task.id:null)})})"
  ],
  [
    "selectedThreadKeys:xwo(ne,e),threadKey:e})",
    "selectedThreadKeys:xwo(ne,e),threadKey:e,archiveProtected:xwo(ne,e).some(e=>{let t=ne.get(GO,e);return MTKsidebarArchiveProtected(t?.kind===`local`?t.conversationId:t?.kind===`remote`?t.task.id:null)})})"
  ],
  [
    "archive:t!=null&&(at||he)?dt:t,getMenuItems:",
    "archive:MTKsidebarArchiveProtected(n)?null:t!=null&&(at||he)?dt:t,getMenuItems:"
  ],
  ["lt=je?Ve:null", "lt=je&&!MTKsidebarArchiveProtected(he)?Ve:null"],
  [
    "if(je&&e.push({id:`archive-task`",
    "if(je&&!MTKsidebarArchiveProtected(he)&&e.push({id:`archive-task`"
  ],
  [
    "archive:n,getMenuItems:se?e=>u([",
    "archive:MTKsidebarArchiveProtected(e.task.id)?null:n,getMenuItems:se&&!MTKsidebarArchiveProtected(e.task.id)?e=>u(["
  ]
];

const archiveRuntimeReplacements = [
  [
    "function oho({items:e,",
    "function MTKuseSidebarArchivePolicy(){return Vh().useSyncExternalStore(MTKsidebarArchiveSubscribe,MTKsidebarArchiveSnapshot,MTKsidebarArchiveSnapshot)}function oho({items:e,"
  ],
  [
    "function zmo(e){let t=(0,Vmo.c)(112),",
    "function zmo(e){let MTKsidebarArchiveEpoch=MTKuseSidebarArchivePolicy();let t=(0,Vmo.c)(113),MTKsidebarArchiveCache=t[112]!==MTKsidebarArchiveEpoch&&(t.fill(Symbol.for(`react.memo_cache_sentinel`)),t[112]=MTKsidebarArchiveEpoch),"
  ],
  [
    "function rTo(e){let t=(0,aTo.c)(185),",
    "function rTo(e){let MTKsidebarArchiveEpoch=MTKuseSidebarArchivePolicy();let t=(0,aTo.c)(186),MTKsidebarArchiveCache=t[185]!==MTKsidebarArchiveEpoch&&(t.fill(Symbol.for(`react.memo_cache_sentinel`)),t[185]=MTKsidebarArchiveEpoch),"
  ],
  [
    "function wTo(e){let t=(0,MTo.c)(182),",
    "function wTo(e){let MTKsidebarArchiveEpoch=MTKuseSidebarArchivePolicy();let t=(0,MTo.c)(183),MTKsidebarArchiveCache=t[182]!==MTKsidebarArchiveEpoch&&(t.fill(Symbol.for(`react.memo_cache_sentinel`)),t[182]=MTKsidebarArchiveEpoch),"
  ]
];

const delegationReplacements = [
  ["function Lx(e){let t=(0,Rx.c)(14),", "function Lx(e){let t=(0,Rx.c)(16),"],
  [
    "t[5]!==l||t[6]!==n||t[7]!==o||t[8]!==s||t[9]!==i||t[10]!==a||t[11]!==m||t[13]!==p?(h=(0,zx.jsx)(bv,{conversationId:n,label:p,message:i,sentAtMs:a,cwd:o,hostId:s,compactActions:l,onLabelClick:m,alignment:`end`,accentColor:MTKdelegatedAccentColor}),t[5]=l,t[6]=n,t[7]=o,t[8]=s,t[9]=i,t[10]=a,t[11]=m,t[13]=p,t[12]=h):h=t[12]",
    "t[5]!==l||t[6]!==n||t[7]!==o||t[8]!==s||t[9]!==i||t[10]!==a||t[11]!==m||t[13]!==p||t[14]!==MTKtitle||t[15]!==r?(h=(0,zx.jsx)(bv,{conversationId:n,label:p,message:i,sentAtMs:a,cwd:o,hostId:s,compactActions:l,onLabelClick:m,alignment:`end`,accentColor:MTKdelegatedAccentColor,paletteSourceTitle:MTKtitle,paletteSourceId:r}),t[5]=l,t[6]=n,t[7]=o,t[8]=s,t[9]=i,t[10]=a,t[11]=m,t[13]=p,t[14]=MTKtitle,t[15]=r,t[12]=h):h=t[12]"
  ],
  ["function bv(e){let t=(0,xv.c)(21),", "function bv(e){let t=(0,xv.c)(23),"],
  [
    "onLabelClick:d}=e,f=r===void 0?`end`:r,",
    "onLabelClick:d,paletteSourceTitle:MTKsourceTitle,paletteSourceId:MTKsourceId}=e,f=r===void 0?`end`:r,"
  ],
  [
    "t[17]!==_||t[18]!==v||t[19]!==y?(b=(0,Sv.jsxs)(`div`,{className:_,children:[v,y]}),t[17]=_,t[18]=v,t[19]=y,t[20]=b):b=t[20]",
    "t[17]!==_||t[18]!==v||t[19]!==y||t[21]!==MTKsourceTitle||t[22]!==MTKsourceId?(b=(0,Sv.jsxs)(`div`,{\"data-mtk-palette-source-title\":MTKsourceTitle??void 0,\"data-mtk-palette-source-id\":MTKsourceId??void 0,className:_,children:[v,y]}),t[17]=_,t[18]=v,t[19]=y,t[21]=MTKsourceTitle,t[22]=MTKsourceId,t[20]=b):b=t[20]"
  ]
];

export const build12404 = {
  app: {
    name: "26.928.21956-12404",
    pristineSeam: "function O5s(){let e=(0,j5s.c)(12),t=Fe(Z),",
    seam: "function O5s(){MTKuseAgentRoster();let e=(0,j5s.c)(12),t=Fe(Z),",
    patchedSeam: "function O5s(){MTKuseAgentRoster();MTKusePaletteBootstrap();let e=(0,j5s.c)(12),t=Fe(Z),",
    agentRoster: true,
    helperReplacements: [["QSl.useEffect", "M5s.useEffect"]]
  },
  local: {
    name: "26.928.21956-12404",
    cacheBefore: "function cc(e){let t=(0,hc.c)(115),",
    cacheAfter: "function cc(e){let t=(0,hc.c)(116),",
    rootBefore: 't[97]!==G||t[98]!==xe||t[99]!==Se||t[100]!==Ce||t[101]!==Te||t[102]!==Y||t[103]!==Ee||t[104]!==Oe||t[105]!==ke||t[106]!==X||t[107]!==Ae||t[108]!==je||t[109]!==Me||t[110]!==Ne?(Fe=(0,Q.jsxs)(`div`,{ref:G,className:`relative h-full min-h-0`,children:[xe,Se,Ce,Te,Y,Ee,Oe,ke,X,Ae,je,Me,Ne]}),t[97]=G,t[98]=xe,t[99]=Se,t[100]=Ce,t[101]=Te,t[102]=Y,t[103]=Ee,t[104]=Oe,t[105]=ke,t[106]=X,t[107]=Ae,t[108]=je,t[109]=Me,t[110]=Ne,t[111]=Fe):Fe=t[111];',
    rootAfter: 't[97]!==G||t[98]!==xe||t[99]!==Se||t[100]!==Ce||t[101]!==Te||t[102]!==Y||t[103]!==Ee||t[104]!==Oe||t[105]!==ke||t[106]!==X||t[107]!==Ae||t[108]!==je||t[109]!==Me||t[110]!==Ne||t[115]!==r||t[116]!==f?(Fe=(0,Q.jsxs)(`div`,{ref:G,"data-mtk-palette-room-host":!0,"data-mtk-palette-thread-id":r??f,className:`relative h-full min-h-0`,children:[xe,Se,Ce,Te,Y,Ee,Oe,ke,X,Ae,je,Me,Ne]}),t[97]=G,t[98]=xe,t[99]=Se,t[100]=Ce,t[101]=Te,t[102]=Y,t[103]=Ee,t[104]=Oe,t[105]=ke,t[106]=X,t[107]=Ae,t[108]=je,t[109]=Me,t[110]=Ne,t[115]=r,t[116]=f,t[111]=Fe):Fe=t[111];'
  },
  bottomFade: {
    file: "app-initial",
    before: '(0,$Sr.jsx)(`div`,{"aria-hidden":!0,className:i})',
    after: '(0,$Sr.jsx)(`div`,{"aria-hidden":!0,"data-mtk-palette-bottom-fade":!0,className:i})'
  },
  delegation: {
    owner: "function Lx(e){let t=(0,Rx.c)(14),",
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

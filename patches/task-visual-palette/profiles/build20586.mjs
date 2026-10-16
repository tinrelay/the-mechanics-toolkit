const archiveBehaviorReplacements = [
  [
    "function QLc({scope:e,items:t,onArchive:n,onSelect:r,selectedThreadKeys:i,threadKey:a}){if(i.length<2)return t;",
    "function QLc({scope:e,items:t,onArchive:n,onSelect:r,selectedThreadKeys:i,threadKey:a}){if(i.some(t=>{let n=e.get(QB,t);return MTKsidebarArchiveProtected(n?.kind===`local`?n.conversationId:n?.kind===`remote`?n.task.id:null)}))t=t.filter(e=>e.id!==`archive-thread`&&e.id!==`archive-task`);if(i.length<2)return t;"
  ],
  [
    "let O=D?PPc(e,g,_):{id:`archive-thread`,onSelect:i}",
    "let O=MTKsidebarArchiveProtected(g)?null:D?PPc(e,g,_):{id:`archive-thread`,onSelect:i}"
  ],
  ["let I=[],L=[],R=E?[]:[O]", "let I=[],L=[],R=E||O==null?[]:[O]"],
  [
    "archive:t!=null&&(mt||Te)?bt:t,getMenuItems:",
    "archive:MTKsidebarArchiveProtected(r)?null:t!=null&&(mt||Te)?bt:t,getMenuItems:"
  ],
  ["yt=Le?Ke:null", "yt=Le&&!MTKsidebarArchiveProtected(xe)?Ke:null"],
  [
    "if(Le&&e.push({id:`archive-task`",
    "if(Le&&!MTKsidebarArchiveProtected(xe)&&e.push({id:`archive-task`"
  ],
  [
    "archive:n,getMenuItems:me?e=>f([",
    "archive:MTKsidebarArchiveProtected(e.task.id)?null:n,getMenuItems:me&&!MTKsidebarArchiveProtected(e.task.id)?e=>f(["
  ]
];

const archiveRuntimeReplacements = [
  [
    "function QLc({scope:e,",
    "function MTKuseSidebarArchivePolicy(){return yu().useSyncExternalStore(MTKsidebarArchiveSubscribe,MTKsidebarArchiveSnapshot,MTKsidebarArchiveSnapshot)}function QLc({scope:e,"
  ],
  [
    "function nzc(e){let t=(0,izc.c)(194),",
    "function nzc(e){let MTKsidebarArchiveEpoch=MTKuseSidebarArchivePolicy();let t=(0,izc.c)(195),MTKsidebarArchiveCache=t[194]!==MTKsidebarArchiveEpoch&&(t.fill(Symbol.for(`react.memo_cache_sentinel`)),t[194]=MTKsidebarArchiveEpoch),"
  ],
  [
    "function uzc(e){let t=(0,fzc.c)(119),",
    "function uzc(e){let MTKsidebarArchiveEpoch=MTKuseSidebarArchivePolicy();let t=(0,fzc.c)(120),MTKsidebarArchiveCache=t[119]!==MTKsidebarArchiveEpoch&&(t.fill(Symbol.for(`react.memo_cache_sentinel`)),t[119]=MTKsidebarArchiveEpoch),"
  ],
  [
    "function zVc(e){let t=(0,qVc.c)(199),",
    "function zVc(e){let MTKsidebarArchiveEpoch=MTKuseSidebarArchivePolicy();let t=(0,qVc.c)(200),MTKsidebarArchiveCache=t[199]!==MTKsidebarArchiveEpoch&&(t.fill(Symbol.for(`react.memo_cache_sentinel`)),t[199]=MTKsidebarArchiveEpoch),"
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

export const build20586 = {
  app: {
    name: "26.1013.31256-20586",
    pristineSeam: "function Suu(){let e=(0,Tuu.c)(12),t=hi(U),",
    seam: "function Suu(){MTKuseAgentRoster();let e=(0,Tuu.c)(12),t=hi(U),",
    patchedSeam: "function Suu(){MTKuseAgentRoster();MTKusePaletteBootstrap();let e=(0,Tuu.c)(12),t=hi(U),",
    agentRoster: true,
    helperReplacements: [["QSl.useEffect", "Euu.useEffect"]]
  },
  local: {
    name: "26.1013.31256-20586",
    cacheBefore: "function ys(e){let t=(0,Es.c)(114),",
    cacheAfter: "function ys(e){let t=(0,Es.c)(116),",
    rootBefore: "t[96]!==z||t[97]!==me||t[98]!==_e||t[99]!==ye||t[100]!==xe||t[101]!==Se||t[102]!==Ce||t[103]!==we||t[104]!==Te||t[105]!==Oe||t[106]!==ke||t[107]!==Ae||t[108]!==je||t[109]!==Me?(Ne=(0,Q.jsxs)(`div`,{ref:z,className:`relative h-full min-h-0`,children:[me,_e,ye,xe,Se,Ce,we,Te,Oe,ke,Ae,je,Me]}),t[96]=z,t[97]=me,t[98]=_e,t[99]=ye,t[100]=xe,t[101]=Se,t[102]=Ce,t[103]=we,t[104]=Te,t[105]=Oe,t[106]=ke,t[107]=Ae,t[108]=je,t[109]=Me,t[110]=Ne):Ne=t[110];",
    rootAfter: "t[96]!==z||t[97]!==me||t[98]!==_e||t[99]!==ye||t[100]!==xe||t[101]!==Se||t[102]!==Ce||t[103]!==we||t[104]!==Te||t[105]!==Oe||t[106]!==ke||t[107]!==Ae||t[108]!==je||t[109]!==Me||t[114]!==r||t[115]!==u?(Ne=(0,Q.jsxs)(`div`,{ref:z,\"data-mtk-palette-room-host\":!0,\"data-mtk-palette-thread-id\":r??u,className:`relative h-full min-h-0`,children:[me,_e,ye,xe,Se,Ce,we,Te,Oe,ke,Ae,je,Me]}),t[96]=z,t[97]=me,t[98]=_e,t[99]=ye,t[100]=xe,t[101]=Se,t[102]=Ce,t[103]=we,t[104]=Te,t[105]=Oe,t[106]=ke,t[107]=Ae,t[108]=je,t[109]=Me,t[114]=r,t[115]=u,t[110]=Ne):Ne=t[110];"
  },
  bottomFade: {
    file: "app-initial",
    before: '(0,o_i.jsx)(`div`,{"aria-hidden":!0,className:s})',
    after: '(0,o_i.jsx)(`div`,{"aria-hidden":!0,"data-mtk-palette-bottom-fade":!0,className:s})'
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

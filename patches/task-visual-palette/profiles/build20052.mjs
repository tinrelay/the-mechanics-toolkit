const archiveBehaviorReplacements = [
  [
    "function xXo({scope:e,items:t,onArchive:n,onSelect:r,selectedThreadKeys:i,threadKey:a}){if(i.length<2)return t;",
    "function xXo({scope:e,items:t,onArchive:n,onSelect:r,selectedThreadKeys:i,threadKey:a}){if(i.some(t=>{let n=e.get(wF,t);return MTKsidebarArchiveProtected(n?.kind===`local`?n.conversationId:n?.kind===`remote`?n.task.id:null)}))t=t.filter(e=>e.id!==`archive-thread`&&e.id!==`archive-task`);if(i.length<2)return t;"
  ],
  [
    "let O=D?Oqo(e,g,_):{id:`archive-thread`,onSelect:i}",
    "let O=MTKsidebarArchiveProtected(g)?null:D?Oqo(e,g,_):{id:`archive-thread`,onSelect:i}"
  ],
  ["let I=[],L=[],R=E?[]:[O]", "let I=[],L=[],R=E||O==null?[]:[O]"],
  [
    "archive:t!=null&&(mt||Te)?bt:t,getMenuItems:",
    "archive:MTKsidebarArchiveProtected(r)?null:t!=null&&(mt||Te)?bt:t,getMenuItems:"
  ],
  ["vt=Ie?Ge:null", "vt=Ie&&!MTKsidebarArchiveProtected(be)?Ge:null"],
  [
    "if(Ie&&e.push({id:`archive-task`",
    "if(Ie&&!MTKsidebarArchiveProtected(be)&&e.push({id:`archive-task`"
  ],
  [
    "archive:n,getMenuItems:fe?e=>f([",
    "archive:MTKsidebarArchiveProtected(e.task.id)?null:n,getMenuItems:fe&&!MTKsidebarArchiveProtected(e.task.id)?e=>f(["
  ]
];

const archiveRuntimeReplacements = [
  [
    "function xXo({scope:e,",
    "function MTKuseSidebarArchivePolicy(){return us().useSyncExternalStore(MTKsidebarArchiveSubscribe,MTKsidebarArchiveSnapshot,MTKsidebarArchiveSnapshot)}function xXo({scope:e,"
  ],
  [
    "function CZo(e){let t=(0,TZo.c)(194),",
    "function CZo(e){let MTKsidebarArchiveEpoch=MTKuseSidebarArchivePolicy();let t=(0,TZo.c)(195),MTKsidebarArchiveCache=t[194]!==MTKsidebarArchiveEpoch&&(t.fill(Symbol.for(`react.memo_cache_sentinel`)),t[194]=MTKsidebarArchiveEpoch),"
  ],
  [
    "function jZo(e){let t=(0,NZo.c)(118),",
    "function jZo(e){let MTKsidebarArchiveEpoch=MTKuseSidebarArchivePolicy();let t=(0,NZo.c)(119),MTKsidebarArchiveCache=t[118]!==MTKsidebarArchiveEpoch&&(t.fill(Symbol.for(`react.memo_cache_sentinel`)),t[118]=MTKsidebarArchiveEpoch),"
  ],
  [
    "function n1o(e){let t=(0,u1o.c)(197),",
    "function n1o(e){let MTKsidebarArchiveEpoch=MTKuseSidebarArchivePolicy();let t=(0,u1o.c)(198),MTKsidebarArchiveCache=t[197]!==MTKsidebarArchiveEpoch&&(t.fill(Symbol.for(`react.memo_cache_sentinel`)),t[197]=MTKsidebarArchiveEpoch),"
  ]
];

const delegationReplacements = [
  ["function _S(e){let t=(0,vS.c)(14),", "function _S(e){let t=(0,vS.c)(16),"],
  [
    "t[5]!==l||t[6]!==n||t[7]!==o||t[8]!==s||t[9]!==i||t[10]!==a||t[11]!==m||t[13]!==p?(h=(0,yS.jsx)(zv,{conversationId:n,label:p,message:i,sentAtMs:a,cwd:o,hostId:s,compactActions:l,onLabelClick:m,alignment:`end`,accentColor:MTKdelegatedAccentColor}),t[5]=l,t[6]=n,t[7]=o,t[8]=s,t[9]=i,t[10]=a,t[11]=m,t[13]=p,t[12]=h):h=t[12]",
    "t[5]!==l||t[6]!==n||t[7]!==o||t[8]!==s||t[9]!==i||t[10]!==a||t[11]!==m||t[13]!==p||t[14]!==MTKtitle||t[15]!==r?(h=(0,yS.jsx)(zv,{conversationId:n,label:p,message:i,sentAtMs:a,cwd:o,hostId:s,compactActions:l,onLabelClick:m,alignment:`end`,accentColor:MTKdelegatedAccentColor,paletteSourceTitle:MTKtitle,paletteSourceId:r}),t[5]=l,t[6]=n,t[7]=o,t[8]=s,t[9]=i,t[10]=a,t[11]=m,t[13]=p,t[14]=MTKtitle,t[15]=r,t[12]=h):h=t[12]"
  ],
  ["function zv(e){let t=(0,Bv.c)(21),", "function zv(e){let t=(0,Bv.c)(23),"],
  [
    "onLabelClick:d}=e,f=r===void 0?`end`:r,",
    "onLabelClick:d,paletteSourceTitle:MTKsourceTitle,paletteSourceId:MTKsourceId}=e,f=r===void 0?`end`:r,"
  ],
  [
    "t[17]!==_||t[18]!==v||t[19]!==y?(b=(0,Vv.jsxs)(`div`,{className:_,children:[v,y]}),t[17]=_,t[18]=v,t[19]=y,t[20]=b):b=t[20]",
    "t[17]!==_||t[18]!==v||t[19]!==y||t[21]!==MTKsourceTitle||t[22]!==MTKsourceId?(b=(0,Vv.jsxs)(`div`,{\"data-mtk-palette-source-title\":MTKsourceTitle??void 0,\"data-mtk-palette-source-id\":MTKsourceId??void 0,className:_,children:[v,y]}),t[17]=_,t[18]=v,t[19]=y,t[21]=MTKsourceTitle,t[22]=MTKsourceId,t[20]=b):b=t[20]"
  ]
];

export const build20052 = {
  app: {
    name: "26.1007.21159-20052",
    pristineSeam: "function Xhc(){let e=(0,$hc.c)(12),t=Di(q),",
    seam: "function Xhc(){MTKuseAgentRoster();let e=(0,$hc.c)(12),t=Di(q),",
    patchedSeam: "function Xhc(){MTKuseAgentRoster();MTKusePaletteBootstrap();let e=(0,$hc.c)(12),t=Di(q),",
    agentRoster: true,
    helperReplacements: [["QSl.useEffect", "egc.useEffect"]]
  },
  local: {
    name: "26.1007.21159-20052",
    cacheBefore: "function lc(e){let t=(0,gc.c)(114),",
    cacheAfter: "function lc(e){let t=(0,gc.c)(116),",
    rootBefore: "t[96]!==B||t[97]!==be||t[98]!==xe||t[99]!==Se||t[100]!==we||t[101]!==Te||t[102]!==Ee||t[103]!==De||t[104]!==Oe||t[105]!==ke||t[106]!==Ae||t[107]!==je||t[108]!==Me||t[109]!==Ne?(Pe=(0,Q.jsxs)(`div`,{ref:B,className:`relative h-full min-h-0`,children:[be,xe,Se,we,Te,Ee,De,Oe,ke,Ae,je,Me,Ne]}),t[96]=B,t[97]=be,t[98]=xe,t[99]=Se,t[100]=we,t[101]=Te,t[102]=Ee,t[103]=De,t[104]=Oe,t[105]=ke,t[106]=Ae,t[107]=je,t[108]=Me,t[109]=Ne,t[110]=Pe):Pe=t[110];",
    rootAfter: "t[96]!==B||t[97]!==be||t[98]!==xe||t[99]!==Se||t[100]!==we||t[101]!==Te||t[102]!==Ee||t[103]!==De||t[104]!==Oe||t[105]!==ke||t[106]!==Ae||t[107]!==je||t[108]!==Me||t[109]!==Ne||t[114]!==r||t[115]!==u?(Pe=(0,Q.jsxs)(`div`,{ref:B,\"data-mtk-palette-room-host\":!0,\"data-mtk-palette-thread-id\":r??u,className:`relative h-full min-h-0`,children:[be,xe,Se,we,Te,Ee,De,Oe,ke,Ae,je,Me,Ne]}),t[96]=B,t[97]=be,t[98]=xe,t[99]=Se,t[100]=we,t[101]=Te,t[102]=Ee,t[103]=De,t[104]=Oe,t[105]=ke,t[106]=Ae,t[107]=je,t[108]=Me,t[109]=Ne,t[114]=r,t[115]=u,t[110]=Pe):Pe=t[110];"
  },
  bottomFade: {
    file: "app-initial",
    before: '(0,cj.jsx)(`div`,{"aria-hidden":!0,className:i})',
    after: '(0,cj.jsx)(`div`,{"aria-hidden":!0,"data-mtk-palette-bottom-fade":!0,className:i})'
  },
  delegation: {
    owner: "function _S(e){let t=(0,vS.c)(14),",
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
